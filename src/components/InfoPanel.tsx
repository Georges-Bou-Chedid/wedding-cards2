import { MapPin } from "lucide-react";
import type { VenueDetail } from "@/lib/weddingContent";

interface InfoPanelProps {
  venue: VenueDetail;
}

const InfoPanel = ({ venue }: InfoPanelProps) => (
  <div
    className="w-full max-w-xs mx-auto px-8 py-8 text-center"
    style={{ border: "1px solid rgba(255,255,255,0.55)" }}
  >
    <p
      className="uppercase tracking-[0.32em] mb-3 text-white/70"
      style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
    >
      {venue.label}
    </p>
    <p
      className="text-white mb-2"
      style={{ fontFamily: "var(--font-amelia)", fontWeight: 300, fontSize: "clamp(1.3rem,4vw,1.7rem)", letterSpacing: "0.03em" }}
    >
      {venue.name}
    </p>
    <p
      className="text-white/75 mb-2"
      style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "0.95rem" }}
    >
      {venue.address}
    </p>
    {venue.time && (
      <p
        className="text-white/90 mb-5 tracking-widest text-sm"
        style={{ fontFamily: "var(--font-amelia)", fontWeight: 300 }}
      >
        {venue.time}
      </p>
    )}
    <a
      href={venue.mapHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 border rounded-sm px-5 py-2.5 mt-2 transition-all duration-300 border-white/60 text-white hover:bg-white hover:text-foreground"
      style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
    >
      <MapPin size={13} />
      Get Directions
    </a>
  </div>
);

export default InfoPanel;
