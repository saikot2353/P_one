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
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a] text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          
          {/* Breadcrumb and Modern Page Header */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Leave Management</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-extrabold">Application Hub</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <CalendarDays className="size-6 text-primary animate-pulse" />
                <span>Leave Application</span>
              </h1>
            </div>
            
            <div className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 select-none">
              Fiscal Calendar Year: {year}
            </div>
          </div>

          {/* Clean Success Banner */}
          {successMessage && (
            <div className="bg-emerald-500/10 border-2 border-emerald-500/25 p-4 rounded-xl text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-3 animate-in slide-in-from-top duration-300 shadow-xs">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-500 animate-bounce" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Form Section */}
            <div className="xl:col-span-2 space-y-6">
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* PART 1: APPLICANT DETAILS */}
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="size-7 rounded-lg bg-primary/10 text-primary grid place-items-center font-bold text-xs">01</div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Applicant Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Year *</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition"
                      >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Attendance Bonus</label>
                      <select
                        value={attendanceBonus}
                        onChange={(e) => setAttendanceBonus(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Employee ID *</label>
                      <div className="relative">
                        <User className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          placeholder="e.g. 2023043910"
                          className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-950 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Elegant dynamically fetched employee details */}
                  {matchedEmployee ? (
                    <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/[0.02] grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="md:col-span-2 flex items-center gap-3 border-b border-primary/10 pb-3">
                        <div className="size-9 rounded-full bg-primary/20 text-primary grid place-items-center font-bold text-xs">
                          {matchedEmployee.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white">{matchedEmployee.name}</h4>
                          <span className="text-[10px] font-bold text-primary/80">{matchedEmployee.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs">
                        <Briefcase className="size-4 text-slate-400 shrink-0" />
                        <div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">Designation & Team</div>
                          <div className="font-extrabold text-slate-700 dark:text-slate-300">{matchedEmployee.designation} ({matchedEmployee.section})</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs">
                        <Building2 className="size-4 text-slate-400 shrink-0" />
                        <div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">Corporate Unit</div>
                          <div className="font-extrabold text-slate-700 dark:text-slate-300">{matchedEmployee.unit}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs">
                        <Map className="size-4 text-slate-400 shrink-0" />
                        <div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">Joining Date</div>
                          <div className="font-extrabold text-slate-700 dark:text-slate-300">{matchedEmployee.joiningDate}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs">
                        <Layers className="size-4 text-slate-400 shrink-0" />
                        <div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">Allocated Floor Line</div>
                          <div className="font-extrabold text-slate-700 dark:text-slate-300">{matchedEmployee.line}</div>
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
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="size-7 rounded-lg bg-primary/10 text-primary grid place-items-center font-bold text-xs">02</div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Leave Schedule & Type</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Leave Type *</label>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition"
                      >
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Earned Leave">Earned Leave</option>
                        <option value="Maternity Leave">Maternity Leave</option>
                        <option value="Special Leave">Special Leave</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Leave Pay With *</label>
                      <select
                        value={leavePayWith}
                        onChange={(e) => setLeavePayWith(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition"
                      >
                        <option value="With Pay">With Pay</option>
                        <option value="Without Pay">Without Pay</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Leave Duration From *</label>
                      <input
                        type="date"
                        required
                        value={durationFrom}
                        onChange={(e) => setDurationFrom(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Leave Duration To *</label>
                      <input
                        type="date"
                        required
                        value={durationTo}
                        onChange={(e) => setDurationTo(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition"
                      />
                    </div>
                  </div>

                  {calculatedDays > 0 && (
                    <div className="p-4 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/50 rounded-xl text-[11px] font-extrabold text-sky-800 dark:text-sky-400 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-sky-500" />
                        <span>Formulated Requested Leave Period:</span>
                      </div>
                      <span className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded-lg text-xs font-black transition">
                        {calculatedDays} {calculatedDays === 1 ? "Calendar Day" : "Calendar Days"}
                      </span>
                    </div>
                  )}

                </div>

                {/* PART 3: COVERAGE & LOGISTICS */}
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="size-7 rounded-lg bg-primary/10 text-primary grid place-items-center font-bold text-xs">03</div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Coverage & Logistics</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Purpose / Reason</label>
                      <textarea
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="Detail the circumstances of this leave application..."
                        className="w-full h-20 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-950 transition resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Address during Leave</label>
                      <div className="relative">
                        <MapPin className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. Village/Post/District details"
                          className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Contact Number during Leave</label>
                      <div className="relative">
                        <Phone className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          placeholder="e.g. +880 17xx-xxxxxx"
                          className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Responsible Employee</label>
                      <div className="relative">
                        <RefreshCw className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 animate-spin-slow" />
                        <input
                          type="text"
                          value={responsibleEmp}
                          onChange={(e) => setResponsibleEmp(e.target.value)}
                          placeholder="ID / Name of coverage officer"
                          className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Attachment (if any)</label>
                      <div className="flex items-center gap-3">
                        <label className="h-10 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-2 transition select-none">
                          <Upload className="size-4 text-slate-400" />
                          <span>Choose File</span>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[10.5px] font-extrabold text-slate-400 truncate max-w-[150px]">
                          {fileName || "No file chosen"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Submissions Action footer */}
                <div className="flex justify-end gap-3 p-6 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm print:hidden">
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
                    className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 font-extrabold text-xs transition uppercase tracking-wider"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-8 bg-primary hover:bg-primary-glow text-white font-extrabold text-xs rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition uppercase tracking-wider"
                  >
                    <Send className="size-4" />
                    <span>Submit Leave Proposal</span>
                  </button>
                </div>

              </form>

            </div>

            {/* Sidebar Balance summary */}
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Leave Ledger Summary</h3>
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Casual Leave", spent: 4, limit: 10, color: "bg-blue-500 text-blue-500 bg-blue-500/10 border-blue-500/20" },
                    { label: "Sick Leave", spent: 3, limit: 14, color: "bg-emerald-500 text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
                    { label: "Earned Leave", spent: 6, limit: 18, color: "bg-amber-500 text-amber-500 bg-amber-500/10 border-amber-500/20" },
                    { label: "Maternity Leave", spent: 0, limit: 90, color: "bg-purple-500 text-purple-500 bg-purple-500/10 border-purple-500/20" },
                    { label: "Leave Without Pay", spent: 2, limit: 30, color: "bg-rose-500 text-rose-500 bg-rose-500/10 border-rose-500/20" }
                  ].map((lv, idx) => {
                    const remaining = lv.limit - lv.spent;
                    const percent = (lv.spent / lv.limit) * 100;

                    return (
                      <div key={idx} className="space-y-2 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/10 hover:shadow-xs transition duration-200">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                          <span>{lv.label}</span>
                          <span className="font-black text-primary">{remaining} / {lv.limit} Days Left</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                          <div className={`h-full ${lv.color.split(" ")[0]} rounded-full transition-all duration-300`} style={{ width: `${percent}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase">
                          <span>Consumed: {lv.spent} Days</span>
                          <span>Allocated: {lv.limit} Days</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Policy notes card */}
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-3.5">
                <div className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-wider">
                  <FileText className="size-4 animate-bounce text-primary" />
                  <span>Leave Regulation Policy</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
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
