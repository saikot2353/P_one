import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, V as ShieldCheck, b as CircleCheck, ax as FileSpreadsheet, P as Printer, ay as FileDown, S as Search, j as CircleQuestionMark } from "../_libs/lucide-react.mjs";
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
const initialSubmitRows = [{
  id: "ELS-001",
  empId: "2023043910",
  empName: "Tahmid Afsar",
  department: "Project Resource & Strategy",
  designation: "Asst. Manager",
  totalDays: 4.39,
  perDayRate: 1733.33,
  netPay: 7609,
  paymentMode: "Bank",
  bankName: "Dutch-Bangla Bank PLC",
  accountNo: "125.120.44391",
  status: "Draft"
}, {
  id: "ELS-002",
  empId: "2022035599",
  empName: "Dipon Saha",
  department: "Core Development (HR)",
  designation: "Senior Software Engineer",
  totalDays: 5.6,
  perDayRate: 2600,
  netPay: 14560,
  paymentMode: "Bank",
  bankName: "Dutch-Bangla Bank PLC",
  accountNo: "125.120.35599",
  status: "Draft"
}, {
  id: "ELS-003",
  empId: "2021032646",
  empName: "Sadiqul Islam",
  department: "Core Sales",
  designation: "Deputy Manager",
  totalDays: 3,
  perDayRate: 1100,
  netPay: 3300,
  paymentMode: "Cash",
  bankName: "",
  accountNo: "",
  status: "Draft"
}];
function EarnLeaveSubmitPage() {
  const [rows, setRows] = reactExports.useState(initialSubmitRows);
  const [year, setYear] = reactExports.useState("2026");
  const [month, setMonth] = reactExports.useState("May");
  const [empType, setEmpType] = reactExports.useState("ALL");
  const [section, setSection] = reactExports.useState("ALL");
  const [unit, setUnit] = reactExports.useState("ALL");
  const [empIdFilter, setEmpIdFilter] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedIds, setSelectedIds] = reactExports.useState(/* @__PURE__ */ new Set(["ELS-001", "ELS-002"]));
  const [appliedFilters, setAppliedFilters] = reactExports.useState({
    year: "2026",
    month: "May",
    empType: "ALL",
    section: "ALL",
    unit: "ALL",
    empIdFilter: ""
  });
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters({
      year,
      month,
      empType,
      section,
      unit,
      empIdFilter
    });
  };
  const filteredRows = reactExports.useMemo(() => {
    return rows.filter((r) => {
      if (appliedFilters.empIdFilter.trim() && r.empId !== appliedFilters.empIdFilter.trim()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return r.empId.toLowerCase().includes(q) || r.empName.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.designation.toLowerCase().includes(q) || r.bankName.toLowerCase().includes(q) || r.accountNo.toLowerCase().includes(q);
      }
      return true;
    });
  }, [rows, appliedFilters, searchQuery]);
  const isAllSelected = filteredRows.length > 0 && filteredRows.every((r) => selectedIds.has(r.id));
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredRows.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredRows.forEach((r) => next.add(r.id));
        return next;
      });
    }
  };
  const toggleSelect = (id) => {
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
  const handleInlineChange = (id, field, value) => {
    setRows((prev) => prev.map((r) => r.id === id ? {
      ...r,
      [field]: value
    } : r));
  };
  const [successMessage, setSuccessMessage] = reactExports.useState("");
  const handleBulkSubmit = () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one record to submit!");
      return;
    }
    setRows((prev) => prev.map((r) => selectedIds.has(r.id) ? {
      ...r,
      status: "Submitted"
    } : r));
    setSuccessMessage(`Successfully submitted ${selectedIds.size} processed Earn Leave cash-disbursements for clearance!`);
    setTimeout(() => {
      setSuccessMessage("");
    }, 6e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a] text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 lg:p-8 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Leave Management" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-extrabold", children: "Earn Leave Submit" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-6 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Earn Leave Submit" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 select-none", children: [
            "Fiscal Cycle: ",
            year
          ] })
        ] }),
        successMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-500/10 border-2 border-emerald-500/25 p-4 rounded-xl text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-3 animate-in slide-in-from-top duration-300 shadow-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5 shrink-0 text-emerald-500 animate-bounce" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: successMessage })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearchSubmit, className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-4 text-xs font-bold font-sans", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Year" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: year, onChange: (e) => setYear(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2026", children: "2026" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2025", children: "2025" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2024", children: "2024" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Month" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: month, onChange: (e) => setMonth(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "January", children: "January" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "February", children: "February" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "March", children: "March" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "April", children: "April" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "May", children: "May" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "June", children: "June" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Employee Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: empType, onChange: (e) => setEmpType(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Staff", children: "Staff" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Worker", children: "Worker" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Section" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: section, onChange: (e) => setSection(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Finance & Accounts", children: "Finance & Accounts" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Project Resource & Strategy", children: "Project Resource & Strategy" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: unit, onChange: (e) => setUnit(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Head Office", children: "Head Office" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] text-slate-400 uppercase flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Employee ID Filter" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-slate-400 font-semibold lowercase italic", children: "(Blank for all ready items)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: empIdFilter, onChange: (e) => setEmpIdFilter(e.target.value), placeholder: "e.g. 2023043910", className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition font-mono" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-3 lg:col-span-4 flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-10 px-10 bg-[#4caf50] hover:bg-[#43a047] text-white font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider", children: "Search" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleBulkSubmit, className: "h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-[10.5px] rounded-lg shadow-xs flex items-center gap-1.5 transition uppercase tracking-wider", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Submit Selected" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-extrabold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-3.5 text-emerald-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "EXCEL" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-extrabold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5 text-blue-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PRINT" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-extrabold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-3.5 text-rose-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PDF" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search ready items...", className: "h-8.5 pl-9 pr-3 w-full sm:w-48 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-primary transition" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-[10.5px] text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#ffebee] dark:bg-rose-950/20 text-slate-800 dark:text-rose-200 font-black border-b border-slate-200 dark:border-slate-800/80 whitespace-nowrap select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center w-10 border-r border-slate-200/50 dark:border-slate-800/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isAllSelected, onChange: toggleSelectAll, className: "rounded border-slate-300 text-primary focus:ring-primary size-3.5 cursor-pointer" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Emp ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center", children: "Earned Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-right", children: "Per Day Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-right", children: "Net Pay" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center w-28", children: "Payment Mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-left w-36", children: "Bank Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-left w-36", children: "Account No" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: [
              filteredRows.map((row) => {
                const isSelected = selectedIds.has(row.id);
                let statusColor = "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400";
                if (row.status === "Submitted") {
                  statusColor = "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400";
                } else if (row.status === "Cleared") {
                  statusColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400";
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/55 dark:hover:bg-slate-900/40 transition duration-75 whitespace-nowrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center border-r border-slate-100 dark:border-slate-800/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isSelected, onChange: () => toggleSelect(row.id), className: "rounded border-slate-300 text-primary focus:ring-primary size-3.5 cursor-pointer" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50", children: row.empId }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-extrabold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50", children: row.empName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-slate-650 dark:text-slate-350 border-r border-slate-100 dark:border-slate-800/50", children: row.department }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-slate-650 dark:text-slate-350 border-r border-slate-100 dark:border-slate-800/50", children: row.designation }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono font-bold border-r border-slate-100 dark:border-slate-800/50", children: row.totalDays }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-mono border-r border-slate-100 dark:border-slate-800/50", children: row.perDayRate.toFixed(2) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-mono font-black text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50", children: row.netPay }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2.5 py-1.5 border-r border-slate-100 dark:border-slate-800/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: row.paymentMode, disabled: row.status !== "Draft", onChange: (e) => handleInlineChange(row.id, "paymentMode", e.target.value), className: "w-full h-7 px-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold outline-none focus:border-primary", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Bank", children: "Bank" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Cash", children: "Cash" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "bKash", children: "bKash" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Rocket", children: "Rocket" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2.5 py-1.5 border-r border-slate-100 dark:border-slate-800/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: row.bankName, disabled: row.status !== "Draft" || row.paymentMode === "Cash", onChange: (e) => handleInlineChange(row.id, "bankName", e.target.value), placeholder: "e.g. Bank NamePLC", className: "w-full h-7 px-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold outline-none focus:bg-white focus:border-primary disabled:opacity-40" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2.5 py-1.5 border-r border-slate-100 dark:border-slate-800/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: row.accountNo, disabled: row.status !== "Draft" || row.paymentMode === "Cash", onChange: (e) => handleInlineChange(row.id, "accountNo", e.target.value), placeholder: "e.g. Acc Account no", className: "w-full h-7 px-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold outline-none focus:bg-white focus:border-primary disabled:opacity-40" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${statusColor}`, children: row.status }) })
                ] }, row.id);
              }),
              filteredRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 12, className: "px-4 py-16 text-center text-slate-400 font-bold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "size-6 text-slate-300 animate-bounce" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No processed earned leave records ready to submit." })
              ] }) }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10.5px] font-bold text-slate-400", children: [
              "Showing 1 to ",
              filteredRows.length,
              " of ",
              filteredRows.length,
              " entries"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 select-none text-[10.5px] font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3.5 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 cursor-not-allowed", children: "Previous" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-8 rounded-lg bg-primary text-white flex items-center justify-center font-black", children: "1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3.5 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 cursor-not-allowed", children: "Next" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  EarnLeaveSubmitPage as component
};
