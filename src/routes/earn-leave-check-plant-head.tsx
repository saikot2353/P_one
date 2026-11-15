import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search,
  RotateCcw,
  ChevronRight,
  FileSpreadsheet,
  Printer,
  FileDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/earn-leave-check-plant-head")({
  head: () => ({
    meta: [
      { title: "Earn Leave Check (Plant Head) — CRIPTON" },
      {
        name: "description",
        content: "Review, approve, and finalize employee earn leave records for Plant Head.",
      },
    ],
  }),
  component: EarnLeaveCheckPlantHeadPage,
});

interface EarnLeavePlantHeadRecord {
  id: string;
  sl: number;
  empId: string;
  empName: string;
  department: string;
  section: string;
  designation: string;
  joinDate: string;
  gross: number;
  presentDay: number;
  earnDay: number;
  earnDayCf: number;
  totalEarnDay: number;
  perDayAmt: number;
  totalAmt: number;
  payPercent: number;
  payDay: number;
  netPay: number;
  signature: string;
  workingStatus?: string;
  status?: string;
}

const initialRecords: EarnLeavePlantHeadRecord[] = [
  {
    id: "rec-1",
    sl: 1,
    empId: "2022041203",
    empName: "Khairul Bashar Masum",
    department: "Implementation & Business Analysis",
    section: "HR Team",
    designation: "Asst. Manager",
    joinDate: "01/12/2022",
    gross: 46500.0,
    presentDay: 24,
    earnDay: 1.33,
    earnDayCf: 0.0,
    totalEarnDay: 1.33,
    perDayAmt: 1550.0,
    totalAmt: 2061.5,
    payPercent: 100,
    payDay: 1.33,
    netPay: 2062.0,
    signature: "",
    workingStatus: "Resigned",
    status: "Approved",
  },
  {
    id: "rec-2",
    sl: 2,
    empId: "2021093542",
    empName: "Zakir Hossain",
    department: "Business Automation (HR)",
    section: "HR Team",
    designation: "Executive",
    joinDate: "25/09/2021",
    gross: 31500.0,
    presentDay: 36,
    earnDay: 2.0,
    earnDayCf: 0.0,
    totalEarnDay: 2.0,
    perDayAmt: 1050.0,
    totalAmt: 2100.0,
    payPercent: 100,
    payDay: 2.0,
    netPay: 2100.0,
    signature: "",
    workingStatus: "Resigned",
    status: "Approved",
  },
  {
    id: "rec-3",
    sl: 3,
    empId: "2023043910",
    empName: "Tahmid Afsar",
    department: "Business Innovation",
    section: "Innovation Team",
    designation: "Deputy Manager",
    joinDate: "01/08/2023",
    gross: 67000.0,
    presentDay: 30,
    earnDay: 1.67,
    earnDayCf: 0.0,
    totalEarnDay: 1.67,
    perDayAmt: 2233.33,
    totalAmt: 3729.66,
    payPercent: 100,
    payDay: 1.67,
    netPay: 3730.0,
    signature: "",
    workingStatus: "Resigned",
    status: "Approved",
  },
  {
    id: "rec-4",
    sl: 4,
    empId: "2023044074",
    empName: "Md. Anwar Hossain",
    department: "Core Development",
    section: "Dev Team",
    designation: "Asst. Manager",
    joinDate: "06/01/2023",
    gross: 62000.0,
    presentDay: 28,
    earnDay: 1.56,
    earnDayCf: 0.0,
    totalEarnDay: 1.56,
    perDayAmt: 2066.67,
    totalAmt: 3224.0,
    payPercent: 100,
    payDay: 1.56,
    netPay: 3224.0,
    signature: "",
    workingStatus: "Resigned",
    status: "Approved",
  },
  {
    id: "rec-5",
    sl: 5,
    empId: "2024015036",
    empName: "Hanif Uddin",
    department: "Business Innovation",
    section: "Innovation Team",
    designation: "Sr. Executive",
    joinDate: "01/02/2024",
    gross: 38000.0,
    presentDay: 25,
    earnDay: 1.39,
    earnDayCf: 0.0,
    totalEarnDay: 1.39,
    perDayAmt: 1266.67,
    totalAmt: 1760.67,
    payPercent: 100,
    payDay: 1.39,
    netPay: 1761.0,
    signature: "",
    workingStatus: "Resigned",
    status: "Approved",
  },
];

function EarnLeaveCheckPlantHeadPage() {
  const [records] = useState<EarnLeavePlantHeadRecord[]>(initialRecords);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter States
  const [year, setYear] = useState("2022");
  const [duration, setDuration] = useState("Full Year");
  const [status, setStatus] = useState("Approved");
  const [workingStatus, setWorkingStatus] = useState("Resigned");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("");
  const [jobTitle, setJobTitle] = useState("ALL");
  const [employeeIdInput, setEmployeeIdInput] = useState("");

  // Search input above the table
  const [tableSearch, setTableSearch] = useState("");

  // Applied Filter State
  const [appliedFilters, setAppliedFilters] = useState({
    year: "2022",
    duration: "Full Year",
    status: "Approved",
    workingStatus: "Resigned",
    employeeType: "ALL",
    department: "All Departments",
    section: "",
    jobTitle: "ALL",
    employeeIdInput: "",
  });

  const handleSearch = () => {
    setAppliedFilters({
      year,
      duration,
      status,
      workingStatus,
      employeeType,
      department,
      section,
      jobTitle,
      employeeIdInput,
    });
  };

  const handleReset = () => {
    setYear("2022");
    setDuration("Full Year");
    setStatus("Approved");
    setWorkingStatus("Resigned");
    setEmployeeType("ALL");
    setDepartment("All Departments");
    setSection("");
    setJobTitle("ALL");
    setEmployeeIdInput("");
    setAppliedFilters({
      year: "2022",
      duration: "Full Year",
      status: "Approved",
      workingStatus: "Resigned",
      employeeType: "ALL",
      department: "All Departments",
      section: "",
      jobTitle: "ALL",
      employeeIdInput: "",
    });
    setTableSearch("");
  };

  // Distinct options
  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => r.department && set.add(r.department));
    return ["All Departments", ...Array.from(set).sort()];
  }, [records]);

  const designationOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => r.designation && set.add(r.designation));
    return ["ALL", ...Array.from(set).sort()];
  }, [records]);

  const sectionOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => r.section && set.add(r.section));
    return Array.from(set).sort();
  }, [records]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    const commaSeparatedIds = appliedFilters.employeeIdInput
      .split(",")
      .map((id) => id.trim().toLowerCase())
      .filter(Boolean);

    return records
      .filter((r) => {
        if (
          appliedFilters.workingStatus !== "ALL" &&
          r.workingStatus &&
          r.workingStatus !== appliedFilters.workingStatus
        ) {
          return false;
        }

        if (appliedFilters.status !== "ALL" && r.status && r.status !== appliedFilters.status) {
          return false;
        }

        if (
          appliedFilters.department !== "All Departments" &&
          r.department !== appliedFilters.department
        ) {
          return false;
        }

        if (appliedFilters.section && r.section !== appliedFilters.section) {
          return false;
        }

        if (appliedFilters.jobTitle !== "ALL" && r.designation !== appliedFilters.jobTitle) {
          return false;
        }

        if (commaSeparatedIds.length > 0) {
          const match = commaSeparatedIds.some((id) =>
            r.empId.toLowerCase().includes(id)
          );
          if (!match) return false;
        }

        if (tableSearch.trim()) {
          const q = tableSearch.toLowerCase();
          const matchSearch =
            r.empId.toLowerCase().includes(q) ||
            r.empName.toLowerCase().includes(q) ||
            r.department.toLowerCase().includes(q) ||
            r.section.toLowerCase().includes(q) ||
            r.designation.toLowerCase().includes(q);
          if (!matchSearch) return false;
        }

        return true;
      })
      .map((r, index) => ({
        ...r,
        displaySl: index + 1,
      }));
  }, [records, appliedFilters, tableSearch]);

  const isAllSelected =
    filteredRows.length > 0 && filteredRows.every((r) => selectedIds.has(r.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRows.map((r) => r.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmitSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one employee record to approve for Plant Head.");
      return;
    }
    toast.success(`Successfully approved ${selectedIds.size} record(s) by Plant Head.`);
    setSelectedIds(new Set());
  };

  const handleRejectSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one employee record to reject.");
      return;
    }
    toast.error(`Rejected ${selectedIds.size} record(s) from Plant Head queue.`);
    setSelectedIds(new Set());
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a] text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-7 space-y-4 max-w-[1700px] w-full mx-auto">
          {/* Breadcrumb */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium select-none">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span>Leave</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Earn Leave Check (Plant Head)
            </span>
          </div>

          {/* Filter Card */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-all">
            {/* Row 1: Year, Duration, Status, Working Status, Employee Type, Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-3.5">
              {/* Year */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full h-8.5 px-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full h-8.5 px-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  <option value="Full Year">Full Year</option>
                  <option value="Half Year (Jan-Jun)">Half Year (Jan-Jun)</option>
                  <option value="Half Year (Jul-Dec)">Half Year (Jul-Dec)</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-8.5 px-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                  <option value="ALL">ALL</option>
                </select>
              </div>

              {/* Working Status */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Working Status
                </label>
                <select
                  value={workingStatus}
                  onChange={(e) => setWorkingStatus(e.target.value)}
                  className="w-full h-8.5 px-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  <option value="Resigned">Resigned</option>
                  <option value="Working">Working</option>
                  <option value="Terminated">Terminated</option>
                  <option value="ALL">ALL</option>
                </select>
              </div>

              {/* Employee Type */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Employee Type
                </label>
                <select
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  className="w-full h-8.5 px-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  <option value="Office Staff">Office Staff</option>
                  <option value="Worker">Worker</option>
                  <option value="Office Executive">Office Executive</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-8.5 px-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  {departmentOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Section, Job Title, Employee Id, Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-end">
              {/* Section */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full h-8.5 px-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  <option value="">Select Section</option>
                  {sectionOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Title */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Job Title
                </label>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full h-8.5 px-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  {designationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee Id */}
              <div className="lg:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Employee Id
                </label>
                <input
                  type="text"
                  value={employeeIdInput}
                  onChange={(e) => setEmployeeIdInput(e.target.value)}
                  placeholder="use comma as separator"
                  className="w-full h-8.5 px-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Spacer */}
              <div className="hidden lg:block"></div>

              {/* Search & Reset Buttons */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="size-8.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors shadow-xs cursor-pointer"
                  title="Reset Filter"
                >
                  <RotateCcw className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="h-8.5 px-4.5 rounded-md bg-[#1976d2] hover:bg-[#1565c0] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
                >
                  <Search className="size-3.5 stroke-[2.2]" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            {/* Table Header Utilities */}
            <div className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="h-7.5 px-3 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-1 transition"
                >
                  <FileSpreadsheet className="size-3 text-emerald-600" />
                  <span>EXCEL</span>
                </button>
                <button
                  type="button"
                  className="h-7.5 px-3 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-1 transition"
                >
                  <Printer className="size-3 text-blue-600" />
                  <span>PRINT</span>
                </button>
                <button
                  type="button"
                  className="h-7.5 px-3 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-1 transition"
                >
                  <FileDown className="size-3 text-rose-600" />
                  <span>PDF</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">Search:</span>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter records..."
                  className="h-7.5 px-2.5 w-48 rounded border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-[#bfe0fa] text-slate-800 dark:bg-sky-950/40 dark:text-sky-200 font-bold border-b border-slate-200/90 dark:border-slate-700/80 whitespace-nowrap select-none text-[9.5px] uppercase tracking-wider">
                    <th className="py-2.5 px-2.5 text-center w-9">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 size-3.5 cursor-pointer"
                        title="Select All"
                      />
                    </th>
                    <th className="py-2.5 px-2 text-center w-10">SL</th>
                    <th className="py-2.5 px-2.5">Emp ID</th>
                    <th className="py-2.5 px-3">Emp Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-2.5">Section</th>
                    <th className="py-2.5 px-3">Designation</th>
                    <th className="py-2.5 px-2.5 text-center">Join Date</th>
                    <th className="py-2.5 px-2.5 text-right">Gross</th>
                    <th className="py-2.5 px-2 text-center">Present Day</th>
                    <th className="py-2.5 px-2 text-center">Earn Day</th>
                    <th className="py-2.5 px-2 text-center">Earn Day(CF)</th>
                    <th className="py-2.5 px-2 text-center">Total Earn Day</th>
                    <th className="py-2.5 px-2.5 text-right">Per Day Amt</th>
                    <th className="py-2.5 px-2.5 text-right">Total Amt</th>
                    <th className="py-2.5 px-2 text-center">Pay(%)</th>
                    <th className="py-2.5 px-2 text-center">Pay Day</th>
                    <th className="py-2.5 px-3 text-right">Net Pay</th>
                    <th className="py-2.5 px-3 text-center">Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                  {filteredRows.map((row) => {
                    const isChecked = selectedIds.has(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors whitespace-nowrap ${
                          isChecked ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                        }`}
                      >
                        <td className="py-2 px-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectRow(row.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 size-3.5 cursor-pointer"
                          />
                        </td>
                        <td className="py-2 px-2 text-center text-slate-400 font-mono text-[10px]">
                          {row.displaySl}
                        </td>
                        <td className="py-2 px-2.5 font-mono text-[10.5px] text-slate-700 dark:text-slate-300 font-semibold">
                          {row.empId}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                          {row.empName}
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                          {row.department}
                        </td>
                        <td className="py-2 px-2.5 text-slate-600 dark:text-slate-400">
                          {row.section || "—"}
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                          {row.designation}
                        </td>
                        <td className="py-2 px-2.5 text-center font-mono text-[10.5px] text-slate-500 dark:text-slate-400">
                          {row.joinDate}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono text-slate-900 dark:text-white font-semibold">
                          {row.gross.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-slate-700 dark:text-slate-300">
                          {row.presentDay}
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-slate-700 dark:text-slate-300">
                          {row.earnDay.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-slate-600 dark:text-slate-400">
                          {row.earnDayCf.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                          {row.totalEarnDay.toFixed(2)}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono text-slate-700 dark:text-slate-300">
                          {row.perDayAmt.toFixed(2)}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {row.totalAmt.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-slate-700 dark:text-slate-300">
                          {row.payPercent}
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-slate-700 dark:text-slate-300">
                          {row.payDay.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {row.netPay.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-center text-slate-400">
                          {row.signature || "—"}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={19} className="py-12 text-center text-slate-400 font-medium">
                        No earn leave records found matching the criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions and Status Bar */}
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1e293b]">
              <div className="space-y-2">
                <span className="text-[10.5px] font-medium text-slate-500 block">
                  Showing 1 to {filteredRows.length} of {filteredRows.length} entries
                  {selectedIds.size > 0 && (
                    <span className="ml-2 font-bold text-blue-600 dark:text-blue-400">
                      ({selectedIds.size} selected)
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSubmitSelected}
                    className="h-8 px-4 rounded bg-[#4caf50] hover:bg-[#43a047] text-white text-[11px] font-extrabold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Submit</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectSelected}
                    className="h-8 px-4 rounded bg-[#e53935] hover:bg-[#d32f2f] text-white text-[11px] font-extrabold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <XCircle className="size-3.5" />
                    <span>Rejected</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

