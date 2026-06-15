import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-B8Fpsbpq.mjs";
import { C as ChevronRight, ab as Calendar, i as Plus, S as Search, ax as FileSpreadsheet, P as Printer, ay as FileDown, b2 as CircleCheckBig, ap as Trash2, X, e as CalendarDays } from "../_libs/lucide-react.mjs";
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
import "tslib";
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
const initialHolidays = [{
  id: "H-001",
  name: "New Year's Day",
  startDate: "01/01/2026",
  endDate: "01/01/2026",
  days: 1,
  type: "Company Specific",
  status: "Active",
  description: "First day of the calendar year."
}, {
  id: "H-002",
  name: "International Mother Language Day",
  startDate: "21/02/2026",
  endDate: "21/02/2026",
  days: 1,
  type: "Govt Holiday",
  status: "Active",
  description: "Language movement memory day."
}, {
  id: "H-003",
  name: "Independence Day of Bangladesh",
  startDate: "26/03/2026",
  endDate: "26/03/2026",
  days: 1,
  type: "Govt Holiday",
  status: "Active",
  description: "National independence observance."
}, {
  id: "H-004",
  name: "Bengali New Year (Pohela Boishakh)",
  startDate: "14/04/2026",
  endDate: "14/04/2026",
  days: 1,
  type: "Govt Holiday",
  status: "Active",
  description: "Traditional Bengali year arrival festival."
}, {
  id: "H-005",
  name: "May Day",
  startDate: "01/05/2026",
  endDate: "01/05/2026",
  days: 1,
  type: "Govt Holiday",
  status: "Active",
  description: "International Workers' Day."
}, {
  id: "H-006",
  name: "Eid-ul-Fitr Break",
  startDate: "18/05/2026",
  endDate: "21/05/2026",
  days: 4,
  type: "Govt Holiday",
  status: "Active",
  description: "Religious festival holidays."
}, {
  id: "H-007",
  name: "Eid-ul-Adha Vacation",
  startDate: "26/07/2026",
  endDate: "29/07/2026",
  days: 4,
  type: "Govt Holiday",
  status: "Active",
  description: "Sacrificial festival breaks."
}, {
  id: "H-008",
  name: "National Mourning Day",
  startDate: "15/08/2026",
  endDate: "15/08/2026",
  days: 1,
  type: "Govt Holiday",
  status: "Active",
  description: "National memory day."
}, {
  id: "H-009",
  name: "Victory Day",
  startDate: "16/12/2026",
  endDate: "16/12/2026",
  days: 1,
  type: "Govt Holiday",
  status: "Active",
  description: "National victory day celebration."
}, {
  id: "H-010",
  name: "Christmas Day",
  startDate: "25/12/2026",
  endDate: "25/12/2026",
  days: 1,
  type: "Company Specific",
  status: "Active",
  description: "Annual Christian observance holiday."
}];
function CompanyHolidayPage() {
  const [holidays, setHolidays] = reactExports.useState(initialHolidays);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedYear, setSelectedYear] = reactExports.useState("2026");
  const [selectedType, setSelectedType] = reactExports.useState("ALL");
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const [newName, setNewName] = reactExports.useState("");
  const [newStartDate, setNewStartDate] = reactExports.useState("");
  const [newEndDate, setNewEndDate] = reactExports.useState("");
  const [newType, setNewType] = reactExports.useState("Govt Holiday");
  const [newDesc, setNewDesc] = reactExports.useState("");
  const stats = reactExports.useMemo(() => {
    let govtCount = 0;
    let companyCount = 0;
    let totalDays = 0;
    holidays.forEach((h) => {
      totalDays += h.days;
      if (h.type === "Govt Holiday") govtCount++;
      else companyCount++;
    });
    return {
      total: holidays.length,
      govtCount,
      companyCount,
      totalDays
    };
  }, [holidays]);
  const filteredHolidays = reactExports.useMemo(() => {
    return holidays.filter((h) => {
      if (selectedType !== "ALL" && h.type !== selectedType) return false;
      if (selectedYear && !h.startDate.includes(selectedYear)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return h.name.toLowerCase().includes(q) || h.description.toLowerCase().includes(q) || h.startDate.includes(q) || h.endDate.includes(q);
      }
      return true;
    });
  }, [holidays, selectedType, selectedYear, searchQuery]);
  const handleAddHolidaySubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newStartDate || !newEndDate) {
      alert("Please fill in all required fields!");
      return;
    }
    const formatDate = (dateStr) => {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    };
    const formattedStart = formatDate(newStartDate);
    const formattedEnd = formatDate(newEndDate);
    const startObj = new Date(newStartDate);
    const endObj = new Date(newEndDate);
    const timeDiff = endObj.getTime() - startObj.getTime();
    const daysDiff = Math.max(Math.ceil(timeDiff / (1e3 * 3600 * 24)) + 1, 1);
    const newRecord = {
      id: `H-${String(holidays.length + 1).padStart(3, "0")}`,
      name: newName,
      startDate: formattedStart,
      endDate: formattedEnd,
      days: daysDiff,
      type: newType,
      status: "Active",
      description: newDesc || "No description provided."
    };
    setHolidays((prev) => [newRecord, ...prev]);
    setIsModalOpen(false);
    setNewName("");
    setNewStartDate("");
    setNewEndDate("");
    setNewType("Govt Holiday");
    setNewDesc("");
  };
  const handleDeleteHoliday = (id) => {
    if (confirm("Are you sure you want to delete this holiday record from the registry?")) {
      setHolidays((prev) => prev.filter((h) => h.id !== id));
    }
  };
  const handlePrint = () => {
    window.print();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 xl:p-8 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/75", children: "Human Resource" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "Company Holiday" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-5.5 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Company Holiday" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsModalOpen(true), className: "h-9 px-5 bg-primary hover:bg-primary-glow text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add Holiday" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden", children: [{
          label: "TOTAL HOLIDAYS",
          val: `${stats.total} Events`,
          desc: "Registered in calendar",
          color: "text-primary bg-primary/5 border-primary/10"
        }, {
          label: "TOTAL OFF DAYS",
          val: `${stats.totalDays} Days`,
          desc: "Accumulated off days",
          color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10"
        }, {
          label: "GOVERNMENT HOLIDAYS",
          val: `${stats.govtCount} Events`,
          desc: "Gazetted public holidays",
          color: "text-amber-500 bg-amber-500/5 border-amber-500/10"
        }, {
          label: "COMPANY SPECIFIC",
          val: `${stats.companyCount} Events`,
          desc: "Internal office breaks",
          color: "text-blue-500 bg-blue-500/5 border-blue-500/10"
        }].map((st, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-4 rounded-lg border bg-card ${st.color} shadow-xs space-y-1 transition duration-200 hover:scale-[1.01]`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black tracking-wider uppercase opacity-75", children: st.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black", children: st.val }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] opacity-60 font-semibold", children: st.desc })
        ] }, idx)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/85 p-5 shadow-xs space-y-4 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/40 pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary", children: "Filter Controls" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-muted-foreground/50", children: "Search Registry" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Year Selection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: selectedYear, onChange: (e) => setSelectedYear(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none text-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2026", children: "2026" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2025", children: "2025" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2024", children: "2024" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Holiday Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: selectedType, onChange: (e) => setSelectedType(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL Categories" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Govt Holiday", children: "Government Holidays Only" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Company Specific", children: "Company Specific Only" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Query Text" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search by holiday name...", className: "w-full h-9 pl-9 pr-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:bg-card focus:border-primary transition" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4 print:hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-3.5 text-emerald-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "EXCEL" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handlePrint, className: "h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5 text-blue-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PRINT" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-3.5 text-rose-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PDF" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border/50", children: [
              "Matches Found: ",
              filteredHolidays.length,
              " Events"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-border/50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-[11px] text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-12 border-r border-border/30", children: "SL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-48 border-r border-border/30", children: "Holiday Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-28 border-r border-border/30", children: "Start Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-28 border-r border-border/30", children: "End Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-24 border-r border-border/30", children: "Duration (Days)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-36 border-r border-border/30", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-56 border-r border-border/30", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-24 border-r border-border/30", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-20 print:hidden", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/30", children: [
              filteredHolidays.map((row, idx) => {
                let typeBadgeClass = "text-foreground font-semibold";
                if (row.type === "Govt Holiday") {
                  typeBadgeClass = "text-amber-600 dark:text-amber-400 font-extrabold";
                } else if (row.type === "Company Specific") {
                  typeBadgeClass = "text-blue-600 dark:text-blue-400 font-extrabold";
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-75 whitespace-nowrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-center font-bold text-muted-foreground/60 border-r border-border/20", children: idx + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-bold text-foreground border-r border-border/20", children: row.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-center text-foreground/80 border-r border-border/20", children: row.startDate }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-center text-foreground/80 border-r border-border/20", children: row.endDate }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 font-mono text-center font-extrabold text-primary border-r border-border/20", children: [
                    row.days,
                    " Days"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-4 py-2.5 ${typeBadgeClass} border-r border-border/20`, children: row.type }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground max-w-[200px] truncate border-r border-border/20", title: row.description, children: row.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-center border-r border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 text-[9.5px]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.status })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-center print:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDeleteHoliday(row.id), className: "p-1 hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 rounded transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }) })
                ] }, row.id);
              }),
              filteredHolidays.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 10, className: "px-4 py-16 text-center text-muted-foreground font-semibold", children: "No holiday records found matching the current year or search parameters." }) })
            ] })
          ] }) })
        ] })
      ] })
    ] }),
    isModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-md rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsModalOpen(false), className: "absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "size-5 text-primary animate-bounce" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add Corporate Holiday" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddHolidaySubmit, className: "space-y-4 text-xs font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Holiday Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: newName, onChange: (e) => setNewName(e.target.value), placeholder: "e.g. Independence Day Break", className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Start Date *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", required: true, value: newStartDate, onChange: (e) => setNewStartDate(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "End Date *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", required: true, value: newEndDate, onChange: (e) => setNewEndDate(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Holiday Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newType, onChange: (e) => setNewType(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Govt Holiday", children: "Government Holiday" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Company Specific", children: "Company Specific Break" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: newDesc, onChange: (e) => setNewDesc(e.target.value), placeholder: "Additional context or official notice reference details...", className: "w-full h-18 p-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card resize-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-3 border-t border-border/30 mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "h-9 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-9 px-6 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider", children: "Save Holiday" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  CompanyHolidayPage as component
};
