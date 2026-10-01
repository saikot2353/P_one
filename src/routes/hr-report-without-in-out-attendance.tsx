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

export const Route = createFileRoute("/hr-report-without-in-out-attendance")({
  head: () => ({
    meta: [
      { title: "Without In Out Attendance — CRIPTON HRIS" },
      {
        name: "description",
        content: "Generate and export attendance report for employees without proper in/out punches.",
      },
    ],
  }),
  component: WithoutInOutAttendanceReportPage,
});

export interface WithoutInOutRecord {
  sl: number;
  empId: string;
  empIdOffc: string;
  employeeName: string;
  department: string;
  designation: string;
  companyName: string;
  date: string;
  inTime: string;
  outDate: string;
  outTime: string;
  section: string;
  unit: string;
  employeeType: string;
}

const INITIAL_DATA: WithoutInOutRecord[] = [
  {
    sl: 1,
    empId: "2026061937",
    empIdOffc: "2026061937",
    employeeName: "Md. Jahidul Islam",
    department: "Implementation & Business Analysis",
    designation: "Executive",
    companyName: "Pakiza Software Limited",
    date: "01/10/2026",
    inTime: "--:--",
    outDate: "01/10/2026",
    outTime: "06:15 PM",
    section: "HR Team",
    unit: "PSL",
    employeeType: "Permanent",
  },
  {
    sl: 2,
    empId: "2025054609",
    empIdOffc: "2025054609",
    employeeName: "Md Mahir Shahriyar",
    department: "Business Innovation",
    designation: "Jr. Executive",
    companyName: "Pakiza Software Limited",
    date: "01/10/2026",
    inTime: "09:20 AM",
    outDate: "--/--/----",
    outTime: "--:--",
    section: "Project Resource & Strategy",
    unit: "PSL",
    employeeType: "Permanent",
  },
  {
    sl: 3,
    empId: "2026090511",
    empIdOffc: "2026090511",
    employeeName: "Tanvir Ahmed",
    department: "Accounts & Finance",
    designation: "Officer",
    companyName: "Pakiza Knit Group",
    date: "01/10/2026",
    inTime: "--:--",
    outDate: "--/--/----",
    outTime: "--:--",
    section: "Payroll Audit",
    unit: "PKG",
    employeeType: "Probationary",
  }
];

function WithoutInOutAttendanceReportPage() {
  const [data, setData] = useState<WithoutInOutRecord[]>(INITIAL_DATA);
  
  // Form States corresponding to the screenshot
  const [searchingOption, setSearchingOption] = useState("Without In Time");
  const [startDate, setStartDate] = useState("2026-10-01");
  const [department, setDepartment] = useState("ALL");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  
  const [employeeId, setEmployeeId] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");
  
  const [tableSearch, setTableSearch] = useState("");

  // Filtered State
  const [filteredData, setFilteredData] = useState<WithoutInOutRecord[]>(INITIAL_DATA);
  
  // PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  const handleReset = () => {
    setSearchingOption("Without In Time");
    setStartDate("2026-10-01");
    setDepartment("ALL");
    setEmployeeType("ALL");
    setSection("ALL");
    setUnit("ALL");
    setEmployeeId("");
    setIdType("System");
    setTableSearch("");
    setFilteredData(data);
    toast.success("Filters reset successfully!");
  };

  const handleSearch = () => {
    const currentFilters = {
      searchingOption,
      startDate,
      department,
      employeeType,
      section,
      unit,
      employeeId,
      idType,
    };
    
    const filtered = data.filter((item) => {
      if (department !== "ALL" && item.department !== department) return false;
      if (employeeType !== "ALL" && item.employeeType !== employeeType) return false;
      if (section !== "ALL" && item.section !== section) return false;
      if (unit !== "ALL" && item.unit !== unit) return false;
      
      // Basic logic for searching option representation
      if (searchingOption === "Without In Time" && item.inTime !== "--:--") return false;
      if (searchingOption === "Without Out Time" && item.outTime !== "--:--") return false;

      if (employeeId.trim() !== "") {
        const ids = employeeId.split(",").map(id => id.trim());
        if (idType === "System") {
          if (!ids.includes(item.empId)) return false;
        } else {
          if (!ids.includes(item.empIdOffc)) return false;
        }
      }

      return true;
    });

    setFilteredData(filtered);
    setAppliedFilters(currentFilters);
    
    if (filtered.length === 0) {
      toast.error("No records found matching the criteria");
    } else {
      toast.success("Found " + filtered.length + " records");
    }
  };

  const handleExportExcel = () => {
    toast.success("Excel report exported successfully!");
  };

  const handlePrint = () => {
    toast.info("Opening browser print dialog...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // PDF Export definitions
  const pdfColumns: ColumnDef<WithoutInOutRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "40px" },
    { header: "Emp Id", accessor: (r) => r.empId, align: "center" },
    { header: "Employee Name", accessor: (r) => r.employeeName },
    { header: "Department", accessor: (r) => r.department },
    { header: "Desgination", accessor: (r) => r.designation },
    { header: "Company Name", accessor: (r) => r.companyName },
    { header: "Date", accessor: (r) => r.date, align: "center" },
    { header: "In Time", accessor: (r) => r.inTime, align: "center" },
    { header: "Out Date", accessor: (r) => r.outDate, align: "center" },
    { header: "Out Time", accessor: (r) => r.outTime, align: "center" },
  ];

  const handlePdfExport = () => {
    if (filteredData.length === 0) {
      toast.error("No data available to export.");
      return;
    }
    if (Object.keys(appliedFilters).length === 0) {
      toast.error("Please perform a search first before exporting.");
      return;
    }
    setIsPdfModalOpen(true);
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
              Without In Out Attendance
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
                  Without In Out Attendance Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Generate and export attendance report for employees missing proper in/out punches.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              {/* Searching Option */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Searching Option
                </label>
                <select
                  value={searchingOption}
                  onChange={(e) => setSearchingOption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Without In Time">Without In Time</option>
                  <option value="Without Out Time">Without Out Time</option>
                  <option value="Both Missed">Both Missed</option>
                </select>
              </div>
              
              {/* Start Date */}
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

              {/* Department */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Implementation & Business Analysis">Implementation & Business Analysis</option>
                  <option value="Business Innovation">Business Innovation</option>
                  <option value="Accounts & Finance">Accounts & Finance</option>
                </select>
              </div>

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
                  <option value="HR Team">HR Team</option>
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
                  <option value="PSL">PSL</option>
                  <option value="PKG">PKG</option>
                </select>
              </div>

              {/* Employee Id + Radio (Spans 2 columns) */}
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Emp Id <span className="text-[10px] font-normal text-slate-500">(use comma as separator)</span>
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
                  placeholder="e.g. 2026061937, 2025054609"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
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
              <table className="w-full text-[11px] text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2.5 w-12 text-center">SL</th>
                    <th className="p-2.5">Emp Id</th>
                    <th className="p-2.5 min-w-[160px]">Employee Name</th>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5">Desgination</th>
                    <th className="p-2.5">Company Name</th>
                    <th className="p-2.5 text-center">Date</th>
                    <th className="p-2.5 text-center">In Time</th>
                    <th className="p-2.5 text-center">Out Date</th>
                    <th className="p-2.5 text-center">Out Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredData.length > 0 ? (
                    filteredData.map((row, idx) => (
                      <tr
                        key={row.empId}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.empId}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                          {row.employeeName}
                        </td>
                        <td className="p-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                          {row.department}
                        </td>
                        <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                          {row.designation}
                        </td>
                        <td className="p-2.5 text-slate-700 dark:text-slate-300">
                          {row.companyName}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400 text-center">{row.date}</td>
                        <td className="p-2.5 font-bold text-center text-rose-600 dark:text-rose-400">
                          {row.inTime}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400 text-center">{row.outDate}</td>
                        <td className="p-2.5 font-bold text-center text-rose-600 dark:text-rose-400">
                          {row.outTime}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/30">
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
        title="Without In Out Attendance"
        subtitle="Employees missing proper in/out punches"
        data={filteredData}
        columns={pdfColumns}
        filters={appliedFilters}
        layout="landscape"
      />
    </div>
  );
}

export default WithoutInOutAttendanceReportPage;
