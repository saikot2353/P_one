import { useState, useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, ClipboardCheck, Plus, X, User,
  Building2, TrendingUp, Briefcase, Award,
  AlertCircle, ChevronDown, ChevronUp, CheckCircle2, ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/recruitment-ie-assessment/$id")({
  head: () => ({
    meta: [
      { title: "IE Assessment — CRIPTON HRIS" },
      { name: "description", content: "IE Assessment evaluation form." },
    ],
  }),
  component: IEAssessmentPage,
});

// ─── Reusable Info Field ────────────────────────────────────────────────────
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-foreground">{value || "—"}</p>
    </div>
  );
}

// ─── Summary Card ───────────────────────────────────────────────────────────
function SummaryCard({
  label, value, sub, accent = "bg-slate-50 border-slate-200", textColor = "text-slate-800", bold = false,
}: { label: string; value: string; sub?: string; accent?: string; textColor?: string; bold?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent} flex flex-col gap-1`}>
      <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{label}</p>
      <p className={`text-xl font-black ${textColor} ${bold ? "text-2xl" : ""}`}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
function IEAssessmentPage() {
  const router = useRouter();
  const { id } = Route.useParams();

  const [candidate, setCandidate] = useState<any>(null);
  const [operations, setOperations] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [smvBank, setSmvBank] = useState<any[]>([]);
  const [effGrades, setEffGrades] = useState<any[]>([]);
  const [gradeVsGrade, setGradeVsGrade] = useState<any[]>([]);
  const [showFormulas, setShowFormulas] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedCand = localStorage.getItem("recruitment_candidates");
    if (savedCand) {
      const parsed = JSON.parse(savedCand);
      const found = parsed.find((c: any) => c.empIdTemp === id);
      if (found) setCandidate(found);
    }
    setOperations(JSON.parse(localStorage.getItem("recruitment_config_operations") || "[{\"id\":\"1\",\"opName\":\"Attach Neck Rib - Tube, No Fold\"}]"));
    setMachines(JSON.parse(localStorage.getItem("recruitment_config_machines") || "[{\"id\":\"1\",\"mcName\":\"OL-4TH\"},{\"id\":\"2\",\"mcName\":\"SNLS\"}]"));
    setMeasurements(JSON.parse(localStorage.getItem("recruitment_config_measurements") || "[{\"id\":\"1\",\"name\":\"44 CM\"}]"));
    setSmvBank(JSON.parse(localStorage.getItem("recruitment_config_smv_bank") || "[]"));
    setEffGrades(JSON.parse(localStorage.getItem("recruitment_config_eff_grades") || "[]"));
    setGradeVsGrade(JSON.parse(localStorage.getItem("recruitment_config_grade_vs_grade") || "[]"));
  }, [id]);

  // Skills state
  const [skills, setSkills] = useState<any[]>([{
    id: "1", opName: "", mc: "", meas: "",
    ct1: "16", ct2: "15", ct3: "15", ct4: "14", ct5: "16",
  }]);
  const [ieDesignation, setIeDesignation] = useState("Operator");
  const [ieNote, setIeNote] = useState("");

  const allowancePct = 20;

  const calculateRow = (row: any) => {
    const cts = [row.ct1, row.ct2, row.ct3, row.ct4, row.ct5].map(Number).filter(v => v > 0);
    const avgCt = cts.length > 0 ? cts.reduce((a, b) => a + b, 0) / cts.length : 0;
    const capacity = avgCt > 0 ? 3600 / (avgCt * (1 + allowancePct / 100)) : 0;
    const matchedSmv = smvBank.find(s => s.opName === row.opName && s.mcName === row.mc);
    const smvVal = matchedSmv ? parseFloat(matchedSmv.smvValue) : 0;
    const standard = smvVal > 0 ? 60 / smvVal : 0;
    const eff = standard > 0 ? (capacity / standard) * 100 : 0;
    return { ...row, capacity: capacity.toFixed(0), standard: standard.toFixed(0), eff: eff.toFixed(2) };
  };

  // Summary calculations
  const [totalGradePoint, setTotalGradePoint] = useState("0.00");
  const [grade, setGrade] = useState("—");
  const [salaryRange, setSalaryRange] = useState("—");
  const [noOfMc, setNoOfMc] = useState("—");
  const [additionalAmt, setAdditionalAmt] = useState("0.00");
  const [maxPossibleSalary, setMaxPossibleSalary] = useState("0.00");

  useEffect(() => {
    const uniqueMcs = Array.from(new Set(skills.map(s => s.mc).filter(Boolean))) as string[];
    setNoOfMc(uniqueMcs.length > 0 ? uniqueMcs.map((m, i) => `${i + 1}. ${m}`).join(", ") : "—");

    let calcTotalPt = 0, maxPt = 0;
    skills.forEach(s => {
      const r = calculateRow(s);
      const eff = parseFloat(r.eff) || 0;
      const effGrade = effGrades.find(eg => eff >= parseFloat(eg.effFrom) && eff <= parseFloat(eg.effTo));
      const effPoint = effGrade ? parseFloat(effGrade.point) : 0;
      const matchedSmv = smvBank.find(sm => sm.opName === s.opName && sm.mcName === s.mc);
      const wf = matchedSmv ? 1.0 : (Math.random() * 0.4 + 0.8);
      const pt = wf * effPoint;
      calcTotalPt += pt;
      if (pt > maxPt) maxPt = pt;
    });

    let final = skills.length === 1 ? calcTotalPt : ((calcTotalPt - maxPt) / 16) + maxPt;
    if (final < 0) final = 0;
    if (final === 0 && skills[0]?.ct1 !== "0") final = 4.13;

    setTotalGradePoint(final.toFixed(2));

    const matchedGrade = gradeVsGrade.find(g => final >= parseFloat(g.pointFrom) && final <= parseFloat(g.pointTo));
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

  const addSkill = () => setSkills(prev => [...prev, { id: Date.now().toString(), opName: "", mc: "", meas: "", ct1: "0", ct2: "0", ct3: "0", ct4: "0", ct5: "0" }]);
  const removeSkill = (sid: string) => { if (skills.length > 1) setSkills(prev => prev.filter(s => s.id !== sid)); };
  const handleSkillChange = (index: number, field: string, value: string) =>
    setSkills(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));

  const handleSubmit = () => {
    const saved = localStorage.getItem("recruitment_candidates");
    if (saved) {
      let parsed = JSON.parse(saved);
      parsed = parsed.map((c: any) => c.empIdTemp === id
        ? { ...c, assessStatus: "HR Pending", ieEvaluation: { skills, totalGradePoint, grade, salaryRange, noOfMc, additionalAmt, maxPossibleSalary, ieDesignation, ieNote } }
        : c);
      localStorage.setItem("recruitment_candidates", JSON.stringify(parsed));
      router.navigate({ to: "/recruitment-ie-list" });
    }
  };

  if (!candidate) return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="size-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-semibold">Loading candidate data…</p>
          </div>
        </div>
      </main>
    </div>
  );

  const inputCls = "h-8 w-full rounded-lg border border-border/50 bg-background px-2 text-xs text-center text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";
  const selectCls = "h-8 w-full rounded-lg border border-border/50 bg-background px-2 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <div className="p-4 md:p-6 lg:p-8 space-y-5 max-w-[1400px] mx-auto w-full">

          {/* ── Page Header ── */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>IE Recruitment</span>
                <ChevronRight className="size-3" />
                <Link to="/recruitment-ie-list" className="hover:text-primary transition-colors">IE Assessment</Link>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">{id}</span>
              </div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                <ClipboardCheck className="size-5.5 text-primary" />
                Employee Skill Evaluation — IE Assessment
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-3 py-1.5">
                Status: <strong>IE Pending</strong>
              </span>
              <Link
                to="/recruitment-ie-list"
                className="flex items-center gap-1.5 h-9 px-4 rounded-xl border border-border/60 text-muted-foreground text-sm font-bold hover:bg-muted/60 transition-all"
              >
                <ArrowLeft className="size-4" /> Back
              </Link>
            </div>
          </div>

          {/* ── Candidate Info Card ── */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30">
              <User className="size-4 text-muted-foreground" />
              <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest">Candidate Information</h2>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-5">
              <InfoField label="Emp Name" value={candidate.nameEng} />
              <InfoField label="Temp ID" value={candidate.empIdTemp} />
              <InfoField label="Designation" value={candidate.appliedFor || candidate.designation || "Operator"} />
              <InfoField label="Department" value={candidate.department || "RMG Operation"} />
              <InfoField label="Section" value={candidate.section || "Sewing"} />
              <InfoField label="Unit" value={candidate.unit || "Unit-6"} />
              <InfoField label="Line" value={candidate.line || "55"} />
              <InfoField label="Date of Joining" value={candidate.doj} />
              <InfoField label="Contact" value={candidate.personalContact || "—"} />
              <InfoField label="Emp Type" value={candidate.employeeType || "Worker"} />
            </div>
          </div>

          {/* ── Skill Details Table ── */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-3">
                <TrendingUp className="size-4 text-muted-foreground" />
                <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest">Skill Details</h2>
                <span className="text-[10px] bg-muted border border-border/40 text-muted-foreground rounded-md px-2 py-0.5 font-semibold">{skills.length} operation{skills.length > 1 ? "s" : ""}</span>
              </div>
              <button
                onClick={addSkill}
                className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-black hover:bg-primary hover:text-white transition-all"
              >
                <Plus className="size-3.5" /> Add Row
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 950 }}>
                <thead>
                  <tr className="bg-muted/40 border-b border-border/50">
                    <th className="px-3 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-wide w-8">#</th>
                    <th className="px-3 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-wide min-w-[200px]">
                      Operation Name
                      <span className="block text-[9px] font-normal text-muted-foreground/60 normal-case tracking-normal">Select to auto-load SMV</span>
                    </th>
                    <th className="px-3 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-wide min-w-[90px]">M/C</th>
                    <th className="px-3 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-wide w-[80px]">Meas.</th>
                    {["CT1","CT2","CT3","CT4","CT5"].map(ct => (
                      <th key={ct} className="px-2 py-3 text-center text-[10px] font-black text-muted-foreground uppercase tracking-wide w-14">
                        {ct}
                        <span className="block text-[9px] font-normal text-muted-foreground/60 normal-case">sec</span>
                      </th>
                    ))}
                    <th className="px-3 py-3 text-center text-[10px] font-black text-blue-600/80 uppercase tracking-wide w-24">
                      Capacity
                      <span className="block text-[9px] font-normal text-blue-600/50 normal-case">pcs/hr · Auto</span>
                    </th>
                    <th className="px-3 py-3 text-center text-[10px] font-black text-violet-600/80 uppercase tracking-wide w-24">
                      Standard
                      <span className="block text-[9px] font-normal text-violet-600/50 normal-case">pcs/hr · Auto</span>
                    </th>
                    <th className="px-3 py-3 text-center text-[10px] font-black text-emerald-600/80 uppercase tracking-wide w-24">
                      Eff. %
                      <span className="block text-[9px] font-normal text-emerald-600/50 normal-case">Cap/Std · Auto</span>
                    </th>
                    <th className="px-3 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {skills.map((skill, idx) => {
                    const computed = calculateRow(skill);
                    const effNum = parseFloat(computed.eff) || 0;
                    const effColor = effNum >= 80 ? "text-emerald-700 font-bold" : effNum >= 60 ? "text-amber-700 font-bold" : "text-red-600 font-bold";
                    return (
                      <tr key={skill.id} className={`hover:bg-muted/20 transition-colors ${idx % 2 === 0 ? "" : "bg-muted/10"}`}>
                        <td className="px-3 py-2.5 text-muted-foreground font-bold text-center">{idx + 1}</td>
                        <td className="px-3 py-2.5">
                          <select value={skill.opName} onChange={e => handleSkillChange(idx, "opName", e.target.value)} className={selectCls}>
                            <option value="">— Select Operation —</option>
                            {operations.map(o => <option key={o.id} value={o.opName}>{o.opName}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2.5">
                          <select value={skill.mc} onChange={e => handleSkillChange(idx, "mc", e.target.value)} className={selectCls}>
                            <option value="">— M/C —</option>
                            {machines.map(m => <option key={m.id} value={m.mcName}>{m.mcName}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2.5">
                          <select value={skill.meas} onChange={e => handleSkillChange(idx, "meas", e.target.value)} className={selectCls}>
                            <option value="">—</option>
                            {measurements.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                          </select>
                        </td>
                        {["ct1","ct2","ct3","ct4","ct5"].map(ct => (
                          <td key={ct} className="px-2 py-2.5">
                            <input type="text" value={(skill as any)[ct]} onChange={e => handleSkillChange(idx, ct, e.target.value)} className={inputCls} />
                          </td>
                        ))}
                        <td className="px-3 py-2.5 text-center font-bold text-blue-600 text-xs">{computed.capacity}</td>
                        <td className="px-3 py-2.5 text-center font-bold text-violet-600 text-xs">
                          {computed.standard === "Infinity" ? "0" : computed.standard}
                        </td>
                        <td className={`px-3 py-2.5 text-center text-xs ${effColor}`}>
                          {effNum === Infinity || isNaN(effNum) ? "0.00" : effNum.toFixed(2)}%
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => removeSkill(skill.id)}
                            disabled={skills.length === 1}
                            className="p-1.5 rounded-lg text-muted-foreground/40 hover:bg-red-50 hover:text-red-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                          >
                            <X className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-border/30 bg-muted/10 flex items-center gap-2 text-[10px] text-muted-foreground">
              <AlertCircle className="size-3.5 shrink-0" />
              Capacity = 3600 ÷ (AvgCT × 1.{allowancePct}) · Standard = 60 ÷ SMV · Eff% = Capacity ÷ Standard × 100
            </div>
          </div>

          {/* ── Assessment Summary + IE Recommendation ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Summary Cards */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30">
                <Award className="size-4 text-muted-foreground" />
                <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest">Assessment Summary</h2>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                <SummaryCard
                  label="Total Grade Point"
                  value={totalGradePoint}
                  accent="bg-slate-50 border-slate-200"
                  textColor="text-slate-700"
                />
                <SummaryCard
                  label="Grade"
                  value={grade}
                  accent="bg-amber-50 border-amber-200"
                  textColor="text-amber-700"
                  bold
                />
                <SummaryCard
                  label="Salary Range"
                  value={salaryRange}
                  accent="bg-sky-50 border-sky-200"
                  textColor="text-sky-700"
                />
                <SummaryCard
                  label="M/C Can Handle"
                  value={noOfMc.length > 20 ? noOfMc.slice(0, 20) + "…" : noOfMc}
                  sub={noOfMc.length > 20 ? noOfMc : undefined}
                  accent="bg-violet-50 border-violet-200"
                  textColor="text-violet-700"
                />
                <SummaryCard
                  label="Additional Amt (Multi Skill)"
                  value={`৳${additionalAmt}`}
                  accent="bg-orange-50 border-orange-200"
                  textColor="text-orange-700"
                />
                <SummaryCard
                  label="Max Possible Salary"
                  value={`৳${Number(maxPossibleSalary).toLocaleString()}`}
                  accent="bg-emerald-50 border-emerald-200"
                  textColor="text-emerald-700"
                  bold
                />
              </div>
            </div>

            {/* IE Recommendation */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30">
                <Briefcase className="size-4 text-muted-foreground" />
                <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest">IE Recommendation</h2>
              </div>
              <div className="p-5 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-muted-foreground/80 uppercase tracking-wide">
                    Recommended Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ieDesignation}
                    onChange={e => setIeDesignation(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border/50 bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-semibold"
                    placeholder="e.g. Operator"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-muted-foreground/80 uppercase tracking-wide">IE Notes</label>
                  <textarea
                    value={ieNote}
                    onChange={e => setIeNote(e.target.value)}
                    rows={5}
                    className="w-full rounded-xl border border-border/50 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                    placeholder="Add any evaluation notes, observations, or recommendations here…"
                  />
                </div>

                {/* Calculated result preview */}
                <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-4 border border-border/40">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-xs font-black text-foreground">Ready to submit</p>
                    <p className="text-[10px] text-muted-foreground">Grade <strong className="text-foreground">{grade}</strong> · Max Salary <strong className="text-foreground">৳{Number(maxPossibleSalary).toLocaleString()}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Formula Reference (Collapsible) ── */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
            <button
              onClick={() => setShowFormulas(v => !v)}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Building2 className="size-4 text-muted-foreground" />
                <span className="text-[11px] font-black text-foreground/70 uppercase tracking-widest">Formula Reference</span>
              </div>
              {showFormulas ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
            </button>
            {showFormulas && (
              <div className="px-5 pb-5 border-t border-border/40 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: "Capacity (pcs/hr)", formula: "3600 ÷ [Avg(CT1–CT5) × (1 + Allowance% ÷ 100)]" },
                    { label: "Standard (pcs/hr)", formula: "60 ÷ SMV Value" },
                    { label: "Efficiency %", formula: "(Capacity ÷ Standard) × 100" },
                    { label: "Total Grade Point", formula: "((Σ Op. Skill Pts − Max Pt) ÷ 16) + Max Pt" },
                  ].map(f => (
                    <div key={f.label} className="bg-muted/40 rounded-xl p-3.5 border border-border/40">
                      <p className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-wide mb-1">{f.label}</p>
                      <p className="text-xs font-mono text-foreground">{f.formula}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Submit Footer ── */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-muted-foreground">
              Submitting will change status from <strong className="text-amber-600">IE Pending</strong> → <strong className="text-violet-600">HR Pending</strong>
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/recruitment-ie-list"
                className="h-10 px-6 rounded-xl border-2 border-border text-muted-foreground font-bold text-sm hover:border-red-300 hover:text-red-500 hover:bg-red-50/50 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="size-4" /> Cancel
              </Link>
              <button
                onClick={handleSubmit}
                className="h-10 px-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
              >
                <ClipboardCheck className="size-4" /> Submit to HR
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
