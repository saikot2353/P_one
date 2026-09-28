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
  CalendarX,
  RefreshCw,
  SlidersHorizontal,
  X,
  Eye,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/hr-report-leave-summary")({
  head: () => ({
    meta: [
      { title: "Leave Summary Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "View, analyze, and export annual employee leave summary reports.",
      },
    ],
  }),
  component: LeaveSummaryReportPage,
});

export interface LeaveSummaryRecord {
  empId: string;
  empIdOffc: string;
  empName: string;
  department: string;
  designation: string;
  unit: string;
  employeeType: string;
  section: string;
  line: string;
  gender: "Male" | "Female";
  cl: number;
  sl: number;
  el: number;
  ml: number;
}

const INITIAL_DATA: LeaveSummaryRecord[] = [
  {
    empId: "2026061937",
    empIdOffc: "2026061937",
    empName: "Md. Jahidul Islam",
    department: "Implementation & Business Analysis",
    designation: "Executive",
    unit: "Unit-01",
    employeeType: "Office Executive",
    section: "Accounts & Finance",
    line: "N/A",
    gender: "Male",
    cl: 4,
    sl: 3,
    el: 2,
    ml: 0,
  },
  {
    empId: "2025054609",
    empIdOffc: "2025054609",
    empName: "Md Mahir Shahriyar",
    department: "Business Innovation",
    designation: "Jr. Executive",
    unit: "Unit-01",
    employeeType: "Office Executive",
    section: "Human Resources",
    line: "N/A",
    gender: "Male",
    cl: 6,
    sl: 4,
    el: 5,
    ml: 0,
  },
  {
    empId: "2026090102",
    empIdOffc: "2026090102",
    empName: "Nusrat Jahan",
    department: "Software Development",
    designation: "Sr. Executive",
    unit: "Unit-02",
    employeeType: "Office Executive",
    section: "ICT",
    line: "N/A",
    gender: "Female",
    cl: 5,
    sl: 2,
    el: 8,
    ml: 0,
  },
  {
    empId: "2026090511",
    empIdOffc: "2026090511",
    empName: "Tanvir Ahmed",
    department: "Accounts & Finance",
    designation: "Officer",
    unit: "Unit-01",
    employeeType: "Office Staff",
    section: "Accounts",
    line: "N/A",
    gender: "Male",
    cl: 2,
    sl: 1,
    el: 0,
    ml: 0,
  },
  {
    empId: "2026091244",
    empIdOffc: "2026091244",
    empName: "Mst. Farhana Akter",
    department: "Human Resources",
    designation: "Assistant Manager",
    unit: "Unit-03",
    employeeType: "Management",
    section: "Human Resources",
    line: "N/A",
    gender: "Female",
    cl: 8,
    sl: 5,
    el: 10,
    ml: 112,
  },
  {
    empId: "2026091889",
    empIdOffc: "2026091889",
    empName: "Sk. Ariful Islam",
    department: "IT Infrastructure",
    designation: "System Administrator",
    unit: "Unit-01",
    employeeType: "Office Executive",
    section: "ICT",
    line: "N/A",
    gender: "Male",
    cl: 3,
    sl: 2,
    el: 4,
    ml: 0,
  },
  {
    empId: "2026081015",
    empIdOffc: "2026081015",
    empName: "Kazi Anamul Haq",
    department: "Supply Chain",
    designation: "Logistics Executive",
    unit: "Unit-04",
    employeeType: "Production Executive",
    section: "Procurement and Supply Chain",
    line: "01",
    gender: "Male",
    cl: 7,
    sl: 6,
    el: 12,
    ml: 0,
  },
  {
    empId: "2026072230",
    empIdOffc: "2026072230",
    empName: "Farzana Rahman",
    department: "Quality Assurance",
    designation: "Jr. Officer",
    unit: "Unit-02",
    employeeType: "Production Staff",
    section: "Cutting Quality",
    line: "02",
    gender: "Female",
    cl: 0,
    sl: 0,
    el: 0,
    ml: 0,
  },
];

const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];

const EMPLOYEE_TYPES = [
  "ALL",
  "Production Staff",
  "Office Executive",
  "Management",
  "Intern",
  "Office Staff",
  "Pcs Rate Worker",
  "Production Executive",
  "Worker",
];

const SECTIONS = [
  "ALL",
  "Accessories Store (MCD)",
  "Accessories Store 1",
  "Accounts",
  "Accounts & Finance",
  "Accounts- VAT & TAX",
  "Admin",
  "Admin and Compliance",
  "Brand and Media",
  "CAD",
  "Chemical Store (MCD)",
  "Civil Engineering",
  "Commercial",
  "Compliance",
  "Cutting",
  "Dyeing",
  "Embroidery",
  "Human Resources",
  "ICT",
  "Industrial Engineering (I.E.)",
  "Internal Audit",
  "Knitting Production",
  "Marketing & Merchandising",
  "Merchandising",
  "MIS",
  "Procurement and Supply Chain",
  "RMG Operations",
  "Sewing",
  "Vat & Tax",
  "Welfare",
  "Yarn Store (MCD)",
];

const UNITS = [
  "ALL",
  "N/A",
  "Unit-01",
  "Unit-02",
  "Unit-03",
  "Unit-04",
  "Unit-05",
  "Unit-06",
  "Unit-07",
  "Unit-08",
  "Unit-10",
];

const LINES = [
  "ALL",
  "0",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "15",
  "20",
  "25",
  "30",
  "40",
  "50",
  "60",
  "65",
  "N/A",
];

export function LeaveSummaryReportPage() {
  // Filter States
  const [year, setYear] = useState("2026");
  const [reportOption, setReportOption] = useState<
    "Details" | "Gender Wise(CL,SL)" | "Gender Wise(NO Leave)"
  >("Details");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [employeeIdCsv, setEmployeeIdCsv] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");
  const [tableSearch, setTableSearch] = useState("");

  // Modal State
  const [selectedRecord, setSelectedRecord] = useState<LeaveSummaryRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const pdfColumns: ColumnDef<LeaveSummaryRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "40px" },
    { header: "ID", accessor: (r) => r.empId, align: "center" },
    { header: "Name", accessor: (r) => r.empName },
    { header: "Department", accessor: (r) => r.department },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Unit", accessor: (r) => r.unit, align: "center" },
    { header: "CL", accessor: (r) => r.cl, align: "center" },
    { header: "SL", accessor: (r) => r.sl, align: "center" },
    { header: "EL", accessor: (r) => r.el, align: "center" },
    { header: "ML", accessor: (r) => r.ml, align: "center" },
    { header: "Total", accessor: (r) => r.cl + r.sl + r.el + r.ml, align: "center" },
  ];

  // Active Applied Filter State
  const [appliedFilters, setAppliedFilters] = useState({
    year: "2026",
    reportOption: "Details" as "Details" | "Gender Wise(CL,SL)" | "Gender Wise(NO Leave)",
    employeeType: "ALL",
    section: "ALL",
    unit: "ALL",
    line: "ALL",
    employeeIdCsv: "",
    idType: "System" as "System" | "Office",
  });

  const handleSearch = () => {
    setAppliedFilters({
      year,
      reportOption,
      employeeType,
      section,
      unit,
      line,
      employeeIdCsv,
      idType,
    });
    toast.success(`Generating Leave Summary Report for ${year}...`);
  };

  const handleReset = () => {
    setYear("2026");
    setReportOption("Details");
    setEmployeeType("ALL");
    setSection("ALL");
    setUnit("ALL");
    setLine("ALL");
    setEmployeeIdCsv("");
    setIdType("System");
    setTableSearch("");
    setAppliedFilters({
      year: "2026",
      reportOption: "Details",
      employeeType: "ALL",
      section: "ALL",
      unit: "ALL",
      line: "ALL",
      employeeIdCsv: "",
      idType: "System",
    });
    toast.info("Leave Summary filter criteria reset.");
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return INITIAL_DATA.filter((item) => {
      if (appliedFilters.employeeType !== "ALL" && item.employeeType !== appliedFilters.employeeType)
        return false;
      if (appliedFilters.section !== "ALL" && item.section !== appliedFilters.section) return false;
      if (appliedFilters.unit !== "ALL" && item.unit !== appliedFilters.unit) return false;
      if (appliedFilters.line !== "ALL" && item.line !== appliedFilters.line) return false;

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
        const matchName = item.empName.toLowerCase().includes(query);
        const matchId = item.empId.includes(query) || item.empIdOffc.includes(query);
        const matchDept = item.department.toLowerCase().includes(query);
        const matchDesig = item.designation.toLowerCase().includes(query);
        if (!matchName && !matchId && !matchDept && !matchDesig) return false;
      }

      return true;
    });
  }, [appliedFilters, tableSearch]);

  // Gender-wise CL/SL aggregation
  const genderWiseData = useMemo(() => {
    const male = filteredData.filter((d) => d.gender === "Male");
    const female = filteredData.filter((d) => d.gender === "Female");

    return [
      {
        gender: "Male",
        count: male.length,
        totalCl: male.reduce((acc, curr) => acc + curr.cl, 0),
        totalSl: male.reduce((acc, curr) => acc + curr.sl, 0),
        totalEl: male.reduce((acc, curr) => acc + curr.el, 0),
        totalMl: male.reduce((acc, curr) => acc + curr.ml, 0),
        grandTotal: male.reduce((acc, curr) => acc + curr.cl + curr.sl + curr.el + curr.ml, 0),
      },
      {
        gender: "Female",
        count: female.length,
        totalCl: female.reduce((acc, curr) => acc + curr.cl, 0),
        totalSl: female.reduce((acc, curr) => acc + curr.sl, 0),
        totalEl: female.reduce((acc, curr) => acc + curr.el, 0),
        totalMl: female.reduce((acc, curr) => acc + curr.ml, 0),
        grandTotal: female.reduce((acc, curr) => acc + curr.cl + curr.sl + curr.el + curr.ml, 0),
      },
    ];
  }, [filteredData]);

  // Gender-wise Zero Leave aggregation
  const genderWiseNoLeaveData = useMemo(() => {
    const maleNoLeave = filteredData.filter(
      (d) => d.gender === "Male" && d.cl + d.sl + d.el + d.ml === 0
    );
    const femaleNoLeave = filteredData.filter(
      (d) => d.gender === "Female" && d.cl + d.sl + d.el + d.ml === 0
    );

    return [
      { gender: "Male", count: maleNoLeave.length },
      { gender: "Female", count: femaleNoLeave.length },
    ];
  }, [filteredData]);

  const handleExportExcel = () => {
    const headers = [
      "#",
      "Emp ID",
      "Emp Name",
      "Department",
      "Designation",
      "Unit",
      "CL",
      "SL",
      "EL",
      "ML",
      "Total",
    ];

    const rows = filteredData.map((r, i) => [
      (i + 1).toString(),
      r.empId,
      r.empName,
      r.department,
      r.designation,
      r.unit,
      r.cl.toString(),
      r.sl.toString(),
      r.el.toString(),
      r.ml.toString(),
      (r.cl + r.sl + r.el + r.ml).toString(),
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
    link.setAttribute("download", `Leave_Summary_Report_${appliedFilters.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leave Summary exported to Excel!");
  };

  const handlePrint = () => {
    toast.info("Opening print dialog...");
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
          {/* Breadcrumb Navigation - Identical to New Joining Info */}
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
              Leave Summary
            </span>
          </div>

          {/* Page Header Card - Identical Layout */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <CalendarX className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Leave Summary Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  View, analyze, and export annual employee leave summary reports & consumption metrics.
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

          {/* Search & Filter Criteria Panel Card - Identical Layout */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="size-4" />
              <span>Search & Filter Criteria</span>
            </div>

            {/* Filter Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-xs">
              {/* 1. Year */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Option (Report Mode) */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Option
                </label>
                <select
                  value={reportOption}
                  onChange={(e) =>
                    setReportOption(
                      e.target.value as "Details" | "Gender Wise(CL,SL)" | "Gender Wise(NO Leave)"
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Details">Details</option>
                  <option value="Gender Wise(CL,SL)">Gender Wise(CL,SL)</option>
                  <option value="Gender Wise(NO Leave)">Gender Wise(NO Leave)</option>
                </select>
              </div>

              {/* 3. Employee Type */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Employee Type
                </label>
                <select
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {EMPLOYEE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Section */}
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

              {/* 5. Unit */}
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

              {/* 6. Line */}
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

              {/* 7. Employee Id (Comma Separator) */}
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Employee Id (Comma Separator)
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
                  placeholder="e.g. 2026061937, 2025054609"
                  value={employeeIdCsv}
                  onChange={(e) => setEmployeeIdCsv(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Search Trigger Button - Identical Style */}
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

          {/* Action Toolbar & Results Table Card - Identical Layout */}
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
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <Printer className="size-4" />
                  <span>PRINT</span>
                </button>

                <button
                  onClick={() => setIsPdfModalOpen(true)}
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

            {/* Render selected view based on Option */}
            {appliedFilters.reportOption === "Details" && (
              <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-2.5 w-12 text-center">#</th>
                      <th className="p-2.5">Emp ID</th>
                      <th className="p-2.5">Emp Name</th>
                      <th className="p-2.5">Department</th>
                      <th className="p-2.5">Designation</th>
                      <th className="p-2.5">Unit</th>
                      <th className="p-2.5 text-center">CL</th>
                      <th className="p-2.5 text-center">SL</th>
                      <th className="p-2.5 text-center">EL</th>
                      <th className="p-2.5 text-center">ML</th>
                      <th className="p-2.5 text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredData.length > 0 ? (
                      filteredData.map((row, idx) => {
                        const totalLeave = row.cl + row.sl + row.el + row.ml;
                        return (
                          <tr
                            key={row.empId}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                            <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                              {row.empId}
                            </td>
                            <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                              {row.empName}
                            </td>
                            <td className="p-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                              {row.department}
                            </td>
                            <td className="p-2.5 text-slate-600 dark:text-slate-300">
                              {row.designation}
                            </td>
                            <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.unit}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                              {row.cl}
                            </td>
                            <td className="p-2.5 text-center font-mono font-bold text-amber-600 dark:text-amber-400">
                              {row.sl}
                            </td>
                            <td className="p-2.5 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {row.el}
                            </td>
                            <td className="p-2.5 text-center font-mono font-bold text-purple-600 dark:text-purple-400">
                              {row.ml}
                            </td>
                            <td className="p-2.5 text-center font-mono font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60">
                              {totalLeave}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={11} className="p-8 text-center text-slate-400 dark:text-slate-500">
                          No leave summary entries available for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {appliedFilters.reportOption === "Gender Wise(CL,SL)" && (
              <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-2.5">Gender</th>
                      <th className="p-2.5 text-center">Head Count</th>
                      <th className="p-2.5 text-center">Casual Leave (CL)</th>
                      <th className="p-2.5 text-center">Sick Leave (SL)</th>
                      <th className="p-2.5 text-center">Earned Leave (EL)</th>
                      <th className="p-2.5 text-center">Maternity Leave (ML)</th>
                      <th className="p-2.5 text-center">Total Leave Taken</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {genderWiseData.map((row) => (
                      <tr key={row.gender} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">{row.gender}</td>
                        <td className="p-2.5 text-center font-mono font-bold">{row.count}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-blue-600">{row.totalCl}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-amber-600">{row.totalSl}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-600">{row.totalEl}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-purple-600">{row.totalMl}</td>
                        <td className="p-2.5 text-center font-mono font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800">
                          {row.grandTotal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {appliedFilters.reportOption === "Gender Wise(NO Leave)" && (
              <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-2.5">Gender</th>
                      <th className="p-2.5 text-center">Employees With Zero (0) Leave Taken</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {genderWiseNoLeaveData.map((row) => (
                      <tr key={row.gender} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">{row.gender}</td>
                        <td className="p-2.5 text-center font-mono font-black text-emerald-600">
                          {row.count} Employees
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination & Bottom Action Bar - Identical Layout */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing {filteredData.length > 0 ? 1 : 0} to {filteredData.length} of{" "}
                {filteredData.length} entries
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedRecord(filteredData[0] || null);
                    setIsPreviewOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>VIEW (PDF)</span>
                </button>

                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-600 hover:bg-lime-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>EXPORT (EXCEL)</span>
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
                LEAVE SUMMARY DOSSIER ({appliedFilters.year})
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                Pakiza Software Limited
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                <span className="text-slate-500">Employee Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedRecord.empName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40">
                  <span className="block text-[10px] uppercase font-bold text-blue-600">
                    Casual Leave (CL)
                  </span>
                  <span className="text-lg font-black text-blue-700 dark:text-blue-300">
                    {selectedRecord.cl} Days
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40">
                  <span className="block text-[10px] uppercase font-bold text-amber-600">
                    Sick Leave (SL)
                  </span>
                  <span className="text-lg font-black text-amber-700 dark:text-amber-300">
                    {selectedRecord.sl} Days
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40">
                  <span className="block text-[10px] uppercase font-bold text-emerald-600">
                    Earned Leave (EL)
                  </span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                    {selectedRecord.el} Days
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40">
                  <span className="block text-[10px] uppercase font-bold text-purple-600">
                    Maternity Leave (ML)
                  </span>
                  <span className="text-lg font-black text-purple-700 dark:text-purple-300">
                    {selectedRecord.ml} Days
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  toast.success("Downloading PDF Summary...");
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

      {/* Official PDF / Print View Modal */}
      <HRReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        reportTitle="Leave Summary Report"
        companyName="Pakiza Knit Composite Ltd"
        dateRange={`Year: ${appliedFilters.year}`}
        columns={pdfColumns}
        data={filteredData}
      />
    </div>
  );
}
