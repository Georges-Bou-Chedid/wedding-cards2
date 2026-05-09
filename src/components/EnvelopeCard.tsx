import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeCardProps {
  onOpen: () => void;
}

/* ─── Full-screen botanical SVG — white lines on dusty blue ───────────── */
const EmbossedBotanical = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 390 844"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* ── Top-left sprig ── */}
    <g transform="translate(-10,-10)" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.3">
      <path d="M10,130 C22,100 36,72 50,48" />
      <path d="M50,48 C58,30 72,22 82,36 C92,50 82,68 62,74" />
      <path d="M50,48 C38,30 22,26 16,40 C10,54 20,70 40,74" />
      <path d="M28,90 C14,78 0,82 2,96 C4,110 18,116 32,106" />
      <path d="M28,90 C42,78 56,82 52,96 C48,110 34,114 24,104" />
      <circle cx="50" cy="40" r="5.5" fill="rgba(255,255,255,0.22)" stroke="none" />
      <circle cx="0"  cy="95" r="4"   fill="rgba(255,255,255,0.18)" stroke="none" />
      <circle cx="54" cy="95" r="4"   fill="rgba(255,255,255,0.18)" stroke="none" />
      <path d="M64,56 C74,42 88,44 90,58" />
      <circle cx="90" cy="58" r="3" fill="rgba(255,255,255,0.16)" stroke="none" />
    </g>

    {/* ── Top-right sprig (mirror) ── */}
    <g transform="translate(400,-10) scale(-1,1)" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.3">
      <path d="M10,130 C22,100 36,72 50,48" />
      <path d="M50,48 C58,30 72,22 82,36 C92,50 82,68 62,74" />
      <path d="M50,48 C38,30 22,26 16,40 C10,54 20,70 40,74" />
      <path d="M28,90 C14,78 0,82 2,96 C4,110 18,116 32,106" />
      <path d="M28,90 C42,78 56,82 52,96 C48,110 34,114 24,104" />
      <circle cx="50" cy="40" r="5.5" fill="rgba(255,255,255,0.22)" stroke="none" />
      <circle cx="0"  cy="95" r="4"   fill="rgba(255,255,255,0.18)" stroke="none" />
      <circle cx="54" cy="95" r="4"   fill="rgba(255,255,255,0.18)" stroke="none" />
    </g>

    {/* ── Bottom-left sprig ── */}
    <g transform="translate(-10,854) scale(1,-1)" fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="1.2">
      <path d="M10,110 C22,86 34,64 46,42" />
      <path d="M46,42 C54,24 66,18 76,32 C86,46 76,62 56,66" />
      <path d="M46,42 C36,24 20,20 16,36 C12,52 22,66 40,68" />
      <circle cx="46" cy="35" r="5" fill="rgba(255,255,255,0.18)" stroke="none" />
    </g>

    {/* ── Bottom-right sprig ── */}
    <g transform="translate(400,854) scale(-1,-1)" fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="1.2">
      <path d="M10,110 C22,86 34,64 46,42" />
      <path d="M46,42 C54,24 66,18 76,32 C86,46 76,62 56,66" />
      <path d="M46,42 C36,24 20,20 16,36 C12,52 22,66 40,68" />
      <circle cx="46" cy="35" r="5" fill="rgba(255,255,255,0.18)" stroke="none" />
    </g>

    {/* ── Centre floral wreath ── */}
    <g transform="translate(195,400)" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
      <circle cx="0" cy="0" r="108" strokeWidth="0.6" strokeDasharray="5 8" />
      <circle cx="0" cy="0" r="82"  strokeWidth="0.4" strokeDasharray="3 6" />
      {[0,90,180,270].map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <path d="M0,-110 C4,-92 6,-72 4,-54" strokeWidth="0.9" />
          <path d="M4,-80 C12,-72 18,-74 18,-64" strokeWidth="0.7" />
          <path d="M4,-80 C-4,-72 -10,-74 -10,-64" strokeWidth="0.7" />
          <circle cx="0" cy="-115" r="3" fill="rgba(255,255,255,0.18)" stroke="none" />
        </g>
      ))}
      {[45,135,225,315].map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <path d="M0,-88 C8,-80 10,-68 6,-60" strokeWidth="0.7" />
          <path d="M0,-88 C-8,-80 -10,-68 -6,-60" strokeWidth="0.7" />
        </g>
      ))}
    </g>

    {/* ── Edge vine borders ── */}
    <path d="M30,0 Q65,14 100,4 Q135,-6 170,8 Q205,22 240,10 Q275,-2 310,12 Q345,26 390,14"
      fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
    <path d="M30,844 Q65,830 100,840 Q135,850 170,838 Q205,826 240,836 Q275,846 310,834 Q345,822 390,832"
      fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
    <path d="M0,30 Q14,68 4,106 Q-6,144 8,182 Q22,220 10,258 Q-2,296 12,334 Q26,372 14,410"
      fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
    <path d="M390,30 Q376,68 386,106 Q396,144 382,182 Q368,220 380,258 Q392,296 378,334 Q364,372 376,410"
      fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />

    {/* ── Double border frame ── */}
    <rect x="14" y="14" width="362" height="816" rx="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.9" />
    <rect x="20" y="20" width="350" height="804" rx="1" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  </svg>
);

/* ─── Envelope fold shadows ───────────────────────────────────────────── */
const EnvelopeFolds = () => (
  <>
    <div className="absolute top-0 bottom-0 left-0 pointer-events-none" style={{
      width: "50%",
      clipPath: "polygon(0 0,0 100%,100% 50%)",
      background: "rgba(0,0,0,0.10)",
    }} />
    <div className="absolute top-0 bottom-0 right-0 pointer-events-none" style={{
      width: "50%",
      clipPath: "polygon(100% 0,100% 100%,0 50%)",
      background: "rgba(0,0,0,0.10)",
    }} />
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
      height: "50%",
      clipPath: "polygon(0 100%,50% 0,100% 100%)",
      background: "rgba(0,0,0,0.08)",
    }} />
  </>
);

/* ─── Wax Seal — prominent BM ────────────────────────────────────────── */
const WaxSeal = () => (
  <div className="relative flex items-center justify-center">
    {/* Shadow ring */}
    <div className="absolute rounded-full" style={{
      width: 112, height: 112,
      background: "rgba(0,0,0,0.22)",
      filter: "blur(8px)",
      top: 8,
    }} />
    {/* Conic outer ring */}
    <div className="absolute rounded-full" style={{
      width: 112, height: 112,
      background: "conic-gradient(from 0deg,hsl(212,22%,36%),hsl(212,18%,48%),hsl(212,22%,38%),hsl(212,20%,50%),hsl(212,22%,36%))",
      boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
    }} />
    {/* Main seal body */}
    <div className="relative z-10 flex items-center justify-center rounded-full" style={{
      width: 98, height: 98,
      background: "radial-gradient(ellipse at 36% 30%,hsl(212,22%,54%),hsl(212,18%,44%) 55%,hsl(212,22%,34%))",
      boxShadow: "inset 0 3px 8px rgba(255,255,255,0.22),inset 0 -3px 8px rgba(0,0,0,0.3)",
    }}>
      {/* Inner decorative ring */}
      <div className="absolute rounded-full" style={{
        inset: 9,
        border: "1.5px solid rgba(255,255,255,0.4)",
      }} />
      {/* Second inner ring */}
      <div className="absolute rounded-full" style={{
        inset: 14,
        border: "0.5px solid rgba(255,255,255,0.2)",
      }} />
      {/* BM monogram — large and clear */}
      <span style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: "1.85rem",
        color: "rgba(255,255,255,0.97)",
        letterSpacing: "0.05em",
        textShadow: "0 1px 6px rgba(0,0,0,0.45)",
        position: "relative",
        zIndex: 2,
        lineHeight: 1,
      }}>
        BM
      </span>
    </div>
  </div>
);

/* ─── Diagonal thread ─────────────────────────────────────────────────── */
const DiagonalThread = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 390 844"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <line
      x1="290" y1="180" x2="100" y2="660"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="1.5"
    />
  </svg>
);

/* ─── Main component ──────────────────────────────────────────────────── */
const EnvelopeCard = ({ onOpen }: EnvelopeCardProps) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(onOpen, 2400);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden cursor-pointer select-none"
      style={{ background: "hsl(var(--dusty-blue))" }}
      onClick={handleClick}
    >
      {/* Radial highlight */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 42%,rgba(255,255,255,0.08) 0%,transparent 65%)",
      }} />

      {/* Botanical overlay */}
      <EmbossedBotanical />

      {/* Fold shadows */}
      <EnvelopeFolds />

      {/* Diagonal thread */}
      <DiagonalThread />

      {/* Top flap — rotates backward on open */}
      <motion.div
        className="absolute left-0 right-0 top-0"
        style={{
          height: "46%",
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          zIndex: 20,
        }}
        animate={isOpening ? { rotateX: -175 } : {}}
        transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="w-full h-full" style={{
          clipPath: "polygon(0 0,100% 0,50% 100%)",
          background: "linear-gradient(175deg,hsl(212,18%,58%),hsl(212,18%,52%))",
          backfaceVisibility: "hidden",
        }} />
      </motion.div>

      {/* Inner card — plain, no text */}
      <motion.div
        className="absolute rounded-sm"
        style={{
          left: 28, right: 28, top: 90, bottom: 60,
          background: "hsl(var(--ivory))",
          zIndex: 5,
          boxShadow: "0 2px 24px rgba(0,0,0,0.18)",
        }}
        animate={isOpening ? { y: "-58vh", opacity: 0.4 } : {}}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Wax seal — centred */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-10"
        style={{ pointerEvents: "none" }}
        animate={isOpening ? { scale: 0, opacity: 0, rotate: 20 } : {}}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        <WaxSeal />
      </motion.div>

      {/* Chevron hint — no text, just an animated icon */}
      <AnimatePresence>
        {!isOpening && (
          <motion.div
            className="absolute bottom-9 left-0 right-0 flex flex-col items-center gap-1 z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
          >
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, 6, 0], opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 1.8, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden="true">
                  <path d="M1 1l9 9 9-9" stroke="rgba(255,255,255,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen fade to ivory on open */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "hsl(var(--ivory))" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnvelopeCard;
