import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import RSVPForm from "./RSVPForm";
import GiftRegistry from "./GiftRegistry";
import PhotoGallery from "./PhotoGallery";
import CountdownTimer from "./CountdownTimer";

/*
 * ─── BACKGROUND PHOTOS ────────────────────────────────────────────────────────
 * Replace these files in  src/assets/  to use your own photos:
 *   wedding-couple-1.jpg  →  hero bg  (rename your _2745 photo to this)
 *   wedding-couple-2.jpg  →  date/countdown bg
 *   wedding-couple-3.jpg  →  footer bg
 * ─────────────────────────────────────────────────────────────────────────────
 */
import heroBg   from "@/assets/IMG_2745.webp";   // chapel exterior — _2745
import dateBg   from "@/assets/IMG_2741.webp";   // date section
import footerBg from "@/assets/IMG_2750.webp";   // footer
import giftBg   from "@/assets/IMG_2000.webp";

/* ─── Scroll-reveal ─────────────────────────────────────────────────────── */
const useScrollReveal = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("in-view"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
};

const FadeUp = ({
  children, delay = 0, className = "",
}: {
  children: React.ReactNode; delay?: number; className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref as React.RefObject<HTMLElement>);
  return (
    <div ref={ref} className={`animate-fade-up ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

/* ─── Ornamental divider ────────────────────────────────────────────────── */
const Ornament = ({ light = false }: { light?: boolean }) => (
  <div className="ornament my-5">
    <div className="ornament-line" style={light ? { background: "rgba(255,255,255,0.3)" } : {}} />
    <div className="ornament-diamond" style={light ? { background: "rgba(255,255,255,0.6)" } : {}} />
    <div className="ornament-line" style={light ? { background: "rgba(255,255,255,0.3)" } : {}} />
  </div>
);

/* ─── Map link button ───────────────────────────────────────────────────── */
const MapBtn = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 border rounded-sm px-5 py-2.5 transition-all duration-300"
    style={{
      fontFamily: "'Montserrat',sans-serif",
      fontSize: "0.62rem",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      borderColor: "hsl(var(--dusty-blue))",
      color: "hsl(var(--dusty-blue))",
    }}
    onMouseEnter={(e) => {
      const a = e.currentTarget as HTMLAnchorElement;
      a.style.background = "hsl(var(--dusty-blue))";
      a.style.color = "white";
    }}
    onMouseLeave={(e) => {
      const a = e.currentTarget as HTMLAnchorElement;
      a.style.background = "transparent";
      a.style.color = "hsl(var(--dusty-blue))";
    }}
  >
    <MapPin size={13} />
    {children}
  </a>
);

/* ─── Full-bleed photo section (no fixed attachment — mobile performance) ─ */
const FullBleed = ({
  src, fallbackColor, overlay = "rgba(0,0,0,0.38)", minH = "100vh", children,
}: {
  src: string; fallbackColor: string; overlay?: string; minH?: string; children: React.ReactNode;
}) => (
  <section
    className="relative flex items-center justify-center"
    style={{
      minHeight: minH,
      backgroundImage: src ? `url('${src}')` : undefined,
      backgroundColor: src ? undefined : fallbackColor,
      backgroundSize: "cover",
      backgroundPosition: "center top",
    }}
  >
    <div className="absolute inset-0" style={{ background: overlay }} />
    <div className="relative z-10 w-full">{children}</div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   WEDDING DETAILS
═══════════════════════════════════════════════════════════════════════════ */
const WeddingDetails = () => (
  <div className="overflow-x-hidden" style={{ background: "hsl(var(--cream))" }}>

    {/* ── 1. HERO — Arabic verse ── */}
    <FullBleed src={heroBg} fallbackColor="hsl(var(--dusty-blue-dark))" overlay="rgba(28,38,50,0.50)">
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-24 max-w-2xl mx-auto">
        <FadeUp>
          <p
            className="font-arabic2 text-white leading-[2.2]"
            dir="rtl" lang="ar"
            style={{ fontSize: "clamp(1.2rem,3.6vw,1.8rem)", lineHeight: "2.4",
              letterSpacing: "0.02em", textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
          >
            أَمَّا نَحنُ فإِنَّنا نُحِبّ،
            لأَنَّه أَحَبَّنا قَبلَ أَن نُحِبَّه
          </p>
        </FadeUp>
        <FadeUp delay={150}>
          <p className="font-arabic2 text-white/65 mt-3" dir="rtl" lang="ar" style={{ fontSize: "0.95rem" }}>
            يوحنّا الأولى 4 : 19
          </p>
        </FadeUp>
      </div>
    </FullBleed>

    {/* ── 2. INVITATION DETAILS (swapped to come before date) ── */}
    <section className="py-24 px-6 text-center" style={{ background: "white" }}>
      <div className="max-w-xl mx-auto">
        <FadeUp>
          <Ornament />
        </FadeUp>

        <FadeUp delay={80}>
          <p
            className="text-foreground tracking-[0.2em] uppercase leading-loose"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.85rem,2vw,1.05rem)" }}
          >
            Mansour &amp; Caroline Abi Khalil
          </p>
        </FadeUp>

        <FadeUp delay={140}>
          <p
            className="text-muted-foreground tracking-[0.3em] uppercase my-2"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "0.82rem" }}
          >
            Along With
          </p>
        </FadeUp>

        <FadeUp delay={200}>
          <p
            className="text-foreground tracking-[0.2em] uppercase leading-loose"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.85rem,2vw,1.05rem)" }}
          >
            Youssef &amp; Nawal Mouzaya
          </p>
        </FadeUp>

        <FadeUp delay={260}>
          <Ornament />
        </FadeUp>

        <FadeUp delay={320}>
          <p
            className="text-muted-foreground italic my-4"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.9rem,2.2vw,1.1rem)" }}
          >
            Request the Honor of Your Presence<br />
            at the Wedding of Their Son and Daughter
          </p>
        </FadeUp>

        {/* Couple names — Amelia (Bodoni Moda) + Great Vibes */}
        <FadeUp delay={380}>
          <div className="my-8 flex items-center justify-center gap-4 flex-wrap">
            <p
              className="text-foreground leading-none"
              style={{
                fontFamily: "var(--font-script)",
                fontWeight: 400,
                fontSize: "clamp(2rem, 6vw, 2.2rem)",
              }}
            >
              Ibrahim
            </p>
            <p
              className="text-dusty-blue"
              style={{ 
                fontFamily: "var(--font-script)", 
                fontSize: "clamp(1.5rem, 4vw, 1.4rem)",
                marginTop: "0.5rem" 
              }}
            >
              &amp;
            </p>
            <p
              className="text-foreground leading-none"
              style={{ 
                fontFamily: "var(--font-script)", 
                fontWeight: 400,
                fontSize: "clamp(2rem, 6vw, 2.2rem)" 
              }}
            >
              Marianne
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={440}>
          <Ornament />
        </FadeUp>
      </div>
    </section>

    {/* ── 3. DATE + COUNTDOWN (swapped — comes after invitation) ── */}
    <FullBleed
      src={dateBg}
      fallbackColor="hsl(212,25%,16%)"
      overlay="rgba(18, 31, 48, 0.62)"
      minH="100vh"
    >
      {/* Using flex-col and justify-between to push the countdown to the bottom */}
      <div className="flex flex-col items-center justify-between min-h-screen text-center px-6 pt-32 pb-16">
        
        {/* Top Content: Date Section */}
        <div className="flex flex-col items-center">
          {/* Date Container — Flex Row */}
          <div className="flex flex-row items-baseline justify-center gap-4 flex-wrap">
            {/* Date — 12 */}
            <FadeUp delay={80}>
              <p style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                color: "white",
                lineHeight: 1,
                textShadow: "0 2px 20px rgba(0,0,0,0.35)",
              }}>
                12 .
              </p>
            </FadeUp>

            {/* Month — July */}
            <FadeUp delay={160}>
              <p style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                color: "white",
                lineHeight: 1,
                textShadow: "0 2px 20px rgba(0,0,0,0.35)",
              }}>
                07 .
              </p>
            </FadeUp>

            {/* Year — 2026 */}
            <FadeUp delay={220}>
              <p style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                color: "white",
                lineHeight: 1,
                textShadow: "0 2px 20px rgba(0,0,0,0.35)",
              }}>
                26
              </p>
            </FadeUp>
          </div>
        </div>

        {/* Bottom Content: Countdown */}
        <div className="w-full pb-10">
          <FadeUp delay={340}>
            <CountdownTimer targetDate="2026-07-12T18:00:00" variant="light" />
          </FadeUp>
        </div>

      </div>
    </FullBleed>

    {/* ── 4. VENUES — flat/open, no icons, no Lebanon, no date ── */}
    <section className="py-24 px-6 text-center" style={{ background: "hsl(var(--ivory))" }}>
      <div className="max-w-2xl mx-auto">
        <FadeUp>
          <p
            className="text-dusty-blue tracking-[0.35em] uppercase mb-2"
            style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem" }}
          >
            Join Us
          </p>
          <h2 className="text-foreground mb-12"
            style={{ fontFamily: "var(--font-amelia)", fontWeight: 300, fontSize: "clamp(2rem,6vw,3rem)", letterSpacing: "0.04em" }}>
            The Celebration
          </h2>
        </FadeUp>

        {/* Changed items-start to items-center to fix mobile centering */}
        <div className="flex flex-col sm:flex-row gap-14 sm:gap-8 justify-center items-center sm:items-start">
          {/* Ceremony */}
          <FadeUp delay={100} className="w-full flex-1 text-center">
            <p
              className="text-dusty-blue tracking-[0.32em] uppercase mb-3"
              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
            >
              Ceremony
            </p>
            <p style={{ fontFamily: "var(--font-amelia)", fontWeight: 300, fontSize: "clamp(1.4rem,4vw,1.9rem)", color: "hsl(var(--foreground))", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
              Our Lady of Peace Church
            </p>
            <p
              className="text-muted-foreground mb-5"
              style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "1rem" }}
            >
              Kfarhbab
            </p>
            <MapBtn href="https://maps.app.goo.gl/gcoSPSMQXzhSEZQC8?g_st=iw">
              Get Directions
            </MapBtn>
          </FadeUp>

          {/* Visual separator */}
          <div className="hidden sm:block self-stretch" style={{ width: 1, background: "hsl(var(--dusty-blue-pale))", minHeight: 120 }} />

          {/* Dinner Reception */}
          <FadeUp delay={200} className="w-full flex-1 text-center">
            <p
              className="text-dusty-blue tracking-[0.32em] uppercase mb-3"
              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
            >
              Dinner Reception
            </p>
            <p style={{ fontFamily: "var(--font-amelia)", fontWeight: 300, fontSize: "clamp(1.4rem,4vw,1.9rem)", color: "hsl(var(--foreground))", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
              Lavender Ville
            </p>
            <p
              className="text-muted-foreground mb-5"
              style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "1rem" }}
            >
              Fatqa
            </p>
            <MapBtn href="https://maps.app.goo.gl/ubdFZ9MWwvxb8YNc7?g_st=iw">
              Get Directions
            </MapBtn>
          </FadeUp>
        </div>
      </div>
    </section>

    {/* ── 5. BEFORE THE BIG DAY — no boxes, no icons, big carousel ── */}
    <section className="py-20 px-4 sm:px-6" style={{ background: "white" }}>
      <div className="max-w-4xl mx-auto text-center">
        <FadeUp>
          <p
            className="text-dusty-blue tracking-[0.35em] uppercase mb-2"
            style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem" }}
          >
            Celebrate With Us
          </p>
          <p
            className="text-muted-foreground italic max-w-md mx-auto mb-10"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem", lineHeight: 1.85 }}
          >
            Your presence would make our celebration more special as we gather with family and loved ones.
          </p>
        </FadeUp>

        {/* Larger carousel */}
        <FadeUp delay={100}>
          <PhotoGallery />
        </FadeUp>

        {/* Simple text links — no boxes, no icons, no family names */}
        <FadeUp delay={200}>
        {/* Changed flex-wrap to flex-nowrap to keep them on one line */}
        <div className="flex flex-nowrap gap-4 sm:gap-8 justify-center mt-12 w-full px-2">
          <div className="text-center flex-1 min-w-0">
            <p
              className="tracking-[0.2rem] sm:tracking-[0.28em] uppercase mb-3 whitespace-nowrap"
              style={{ 
                fontFamily: "'Montserrat',sans-serif", 
                fontSize: "clamp(0.5rem, 2.5vw, 0.58rem)", // Responsive font size
                color: "#1C2632" 
              }}
            >
              Bride's Home
            </p>
            <MapBtn href="https://maps.app.goo.gl/Gwi44WYGacXGHQsDA">
              Get Directions
            </MapBtn>
          </div>

          <div className="text-center flex-1 min-w-0">
            <p
              className="tracking-[0.2rem] sm:tracking-[0.28em] uppercase mb-3 whitespace-nowrap"
              style={{ 
                fontFamily: "'Montserrat',sans-serif", 
                fontSize: "clamp(0.5rem, 2.5vw, 0.58rem)", // Responsive font size
                color: "#1C2632" 
              }}
            >
              Groom's Home
            </p>
            <MapBtn href="https://maps.app.goo.gl/GdmJxyPFnDxENGs29">
              Get Directions
            </MapBtn>
          </div>
        </div>
      </FadeUp>
      </div>
    </section>

    {/* ── 6. WISH ACCOUNT ── */}
    <div className="w-full">
      {/* Photo part - reduced height to focus on the image */}
      <FullBleed 
        src={giftBg} 
        fallbackColor="hsl(var(--dusty-blue-dark))" 
        overlay="rgba(28,38,50,0.3)" 
        minH="45vh" 
      >
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: `url(${giftBg})`,
          backgroundSize: '100% auto', // This forces the width to fit 100% without zooming
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top', // Focuses on the top/center of the photo
          backgroundColor: 'hsl(var(--dusty-blue-dark))' // Fills gaps if the photo is short
        }} />
      </FullBleed>

      {/* Info part - solid background directly under the photo */}
      <section 
        className="py-16 px-6 text-center" 
        style={{ background: "hsl(var(--ivory))" }}
      >
        <GiftRegistry />
      </section>
    </div>

    {/* ── 7. RSVP ── */}
    <section style={{ background: "hsl(var(--ivory))" }}>
      <RSVPForm />
    </section>

    {/* ── 8. FOOTER ── */}
    <FullBleed src={footerBg} fallbackColor="hsl(212,30%,14%)" overlay="rgba(6,14,22,0.55)" minH="100vh">
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-20">
        <motion.p
          style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Together Forever
        </motion.p>
        <motion.p
          className="text-white"
          style={{ fontFamily: "var(--font-script)", fontSize: "clamp(2.2rem,12vw,2.2rem)", lineHeight: 1.05 }}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.3 }}
        >
          Ibrahim &amp; Marianne
        </motion.p>
        <motion.p
          className="text-white/55 mt-5 tracking-[0.42em] uppercase"
          style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.68rem" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.65 }}
        >
          12 · 07 · 2026
        </motion.p>
      </div>
    </FullBleed>
  </div>
);

export default WeddingDetails;
