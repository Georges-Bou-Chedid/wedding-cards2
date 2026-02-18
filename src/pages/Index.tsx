import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EnvelopeCard from "@/components/EnvelopeCard";
import WeddingDetails from "@/components/WeddingDetails";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isOpen && <EnvelopeCard onOpen={() => setIsOpen(true)} />}
      </AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <WeddingDetails />
        </motion.div>
      )}
    </>
  );
};

export default Index;
