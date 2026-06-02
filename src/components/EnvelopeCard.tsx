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

const wreathLeaves = [
  { cx: 80, cy: 160, rx: 2.4, ry: 7.2, rotate: -56 },
  { cx: 69, cy: 151, rx: 2.2, ry: 6.8, rotate: -48 },
  { cx: 61, cy: 139, rx: 2.1, ry: 6.4, rotate: -39 },
  { cx: 56, cy: 126, rx: 2, ry: 6, rotate: -29 },
  { cx: 53, cy: 112, rx: 1.9, ry: 5.7, rotate: -17 },
  { cx: 53, cy: 98, rx: 1.8, ry: 5.4, rotate: -4 },
  { cx: 56, cy: 84, rx: 1.7, ry: 5.1, rotate: 10 },
  { cx: 62, cy: 71, rx: 1.65, ry: 4.8, rotate: 23 },
  { cx: 71, cy: 59, rx: 1.55, ry: 4.5, rotate: 36 },
  { cx: 82, cy: 49, rx: 1.45, ry: 4.1, rotate: 49 },
  { cx: 89, cy: 39, rx: 1.3, ry: 3.6, rotate: 64 },
];

const innerLeaves = [
  { cx: 87, cy: 151, rx: 1.7, ry: 5.4, rotate: 36 },
  { cx: 75, cy: 137, rx: 1.6, ry: 5, rotate: 27 },
  { cx: 68, cy: 121, rx: 1.5, ry: 4.7, rotate: 14 },
  { cx: 66, cy: 105, rx: 1.45, ry: 4.3, rotate: 0 },
  { cx: 69, cy: 89, rx: 1.35, ry: 4, rotate: -14 },
  { cx: 75, cy: 74, rx: 1.3, ry: 3.7, rotate: -28 },
  { cx: 84, cy: 61, rx: 1.2, ry: 3.4, rotate: -41 },
];

const budSprigs = [
  "M75 157C66 164 58 168 48 170",
  "M64 145C53 150 45 157 38 166",
  "M56 130C44 130 35 136 29 146",
  "M53 111C41 108 32 111 23 119",
  "M57 89C47 82 38 79 28 82",
  "M67 67C61 57 53 51 43 48",
];

const budDots = [
  { cx: 48, cy: 170, r: 1.65 },
  { cx: 42, cy: 166, r: 1.25 },
  { cx: 38, cy: 166, r: 1.45 },
  { cx: 31, cy: 146, r: 1.55 },
  { cx: 26, cy: 119, r: 1.65 },
  { cx: 32, cy: 82, r: 1.55 },
  { cx: 45, cy: 49, r: 1.35 },
  { cx: 73, cy: 166, r: 1.15 },
  { cx: 57, cy: 153, r: 1.1 },
  { cx: 52, cy: 72, r: 1.05 },
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
        <feDropShadow dx="-1.1" dy="-1.1" stdDeviation="0.5" floodColor="#a9b5be" floodOpacity="0.48" />
        <feDropShadow dx="1.25" dy="1.45" stdDeviation="0.62" floodColor="#52616c" floodOpacity="0.5" />
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

    <g filter="url(#pressed-paper-shadow)" opacity="0.9">
      <path
        d="M88 168C62 158 50 130 54 101C58 72 72 47 96 34"
        fill="none"
        stroke="url(#pressed-paper-fill)"
        strokeWidth="2.05"
        strokeLinecap="round"
      />
      <path
        d="M152 168C178 158 190 130 186 101C182 72 168 47 144 34"
        fill="none"
        stroke="url(#pressed-paper-fill)"
        strokeWidth="2.05"
        strokeLinecap="round"
      />
      <path
        d="M78 160C91 177 106 184 120 184C134 184 149 177 162 160"
        fill="none"
        stroke="url(#pressed-paper-fill)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      {wreathLeaves.map((leaf, index) => (
        <ellipse
          key={"left-outer-leaf-" + index}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.rx}
          ry={leaf.ry}
          fill="#7d8b97"
          transform={"rotate(" + leaf.rotate + " " + leaf.cx + " " + leaf.cy + ")"}
        />
      ))}
      {innerLeaves.map((leaf, index) => (
        <ellipse
          key={"left-inner-leaf-" + index}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.rx}
          ry={leaf.ry}
          fill="#7d8b97"
          transform={"rotate(" + leaf.rotate + " " + leaf.cx + " " + leaf.cy + ")"}
        />
      ))}
      <g transform="translate(240 0) scale(-1 1)">
        {wreathLeaves.map((leaf, index) => (
          <ellipse
            key={"right-outer-leaf-" + index}
            cx={leaf.cx}
            cy={leaf.cy}
            rx={leaf.rx}
            ry={leaf.ry}
            fill="#7d8b97"
            transform={"rotate(" + leaf.rotate + " " + leaf.cx + " " + leaf.cy + ")"}
          />
        ))}
        {innerLeaves.map((leaf, index) => (
          <ellipse
            key={"right-inner-leaf-" + index}
            cx={leaf.cx}
            cy={leaf.cy}
            rx={leaf.rx}
            ry={leaf.ry}
            fill="#7d8b97"
            transform={"rotate(" + leaf.rotate + " " + leaf.cx + " " + leaf.cy + ")"}
          />
        ))}
      </g>

      {budSprigs.map((d, index) => (
        <path
          key={"left-bud-sprig-" + index}
          d={d}
          fill="none"
          stroke="#7d8b97"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
      ))}
      <g transform="translate(240 0) scale(-1 1)">
        {budSprigs.map((d, index) => (
          <path
            key={"right-bud-sprig-" + index}
            d={d}
            fill="none"
            stroke="#7d8b97"
            strokeWidth="1.15"
            strokeLinecap="round"
          />
        ))}
      </g>

      {budDots.map((dot, index) => (
        <circle key={"left-bud-" + index} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#7f8d99" />
      ))}
      <g transform="translate(240 0) scale(-1 1)">
        {budDots.map((dot, index) => (
          <circle key={"right-bud-" + index} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#7f8d99" />
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
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.68"
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
