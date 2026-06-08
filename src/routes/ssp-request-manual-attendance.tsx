import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ChevronRight, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/ssp-request-manual-attendance")({
  component: RequestManualAttendancePage,
});

const inputClass =
  "w-full h-9 px-3 text-[13px] font-medium text-foreground bg-muted/30 dark:bg-slate-900/50 border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 hover:border-border dark:hover:border-slate-700 transition-all placeholder:text-muted-foreground/50";

const labelClass = "block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function RequestManualAttendancePage() {
  const [date, setDate] = useState("");
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [reason, setReason] = useState("");

  const recentRequests = [
    { id: 1, date: "02/06/2026", in: "09:00 AM", out: "06:00 PM", type: "Forgot to Punch", status: "Approved" },
    { id: 2, date: "15/05/2026", in: "08:50 AM", out: "06:15 PM", type: "Official Duty Outside", status: "Approved" },
    { id: 3, date: "10/04/2026", in: "10:00 AM", out: "07:00 PM", type: "Machine Not Working", status: "Rejected" },
  ];

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden font-sans antialiased tracking-tight">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 gap-4 bg-slate-50/50 dark:bg-slate-950/20">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground shrink-0">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3" />
            <Link to="/ssp-attendance" className="hover:text-foreground transition-colors">Attendance</Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground dark:text-slate-300 font-semibold">Request Manual Attendance</span>
          </div>

          <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2 pb-4">

            {/* ── TOP: Form Card ───────────────────────────── */}
            <div className="bg-card border border-border/60 rounded-xl shadow-sm flex flex-col shrink-0">

              <div className="px-5 py-3 border-b border-border/50 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-primary" />
                  <span className="text-sm font-bold text-foreground tracking-tight">Manual Attendance Request</span>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">

                  <Field label="Attendance Date" required>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
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

                  <Field label="Reason" required>
                    <input
                      type="text"
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      placeholder="e.g. Forgot to punch"
                      className={inputClass}
                    />
                  </Field>

                </div>
              </div>

              <div className="px-5 py-3 border-t border-border/50 bg-slate-50/50 dark:bg-slate-900/60 flex items-center justify-between">
                <p className="text-[10.5px] text-muted-foreground">
                  Fields marked with <span className="text-rose-500 font-bold">*</span> are required
                </p>
                <button className="h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-[12px] font-semibold rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] flex items-center gap-2 cursor-pointer">
                  <CheckCircle2 className="size-3.5" />
                  Submit Request
                </button>
              </div>

            </div>

            {/* ── BOTTOM: Recent Requests Table ────────────────── */}
            <div className="bg-card border border-border/60 rounded-xl shadow-sm flex flex-col flex-1 min-h-[300px]">
              <div className="px-5 py-3 border-b border-border/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2 shrink-0">
                <div className="w-1 h-4 rounded-full bg-blue-500" />
                <span className="text-[13px] font-bold text-foreground">Recent Manual Requests</span>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-[12px] whitespace-nowrap">
                  <thead className="bg-slate-50/50 dark:bg-slate-950/20 text-muted-foreground border-b border-border/50 sticky top-0">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Date</th>
                      <th className="px-5 py-3 font-semibold">In Time</th>
                      <th className="px-5 py-3 font-semibold">Out Time</th>
                      <th className="px-5 py-3 font-semibold">Reason</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900/40 text-foreground">
                    {recentRequests.map(req => (
                      <tr key={req.id} className="border-b border-border/30 dark:border-slate-800/40 last:border-0 hover:bg-muted/10 transition-colors">
                        <td className="px-5 py-3.5 font-medium">{req.date}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{req.in}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{req.out}</td>
                        <td className="px-5 py-3.5 font-medium">{req.type}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border ${
                            req.status === "Approved" 
                              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30" 
                              : "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/30"
                          }`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
