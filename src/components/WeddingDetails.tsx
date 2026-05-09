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
            className="font-arabic text-white leading-[2.2]"
            dir="rtl" lang="ar"
            style={{ fontSize: "clamp(1.1rem,3.5vw,1.7rem)", textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
          >
            أَمَّا نَحنُ فإِنَّنا نُحِبّ،<br />
            لأَنَّه أَحَبَّنا قَبلَ أَن نُحِبَّه
          </p>
        </FadeUp>
        <FadeUp delay={150}>
          <p className="font-arabic text-white/65 mt-3" dir="rtl" lang="ar" style={{ fontSize: "0.95rem" }}>
            يوحنّا الأولى 4 : 19
          </p>
        </FadeUp>
        <FadeUp delay={320}>
          <div className="mt-10 flex flex-col items-center gap-1 text-white/40">
            <div className="w-px h-10 bg-white/25" />
          </div>
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
          <div className="my-8">
            <p
              className="text-foreground leading-none"
              style={{
                fontFamily: "var(--font-amelia)",
                fontWeight: 300,
                fontSize: "clamp(2.8rem,10vw,5.5rem)",
                letterSpacing: "0.08em",
              }}
            >
              Bob
            </p>
            <p
              className="text-dusty-blue"
              style={{ fontFamily: "'Great Vibes',cursive", fontSize: "clamp(2.2rem,7vw,3.8rem)" }}
            >
              &amp;
            </p>
            <p
              className="text-foreground leading-none"
              style={{ fontFamily: "'Great Vibes',cursive", fontSize: "clamp(3rem,10vw,5.5rem)" }}
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
      overlay="rgba(10,18,28,0.62)"
      minH="100vh"
    >
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-20">

        {/* Thin rule */}
        <FadeUp>
          <div style={{ width: 1, height: 56, background: "rgba(255,255,255,0.22)", margin: "0 auto 2.5rem" }} />
        </FadeUp>

        {/* Date — large number */}
        <FadeUp delay={80}>
          <p style={{
            fontFamily: "var(--font-amelia)",
            fontWeight: 300,
            fontSize: "clamp(6rem,24vw,14rem)",
            lineHeight: 0.88,
            letterSpacing: "-0.02em",
            color: "white",
            textShadow: "0 4px 40px rgba(0,0,0,0.5)",
          }}>
            12
          </p>
        </FadeUp>

        {/* Month in Great Vibes */}
        <FadeUp delay={160}>
          <p style={{
            fontFamily: "'Great Vibes',cursive",
            fontSize: "clamp(3rem,10vw,6rem)",
            color: "white",
            lineHeight: 1,
            marginTop: "-0.4rem",
            textShadow: "0 2px 20px rgba(0,0,0,0.35)",
          }}>
            July
          </p>
        </FadeUp>

        {/* Year */}
        <FadeUp delay={220}>
          <p style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 300,
            fontSize: "clamp(0.75rem,2vw,0.95rem)",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
            marginTop: "0.8rem",
          }}>
            2026
          </p>
        </FadeUp>

        {/* Thin rule */}
        <FadeUp delay={280}>
          <div style={{ width: 1, height: 44, background: "rgba(255,255,255,0.22)", margin: "2rem auto" }} />
        </FadeUp>

        {/* Countdown */}
        <FadeUp delay={340}>
          <CountdownTimer targetDate="2026-07-12T18:00:00" variant="light" />
        </FadeUp>

        {/* Thin bottom rule */}
        <FadeUp delay={400}>
          <div style={{ width: 1, height: 56, background: "rgba(255,255,255,0.22)", margin: "2.5rem auto 0" }} />
        </FadeUp>
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

        <div className="flex flex-col sm:flex-row gap-14 sm:gap-8 justify-center items-start">
          {/* Ceremony */}
          <FadeUp delay={100} className="flex-1 text-center">
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

          {/* Dinner */}
          <FadeUp delay={200} className="flex-1 text-center">
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
          <h2
            className="text-foreground mb-4"
            style={{ fontFamily: "var(--font-amelia)", fontWeight: 300, fontSize: "clamp(2rem,6vw,3rem)", letterSpacing: "0.04em" }}
          >
            Before the Big Day
          </h2>
          <p
            className="text-muted-foreground italic max-w-md mx-auto mb-10"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem", lineHeight: 1.85 }}
          >
            We warmly invite you to join us as we celebrate this joyous occasion
            together with family and loved ones.
          </p>
        </FadeUp>

        {/* Larger carousel */}
        <FadeUp delay={100}>
          <PhotoGallery />
        </FadeUp>

        {/* Simple text links — no boxes, no icons, no family names */}
        <FadeUp delay={200}>
          <div className="flex flex-wrap gap-8 justify-center mt-12">
            <div className="text-center">
              <p
                className="text-dusty-blue tracking-[0.28em] uppercase mb-3"
                style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
              >
                Bride's Home
              </p>
              <MapBtn href="https://maps.app.goo.gl/7x4cVWXSSjAZTStX9?g_st=aw">
                Get Directions
              </MapBtn>
            </div>
            <div className="text-center">
              <p
                className="text-dusty-blue tracking-[0.28em] uppercase mb-3"
                style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
              >
                Groom's Home
              </p>
              <MapBtn href="https://www.google.com/maps?q=34.010582,35.654316">
                Get Directions
              </MapBtn>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>

    {/* ── 6. WISH ACCOUNT ── */}
    <section
      className="relative py-20 px-6 text-center overflow-hidden"
      style={{ background: "hsl(var(--dusty-blue))" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%,rgba(255,255,255,0.06) 0%,transparent 60%),radial-gradient(ellipse at 70% 50%,rgba(255,255,255,0.04) 0%,transparent 60%)",
        }}
      />
      <GiftRegistry />
    </section>

    {/* ── 7. RSVP ── */}
    <section style={{ background: "hsl(var(--ivory))" }}>
      <RSVPForm />
    </section>

    {/* ── 8. FOOTER ── */}
    <FullBleed src={footerBg} fallbackColor="hsl(212,30%,14%)" overlay="rgba(6,14,22,0.55)" minH="100vh">
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-20">
        <motion.div
          style={{ width: 1, height: 64, background: "rgba(255,255,255,0.2)", margin: "0 auto 2rem" }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        />
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
          style={{ fontFamily: "'Great Vibes',cursive", fontSize: "clamp(3.5rem,12vw,7rem)", lineHeight: 1.05 }}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.3 }}
        >
          Bob &amp; Marianne
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
        <motion.div
          style={{ width: 1, height: 64, background: "rgba(255,255,255,0.2)", margin: "2rem auto 0" }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.5 }}
        />
      </div>
    </FullBleed>
  </div>
);

export default WeddingDetails;
