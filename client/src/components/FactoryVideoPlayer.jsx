import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';

const DEFAULT_TOUR_VIDEO = 'https://res.cloudinary.com/demo/video/upload/f_auto,q_auto/samples/cld-sample-video.mp4';

export default function FactoryVideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const videoUrl = src && src.trim() ? src : DEFAULT_TOUR_VIDEO;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = isMuted;
    v.defaultMuted = true;

    const playVideo = () => {
      const p = v.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true)).catch(() => {
          // Fallback: browser requires muted
          v.muted = true;
          setIsMuted(true);
          v.play().then(() => setIsPlaying(true)).catch(() => { });
        });
      }
    };

    playVideo();

    // Pause when out of view, resume when scrolled back
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playVideo();
        } else {
          v.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(v);
    return () => observer.disconnect();
  }, [videoUrl]);

  const togglePlay = (e) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => { });
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setIsMuted(next);
  };

  const toggleFullscreen = (e) => {
    e?.stopPropagation();
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) {
      c.requestFullscreen?.().catch(() => { });
    } else {
      document.exitFullscreen?.().catch(() => { });
    }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * v.duration;
    v.currentTime = newTime;
  };

  return (
    <div
      ref={containerRef}
      onClick={togglePlay}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="group relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-shell-950 shadow-[0_25px_60px_-15px_rgba(20,50,20,0.35)] border border-leaf-900/30 cursor-pointer"
    >
      {/* 16:9 Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        className="aspect-[16/9] w-full object-cover transition duration-700 select-none"
      />

      {/* Ambient Gradient Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* Top Left Status Badge */}
      <div className="absolute left-6 top-6 flex items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-black/50 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/15 shadow-lg">
          <span className="h-2 w-2 rounded-full bg-leaf-400 animate-pulse" />
          Pollachi Facility Tour · 1080p HD
        </span>
      </div>

      {/* Center Big Play Icon (Visible when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-[2px] transition">
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Play video"
            className="grid h-20 w-20 place-items-center rounded-full bg-leaf-600 text-white shadow-2xl transition hover:scale-110 hover:bg-leaf-500 ring-8 ring-white/20"
          >
            <Play fill="white" size={32} className="ml-1" />
          </button>
        </div>
      )}

      {/* Bottom Floating Glass Control Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute inset-x-6 bottom-6 flex flex-col gap-2 rounded-2xl bg-black/60 p-4 text-white backdrop-blur-xl border border-white/15 shadow-2xl transition-all duration-300 ${showControls || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
      >
        {/* Progress Bar */}
        <div
          onClick={handleSeek}
          className="group/seek relative h-1.5 w-full cursor-pointer rounded-full bg-white/20 transition hover:h-2.5"
        >
          <div
            className="h-full rounded-full bg-leaf-400 transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition"
              title={isMuted ? 'Click to Unmute' : 'Click to Mute'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}

            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
              title="Fullscreen"
            >
              <Maximize2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
