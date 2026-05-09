import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─── All couple photos ───────────────────────────────────────────────── */
import p1 from "@/assets/IMG_2742.webp";
import p2 from "@/assets/IMG_2747.webp";
import p3 from "@/assets/IMG_2749.webp";
import p4 from "@/assets/IMG_2751.webp";
import p5 from "@/assets/IMG_2756.webp";
import p6 from "@/assets/IMG_2757.webp";
import p7 from "@/assets/IMG_2741.webp";
import p8 from "@/assets/IMG_2745.webp";

const SLIDES = [
  { src: p1, alt: "Bob & Marianne" },
  { src: p2, alt: "Bob & Marianne" },
  { src: p3, alt: "Bob & Marianne" },
  { src: p4, alt: "Bob & Marianne" },
  { src: p5, alt: "Bob & Marianne" },
  { src: p6, alt: "Bob & Marianne" },
  { src: p7, alt: "Bob & Marianne" },
  { src: p8, alt: "Bob & Marianne" },
];

const PhotoGallery = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = SLIDES.length;

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + total) % total);
    resetInterval();
  };

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % total);
    }, 4500);
  };

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.changedTouches[0].screenX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 48) navigate(diff > 0 ? 1 : -1);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {/* Slide container — large */}
      <div
        className="relative overflow-hidden rounded-sm shadow-xl"
        style={{ height: "min(82vw, 640px)" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            className="absolute inset-0"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <img
              src={SLIDES[current].src}
              alt={SLIDES[current].alt}
              className="w-full h-full object-cover"
              decoding="async"
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next */}
        {[
          { dir: -1, icon: <ChevronLeft className="w-5 h-5" />, pos: "left-3" },
          { dir:  1, icon: <ChevronRight className="w-5 h-5" />, pos: "right-3" },
        ].map(({ dir, icon, pos }) => (
          <button
            key={dir}
            onClick={() => navigate(dir)}
            className={`absolute ${pos} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110`}
            style={{ background: "rgba(255,255,255,0.82)", color: "hsl(var(--dusty-blue-dark))" }}
            aria-label={dir > 0 ? "Next" : "Previous"}
          >
            {icon}
          </button>
        ))}

        {/* Slide counter */}
        <div
          className="absolute bottom-3 right-4"
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.7)",
            background: "rgba(0,0,0,0.25)",
            padding: "3px 8px",
            borderRadius: 2,
          }}
        >
          {current + 1} / {total}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 22 : 6,
              height: 6,
              background: i === current ? "hsl(var(--dusty-blue))" : "hsl(var(--dusty-blue-pale))",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PhotoGallery;
