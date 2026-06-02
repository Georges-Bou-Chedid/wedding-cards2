import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeCardProps {
  onOpen: () => void;
  onInteraction: () => void;
}

/* ─── The Specific Double-Line Heart Monogram SVG ─────────────────────── */
const HeartMonogram = () => (
  <svg
    className="relative z-10 w-full h-full p-3"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Inner heart - rough textured fill */}
    <path
      d="M50 25 C65 10, 85 20, 85 45 C85 70, 50 90, 50 90 C50 90, 15 70, 15 45 C15 20, 35 10, 50 25 Z"
      fill="#d4af37" // Base gold color
      stroke="#b89327" // Sightly darker gold for texture definition
      strokeWidth="1.5"
      filter="url(#rough-texture)"
    />
    
    {/* Outer defining heart - clean line, slightly offset to mimic a double outline */}
    <path
      d="M50 23 C68 7, 88 18, 88 43 C88 68, 50 88, 50 88 C50 88, 12 68, 12 43 C12 18, 32 7, 50 23 Z"
      fill="none"
      stroke="#d4af37"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    <defs>
      {/* SVG filter to create the rough, cast-metal texture for the inner heart */}
      <filter id="rough-texture" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.83 0 0 0 0 0.69 0 0 0 0 0.22 0 0 0 1 0"/>
        <feComposite operator="in" in2="SourceGraphic"/>
        <feGaussianBlur stdDeviation="0.2" result="blur"/>
        <feSpecularLighting surfaceScale="2" specularConstant="0.8" specularExponent="20" lightingColor="white">
          <fePointLight x="50" y="50" z="50"/>
        </feSpecularLighting>
        <feComposite operator="in" in2="SourceGraphic" result="lighting"/>
        <feMerge>
          <feMergeNode in="lighting"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  </svg>
);

/* ─── Realistic Gold Wax Seal with the new Heart ───────────────────── */
const WaxSeal = () => (
  <div className="relative flex items-center justify-center scale-110">
    {/* Main wax body - radial gradient for depth */}
    <div className="relative z-10 flex items-center justify-center rounded-full border border-gold-dark/20" style={{
      width: 98, height: 98,
      background: "radial-gradient(ellipse at 35% 30%, #f7e6ac, #e0c57c 50%, #c4a75e)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.35), inset 0 3px 8px rgba(255,255,255,0.35), inset 0 -3px 8px rgba(0,0,0,0.25)",
    }}>
      {/* The new intricate heart monogram */}
      <HeartMonogram />
    </div>
  </div>
);

const EnvelopeCard = ({ onOpen, onInteraction }: EnvelopeCardProps) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    onInteraction();
    setIsOpening(true);
    setTimeout(onOpen, 2400); // Give time for the flip before redirecting
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden cursor-pointer flex items-center justify-center"
      style={{ background: "#F5F3E8" }} // Elegant off-white, slightly warm
      onClick={handleClick}
    >
      {/* Subtle paper fiber texture overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` 
      }} />

      {/* Fold shadows - create depth for the envelope */}
      <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-10" style={{
        background: "linear-gradient(135deg, rgba(0,0,0,0.06), transparent 25%, transparent 75%, rgba(0,0,0,0.06))"
      }}/>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110vw] h-[55%] pointer-events-none z-10" style={{
        clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
        background: "rgba(0,0,0,0.05)",
      }}/>

      {/* Top Flap — rotates backward on open */}
      <motion.div
        className="absolute left-0 right-0 top-0 z-20"
        style={{
          height: "50%",
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
        }}
        animate={isOpening ? { rotateX: -175 } : {}}
        transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="w-full h-full" style={{
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          background: "#F5F3E8",
          backfaceVisibility: "hidden",
          borderBottom: "1.5px solid rgba(0,0,0,0.04)", // Fine fold line
        }} />
      </motion.div>

      {/* Wax Seal — centered and breaks/fades out */}
      <motion.div
        className="absolute z-30 flex items-center justify-center"
        style={{ top: "50%", left: "50%", x: "-50%", y: "-50%", pointerEvents: "none" }}
        animate={isOpening ? { y: -200, opacity: 0, scale: 0.8 } : {}}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        <WaxSeal />
      </motion.div>

      {/* Inner card — plain, no text */}
      <motion.div
        className="absolute z-0"
        style={{
          width: "82%",
          height: "60%",
          background: "hsl(var(--ivory))",
          boxShadow: "0 4px 28px rgba(0,0,0,0.18)",
          top: 90,
        }}
        animate={isOpening ? { y: "-65vh", opacity: 0.5 } : { y: 20 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Full-screen fade to ivory on open */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            className="fixed inset-0 z-[100]"
            style={{ background: "hsl(var(--ivory))" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnvelopeCard;