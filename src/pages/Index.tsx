import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EnvelopeCard from "@/components/EnvelopeCard";
import WeddingDetails from "@/components/WeddingDetails";
import MusicPlayer from "@/components/MusicPlayer";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const musicStartRef = useRef<(() => void) | null>(null);

  const handleOpen = () => {
    setIsOpen(true);
    /* Start YouTube music after user interaction (envelope click) */
    setTimeout(() => musicStartRef.current?.(), 200);
  };

  return (
    <>
      <MusicPlayer startRef={musicStartRef} />
      <AnimatePresence>
        {!isOpen && <EnvelopeCard onOpen={handleOpen} />}
      </AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          <WeddingDetails />
        </motion.div>
      )}
    </>
  );
};

export default Index;
