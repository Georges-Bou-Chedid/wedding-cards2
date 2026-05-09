import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import RSVPForm from "./RSVPForm";
import GiftRegistry from "./GiftRegistry";
import PhotoGallery from "./PhotoGallery";

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO ADD YOUR ACTUAL PHOTOS — 3 simple steps:
 *
 * 1. Copy your JPG files into  public/photos/
 *    Example: public/photos/photo1.jpg, public/photos/photo2.jpg, etc.
 *
 * 2. In this file, replace the import paths below with your filenames:
 *    import heroBg   from "@/assets/YOUR_HERO_PHOTO.jpg";   ← _2745 photo
 *    import dateBg   from "@/assets/YOUR_DATE_PHOTO.jpg";
 *    import footerBg from "@/assets/YOUR_FOOTER_PHOTO.jpg";
 *
 * 3. In PhotoGallery.tsx, update the import lines near the top.
 *
 * Alternatively, put files in src/assets/ and update the imports.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import heroBg   from "@/assets/wedding-couple-1.jpg";   // ← replace with _2745
import dateBg   from "@/assets/wedding-couple-2.jpg";   // ← replace with your date-section photo
import footerBg from "@/assets/wedding-couple-3.jpg";   // ← replace with your footer photo

/* ─── Scroll-triggered fade-up ─────────────────────────────────────────── */
const useScrollReveal = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("in-view"); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
};

const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref as React.RefObject<HTMLElement>);
  return (
    <div
      ref={ref}
      className={`animate-fade-up ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
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

/* ─── Map button ────────────────────────────────────────────────────────── */
const MapBtn = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 border rounded-sm px-5 py-2.5 transition-all duration-300 hover:text-white"
    style={{
      fontFamily: "'Montserrat',sans-serif",
      fontSize: "0.62rem",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      borderColor: "hsl(var(--dusty-blue))",
      color: "hsl(var(--dusty-blue))",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLAnchorElement).style.background = "hsl(var(--dusty-blue))";
      (e.currentTarget as HTMLAnchorElement).style.color = "white";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
      (e.currentTarget as HTMLAnchorElement).style.color = "hsl(var(--dusty-blue))";
    }}
  >
    <MapPin size={13} />
    {children}
  </a>
);

/* ─────────────────────────────────────────────────────────────────────────
   BACKGROUND IMAGE PLACEHOLDERS
   ──────────────────────────────────────────────────────────────────────────
   To add your background images, set the `src` field for each entry below,
   then remove `placeholder: true` for that entry.

   Example:
     { id: "hero",   src: "https://your-cdn.com/hero.jpg",   placeholder: false }

   Sections that use these:
     hero   → Hero section with Arabic verse
     date   → Date section with "12 July 2026"
     footer → Footer section
───────────────────────────────────────────────────────────────────────── */
const BG: Record<string, { src: string; placeholder: boolean }> = {
  hero:   { src: heroBg,   placeholder: false },
  date:   { src: dateBg,   placeholder: false },
  footer: { src: footerBg, placeholder: false },
};

/* ─── Hero / full-bleed section helper ─────────────────────────────────── */
const FullBleed = ({
  bgKey,
  fallbackColor,
  overlay = "rgba(0,0,0,0.38)",
  minH = "100vh",
  children,
}: {
  bgKey: keyof typeof BG;
  fallbackColor: string;
  overlay?: string;
  minH?: string;
  children: React.ReactNode;
}) => {
  const bg = BG[bgKey];
  return (
    <section
      className="relative flex items-center justify-center"
      style={{
        minHeight: minH,
        background: bg.placeholder || !bg.src ? fallbackColor : `url('${bg.src}') center/cover no-repeat`,
        backgroundAttachment: bg.placeholder || !bg.src ? undefined : "fixed",
      }}
    >
      <div className="absolute inset-0" style={{ background: overlay }} />
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   WEDDING DETAILS — main component
═══════════════════════════════════════════════════════════════════════════ */
const WeddingDetails = () => {
  return (
    <div className="overflow-x-hidden" style={{ background: "hsl(var(--cream))" }}>

      {/* ── 1. HERO — Arabic verse ── */}
      <FullBleed
        bgKey="hero"
        fallbackColor="hsl(var(--dusty-blue-dark))"
        overlay="rgba(30,40,50,0.48)"
      >
        <div className="text-center px-6 py-24 max-w-2xl mx-auto">
          <FadeUp>
            <p
              className="font-arabic leading-[2.2] text-white"
              dir="rtl"
              lang="ar"
              style={{ fontSize: "clamp(1.1rem,3.5vw,1.65rem)", textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}
            >
              أَمَّا نَحنُ فإِنَّنا نُحِبّ،<br />
              لأَنَّه أَحَبَّنا قَبلَ أَن نُحِبَّه
            </p>
          </FadeUp>
          <FadeUp delay={150}>
            <p
              className="font-arabic text-white/70 mt-3"
              dir="rtl"
              lang="ar"
              style={{ fontSize: "0.95rem" }}
            >
              يوحنّا الأولى 4 : 19
            </p>
          </FadeUp>
          <FadeUp delay={300}>
            <div className="mt-8 flex flex-col items-center gap-1 text-white/50">
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.55rem", letterSpacing: "0.3em" }}>
                SCROLL
              </p>
              <div className="w-px h-8 bg-white/30" />
            </div>
          </FadeUp>
        </div>
      </FullBleed>

      {/* ── 2. DATE SECTION ── */}
      <FullBleed
        bgKey="date"
        fallbackColor="hsl(212,25%,18%)"
        overlay="rgba(12,20,30,0.58)"
        minH="100vh"
      >
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">

          {/* Top label */}
          <FadeUp>
            <p
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: "0.58rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "2.5rem",
              }}
            >
              Save The Date
            </p>
          </FadeUp>

          {/* Thin top rule */}
          <FadeUp delay={60}>
            <div style={{ width: 1, height: 52, background: "rgba(255,255,255,0.25)", margin: "0 auto 2.5rem" }} />
          </FadeUp>

          {/* Sunday */}
          <FadeUp delay={120}>
            <p
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 300,
                fontSize: "clamp(0.75rem,2vw,0.95rem)",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              Sunday
            </p>
          </FadeUp>

          {/* Big date — "12" */}
          <FadeUp delay={180}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 300,
                fontSize: "clamp(7rem,26vw,16rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.03em",
                color: "white",
                textShadow: "0 4px 40px rgba(0,0,0,0.4)",
              }}
            >
              12
            </p>
          </FadeUp>

          {/* July in script */}
          <FadeUp delay={240}>
            <p
              style={{
                fontFamily: "'Great Vibes',cursive",
                fontSize: "clamp(3rem,11vw,6.5rem)",
                color: "white",
                lineHeight: 1,
                marginTop: "-0.5rem",
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              July
            </p>
          </FadeUp>

          {/* Year */}
          <FadeUp delay={300}>
            <p
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 300,
                fontSize: "clamp(0.75rem,2vw,0.95rem)",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)",
                marginTop: "1rem",
              }}
            >
              2026
            </p>
          </FadeUp>

          {/* Bottom rule */}
          <FadeUp delay={360}>
            <div style={{ width: 1, height: 52, background: "rgba(255,255,255,0.25)", margin: "2.5rem auto 2rem" }} />
          </FadeUp>

          {/* Venue teaser */}
          <FadeUp delay={420}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontStyle: "italic",
                fontSize: "clamp(0.9rem,2.5vw,1.15rem)",
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.04em",
              }}
            >
              Our Lady of Peace Church · Kfarhbab
            </p>
          </FadeUp>
        </div>
      </FullBleed>

      {/* ── 3. INVITATION DETAILS ── */}
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

          {/* Names */}
          <FadeUp delay={380}>
            <div className="my-8">
              <p
                className="text-foreground leading-none"
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontWeight: 300,
                  fontSize: "clamp(2.6rem,9vw,5rem)",
                  letterSpacing: "0.06em",
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

          <FadeUp delay={500}>
            <p
              className="text-foreground tracking-[0.2em] uppercase mt-3"
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.9rem,2.5vw,1.15rem)" }}
            >
              Sunday 12th of July 2026
            </p>
          </FadeUp>
          <FadeUp delay={560}>
            <p
              className="text-dusty-blue tracking-[0.25em] mt-1"
              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.72rem" }}
            >
              6:00 PM
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── 4. VENUES ── */}
      <section
        className="py-20 px-6"
        style={{ background: "hsl(var(--warm-beige))" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <p
              className="text-dusty-blue tracking-[0.3em] uppercase mb-2"
              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem" }}
            >
              Join Us
            </p>
            <h2
              className="text-foreground mb-10"
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 300,
                fontSize: "clamp(2rem,6vw,3rem)",
                letterSpacing: "0.05em",
              }}
            >
              The Celebration
            </h2>
          </FadeUp>

          <div className="flex flex-wrap gap-6 justify-center">
            {/* Church */}
            <FadeUp delay={100} className="flex-1 min-w-[260px] max-w-sm">
              <div
                className="bg-white rounded-sm p-10 text-center h-full flex flex-col items-center"
                style={{ boxShadow: "0 4px 28px rgba(0,0,0,0.06)", borderTop: "3px solid hsl(var(--dusty-blue))" }}
              >
                <div className="mb-3 text-3xl">⛪</div>
                <p
                  className="text-dusty-blue tracking-[0.28em] uppercase mb-2"
                  style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
                >
                  Ceremony
                </p>
                <p
                  className="text-foreground mb-1"
                  style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", letterSpacing: "0.04em" }}
                >
                  Our Lady of Peace Church
                </p>
                <p
                  className="text-muted-foreground mb-4"
                  style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", letterSpacing: "0.1em" }}
                >
                  Kfarhbab, Lebanon
                </p>
                <p
                  className="text-muted-foreground italic mb-6"
                  style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem" }}
                >
                  Sunday, 12 July 2026
                </p>
                <MapBtn href="https://maps.app.goo.gl/gcoSPSMQXzhSEZQC8?g_st=iw">
                  Get Directions
                </MapBtn>
              </div>
            </FadeUp>

            {/* Dinner */}
            <FadeUp delay={200} className="flex-1 min-w-[260px] max-w-sm">
              <div
                className="bg-white rounded-sm p-10 text-center h-full flex flex-col items-center"
                style={{ boxShadow: "0 4px 28px rgba(0,0,0,0.06)", borderTop: "3px solid hsl(var(--dusty-blue))" }}
              >
                <div className="mb-3 text-3xl">🥂</div>
                <p
                  className="text-dusty-blue tracking-[0.28em] uppercase mb-2"
                  style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
                >
                  Dinner Reception
                </p>
                <p
                  className="text-foreground mb-1"
                  style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", letterSpacing: "0.04em" }}
                >
                  Lavender Ville
                </p>
                <p
                  className="text-muted-foreground mb-4"
                  style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", letterSpacing: "0.1em" }}
                >
                  Fatqa, Lebanon
                </p>
                <p
                  className="text-muted-foreground italic mb-6"
                  style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem" }}
                >
                  Following the Ceremony
                </p>
                <MapBtn href="https://maps.app.goo.gl/ubdFZ9MWwvxb8YNc7?g_st=iw">
                  Get Directions
                </MapBtn>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 5. CELEBRATION LOCATIONS ── */}
      <section className="py-20 px-6" style={{ background: "white" }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <p
              className="text-dusty-blue tracking-[0.3em] uppercase mb-2"
              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem" }}
            >
              Celebrate With Us
            </p>
            <h2
              className="text-foreground mb-4"
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 300,
                fontSize: "clamp(2rem,6vw,3rem)",
                letterSpacing: "0.05em",
              }}
            >
              Before the Big Day
            </h2>
            <p
              className="text-muted-foreground italic max-w-md mx-auto mb-10"
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem", lineHeight: 1.85 }}
            >
              We warmly invite you to join us at our homes as we celebrate this
              joyous occasion together with family and loved ones.
            </p>
          </FadeUp>

          {/* Photo carousel */}
          <FadeUp delay={100}>
            <PhotoGallery />
          </FadeUp>

          {/* House location cards */}
          <div className="flex flex-wrap gap-5 justify-center mt-12">
            <FadeUp delay={150} className="flex-1 min-w-[220px] max-w-xs">
              <div
                className="rounded-sm p-8 text-center flex flex-col items-center gap-4"
                style={{ background: "hsl(var(--cream))" }}
              >
                <div className="text-2xl">🏠</div>
                <div>
                  <p
                    className="text-dusty-blue tracking-[0.25em] uppercase mb-1"
                    style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
                  >
                    Bride's Home
                  </p>
                  <p
                    className="text-foreground"
                    style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem" }}
                  >
                    Marianne's Family
                  </p>
                </div>
                <MapBtn href="https://maps.app.goo.gl/7x4cVWXSSjAZTStX9?g_st=aw">
                  Get Directions
                </MapBtn>
              </div>
            </FadeUp>

            <FadeUp delay={250} className="flex-1 min-w-[220px] max-w-xs">
              <div
                className="rounded-sm p-8 text-center flex flex-col items-center gap-4"
                style={{ background: "hsl(var(--cream))" }}
              >
                <div className="text-2xl">🏠</div>
                <div>
                  <p
                    className="text-dusty-blue tracking-[0.25em] uppercase mb-1"
                    style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
                  >
                    Groom's Home
                  </p>
                  <p
                    className="text-foreground"
                    style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem" }}
                  >
                    Bob's Family
                  </p>
                </div>
                <MapBtn href="https://www.google.com/maps?q=34.010582,35.654316">
                  Get Directions
                </MapBtn>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 6. WISH ACCOUNT ── */}
      <section
        className="relative py-20 px-6 text-center overflow-hidden"
        style={{ background: "hsl(var(--dusty-blue))" }}
      >
        {/* Decorative radials */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)",
          }}
        />
        <GiftRegistry />
      </section>

      {/* ── 7. RSVP ── */}
      <section style={{ background: "hsl(var(--ivory))" }}>
        <RSVPForm />
      </section>

      {/* ── 8. FOOTER ── */}
      <FullBleed
        bgKey="footer"
        fallbackColor="hsl(212,30%,16%)"
        overlay="rgba(8,16,24,0.52)"
        minH="100vh"
      >
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-20">
          <motion.div
            style={{ width: 1, height: 60, background: "rgba(255,255,255,0.2)", margin: "0 auto 2rem" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
          <motion.p
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              marginBottom: "1.5rem",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Together Forever
          </motion.p>
          <motion.p
            className="text-white"
            style={{ fontFamily: "'Great Vibes',cursive", fontSize: "clamp(3.5rem,12vw,6.5rem)", lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Bob &amp; Marianne
          </motion.p>
          <motion.p
            className="text-white/60 mt-5 tracking-[0.4em] uppercase"
            style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.68rem" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            12 · 07 · 2026
          </motion.p>
          <motion.div
            style={{ width: 1, height: 60, background: "rgba(255,255,255,0.2)", margin: "2rem auto 0" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.p
            className="text-white/40 mt-4"
            style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.55rem", letterSpacing: "0.15em" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            ♡ Together Forever ♡
          </motion.p>
        </div>
      </FullBleed>

    </div>
  );
};

export default WeddingDetails;
