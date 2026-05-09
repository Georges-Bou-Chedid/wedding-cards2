import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeCardProps {
  onOpen: () => void;
}

/* ─── Full-screen embossed botanical SVG ──────────────────────────────── */
const EmbossedBotanical = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 390 844"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* ── Top-left corner botanical ── */}
    <g transform="translate(-10, -10)" fill="none" stroke="#D8CEBC" strokeWidth="1.2">
      <path d="M10,120 C20,95 32,70 46,44" />
      <path d="M46,44 C52,28 64,20 74,32 C84,44 76,62 58,68" />
      <path d="M46,44 C36,28 22,24 16,36 C10,48 18,64 36,68" />
      <path d="M26,82 C14,72 2,76 4,88 C6,100 18,106 30,98" />
      <path d="M26,82 C38,72 50,76 46,88 C42,100 30,104 20,96" />
      <circle cx="46" cy="38" r="5" fill="#D8CEBC" stroke="none" />
      <circle cx="2" cy="87" r="3.5" fill="#D8CEBC" stroke="none" />
      <circle cx="48" cy="87" r="3.5" fill="#D8CEBC" stroke="none" />
      <path d="M60,50 C68,38 80,40 82,52" />
      <circle cx="82" cy="52" r="2.5" fill="#D8CEBC" stroke="none" />
      <path d="M10,120 C4,108 0,90 6,76" strokeWidth="0.8" />
      <path d="M30,140 C22,128 14,110 16,94" strokeWidth="0.7" />
    </g>

    {/* ── Top-right corner botanical ── */}
    <g transform="translate(400, -10) scale(-1,1)" fill="none" stroke="#D8CEBC" strokeWidth="1.2">
      <path d="M10,120 C20,95 32,70 46,44" />
      <path d="M46,44 C52,28 64,20 74,32 C84,44 76,62 58,68" />
      <path d="M46,44 C36,28 22,24 16,36 C10,48 18,64 36,68" />
      <path d="M26,82 C14,72 2,76 4,88 C6,100 18,106 30,98" />
      <path d="M26,82 C38,72 50,76 46,88 C42,100 30,104 20,96" />
      <circle cx="46" cy="38" r="5" fill="#D8CEBC" stroke="none" />
      <circle cx="2" cy="87" r="3.5" fill="#D8CEBC" stroke="none" />
      <circle cx="48" cy="87" r="3.5" fill="#D8CEBC" stroke="none" />
      <path d="M60,50 C68,38 80,40 82,52" />
      <circle cx="82" cy="52" r="2.5" fill="#D8CEBC" stroke="none" />
    </g>

    {/* ── Bottom-left corner botanical ── */}
    <g transform="translate(-10, 854) scale(1,-1)" fill="none" stroke="#D8CEBC" strokeWidth="1.1">
      <path d="M10,110 C20,88 30,64 42,40" />
      <path d="M42,40 C48,24 60,18 70,30 C80,42 72,60 54,64" />
      <path d="M42,40 C32,24 18,20 14,34 C10,48 18,62 34,64" />
      <circle cx="42" cy="34" r="4.5" fill="#D8CEBC" stroke="none" />
      <path d="M22,76 C10,66 -2,70 0,82" strokeWidth="1" />
      <circle cx="0" cy="82" r="3" fill="#D8CEBC" stroke="none" />
    </g>

    {/* ── Bottom-right corner botanical ── */}
    <g transform="translate(400, 854) scale(-1,-1)" fill="none" stroke="#D8CEBC" strokeWidth="1.1">
      <path d="M10,110 C20,88 30,64 42,40" />
      <path d="M42,40 C48,24 60,18 70,30 C80,42 72,60 54,64" />
      <path d="M42,40 C32,24 18,20 14,34 C10,48 18,62 34,64" />
      <circle cx="42" cy="34" r="4.5" fill="#D8CEBC" stroke="none" />
      <path d="M22,76 C10,66 -2,70 0,82" strokeWidth="1" />
      <circle cx="0" cy="82" r="3" fill="#D8CEBC" stroke="none" />
    </g>

    {/* ── Centre floral wreath / motif ── */}
    <g transform="translate(195, 400)" fill="none" stroke="#D8CEBC" strokeWidth="1">
      {/* Outer decorative ring */}
      <circle cx="0" cy="0" r="96" strokeWidth="0.6" strokeDasharray="4 6" />
      {/* Four botanical sprigs at compass points */}
      {[0, 90, 180, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <path d="M0,-96 C4,-80 6,-64 4,-48" strokeWidth="0.8" />
          <path d="M4,-72 C10,-66 16,-68 16,-60" strokeWidth="0.7" />
          <path d="M4,-72 C-2,-66 -8,-68 -8,-60" strokeWidth="0.7" />
          <circle cx="0" cy="-100" r="2.5" fill="#D8CEBC" stroke="none" />
        </g>
      ))}
      {/* Leaf pairs at diagonals */}
      {[45, 135, 225, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <path d="M0,-78 C6,-72 8,-62 4,-56" strokeWidth="0.7" />
          <path d="M0,-78 C-6,-72 -8,-62 -4,-56" strokeWidth="0.7" />
        </g>
      ))}
    </g>

    {/* ── Subtle vine border along all four edges ── */}
    <path
      d="M30,0 Q60,12 90,4 Q120,-4 150,8 Q180,20 210,10 Q240,0 270,12 Q300,24 330,14 Q360,4 390,16"
      fill="none" stroke="#D8CEBC" strokeWidth="0.7" opacity="0.7"
    />
    <path
      d="M30,844 Q60,832 90,840 Q120,848 150,836 Q180,824 210,834 Q240,844 270,832 Q300,820 330,830 Q360,840 390,828"
      fill="none" stroke="#D8CEBC" strokeWidth="0.7" opacity="0.7"
    />
    <path
      d="M0,30 Q12,60 4,90 Q-4,120 8,150 Q20,180 10,210 Q0,240 12,270 Q24,300 14,330 Q4,360 16,390"
      fill="none" stroke="#D8CEBC" strokeWidth="0.7" opacity="0.7"
    />
    <path
      d="M390,30 Q378,60 386,90 Q394,120 382,150 Q370,180 380,210 Q390,240 378,270 Q366,300 376,330 Q386,360 374,390"
      fill="none" stroke="#D8CEBC" strokeWidth="0.7" opacity="0.7"
    />

    {/* ── Inner frame border ── */}
    <rect x="16" y="16" width="358" height="812" rx="2" fill="none" stroke="#D8CEBC" strokeWidth="0.8" />
    <rect x="22" y="22" width="346" height="800" rx="1" fill="none" stroke="#D8CEBC" strokeWidth="0.4" />
  </svg>
);

/* ─── Envelope fold triangles (cream-on-cream) ────────────────────────── */
const EnvelopeFolds = () => (
  <>
    {/* Left fold */}
    <div
      className="absolute top-0 bottom-0 left-0 pointer-events-none"
      style={{
        width: "50%",
        clipPath: "polygon(0 0, 0 100%, 100% 50%)",
        background: "rgba(200,186,168,0.18)",
      }}
    />
    {/* Right fold */}
    <div
      className="absolute top-0 bottom-0 right-0 pointer-events-none"
      style={{
        width: "50%",
        clipPath: "polygon(100% 0, 100% 100%, 0 50%)",
        background: "rgba(200,186,168,0.18)",
      }}
    />
    {/* Bottom fold */}
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none"
      style={{
        height: "50%",
        clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
        background: "rgba(200,186,168,0.13)",
      }}
    />
  </>
);

/* ─── Wax Seal — dusty blue ───────────────────────────────────────────── */
const WaxSeal = () => (
  <div className="relative flex items-center justify-center">
    {/* Outer decorative ring */}
    <div
      className="absolute rounded-full"
      style={{
        width: 96,
        height: 96,
        background:
          "conic-gradient(from 0deg, hsl(212,20%,44%), hsl(212,18%,56%), hsl(212,16%,50%), hsl(212,20%,44%), hsl(212,18%,56%), hsl(212,16%,50%), hsl(212,20%,44%))",
        boxShadow: "0 6px 24px rgba(108,130,150,0.40), 0 2px 8px rgba(0,0,0,0.18)",
      }}
    />
    {/* Main seal body */}
    <div
      className="relative flex items-center justify-center rounded-full z-10"
      style={{
        width: 84,
        height: 84,
        background:
          "radial-gradient(ellipse at 36% 30%, hsl(212,22%,68%), hsl(212,18%,58%) 50%, hsl(212,20%,46%))",
        boxShadow:
          "inset 0 3px 6px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.25)",
      }}
    >
      {/* Inner ring */}
      <div
        className="absolute rounded-full"
        style={{ inset: 8, border: "1px solid rgba(255,255,255,0.35)" }}
      />
      {/* Monogram */}
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "1.55rem",
          color: "rgba(255,255,255,0.96)",
          letterSpacing: "0.04em",
          textShadow: "0 1px 4px rgba(0,0,0,0.35)",
          position: "relative",
          zIndex: 2,
        }}
      >
        BM
      </span>
    </div>
  </div>
);

/* ─── Main EnvelopeCard ───────────────────────────────────────────────── */
const EnvelopeCard = ({ onOpen }: EnvelopeCardProps) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(onOpen, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden cursor-pointer select-none"
      style={{ background: "hsl(var(--ivory))" }}
      onClick={handleClick}
    >
      {/* ── Embossed botanical SVG (full coverage) ── */}
      <EmbossedBotanical />

      {/* ── Fold shadow triangles ── */}
      <EnvelopeFolds />

      {/* ── Diagonal ribbon / thread ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <line
          x1="260" y1="200"
          x2="130" y2="600"
          stroke="hsl(var(--warm-beige))"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>

      {/* ── Top flap (the triangle that rotates back) ── */}
      <motion.div
        className="absolute left-0 right-0 top-0"
        style={{
          height: "46%",
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          zIndex: 20,
          perspective: 1200,
        }}
        animate={isOpening ? { rotateX: -170 } : {}}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Flap surface */}
        <div
          className="w-full h-full"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            background: "linear-gradient(175deg, hsl(40,18%,93%), hsl(38,12%,90%))",
            backfaceVisibility: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        />
        {/* Embossed on the flap too */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        >
          <svg viewBox="0 0 390 388" className="w-full h-full" aria-hidden="true">
            {/* Flap botanical */}
            <g transform="translate(195, 60)" fill="none" stroke="#D0C4B0" strokeWidth="1">
              <path d="M0,0 C8,20 10,40 6,56" />
              <path d="M6,30 C14,24 22,26 22,36" />
              <path d="M6,30 C-2,24 -10,26 -10,36" />
              <circle cx="0" cy="-4" r="4" fill="#D0C4B0" stroke="none" />
              <circle cx="22" cy="36" r="2.5" fill="#D0C4B0" stroke="none" />
              <circle cx="-10" cy="36" r="2.5" fill="#D0C4B0" stroke="none" />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* ── Inner card (rises when flap opens) ── */}
      <motion.div
        className="absolute rounded-sm overflow-hidden"
        style={{
          left: 24,
          right: 24,
          top: 80,
          bottom: 60,
          background: "hsl(var(--cream))",
          zIndex: 5,
          boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
        }}
        animate={isOpening ? { y: "-55vh", opacity: 0.5 } : {}}
        transition={{ duration: 1.1, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center px-8">
            <p
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: "0.58rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "hsl(var(--dusty-blue))",
                marginBottom: "1rem",
              }}
            >
              You Are Invited
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 300,
                fontSize: "2.2rem",
                letterSpacing: "0.06em",
                color: "hsl(var(--foreground))",
                lineHeight: 1,
              }}
            >
              Bob
            </p>
            <p
              style={{
                fontFamily: "'Great Vibes',cursive",
                fontSize: "1.8rem",
                color: "hsl(var(--dusty-blue))",
                lineHeight: 1.2,
              }}
            >
              &amp;
            </p>
            <p
              style={{
                fontFamily: "'Great Vibes',cursive",
                fontSize: "2.6rem",
                color: "hsl(var(--foreground))",
                lineHeight: 1,
              }}
            >
              Marianne
            </p>
            <p
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: "0.58rem",
                letterSpacing: "0.25em",
                color: "hsl(var(--muted-foreground))",
                marginTop: "1rem",
              }}
            >
              12 · 07 · 2026
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Wax seal + names + text (front face) ── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        style={{ pointerEvents: "none" }}
        animate={isOpening ? { opacity: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <WaxSeal />

        <p
          className="mt-5 text-center"
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontStyle: "italic",
            fontSize: "clamp(1rem,3vw,1.25rem)",
            color: "hsl(var(--muted-foreground))",
            letterSpacing: "0.04em",
            lineHeight: 1.7,
          }}
        >
          Requests the pleasure<br />of your company
        </p>

        <div className="mt-6 text-center">
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontWeight: 300,
              fontSize: "clamp(2rem,7vw,3rem)",
              letterSpacing: "0.1em",
              color: "hsl(var(--foreground))",
              lineHeight: 1,
            }}
          >
            Bob
          </p>
          <p
            style={{
              fontFamily: "'Great Vibes',cursive",
              fontSize: "clamp(2.8rem,9vw,4rem)",
              color: "hsl(var(--foreground))",
              lineHeight: 1.1,
            }}
          >
            &amp; Marianne
          </p>
        </div>
      </motion.div>

      {/* ── Tap hint ── */}
      <AnimatePresence>
        {!isOpening && (
          <motion.div
            className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 z-30"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p
              className="animate-pulse-soft"
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: "0.58rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "hsl(var(--dusty-blue-dark))",
              }}
            >
              Tap to Open
            </p>
            <div
              className="animate-hint-line w-px bg-dusty-blue"
              style={{ height: 28, background: "hsl(var(--dusty-blue))" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full-screen cream fade-out on open ── */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "hsl(var(--ivory))" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.7 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnvelopeCard;
