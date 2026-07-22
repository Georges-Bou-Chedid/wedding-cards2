import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5JtiSLlCth_McxFSoy7FLPxY4VIDoHpMFJKix_wADo9ugx4PnTXE_ws-iWv8Xu1Isbw/exec";

interface RSVPFormProps {
  variant?: "light" | "dark";
}

type GuestResponse = "yes" | "no";

const RSVPForm = ({ variant = "dark" }: RSVPFormProps) => {
  const [invitedNames, setInvitedNames] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, GuestResponse>>({});
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const isLight = variant === "light";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const namesParam = params.get("names");
    if (namesParam) {
      const namesArray = namesParam.split(",").map((n) => n.trim());
      setInvitedNames(namesArray);
    }
  }, []);

  const setResponse = (name: string, value: GuestResponse) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
  };

  const allAnswered = invitedNames.length > 0 && invitedNames.every((name) => responses[name]);
  const attendingNames = invitedNames.filter((name) => responses[name] === "yes");
  const decliningNames = invitedNames.filter((name) => responses[name] === "no");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;
    setStatus("submitting");

    const attendanceSummary =
      decliningNames.length === 0
        ? "Attending"
        : attendingNames.length === 0
        ? "Declined"
        : `Attending: ${attendingNames.join(", ")}; Declined: ${decliningNames.join(", ")}`;

    const payload = new URLSearchParams({
      name: invitedNames.join(", "),
      attendees: attendingNames.join(", "),
      declined: decliningNames.join(", "),
      attendance: attendanceSummary,
      message,
      date: new Date().toLocaleString("en-GB"),
    });

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (invitedNames.length === 0) return null;

  const headingColor = isLight ? "text-white" : "text-foreground";
  const labelColor = isLight ? "text-white/70" : "text-dusty-blue";
  const mutedColor = isLight ? "text-white/70" : "text-muted-foreground";
  const chipBorder = isLight ? "border-white/50" : "border-dusty-blue-pale";
  const nameColor = isLight ? "text-white" : "text-foreground";
  const rowDivider = isLight ? "border-white/20" : "border-dusty-blue-pale/60";
  const toggleActiveBg = isLight
    ? "bg-white text-foreground border-white"
    : "bg-dusty-blue text-white border-dusty-blue";
  // A translucent dark backdrop keeps the unselected toggle legible over a
  // busy photo background — text opacity alone let the photo show straight
  // through and made it nearly unreadable.
  const toggleInactiveStyle = isLight
    ? "bg-black/30 border-white/40 text-white/90"
    : "bg-transparent border-dusty-blue-pale text-muted-foreground";

  return (
    <motion.div
      className="text-center py-20 px-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <p className={`${labelColor} tracking-[0.3em] uppercase mb-2 text-[0.62rem] font-montserrat`}>
        Be Our Guest
      </p>
      <h2 className={`${headingColor} mb-1 font-serif text-[clamp(2rem,6vw,2.8rem)] font-light tracking-wider`}>
        RSVP
      </h2>
      <p className={`${mutedColor} italic mb-8 font-serif`}>
        Kindly respond before <b>August 15th</b>, 2026.
      </p>

      {status === "success" ? (
        <motion.div className="flex flex-col items-center gap-4 py-10" initial={{ scale: 0.9 }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-dusty-blue">
            <Check className="w-7 h-7 text-white" />
          </div>
          <p className={`font-serif italic text-lg ${isLight ? "text-white" : ""}`}>
            {attendingNames.length > 0 ? "We can't wait to celebrate with you!" : "Thank you for letting us know."}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="text-left space-y-8">
          <div>
            <label className={`block ${mutedColor} tracking-widest uppercase mb-4 text-[0.6rem] font-montserrat`}>
              Guests
            </label>
            <div className="space-y-1">
              {invitedNames.map((name, i) => (
                <div
                  key={name}
                  className={`flex items-center justify-between gap-4 py-3 ${
                    i < invitedNames.length - 1 ? `border-b ${rowDivider}` : ""
                  }`}
                >
                  <span className={`${nameColor} font-serif`} style={{ fontSize: "1.05rem" }}>
                    {name}
                  </span>
                  <div className="flex gap-2 shrink-0">
                    {(["yes", "no"] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setResponse(name, val)}
                        className={`px-4 py-1.5 border rounded-full transition-all text-[0.6rem] tracking-widest uppercase font-montserrat ${
                          responses[name] === val ? toggleActiveBg : toggleInactiveStyle
                        }`}
                      >
                        {val === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={`block ${mutedColor} tracking-widest uppercase mb-2 text-[0.6rem] font-montserrat`}>
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full px-4 py-3 border ${chipBorder} rounded-sm bg-transparent focus:outline-none focus:border-dusty-blue ${
                isLight ? "text-white placeholder:text-white/50" : ""
              }`}
              placeholder="Leave a note..."
              rows={2}
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting" || !allAnswered}
            className={`w-full py-4 uppercase tracking-[0.2em] text-[0.7rem] transition-colors disabled:opacity-30 ${
              isLight
                ? "bg-white text-foreground hover:bg-dusty-blue hover:text-white"
                : "bg-foreground text-white hover:bg-dusty-blue"
            }`}
          >
            {status === "submitting" ? "Sending..." : "Confirm RSVP"}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default RSVPForm;
