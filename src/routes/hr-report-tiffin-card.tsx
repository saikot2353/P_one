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
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/hr-report-tiffin-card")({
  head: () => ({
    meta: [
      { title: "Tiffin Card Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "Track individual tiffin duty details, in/out times, and net pay.",
      },
    ],
  }),
  component: TiffinCardReportPage,
});

export interface TiffinCardRecord {
  date: string;
  inTime: string;
  outTime: string;
  totalHours: string;
  netPay: string;
}

const MOCK_EMPLOYEES: Record<string, {
    name: string;
    empType: string;
    section: string;
    designation: string;
    unit: string;
}> = {
    "2016003492": {
        name: "Md. Mostofa Kamal",
        empType: "Office Executive",
        section: "Admin and Compliance",
        designation: "Deputy Manager",
        unit: "N/A"
    },
    "2026061223": {
        name: "Md. Parvej Hossain",
        empType: "Office Executive",
        section: "Maintenance Utility & Textile",
        designation: "Engineer",
        unit: "N/A"
    },
    "2023050011": {
        name: "Sonia Akter",
        empType: "Worker",
        section: "Sewing",
        designation: "Operator",
        unit: "PSL"
    },
    "2018090034": {
        name: "Rakib Hasan",
        empType: "Worker",
        section: "Finishing",
        designation: "Helper",
        unit: "N/A"
    }
}

const INITIAL_DATA: TiffinCardRecord[] = [
  {
    date: "01-Aug-2026",
    inTime: "08:00:00",
    outTime: "20:00:00",
    totalHours: "12:00",
    netPay: "50.00"
  },
  {
    date: "02-Aug-2026",
    inTime: "08:00:00",
    outTime: "20:00:00",
    totalHours: "12:00",
    netPay: "50.00"
  },
  {
    date: "05-Aug-2026",
    inTime: "08:00:00",
    outTime: "20:00:00",
    totalHours: "12:00",
    netPay: "50.00"
  },
  {
    date: "06-Aug-2026",
    inTime: "08:00:00",
    outTime: "20:00:00",
    totalHours: "12:00",
    netPay: "50.00"
  },
  {
    date: "10-Aug-2026",
    inTime: "08:00:00",
    outTime: "20:00:00",
    totalHours: "12:00",
    netPay: "50.00"
  },
  {
    date: "11-Aug-2026",
    inTime: "08:00:00",
    outTime: "20:00:00",
    totalHours: "12:00",
    netPay: "50.00"
  },
  {
    date: "15-Aug-2026",
    inTime: "08:00:00",
    outTime: "20:00:00",
    totalHours: "12:00",
    netPay: "50.00"
  },
  {
    date: "16-Aug-2026",
    inTime: "08:00:00",
    outTime: "20:00:00",
    totalHours: "12:00",
    netPay: "50.00"
  },
  {
    date: "20-Aug-2026",
    inTime: "08:00:00",
    outTime: "20:00:00",
    totalHours: "12:00",
    netPay: "50.00"
  }
];

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = ["", "2024", "2025", "2026", "2027"];
const COMPANIES = ["Pakiza Knit Composite Ltd", "Cripton Group"];
const AREA_NAMES = ["PKCL-Savar", "Head Office"];

export function TiffinCardReportPage() {
  // Filter States
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [company, setCompany] = useState("Pakiza Knit Composite Ltd");
  const [areaName, setAreaName] = useState("PKCL-Savar");
  const [employeeId, setEmployeeId] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");
  
  const [tableSearch, setTableSearch] = useState("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Derived Info
  const empInfo = MOCK_EMPLOYEES[employeeId] || {
      name: "",
      empType: "",
      section: "",
      designation: "",
      unit: ""
  };

  // Active Applied Filters
  const [appliedFilters, setAppliedFilters] = useState({
    month: "",
    year: "",
    company: "Pakiza Knit Composite Ltd",
    areaName: "PKCL-Savar",
    employeeId: "",
    idType: "System" as "System" | "Office",
  });

  const pdfColumns: ColumnDef<TiffinCardRecord>[] = [
    { header: "Date", accessor: (r) => r.date, align: "center" },
    { header: "In Time", accessor: (r) => r.inTime, align: "center" },
    { header: "Out Time", accessor: (r) => r.outTime, align: "center" },
    { header: "Total Hours", accessor: (r) => r.totalHours, align: "center" },
    { header: "Net Pay", accessor: (r) => r.netPay, align: "right" },
  ];

  const handleSearch = () => {
    setAppliedFilters({
      month,
      year,
      company,
      areaName,
      employeeId,
      idType,
    });
    setHasSearched(true);
    if(employeeId) {
        toast.success(`Generating Tiffin Card Report for ${employeeId}...`);
    } else {
        toast.error(`Please enter an Employee ID.`);
    }
  };

  const handleReset = () => {
    setMonth("");
    setYear("");
    setCompany("Pakiza Knit Composite Ltd");
    setAreaName("PKCL-Savar");
    setEmployeeId("");
    setIdType("System");
    setTableSearch("");
    setHasSearched(false);
    toast.info("Tiffin Card filters reset.");
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    if (!hasSearched || !employeeId || !MOCK_EMPLOYEES[employeeId]) return [];
    
    return INITIAL_DATA.filter((item) => {
      if (tableSearch.trim()) {
        const query = tableSearch.toLowerCase();
        const matchDate = item.date.toLowerCase().includes(query);
        const matchInTime = item.inTime.includes(query);
        const matchOutTime = item.outTime.includes(query);
        if (!matchDate && !matchInTime && !matchOutTime) return false;
      }

      return true;
    });
  }, [hasSearched, employeeId, tableSearch]);

  const handleExportExcel = () => {
    if (!hasSearched || !employeeId) return;
    
    const headers = [
      "Date",
      "In Time",
      "Out Time",
      "Total Hours",
      "Net Pay"
    ];

    const rows = filteredData.map((r) => [
      r.date,
      r.inTime,
      r.outTime,
      r.totalHours,
      r.netPay
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
    link.setAttribute("download", `Tiffin_Card_Report_${appliedFilters.employeeId}_${appliedFilters.month}_${appliedFilters.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tiffin Card exported to Excel!");
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
              Tiffin Card
            </span>
          </div>

          {/* Page Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-600 dark:text-amber-400">
                <Coffee className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Tiffin Card Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Detailed individual tiffin duty record and net pay overview.
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
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <SlidersHorizontal className="size-4" />
                <span>Filter Criteria</span>
              </div>
              <button
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
              >
                  <Search className="size-4" />
                  <span>Search</span>
              </button>
            </div>

            {/* Filter Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-6 gap-x-4 text-xs">
              
              {/* Row 1 */}
              <div className="space-y-1 relative">
                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-blue-500 rounded-r-md hidden lg:block"></div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-0 py-1 border-b border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-0 py-1 border-b border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                  Company
                </label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-0 py-1 border-b border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {COMPANIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                  Area Name
                </label>
                <select
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  className="w-full px-0 py-1 border-b border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {AREA_NAMES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                    Employee Id
                  </label>
                  <div className="flex items-center gap-2 text-[10px] font-bold">
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
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-0 py-1 border-b border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Row 2 (Read Only) */}
              <div className="space-y-1 relative">
                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-blue-500 rounded-r-md hidden lg:block"></div>
                <label className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                  Name
                </label>
                <div className="w-full px-0 py-1 border-b border-slate-100 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200 font-semibold min-h-[25px]">
                  {empInfo.name || ""}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                  Employee Type
                </label>
                <div className="w-full px-0 py-1 border-b border-slate-100 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200 font-semibold min-h-[25px]">
                  {empInfo.empType || ""}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                  Section
                </label>
                <div className="w-full px-0 py-1 border-b border-slate-100 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200 font-semibold min-h-[25px]">
                  {empInfo.section || ""}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                  Designation
                </label>
                <div className="w-full px-0 py-1 border-b border-slate-100 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200 font-semibold min-h-[25px]">
                  {empInfo.designation || ""}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                  Unit
                </label>
                <div className="w-full px-0 py-1 border-b border-slate-100 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200 font-semibold min-h-[25px]">
                  {empInfo.unit || ""}
                </div>
              </div>

            </div>
          </div>

          {/* Action Bar & Table Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportExcel}
                  disabled={!hasSearched || filteredData.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileSpreadsheet className="size-4 text-green-600" />
                  EXCEL
                </button>
                <button
                  onClick={handlePrint}
                  disabled={!hasSearched || filteredData.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Printer className="size-4 text-slate-600 dark:text-slate-400" />
                  PRINT
                </button>
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  disabled={!hasSearched || filteredData.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-blue-100 dark:bg-blue-900/40 text-[11px] font-bold text-slate-700 dark:text-slate-300 tracking-wider border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                    <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-slate-800 w-1/5">Date</th>
                    <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-slate-800 w-1/5">In Time</th>
                    <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-slate-800 w-1/5">Out Time</th>
                    <th className="px-4 py-3 font-bold border-r border-slate-200 dark:border-slate-800 w-1/5">Total Hours</th>
                    <th className="px-4 py-3 font-bold w-1/5">Net Pay</th>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800/20 text-[11px] text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <td className="px-4 py-1 border-r border-slate-200 dark:border-slate-800"><input type="text" placeholder="Date" className="bg-transparent border-none outline-none w-full placeholder:text-slate-400" /></td>
                      <td className="px-4 py-1 border-r border-slate-200 dark:border-slate-800"><input type="text" placeholder="In Time" className="bg-transparent border-none outline-none w-full placeholder:text-slate-400" /></td>
                      <td className="px-4 py-1 border-r border-slate-200 dark:border-slate-800"><input type="text" placeholder="Out Time" className="bg-transparent border-none outline-none w-full placeholder:text-slate-400" /></td>
                      <td className="px-4 py-1 border-r border-slate-200 dark:border-slate-800"><input type="text" placeholder="Total Hours" className="bg-transparent border-none outline-none w-full placeholder:text-slate-400" /></td>
                      <td className="px-4 py-1"><input type="text" placeholder="Net Pay" className="bg-transparent border-none outline-none w-full placeholder:text-slate-400" /></td>
                  </tr>
                </thead>
                <tbody className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  {!hasSearched ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 font-semibold text-sm">
                          No data available in table
                        </td>
                      </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No data available in table
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors whitespace-nowrap"
                      >
                        <td className="px-4 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.date}</td>
                        <td className="px-4 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.inTime}</td>
                        <td className="px-4 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.outTime}</td>
                        <td className="px-4 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.totalHours}</td>
                        <td className="px-4 py-2 border-r border-slate-100 dark:border-slate-800/50">{row.netPay}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div>
                    Showing {hasSearched ? (filteredData.length > 0 ? 1 : 0) : 0} to {filteredData.length} of {filteredData.length} entries
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
          </div>
        </main>
      </div>

      <HRReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        reportTitle={`Tiffin Card Report - ${empInfo.name}`}
        data={filteredData}
        columns={pdfColumns}
      />
    </div>
  );
}
