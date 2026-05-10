import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

const WHISH_ACCOUNT = "30551033-03";

const GiftRegistry = () => {
  const [copied, setCopied] = useState(false);

  const copyAccount = () => {
    navigator.clipboard.writeText(WHISH_ACCOUNT).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <motion.div
      className="text-center py-20 px-6 max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {/* Gift icon */}
      <div className="flex justify-center mb-5">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p
        className="tracking-[0.3em] uppercase mb-2"
        style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", color: "rgba(255,255,255,0.7)" }}
      >
        Wedding Gift
      </p>
      <p
        className="leading-relaxed mb-8"
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontStyle: "italic",
          fontSize: "1.05rem",
          color: "rgba(255,255,255,0.82)",
        }}
      >
        The joy of sharing this day with you is the greatest gift we could receive.
        For those wishing to celebrate us with a gift Wish money account is available.
      </p>

      {/* Account card */}
      <div
        className="inline-flex items-center gap-5 rounded-sm px-7 py-5"
        style={{
          background: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.35)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="text-left">
          <p
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "4px",
            }}
          >
            Account Number
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "1.8rem",
              letterSpacing: "0.1em",
              color: "white",
              fontWeight: 400,
            }}
          >
            {WHISH_ACCOUNT}
          </p>
          <p
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: "0.55rem",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.55)",
              marginTop: "2px",
            }}
          >
            Ibrahim &amp; MARIANNE
          </p>
        </div>
        <button
          onClick={copyAccount}
          className="transition-colors p-1.5 rounded-sm"
          style={{ color: "rgba(255,255,255,0.75)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.75)"; }}
          title="Copy account number"
          aria-label="Copy Whish account number"
        >
          {copied ? (
            <Check className="w-5 h-5" style={{ color: "hsl(142,60%,70%)" }} />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>

      {copied && (
        <motion.p
          className="mt-3"
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.15em",
            color: "hsl(142,60%,72%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Copied to clipboard ✓
        </motion.p>
      )}
    </motion.div>
  );
};

export default GiftRegistry;
