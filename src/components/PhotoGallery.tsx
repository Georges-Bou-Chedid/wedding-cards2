import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
   CAROUSEL IMAGES  —  5 slots.
   Replace the `src` values with your actual image URLs.
   Keep `placeholder: true` until you have the real image; the placeholder
   tile will render in its place so the layout is preserved.
───────────────────────────────────────────────────────────────────────── */
const SLIDES: { src: string; alt: string; placeholder?: boolean }[] = [
  { src: "", alt: "Celebration photo 1", placeholder: true },
  { src: "", alt: "Celebration photo 2", placeholder: true },
  { src: "", alt: "Celebration photo 3", placeholder: true },
  { src: "", alt: "Celebration photo 4", placeholder: true },
  { src: "", alt: "Celebration photo 5", placeholder: true },
];

const PlaceholderSlide = ({ index }: { index: number }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-3"
    style={{ background: "hsl(var(--dusty-blue-pale))" }}
  >
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="hsl(var(--dusty-blue-dark))" strokeWidth="1" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="hsl(var(--dusty-blue-dark))" strokeWidth="1" />
      <polyline points="21 15 16 10 5 21" stroke="hsl(var(--dusty-blue-dark))" strokeWidth="1" />
    </svg>
    <p
      style={{
        fontFamily: "'Montserrat',sans-serif",
        fontSize: "0.6rem",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: "hsl(var(--dusty-blue-dark))",
      }}
    >
      Photo {index + 1}
    </p>
  </div>
);

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

  /* Touch / swipe support */
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 48) navigate(diff > 0 ? 1 : -1);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 320 : -320, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -320 : 320, opacity: 0 }),
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {/* Slide container */}
      <div
        className="relative overflow-hidden rounded-sm"
        style={{ height: "min(58vw, 440px)" }}
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
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            {SLIDES[current].placeholder || !SLIDES[current].src ? (
              <PlaceholderSlide index={current} />
            ) : (
              <img
                src={SLIDES[current].src}
                alt={SLIDES[current].alt}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next buttons */}
        {[
          { dir: -1, icon: <ChevronLeft className="w-5 h-5" />, side: "left-3" },
          { dir: 1, icon: <ChevronRight className="w-5 h-5" />, side: "right-3" },
        ].map(({ dir, icon, side }) => (
          <button
            key={dir}
            onClick={() => navigate(dir)}
            className={`absolute ${side} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110`}
            style={{ background: "rgba(255,255,255,0.82)", color: "hsl(var(--dusty-blue-dark))" }}
            aria-label={dir > 0 ? "Next photo" : "Previous photo"}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background:
                i === current
                  ? "hsl(var(--dusty-blue))"
                  : "hsl(var(--dusty-blue-pale))",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PhotoGallery;
