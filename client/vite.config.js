import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_PORT = 5000;
const BACKEND_TARGET = `http://127.0.0.1:${BACKEND_PORT}`;

function isPortListening(port, host = '127.0.0.1', timeoutMs = 600) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    const done = (result) => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(result);
      }
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
    socket.connect(port, host);
  });
}

function autoStartBackendPlugin() {
  return {
    name: 'harwest-auto-start-backend',
    configureServer() {
      if (globalThis.__harwestBackendStarting || globalThis.__harwestBackendProc) return;
      globalThis.__harwestBackendStarting = true;

      isPortListening(BACKEND_PORT).then((running) => {
        if (running) {
          globalThis.__harwestBackendStarting = false;
          return;
        }
        const serverDir = path.resolve(__dirname, '../server');
        console.log(`\n🌱 [harwest] Auto-starting backend API server on ${BACKEND_TARGET}...`);
        const proc = spawn(process.execPath, ['--watch-path=src', 'src/index.js'], {
          cwd: serverDir,
          stdio: 'inherit',
          windowsHide: true,
        });
        globalThis.__harwestBackendProc = proc;
        proc.on('exit', () => {
          globalThis.__harwestBackendProc = null;
          globalThis.__harwestBackendStarting = false;
        });

        if (!globalThis.__harwestExitHookRegistered) {
          globalThis.__harwestExitHookRegistered = true;
          const cleanup = () => {
            if (globalThis.__harwestBackendProc) {
              try {
                globalThis.__harwestBackendProc.kill();
              } catch {}
              globalThis.__harwestBackendProc = null;
            }
          };
          process.once('exit', cleanup);
          process.once('SIGINT', () => {
            cleanup();
            process.exit(0);
          });
          process.once('SIGTERM', () => {
            cleanup();
            process.exit(0);
          });
        }
      });
    },
  };
}

function quietProxy(target) {
  return {
    target,
    changeOrigin: true,
    configure: (proxy) => {
      proxy.on('error', (_err, _req, res) => {
        if (res && !res.headersSent && typeof res.writeHead === 'function') {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Backend server is starting up, please retry in a moment.' }));
        }
      });
    },
  };
}

// In dev, /api and /uploads are proxied to the Node server so the admin
// cookie stays same-origin (required for SameSite=Strict cookies).
export default defineConfig({
  plugins: [react(), tailwindcss(), autoStartBackendPlugin()],
  server: {
    allowedHosts: ['.trycloudflare.com'],
    proxy: {
      '/api': quietProxy(BACKEND_TARGET),
      '/uploads': quietProxy(BACKEND_TARGET),
    },
  },
});
