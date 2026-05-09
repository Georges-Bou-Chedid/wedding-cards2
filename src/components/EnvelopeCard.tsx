import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeCardProps {
  onOpen: () => void;
}

/* ─── Embossed floral SVG overlay ─────────────────────────────────────── */
const FloralOverlay = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 320 460"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Top-left botanical sprig */}
    <g transform="translate(28, 40)" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1">
      <path d="M0,80 C8,60 14,38 20,14" />
      <path d="M20,14 C24,4 32,0 38,8 C44,16 38,28 26,32" />
      <path d="M20,14 C14,4 6,2 2,10 C-2,18 4,28 16,30" />
      <path d="M10,48 C4,42 -4,44 -4,52 C-4,58 2,62 10,58" />
      <path d="M10,48 C16,42 24,44 22,52 C20,58 14,60 8,56" />
      <circle cx="20" cy="10" r="3.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
      <circle cx="-5" cy="51" r="2.5" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      <circle cx="23" cy="51" r="2.5" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
    </g>

    {/* Top-right botanical sprig (mirrored) */}
    <g transform="translate(292, 40) scale(-1,1)" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1">
      <path d="M0,80 C8,60 14,38 20,14" />
      <path d="M20,14 C24,4 32,0 38,8 C44,16 38,28 26,32" />
      <path d="M20,14 C14,4 6,2 2,10 C-2,18 4,28 16,30" />
      <path d="M10,48 C4,42 -4,44 -4,52 C-4,58 2,62 10,58" />
      <path d="M10,48 C16,42 24,44 22,52 C20,58 14,60 8,56" />
      <circle cx="20" cy="10" r="3.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
      <circle cx="-5" cy="51" r="2.5" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      <circle cx="23" cy="51" r="2.5" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
    </g>

    {/* Bottom-left floral corner */}
    <g transform="translate(28, 420) scale(1,-1)" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.9">
      <path d="M0,60 C6,46 12,30 18,12" />
      <path d="M18,12 C22,2 30,-2 36,6" />
      <path d="M18,12 C12,2 4,0 0,8" />
      <path d="M8,36 C2,30 -6,32 -5,40" />
      <circle cx="18" cy="8" r="3" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
    </g>

    {/* Bottom-right floral corner */}
    <g transform="translate(292, 420) scale(-1,-1)" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.9">
      <path d="M0,60 C6,46 12,30 18,12" />
      <path d="M18,12 C22,2 30,-2 36,6" />
      <path d="M18,12 C12,2 4,0 0,8" />
      <path d="M8,36 C2,30 -6,32 -5,40" />
      <circle cx="18" cy="8" r="3" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
    </g>

    {/* Subtle vine along bottom */}
    <path
      d="M60,420 C80,408 100,415 120,408 C140,401 160,410 180,404 C200,398 220,407 240,400 C260,393 280,406 300,400"
      fill="none"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="0.8"
    />

    {/* Thin border frame */}
    <rect x="14" y="14" width="292" height="432" rx="2" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
    <rect x="18" y="18" width="284" height="424" rx="1" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  </svg>
);

/* ─── CSS Wax Seal ─────────────────────────────────────────────────────── */
const WaxSeal = () => (
  <div className="relative flex items-center justify-center">
    {/* Outer decorative ring */}
    <div
      className="absolute rounded-full"
      style={{
        width: 88,
        height: 88,
        background: "conic-gradient(from 0deg, #B8860B, #D4AA30, #C4902A, #B8860B, #D4AA30, #C4902A, #B8860B)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
      }}
    />
    {/* Main seal body */}
    <div
      className="relative flex items-center justify-center rounded-full z-10"
      style={{
        width: 78,
        height: 78,
        background: "radial-gradient(ellipse at 38% 32%, #D4B060, #B8860B 55%, #8B6514)",
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3)",
      }}
    >
      {/* Inner ring */}
      <div
        className="absolute rounded-full border"
        style={{
          inset: 7,
          borderColor: "rgba(255,255,255,0.3)",
        }}
      />
      {/* Monogram */}
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "1.4rem",
          color: "rgba(255,255,255,0.95)",
          letterSpacing: "0.02em",
          textShadow: "0 1px 3px rgba(0,0,0,0.4)",
          zIndex: 2,
          position: "relative",
        }}
      >
        BM
      </span>
    </div>
  </div>
);

/* ─── Main component ───────────────────────────────────────────────────── */
const EnvelopeCard = ({ onOpen }: EnvelopeCardProps) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(onOpen, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "hsl(var(--cream))" }}
      onClick={handleClick}
    >
      {/* Subtle paper texture radials */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 25% 25%, rgba(140,157,173,0.08) 0%, transparent 55%), radial-gradient(ellipse at 75% 75%, rgba(140,157,173,0.06) 0%, transparent 55%)",
        }}
      />

      <div style={{ perspective: 1400 }}>
        {/* ── Envelope wrapper ── */}
        <div className="relative cursor-pointer" style={{ width: 320, height: 460 }}>

          {/* Envelope body */}
          <div
            className="absolute inset-0 rounded-lg shadow-2xl overflow-hidden"
            style={{
              background: "hsl(var(--dusty-blue))",
              boxShadow: "0 24px 64px rgba(108,125,142,0.40), 0 4px 16px rgba(108,125,142,0.25)",
            }}
          >
            {/* Bottom V-fold (triangular crease visible) */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: "50%",
                clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                background: "hsl(var(--dusty-blue-darker))",
              }}
            />
            {/* Left side fold */}
            <div
              className="absolute top-0 bottom-0 left-0"
              style={{
                width: "50%",
                clipPath: "polygon(0 0, 0 100%, 100% 50%)",
                background: "hsl(var(--dusty-blue-dark))",
              }}
            />
            {/* Right side fold */}
            <div
              className="absolute top-0 bottom-0 right-0"
              style={{
                width: "50%",
                clipPath: "polygon(100% 0, 100% 100%, 0 50%)",
                background: "hsl(var(--dusty-blue-dark))",
              }}
            />
          </div>

          {/* Floral SVG overlay */}
          <FloralOverlay />

          {/* Inner card — slides upward on open */}
          <motion.div
            className="absolute rounded shadow-inner overflow-hidden"
            style={{
              left: 22,
              right: 22,
              top: 60,
              bottom: 28,
              background: "hsl(var(--ivory))",
              zIndex: 4,
            }}
            animate={isOpening ? { y: -260, opacity: 0.6 } : {}}
            transition={{ duration: 1.1, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center justify-center h-full px-6">
              <div className="text-center">
                <p
                  className="text-dusty-blue tracking-[0.3em] uppercase mb-3"
                  style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
                >
                  You're Invited
                </p>
                <h2
                  className="text-foreground leading-none"
                  style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: "2.6rem", letterSpacing: "0.06em" }}
                >
                  Ibrahim
                </h2>
                <p
                  className="text-dusty-blue my-1"
                  style={{ fontFamily: "'Great Vibes',cursive", fontSize: "2rem" }}
                >
                  &amp;
                </p>
                <h2
                  className="text-foreground leading-none"
                  style={{ fontFamily: "'Great Vibes',cursive", fontSize: "2.8rem" }}
                >
                  Marianne
                </h2>
                <p
                  className="text-muted-foreground mt-4 tracking-widest uppercase"
                  style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
                >
                  12 · 07 · 2026
                </p>
              </div>
            </div>
          </motion.div>

          {/* Envelope flap — opens backward */}
          <motion.div
            className="absolute left-0 right-0 top-0 overflow-hidden"
            style={{
              height: 230,
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              zIndex: 10,
            }}
            animate={isOpening ? { rotateX: -180 } : {}}
            transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Front of flap */}
            <div
              className="w-full h-full"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "hsl(var(--dusty-blue-dark))",
                backfaceVisibility: "hidden",
              }}
            />
          </motion.div>

          {/* Wax seal */}
          <motion.div
            className="absolute z-20"
            style={{ left: "50%", top: "42%", transform: "translate(-50%, -50%)" }}
            animate={isOpening ? { scale: 0, opacity: 0, rotate: 30 } : {}}
            transition={{ duration: 0.45, ease: "easeIn" }}
          >
            <WaxSeal />
          </motion.div>

          {/* Names on envelope front */}
          <motion.div
            className="absolute z-10 text-center"
            style={{ left: 0, right: 0, bottom: 60 }}
            animate={isOpening ? { opacity: 0 } : {}}
            transition={{ duration: 0.3 }}
          >
            <p
              className="text-embossed"
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 300,
                fontSize: "1.55rem",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              Ibrahim
            </p>
            <p
              style={{
                fontFamily: "'Great Vibes',cursive",
                fontSize: "2.2rem",
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.1,
              }}
            >
              &amp; Marianne
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tap-to-open hint */}
      <AnimatePresence>
        {!isOpening && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p
              className="animate-pulse-soft text-dusty-blue-dark tracking-[0.28em] uppercase"
              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem" }}
            >
              Tap to Open
            </p>
            <div
              className="animate-hint-line mx-auto mt-2 w-px bg-dusty-blue"
              style={{ height: 28 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen fade-out overlay */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "hsl(var(--cream))" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.65 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnvelopeCard;
