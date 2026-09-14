import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Search,
  Printer,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  XCircle,
  Pencil,
  Clock,
  Filter,
  Calendar,
  User,
  Building2,
  SlidersHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/pending-manual-attendance")({
  component: PendingManualAttendancePage,
});

const EMPLOYEE_TYPES = [
  "ALL",
  "Management",
  "Office Executive",
  "Production Executive",
  "Office Staff",
  "Production Staff",
  "Worker",
  "Pcs Rate Worker",
  "Intern",
];

const SUB_DEPARTMENTS = [
  "ALL",
  "Accounts",
  "Accounts & Finance",
  "Accounts & Vat",
  "Admin",
  "APPS Team",
  "Audit",
  "Blockchain",
  "Business Analysis",
  "Business Development",
  "Business Innovation",
  "Business Intelligence",
  "Compliance",
  "Core Development",
  "Core Development (HR)",
  "Core Sales",
  "DBA",
  "Digital Marketing",
  "EMS",
  "ERP",
  "ERP Team",
  "General ERP (Com, A/C, Fixed Asset, Vat)",
  "House Keeping",
  "HR & Admin",
  "HR & Compliance",
  "HR Team",
  "Human Resources",
  "ICT",
  "Implementation & Support (HR)",
  "Management",
  "Medical",
  "Merchandising-Purchase-MCD",
  "MIS",
  "Project Resource & Strategy",
  "RMG-Production-IE & Planning",
  "Security",
  "TAX",
  "Textile Team",
  "Transport/ Logistic support",
  "Utility",
  "VAT & TAX",
  "WEB-Team",
];

const JOB_TITLES = [
  "ALL",
  "Sr. Welder",
  "A.Q.C",
  "AC Helper",
  "Accounts Officer",
  "Admin Executive",
  "Admin Officer",
  "Advisor",
  "AGM",
  "APM",
  "Assistant Manager",
  "Assistant Officer",
  "Asst. Batch Man",
  "Asst. Care Giver",
  "Asst. Color Master",
  "Asst. Manager",
  "Asst. Officer",
  "Auditor",
  "Batch Man",
  "Business Development Manager",
  "Business Intelligence Manager",
  "CEO",
  "Chairman",
  "Chief Operating Officer",
  "Chief Technical Officer",
  "Commercial Assistant",
  "Computer Operator",
  "Deputy Manager",
  "Designer",
  "Digital Marketing Executive",
  "Director",
  "Doctor",
  "Driver",
  "Executive",
  "Executive Director",
  "General Manager",
  "Graphics Designer",
  "Head of Accounts & Finance",
  "Head of Administration",
  "Head of HR",
  "HR Officer",
  "IE Officer",
  "In-charge",
  "Jr. Executive",
  "Junior Officer",
  "Manager",
  "Managing Director",
  "Medical Officer",
  "Merchandiser",
  "MIS Officer",
  "Office Assistant",
  "Officer",
  "Operator",
  "Planning Manager",
  "Production Manager",
  "Quality Controller",
  "Receptionist",
  "Sales Executive",
  "Security Officer",
  "Senior Officer",
  "Software Developer",
  "Store Keeper",
  "Supervisor",
  "Supply Chain Manager",
  "Technician",
  "Trainee Officer",
  "Welfare Officer",
];

const UNITS = ["ALL", "N/A", "PSL"];
const LINES = ["ALL", "N/A"];
const STATUS_OPTIONS = ["ALL", "Request Approved", "Pending"];

interface AttendanceRequest {
  id: string;
  name: string;
  empType: string;
  subDept: string;
  team: string;
  title: string;
  unit: string;
  line: string;
  date: string;
  inTime: string;
  outDate: string;
  outTime: string;
  reason: string;
  systemBy: string;
  systemDate: string;
  systemInfoIn: string;
  systemInfoOut: string;
  hodStatus: string;
  hrdStatus: string;
  hodName: string;
  status: string;
}

const INITIAL_REQUESTS: AttendanceRequest[] = [
  {
    id: "2024051509",
    name: "Irfan Hossain",
    empType: "Office Executive",
    subDept: "Implementation & Support (HR)",
    team: "ERP Team",
    title: "Jr. Executive",
    unit: "PSL",
    line: "N/A",
    date: "14/09/2026",
    inTime: "08:55:00",
    outDate: "14/09/2026",
    outTime: "18:01:00",
    reason: "Movement to Narayanganj",
    systemBy: "Irfan Hossain",
    systemDate: "14/09/2026",
    systemInfoIn: "In Time Request",
    systemInfoOut: "Out Time Request",
    hodStatus: "Pending",
    hrdStatus: "Pending",
    hodName: "Mazharul Haque",
    status: "Pending",
  },
  {
    id: "2025054315",
    name: "Md. Shahinur Alahi Khan",
    empType: "Office Executive",
    subDept: "Business Development",
    team: "Core Sales",
    title: "Asst. Manager",
    unit: "PSL",
    line: "N/A",
    date: "14/09/2026",
    inTime: "09:00:00",
    outDate: "14/09/2026",
    outTime: "18:00:00",
    reason: "Movement",
    systemBy: "Md. Shahinur Alahi Khan",
    systemDate: "14/09/2026",
    systemInfoIn: "In Time Request",
    systemInfoOut: "Out Time Request",
    hodStatus: "Pending",
    hrdStatus: "Pending",
    hodName: "Rajebul Hasan Rajon",
    status: "Pending",
  },
  {
    id: "2022035599",
    name: "Dipon Saha",
    empType: "Management",
    subDept: "Core Development (HR)",
    team: "Development Team",
    title: "Manager",
    unit: "PSL",
    line: "N/A",
    date: "15/05/2026",
    inTime: "09:15:30",
    outDate: "15/05/2026",
    outTime: "18:05:12",
    reason: "Late In Approval Request - Severe Traffic Jam",
    systemBy: "Dipon Saha",
    systemDate: "15/05/2026",
    systemInfoIn: "Late In Approval Request",
    systemInfoOut: "Out Time Request",
    hodStatus: "Pending",
    hrdStatus: "Pending",
    hodName: "Zakir Hossain",
    status: "Pending",
  },
  {
    id: "2021032646",
    name: "Sadiqul Islam",
    empType: "Office Executive",
    subDept: "Core Sales",
    team: "Retail Sales",
    title: "Deputy Manager",
    unit: "PSL",
    line: "N/A",
    date: "15/05/2026",
    inTime: "08:55:00",
    outDate: "15/05/2026",
    outTime: "18:30:00",
    reason: "Punch In Correction Request - Early morning Client Meeting",
    systemBy: "Sadiqul Islam",
    systemDate: "15/05/2026",
    systemInfoIn: "Punch In Correction Request",
    systemInfoOut: "Out Time Request",
    hodStatus: "Pending",
    hrdStatus: "Pending",
    hodName: "Rajebul Hasan Rajon",
    status: "Pending",
  },
  {
    id: "2016001055",
    name: "Md. Zahidul Islam",
    empType: "Management",
    subDept: "Management",
    team: "Executive Office",
    title: "Chief Operating Officer",
    unit: "PSL",
    line: "N/A",
    date: "16/05/2026",
    inTime: "09:02:45",
    outDate: "16/05/2026",
    outTime: "17:59:58",
    reason: "Out Date Changed",
    systemBy: "Naim Hasan Roky",
    systemDate: "17/05/2026",
    systemInfoIn: "In Time Request",
    systemInfoOut: "Out Date Changed (16/05/2026)",
    hodStatus: "Request Approved",
    hrdStatus: "Pending",
    hodName: "Rakibul Islam Khan",
    status: "Request Approved",
  },
];

function PendingManualAttendancePage() {
  const [requests, setRequests] = useState<AttendanceRequest[]>(INITIAL_REQUESTS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Top Filter Console State
  const [startDate, setStartDate] = useState("2026-09-14");
  const [endDate, setEndDate] = useState("2026-09-14");
  const [selectedEmpType, setSelectedEmpType] = useState("ALL");
  const [selectedSubDept, setSelectedSubDept] = useState("ALL");
  const [selectedJobTitle, setSelectedJobTitle] = useState("ALL");
  const [selectedUnit, setSelectedUnit] = useState("ALL");
  const [selectedLine, setSelectedLine] = useState("ALL");
  const [employeeIdSearch, setEmployeeIdSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [tableSearch, setTableSearch] = useState("");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredRequests.map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApproveSelected = () => {
    if (selectedIds.size === 0) {
      showToast("Please select at least one request to approve!");
      return;
    }
    setRequests((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id)
          ? { ...r, hodStatus: "Request Approved", status: "Request Approved" }
          : r
      )
    );
    showToast(`Successfully Approved ${selectedIds.size} manual attendance request(s)!`);
    setSelectedIds(new Set());
  };

  // Filtered dataset
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (selectedEmpType !== "ALL" && r.empType !== selectedEmpType) return false;
      if (selectedSubDept !== "ALL" && r.subDept !== selectedSubDept) return false;
      if (selectedJobTitle !== "ALL" && r.title !== selectedJobTitle) return false;
      if (selectedUnit !== "ALL" && r.unit !== selectedUnit) return false;
      if (selectedLine !== "ALL" && r.line !== selectedLine) return false;
      if (selectedStatus !== "ALL" && r.status !== selectedStatus) return false;
      if (employeeIdSearch && !r.id.toLowerCase().includes(employeeIdSearch.toLowerCase())) {
        return false;
      }
      if (tableSearch) {
        const q = tableSearch.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.subDept.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [
    requests,
    selectedEmpType,
    selectedSubDept,
    selectedJobTitle,
    selectedUnit,
    selectedLine,
    selectedStatus,
    employeeIdSearch,
    tableSearch,
  ]);

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden font-sans antialiased">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-muted/20 font-sans">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between font-sans">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
              <Link to="/" className="hover:text-foreground transition-colors font-sans">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-semibold font-sans">Human Resource</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-bold font-sans">Approve Manual Attendance</span>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-md animate-in fade-in slide-in-from-top-2 font-sans">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* TOP FILTER CONSOLE (FULL REFERENCE ERP SPECIFICATION) */}
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4 font-sans">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                Attendance Application Search & Filter Console
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 font-sans">
              {/* Start Date */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-muted-foreground font-sans">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm font-sans"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1 font-sans">
                <label className="block text-[11px] font-bold text-muted-foreground font-sans">
                  End Date *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm font-sans"
                />
              </div>

              {/* Employee Type */}
              <div className="space-y-1 font-sans">
                <label className="block text-[11px] font-bold text-muted-foreground font-sans">
                  Employee Type
                </label>
                <select
                  value={selectedEmpType}
                  onChange={(e) => setSelectedEmpType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm font-sans"
                >
                  {EMPLOYEE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Department */}
              <div className="space-y-1 font-sans">
                <label className="block text-[11px] font-bold text-muted-foreground font-sans">
                  Sub Department
                </label>
                <select
                  value={selectedSubDept}
                  onChange={(e) => setSelectedSubDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm font-sans"
                >
                  {SUB_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Title */}
              <div className="space-y-1 font-sans">
                <label className="block text-[11px] font-bold text-muted-foreground font-sans">
                  Job Title
                </label>
                <select
                  value={selectedJobTitle}
                  onChange={(e) => setSelectedJobTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm font-sans"
                >
                  {JOB_TITLES.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit */}
              <div className="space-y-1 font-sans">
                <label className="block text-[11px] font-bold text-muted-foreground font-sans">
                  Unit
                </label>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm font-sans"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line */}
              <div className="space-y-1 font-sans">
                <label className="block text-[11px] font-bold text-muted-foreground font-sans">
                  Line
                </label>
                <select
                  value={selectedLine}
                  onChange={(e) => setSelectedLine(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm font-sans"
                >
                  {LINES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee Id */}
              <div className="space-y-1 font-sans">
                <label className="block text-[11px] font-bold text-muted-foreground font-sans">
                  Employee Id
                </label>
                <input
                  type="text"
                  placeholder="Enter Emp ID..."
                  value={employeeIdSearch}
                  onChange={(e) => setEmployeeIdSearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm font-sans"
                />
              </div>

              {/* Status */}
              <div className="space-y-1 font-sans">
                <label className="block text-[11px] font-bold text-muted-foreground font-sans">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm font-sans"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* SEARCH Action Button */}
              <div className="flex items-end font-sans">
                <button
                  type="button"
                  onClick={() => showToast(`Filtered manual attendance requests!`)}
                  className="w-full h-[38px] text-xs font-extrabold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2 font-sans"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* DATA TABLE CARD & EXPORT TOOLBAR */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden space-y-0 font-sans">
            {/* Action Bar / Toolbar */}
            <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 font-sans">
              <div className="flex items-center gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => showToast("Exported Manual Attendance requests to Excel!")}
                  className="px-3.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/20 transition-all font-sans"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Excel
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg border border-border bg-background text-xs font-bold flex items-center gap-1.5 hover:bg-accent transition-all font-sans"
                >
                  <Printer className="w-4 h-4 text-muted-foreground" />
                  Print
                </button>

                <button
                  type="button"
                  onClick={() => showToast("Generated PDF report for Manual Attendance!")}
                  className="px-3.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-500/20 transition-all font-sans"
                >
                  <FileText className="w-4 h-4 text-rose-600" />
                  PDF
                </button>
              </div>

              {/* Table Quick Search Input */}
              <div className="relative w-full sm:w-64 font-sans">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Quick search table..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm font-sans"
                />
              </div>
            </div>

            {/* HIGH-DENSITY MANUAL ATTENDANCE TABLE */}
            <div className="overflow-x-auto font-sans">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead className="bg-muted/70 text-muted-foreground font-bold border-b border-border uppercase tracking-wider text-[11px] font-sans">
                  <tr>
                    <th className="p-3 text-center w-10 font-sans">#</th>
                    <th className="p-3 text-center w-10 font-sans">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedIds.size === filteredRequests.length &&
                          filteredRequests.length > 0
                        }
                        className="rounded border-border"
                      />
                    </th>
                    <th className="p-3 text-center w-14 font-sans">ACTION</th>
                    <th className="p-3 min-w-[160px] font-sans">Reason</th>
                    <th className="p-3 font-sans">Emp ID</th>
                    <th className="p-3 font-sans">Name</th>
                    <th className="p-3 font-sans">Department</th>
                    <th className="p-3 font-sans">Designation</th>
                    <th className="p-3 text-center font-sans">Date</th>
                    <th className="p-3 text-center font-sans">In Time</th>
                    <th className="p-3 text-center font-sans">Out Date</th>
                    <th className="p-3 text-center font-sans">Out Time</th>
                    <th className="p-3 min-w-[220px] font-sans">System Data</th>
                    <th className="p-3 min-w-[140px] font-sans">HOD</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60 text-xs font-sans">
                  {filteredRequests.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-accent/40 transition-colors font-sans ${
                        selectedIds.has(row.id) ? "bg-emerald-500/5 dark:bg-emerald-500/10" : ""
                      }`}
                    >
                      <td className="p-3 text-center font-bold text-muted-foreground font-sans">
                        {idx + 1}
                      </td>

                      <td className="p-3 text-center font-sans">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                          className="rounded border-border"
                        />
                      </td>

                      <td className="p-3 text-center font-sans">
                        <button
                          type="button"
                          onClick={() => showToast(`Edit request for ${row.name}`)}
                          className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-all font-sans"
                          title="Edit Request"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>

                      <td className="p-3 font-bold text-foreground font-sans max-w-[180px]">
                        <div className="line-clamp-2">{row.reason}</div>
                      </td>

                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                        {row.id}
                      </td>

                      <td className="p-3 font-extrabold text-foreground whitespace-nowrap font-sans">
                        {row.name}
                      </td>

                      <td className="p-3 font-sans whitespace-nowrap">
                        <div className="font-bold text-foreground">{row.subDept}</div>
                        <div className="text-[11px] text-muted-foreground font-semibold">
                          {row.team}
                        </div>
                      </td>

                      <td className="p-3 font-semibold text-muted-foreground whitespace-nowrap font-sans">
                        {row.title}
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-foreground whitespace-nowrap font-sans">
                        {row.date}
                      </td>

                      <td className="p-3 text-center font-mono font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap font-sans">
                        {row.inTime}
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-foreground whitespace-nowrap font-sans">
                        {row.outDate}
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap font-sans">
                        {row.outTime}
                      </td>

                      {/* SYSTEM DATA MULTI-LINE CARD (REFERENCE MATCHING SCREENSHOT 2) */}
                      <td className="p-3 font-sans">
                        <div className="p-2.5 rounded-xl border border-border/80 bg-muted/30 text-[11px] font-sans space-y-0.5 leading-snug">
                          <div>
                            <span className="font-bold text-foreground">By:</span>{" "}
                            <span className="text-foreground">{row.systemBy}</span>
                          </div>
                          <div>
                            <span className="font-bold text-foreground">Date:</span>{" "}
                            <span className="text-foreground">{row.systemDate}</span>
                          </div>
                          <div>
                            <span className="font-bold text-foreground">Info:</span>{" "}
                            <span className="text-foreground">{row.systemInfoIn}</span>
                          </div>
                          {row.systemInfoOut && (
                            <div className="text-muted-foreground pl-7">
                              {row.systemInfoOut}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-foreground">HOD:</span>{" "}
                            <span
                              className={
                                row.hodStatus === "Request Approved"
                                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                                  : "text-amber-600 dark:text-amber-400 font-bold"
                              }
                            >
                              {row.hodStatus}
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-foreground">HRD:</span>{" "}
                            <span
                              className={
                                row.hrdStatus === "Request Approved"
                                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                                  : "text-amber-600 dark:text-amber-400 font-bold"
                              }
                            >
                              {row.hrdStatus}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* HOD APPROVER COLUMN */}
                      <td className="p-3 font-sans whitespace-nowrap">
                        <div className="font-bold text-foreground">{row.hodName}</div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase mt-1 font-sans ${
                            row.hodStatus === "Request Approved"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                          }`}
                        >
                          {row.hodStatus}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan={14}
                        className="p-8 text-center text-muted-foreground font-bold font-sans"
                      >
                        No manual attendance requests match the selected search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER WITH APPROVE BUTTON & PAGINATION */}
            <div className="p-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 font-sans">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleApproveSelected}
                  className="px-5 py-2 text-xs font-extrabold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-md flex items-center gap-2 font-sans"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
                <span className="text-xs font-bold text-muted-foreground font-sans">
                  Showing 1 to {filteredRequests.length} of {filteredRequests.length} entries
                </span>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-1.5 font-sans">
                <button
                  disabled
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border text-muted-foreground opacity-50 cursor-not-allowed font-sans"
                >
                  Previous
                </button>
                <button className="px-3 py-1.5 text-xs font-extrabold rounded-lg bg-emerald-600 text-white font-sans">
                  1
                </button>
                <button
                  disabled
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border text-muted-foreground opacity-50 cursor-not-allowed font-sans"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
