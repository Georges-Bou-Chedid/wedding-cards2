import { motion, type Easing } from "framer-motion";
import { MapPin, Church, Clock, Heart } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import CountdownTimer from "./CountdownTimer";
import RSVPForm from "./RSVPForm";
import GiftRegistry from "./GiftRegistry";
import PhotoGallery from "./PhotoGallery";
import MusicPlayer from "./MusicPlayer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" as Easing },
  }),
};

const WeddingDetails = () => {
  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">
      <MusicPlayer />
      <section className="relative h-screen flex items-end justify-center pb-20">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        </div>
        <motion.div
          className="relative z-10 text-center text-primary-foreground px-6"
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="font-heading text-sm tracking-[0.4em] uppercase mb-4 text-cream/80"
          >
            We're Getting Married
          </motion.p>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-6xl sm:text-7xl mb-2 text-cream"
          >
            Bob
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="font-heading text-2xl text-gold-light my-2">
            &
          </motion.p>
          <motion.h1
            variants={fadeUp}
            custom={3}
            className="font-display text-6xl sm:text-7xl mb-6 text-cream"
          >
            Marianne
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={4}
            className="font-heading text-lg tracking-widest text-cream/90"
          >
            Sunday, July 12th, 2026
          </motion.p>
          <motion.div variants={fadeUp} custom={5} className="mt-8">
            <p className="font-heading text-xs tracking-[0.3em] uppercase text-cream/60">
              Scroll down
            </p>
            <div className="mt-2 mx-auto w-px h-10 bg-cream/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* Bible Verse */}
      <Section>
        <motion.div
          className="text-center max-w-lg mx-auto py-20 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeUp} custom={0}>
            <Heart className="w-6 h-6 mx-auto text-sage mb-6" />
          </motion.div>
          <motion.blockquote
            variants={fadeUp}
            custom={1}
            className="font-heading text-xl italic text-foreground leading-relaxed"
          >
            "So they are no longer two, but one flesh. Therefore what God has
            joined together, let not man separate."
          </motion.blockquote>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="font-heading text-sm text-muted-foreground mt-4 tracking-widest uppercase"
          >
            Matthew 19:6
          </motion.p>
        </motion.div>
      </Section>

      {/* Photo Gallery */}
      <Section>
        <PhotoGallery />
      </Section>

      {/* Parents */}
      <Section className="bg-secondary/50">
        <motion.div
          className="text-center max-w-lg mx-auto py-16 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.p variants={fadeUp} custom={0} className="font-heading text-base text-foreground">
            Mr. & Mrs. Bassil
          </motion.p>
          <motion.p variants={fadeUp} custom={1} className="font-heading text-base text-foreground mt-1">
            Mrs. Mouzaya
          </motion.p>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="font-heading text-sm text-muted-foreground mt-6 leading-relaxed"
          >
            Joyfully request your presence at the wedding of their children
          </motion.p>
        </motion.div>
      </Section>

      {/* Countdown */}
      <Section>
        <div className="text-center py-16 px-6">
          <h2 className="font-heading text-3xl text-foreground mb-10 tracking-wide">
            Counting the Days
          </h2>
          <CountdownTimer targetDate="2026-07-12T18:30:00" />
        </div>
      </Section>

      {/* Ceremony */}
      <Section className="bg-secondary/50">
        <EventCard
          icon={<Church className="w-8 h-8 text-sage" />}
          title="Wedding Ceremony"
          details="Saint Georges Church"
          time="6:30 PM"
          location="Halat - Lebanon"
          mapUrl="https://maps.app.goo.gl/KixMnnBjyXG6opmA7"
        />
      </Section>

      {/* Celebration */}
      <Section>
        <EventCard
          icon={<Heart className="w-8 h-8 text-sage" />}
          title="The Celebration"
          details="Porto Verde Venue"
          time="After Ceremony"
          location="Aqeibe - Lebanon"
          mapUrl="https://maps.app.goo.gl/opmjdD7AryYDcYGM7"
        />
      </Section>

      {/* Gift Registry */}
      <Section className="bg-secondary/50">
        <GiftRegistry />
      </Section>

      {/* RSVP */}
      <Section>
        <RSVPForm />
      </Section>

      {/* Footer */}
      <section className="py-16 text-center bg-sage-dark">
        <p className="font-display text-4xl text-cream">
          Bob & Marianne
        </p>
        <p className="font-heading text-sm text-cream/60 mt-3 tracking-widest">
          ♡ Together Forever ♡
        </p>
      </section>
    </div>
  );
};

const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <section className={`${className}`}>{children}</section>;

const EventCard = ({
  icon,
  title,
  details,
  time,
  location,
  mapUrl,
}: {
  icon: React.ReactNode;
  title: string;
  details: string;
  time: string;
  location: string;
  mapUrl: string;
}) => (
  <motion.div
    className="text-center py-16 px-6 max-w-md mx-auto"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
  >
    <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-4">
      {icon}
    </motion.div>
    <motion.h2 variants={fadeUp} custom={1} className="font-heading text-3xl text-foreground mb-6">
      {title}
    </motion.h2>
    <motion.div variants={fadeUp} custom={2}>
      <p className="font-heading text-lg text-foreground">{details}</p>
      <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span className="font-body text-sm">{time}</span>
      </div>
      <div className="flex items-center justify-center gap-2 mt-1 text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span className="font-body text-sm">{location}</span>
      </div>
    </motion.div>
    <motion.div variants={fadeUp} custom={3} className="mt-6">
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-heading text-sm tracking-widest uppercase border border-sage text-sage px-6 py-2 rounded-sm hover:bg-sage hover:text-primary-foreground transition-colors duration-300"
      >
        View Map
      </a>
    </motion.div>
  </motion.div>
);

export default WeddingDetails;
