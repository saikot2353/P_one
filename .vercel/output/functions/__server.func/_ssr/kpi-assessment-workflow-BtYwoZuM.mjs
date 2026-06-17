import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, z as ClipboardCheck, K as RefreshCw, al as TrendingUp, U as User, aN as Building, aO as Star, b as CircleCheck, aq as Lock, aP as LockOpen, X, a5 as Check, Y as ChevronDown, S as Search } from "../_libs/lucide-react.mjs";
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
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className = ""
}) {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const containerRef = reactExports.useRef(null);
  const selectedOption = options.find((o) => o.value === value);
  const filteredOptions = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()) || o.value.toLowerCase().includes(search.toLowerCase()));
  reactExports.useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: `relative w-full ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
      setIsOpen(!isOpen);
      setSearch("");
    }, className: "w-full h-10 px-3.5 rounded-xl bg-card border border-border/80 text-xs font-semibold flex items-center justify-between text-left focus:border-[#1e88e5] hover:bg-muted/30 transition duration-150 cursor-pointer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-foreground font-bold", children: selectedOption ? selectedOption.label : placeholder }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `size-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}` })
    ] }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-50 w-full mt-1.5 bg-card border border-border rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-150", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 border-b border-border/30 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", autoFocus: true, value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search...", className: "w-full h-8 pl-8 pr-3 bg-muted/60 focus:bg-card border border-border/40 focus:border-[#1e88e5] focus:ring-1 focus:ring-[#1e88e5]/20 rounded-lg outline-none text-xs font-bold transition font-sans" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-48 overflow-y-auto p-1 divide-y divide-border/10 font-sans text-xs", children: filteredOptions.length > 0 ? filteredOptions.map((option) => {
        const isSelected = option.value === value;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
          onChange(option.value);
          setIsOpen(false);
        }, className: `w-full px-3 py-2 text-left rounded-lg transition duration-100 flex items-center justify-between font-bold ${isSelected ? "bg-[#1e88e5]/10 text-[#1e88e5]" : "text-foreground/80 hover:bg-muted/80 hover:text-foreground"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: option.label }),
          isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3 text-[#1e88e5]" })
        ] }, option.value);
      }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2.5 text-center text-muted-foreground text-[11px] font-medium", children: "No matching options found" }) })
    ] })
  ] });
}
const appraisalEmployees = {
  "2024091802": {
    id: "2024091802",
    name: "Md. Anik Islam",
    department: "Business Innovation",
    jobTitle: "Business Analyst",
    grossSalary: 79e3
  },
  "2023043910": {
    id: "2023043910",
    name: "Tahmid Afsar Shapno",
    department: "Business Innovation",
    jobTitle: "Asst. Manager",
    grossSalary: 152e3
  },
  "2025110293": {
    id: "2025110293",
    name: "Riazul Islam",
    department: "Operations & HR",
    jobTitle: "HR Officer",
    grossSalary: 45e3
  }
};
const taskItems = [{
  id: 1,
  name: "Decision Making/ Problem Solving",
  detail: "Measures effectiveness in understanding problems and making timely practical decisions, best suited for the business."
}, {
  id: 2,
  name: "Independent Action",
  detail: "Takes initiative, solves problems independently, makes decisions without needing step-by-step guidance, seeks solutions instead of waiting for instructions, accepts responsibility for actions taken."
}, {
  id: 3,
  name: "Leadership",
  detail: "Influence, guide, and support others toward achieving goals — whether in a formal leadership role or through informal influence."
}, {
  id: 4,
  name: "Dependability",
  detail: "Delivers quality work on time, can be trusted to follow instructions accurately, requires minimal supervision, is consistent and reliable in their duties, is accountable for their actions and mistakes."
}, {
  id: 5,
  name: "Teamwork",
  detail: "The ability to inspire subordinates & others with collaboration effort to achieve a common goal / complete a task."
}, {
  id: 6,
  name: "Verbal & Written Communication",
  detail: "The ability to communicate effectively & efficiently within the organization & out of organization."
}, {
  id: 7,
  name: "Knowledge of law & SOP",
  detail: "KPI evaluates how well an employee understands and applies relevant legal regulations, industry standards, and internal procedures in their daily work."
}, {
  id: 8,
  name: "Loyalty of company",
  detail: "KPI measures how committed an employee is to the organization's mission, values, and long-term success."
}];
function KpiAssessmentWorkflowPage() {
  const [selectedEmpId, setSelectedEmpId] = reactExports.useState("2024091802");
  const activeEmp = appraisalEmployees[selectedEmpId] || appraisalEmployees["2024091802"];
  const [activeStep, setActiveStep] = reactExports.useState(1);
  const [completedSteps, setCompletedSteps] = reactExports.useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = reactExports.useState(false);
  const [taskMarks, setTaskMarks] = reactExports.useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0
  });
  const [taskNotes, setTaskNotes] = reactExports.useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: ""
  });
  const [hodManualMarks, setHodManualMarks] = reactExports.useState("0");
  const [hodRecommendation, setHodRecommendation] = reactExports.useState("");
  const [improvementPlan, setImprovementPlan] = reactExports.useState("");
  const [specialComments, setSpecialComments] = reactExports.useState("");
  const [jdDetails, setJdDetails] = reactExports.useState("");
  const [hrdStrength, setHrdStrength] = reactExports.useState("");
  const [hrdImprovementPlan, setHrdImprovementPlan] = reactExports.useState("");
  const [hrdSpecialComments, setHrdSpecialComments] = reactExports.useState("");
  const [plantHeadComments, setPlantHeadComments] = reactExports.useState("");
  const [plantHeadApproval, setPlantHeadApproval] = reactExports.useState("Approved");
  const [mdComments, setMdComments] = reactExports.useState("");
  const [mdApproval, setMdApproval] = reactExports.useState("Approved");
  const [incAmount, setIncAmount] = reactExports.useState("");
  const [givePromotion, setGivePromotion] = reactExports.useState("No");
  const [effectYear, setEffectYear] = reactExports.useState("2026");
  const [effectMonth, setEffectMonth] = reactExports.useState("May");
  const [finalNotes, setFinalNotes] = reactExports.useState("");
  const newGrossSalary = reactExports.useMemo(() => {
    const incVal = parseFloat(incAmount) || 0;
    return activeEmp.grossSalary + incVal;
  }, [activeEmp.grossSalary, incAmount]);
  const handleCompleteHod = (e) => {
    e.preventDefault();
    if (!hodRecommendation.trim() || !improvementPlan.trim()) {
      alert("Please enter HOD Recommendations and Improvement Plan!");
      return;
    }
    setCompletedSteps((prev) => [...prev, 1]);
    setActiveStep(2);
  };
  const handleCompleteHr = (e) => {
    e.preventDefault();
    if (!hrdStrength.trim() || !hrdImprovementPlan.trim()) {
      alert("Please enter HRD Strengths and Improvement Plan!");
      return;
    }
    setCompletedSteps((prev) => [...prev, 2]);
    setActiveStep(3);
  };
  const handleCompletePlantHead = (e) => {
    e.preventDefault();
    if (!plantHeadComments.trim()) {
      alert("Please enter Plant Head Comments!");
      return;
    }
    setCompletedSteps((prev) => [...prev, 3]);
    setActiveStep(4);
  };
  const handleCompleteMd = (e) => {
    e.preventDefault();
    if (!mdComments.trim()) {
      alert("Please enter Managing Director Comments!");
      return;
    }
    setCompletedSteps((prev) => [...prev, 4]);
    setActiveStep(5);
  };
  const handleCompleteFinal = (e) => {
    e.preventDefault();
    if (!incAmount.trim() || isNaN(parseFloat(incAmount))) {
      alert("Please specify a valid Increment Amount!");
      return;
    }
    setCompletedSteps((prev) => [...prev, 5]);
    alert("KPI Appraisal Assessment Workflow Completed Successfully!");
  };
  const handleResetWorkflow = () => {
    setActiveStep(1);
    setCompletedSteps([]);
    setTaskMarks({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0
    });
    setTaskNotes({
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: ""
    });
    setHodManualMarks("0");
    setHodRecommendation("");
    setImprovementPlan("");
    setSpecialComments("");
    setJdDetails("");
    setHrdStrength("");
    setHrdImprovementPlan("");
    setHrdSpecialComments("");
    setPlantHeadComments("");
    setMdComments("");
    setIncAmount("");
    setGivePromotion("No");
    setFinalNotes("");
  };
  const employeeOptions = reactExports.useMemo(() => {
    return Object.keys(appraisalEmployees).map((id) => ({
      value: id,
      label: `${id} - ${appraisalEmployees[id].name} (${appraisalEmployees[id].jobTitle})`
    }));
  }, []);
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/75", children: "KPI" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "Assessment Workflow" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "size-5.5 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "KPI Assessment Workflow" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleResetWorkflow, className: "h-9 px-4 border border-[#1e88e5] text-[#1e88e5] hover:bg-[#1e88e5]/5 font-bold text-xs rounded-lg flex items-center gap-2 transition uppercase", title: "Reset appraisal stages to try step lock process again", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reset Workflow" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsHistoryOpen(true), className: "h-9 px-5 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "View Increment History" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-5 items-center print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-muted-foreground uppercase block", children: "Appraisal Target Employee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { options: employeeOptions, value: selectedEmpId, onChange: setSelectedEmpId })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-muted/30 px-4 py-2.5 rounded-xl border border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase block", children: "Role & Dept" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-black text-foreground", children: [
                activeEmp.jobTitle,
                " — ",
                activeEmp.department
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-muted/30 px-4 py-2.5 rounded-xl border border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "size-5 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase block", children: "Current Gross Salary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-black text-foreground", children: [
                activeEmp.grossSalary.toLocaleString("en-US", {
                  minimumFractionDigits: 2
                }),
                " BDT"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-6 shadow-xs print:hidden space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/30 pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-4 animate-spin text-[#1e88e5]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Approval Sequence Progress" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-muted-foreground/80", children: [
              "Current Active: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#1e88e5] font-black", children: [
                "Step ",
                activeStep,
                " — ",
                activeStep === 1 ? "HOD Assessment" : activeStep === 2 ? "HR Review" : activeStep === 3 ? "Plant Head" : activeStep === 4 ? "Managing Director" : "Final Appraisal"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-5 gap-4 relative", children: [{
            step: 1,
            label: "HOD Appraisal",
            desc: "Dept Head scoring"
          }, {
            step: 2,
            label: "HR Recommendation",
            desc: "Strength & plan review"
          }, {
            step: 3,
            label: "Plant Head",
            desc: "Executive endorsement"
          }, {
            step: 4,
            label: "Managing Director",
            desc: "Salary band approval"
          }, {
            step: 5,
            label: "Final Evaluation",
            desc: "Appraisal completion"
          }].map((item) => {
            const isCompleted = completedSteps.includes(item.step);
            const isActive = activeStep === item.step;
            const isLocked = activeStep < item.step;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-3.5 rounded-xl border transition-all duration-150 flex items-start gap-3 ${isActive ? "bg-[#1e88e5]/5 border-[#1e88e5] shadow-xs relative" : isCompleted ? "bg-emerald-500/5 border-emerald-500/20" : "bg-slate-100/50 dark:bg-slate-900/30 border-border/40 opacity-60"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-[#1e88e5] text-white" : "bg-muted text-muted-foreground"}`, children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5" }) : item.step }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-foreground block", children: item.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground block font-medium leading-tight", children: item.desc }),
                isLocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-muted-foreground/60 text-[9px] font-bold mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-2.5" }),
                  " Locked"
                ] }),
                isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[#1e88e5] text-[9px] font-bold mt-1 animate-pulse", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "size-2.5" }),
                  " In Progress"
                ] })
              ] })
            ] }, item.step);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep !== 1 ? "opacity-75" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`, children: [
            activeStep > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[9px] px-3.5 py-1 uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5 z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "HOD Stage Completed" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border/30 bg-muted/20 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-black text-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs", children: "1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Assessment Details For - ",
                  activeEmp.name
                ] })
              ] }),
              activeStep > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10.5px] font-bold text-emerald-500", children: "Inputs Locked & Archived" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-border/50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-12 border-r border-border/30", children: "#" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-[45%] border-r border-border/30", children: "Task Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-28 border-r border-border/30", children: "HOD Marks" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold", children: "Notes" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/30 text-xs font-semibold", children: taskItems.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center text-muted-foreground/60 border-r border-border/20 font-bold", children: idx + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 border-r border-border/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold block", children: item.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground leading-relaxed block mt-0.5", children: item.detail })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, max: 20, disabled: activeStep !== 1, value: taskMarks[item.id], onChange: (e) => {
                    const val = Math.min(20, Math.max(0, parseInt(e.target.value) || 0));
                    setTaskMarks((prev) => ({
                      ...prev,
                      [item.id]: val
                    }));
                  }, className: "w-18 h-7 text-center rounded border border-border/40 focus:border-[#1e88e5] outline-none text-xs font-bold font-mono bg-card disabled:bg-muted/50 disabled:cursor-not-allowed" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Remarks...", disabled: activeStep !== 1, value: taskNotes[item.id], onChange: (e) => setTaskNotes((prev) => ({
                    ...prev,
                    [item.id]: e.target.value
                  })), className: "w-full h-7 px-2.5 rounded border border-border/40 focus:border-[#1e88e5] outline-none text-xs font-bold bg-card disabled:bg-muted/50 disabled:cursor-not-allowed" }) })
                ] }, item.id)) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCompleteHod, className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10.5px] font-bold text-muted-foreground uppercase", children: "HOD Manual Marks( Out of 20 ) *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", required: true, disabled: activeStep !== 1, value: hodManualMarks, onChange: (e) => setHodManualMarks(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none disabled:cursor-not-allowed" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/30 pt-4 space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-black text-[#1e88e5] uppercase tracking-wider block", children: "Recommendation By Reporting HOD" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "HOD Recommendation *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, disabled: activeStep !== 1, value: hodRecommendation, onChange: (e) => setHodRecommendation(e.target.value), placeholder: "Provide performance feedback or justification for promotions/increments...", className: "w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Improvement Plan *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, disabled: activeStep !== 1, value: improvementPlan, onChange: (e) => setImprovementPlan(e.target.value), placeholder: "Action steps or professional training program recommended...", className: "w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Special Comments" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { disabled: activeStep !== 1, value: specialComments, onChange: (e) => setSpecialComments(e.target.value), placeholder: "Additional context or exceptional work mentions...", className: "w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Existing JD & New JD" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { disabled: activeStep !== 1, value: jdDetails, onChange: (e) => setJdDetails(e.target.value), placeholder: "Notes on current Job Description responsibilities and recommended extensions...", className: "w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed" })
                    ] })
                  ] })
                ] }),
                activeStep === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-3 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase tracking-wider", children: "Submit HOD Assessment & Unlock HR Stage" }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep !== 2 ? "opacity-70 bg-slate-50/10" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`, children: [
            activeStep < 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-background/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-2 select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-6 text-muted-foreground/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-muted-foreground/80 tracking-wide uppercase", children: "HR Stage Locked" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/65", children: "Pending HOD Appraisal completion" })
            ] }),
            activeStep > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[9px] px-3.5 py-1 uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5 z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "HR Review Completed" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 border-b border-border/30 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-black text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs", children: "2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Recommendation By HRD" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCompleteHr, className: "space-y-4 text-xs font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "HRD Strength *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, disabled: activeStep !== 2, value: hrdStrength, onChange: (e) => setHrdStrength(e.target.value), placeholder: "Detail the employee's core organizational strengths...", className: "w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "HRD Improvement Plan *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, disabled: activeStep !== 2, value: hrdImprovementPlan, onChange: (e) => setHrdImprovementPlan(e.target.value), placeholder: "Detail the target plan for skill enhancement...", className: "w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "HRD Special Comments" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { disabled: activeStep !== 2, value: hrdSpecialComments, onChange: (e) => setHrdSpecialComments(e.target.value), placeholder: "Include other background remarks or records audit clearance notes...", className: "w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed" })
                ] })
              ] }),
              activeStep === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-3 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase tracking-wider", children: "Submit HR Review & Unlock Plant Head Stage" }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep !== 3 ? "opacity-70 bg-slate-50/10" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`, children: [
            activeStep < 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-background/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-2 select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-6 text-muted-foreground/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-muted-foreground/80 tracking-wide uppercase", children: "Plant Head Stage Locked" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/65", children: "Pending HR Review completion" })
            ] }),
            activeStep > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[9px] px-3.5 py-1 uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5 z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Plant Head Stage Completed" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 border-b border-border/30 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-black text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs", children: "3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Endorsement By Plant Head / Executive Director" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCompletePlantHead, className: "space-y-4 text-xs font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Plant Head Decision" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { disabled: activeStep !== 3, value: plantHeadApproval, onChange: (e) => setPlantHeadApproval(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted/20 border border-border/40 text-xs outline-none", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Approved", children: "Approved for increment recommendation" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Approved with Adjustment", children: "Approved with adjustment suggestions" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Hold", children: "Hold for review" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Plant Head Comments & Remarks *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, disabled: activeStep !== 3, value: plantHeadComments, onChange: (e) => setPlantHeadComments(e.target.value), placeholder: "Enter Plant Head specific recommendation remarks...", className: "w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed" })
                ] })
              ] }),
              activeStep === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-3 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase tracking-wider", children: "Submit Plant Head Approval & Unlock Managing Director Stage" }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep !== 4 ? "opacity-70 bg-slate-50/10" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`, children: [
            activeStep < 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-background/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-2 select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-6 text-muted-foreground/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-muted-foreground/80 tracking-wide uppercase", children: "MD Stage Locked" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/65", children: "Pending Plant Head approval completion" })
            ] }),
            activeStep > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[9px] px-3.5 py-1 uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5 z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "MD Stage Completed" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 border-b border-border/30 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-black text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs", children: "4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Evaluation & Signature By Managing Director" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCompleteMd, className: "space-y-4 text-xs font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Managing Director Decision" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { disabled: activeStep !== 4, value: mdApproval, onChange: (e) => setMdApproval(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted/20 border border-border/40 text-xs outline-none", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Approved", children: "Approved for final assessment" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Adjusted", children: "Adjusted salary increment band" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Declined", children: "Declined appraisal recommendation" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "MD Directive Comments *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, disabled: activeStep !== 4, value: mdComments, onChange: (e) => setMdComments(e.target.value), placeholder: "Enter the Managing Director final executive instructions...", className: "w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed" })
                ] })
              ] }),
              activeStep === 4 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-3 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase tracking-wider", children: "Submit MD Directive & Unlock Final Evaluation" }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep !== 5 ? "opacity-70 bg-slate-50/10" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`, children: [
            activeStep < 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-background/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-2 select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-6 text-muted-foreground/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-muted-foreground/80 tracking-wide uppercase", children: "Final Evaluation Stage Locked" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/65", children: "Pending Managing Director final endorsement" })
            ] }),
            completedSteps.includes(5) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[9px] px-3.5 py-1 uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5 z-10 animate-pulse", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Workflow Finalized & Archived" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 border-b border-border/30 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-black text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs", children: "5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Evaluation & Increment Execution" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCompleteFinal, className: "space-y-5 text-xs font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10.5px] font-bold text-muted-foreground uppercase", children: "Existing Gross" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-9 px-3 bg-muted/50 rounded-lg border border-border/40 flex items-center text-xs font-bold font-mono text-foreground/80", children: activeEmp.grossSalary.toLocaleString("en-US", {
                    minimumFractionDigits: 2
                  }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10.5px] font-bold text-muted-foreground uppercase", children: "Inc Amount *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", required: true, disabled: completedSteps.includes(5), value: incAmount, onChange: (e) => setIncAmount(e.target.value), placeholder: "e.g. 8500", className: "w-full h-9 px-3 rounded-lg bg-card border border-border/40 focus:border-[#1e88e5] text-xs font-bold font-mono outline-none disabled:bg-muted/50" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10.5px] font-bold text-muted-foreground uppercase", children: "New Gross Salary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-9 px-3 bg-[#1e88e5]/5 rounded-lg border border-[#1e88e5]/30 flex items-center text-xs font-black font-mono text-[#1e88e5]", children: [
                    newGrossSalary.toLocaleString("en-US", {
                      minimumFractionDigits: 2
                    }),
                    " BDT"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10.5px] font-bold text-muted-foreground uppercase", children: "Give Promotion *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { disabled: completedSteps.includes(5), value: givePromotion, onChange: (e) => setGivePromotion(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-card border border-border/40 text-xs font-bold outline-none", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No", children: "No" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Yes", children: "Yes (Promote Job Title)" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10.5px] font-bold text-muted-foreground uppercase", children: "Effect Year *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { disabled: completedSteps.includes(5), value: effectYear, onChange: (e) => setEffectYear(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-card border border-border/40 text-xs font-bold outline-none", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2026", children: "2026" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2027", children: "2027" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2025", children: "2025" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10.5px] font-bold text-muted-foreground uppercase", children: "Effect Month *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { disabled: completedSteps.includes(5), value: effectMonth, onChange: (e) => setEffectMonth(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-card border border-border/40 text-xs font-bold outline-none", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "May", children: "May" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "June", children: "June" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "July", children: "July" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "January", children: "January" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Final Appraisal Execution Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { disabled: completedSteps.includes(5), value: finalNotes, onChange: (e) => setFinalNotes(e.target.value), placeholder: "Add final appraisal summary comments...", className: "w-full h-16 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed" })
              ] }),
              !completedSteps.includes(5) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start pt-3 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-10 px-10 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg shadow-md transition uppercase tracking-wider", children: "SAVE appraisal & execute" }) }),
              completedSteps.includes(5) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3.5 text-emerald-600", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5 animate-bounce shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-xs block", children: "Appraisal Workflow Finalized Successfully!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10.5px] font-bold block opacity-90 mt-0.5", children: [
                    "New gross salary of ",
                    newGrossSalary.toLocaleString("en-US", {
                      minimumFractionDigits: 2
                    }),
                    " BDT has been committed. Increment effective from ",
                    effectMonth,
                    ", ",
                    effectYear,
                    "."
                  ] })
                ] })
              ] })
            ] }) })
          ] })
        ] })
      ] })
    ] }),
    isHistoryOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-lg rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsHistoryOpen(false), className: "absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-5 text-[#1e88e5]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Increment History — ",
          activeEmp.name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-muted/40 p-3 rounded-xl border border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase block", children: "Base Joining Gross" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-foreground", children: "60,000.00 BDT" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase block", children: "Joining Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground", children: "01/06/2023" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative border-l border-border pl-6 space-y-5 ml-3 font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -left-8.5 top-0.5 size-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-foreground text-xs", children: "Annual Performance appraisal 2025" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded", children: "+10,000 BDT" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10.5px] text-muted-foreground block mt-1", children: "Increment from 69,000 BDT to 79,000 BDT. Endorsed by HR and MD. Effective May 2025." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -left-8.5 top-0.5 size-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-foreground text-xs", children: "Annual Performance appraisal 2024" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded", children: "+9,000 BDT" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10.5px] text-muted-foreground block mt-1", children: "Increment from 60,000 BDT to 69,000 BDT. Effective May 2024." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-3 border-t border-border/30 mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsHistoryOpen(false), className: "h-9 px-6 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider", children: "Close History" }) })
      ] })
    ] }) })
  ] });
}
export {
  KpiAssessmentWorkflowPage as component
};
