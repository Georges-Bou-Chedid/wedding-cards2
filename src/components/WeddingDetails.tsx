import RevealSection, { RevealItem } from "./RevealSection";
import InfoPanel from "./InfoPanel";
import ScratchCard from "./ScratchCard";
import CountdownTimer from "./CountdownTimer";
import GiftRegistry from "./GiftRegistry";
import RSVPForm from "./RSVPForm";
import {
  COUPLE,
  WEDDING_DATE_ISO,
  WEDDING_DATE_DISPLAY,
  CEREMONY_VENUE,
  RECEPTION_VENUE,
  GROOM_HOME,
  BRIDE_HOME,
} from "@/lib/weddingContent";

/*
 * ─── BACKGROUND PHOTOS ────────────────────────────────────────────────────
 * Every page below has one full-bleed background photo. Replace the files
 * in src/assets/ (or swap these imports) with the couple's real photos —
 * each import below is labeled with which page it belongs to.
 */
import pageWeLoveBg   from "@/assets/we-love-because-bg.webp"; // page: "We love because..."
import pageVerseBg    from "@/assets/verse-families-bg.webp";  // page: verse end + families + scratch date
import pageVenueBg    from "@/assets/wedding-couple-1.jpg";           // page: church + venue
import pageHomesBg    from "@/assets/wedding-couple-2.jpg";           // page: groom's home + bride's home
import pageWishBg     from "@/assets/wedding-couple-3.jpg";    // page: wish account
import pageRsvpBg     from "@/assets/wedding-couple-3.jpg";           // page: RSVP
/* ────────────────────────────────────────────────────────────────────────── */

const WeddingDetails = () => {
  return (
    <div className="h-[100dvh] overflow-y-scroll snap-y snap-mandatory">
      {/* ── 1. "We love because..." ── */}
      <RevealSection backgroundImage={pageWeLoveBg}>
        <RevealItem>
          <p
            className="text-white leading-relaxed"
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontStyle: "italic",
              fontSize: "clamp(1.8rem,6vw,3rem)",
              textShadow: "0 2px 16px rgba(0,0,0,0.45)",
            }}
          >
            We love because…
          </p>
        </RevealItem>
      </RevealSection>

      {/* ── 2. Verse end + families + names + scratch date reveal ── */}
      <RevealSection backgroundImage={pageVerseBg} overlay="rgba(18,31,48,0.55)" scrollableContent>
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <RevealItem>
            <p
              className="text-white leading-relaxed"
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontStyle: "italic",
                fontSize: "clamp(1.4rem,5vw,2.2rem)",
                textShadow: "0 2px 16px rgba(0,0,0,0.45)",
              }}
            >
              …he loved us first
            </p>
          </RevealItem>

          <RevealItem>
            <p
              className="text-white/80 uppercase tracking-[0.3em]"
              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem" }}
            >
              Together with their families
            </p>
          </RevealItem>

          <RevealItem>
            <div
              className="flex items-center justify-center gap-10 text-white uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.95rem" }}
            >
              <span>{COUPLE.groomFamily}</span>
              <span className="opacity-50">&amp;</span>
              <span>{COUPLE.brideFamily}</span>
            </div>
          </RevealItem>

          <RevealItem>
            <p className="text-white" style={{ fontFamily: "var(--font-script)", fontSize: "clamp(2.4rem,8vw,3.2rem)" }}>
              {COUPLE.groomFirstName} &amp; {COUPLE.brideFirstName}
            </p>
          </RevealItem>

          <RevealItem>
            <ScratchCard className="w-[300px] h-[230px] sm:w-[360px] sm:h-[250px] animate-pulse-soft">
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-3">
                <p
                  className="text-white"
                  style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: "clamp(1.6rem,5vw,2.4rem)" }}
                >
                  {WEDDING_DATE_DISPLAY}
                </p>
                <CountdownTimer targetDate={WEDDING_DATE_ISO} variant="light" compact />
              </div>
            </ScratchCard>
          </RevealItem>
        </div>
      </RevealSection>

      {/* ── 3. Church + Venue ── */}
      <RevealSection backgroundImage={pageVenueBg}>
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
          <RevealItem>
            <h2
              className="text-white"
              style={{ fontFamily: "var(--font-amelia)", fontWeight: 300, fontSize: "clamp(1.8rem,6vw,2.6rem)", letterSpacing: "0.04em" }}
            >
              The Celebration
            </h2>
          </RevealItem>
          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center w-full">
            <RevealItem>
              <InfoPanel venue={CEREMONY_VENUE} />
            </RevealItem>
            <RevealItem>
              <InfoPanel venue={RECEPTION_VENUE} />
            </RevealItem>
          </div>
        </div>
      </RevealSection>

      {/* ── 4. Groom's Home + Bride's Home ── */}
      <RevealSection backgroundImage={pageHomesBg}>
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
          <RevealItem>
            <h2
              className="text-white"
              style={{ fontFamily: "var(--font-amelia)", fontWeight: 300, fontSize: "clamp(1.8rem,6vw,2.6rem)", letterSpacing: "0.04em" }}
            >
              Where It All Began
            </h2>
          </RevealItem>
          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center w-full">
            <RevealItem>
              <InfoPanel venue={GROOM_HOME} />
            </RevealItem>
            <RevealItem>
              <InfoPanel venue={BRIDE_HOME} />
            </RevealItem>
          </div>
        </div>
      </RevealSection>

      {/* ── 5. Wish Account ── */}
      <RevealSection backgroundImage={pageWishBg}>
        <RevealItem>
          <GiftRegistry variant="light" />
        </RevealItem>
      </RevealSection>

      {/* ── 6. RSVP ── */}
      <RevealSection backgroundImage={pageRsvpBg}>
        <RevealItem>
          <RSVPForm variant="light" />
        </RevealItem>
      </RevealSection>
    </div>
  );
};

export default WeddingDetails;
