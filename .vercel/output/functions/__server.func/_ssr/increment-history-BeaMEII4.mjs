import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { r as rawIncrementRecords } from "./-increment-history-data-DfeZd3zT.mjs";
import { C as ChevronRight, i as Plus, aD as FileClock, al as TrendingUp, d as FileText, u as SlidersHorizontal, Y as ChevronDown, aR as Funnel, P as Printer, an as UserCog, ax as FileSpreadsheet, ay as FileDown, S as Search, aF as LayoutGrid, a5 as Check, E as Eye, aG as EyeOff, ae as Sparkles, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/cmdk.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/tslib.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
const defaultColumns = {
  department: true,
  section: true,
  designation: true,
  joiningDate: true,
  salaryJoining: false,
  salaryBasic: false,
  salaryGross: true,
  inc2014: false,
  inc2015: false,
  inc2016: false,
  inc2017: false,
  inc2018: false,
  inc2019: false,
  inc2020: false,
  inc2021: false,
  inc2022: false,
  inc2023: true,
  inc2024: true,
  inc2025: true,
  total: true,
  lastIncDate: false,
  lastIncAmount: false,
  lastPromotion: false
};
function IncrementHistoryPage() {
  const [company, setCompany] = reactExports.useState("Pakiza Software Limited");
  const [area, setArea] = reactExports.useState("PSL-Operation");
  const [empType, setEmpType] = reactExports.useState("ALL");
  const [department, setDepartment] = reactExports.useState("All Departments");
  const [section, setSection] = reactExports.useState("ALL");
  const [appliedFilters, setAppliedFilters] = reactExports.useState({
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    empType: "ALL",
    department: "All Departments",
    section: "ALL"
  });
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedEmpIds, setSelectedEmpIds] = reactExports.useState([]);
  const [selectedRecord, setSelectedRecord] = reactExports.useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = reactExports.useState(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = reactExports.useState(false);
  const [visibleCols, setVisibleCols] = reactExports.useState(defaultColumns);
  const [isColSelectorOpen, setIsColSelectorOpen] = reactExports.useState(false);
  const [sortField, setSortField] = reactExports.useState("");
  const [sortAsc, setSortAsc] = reactExports.useState(true);
  const [activeReportsTab, setActiveReportsTab] = reactExports.useState("history");
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters({
      company,
      area,
      empType,
      department,
      section
    });
  };
  const departmentsList = reactExports.useMemo(() => {
    const depts = new Set(rawIncrementRecords.map((r) => r.department));
    return Array.from(depts).sort();
  }, []);
  const sectionsList = reactExports.useMemo(() => {
    const filteredDepts = department === "All Departments" ? rawIncrementRecords : rawIncrementRecords.filter((r) => r.department === department);
    const sections = new Set(filteredDepts.map((r) => r.section));
    return Array.from(sections).sort();
  }, [department]);
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
      section: "ALL"
    });
  };
  const toggleSelectAll = () => {
    if (filteredRecords.length === 0) return;
    if (selectedEmpIds.length === filteredRecords.length) {
      setSelectedEmpIds([]);
    } else {
      setSelectedEmpIds(filteredRecords.map((r) => r.empId));
    }
  };
  const toggleSelectEmp = (empId) => {
    setSelectedEmpIds((prev) => prev.includes(empId) ? prev.filter((item) => item !== empId) : [...prev, empId]);
  };
  const toggleColumn = (key) => {
    setVisibleCols((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  reactExports.useEffect(() => {
    if (!isColSelectorOpen) return;
    const handleOutsideClick = (e) => {
      const target = e.target;
      if (!target.closest(".col-selector-container")) {
        setIsColSelectorOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isColSelectorOpen]);
  const filteredRecords = reactExports.useMemo(() => {
    let list = [...rawIncrementRecords];
    if (appliedFilters.department !== "All Departments") {
      list = list.filter((r) => r.department === appliedFilters.department);
    }
    if (appliedFilters.section !== "ALL") {
      list = list.filter((r) => r.section === appliedFilters.section);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => r.empId.toLowerCase().includes(q) || r.empName.toLowerCase().includes(q) || r.designation.toLowerCase().includes(q) || r.section.toLowerCase().includes(q) || r.department.toLowerCase().includes(q));
    }
    if (sortField) {
      list.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === "number" && typeof valB === "number") {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
      });
    }
    return list;
  }, [appliedFilters, searchQuery, sortField, sortAsc]);
  const totalGrossPayroll = reactExports.useMemo(() => {
    return rawIncrementRecords.reduce((sum, r) => sum + r.salaryGross, 0);
  }, []);
  const totalIncrementedIn2025 = reactExports.useMemo(() => {
    return rawIncrementRecords.filter((r) => r.inc2025 !== "0" && r.inc2025 !== "0(0)").length;
  }, []);
  const renderIncrementCell = (val) => {
    if (!val || val === "0" || val === "0.00") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/35 dark:text-slate-700 font-mono text-[10.5px]", children: "—" });
    }
    const pMatch = val.match(/^(\d+)\(P\)$/);
    if (pMatch) {
      const amount = parseInt(pMatch[1]).toLocaleString();
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-amber-600 dark:text-amber-400 text-[10.5px]", children: amount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7.5px] px-1 bg-amber-500/15 text-amber-600 border border-amber-500/20 rounded font-black select-none cursor-default", title: "Promotion Granted", children: "P" })
      ] });
    }
    const numVal = parseInt(val);
    if (!isNaN(numVal)) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-slate-700 dark:text-slate-300 text-[10.5px]", children: numVal.toLocaleString() });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-[10.5px]", children: val });
  };
  const renderTotalCell = (val) => {
    if (!val || val === "0(0)") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30 dark:text-slate-700 font-mono text-[10.5px]", children: "0" });
    }
    const match = val.match(/^(\d+)\((\d+)\)$/);
    if (match) {
      const amount = parseInt(match[1]).toLocaleString();
      const count = parseInt(match[2]);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-black text-primary text-[10.5px]", children: amount }),
        count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7.5px] px-1 bg-primary/10 text-primary border border-primary/20 rounded font-black select-none", title: `${count} Promotion(s)`, children: count })
      ] });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-[10.5px]", children: val });
  };
  const handlePrint = () => {
    window.print();
  };
  const triggerBulkAction = (actionName) => {
    alert(`Bulk Operation [${actionName}] applied successfully to ${selectedEmpIds.length} employees!`);
    setSelectedEmpIds([]);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative print:p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 lg:p-8 space-y-6 print:p-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:text-primary transition-colors", children: "Human Resource" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Increment HistoryList" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-extrabold tracking-tight text-foreground", children: "Increment HistoryList" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/70 rounded-xl px-3.5 py-1.5 shadow-2xs hover:shadow-xs transition duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80", children: "Total Staff" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-extrabold text-foreground mt-0.5", children: rawIncrementRecords.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[oklch(0.98_0.02_160)] dark:bg-[oklch(0.20_0.035_165)] border border-[oklch(0.62_0.16_155/0.2)] rounded-xl px-3.5 py-1.5 shadow-2xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold uppercase tracking-wider text-success/90", children: "Incremented(2025)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-extrabold text-success mt-0.5", children: totalIncrementedIn2025 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/70 rounded-xl px-3.5 py-1.5 shadow-2xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80", children: "Total Gross Budget" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-extrabold text-foreground mt-0.5", children: [
                "৳",
                (totalGrossPayroll / 1e5).toFixed(1),
                "L"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/propose-increment", className: "h-9.5 px-4 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-semibold shadow-xs hover:shadow-sm hover:opacity-95 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              " Propose Increment"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-1.5 shadow-2xs flex gap-1 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveReportsTab("history"), className: `flex-1 sm:flex-none h-10 px-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeReportsTab === "history" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileClock, { className: "size-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📊 History Ledger" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveReportsTab("summary"), className: `flex-1 sm:flex-none h-10 px-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeReportsTab === "summary" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📈 Cumulative Summary" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveReportsTab("reports"), className: `flex-1 sm:flex-none h-10 px-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeReportsTab === "reports" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📄 Parameterized Reports" })
          ] })
        ] }),
        activeReportsTab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 print:hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-primary/10 via-primary/45 to-primary/10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsFilterCollapsed(!isFilterCollapsed), className: "flex items-center gap-2 text-xs font-bold text-foreground/90 hover:text-primary transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "size-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Search Parameters & Filters" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `size-3.5 text-muted-foreground/60 transition-transform duration-300 ${isFilterCollapsed ? "-rotate-90" : ""}` })
              ] }),
              !isFilterCollapsed && (department !== "All Departments" || section !== "ALL" || empType !== "ALL") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: resetFilters, className: "text-[10px] font-bold text-destructive hover:underline", children: "Clear All Filters" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `transition-all duration-300 overflow-hidden ${isFilterCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100 p-5"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearchSubmit, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Company" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: company, onChange: (e) => setCompany(e.target.value), className: "w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pakiza Software Limited", children: "Pakiza Software Limited" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pakiza Software Limited (PIL-Operation)", children: "Pakiza Software Limited (PIL-Operation)" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Area" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: area, onChange: (e) => setArea(e.target.value), className: "w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PSL-Operation", children: "PSL-Operation" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PSL-HeadOffice", children: "PSL-HeadOffice" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Employee Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: empType, onChange: (e) => setEmpType(e.target.value), className: "w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Staff", children: "Staff" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Worker", children: "Worker" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Department" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: department, onChange: (e) => {
                    setDepartment(e.target.value);
                    setSection("ALL");
                  }, className: "w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "All Departments", children: "All Departments" }),
                    departmentsList.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d, children: d }, d))
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Section" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: section, onChange: (e) => setSection(e.target.value), className: "w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                    sectionsList.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-1 md:col-span-2 lg:col-span-5 flex justify-end pt-1 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: resetFilters, className: "h-9 px-6 border border-border hover:bg-muted text-muted-foreground hover:text-foreground font-extrabold text-xs rounded-xl transition uppercase tracking-wider", children: "Reset" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "h-9 px-8 bg-primary hover:opacity-95 text-primary-foreground font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "size-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Search" })
                ] })
              ] })
            ] }) })
          ] }),
          selectedEmpIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-primary/25 shadow-xs p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 print:hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 pb-3 border-b border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary", children: [
                  selectedEmpIds.length,
                  " Selected"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-foreground tracking-tight", children: "Active Increment History Operations Console" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedEmpIds([]), className: "text-[10px] font-extrabold text-muted-foreground hover:text-primary transition", children: "Clear Selection" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => triggerBulkAction("Print Selected Profiles"), className: "flex flex-col items-center justify-center p-3 rounded-xl border border-border/40 bg-card text-center gap-1.5 transition-all hover:scale-102 hover:shadow-2xs text-blue-500 hover:bg-blue-500/5 hover:border-blue-500/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold tracking-tight whitespace-nowrap leading-none", children: "Print Selected" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => triggerBulkAction("Bulk Export PDF Register"), className: "flex flex-col items-center justify-center p-3 rounded-xl border border-border/40 bg-card text-center gap-1.5 transition-all hover:scale-102 hover:shadow-2xs text-rose-500 hover:bg-rose-500/5 hover:border-rose-500/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileClock, { className: "size-4.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold tracking-tight whitespace-nowrap leading-none", children: "PDF Register" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => triggerBulkAction("Consolidated Audit Review"), className: "flex flex-col items-center justify-center p-3 rounded-xl border border-border/40 bg-card text-center gap-1.5 transition-all hover:scale-102 hover:shadow-2xs text-emerald-500 hover:bg-emerald-500/5 hover:border-emerald-500/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "size-4.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold tracking-tight whitespace-nowrap leading-none", children: "Audit Review" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b border-border/40 print:hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert("Excel payload generation active! 58 records serialized successfully."), className: "h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-3.5 text-emerald-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Excel" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handlePrint, className: "h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Print" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsPdfModalOpen(true), className: "h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-3.5 text-rose-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PDF Register" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 ml-auto w-full md:w-auto", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 md:w-64 lg:w-72", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search name, ID, section, designation...", className: "w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative col-selector-container", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsColSelectorOpen(!isColSelectorOpen), className: "h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-bold text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition duration-200", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "size-3.5 text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Columns" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground/60" })
                  ] }),
                  isColSelectorOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-1.5 w-56 rounded-xl bg-card border border-border/80 shadow-lg p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150 text-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-2 mb-2 border-b border-border/30", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Show Columns" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setVisibleCols(defaultColumns), className: "text-[9px] font-bold text-primary hover:underline", children: "Reset" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 max-h-64 overflow-y-auto pr-1", children: Object.keys(defaultColumns).map((colKey) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggleColumn(colKey), className: "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs hover:bg-muted transition duration-150", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-4 rounded-md border flex items-center justify-center transition-all ${visibleCols[colKey] ? "bg-primary border-primary text-primary-foreground" : "border-border"}`, children: visibleCols[colKey] && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-2.5 stroke-[3.5]" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground/80 capitalize", children: colKey.replace(/([A-Z])/g, " $1").toLowerCase().replace(/inc (\d+)/g, "Increment ($1)") })
                    ] }, colKey)) })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f1f5f9] dark:bg-[#0f172a] px-2 py-4 font-bold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[110px] min-w-[110px] max-w-[110px] text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: filteredRecords.length > 0 && selectedEmpIds.length === filteredRecords.length, onChange: toggleSelectAll, className: "rounded border-border text-primary focus:ring-primary/20 cursor-pointer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "∇" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[110px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-4 font-bold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[100px] min-w-[100px] max-w-[100px]", children: "Emp ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[210px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-4 font-bold border-r border-border/40 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[180px] min-w-[180px] max-w-[180px]", children: "Name" }),
                visibleCols.department && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Department" }),
                visibleCols.section && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Section" }),
                visibleCols.designation && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Designation" }),
                visibleCols.joiningDate && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-center", children: "Joining Date" }),
                visibleCols.salaryJoining && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-right", children: "Salary(Joining)" }),
                visibleCols.salaryBasic && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-right", children: "Salary(Basic)" }),
                visibleCols.salaryGross && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-right", children: "Salary(Gross)" }),
                ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"].map((yr) => {
                  const colKey = `inc${yr}`;
                  return visibleCols[colKey] && /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "px-4 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-center", children: [
                    "Inc(",
                    yr,
                    ")"
                  ] }, yr);
                }),
                visibleCols.total && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-center", children: "Total" }),
                visibleCols.lastIncDate && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-center", children: "Last Inc Date" }),
                visibleCols.lastIncAmount && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-right", children: "Last Inc Amount" }),
                visibleCols.lastPromotion && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] text-center", children: "Last Promotion" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/45", children: [
                filteredRecords.map((row, idx) => {
                  const isSelected = selectedRecord?.empId === row.empId;
                  const stickyCellBgClass = isSelected ? "bg-[#f1f5f9] dark:bg-[#1e293b] group-hover:bg-[#e2e8f0] dark:group-hover:bg-[#334155]" : "bg-card group-hover:bg-[#f8fafc] dark:group-hover:bg-[#1e293b]";
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { onClick: () => setSelectedRecord(row), className: `group transition-all cursor-pointer ${isSelected ? "bg-[#f1f5f9] dark:bg-[#1e293b]" : "hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]"}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `sticky left-0 ${stickyCellBgClass} px-2 py-2 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[110px] min-w-[110px] max-w-[110px] transition-all`, onClick: (event) => event.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 justify-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedEmpIds.includes(row.empId), onChange: () => toggleSelectEmp(row.empId), className: "rounded border-border text-primary focus:ring-primary/20 cursor-pointer" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-6 bg-amber-500 text-white rounded hover:bg-amber-600 transition flex items-center justify-center shadow-2xs", onClick: () => setSelectedRecord(row), title: "Audit breakdown summary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-6 border border-border hover:bg-muted text-muted-foreground hover:text-primary rounded transition flex items-center justify-center", onClick: () => setSelectedRecord(row), title: "View Compensation", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3" }) })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `sticky left-[110px] ${stickyCellBgClass} px-3 py-3.5 font-bold text-primary border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[100px] min-w-[100px] max-w-[100px] transition-all font-mono text-[11px]`, children: row.empId }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `sticky left-[210px] ${stickyCellBgClass} px-3 py-3.5 font-bold text-foreground border-r border-border/40 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[180px] min-w-[180px] max-w-[180px] transition-all`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-6.5 rounded-lg bg-primary/10 text-[9px] font-bold text-primary flex items-center justify-center shadow-2xs", children: row.empName.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[125px]", children: row.empName })
                    ] }) }),
                    visibleCols.department && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-foreground/80 font-medium", children: row.department }),
                    visibleCols.section && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/90 font-medium", children: row.section }),
                    visibleCols.designation && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-semibold text-foreground", children: row.designation }),
                    visibleCols.joiningDate && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-mono text-muted-foreground/80 font-semibold", children: row.joiningDate }),
                    visibleCols.salaryJoining && /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-mono font-semibold text-foreground/90", children: [
                      "৳",
                      row.salaryJoining.toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                      })
                    ] }),
                    visibleCols.salaryBasic && /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-mono font-semibold text-foreground/90", children: [
                      "৳",
                      row.salaryBasic.toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                      })
                    ] }),
                    visibleCols.salaryGross && /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-mono font-bold text-primary", children: [
                      "৳",
                      row.salaryGross.toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                      })
                    ] }),
                    ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"].map((yr) => {
                      const colKey = `inc${yr}`;
                      const rowVal = row[colKey];
                      return visibleCols[colKey] && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-center", children: renderIncrementCell(rowVal) }, yr);
                    }),
                    visibleCols.total && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: renderTotalCell(row.total) }),
                    visibleCols.lastIncDate && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-mono text-muted-foreground/80 font-semibold", children: row.lastIncDate || "—" }),
                    visibleCols.lastIncAmount && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right font-mono font-semibold text-muted-foreground/80", children: row.lastIncAmount ? `৳${parseFloat(row.lastIncAmount).toLocaleString()}` : "—" }),
                    visibleCols.lastPromotion && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center font-mono text-muted-foreground/80 font-semibold", children: row.lastPromotion || "—" })
                  ] }, row.sl);
                }),
                filteredRecords.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 30, className: "px-5 py-16 text-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-8 text-muted-foreground/45" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-xs", children: "No employees match the specified increment history search parameters." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: resetFilters, className: "text-[10px] font-bold text-primary hover:underline mt-1", children: "Clear Filters" })
                ] }) }) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-t border-border/40 bg-muted/15", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsPdfModalOpen(true), className: "h-8.5 px-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[10px] rounded-lg shadow-2xs hover:shadow-xs transition uppercase tracking-wider flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "View PDF Register" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-semibold text-muted-foreground/80", children: [
                  "Showing ",
                  filteredRecords.length > 0 ? 1 : 0,
                  " to ",
                  filteredRecords.length,
                  " of ",
                  rawIncrementRecords.length,
                  " entries"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-8 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted text-xs font-bold text-muted-foreground disabled:opacity-50 transition", disabled: true, children: "Previous" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-8 w-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-2xs", children: "1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-8 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted text-xs font-bold text-muted-foreground disabled:opacity-50 transition", disabled: true, children: "Next" })
              ] })
            ] })
          ] })
        ] }),
        activeReportsTab === "summary" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in duration-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-border/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase text-foreground", children: "Departmental Increment Summary Ledger" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5 font-bold uppercase", children: "Active Cycle Breakdown • PSL Operation" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert("Summary report Excel export started."), className: "h-8 px-3 rounded-lg border border-border/40 bg-card hover:bg-muted text-xs font-bold text-muted-foreground transition flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-3.5" }),
                " Excel"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert("Summary report PDF generation completed."), className: "h-8 px-3 rounded-lg border border-border/40 bg-card hover:bg-muted text-xs font-bold text-muted-foreground transition flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-3.5" }),
                " PDF"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Emp Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "Unit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "Line" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "Person Count" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-primary", children: "Increment Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "Inc Month" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Remarks" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20", children: [{
              type: "Office Executive",
              dept: "Admin",
              unit: "N/A",
              line: "N/A",
              count: 1,
              amount: 5e3,
              month: "Jan,2026",
              remarks: "null"
            }, {
              type: "Office Executive",
              dept: "Admin",
              unit: "PSL",
              line: "N/A",
              count: 1,
              amount: 2500,
              month: "Jan,2026",
              remarks: "null"
            }, {
              type: "Office Executive",
              dept: "APPS Team",
              unit: "PSL",
              line: "N/A",
              count: 1,
              amount: 1e4,
              month: "Jan,2026",
              remarks: "null"
            }, {
              type: "Office Executive",
              dept: "Business Analysis",
              unit: "PSL",
              line: "N/A",
              count: 1,
              amount: 2e3,
              month: "Jan,2026",
              remarks: "null"
            }, {
              type: "Office Executive",
              dept: "Core Development (HR)",
              unit: "PSL",
              line: "N/A",
              count: 3,
              amount: 24e3,
              month: "Jan,2026",
              remarks: "null"
            }, {
              type: "Office Executive",
              dept: "Core Sales",
              unit: "PSL",
              line: "N/A",
              count: 5,
              amount: 15e3,
              month: "Jan,2026",
              remarks: "null"
            }, {
              type: "Office Executive",
              dept: "DBA",
              unit: "PSL",
              line: "N/A",
              count: 1,
              amount: 2e3,
              month: "Jan,2026",
              remarks: "null"
            }, {
              type: "Office Executive",
              dept: "ERP Team",
              unit: "PSL",
              line: "N/A",
              count: 1,
              amount: 3e3,
              month: "Jan,2026",
              remarks: "null"
            }, {
              type: "Office Executive",
              dept: "ERP Team",
              unit: "PSL",
              line: "N/A",
              count: 1,
              amount: 6e3,
              month: "Jan,2026",
              remarks: "null"
            }, {
              type: "Office Executive",
              dept: "ERP Team",
              unit: "PSL",
              line: "N/A",
              count: 2,
              amount: 15e3,
              month: "Jan,2026",
              remarks: "null"
            }].map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/40 transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono font-bold text-muted-foreground/60", children: index + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-extrabold text-foreground", children: row.type }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-foreground", children: row.dept }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono text-muted-foreground", children: row.unit }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono text-muted-foreground", children: row.line }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-bold text-foreground", children: row.count }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono font-black text-primary", children: [
                "৳",
                row.amount.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-semibold text-muted-foreground", children: row.month }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground/50 italic", children: row.remarks })
            ] }, index)) })
          ] }) })
        ] }),
        activeReportsTab === "reports" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "size-4.5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Report Compilation Parameters" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Year" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2026", children: "2026" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2025", children: "2025" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Month" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Jan", children: "Jan" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Dec", children: "Dec" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Company" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pakiza", children: "Pakiza Software Limited" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Area" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PSL", children: "PSL-Operation" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert("Report records filtered."), className: "w-full h-8.5 bg-primary hover:opacity-95 text-primary-foreground font-extrabold text-[10px] rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5" }),
                " Compile Report"
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase text-foreground", children: "Compensation Appraisal & Increment Register" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert("Proposal Register exported to Excel."), className: "h-8 px-3 rounded-lg border border-border/40 bg-card hover:bg-muted text-xs font-bold text-muted-foreground transition flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-3.5" }),
                  " Excel"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert("Proposal Register printed."), className: "h-8 px-3 rounded-lg border border-border/40 bg-card hover:bg-muted text-xs font-bold text-muted-foreground transition flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5" }),
                  " Print"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "#" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "View (Inc)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "View (Prom)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3", children: "Employee ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Employee Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Department" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Section" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Designation (Before Inc.)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Designation (After Inc.)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Previous Gross" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20", children: [{
                id: "2025053673",
                name: "Md Jahid Hasan Polok",
                dept: "Core Development",
                sec: "General ERP (Com, A/C, Fixed Asset, Vat)",
                descBefore: "Sr. Executive",
                descAfter: "Sr. Executive",
                prevGross: 4e4
              }, {
                id: "2025056473",
                name: "Hasnain",
                dept: "HR, Admin and Compliance",
                sec: "Admin",
                descBefore: "Cleaner",
                descAfter: "Cleaner",
                prevGross: 11e3
              }, {
                id: "2025057067",
                name: "Sunit Corneleous Sarker",
                dept: "Business Automation (HR)",
                sec: "Core Development (HR)",
                descBefore: "Executive",
                descAfter: "Executive",
                prevGross: 28e3
              }, {
                id: "2025057437",
                name: "Towhidur Rahman",
                dept: "Implementation & Business Analysis",
                sec: "Business Analysis",
                descBefore: "Executive",
                descAfter: "Executive",
                prevGross: 25e3
              }, {
                id: "2025055045",
                name: "Md. Mahfuzur Rahman",
                dept: "Business Automation (HR)",
                sec: "Implementation & Support (HR)",
                descBefore: "Jr. Executive",
                descAfter: "Jr. Executive",
                prevGross: 18e3
              }].map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/40 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono font-bold text-muted-foreground/60", children: index + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert(`Showing increment dossier for employee: ${row.name}`), className: "h-6 px-2.5 rounded bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-black uppercase transition inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3" }),
                  " View"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert(`Showing promotion dossier for employee: ${row.name}`), className: "h-6 px-2.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase transition inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3" }),
                  " Prom"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-mono font-black text-foreground", children: row.id }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-extrabold text-foreground", children: row.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground font-semibold", children: row.dept }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground/80", children: row.sec }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground/80 font-bold", children: row.descBefore }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-primary font-extrabold", children: row.descAfter }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono font-bold text-foreground", children: [
                  "৳",
                  row.prevGross.toFixed(2)
                ] })
              ] }, row.id)) })
            ] }) })
          ] })
        ] })
      ] })
    ] }),
    selectedRecord && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-lg rounded-lg border border-border shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedRecord(null), className: "absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Compensation History Breakdown" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-muted border border-border/65 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-white grid place-items-center text-xs font-black shadow-sm", children: selectedRecord.empName.split(" ").map((n) => n[0]).join("").substring(0, 3).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-extrabold text-foreground text-sm", children: selectedRecord.empName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5 font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: selectedRecord.empId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedRecord.designation })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl border border-border/80 bg-muted/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8.5px] uppercase tracking-wider text-muted-foreground font-bold", children: "JOINING" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono font-bold mt-1 text-foreground/80", children: [
              "৳",
              selectedRecord.salaryJoining.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl border border-border/80 bg-muted/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8.5px] uppercase tracking-wider text-muted-foreground font-bold", children: "BASIC" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono font-bold mt-1 text-foreground/80", children: [
              "৳",
              selectedRecord.salaryBasic.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl border border-primary/20 bg-primary/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8.5px] uppercase tracking-wider text-primary font-bold", children: "GROSS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono font-black mt-1 text-primary", children: [
              "৳",
              selectedRecord.salaryGross.toLocaleString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-b border-border/40 py-4 space-y-2.5 font-bold text-muted-foreground/85", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: selectedRecord.department })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Section Group" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: selectedRecord.section })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Joining Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: selectedRecord.joiningDate })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Total Increment Accrued" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: renderTotalCell(selectedRecord.total) })
          ] }),
          selectedRecord.lastIncDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Last Increment Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: selectedRecord.lastIncDate })
          ] }),
          selectedRecord.lastIncAmount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Last Increment Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-foreground", children: [
              "৳",
              parseFloat(selectedRecord.lastIncAmount).toLocaleString()
            ] })
          ] }),
          selectedRecord.lastPromotion && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Last Promotion Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: selectedRecord.lastPromotion })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedRecord(null), className: "h-9.5 px-6 bg-primary hover:opacity-95 text-primary-foreground font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider", children: "Close Summary" }) })
      ] })
    ] }) }),
    isPdfModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-5xl rounded-lg border border-border shadow-2xl p-6 relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsPdfModalOpen(false), className: "absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/40 pb-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-5.5 text-rose-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PDF Print Preview — Salary Increment History" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/75 font-bold mt-1 uppercase", children: "Pakiza Software Limited • PSL-Operation Ledger" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "pdf-print-area", className: "flex-1 overflow-y-auto p-4 border border-border bg-white text-slate-900 rounded-xl space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1.5 border-b border-slate-200 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-black tracking-tight text-slate-900", children: "PAKIZA SOFTWARE LIMITED" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-500 font-black uppercase tracking-widest", children: "SALARY INCREMENT HISTORY REGISTER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] text-slate-400 font-bold flex justify-center gap-4 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "AREA: PSL-OPERATION" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ACTIVE CYCLE: 2026" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "TOTAL ENTRIES: ",
              filteredRecords.length
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse border border-slate-300 text-[9px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-100 text-slate-800 font-bold whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-300 p-1 text-center", children: "SL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-300 p-1", children: "Emp ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-300 p-1", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-300 p-1", children: "Section" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-300 p-1", children: "Designation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-300 p-1 text-right", children: "Joining" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-300 p-1 text-right", children: "Gross" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-300 p-1 text-center", children: "Inc(2023)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-300 p-1 text-center", children: "Inc(2024)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-300 p-1 text-center", children: "Inc(2025)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-slate-300 p-1 text-center", children: "Total" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredRecords.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "whitespace-nowrap hover:bg-slate-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-300 p-1 text-center text-slate-400 font-bold", children: idx + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-300 p-1 font-mono font-bold", children: row.empId }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-300 p-1 font-extrabold text-slate-900", children: row.empName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-300 p-1 text-slate-600", children: row.section }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-300 p-1 font-bold text-slate-700", children: row.designation }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-300 p-1 text-right font-mono text-slate-600", children: row.salaryJoining.toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-300 p-1 text-right font-mono font-extrabold text-slate-900", children: row.salaryGross.toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-300 p-1 text-center font-mono", children: row.inc2023 !== "0" ? row.inc2023 : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-300 p-1 text-center font-mono", children: row.inc2024 !== "0" ? row.inc2024 : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-300 p-1 text-center font-mono", children: row.inc2025 !== "0" ? row.inc2025 : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-slate-300 p-1 text-center font-mono font-black text-slate-900", children: row.total })
          ] }, row.sl)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-8 pt-10 text-[9px] font-bold text-slate-500 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 border-t border-slate-300 mx-auto pt-1", children: "Prepared By (HR)" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 border-t border-slate-300 mx-auto pt-1", children: "Verified By (Admin)" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 border-t border-slate-300 mx-auto pt-1", children: "Approved By (MD)" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 border-t border-border/40 pt-4 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsPdfModalOpen(false), className: "h-9 px-5 rounded-xl border border-border hover:bg-muted font-extrabold text-xs transition uppercase tracking-wider", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handlePrint, className: "h-9 px-6 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Print PDF Register" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  IncrementHistoryPage as component
};
