import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxSmfbcU1JPsbeYYEnLpgX5fFE4Cf0MN-2heH1LaI-PLhRCOw69C1tlIEuti_gYGmaj0Q/exec";

const RSVPForm = () => {
  const [names, setNames] = useState<string[]>([""]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const namesParam = params.get("names");
    if (namesParam) {
      setNames(namesParam.split(",").map((n) => decodeURIComponent(n.trim())));
    }
  }, []);

  const addName = () => setNames([...names, ""]);
  const removeName = (i: number) => setNames(names.filter((_, idx) => idx !== i));
  const updateName = (i: number, val: string) => {
    const updated = [...names];
    updated[i] = val;
    setNames(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = names.filter((n) => n.trim());
    if (!filtered.length) return;

    setStatus("submitting");
    try {
      const formData = new URLSearchParams();
      formData.append("names", JSON.stringify(filtered));
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      setStatus("success");
      setMessage(`Dear ${filtered.join(", ")}, thank you for confirming your attendance!`);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <motion.div
      className="text-center py-16 px-6 max-w-md mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <h2 className="font-heading text-3xl text-foreground mb-2">Be Our Guest</h2>
      <p className="font-body text-sm italic text-muted-foreground mb-8">
        Please reply before: August 20, 2025
      </p>

      {status === "success" ? (
        <p className="font-heading text-lg text-sage">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="font-heading text-sm text-muted-foreground tracking-widest uppercase mb-4">
            List of Attendees
          </p>
          {names.map((name, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => updateName(i, e.target.value)}
                placeholder="Full name"
                className="flex-1 px-4 py-2 border border-border rounded-sm bg-background font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-sage"
                required
              />
              {names.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeName(i)}
                  className="px-2 text-destructive hover:bg-destructive/10 rounded-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addName}
            className="font-heading text-sm text-sage border border-sage px-4 py-1.5 rounded-sm hover:bg-sage hover:text-primary-foreground transition-colors duration-300 tracking-widest uppercase"
          >
            + Add Guest
          </button>
          <div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-4 w-full font-heading text-sm tracking-widest uppercase bg-sage text-primary-foreground py-3 rounded-sm hover:bg-sage-dark transition-colors duration-300 disabled:opacity-50"
            >
              {status === "submitting" ? "Submitting..." : "Confirm Attendance"}
            </button>
          </div>
          {status === "error" && (
            <p className="text-destructive text-sm">{message}</p>
          )}
        </form>
      )}
    </motion.div>
  );
};

export default RSVPForm;
