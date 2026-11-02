import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/hr-report-attendance-and-overtime")({
  head: () => ({
    meta: [
      { title: "Attendance & Overtime — CRIPTON HRIS" },
      {
        name: "description",
        content: "Generate and export attendance and overtime details for employees.",
      },
    ],
  }),
  component: AttendanceAndOvertimeReportPage,
});

export interface AttendanceOvertimeRecord {
  sl: number;
  id: string;
  name: string;
  type: string;
  department: string;
  designation: string;
  unit: string;
  date: string;
  inTime: string;
  outDate: string;
  outTime: string;
  otActual: string;
  otRequest: string;
  otDiff: string;
  otRate: string;
  taka: string;
  status: string;
  section?: string;
  empIdOffc?: string;
}

const INITIAL_DATA: AttendanceOvertimeRecord[] = [
  {
    sl: 2425,
    id: "2024049586",
    name: "Anamul Haque",
    type: "Worker",
    department: "Maintenance Utility & Textile",
    designation: "AC Helper",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "07:39:30",
    outDate: "01/11/2026",
    outTime: "20:04:34",
    otActual: "3.00",
    otRequest: "0",
    otDiff: "3.00",
    otRate: "84.54",
    taka: "254",
    status: "Present",
    section: "Maintenance",
    empIdOffc: "2024049586",
  },
  {
    sl: 2429,
    id: "2026062012",
    name: "Md. Hasan Mahmud",
    type: "Worker",
    department: "Maintenance Utility & Textile",
    designation: "AC Helper",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "07:50:57",
    outDate: "01/11/2026",
    outTime: "20:04:12",
    otActual: "3.00",
    otRequest: "0",
    otDiff: "3.00",
    otRate: "70.83",
    taka: "212",
    status: "Present",
    section: "Maintenance",
    empIdOffc: "2026062012",
  },
  {
    sl: 8,
    id: "2015003488",
    name: "Md. Komol Hossain",
    type: "Office Executive",
    department: "Human Resources",
    designation: "Assistant Manager",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "07:58:06",
    outDate: "01/11/2026",
    outTime: "22:31:45",
    otActual: "0.00",
    otRequest: "0",
    otDiff: "0.00",
    otRate: "300.00",
    taka: "0",
    status: "Present",
    section: "HR Team",
    empIdOffc: "2015003488",
  },
  {
    sl: 10,
    id: "2020021549",
    name: "Aminur Islam",
    type: "Office Executive",
    department: "Human Resources",
    designation: "Assistant Manager",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "08:03:56",
    outDate: "01/11/2026",
    outTime: "22:38:55",
    otActual: "0.00",
    otRequest: "0",
    otDiff: "0.00",
    otRate: "275.19",
    taka: "0",
    status: "Present",
    section: "HR Team",
    empIdOffc: "2020021549",
  },
  {
    sl: 205,
    id: "2018011194",
    name: "Sobhan Mia",
    type: "Production Executive",
    department: "Accessories Store (MCD)",
    designation: "Assistant Manager",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "07:57:30",
    outDate: "01/11/2026",
    outTime: "",
    otActual: "0.00",
    otRequest: "0",
    otDiff: "0.00",
    otRate: "222.09",
    taka: "0",
    status: "Present",
    section: "Store",
    empIdOffc: "2018011194",
  },
  {
    sl: 5334,
    id: "2025057576",
    name: "Md. Abu Said",
    type: "Worker",
    department: "Transport",
    designation: "Asst. Cook",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "04:58:01",
    outDate: "01/11/2026",
    outTime: "19:01:15",
    otActual: "0.00",
    otRequest: "0",
    otDiff: "0.00",
    otRate: "67.63",
    taka: "0",
    status: "Present",
    section: "Transport",
    empIdOffc: "2025057576",
  },
  {
    sl: 22,
    id: "2018011308",
    name: "Masud Parvej Piyash",
    type: "Office Executive",
    department: "Merchandising Supply Chain",
    designation: "Asst. Manager",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "07:36:38",
    outDate: "01/11/2026",
    outTime: "17:06:51",
    otActual: "0.00",
    otRequest: "0",
    otDiff: "0.00",
    otRate: "299.00",
    taka: "0",
    status: "Present",
    section: "Supply Chain",
    empIdOffc: "2018011308",
  },
  {
    sl: 209,
    id: "2015005030",
    name: "Md. Shah Alam",
    type: "Production Executive",
    department: "Chemical Store (MCD)",
    designation: "Asst. Manager",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "07:56:13",
    outDate: "01/11/2026",
    outTime: "17:41:43",
    otActual: "0.00",
    otRequest: "0",
    otDiff: "0.00",
    otRate: "244.73",
    taka: "0",
    status: "Present",
    section: "Store",
    empIdOffc: "2015005030",
  },
  {
    sl: 253,
    id: "2021027717",
    name: "Md. Rayhan Parves Opu",
    type: "Production Executive",
    department: "Production Audit",
    designation: "Asst. Manager",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "08:01:53",
    outDate: "01/11/2026",
    outTime: "17:16:37",
    otActual: "0.00",
    otRequest: "0",
    otDiff: "0.00",
    otRate: "237.39",
    taka: "0",
    status: "Present",
    section: "Audit",
    empIdOffc: "2021027717",
  },
  {
    sl: 41,
    id: "2018011967",
    name: "Md. Atikur Rahman",
    type: "Office Staff",
    department: "Cutting",
    designation: "Asst. Marker",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "19:49:29",
    outDate: "02/11/2026",
    outTime: "08:05:49",
    otActual: "0.00",
    otRequest: "0",
    otDiff: "0.00",
    otRate: "136.74",
    taka: "0",
    status: "Present",
    section: "Cutting",
    empIdOffc: "2018011967",
  },
  {
    sl: 2,
    id: "2021023801",
    name: "Md. Rabiul Hasan",
    type: "Office Executive",
    department: "Fire and Safety",
    designation: "Asst. Officer",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "07:47:29",
    outDate: "01/11/2026",
    outTime: "17:11:09",
    otActual: "0.00",
    otRequest: "0",
    otDiff: "0.00",
    otRate: "195.00",
    taka: "0",
    status: "Present",
    section: "Safety",
    empIdOffc: "2021023801",
  },
  {
    sl: 11,
    id: "2017009298",
    name: "Md. Golam Mawla",
    type: "Office Executive",
    department: "Maintenance RMG",
    designation: "Asst. Officer",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "07:52:31",
    outDate: "01/11/2026",
    outTime: "20:24:57",
    otActual: "0.00",
    otRequest: "0",
    otDiff: "0.00",
    otRate: "181.23",
    taka: "0",
    status: "Present",
    section: "Maintenance",
    empIdOffc: "2017009298",
  },
  {
    sl: 210,
    id: "2020017658",
    name: "Md. Hafijur Rahman",
    type: "Production Executive",
    department: "Chemical Store (MCD)",
    designation: "Asst. Officer",
    unit: "N/A",
    date: "01/11/2026",
    inTime: "13:55:58",
    outDate: "01/11/2026",
    outTime: "22:00:30",
    otActual: "0.00",
    otRequest: "0",
    otDiff: "0.00",
    otRate: "146.23",
    taka: "0",
    status: "Present",
    section: "Store",
    empIdOffc: "2020017658",
  },
];

function AttendanceAndOvertimeReportPage() {
  const [data] = useState<AttendanceOvertimeRecord[]>(INITIAL_DATA);

  // Form States
  const [employeeType, setEmployeeType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");

  const [startDate, setStartDate] = useState("2026-11-01");
  const [endDate, setEndDate] = useState("2026-11-01");
  const [option, setOption] = useState("ALL");

  const [outTimeStart, setOutTimeStart] = useState("");
  const [outTimeEnd, setOutTimeEnd] = useState("");
  const [ot, setOt] = useState("ALL");

  const [employeeId, setEmployeeId] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");

  const [status, setStatus] = useState("ALL");
  const [tableSearch, setTableSearch] = useState("");

  // Filtered State
  const [filteredData, setFilteredData] = useState<AttendanceOvertimeRecord[]>(INITIAL_DATA);

  // PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({
    initialized: true,
  });

  const handleReset = () => {
    setEmployeeType("ALL");
    setSection("ALL");
    setUnit("ALL");
    setStartDate("2026-11-01");
    setEndDate("2026-11-01");
    setOption("ALL");
    setOutTimeStart("");
    setOutTimeEnd("");
    setOt("ALL");
    setEmployeeId("");
    setIdType("System");
    setStatus("ALL");
    setTableSearch("");
    setFilteredData(data);
    toast.success("Filters reset successfully!");
  };

  const handleSearch = () => {
    const currentFilters = {
      employeeType,
      section,
      unit,
      startDate,
      endDate,
      option,
      outTimeStart,
      outTimeEnd,
      ot,
      employeeId,
      idType,
      status,
    };

    const filtered = data.filter((item) => {
      if (employeeType !== "ALL" && item.type !== employeeType) return false;
      if (section !== "ALL" && item.section !== section && item.department !== section) return false;
      if (unit !== "ALL" && item.unit !== unit) return false;
      if (status !== "ALL" && item.status !== status) return false;

      if (ot === "With OT" && parseFloat(item.otActual || "0") <= 0) return false;
      if (ot === "Without OT" && parseFloat(item.otActual || "0") > 0) return false;

      if (employeeId.trim() !== "") {
        const ids = employeeId.split(",").map((id) => id.trim());
        if (idType === "System") {
          if (!ids.includes(item.id)) return false;
        } else {
          if (!ids.includes(item.empIdOffc || item.id)) return false;
        }
      }

      return true;
    });

    setFilteredData(filtered);
    setAppliedFilters(currentFilters);

    if (filtered.length === 0) {
      toast.error("No records found matching the criteria");
    } else {
      toast.success(`Found ${filtered.length} records`);
    }
  };

  // Instant table search filter
  const displayedData = filteredData.filter((item) => {
    if (!tableSearch.trim()) return true;
    const query = tableSearch.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.department.toLowerCase().includes(query) ||
      item.designation.toLowerCase().includes(query) ||
      item.unit.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query) ||
      String(item.sl).includes(query)
    );
  });

  const handleExportExcel = () => {
    if (displayedData.length === 0) {
      toast.error("No records available to export");
      return;
    }

    const headers = [
      "SL",
      "ID",
      "Name",
      "Type",
      "Department",
      "Designation",
      "Unit",
      "Date",
      "In Time",
      "Out Date",
      "Out Time",
      "OT Actual",
      "OT Request",
      "OT(+/-)",
      "OT Rate",
      "OT Amount",
      "Status",
    ];

    const rows = displayedData.map((r) => [
      r.sl,
      `"${r.id}"`,
      `"${r.name}"`,
      `"${r.type}"`,
      `"${r.department}"`,
      `"${r.designation}"`,
      `"${r.unit}"`,
      `"${r.date}"`,
      `"${r.inTime}"`,
      `"${r.outDate}"`,
      `"${r.outTime}"`,
      r.otActual,
      r.otRequest,
      r.otDiff,
      r.otRate,
      r.taka,
      `"${r.status}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_and_overtime_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Excel CSV report exported successfully!");
  };

  const handlePrint = () => {
    toast.info("Opening browser print dialog...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // PDF Export definitions for all 17 columns
  const pdfColumns: ColumnDef<AttendanceOvertimeRecord>[] = [
    { header: "SL", accessor: (r) => r.sl, align: "center", width: "40px" },
    { header: "ID", accessor: (r) => r.id, align: "center" },
    { header: "Name", accessor: (r) => r.name },
    { header: "Type", accessor: (r) => r.type },
    { header: "Department", accessor: (r) => r.department },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Unit", accessor: (r) => r.unit, align: "center" },
    { header: "Date", accessor: (r) => r.date, align: "center" },
    { header: "In Time", accessor: (r) => r.inTime, align: "center" },
    { header: "Out Date", accessor: (r) => r.outDate, align: "center" },
    { header: "Out Time", accessor: (r) => r.outTime, align: "center" },
    { header: "OT Actual", accessor: (r) => r.otActual, align: "right" },
    { header: "OT Request", accessor: (r) => r.otRequest, align: "right" },
    { header: "OT(+/-)", accessor: (r) => r.otDiff, align: "right" },
    { header: "OT Rate", accessor: (r) => r.otRate, align: "right" },
    { header: "OT Amount", accessor: (r) => r.taka, align: "right" },
    { header: "Status", accessor: (r) => r.status, align: "center" },
  ];

  const handlePdfExport = () => {
    if (displayedData.length === 0) {
      toast.error("No data available to export.");
      return;
    }
    setIsPdfModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-[1850px] mx-auto w-full">
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
              Attendance & Overtime
            </span>
          </div>

          {/* Page Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <Clock className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Attendance & Overtime Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Generate and export comprehensive attendance and overtime details.
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

          {/* Comprehensive Search & Filter Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="size-4" />
              <span>Search & Filter Criteria</span>
            </div>

            {/* Filter Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-xs">
              {/* Employee Type */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Employee Type
                </label>
                <select
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Worker">Worker</option>
                  <option value="Office Executive">Office Executive</option>
                  <option value="Production Executive">Production Executive</option>
                  <option value="Office Staff">Office Staff</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Probationary">Probationary</option>
                  <option value="Contractual">Contractual</option>
                </select>
              </div>

              {/* Section */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="HR Team">HR Team</option>
                  <option value="Store">Store</option>
                  <option value="Transport">Transport</option>
                  <option value="Supply Chain">Supply Chain</option>
                  <option value="Audit">Audit</option>
                  <option value="Cutting">Cutting</option>
                  <option value="Safety">Safety</option>
                  <option value="Project Resource & Strategy">Project Resource & Strategy</option>
                  <option value="Payroll Audit">Payroll Audit</option>
                </select>
              </div>

              {/* Unit */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="N/A">N/A</option>
                  <option value="PSL">PSL</option>
                  <option value="PKG">PKG</option>
                </select>
              </div>

              {/* Date Start */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Date End */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Option */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Option
                </label>
                <select
                  value={option}
                  onChange={(e) => setOption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="With Time">With Time</option>
                  <option value="Without Time">Without Time</option>
                </select>
              </div>

              {/* Out Time Start */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Out Time Start(HH:MM:SS)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 17:00:00"
                  value={outTimeStart}
                  onChange={(e) => setOutTimeStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Out Time End */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Out Time End(HH:MM:SS)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 19:00:00"
                  value={outTimeEnd}
                  onChange={(e) => setOutTimeEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* OT */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  OT
                </label>
                <select
                  value={ot}
                  onChange={(e) => setOt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="With OT">With OT</option>
                  <option value="Without OT">Without OT</option>
                </select>
              </div>

              {/* Employee Id + Radio (Spans 2 columns) */}
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Employee Id{" "}
                    <span className="text-[10px] font-normal text-slate-500">
                      (Multi with comma)
                    </span>
                  </label>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="idType"
                        value="System"
                        checked={idType === "System"}
                        onChange={() => setIdType("System")}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300">System</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="idType"
                        value="Office"
                        checked={idType === "Office"}
                        onChange={() => setIdType("Office")}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Office</span>
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. 2024049586, 2026062012"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Present">Present</option>
                  <option value="Working">Working</option>
                  <option value="Absent">Absent</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Search Trigger Button */}
            <div className="pt-2 flex justify-end">
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
                  onClick={handlePdfExport}
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
              <table className="w-full text-xs text-left border-collapse min-w-[1600px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2.5 w-12 text-center whitespace-nowrap">SL</th>
                    <th className="p-2.5 whitespace-nowrap">ID</th>
                    <th className="p-2.5 min-w-[160px] whitespace-nowrap">Name</th>
                    <th className="p-2.5 whitespace-nowrap">Type</th>
                    <th className="p-2.5 whitespace-nowrap">Department</th>
                    <th className="p-2.5 whitespace-nowrap">Designation</th>
                    <th className="p-2.5 text-center whitespace-nowrap">Unit</th>
                    <th className="p-2.5 text-center whitespace-nowrap">Date</th>
                    <th className="p-2.5 text-center whitespace-nowrap">In Time</th>
                    <th className="p-2.5 text-center whitespace-nowrap">Out Date</th>
                    <th className="p-2.5 text-center whitespace-nowrap">Out Time</th>
                    <th className="p-2.5 text-right whitespace-nowrap">OT Actual</th>
                    <th className="p-2.5 text-right whitespace-nowrap">OT Request</th>
                    <th className="p-2.5 text-right whitespace-nowrap">OT(+/-)</th>
                    <th className="p-2.5 text-right whitespace-nowrap">OT Rate</th>
                    <th className="p-2.5 text-right whitespace-nowrap">OT Amount</th>
                    <th className="p-2.5 text-center whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {displayedData.length > 0 ? (
                    displayedData.map((row) => (
                      <tr
                        key={`${row.id}-${row.sl}`}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* 1. SL */}
                        <td className="p-2.5 text-center font-bold text-slate-500 whitespace-nowrap">
                          {row.sl}
                        </td>

                        {/* 2. ID */}
                        <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                          {row.id}
                        </td>

                        {/* 3. Name */}
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {row.name}
                        </td>

                        {/* 4. Type */}
                        <td className="p-2.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {row.type}
                        </td>

                        {/* 5. Department */}
                        <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {row.department}
                        </td>

                        {/* 6. Designation */}
                        <td className="p-2.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {row.designation}
                        </td>

                        {/* 7. Unit */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-400 text-center whitespace-nowrap">
                          {row.unit}
                        </td>

                        {/* 8. Date */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-400 text-center whitespace-nowrap">
                          {row.date}
                        </td>

                        {/* 9. In Time */}
                        <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-center whitespace-nowrap">
                          {row.inTime}
                        </td>

                        {/* 10. Out Date */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-400 text-center whitespace-nowrap">
                          {row.outDate}
                        </td>

                        {/* 11. Out Time */}
                        <td className="p-2.5 text-amber-600 dark:text-amber-500 font-bold text-center whitespace-nowrap">
                          {row.outTime || "--:--:--"}
                        </td>

                        {/* 12. OT Actual */}
                        <td className="p-2.5 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                          {row.otActual}
                        </td>

                        {/* 13. OT Request */}
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {row.otRequest}
                        </td>

                        {/* 14. OT(+/-) */}
                        <td className="p-2.5 text-right font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {row.otDiff}
                        </td>

                        {/* 15. OT Rate */}
                        <td className="p-2.5 text-right font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {row.otRate}
                        </td>

                        {/* 16. OT Amount */}
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          {row.taka}
                        </td>

                        {/* 17. Status */}
                        <td className="p-2.5 text-center whitespace-nowrap">
                          <span
                            className={
                              "inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold " +
                              (row.status === "Present" || row.status === "Working"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : row.status === "Absent"
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                  : "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400")
                            }
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={17}
                        className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/30"
                      >
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-8"></div>
        </main>
      </div>

      {/* Reusable PDF Modal */}
      <HRReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        reportTitle="Attendance & Overtime"
        data={displayedData}
        columns={pdfColumns}
        layout="landscape"
      />
    </div>
  );
}

export default AttendanceAndOvertimeReportPage;
