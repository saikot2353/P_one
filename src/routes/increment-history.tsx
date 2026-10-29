import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { rawIncrementRecords, RawIncrementRecord } from "./-increment-history-data";
import {
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  Sparkles,
  X,
  Eye,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Check,
  LayoutGrid,
  EyeOff,
  FileText,
  FileClock,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/increment-history")({
  head: () => ({
    meta: [
      { title: "Salary Increment History — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Professional query-based historical database of salary increments featuring advanced column configurator toggles and sticky fixed left datagrid.",
      },
    ],
  }),
  component: IncrementHistoryPage,
});

// Dynamic default columns visibility configuration
const defaultColumns = {
  department: true,
  section: true,
  designation: true,
  joiningDate: true,
  salaryJoining: true,
  salaryBasic: true,
  salaryGross: true,
  inc2014: true,
  inc2015: true,
  inc2016: true,
  inc2017: true,
  inc2018: true,
  inc2019: true,
  inc2020: true,
  inc2021: true,
  inc2022: true,
  inc2023: true,
  inc2024: true,
  inc2025: true,
  total: true,
  lastIncDate: true,
  lastIncAmount: true,
  lastPromotion: true,
};

function IncrementHistoryPage() {
  // Filter States (Matching Unified HR Reports Criteria Style)
  const [company, setCompany] = useState("Pakiza Software Limited");
  const [area, setArea] = useState("PSL-Operation");
  const [empType, setEmpType] = useState("ALL");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("Working");
  const [filterYear, setFilterYear] = useState("ALL");

  // Applied Filter Trigger State
  const [appliedFilters, setAppliedFilters] = useState({
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    empType: "ALL",
    department: "All Departments",
    section: "ALL",
    designation: "ALL",
    employeeId: "",
    status: "Working",
    filterYear: "ALL",
  });

  // Table Search, Selection, and Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<RawIncrementRecord | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Column toggle states
  const [visibleCols, setVisibleCols] = useState(defaultColumns);
  const [isColSelectorOpen, setIsColSelectorOpen] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof RawIncrementRecord | "">("");
  const [sortAsc, setSortAsc] = useState(true);

  // Dynamic values extracted from dataset to populate filters
  const departmentsList = useMemo(() => {
    const depts = new Set(rawIncrementRecords.map((r) => r.department).filter(Boolean));
    return Array.from(depts).sort();
  }, []);

  const sectionsList = useMemo(() => {
    const filteredDepts =
      department === "All Departments"
        ? rawIncrementRecords
        : rawIncrementRecords.filter((r) => r.department === department);
    const sections = new Set(filteredDepts.map((r) => r.section).filter(Boolean));
    return Array.from(sections).sort();
  }, [department]);

  const designationsList = useMemo(() => {
    const des = new Set(rawIncrementRecords.map((r) => r.designation).filter(Boolean));
    return Array.from(des).sort();
  }, []);

  // Filter Trigger
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedFilters({
      company,
      area,
      empType,
      department,
      section,
      designation,
      employeeId,
      status,
      filterYear,
    });
    toast.success("Filtering Increment History report...");
  };

  // Reset all filters easily
  const resetFilters = () => {
    setCompany("Pakiza Software Limited");
    setArea("PSL-Operation");
    setEmpType("ALL");
    setDepartment("All Departments");
    setSection("ALL");
    setDesignation("ALL");
    setEmployeeId("");
    setStatus("Working");
    setFilterYear("ALL");
    setSearchQuery("");
    setAppliedFilters({
      company: "Pakiza Software Limited",
      area: "PSL-Operation",
      empType: "ALL",
      department: "All Departments",
      section: "ALL",
      designation: "ALL",
      employeeId: "",
      status: "Working",
      filterYear: "ALL",
    });
    toast.info("Filter criteria reset to default.");
  };

  // Sorting Handler
  const handleSort = (field: keyof RawIncrementRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };


  const toggleColumn = (key: keyof typeof defaultColumns) => {
    setVisibleCols((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Close column selector when clicking outside
  useEffect(() => {
    if (!isColSelectorOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".col-selector-container")) {
        setIsColSelectorOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isColSelectorOpen]);

  // Filter & Search computation
  const filteredRecords = useMemo(() => {
    let list = [...rawIncrementRecords];

    // 1. Department Filter
    if (appliedFilters.department !== "All Departments") {
      list = list.filter((r) => r.department === appliedFilters.department);
    }

    // 2. Section Filter
    if (appliedFilters.section !== "ALL") {
      list = list.filter((r) => r.section === appliedFilters.section);
    }

    // 3. Designation Filter
    if (appliedFilters.designation !== "ALL") {
      list = list.filter((r) => r.designation === appliedFilters.designation);
    }

    // 4. Employee ID Filter
    if (appliedFilters.employeeId.trim()) {
      const idQ = appliedFilters.employeeId.trim().toLowerCase();
      list = list.filter((r) => r.empId.toLowerCase().includes(idQ));
    }

    // 5. Year Filter (Check if employee received increment in selected year)
    if (appliedFilters.filterYear !== "ALL") {
      const colKey = `inc${appliedFilters.filterYear}` as keyof RawIncrementRecord;
      list = list.filter((r) => {
        const val = r[colKey] as string;
        return val && val !== "0" && val !== "0.00" && val !== "0(0)";
      });
    }

    // 6. Text Search (Matches ID, Name, Designation, Section, Department)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.empId.toLowerCase().includes(q) ||
          r.empName.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.section.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q),
      );
    }

    // 7. Apply Sorting
    if (sortField) {
      list.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (typeof valA === "number" && typeof valB === "number") {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return list;
  }, [appliedFilters, searchQuery, sortField, sortAsc]);


  // Helper cell renderers
  const renderIncrementCell = (val: string) => {
    if (!val || val === "0" || val === "0.00") {
      return (
        <span className="text-slate-400 dark:text-slate-600 font-mono text-[10.5px]">
          —
        </span>
      );
    }

    // Check for Promotion indicator "(P)"
    const pMatch = val.match(/^(\d+)\(P\)$/);
    if (pMatch) {
      const amount = parseInt(pMatch[1]).toLocaleString();
      return (
        <div className="flex items-center justify-center gap-0.5">
          <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-[10.5px]">
            {amount}
          </span>
          <span
            className="text-[7.5px] px-1 bg-amber-500/15 text-amber-600 border border-amber-500/20 rounded font-black select-none cursor-default"
            title="Promotion Granted"
          >
            P
          </span>
        </div>
      );
    }

    const numVal = parseInt(val);
    if (!isNaN(numVal)) {
      return (
        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-[10.5px]">
          {numVal.toLocaleString()}
        </span>
      );
    }

    return <span className="font-mono font-semibold text-[10.5px]">{val}</span>;
  };

  const renderTotalCell = (val: string) => {
    if (!val || val === "0(0)") {
      return (
        <span className="text-slate-400 dark:text-slate-600 font-mono text-[10.5px]">
          0
        </span>
      );
    }

    // Match structure e.g. "37000(1)" or "6000(0)"
    const match = val.match(/^(\d+)\((\d+)\)$/);
    if (match) {
      const amount = parseInt(match[1]).toLocaleString();
      const count = parseInt(match[2]);
      return (
        <div className="flex items-center justify-center gap-1">
          <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-[10.5px]">
            {amount}
          </span>
          {count > 0 && (
            <span
              className="text-[7.5px] px-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded font-black select-none"
              title={`${count} Promotion(s)`}
            >
              {count}
            </span>
          )}
        </div>
      );
    }
    return <span className="font-mono font-bold text-[10.5px]">{val}</span>;
  };

  // CSV Export
  const handleExportExcel = () => {
    const headers = [
      "SL",
      "Emp ID",
      "Name",
      "Department",
      "Section",
      "Designation",
      "Joining Date",
      "Salary(Joining)",
      "Salary(Basic)",
      "Salary(Gross)",
      "Inc 2014",
      "Inc 2015",
      "Inc 2016",
      "Inc 2017",
      "Inc 2018",
      "Inc 2019",
      "Inc 2020",
      "Inc 2021",
      "Inc 2022",
      "Inc 2023",
      "Inc 2024",
      "Inc 2025",
      "Total",
      "Last Inc Date",
      "Last Inc Amount",
      "Last Promotion",
    ];

    const rows = filteredRecords.map((r, i) => [
      (i + 1).toString(),
      r.empId,
      r.empName,
      r.department,
      r.section,
      r.designation,
      r.joiningDate,
      r.salaryJoining.toString(),
      r.salaryBasic.toString(),
      r.salaryGross.toString(),
      r.inc2014,
      r.inc2015,
      r.inc2016,
      r.inc2017,
      r.inc2018,
      r.inc2019,
      r.inc2020,
      r.inc2021,
      r.inc2022,
      r.inc2023,
      r.inc2024,
      r.inc2025,
      r.total,
      r.lastIncDate || "",
      r.lastIncAmount || "",
      r.lastPromotion || "",
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
    link.setAttribute("download", `Increment_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel report exported successfully!");
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-[1700px] mx-auto w-full print:p-0">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium print:hidden">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <Link to="/hr-reports" className="hover:text-primary transition-colors">
              HR Reports
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Increment History
            </span>
          </div>

          {/* Page Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <FileClock className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Salary Increment History Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Year-wise historical database of salary increments and promotion records for all personnel.
                </p>
              </div>
            </div>


          </div>

          {/* COMPREHENSIVE SEARCH & FILTER PANEL (MATCHING INCREMENT-QUEUELIST STYLE) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="size-4" />
              <span>Search & Filter Criteria</span>
            </div>

            {/* Filter Form Grid */}
            <form onSubmit={handleSearchSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-xs">
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
                    <option value="Pakiza Software Limited">Pakiza Software Limited</option>
                    <option value="Pakiza Knit Composite Ltd">Pakiza Knit Composite Ltd</option>
                    <option value="ALL">ALL Companies</option>
                  </select>
                </div>

                {/* 2. Area */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Area
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="PSL-Operation">PSL-Operation</option>
                    <option value="PSL-HeadOffice">PSL-HeadOffice</option>
                    <option value="ALL">ALL Areas</option>
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
                    <option value="ALL">ALL Types</option>
                    <option value="Staff">Staff</option>
                    <option value="Worker">Worker</option>
                    <option value="Office Executive">Office Executive</option>
                  </select>
                </div>

                {/* 4. Department */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      setSection("ALL");
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="All Departments">All Departments</option>
                    {departmentsList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Section */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL Sections</option>
                    {sectionsList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Designation */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Designation
                  </label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL Designations</option>
                    {designationsList.map((des) => (
                      <option key={des} value={des}>
                        {des}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 7. Employee ID */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    placeholder="Search by ID..."
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* 8. Status */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL Statuses</option>
                    <option value="Working">Working</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>

                {/* 9. Increment Year Filter */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Increment Year
                  </label>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL Years (2014-2025)</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                </div>
              </div>

              {/* Search Trigger Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
                >
                  <Search className="size-4" />
                  <span>SEARCH REPORT</span>
                </button>
              </div>
            </form>
          </div>


          {/* ACTION TOOLBAR & RESULTS TABLE CARD (EXACT INCREMENT-QUEUELIST STYLE) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Toolbar Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              {/* Quick Export & Column Tools */}
              <div className="flex items-center gap-2 flex-wrap">
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
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <FileText className="size-4" />
                  <span>PDF</span>
                </button>

                {/* Column Configuration Selector */}
                <div className="relative col-selector-container">
                  <button
                    onClick={() => setIsColSelectorOpen(!isColSelectorOpen)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <LayoutGrid className="size-4" />
                    <span>COLUMNS</span>
                    <ChevronDown className="size-3 text-indigo-500" />
                  </button>

                  {isColSelectorOpen && (
                    <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-900 dark:text-slate-100">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          Configure Columns
                        </span>
                        <button
                          onClick={() => setVisibleCols(defaultColumns)}
                          className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                      <div className="space-y-1 max-h-64 overflow-y-auto pr-1 text-xs">
                        {Object.keys(defaultColumns).map((colKey) => (
                          <button
                            key={colKey}
                            onClick={() => toggleColumn(colKey as keyof typeof defaultColumns)}
                            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          >
                            <div
                              className={`size-4 rounded border flex items-center justify-center transition-all ${
                                visibleCols[colKey as keyof typeof defaultColumns]
                                  ? "bg-indigo-600 border-indigo-600 text-white"
                                  : "border-slate-300 dark:border-slate-700"
                              }`}
                            >
                              {visibleCols[colKey as keyof typeof defaultColumns] && (
                                <Check className="size-2.5 stroke-[3.5]" />
                              )}
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-300 capitalize text-xs">
                              {colKey
                                .replace(/([A-Z])/g, " $1")
                                .toLowerCase()
                                .replace(/inc (\d+)/g, "Increment ($1)")}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Instant Search Box */}
              <div className="flex items-center gap-2 w-full sm:w-72">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Search:
                </span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in table..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* HIGH-FIDELITY DATAGRID TABLE WITH STICKY FIXED LEFT COLUMNS */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full border-collapse text-left text-[11px] whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    {/* Sticky SL Column */}
                    <th
                      onClick={() => handleSort("sl")}
                      className="sticky left-0 bg-slate-100 dark:bg-slate-800 px-2 py-3 font-bold border-r border-slate-200 dark:border-slate-700 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] w-[50px] min-w-[50px] max-w-[50px] text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>SL</span>
                        {sortField === "sl" && <ArrowUpDown className="size-3 text-indigo-500" />}
                      </div>
                    </th>

                    {/* Fixed Sticky Header for ID and Name */}
                    <th
                      onClick={() => handleSort("empId")}
                      className="sticky left-[50px] bg-slate-100 dark:bg-slate-800 px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-700 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] w-[110px] min-w-[110px] max-w-[110px] cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Emp ID</span>
                        {sortField === "empId" && <ArrowUpDown className="size-3 text-indigo-500" />}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("empName")}
                      className="sticky left-[160px] bg-slate-100 dark:bg-slate-800 px-3 py-3 font-bold border-r border-slate-200 dark:border-slate-700 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] w-[180px] min-w-[180px] max-w-[180px] cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-1">
                        <span>Name</span>
                        {sortField === "empName" && <ArrowUpDown className="size-3 text-indigo-500" />}
                      </div>
                    </th>

                    {/* Standard Configurable headers */}
                    {visibleCols.department && (
                      <th
                        onClick={() => handleSort("department")}
                        className="px-3.5 py-3 font-bold cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                      >
                        Department
                      </th>
                    )}
                    {visibleCols.section && (
                      <th
                        onClick={() => handleSort("section")}
                        className="px-3.5 py-3 font-bold cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                      >
                        Section
                      </th>
                    )}
                    {visibleCols.designation && (
                      <th
                        onClick={() => handleSort("designation")}
                        className="px-3.5 py-3 font-bold cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                      >
                        Designation
                      </th>
                    )}
                    {visibleCols.joiningDate && (
                      <th
                        onClick={() => handleSort("joiningDate")}
                        className="px-3.5 py-3 font-bold text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                      >
                        Joining Date
                      </th>
                    )}
                    {visibleCols.salaryJoining && (
                      <th
                        onClick={() => handleSort("salaryJoining")}
                        className="px-3.5 py-3 font-bold text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                      >
                        Salary (Joining)
                      </th>
                    )}
                    {visibleCols.salaryBasic && (
                      <th
                        onClick={() => handleSort("salaryBasic")}
                        className="px-3.5 py-3 font-bold text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                      >
                        Salary (Basic)
                      </th>
                    )}
                    {visibleCols.salaryGross && (
                      <th
                        onClick={() => handleSort("salaryGross")}
                        className="px-3.5 py-3 font-bold text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                      >
                        Salary (Gross)
                      </th>
                    )}

                    {/* Configurable Years */}
                    {[
                      "2014",
                      "2015",
                      "2016",
                      "2017",
                      "2018",
                      "2019",
                      "2020",
                      "2021",
                      "2022",
                      "2023",
                      "2024",
                      "2025",
                    ].map((yr) => {
                      const colKey = `inc${yr}` as keyof typeof defaultColumns;
                      return (
                        visibleCols[colKey] && (
                          <th
                            key={yr}
                            className="px-3 py-3 font-bold text-center"
                          >
                            Inc({yr})
                          </th>
                        )
                      );
                    })}

                    {visibleCols.total && (
                      <th
                        onClick={() => handleSort("total")}
                        className="px-3.5 py-3 font-bold text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                      >
                        Total
                      </th>
                    )}
                    {visibleCols.lastIncDate && (
                      <th className="px-3.5 py-3 font-bold text-center">
                        Last Inc Date
                      </th>
                    )}
                    {visibleCols.lastIncAmount && (
                      <th className="px-3.5 py-3 font-bold text-right">
                        Last Inc Amount
                      </th>
                    )}
                    {visibleCols.lastPromotion && (
                      <th className="px-3.5 py-3 font-bold text-center">
                        Last Promotion
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((row, idx) => {
                      const isSelected = selectedRecord?.empId === row.empId;
                      const stickyCellBgClass = isSelected
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60";

                      return (
                        <tr
                          key={row.sl}
                          onClick={() => setSelectedRecord(row)}
                          className={`group transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-slate-100 dark:bg-slate-800"
                              : "hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          {/* Sticky Left SL Cell */}
                          <td
                            className={`sticky left-0 ${stickyCellBgClass} px-2 py-2.5 font-bold text-center text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] w-[50px] min-w-[50px] max-w-[50px] transition-colors`}
                          >
                            {idx + 1}
                          </td>

                          {/* Sticky Left Emp ID and Name Cell */}
                          <td
                            className={`sticky left-[50px] ${stickyCellBgClass} px-3 py-2.5 font-bold font-mono text-indigo-600 dark:text-indigo-400 border-r border-slate-200 dark:border-slate-800 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] w-[110px] min-w-[110px] max-w-[110px] transition-colors`}
                          >
                            {row.empId}
                          </td>
                          <td
                            className={`sticky left-[160px] ${stickyCellBgClass} px-3 py-2.5 font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] w-[180px] min-w-[180px] max-w-[180px] transition-colors`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="size-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
                                {row.empName
                                  .split(" ")
                                  .map((s) => s[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              <span className="truncate max-w-[125px]">{row.empName}</span>
                            </div>
                          </td>

                          {/* Configurable Cells */}
                          {visibleCols.department && (
                            <td className="px-3.5 py-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                              {row.department}
                            </td>
                          )}
                          {visibleCols.section && (
                            <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300">
                              {row.section}
                            </td>
                          )}
                          {visibleCols.designation && (
                            <td className="px-3.5 py-2.5 font-bold text-slate-800 dark:text-slate-200">
                              {row.designation}
                            </td>
                          )}
                          {visibleCols.joiningDate && (
                            <td className="px-3.5 py-2.5 text-center font-bold text-slate-900 dark:text-white">
                              {row.joiningDate}
                            </td>
                          )}
                          {visibleCols.salaryJoining && (
                            <td className="px-3.5 py-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                              ৳
                              {row.salaryJoining.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                          )}
                          {visibleCols.salaryBasic && (
                            <td className="px-3.5 py-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                              ৳
                              {row.salaryBasic.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                          )}
                          {visibleCols.salaryGross && (
                            <td className="px-3.5 py-2.5 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                              ৳
                              {row.salaryGross.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                          )}

                          {/* Years values */}
                          {[
                            "2014",
                            "2015",
                            "2016",
                            "2017",
                            "2018",
                            "2019",
                            "2020",
                            "2021",
                            "2022",
                            "2023",
                            "2024",
                            "2025",
                          ].map((yr) => {
                            const colKey = `inc${yr}` as keyof typeof defaultColumns;
                            const rowVal = row[colKey as keyof RawIncrementRecord] as string;
                            return (
                              visibleCols[colKey] && (
                                <td key={yr} className="px-3 py-2.5 text-center">
                                  {renderIncrementCell(rowVal)}
                                </td>
                              )
                            );
                          })}

                          {visibleCols.total && (
                            <td className="px-3.5 py-2.5 text-center">
                              {renderTotalCell(row.total)}
                            </td>
                          )}
                          {visibleCols.lastIncDate && (
                            <td className="px-3.5 py-2.5 text-center text-slate-600 dark:text-slate-300">
                              {row.lastIncDate || "—"}
                            </td>
                          )}
                          {visibleCols.lastIncAmount && (
                            <td className="px-3.5 py-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {row.lastIncAmount
                                ? `৳${parseFloat(row.lastIncAmount).toLocaleString()}`
                                : "—"}
                            </td>
                          )}
                          {visibleCols.lastPromotion && (
                            <td className="px-3.5 py-2.5 text-center text-slate-600 dark:text-slate-300">
                              {row.lastPromotion || "—"}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={30}
                        className="px-5 py-14 text-center text-slate-400 dark:text-slate-500"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <EyeOff className="size-8 text-slate-300 dark:text-slate-600" />
                          <span className="font-semibold text-xs">
                            No employees match the specified increment history criteria.
                          </span>
                          <button
                            onClick={resetFilters}
                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1 cursor-pointer"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Bottom Action Bar (Matching Increment-Queuelist style) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing 1 to {filteredRecords.length} of {rawIncrementRecords.length} entries
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>VIEW (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Record details Audit Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-5">
              <Sparkles className="size-5 text-indigo-600 dark:text-indigo-400" />
              <span>Compensation History Breakdown</span>
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              {/* Profile card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-indigo-600 text-white grid place-items-center text-xs font-black shadow-sm">
                  {selectedRecord.empName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 3)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {selectedRecord.empName}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 font-bold">
                    <span className="font-mono">{selectedRecord.empId}</span>
                    <span>•</span>
                    <span>{selectedRecord.designation}</span>
                  </div>
                </div>
              </div>

              {/* Salary bands details */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                  <div className="text-[8.5px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                    JOINING
                  </div>
                  <div className="text-xs font-mono font-bold mt-1 text-slate-800 dark:text-slate-200">
                    ৳{selectedRecord.salaryJoining.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                  <div className="text-[8.5px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                    BASIC
                  </div>
                  <div className="text-xs font-mono font-bold mt-1 text-slate-800 dark:text-slate-200">
                    ৳{selectedRecord.salaryBasic.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40">
                  <div className="text-[8.5px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
                    GROSS
                  </div>
                  <div className="text-xs font-mono font-black mt-1 text-indigo-600 dark:text-indigo-400">
                    ৳{selectedRecord.salaryGross.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Detailed specs */}
              <div className="border-t border-b border-slate-100 dark:border-slate-800 py-4 space-y-2.5 font-bold text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span className="text-slate-400">Department</span>
                  <span className="text-slate-900 dark:text-white">{selectedRecord.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Section Group</span>
                  <span className="text-slate-900 dark:text-white">{selectedRecord.section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Joining Date</span>
                  <span className="font-mono text-slate-900 dark:text-white">{selectedRecord.joiningDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Increment Accrued</span>
                  <span className="text-slate-900 dark:text-white">{renderTotalCell(selectedRecord.total)}</span>
                </div>
                {selectedRecord.lastIncDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Increment Date</span>
                    <span className="font-mono text-slate-900 dark:text-white">{selectedRecord.lastIncDate}</span>
                  </div>
                )}
                {selectedRecord.lastIncAmount && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Increment Amount</span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      ৳{parseFloat(selectedRecord.lastIncAmount).toLocaleString()}
                    </span>
                  </div>
                )}
                {selectedRecord.lastPromotion && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Promotion Date</span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      {selectedRecord.lastPromotion}
                    </span>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Close Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF View Printable Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileDown className="size-5.5 text-rose-500" />
                <span>PDF Print Preview — Salary Increment History</span>
              </h3>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">
                Pakiza Software Limited • PSL-Operation Ledger
              </p>
            </div>

            {/* Scrollable Document Body */}
            <div
              id="pdf-print-area"
              className="flex-1 overflow-y-auto p-4 border border-slate-200 bg-white text-slate-900 rounded-xl space-y-6"
            >
              {/* Document Header */}
              <div className="text-center space-y-1.5 border-b border-slate-200 pb-4">
                <h2 className="text-lg font-black tracking-tight text-slate-900">
                  PAKIZA SOFTWARE LIMITED
                </h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  SALARY INCREMENT HISTORY REGISTER
                </p>
                <div className="text-[9px] text-slate-400 font-bold flex justify-center gap-4 pt-1">
                  <span>AREA: PSL-OPERATION</span>
                  <span>•</span>
                  <span>ACTIVE CYCLE: 2026</span>
                  <span>•</span>
                  <span>TOTAL ENTRIES: {filteredRecords.length}</span>
                </div>
              </div>

              {/* Compressed Table Grid */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-[9px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold whitespace-nowrap">
                      <th className="border border-slate-300 p-1 text-center">SL</th>
                      <th className="border border-slate-300 p-1">Emp ID</th>
                      <th className="border border-slate-300 p-1">Name</th>
                      <th className="border border-slate-300 p-1">Section</th>
                      <th className="border border-slate-300 p-1">Designation</th>
                      <th className="border border-slate-300 p-1 text-right">Joining</th>
                      <th className="border border-slate-300 p-1 text-right">Gross</th>
                      <th className="border border-slate-300 p-1 text-center">Inc(2023)</th>
                      <th className="border border-slate-300 p-1 text-center">Inc(2024)</th>
                      <th className="border border-slate-300 p-1 text-center">Inc(2025)</th>
                      <th className="border border-slate-300 p-1 text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((row, idx) => (
                      <tr key={row.sl} className="whitespace-nowrap hover:bg-slate-50">
                        <td className="border border-slate-300 p-1 text-center text-slate-400 font-bold">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-300 p-1 font-mono font-bold">
                          {row.empId}
                        </td>
                        <td className="border border-slate-300 p-1 font-extrabold text-slate-900">
                          {row.empName}
                        </td>
                        <td className="border border-slate-300 p-1 text-slate-600">
                          {row.section}
                        </td>
                        <td className="border border-slate-300 p-1 font-bold text-slate-700">
                          {row.designation}
                        </td>
                        <td className="border border-slate-300 p-1 text-right font-mono text-slate-600">
                          {row.salaryJoining.toLocaleString()}
                        </td>
                        <td className="border border-slate-300 p-1 text-right font-mono font-extrabold text-slate-900">
                          {row.salaryGross.toLocaleString()}
                        </td>
                        <td className="border border-slate-300 p-1 text-center font-mono">
                          {row.inc2023 !== "0" ? row.inc2023 : "—"}
                        </td>
                        <td className="border border-slate-300 p-1 text-center font-mono">
                          {row.inc2024 !== "0" ? row.inc2024 : "—"}
                        </td>
                        <td className="border border-slate-300 p-1 text-center font-mono">
                          {row.inc2025 !== "0" ? row.inc2025 : "—"}
                        </td>
                        <td className="border border-slate-300 p-1 text-center font-mono font-black text-slate-900">
                          {row.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Document Sign-offs */}
              <div className="grid grid-cols-3 gap-8 pt-10 text-[9px] font-bold text-slate-500 text-center">
                <div className="space-y-1">
                  <div className="w-32 border-t border-slate-300 mx-auto pt-1">
                    Prepared By (HR)
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-32 border-t border-slate-300 mx-auto pt-1">
                    Verified By (Admin)
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-32 border-t border-slate-300 mx-auto pt-1">
                    Approved By (MD)
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-extrabold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="size-4" />
                <span>Print PDF Register</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
