import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, ae as Sparkles, S as Search, af as Send } from "../_libs/lucide-react.mjs";
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
function HRAssessmentListPage() {
  const router = useRouter();
  const [candidates, setCandidates] = reactExports.useState([]);
  const [filteredCandidates, setFilteredCandidates] = reactExports.useState([]);
  const [assessStatus, setAssessStatus] = reactExports.useState("HR Pending");
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
      const saved = localStorage.getItem("recruitment_candidates");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCandidates(parsed);
        setFilteredCandidates(parsed.filter((c) => c.assessStatus === "HR Pending" || c.assessStatus === "IE Submitted"));
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
  const handleExecute = (id) => {
    router.navigate({
      to: `/recruitment-hr-assessment/${id}`
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-lg border border-border/85 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "IE Recruitment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "HR Assessment" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground tracking-tight flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "HR Assessment Search" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs p-6 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-primary uppercase", children: "Assess Status *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: assessStatus, onChange: (e) => setAssessStatus(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-muted text-primary font-bold border border-border/40 text-xs focus:border-primary/80 outline-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HR Pending", children: "HR Pending" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HR Approved", children: "HR Approved" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HR Rejected", children: "HR Rejected" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-red-500 uppercase", children: "DOJ From *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: dojFrom, onChange: (e) => setDojFrom(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-red-500 uppercase", children: "DOJ To *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: dojTo, onChange: (e) => setDojTo(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Emp Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: empType, onChange: (e) => setEmpType(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select/Multi" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Office Executive", children: "Office Executive" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Worker", children: "Worker" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: department, onChange: (e) => setDepartment(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select/Multi" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "RMG Production", children: "RMG Production" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: section, onChange: (e) => setSection(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select/Multi" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "RMG-Production-IE & Planning", children: "IE & Planning" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: designation, onChange: (e) => setDesignation(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select/Multi" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Production Operator", children: "Production Operator" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Unit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: unit, onChange: (e) => setUnit(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select/Multi" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Unit-01", children: "Unit-01" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Line" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: line, onChange: (e) => setLine(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select/Multi" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Line-04", children: "Line-04" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex items-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Emp ID-Temp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Single/Multi", value: empIdTemp, onChange: (e) => setEmpIdTemp(e.target.value), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSearch, className: "h-10 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-black text-xs transition flex items-center justify-center gap-1.5 shadow-sm border border-border/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 text-primary" }),
                " Search"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-border/40 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "SL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Execute" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Emp ID (Temp)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Emp Name (Eng)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Emp Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Job Nature" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Unit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Line" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Grade" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "DOJ" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "DOB" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Personal Contact No" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/20 text-foreground font-semibold", children: [
              filteredCandidates.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: idx + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleExecute(item.empIdTemp), className: "p-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-400 hover:text-black border border-yellow-300 transition-colors", title: "Execute Assessment", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-primary", children: item.empIdTemp }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.nameEng }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.empCategory || item.employeeType }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.department || "RMG Operation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.section || "Sewing" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.appliedFor || item.designation || "Operator" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.jobNature || "Permanent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.unit || "Unit-6" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.line || "52" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-bold", children: item.grade || "-" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.doj }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.dob }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.personalContact })
              ] }, item.empIdTemp)),
              filteredCandidates.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 15, className: "px-4 py-10 text-center text-muted-foreground text-xs font-bold", children: "No pending candidates found." }) })
            ] })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  HRAssessmentListPage as component
};
