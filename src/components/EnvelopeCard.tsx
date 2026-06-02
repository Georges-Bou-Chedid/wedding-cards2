import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface EnvelopeCardProps {
  onOpen: () => void;
  onInteraction: () => void;
}

const PAPER_BLUE = "#758491";
const PAPER_BLUE_DARK = "#667582";
const PAPER_BLUE_LIGHT = "#8a98a4";

const paperTexture = {
  backgroundColor: PAPER_BLUE,
  backgroundImage: [
    "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.08), transparent 24%)",
    "radial-gradient(circle at 80% 68%, rgba(30,43,55,0.12), transparent 30%)",
    "repeating-linear-gradient(18deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 5px)",
    "repeating-linear-gradient(102deg, rgba(23,35,45,0.045) 0 1px, transparent 1px 6px)",
  ].join(", "),
};

const laurelLeaves = [
  { cx: 73, cy: 150, rx: 4.5, ry: 12, rotate: -45 },
  { cx: 62, cy: 134, rx: 4, ry: 11, rotate: -34 },
  { cx: 55, cy: 116, rx: 3.8, ry: 10.5, rotate: -24 },
  { cx: 52, cy: 98, rx: 3.4, ry: 9.5, rotate: -12 },
  { cx: 54, cy: 80, rx: 3.2, ry: 8.5, rotate: 2 },
  { cx: 61, cy: 64, rx: 2.9, ry: 7.8, rotate: 18 },
];

const EmbossedMonogram = () => (
  <svg
    aria-hidden="true"
    className="h-full w-full"
    viewBox="0 0 240 210"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="pressed-paper-shadow" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="-1.4" dy="-1.4" stdDeviation="0.65" floodColor="#a3afb9" floodOpacity="0.45" />
        <feDropShadow dx="1.6" dy="1.8" stdDeviation="0.9" floodColor="#51616d" floodOpacity="0.48" />
      </filter>
      <filter id="raised-paper-highlight" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="-1" dy="-1" stdDeviation="0.55" floodColor="#aeb8c1" floodOpacity="0.7" />
        <feDropShadow dx="1.1" dy="1.1" stdDeviation="0.55" floodColor="#4f5e69" floodOpacity="0.5" />
      </filter>
      <linearGradient id="pressed-paper-fill" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor={PAPER_BLUE_LIGHT} />
        <stop offset="48%" stopColor="#73828f" />
        <stop offset="100%" stopColor="#64737f" />
      </linearGradient>
    </defs>

    <g filter="url(#pressed-paper-shadow)" opacity="0.82">
      <path
        d="M91 169C53 151 38 111 55 72C62 56 73 44 86 36"
        fill="none"
        stroke="url(#pressed-paper-fill)"
        strokeWidth="3.1"
        strokeLinecap="round"
      />
      <path
        d="M149 169C187 151 202 111 185 72C178 56 167 44 154 36"
        fill="none"
        stroke="url(#pressed-paper-fill)"
        strokeWidth="3.1"
        strokeLinecap="round"
      />
      <path
        d="M77 162C91 175 106 181 120 181C134 181 149 175 163 162"
        fill="none"
        stroke="url(#pressed-paper-fill)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {laurelLeaves.map((leaf, index) => (
        <ellipse
          key={"left-leaf-" + index}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.rx}
          ry={leaf.ry}
          fill="#7c8a96"
          transform={"rotate(" + leaf.rotate + " " + leaf.cx + " " + leaf.cy + ")"}
        />
      ))}
      {laurelLeaves.map((leaf, index) => {
        const cx = 240 - leaf.cx;
        return (
          <ellipse
            key={"right-leaf-" + index}
            cx={cx}
            cy={leaf.cy}
            rx={leaf.rx}
            ry={leaf.ry}
            fill="#7c8a96"
            transform={"rotate(" + -leaf.rotate + " " + cx + " " + leaf.cy + ")"}
          />
        );
      })}

      <path
        d="M61 151C50 154 42 160 36 170M51 128C40 129 31 134 24 143M48 104C37 101 27 103 18 110M55 78C45 72 35 70 25 73M68 58C62 48 55 42 45 38"
        fill="none"
        stroke="#7c8a96"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M179 151C190 154 198 160 204 170M189 128C200 129 209 134 216 143M192 104C203 101 213 103 222 110M185 78C195 72 205 70 215 73M172 58C178 48 185 42 195 38"
        fill="none"
        stroke="#7c8a96"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>

    <text
      x="120"
      y="112"
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#788692"
      filter="url(#raised-paper-highlight)"
      style={{
        fontFamily: "var(--font-script)",
        fontSize: 62,
        fontWeight: 400,
        letterSpacing: "-0.08em",
      }}
    >
      IM
    </text>
  </svg>
);

const EnvelopeCard = ({ onOpen, onInteraction }: EnvelopeCardProps) => {
  const [isOpening, setIsOpening] = useState(false);

  const openEnvelope = () => {
    if (isOpening) return;
    onInteraction();
    setIsOpening(true);
    setTimeout(onOpen, 2600);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openEnvelope();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 cursor-pointer overflow-hidden"
      style={{ background: PAPER_BLUE_DARK, perspective: 1400 }}
      role="button"
      tabIndex={0}
      aria-label="Open wedding invitation envelope"
      onClick={openEnvelope}
      onKeyDown={handleKeyDown}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        className="absolute inset-0"
        style={paperTexture}
        animate={isOpening ? { scale: 1.025, filter: "brightness(1.05)" } : { scale: 1, filter: "brightness(1)" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(128deg, rgba(25,38,49,0.16), transparent 32%, transparent 66%, rgba(255,255,255,0.09)), radial-gradient(circle at 46% 58%, rgba(255,255,255,0.08), transparent 18%)",
        }}
      />

      <motion.div
        className="absolute inset-0 z-10"
        animate={isOpening ? { y: 60, scale: 0.985, opacity: 0.72 } : { y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-[63%]"
          style={{
            ...paperTexture,
            clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
            filter: "brightness(0.93)",
          }}
        />
        <div
          className="absolute left-0 top-[39%] h-[61%] w-[56%]"
          style={{
            ...paperTexture,
            clipPath: "polygon(0 0, 100% 54%, 0 100%)",
            filter: "brightness(0.9)",
          }}
        />
        <div
          className="absolute right-0 top-[39%] h-[61%] w-[56%]"
          style={{
            ...paperTexture,
            clipPath: "polygon(100% 0, 0 54%, 100% 100%)",
            filter: "brightness(0.96)",
          }}
        />
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0 39 L50 72 L100 39" fill="none" stroke="rgba(44,58,70,0.26)" strokeWidth="0.22" />
          <path d="M0 39.45 L50 72.45 L100 39.45" fill="none" stroke="rgba(177,189,198,0.23)" strokeWidth="0.14" />
          <path d="M0 100 L50 72 L100 100" fill="none" stroke="rgba(42,55,66,0.17)" strokeWidth="0.18" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-[53%] z-20 h-[58vh] w-[min(78vw,430px)] -translate-x-1/2 rounded-sm"
        style={{
          ...paperTexture,
          boxShadow: "0 28px 70px rgba(32,43,53,0.34), inset 0 1px 0 rgba(255,255,255,0.16)",
          filter: "brightness(1.03)",
        }}
        initial={{ y: 92, opacity: 0 }}
        animate={isOpening ? { y: -310, opacity: 1, rotate: -1.5 } : { y: 92, opacity: 0 }}
        transition={{ duration: 1.35, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="absolute inset-x-0 top-0 z-30 h-[73%]"
        style={{
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
        }}
        initial={false}
        animate={isOpening ? { rotateX: -164, y: -22 } : { rotateX: 0, y: 0 }}
        transition={{ duration: 1.25, ease: [0.2, 0.75, 0.25, 1] }}
      >
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            ...paperTexture,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            backfaceVisibility: "hidden",
            boxShadow: "inset 0 -18px 40px rgba(47,61,72,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(142deg, rgba(255,255,255,0.13), transparent 34%, rgba(47,61,72,0.18) 78%), radial-gradient(circle at 52% 68%, rgba(255,255,255,0.08), transparent 15%)",
            }}
          />
          <div
            className="absolute left-1/2 top-[58%] h-[26vmin] max-h-44 min-h-28 w-[30vmin] min-w-32 max-w-52 -translate-x-1/2 -translate-y-1/2 opacity-95"
            style={{
              transform: "translate(-50%, -50%) rotate(-2deg)",
            }}
          >
            <EmbossedMonogram />
          </div>
        </div>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 z-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,22,31,0.08), transparent 30%, rgba(18,27,36,0.16)), linear-gradient(105deg, rgba(255,255,255,0.08), transparent 42%)",
        }}
      />

      <AnimatePresence>
        {isOpening && (
          <motion.div
            className="fixed inset-0 z-[100]"
            style={{ background: "hsl(var(--ivory))" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.95, duration: 0.75 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnvelopeCard;
