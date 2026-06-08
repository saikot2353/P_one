import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ChevronRight, Paperclip, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/ssp-leave-requisition")({
  component: LeaveRequisitionPage,
});

const inputClass =
  "w-full h-9 px-3 text-[13px] font-medium text-foreground bg-muted/30 border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 hover:border-border transition-all placeholder:text-muted-foreground/50";

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

export default function LeaveRequisitionPage() {
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [leaveCategory, setLeaveCategory] = useState("Full Day Leave");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [purpose, setPurpose] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [responsible, setResponsible] = useState("");
  const [onBehalf, setOnBehalf] = useState(false);
  const [onBehalfEmp, setOnBehalfEmp] = useState("");
  const [fileName, setFileName] = useState("");

  const leaveTypeOptions = [
    { value: "Casual Leave", label: "Casual Leave" },
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Earned Leave", label: "Earned Leave" },
  ];

  const categoryOptions = [
    { value: "Full Day Leave", label: "Full Day Leave" },
    { value: "Half Day Leave", label: "Half Day Leave" },
  ];

  const employeeOptions = [
    { value: "emp1", label: "Md. Anik Islam (Deputy Manager)" },
    { value: "emp2", label: "Rajebul Hasan Rajon (Deputy Manager)" },
    { value: "emp3", label: "Md. Zahidul Islam (COO)" },
  ];

  const totalDays = useMemo(() => {
    if (!dateFrom || !dateTo) return null;
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diff = to.getTime() - from.getTime();
    if (diff < 0) return null;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    return leaveCategory === "Half Day Leave" ? 0.5 : days;
  }, [dateFrom, dateTo, leaveCategory]);

  const balances = [
    { type: "Casual Leave", assigned: 10, enjoyed: 3, balance: 7 },
    { type: "Sick Leave", assigned: 14, enjoyed: 2, balance: 12 },
    { type: "Earned Leave", assigned: 18, enjoyed: 0, balance: 18 },
  ];

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        {/* Page Content */}
        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 gap-3">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3" />
            <Link to="/ssp-new-requisition" className="hover:text-foreground transition-colors">SSP</Link>
            <ChevronRight className="size-3" />
            <Link to="/ssp-new-requisition" className="hover:text-foreground transition-colors">New Requisition</Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-semibold">Leave Requisition</span>
          </div>

          {/* Two-column layout */}
          <div className="flex-1 flex gap-5 min-h-0">

            {/* ── LEFT: Form Card ───────────────────────────── */}
            <div className="flex-1 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col overflow-hidden">

              {/* Card Header */}
              <div className="px-5 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-primary" />
                  <span className="text-sm font-bold text-foreground tracking-tight">Leave Application Form</span>
                </div>
                <span className="text-[10px] text-muted-foreground bg-muted rounded px-2 py-0.5 font-medium">
                  {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>

              {/* Form Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">

                  <Field label="Leave Type" required>
                    <SearchableSelect
                      value={leaveType}
                      onChange={setLeaveType}
                      options={leaveTypeOptions}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Leave Category" required>
                    <SearchableSelect
                      value={leaveCategory}
                      onChange={setLeaveCategory}
                      options={categoryOptions}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Duration From" required>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={e => setDateFrom(e.target.value)}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Duration To" required>
                    <div className="flex gap-2 items-center">
                      <input
                        type="date"
                        value={dateTo}
                        onChange={e => setDateTo(e.target.value)}
                        className={inputClass}
                      />
                      {totalDays !== null && (
                        <span className="shrink-0 text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-xl whitespace-nowrap">
                          {totalDays} {totalDays === 1 ? "Day" : "Days"}
                        </span>
                      )}
                    </div>
                  </Field>

                  <Field label="Purpose / Reason" required>
                    <input
                      type="text"
                      value={purpose}
                      onChange={e => setPurpose(e.target.value)}
                      placeholder="e.g. Medical appointment"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Address during Leave" required>
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="e.g. 42 Mirpur Road, Dhaka"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Contact Number" required>
                    <input
                      type="text"
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                      placeholder="+8801XXXXXXXXX"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Responsible Employee">
                    <SearchableSelect
                      value={responsible}
                      onChange={setResponsible}
                      options={employeeOptions}
                      placeholder="Select employee..."
                      className={inputClass}
                    />
                  </Field>

                  {/* Attachment - full width */}
                  <div className="col-span-2">
                    <label className={labelClass}>Attachment (if any)</label>
                    <label className="flex items-center gap-3 h-9 w-full px-3 bg-muted/30 border border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 hover:border-primary/40 transition-all group">
                      <Paperclip className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <span className="text-[12px] text-muted-foreground group-hover:text-foreground transition-colors truncate">
                        {fileName || "Click to attach a document  —  PDF, JPG, PNG (max 5MB)"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => setFileName(e.target.files?.[0]?.name || "")}
                      />
                    </label>
                  </div>

                </div>
              </div>

              {/* Card Footer: Submit */}
              <div className="px-5 py-3 border-t border-border/50 bg-muted/10 flex items-center justify-between shrink-0">
                <p className="text-[10.5px] text-muted-foreground">
                  Fields marked with <span className="text-rose-400 font-bold">*</span> are required
                </p>
                <button className="h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-[12px] font-semibold rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] flex items-center gap-2">
                  <CheckCircle2 className="size-3.5" />
                  Submit Requisition
                </button>
              </div>
            </div>

            {/* ── RIGHT: Balance + On Behalf ────────────────── */}
            <div className="w-[310px] flex flex-col gap-4 shrink-0">

              {/* Leave Balance Card */}
              <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-border/50 bg-muted/20 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-emerald-500" />
                  <span className="text-[12px] font-bold text-foreground">Leave Balance 2026</span>
                </div>

                <div className="p-3 space-y-2">
                  {balances.map(b => {
                    const pct = Math.round((b.enjoyed / b.assigned) * 100);
                    return (
                      <div key={b.type} className="p-3 rounded-2xl bg-muted/20 border border-border/40 hover:bg-muted/30 transition-colors">
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="text-[12px] font-semibold text-foreground">{b.type}</span>
                          <span className="text-[11px] font-bold text-emerald-600">{b.balance} left</span>
                        </div>
                        <div className="h-1 rounded-full bg-border/60 overflow-hidden mb-1.5">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex gap-3 text-[10px] text-muted-foreground">
                          <span>Assigned: <b className="text-foreground">{b.assigned}</b></span>
                          <span>Used: <b className="text-foreground">{b.enjoyed}</b></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* On Behalf Card */}
              <div className="bg-card border border-border/60 rounded-xl shadow-sm p-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={onBehalf}
                      onChange={e => setOnBehalf(e.target.checked)}
                    />
                    <div className="w-9 h-5 rounded-full bg-muted border border-border peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-4" />
                  </div>
                  <div>
                    <span className="text-[12px] font-semibold text-foreground group-hover:text-rose-500 transition-colors">Apply on Behalf</span>
                    <p className="text-[10px] text-muted-foreground">Submit request for another employee</p>
                  </div>
                </label>

                <div className={`overflow-hidden transition-all duration-300 ease-out ${onBehalf ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
                  <label className={labelClass}>Select Employee</label>
                  <SearchableSelect
                    value={onBehalfEmp}
                    onChange={setOnBehalfEmp}
                    options={employeeOptions}
                    placeholder="Search employee..."
                    className={inputClass}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
