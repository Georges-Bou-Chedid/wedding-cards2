import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import { isScratchRevealed } from "@/lib/scratchReveal";

interface ScratchCardProps {
  overlayImageSrc: string;
  width?: number;
  height?: number;
  onReveal: () => void;
  className?: string;
}

const BRUSH_RADIUS = 40;
// The reveal check (a full canvas readback) is far more expensive than the
// draw itself — throttling it keeps the visual scratch trail smooth even on
// slower phones, instead of reading back the canvas on every single pointer
// move.
const REVEAL_CHECK_INTERVAL_MS = 90;

const ScratchCard = ({
  overlayImageSrc,
  width = 300,
  height = 170,
  onReveal,
  className = "",
}: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPointerDownRef = useRef(false);
  const hasRevealedRef = useRef(false);
  const lastRevealCheckRef = useRef(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const image = new Image();
    image.src = overlayImageSrc;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, width, height);
    };

    return () => {
      image.onload = null;
    };
  }, [overlayImageSrc, width, height]);

  const checkReveal = (ctx: CanvasRenderingContext2D) => {
    if (hasRevealedRef.current) return;
    const imageData = ctx.getImageData(0, 0, width, height).data;
    const alpha = new Uint8ClampedArray(imageData.length / 4);
    for (let i = 0; i < alpha.length; i++) {
      alpha[i] = imageData[i * 4 + 3];
    }
    if (isScratchRevealed(alpha)) {
      hasRevealedRef.current = true;
      setIsRevealed(true);
      onReveal();
    }
  };

  const scratchAt = (clientX: number, clientY: number, forceRevealCheck = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * width;
    const y = ((clientY - rect.top) / rect.height) * height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    if (hasRevealedRef.current) return;
    const now = Date.now();
    if (forceRevealCheck || now - lastRevealCheckRef.current >= REVEAL_CHECK_INTERVAL_MS) {
      lastRevealCheckRef.current = now;
      checkReveal(ctx);
    }
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = true;
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
  };

  return (
    <div className={`relative inline-block ${className}`} style={{ width, height }}>
      <motion.canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 rounded-sm touch-none cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopScratching}
        onPointerLeave={stopScratching}
        animate={{ opacity: isRevealed ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        style={{ pointerEvents: isRevealed ? "none" : "auto" }}
      />
    </div>
  );
};

export default ScratchCard;
