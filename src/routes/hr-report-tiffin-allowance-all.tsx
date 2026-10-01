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
  Coffee,
  RefreshCw,
  SlidersHorizontal,
  X,
  Eye,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/hr-report-tiffin-allowance-all")({
  head: () => ({
    meta: [
      { title: "Tiffin Allowance All Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "Track daily and night tiffin allowances, total days, and net payable amounts.",
      },
    ],
  }),
  component: TiffinAllowanceReportPage,
});

export interface TiffinAllowanceRecord {
  sl: number;
  empId: string;
  empIdOffc: string;
  name: string;
  empType: string;
  department: string;
  section: string;
  designation: string;
  day: number;
  night: number;
  totalDays: number;
  dayAmt: number;
  nightAmt: number;
  netPayableAmt: number;
  accountNo: string;
  bankName: string;
  signature: string;
}

const INITIAL_DATA: TiffinAllowanceRecord[] = [
  {
    sl: 1,
    empId: "2017009288",
    empIdOffc: "2017009288",
    name: "Md. Motabber Hossain",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Chemical Store (MCD)",
    designation: "Helper",
    day: 0,
    night: 3,
    totalDays: 3,
    dayAmt: 0,
    nightAmt: 87,
    netPayableAmt: 87,
    accountNo: "019294696126",
    bankName: "Rocket-Dutch-Bangla Bank Ltd.",
    signature: "",
  },
  {
    sl: 2,
    empId: "2018011363",
    empIdOffc: "2018011363",
    name: "Md. Monir Hossen",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Chemical Store (MCD)",
    designation: "Helper",
    day: 0,
    night: 3,
    totalDays: 3,
    dayAmt: 0,
    nightAmt: 87,
    netPayableAmt: 87,
    accountNo: "019163922064",
    bankName: "Rocket-Dutch-Bangla Bank Ltd.",
    signature: "",
  },
  {
    sl: 3,
    empId: "2019014975",
    empIdOffc: "2019014975",
    name: "Md. Sahidul Islam",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Chemical Store (MCD)",
    designation: "Loader",
    day: 3,
    night: 0,
    totalDays: 3,
    dayAmt: 87,
    nightAmt: 0,
    netPayableAmt: 87,
    accountNo: "019890831950",
    bankName: "Rocket-Dutch-Bangla Bank Ltd.",
    signature: "",
  },
  {
    sl: 4,
    empId: "2019017265",
    empIdOffc: "",
    name: "Md. Mahedi Hasan",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Chemical Store (MCD)",
    designation: "Helper",
    day: 0,
    night: 5,
    totalDays: 5,
    dayAmt: 0,
    nightAmt: 145,
    netPayableAmt: 145,
    accountNo: "017273437032",
    bankName: "Rocket-Dutch-Bangla Bank Ltd.",
    signature: "",
  },
  {
    sl: 5,
    empId: "2020021151",
    empIdOffc: "",
    name: "Md. Rafiul Islam",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Chemical Store (MCD)",
    designation: "Loader",
    day: 4,
    night: 0,
    totalDays: 4,
    dayAmt: 116,
    nightAmt: 0,
    netPayableAmt: 116,
    accountNo: "017327397592",
    bankName: "Rocket-Dutch-Bangla Bank Ltd.",
    signature: "",
  },
  {
    sl: 6,
    empId: "2021025781",
    empIdOffc: "",
    name: "Md. Mashiur Rahman",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Chemical Store (MCD)",
    designation: "Loader",
    day: 3,
    night: 0,
    totalDays: 3,
    dayAmt: 87,
    nightAmt: 0,
    netPayableAmt: 87,
    accountNo: "013343001199",
    bankName: "Rocket-Dutch-Bangla Bank Ltd.",
    signature: "",
  },
  {
    sl: 7,
    empId: "2021027612",
    empIdOffc: "",
    name: "Anowar Hossain",
    empType: "Worker",
    department: "Fabrics Department",
    section: "Chemical Store (MCD)",
    designation: "Loader",
    day: 2,
    night: 0,
    totalDays: 2,
    dayAmt: 58,
    nightAmt: 0,
    netPayableAmt: 58,
    accountNo: "014077339196",
    bankName: "Rocket-Dutch-Bangla Bank Ltd.",
    signature: "",
  },
];

const ALL_EMPLOYEE_TYPES = ["Office Executive", "Office Staff", "Production Staff", "Worker"];
const DEPARTMENTS = ["ALL", "Fabrics Department", "Human Resources", "Maintenance", "Marketing and Merchandising", "Medical"];
const SECTIONS = ["ALL", "Chemical Store (MCD)", "Human Resources", "Maintenance Utility & Textile", "Marketing & Merchandising", "Medical"];
const DESIGNATIONS = ["ALL", "Helper", "Loader", "Officer", "Senior Officer", "Manager"];
const UNITS = ["ALL", "Unit-01", "Unit-02", "Unit-03", "Unit-04", "Unit-05"];
const LINES = ["ALL", "01", "02", "05", "10"];
const STATUSES = ["ALL", "Working", "Resigned", "Terminated", "On Leave"];

export function TiffinAllowanceReportPage() {
  // Filter States
  const [fromDate, setFromDate] = useState("2026-09-01");
  const [toDate, setToDate] = useState("2026-09-10");
  const [department, setDepartment] = useState("Fabrics Department");
  const [section, setSection] = useState("Chemical Store (MCD)");
  const [designation, setDesignation] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [status, setStatus] = useState("Working");
  const [employeeIdCsv, setEmployeeIdCsv] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");
  
  // Multi-select for Employee Type
  const [selectedEmpTypes, setSelectedEmpTypes] = useState<string[]>(ALL_EMPLOYEE_TYPES);
  const [tableSearch, setTableSearch] = useState("");

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Active Applied Filters
  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: "2026-09-01",
    toDate: "2026-09-10",
    department: "Fabrics Department",
    section: "Chemical Store (MCD)",
    designation: "ALL",
    unit: "ALL",
    line: "ALL",
    status: "Working",
    employeeIdCsv: "",
    idType: "System" as "System" | "Office",
    selectedEmpTypes: [...ALL_EMPLOYEE_TYPES],
  });

  const pdfColumns: ColumnDef<TiffinAllowanceRecord>[] = [
    { header: "SL", accessor: (r) => r.sl, align: "center", width: "40px" },
    { header: "Emp ID", accessor: (r) => r.empId, align: "center" },
    { header: "Emp Id(Off)", accessor: (r) => r.empIdOffc, align: "center" },
    { header: "Name", accessor: (r) => r.name },
    { header: "Emp Type", accessor: (r) => r.empType },
    { header: "Department", accessor: (r) => r.department },
    { header: "Section", accessor: (r) => r.section },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Day", accessor: (r) => r.day, align: "center" },
    { header: "Night", accessor: (r) => r.night, align: "center" },
    { header: "Total Days", accessor: (r) => r.totalDays, align: "center" },
    { header: "Day Amt", accessor: (r) => r.dayAmt, align: "right" },
    { header: "Night Amt", accessor: (r) => r.nightAmt, align: "right" },
    { header: "Net Payable Amt", accessor: (r) => r.netPayableAmt, align: "right" },
    { header: "Account No", accessor: (r) => r.accountNo },
    { header: "Bank Name", accessor: (r) => r.bankName },
    { header: "Signature", accessor: (r) => r.signature },
  ];

  const handleSearch = () => {
    setAppliedFilters({
      fromDate,
      toDate,
      department,
      section,
      designation,
      unit,
      line,
      status,
      employeeIdCsv,
      idType,
      selectedEmpTypes: [...selectedEmpTypes],
    });
    toast.success(`Generating Tiffin Allowance Report...`);
  };

  const handleReset = () => {
    setFromDate("2026-09-01");
    setToDate("2026-09-10");
    setDepartment("ALL");
    setSection("ALL");
    setDesignation("ALL");
    setUnit("ALL");
    setLine("ALL");
    setStatus("ALL");
    setEmployeeIdCsv("");
    setIdType("System");
    setSelectedEmpTypes(ALL_EMPLOYEE_TYPES);
    setTableSearch("");
    setAppliedFilters({
      fromDate: "2026-09-01",
      toDate: "2026-09-10",
      department: "ALL",
      section: "ALL",
      designation: "ALL",
      unit: "ALL",
      line: "ALL",
      status: "ALL",
      employeeIdCsv: "",
      idType: "System",
      selectedEmpTypes: [...ALL_EMPLOYEE_TYPES],
    });
    toast.info("Tiffin Allowance filters reset.");
  };

  const removeEmpType = (typeToRemove: string) => {
    setSelectedEmpTypes(selectedEmpTypes.filter(t => t !== typeToRemove));
  };

  const handleSelectEmpTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && !selectedEmpTypes.includes(val)) {
      setSelectedEmpTypes([...selectedEmpTypes, val]);
    }
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return INITIAL_DATA.filter((item) => {
      if (appliedFilters.selectedEmpTypes.length > 0 && !appliedFilters.selectedEmpTypes.includes(item.empType)) return false;
      if (appliedFilters.department !== "ALL" && item.department !== appliedFilters.department) return false;
      if (appliedFilters.section !== "ALL" && item.section !== appliedFilters.section) return false;
      if (appliedFilters.designation !== "ALL" && item.designation !== appliedFilters.designation) return false;

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
      "Emp Id(Off)",
      "Name",
      "Emp Type",
      "Department",
      "Section",
      "Designation",
      "Day",
      "Night",
      "Total Days",
      "Day Amt",
      "Night Amt",
      "Net Payable Amt",
      "Account No",
      "Bank Name",
      "Signature",
    ];

    const rows = filteredData.map((r, idx) => [
      (idx + 1).toString(),
      r.empId,
      r.empIdOffc,
      r.name,
      r.empType,
      r.department,
      r.section,
      r.designation,
      r.day.toString(),
      r.night.toString(),
      r.totalDays.toString(),
      r.dayAmt.toString(),
      r.nightAmt.toString(),
      r.netPayableAmt.toString(),
      r.accountNo,
      r.bankName,
      r.signature,
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
    link.setAttribute("download", `Tiffin_Allowance_Report_${appliedFilters.fromDate}_to_${appliedFilters.toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tiffin Allowance exported to Excel!");
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
              Tiffin Allowance All
            </span>
          </div>

          {/* Page Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Coffee className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Tiffin Allowance All
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Detailed report of tiffin allowances, total days, and net payable amounts.
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
              <span>Filter Criteria</span>
            </div>

            {/* Filter Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs items-end">
              {/* Row 1 */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

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
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

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
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Designation
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {DESIGNATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Row 2 */}
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
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

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
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 col-span-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Employee Id
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
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-span-1 lg:col-span-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
                 <div className="space-y-1 flex-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Employee Type
                    </label>
                    <div className="min-h-[38px] p-1.5 flex flex-wrap gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus-within:ring-2 focus-within:ring-indigo-500/20">
                        {selectedEmpTypes.map((type) => (
                            <span key={type} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-md text-[11px] font-bold">
                                {type}
                                <button onClick={() => removeEmpType(type)} className="hover:text-red-500 transition-colors">
                                    <X className="size-3" />
                                </button>
                            </span>
                        ))}
                        <select
                            onChange={handleSelectEmpTypeChange}
                            value=""
                            className="bg-transparent text-xs font-semibold focus:outline-none flex-1 min-w-[120px] text-slate-600 dark:text-slate-300"
                        >
                            <option value="" disabled className="hidden"></option>
                            {ALL_EMPLOYEE_TYPES.filter(t => !selectedEmpTypes.includes(t)).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleSearch}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap h-[38px]"
                >
                    <Search className="size-4" />
                    <span>Search</span>
                </button>
              </div>

            </div>
          </div>

          {/* Action Bar & Table Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all"
                >
                  <FileSpreadsheet className="size-4 text-green-600" />
                  EXCEL
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all"
                >
                  <Printer className="size-4 text-slate-600 dark:text-slate-400" />
                  PRINT
                </button>
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all"
                >
                  <FileText className="size-4 text-red-500" />
                  PDF
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-64">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Search:</label>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-blue-100 dark:bg-blue-900/40 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800">SL</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800">Emp ID</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800">Emp Id(Off)</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800">Name</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800">Emp Type</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800">Department</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800">Section</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800">Designation</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800 text-center">Day</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800 text-center">Night</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800 text-center">Total Days</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800 text-right">Day Amt</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800 text-right">Night Amt</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800 text-right">Net Payable Amt</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800">Account No</th>
                    <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-800">Bank Name</th>
                    <th className="px-3 py-3 font-bold">Signature</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={17} className="px-4 py-8 text-center text-slate-500">
                        No tiffin allowance records found for the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors whitespace-nowrap"
                      >
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.sl}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.empId}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.empIdOffc}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.name}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.empType}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.department}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.section}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.designation}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50 text-center">{row.day}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50 text-center">{row.night}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50 text-center">{row.totalDays}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50 text-right">{row.dayAmt}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50 text-right">{row.nightAmt}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50 text-right">{row.netPayableAmt}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.accountNo}</td>
                        <td className="px-3 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.bankName}</td>
                        <td className="px-3 py-2">{row.signature}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {filteredData.length > 0 && (
                <div className="mt-3 text-xs text-slate-500 font-medium">
                    Showing {filteredData.length} records
                </div>
            )}
          </div>
        </main>
      </div>

      <HRReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title="Tiffin Allowance All Report"
        data={filteredData}
        columns={pdfColumns}
        filters={appliedFilters}
        landscape={true}
      />
    </div>
  );
}
