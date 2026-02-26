import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import photo1 from "@/assets/wedding-couple-1.jpg";
import photo2 from "@/assets/wedding-couple-2.jpg";
import photo3 from "@/assets/wedding-couple-3.jpg";

const photos = [photo1, photo2, photo3];
const captions = [
  "Walking through the garden",
  "Together, forever",
  "Our first dance",
];

const PhotoGallery = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + photos.length) % photos.length);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <motion.div
      className="text-center py-16 px-6 max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <h2 className="font-heading text-3xl text-foreground mb-8 tracking-wide">
        Our Moments
      </h2>

      <div className="relative overflow-hidden rounded-lg aspect-square max-w-lg mx-auto border-2 border-toile-light/30">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={current}
            src={photos[current]}
            alt={captions[current]}
            className="w-full h-full object-cover rounded-lg"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </AnimatePresence>

        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy/30 backdrop-blur-sm text-cream flex items-center justify-center hover:bg-navy/50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy/30 backdrop-blur-sm text-cream flex items-center justify-center hover:bg-navy/50 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <p className="font-heading text-sm text-muted-foreground mt-4 italic">
        {captions[current]}
      </p>

      <div className="flex justify-center gap-2 mt-4">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? "bg-primary" : "bg-toile-light"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PhotoGallery;
