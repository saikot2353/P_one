import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { rawQueueRecords, QueueRecord } from "./-increment-queue-data";
import {
  Search, FileSpreadsheet, Printer, FileDown, Plus, Info,
  Sparkles, X, Eye, ArrowUpDown, Filter, ChevronDown, ChevronRight, Check,
  LayoutGrid, SlidersHorizontal, EyeOff, FileText, FileClock,
  TrendingUp, DollarSign, UserCog, Edit, Settings, ArrowRight, Sparkle, Calendar, Banknote, Briefcase,
  CheckCircle2, ListFilter, ClipboardCheck, ShieldAlert
} from "lucide-react";

export const Route = createFileRoute("/increment-queuelist")({
  head: () => ({
    meta: [
      { title: "Approvals Console — CRIPTON HRIS" },
      { name: "description", content: "Unified enterprise approval console for human resource increments, HR endorsements, and final executive MD approvals." },
    ],
  }),
  component: IncrementQueueListPage,
});

const defaultColumns = {
  department: true,
  section: true,
  designation: true,
  joiningDate: true,
  prevGross: true,
  lastIncDate: true,
  lastIncAmount: true,
  grossAfterInc: true,
};

function IncrementQueueListPage() {
  const [activeConsoleTab, setActiveConsoleTab] = useState<"queue" | "hr" | "md">("queue");
  const [queueRecords, setQueueRecords] = useState<QueueRecord[]>(rawQueueRecords);

  useEffect(() => {
    const saved = localStorage.getItem("custom_increment_queue_records");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const filteredRaw = rawQueueRecords.filter(raw => !parsed.some((cust: any) => cust.empId === raw.empId));
        setQueueRecords([...parsed, ...filteredRaw]);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Default Filter States (Always visible)
  const [department, setDepartment] = useState("All Departments");
  const [searchEmpId, setSearchEmpId] = useState("");
  const [status, setStatus] = useState("Working");

  // Advanced Collapsible Filter States
  const [company, setCompany] = useState("Pakiza Software Limited");
  const [area, setArea] = useState("PSL-Operation");
  const [empType, setEmpType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [option, setOption] = useState("ALL");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("May");

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Applied filter state
  const [appliedFilters, setAppliedFilters] = useState({
    department: "All Departments",
    searchEmpId: "",
    status: "Working",
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    empType: "ALL",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    line: "ALL",
    option: "ALL",
    year: "2026",
    month: "May",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([]);
  const [editingRecord, setEditingRecord] = useState<QueueRecord | null>(null);

  // Tab control state inside the Edit Configurator Modal
  const [modalActiveTab, setModalActiveTab] = useState<"schedule" | "adjust" | "allowances" | "promotion">("schedule");

  // Columns visibility & sorting states
  const [visibleCols, setVisibleCols] = useState(defaultColumns);
  const [isColSelectorOpen, setIsColSelectorOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof QueueRecord | "">("");
  const [sortAsc, setSortAsc] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Replicated Edit Parameter Inputs
  const [editYear, setEditYear] = useState("2026");
  const [editMonth, setEditMonth] = useState("May");
  const [editIncDate, setEditIncDate] = useState("01/05/2026");
  const [editIncType, setEditIncType] = useState("General");
  const [editIncBy, setEditIncBy] = useState("Gross");
  const [editCalBy, setEditCalBy] = useState("Fixed");
  const [editArrear, setEditArrear] = useState(false);

  const [editIncrementVal, setEditIncrementVal] = useState("5000");
  const [editIncBasic, setEditIncBasic] = useState("3000");
  const [editIncGross, setEditIncGross] = useState("5000");
  const [editIncAmount, setEditIncAmount] = useState("5000");
  const [editHouseRent, setEditHouseRent] = useState("1500");
  const [editMedical, setEditMedical] = useState("600");
  const [editConveyance, setEditConveyance] = useState("500");
  const [editFood, setEditFood] = useState("400");

  const [editPromType, setEditPromType] = useState("ALL");
  const [editPromJobTitle, setEditPromJobTitle] = useState("ALL");
  const [editNewGrade, setEditNewGrade] = useState("--Select--");
  const [editRemarks, setEditRemarks] = useState("Satisfactory performance adjustment");

  const handleStartEdit = (row: QueueRecord) => {
    setEditingRecord(row);
    setModalActiveTab("schedule");

    // Default preset setup
    setEditYear("2026");
    setEditMonth("May");
    setEditIncDate("01/05/2026");
    setEditIncType("General");
    setEditIncBy("Gross");
    setEditCalBy("Fixed");
    setEditArrear(false);

    setEditIncrementVal("5000");
    setEditIncBasic(Math.round(5000 * 0.6).toString());
    setEditIncGross("5000");
    setEditIncAmount("5000");
    setEditHouseRent(Math.round(5000 * 0.3).toString());
    setEditMedical("500");
    setEditConveyance("500");
    setEditFood("500");

    setEditPromType("ALL");
    setEditPromJobTitle("ALL");
    setEditNewGrade("--Select--");
    setEditRemarks(`Increment adjustment for ${row.empName}`);
  };

  // Live Automatic Computations (No manual click required)
  useEffect(() => {
    if (!editingRecord) return;
    const incNum = parseFloat(editIncrementVal) || 0;
    const prevGross = editingRecord.prevGross || editingRecord.grossAfterInc || 30000;
    const prevBasic = prevGross * 0.6;

    let computedGrossInc = 0;
    let computedBasicInc = 0;

    if (editCalBy === "Percentage") {
      computedGrossInc = Math.round(prevGross * (incNum / 100));
      computedBasicInc = Math.round(prevBasic * (incNum / 100));
    } else {
      if (editIncBy === "Gross") {
        computedGrossInc = incNum;
        computedBasicInc = Math.round(incNum * 0.6);
      } else {
        computedBasicInc = incNum;
        computedGrossInc = Math.round(incNum / 0.6);
      }
    }

    setEditIncGross(computedGrossInc.toString());
    setEditIncBasic(computedBasicInc.toString());
    setEditIncAmount(computedGrossInc.toString());

    // Basic splits allocations
    setEditHouseRent(Math.round(computedBasicInc * 0.50).toString());
    setEditMedical(Math.round(computedBasicInc * 0.12).toString());
    setEditConveyance("500");
    setEditFood("500");

  }, [editIncrementVal, editCalBy, editIncBy, editingRecord]);

  const applyPresetPercentage = (pct: number) => {
    setEditCalBy("Percentage");
    setEditIncrementVal(pct.toString());
    showToast(`Quickpreset applied: +${pct}% Salary Increment adjusted.`);
  };

  const handleSaveIncrement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    const parsedGrossVal = parseFloat(editIncGross) || 0;

    setQueueRecords(prev => prev.map(item => {
      if (item.sl === editingRecord.sl) {
        const currentGross = item.prevGross || item.grossAfterInc || 30000;
        return {
          ...item,
          prevGross: currentGross,
          lastIncDate: editIncDate,
          lastIncAmount: parsedGrossVal,
          grossAfterInc: currentGross + parsedGrossVal
        };
      }
      return item;
    }));

    setEditingRecord(null);
    showToast(`Salary increment submitted successfully for ${editingRecord.empName}! Queue entry updated.`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      department,
      searchEmpId,
      status,
      company,
      area,
      empType,
      section,
      designation,
      unit,
      line,
      option,
      year,
      month,
    });
  };

  const departmentsList = useMemo(() => {
    const depts = new Set(queueRecords.map(r => r.department));
    return Array.from(depts).sort();
  }, [queueRecords]);

  const sectionsList = useMemo(() => {
    const filteredDepts = department === "All Departments"
      ? queueRecords
      : queueRecords.filter(r => r.department === department);
    const sections = new Set(filteredDepts.map(r => r.section));
    return Array.from(sections).sort();
  }, [department, queueRecords]);

  const designationsList = useMemo(() => {
    const desigs = new Set(queueRecords.map(r => r.designation));
    return Array.from(desigs).sort();
  }, [queueRecords]);

  const handleSort = (field: keyof QueueRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const resetFilters = () => {
    setDepartment("All Departments");
    setSearchEmpId("");
    setStatus("Working");
    setCompany("Pakiza Software Limited");
    setArea("PSL-Operation");
    setEmpType("ALL");
    setSection("ALL");
    setDesignation("ALL");
    setUnit("ALL");
    setLine("ALL");
    setOption("ALL");
    setYear("2026");
    setMonth("May");
    setSearchQuery("");
    setSelectedEmpIds([]);
    setAppliedFilters({
      department: "All Departments",
      searchEmpId: "",
      status: "Working",
      company: "Pakiza Software Limited",
      area: "PSL-Operation",
      empType: "ALL",
      section: "ALL",
      designation: "ALL",
      unit: "ALL",
      line: "ALL",
      option: "ALL",
      year: "2026",
      month: "May",
    });
  };

  const toggleSelectAll = () => {
    if (filteredRecords.length === 0) return;
    if (selectedEmpIds.length === filteredRecords.length) {
      setSelectedEmpIds([]);
    } else {
      setSelectedEmpIds(filteredRecords.map(r => r.empId));
    }
  };

  const toggleSelectEmp = (empId: string) => {
    setSelectedEmpIds(prev =>
      prev.includes(empId)
        ? prev.filter(item => item !== empId)
        : [...prev, empId]
    );
  };

  const toggleColumn = (key: keyof typeof defaultColumns) => {
    setVisibleCols(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredRecords = useMemo(() => {
    let list = [...queueRecords];

    if (appliedFilters.department !== "All Departments") {
      list = list.filter(r => r.department === appliedFilters.department);
    }
    if (appliedFilters.section !== "ALL") {
      list = list.filter(r => r.section === appliedFilters.section);
    }
    if (appliedFilters.designation !== "ALL") {
      list = list.filter(r => r.designation === appliedFilters.designation);
    }
    if (appliedFilters.searchEmpId.trim()) {
      list = list.filter(r => r.empId.toLowerCase().includes(appliedFilters.searchEmpId.trim().toLowerCase()));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.empId.toLowerCase().includes(q) ||
        r.empName.toLowerCase().includes(q) ||
        r.designation.toLowerCase().includes(q) ||
        r.section.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q)
      );
    }

    if (sortField) {
      list.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (valA === null) return 1;
        if (valB === null) return -1;

        if (typeof valA === "number" && typeof valB === "number") {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return list;
  }, [queueRecords, appliedFilters, searchQuery, sortField, sortAsc]);

  const totals = useMemo(() => {
    let totalPending = 0;
    let totalAdjustedVal = 0;

    queueRecords.forEach(r => {
      if (r.lastIncAmount) {
        totalAdjustedVal += r.lastIncAmount;
      } else {
        totalPending++;
      }
    });

    return {
      pending: totalPending,
      adjusted: queueRecords.length - totalPending,
      value: totalAdjustedVal,
    };
  }, [queueRecords]);

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

  const computedModalStats = useMemo(() => {
    if (!editingRecord) return { oldGross: 0, delta: 0, newGross: 0, percent: 0 };
    const oldGross = editingRecord.prevGross || editingRecord.grossAfterInc || 30000;
    const delta = parseFloat(editIncGross) || 0;
    const newGross = oldGross + delta;
    const percent = oldGross > 0 ? (delta / oldGross) * 100 : 0;
    return { oldGross, delta, newGross, percent };
  }, [editingRecord, editIncGross]);

  // MOCK HR ENDORSEMENTS
  const mockHrEndorsements = [
    { id: "HR-9844", name: "Md. Rafsan Kabir", department: "Core Development", amount: 8500, date: "18/05/2026" },
    { id: "HR-9122", name: "Md Johirul Islam", department: "Business Automation", amount: 4500, date: "17/05/2026" }
  ];

  // MOCK EXECUTIVE APPROVALS
  const mockExecApprovals = [
    { id: "MD-8812", name: "Mohammad Methoun Ahmed", department: "Business Automation", amount: 15000, date: "18/05/2026", justification: "System manager appraisal recommendation HOD" }
  ];

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
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="hover:text-primary transition-colors">Human Resource</span>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Increment Approvals Console</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">Approvals Console</h1>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-card border border-border/70 rounded-xl px-3.5 py-1.5 shadow-2xs hover:shadow-xs transition duration-200">
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">Active Queue</div>
                <div className="text-sm font-extrabold text-foreground mt-0.5">{queueRecords.length}</div>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-xl px-3.5 py-1.5 shadow-2xs">
                <div className="text-[9px] font-bold uppercase tracking-wider text-primary">HR Endorsements</div>
                <div className="text-sm font-extrabold text-primary mt-0.5">{mockHrEndorsements.length}</div>
              </div>
              <div className="bg-card border border-border/70 rounded-xl px-3.5 py-1.5 shadow-2xs">
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 font-black">MD Pending</div>
                <div className="text-sm font-extrabold text-foreground mt-0.5">{mockExecApprovals.length}</div>
              </div>
            </div>
          </div>

          {/* Console Tab Selector */}
          <div className="bg-card rounded-lg border border-border/80 p-1.5 shadow-2xs flex gap-1 print:hidden">
            <button
              onClick={() => setActiveConsoleTab("queue")}
              className={`flex-1 sm:flex-none h-10 px-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeConsoleTab === "queue" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"}`}
            >
              <ListFilter className="size-3.5" />
              <span>📋 Active Queue List</span>
            </button>
            <button
              onClick={() => setActiveConsoleTab("hr")}
              className={`flex-1 sm:flex-none h-10 px-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeConsoleTab === "hr" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"}`}
            >
              <ClipboardCheck className="size-3.5" />
              <span>⚖️ HR Endorsements</span>
            </button>
            <button
              onClick={() => setActiveConsoleTab("md")}
              className={`flex-1 sm:flex-none h-10 px-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeConsoleTab === "md" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"}`}
            >
              <CheckCircle2 className="size-3.5" />
              <span>👑 Final MD Approval</span>
            </button>
          </div>

          {/* Toast Alert */}
          {toastMessage && (
            <div className="fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white border border-primary/30 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="size-2 rounded-full bg-primary animate-ping" />
              <span className="text-xs font-semibold">{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white transition">
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* Tab Rendering Router */}
          {activeConsoleTab === "queue" && (
            <div className="space-y-6">

              {/* ⚡ SPONTANEOUS RESPONSIVE & SPACIOUS FILTER HUB */}
              <div className="bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 print:hidden">
                <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-primary/10 via-primary/45 to-primary/10" />

                <form onSubmit={handleSearchSubmit} className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Employee ID</label>
                      <input
                        type="text"
                        value={searchEmpId}
                        onChange={(e) => setSearchEmpId(e.target.value)}
                        placeholder="Enter Employee ID (e.g. 2025054614)"
                        className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs font-semibold transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Department</label>
                      <div className="relative">
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full h-10 pl-3.5 pr-8 rounded-xl bg-muted border border-border/40 text-xs font-semibold appearance-none cursor-pointer"
                        >
                          <option value="All Departments">All Departments</option>
                          {departmentsList.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <ChevronDown className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Status</label>
                      <div className="relative">
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full h-10 pl-3.5 pr-8 rounded-xl bg-muted border border-border/40 text-xs font-semibold appearance-none cursor-pointer"
                        >
                          <option value="Working">Working</option>
                          <option value="Resigned">Resigned</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                        <ChevronDown className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {showAdvancedFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-border/30 animate-in slide-in-from-top-2 duration-200">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Company</label>
                        <select
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full h-9 rounded-xl bg-muted border border-border/40 text-xs font-medium"
                        >
                          <option value="Pakiza Software Limited">Pakiza Software Limited</option>
                          <option value="PIL-Operation">PIL-Operation</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Area</label>
                        <select
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="w-full h-9 rounded-xl bg-muted border border-border/40 text-xs font-medium"
                        >
                          <option value="PSL-Operation">PSL-Operation</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Employee Type</label>
                        <select
                          value={empType}
                          onChange={(e) => setEmpType(e.target.value)}
                          className="w-full h-9 rounded-xl bg-muted border border-border/40 text-xs font-medium"
                        >
                          <option value="ALL">ALL</option>
                          <option value="Staff">Staff</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Section</label>
                        <select
                          value={section}
                          onChange={(e) => setSection(e.target.value)}
                          className="w-full h-9 rounded-xl bg-muted border border-border/40 text-xs font-medium"
                        >
                          <option value="ALL">ALL</option>
                          {sectionsList.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Designation</label>
                        <select
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          className="w-full h-9 rounded-xl bg-muted border border-border/40 text-xs font-medium"
                        >
                          <option value="ALL">ALL</option>
                          {designationsList.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-1 gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className="w-full sm:w-auto h-9 px-4 rounded-xl border border-border hover:bg-muted text-xs font-bold flex items-center justify-center gap-1.5 transition text-muted-foreground hover:text-foreground"
                    >
                      <SlidersHorizontal className="size-3.5 text-primary" />
                      <span>{showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters (9)"}</span>
                    </button>

                    <div className="w-full sm:w-auto flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="h-9.5 px-6 border border-border hover:bg-muted text-muted-foreground hover:text-foreground font-extrabold text-xs rounded-xl transition uppercase tracking-wider"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="h-9.5 px-8 bg-primary hover:opacity-95 text-primary-foreground font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        <Filter className="size-3.5" />
                        <span>Search Queue</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Action Row & Main Datagrid Container */}
              <div className="bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b border-border/40 print:hidden">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert("Excel exported successfully.")}
                      className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition flex items-center gap-1.5"
                    >
                      <FileSpreadsheet className="size-3.5 text-emerald-500" />
                      <span>Excel</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition flex items-center gap-1.5"
                    >
                      <Printer className="size-3.5 text-primary" />
                      <span>Print</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 ml-auto w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 lg:w-72">
                      <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name, ID, department..."
                        className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/40">
                        <th className="sticky left-0 bg-[#f1f5f9] dark:bg-[#0f172a] px-2 py-4 font-bold border-r border-border/30 z-20 w-[110px] min-w-[110px] text-center">
                          <input type="checkbox" checked={filteredRecords.length > 0 && selectedEmpIds.length === filteredRecords.length} onChange={toggleSelectAll} className="rounded border-border text-primary focus:ring-primary/20" />
                        </th>
                        <th className="px-3 py-4 text-center font-bold">#</th>
                        <th className="sticky left-[110px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-4 font-bold border-r border-border/30 z-20 w-[100px] min-w-[100px]">Emp ID</th>
                        <th className="sticky left-[210px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-4 font-bold border-r border-border/40 z-20 w-[180px] min-w-[180px]">Name</th>
                        {visibleCols.department && <th className="px-5 py-4 font-bold">Department</th>}
                        {visibleCols.section && <th className="px-5 py-4 font-bold">Section</th>}
                        {visibleCols.designation && <th className="px-5 py-4 font-bold">Designation</th>}
                        {visibleCols.joiningDate && <th className="px-5 py-4 font-bold text-center">Joining Date</th>}
                        {visibleCols.prevGross && <th className="px-5 py-4 font-bold text-right">Prev. Gross</th>}
                        {visibleCols.lastIncDate && <th className="px-5 py-4 font-bold text-center">Last Inc Date</th>}
                        {visibleCols.lastIncAmount && <th className="px-5 py-4 font-bold text-right">Last Inc Amount</th>}
                        {visibleCols.grossAfterInc && <th className="px-5 py-4 font-bold text-right">Gross after Inc.</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/45">
                      {filteredRecords.map((row, idx) => {
                        const isSelected = selectedEmpIds.includes(row.empId);
                        const stickyCellBgClass = isSelected
                          ? "bg-[#f1f5f9] dark:bg-[#1e293b] group-hover:bg-[#e2e8f0]"
                          : "bg-card group-hover:bg-[#f8fafc] dark:group-hover:bg-[#1e293b]";

                        return (
                          <tr key={row.empId} className={`group ${isSelected ? "bg-[#f1f5f9] dark:bg-[#1e293b]" : "hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]"}`}>
                            <td className={`sticky left-0 ${stickyCellBgClass} px-2 py-2 border-r border-border/30 z-10 w-[110px] text-center`}>
                              <div className="flex items-center gap-1.5 justify-center">
                                <input type="checkbox" checked={isSelected} onChange={() => toggleSelectEmp(row.empId)} className="rounded text-primary" />
                                <button className="size-6 bg-primary text-primary-foreground rounded hover:opacity-90 transition flex items-center justify-center" onClick={() => handleStartEdit(row)}>
                                  <Edit className="size-3" />
                                </button>
                                <button className="size-6 border border-border rounded flex items-center justify-center" onClick={() => handleStartEdit(row)}>
                                  <Settings className="size-3" />
                                </button>
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-center font-semibold text-muted-foreground/80 font-mono">{idx + 1}</td>
                            <td className={`sticky left-[110px] ${stickyCellBgClass} px-3 py-3.5 font-bold text-primary font-mono`}>{row.empId}</td>
                            <td className={`sticky left-[210px] ${stickyCellBgClass} px-3 py-3.5 font-bold text-foreground truncate w-[180px]`}>{row.empName}</td>
                            {visibleCols.department && <td className="px-5 py-3.5 text-foreground/80">{row.department}</td>}
                            {visibleCols.section && <td className="px-5 py-3.5 text-muted-foreground/90">{row.section}</td>}
                            {visibleCols.designation && <td className="px-5 py-3.5 font-semibold">{row.designation}</td>}
                            {visibleCols.joiningDate && <td className="px-5 py-3.5 text-center font-mono">{row.joiningDate}</td>}
                            {visibleCols.prevGross && <td className="px-5 py-3.5 text-right font-mono">৳{row.prevGross?.toLocaleString()}</td>}
                            {visibleCols.lastIncDate && <td className="px-5 py-3.5 text-center font-mono">{row.lastIncDate || "—"}</td>}
                            {visibleCols.lastIncAmount && <td className="px-5 py-3.5 text-right font-mono text-primary font-bold">৳{row.lastIncAmount?.toLocaleString()}</td>}
                            {visibleCols.grossAfterInc && <td className="px-5 py-3.5 text-right font-mono text-primary font-black">৳{row.grossAfterInc?.toLocaleString()}</td>}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: HR ENDORSEMENTS */}
          {activeConsoleTab === "hr" && (
            <div className="bg-card rounded-lg border border-border/80 p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                <ClipboardCheck className="size-4.5 text-primary" />
                <span>Pending Human Resource Signatures & Endorsements</span>
              </h3>

              <div className="space-y-4">
                {mockHrEndorsements.map(item => (
                  <div key={item.id} className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="text-xs font-black text-foreground">{item.name} ({item.id})</div>
                      <div className="text-[10px] text-muted-foreground font-semibold mt-1">Proposed adjustment of <strong className="text-primary">৳{item.amount.toLocaleString()}</strong> on {item.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => showToast(`Increment endorsement declined/rolled back for ${item.name}.`)} className="h-8 px-4 border border-border hover:bg-muted text-xs font-bold text-muted-foreground rounded-lg transition">Rollback</button>
                      <button onClick={() => showToast(`HR digital endorsement successfully compiled for ${item.name}!`)} className="h-8 px-4 bg-primary text-primary-foreground text-xs font-bold rounded-lg transition hover:opacity-90">Endorse & Sign</button>
                    </div>
                  </div>
                ))}

                {mockHrEndorsements.length === 0 && (
                  <div className="text-center py-12 text-xs font-semibold text-muted-foreground">No HR endorsement actions required.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EXECUTIVE MD APPROVALS */}
          {activeConsoleTab === "md" && (
            <div className="bg-card rounded-lg border border-border/80 p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4.5 text-primary" />
                <span>Executive authorizations (Managing Director Final Signoff)</span>
              </h3>

              <div className="space-y-4">
                {mockExecApprovals.map(item => (
                  <div key={item.id} className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-black text-foreground">{item.name}</div>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">Executive appraisal</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">
                      Scale adjustment proposal: <strong>৳{item.amount.toLocaleString()}</strong>
                      <div className="text-[10px] text-muted-foreground/80 mt-1 italic">HOD Remarks: "{item.justification}"</div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-border/20">
                      <button onClick={() => showToast("Authorisation rolled back with query notification.")} className="h-8 px-4 border border-[#ef4444]/20 text-[#ef4444] hover:bg-[#ef4444]/5 text-xs font-bold rounded-lg transition">Rollback</button>
                      <button onClick={() => showToast("Final salary scale adjustment executed and committed to active payroll registers!")} className="h-8 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-2xs">Authorise & Execute</button>
                    </div>
                  </div>
                ))}

                {mockExecApprovals.length === 0 && (
                  <div className="text-center py-12 text-xs font-semibold text-muted-foreground">No final authorizations pending in executive queues.</div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 💥 STATE-OF-THE-ART TWO-COLUMN SPLIT & TABBED INTERACTIVE WORKSPACE MODAL */}
      {/* ========================================================================= */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090d16]/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-6xl rounded-3xl border border-border/80 shadow-2xl relative animate-in zoom-in-95 duration-200 text-foreground overflow-hidden my-4 flex flex-col max-h-[92vh]">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/40 bg-muted/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-8.5 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center shadow-md">
                  <Sparkle className="size-4.5 animate-spin-slow" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-tight text-foreground leading-none">
                    Configure Salary Adjustment Queue
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                    Split-screen layout with segmented configurations for extreme user friendliness.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingRecord(null)}
                className="size-8.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition border border-border/40 bg-card"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Split-Screen Inner Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT PILLAR (40%): Employee profile dossier & live comparative card */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-blue-500" />

                    <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3.5 flex items-center gap-1.5">
                      <UserCog className="size-4" />
                      <span>Employee Baseline Profile</span>
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Employee ID</span>
                        <span className="text-xs font-bold text-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-md border border-border/20">
                          {editingRecord.empId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</span>
                        <span className="text-xs font-bold text-foreground truncate max-w-[180px]" title={editingRecord.empName}>
                          {editingRecord.empName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Department</span>
                        <span className="text-xs font-semibold text-foreground truncate max-w-[180px]" title={editingRecord.department}>
                          {editingRecord.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border border-emerald-500/20 p-5 shadow-xs relative overflow-hidden bg-gradient-to-b from-card to-green-500/[0.01]">
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-green-500" />

                    <h3 className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-3.5 flex items-center gap-1.5">
                      <TrendingUp className="size-4" />
                      <span>Ledger Impact Summary</span>
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/40 p-3 rounded-xl border border-border/40">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">Before</span>
                          <div className="text-sm font-black text-foreground font-mono mt-0.5">
                            ৳{computedModalStats.oldGross.toLocaleString("en-IN")}
                          </div>
                        </div>

                        <div className="bg-green-500/5 border border-green-500/20 p-3 rounded-xl">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-green-500">Increment</span>
                          <div className="text-sm font-black text-green-600 dark:text-green-400 font-mono mt-0.5">
                            +৳{computedModalStats.delta.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-muted/40 rounded-xl border border-border/40 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary">New Outlay</span>
                          <div className="text-base font-black text-primary font-mono mt-0.5">
                            ৳{computedModalStats.newGross.toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">Percentage Shift</span>
                          <div className="text-xs font-black text-green-600 mt-0.5 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/15">
                            +{computedModalStats.percent.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT PILLAR (60%): Segmented Tab configurator console */}
                <div className="lg:col-span-7 bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden flex flex-col min-h-[460px]">

                  {/* Tab Selector Bar */}
                  <div className="flex border-b border-border/40 bg-muted/30 shrink-0">
                    <button
                      type="button"
                      onClick={() => setModalActiveTab("schedule")}
                      className={`flex-1 py-3 px-2 text-[10.5px] font-extrabold uppercase tracking-wider text-center border-b-2 transition flex items-center justify-center gap-1.5 ${modalActiveTab === "schedule" ? "border-primary text-primary bg-card" : "border-transparent text-muted-foreground hover:bg-muted/10 hover:text-foreground"}`}
                    >
                      <Calendar className="size-3.5" />
                      <span className="hidden sm:inline">1. Schedule</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalActiveTab("adjust")}
                      className={`flex-1 py-3 px-2 text-[10.5px] font-extrabold uppercase tracking-wider text-center border-b-2 transition flex items-center justify-center gap-1.5 ${modalActiveTab === "adjust" ? "border-primary text-primary bg-card" : "border-transparent text-muted-foreground hover:bg-muted/10 hover:text-foreground"}`}
                    >
                      <Settings className="size-3.5" />
                      <span className="hidden sm:inline">2. Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalActiveTab("allowances")}
                      className={`flex-1 py-3 px-2 text-[10.5px] font-extrabold uppercase tracking-wider text-center border-b-2 transition flex items-center justify-center gap-1.5 ${modalActiveTab === "allowances" ? "border-primary text-primary bg-card" : "border-transparent text-muted-foreground hover:bg-muted/10 hover:text-foreground"}`}
                    >
                      <Banknote className="size-3.5" />
                      <span className="hidden sm:inline">3. Splits</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalActiveTab("promotion")}
                      className={`flex-1 py-3 px-2 text-[10.5px] font-extrabold uppercase tracking-wider text-center border-b-2 transition flex items-center justify-center gap-1.5 ${modalActiveTab === "promotion" ? "border-primary text-primary bg-card" : "border-transparent text-muted-foreground hover:bg-muted/10 hover:text-foreground"}`}
                    >
                      <Briefcase className="size-3.5" />
                      <span className="hidden sm:inline">4. Promotion</span>
                    </button>
                  </div>

                  {/* Tab Panels content area */}
                  <div className="p-6 flex-1">

                    {/* TAB 1: SCHEDULE */}
                    {modalActiveTab === "schedule" && (
                      <div className="space-y-5 animate-in fade-in duration-200">
                        <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 mb-2">
                          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block mb-1">📅 Timeframe & Operations Class</span>
                          <p className="text-[11px] text-muted-foreground">Select the year, month, and date this salary adjustment should be committed to active payroll registers.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Effective Year</label>
                            <select value={editYear} onChange={(e) => setEditYear(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold">
                              <option value="2026">2026</option>
                              <option value="2025">2025</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Effective Month</label>
                            <select value={editMonth} onChange={(e) => setEditMonth(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold">
                              <option value="May">May</option>
                              <option value="January">January</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Increment Date</label>
                            <input type="text" value={editIncDate} onChange={(e) => setEditIncDate(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border/40 text-xs font-bold" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Increment Type</label>
                            <select value={editIncType} onChange={(e) => setEditIncType(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold">
                              <option value="General">General</option>
                              <option value="Special">Special</option>
                              <option value="Promotion">Promotion</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: ADJUST SETTINGS */}
                    {modalActiveTab === "adjust" && (
                      <div className="space-y-5 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Increment By</label>
                            <select value={editIncBy} onChange={(e) => setEditIncBy(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold">
                              <option value="Gross">Gross Amount</option>
                              <option value="Basic">Basic Amount</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Calculation Model</label>
                            <select value={editCalBy} onChange={(e) => setEditCalBy(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold">
                              <option value="Fixed">Fixed Flat Amount (৳)</option>
                              <option value="Percentage">Percentage Increment (%)</option>
                            </select>
                          </div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-xl border border-border/40 space-y-3">
                          <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-primary block">Quick-Apply Percentage Preset</span>
                          <div className="flex gap-1.5 flex-wrap">
                            {[5, 10, 12.5, 15, 20].map(pct => (
                              <button type="button" key={pct} onClick={() => applyPresetPercentage(pct)} className="h-8 px-3.5 rounded-lg border border-border bg-card text-xs font-extrabold hover:bg-primary hover:text-primary-foreground transition duration-150">+{pct}%</button>
                            ))}
                          </div>
                          <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                              <span>Interactive slider</span>
                              <span className="text-foreground font-extrabold font-mono">{editCalBy === "Percentage" ? `${editIncrementVal}%` : `৳${parseFloat(editIncrementVal).toLocaleString()}`}</span>
                            </div>
                            <input type="range" min={editCalBy === "Percentage" ? 1 : 500} max={editCalBy === "Percentage" ? 50 : 25000} step={editCalBy === "Percentage" ? 0.5 : 500} value={parseFloat(editIncrementVal) || 0} onChange={(e) => setEditIncrementVal(e.target.value)} className="w-full h-1.5 rounded-lg bg-border accent-primary cursor-pointer" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                          <div className="space-y-1.5 bg-primary/5 p-2 rounded-xl border border-primary/15">
                            <label className="text-[10px] font-black uppercase tracking-wider text-primary">Adjuster Value {editCalBy === "Percentage" ? "(%)" : "(৳)"}</label>
                            <input type="text" value={editIncrementVal} onChange={(e) => setEditIncrementVal(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-card border border-border/40 text-xs font-black text-primary font-mono focus:ring-1 focus:ring-primary/25 outline-none" />
                          </div>

                          <div className="flex items-center gap-2.5 px-2 py-4">
                            <input type="checkbox" id="modal-arrear" checked={editArrear} onChange={(e) => setEditArrear(e.target.checked)} className="rounded border-border text-primary focus:ring-primary/20 cursor-pointer size-4.5" />
                            <label htmlFor="modal-arrear" className="text-xs font-extrabold text-slate-700 dark:text-slate-300 cursor-pointer">Mark as Backlog Arrear</label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: ALLOWANCES SPLITS */}
                    {modalActiveTab === "allowances" && (
                      <div className="space-y-5 animate-in fade-in duration-200">
                        <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/10 mb-1 flex items-center gap-2">
                          <Info className="size-4 text-green-600 shrink-0" />
                          <p className="text-[10.5px] text-muted-foreground font-semibold">Salary allocations split dynamically based on scale ratios. Modify inputs below for manual adjustments.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Inc Basic</label>
                            <input type="text" value={editIncBasic} onChange={(e) => setEditIncBasic(e.target.value)} className="w-full h-9.5 px-3 rounded-xl bg-card border border-border/40 text-xs font-bold font-mono" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Inc Gross</label>
                            <input type="text" value={editIncGross} onChange={(e) => setEditIncGross(e.target.value)} className="w-full h-9.5 px-3 rounded-xl bg-card border border-border/40 text-xs font-bold font-mono" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">House Rent</label>
                            <input type="text" value={editHouseRent} onChange={(e) => setEditHouseRent(e.target.value)} className="w-full h-9.5 px-3 rounded-xl bg-card border border-border/40 text-xs font-bold font-mono" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Medical</label>
                            <input type="text" value={editMedical} onChange={(e) => setEditMedical(e.target.value)} className="w-full h-9.5 px-3 rounded-xl bg-card border border-border/40 text-xs font-bold font-mono" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 4: PROMOTION */}
                    {modalActiveTab === "promotion" && (
                      <div className="space-y-5 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Prom Type</label>
                            <select value={editPromType} onChange={(e) => setEditPromType(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold">
                              <option value="ALL">ALL</option>
                              <option value="Designation">Designation</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">New Designation</label>
                            <select value={editPromJobTitle} onChange={(e) => setEditPromJobTitle(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold">
                              <option value="ALL">ALL</option>
                              <option value="Sr. Executive">Sr. Executive</option>
                              <option value="Manager">Manager</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Remarks / Notes</label>
                          <textarea value={editRemarks} onChange={(e) => setEditRemarks(e.target.value)} rows={4} className="w-full p-3.5 rounded-lg bg-muted border border-border/40 text-xs font-semibold focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none" />
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>

            {/* Modal Bottom Sticky Footer Controls */}
            <div className="p-5 border-t border-border/40 bg-muted/20 shrink-0 flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold text-muted-foreground hidden md:inline">* Dynamic split engine scales variables immediately. Ensure audit reviews before submitting.</span>
              <div className="flex gap-2 ml-auto w-full md:w-auto justify-end">
                <button type="button" onClick={() => setEditingRecord(null)} className="h-10 px-5 border border-border hover:bg-muted text-muted-foreground font-extrabold text-xs rounded-xl transition uppercase tracking-wider">Close</button>
                <button type="button" onClick={handleSaveIncrement} className="h-10 px-8 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider">Submit Changes</button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
