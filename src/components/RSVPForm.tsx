import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5JtiSLlCth_McxFSoy7FLPxY4VIDoHpMFJKix_wADo9ugx4PnTXE_ws-iWv8Xu1Isbw/exec";

const RSVPForm = () => {
  const [invitedNames, setInvitedNames] = useState<string[]>([]);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [attendance, setAttendance] = useState<"yes" | "no" | "">("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Parse names from URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const namesParam = params.get("names");
    if (namesParam) {
      const namesArray = namesParam.split(",").map(n => n.trim());
      setInvitedNames(namesArray);
      // Default them all to selected initially
      setSelectedAttendees(namesArray);
    }
  }, []);

  const toggleName = (name: string) => {
    setSelectedAttendees(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendance || selectedAttendees.length === 0) return;
    setStatus("submitting");

    // Format data for Google Sheets
    const payload = new URLSearchParams({
      name: invitedNames.join(", "), // Who the link was sent to
      attendees: selectedAttendees.join(", "), // Who this specific response is for
      attendance: attendance === "yes" ? "Attending" : "Declined",
      message: message,
      date: new Date().toLocaleString("en-GB"), // Clean date format
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

  if (invitedNames.length === 0) return null; // Don't show RSVP if no names in link

  return (
    <motion.div
      className="text-center py-20 px-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <p className="text-dusty-blue tracking-[0.3em] uppercase mb-2 text-[0.62rem] font-montserrat">
        Be Our Guest
      </p>
      <h2 className="text-foreground mb-1 font-serif text-[clamp(2rem,6vw,2.8rem)] font-light tracking-wider">
        RSVP
      </h2>
      <p className="text-muted-foreground italic mb-8 font-serif">
        Kindly respond before 1st July 2026
      </p>

      {status === "success" ? (
        <motion.div className="flex flex-col items-center gap-4 py-10" initial={{ scale: 0.9 }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-dusty-blue">
            <Check className="w-7 h-7 text-white" />
          </div>
          <p className="font-serif italic text-lg">
            {attendance === "yes" ? "We can't wait to celebrate with you!" : "Thank you for letting us know."}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="text-left space-y-8">
          
          {/* Display Names from Link */}
          <div>
            <label className="block text-muted-foreground tracking-widest uppercase mb-4 text-[0.6rem] font-montserrat">
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
                    ? "bg-foreground text-white border-foreground" 
                    : "border-dusty-blue-pale text-muted-foreground opacity-40"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[0.6rem] text-muted-foreground italic leading-relaxed">
              {attendance === "no" 
                ? "* Select the names of those who are declining." 
                : "* Select the names of those who will be attending."}
            </p>
          </div>

          {/* Attendance Choice */}
          <div className="flex gap-3">
            {(["yes", "no"] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAttendance(val)}
                className={`flex-1 py-4 border rounded-sm transition-all text-[0.65rem] tracking-widest uppercase font-montserrat ${
                  attendance === val ? "bg-dusty-blue border-dusty-blue text-white" : "border-dusty-blue-pale text-muted-foreground"
                }`}
              >
                {val === "yes" ? "Accepts" : "Declines"}
              </button>
            ))}
          </div>

          {/* Message */}
          <div>
            <label className="block text-muted-foreground tracking-widest uppercase mb-2 text-[0.6rem] font-montserrat">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-dusty-blue-pale rounded-sm bg-transparent focus:outline-none focus:border-dusty-blue"
              placeholder="Leave a note..."
              rows={2}
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting" || !attendance || (attendance === 'yes' && selectedAttendees.length === 0)}
            className="w-full py-4 bg-foreground text-white uppercase tracking-[0.2em] text-[0.7rem] hover:bg-dusty-blue transition-colors disabled:opacity-30"
          >
            {status === "submitting" ? "Sending..." : "Confirm RSVP"}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default RSVPForm;