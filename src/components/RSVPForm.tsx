import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxSmfbcU1JPsbeYYEnLpgX5fFE4Cf0MN-2heH1LaI-PLhRCOw69C1tlIEuti_gYGmaj0Q/exec";

/* ─────────────────────────────────────────────────────────────────
   GUEST LIST  —  hardcoded, cannot be changed by visitors.
   Add or remove names here before publishing the invitation.
───────────────────────────────────────────────────────────────── */
const GUEST_NAMES = [
  "Charbel Nader",
  "Marianne Mouzaya",
  "Bob Abi Khalil",
  "Mansour Abi Khalil",
  "Caroline Abi Khalil",
  "Youssef Mouzaya",
  "Nawal Mouzaya",
  "Georges Nader",
  "Rita Nader",
  "Antoine Khalil",
  "Marie Khalil",
  "Joseph Mouzaya",
  "Celine Mouzaya",
  "Elias Bassil",
  "Joelle Bassil",
  "Michel Abi Khalil",
  "Sandra Abi Khalil",
  "Rami Mouzaya",
  "Lara Mouzaya",
  "Habib Khoury",
  "Maya Khoury",
  "Pierre Najem",
  "Christine Najem",
  "Tony Hayek",
  "Nathalie Hayek",
  "Samir Khalil",
  "Hiba Khalil",
  "Roland Mouzaya",
  "Joumana Mouzaya",
  "Fady Bassil",
  "Nancy Bassil",
];

const Ornament = () => (
  <div className="ornament my-5">
    <div className="ornament-line" />
    <div className="ornament-diamond" />
    <div className="ornament-line" />
  </div>
);

const RSVPForm = () => {
  const [selectedName, setSelectedName] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no" | "">("");
  const [guests, setGuests] = useState("1");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedName || !attendance) return;
    setStatus("submitting");
    setErrorMsg("");

    const payload = new URLSearchParams({
      name: selectedName,
      attendance: attendance === "yes" ? "Attending" : "Not Attending",
      guests,
      message,
    });

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <motion.div
      className="text-center py-20 px-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <p
        className="text-dusty-blue tracking-[0.3em] uppercase mb-2"
        style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem" }}
      >
        Be Our Guest
      </p>
      <h2
        className="text-foreground mb-1"
        style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: "clamp(2rem,6vw,2.8rem)", letterSpacing: "0.04em" }}
      >
        RSVP
      </h2>
      <p
        className="text-muted-foreground italic mb-2"
        style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem" }}
      >
        Kindly respond before 1st July 2026
      </p>

      <Ornament />

      {status === "success" ? (
        <motion.div
          className="mt-6 flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "hsl(var(--dusty-blue))" }}
          >
            <Check className="w-7 h-7 text-white" />
          </div>
          <p
            className="text-foreground"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontStyle: "italic" }}
          >
            {attendance === "yes"
              ? `We look forward to celebrating with you, ${selectedName}!`
              : `Thank you for letting us know, ${selectedName}. You will be missed.`}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 text-left space-y-5">
          {/* Name select */}
          <div>
            <label
              htmlFor="guest-name"
              className="block text-muted-foreground tracking-[0.22em] uppercase mb-2"
              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem" }}
            >
              Your Name
            </label>
            <div className="relative">
              <select
                id="guest-name"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                required
                className="w-full appearance-none px-4 py-3 border rounded-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-dusty-blue transition-colors"
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "1.05rem",
                  borderColor: "hsl(var(--dusty-blue-pale))",
                }}
              >
                <option value="" disabled>Select your name…</option>
                {GUEST_NAMES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              {/* Custom chevron */}
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="hsl(var(--dusty-blue))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Attendance */}
          <div>
            <p
              className="text-muted-foreground tracking-[0.22em] uppercase mb-2"
              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem" }}
            >
              Attendance
            </p>
            <div className="flex gap-3">
              {(["yes", "no"] as const).map((val) => (
                <label
                  key={val}
                  className="flex-1 text-center py-3 border rounded-sm cursor-pointer transition-all duration-200"
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    borderColor: attendance === val ? "hsl(var(--dusty-blue))" : "hsl(var(--dusty-blue-pale))",
                    background: attendance === val ? "hsl(var(--dusty-blue))" : "transparent",
                    color: attendance === val ? "white" : "hsl(var(--muted-foreground))",
                  }}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value={val}
                    className="sr-only"
                    checked={attendance === val}
                    onChange={() => setAttendance(val)}
                    required
                  />
                  {val === "yes" ? "Joyfully Accepts" : "Regretfully Declines"}
                </label>
              ))}
            </div>
          </div>

          {/* Number of guests */}
          {attendance === "yes" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label
                htmlFor="guest-count"
                className="block text-muted-foreground tracking-[0.22em] uppercase mb-2"
                style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem" }}
              >
                Number of Guests
              </label>
              <div className="relative">
                <select
                  id="guest-count"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full appearance-none px-4 py-3 border rounded-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-dusty-blue transition-colors"
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: "1.05rem",
                    borderColor: "hsl(var(--dusty-blue-pale))",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="hsl(var(--dusty-blue))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}

          {/* Optional message */}
          <div>
            <label
              htmlFor="message"
              className="block text-muted-foreground tracking-[0.22em] uppercase mb-2"
              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem" }}
            >
              Message (Optional)
            </label>
            <input
              id="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="A note for the couple…"
              className="w-full px-4 py-3 border rounded-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-dusty-blue transition-colors"
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "1.05rem",
                borderColor: "hsl(var(--dusty-blue-pale))",
              }}
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-500 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3.5 rounded-sm text-white tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-50"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: "0.68rem",
              background: "hsl(var(--foreground))",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--dusty-blue))"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--foreground))"; }}
          >
            {status === "submitting" ? "Sending…" : "Confirm Attendance"}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default RSVPForm;
