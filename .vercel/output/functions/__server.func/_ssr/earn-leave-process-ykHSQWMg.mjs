import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-B8Fpsbpq.mjs";
import { C as ChevronRight, J as Coins, b as CircleCheck, ax as FileSpreadsheet, P as Printer, ay as FileDown, S as Search, N as ShieldAlert } from "../_libs/lucide-react.mjs";
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
const initialRecords = [{
  sl: 1,
  empId: "2023043910",
  empName: "Tahmid Afsar",
  type: "Office Executive",
  department: "Project Resource & Strategy",
  designation: "Asst. Manager",
  joinDate: "01/08/2023",
  gross: 52e3,
  presentDays: 79,
  earnedDays: 4.39,
  takenEl: 0,
  earnedDaysCf: 0,
  cashPay: 0
}, {
  sl: 2,
  empId: "2022035599",
  empName: "Dipon Saha",
  type: "Staff / Full-Time",
  department: "Core Development (HR)",
  designation: "Senior Software Engineer",
  joinDate: "01/01/2022",
  gross: 78e3,
  presentDays: 85,
  earnedDays: 5.6,
  takenEl: 1,
  earnedDaysCf: 1.5,
  cashPay: 0
}];
function EarnLeaveProcessPage() {
  const [records, setRecords] = reactExports.useState(initialRecords);
  const [year, setYear] = reactExports.useState("2026");
  const [currentDate, setCurrentDate] = reactExports.useState("2026-05-17");
  const [statusFilter, setStatusFilter] = reactExports.useState("Working");
  const [percentInput, setPercentInput] = reactExports.useState("100");
  const [empType, setEmpType] = reactExports.useState("ALL");
  const [section, setSection] = reactExports.useState("ALL");
  const [unit, setUnit] = reactExports.useState("ALL");
  const [empIdFilter, setEmpIdFilter] = reactExports.useState("2023043910");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [appliedFilters, setAppliedFilters] = reactExports.useState({
    year: "2026",
    currentDate: "2026-05-17",
    statusFilter: "Working",
    percentInput: "100",
    empType: "ALL",
    section: "ALL",
    unit: "ALL",
    empIdFilter: "2023043910"
  });
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters({
      year,
      currentDate,
      statusFilter,
      percentInput,
      empType,
      section,
      unit,
      empIdFilter
    });
  };
  const computedRows = reactExports.useMemo(() => {
    const scalePercent = parseFloat(appliedFilters.percentInput) || 100;
    return records.filter((r) => {
      if (appliedFilters.empIdFilter.trim() && r.empId !== appliedFilters.empIdFilter.trim()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return r.empId.toLowerCase().includes(q) || r.empName.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.designation.toLowerCase().includes(q);
      }
      return true;
    }).map((r, index) => {
      const perDayAmount = Math.round(r.gross / 30 * 100) / 100;
      const totalEl = Math.round((r.earnedDays + r.earnedDaysCf - r.takenEl) * 100) / 100;
      const rawTotalAmount = Math.round(totalEl * perDayAmount * 100) / 100;
      const payDay = Math.round(totalEl * (scalePercent / 100) * 100) / 100;
      const netPay = Math.round(payDay * perDayAmount);
      return {
        ...r,
        displaySl: index + 1,
        perDayAmount,
        totalEl,
        totalAmount: rawTotalAmount,
        percent: scalePercent,
        payDay,
        netPay
      };
    });
  }, [records, appliedFilters, searchQuery]);
  const [processingStatus, setProcessingStatus] = reactExports.useState("");
  const handleProcessSubmit = () => {
    setProcessingStatus(`Earn Leave Process executed! Calculated ledger processed successfully for ${computedRows.length} employee profiles.`);
    setTimeout(() => {
      setProcessingStatus("");
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-extrabold", children: "Earn Leave Process" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "size-6 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Earn Leave Process" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 select-none", children: [
            "Fiscal Cycle: ",
            year
          ] })
        ] }),
        processingStatus && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-500/10 border-2 border-emerald-500/25 p-4 rounded-xl text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-3 animate-in slide-in-from-top duration-300 shadow-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5 shrink-0 text-emerald-500 animate-bounce" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: processingStatus })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearchSubmit, className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-4 text-xs font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Year" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: year, onChange: (e) => setYear(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2026", children: "2026" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2025", children: "2025" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2024", children: "2024" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Current Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: currentDate, onChange: (e) => setCurrentDate(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Working", children: "Working" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Resigned", children: "Resigned" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Terminated", children: "Terminated" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Percent(%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", max: "100", value: percentInput, onChange: (e) => setPercentInput(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition font-mono" })
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] text-slate-400 uppercase flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "EmpID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-slate-400 font-semibold lowercase italic", children: "(Empty for ALL)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: empIdFilter, onChange: (e) => setEmpIdFilter(e.target.value), placeholder: "e.g. 2023043910", className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition font-mono" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-3 lg:col-span-4 flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-10 px-10 bg-[#4caf50] hover:bg-[#43a047] text-white font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider", children: "Search" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search current grid...", className: "h-8.5 pl-9 pr-3 w-full sm:w-48 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-primary transition" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-[10.5px] text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#ffebee] dark:bg-rose-950/20 text-slate-800 dark:text-rose-200 font-black border-b border-slate-200 dark:border-slate-800/80 whitespace-nowrap select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center w-10 border-r border-slate-200/50 dark:border-slate-800/30", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Emp ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center", children: "Join Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-right", children: "Gross" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center", children: "Present Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center", children: "Earned Day" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center", children: "Taken EL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center", children: "Earned Day(CF)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center", children: "Total EL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-right", children: "Per Day Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-right", children: "Total Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center", children: "Percent(%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center", children: "Pay Day" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-right", children: "Net Pay" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-right", children: "Cash Pay" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800 font-medium", children: [
              computedRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/55 dark:hover:bg-slate-900/40 transition duration-75 whitespace-nowrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center border-r border-slate-100 dark:border-slate-800/50", children: row.displaySl }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50", children: row.empId }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-extrabold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50", children: row.empName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50", children: row.type }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50", children: row.department }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50", children: row.designation }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50", children: row.joinDate }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800/50", children: row.gross.toFixed(2) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-bold text-slate-850 dark:text-slate-250 border-r border-slate-100 dark:border-slate-800/50", children: row.presentDays }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono border-r border-slate-100 dark:border-slate-800/50", children: row.earnedDays }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono border-r border-slate-100 dark:border-slate-800/50", children: row.takenEl }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono border-r border-slate-100 dark:border-slate-800/50", children: row.earnedDaysCf.toFixed(2) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono font-bold text-primary border-r border-slate-100 dark:border-slate-800/50", children: row.totalEl }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-mono border-r border-slate-100 dark:border-slate-800/50", children: row.perDayAmount.toFixed(2) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-mono font-bold border-r border-slate-100 dark:border-slate-800/50", children: row.totalAmount.toFixed(2) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-3 text-center font-mono font-bold border-r border-slate-100 dark:border-slate-800/50", children: [
                  row.percent,
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono font-bold border-r border-slate-100 dark:border-slate-800/50", children: row.payDay }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 border-r border-slate-100 dark:border-slate-800/50", children: row.netPay }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-mono text-slate-500", children: row.cashPay })
              ] }, row.empId)),
              computedRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 19, className: "px-4 py-16 text-center text-slate-400 font-bold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-6 text-slate-300 animate-bounce" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No earned leave ledger matching active Employee ID filter." })
              ] }) }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10.5px] font-bold text-slate-400", children: [
              "Showing 1 to ",
              computedRows.length,
              " of ",
              computedRows.length,
              " entries"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 select-none text-[10.5px] font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3.5 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 cursor-not-allowed", children: "Previous" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-8 rounded-lg bg-primary text-white flex items-center justify-center font-black", children: "1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3.5 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 cursor-not-allowed", children: "Next" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800/45 print:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleProcessSubmit, className: "h-10 px-8 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-xl shadow-md transition uppercase tracking-wider", children: "Submit Earned Leave Process" }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  EarnLeaveProcessPage as component
};
