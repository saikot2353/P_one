import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as Route$2, S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, z as ClipboardCheck, aI as ArrowLeft, U as User, al as TrendingUp, ah as Award, t as Briefcase, N as ShieldAlert, b as CircleCheck } from "../_libs/lucide-react.mjs";
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
function InfoField({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: value || "—" })
  ] });
}
function SummaryCard({
  label,
  value,
  sub,
  accent = "bg-slate-50 border-slate-200",
  textColor = "text-slate-800",
  bold = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-4 ${accent} flex flex-col gap-1`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xl font-black ${textColor} ${bold ? "text-2xl" : ""}`, children: value }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: sub })
  ] });
}
function HRAssessmentPage() {
  const router = useRouter();
  const {
    id
  } = Route$2.useParams();
  const [candidate, setCandidate] = reactExports.useState(null);
  const [ieData, setIeData] = reactExports.useState(null);
  const [proposedSalary, setProposedSalary] = reactExports.useState("0.00");
  const [hrDesignation, setHrDesignation] = reactExports.useState("Operator");
  const [hrNote, setHrNote] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCand = localStorage.getItem("recruitment_candidates");
      if (savedCand) {
        const parsed = JSON.parse(savedCand);
        const found = parsed.find((c) => c.empIdTemp === id);
        if (found) {
          setCandidate(found);
          const fallbackIeData = found.ieEvaluation || {
            skills: [{
              id: "1",
              opName: "Attach Neck Rib - Tube, No Fold",
              mc: "OL-4TH",
              meas: "44 CM",
              ct1: "15",
              ct2: "15",
              ct3: "15",
              ct4: "15",
              ct5: "15",
              capacity: "180",
              standard: "230",
              eff: "78.26"
            }],
            totalGradePoint: "4.13",
            grade: "B",
            salaryRange: "৳14,000 – ৳14,273",
            noOfMc: "1. OL-4TH",
            additionalAmt: "0.00",
            maxPossibleSalary: "14273.00",
            ieDesignation: found.designation || "Operator",
            ieNote: "Pre-seeded candidate. IE evaluation generated automatically."
          };
          setIeData(fallbackIeData);
          setHrDesignation(fallbackIeData.ieDesignation || "Operator");
          setProposedSalary(fallbackIeData.maxPossibleSalary || "0.00");
          if (found.hrEvaluation) {
            setProposedSalary(found.hrEvaluation.proposedSalary);
            setHrDesignation(found.hrEvaluation.hrDesignation);
            setHrNote(found.hrEvaluation.hrNote);
          }
        }
      }
    }
  }, [id]);
  const handleSubmit = () => {
    const saved = localStorage.getItem("recruitment_candidates");
    if (saved) {
      let parsed = JSON.parse(saved);
      parsed = parsed.map((c) => {
        if (c.empIdTemp === id) {
          return {
            ...c,
            assessStatus: "HR Approved",
            hrEvaluation: {
              proposedSalary,
              hrDesignation,
              hrNote
            }
          };
        }
        return c;
      });
      localStorage.setItem("recruitment_candidates", JSON.stringify(parsed));
      alert("Submitted! Personnel Form will generate where user can update name, address, others info (except Salary). Salary break-down will be automatic.");
      router.navigate({
        to: "/recruitment-assessment-list"
      });
    }
  };
  const handleReject = () => {
    const saved = localStorage.getItem("recruitment_candidates");
    if (saved) {
      let parsed = JSON.parse(saved);
      parsed = parsed.map((c) => {
        if (c.empIdTemp === id) {
          return {
            ...c,
            assessStatus: "HR Rejected"
          };
        }
        return c;
      });
      localStorage.setItem("recruitment_candidates", JSON.stringify(parsed));
      router.navigate({
        to: "/recruitment-assessment-list"
      });
    }
  };
  if (!candidate || !ieData) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-semibold", children: "Loading candidate evaluation data…" })
      ] }) })
    ] })
  ] });
  const isViewOnly = candidate.assessStatus === "HR Approved" || candidate.assessStatus === "HR Rejected";
  const labelCls = "text-[11px] font-black text-muted-foreground/80 uppercase tracking-wide";
  const inputCls = "h-10 w-full rounded-xl border border-border/50 bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-semibold disabled:opacity-75 disabled:cursor-not-allowed";
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
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/recruitment-assessment-list", className: "hover:text-primary transition-colors", children: "HR Evaluation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: id })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "size-5.5 text-primary" }),
              "Employee Skill Evaluation — ",
              isViewOnly ? "Assessment View" : "HR Assessment"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[11px] font-bold border rounded-lg px-3 py-1.5 
                ${candidate.assessStatus === "HR Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : candidate.assessStatus === "HR Rejected" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-purple-50 text-purple-700 border-purple-200"}`, children: [
              "Status: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: candidate.assessStatus })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/recruitment-assessment-list", className: "flex items-center gap-1.5 h-9 px-4 rounded-xl border border-border/60 text-muted-foreground text-sm font-bold hover:bg-muted/60 transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
              " Back"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest", children: "Candidate Information" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { label: "Emp Name", value: candidate.nameEng }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { label: "Temp ID", value: candidate.empIdTemp }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { label: "Designation", value: candidate.appliedFor || candidate.designation || "Operator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { label: "Department", value: candidate.department || "RMG Operation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { label: "Section", value: candidate.section || "Sewing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { label: "Unit", value: candidate.unit || "Unit-6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { label: "Line", value: candidate.line || "55" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { label: "Date of Joining", value: candidate.doj }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { label: "Contact", value: candidate.personalContact || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoField, { label: "Emp Type", value: candidate.employeeType || "Worker" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest", children: "Skill Evaluation Results" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs text-left", style: {
            minWidth: 950
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b border-border/50 text-muted-foreground font-black uppercase tracking-wide text-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 text-center w-12 border-r border-border/30", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[200px] border-r border-border/30", children: "Operation Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 min-w-[90px] border-r border-border/30 text-center", children: "M/C" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 w-[80px] border-r border-border/30 text-center", children: "Meas." }),
              ["CT1", "CT2", "CT3", "CT4", "CT5"].map((ct) => /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "px-2 py-3.5 text-center w-14 border-r border-border/30", children: [
                ct,
                " (s)"
              ] }, ct)),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 text-center w-24 border-r border-border/30 text-blue-600/80", children: "Capacity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 text-center w-24 border-r border-border/30 text-violet-600/80", children: "Standard" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3.5 text-center w-24 text-emerald-600/80", children: "Eff. %" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20 text-foreground", children: ieData.skills.map((skill, idx) => {
              const isEven = idx % 2 === 0;
              const rowBgClass = isEven ? "bg-white dark:bg-[#0f172a]" : "bg-[#f8fafc] dark:bg-[#131d30]";
              const effNum = parseFloat(skill.eff) || 0;
              const effColor = effNum >= 80 ? "text-emerald-700 font-bold" : effNum >= 60 ? "text-amber-700 font-bold" : "text-red-600 font-bold";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all ${rowBgClass}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center text-slate-500 font-bold border-r border-border/30", children: idx + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold border-r border-border/30", children: skill.opName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-muted px-1.5 py-0.5 rounded text-[10px] font-bold", children: skill.mc }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r border-border/30 font-medium text-slate-600", children: skill.meas }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-center border-r border-border/30 font-mono", children: skill.ct1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-center border-r border-border/30 font-mono", children: skill.ct2 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-center border-r border-border/30 font-mono", children: skill.ct3 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-center border-r border-border/30 font-mono", children: skill.ct4 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-center border-r border-border/30 font-mono", children: skill.ct5 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r border-border/30 font-bold text-blue-600", children: skill.capacity }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r border-border/30 font-bold text-violet-600", children: skill.standard === "Infinity" ? "0" : skill.standard }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `px-4 py-3 text-center font-black ${effColor}`, children: [
                  effNum.toFixed(2),
                  "%"
                ] })
              ] }, skill.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest", children: "Assessment Summary" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Total Grade Point", value: ieData.totalGradePoint, accent: "bg-slate-50 border-slate-200", textColor: "text-slate-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Grade", value: ieData.grade, accent: "bg-amber-50 border-amber-200", textColor: "text-amber-700", bold: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Salary Range", value: ieData.salaryRange, accent: "bg-sky-50 border-sky-200", textColor: "text-sky-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "M/C Can Handle", value: ieData.noOfMc.length > 20 ? ieData.noOfMc.slice(0, 20) + "…" : ieData.noOfMc, sub: ieData.noOfMc.length > 20 ? ieData.noOfMc : void 0, accent: "bg-violet-50 border-violet-200", textColor: "text-violet-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Additional Amt", value: `৳${ieData.additionalAmt}`, accent: "bg-orange-50 border-orange-200", textColor: "text-orange-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Max Possible Salary", value: `৳${Number(ieData.maxPossibleSalary).toLocaleString()}`, accent: "bg-emerald-50 border-emerald-200", textColor: "text-emerald-700", bold: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest", children: "IE Recommendation" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest", children: "Recommended Designation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground bg-muted/50 border border-border/50 px-3 py-2 rounded-xl", children: ieData.ieDesignation })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest", children: "IE Notes / Observations" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground bg-muted/30 border border-border/40 p-3.5 rounded-xl min-h-[120px] leading-relaxed", children: ieData.ieNote || "No notes provided by IE Assessor." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest", children: "HR Recommendation" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: labelCls, children: [
                  "Proposed Gross Salary ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: proposedSalary, disabled: isViewOnly, onChange: (e) => setProposedSalary(e.target.value), className: inputCls, placeholder: "e.g. 14500" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: labelCls, children: [
                  "HR Final Designation ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: hrDesignation, disabled: isViewOnly, onChange: (e) => setHrDesignation(e.target.value), className: inputCls, placeholder: "e.g. Operator" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelCls, children: "HR Comments / Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: hrNote, disabled: isViewOnly, onChange: (e) => setHrNote(e.target.value), rows: 3, className: "w-full rounded-xl border border-border/50 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none disabled:opacity-75 disabled:cursor-not-allowed", placeholder: "Add manual comments, salary details, approval notes..." })
              ] })
            ] })
          ] })
        ] }),
        !isViewOnly ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs p-5 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            "Approval promotes candidate to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-emerald-600", children: "HR Approved" }),
            " and registers them in Personnel List."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/recruitment-assessment-list", className: "h-10 px-6 rounded-xl border-2 border-border text-muted-foreground font-bold text-sm hover:border-red-300 hover:text-red-500 hover:bg-red-50/50 transition-all flex items-center gap-2", children: "Close" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleReject, className: "h-10 px-6 rounded-xl bg-rose-50 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-sm hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2", children: "Reject Candidate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSubmit, className: "h-10 px-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
              " Approve & Generate Form"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs p-8 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest pb-4 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Evaluation Completed" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-y-10 gap-x-4 pt-4 text-[10px] font-bold text-muted-foreground uppercase text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 mx-auto border-t border-muted-foreground/60 pt-2", children: "Operator" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 mx-auto border-t border-muted-foreground/60 pt-2", children: "Assessor (IE)" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 mx-auto border-t border-muted-foreground/60 pt-2", children: "PM / Sr. PM" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 mx-auto border-t border-muted-foreground/60 pt-2", children: "HR Executive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 mx-auto border-t border-muted-foreground/60 pt-2", children: "Unit Leader (IE)" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 mx-auto border-t border-muted-foreground/60 pt-2", children: "Sr. Manager (IE)" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 mx-auto border-t border-muted-foreground/60 pt-2", children: "Head of Production" }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  HRAssessmentPage as component
};
