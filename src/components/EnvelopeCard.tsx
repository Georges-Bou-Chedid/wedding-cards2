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

const branchLeaves = [
  { cx: 73, cy: 155, rx: 3.8, ry: 10.5, rotate: -52 },
  { cx: 63, cy: 143, rx: 3.5, ry: 9.5, rotate: -42 },
  { cx: 56, cy: 128, rx: 3.2, ry: 8.8, rotate: -30 },
  { cx: 52, cy: 112, rx: 3, ry: 8.2, rotate: -18 },
  { cx: 52, cy: 96, rx: 2.8, ry: 7.6, rotate: -6 },
  { cx: 55, cy: 80, rx: 2.6, ry: 7, rotate: 9 },
  { cx: 62, cy: 65, rx: 2.4, ry: 6.4, rotate: 22 },
  { cx: 72, cy: 52, rx: 2.2, ry: 5.8, rotate: 36 },
];

const sideSprigs = [
  "M69 150C55 153 46 160 39 170",
  "M58 131C44 131 34 137 27 148",
  "M53 108C39 104 29 107 20 116",
  "M58 84C47 76 37 73 27 77",
  "M71 60C65 49 57 43 46 39",
];

const flowerDots = [
  { cx: 38, cy: 170, r: 2.1 },
  { cx: 31, cy: 145, r: 1.8 },
  { cx: 22, cy: 116, r: 2 },
  { cx: 31, cy: 77, r: 1.9 },
  { cx: 47, cy: 39, r: 1.7 },
  { cx: 81, cy: 167, r: 1.6 },
  { cx: 66, cy: 70, r: 1.4 },
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
        <feDropShadow dx="-1.4" dy="-1.4" stdDeviation="0.65" floodColor="#a9b5be" floodOpacity="0.5" />
        <feDropShadow dx="1.7" dy="1.9" stdDeviation="0.8" floodColor="#52616c" floodOpacity="0.52" />
      </filter>
      <filter id="raised-paper-highlight" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="-1.2" dy="-1.2" stdDeviation="0.5" floodColor="#b3bec7" floodOpacity="0.78" />
        <feDropShadow dx="1.4" dy="1.5" stdDeviation="0.65" floodColor="#4c5a65" floodOpacity="0.55" />
      </filter>
      <linearGradient id="pressed-paper-fill" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor={PAPER_BLUE_LIGHT} />
        <stop offset="46%" stopColor="#778692" />
        <stop offset="100%" stopColor="#657480" />
      </linearGradient>
    </defs>

    <g filter="url(#pressed-paper-shadow)" opacity="0.86">
      <path
        d="M92 168C61 154 45 123 51 90C55 65 69 47 91 36"
        fill="none"
        stroke="url(#pressed-paper-fill)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M148 168C179 154 195 123 189 90C185 65 171 47 149 36"
        fill="none"
        stroke="url(#pressed-paper-fill)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M74 160C88 178 106 185 120 185C134 185 152 178 166 160"
        fill="none"
        stroke="url(#pressed-paper-fill)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {branchLeaves.map((leaf, index) => (
        <ellipse
          key={"left-leaf-" + index}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.rx}
          ry={leaf.ry}
          fill="#7d8b97"
          transform={"rotate(" + leaf.rotate + " " + leaf.cx + " " + leaf.cy + ")"}
        />
      ))}
      <g transform="translate(240 0) scale(-1 1)">
        {branchLeaves.map((leaf, index) => (
          <ellipse
            key={"right-leaf-" + index}
            cx={leaf.cx}
            cy={leaf.cy}
            rx={leaf.rx}
            ry={leaf.ry}
            fill="#7d8b97"
            transform={"rotate(" + leaf.rotate + " " + leaf.cx + " " + leaf.cy + ")"}
          />
        ))}
      </g>

      {sideSprigs.map((d, index) => (
        <path
          key={"left-sprig-" + index}
          d={d}
          fill="none"
          stroke="#7d8b97"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      ))}
      <g transform="translate(240 0) scale(-1 1)">
        {sideSprigs.map((d, index) => (
          <path
            key={"right-sprig-" + index}
            d={d}
            fill="none"
            stroke="#7d8b97"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        ))}
      </g>

      {flowerDots.map((dot, index) => (
        <circle key={"left-dot-" + index} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#7f8d99" />
      ))}
      <g transform="translate(240 0) scale(-1 1)">
        {flowerDots.map((dot, index) => (
          <circle key={"right-dot-" + index} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#7f8d99" />
        ))}
      </g>
    </g>

    <g filter="url(#raised-paper-highlight)">
      <text
        x="119"
        y="112"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#788692"
        style={{
          fontFamily: "var(--font-script)",
          fontSize: 68,
          fontWeight: 400,
          letterSpacing: "-0.16em",
        }}
      >
        BM
      </text>
      <path
        d="M103 128C112 135 130 134 139 124"
        fill="none"
        stroke="#778692"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.75"
      />
    </g>
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
