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
            stroke="hsl(var(--dusty-blue))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p
        className="text-dusty-blue tracking-[0.3em] uppercase mb-2"
        style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem" }}
      >
        Wedding Gift
      </p>
      <h2
        className="text-foreground mb-3"
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontWeight: 300,
          fontSize: "clamp(2rem,6vw,2.8rem)",
          letterSpacing: "0.04em",
        }}
      >
        Whish Account
      </h2>
      <p
        className="text-muted-foreground leading-relaxed mb-8"
        style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "1.05rem" }}
      >
        Your presence is our greatest gift. For those who wish to honour us, a
        wedding account is available through Whish Money.
      </p>

      <div
        className="inline-flex items-center gap-4 border rounded-sm px-7 py-4"
        style={{ borderColor: "hsl(var(--dusty-blue-pale))" }}
      >
        <div className="text-left">
          <p
            className="text-muted-foreground tracking-[0.25em] uppercase mb-1"
            style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem" }}
          >
            Account Number
          </p>
          <p
            className="text-foreground"
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "1.45rem",
              letterSpacing: "0.08em",
            }}
          >
            {WHISH_ACCOUNT}
          </p>
          <p
            className="text-muted-foreground mt-0.5"
            style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em" }}
          >
            IBRAHIM &amp; MARIANNE
          </p>
        </div>
        <button
          onClick={copyAccount}
          className="text-dusty-blue hover:text-dusty-blue-dark transition-colors p-1"
          title="Copy account number"
          aria-label="Copy Whish account number"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>

      {copied && (
        <motion.p
          className="mt-3 text-green-600"
          style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em" }}
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
