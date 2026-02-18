import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import envelopeTexture from "@/assets/envelope-texture.jpg";
import waxSeal from "@/assets/wax-seal.png";

interface EnvelopeCardProps {
  onOpen: () => void;
}

const EnvelopeCard = ({ onOpen }: EnvelopeCardProps) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(onOpen, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream"
      onClick={handleClick}
    >
      <div className="relative w-[320px] h-[460px] cursor-pointer" style={{ perspective: "1200px" }}>
        {/* Envelope body */}
        <div className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl">
          <img
            src={envelopeTexture}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Inner card peek */}
        <motion.div
          className="absolute left-[10%] right-[10%] top-[15%] bottom-[10%] bg-cream rounded shadow-inner flex items-center justify-center"
          animate={isOpening ? { y: -200, opacity: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        >
          <div className="text-center px-4">
            <p className="font-heading text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">
              You're Invited
            </p>
            <h2 className="font-display text-4xl text-foreground leading-tight">
              Youssef
            </h2>
            <p className="font-heading text-xl text-sage my-1">&</p>
            <h2 className="font-display text-4xl text-foreground leading-tight">
              Mayssa
            </h2>
            <p className="font-heading text-sm text-muted-foreground mt-4 tracking-widest uppercase">
              September 6, 2025
            </p>
          </div>
        </motion.div>

        {/* Envelope flap (triangle) */}
        <motion.div
          className="absolute left-0 right-0 top-0 origin-top overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
          animate={isOpening ? { rotateX: 180 } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div
            className="w-full h-[230px] relative"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          >
            <img
              src={envelopeTexture}
              alt=""
              className="w-full h-full object-cover brightness-95"
            />
          </div>
        </motion.div>

        {/* Wax seal */}
        <motion.div
          className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 z-10"
          animate={isOpening ? { scale: 0, opacity: 0, rotate: 45 } : {}}
          transition={{ duration: 0.5, ease: "easeIn" }}
        >
          <img
            src={waxSeal}
            alt="Wax seal"
            className="w-24 h-24 object-contain drop-shadow-lg"
          />
        </motion.div>

        {/* Tap hint */}
        <AnimatePresence>
          {!isOpening && (
            <motion.p
              className="absolute -bottom-12 left-0 right-0 text-center font-heading text-sm text-muted-foreground tracking-widest uppercase animate-pulse-soft"
              exit={{ opacity: 0 }}
            >
              Tap to Open
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Fade out overlay */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            className="fixed inset-0 bg-cream z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnvelopeCard;
