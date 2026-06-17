import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { i as initializeRecruitmentMockData, S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, z as ClipboardCheck, S as Search, R as RotateCcw, ad as CirclePlay } from "../_libs/lucide-react.mjs";
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
function StatusBadge({
  status
}) {
  const map = {
    "IE Pending": "bg-[#fef3c7] text-[#b45309] border-[#fde68a]",
    // Amber
    "IE Submitted": "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    // Blue
    "HR Pending": "bg-[#faf5ff] text-[#7e22ce] border-[#e9d5ff]",
    // Purple
    "HR Approved": "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
    // Green/Emerald
    "HR Rejected": "bg-[#fdf2f2] text-[#b91c1c] border-[#fde8e8]"
    // Red
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${map[status] || "bg-slate-50 text-slate-600 border-slate-200"}`, children: status });
}
function IEAssessmentListPage() {
  const router = useRouter();
  const [candidates, setCandidates] = reactExports.useState([]);
  const [filteredCandidates, setFilteredCandidates] = reactExports.useState([]);
  const [assessStatus, setAssessStatus] = reactExports.useState("IE Pending");
  const [dojFrom, setDojFrom] = reactExports.useState("");
  const [dojTo, setDojTo] = reactExports.useState("");
  const [empType, setEmpType] = reactExports.useState("");
  const [department, setDepartment] = reactExports.useState("");
  const [section, setSection] = reactExports.useState("");
  const [designation, setDesignation] = reactExports.useState("");
  const [unit, setUnit] = reactExports.useState("");
  const [line, setLine] = reactExports.useState("");
  const [empIdTemp, setEmpIdTemp] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      initializeRecruitmentMockData();
      const saved = localStorage.getItem("recruitment_candidates");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCandidates(parsed);
        setFilteredCandidates(parsed.filter((c) => c.assessStatus === "IE Pending"));
      }
    }
  }, []);
  const handleSearch = () => {
    const filtered = candidates.filter((c) => {
      if (assessStatus && c.assessStatus !== assessStatus) return false;
      if (empIdTemp && !c.empIdTemp.toLowerCase().includes(empIdTemp.toLowerCase())) return false;
      if (empType && c.employeeType !== empType) return false;
      if (department && c.department !== department) return false;
      if (section && c.section !== section) return false;
      if (designation && c.designation !== designation) return false;
      if (dojFrom && new Date(c.doj) < new Date(dojFrom)) return false;
      if (dojTo && new Date(c.doj) > new Date(dojTo)) return false;
      return true;
    });
    setFilteredCandidates(filtered);
  };
  const handleReset = () => {
    setAssessStatus("IE Pending");
    setDojFrom("");
    setDojTo("");
    setEmpType("");
    setDepartment("");
    setSection("");
    setDesignation("");
    setUnit("");
    setLine("");
    setEmpIdTemp("");
    setFilteredCandidates(candidates.filter((c) => c.assessStatus === "IE Pending"));
  };
  const filterClass = "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all";
  const labelClass = "text-[10px] font-black text-muted-foreground uppercase tracking-wide";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 lg:p-8 space-y-5 max-w-[1400px] mx-auto w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "IE Recruitment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "IE Assessment" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "size-5.5 text-primary" }),
              "IE Assessment Search"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-[10px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-1.5 font-bold", children: [
            "IE Pending: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: filteredCandidates.length })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Assess Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: assessStatus, onChange: (e) => setAssessStatus(e.target.value), className: filterClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "IE Pending", children: "IE Pending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "IE Submitted", children: "IE Submitted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HR Pending", children: "HR Pending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HR Approved", children: "HR Approved" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HR Rejected", children: "HR Rejected" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "DOJ From" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: dojFrom, onChange: (e) => setDojFrom(e.target.value), className: filterClass })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "DOJ To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: dojTo, onChange: (e) => setDojTo(e.target.value), className: filterClass })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Emp Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: empType, onChange: (e) => setEmpType(e.target.value), className: filterClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Types" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Worker", children: "Worker" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Staff", children: "Staff" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: department, onChange: (e) => setDepartment(e.target.value), className: filterClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Departments" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "RMG Operation", children: "RMG Operation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Quality Control", children: "Quality Control" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Section" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: section, onChange: (e) => setSection(e.target.value), className: filterClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Sections" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Sewing", children: "Sewing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Cutting", children: "Cutting" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Finishing", children: "Finishing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inspection", children: "Inspection" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Designation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: designation, onChange: (e) => setDesignation(e.target.value), className: filterClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Designations" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Operator", children: "Operator" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Helper", children: "Helper" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Cutter", children: "Cutter" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Iron Man", children: "Iron Man" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Folder", children: "Folder" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: unit, onChange: (e) => setUnit(e.target.value), className: filterClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Units" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Unit-6", children: "Unit-6" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Line" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: line, onChange: (e) => setLine(e.target.value), className: filterClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Lines" }),
              ["52", "53", "54", "55", "56", "57", "58", "59", "F-1", "F-2"].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: l, children: l }, l))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass, children: "Emp ID (Temp)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. PAL000001", value: empIdTemp, onChange: (e) => setEmpIdTemp(e.target.value), className: filterClass })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 col-span-2 md:col-span-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSearch, className: "flex-1 h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5" }),
              " Search"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleReset, className: "h-10 px-3 rounded-xl bg-muted hover:bg-muted/80 border border-border/40 text-muted-foreground transition-all", title: "Reset", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3.5" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border-collapse", style: {
          minWidth: "1100px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f8fafc] dark:bg-[#0f172a]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 w-12 text-center border-r border-border/30", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 w-20 text-center border-r border-border/30", children: "Execute" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[110px] border-r border-border/30", children: "Emp ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[100px] border-r border-border/30 text-center", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[180px] border-r border-border/30", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[80px] border-r border-border/30", children: "Emp Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[140px] border-r border-border/30", children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[100px] border-r border-border/30", children: "Section" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[120px] border-r border-border/30", children: "Designation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[90px] border-r border-border/30", children: "Job Nature" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[70px] border-r border-border/30", children: "Unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[60px] border-r border-border/30", children: "Line" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[60px] border-r border-border/30", children: "Grade" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[100px] border-r border-border/30", children: "DOJ" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[100px] border-r border-border/30", children: "DOB" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[120px]", children: "Contact No" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/30 text-foreground", children: [
            filteredCandidates.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const rowBgClass = isEven ? "bg-white dark:bg-[#0f172a]" : "bg-[#f8fafc] dark:bg-[#131d30]";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all cursor-pointer ${rowBgClass}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center text-slate-500 font-bold border-r border-border/30", children: idx + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r border-border/30", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => router.navigate({
                  to: `/recruitment-ie-assessment/${item.empIdTemp}`
                }), title: "Start IE Assessment", className: "w-7 h-7 rounded border border-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition flex items-center justify-center shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "size-4 text-primary" }) }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-bold text-[#2563eb] border-r border-border/30", children: item.empIdTemp }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: item.assessStatus }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30 shrink-0 shadow-2xs", children: item.nameEng.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[150px] font-bold text-slate-800 dark:text-slate-200", children: item.nameEng })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded", children: item.employeeType }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: item.department }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: item.section }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30 font-semibold", children: item.designation }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30 text-muted-foreground/80", children: "Permanent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: item.unit }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: item.line }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30", children: item.grade ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-1.5 py-0.5 rounded", children: item.grade }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/45", children: "—" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30 font-mono text-[11px] text-muted-foreground/80", children: item.doj }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 border-r border-border/30 font-mono text-[11px] text-muted-foreground/80", children: item.dob }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-[11px] text-muted-foreground/90", children: item.personalContact })
              ] }, item.empIdTemp);
            }),
            filteredCandidates.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 16, className: "px-4 py-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "size-10 text-muted-foreground/30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-muted-foreground", children: "No pending IE candidates" })
            ] }) }) })
          ] })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  IEAssessmentListPage as component
};
