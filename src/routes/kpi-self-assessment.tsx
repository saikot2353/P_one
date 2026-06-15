import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, ClipboardEdit, CalendarRange, User, Save, Send,
  CheckCircle2, AlertCircle
} from "lucide-react";
import { 
  type SelfAssessment, loadSelfAssessments, saveSelfAssessments, 
  loadKpiCriteria, loadKpiCycles, getCategoryBg 
} from "@/lib/kpi-data";

export const Route = createFileRoute("/kpi-self-assessment")({
  head: () => ({
    meta: [
      { title: "My KPI Self-Assessment — CRIPTON" },
      { name: "description", content: "Employee self-evaluation portal." },
    ],
  }),
  component: KpiSelfAssessmentPage,
});

// Mock logged-in user for demonstration
const LOGGED_IN_USER = {
  employeeId: "2023043910",
  employeeName: "Tahmid Afsar Shapno",
  department: "Business Innovation",
  designation: "Asst. Manager"
};

function KpiSelfAssessmentPage() {
  const [cycles] = useState(() => loadKpiCycles().filter(c => c.status === "Active"));
  const [criteria] = useState(() => loadKpiCriteria().filter(c => c.status === "Active"));
  const [assessments, setAssessments] = useState(() => loadSelfAssessments());

  const [activeCycleId, setActiveCycleId] = useState(cycles[0]?.id || "");

  const activeAssessment = useMemo(() => {
    return assessments.find(a => a.cycleId === activeCycleId && a.employeeId === LOGGED_IN_USER.employeeId);
  }, [assessments, activeCycleId]);

  // Form state for current assessment
  const [scores, setScores] = useState<Record<string, { score: number, justification: string }>>({});
  const [overallComments, setOverallComments] = useState("");

  // Initialize form when cycle changes
  useMemo(() => {
    if (activeAssessment) {
      const sMap: Record<string, { score: number, justification: string }> = {};
      activeAssessment.scores.forEach(s => {
        sMap[s.criteriaId] = { score: s.score, justification: s.justification };
      });
      setScores(sMap);
      setOverallComments(activeAssessment.overallComments);
    } else {
      const sMap: Record<string, { score: number, justification: string }> = {};
      criteria.forEach(c => {
        sMap[c.id] = { score: 0, justification: "" };
      });
      setScores(sMap);
      setOverallComments("");
    }
  }, [activeAssessment, criteria]);

  const handleSave = (status: "Draft" | "Submitted") => {
    if (!activeCycleId) return;

    if (status === "Submitted") {
      const isComplete = criteria.every(c => scores[c.id]?.score > 0);
      if (!isComplete) {
        alert("Please score all criteria before submitting.");
        return;
      }
    }

    const scoresArray = Object.entries(scores).map(([id, data]) => ({
      criteriaId: id,
      score: data.score,
      justification: data.justification
    }));

    // Calculate unweighted total sum of scores for display
    const totalScore = scoresArray.reduce((sum, s) => sum + s.score, 0);

    const newAssessment: SelfAssessment = {
      id: activeAssessment?.id || `SA-${String(assessments.length + 1).padStart(3, "0")}`,
      cycleId: activeCycleId,
      ...LOGGED_IN_USER,
      scores: scoresArray,
      totalScore,
      overallComments,
      status,
      submittedAt: status === "Submitted" ? new Date().toISOString().split('T')[0] : ""
    };

    let updated: SelfAssessment[];
    if (activeAssessment) {
      updated = assessments.map(a => a.id === activeAssessment.id ? newAssessment : a);
    } else {
      updated = [...assessments, newAssessment];
    }

    setAssessments(updated);
    saveSelfAssessments(updated);
    
    if (status === "Submitted") {
      alert("Self-Assessment submitted successfully to HOD.");
    } else {
      alert("Draft saved successfully.");
    }
  };

  if (cycles.length === 0) {
    return (
      <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col relative p-8">
          <Topbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <AlertCircle className="size-12 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-black text-foreground">No Active Cycles</h2>
              <p className="text-sm text-muted-foreground">There are currently no active appraisal cycles for self-assessment.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isReadOnly = activeAssessment?.status === "Submitted" || activeAssessment?.status === "Reviewed";

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">

          {/* Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">My Space</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Self Assessment</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <ClipboardEdit className="size-5.5 text-primary" />
                <span>My KPI Self-Assessment</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/40">
                <CalendarRange className="size-4 text-primary" />
                <select 
                  value={activeCycleId}
                  onChange={(e) => setActiveCycleId(e.target.value)}
                  className="bg-transparent text-xs font-bold outline-none cursor-pointer"
                >
                  {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            
            {/* Left Sidebar Info */}
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs text-center space-y-3">
                <div className="size-16 rounded-full bg-primary/10 text-primary grid place-items-center font-black text-2xl mx-auto">
                  {LOGGED_IN_USER.employeeName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground">{LOGGED_IN_USER.employeeName}</h3>
                  <p className="text-xs font-semibold text-muted-foreground mt-0.5">{LOGGED_IN_USER.designation}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/80 mt-0.5">{LOGGED_IN_USER.department}</p>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
                <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-wider border-b border-border/30 pb-2">Status</h4>
                
                {isReadOnly ? (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-start gap-2">
                    <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block">Submitted</span>
                      <span className="text-[10px] font-medium opacity-90">Your assessment is under review by your HOD.</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-start gap-2">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block">Draft / Pending</span>
                      <span className="text-[10px] font-medium opacity-90">Please complete all criteria and submit before the cycle closes.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assessment Form */}
            <div className="xl:col-span-3 space-y-6">
              <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-border/30 bg-muted/20">
                  <h2 className="text-sm font-black text-foreground">Self-Evaluation Form</h2>
                  <p className="text-xs text-muted-foreground mt-1">Rate your performance honestly and provide justifications.</p>
                </div>

                <div className="p-0">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border/30">
                        <th className="px-5 py-3 font-extrabold text-muted-foreground uppercase text-[10px] tracking-wider w-[40%] border-r border-border/20">Criteria</th>
                        <th className="px-4 py-3 font-extrabold text-muted-foreground uppercase text-[10px] tracking-wider text-center w-24 border-r border-border/20">Your Score</th>
                        <th className="px-5 py-3 font-extrabold text-muted-foreground uppercase text-[10px] tracking-wider">Justification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {criteria.map(c => (
                        <tr key={c.id}>
                          <td className="px-5 py-4 border-r border-border/20">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[8.5px] font-extrabold uppercase border mb-1 ${getCategoryBg(c.category)}`}>
                              {c.category}
                            </span>
                            <span className="font-bold text-foreground block">{c.criteriaName}</span>
                            <span className="text-[10px] text-muted-foreground block mt-1">{c.criteriaDetail}</span>
                          </td>
                          <td className="px-4 py-4 text-center border-r border-border/20">
                            <input
                              type="number" min={0} max={c.maxScore} disabled={isReadOnly}
                              value={scores[c.id]?.score || ""}
                              onChange={(e) => setScores(p => ({ ...p, [c.id]: { ...p[c.id], score: parseFloat(e.target.value) || 0 } }))}
                              className="w-16 h-8 text-center rounded border border-border/40 focus:border-[#1e88e5] outline-none text-xs font-bold font-mono bg-card disabled:bg-muted/50"
                              placeholder={`/${c.maxScore}`}
                            />
                          </td>
                          <td className="px-5 py-4">
                            <textarea
                              disabled={isReadOnly}
                              value={scores[c.id]?.justification || ""}
                              onChange={(e) => setScores(p => ({ ...p, [c.id]: { ...p[c.id], justification: e.target.value } }))}
                              placeholder="Provide examples of your achievements..."
                              className="w-full h-16 p-2 rounded-lg bg-card border border-border/40 outline-none resize-none focus:border-[#1e88e5] disabled:bg-muted/50"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-5 border-t border-border/30 bg-muted/10 space-y-3">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block">Overall Comments & Career Goals</label>
                  <textarea
                    disabled={isReadOnly}
                    value={overallComments}
                    onChange={(e) => setOverallComments(e.target.value)}
                    placeholder="Summarize your year and specify goals for the next cycle..."
                    className="w-full h-24 p-3 rounded-lg bg-card border border-border/40 outline-none resize-none focus:border-[#1e88e5] disabled:bg-muted/50 text-xs font-semibold"
                  />
                </div>

                {!isReadOnly && (
                  <div className="p-5 border-t border-border/30 flex justify-end gap-3 bg-card">
                    <button 
                      onClick={() => handleSave("Draft")}
                      className="h-9 px-5 border border-border/40 text-muted-foreground hover:bg-muted font-bold text-xs rounded-lg transition flex items-center gap-2"
                    >
                      <Save className="size-3.5" /> Save as Draft
                    </button>
                    <button 
                      onClick={() => handleSave("Submitted")}
                      className="h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase tracking-wider flex items-center gap-2"
                    >
                      <Send className="size-3.5" /> Submit to HOD
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
