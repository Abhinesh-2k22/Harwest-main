/**
 * Coconut-palm sprout loader. The sprout "grows" as `progress` (0-100) increases.
 * Pass progress={null} for an indeterminate gently-swaying sprout.
 */
export default function GrowLoader({ progress = null, label = 'Uploading…', overlay = true }) {
  const known = typeof progress === 'number';
  const p = known ? Math.min(100, Math.max(0, progress)) : 60;
  const grow = 0.25 + (p / 100) * 0.75; // stem + leaf scale
  const processing = known && p >= 100;

  const body = (
    <div className="flex w-56 flex-col items-center gap-3 rounded-3xl bg-white/95 p-5 shadow-2xl ring-1 ring-leaf-200">
      <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden="true">
        {/* soil mound */}
        <ellipse cx="60" cy="104" rx="38" ry="8" fill="#6b4a2b" opacity=".9" />
        {/* coconut */}
        <circle cx="60" cy="92" r="15" fill="#7a4e2a" />
        <circle cx="55" cy="88" r="2.2" fill="#3b2412" />
        <circle cx="63" cy="88" r="2.2" fill="#3b2412" />
        <circle cx="59" cy="94" r="2.2" fill="#3b2412" />
        {/* sprout */}
        <g
          style={{
            transformOrigin: '60px 80px',
            transform: `scale(${grow})`,
            transition: 'transform .5s ease-out',
          }}
        >
          <g className={known ? '' : 'animate-pulse'}>
            <path d="M60 80 C58 60 60 40 60 28" stroke="#3f8f3a" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M60 36 C42 30 28 36 20 50 C38 50 52 46 60 36Z" fill="#4fae48" />
            <path d="M60 36 C78 30 92 36 100 50 C82 50 68 46 60 36Z" fill="#3f9a3b" />
            <path d="M60 52 C46 48 36 54 30 66 C44 64 55 60 60 52Z" fill="#6cc45f" />
            <path d="M60 52 C74 48 84 54 90 66 C76 64 65 60 60 52Z" fill="#58b44e" />
          </g>
        </g>
      </svg>

      <div className="h-2 w-full overflow-hidden rounded-full bg-leaf-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-leaf-500 to-coconut-400 ${known ? '' : 'animate-pulse'}`}
          style={{ width: `${p}%`, transition: 'width .3s ease-out' }}
        />
      </div>
      <p className="text-center text-xs font-semibold text-shell-800">
        {processing ? 'Saving to cloud…' : label}
        {known && !processing && <span className="ml-1 text-leaf-700">{p}%</span>}
      </p>
    </div>
  );

  if (!overlay) return body;
  return (
    <div className="absolute inset-0 z-20 grid place-items-center rounded-2xl bg-white/70 backdrop-blur-[2px]" role="status" aria-live="polite">
      {body}
    </div>
  );
}
