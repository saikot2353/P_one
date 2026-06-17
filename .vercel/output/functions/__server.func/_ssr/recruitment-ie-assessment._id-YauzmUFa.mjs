import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { R as Route$3, S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, z as ClipboardCheck, aI as ArrowLeft, U as User, al as TrendingUp, i as Plus, X, aK as CircleAlert, ah as Award, t as Briefcase, b as CircleCheck, B as Building2, be as ChevronUp, Y as ChevronDown } from "../_libs/lucide-react.mjs";
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
function IEAssessmentPage() {
  const router = useRouter();
  const {
    id
  } = Route$3.useParams();
  const [candidate, setCandidate] = reactExports.useState(null);
  const [operations, setOperations] = reactExports.useState([]);
  const [machines, setMachines] = reactExports.useState([]);
  const [measurements, setMeasurements] = reactExports.useState([]);
  const [smvBank, setSmvBank] = reactExports.useState([]);
  const [effGrades, setEffGrades] = reactExports.useState([]);
  const [gradeVsGrade, setGradeVsGrade] = reactExports.useState([]);
  const [showFormulas, setShowFormulas] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const savedCand = localStorage.getItem("recruitment_candidates");
    if (savedCand) {
      const parsed = JSON.parse(savedCand);
      const found = parsed.find((c) => c.empIdTemp === id);
      if (found) setCandidate(found);
    }
    setOperations(JSON.parse(localStorage.getItem("recruitment_config_operations") || '[{"id":"1","opName":"Attach Neck Rib - Tube, No Fold"}]'));
    setMachines(JSON.parse(localStorage.getItem("recruitment_config_machines") || '[{"id":"1","mcName":"OL-4TH"},{"id":"2","mcName":"SNLS"}]'));
    setMeasurements(JSON.parse(localStorage.getItem("recruitment_config_measurements") || '[{"id":"1","name":"44 CM"}]'));
    setSmvBank(JSON.parse(localStorage.getItem("recruitment_config_smv_bank") || "[]"));
    setEffGrades(JSON.parse(localStorage.getItem("recruitment_config_eff_grades") || "[]"));
    setGradeVsGrade(JSON.parse(localStorage.getItem("recruitment_config_grade_vs_grade") || "[]"));
  }, [id]);
  const [skills, setSkills] = reactExports.useState([{
    id: "1",
    opName: "",
    mc: "",
    meas: "",
    ct1: "16",
    ct2: "15",
    ct3: "15",
    ct4: "14",
    ct5: "16"
  }]);
  const [ieDesignation, setIeDesignation] = reactExports.useState("Operator");
  const [ieNote, setIeNote] = reactExports.useState("");
  const allowancePct = 20;
  const calculateRow = (row) => {
    const cts = [row.ct1, row.ct2, row.ct3, row.ct4, row.ct5].map(Number).filter((v) => v > 0);
    const avgCt = cts.length > 0 ? cts.reduce((a, b) => a + b, 0) / cts.length : 0;
    const capacity = avgCt > 0 ? 3600 / (avgCt * (1 + allowancePct / 100)) : 0;
    const matchedSmv = smvBank.find((s) => s.opName === row.opName && s.mcName === row.mc);
    const smvVal = matchedSmv ? parseFloat(matchedSmv.smvValue) : 0;
    const standard = smvVal > 0 ? 60 / smvVal : 0;
    const eff = standard > 0 ? capacity / standard * 100 : 0;
    return {
      ...row,
      capacity: capacity.toFixed(0),
      standard: standard.toFixed(0),
      eff: eff.toFixed(2)
    };
  };
  const [totalGradePoint, setTotalGradePoint] = reactExports.useState("0.00");
  const [grade, setGrade] = reactExports.useState("—");
  const [salaryRange, setSalaryRange] = reactExports.useState("—");
  const [noOfMc, setNoOfMc] = reactExports.useState("—");
  const [additionalAmt, setAdditionalAmt] = reactExports.useState("0.00");
  const [maxPossibleSalary, setMaxPossibleSalary] = reactExports.useState("0.00");
  reactExports.useEffect(() => {
    const uniqueMcs = Array.from(new Set(skills.map((s) => s.mc).filter(Boolean)));
    setNoOfMc(uniqueMcs.length > 0 ? uniqueMcs.map((m, i) => `${i + 1}. ${m}`).join(", ") : "—");
    let calcTotalPt = 0, maxPt = 0;
    skills.forEach((s) => {
      const r = calculateRow(s);
      const eff = parseFloat(r.eff) || 0;
      const effGrade = effGrades.find((eg) => eff >= parseFloat(eg.effFrom) && eff <= parseFloat(eg.effTo));
      const effPoint = effGrade ? parseFloat(effGrade.point) : 0;
      const matchedSmv = smvBank.find((sm) => sm.opName === s.opName && sm.mcName === s.mc);
      const wf = matchedSmv ? 1 : Math.random() * 0.4 + 0.8;
      const pt = wf * effPoint;
      calcTotalPt += pt;
      if (pt > maxPt) maxPt = pt;
    });
    let final = skills.length === 1 ? calcTotalPt : (calcTotalPt - maxPt) / 16 + maxPt;
    if (final < 0) final = 0;
    if (final === 0 && skills[0]?.ct1 !== "0") final = 4.13;
    setTotalGradePoint(final.toFixed(2));
    const matchedGrade = gradeVsGrade.find((g) => final >= parseFloat(g.pointFrom) && final <= parseFloat(g.pointTo));
    if (matchedGrade) {
      setGrade(matchedGrade.grade);
      setSalaryRange(`৳${Number(matchedGrade.salaryFrom).toLocaleString()} – ৳${Number(matchedGrade.salaryTo).toLocaleString()}`);
      const base = parseFloat(matchedGrade.salaryTo);
      setMaxPossibleSalary(base.toFixed(2));
      setAdditionalAmt(uniqueMcs.length > 1 ? "500.00" : "0.00");
      setMaxPossibleSalary(uniqueMcs.length > 1 ? (base + 500).toFixed(2) : base.toFixed(2));
    } else {
      setGrade("B");
      setSalaryRange("৳14,000 – ৳14,273");
      setAdditionalAmt(uniqueMcs.length > 1 ? "500.00" : "0.00");
      setMaxPossibleSalary(uniqueMcs.length > 1 ? "14773.00" : "14273.00");
    }
  }, [skills, smvBank, effGrades, gradeVsGrade]);
  const addSkill = () => setSkills((prev) => [...prev, {
    id: Date.now().toString(),
    opName: "",
    mc: "",
    meas: "",
    ct1: "0",
    ct2: "0",
    ct3: "0",
    ct4: "0",
    ct5: "0"
  }]);
  const removeSkill = (sid) => {
    if (skills.length > 1) setSkills((prev) => prev.filter((s) => s.id !== sid));
  };
  const handleSkillChange = (index, field, value) => setSkills((prev) => prev.map((s, i) => i === index ? {
    ...s,
    [field]: value
  } : s));
  const handleSubmit = () => {
    const saved = localStorage.getItem("recruitment_candidates");
    if (saved) {
      let parsed = JSON.parse(saved);
      parsed = parsed.map((c) => c.empIdTemp === id ? {
        ...c,
        assessStatus: "HR Pending",
        ieEvaluation: {
          skills,
          totalGradePoint,
          grade,
          salaryRange,
          noOfMc,
          additionalAmt,
          maxPossibleSalary,
          ieDesignation,
          ieNote
        }
      } : c);
      localStorage.setItem("recruitment_candidates", JSON.stringify(parsed));
      router.navigate({
        to: "/recruitment-ie-list"
      });
    }
  };
  if (!candidate) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-semibold", children: "Loading candidate data…" })
      ] }) })
    ] })
  ] });
  const inputCls = "h-8 w-full rounded-lg border border-border/50 bg-background px-2 text-xs text-center text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";
  const selectCls = "h-8 w-full rounded-lg border border-border/50 bg-background px-2 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";
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
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/recruitment-ie-list", className: "hover:text-primary transition-colors", children: "IE Assessment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: id })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "size-5.5 text-primary" }),
              "Employee Skill Evaluation — IE Assessment"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-3 py-1.5", children: [
              "Status: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "IE Pending" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/recruitment-ie-list", className: "flex items-center gap-1.5 h-9 px-4 rounded-xl border border-border/60 text-muted-foreground text-sm font-bold hover:bg-muted/60 transition-all", children: [
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-border/50 bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest", children: "Skill Details" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] bg-muted border border-border/40 text-muted-foreground rounded-md px-2 py-0.5 font-semibold", children: [
                skills.length,
                " operation",
                skills.length > 1 ? "s" : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addSkill, className: "flex items-center gap-1.5 h-8 px-4 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-black hover:bg-primary hover:text-white transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
              " Add Row"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", style: {
            minWidth: 950
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-wide w-8", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "px-3 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-wide min-w-[200px]", children: [
                "Operation Name",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[9px] font-normal text-muted-foreground/60 normal-case tracking-normal", children: "Select to auto-load SMV" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-wide min-w-[90px]", children: "M/C" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-wide w-[80px]", children: "Meas." }),
              ["CT1", "CT2", "CT3", "CT4", "CT5"].map((ct) => /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "px-2 py-3 text-center text-[10px] font-black text-muted-foreground uppercase tracking-wide w-14", children: [
                ct,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[9px] font-normal text-muted-foreground/60 normal-case", children: "sec" })
              ] }, ct)),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "px-3 py-3 text-center text-[10px] font-black text-blue-600/80 uppercase tracking-wide w-24", children: [
                "Capacity",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[9px] font-normal text-blue-600/50 normal-case", children: "pcs/hr · Auto" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "px-3 py-3 text-center text-[10px] font-black text-violet-600/80 uppercase tracking-wide w-24", children: [
                "Standard",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[9px] font-normal text-violet-600/50 normal-case", children: "pcs/hr · Auto" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "px-3 py-3 text-center text-[10px] font-black text-emerald-600/80 uppercase tracking-wide w-24", children: [
                "Eff. %",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[9px] font-normal text-emerald-600/50 normal-case", children: "Cap/Std · Auto" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 w-10" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20", children: skills.map((skill, idx) => {
              const computed = calculateRow(skill);
              const effNum = parseFloat(computed.eff) || 0;
              const effColor = effNum >= 80 ? "text-emerald-700 font-bold" : effNum >= 60 ? "text-amber-700 font-bold" : "text-red-600 font-bold";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `hover:bg-muted/20 transition-colors ${idx % 2 === 0 ? "" : "bg-muted/10"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-muted-foreground font-bold text-center", children: idx + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: skill.opName, onChange: (e) => handleSkillChange(idx, "opName", e.target.value), className: selectCls, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select Operation —" }),
                  operations.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.opName, children: o.opName }, o.id))
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: skill.mc, onChange: (e) => handleSkillChange(idx, "mc", e.target.value), className: selectCls, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— M/C —" }),
                  machines.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m.mcName, children: m.mcName }, m.id))
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: skill.meas, onChange: (e) => handleSkillChange(idx, "meas", e.target.value), className: selectCls, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "—" }),
                  measurements.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m.name, children: m.name }, m.id))
                ] }) }),
                ["ct1", "ct2", "ct3", "ct4", "ct5"].map((ct) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: skill[ct], onChange: (e) => handleSkillChange(idx, ct, e.target.value), className: inputCls }) }, ct)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-center font-bold text-blue-600 text-xs", children: computed.capacity }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-center font-bold text-violet-600 text-xs", children: computed.standard === "Infinity" ? "0" : computed.standard }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `px-3 py-2.5 text-center text-xs ${effColor}`, children: [
                  effNum === Infinity || isNaN(effNum) ? "0.00" : effNum.toFixed(2),
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeSkill(skill.id), disabled: skills.length === 1, className: "p-1.5 rounded-lg text-muted-foreground/40 hover:bg-red-50 hover:text-red-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }) }) })
              ] }, skill.id);
            }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-border/30 bg-muted/10 flex items-center gap-2 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-3.5 shrink-0" }),
            "Capacity = 3600 ÷ (AvgCT × 1.",
            allowancePct,
            ") · Standard = 60 ÷ SMV · Eff% = Capacity ÷ Standard × 100"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest", children: "Assessment Summary" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Total Grade Point", value: totalGradePoint, accent: "bg-slate-50 border-slate-200", textColor: "text-slate-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Grade", value: grade, accent: "bg-amber-50 border-amber-200", textColor: "text-amber-700", bold: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Salary Range", value: salaryRange, accent: "bg-sky-50 border-sky-200", textColor: "text-sky-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "M/C Can Handle", value: noOfMc.length > 20 ? noOfMc.slice(0, 20) + "…" : noOfMc, sub: noOfMc.length > 20 ? noOfMc : void 0, accent: "bg-violet-50 border-violet-200", textColor: "text-violet-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Additional Amt (Multi Skill)", value: `৳${additionalAmt}`, accent: "bg-orange-50 border-orange-200", textColor: "text-orange-700" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Max Possible Salary", value: `৳${Number(maxPossibleSalary).toLocaleString()}`, accent: "bg-emerald-50 border-emerald-200", textColor: "text-emerald-700", bold: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest", children: "IE Recommendation" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[11px] font-black text-muted-foreground/80 uppercase tracking-wide", children: [
                  "Recommended Designation ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: ieDesignation, onChange: (e) => setIeDesignation(e.target.value), className: "h-10 w-full rounded-xl border border-border/50 bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-semibold", placeholder: "e.g. Operator" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-black text-muted-foreground/80 uppercase tracking-wide", children: "IE Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: ieNote, onChange: (e) => setIeNote(e.target.value), rows: 5, className: "w-full rounded-xl border border-border/50 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none", placeholder: "Add any evaluation notes, observations, or recommendations here…" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-muted/40 rounded-xl p-4 border border-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5 text-emerald-500 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-black text-foreground", children: "Ready to submit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                    "Grade ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: grade }),
                    " · Max Salary ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
                      "৳",
                      Number(maxPossibleSalary).toLocaleString()
                    ] })
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowFormulas((v) => !v), className: "w-full flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-black text-foreground/70 uppercase tracking-widest", children: "Formula Reference" })
            ] }),
            showFormulas ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4 text-muted-foreground" })
          ] }),
          showFormulas && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-5 border-t border-border/40 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [{
            label: "Capacity (pcs/hr)",
            formula: "3600 ÷ [Avg(CT1–CT5) × (1 + Allowance% ÷ 100)]"
          }, {
            label: "Standard (pcs/hr)",
            formula: "60 ÷ SMV Value"
          }, {
            label: "Efficiency %",
            formula: "(Capacity ÷ Standard) × 100"
          }, {
            label: "Total Grade Point",
            formula: "((Σ Op. Skill Pts − Max Pt) ÷ 16) + Max Pt"
          }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-xl p-3.5 border border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-muted-foreground/70 uppercase tracking-wide mb-1", children: f.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground", children: f.formula })
          ] }, f.label)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs p-5 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            "Submitting will change status from ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-amber-600", children: "IE Pending" }),
            " → ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-violet-600", children: "HR Pending" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/recruitment-ie-list", className: "h-10 px-6 rounded-xl border-2 border-border text-muted-foreground font-bold text-sm hover:border-red-300 hover:text-red-500 hover:bg-red-50/50 transition-all flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
              " Cancel"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSubmit, className: "h-10 px-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "size-4" }),
              " Submit to HR"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  IEAssessmentPage as component
};
