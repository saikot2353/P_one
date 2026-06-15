import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, CheckCircle2, Clock } from "lucide-react";

interface RequestManualAttendanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: string;
}

const inputClass =
  "w-full h-9 px-3 text-[13px] font-medium text-foreground bg-muted/30 dark:bg-slate-900/50 border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 hover:border-border dark:hover:border-slate-700 transition-all placeholder:text-muted-foreground/50";

const labelClass = "block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export function RequestManualAttendanceModal({ open, onOpenChange, selectedDate }: RequestManualAttendanceModalProps) {
  const [date, setDate] = useState(selectedDate);
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [reason, setReason] = useState("");

  // Sync state if selectedDate prop changes
  useEffect(() => {
    if (open) {
      setDate(selectedDate);
      setInTime("");
      setOutTime("");
      setReason("");
    }
  }, [open, selectedDate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 bg-white dark:bg-slate-900 border border-border/40 dark:border-slate-800 shadow-2xl rounded-lg overflow-hidden gap-0 [&>button]:hidden text-foreground">

        {/* Header */}
        <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between bg-muted/10 dark:bg-slate-900 shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-foreground tracking-tight">Manual Attendance Request</h2>
            <p className="text-[11px] text-muted-foreground/80 mt-0.5">Submit request for missed punches</p>
          </div>
          <button onClick={() => onOpenChange(false)} className="size-8 rounded-full bg-white dark:bg-slate-800 hover:bg-muted dark:hover:bg-slate-700 border border-border/50 dark:border-slate-700 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm">
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

            <Field label="Attendance Date" required>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Reason" required>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Forgot to punch"
                className={inputClass}
              />
            </Field>

            <Field label="In Time" required>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <input
                  type="time"
                  value={inTime}
                  onChange={e => setInTime(e.target.value)}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>

            <Field label="Out Time" required>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <input
                  type="time"
                  value={outTime}
                  onChange={e => setOutTime(e.target.value)}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/50 bg-muted/10 dark:bg-slate-900 flex items-center justify-between">
          <p className="text-[10.5px] text-muted-foreground">
            Fields marked with <span className="text-rose-400 font-bold">*</span> are required
          </p>
          <button
            onClick={() => onOpenChange(false)}
            className="h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-[12px] font-semibold rounded-lg transition-all shadow-sm flex items-center gap-2"
          >
            <CheckCircle2 className="size-3.5" />
            Submit Request
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
