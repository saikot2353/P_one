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
  Users,
  RefreshCw,
  SlidersHorizontal,
  X,
  Eye,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/hr-report-employee-count")({
  head: () => ({
    meta: [
      { title: "Employee Count Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "View employee headcount distribution by department, unit, and designation.",
      },
    ],
  }),
  component: EmployeeCountReportPage,
});

export interface EmployeeCountRecord {
  sl: number;
  empType: string;
  department: string;
  designation: string;
  gender: "Male" | "Female";
  unit: string;
  grade: string;
  status: string;
  count: number;
  organization: string;
  region: string;
  section: string;
  component: string;
  line: string;
}

const INITIAL_DATA: EmployeeCountRecord[] = [
  {
    sl: 1,
    empType: "Office Executive",
    department: "Implementation & Business Analysis",
    designation: "Executive",
    gender: "Male",
    unit: "Unit-01",
    grade: "None",
    status: "Working",
    count: 42,
    organization: "Pakiza Knit Composite Ltd",
    region: "PKCL-Savar",
    section: "Accounts",
    component: "RMG",
    line: "01",
  },
  {
    sl: 2,
    empType: "Office Executive",
    department: "Business Innovation",
    designation: "Jr. Executive",
    gender: "Male",
    unit: "Unit-01",
    grade: "None",
    status: "Working",
    count: 18,
    organization: "Pakiza Software Limited",
    region: "PSL-Operation",
    section: "Human Resources",
    component: "Corporate",
    line: "N/A",
  },
  {
    sl: 3,
    empType: "Office Executive",
    department: "Software Development",
    designation: "Sr. Executive",
    gender: "Female",
    unit: "Unit-02",
    grade: "Grade 2",
    status: "Working",
    count: 25,
    organization: "Pakiza Software Limited",
    region: "PSL-Operation",
    section: "ICT",
    component: "Corporate",
    line: "N/A",
  },
  {
    sl: 4,
    empType: "Production Staff",
    department: "Cutting",
    designation: "Operator",
    gender: "Male",
    unit: "Unit-01",
    grade: "Grade 3",
    status: "Working",
    count: 120,
    organization: "Pakiza Knit Composite Ltd",
    region: "PKCL-Savar",
    section: "Cutting",
    component: "Textile",
    line: "02",
  },
  {
    sl: 5,
    empType: "Production Staff",
    department: "Sewing",
    designation: "Worker",
    gender: "Female",
    unit: "Unit-02",
    grade: "Grade 3",
    status: "Working",
    count: 340,
    organization: "Pakiza Knit Composite Ltd",
    region: "PKCL-Savar",
    section: "Sewing",
    component: "RMG",
    line: "05",
  },
  {
    sl: 6,
    empType: "Management",
    department: "Human Resources",
    designation: "Assistant Manager",
    gender: "Female",
    unit: "Unit-03",
    grade: "Grade 1",
    status: "Working",
    count: 8,
    organization: "Pakiza Software Limited",
    region: "PSL-Operation",
    section: "Human Resources",
    component: "Operation",
    line: "N/A",
  },
  {
    sl: 7,
    empType: "Production Executive",
    department: "Dyeing",
    designation: "Officer",
    gender: "Male",
    unit: "Unit-04",
    grade: "Grade 2",
    status: "Working",
    count: 31,
    organization: "Pakiza Knit Composite Ltd",
    region: "PKCL-Savar",
    section: "Dyeing",
    component: "Textile",
    line: "03",
  },
  {
    sl: 8,
    empType: "Pcs Rate Worker",
    department: "Finishing",
    designation: "Worker",
    gender: "Female",
    unit: "Unit-05",
    grade: "None",
    status: "Working",
    count: 95,
    organization: "Pakiza Knit Composite Ltd",
    region: "PKCL-Savar",
    section: "Finishing",
    component: "RMG",
    line: "10",
  },
];

const ORGANIZATIONS = ["Pakiza Knit Composite Ltd", "Pakiza Software Limited", "ALL"];
const REGIONS = ["PKCL-Savar", "PSL-Operation", "ALL"];
const EMPLOYEE_TYPES = [
  "ALL",
  "Office Executive",
  "Production Staff",
  "Management",
  "Worker",
  "Pcs Rate Worker",
  "Production Executive",
];
const SECTIONS = [
  "ALL",
  "Accounts",
  "Cutting",
  "Dyeing",
  "Finishing",
  "Human Resources",
  "ICT",
  "Knitting",
  "Merchandising",
  "Sewing",
  "Supply Chain",
];
const DESIGNATIONS = [
  "ALL",
  "Executive",
  "Jr. Executive",
  "Sr. Executive",
  "Officer",
  "Assistant Manager",
  "Operator",
  "Worker",
];
const GENDERS = ["ALL", "Male", "Female"];
const GRADES = ["ALL", "None", "Grade 1", "Grade 2", "Grade 3"];
const COMPONENTS = ["ALL", "RMG", "Textile", "Corporate", "Operation"];
const UNITS = ["ALL", "N/A", "Unit-01", "Unit-02", "Unit-03", "Unit-04", "Unit-05"];
const LINES = ["ALL", "0", "01", "02", "03", "04", "05", "10", "15", "20", "N/A"];
const STATUSES = ["Working", "Resigned", "Removed", "Dismissed", "ALL"];

export function EmployeeCountReportPage() {
  // Filter States
  const [organization, setOrganization] = useState("Pakiza Knit Composite Ltd");
  const [region, setRegion] = useState("PKCL-Savar");
  const [empType, setEmpType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [gender, setGender] = useState("ALL");
  const [grade, setGrade] = useState("ALL");
  const [component, setComponent] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [status, setStatus] = useState("Working");
  const [tableSearch, setTableSearch] = useState("");

  // Modal State
  const [selectedRecord, setSelectedRecord] = useState<EmployeeCountRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const pdfColumns: ColumnDef<EmployeeCountRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "40px" },
    { header: "Employee Type", accessor: (r) => r.empType },
    { header: "Department", accessor: (r) => r.department },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Gender", accessor: (r) => r.gender, align: "center" },
    { header: "Unit", accessor: (r) => r.unit, align: "center" },
    { header: "Line", accessor: (r) => r.line, align: "center" },
    { header: "Grade", accessor: (r) => r.grade, align: "center" },
    { header: "Status", accessor: (r) => r.status, align: "center" },
    { header: "Count", accessor: (r) => r.count, align: "center" },
  ];

  // Applied Filter Trigger
  const [appliedFilters, setAppliedFilters] = useState({
    organization: "Pakiza Knit Composite Ltd",
    region: "PKCL-Savar",
    empType: "ALL",
    section: "ALL",
    designation: "ALL",
    gender: "ALL",
    grade: "ALL",
    component: "ALL",
    unit: "ALL",
    line: "ALL",
    status: "Working",
  });

  const handleSearch = () => {
    setAppliedFilters({
      organization,
      region,
      empType,
      section,
      designation,
      gender,
      grade,
      component,
      unit,
      line,
      status,
    });
    toast.success("Filtering Employee Count report...");
  };

  const handleReset = () => {
    setOrganization("Pakiza Knit Composite Ltd");
    setRegion("PKCL-Savar");
    setEmpType("ALL");
    setSection("ALL");
    setDesignation("ALL");
    setGender("ALL");
    setGrade("ALL");
    setComponent("ALL");
    setUnit("ALL");
    setLine("ALL");
    setStatus("Working");
    setTableSearch("");
    setAppliedFilters({
      organization: "Pakiza Knit Composite Ltd",
      region: "PKCL-Savar",
      empType: "ALL",
      section: "ALL",
      designation: "ALL",
      gender: "ALL",
      grade: "ALL",
      component: "ALL",
      unit: "ALL",
      line: "ALL",
      status: "Working",
    });
    toast.info("Filter criteria reset to default.");
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return INITIAL_DATA.filter((item) => {
      if (appliedFilters.organization !== "ALL" && item.organization !== appliedFilters.organization)
        return false;
      if (appliedFilters.region !== "ALL" && item.region !== appliedFilters.region) return false;
      if (appliedFilters.empType !== "ALL" && item.empType !== appliedFilters.empType) return false;
      if (appliedFilters.section !== "ALL" && item.section !== appliedFilters.section) return false;
      if (appliedFilters.designation !== "ALL" && item.designation !== appliedFilters.designation)
        return false;
      if (appliedFilters.gender !== "ALL" && item.gender !== appliedFilters.gender) return false;
      if (appliedFilters.grade !== "ALL" && item.grade !== appliedFilters.grade) return false;
      if (appliedFilters.component !== "ALL" && item.component !== appliedFilters.component)
        return false;
      if (appliedFilters.unit !== "ALL" && item.unit !== appliedFilters.unit) return false;
      if (appliedFilters.line !== "ALL" && item.line !== appliedFilters.line) return false;
      if (appliedFilters.status !== "ALL" && item.status !== appliedFilters.status) return false;

      if (tableSearch.trim()) {
        const query = tableSearch.toLowerCase();
        const matchDept = item.department.toLowerCase().includes(query);
        const matchDesig = item.designation.toLowerCase().includes(query);
        const matchType = item.empType.toLowerCase().includes(query);
        const matchUnit = item.unit.toLowerCase().includes(query);
        if (!matchDept && !matchDesig && !matchType && !matchUnit) return false;
      }

      return true;
    });
  }, [appliedFilters, tableSearch]);

  const totalHeadcount = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.count, 0);
  }, [filteredData]);

  const handleExportExcel = () => {
    const headers = ["SL", "Emp Type", "Department", "Designation", "Gender", "Unit", "Grade", "Status", "Count"];

    const rows = filteredData.map((r, i) => [
      (i + 1).toString(),
      r.empType,
      r.department,
      r.designation,
      r.gender,
      r.unit,
      r.grade,
      r.status,
      r.count.toString(),
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
    link.setAttribute("download", `Employee_Count_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Employee Count exported to Excel!");
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
              Employee Count
            </span>
          </div>

          {/* Page Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <Users className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Employee Count Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  View and analyze employee headcount breakdown across organization units, departments, and grades.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-xs">
              {/* 1. Organization */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Organization
                </label>
                <select
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {ORGANIZATIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Region */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Employee Type */}
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

              {/* 5. Designation */}
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
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Gender */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* 7. Grade */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {GRADES.map((gr) => (
                    <option key={gr} value={gr}>
                      {gr}
                    </option>
                  ))}
                </select>
              </div>

              {/* 8. Component */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Component
                </label>
                <select
                  value={component}
                  onChange={(e) => setComponent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {COMPONENTS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
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
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
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
                  {LINES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* 11. Status */}
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
              {/* Export Buttons */}
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
                    placeholder="Search in count..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3 w-12 text-center">SL</th>
                    <th className="p-3">Emp Type</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Unit</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredData.length > 0 ? (
                    filteredData.map((row, idx) => (
                      <tr
                        key={row.sl}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                          {row.empType}
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          {row.department}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {row.designation}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{row.gender}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{row.unit}</td>
                        <td className="p-3 text-slate-500">{row.grade}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                            {row.status}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">
                          {row.count}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400 dark:text-slate-500">
                        No employee count records found matching filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
                {filteredData.length > 0 && (
                  <tfoot>
                    <tr className="bg-slate-100/90 dark:bg-slate-800 font-black border-t-2 border-slate-300 dark:border-slate-700">
                      <td colSpan={8} className="p-3 text-right text-slate-800 dark:text-slate-100">
                        TOTAL HEADCOUNT:
                      </td>
                      <td className="p-3 text-right font-mono text-base text-indigo-700 dark:text-indigo-300">
                        {totalHeadcount}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination & Bottom Action Bar */}
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
                HEADCOUNT DISTRIBUTION REPORT
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                {appliedFilters.organization}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedRecord.department}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40">
                  <span className="block text-[10px] uppercase font-bold text-blue-600">
                    Employee Type
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedRecord.empType}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40">
                  <span className="block text-[10px] uppercase font-bold text-indigo-600">
                    Total Headcount
                  </span>
                  <span className="text-lg font-black text-indigo-700 dark:text-indigo-300">
                    {selectedRecord.count}
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
        reportTitle="Employee Count & Headcount Distribution Report"
        companyName={appliedFilters.organization || "Pakiza Knit Composite Ltd"}
        dateRange={`Region: ${appliedFilters.region}`}
        columns={pdfColumns}
        data={filteredData}
      />
    </div>
  );
}
