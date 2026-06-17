import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ClipboardCheck, ChevronRight, Lock, Unlock, CheckCircle2,
  Search, Building, User, Users, Printer, RefreshCw, Star, ArrowLeft, Activity, Filter, FileText
} from "lucide-react";
import {
  type KpiAssessment, type KpiCriteria, type GradeBand, type CriteriaScore, type PeerReview,
  loadAssessments, saveAssessments, loadKpiCriteria, loadGradeBands, loadKpiCycles, loadPeerReviews,
  loadSelfAssessments, calculateWeightedScore, getGradeForScore, getCategoryBg
} from "@/lib/kpi-data";

export const Route = createFileRoute("/kpi-assessment-workflow")({
  head: () => ({
    meta: [
      { title: "Assessment Workflow — CRIPTON" },
      { name: "description", content: "Appraisal approval workflow across HOD, HR, Plant Head, Managing Director, and final evaluation." },
    ],
  }),
  component: KpiAssessmentWorkflowPage,
});

function KpiAssessmentWorkflowPage() {
  const [assessments, setAssessments] = useState<KpiAssessment[]>(() => loadAssessments());
  const [criteria] = useState<KpiCriteria[]>(() => loadKpiCriteria());
  const [bands] = useState<GradeBand[]>(() => loadGradeBands());
  const [cycles] = useState(() => loadKpiCycles());
  const [selfAssessments] = useState(() => loadSelfAssessments());

  const [activeCycle, setActiveCycle] = useState(cycles[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // If activeEmpId is set, show workflow form. Otherwise show list.
  const [activeEmpId, setActiveEmpId] = useState<string | null>(null);

  const [peerReviews] = useState<PeerReview[]>(() => loadPeerReviews());
  const [show360Modal, setShow360Modal] = useState(false);

  const [viewMode, setViewMode] = useState<"standard" | "bulk">("standard");
  const [selectedForBulk, setSelectedForBulk] = useState<string[]>([]);
  const [bulkActionRole, setBulkActionRole] = useState<"PlantHead" | "MD">("PlantHead");

  const filteredAssessments = useMemo(() => {
    return assessments.filter(a => {
      if (a.cycleId !== activeCycle) return false;
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!a.employeeName.toLowerCase().includes(q) &&
            !a.employeeId.toLowerCase().includes(q) &&
            !a.department.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [assessments, activeCycle, searchQuery, statusFilter]);

  const activeEmp = useMemo(() => assessments.find(a => a.employeeId === activeEmpId), [assessments, activeEmpId]);

  const activeSelfAssessment = useMemo(() => {
    if (!activeEmpId) return null;
    return selfAssessments.find(sa => sa.employeeId === activeEmpId && sa.cycleId === activeCycle);
  }, [selfAssessments, activeEmpId, activeCycle]);

  // Derived values for active employee
  const activeStep = activeEmp ? activeEmp.currentStep : 1;
  const completedSteps = activeEmp ? activeEmp.completedSteps : [];

  const handleUpdateActiveEmp = (updates: Partial<KpiAssessment>) => {
    if (!activeEmpId) return;
    const newAssessments = assessments.map(a =>
      a.employeeId === activeEmpId ? { ...a, ...updates } : a
    );
    setAssessments(newAssessments);
    saveAssessments(newAssessments);
  };

  const handleScoreChange = (criteriaId: string, value: number) => {
    if (!activeEmp) return;
    const scores = [...activeEmp.criteriaScores];
    const existingIdx = scores.findIndex(s => s.criteriaId === criteriaId);
    if (existingIdx >= 0) {
      scores[existingIdx].hodScore = value;
    } else {
      scores.push({ criteriaId, hodScore: value, selfScore: 0, notes: "" });
    }
    handleUpdateActiveEmp({ criteriaScores: scores });
  };

  const handleNotesChange = (criteriaId: string, notes: string) => {
    if (!activeEmp) return;
    const scores = [...activeEmp.criteriaScores];
    const existingIdx = scores.findIndex(s => s.criteriaId === criteriaId);
    if (existingIdx >= 0) {
      scores[existingIdx].notes = notes;
    } else {
      scores.push({ criteriaId, hodScore: 0, selfScore: 0, notes });
    }
    handleUpdateActiveEmp({ criteriaScores: scores });
  };

  // Stepper handlers
  const handleCompleteHod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmp) return;
    
    // Calculate final scores
    const totalScore = calculateWeightedScore(activeEmp.criteriaScores, criteria);
    const gradeBand = getGradeForScore(totalScore, bands);

    handleUpdateActiveEmp({
      currentStep: 2,
      completedSteps: [...new Set([...activeEmp.completedSteps, 1])],
      totalWeightedScore: totalScore,
      gradeResult: gradeBand?.grade || "N/A",
      gradeBandId: gradeBand?.id || "",
      status: "In Progress"
    });
  };

  const handleCompleteHr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmp) return;
    handleUpdateActiveEmp({
      currentStep: 3,
      completedSteps: [...new Set([...activeEmp.completedSteps, 2])]
    });
  };

  const handleCompletePlantHead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmp) return;
    handleUpdateActiveEmp({
      currentStep: 4,
      completedSteps: [...new Set([...activeEmp.completedSteps, 3])]
    });
  };

  const handleCompleteMd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmp) return;
    handleUpdateActiveEmp({
      currentStep: 5,
      completedSteps: [...new Set([...activeEmp.completedSteps, 4])]
    });
  };

  const handleBulkApprove = () => {
    if (selectedForBulk.length === 0) {
      alert("Please select at least one employee.");
      return;
    }
    const updated = assessments.map(a => {
      if (selectedForBulk.includes(a.employeeId)) {
        if (bulkActionRole === "PlantHead" && a.currentStep === 3) {
          return {
            ...a,
            currentStep: 4,
            completedSteps: [...new Set([...a.completedSteps, 3])],
            plantHeadApproval: "Approved",
            plantHeadComments: "Bulk approved by Plant Head."
          };
        } else if (bulkActionRole === "MD" && a.currentStep === 4) {
          return {
            ...a,
            currentStep: 5,
            completedSteps: [...new Set([...a.completedSteps, 4])],
            mdApproval: "Approved",
            mdComments: "Bulk approved by MD."
          };
        }
      }
      return a;
    });
    setAssessments(updated);
    saveAssessments(updated);
    setSelectedForBulk([]);
    alert(`Successfully bulk approved ${selectedForBulk.length} assessments!`);
  };

  const handleCompleteFinal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmp) return;
    const finalInc = activeEmp.incAmount !== undefined && activeEmp.incAmount !== 0 ? activeEmp.incAmount : (activeEmp.mdProposedInc || 0);
    const newSalary = activeEmp.grossSalary + finalInc;
    
    handleUpdateActiveEmp({
      incAmount: finalInc,
      givePromotion: activeEmp.givePromotion || (activeEmp.hodProposedPromotion || "No"),
      newDesignation: activeEmp.newDesignation || (activeEmp.hodProposedDesignation || ""),
      completedSteps: [...new Set([...activeEmp.completedSteps, 5])],
      status: "Completed",
      completedAt: new Date().toISOString().split('T')[0],
      newGrossSalary: newSalary
    });

    // Sync to recruitment_synced_employees database key in local storage
    const syncedKey = "recruitment_synced_employees";
    const synced = localStorage.getItem(syncedKey);
    if (synced) {
      try {
        const parsed = JSON.parse(synced);
        if (Array.isArray(parsed)) {
          const updatedEmployees = parsed.map((emp: any) => {
            if (emp.id === activeEmp.employeeId) {
              const updated = { ...emp };
              updated.gross = String(newSalary);
              if (activeEmp.givePromotion === "Yes" && activeEmp.newDesignation) {
                updated.title = activeEmp.newDesignation;
              } else if (activeEmp.hodProposedPromotion === "Yes" && activeEmp.hodProposedDesignation) {
                updated.title = activeEmp.hodProposedDesignation;
              }
              return updated;
            }
            return emp;
          });
          localStorage.setItem(syncedKey, JSON.stringify(updatedEmployees));
        }
      } catch (err) {
        console.error("Failed to sync payroll to recruitment_synced_employees:", err);
      }
    }

    alert("KPI Appraisal Assessment Workflow Completed Successfully & Payroll Database Updated!");
  };

  // LIST VIEW
  if (!activeEmpId) {
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
                  <span className="text-muted-foreground/75">KPI</span>
                  <ChevronRight className="size-2.5" />
                  <span className="text-primary font-semibold">Assessment Workflow</span>
                </div>
                <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                  <ClipboardCheck className="size-5.5 text-primary" />
                  <span>KPI Assessment Workflow</span>
                </h1>
                <p className="text-xs text-muted-foreground mt-1">Multi-step appraisal execution and salary increment recommendations</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("standard")}
                  className={`h-9 px-4 text-xs font-bold rounded-lg transition-all ${viewMode === "standard" ? "bg-[#1e88e5] text-white shadow-sm" : "bg-muted/40 text-muted-foreground border border-border/40 hover:bg-muted"}`}
                >
                  Standard View
                </button>
                <button
                  onClick={() => setViewMode("bulk")}
                  className={`h-9 px-4 text-xs font-bold rounded-lg transition-all ${viewMode === "bulk" ? "bg-[#1e88e5] text-white shadow-sm" : "bg-muted/40 text-muted-foreground border border-border/40 hover:bg-muted"}`}
                >
                  Executive Bulk Approval
                </button>
              </div>
            </div>

            {viewMode === "standard" ? (
              <>
                {/* Filters */}
                <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block">Appraisal Cycle</label>
                    <select 
                      value={activeCycle}
                      onChange={(e) => setActiveCycle(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
                    >
                      {cycles.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block">Status</label>
                    <div className="flex gap-2">
                      {["All", "Pending", "In Progress", "Completed"].map(status => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`flex-1 h-10 rounded-lg text-xs font-bold transition-all ${statusFilter === status ? "bg-[#1e88e5] text-white shadow-sm" : "bg-muted/40 text-muted-foreground border border-border/40 hover:bg-muted"}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block">Search Employee</label>
                    <div className="relative">
                      <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by name, ID or department..."
                        className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-semibold outline-none focus:border-[#1e88e5]"
                      />
                    </div>
                  </div>
                </div>

                {/* Employee List Table */}
                <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border/40 text-[9.5px] uppercase font-black tracking-wider text-muted-foreground/60">
                          <th className="px-4 py-3 text-center w-12">#</th>
                          <th className="px-4 py-3 w-28">Emp ID</th>
                          <th className="px-4 py-3">Name & Role</th>
                          <th className="px-4 py-3">Department</th>
                          <th className="px-4 py-3 text-center">Score & Grade</th>
                          <th className="px-4 py-3 text-center w-32">Status</th>
                          <th className="px-4 py-3 text-center w-36">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {filteredAssessments.map((item, idx) => {
                          const gradeColor = bands.find(b => b.id === item.gradeBandId)?.color || "#94a3b8";
                          return (
                            <tr key={item.id} className="hover:bg-muted/20 transition duration-100">
                              <td className="px-4 py-3 text-center text-xs font-mono text-muted-foreground/50 font-bold">{idx + 1}</td>
                              <td className="px-4 py-3 text-xs font-mono font-bold text-foreground/80">{item.employeeId}</td>
                              <td className="px-4 py-3">
                                <span className="text-xs font-black text-foreground block">{item.employeeName}</span>
                                <span className="text-[10px] text-muted-foreground block font-semibold">{item.designation}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-xs font-bold text-foreground/80 block">{item.department}</span>
                                <span className="text-[10px] text-muted-foreground block font-semibold">{item.section}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {item.totalWeightedScore > 0 ? (
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs font-black" style={{ color: gradeColor }}>{item.totalWeightedScore}% ({item.gradeResult})</span>
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-bold text-muted-foreground">Not Graded</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${
                                  item.status === "Completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                  item.status === "In Progress" ? "bg-[#1e88e5]/10 text-[#1e88e5] border-[#1e88e5]/20" :
                                  "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                }`}>
                                  {item.status}
                                </span>
                                {item.status === "In Progress" && (
                                  <span className="text-[9px] text-muted-foreground block mt-1 font-semibold">Step {item.currentStep}/5</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => setActiveEmpId(item.employeeId)}
                                  className="h-8 px-4 rounded-lg bg-[#1e88e5]/10 text-[#1e88e5] hover:bg-[#1e88e5] hover:text-white font-extrabold text-[10px] uppercase tracking-wider transition-all"
                                >
                                  {item.status === "Completed" ? "View" : "Assess"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredAssessments.length === 0 && (
                          <tr>
                            <td colSpan={7} className="text-center py-12 text-xs font-bold text-muted-foreground">
                              No assessments found matching the criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Bulk Filters */}
                <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="space-y-1.5 flex-1 max-w-xs">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block">Appraisal Cycle</label>
                      <select 
                        value={activeCycle}
                        onChange={(e) => setActiveCycle(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
                      >
                        {cycles.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5 flex-1 max-w-md">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase block">Choose Your Approval Role</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setBulkActionRole("PlantHead"); setSelectedForBulk([]); }}
                          className={`flex-1 h-10 px-3 rounded-lg text-xs font-bold transition-all ${bulkActionRole === "PlantHead" ? "bg-[#1e88e5] text-white shadow-sm" : "bg-muted/40 text-muted-foreground border border-border/40 hover:bg-muted"}`}
                        >
                          Plant Head (Stage 3)
                        </button>
                        <button
                          onClick={() => { setBulkActionRole("MD"); setSelectedForBulk([]); }}
                          className={`flex-1 h-10 px-3 rounded-lg text-xs font-bold transition-all ${bulkActionRole === "MD" ? "bg-[#1e88e5] text-white shadow-sm" : "bg-muted/40 text-muted-foreground border border-border/40 hover:bg-muted"}`}
                        >
                          Managing Director (Stage 4)
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleBulkApprove}
                      disabled={selectedForBulk.length === 0}
                      className="h-10 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      Bulk Approve Selected ({selectedForBulk.length})
                    </button>
                  </div>
                </div>

                {/* Bulk Employee List Table */}
                <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border/40 text-[9.5px] uppercase font-black tracking-wider text-muted-foreground/60">
                          <th className="px-4 py-3 text-center w-12">
                            <input
                              type="checkbox"
                              className="rounded border-border/40 focus:ring-[#1e88e5]"
                              onChange={(e) => {
                                const targetStep = bulkActionRole === "PlantHead" ? 3 : 4;
                                const bulkEligible = assessments.filter(a => a.cycleId === activeCycle && a.currentStep === targetStep && a.status !== "Completed");
                                if (e.target.checked) {
                                  setSelectedForBulk(bulkEligible.map(a => a.employeeId));
                                } else {
                                  setSelectedForBulk([]);
                                }
                              }}
                              checked={(() => {
                                const targetStep = bulkActionRole === "PlantHead" ? 3 : 4;
                                const bulkEligible = assessments.filter(a => a.cycleId === activeCycle && a.currentStep === targetStep && a.status !== "Completed");
                                return bulkEligible.length > 0 && selectedForBulk.length === bulkEligible.length;
                              })()}
                            />
                          </th>
                          <th className="px-4 py-3 w-28">Emp ID</th>
                          <th className="px-4 py-3">Name & Role</th>
                          <th className="px-4 py-3">Department</th>
                          <th className="px-4 py-3 text-center">HOD Proposed Inc</th>
                          <th className="px-4 py-3 text-center">HOD Proposed Promotion</th>
                           <th className="px-4 py-3 text-center">Score & Grade</th>
                          <th className="px-4 py-3 text-center w-32">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {(() => {
                          const targetStep = bulkActionRole === "PlantHead" ? 3 : 4;
                          const list = assessments.filter(a => a.cycleId === activeCycle && a.currentStep === targetStep && a.status !== "Completed");
                          if (list.length === 0) {
                            return (
                              <tr>
                                <td colSpan={8} className="text-center py-12 text-xs font-bold text-muted-foreground">
                                  No pending assessments for this role to bulk approve.
                                </td>
                              </tr>
                            );
                          }
                          return list.map((item) => {
                            const gradeColor = bands.find(b => b.id === item.gradeBandId)?.color || "#94a3b8";
                            return (
                              <tr key={item.id} className="hover:bg-muted/20 transition duration-100">
                                <td className="px-4 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    className="rounded border-border/40 focus:ring-[#1e88e5]"
                                    checked={selectedForBulk.includes(item.employeeId)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedForBulk([...selectedForBulk, item.employeeId]);
                                      } else {
                                        setSelectedForBulk(selectedForBulk.filter(id => id !== item.employeeId));
                                      }
                                    }}
                                  />
                                </td>
                                <td className="px-4 py-3 text-xs font-mono font-bold text-foreground/80">{item.employeeId}</td>
                                <td className="px-4 py-3">
                                  <span className="text-xs font-black text-foreground block">{item.employeeName}</span>
                                  <span className="text-[10px] text-muted-foreground block font-semibold">{item.designation}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-xs font-bold text-foreground/80 block">{item.department}</span>
                                  <span className="text-[10px] text-muted-foreground block font-semibold">{item.section}</span>
                                </td>
                                <td className="px-4 py-3 text-center text-xs font-mono font-bold text-indigo-600">
                                  ৳{(item.hodProposedInc || 0).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-center text-xs font-bold">
                                  {item.hodProposedPromotion === "Yes" ? (
                                    <span className="text-emerald-600">Yes ({item.hodProposedDesignation})</span>
                                  ) : "No"}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="text-xs font-black" style={{ color: gradeColor }}>{item.totalWeightedScore}% ({item.gradeResult})</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border bg-[#1e88e5]/10 text-[#1e88e5] border-[#1e88e5]/20">
                                    Stage {item.currentStep}
                                  </span>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    );
  }

  // WORKFLOW VIEW
  if (!activeEmp) return null; // safety

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">

          {/* Action Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveEmpId(null)}
                className="size-9 rounded-lg border border-border/40 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-4" />
              </button>
              <div>
                <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                  <ClipboardCheck className="size-5.5 text-primary" />
                  <span>Workflow: {activeEmp.employeeName}</span>
                </h1>
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground/75 mt-0.5">
                  <span className="uppercase tracking-wider">ID: {activeEmp.employeeId}</span>
                  <span>•</span>
                  <span>{cycles.find(c => c.id === activeCycle)?.name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="h-9 px-5 bg-card border border-border/80 hover:bg-muted text-foreground font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider"
              >
                <Printer className="size-4" />
                <span>Print Report</span>
              </button>
            </div>
          </div>

          {/* Employee Target Info */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
            <div className="flex items-center gap-3 md:col-span-2">
              <div className="size-12 rounded-full bg-primary/10 text-primary grid place-items-center font-black text-xl">
                {activeEmp.employeeName.charAt(0)}
              </div>
              <div>
                <span className="text-sm font-black text-foreground block">{activeEmp.employeeName}</span>
                <span className="text-xs text-muted-foreground font-semibold block">{activeEmp.designation} • {activeEmp.department}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-muted/30 px-4 py-2.5 rounded-xl border border-border/40">
              <Building className="size-5 text-emerald-500" />
              <div>
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Current Gross Salary</span>
                <span className="text-xs font-black text-foreground">{activeEmp.grossSalary.toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-muted/30 px-4 py-2.5 rounded-xl border border-border/40">
              <Activity className="size-5 text-violet-500" />
              <div>
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Score & Grade</span>
                {activeEmp.totalWeightedScore > 0 ? (
                  <span className="text-xs font-black text-foreground">{activeEmp.totalWeightedScore}% ({activeEmp.gradeResult})</span>
                ) : (
                  <span className="text-xs font-bold text-muted-foreground">Pending</span>
                )}
              </div>
            </div>
          </div>

          {/* Workflow Stepper Banner */}
          <div className="bg-card rounded-lg border border-border/80 p-6 shadow-xs print:hidden space-y-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                <Star className="size-4 animate-spin text-[#1e88e5]" />
                <span>Approval Sequence Progress</span>
              </span>
              <span className="text-xs font-bold text-muted-foreground/80">
                Current Active: <span className="text-[#1e88e5] font-black">Step {activeStep}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {[
                { step: 1, label: "HOD Appraisal", desc: "Dept Head scoring" },
                { step: 2, label: "HR Recommendation", desc: "Strength & plan review" },
                { step: 3, label: "Plant Head", desc: "Executive endorsement" },
                { step: 4, label: "Managing Director", desc: "Salary band approval" },
                { step: 5, label: "Final Evaluation", desc: "Appraisal completion" }
              ].map((item) => {
                const isCompleted = completedSteps.includes(item.step);
                const isActive = activeStep === item.step;
                const isLocked = activeStep < item.step;

                return (
                  <div
                    key={item.step}
                    className={`p-3.5 rounded-xl border transition-all duration-150 flex items-start gap-3 ${isActive
                        ? "bg-[#1e88e5]/5 border-[#1e88e5] shadow-xs relative"
                        : isCompleted
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : "bg-slate-100/50 dark:bg-slate-900/30 border-border/40 opacity-60"
                      }`}
                  >
                    <div className={`size-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-[#1e88e5] text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                      {isCompleted ? <CheckCircle2 className="size-5" /> : item.step}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-foreground block">{item.label}</span>
                      <span className="text-[10px] text-muted-foreground block font-medium leading-tight">{item.desc}</span>
                      {isLocked && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground/60 text-[9px] font-bold mt-1">
                          <Lock className="size-2.5" /> Locked
                        </span>
                      )}
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-[#1e88e5] text-[9px] font-bold mt-1 animate-pulse">
                          <Unlock className="size-2.5" /> In Progress
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">

            {/* STAGE 1: HOD Appraisal */}
            <div className={`bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep !== 1 && !completedSteps.includes(1) ? "opacity-75" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`}>
              {activeStep > 1 && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[9px] px-3.5 py-1 uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5 z-10 print:hidden">
                  <CheckCircle2 className="size-3" />
                  <span>HOD Stage Completed</span>
                </div>
              )}

              <div className="p-5 border-b border-border/30 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                    <span className="size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs">1</span>
                    <span>HOD Assessment Details</span>
                  </h2>
                  <button
                    onClick={() => setShow360Modal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 text-xs font-bold transition-colors border border-indigo-500/20 shadow-sm"
                  >
                    <Users className="size-3.5" /> View 360° Peer Feedback
                  </button>
                </div>
                {activeStep > 1 && <span className="text-[10.5px] font-bold text-emerald-500 print:hidden">Inputs Locked</span>}
              </div>

              <div className="p-5 space-y-5">
                <div className="overflow-x-auto border border-border/50 rounded-xl">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-muted/30 text-foreground font-bold border-b border-border/50 text-xs">
                        <th className="px-4 py-3 font-extrabold w-[25%] border-r border-border/30">Criteria</th>
                        <th className="px-3 py-3 font-extrabold text-center w-16 border-r border-border/30">Weight</th>
                        <th className="px-3 py-3 font-extrabold text-center w-16 border-r border-border/30">Max</th>
                        <th className="px-3 py-3 font-extrabold text-center w-20 border-r border-border/30">Self Score</th>
                        <th className="px-4 py-3 font-extrabold w-[20%] border-r border-border/30">Self Justification</th>
                        <th className="px-3 py-3 font-extrabold text-center w-24 border-r border-border/30">HOD Score</th>
                        <th className="px-4 py-3 font-extrabold">HOD Justification / Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 text-xs font-semibold">
                      {criteria.map((item) => {
                        if (item.status !== "Active") return null;
                        const scoreData = activeEmp.criteriaScores.find(s => s.criteriaId === item.id);
                        const selfScoreData = activeSelfAssessment?.scores.find(s => s.criteriaId === item.id);
                        return (
                          <tr key={item.id} className="hover:bg-muted/20">
                            <td className="px-4 py-3 border-r border-border/20">
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[8.5px] font-extrabold uppercase border mb-1 ${getCategoryBg(item.category)}`}>
                                {item.category}
                              </span>
                              <span className="text-xs font-bold text-foreground block">{item.criteriaName}</span>
                              <span className="text-[10px] text-muted-foreground leading-relaxed block mt-0.5">{item.criteriaDetail}</span>
                            </td>
                            <td className="px-3 py-3 text-center border-r border-border/20">
                              <span className="font-bold text-primary">{item.weight}%</span>
                            </td>
                            <td className="px-3 py-3 text-center border-r border-border/20 text-muted-foreground">{item.maxScore}</td>
                            <td className="px-3 py-3 text-center border-r border-border/20 text-indigo-600 font-bold font-mono">
                              {selfScoreData ? selfScoreData.score : "—"}
                            </td>
                            <td className="px-4 py-3 border-r border-border/20 text-muted-foreground font-normal italic leading-relaxed">
                              {selfScoreData ? selfScoreData.justification : "No self-appraisal remark"}
                            </td>
                            <td className="px-3 py-3 text-center border-r border-border/20">
                              <input
                                type="number"
                                min={0}
                                max={item.maxScore}
                                disabled={activeStep !== 1}
                                value={scoreData?.hodScore || 0}
                                onChange={(e) => handleScoreChange(item.id, parseFloat(e.target.value) || 0)}
                                className="w-16 h-8 text-center rounded border border-border/40 focus:border-[#1e88e5] outline-none text-xs font-bold font-mono bg-card disabled:bg-muted/50"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                placeholder="Remarks..."
                                disabled={activeStep !== 1}
                                value={scoreData?.notes || ""}
                                onChange={(e) => handleNotesChange(item.id, e.target.value)}
                                className="w-full h-8 px-2.5 rounded border border-border/40 focus:border-[#1e88e5] outline-none text-xs font-bold bg-card disabled:bg-muted/50"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <form onSubmit={handleCompleteHod} className="space-y-4">
                  <div className="border-t border-border/30 pt-4 space-y-4">
                    <span className="text-[11px] font-black text-[#1e88e5] uppercase tracking-wider block">Recommendation By Reporting HOD</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">HOD Recommendation *</label>
                        <textarea
                          required
                          disabled={activeStep !== 1}
                          value={activeEmp.hodRecommendation}
                          onChange={(e) => handleUpdateActiveEmp({ hodRecommendation: e.target.value })}
                          className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Improvement Plan *</label>
                        <textarea
                          required
                          disabled={activeStep !== 1}
                          value={activeEmp.improvementPlan}
                          onChange={(e) => handleUpdateActiveEmp({ improvementPlan: e.target.value })}
                          className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Special Comments</label>
                        <textarea
                          disabled={activeStep !== 1}
                          value={activeEmp.specialComments}
                          onChange={(e) => handleUpdateActiveEmp({ specialComments: e.target.value })}
                          className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Existing JD & New JD</label>
                        <textarea
                          disabled={activeStep !== 1}
                          value={activeEmp.jdDetails}
                          onChange={(e) => handleUpdateActiveEmp({ jdDetails: e.target.value })}
                          className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="border-t border-border/30 pt-4 mt-4 space-y-4">
                      <span className="text-[11px] font-black text-[#1e88e5] uppercase tracking-wider block">Proposed Increment & Promotion By HOD</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Proposed Increment Amount (BDT)</label>
                          <input
                            type="number"
                            disabled={activeStep !== 1}
                            value={activeEmp.hodProposedInc || 0}
                            onChange={(e) => handleUpdateActiveEmp({ hodProposedInc: parseFloat(e.target.value) || 0 })}
                            className="w-full h-9 px-3 rounded-lg bg-muted/20 border border-border/40 outline-none focus:border-[#1e88e5] font-mono text-xs font-bold disabled:bg-muted/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Propose Promotion? *</label>
                          <select
                            disabled={activeStep !== 1}
                            value={activeEmp.hodProposedPromotion || "No"}
                            onChange={(e) => handleUpdateActiveEmp({ hodProposedPromotion: e.target.value })}
                            className="w-full h-9 px-3 rounded-lg bg-muted/20 border border-border/40 outline-none focus:border-[#1e88e5] text-xs font-bold disabled:bg-muted/50"
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Proposed Designation</label>
                          <input
                            type="text"
                            disabled={activeStep !== 1 || activeEmp.hodProposedPromotion !== "Yes"}
                            value={activeEmp.hodProposedDesignation || ""}
                            onChange={(e) => handleUpdateActiveEmp({ hodProposedDesignation: e.target.value })}
                            placeholder="Specify proposed designation..."
                            className="w-full h-9 px-3 rounded-lg bg-muted/20 border border-border/40 outline-none focus:border-[#1e88e5] text-xs font-bold disabled:bg-muted/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {activeStep === 1 && (
                    <div className="flex justify-end pt-3 border-t border-border/30">
                      <button type="submit" className="h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider">
                        Calculate Score & Submit HOD Assessment
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* STAGE 2: HR Review */}
            <div className={`bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep < 2 ? "hidden" : activeStep !== 2 ? "opacity-75" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`}>
              <div className="p-5 border-b border-border/30 bg-muted/20">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                  <span className="size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs">2</span>
                  <span>Recommendation By HRD</span>
                </h2>
              </div>
              <div className="p-5">
                <form onSubmit={handleCompleteHr} className="space-y-4 text-xs font-semibold">
                  {/* HOD Proposal Display */}
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">HOD Proposed Increment</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">৳{(activeEmp.hodProposedInc || 0).toLocaleString()} BDT</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">HOD Proposed Promotion</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{activeEmp.hodProposedPromotion || "No"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">HOD Proposed Designation</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{activeEmp.hodProposedDesignation || "—"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">HRD Strength *</label>
                      <textarea
                        required disabled={activeStep !== 2}
                        value={activeEmp.hrdStrength}
                        onChange={(e) => handleUpdateActiveEmp({ hrdStrength: e.target.value })}
                        className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 outline-none resize-none focus:border-[#1e88e5]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">HRD Improvement Plan *</label>
                      <textarea
                        required disabled={activeStep !== 2}
                        value={activeEmp.hrdImprovementPlan}
                        onChange={(e) => handleUpdateActiveEmp({ hrdImprovementPlan: e.target.value })}
                        className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 outline-none resize-none focus:border-[#1e88e5]"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">HRD Recommended Increment Amount (BDT)</label>
                      <input
                        type="number"
                        disabled={activeStep !== 2}
                        value={activeEmp.hrProposedInc || 0}
                        onChange={(e) => handleUpdateActiveEmp({ hrProposedInc: parseFloat(e.target.value) || 0 })}
                        className="w-full h-9 px-3 rounded-lg bg-muted/20 border border-border/40 outline-none focus:border-[#1e88e5] font-mono text-xs font-bold disabled:bg-muted/50"
                      />
                    </div>
                  </div>
                  {activeStep === 2 && (
                    <div className="flex justify-end pt-3 border-t border-border/30">
                      <button type="submit" className="h-9 px-6 bg-[#1e88e5] text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider">
                        Submit HR Review
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* STAGE 3: Plant Head */}
            <div className={`bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep < 3 ? "hidden" : activeStep !== 3 ? "opacity-75" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`}>
              <div className="p-5 border-b border-border/30 bg-muted/20">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                  <span className="size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs">3</span>
                  <span>Endorsement By Plant Head</span>
                </h2>
              </div>
              <div className="p-5">
                <form onSubmit={handleCompletePlantHead} className="space-y-4 text-xs font-semibold">
                  {/* Proposal Display */}
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">HOD Proposed Increment</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">৳{(activeEmp.hodProposedInc || 0).toLocaleString()} BDT</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">HOD Proposed Promotion</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{activeEmp.hodProposedPromotion || "No"} ({activeEmp.hodProposedDesignation || "—"})</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">HRD Recommended Increment</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">৳{(activeEmp.hrProposedInc || 0).toLocaleString()} BDT</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Decision</label>
                      <select
                        disabled={activeStep !== 3}
                        value={activeEmp.plantHeadApproval}
                        onChange={(e) => handleUpdateActiveEmp({ plantHeadApproval: e.target.value })}
                        className="w-full h-9 px-3 rounded-lg bg-muted/20 border border-border/40 outline-none text-xs font-bold"
                      >
                        <option value="Approved">Approved</option>
                        <option value="Approved with Adjustment">Approved with adjustment</option>
                        <option value="Hold">Hold for review</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Plant Head Recommended Increment (BDT)</label>
                      <input
                        type="number"
                        disabled={activeStep !== 3}
                        value={activeEmp.plantHeadProposedInc || 0}
                        onChange={(e) => handleUpdateActiveEmp({ plantHeadProposedInc: parseFloat(e.target.value) || 0 })}
                        className="w-full h-9 px-3 rounded-lg bg-muted/20 border border-border/40 outline-none focus:border-[#1e88e5] font-mono text-xs font-bold disabled:bg-muted/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Comments *</label>
                      <textarea
                        required disabled={activeStep !== 3}
                        value={activeEmp.plantHeadComments}
                        onChange={(e) => handleUpdateActiveEmp({ plantHeadComments: e.target.value })}
                        className="w-full h-9 p-2.5 rounded-lg bg-muted/20 border border-border/40 outline-none resize-none focus:border-[#1e88e5]"
                      />
                    </div>
                  </div>
                  {activeStep === 3 && (
                    <div className="flex justify-end pt-3 border-t border-border/30">
                      <button type="submit" className="h-9 px-6 bg-[#1e88e5] text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider">
                        Submit Plant Head Approval
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* STAGE 4: MD */}
            <div className={`bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep < 4 ? "hidden" : activeStep !== 4 ? "opacity-75" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`}>
              <div className="p-5 border-b border-border/30 bg-muted/20">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                  <span className="size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs">4</span>
                  <span>Managing Director Approval</span>
                </h2>
              </div>
              <div className="p-5">
                <form onSubmit={handleCompleteMd} className="space-y-4 text-xs font-semibold">
                  {/* Proposal Display */}
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">HOD Proposed Increment</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">৳{(activeEmp.hodProposedInc || 0).toLocaleString()} BDT</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">HRD Recommended Increment</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">৳{(activeEmp.hrProposedInc || 0).toLocaleString()} BDT</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Plant Head Recommended</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">৳{(activeEmp.plantHeadProposedInc || 0).toLocaleString()} BDT</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">HOD Proposed Promotion</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{activeEmp.hodProposedPromotion || "No"} ({activeEmp.hodProposedDesignation || "—"})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Decision</label>
                      <select
                        disabled={activeStep !== 4}
                        value={activeEmp.mdApproval}
                        onChange={(e) => handleUpdateActiveEmp({ mdApproval: e.target.value })}
                        className="w-full h-9 px-3 rounded-lg bg-muted/20 border border-border/40 outline-none text-xs font-bold"
                      >
                        <option value="Approved">Approved</option>
                        <option value="Adjusted">Adjusted</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">MD Recommended Increment (BDT)</label>
                      <input
                        type="number"
                        disabled={activeStep !== 4}
                        value={activeEmp.mdProposedInc || 0}
                        onChange={(e) => handleUpdateActiveEmp({ mdProposedInc: parseFloat(e.target.value) || 0 })}
                        className="w-full h-9 px-3 rounded-lg bg-muted/20 border border-border/40 outline-none focus:border-[#1e88e5] font-mono text-xs font-bold disabled:bg-muted/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">MD Directives *</label>
                      <textarea
                        required disabled={activeStep !== 4}
                        value={activeEmp.mdComments}
                        onChange={(e) => handleUpdateActiveEmp({ mdComments: e.target.value })}
                        className="w-full h-9 p-2.5 rounded-lg bg-muted/20 border border-border/40 outline-none resize-none focus:border-[#1e88e5]"
                      />
                    </div>
                  </div>
                  {activeStep === 4 && (
                    <div className="flex justify-end pt-3 border-t border-border/30">
                      <button type="submit" className="h-9 px-6 bg-[#1e88e5] text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider">
                        Submit MD Directive
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* STAGE 5: Final Execution */}
            <div className={`bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep < 5 ? "hidden" : activeStep !== 5 ? "opacity-75" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`}>
              <div className="p-5 border-b border-border/30 bg-muted/20">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                  <span className="size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs">5</span>
                  <span>Final Increment Execution</span>
                </h2>
              </div>
              <div className="p-5">
                <form onSubmit={handleCompleteFinal} className="space-y-5 text-xs font-semibold">
                  {/* Proposal Display */}
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">HOD Proposed Increment</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">৳{(activeEmp.hodProposedInc || 0).toLocaleString()} BDT</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">HRD Recommended Increment</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">৳{(activeEmp.hrProposedInc || 0).toLocaleString()} BDT</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Plant Head Recommended</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">৳{(activeEmp.plantHeadProposedInc || 0).toLocaleString()} BDT</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">MD Recommended Increment</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">৳{(activeEmp.mdProposedInc || 0).toLocaleString()} BDT</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Current Gross</label>
                      <div className="w-full h-9 px-3 bg-muted/50 rounded-lg flex items-center text-xs font-bold font-mono text-foreground/80">
                        {activeEmp.grossSalary.toLocaleString()} BDT
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Inc Amount *</label>
                      <input
                        type="number" required disabled={completedSteps.includes(5)}
                        value={activeEmp.incAmount !== undefined && activeEmp.incAmount !== 0 ? activeEmp.incAmount : (activeEmp.mdProposedInc || 0)}
                        onChange={(e) => handleUpdateActiveEmp({ incAmount: parseInt(e.target.value) || 0 })}
                        className="w-full h-9 px-3 rounded-lg border border-border/40 focus:border-[#1e88e5] text-xs font-bold font-mono outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">New Gross Salary</label>
                      <div className="w-full h-9 px-3 bg-[#1e88e5]/5 rounded-lg border border-[#1e88e5]/30 flex items-center text-xs font-black font-mono text-[#1e88e5]">
                        {(activeEmp.grossSalary + (activeEmp.incAmount !== undefined && activeEmp.incAmount !== 0 ? activeEmp.incAmount : (activeEmp.mdProposedInc || 0))).toLocaleString()} BDT
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Give Promotion</label>
                      <select
                        disabled={completedSteps.includes(5)}
                        value={activeEmp.givePromotion}
                        onChange={(e) => handleUpdateActiveEmp({ givePromotion: e.target.value })}
                        className="w-full h-9 px-3 rounded-lg border border-border/40 text-xs outline-none"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Final Execution Notes</label>
                    <textarea
                      disabled={completedSteps.includes(5)}
                      value={activeEmp.finalNotes}
                      onChange={(e) => handleUpdateActiveEmp({ finalNotes: e.target.value })}
                      className="w-full h-16 p-3 rounded-lg bg-muted/20 border border-border/40 outline-none resize-none focus:border-[#1e88e5]"
                    />
                  </div>

                  {!completedSteps.includes(5) && (
                    <div className="flex justify-end pt-3 border-t border-border/30">
                      <button type="submit" className="h-10 px-8 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg shadow-md transition uppercase tracking-wider">
                        Execute Appraisal
                      </button>
                    </div>
                  )}

                  {completedSteps.includes(5) && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3.5 text-emerald-600">
                      <CheckCircle2 className="size-5 animate-bounce shrink-0" />
                      <div>
                        <span className="font-extrabold text-xs block">Appraisal Workflow Finalized Successfully!</span>
                        <span className="text-[10.5px] font-bold block opacity-90 mt-0.5">
                          New gross salary of {(activeEmp.grossSalary + (activeEmp.incAmount || 0)).toLocaleString()} BDT has been committed.
                        </span>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>

        {/* 360 Degree Feedback Modal */}
        {show360Modal && activeEmp && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-border/80 flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
              
              <div className="px-6 py-5 border-b border-border/50 bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 flex justify-between items-start sticky top-0 z-10">
                <div>
                  <h2 className="text-lg font-black tracking-tight flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Users className="size-5" />
                    360° Peer Feedback Summary
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground font-semibold">
                    <span className="font-bold text-foreground">{activeEmp.employeeName}</span>
                    <span>•</span>
                    <span>{activeEmp.designation}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShow360Modal(false)}
                  className="size-8 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {(() => {
                  const empReviews = peerReviews.filter(pr => pr.revieweeId === activeEmp.employeeId && pr.status === "Completed");
                  if (empReviews.length === 0) {
                    return (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="size-12 mx-auto opacity-20 mb-3" />
                        <p className="text-sm font-bold">No completed peer reviews found for this employee yet.</p>
                      </div>
                    );
                  }

                  const avgRatings = empReviews.reduce((acc, curr) => {
                    acc.teamwork += curr.ratings.teamwork;
                    acc.communication += curr.ratings.communication;
                    acc.problemSolving += curr.ratings.problemSolving;
                    acc.leadership += curr.ratings.leadership;
                    acc.workEthic += curr.ratings.workEthic;
                    return acc;
                  }, { teamwork: 0, communication: 0, problemSolving: 0, leadership: 0, workEthic: 0 });

                  Object.keys(avgRatings).forEach(k => {
                    avgRatings[k as keyof typeof avgRatings] = Number((avgRatings[k as keyof typeof avgRatings] / empReviews.length).toFixed(1));
                  });

                  return (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                          { key: "teamwork", label: "Teamwork" },
                          { key: "communication", label: "Communication" },
                          { key: "problemSolving", label: "Problem Solving" },
                          { key: "leadership", label: "Leadership" },
                          { key: "workEthic", label: "Work Ethic" }
                        ].map(metric => (
                          <div key={metric.key} className="bg-muted/30 p-4 rounded-xl border border-border/50 text-center">
                            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">{metric.label}</p>
                            <p className="text-2xl font-black text-indigo-600">{avgRatings[metric.key as keyof typeof avgRatings]}</p>
                            <p className="text-[9px] font-bold text-muted-foreground mt-0.5">/ 10 avg</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">Detailed Anonymous Feedback ({empReviews.length} Reviews)</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {empReviews.map((review, idx) => (
                            <div key={idx} className="bg-card border border-border/60 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/30 text-[10px] font-black text-muted-foreground uppercase">
                                <User className="size-3" /> Peer Review #{idx + 1}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[10px] font-bold uppercase text-emerald-600 mb-1">Strengths</p>
                                  <p className="text-xs font-medium text-foreground">{review.strengths}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold uppercase text-amber-600 mb-1">Areas for Improvement</p>
                                  <p className="text-xs font-medium text-foreground">{review.weaknesses}</p>
                                </div>
                                <div className="md:col-span-2 mt-2 pt-2 border-t border-border/30">
                                  <p className="text-[10px] font-bold uppercase text-indigo-600 mb-1">Overall Comments</p>
                                  <p className="text-xs font-medium text-foreground">{review.overallComments}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
