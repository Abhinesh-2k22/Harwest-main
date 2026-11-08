import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  RefreshCw,
  Check,
  X,
  Move,
  Sparkles,
} from 'lucide-react';

const ASPECT_PRESETS = [
  { id: 'logo', label: 'Logo Rectangle (3.2 : 1)', ratio: 3.2, outW: 640, outH: 200 },
  { id: '16:9', label: 'Widescreen (16 : 9)', ratio: 16 / 9, outW: 1280, outH: 720 },
  { id: '4:3', label: 'Product / Card (4 : 3)', ratio: 4 / 3, outW: 1200, outH: 900 },
  { id: '1:1', label: 'Square (1 : 1)', ratio: 1, outW: 900, outH: 900 },
  { id: 'free', label: 'Original Ratio', ratio: null, outW: null, outH: null },
];

/**
 * Interactive Image Crop & Live Preview Modal for Admin uploads.
 * Supports:
 * - Drag-to-pan directly on the canvas + fine X/Y sliders
 * - Smooth Zoom (0.5x – 4x) + mouse wheel zoom
 * - 90° rotation + fine tilt (-45° to +45°)
 * - Aspect Ratio presets (defaults to 3.2:1 Horizontal Rectangle for `branding.logo`)
 * - Live real-time preview (including a simulated dark-green Website Navbar preview for the Logo!)
 */
export default function ImageCropModal({
  open,
  fileOrUrl,
  title = 'Crop & Preview Image',
  defaultPreset = '4:3',
  isLogo = false,
  onCancel,
  onComplete,
}) {
  const [imgEl, setImgEl] = useState(null);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [loadError, setLoadError] = useState('');
  const [presetId, setPresetId] = useState(isLogo ? 'logo' : defaultPreset);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 }); // Normalized offset in output pixels
  const [rotation, setRotation] = useState(0);
  const [fitMode, setFitMode] = useState(isLogo ? 'contain' : 'cover'); // 'cover' | 'contain'
  const [bgColor, setBgColor] = useState(isLogo ? 'transparent' : '#092618');
  const [removeWhiteBg, setRemoveWhiteBg] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [exporting, setExporting] = useState(false);

  const workCanvasRef = useRef(null);

  // Sync default preset when opened
  useEffect(() => {
    if (open) {
      setPresetId(isLogo ? 'logo' : defaultPreset || '4:3');
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      setFitMode(isLogo ? 'contain' : 'cover');
      setBgColor(isLogo ? 'transparent' : '#092618');
      setRemoveWhiteBg(false);
      setLoadError('');
    }
  }, [open, isLogo, defaultPreset, fileOrUrl]);

  // Load image from File or URL
  useEffect(() => {
    if (!open || !fileOrUrl) return;
    let objectUrl = null;
    let cancelled = false;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (cancelled) return;
      setNaturalSize({ w: img.naturalWidth || 800, h: img.naturalHeight || 600 });
      setImgEl(img);
      setLoadError('');
    };

    img.onerror = () => {
      if (cancelled) return;
      setLoadError(
        'Could not load this image for cropping (remote URL may block cross-origin canvas access). Please choose a file from your device.'
      );
      setImgEl(null);
    };

    if (typeof fileOrUrl === 'string') {
      img.src = fileOrUrl;
    } else if (fileOrUrl instanceof Blob) {
      objectUrl = URL.createObjectURL(fileOrUrl);
      img.src = objectUrl;
    }

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, fileOrUrl]);

  // Compute target output dimensions
  const getOutputDimensions = useCallback(() => {
    const preset = ASPECT_PRESETS.find((p) => p.id === presetId) || ASPECT_PRESETS[2];
    if (!preset.ratio || preset.id === 'free') {
      const w = Math.min(1400, Math.max(400, naturalSize.w || 800));
      const h = Math.round(w * ((naturalSize.h || 600) / (naturalSize.w || 800)));
      return { outW: w, outH: h, ratio: w / h };
    }
    return {
      outW: preset.outW,
      outH: preset.outH,
      ratio: preset.ratio,
    };
  }, [presetId, naturalSize]);

  // Render image onto canvas and update live preview
  const renderToCanvas = useCallback(() => {
    const canvas = workCanvasRef.current;
    if (!canvas || !imgEl) return;

    const { outW, outH } = getOutputDimensions();
    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, outW, outH);

    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, outW, outH);
    }

    const iw = imgEl.naturalWidth || 1;
    const ih = imgEl.naturalHeight || 1;

    // Base scale so image either covers or fits inside (outW x outH)
    const baseScale =
      fitMode === 'contain'
        ? Math.min(outW / iw, outH / ih)
        : Math.max(outW / iw, outH / ih);

    const finalScale = baseScale * zoom;

    ctx.save();
    ctx.translate(outW / 2 + pan.x, outH / 2 + pan.y);
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }
    ctx.scale(finalScale, finalScale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imgEl, -iw / 2, -ih / 2, iw, ih);
    ctx.restore();

    // If Remove White Background is active and background is transparent, convert near-white pixels to transparent
    if (removeWhiteBg && bgColor === 'transparent') {
      try {
        const imgData = ctx.getImageData(0, 0, outW, outH);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Detect near white (e.g. RGB all above 225)
          if (r > 220 && g > 220 && b > 220) {
            const minV = Math.min(r, g, b);
            if (minV > 240) {
              data[i + 3] = 0;
            } else {
              data[i + 3] = Math.round(data[i + 3] * ((240 - minV) / 20));
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } catch {
        // Ignore if canvas is tainted by cross-origin
      }
    }

    try {
      setPreviewDataUrl(canvas.toDataURL('image/png'));
    } catch {
      // Ignore if tainted canvas
    }
  }, [imgEl, getOutputDimensions, bgColor, fitMode, zoom, pan, rotation, removeWhiteBg]);

  useEffect(() => {
    renderToCanvas();
  }, [renderToCanvas]);

  if (!open) return null;

  const { outW, outH } = getOutputDimensions();

  // Pointer drag handlers on the interactive canvas
  const handlePointerDown = (e) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragging(true);
    setDragStart({ x: clientX, y: clientY, panX: pan.x, panY: pan.y });
  };

  const handlePointerMove = (e) => {
    if (!dragging || !workCanvasRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = workCanvasRef.current.getBoundingClientRect();
    const scaleX = outW / Math.max(1, rect.width);
    const scaleY = outH / Math.max(1, rect.height);

    const dx = (clientX - dragStart.x) * scaleX;
    const dy = (clientY - dragStart.y) * scaleY;
    setPan({
      x: Math.round(dragStart.panX + dx),
      y: Math.round(dragStart.panY + dy),
    });
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((z) => Math.min(4, Math.max(0.4, Number((z + delta).toFixed(2)))));
  };

  const handleResetAdjustments = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setFitMode('cover');
  };

  const handleConfirmCrop = () => {
    const canvas = workCanvasRef.current;
    if (!canvas) return;
    setExporting(true);
    const mimeType = bgColor === 'transparent' ? 'image/png' : 'image/jpeg';
    const ext = mimeType === 'image/png' ? 'png' : 'jpg';
    const baseName =
      fileOrUrl instanceof File
        ? fileOrUrl.name.replace(/\.[^.]+$/, '')
        : isLogo
        ? 'harwest-logo'
        : 'harwest-image';

    canvas.toBlob(
      (blob) => {
        setExporting(false);
        if (!blob) {
          alert('Could not generate cropped image.');
          return;
        }
        const croppedFile = new File([blob], `${baseName}-cropped.${ext}`, {
          type: mimeType,
        });
        onComplete(croppedFile);
      },
      mimeType,
      0.94
    );
  };

  const handleSkipCrop = () => {
    if (fileOrUrl instanceof File) {
      onComplete(fileOrUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-3 sm:p-5 backdrop-blur-md">
      <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-shell-200 bg-white shadow-2xl">
        {/* Top Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-shell-200 bg-shell-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-leaf-700 text-white shadow-xs">
              <Crop size={18} />
            </div>
            <div>
              <h3 className="font-head text-lg font-bold text-shell-900">{title}</h3>
              <p className="text-xs text-shell-500">
                Drag image to position · Scroll or use slider to zoom · Check live preview before uploading
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-1.5 text-shell-500 transition hover:bg-shell-200 hover:text-shell-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Body */}
        <div className="grid flex-1 gap-6 overflow-y-auto p-5 sm:p-6 lg:grid-cols-12">
          {/* Left Column (7 cols): Interactive Crop Workspace */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Aspect Ratio Selector Pills */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-shell-600 mb-2">
                1. Choose Crop Shape / Aspect Ratio
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ASPECT_PRESETS.map((p) => {
                  const active = presetId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPresetId(p.id);
                        setPan({ x: 0, y: 0 });
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        active
                          ? 'bg-leaf-700 text-white shadow-xs ring-2 ring-leaf-500/40'
                          : 'border border-shell-200 bg-white text-shell-700 hover:bg-shell-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Canvas Viewport */}
            <div className="relative flex min-h-[280px] sm:min-h-[340px] flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-leaf-300 bg-[#0d1f15] p-4 select-none">
              {loadError ? (
                <div className="max-w-md text-center text-xs text-amber-200 p-4">
                  {loadError}
                </div>
              ) : (
                <>
                  <div className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11px] font-semibold text-emerald-200 backdrop-blur-xs">
                    <Move size={12} /> Drag image to frame · Output: {outW} × {outH} px
                  </div>

                  <div
                    onMouseDown={handlePointerDown}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onMouseLeave={handlePointerUp}
                    onTouchStart={handlePointerDown}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={handlePointerUp}
                    onWheel={handleWheel}
                    className={`relative flex max-h-[300px] w-full items-center justify-center overflow-hidden ${
                      dragging ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                  >
                    <canvas
                      ref={workCanvasRef}
                      className="max-h-[280px] max-w-full rounded-lg shadow-2xl ring-2 ring-emerald-400/70"
                      style={{
                        backgroundImage:
                          'linear-gradient(45deg, #1a2e22 25%, transparent 25%), linear-gradient(-45deg, #1a2e22 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a2e22 75%), linear-gradient(-45deg, transparent 75%, #1a2e22 75%)',
                        backgroundSize: '16px 16px',
                        backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Sliders & Controls */}
            <div className="rounded-2xl border border-shell-200 bg-shell-50/70 p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Zoom Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-shell-700 mb-1">
                    <span className="flex items-center gap-1">
                      <ZoomIn size={13} className="text-leaf-700" /> Zoom ({Math.round(zoom * 100)}%)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
                        className="rounded bg-white px-1.5 py-0.5 text-xs border border-shell-200 hover:bg-shell-100"
                        title="Zoom Out"
                      >
                        <ZoomOut size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoom((z) => Math.min(4, Number((z + 0.1).toFixed(2))))}
                        className="rounded bg-white px-1.5 py-0.5 text-xs border border-shell-200 hover:bg-shell-100"
                        title="Zoom In"
                      >
                        <ZoomIn size={12} />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="4"
                    step="0.02"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-leaf-600 cursor-pointer"
                  />
                </div>

                {/* Rotation Control */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-shell-700 mb-1">
                    <span>Rotation ({rotation}°)</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setRotation((r) => (r - 90) % 360)}
                        className="inline-flex items-center gap-0.5 rounded bg-white px-2 py-0.5 text-[11px] border border-shell-200 hover:bg-shell-100"
                        title="Rotate -90°"
                      >
                        <RotateCcw size={11} /> -90°
                      </button>
                      <button
                        type="button"
                        onClick={() => setRotation((r) => (r + 90) % 360)}
                        className="inline-flex items-center gap-0.5 rounded bg-white px-2 py-0.5 text-[11px] border border-shell-200 hover:bg-shell-100"
                        title="Rotate +90°"
                      >
                        <RotateCw size={11} /> +90°
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                    className="w-full accent-leaf-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Fit mode + Background Fill + Reset */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-shell-200/80">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-shell-500">
                    Fit Mode:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFitMode('cover');
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      fitMode === 'cover'
                        ? 'bg-leaf-700 text-white'
                        : 'bg-white text-shell-700 border border-shell-200'
                    }`}
                  >
                    Fill Frame (Crop Edges)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFitMode('contain');
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      fitMode === 'contain'
                        ? 'bg-leaf-700 text-white'
                        : 'bg-white text-shell-700 border border-shell-200'
                    }`}
                  >
                    Fit Entire Image
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-shell-500">
                    Background:
                  </span>
                  {[
                    { id: 'transparent', label: 'Transparent' },
                    { id: '#092618', label: 'HarWest Green' },
                    { id: '#ffffff', label: 'White' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setBgColor(bg.id)}
                      className={`rounded-lg px-2 py-1 text-[11px] font-bold border transition ${
                        bgColor === bg.id
                          ? 'border-leaf-600 bg-leaf-50 text-leaf-900'
                          : 'border-shell-200 bg-white text-shell-600'
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}

                  {bgColor === 'transparent' && (
                    <button
                      type="button"
                      onClick={() => setRemoveWhiteBg((v) => !v)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold border transition ${
                        removeWhiteBg
                          ? 'border-emerald-500 bg-emerald-100 text-emerald-950 shadow-xs ring-1 ring-emerald-400'
                          : 'border-shell-300 bg-white text-shell-700 hover:bg-shell-50'
                      }`}
                      title="Convert solid white / off-white background pixels to transparent"
                    >
                      <Sparkles size={11} className={removeWhiteBg ? 'text-emerald-700' : 'text-shell-400'} />
                      {removeWhiteBg ? '✓ White Removed' : 'Remove White BG'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleResetAdjustments}
                    className="inline-flex items-center gap-1 rounded-lg border border-shell-300 bg-white px-2.5 py-1 text-xs font-bold text-shell-700 hover:bg-shell-100"
                  >
                    <RefreshCw size={12} /> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Live Website View Preview */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-leaf-200 bg-gradient-to-b from-leaf-50/50 to-white p-5 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-shell-200 pb-3">
                <div>
                  <h4 className="font-head text-sm font-bold text-shell-900 flex items-center gap-1.5">
                    <Sparkles size={15} className="text-leaf-600" />
                    2. Live Website View Preview
                  </h4>
                  <p className="text-[11px] text-shell-500">
                    See exactly how your cropped image will look on the live site
                  </p>
                </div>
                <span className="rounded-full bg-leaf-100 px-2.5 py-0.5 text-[11px] font-bold text-leaf-900">
                  {outW} × {outH} px
                </span>
              </div>

              {/* Special Live Navbar & Mobile Header Preview when cropping Logo */}
              {(isLogo || presetId === 'logo') && previewDataUrl && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-leaf-900/30 bg-[#092618] p-4 text-white shadow-md">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-300/90 mb-2">
                      <span>Desktop Navbar Preview</span>
                      <span className="text-emerald-400 font-bold">✓ Pure Transparent Blend</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-[#071f13] px-4 py-3 border border-white/10">
                      <img
                        src={previewDataUrl}
                        alt="Desktop Logo Preview"
                        className="h-11 sm:h-14 w-auto max-w-[210px] object-contain object-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                      />
                      <div className="hidden sm:flex items-center gap-2 text-[11px] text-emerald-100/80 font-medium">
                        <span className="rounded-full bg-white/15 px-2.5 py-1 text-white">Home</span>
                        <span>Products</span>
                        <span>Infrastructure</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-leaf-900/30 bg-[#092618] p-3.5 text-white shadow-sm">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-300/90 mb-2">
                      <span>Mobile Navbar Preview</span>
                      <span className="text-emerald-400 font-bold">✓ Pure Transparent Blend</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-[#071f13] px-3.5 py-2.5 border border-white/10 max-w-[300px]">
                      <img
                        src={previewDataUrl}
                        alt="Mobile Logo Preview"
                        className="h-10 w-auto max-w-[160px] object-contain object-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                      />
                      <span className="rounded-lg border border-white/20 px-2 py-1 text-[10px] text-emerald-200">
                        ☰ Menu
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Standard Card & Full-Frame Preview for all images */}
              {previewDataUrl && (
                <div className="rounded-2xl border border-shell-200 bg-white p-3.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-shell-600">
                    <span>Cropped Image Output Preview</span>
                    <span className="text-leaf-700">
                      Original: {naturalSize.w} × {naturalSize.h} px
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-shell-200 bg-shell-100 flex items-center justify-center max-h-48">
                    <img
                      src={previewDataUrl}
                      alt="Cropped output preview"
                      className="max-h-48 w-auto object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-leaf-200 bg-leaf-50/70 p-3 text-xs text-leaf-950 space-y-1">
                <p className="font-bold">💡 Quick Cropping Tips:</p>
                <ul className="list-disc pl-4 text-[11px] text-shell-700 space-y-0.5">
                  <li>
                    <strong>Drag directly</strong> on the image canvas on the left to center your logo or product.
                  </li>
                  <li>
                    Use <strong>Zoom</strong> to trim away unwanted white margins or square borders.
                  </li>
                  <li>
                    Switch to <strong>Fit Entire Image</strong> + <strong>HarWest Green</strong> background if you want zero cropping around a square logo.
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-shell-200">
              <button
                type="button"
                disabled={exporting || !!loadError}
                onClick={handleConfirmCrop}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-leaf-800 disabled:opacity-50"
              >
                <Check size={17} />
                {exporting ? 'Applying Crop & Uploading...' : 'Apply Crop & Upload to Cloud'}
              </button>

              <div className="flex gap-2">
                {fileOrUrl instanceof File && (
                  <button
                    type="button"
                    disabled={exporting}
                    onClick={handleSkipCrop}
                    className="flex-1 rounded-xl border border-shell-300 bg-white px-3 py-2 text-xs font-bold text-shell-700 transition hover:bg-shell-50"
                  >
                    Upload Original Without Crop
                  </button>
                )}
                <button
                  type="button"
                  disabled={exporting}
                  onClick={onCancel}
                  className="flex-1 rounded-xl border border-shell-200 bg-shell-100 px-3 py-2 text-xs font-bold text-shell-600 transition hover:bg-shell-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

