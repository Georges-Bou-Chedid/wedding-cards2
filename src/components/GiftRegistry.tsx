import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Check } from "lucide-react";

const GiftRegistry = () => {
  const [copied, setCopied] = useState(false);

  const copyAccount = () => {
    navigator.clipboard.writeText("Acc# 20782965");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="text-center py-16 px-6 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Gift className="w-8 h-8 mx-auto text-primary mb-4" />
      <h2 className="font-heading text-3xl text-foreground mb-4">Gift Registry</h2>
      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
        Your love, laughter, and presence are all we could wish for on our special day.
        For those who wish, a wedding list is available in all Whish Money branches.
      </p>
      <div className="inline-flex items-center gap-3 border border-border rounded-sm px-6 py-3 bg-background">
        <div>
          <p className="font-heading text-xs text-muted-foreground tracking-widest uppercase">
            Whish Account
          </p>
          <p className="font-heading text-lg text-foreground">Acc# 20782965</p>
        </div>
        <button
          onClick={copyAccount}
          className="text-primary hover:text-toile-dark transition-colors"
          title="Copy account number"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>
    </motion.div>
  );
};

export default GiftRegistry;
