import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

const DEFAULT_TOUR_VIDEO = 'https://res.cloudinary.com/demo/video/upload/f_auto,q_auto/samples/cld-sample-video.mp4';

export default function FactoryVideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

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
      className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-black shadow-[0_25px_60px_-15px_rgba(20,50,20,0.35)] border border-leaf-900/30 sm:rounded-[2rem]"
    >
      {/* Video — nothing overlays the picture except a tiny badge & the paused play button */}
      <div className="relative bg-black">
        <video
          key={videoUrl}
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          className="aspect-video w-full cursor-pointer bg-black object-contain select-none"
        />

        {/* Small status badge (top-left, away from the action) */}
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md border border-white/15 sm:left-5 sm:top-5 sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf-400 animate-pulse sm:h-2 sm:w-2" />
          Pollachi Facility Tour
        </span>

        {/* Big play button only while paused */}
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Play video"
            className="absolute inset-0 grid place-items-center bg-black/30 transition"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-leaf-600 text-white shadow-2xl ring-4 ring-white/25 transition hover:scale-110 hover:bg-leaf-500 sm:h-20 sm:w-20 sm:ring-8">
              <Play fill="white" className="ml-0.5 h-6 w-6 sm:ml-1 sm:h-8 sm:w-8" />
            </span>
          </button>
        )}
      </div>

      {/* Control bar sits BELOW the video so it never hides any of the picture */}
      <div className="flex items-center gap-3 bg-leaf-950 px-3 py-2.5 text-white sm:gap-4 sm:px-5 sm:py-3">
        <button
          type="button"
          onClick={togglePlay}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 transition hover:bg-white/20"
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>

        {/* Progress */}
        <div
          onClick={handleSeek}
          className="group/seek relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/20 transition hover:h-2.5"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div className="h-full rounded-full bg-leaf-400 transition-[width] duration-150" style={{ width: `${progress}%` }} />
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 transition hover:bg-white/20"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 transition hover:bg-white/20"
          title="Fullscreen"
          aria-label="Fullscreen"
        >
          <Maximize2 size={15} />
        </button>
      </div>
    </div>
  );
}
