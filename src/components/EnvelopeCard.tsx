import { useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import envelopePhoto from "@/assets/Untitled-2.png";

interface EnvelopeCardProps {
  onOpen: () => void;
  onInteraction: () => void;
}

const imageLayerStyle = {
  backgroundImage: "url(" + envelopePhoto + ")",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const EnvelopeCard = ({ onOpen, onInteraction }: EnvelopeCardProps) => {
  const [isOpening, setIsOpening] = useState(false);

  const openEnvelope = () => {
    if (isOpening) return;
    onInteraction();
    setIsOpening(true);
    setTimeout(onOpen, 700);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openEnvelope();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 cursor-pointer overflow-hidden bg-[#667582]"
      style={{ perspective: 1400 }}
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
        style={imageLayerStyle}
        animate={isOpening ? { scale: 1.035, filter: "brightness(1.06)" } : { scale: 1, filter: "brightness(1)" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="absolute inset-0 z-10"
        style={{
          ...imageLayerStyle,
          clipPath: "polygon(0 0, 100% 0, 100% 44%, 50% 70%, 0 44%)",
          transformOrigin: "50% 42%",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          boxShadow: "0 24px 60px rgba(24,35,45,0.28)",
        }}
        initial={false}
        animate={
          isOpening
            ? { rotateX: -72, y: -70, scale: 1.02, opacity: 0.82, filter: "brightness(1.1)" }
            : { rotateX: 0, y: 0, scale: 1, opacity: 1, filter: "brightness(1)" }
        }
        transition={{ duration: 1.15, ease: [0.2, 0.75, 0.25, 1] }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          background:
            "radial-gradient(circle at 47% 45%, rgba(255,255,255,0.05), transparent 20%), linear-gradient(180deg, rgba(9,18,27,0.06), transparent 35%, rgba(13,24,34,0.18))",
        }}
        animate={isOpening ? { opacity: 0.55 } : { opacity: 1 }}
        transition={{ duration: 0.9 }}
      />
    </motion.div>
  );
};

export default EnvelopeCard;
