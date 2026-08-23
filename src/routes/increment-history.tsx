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
  Plus,
  Info,
  Sparkles,
  X,
  Eye,
  ArrowUpDown,
  Filter,
  ChevronDown,
  ChevronRight,
  Check,
  LayoutGrid,
  SlidersHorizontal,
  EyeOff,
  FileText,
  FileClock,
  TrendingUp,
  DollarSign,
  UserCog,
} from "lucide-react";

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

// Dynamic default columns visibility configuration (matching personnel list)
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
  // Filter States (Top Row Filters)
  const [company, setCompany] = useState("Pakiza Software Limited");
  const [area, setArea] = useState("PSL-Operation");
  const [empType, setEmpType] = useState("ALL");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");

  // Filter Trigger (for the Search button)
  const [appliedFilters, setAppliedFilters] = useState({
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    empType: "ALL",
    department: "All Departments",
    section: "ALL",
  });

  // Table Search, Selection, and Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<RawIncrementRecord | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  // Column toggle states
  const [visibleCols, setVisibleCols] = useState(defaultColumns);
  const [isColSelectorOpen, setIsColSelectorOpen] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof RawIncrementRecord | "">("");
  const [sortAsc, setSortAsc] = useState(true);
  const [activeReportsTab, setActiveReportsTab] = useState<"history" | "summary" | "reports">(
    "history",
  );

  // Trigger search locking
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      company,
      area,
      empType,
      department,
      section,
    });
  };

  // Dynamic values extracted from dataset to populate filters beautifully
  const departmentsList = useMemo(() => {
    const depts = new Set(rawIncrementRecords.map((r) => r.department));
    return Array.from(depts).sort();
  }, []);

  const sectionsList = useMemo(() => {
    const filteredDepts =
      department === "All Departments"
        ? rawIncrementRecords
        : rawIncrementRecords.filter((r) => r.department === department);
    const sections = new Set(filteredDepts.map((r) => r.section));
    return Array.from(sections).sort();
  }, [department]);

  // Sorting Handler
  const handleSort = (field: keyof RawIncrementRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Reset all filters easily
  const resetFilters = () => {
    setCompany("Pakiza Software Limited");
    setArea("PSL-Operation");
    setEmpType("ALL");
    setDepartment("All Departments");
    setSection("ALL");
    setSearchQuery("");
    setSelectedEmpIds([]);
    setAppliedFilters({
      company: "Pakiza Software Limited",
      area: "PSL-Operation",
      empType: "ALL",
      department: "All Departments",
      section: "ALL",
    });
  };

  // Multi-select actions
  const toggleSelectAll = () => {
    if (filteredRecords.length === 0) return;
    if (selectedEmpIds.length === filteredRecords.length) {
      setSelectedEmpIds([]);
    } else {
      setSelectedEmpIds(filteredRecords.map((r) => r.empId));
    }
  };

  const toggleSelectEmp = (empId: string) => {
    setSelectedEmpIds((prev) =>
      prev.includes(empId) ? prev.filter((item) => item !== empId) : [...prev, empId],
    );
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

    // 3. Text Search (Matches ID, Name, Designation, Section)
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

    // 4. Apply Sorting
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

  // Dynamic statistics
  const totalGrossPayroll = useMemo(() => {
    return rawIncrementRecords.reduce((sum, r) => sum + r.salaryGross, 0);
  }, []);

  const totalIncrementedIn2025 = useMemo(() => {
    return rawIncrementRecords.filter((r) => r.inc2025 !== "0" && r.inc2025 !== "0(0)").length;
  }, []);

  // Helper cell renderers
  const renderIncrementCell = (val: string) => {
    if (!val || val === "0" || val === "0.00") {
      return (
        <span className="text-muted-foreground/35 dark:text-slate-700 font-mono text-[10.5px]">
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
        <span className="text-muted-foreground/30 dark:text-slate-700 font-mono text-[10.5px]">
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
          <span className="font-mono font-black text-primary text-[10.5px]">{amount}</span>
          {count > 0 && (
            <span
              className="text-[7.5px] px-1 bg-primary/10 text-primary border border-primary/20 rounded font-black select-none"
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

  const handlePrint = () => {
    window.print();
  };

  const triggerBulkAction = (actionName: string) => {
    alert(
      `Bulk Operation [${actionName}] applied successfully to ${selectedEmpIds.length} employees!`,
    );
    setSelectedEmpIds([]);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative print:p-0">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 print:p-0">
          {/* Breadcrumb and Page Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="hover:text-primary transition-colors">Evaluation</span>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Increment History</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                  Increment History
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-6">Year-wise salary increment log for all employees</p>
            </div>

            {/* Quick Metrics Bar (replicated from personnel list) */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-card border border-border/70 rounded-xl px-3.5 py-1.5 shadow-2xs hover:shadow-xs transition duration-200">
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Total Staff
                </div>
                <div className="text-sm font-extrabold text-foreground mt-0.5">
                  {rawIncrementRecords.length}
                </div>
              </div>
              <div className="bg-[oklch(0.98_0.02_160)] dark:bg-[oklch(0.20_0.035_165)] border border-[oklch(0.62_0.16_155/0.2)] rounded-xl px-3.5 py-1.5 shadow-2xs">
                <div className="text-[9px] font-bold uppercase tracking-wider text-success/90">
                  Incremented(2025)
                </div>
                <div className="text-sm font-extrabold text-success mt-0.5">
                  {totalIncrementedIn2025}
                </div>
              </div>
              <div className="bg-card border border-border/70 rounded-xl px-3.5 py-1.5 shadow-2xs">
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Total Gross Budget
                </div>
                <div className="text-sm font-extrabold text-foreground mt-0.5">
                  ৳{(totalGrossPayroll / 100000).toFixed(1)}L
                </div>
              </div>
              <Link
                to="/propose-increment"
                className="h-9.5 px-4 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-semibold shadow-xs hover:shadow-sm hover:opacity-95 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <Plus className="size-4" /> Propose Increment
              </Link>
            </div>
          </div>



          {activeReportsTab === "history" && (
            <>
              <div className="bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 print:hidden">
                <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-primary/10 via-primary/45 to-primary/10" />
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                  <button
                    onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
                    className="flex items-center gap-2 text-xs font-bold text-foreground/90 hover:text-primary transition-colors"
                  >
                    <SlidersHorizontal className="size-4 text-primary" />
                    <span>Search Parameters & Filters</span>
                    <ChevronDown
                      className={`size-3.5 text-muted-foreground/60 transition-transform duration-300 ${isFilterCollapsed ? "-rotate-90" : ""}`}
                    />
                  </button>
                  {!isFilterCollapsed &&
                    (department !== "All Departments" ||
                      section !== "ALL" ||
                      empType !== "ALL") && (
                      <button
                        onClick={resetFilters}
                        className="text-[10px] font-bold text-destructive hover:underline"
                      >
                        Clear All Filters
                      </button>
                    )}
                </div>

                <div
                  className={`transition-all duration-300 overflow-hidden ${isFilterCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100 p-5"}`}
                >
                  <form
                    onSubmit={handleSearchSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
                  >
                    {/* Company select */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">
                        Company
                      </label>
                      <div className="relative">
                        <select
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer"
                        >
                          <option value="Pakiza Software Limited">Pakiza Software Limited</option>
                          <option value="Pakiza Software Limited (PIL-Operation)">
                            Pakiza Software Limited (PIL-Operation)
                          </option>
                        </select>
                        <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                      </div>
                    </div>

                    {/* Area select */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">
                        Area
                      </label>
                      <div className="relative">
                        <select
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer"
                        >
                          <option value="PSL-Operation">PSL-Operation</option>
                          <option value="PSL-HeadOffice">PSL-HeadOffice</option>
                        </select>
                        <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                      </div>
                    </div>

                    {/* Employee Type select */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">
                        Employee Type
                      </label>
                      <div className="relative">
                        <select
                          value={empType}
                          onChange={(e) => setEmpType(e.target.value)}
                          className="w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer"
                        >
                          <option value="ALL">ALL</option>
                          <option value="Staff">Staff</option>
                          <option value="Worker">Worker</option>
                        </select>
                        <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                      </div>
                    </div>

                    {/* Department select */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">
                        Department
                      </label>
                      <div className="relative">
                        <select
                          value={department}
                          onChange={(e) => {
                            setDepartment(e.target.value);
                            setSection("ALL"); // Reset section when dept changes
                          }}
                          className="w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer"
                        >
                          <option value="All Departments">All Departments</option>
                          {departmentsList.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                      </div>
                    </div>

                    {/* Section select */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">
                        Section
                      </label>
                      <div className="relative">
                        <select
                          value={section}
                          onChange={(e) => setSection(e.target.value)}
                          className="w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer"
                        >
                          <option value="ALL">ALL</option>
                          {sectionsList.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                      </div>
                    </div>

                    {/* Submit search button */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-5 flex justify-end pt-1 gap-2">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="h-9 px-6 border border-border hover:bg-muted text-muted-foreground hover:text-foreground font-extrabold text-xs rounded-xl transition uppercase tracking-wider"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="h-9 px-8 bg-primary hover:opacity-95 text-primary-foreground font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Filter className="size-3.5" />
                        <span>Search</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Bulk Operations Hub (replicated from personnel list) */}
              {selectedEmpIds.length > 0 && (
                <div className="bg-card rounded-lg border border-primary/25 shadow-xs p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 print:hidden">
                  <div className="flex items-center justify-between gap-4 pb-3 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary">
                        {selectedEmpIds.length} Selected
                      </span>
                      <h3 className="text-xs font-extrabold text-foreground tracking-tight">
                        Active Increment History Operations Console
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedEmpIds([])}
                      className="text-[10px] font-extrabold text-muted-foreground hover:text-primary transition"
                    >
                      Clear Selection
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    <button
                      onClick={() => triggerBulkAction("Print Selected Profiles")}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/40 bg-card text-center gap-1.5 transition-all hover:scale-102 hover:shadow-2xs text-blue-500 hover:bg-blue-500/5 hover:border-blue-500/30"
                    >
                      <Printer className="size-4.5" />
                      <span className="text-[10px] font-bold tracking-tight whitespace-nowrap leading-none">
                        Print Selected
                      </span>
                    </button>
                    <button
                      onClick={() => triggerBulkAction("Bulk Export PDF Register")}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/40 bg-card text-center gap-1.5 transition-all hover:scale-102 hover:shadow-2xs text-rose-500 hover:bg-rose-500/5 hover:border-rose-500/30"
                    >
                      <FileClock className="size-4.5" />
                      <span className="text-[10px] font-bold tracking-tight whitespace-nowrap leading-none">
                        PDF Register
                      </span>
                    </button>
                    <button
                      onClick={() => triggerBulkAction("Consolidated Audit Review")}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/40 bg-card text-center gap-1.5 transition-all hover:scale-102 hover:shadow-2xs text-emerald-500 hover:bg-emerald-500/5 hover:border-emerald-500/30"
                    >
                      <UserCog className="size-4.5" />
                      <span className="text-[10px] font-bold tracking-tight whitespace-nowrap leading-none">
                        Audit Review
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Row & Main Wide Table Panel (replicated from personnel list) */}
              <div className="bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300">
                {/* Toolbar Header (replicated from personnel list) */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b border-border/40 print:hidden">
                  {/* Export Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        alert(
                          "Excel payload generation active! 58 records serialized successfully.",
                        )
                      }
                      className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5"
                    >
                      <FileSpreadsheet className="size-3.5 text-emerald-500" />
                      <span>Excel</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5"
                    >
                      <Printer className="size-3.5 text-primary" />
                      <span>Print</span>
                    </button>
                    <button
                      onClick={() => setIsPdfModalOpen(true)}
                      className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5"
                    >
                      <FileDown className="size-3.5 text-rose-500" />
                      <span>PDF Register</span>
                    </button>
                  </div>

                  {/* Toolbar Right: Search Bar & Column Configuration Toggle (replicated from personnel list) */}
                  <div className="flex items-center gap-3 ml-auto w-full md:w-auto">
                    {/* Search query field */}
                    <div className="relative flex-1 md:w-64 lg:w-72">
                      <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name, ID, section, designation..."
                        className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                      />
                    </div>

                    {/* Column Configuration Selector (replicated from personnel list) */}
                    <div className="relative col-selector-container">
                      <button
                        onClick={() => setIsColSelectorOpen(!isColSelectorOpen)}
                        className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-bold text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition duration-200"
                      >
                        <LayoutGrid className="size-3.5 text-primary" />
                        <span>Columns</span>
                        <ChevronDown className="size-3 text-muted-foreground/60" />
                      </button>

                      {isColSelectorOpen && (
                        <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-card border border-border/80 shadow-lg p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150 text-foreground">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/30">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">
                              Show Columns
                            </span>
                            <button
                              onClick={() => setVisibleCols(defaultColumns)}
                              className="text-[9px] font-bold text-primary hover:underline"
                            >
                              Reset
                            </button>
                          </div>
                          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                            {Object.keys(defaultColumns).map((colKey) => (
                              <button
                                key={colKey}
                                onClick={() => toggleColumn(colKey as keyof typeof defaultColumns)}
                                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs hover:bg-muted transition duration-150"
                              >
                                <div
                                  className={`size-4 rounded-md border flex items-center justify-center transition-all ${visibleCols[colKey as keyof typeof defaultColumns] ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}
                                >
                                  {visibleCols[colKey as keyof typeof defaultColumns] && (
                                    <Check className="size-2.5 stroke-[3.5]" />
                                  )}
                                </div>
                                <span className="font-medium text-foreground/80 capitalize">
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
                </div>

                {/* HIGH-FIDELITY DATAGRID TABLE WITH STICKY FIXED LEFT SIDE COLUMNS (replicated from personnel list) */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/40">
                        {/* Sticky Actions and Checkbox Column */}
                        <th className="sticky left-0 bg-[#f1f5f9] dark:bg-[#0f172a] px-2 py-4 font-bold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[110px] min-w-[110px] max-w-[110px] text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <input
                              type="checkbox"
                              checked={
                                filteredRecords.length > 0 &&
                                selectedEmpIds.length === filteredRecords.length
                              }
                              onChange={toggleSelectAll}
                              className="rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                            />
                            <span>∇</span>
                          </div>
                        </th>

                        {/* Fixed Sticky Header for ID and Name */}
                        <th className="sticky left-[110px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-4 font-bold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[100px] min-w-[100px] max-w-[100px]">
                          Emp ID
                        </th>
                        <th className="sticky left-[210px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-4 font-bold border-r border-border/40 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[180px] min-w-[180px] max-w-[180px]">
                          Name
                        </th>

                        {/* Standard Configurable headers */}
                        {visibleCols.department && (
                          <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">
                            Department
                          </th>
                        )}
                        {visibleCols.section && (
                          <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">
                            Section
                          </th>
                        )}
                        {visibleCols.designation && (
                          <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">
                            Designation
                          </th>
                        )}
                        {visibleCols.joiningDate && (
                          <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-center">
                            Joining Date
                          </th>
                        )}
                        {visibleCols.salaryJoining && (
                          <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-right">
                            Salary(Joining)
                          </th>
                        )}
                        {visibleCols.salaryBasic && (
                          <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-right">
                            Salary(Basic)
                          </th>
                        )}
                        {visibleCols.salaryGross && (
                          <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-right">
                            Salary(Gross)
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
                                className="px-4 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-center"
                              >
                                Inc({yr})
                              </th>
                            )
                          );
                        })}

                        {visibleCols.total && (
                          <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-center">
                            Total
                          </th>
                        )}
                        {visibleCols.lastIncDate && (
                          <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-center">
                            Last Inc Date
                          </th>
                        )}
                        {visibleCols.lastIncAmount && (
                          <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-right">
                            Last Inc Amount
                          </th>
                        )}
                        {visibleCols.lastPromotion && (
                          <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-center">
                            Last Promotion
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/45">
                      {filteredRecords.map((row, idx) => {
                        const isSelected = selectedRecord?.empId === row.empId;

                        // Replicated solid background classes to prevent text bleed-through when scrolling horizontally
                        const stickyCellBgClass = isSelected
                          ? "bg-[#f1f5f9] dark:bg-[#1e293b] group-hover:bg-[#e2e8f0] dark:group-hover:bg-[#334155]"
                          : "bg-card group-hover:bg-[#f8fafc] dark:group-hover:bg-[#1e293b]";

                        return (
                          <tr
                            key={row.sl}
                            onClick={() => setSelectedRecord(row)}
                            className={`group transition-all cursor-pointer ${isSelected ? "bg-[#f1f5f9] dark:bg-[#1e293b]" : "hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]"}`}
                          >
                            {/* Sticky Left Actions and Checkbox Cell */}
                            <td
                              className={`sticky left-0 ${stickyCellBgClass} px-2 py-2 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[110px] min-w-[110px] max-w-[110px] transition-all`}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <div className="flex items-center gap-1.5 justify-center">
                                <input
                                  type="checkbox"
                                  checked={selectedEmpIds.includes(row.empId)}
                                  onChange={() => toggleSelectEmp(row.empId)}
                                  className="rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                                />
                                <button
                                  className="size-6 bg-amber-500 text-white rounded hover:bg-amber-600 transition flex items-center justify-center shadow-2xs"
                                  onClick={() => setSelectedRecord(row)}
                                  title="Audit breakdown summary"
                                >
                                  <FileText className="size-3" />
                                </button>
                                <button
                                  className="size-6 border border-border hover:bg-muted text-muted-foreground hover:text-primary rounded transition flex items-center justify-center"
                                  onClick={() => setSelectedRecord(row)}
                                  title="View Compensation"
                                >
                                  <Eye className="size-3" />
                                </button>
                              </div>
                            </td>

                            {/* Sticky Left Emp ID and Name Cell */}
                            <td
                              className={`sticky left-[110px] ${stickyCellBgClass} px-3 py-3.5 font-bold text-primary border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[100px] min-w-[100px] max-w-[100px] transition-all font-mono text-[11px]`}
                            >
                              {row.empId}
                            </td>
                            <td
                              className={`sticky left-[210px] ${stickyCellBgClass} px-3 py-3.5 font-bold text-foreground border-r border-border/40 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[180px] min-w-[180px] max-w-[180px] transition-all`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="size-6.5 rounded-lg bg-primary/10 text-[9px] font-bold text-primary flex items-center justify-center shadow-2xs">
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
                              <td className="px-5 py-3.5 text-foreground/80 font-medium">
                                {row.department}
                              </td>
                            )}
                            {visibleCols.section && (
                              <td className="px-5 py-3.5 text-muted-foreground/90 font-medium">
                                {row.section}
                              </td>
                            )}
                            {visibleCols.designation && (
                              <td className="px-5 py-3.5 font-semibold text-foreground">
                                {row.designation}
                              </td>
                            )}
                            {visibleCols.joiningDate && (
                              <td className="px-5 py-3.5 text-center font-mono text-muted-foreground/80 font-semibold">
                                {row.joiningDate}
                              </td>
                            )}
                            {visibleCols.salaryJoining && (
                              <td className="px-5 py-3.5 text-right font-mono font-semibold text-foreground/90">
                                ৳
                                {row.salaryJoining.toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                            )}
                            {visibleCols.salaryBasic && (
                              <td className="px-5 py-3.5 text-right font-mono font-semibold text-foreground/90">
                                ৳
                                {row.salaryBasic.toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                            )}
                            {visibleCols.salaryGross && (
                              <td className="px-5 py-3.5 text-right font-mono font-bold text-primary">
                                ৳
                                {row.salaryGross.toLocaleString("en-IN", {
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
                                  <td key={yr} className="px-4 py-3.5 text-center">
                                    {renderIncrementCell(rowVal)}
                                  </td>
                                )
                              );
                            })}

                            {visibleCols.total && (
                              <td className="px-5 py-3.5 text-center">
                                {renderTotalCell(row.total)}
                              </td>
                            )}
                            {visibleCols.lastIncDate && (
                              <td className="px-5 py-3.5 text-center font-mono text-muted-foreground/80 font-semibold">
                                {row.lastIncDate || "—"}
                              </td>
                            )}
                            {visibleCols.lastIncAmount && (
                              <td className="px-5 py-3.5 text-right font-mono font-semibold text-muted-foreground/80">
                                {row.lastIncAmount
                                  ? `৳${parseFloat(row.lastIncAmount).toLocaleString()}`
                                  : "—"}
                              </td>
                            )}
                            {visibleCols.lastPromotion && (
                              <td className="px-5 py-3.5 text-center font-mono text-muted-foreground/80 font-semibold">
                                {row.lastPromotion || "—"}
                              </td>
                            )}
                          </tr>
                        );
                      })}

                      {filteredRecords.length === 0 && (
                        <tr>
                          <td colSpan={30} className="px-5 py-16 text-center text-muted-foreground">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <EyeOff className="size-8 text-muted-foreground/45" />
                              <span className="font-semibold text-xs">
                                No employees match the specified increment history search
                                parameters.
                              </span>
                              <button
                                onClick={resetFilters}
                                className="text-[10px] font-bold text-primary hover:underline mt-1"
                              >
                                Clear Filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Footer Info (replicated from personnel list) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-t border-border/40 bg-muted/15">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPdfModalOpen(true)}
                      className="h-8.5 px-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[10px] rounded-lg shadow-2xs hover:shadow-xs transition uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <FileDown className="size-3.5" />
                      <span>View PDF Register</span>
                    </button>
                    <span className="text-[11px] font-semibold text-muted-foreground/80">
                      Showing {filteredRecords.length > 0 ? 1 : 0} to {filteredRecords.length} of{" "}
                      {rawIncrementRecords.length} entries
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="h-8 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted text-xs font-bold text-muted-foreground disabled:opacity-50 transition"
                      disabled
                    >
                      Previous
                    </button>
                    <button className="h-8 w-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-2xs">
                      1
                    </button>
                    <button
                      className="h-8 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted text-xs font-bold text-muted-foreground disabled:opacity-50 transition"
                      disabled
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: CUMULATIVE SUMMARY (INCREMENT SUMMARY SHEET) */}
          {activeReportsTab === "summary" && (
            <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border/20">
                <div>
                  <h3 className="text-xs font-black uppercase text-foreground">
                    Departmental Increment Summary Ledger
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase">
                    Active Cycle Breakdown • PSL Operation
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert("Summary report Excel export started.")}
                    className="h-8 px-3 rounded-lg border border-border/40 bg-card hover:bg-muted text-xs font-bold text-muted-foreground transition flex items-center gap-1.5"
                  >
                    <FileSpreadsheet className="size-3.5" /> Excel
                  </button>
                  <button
                    onClick={() => alert("Summary report PDF generation completed.")}
                    className="h-8 px-3 rounded-lg border border-border/40 bg-card hover:bg-muted text-xs font-bold text-muted-foreground transition flex items-center gap-1.5"
                  >
                    <FileDown className="size-3.5" /> PDF
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20">
                      <th className="px-3 py-3 text-center">#</th>
                      <th className="px-4 py-3">Emp Type</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-3 py-3 text-center">Unit</th>
                      <th className="px-3 py-3 text-center">Line</th>
                      <th className="px-3 py-3 text-center">Person Count</th>
                      <th className="px-4 py-3 text-right text-primary">Increment Amount</th>
                      <th className="px-4 py-3 text-center">Inc Month</th>
                      <th className="px-4 py-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {[
                      {
                        type: "Office Executive",
                        dept: "Admin",
                        unit: "N/A",
                        line: "N/A",
                        count: 1,
                        amount: 5000,
                        month: "Jan,2026",
                        remarks: "null",
                      },
                      {
                        type: "Office Executive",
                        dept: "Admin",
                        unit: "PSL",
                        line: "N/A",
                        count: 1,
                        amount: 2500,
                        month: "Jan,2026",
                        remarks: "null",
                      },
                      {
                        type: "Office Executive",
                        dept: "APPS Team",
                        unit: "PSL",
                        line: "N/A",
                        count: 1,
                        amount: 10000,
                        month: "Jan,2026",
                        remarks: "null",
                      },
                      {
                        type: "Office Executive",
                        dept: "Business Analysis",
                        unit: "PSL",
                        line: "N/A",
                        count: 1,
                        amount: 2000,
                        month: "Jan,2026",
                        remarks: "null",
                      },
                      {
                        type: "Office Executive",
                        dept: "Core Development (HR)",
                        unit: "PSL",
                        line: "N/A",
                        count: 3,
                        amount: 24000,
                        month: "Jan,2026",
                        remarks: "null",
                      },
                      {
                        type: "Office Executive",
                        dept: "Core Sales",
                        unit: "PSL",
                        line: "N/A",
                        count: 5,
                        amount: 15000,
                        month: "Jan,2026",
                        remarks: "null",
                      },
                      {
                        type: "Office Executive",
                        dept: "DBA",
                        unit: "PSL",
                        line: "N/A",
                        count: 1,
                        amount: 2000,
                        month: "Jan,2026",
                        remarks: "null",
                      },
                      {
                        type: "Office Executive",
                        dept: "ERP Team",
                        unit: "PSL",
                        line: "N/A",
                        count: 1,
                        amount: 3000,
                        month: "Jan,2026",
                        remarks: "null",
                      },
                      {
                        type: "Office Executive",
                        dept: "ERP Team",
                        unit: "PSL",
                        line: "N/A",
                        count: 1,
                        amount: 6000,
                        month: "Jan,2026",
                        remarks: "null",
                      },
                      {
                        type: "Office Executive",
                        dept: "ERP Team",
                        unit: "PSL",
                        line: "N/A",
                        count: 2,
                        amount: 15000,
                        month: "Jan,2026",
                        remarks: "null",
                      },
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-muted/40 transition">
                        <td className="px-3 py-3 text-center font-mono font-bold text-muted-foreground/60">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 font-extrabold text-foreground">{row.type}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{row.dept}</td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground">
                          {row.unit}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground">
                          {row.line}
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-foreground">
                          {row.count}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-black text-primary">
                          ৳{row.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-muted-foreground">
                          {row.month}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground/50 italic">{row.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PARAMETERIZED REPORTS (INCREMENT PROPOSAL REGISTER) */}
          {activeReportsTab === "reports" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Filter Panel */}
              <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Filter className="size-4.5 text-primary" />
                  <span>Report Compilation Parameters</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-muted-foreground">
                      Year
                    </label>
                    <select className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold">
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-muted-foreground">
                      Month
                    </label>
                    <select className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold">
                      <option value="Jan">Jan</option>
                      <option value="Dec">Dec</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-muted-foreground">
                      Company
                    </label>
                    <select className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold">
                      <option value="Pakiza">Pakiza Software Limited</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-muted-foreground">
                      Area
                    </label>
                    <select className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold">
                      <option value="PSL">PSL-Operation</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 flex items-end">
                    <button
                      onClick={() => alert("Report records filtered.")}
                      className="w-full h-8.5 bg-primary hover:opacity-95 text-primary-foreground font-extrabold text-[10px] rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-1"
                    >
                      <Search className="size-3.5" /> Compile Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Proposals Table */}
              <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20">
                  <h3 className="text-xs font-black uppercase text-foreground">
                    Compensation Appraisal & Increment Register
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert("Proposal Register exported to Excel.")}
                      className="h-8 px-3 rounded-lg border border-border/40 bg-card hover:bg-muted text-xs font-bold text-muted-foreground transition flex items-center gap-1.5"
                    >
                      <FileSpreadsheet className="size-3.5" /> Excel
                    </button>
                    <button
                      onClick={() => alert("Proposal Register printed.")}
                      className="h-8 px-3 rounded-lg border border-border/40 bg-card hover:bg-muted text-xs font-bold text-muted-foreground transition flex items-center gap-1.5"
                    >
                      <Printer className="size-3.5" /> Print
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20">
                        <th className="px-3 py-3 text-center">#</th>
                        <th className="px-4 py-3 text-center">View (Inc)</th>
                        <th className="px-4 py-3 text-center">View (Prom)</th>
                        <th className="px-3 py-3">Employee ID</th>
                        <th className="px-4 py-3">Employee Name</th>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3">Section</th>
                        <th className="px-4 py-3">Designation (Before Inc.)</th>
                        <th className="px-4 py-3">Designation (After Inc.)</th>
                        <th className="px-4 py-3 text-right">Previous Gross</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {[
                        {
                          id: "2025053673",
                          name: "Md Jahid Hasan Polok",
                          dept: "Core Development",
                          sec: "General ERP (Com, A/C, Fixed Asset, Vat)",
                          descBefore: "Sr. Executive",
                          descAfter: "Sr. Executive",
                          prevGross: 40000.0,
                        },
                        {
                          id: "2025056473",
                          name: "Hasnain",
                          dept: "HR, Admin and Compliance",
                          sec: "Admin",
                          descBefore: "Cleaner",
                          descAfter: "Cleaner",
                          prevGross: 11000.0,
                        },
                        {
                          id: "2025057067",
                          name: "Sunit Corneleous Sarker",
                          dept: "Business Automation (HR)",
                          sec: "Core Development (HR)",
                          descBefore: "Executive",
                          descAfter: "Executive",
                          prevGross: 28000.0,
                        },
                        {
                          id: "2025057437",
                          name: "Towhidur Rahman",
                          dept: "Implementation & Business Analysis",
                          sec: "Business Analysis",
                          descBefore: "Executive",
                          descAfter: "Executive",
                          prevGross: 25000.0,
                        },
                        {
                          id: "2025055045",
                          name: "Md. Mahfuzur Rahman",
                          dept: "Business Automation (HR)",
                          sec: "Implementation & Support (HR)",
                          descBefore: "Jr. Executive",
                          descAfter: "Jr. Executive",
                          prevGross: 18000.0,
                        },
                      ].map((row, index) => (
                        <tr key={row.id} className="hover:bg-muted/40 transition">
                          <td className="px-3 py-3 text-center font-mono font-bold text-muted-foreground/60">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() =>
                                alert(`Showing increment dossier for employee: ${row.name}`)
                              }
                              className="h-6 px-2.5 rounded bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-black uppercase transition inline-flex items-center gap-1"
                            >
                              <Eye className="size-3" /> View
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() =>
                                alert(`Showing promotion dossier for employee: ${row.name}`)
                              }
                              className="h-6 px-2.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase transition inline-flex items-center gap-1"
                            >
                              <Sparkles className="size-3" /> Prom
                            </button>
                          </td>
                          <td className="px-3 py-3 font-mono font-black text-foreground">
                            {row.id}
                          </td>
                          <td className="px-4 py-3 font-extrabold text-foreground">{row.name}</td>
                          <td className="px-4 py-3 text-muted-foreground font-semibold">
                            {row.dept}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground/80">{row.sec}</td>
                          <td className="px-4 py-3 text-muted-foreground/80 font-bold">
                            {row.descBefore}
                          </td>
                          <td className="px-4 py-3 text-primary font-extrabold">{row.descAfter}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                            ৳{row.prevGross.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Record details Audit Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-lg border border-border shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-foreground">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5">
              <Sparkles className="size-5 text-primary" />
              <span>Compensation History Breakdown</span>
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              {/* Profile card */}
              <div className="p-4 rounded-xl bg-muted border border-border/65 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-white grid place-items-center text-xs font-black shadow-sm">
                  {selectedRecord.empName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 3)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="font-extrabold text-foreground text-sm">
                    {selectedRecord.empName}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5 font-bold">
                    <span className="font-mono">{selectedRecord.empId}</span>
                    <span>•</span>
                    <span>{selectedRecord.designation}</span>
                  </div>
                </div>
              </div>

              {/* Salary bands details */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl border border-border/80 bg-muted/40">
                  <div className="text-[8.5px] uppercase tracking-wider text-muted-foreground font-bold">
                    JOINING
                  </div>
                  <div className="text-xs font-mono font-bold mt-1 text-foreground/80">
                    ৳{selectedRecord.salaryJoining.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-border/80 bg-muted/40">
                  <div className="text-[8.5px] uppercase tracking-wider text-muted-foreground font-bold">
                    BASIC
                  </div>
                  <div className="text-xs font-mono font-bold mt-1 text-foreground/80">
                    ৳{selectedRecord.salaryBasic.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-primary/20 bg-primary/5">
                  <div className="text-[8.5px] uppercase tracking-wider text-primary font-bold">
                    GROSS
                  </div>
                  <div className="text-xs font-mono font-black mt-1 text-primary">
                    ৳{selectedRecord.salaryGross.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Detailed specs */}
              <div className="border-t border-b border-border/40 py-4 space-y-2.5 font-bold text-muted-foreground/85">
                <div className="flex justify-between">
                  <span className="text-muted-foreground/60">Department</span>
                  <span className="text-foreground">{selectedRecord.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground/60">Section Group</span>
                  <span className="text-foreground">{selectedRecord.section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground/60">Joining Date</span>
                  <span className="font-mono text-foreground">{selectedRecord.joiningDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground/60">Total Increment Accrued</span>
                  <span className="text-foreground">{renderTotalCell(selectedRecord.total)}</span>
                </div>
                {selectedRecord.lastIncDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground/60">Last Increment Date</span>
                    <span className="font-mono text-foreground">{selectedRecord.lastIncDate}</span>
                  </div>
                )}
                {selectedRecord.lastIncAmount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground/60">Last Increment Amount</span>
                    <span className="font-mono text-foreground">
                      ৳{parseFloat(selectedRecord.lastIncAmount).toLocaleString()}
                    </span>
                  </div>
                )}
                {selectedRecord.lastPromotion && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground/60">Last Promotion Date</span>
                    <span className="font-mono text-foreground">
                      {selectedRecord.lastPromotion}
                    </span>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="h-9.5 px-6 bg-primary hover:opacity-95 text-primary-foreground font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-5xl rounded-lg border border-border shadow-2xl p-6 relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-foreground">
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-border/40 pb-3 mb-4">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <FileDown className="size-5.5 text-rose-500" />
                <span>PDF Print Preview — Salary Increment History</span>
              </h3>
              <p className="text-[10px] text-muted-foreground/75 font-bold mt-1 uppercase">
                Pakiza Software Limited • PSL-Operation Ledger
              </p>
            </div>

            {/* Scrollable Document Body */}
            <div
              id="pdf-print-area"
              className="flex-1 overflow-y-auto p-4 border border-border bg-white text-slate-900 rounded-xl space-y-6"
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
            <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-4">
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="h-9 px-5 rounded-xl border border-border hover:bg-muted font-extrabold text-xs transition uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handlePrint}
                className="h-9 px-6 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center gap-1.5"
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
