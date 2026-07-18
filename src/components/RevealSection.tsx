import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealSectionProps {
  backgroundImage: string;
  overlay?: string;
  children: ReactNode;
  className?: string;
  /**
   * Opt-in escape hatch for content-dense pages that can exceed 100dvh on
   * short viewports. When true, the section stretches its content wrapper
   * to fill the full section height instead of centering it, and the inner
   * wrapper becomes internally scrollable (overflow-y-auto) so overflow
   * scrolls within the page instead of being clipped symmetrically by
   * `overflow-hidden`. Defaults to false, which preserves the original
   * centered/clipped behavior for every other page.
   */
  scrollableContent?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

export const revealItemVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
};

export const RevealItem = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.div variants={revealItemVariants} className={className}>
    {children}
  </motion.div>
);

const RevealSection = ({
  backgroundImage,
  overlay = "rgba(0,0,0,0.42)",
  children,
  className = "",
  scrollableContent = false,
}: RevealSectionProps) => (
  <section
    className={`snap-start snap-always relative flex ${scrollableContent ? "items-stretch" : "items-center"} justify-center overflow-hidden ${className}`}
    style={{
      height: "100dvh",
      backgroundImage: `url('${backgroundImage}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="absolute inset-0" style={{ background: overlay }} />
    <motion.div
      className={`relative z-10 w-full px-6 text-center ${scrollableContent ? "overflow-y-auto max-h-full flex flex-col justify-center py-10" : ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.6 }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  </section>
);

export default RevealSection;
