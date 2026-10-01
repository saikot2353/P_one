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
  UserMinus,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  X,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/hr-report-separation-list")({
  head: () => ({
    meta: [
      { title: "Separation List — CRIPTON HRIS" },
      {
        name: "description",
        content: "Generate and export comprehensive employee separation reports.",
      },
    ],
  }),
  component: SeparationListReportPage,
});

export interface SeparationRecord {
  sl: number;
  id: string;
  empIdOffc: string;
  name: string;
  type: string;
  department: string;
  designation: string;
  unit: string;
  line: string;
  grade: string;
  joiningDate: string;
  lastWorkingDate: string;
  actionDate: string;
  remarks: string;
  status: string;
  company: string;
  areaName: string;
  subDepartment: string;
}

const INITIAL_DATA: SeparationRecord[] = [
  {
    sl: 1,
    id: "2023061901",
    empIdOffc: "2023061901",
    name: "Md. Hasan Mahmud",
    type: "Permanent",
    department: "Software Development",
    designation: "Software Engineer",
    unit: "PSL",
    line: "N/A",
    grade: "Grade 1",
    joiningDate: "15/06/2023",
    lastWorkingDate: "10/09/2026",
    actionDate: "01/09/2026",
    remarks: "Better Opportunity",
    status: "Resigned",
    company: "Pakiza Software Limited",
    areaName: "PSL-Operation",
    subDepartment: "Backend",
  },
  {
    sl: 2,
    id: "2022054611",
    empIdOffc: "2022054611",
    name: "Kamrul Islam",
    type: "Probationary",
    department: "Business Innovation",
    designation: "Executive",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    joiningDate: "01/01/2026",
    lastWorkingDate: "05/09/2026",
    actionDate: "05/09/2026",
    remarks: "Performance Issue",
    status: "Removed",
    company: "Pakiza Software Limited",
    areaName: "PSL-Operation",
    subDepartment: "Strategy",
  },
  {
    sl: 3,
    id: "2024090122",
    empIdOffc: "2024090122",
    name: "Rahima Khatun",
    type: "Contractual",
    department: "Accounts & Finance",
    designation: "Assistant Manager",
    unit: "Pakiza Knit Group",
    line: "Line 1",
    grade: "Grade 3",
    joiningDate: "15/03/2024",
    lastWorkingDate: "30/09/2026",
    actionDate: "15/09/2026",
    remarks: "End of Contract",
    status: "Lefty",
    company: "Pakiza Knit Group",
    areaName: "PKG-Operation",
    subDepartment: "Audit",
  }
];

const STATUS_OPTIONS = ["Resigned", "Removed", "Show Caused", "Lefty"];

function SeparationListReportPage() {
  const [data, setData] = useState<SeparationRecord[]>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Form States
  const [company, setCompany] = useState("ALL");
  const [areaName, setAreaName] = useState("ALL");
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-10-01");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("ALL");
  const [subDepartment, setSubDepartment] = useState("ALL");
  const [jobTitle, setJobTitle] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(STATUS_OPTIONS);
  
  const [employeeId, setEmployeeId] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");

  // Filtered State
  const [filteredData, setFilteredData] = useState<SeparationRecord[]>(INITIAL_DATA);
  
  // PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  const handleToggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const removeStatus = (status: string) => {
    setSelectedStatuses((prev) => prev.filter((s) => s !== status));
  };

  const handleSearch = () => {
    setIsLoading(true);

    setTimeout(() => {
      const currentFilters = {
        company,
        areaName,
        startDate,
        endDate,
        employeeType,
        department,
        subDepartment,
        jobTitle,
        unit,
        line,
        selectedStatuses,
        employeeId,
        idType,
      };
      
      const filtered = data.filter((item) => {
        if (company !== "ALL" && item.company !== company) return false;
        if (areaName !== "ALL" && item.areaName !== areaName) return false;
        if (employeeType !== "ALL" && item.type !== employeeType) return false;
        if (department !== "ALL" && item.department !== department) return false;
        if (subDepartment !== "ALL" && item.subDepartment !== subDepartment) return false;
        if (jobTitle !== "ALL" && item.designation !== jobTitle) return false;
        if (unit !== "ALL" && item.unit !== unit) return false;
        if (line !== "ALL" && item.line !== line) return false;
        
        if (selectedStatuses.length > 0 && !selectedStatuses.includes(item.status)) return false;

        if (employeeId.trim() !== "") {
          const ids = employeeId.split(",").map(id => id.trim());
          if (idType === "System") {
            if (!ids.includes(item.id)) return false;
          } else {
            if (!ids.includes(item.empIdOffc)) return false;
          }
        }

        // Add date logic here if needed (skipping for dummy data brevity)

        return true;
      });

      setFilteredData(filtered);
      setAppliedFilters(currentFilters);
      setIsLoading(false);
      
      if (filtered.length === 0) {
        toast.error("No records found matching the criteria", {
          position: "top-center",
        });
      } else {
        toast.success(`Found ${filtered.length} records`, {
          position: "top-center",
        });
      }
    }, 600);
  };

  // PDF Export definitions
  const pdfColumns: ColumnDef<SeparationRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "40px" },
    { header: "ID", accessor: (r) => r.id, align: "center" },
    { header: "EmpID (off.)", accessor: (r) => r.empIdOffc, align: "center" },
    { header: "Name", accessor: (r) => r.name },
    { header: "Type", accessor: (r) => r.type },
    { header: "Department", accessor: (r) => r.department },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Unit", accessor: (r) => r.unit, align: "center" },
    { header: "Line", accessor: (r) => r.line, align: "center" },
    { header: "Grade", accessor: (r) => r.grade, align: "center" },
    { header: "Joining Date", accessor: (r) => r.joiningDate, align: "center" },
    { header: "Last Working Date", accessor: (r) => r.lastWorkingDate, align: "center" },
    { header: "Action Date", accessor: (r) => r.actionDate, align: "center" },
    { header: "Remarks", accessor: (r) => r.remarks },
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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900/50 font-inter overflow-hidden selection:bg-indigo-500/30">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0 h-full relative transition-all duration-300">
        <Topbar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          title="Separation List" 
        />

        <div className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">
                  <Link
                    to="/hr-reports"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                  >
                    <FileSpreadsheet className="size-4" />
                    HR Reports
                  </Link>
                  <ChevronRight className="size-3" />
                  <span className="text-slate-800 dark:text-slate-200">Separation List</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  <UserMinus className="size-8 text-rose-500" />
                  Separation List
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-2xl">
                  Generate, view, and export separated employee records. Use the filters below to refine your data.
                </p>
              </div>
            </div>

            {/* Comprehensive Search & Filter Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
                <SlidersHorizontal className="size-4" />
                <span>Search & Filter Criteria</span>
              </div>

              {/* Filter Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-xs">
                {/* 1. Company */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Company
                  </label>
                  <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Pakiza Software Limited">Pakiza Software Limited</option>
                    <option value="Pakiza Knit Group">Pakiza Knit Group</option>
                  </select>
                </div>

                {/* 2. Area Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Area Name
                  </label>
                  <select
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="PSL-Operation">PSL-Operation</option>
                    <option value="PKG-Operation">PKG-Operation</option>
                  </select>
                </div>

                {/* 3. Start Date */}
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

                {/* 4. End Date */}
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

                {/* 5. Employee Type */}
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

                {/* 6. Department */}
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
                    <option value="Software Development">Software Development</option>
                    <option value="Business Innovation">Business Innovation</option>
                    <option value="Accounts & Finance">Accounts & Finance</option>
                  </select>
                </div>

                {/* 7. Sub Department */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Sub Department
                  </label>
                  <select
                    value={subDepartment}
                    onChange={(e) => setSubDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Strategy">Strategy</option>
                  </select>
                </div>

                {/* 8. Job Title */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Job Title
                  </label>
                  <select
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Executive">Executive</option>
                    <option value="Assistant Manager">Assistant Manager</option>
                  </select>
                </div>

                {/* 9. Unit */}
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
                    <option value="Pakiza Knit Group">Pakiza Knit Group</option>
                  </select>
                </div>

                {/* 10. Line */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Line
                  </label>
                  <select
                    value={line}
                    onChange={(e) => setLine(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="N/A">N/A</option>
                    <option value="Line 1">Line 1</option>
                  </select>
                </div>

                {/* 11. Status */}
                <div className="space-y-1 col-span-1 lg:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2 items-center p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 min-h-[38px]">
                    {selectedStatuses.map((status) => (
                      <span
                        key={status}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 shadow-xs group"
                      >
                        {status}
                        <button
                          onClick={() => removeStatus(status)}
                          className="hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full p-0.5 transition-colors"
                        >
                          <X className="size-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                        </button>
                      </span>
                    ))}
                    {STATUS_OPTIONS.filter((s) => !selectedStatuses.includes(s)).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleToggleStatus(status)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        + {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 12. Employee Id + Radio */}
                <div className="space-y-1 col-span-1 lg:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                      Employee Id <span className="text-[10px] font-normal text-slate-500">(Multi with comma)</span>
                    </label>
                    <div className="flex items-center gap-3 text-[11px] font-bold">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="idType"
                          value="System"
                          checked={idType === "System"}
                          onChange={() => setIdType("System")}
                          className="accent-indigo-600"
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
                          className="accent-indigo-600"
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

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-start gap-3">
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-xl shadow-xs transition-all disabled:opacity-70"
                >
                  {isLoading ? (
                    <RefreshCw className="size-4 animate-spin" />
                  ) : (
                    <Search className="size-4" />
                  )}
                  SEARCH
                </button>
              </div>
            </div>

            {/* Export Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-xs"
                >
                  <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
                  EXCEL
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-xs"
                >
                  <Printer className="size-4 text-slate-600 dark:text-slate-400" />
                  PRINT
                </button>
                <button
                  onClick={handlePdfExport}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-xs"
                >
                  <FileText className="size-4 text-rose-600 dark:text-rose-400" />
                  PDF
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Search:</span>
                <input
                  type="text"
                  placeholder="Filter results..."
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50 w-12 text-center">
                        SL
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50">
                        ID
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50">
                        EmpID (off.)
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50 min-w-[180px]">
                        Name
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50">
                        Type
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50">
                        Department
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50">
                        Designation
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50 text-center">
                        Unit
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50 text-center">
                        Line
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50 text-center">
                        Grade
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50 text-center">
                        Joining Date
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50 text-center">
                        Last Working Date
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-200/50 dark:border-slate-700/50 text-center">
                        Action Date
                      </th>
                      <th className="px-4 py-3 font-bold">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          <td className="px-4 py-2.5 font-medium text-slate-500 dark:text-slate-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                            {item.id}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                            {item.empIdOffc}
                          </td>
                          <td className="px-4 py-2.5 border-r border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                            {item.type}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                            {item.department}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                            {item.designation}
                          </td>
                          <td className="px-4 py-2.5 font-bold text-indigo-600 dark:text-indigo-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {item.unit}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {item.line}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {item.grade}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {item.joiningDate}
                          </td>
                          <td className="px-4 py-2.5 font-bold text-rose-600 dark:text-rose-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {item.lastWorkingDate}
                          </td>
                          <td className="px-4 py-2.5 font-bold text-amber-600 dark:text-amber-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {item.actionDate}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300">
                            {item.remarks}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={14}
                          className="px-4 py-12 text-center text-slate-500 dark:text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/30"
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
          </div>
        </div>
      </main>

      {/* Reusable PDF Modal */}
      <HRReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title="Separation List Report"
        subtitle="Detailed list of employee separations"
        data={filteredData}
        columns={pdfColumns}
        filters={appliedFilters}
        layout="landscape"
      />
    </div>
  );
}

export default SeparationListReportPage;
