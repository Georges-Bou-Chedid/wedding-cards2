import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import envelopeTexture from "@/assets/envelope-texture.jpg";
import waxSeal from "@/assets/wax-seal.png";
import floralCorner from "@/assets/floral-corner.jpeg";

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
      {/* Subtle floral background pattern */}
      <div className="absolute inset-0 opacity-[0.06]">
        <img src={floralCorner} alt="" className="absolute top-0 left-0 w-64 h-64 object-contain" />
        <img src={floralCorner} alt="" className="absolute top-0 right-0 w-64 h-64 object-contain scale-x-[-1]" />
        <img src={floralCorner} alt="" className="absolute bottom-0 left-0 w-64 h-64 object-contain scale-y-[-1]" />
        <img src={floralCorner} alt="" className="absolute bottom-0 right-0 w-64 h-64 object-contain scale-[-1]" />
      </div>

      <div className="relative w-[320px] h-[460px] cursor-pointer" style={{ perspective: "1200px" }}>
        {/* Envelope body — dusty blue */}
        <div className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl bg-dusty-blue">
          <div className="absolute inset-0 bg-gradient-to-b from-dusty-blue/90 to-dusty-blue" />
        </div>

        {/* Inner card with blue toile floral */}
        <motion.div
          className="absolute left-[8%] right-[8%] top-[12%] bottom-[8%] bg-cream rounded shadow-inner overflow-hidden"
          animate={isOpening ? { y: -200, opacity: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        >
          {/* Floral border frame */}
          <img
            src={envelopeTexture}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 flex items-center justify-center h-full px-4">
            <div className="text-center">
              <p className="font-heading text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">
                You're Invited
              </p>
              <h2 className="font-display text-4xl text-primary leading-tight">
                Bob
              </h2>
              <p className="font-heading text-xl text-accent my-1">&</p>
              <h2 className="font-display text-4xl text-primary leading-tight">
                Marianne
              </h2>
              <p className="font-heading text-sm text-muted-foreground mt-4 tracking-widest uppercase">
                July 12, 2026
              </p>
            </div>
          </div>
        </motion.div>

        {/* Envelope flap (triangle) — dusty blue */}
        <motion.div
          className="absolute left-0 right-0 top-0 origin-top overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
          animate={isOpening ? { rotateX: 180 } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div
            className="w-full h-[230px] relative bg-dusty-blue"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          >
            {/* Floral liner inside flap */}
            <img
              src={envelopeTexture}
              alt=""
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
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
            className="w-24 h-24 object-contain drop-shadow-lg rounded-full"
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
