import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isDismissed, setIsDismissed] = useState(false);

  const handleOpen = () => {
    if (isDismissed) return;
    onInteraction(); // Seamlessly starts the music
    setIsDismissed(true);
    setTimeout(onOpen, 500); 
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          className="fixed inset-0 z-50 cursor-pointer overflow-hidden bg-[#667582]"
          role="button"
          tabIndex={0}
          aria-label="Open wedding invitation envelope"
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Main Envelope Image */}
          <div className="absolute inset-0 z-0" style={imageLayerStyle} />

          {/* Ambient Lighting Overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.01), transparent 45%), linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.08))",
            }}
          />

          {/* Floating Clean Typography (No Background Box) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-14 z-20 flex justify-center px-6">
            <motion.div 
              className="text-center text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.36em]">
                Tap to open
              </p>
              <p className="mt-1.5 text-sm font-serif italic tracking-wide text-white/90">
                the invitation
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnvelopeCard;