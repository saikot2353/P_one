import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Users,
  CheckCircle2,
  Search,
  ArrowRight,
  CornerDownRight,
  Plus,
  FileText,
  ShieldCheck,
  Save,
  Send,
  AlertTriangle,
  MessageSquare,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import {
  PeerReview,
  loadPeerReviews,
  savePeerReviews,
  KpiCycle,
  loadKpiCycles,
} from "@/lib/kpi-data";
import { employeesData } from "@/routes/personnel-list";

export const Route = createFileRoute("/kpi-peer-review")({
  head: () => ({
    meta: [
      { title: "360° Peer Review — CRIPTON HRIS" },
      { name: "description", content: "Evaluate and provide feedback for your peers." },
    ],
  }),
  component: PeerReviewPage,
});

function PeerReviewPage() {
  const CURRENT_USER_ID = "2023043910"; // Tahmid Afsar Shapno

  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const [peerReviews, setPeerReviews] = useState<PeerReview[]>([]);
  const [cycles, setCycles] = useState<KpiCycle[]>([]);

  const [evaluatingReview, setEvaluatingReview] = useState<PeerReview | null>(null);

  const [showNominateModal, setShowNominateModal] = useState(false);
  const [nominatedEmpId, setNominatedEmpId] = useState("");
  const [employeesList, setEmployeesList] = useState<any[]>([]);

  useEffect(() => {
    setPeerReviews(loadPeerReviews());
    setCycles(loadKpiCycles());

    // Load employees list
    let list: any[] = [];
    if (typeof window !== "undefined") {
      const synced = localStorage.getItem("recruitment_synced_employees");
      if (synced) {
        try {
          const parsed = JSON.parse(synced);
          if (Array.isArray(parsed) && parsed.length > 0) {
            list = [...parsed];
            employeesData.forEach((d) => {
              if (!list.some((m) => m.id === d.id)) {
                list.push(d);
              }
            });
          }
        } catch {}
      }
    }
    if (list.length === 0) {
      list = [...employeesData];
    }
    setEmployeesList(list);
  }, []);

  const handleNominatePeer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nominatedEmpId) return;
    const selectedEmp = employeesList.find((emp) => emp.id === nominatedEmpId);
    if (!selectedEmp) return;

    if (
      peerReviews.some(
        (pr) => pr.reviewerId === CURRENT_USER_ID && pr.revieweeId === nominatedEmpId,
      )
    ) {
      toast.error("You have already nominated or been assigned to review this peer.");
      return;
    }

    const newNomination: PeerReview = {
      id: `PR-NOM-${Date.now()}`,
      cycleId: "CYC-001",
      reviewerId: CURRENT_USER_ID,
      reviewerName: "Tahmid Afsar Shapno",
      reviewerDesignation: "Asst. Manager",
      revieweeId: selectedEmp.id,
      revieweeName: selectedEmp.name,
      revieweeDesignation: selectedEmp.title || selectedEmp.designation || "Executive",
      department: selectedEmp.dept || selectedEmp.department || "Business Innovation",
      ratings: { teamwork: 0, communication: 0, problemSolving: 0, leadership: 0, workEthic: 0 },
      strengths: "",
      weaknesses: "",
      overallComments: "",
      status: "Pending",
    };

    const updated = [newNomination, ...peerReviews];
    setPeerReviews(updated);
    savePeerReviews(updated);
    setShowNominateModal(false);
    setNominatedEmpId("");
    toast.success("Successfully nominated peer for 360° review!");
  };

  const myPending = peerReviews.filter(
    (pr) => pr.reviewerId === CURRENT_USER_ID && pr.status === "Pending",
  );
  const myCompleted = peerReviews.filter(
    (pr) => pr.reviewerId === CURRENT_USER_ID && pr.status === "Completed",
  );

  const displayedList = activeTab === "pending" ? myPending : myCompleted;
  const filteredList = displayedList.filter(
    (pr) =>
      pr.revieweeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getCycleName = (id: string) => cycles.find((c) => c.id === id)?.name || "Unknown Cycle";

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingReview) return;

    if (
      !evaluatingReview.strengths ||
      !evaluatingReview.weaknesses ||
      !evaluatingReview.overallComments
    ) {
      toast.error("Please fill out all feedback fields.");
      return;
    }

    const updatedList = peerReviews.map((pr) => {
      if (pr.id === evaluatingReview.id) {
        return {
          ...evaluatingReview,
          status: "Completed" as const,
          submittedAt: new Date().toISOString().split("T")[0],
        };
      }
      return pr;
    });

    setPeerReviews(updatedList);
    savePeerReviews(updatedList);
    setEvaluatingReview(null);
    toast.success("Peer review submitted successfully!");
    setActiveTab("completed");
  };

  const updateRating = (field: keyof PeerReview["ratings"], value: number) => {
    if (!evaluatingReview) return;
    setEvaluatingReview({
      ...evaluatingReview,
      ratings: {
        ...evaluatingReview.ratings,
        [field]: value,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-[#090e17] scrollbar-thin">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border/60 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/2"></div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="size-4.5" />
                  </div>
                  <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                    360° Peer Review
                  </h1>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium max-w-2xl">
                  Evaluate your peers honestly and constructively. Your feedback helps build a
                  better, more collaborative organization.
                </p>
              </div>
              <button
                onClick={() => setShowNominateModal(true)}
                className="h-10 px-5 rounded-lg bg-[#1e88e5] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 shrink-0"
              >
                <Plus className="size-4" /> Nominate a Peer
              </button>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-amber-500/10 to-transparent"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                      Pending Reviews
                    </p>
                    <h3 className="text-3xl font-black text-amber-600">{myPending.length}</h3>
                  </div>
                  <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="size-5" />
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-emerald-500/10 to-transparent"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                      Completed Reviews
                    </p>
                    <h3 className="text-3xl font-black text-emerald-600">{myCompleted.length}</h3>
                  </div>
                  <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="size-5" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary to-primary-glow text-white rounded-2xl p-5 shadow-md relative overflow-hidden group col-span-1 sm:col-span-2 lg:col-span-1">
                <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-white/80 mb-1">
                      Current Cycle
                    </p>
                    <h3 className="text-lg font-bold truncate pr-4">{getCycleName("CYC-001")}</h3>
                  </div>
                  <div className="size-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <ShieldCheck className="size-5" />
                  </div>
                </div>
                <div className="mt-4 text-[10px] font-semibold text-white/80 bg-black/10 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 backdrop-blur-sm">
                  <AlertTriangle className="size-3" /> Anonymous Mode Active
                </div>
              </div>
            </div>

            {/* List Section */}
            <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
              {/* Tab Navigation */}
              <div className="border-b border-border/50 bg-muted/20 px-4 md:px-6 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors relative ${activeTab === "pending" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  >
                    Pending Reviews
                    {myPending.length > 0 && (
                      <span className="absolute -top-1 -right-4 size-4 bg-amber-500 text-white rounded-full text-[9px] flex items-center justify-center font-black animate-pulse">
                        {myPending.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "completed" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  >
                    Completed Reviews
                  </button>
                </div>
                <div className="pb-3 relative w-full sm:w-64">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-[calc(50%+6px)] text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name or dept..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-4 text-xs font-semibold bg-background border border-border/80 rounded-full focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Data List */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                {filteredList.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 border border-border">
                      <FileText className="size-6 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      No {activeTab} reviews found.
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                      {activeTab === "pending"
                        ? "You're all caught up! There are no peers assigned to you for review right now."
                        : "You haven't completed any peer reviews yet."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredList.map((pr) => (
                      <div
                        key={pr.id}
                        className="group relative bg-background border border-border/80 rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm">
                              {pr.revieweeName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-sm font-extrabold text-foreground leading-tight">
                                {pr.revieweeName}
                              </h4>
                              <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                                {pr.revieweeDesignation}
                              </p>
                            </div>
                          </div>
                          {pr.status === "Pending" ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              Pending
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              Completed
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 mb-5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-semibold">Department</span>
                            <span className="font-bold text-foreground">{pr.department}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-semibold">
                              Evaluation Cycle
                            </span>
                            <span className="font-bold text-foreground">
                              {getCycleName(pr.cycleId)}
                            </span>
                          </div>
                          {pr.status === "Completed" && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground font-semibold">
                                Submitted On
                              </span>
                              <span className="font-bold text-foreground">{pr.submittedAt}</span>
                            </div>
                          )}
                        </div>

                        {pr.status === "Pending" ? (
                          <button
                            onClick={() => setEvaluatingReview({ ...pr })}
                            className="w-full h-9 bg-primary text-primary-foreground font-bold text-xs rounded-lg shadow-sm hover:shadow hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="size-3.5" /> Start Evaluation
                          </button>
                        ) : (
                          <button
                            onClick={() => setEvaluatingReview({ ...pr })}
                            className="w-full h-9 bg-muted hover:bg-muted/80 text-foreground font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 border border-border"
                          >
                            <Search className="size-3.5" /> View Evaluation
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Evaluation Modal */}
      {evaluatingReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-border/80 flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-border/50 bg-gradient-to-r from-muted/50 to-muted/20 flex justify-between items-start sticky top-0 z-10">
              <div>
                <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                  {evaluatingReview.status === "Pending" ? "Evaluate Peer" : "View Evaluation"}
                  {evaluatingReview.status === "Completed" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Completed
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground font-semibold">
                  <span className="font-bold text-foreground">{evaluatingReview.revieweeName}</span>
                  <span>•</span>
                  <span>{evaluatingReview.revieweeDesignation}</span>
                  <span>•</span>
                  <span>{evaluatingReview.department}</span>
                </div>
              </div>
              <button
                onClick={() => setEvaluatingReview(null)}
                className="size-8 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="evaluation-form" onSubmit={handleSaveEvaluation} className="space-y-8">
                {/* Notice */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 text-primary text-sm font-medium">
                  <ShieldCheck className="size-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Confidentiality Notice</p>
                    <p className="text-xs opacity-90 mt-0.5">
                      Your feedback will be aggregated and anonymized before being shared with the
                      employee. Please be constructive and objective.
                    </p>
                  </div>
                </div>

                {/* Ratings */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground mb-4 border-b border-border/40 pb-2">
                    Core Ratings (1-10)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {[
                      {
                        key: "teamwork",
                        label: "Teamwork & Collaboration",
                        desc: "Works well with others",
                      },
                      {
                        key: "communication",
                        label: "Communication",
                        desc: "Clear and timely updates",
                      },
                      {
                        key: "problemSolving",
                        label: "Problem Solving",
                        desc: "Analytical and resourceful",
                      },
                      {
                        key: "leadership",
                        label: "Leadership",
                        desc: "Takes initiative, guides others",
                      },
                      { key: "workEthic", label: "Work Ethic", desc: "Reliable and dedicated" },
                    ].map((metric) => (
                      <div
                        key={metric.key}
                        className="bg-muted/30 p-3 rounded-lg border border-border/40"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="text-xs font-bold text-foreground">{metric.label}</p>
                            <p className="text-[9px] text-muted-foreground">{metric.desc}</p>
                          </div>
                          <span className="text-sm font-black text-primary">
                            {evaluatingReview.ratings[metric.key as keyof PeerReview["ratings"]] ||
                              "-"}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={
                            evaluatingReview.ratings[metric.key as keyof PeerReview["ratings"]] || 5
                          }
                          disabled={evaluatingReview.status === "Completed"}
                          onChange={(e) =>
                            updateRating(
                              metric.key as keyof PeerReview["ratings"],
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <div className="flex justify-between mt-1 text-[8px] font-bold text-muted-foreground">
                          <span>1 (Poor)</span>
                          <span>10 (Excellent)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Written Feedback */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground mb-4 border-b border-border/40 pb-2">
                    Written Feedback
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Key Strengths <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        value={evaluatingReview.strengths}
                        onChange={(e) =>
                          setEvaluatingReview({ ...evaluatingReview, strengths: e.target.value })
                        }
                        disabled={evaluatingReview.status === "Completed"}
                        placeholder="What does this person do exceptionally well?"
                        className="w-full min-h-[80px] p-3 text-xs bg-background border border-border/80 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y disabled:opacity-70 disabled:bg-muted/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Areas for Improvement <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        value={evaluatingReview.weaknesses}
                        onChange={(e) =>
                          setEvaluatingReview({ ...evaluatingReview, weaknesses: e.target.value })
                        }
                        disabled={evaluatingReview.status === "Completed"}
                        placeholder="Where could this person focus their development?"
                        className="w-full min-h-[80px] p-3 text-xs bg-background border border-border/80 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y disabled:opacity-70 disabled:bg-muted/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Overall Comments <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        value={evaluatingReview.overallComments}
                        onChange={(e) =>
                          setEvaluatingReview({
                            ...evaluatingReview,
                            overallComments: e.target.value,
                          })
                        }
                        disabled={evaluatingReview.status === "Completed"}
                        placeholder="Any other feedback or context you'd like to provide?"
                        className="w-full min-h-[80px] p-3 text-xs bg-background border border-border/80 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y disabled:opacity-70 disabled:bg-muted/30"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border/50 bg-muted/10 flex justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setEvaluatingReview(null)}
                className="h-9 px-5 rounded-lg border border-border bg-background text-foreground font-bold text-xs hover:bg-muted transition-colors"
              >
                {evaluatingReview.status === "Pending" ? "Cancel" : "Close"}
              </button>
              {evaluatingReview.status === "Pending" && (
                <button
                  type="submit"
                  form="evaluation-form"
                  className="h-9 px-6 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow hover:shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="size-3.5" /> Submit Evaluation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Nominate Peer Modal */}
      {showNominateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-border/80 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <div className="px-6 py-5 border-b border-border/50 bg-gradient-to-r from-muted/50 to-muted/20 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-black tracking-tight">Nominate a Peer</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Select a colleague to assess for this review cycle.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowNominateModal(false);
                  setNominatedEmpId("");
                }}
                className="size-8 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleNominatePeer} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Colleague *
                </label>
                <select
                  required
                  value={nominatedEmpId}
                  onChange={(e) => setNominatedEmpId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
                >
                  <option value="">-- Select Colleague --</option>
                  {employeesList
                    .filter((emp) => emp.id !== CURRENT_USER_ID)
                    .map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.title || emp.designation} - {emp.dept || emp.department})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border/30">
                <button
                  type="button"
                  onClick={() => {
                    setShowNominateModal(false);
                    setNominatedEmpId("");
                  }}
                  className="h-9 px-4 rounded-lg border border-border bg-background text-foreground font-bold text-xs hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-lg bg-[#1e88e5] text-white font-bold text-xs hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Nominate Peer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
