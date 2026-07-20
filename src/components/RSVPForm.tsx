import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5JtiSLlCth_McxFSoy7FLPxY4VIDoHpMFJKix_wADo9ugx4PnTXE_ws-iWv8Xu1Isbw/exec";

interface RSVPFormProps {
  variant?: "light" | "dark";
}

const RSVPForm = ({ variant = "dark" }: RSVPFormProps) => {
  const [invitedNames, setInvitedNames] = useState<string[]>([]);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [attendance, setAttendance] = useState<"yes" | "no" | "">("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const isLight = variant === "light";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const namesParam = params.get("names");
    if (namesParam) {
      const namesArray = namesParam.split(",").map((n) => n.trim());
      setInvitedNames(namesArray);
      // Guests start unselected — each name is only tagged as attending or
      // declining once the guest actively picks it.
    }
  }, []);

  const toggleName = (name: string) => {
    setSelectedAttendees((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendance || selectedAttendees.length === 0) return;
    setStatus("submitting");

    const payload = new URLSearchParams({
      name: invitedNames.join(", "),
      attendees: selectedAttendees.join(", "),
      attendance: attendance === "yes" ? "Attending" : "Declined",
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
  const chipInactiveText = isLight ? "text-white/50" : "text-muted-foreground";
  const chipActiveBg = isLight
    ? "bg-white text-foreground border-white"
    : "bg-foreground text-white border-foreground";

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
        Kindly respond before August 15th, 2026.
      </p>

      {status === "success" ? (
        <motion.div className="flex flex-col items-center gap-4 py-10" initial={{ scale: 0.9 }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-dusty-blue">
            <Check className="w-7 h-7 text-white" />
          </div>
          <p className={`font-serif italic text-lg ${isLight ? "text-white" : ""}`}>
            {attendance === "yes" ? "We can't wait to celebrate with you!" : "Thank you for letting us know."}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="text-left space-y-8">
          <div>
            <label className={`block ${mutedColor} tracking-widest uppercase mb-4 text-[0.6rem] font-montserrat`}>
              Guests
            </label>
            <div className="flex flex-wrap gap-2">
              {invitedNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleName(name)}
                  className={`px-4 py-2 border rounded-full transition-all text-xs font-montserrat tracking-tight ${
                    selectedAttendees.includes(name)
                      ? chipActiveBg
                      : `${chipBorder} ${chipInactiveText} opacity-40`
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
            <p className={`mt-3 text-[0.6rem] ${mutedColor} italic leading-relaxed`}>
              {attendance === "no"
                ? "* Select the names of those who are declining."
                : "* Select the names of those who will be attending."}
            </p>
          </div>

          <div className="flex gap-3">
            {(["yes", "no"] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAttendance(val)}
                className={`flex-1 py-4 border rounded-sm transition-all text-[0.65rem] tracking-widest uppercase font-montserrat ${
                  attendance === val ? "bg-dusty-blue border-dusty-blue text-white" : `${chipBorder} ${mutedColor}`
                }`}
              >
                {val === "yes" ? "Accepts" : "Declines"}
              </button>
            ))}
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
            disabled={status === "submitting" || !attendance || selectedAttendees.length === 0}
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