import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Server, Globe } from 'lucide-react';
import { api } from '../lib/api';

export default function Health() {
  const [backendStatus, setBackendStatus] = useState({ loading: true, ok: false, data: null, error: null, pingMs: null });

  const checkBackend = async () => {
    setBackendStatus({ loading: true, ok: false, data: null, error: null, pingMs: null });
    const start = performance.now();
    try {
      const data = await api.health();
      const elapsed = Math.round(performance.now() - start);
      setBackendStatus({ loading: false, ok: true, data, error: null, pingMs: elapsed });
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setBackendStatus({ loading: false, ok: false, data: null, error: err.message, pingMs: elapsed });
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL || 'Local Proxy (/api)';

  return (
    <div className="min-h-[70vh] bg-shell-50 py-16 px-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-shell-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-shell-100 pb-6">
            <div>
              <span className="font-head text-xs uppercase tracking-widest text-leaf-700 font-bold">
                System Status
              </span>
              <h1 className="mt-1 text-2xl font-bold text-shell-900">Health Checkup</h1>
            </div>
            <button
              onClick={checkBackend}
              className="flex items-center gap-2 rounded-xl bg-shell-100 px-4 py-2 text-xs font-semibold text-shell-700 hover:bg-leaf-100 hover:text-leaf-800 transition"
            >
              <RefreshCw size={14} className={backendStatus.loading ? 'animate-spin' : ''} />
              Re-check
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {/* Frontend Service Card */}
            <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
                  <Globe size={20} />
                </span>
                <div>
                  <h3 className="font-head text-sm font-bold text-shell-900">Frontend Service (Client)</h3>
                  <p className="text-xs text-shell-500">React + Vite SPA is loaded and responding</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle2 size={14} /> OK
              </span>
            </div>

            {/* Backend Service Card */}
            <div className={`flex items-center justify-between rounded-2xl border p-4 ${
              backendStatus.loading
                ? 'border-shell-200 bg-shell-50'
                : backendStatus.ok
                ? 'border-emerald-200 bg-emerald-50/50'
                : 'border-red-200 bg-red-50/50'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl text-white ${
                  backendStatus.loading
                    ? 'bg-shell-400'
                    : backendStatus.ok
                    ? 'bg-leaf-600'
                    : 'bg-red-500'
                }`}>
                  <Server size={20} />
                </span>
                <div>
                  <h3 className="font-head text-sm font-bold text-shell-900">Backend API (Server)</h3>
                  <p className="text-xs text-shell-500">Target: {apiUrl}</p>
                </div>
              </div>

              <div>
                {backendStatus.loading ? (
                  <span className="text-xs text-shell-400">Pinging...</span>
                ) : backendStatus.ok ? (
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      <CheckCircle2 size={14} /> {backendStatus.pingMs}ms
                    </span>
                    <p className="mt-1 text-[11px] text-emerald-700 font-medium">
                      DB: {backendStatus.data?.database || 'connected'}
                    </p>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                      <XCircle size={14} /> Offline
                    </span>
                    <p className="mt-1 text-[10px] text-red-600 max-w-[160px] truncate" title={backendStatus.error}>
                      {backendStatus.error}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick ping endpoints info */}
          <div className="mt-8 rounded-2xl bg-shell-100/60 p-4 text-xs text-shell-600">
            <p className="font-bold text-shell-800 mb-2">Automated Uptime Ping Routes:</p>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li><strong className="text-shell-700">Frontend:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-shell-200">/health.json</code> or <code className="bg-white px-1.5 py-0.5 rounded border border-shell-200">/health</code></li>
              <li><strong className="text-shell-700">Backend:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-shell-200">/health</code> or <code className="bg-white px-1.5 py-0.5 rounded border border-shell-200">/api/health</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

