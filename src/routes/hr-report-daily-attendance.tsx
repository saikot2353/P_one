import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  ChevronRight,
  Clock,
  RefreshCw,
  SlidersHorizontal,
  X,
  Eye,
  Download,
  FileDown,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/hr-report-daily-attendance")({
  head: () => ({
    meta: [
      { title: "Daily Attendance Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "Track daily employee attendance logs, check-in/out times, overtime, and status.",
      },
    ],
  }),
  component: DailyAttendanceReportPage,
});

export interface AttendanceRecord {
  sl: number;
  empId: string;
  empIdOffc: string;
  name: string;
  department: string;
  section: string;
  designation: string;
  phone: string;
  unit: string;
  line: string;
  grade: string;
  shift: string;
  dutyShift: string;
  date: string;
  inTime: string;
  outDate: string;
  outTime: string;
  ot: string;
  status: "Present" | "Absent" | "Holiday" | "Leave" | "Late" | "Early Out";
  empType: string;
}

const INITIAL_DATA: AttendanceRecord[] = [
  {
    sl: 1,
    empId: "2015003501",
    empIdOffc: "2015003501",
    name: "Md.Jahangir Alam",
    department: "Admin and Compliance",
    section: "General Store (MCD)",
    designation: "Officer",
    phone: "N/A",
    unit: "N/A",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "0.00",
    outDate: "N/A",
    outTime: "0.00",
    ot: "0.00",
    status: "Absent",
    empType: "Office Executive",
  },
  {
    sl: 2,
    empId: "2018011304",
    empIdOffc: "2018011304",
    name: "Md. Mijanur Rahman Hridoy",
    department: "Human Resources",
    section: "Human Resources",
    designation: "Deputy Manager",
    phone: "N/A",
    unit: "N/A",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "0.00",
    outDate: "N/A",
    outTime: "0.00",
    ot: "0.00",
    status: "Absent",
    empType: "Office Executive",
  },
  {
    sl: 3,
    empId: "2026061223",
    empIdOffc: "N/A",
    name: "Md. Parvej Hossain",
    department: "Maintenance",
    section: "Maintenance Utility & Textile",
    designation: "Engineer",
    phone: "N/A",
    unit: "N/A",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "0.00",
    outDate: "N/A",
    outTime: "0.00",
    ot: "0.00",
    status: "Absent",
    empType: "Office Executive",
  },
  {
    sl: 4,
    empId: "2022040121",
    empIdOffc: "N/A",
    name: "Md. Mostafijur Rahman",
    department: "Marketing and Merchandising",
    section: "Marketing & Merchandising",
    designation: "Sr. Merchandiser",
    phone: "N/A",
    unit: "Unit-05",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "0.00",
    outDate: "N/A",
    outTime: "0.00",
    ot: "0.00",
    status: "Absent",
    empType: "Office Executive",
  },
  {
    sl: 5,
    empId: "2026061871",
    empIdOffc: "N/A",
    name: "Arafat Sani",
    department: "Marketing and Merchandising",
    section: "Marketing & Merchandising",
    designation: "Tr. Merchandiser",
    phone: "N/A",
    unit: "Unit-05",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "0.00",
    outDate: "N/A",
    outTime: "0.00",
    ot: "0.00",
    status: "Absent",
    empType: "Office Executive",
  },
  {
    sl: 6,
    empId: "2021026570",
    empIdOffc: "N/A",
    name: "Dr. Sonia Kaiser",
    department: "Admin and Compliance",
    section: "Medical",
    designation: "Doctor",
    phone: "N/A",
    unit: "N/A",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "0.00",
    outDate: "N/A",
    outTime: "0.00",
    ot: "0.00",
    status: "Absent",
    empType: "Office Executive",
  },
  {
    sl: 7,
    empId: "2023043355",
    empIdOffc: "N/A",
    name: "Dr. Dewan Ashik Ahmed",
    department: "Admin and Compliance",
    section: "Medical",
    designation: "Doctor",
    phone: "N/A",
    unit: "N/A",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "0.00",
    outDate: "N/A",
    outTime: "0.00",
    ot: "0.00",
    status: "Absent",
    empType: "Office Executive",
  },
  {
    sl: 8,
    empId: "2025054850",
    empIdOffc: "N/A",
    name: "Md. Rifat Hasan",
    department: "Merchandising Supply Chain",
    section: "Merchandising Supply Chain",
    designation: "Officer",
    phone: "N/A",
    unit: "N/A",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "0.00",
    outDate: "N/A",
    outTime: "0.00",
    ot: "0.00",
    status: "Absent",
    empType: "Office Executive",
  },
  {
    sl: 9,
    empId: "2022040241",
    empIdOffc: "N/A",
    name: "Md. Mahmudul Hasan",
    department: "Marketing and Merchandising",
    section: "Marketing & Merchandising",
    designation: "Merchandiser",
    phone: "N/A",
    unit: "Unit-02",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "0.00",
    outDate: "N/A",
    outTime: "0.00",
    ot: "0.00",
    status: "Holiday",
    empType: "Office Executive",
  },
  {
    sl: 10,
    empId: "2016003492",
    empIdOffc: "2016003492",
    name: "Md. Mostofa Kamal",
    department: "Admin and Compliance",
    section: "Admin and Compliance",
    designation: "Deputy Manager",
    phone: "01712345678",
    unit: "N/A",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "07:52:12",
    outDate: "26/09/2026",
    outTime: "17:05:00",
    ot: "0.00",
    status: "Present",
    empType: "Office Executive",
  },
  {
    sl: 11,
    empId: "2016003493",
    empIdOffc: "2016003493",
    name: "Md. Mahatab Uddin Buiyan",
    department: "Admin and Compliance",
    section: "Admin and Compliance",
    designation: "Deputy Manager",
    phone: "01812345678",
    unit: "N/A",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "07:53:35",
    outDate: "26/09/2026",
    outTime: "17:10:00",
    ot: "0.00",
    status: "Present",
    empType: "Office Executive",
  },
  {
    sl: 12,
    empId: "2019015021",
    empIdOffc: "2019015021",
    name: "Md. Rayhan Ahmmed (Raju)",
    department: "Admin and Compliance",
    section: "Admin and Compliance",
    designation: "Asst. Officer",
    phone: "01912345678",
    unit: "N/A",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "08:02:43",
    outDate: "26/09/2026",
    outTime: "17:00:00",
    ot: "0.00",
    status: "Present",
    empType: "Office Executive",
  },
  {
    sl: 13,
    empId: "2023043446",
    empIdOffc: "N/A",
    name: "Md. Imran Sharif",
    department: "Human Resources",
    section: "Human Resources",
    designation: "Sr. Officer",
    phone: "01740820000",
    unit: "N/A",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    dutyShift: "General Shift",
    date: "26/09/2026",
    inTime: "0.00",
    outDate: "N/A",
    outTime: "0.00",
    ot: "0.00",
    status: "Leave",
    empType: "Office Executive",
  },
];

const EMPLOYEE_TYPES = ["Office Executive", "Production Staff", "Management", "Worker", "ALL"];
const DEPARTMENTS = [
  "All Departments",
  "Admin and Compliance",
  "Human Resources",
  "Maintenance",
  "Marketing and Merchandising",
  "Medical",
  "Merchandising Supply Chain",
  "Maintenance (RMG)",
  "Production Audit",
  "Production Planning",
  "Welfare",
];
const SECTIONS = [
  "ALL",
  "General Store (MCD)",
  "Human Resources",
  "Maintenance Utility & Textile",
  "Marketing & Merchandising",
  "Medical",
  "Merchandising Supply Chain",
  "Compliance",
  "Fire and Safety",
  "Maintenance RMG",
];
const UNITS = ["ALL", "N/A", "Unit-01", "Unit-02", "Unit-03", "Unit-04", "Unit-05", "Unit-06", "Unit-07", "Unit-08"];
const LINES = ["ALL", "N/A", "01", "02", "05", "10"];
const STATUSES = [
  "ALL",
  "Present",
  "Absent",
  "Holiday",
  "Leave",
  "Leave+Attendance",
  "Absent+Leave+Holiday",
  "Late",
  "Early Out",
];

export function DailyAttendanceReportPage() {
  // Filter States
  const [empType, setEmpType] = useState("Office Executive");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [employeeIdCsv, setEmployeeIdCsv] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");
  const [date, setDate] = useState("2026-09-26");
  const [optionMode, setOptionMode] = useState<
    "Regular" | "Lunch In/Out" | "Without Out Time" | "With Requested OT"
  >("Regular");
  const [tableSearch, setTableSearch] = useState("");

  // Modal State
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Active Applied Filters
  const [appliedFilters, setAppliedFilters] = useState({
    empType: "Office Executive",
    department: "All Departments",
    section: "ALL",
    unit: "ALL",
    line: "ALL",
    status: "ALL",
    employeeIdCsv: "",
    idType: "System" as "System" | "Office",
    date: "2026-09-26",
    optionMode: "Regular" as "Regular" | "Lunch In/Out" | "Without Out Time" | "With Requested OT",
  });

  const handleSearch = () => {
    setAppliedFilters({
      empType,
      department,
      section,
      unit,
      line,
      status,
      employeeIdCsv,
      idType,
      date,
      optionMode,
    });
    toast.success(`Generating Daily Attendance Report for ${date}...`);
  };

  const handleReset = () => {
    setEmpType("Office Executive");
    setDepartment("All Departments");
    setSection("ALL");
    setUnit("ALL");
    setLine("ALL");
    setStatus("ALL");
    setEmployeeIdCsv("");
    setIdType("System");
    setDate("2026-09-26");
    setOptionMode("Regular");
    setTableSearch("");
    setAppliedFilters({
      empType: "Office Executive",
      department: "All Departments",
      section: "ALL",
      unit: "ALL",
      line: "ALL",
      status: "ALL",
      employeeIdCsv: "",
      idType: "System",
      date: "2026-09-26",
      optionMode: "Regular",
    });
    toast.info("Daily Attendance filters reset.");
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return INITIAL_DATA.filter((item) => {
      if (appliedFilters.empType !== "ALL" && item.empType !== appliedFilters.empType) return false;
      if (
        appliedFilters.department !== "All Departments" &&
        appliedFilters.department !== "ALL" &&
        item.department !== appliedFilters.department
      )
        return false;
      if (appliedFilters.section !== "ALL" && item.section !== appliedFilters.section) return false;
      if (appliedFilters.unit !== "ALL" && item.unit !== appliedFilters.unit) return false;
      if (appliedFilters.line !== "ALL" && item.line !== appliedFilters.line) return false;
      if (appliedFilters.status !== "ALL" && item.status !== appliedFilters.status) return false;

      if (appliedFilters.employeeIdCsv.trim()) {
        const idList = appliedFilters.employeeIdCsv
          .split(",")
          .map((id) => id.trim().toLowerCase())
          .filter(Boolean);
        const itemId = appliedFilters.idType === "System" ? item.empId : item.empIdOffc;
        if (!idList.some((id) => itemId.toLowerCase().includes(id))) return false;
      }

      if (tableSearch.trim()) {
        const query = tableSearch.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchId = item.empId.includes(query) || item.empIdOffc.includes(query);
        const matchDept = item.department.toLowerCase().includes(query);
        const matchDesig = item.designation.toLowerCase().includes(query);
        if (!matchName && !matchId && !matchDept && !matchDesig) return false;
      }

      return true;
    });
  }, [appliedFilters, tableSearch]);

  const handleExportExcel = () => {
    const headers = [
      "SL",
      "Emp ID",
      "Emp ID (off.)",
      "Name",
      "Department",
      "Section",
      "Designation",
      "Personal Phone No",
      "Unit",
      "Line",
      "Grade",
      "Shift",
      "Duty Shift",
      "Date",
      "In Time",
      "Out Date",
      "Out Time",
      "OT",
      "Status",
    ];

    const rows = filteredData.map((r, idx) => [
      (idx + 1).toString(),
      r.empId,
      r.empIdOffc,
      r.name,
      r.department,
      r.section,
      r.designation,
      r.phone,
      r.unit,
      r.line,
      r.grade,
      r.shift,
      r.dutyShift,
      r.date,
      r.inTime,
      r.outDate,
      r.outTime,
      r.ot,
      r.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Daily_Attendance_Report_${appliedFilters.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Daily Attendance exported to Excel!");
  };

  const handlePrint = () => {
    toast.info("Opening browser print dialog...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-[1700px] mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <Link to="/hr-reports" className="hover:text-primary transition-colors">
              HR Reports
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Daily Attendance Report
            </span>
          </div>

          {/* Page Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <Clock className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Daily Attendance Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time daily check-in/out logs, late arrivals, absence status, and overtime metrics.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Panel Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="size-4" />
              <span>Search & Filter Criteria</span>
            </div>

            {/* Filter Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 text-xs">
              {/* 1. Employee Type */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Employee Type
                </label>
                <select
                  value={empType}
                  onChange={(e) => setEmpType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {EMPLOYEE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Department */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Section */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Unit */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Line */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Line
                </label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {LINES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Status */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* 7. Date */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* 8. Employee Id (Comma Separator) */}
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Employee Id(Comma Separator )
                  </label>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="idType"
                        checked={idType === "System"}
                        onChange={() => setIdType("System")}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>System</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="idType"
                        checked={idType === "Office"}
                        onChange={() => setIdType("Office")}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Office</span>
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="use comma as separator"
                  value={employeeIdCsv}
                  onChange={(e) => setEmployeeIdCsv(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Option Radio Row */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-bold text-slate-700 dark:text-slate-300">Option:</span>
                <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="optionMode"
                    checked={optionMode === "Regular"}
                    onChange={() => setOptionMode("Regular")}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Regular</span>
                </label>

                <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="optionMode"
                    checked={optionMode === "Lunch In/Out"}
                    onChange={() => setOptionMode("Lunch In/Out")}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Lunch In/Out</span>
                </label>

                <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="optionMode"
                    checked={optionMode === "Without Out Time"}
                    onChange={() => setOptionMode("Without Out Time")}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Without Out Time</span>
                </label>

                <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="optionMode"
                    checked={optionMode === "With Requested OT"}
                    onChange={() => setOptionMode("With Requested OT")}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>With Requested OT</span>
                </label>
              </div>

              {/* Search Trigger Button */}
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
              >
                <Search className="size-4" />
                <span>SEARCH REPORT</span>
              </button>
            </div>
          </div>

          {/* Action Toolbar & Results Table Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Toolbar Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              {/* Quick Export Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <FileSpreadsheet className="size-4" />
                  <span>EXCEL</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <Printer className="size-4" />
                  <span>PRINT</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedRecord(filteredData[0] || null);
                    setIsPreviewOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <FileText className="size-4" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Instant Search Box */}
              <div className="flex items-center gap-2 w-full sm:w-72">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Search:
                </span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search in table..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-xs text-left border-collapse min-w-[2000px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2.5 w-12 text-center">SL</th>
                    <th className="p-2.5">Emp ID</th>
                    <th className="p-2.5">Emp ID (off.)</th>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5">Section</th>
                    <th className="p-2.5">Designation</th>
                    <th className="p-2.5">Personal Phone No</th>
                    <th className="p-2.5">Unit</th>
                    <th className="p-2.5">Line</th>
                    <th className="p-2.5">Grade</th>
                    <th className="p-2.5">Shift</th>
                    <th className="p-2.5">Duty Shift</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">In Time</th>
                    <th className="p-2.5">Out Date</th>
                    <th className="p-2.5">Out Time</th>
                    <th className="p-2.5 text-center">OT</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredData.length > 0 ? (
                    filteredData.map((row, idx) => {
                      const isAbsent = row.status === "Absent";
                      return (
                        <tr
                          key={row.sl}
                          className={`transition-colors ${
                            isAbsent
                              ? "bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-semibold hover:bg-rose-100/70 dark:hover:bg-rose-900/40"
                              : "hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <td className={`p-2.5 text-center font-bold ${isAbsent ? "text-rose-700 dark:text-rose-400" : "text-slate-500"}`}>
                            {idx + 1}
                          </td>
                          <td className={`p-2.5 font-mono font-bold ${isAbsent ? "text-rose-700 dark:text-rose-400" : "text-indigo-600 dark:text-indigo-400"}`}>
                            {row.empId}
                          </td>
                          <td className={`p-2.5 font-mono ${isAbsent ? "text-rose-700 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300"}`}>
                            {row.empIdOffc}
                          </td>
                          <td className={`p-2.5 font-bold ${isAbsent ? "text-rose-700 dark:text-rose-300" : "text-slate-900 dark:text-white"}`}>
                            {row.name}
                          </td>
                          <td className={`p-2.5 font-semibold ${isAbsent ? "text-rose-700 dark:text-rose-300" : "text-slate-800 dark:text-slate-200"}`}>
                            {row.department}
                          </td>
                          <td className={`p-2.5 ${isAbsent ? "text-rose-700 dark:text-rose-300 font-semibold" : "text-slate-600 dark:text-slate-300"}`}>
                            {row.section}
                          </td>
                          <td className={`p-2.5 ${isAbsent ? "text-rose-700 dark:text-rose-300 font-semibold" : "text-slate-700 dark:text-slate-300"}`}>
                            {row.designation}
                          </td>
                          <td className={`p-2.5 font-mono ${isAbsent ? "text-rose-700 dark:text-rose-400" : "text-slate-600 dark:text-slate-300"}`}>
                            {row.phone}
                          </td>
                          <td className={`p-2.5 ${isAbsent ? "text-rose-700 dark:text-rose-300" : "text-slate-600 dark:text-slate-300"}`}>
                            {row.unit}
                          </td>
                          <td className={`p-2.5 ${isAbsent ? "text-rose-700 dark:text-rose-400" : "text-slate-500"}`}>
                            {row.line}
                          </td>
                          <td className={`p-2.5 ${isAbsent ? "text-rose-700 dark:text-rose-400" : "text-slate-500"}`}>
                            {row.grade}
                          </td>
                          <td className={`p-2.5 ${isAbsent ? "text-rose-700 dark:text-rose-300" : "text-slate-600 dark:text-slate-300"}`}>
                            {row.shift}
                          </td>
                          <td className={`p-2.5 ${isAbsent ? "text-rose-700 dark:text-rose-300" : "text-slate-600 dark:text-slate-300"}`}>
                            {row.dutyShift}
                          </td>
                          <td className={`p-2.5 font-mono ${isAbsent ? "text-rose-700 dark:text-rose-300" : "text-slate-700 dark:text-slate-300"}`}>
                            {row.date}
                          </td>
                          <td className={`p-2.5 font-mono font-bold ${isAbsent ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                            {row.inTime}
                          </td>
                          <td className={`p-2.5 font-mono ${isAbsent ? "text-rose-700 dark:text-rose-400" : "text-slate-600 dark:text-slate-300"}`}>
                            {row.outDate}
                          </td>
                          <td className={`p-2.5 font-mono font-bold ${isAbsent ? "text-rose-600 dark:text-rose-400" : "text-blue-600 dark:text-blue-400"}`}>
                            {row.outTime}
                          </td>
                          <td className={`p-2.5 text-center font-mono font-bold ${isAbsent ? "text-rose-700 dark:text-rose-400" : "text-indigo-600 dark:text-indigo-400"}`}>
                            {row.ot}
                          </td>
                          <td className="p-2.5">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                                row.status === "Present"
                                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                                  : row.status === "Absent"
                                  ? "bg-rose-600 text-white border-rose-700 shadow-xs"
                                  : row.status === "Holiday"
                                  ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                                  : "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={19} className="p-8 text-center text-slate-400 dark:text-slate-500">
                        No daily attendance logs found matching the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Special Export & Action Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing 1 to {filteredData.length} of {filteredData.length} entries
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
                <button
                  onClick={() => {
                    toast.success("Downloading Group Wise PDF...");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  <FileDown className="size-3.5" />
                  <span>VIEW GROUP WISE (PDF)</span>
                </button>

                <button
                  onClick={() => {
                    toast.success("Downloading Attendance with Employee Photos...");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xs cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>VIEW WITH PIC (PDF)</span>
                </button>

                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-lime-600 hover:bg-lime-700 text-white shadow-xs cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>EXCEL</span>
                </button>

                <button
                  onClick={() => {
                    toast.success("Downloading OT Requested Report...");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  <FileText className="size-3.5" />
                  <span>WITH REQUESTED OT (PDF)</span>
                </button>

                <button
                  onClick={() => {
                    toast.error("Downloading Absent Employee Report...");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
                >
                  <FileText className="size-3.5" />
                  <span>ABSENT REPORT (PDF)</span>
                </button>

                <div className="flex items-center gap-1 text-xs">
                  <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold">
                    1
                  </button>
                  <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Report Preview Modal */}
      {isPreviewOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl space-y-4">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="size-4" />
            </button>

            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 text-center">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                DAILY ATTENDANCE LOG DOSSIER
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                Pakiza Software Limited — {appliedFilters.date}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                <span className="text-slate-500">Employee Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Department
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedRecord.department}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Designation
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedRecord.designation}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40">
                  <span className="block text-[10px] uppercase font-bold text-emerald-600">
                    In Time
                  </span>
                  <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                    {selectedRecord.inTime}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40">
                  <span className="block text-[10px] uppercase font-bold text-blue-600">
                    Out Time
                  </span>
                  <span className="text-sm font-black text-blue-700 dark:text-blue-300">
                    {selectedRecord.outTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  toast.success("Downloading Attendance Log...");
                  setIsPreviewOpen(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Download className="size-4" />
                <span>DOWNLOAD PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
