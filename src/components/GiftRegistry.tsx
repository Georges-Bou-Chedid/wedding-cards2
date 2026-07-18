import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { WHISH_ACCOUNT } from "@/lib/weddingContent";

interface GiftRegistryProps {
  variant?: "light" | "dark";
}

const GiftRegistry = ({ variant = "dark" }: GiftRegistryProps) => {
  const [copied, setCopied] = useState(false);
  const isLight = variant === "light";

  const copyAccount = () => {
    navigator.clipboard.writeText(WHISH_ACCOUNT.number).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const bodyTextColor = isLight ? "rgba(255,255,255,0.85)" : "#1C2632";
  const labelColor = isLight ? "rgba(255,255,255,0.7)" : "hsl(var(--dusty-blue-dark))";
  const iconColor = isLight ? "#FFFFFF" : "#1C2632";

  return (
    <motion.div
      className="text-center max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <p
        className={isLight ? "text-white" : "text-foreground"}
        style={{ fontFamily: "var(--font-script)", fontSize: "clamp(2.2rem,7vw,2.8rem)", marginBottom: "0.5rem" }}
      >
        Thank You
      </p>
      <p
        className="tracking-[0.32em] uppercase mb-6"
        style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", color: labelColor }}
      >
        Dear Family and Friends
      </p>

      <div className="flex justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"
            stroke={iconColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p
        className="tracking-[0.3em] uppercase mb-3"
        style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: labelColor }}
      >
        Wedding Gift
      </p>

      <p
        className="leading-relaxed mb-10"
        style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "1.2rem", color: bodyTextColor }}
      >
        The joy of sharing this day with you is the greatest gift we could receive.
        <br />
        For those wishing to celebrate us with a gift, a Whish money account is available.
      </p>

      <div
        className="inline-flex items-center gap-6 rounded-sm px-8 py-6 shadow-sm"
        style={{ background: isLight ? "rgba(255,255,255,0.94)" : "white", border: "1px solid hsl(var(--dusty-blue-pale))" }}
      >
        <div className="text-left">
          <p
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "hsl(var(--dusty-blue))",
              marginBottom: "4px",
            }}
          >
            Account Number
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "1.9rem",
              letterSpacing: "0.05em",
              color: "#1C2632",
              fontWeight: 500,
            }}
          >
            {WHISH_ACCOUNT.number}
          </p>
          <p
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: "hsl(var(--dusty-blue-dark))",
              marginTop: "4px",
            }}
          >
            {WHISH_ACCOUNT.label}
          </p>
        </div>

        <button
          onClick={copyAccount}
          className="transition-all p-2 rounded-full hover:bg-slate-50"
          style={{ color: "#1C2632" }}
          title="Copy account number"
        >
          {copied ? (
            <Check className="w-6 h-6" style={{ color: "green" }} />
          ) : (
            <Copy className="w-6 h-6 opacity-60 hover:opacity-100" />
          )}
        </button>
      </div>

      {copied && (
        <motion.p
          className="mt-4"
          style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: "green", letterSpacing: "0.1em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Copied to clipboard ✓
        </motion.p>
      )}
    </motion.div>
  );
};

export default GiftRegistry;
