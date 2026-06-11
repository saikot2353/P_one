import { useState, useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, ClipboardCheck, User, TrendingUp, Award, Briefcase,
  CheckCircle2, ArrowLeft, ShieldAlert
} from "lucide-react";

export const Route = createFileRoute("/recruitment-hr-assessment/$id")({
  head: () => ({
    meta: [
      { title: "HR Assessment Form — CRIPTON HRIS" },
      { name: "description", content: "HR Assessment evaluation." },
    ],
  }),
  component: HRAssessmentPage,
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

function HRAssessmentPage() {
  const router = useRouter();
  const { id } = Route.useParams();
  
  const [candidate, setCandidate] = useState<any>(null);
  const [ieData, setIeData] = useState<any>(null);

  // HR Inputs
  const [proposedSalary, setProposedSalary] = useState("0.00");
  const [hrDesignation, setHrDesignation] = useState("Operator");
  const [hrNote, setHrNote] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCand = localStorage.getItem("recruitment_candidates");
      if (savedCand) {
        const parsed = JSON.parse(savedCand);
        const found = parsed.find((c: any) => c.empIdTemp === id);
        if (found) {
          setCandidate(found);
          const fallbackIeData = found.ieEvaluation || {
            skills: [
              { id: "1", opName: "Attach Neck Rib - Tube, No Fold", mc: "OL-4TH", meas: "44 CM", ct1: "15", ct2: "15", ct3: "15", ct4: "15", ct5: "15", capacity: "180", standard: "230", eff: "78.26" }
            ],
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
      parsed = parsed.map((c: any) => {
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
      router.navigate({ to: "/recruitment-assessment-list" });
    }
  };

  const handleReject = () => {
    const saved = localStorage.getItem("recruitment_candidates");
    if (saved) {
      let parsed = JSON.parse(saved);
      parsed = parsed.map((c: any) => {
        if (c.empIdTemp === id) {
          return { ...c, assessStatus: "HR Rejected" };
        }
        return c;
      });
      localStorage.setItem("recruitment_candidates", JSON.stringify(parsed));
      router.navigate({ to: "/recruitment-assessment-list" });
    }
  };

  if (!candidate || !ieData) return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="size-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-semibold">Loading candidate evaluation data…</p>
          </div>
        </div>
      </main>
    </div>
  );

  const isViewOnly = candidate.assessStatus === "HR Approved" || candidate.assessStatus === "HR Rejected";
  const labelCls = "text-[11px] font-black text-muted-foreground/80 uppercase tracking-wide";
  const inputCls = "h-10 w-full rounded-xl border border-border/50 bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-semibold disabled:opacity-75 disabled:cursor-not-allowed";

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
                <Link to="/recruitment-assessment-list" className="hover:text-primary transition-colors">HR Evaluation</Link>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">{id}</span>
              </div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                <ClipboardCheck className="size-5.5 text-primary" />
                Employee Skill Evaluation — {isViewOnly ? "Assessment View" : "HR Assessment"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold border rounded-lg px-3 py-1.5 
                ${candidate.assessStatus === "HR Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : candidate.assessStatus === "HR Rejected" ? "bg-rose-50 text-rose-700 border-rose-200" 
                  : "bg-purple-50 text-purple-700 border-purple-200"}`}>
                Status: <strong>{candidate.assessStatus}</strong>
              </span>
              <Link
                to="/recruitment-assessment-list"
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

          {/* ── Skill Details Table (Readonly) ── */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30">
              <TrendingUp className="size-4 text-muted-foreground" />
              <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest">Skill Evaluation Results</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left" style={{ minWidth: 950 }}>
                <thead>
                  <tr className="bg-muted/40 border-b border-border/50 text-muted-foreground font-black uppercase tracking-wide text-[10px]">
                    <th className="px-4 py-3.5 text-center w-12 border-r border-border/30">#</th>
                    <th className="px-4 py-3.5 min-w-[200px] border-r border-border/30">Operation Name</th>
                    <th className="px-4 py-3.5 min-w-[90px] border-r border-border/30 text-center">M/C</th>
                    <th className="px-4 py-3.5 w-[80px] border-r border-border/30 text-center">Meas.</th>
                    {["CT1","CT2","CT3","CT4","CT5"].map(ct => (
                      <th key={ct} className="px-2 py-3.5 text-center w-14 border-r border-border/30">{ct} (s)</th>
                    ))}
                    <th className="px-4 py-3.5 text-center w-24 border-r border-border/30 text-blue-600/80">Capacity</th>
                    <th className="px-4 py-3.5 text-center w-24 border-r border-border/30 text-violet-600/80">Standard</th>
                    <th className="px-4 py-3.5 text-center w-24 text-emerald-600/80">Eff. %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-foreground">
                  {ieData.skills.map((skill: any, idx: number) => {
                    const isEven = idx % 2 === 0;
                    const rowBgClass = isEven ? "bg-white dark:bg-[#0f172a]" : "bg-[#f8fafc] dark:bg-[#131d30]";
                    const effNum = parseFloat(skill.eff) || 0;
                    const effColor = effNum >= 80 ? "text-emerald-700 font-bold" : effNum >= 60 ? "text-amber-700 font-bold" : "text-red-600 font-bold";
                    return (
                      <tr key={skill.id} className={`hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all ${rowBgClass}`}>
                        <td className="px-4 py-3 text-center text-slate-500 font-bold border-r border-border/30">{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold border-r border-border/30">{skill.opName}</td>
                        <td className="px-4 py-3 text-center border-r border-border/30"><span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-bold">{skill.mc}</span></td>
                        <td className="px-4 py-3 text-center border-r border-border/30 font-medium text-slate-600">{skill.meas}</td>
                        <td className="px-2 py-3 text-center border-r border-border/30 font-mono">{skill.ct1}</td>
                        <td className="px-2 py-3 text-center border-r border-border/30 font-mono">{skill.ct2}</td>
                        <td className="px-2 py-3 text-center border-r border-border/30 font-mono">{skill.ct3}</td>
                        <td className="px-2 py-3 text-center border-r border-border/30 font-mono">{skill.ct4}</td>
                        <td className="px-2 py-3 text-center border-r border-border/30 font-mono">{skill.ct5}</td>
                        <td className="px-4 py-3 text-center border-r border-border/30 font-bold text-blue-600">{skill.capacity}</td>
                        <td className="px-4 py-3 text-center border-r border-border/30 font-bold text-violet-600">{skill.standard === "Infinity" ? "0" : skill.standard}</td>
                        <td className={`px-4 py-3 text-center font-black ${effColor}`}>{effNum.toFixed(2)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Summary & Recommendation Panel ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Assessment Summary (Readonly) */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30">
                <Award className="size-4 text-muted-foreground" />
                <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest">Assessment Summary</h2>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                <SummaryCard
                  label="Total Grade Point"
                  value={ieData.totalGradePoint}
                  accent="bg-slate-50 border-slate-200"
                  textColor="text-slate-700"
                />
                <SummaryCard
                  label="Grade"
                  value={ieData.grade}
                  accent="bg-amber-50 border-amber-200"
                  textColor="text-amber-700"
                  bold
                />
                <SummaryCard
                  label="Salary Range"
                  value={ieData.salaryRange}
                  accent="bg-sky-50 border-sky-200"
                  textColor="text-sky-700"
                />
                <SummaryCard
                  label="M/C Can Handle"
                  value={ieData.noOfMc.length > 20 ? ieData.noOfMc.slice(0, 20) + "…" : ieData.noOfMc}
                  sub={ieData.noOfMc.length > 20 ? ieData.noOfMc : undefined}
                  accent="bg-violet-50 border-violet-200"
                  textColor="text-violet-700"
                />
                <SummaryCard
                  label="Additional Amt"
                  value={`৳${ieData.additionalAmt}`}
                  accent="bg-orange-50 border-orange-200"
                  textColor="text-orange-700"
                />
                <SummaryCard
                  label="Max Possible Salary"
                  value={`৳${Number(ieData.maxPossibleSalary).toLocaleString()}`}
                  accent="bg-emerald-50 border-emerald-200"
                  textColor="text-emerald-700"
                  bold
                />
              </div>
            </div>

            {/* IE Recommendation (Readonly Info) */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30">
                <Briefcase className="size-4 text-muted-foreground" />
                <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest">IE Recommendation</h2>
              </div>
              <div className="p-5 space-y-5">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Recommended Designation</p>
                  <p className="text-sm font-bold text-foreground bg-muted/50 border border-border/50 px-3 py-2 rounded-xl">{ieData.ieDesignation}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">IE Notes / Observations</p>
                  <div className="text-xs text-muted-foreground bg-muted/30 border border-border/40 p-3.5 rounded-xl min-h-[120px] leading-relaxed">
                    {ieData.ieNote || "No notes provided by IE Assessor."}
                  </div>
                </div>
              </div>
            </div>

            {/* HR Recommendation (Interactive) */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-muted/30">
                <ShieldAlert className="size-4 text-muted-foreground" />
                <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest">HR Recommendation</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>Proposed Gross Salary <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={proposedSalary}
                    disabled={isViewOnly}
                    onChange={e => setProposedSalary(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. 14500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>HR Final Designation <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={hrDesignation}
                    disabled={isViewOnly}
                    onChange={e => setHrDesignation(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Operator"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>HR Comments / Notes</label>
                  <textarea
                    value={hrNote}
                    disabled={isViewOnly}
                    onChange={e => setHrNote(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-border/50 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none disabled:opacity-75 disabled:cursor-not-allowed"
                    placeholder="Add manual comments, salary details, approval notes..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Submit Footer / Signature Blocks ── */}
          {!isViewOnly ? (
            <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-muted-foreground">
                Approval promotes candidate to <strong className="text-emerald-600">HR Approved</strong> and registers them in Personnel List.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  to="/recruitment-assessment-list"
                  className="h-10 px-6 rounded-xl border-2 border-border text-muted-foreground font-bold text-sm hover:border-red-300 hover:text-red-500 hover:bg-red-50/50 transition-all flex items-center gap-2"
                >
                  Close
                </Link>
                <button
                  onClick={handleReject}
                  className="h-10 px-6 rounded-xl bg-rose-50 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-sm hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
                >
                  Reject Candidate
                </button>
                <button
                  onClick={handleSubmit}
                  className="h-10 px-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="size-4" /> Approve &amp; Generate Form
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-8 space-y-8">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest pb-4 border-b border-border/40">
                <span>Evaluation Completed</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-y-10 gap-x-4 pt-4 text-[10px] font-bold text-muted-foreground uppercase text-center">
                <div className="space-y-10">
                  <div className="w-24 mx-auto border-t border-muted-foreground/60 pt-2">Operator</div>
                </div>
                <div className="space-y-10">
                  <div className="w-28 mx-auto border-t border-muted-foreground/60 pt-2">Assessor (IE)</div>
                </div>
                <div className="space-y-10">
                  <div className="w-24 mx-auto border-t border-muted-foreground/60 pt-2">PM / Sr. PM</div>
                </div>
                <div className="space-y-10">
                  <div className="w-24 mx-auto border-t border-muted-foreground/60 pt-2">HR Executive</div>
                </div>
                <div className="space-y-10">
                  <div className="w-28 mx-auto border-t border-muted-foreground/60 pt-2">Unit Leader (IE)</div>
                </div>
                <div className="space-y-10">
                  <div className="w-28 mx-auto border-t border-muted-foreground/60 pt-2">Sr. Manager (IE)</div>
                </div>
                <div className="space-y-10">
                  <div className="w-28 mx-auto border-t border-muted-foreground/60 pt-2">Head of Production</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
