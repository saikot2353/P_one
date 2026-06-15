import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, e as CalendarDays, b as CircleCheck, U as User, t as Briefcase, B as Building2, aJ as Map, am as Layers, aK as CircleAlert, ab as Calendar, at as MapPin, aL as Phone, K as RefreshCw, aw as Upload, af as Send, d as FileText } from "../_libs/lucide-react.mjs";
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
const mockEmployees = {
  "2023043910": {
    id: "2023043910",
    name: "Tahmid Afsar Shapno",
    type: "Permanent",
    joiningDate: "01/08/2023",
    designation: "Asst. Manager",
    section: "Project Resource & Strategy",
    unit: "PSL",
    line: "N/A"
  },
  "2016001055": {
    id: "2016001055",
    name: "Md. Zahidul Islam",
    type: "Management",
    joiningDate: "16/05/2016",
    designation: "Chief Operating Officer",
    section: "Executive Committee",
    unit: "Pakiza Software Limited (Head Office)",
    line: "Management Block"
  },
  "2022035599": {
    id: "2022035599",
    name: "Dipon Saha",
    type: "Staff / Full-Time",
    joiningDate: "01/01/2022",
    designation: "Senior Software Engineer",
    section: "Core Development (HR)",
    unit: "Pakiza Software Limited (Head Office)",
    line: "Engineering Block - L2"
  }
};
function LeaveApplicationPage() {
  const [year, setYear] = reactExports.useState("2026");
  const [attendanceBonus, setAttendanceBonus] = reactExports.useState("Yes");
  const [employeeId, setEmployeeId] = reactExports.useState("2023043910");
  const [leaveType, setLeaveType] = reactExports.useState("Casual Leave");
  const [leavePayWith, setLeavePayWith] = reactExports.useState("With Pay");
  const [durationFrom, setDurationFrom] = reactExports.useState("");
  const [durationTo, setDurationTo] = reactExports.useState("");
  const [purpose, setPurpose] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [contactNumber, setContactNumber] = reactExports.useState("");
  const [responsibleEmp, setResponsibleEmp] = reactExports.useState("");
  const [fileName, setFileName] = reactExports.useState("");
  const matchedEmployee = reactExports.useMemo(() => {
    return mockEmployees[employeeId.trim()] || null;
  }, [employeeId]);
  const calculatedDays = reactExports.useMemo(() => {
    if (!durationFrom || !durationTo) return 0;
    const start = new Date(durationFrom);
    const end = new Date(durationTo);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 0 : Math.max(diffDays, 0);
  }, [durationFrom, durationTo]);
  const [successMessage, setSuccessMessage] = reactExports.useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!matchedEmployee) {
      alert("Please enter a valid Employee ID first!");
      return;
    }
    if (!durationFrom || !durationTo) {
      alert("Please select both From and To dates!");
      return;
    }
    if (calculatedDays <= 0) {
      alert("Invalid leave duration range chosen!");
      return;
    }
    setSuccessMessage(`Leave Application successfully submitted! ID: LEAVE-${Math.floor(1e3 + Math.random() * 9e3)}. Dynamic parameters allocated with ${leavePayWith}.`);
    setTimeout(() => {
      setSuccessMessage("");
    }, 6e3);
    setDurationFrom("");
    setDurationTo("");
    setPurpose("");
    setAddress("");
    setContactNumber("");
    setResponsibleEmp("");
    setFileName("");
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-extrabold", children: "Application Hub" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "size-6 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Leave Application" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 select-none", children: [
            "Fiscal Calendar Year: ",
            year
          ] })
        ] }),
        successMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-500/10 border-2 border-emerald-500/25 p-4 rounded-xl text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-3 animate-in slide-in-from-top duration-300 shadow-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5 shrink-0 text-emerald-500 animate-bounce" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: successMessage })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "xl:col-span-2 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-lg bg-primary/10 text-primary grid place-items-center font-bold text-xs", children: "01" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white", children: "Applicant Information" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide", children: "Year *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: year, onChange: (e) => setYear(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2026", children: "2026" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2025", children: "2025" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2024", children: "2024" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide", children: "Attendance Bonus" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: attendanceBonus, onChange: (e) => setAttendanceBonus(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide", children: "Employee ID *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: employeeId, onChange: (e) => setEmployeeId(e.target.value), placeholder: "e.g. 2023043910", className: "w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-950 transition" })
                  ] })
                ] })
              ] }),
              matchedEmployee ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-lg border border-primary/20 bg-primary/5 dark:bg-primary/[0.02] grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 flex items-center gap-3 border-b border-primary/10 pb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-full bg-primary/20 text-primary grid place-items-center font-bold text-xs", children: matchedEmployee.name.split(" ").map((n) => n[0]).join("") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-black text-slate-800 dark:text-white", children: matchedEmployee.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-primary/80", children: matchedEmployee.type })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-4 text-slate-400 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-slate-400 font-bold uppercase", children: "Designation & Team" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-extrabold text-slate-700 dark:text-slate-300", children: [
                      matchedEmployee.designation,
                      " (",
                      matchedEmployee.section,
                      ")"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-4 text-slate-400 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-slate-400 font-bold uppercase", children: "Corporate Unit" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-extrabold text-slate-700 dark:text-slate-300", children: matchedEmployee.unit })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "size-4 text-slate-400 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-slate-400 font-bold uppercase", children: "Joining Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-extrabold text-slate-700 dark:text-slate-300", children: matchedEmployee.joiningDate })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-4 text-slate-400 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-slate-400 font-bold uppercase", children: "Allocated Floor Line" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-extrabold text-slate-700 dark:text-slate-300", children: matchedEmployee.line })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/[0.02] flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-5 text-amber-500 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-amber-600 dark:text-amber-400 font-extrabold", children: "Enter a valid Employee ID to dynamically verify applicant qualifications." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-lg bg-primary/10 text-primary grid place-items-center font-bold text-xs", children: "02" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white", children: "Leave Schedule & Type" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide", children: "Leave Type *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: leaveType, onChange: (e) => setLeaveType(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Casual Leave", children: "Casual Leave" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Sick Leave", children: "Sick Leave" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Earned Leave", children: "Earned Leave" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Maternity Leave", children: "Maternity Leave" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Special Leave", children: "Special Leave" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide", children: "Leave Pay With *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: leavePayWith, onChange: (e) => setLeavePayWith(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "With Pay", children: "With Pay" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Without Pay", children: "Without Pay" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide", children: "Leave Duration From *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", required: true, value: durationFrom, onChange: (e) => setDurationFrom(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide", children: "Leave Duration To *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", required: true, value: durationTo, onChange: (e) => setDurationTo(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition" })
                ] })
              ] }),
              calculatedDays > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/50 rounded-xl text-[11px] font-extrabold text-sky-800 dark:text-sky-400 flex items-center justify-between shadow-2xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4 text-sky-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Formulated Requested Leave Period:" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded-lg text-xs font-black transition", children: [
                  calculatedDays,
                  " ",
                  calculatedDays === 1 ? "Calendar Day" : "Calendar Days"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-lg bg-primary/10 text-primary grid place-items-center font-bold text-xs", children: "03" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white", children: "Coverage & Logistics" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide", children: "Purpose / Reason" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: purpose, onChange: (e) => setPurpose(e.target.value), placeholder: "Detail the circumstances of this leave application...", className: "w-full h-20 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-950 transition resize-none" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide", children: "Address during Leave" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: address, onChange: (e) => setAddress(e.target.value), placeholder: "e.g. Village/Post/District details", className: "w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide", children: "Contact Number during Leave" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: contactNumber, onChange: (e) => setContactNumber(e.target.value), placeholder: "e.g. +880 17xx-xxxxxx", className: "w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide", children: "Responsible Employee" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 animate-spin-slow" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: responsibleEmp, onChange: (e) => setResponsibleEmp(e.target.value), placeholder: "ID / Name of coverage officer", className: "w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-primary transition" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide", children: "Attachment (if any)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "h-10 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-2 transition select-none", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-4 text-slate-400" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Choose File" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", onChange: handleFileChange, className: "hidden" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10.5px] font-extrabold text-slate-400 truncate max-w-[150px]", children: fileName || "No file chosen" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 p-6 bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-sm print:hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                setDurationFrom("");
                setDurationTo("");
                setPurpose("");
                setAddress("");
                setContactNumber("");
                setResponsibleEmp("");
                setFileName("");
              }, className: "h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 font-extrabold text-xs transition uppercase tracking-wider", children: "Reset Form" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "h-11 px-8 bg-primary hover:bg-primary-glow text-white font-extrabold text-xs rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Submit Leave Proposal" })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white", children: "Leave Ledger Summary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-emerald-500 animate-pulse" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [{
                label: "Casual Leave",
                spent: 4,
                limit: 10,
                color: "bg-blue-500 text-blue-500 bg-blue-500/10 border-blue-500/20"
              }, {
                label: "Sick Leave",
                spent: 3,
                limit: 14,
                color: "bg-emerald-500 text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
              }, {
                label: "Earned Leave",
                spent: 6,
                limit: 18,
                color: "bg-amber-500 text-amber-500 bg-amber-500/10 border-amber-500/20"
              }, {
                label: "Maternity Leave",
                spent: 0,
                limit: 90,
                color: "bg-purple-500 text-purple-500 bg-purple-500/10 border-purple-500/20"
              }, {
                label: "Leave Without Pay",
                spent: 2,
                limit: 30,
                color: "bg-rose-500 text-rose-500 bg-rose-500/10 border-rose-500/20"
              }].map((lv, idx) => {
                const remaining = lv.limit - lv.spent;
                const percent = lv.spent / lv.limit * 100;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/10 hover:shadow-xs transition duration-200", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lv.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-primary", children: [
                      remaining,
                      " / ",
                      lv.limit,
                      " Days Left"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full ${lv.color.split(" ")[0]} rounded-full transition-all duration-300`, style: {
                    width: `${percent}%`
                  } }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Consumed: ",
                      lv.spent,
                      " Days"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Allocated: ",
                      lv.limit,
                      " Days"
                    ] })
                  ] })
                ] }, idx);
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-3.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 animate-bounce text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Leave Regulation Policy" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed", children: "All requests must be submitted at least 24 hours prior for single day leaves, and 7 days prior for leaves exceeding 3 calendar days. Attachment documentation is highly recommended for Sick Leaves exceeding 2 days." })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  LeaveApplicationPage as component
};
