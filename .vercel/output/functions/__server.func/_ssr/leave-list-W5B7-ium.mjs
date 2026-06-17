import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, e as CalendarDays, i as Plus, ax as FileSpreadsheet, P as Printer, ay as FileDown, S as Search, I as Info } from "../_libs/lucide-react.mjs";
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
const mockLeaveRecords = [{
  sl: 1,
  empId: "2021032646",
  empName: "Sadiqul Islam",
  company: "Pakiza Software Limited",
  department: "Core Sales",
  designation: "Deputy Manager",
  type: "CL",
  startDate: "30/05/2026",
  endDate: "30/05/2026",
  purpose: "",
  totalDays: 1,
  status: "Approved"
}, {
  sl: 2,
  empId: "2021032646",
  empName: "Sadiqul Islam",
  company: "Pakiza Software Limited",
  department: "Core Sales",
  designation: "Deputy Manager",
  type: "CL",
  startDate: "21/05/2026",
  endDate: "21/05/2026",
  purpose: "",
  totalDays: 1,
  status: "Approved"
}, {
  sl: 3,
  empId: "2021032646",
  empName: "Sadiqul Islam",
  company: "Pakiza Software Limited",
  department: "Core Sales",
  designation: "Deputy Manager",
  type: "CL",
  startDate: "16/05/2026",
  endDate: "16/05/2026",
  purpose: "",
  totalDays: 1,
  status: "Approved"
}, {
  sl: 4,
  empId: "2022035599",
  empName: "Dipon Saha",
  company: "Pakiza Software Limited",
  department: "Core Development (HR)",
  designation: "Manager",
  type: "CL",
  startDate: "06/05/2026",
  endDate: "07/05/2026",
  purpose: "",
  totalDays: 2,
  status: "Approved"
}];
function LeaveListPage() {
  const [region, setRegion] = reactExports.useState("PSL-Operation");
  const [empType, setEmpType] = reactExports.useState("ALL");
  const [subDept, setSubDept] = reactExports.useState("ALL");
  const [jobTitle, setJobTitle] = reactExports.useState("ALL");
  const [unit, setUnit] = reactExports.useState("ALL");
  const [line, setLine] = reactExports.useState("ALL");
  const [fromDate, setFromDate] = reactExports.useState("2026-05-01");
  const [toDate, setToDate] = reactExports.useState("2026-05-31");
  const [leaveType, setLeaveType] = reactExports.useState("ALL");
  const [status, setStatus] = reactExports.useState("Approved");
  const [empIdMulti, setEmpIdMulti] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [appliedFilters, setAppliedFilters] = reactExports.useState({
    region: "PSL-Operation",
    empType: "ALL",
    subDept: "ALL",
    jobTitle: "ALL",
    unit: "ALL",
    line: "ALL",
    fromDate: "2026-05-01",
    toDate: "2026-05-31",
    leaveType: "ALL",
    status: "Approved",
    empIdMulti: ""
  });
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters({
      region,
      empType,
      subDept,
      jobTitle,
      unit,
      line,
      fromDate,
      toDate,
      leaveType,
      status,
      empIdMulti
    });
  };
  const filteredRecords = reactExports.useMemo(() => {
    return mockLeaveRecords.filter((r) => {
      if (appliedFilters.status !== "ALL" && r.status !== appliedFilters.status) return false;
      if (appliedFilters.leaveType !== "ALL" && r.type !== appliedFilters.leaveType) return false;
      if (appliedFilters.empIdMulti.trim()) {
        const ids = appliedFilters.empIdMulti.split(",").map((i) => i.trim());
        if (!ids.includes(r.empId)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return r.empId.toLowerCase().includes(q) || r.empName.toLowerCase().includes(q) || r.company.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.designation.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
      }
      return true;
    });
  }, [appliedFilters, searchQuery]);
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-extrabold", children: "Leave List" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "size-6 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Leave List" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/leave-application", className: "h-10 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition flex items-center gap-2 uppercase tracking-wider", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 text-white" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Apply for Leave" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 select-none", children: "Session Calendar: 2026" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearchSubmit, className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-4 text-xs font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Region" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: region, onChange: (e) => setRegion(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PSL-Operation", children: "PSL-Operation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PSL-HeadOffice", children: "PSL-HeadOffice" })
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Sub Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: subDept, onChange: (e) => setSubDept(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Core Sales", children: "Core Sales" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Core Development (HR)", children: "Core Development (HR)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Job Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: jobTitle, onChange: (e) => setJobTitle(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Manager", children: "Manager" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Deputy Manager", children: "Deputy Manager" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: unit, onChange: (e) => setUnit(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Unit 1", children: "Unit 1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Unit 2", children: "Unit 2" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Line" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: line, onChange: (e) => setLine(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Line 1", children: "Line 1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Line 2", children: "Line 2" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "From Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: fromDate, onChange: (e) => setFromDate(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "To Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: toDate, onChange: (e) => setToDate(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Leave Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: leaveType, onChange: (e) => setLeaveType(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CL", children: "Casual Leave (CL)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SL", children: "Sick Leave (SL)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "EL", children: "Earned Leave (EL)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Approved", children: "Approved" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pending", children: "Pending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Rejected", children: "Rejected" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL Statuses" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 uppercase", children: "EmpId (Multi with comma)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: empIdMulti, onChange: (e) => setEmpIdMulti(e.target.value), placeholder: "use comma as separator", className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition font-mono placeholder:italic" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-3 lg:col-span-4 flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-10 px-10 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider", children: "Search" }) })
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search database...", className: "h-8.5 pl-9 pr-3 w-full sm:w-48 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-primary transition" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-[11px] text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#ffebee] dark:bg-rose-950/20 text-slate-800 dark:text-rose-200 font-black border-b border-slate-200 dark:border-slate-800/80 whitespace-nowrap select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center w-12 border-r border-slate-200/50 dark:border-slate-800/30", children: "SL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Id" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Company" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center", children: "Start Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center", children: "End Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30", children: "Purpose" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center w-16", children: "Total(D)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: [
              filteredRecords.map((row, idx) => {
                let statusColor = "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400";
                if (row.status === "Approved") {
                  statusColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400";
                } else if (row.status === "Rejected") {
                  statusColor = "bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400";
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/55 dark:hover:bg-slate-900/40 transition duration-75 whitespace-nowrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-bold text-slate-400 border-r border-slate-100 dark:border-slate-800/50", children: idx + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50", children: row.empId }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-extrabold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50", children: row.empName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50", children: row.company }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50", children: row.department }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50", children: row.designation }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-extrabold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800/50", children: row.type }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50", children: row.startDate }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50", children: row.endDate }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-500 max-w-[120px] truncate border-r border-slate-100 dark:border-slate-800/50", title: row.purpose, children: row.purpose || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-black text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50", children: row.totalDays }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase ${statusColor}`, children: row.status }) })
                ] }, row.sl);
              }),
              filteredRecords.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 12, className: "px-4 py-16 text-center text-slate-400 font-bold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-6 text-slate-300 animate-bounce" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No leave history records found." })
              ] }) }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10.5px] font-bold text-slate-400", children: [
              "Showing 1 to ",
              filteredRecords.length,
              " of ",
              filteredRecords.length,
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
  LeaveListPage as component
};
