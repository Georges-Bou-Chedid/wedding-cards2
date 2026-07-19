import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { isScratchRevealed } from "@/lib/scratchReveal";

interface ScratchCardProps {
  /** The content hidden underneath the scratch label — revealed as it's scratched away. */
  children: ReactNode;
  /** Fires once the label is scratched past the reveal threshold. */
  onFullyScratched?: () => void;
  className?: string;
}

const BRUSH_RADIUS = 40;
// The reveal check (a full canvas readback) is far more expensive than the
// draw itself — throttling it keeps the visual scratch trail smooth even on
// slower phones, instead of reading back the canvas on every single pointer
// move.
const REVEAL_CHECK_INTERVAL_MS = 90;

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

const ScratchCard = ({ children, onFullyScratched, className = "" }: ScratchCardProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPointerDownRef = useRef(false);
  const hasRevealedRef = useRef(false);
  const hasSizedRef = useRef(false);
  const lastRevealCheckRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0 });
  // The previous scratch point, so each new point can be connected to it with
  // a stroked line — a single pointermove only gives us its endpoint, and on
  // real devices (and in this browser generally) intermediate positions get
  // coalesced/dropped, so stamping isolated circles leaves gaps between them.
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const drawLabel = (width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#5c6f81");
    gradient.addColorStop(1, "#8c9dad");
    ctx.fillStyle = gradient;
    roundRectPath(ctx, 0, 0, width, height, 16);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.5;
    roundRectPath(ctx, 7, 7, width - 14, height - 14, 12);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const midX = width / 2;
    const midY = height / 2;

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = `${Math.round(Math.min(width, height) * 0.14)}px 'Cormorant Garamond', serif`;
    ctx.fillText("♥", midX, midY - height * 0.14);

    ctx.font = `italic ${Math.round(Math.min(width, height) * 0.1)}px 'Cormorant Garamond', serif`;
    ctx.fillText("Scratch to Reveal", midX, midY + height * 0.02);

    ctx.font = `${Math.max(10, Math.round(width * 0.032))}px 'Montserrat', sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.fillText("Y O U R   W E D D I N G   D A T E", midX, midY + height * 0.16);
  };

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const measure = () => {
      if (hasSizedRef.current) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      hasSizedRef.current = true;
      sizeRef.current = { width: rect.width, height: rect.height };
      document.fonts.ready.then(() => {
        drawLabel(rect.width, rect.height);
        setIsReady(true);
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkReveal = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (hasRevealedRef.current) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const alpha = new Uint8ClampedArray(imageData.length / 4);
    for (let i = 0; i < alpha.length; i++) {
      alpha[i] = imageData[i * 4 + 3];
    }
    if (isScratchRevealed(alpha)) {
      hasRevealedRef.current = true;
      setIsRevealed(true);
      onFullyScratched?.();
    }
  };

  const scratchAt = (clientX: number, clientY: number, forceRevealCheck = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const { width, height } = sizeRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * width;
    const y = ((clientY - rect.top) / rect.height) * height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Bridge the gap from the last point — without this, any two pointer
    // events more than one brush-width apart leave an unscratched strip
    // between them.
    const last = lastPointRef.current;
    if (last) {
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineWidth = BRUSH_RADIUS * 2;
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    lastPointRef.current = { x, y };

    if (hasRevealedRef.current) return;
    const now = Date.now();
    if (forceRevealCheck || now - lastRevealCheckRef.current >= REVEAL_CHECK_INTERVAL_MS) {
      lastRevealCheckRef.current = now;
      checkReveal(ctx, canvas);
    }
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = true;
    lastPointRef.current = null;
    // Capture the pointer so a fast drag that briefly slips outside the
    // canvas's exact bounds keeps delivering move/up events here instead of
    // firing a premature pointerleave that would cut the stroke short.
    e.currentTarget.setPointerCapture(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) return;
    scratchAt(e.clientX, e.clientY);
  };

  const stopScratching = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (isPointerDownRef.current) {
      // Always run one final, unthrottled reveal check on release so a quick
      // drag that ends mid-throttle-window still gets evaluated.
      scratchAt(e.clientX, e.clientY, true);
    }
    isPointerDownRef.current = false;
    lastPointRef.current = null;
  };

  return (
    <div ref={wrapperRef} className={`relative inline-block ${className}`}>
      {children}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopScratching}
        onPointerLeave={stopScratching}
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? (isRevealed ? 0 : 1) : 0 }}
        transition={{ duration: isRevealed ? 0.6 : 0.3 }}
        style={{ pointerEvents: isRevealed ? "none" : "auto" }}
      />
    </div>
  );
};

export default ScratchCard;
