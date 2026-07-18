import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coverPhoto from "@/assets/cover-couple.webp";

interface CoverPageProps {
  onOpen: () => void;
  onInteraction: () => void;
}

const CoverPage = ({ onOpen, onInteraction }: CoverPageProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleOpen = () => {
    if (isDismissed) return;
    onInteraction();
    setIsDismissed(true);
    setTimeout(onOpen, 500);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden bg-[#667582]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${coverPhoto})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.5) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-24 z-20 flex justify-center px-6">
            <motion.button
              type="button"
              onClick={handleOpen}
              onKeyDown={handleKeyDown}
              aria-label="Open the invitation"
              className="text-white border border-white/70 rounded-full px-8 py-3 uppercase tracking-[0.3em] text-[0.68rem] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              style={{ fontFamily: "'Montserrat',sans-serif" }}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              whileTap={{ scale: 0.95 }}
            >
              Open the Invitation
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CoverPage;
