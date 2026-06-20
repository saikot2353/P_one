import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Calendar, ChevronRight, User, Phone, MapPin, FileText, Upload, Send, RefreshCw, AlertCircle, FileCheck,
  Briefcase, Building2, Map, CalendarDays, HelpCircle, Layers, CheckCircle2, Trash2
} from "lucide-react";

export const Route = createFileRoute("/leave-application")({
  head: () => ({
    meta: [
      { title: "Leave Application — CRIPTON" },
      { name: "description", content: "Submit employee leave requests, configure pay parameters, and review balance summaries." },
    ],
  }),
  component: LeaveApplicationPage,
});

interface EmployeeData {
  id: string;
  name: string;
  type: string;
  joiningDate: string;
  designation: string;
  section: string;
  unit: string;
  line: string;
}

const mockEmployees: Record<string, EmployeeData> = {
  "2023043910": {
    id: "2023043910",
    name: "Tahmid Afsar Shapno",
    type: "Permanent",
    joiningDate: "01/08/2023",
    designation: "Asst. Manager",
    section: "Project Resource & Strategy",
    unit: "PSL",
    line: "N/A"
  },
  "2016001055": {
    id: "2016001055",
    name: "Md. Zahidul Islam",
    type: "Management",
    joiningDate: "16/05/2016",
    designation: "Chief Operating Officer",
    section: "Executive Committee",
    unit: "Pakiza Software Limited (Head Office)",
    line: "Management Block"
  },
  "2022035599": {
    id: "2022035599",
    name: "Dipon Saha",
    type: "Staff / Full-Time",
    joiningDate: "01/01/2022",
    designation: "Senior Software Engineer",
    section: "Core Development (HR)",
    unit: "Pakiza Software Limited (Head Office)",
    line: "Engineering Block - L2"
  }
};

function LeaveApplicationPage() {
  // Form States
  const [year, setYear] = useState("2026");
  const [attendanceBonus, setAttendanceBonus] = useState("Yes");
  const [employeeId, setEmployeeId] = useState("2023043910");

  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [leavePayWith, setLeavePayWith] = useState("With Pay");
  const [durationFrom, setDurationFrom] = useState("");
  const [durationTo, setDurationTo] = useState("");
  const [purpose, setPurpose] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [responsibleEmp, setResponsibleEmp] = useState("");
  const [fileName, setFileName] = useState("");

  const matchedEmployee = useMemo(() => {
    return mockEmployees[employeeId.trim()] || null;
  }, [employeeId]);

  const calculatedDays = useMemo(() => {
    if (!durationFrom || !durationTo) return 0;
    const start = new Date(durationFrom);
    const end = new Date(durationTo);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 0 : Math.max(diffDays, 0);
  }, [durationFrom, durationTo]);

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedEmployee) {
      alert("Please enter a valid Employee ID first!");
      return;
    }
    if (!durationFrom || !durationTo) {
      alert("Please select both From and To dates!");
      return;
    }
    if (calculatedDays <= 0) {
      alert("Invalid leave duration range chosen!");
      return;
    }

    setSuccessMessage(
      `Leave Application successfully submitted! ID: LEAVE-${Math.floor(1000 + Math.random() * 9000)}. Dynamic parameters allocated with ${leavePayWith}.`
    );

    setTimeout(() => {
      setSuccessMessage("");
    }, 6000);

    setDurationFrom("");
    setDurationTo("");
    setPurpose("");
    setAddress("");
    setContactNumber("");
    setResponsibleEmp("");
    setFileName("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">

          {/* Breadcrumb and Modern Page Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#3f51b5]/10 via-[#00bcd4]/10 to-[#9c27b0]/5 dark:from-[#3f51b5]/25 dark:via-[#00bcd4]/20 dark:to-[#9c27b0]/15 rounded-2xl border border-primary/10 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3 text-muted-foreground/60" />
                <span>Leave Management</span>
                <ChevronRight className="size-3 text-muted-foreground/60" />
                <span className="text-primary font-extrabold">Application Hub</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                  <CalendarDays className="size-6 animate-pulse" />
                </div>
                <span>Leave Application</span>
              </h1>
            </div>

            <div className="relative z-10 text-[10.5px] font-black uppercase bg-primary/10 text-primary px-5 py-2.5 rounded-xl border border-primary/20 shadow-xs backdrop-blur-sm self-start sm:self-center">
              Fiscal Calendar Year: {year}
            </div>
          </div>

          {/* Clean Success Banner */}
          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-3 animate-in slide-in-from-top duration-300 shadow-sm">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-500 animate-bounce" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Form Section */}
            <div className="xl:col-span-2 space-y-6">

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* PART 1: APPLICANT DETAILS */}
                <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/40 to-transparent" />
                  
                  <div className="flex items-center gap-2.5 border-b border-border/40 pb-3.5">
                    <div className="size-7 rounded-lg bg-primary/10 text-primary grid place-items-center font-bold text-xs border border-primary/20">01</div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Applicant Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Year *</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-muted/20 border border-border/80 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Attendance Bonus</label>
                      <select
                        value={attendanceBonus}
                        onChange={(e) => setAttendanceBonus(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-muted/20 border border-border/80 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Employee ID *</label>
                      <div className="relative">
                        <User className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          placeholder="e.g. 2023043910"
                          className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-muted/20 border border-border/80 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Elegant dynamically fetched employee details */}
                  {matchedEmployee ? (
                    <div className="p-5 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.03] to-transparent dark:from-primary/[0.01] grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">

                      <div className="md:col-span-2 flex items-center gap-3.5 border-b border-border/40 pb-3">
                        <div className="size-10 rounded-xl bg-gradient-to-tr from-primary to-primary-glow text-white grid place-items-center font-bold text-xs shadow-md shadow-primary/25">
                          {matchedEmployee.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-foreground">{matchedEmployee.name}</h4>
                          <span className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/25 px-2 py-0.5 rounded-md mt-0.5 inline-block">{matchedEmployee.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="size-8 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center shrink-0">
                          <Briefcase className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-[9px] text-muted-foreground font-black uppercase">Designation & Team</div>
                          <div className="font-extrabold text-foreground">{matchedEmployee.designation}</div>
                          <div className="text-[10px] text-muted-foreground/90 font-medium">{matchedEmployee.section}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="size-8 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center shrink-0">
                          <Building2 className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-[9px] text-muted-foreground font-black uppercase">Corporate Unit</div>
                          <div className="font-extrabold text-foreground">{matchedEmployee.unit}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="size-8 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center shrink-0">
                          <CalendarDays className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-[9px] text-muted-foreground font-black uppercase">Joining Date</div>
                          <div className="font-extrabold text-foreground">{matchedEmployee.joiningDate}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="size-8 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center shrink-0">
                          <Layers className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-[9px] text-muted-foreground font-black uppercase">Allocated Floor Line</div>
                          <div className="font-extrabold text-foreground">{matchedEmployee.line}</div>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/[0.02] flex items-center gap-3">
                      <AlertCircle className="size-5 text-amber-500 shrink-0" />
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-extrabold">
                        Enter a valid Employee ID to dynamically verify applicant qualifications.
                      </span>
                    </div>
                  )}

                </div>

                {/* PART 2: LEAVE PERIOD DETAILS */}
                <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500/40 to-transparent" />

                  <div className="flex items-center gap-2.5 border-b border-border/40 pb-3.5">
                    <div className="size-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 grid place-items-center font-bold text-xs border border-cyan-500/20">02</div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Leave Schedule & Type</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Leave Type *</label>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-muted/20 border border-border/80 text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                      >
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Earned Leave">Earned Leave</option>
                        <option value="Maternity Leave">Maternity Leave</option>
                        <option value="Special Leave">Special Leave</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Leave Pay With *</label>
                      <select
                        value={leavePayWith}
                        onChange={(e) => setLeavePayWith(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-muted/20 border border-border/80 text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                      >
                        <option value="With Pay">With Pay</option>
                        <option value="Without Pay">Without Pay</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Leave Duration From *</label>
                      <input
                        type="date"
                        required
                        value={durationFrom}
                        onChange={(e) => setDurationFrom(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-muted/20 border border-border/80 text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Leave Duration To *</label>
                      <input
                        type="date"
                        required
                        value={durationTo}
                        onChange={(e) => setDurationTo(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-muted/20 border border-border/80 text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-foreground"
                      />
                    </div>
                  </div>

                  {calculatedDays > 0 && (
                    <div className="p-4 bg-sky-500/10 dark:bg-sky-500/[0.02] border border-sky-500/20 rounded-xl text-[11px] font-extrabold text-sky-600 dark:text-sky-400 flex items-center justify-between shadow-2xs animate-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-sky-500" />
                        <span>Formulated Requested Leave Period:</span>
                      </div>
                      <span className="bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-black transition shadow-sm">
                        {calculatedDays} {calculatedDays === 1 ? "Calendar Day" : "Calendar Days"}
                      </span>
                    </div>
                  )}

                </div>

                {/* PART 3: COVERAGE & LOGISTICS */}
                <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500/40 to-transparent" />

                  <div className="flex items-center gap-2.5 border-b border-border/40 pb-3.5">
                    <div className="size-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 grid place-items-center font-bold text-xs border border-purple-500/20">03</div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Coverage & Logistics</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Purpose / Reason</label>
                      <textarea
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="Detail the circumstances of this leave application..."
                        className="w-full h-24 p-3.5 rounded-xl bg-muted/20 border border-border/80 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-background transition-all resize-none placeholder:text-muted-foreground/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Address during Leave</label>
                      <div className="relative">
                        <MapPin className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. Village/Post/District details"
                          className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-muted/20 border border-border/80 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-background transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Contact Number during Leave</label>
                      <div className="relative">
                        <Phone className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          placeholder="e.g. +880 17xx-xxxxxx"
                          className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-muted/20 border border-border/80 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-background transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Responsible Employee</label>
                      <div className="relative">
                        <RefreshCw className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 animate-spin-slow" />
                        <input
                          type="text"
                          value={responsibleEmp}
                          onChange={(e) => setResponsibleEmp(e.target.value)}
                          placeholder="ID / Name of coverage officer"
                          className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-muted/20 border border-border/80 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-background transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Attachment (if any)</label>
                      <div className="flex items-center gap-3">
                        <label className="h-10 px-4 rounded-xl bg-muted/20 border border-border/80 hover:bg-muted/30 text-foreground cursor-pointer flex items-center gap-2 transition-all select-none text-xs font-bold">
                          <Upload className="size-4 text-muted-foreground" />
                          <span>Choose File</span>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[10.5px] font-black text-muted-foreground truncate max-w-[150px]">
                          {fileName || "No file chosen"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Submissions Action footer */}
                <div className="flex justify-end gap-3 p-5 bg-card border border-border/80 rounded-2xl shadow-xs print:hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setDurationFrom("");
                      setDurationTo("");
                      setPurpose("");
                      setAddress("");
                      setContactNumber("");
                      setResponsibleEmp("");
                      setFileName("");
                    }}
                    className="h-11 px-5 rounded-xl border border-border/80 hover:bg-muted/30 text-foreground font-black text-xs transition uppercase tracking-wider"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-8 bg-primary hover:bg-primary-glow text-primary-foreground font-black text-xs rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 transition uppercase tracking-wider active:scale-[0.98]"
                  >
                    <Send className="size-4 animate-pulse" />
                    <span>Submit Leave Proposal</span>
                  </button>
                </div>

              </form>

            </div>

            {/* Sidebar Balance summary */}
            <div className="space-y-6">

              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500/40 to-transparent" />
                
                <div className="border-b border-border/40 pb-3 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Leave Ledger Summary</h3>
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Casual Leave", spent: 4, limit: 10, fill: "from-blue-500 to-indigo-500", text: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
                    { label: "Sick Leave", spent: 3, limit: 14, fill: "from-emerald-500 to-teal-500", text: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
                    { label: "Earned Leave", spent: 6, limit: 18, fill: "from-amber-500 to-orange-500", text: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
                    { label: "Maternity Leave", spent: 0, limit: 90, fill: "from-purple-500 to-fuchsia-500", text: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
                    { label: "Leave Without Pay", spent: 2, limit: 30, fill: "from-rose-500 to-pink-500", text: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" }
                  ].map((lv, idx) => {
                    const remaining = lv.limit - lv.spent;
                    const percent = (lv.spent / lv.limit) * 100;

                    return (
                      <div key={idx} className="space-y-2.5 p-4 rounded-xl border border-border/50 bg-muted/5 hover:bg-muted/10 hover:shadow-xs transition duration-200">
                        <div className="flex items-center justify-between text-xs font-bold text-foreground">
                          <span>{lv.label}</span>
                          <span className={`font-black ${lv.text}`}>{remaining} / {lv.limit} Days Left</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden border border-border/40">
                          <div className={`h-full bg-gradient-to-r ${lv.fill} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-muted-foreground font-black uppercase tracking-wider">
                          <span>Consumed: {lv.spent} Days</span>
                          <span>Allocated: {lv.limit} Days</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Policy notes card */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-transparent" />
                
                <div className="flex items-center gap-2.5 text-primary font-black text-[11px] uppercase tracking-wider border-b border-border/40 pb-3">
                  <FileText className="size-4 animate-bounce text-primary" />
                  <span>Leave Regulation Policy</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-bold leading-relaxed">
                  All requests must be submitted at least 24 hours prior for single day leaves, and 7 days prior for leaves exceeding 3 calendar days. Attachment documentation is highly recommended for Sick Leaves exceeding 2 days.
                </p>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
