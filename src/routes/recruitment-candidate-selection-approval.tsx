import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  FileText,
  Eye,
  Printer,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  RotateCcw,
  UserCheck,
  User,
  DollarSign,
  Filter,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Building2,
  Check,
  History,
  TrendingDown,
  TrendingUp,
  Sliders,
  BadgeCheck,
  Briefcase,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  JobCandidate,
  JobPost,
  SalaryRevision,
  CandidateApprovalTier,
  getOrInitCandidateApprovalTiers,
  getCandidateTier,
  getStoredJobSelections,
  saveStoredJobSelections,
  syncCandidateToQueue,
} from "@/lib/recruitment-candidate-selection-data";

export const Route = createFileRoute("/recruitment-candidate-selection-approval")({
  head: () => ({
    meta: [
      { title: "Candidate Selection Approval — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Review nominated candidates, fine-tune approved salary balances, and grant official hiring authorizations.",
      },
    ],
  }),
  component: CandidateSelectionApprovalPage,
});

export function CandidateSelectionApprovalPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved">("Pending");
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [expandedJobIds, setExpandedJobIds] = useState<Record<string, boolean>>({});

  // Active Multi-Tier Approval Layer (1: Dept Head, 2: HR Director, 3: Managing Director)
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);

  // Checkbox selections for batch candidate approval
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Record<string, boolean>>({});

  // Inline salary edits (candidateId -> newSalary)
  const [inlineSalaries, setInlineSalaries] = useState<Record<string, number>>({});

  // Active Candidate Review & Salary Adjustment Modal
  const [reviewModal, setReviewModal] = useState<{
    job: JobPost;
    candidate: JobCandidate;
    adjustedSalary: number;
    initialSalary: number;
    remarks: string;
    activeTab: "cv" | "history";
  } | null>(null);

  // Active Revision History Modal
  const [historyModal, setHistoryModal] = useState<{
    candidate: JobCandidate;
    jobTitle: string;
  } | null>(null);

  // Docket Print Modal for Approved Jobs
  const [docketModalJob, setDocketModalJob] = useState<JobPost | null>(null);

  // Approval Layer Definitions
  const APPROVAL_LAYERS = [
    {
      level: 1,
      name: "Layer 1: Department Head Review",
      role: "Department Head / Functional Lead",
      badge: "Initial Screening & Salary Proposal",
      company: "Pakiza Knit Composite Ltd.",
      description: "Full requisition candidate pool. Select qualified candidates, set proposed salary, and endorse.",
    },
    {
      level: 2,
      name: "Layer 2: HR Operations & Compensation",
      role: "Tahmid Afsar (HR Director)",
      badge: "Compensation & Policy Review",
      company: "Pakiza Software Limited (PSL-Operation)",
      description: "Only candidates endorsed by Department Head appear here. Fine-tune compensation balance and approve.",
    },
    {
      level: 3,
      name: "Layer 3: Executive Management Approval",
      role: "Engr. Mosharraf Hossain (Managing Director & CEO)",
      badge: "Final Appointment Authorization",
      company: "Pakiza Group",
      description: "Only finalists endorsed by HR Director appear here. Grant official authorization and generate recruitment links.",
    },
  ];

  // Candidates filtering by layer
  // Layer 1: ALL candidates arrive in pool ("approval e sob candidate ashbe!")
  // Layer 2: ONLY candidates endorsed by Layer 1 ("taile 2nd layer sudhu 3 jon kei dekhte parbe!")
  // Layer 3: ONLY candidates endorsed by Layer 2
  const getCandidatesForLayer = (job: JobPost, layer: number): JobCandidate[] => {
    if (layer === 1) {
      return job.candidates;
    }
    if (layer === 2) {
      return job.candidates.filter((c) => {
        const t1 = getCandidateTier(c, 1, job);
        return t1?.status === "Approved";
      });
    }
    if (layer === 3) {
      return job.candidates.filter((c) => {
        const t2 = getCandidateTier(c, 2, job);
        return t2?.status === "Approved";
      });
    }
    return job.candidates;
  };

  // Load jobs from shared store
  useEffect(() => {
    const loaded = getStoredJobSelections();
    setJobs(loaded);

    // Expand all jobs by default
    const expandMap: Record<string, boolean> = {};
    loaded.forEach((j) => {
      expandMap[j.id] = true;
    });
    setExpandedJobIds(expandMap);
  }, []);

  const persistJobs = (updated: JobPost[]) => {
    setJobs(updated);
    saveStoredJobSelections(updated);
  };

  const toggleJobAccordion = (jobId: string) => {
    setExpandedJobIds((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  // Filter departments based only on jobs with candidates
  const departments = useMemo(() => {
    const set = new Set(jobs.map((j) => j.department));
    return ["All", ...Array.from(set)];
  }, [jobs]);

  // Layer statistics across all jobs
  const layerStats = useMemo(() => {
    const computeFor = (lvl: number) => {
      let total = 0;
      let approved = 0;
      jobs.forEach((j) => {
        const cands = getCandidatesForLayer(j, lvl);
        total += cands.length;
        approved += cands.filter((c) => getCandidateTier(c, lvl, j)?.status === "Approved").length;
      });
      return { total, approved, pending: total - approved };
    };

    return {
      1: computeFor(1),
      2: computeFor(2),
      3: computeFor(3),
    };
  }, [jobs]);

  // Toggle single candidate selection
  const toggleCandidateSelect = (candId: string) => {
    setSelectedCandidateIds((prev) => ({
      ...prev,
      [candId]: !prev[candId],
    }));
  };

  // Toggle select all candidates in a specific job for the active layer
  const toggleSelectAllForJob = (job: JobPost, visibleCands: JobCandidate[]) => {
    const allSelected =
      visibleCands.length > 0 && visibleCands.every((c) => !!selectedCandidateIds[c.id]);
    setSelectedCandidateIds((prev) => {
      const updated = { ...prev };
      visibleCands.forEach((c) => {
        if (allSelected) {
          delete updated[c.id];
        } else {
          updated[c.id] = true;
        }
      });
      return updated;
    });
  };

  // Filtered jobs: only show jobs that match search, department, and active layer candidates
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const layerCands = getCandidatesForLayer(job, activeLayer);

      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        layerCands.some(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesDept = deptFilter === "All" || job.department === deptFilter;

      let matchesStatus = true;
      const approvedCountInLayer = layerCands.filter(
        (c) => getCandidateTier(c, activeLayer, job)?.status === "Approved"
      ).length;
      const isLayerComplete = layerCands.length > 0 && approvedCountInLayer === layerCands.length;

      if (statusFilter === "Pending") {
        matchesStatus = !isLayerComplete;
      } else if (statusFilter === "Approved") {
        matchesStatus = isLayerComplete || approvedCountInLayer > 0;
      }

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [jobs, activeLayer, searchQuery, deptFilter, statusFilter]);

  // Overall Statistics for the Active Layer
  const stats = useMemo(() => {
    const layerCands = jobs.flatMap((j) => getCandidatesForLayer(j, activeLayer));
    const totalInLayer = layerCands.length;
    const totalApproved = layerCands.filter(
      (c) =>
        getCandidateTier(
          c,
          activeLayer,
          jobs.find((j) => j.candidates.some((cand) => cand.id === c.id))
        )?.status === "Approved"
    ).length;
    const pendingApproval = totalInLayer - totalApproved;

    const totalMonthlyCommitment = layerCands.reduce(
      (sum, c) => sum + (inlineSalaries[c.id] ?? c.agreedSalary ?? c.previousSalary ?? 0),
      0
    );

    const totalMaxBudget = filteredJobs.reduce((sum, j) => {
      const cands = getCandidatesForLayer(j, activeLayer);
      return sum + (j.salaryBudgetMax || 0) * (cands.length || j.vacancies);
    }, 0);

    const totalSurplus = Math.max(0, totalMaxBudget - totalMonthlyCommitment);

    return {
      pendingApproval,
      totalApproved,
      totalMonthlyCommitment,
      totalSurplus,
      totalNominated: totalInLayer,
    };
  }, [jobs, activeLayer, filteredJobs, inlineSalaries]);

  // Open Review & Salary Adjustment Modal
  const handleOpenReviewModal = (job: JobPost, candidate: JobCandidate) => {
    const currentSalary =
      inlineSalaries[candidate.id] ??
      candidate.agreedSalary ??
      candidate.previousSalary ??
      0;

    setReviewModal({
      job,
      candidate,
      adjustedSalary: currentSalary,
      initialSalary: candidate.initialAgreedSalary || currentSalary,
      remarks: "",
      activeTab: "cv",
    });
  };

  // Primary Approval Handler for Single or Multiple Candidates in the Active Layer
  const handleApproveCandidates = (
    jobId: string,
    candidateIds: string[],
    customSalaries?: Record<string, number>,
    remarks?: string
  ) => {
    if (candidateIds.length === 0) return;
    const timestamp = new Date().toLocaleString();
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    const updatedJobs = jobs.map((j) => {
      if (j.id === jobId) {
        const updatedCandidates = j.candidates.map((c) => {
          if (candidateIds.includes(c.id)) {
            const finalSalary =
              customSalaries?.[c.id] ??
              inlineSalaries[c.id] ??
              c.agreedSalary ??
              c.previousSalary ??
              0;

            const baseTiers = getOrInitCandidateApprovalTiers(c, j);

            // Add salary revision log if salary modified
            let nextHistory = c.salaryHistory ? [...c.salaryHistory] : [];
            if (c.agreedSalary && c.agreedSalary !== finalSalary) {
              nextHistory.push({
                id: `rev-${Date.now()}-${c.id}`,
                approverLevel: activeLayer,
                approverRole:
                  activeLayer === 1
                    ? j.assignedRole || "Department Head"
                    : activeLayer === 2
                    ? "HR Director"
                    : "Managing Director",
                approverName:
                  activeLayer === 1
                    ? j.assignedPerson || "Tanvir Ahmed"
                    : activeLayer === 2
                    ? "Tahmid Afsar"
                    : "Engr. Mosharraf Hossain",
                approverDesignation:
                  activeLayer === 1
                    ? j.assignedRole || "Department Head"
                    : activeLayer === 2
                    ? "HR Director"
                    : "Managing Director & CEO",
                timestamp,
                previousSalary: c.agreedSalary,
                newSalary: finalSalary,
                delta: finalSalary - c.agreedSalary,
                reason:
                  remarks ||
                  `Salary adjusted by ${
                    activeLayer === 1
                      ? "Department Head"
                      : activeLayer === 2
                      ? "HR Director"
                      : "Managing Director"
                  } during Layer ${activeLayer} approval`,
              });
            }

            const updatedTiers = baseTiers.map((t) => {
              if (t.level === activeLayer) {
                return {
                  ...t,
                  status: "Approved" as const,
                  approvedSalary: finalSalary,
                  actionDate: timestamp,
                  remarks:
                    remarks ||
                    `Candidate endorsed & approved at Layer ${activeLayer}`,
                  approverName:
                    activeLayer === 1
                      ? j.assignedPerson || "Tanvir Ahmed"
                      : activeLayer === 2
                      ? "Tahmid Afsar"
                      : "Engr. Mosharraf Hossain",
                  approverDesignation:
                    activeLayer === 1
                      ? j.assignedRole || "Department Head"
                      : activeLayer === 2
                      ? "HR Director"
                      : "Managing Director & CEO",
                  company:
                    activeLayer === 1
                      ? "Pakiza Knit Composite Ltd."
                      : activeLayer === 2
                      ? "Pakiza Software Limited (PSL-Operation)"
                      : "Pakiza Group",
                };
              }
              if (t.level > activeLayer && t.status === "Pending") {
                return {
                  ...t,
                  approvedSalary: finalSalary,
                };
              }
              return t;
            });

            const isFinalLayer = activeLayer === 3;
            const link =
              c.generatedLink ||
              (isFinalLayer
                ? `${baseUrl}/e-recruitment-form?tempId=${c.id}&candidateName=${encodeURIComponent(
                    c.name
                  )}&department=${encodeURIComponent(
                    c.department
                  )}&designation=${encodeURIComponent(
                    c.designation
                  )}&jobPost=${encodeURIComponent(j.title)}`
                : undefined);

            const updatedCand: JobCandidate = {
              ...c,
              selected: true,
              agreedSalary: finalSalary,
              status: isFinalLayer ? "Approved" : c.status,
              generatedLink: link || c.generatedLink,
              linkGeneratedAt: isFinalLayer ? timestamp : c.linkGeneratedAt,
              salaryHistory: nextHistory,
              approvalTiers: updatedTiers,
            };

            if (isFinalLayer && link) {
              syncCandidateToQueue(updatedCand, j, link);
            }

            return updatedCand;
          }
          return c;
        });

        // If in Layer 3 and all candidates approved, mark job approved
        const allCandidatesApproved =
          updatedCandidates.length > 0 &&
          updatedCandidates.every((c) => c.status === "Approved");

        return {
          ...j,
          candidates: updatedCandidates,
          status: allCandidatesApproved ? ("Approved" as const) : j.status,
          closedAt: allCandidatesApproved ? timestamp : j.closedAt,
          closedBy: allCandidatesApproved ? "Executive Management" : j.closedBy,
        };
      }
      return j;
    });

    persistJobs(updatedJobs);

    // Clear selections for these candidates
    setSelectedCandidateIds((prev) => {
      const copy = { ...prev };
      candidateIds.forEach((id) => delete copy[id]);
      return copy;
    });

    if (activeLayer === 1) {
      toast.success(
        `${candidateIds.length} candidate(s) endorsed by Department Head & forwarded to Layer 2 (HR Director)!`
      );
    } else if (activeLayer === 2) {
      toast.success(
        `${candidateIds.length} candidate(s) approved by HR Director & forwarded to Layer 3 (Managing Director)!`
      );
    } else {
      toast.success(
        `Final authorization granted for ${candidateIds.length} candidate(s)! e-Recruitment links generated.`
      );
    }
  };

  // Direct 1-Click Approve Candidate from Row
  const handleQuickApproveCandidate = (job: JobPost, candidate: JobCandidate) => {
    handleApproveCandidates(job.id, [candidate.id]);
  };

  // Handle Approve from Modal (with salary adjustment if modified)
  const handleApproveFromModal = () => {
    if (!reviewModal) return;
    const { job, candidate, adjustedSalary, remarks } = reviewModal;

    if (!adjustedSalary || adjustedSalary <= 0 || isNaN(adjustedSalary)) {
      toast.error("Please enter a valid salary amount (> 0).");
      return;
    }

    handleApproveCandidates(
      job.id,
      [candidate.id],
      { [candidate.id]: adjustedSalary },
      remarks.trim() || undefined
    );
    setReviewModal(null);
  };

  // Batch Approve All Eligible Candidates in Job
  const handleApproveAllJobCandidates = (job: JobPost) => {
    const cands = getCandidatesForLayer(job, activeLayer);
    const unapproved = cands.filter(
      (c) => getCandidateTier(c, activeLayer, job)?.status !== "Approved"
    );
    if (unapproved.length === 0) {
      toast.info("All candidates in this layer are already approved.");
      return;
    }
    handleApproveCandidates(
      job.id,
      unapproved.map((c) => c.id)
    );
  };

  // Return Job / Candidates for Revision
  const handleReturnForRevision = (job: JobPost) => {
    const updatedJobs = jobs.map((j) => {
      if (j.id === job.id) {
        return {
          ...j,
          status: "Open" as const,
          candidates: j.candidates.map((c) => {
            const tiers = getOrInitCandidateApprovalTiers(c, j).map((t) => {
              if (t.level === activeLayer) {
                return { ...t, status: "Pending" as const, actionDate: undefined };
              }
              return t;
            });
            return {
              ...c,
              approvalTiers: tiers,
            };
          }),
        };
      }
      return j;
    });
    persistJobs(updatedJobs);
    toast.info(`Candidates in ${job.id} reset for Layer ${activeLayer} revision.`);
  };

  // Copy candidate link helper
  const handleCopyLink = (link?: string, candidateName?: string) => {
    if (!link) {
      toast.error("No link available for this candidate.");
      return;
    }
    navigator.clipboard.writeText(link);
    toast.success(`Copied e-recruitment link for ${candidateName || "candidate"}!`);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* ─── PAGE HEADER ──────────────────────────────────────────────────── */}
        <header className="border-b border-border bg-card/60 backdrop-blur-xs px-6 py-4 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span>e-Recruitment</span>
                <span>/</span>
                <span className="text-foreground font-medium">Candidate Selection Approval</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-xs">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                    <span>Candidate Selection Approval</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Approval Console
                    </span>
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Review nominated candidates, fine-tune approved salary balances, and grant hiring authorizations.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                to="/recruitment-candidate-selection"
                className="h-8.5 px-3 bg-muted hover:bg-muted/80 text-foreground border border-border/60 font-normal text-xs rounded-lg shadow-2xs transition flex items-center gap-1.5"
              >
                <ArrowLeft className="size-3.5 text-muted-foreground" />
                <span>Candidate Selection (Data Entry)</span>
              </Link>
              <Link
                to="/recruitment-basic-list"
                className="h-8.5 px-3 bg-muted hover:bg-muted/80 text-foreground border border-border/60 font-normal text-xs rounded-lg shadow-2xs transition flex items-center gap-1.5"
              >
                <Users className="size-3.5 text-primary" />
                <span>Application Queue</span>
              </Link>
            </div>
          </div>
        </header>

        {/* ─── SCROLLABLE MAIN CONTENT ─────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* ─── SMART MULTI-TIER APPROVAL LAYER SELECTOR ───────────────────── */}
          <div className="bg-card rounded-2xl border border-border/80 p-2.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between px-1.5 pt-0.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Multi-Tier Approval Hierarchy & Filtering
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-normal">
                Switch layers to inspect and authorize candidates through the hierarchy
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {APPROVAL_LAYERS.map((layer) => {
                const isActive = activeLayer === layer.level;
                const total = layerStats[layer.level as 1 | 2 | 3].total;
                const approved = layerStats[layer.level as 1 | 2 | 3].approved;
                const pending = layerStats[layer.level as 1 | 2 | 3].pending;

                return (
                  <button
                    key={layer.level}
                    type="button"
                    onClick={() => {
                      setActiveLayer(layer.level as 1 | 2 | 3);
                      setSelectedCandidateIds({});
                    }}
                    className={`p-3.5 rounded-xl text-left transition-all relative border cursor-pointer ${
                      isActive
                        ? "bg-primary/10 border-primary ring-1 ring-primary/30 shadow-xs"
                        : "bg-muted/30 hover:bg-muted/60 border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {layer.level}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isActive ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {layer.name}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          isActive
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-muted-foreground border-border/70"
                        }`}
                      >
                        {approved}/{total} Approved
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-foreground/90 truncate">
                      {layer.role}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate font-normal">
                      {layer.company}
                    </div>

                    <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">{layer.badge}</span>
                      {pending > 0 ? (
                        <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">
                          {pending} awaiting action
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ✓ All up to date
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── FILTERS & SEARCH CONTROL BAR ──────────────────────────────── */}
          <div className="bg-card rounded-xl border border-border/70 p-3 sm:p-3.5 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Segmented Tabs */}
              <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/40 text-xs font-normal">
                <button
                  type="button"
                  onClick={() => setStatusFilter("Pending")}
                  className={`px-3 py-1 rounded-md transition cursor-pointer ${
                    statusFilter === "Pending"
                      ? "bg-card text-amber-600 dark:text-amber-400 shadow-2xs border border-border/60 font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Pending Layer {activeLayer} ({stats.pendingApproval})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("Approved")}
                  className={`px-3 py-1 rounded-md transition cursor-pointer ${
                    statusFilter === "Approved"
                      ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs border border-border/60 font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Approved Layer {activeLayer} ({stats.totalApproved})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("All")}
                  className={`px-3 py-1 rounded-md transition cursor-pointer ${
                    statusFilter === "All"
                      ? "bg-card text-foreground shadow-2xs border border-border/60 font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All in Layer {activeLayer} ({stats.totalNominated})
                </button>
              </div>

              {/* Department Dropdown */}
              <div className="flex items-center gap-1.5">
                <Filter className="size-3.5 text-muted-foreground/70" />
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="h-8 px-2.5 rounded-lg bg-muted/60 border border-border/40 text-xs font-normal text-foreground outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  {departments
                    .filter((d) => d !== "All")
                    .map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="size-3.5 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search position, code, candidate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8.5 pr-8 rounded-lg bg-muted/40 border border-border/60 text-xs font-normal text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/60"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <XCircle className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ─── CLEAN LIST VIEW OF REQUISITIONS & NOMINATED CANDIDATES ────── */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border p-12 text-center space-y-3">
                <div className="size-12 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <ShieldCheck className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium text-foreground">
                  No candidate selections awaiting approval in Layer {activeLayer}
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto font-normal">
                  {statusFilter === "Pending"
                    ? `All candidates in Layer ${activeLayer} have been approved, or no candidates have reached this layer yet.`
                    : "No jobs match your current search and filter settings."}
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("All");
                      setDeptFilter("All");
                    }}
                    className="px-3.5 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  {activeLayer > 1 && (
                    <button
                      type="button"
                      onClick={() => setActiveLayer((activeLayer - 1) as 1 | 2)}
                      className="px-3.5 py-1.5 bg-card border border-border text-foreground hover:bg-muted rounded-lg text-xs font-medium transition cursor-pointer"
                    >
                      ← Switch to Layer {activeLayer - 1}
                    </button>
                  )}
                  <Link
                    to="/recruitment-candidate-selection"
                    className="px-3.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium transition"
                  >
                    Go to Candidate Selection
                  </Link>
                </div>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isExpanded = !!expandedJobIds[job.id];
                const layerCandidates = getCandidatesForLayer(job, activeLayer);

                const approvedInLayerCount = layerCandidates.filter(
                  (c) => getCandidateTier(c, activeLayer, job)?.status === "Approved"
                ).length;
                const isAllApprovedInLayer =
                  layerCandidates.length > 0 &&
                  approvedInLayerCount === layerCandidates.length;

                const selectedInThisJob = layerCandidates.filter(
                  (c) => !!selectedCandidateIds[c.id]
                );
                const selectedTotalSalary = selectedInThisJob.reduce(
                  (sum, c) =>
                    sum +
                    (inlineSalaries[c.id] ?? c.agreedSalary ?? c.previousSalary ?? 0),
                  0
                );

                const totalCandPayroll = layerCandidates.reduce(
                  (sum, c) =>
                    sum +
                    (inlineSalaries[c.id] ?? c.agreedSalary ?? c.previousSalary ?? 0),
                  0
                );
                const maxBudgetTotal =
                  (job.salaryBudgetMax || 0) * (layerCandidates.length || job.vacancies);
                const budgetRemaining = maxBudgetTotal - totalCandPayroll;
                const isOverBudget = budgetRemaining < 0;

                return (
                  <div
                    key={job.id}
                    className={`bg-card rounded-xl border transition-all duration-200 shadow-2xs overflow-hidden ${
                      isAllApprovedInLayer
                        ? "border-emerald-500/30 hover:border-emerald-500/50"
                        : "border-border/70 hover:border-border"
                    }`}
                  >
                    {/* Job Card Header */}
                    <div className="p-4 sm:px-5 sm:py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 border-b border-border/40 bg-card">
                      <div className="space-y-1.5 min-w-0">
                        {/* Row 1: Title + Job ID + Status */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                            {job.title}
                          </h2>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/70 text-muted-foreground border border-border/50">
                            {job.id}
                          </span>

                          {/* Status Badge for Active Layer */}
                          {isAllApprovedInLayer ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <BadgeCheck className="size-3" />
                              <span>Layer {activeLayer} Approved</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span>Pending Layer {activeLayer}</span>
                            </span>
                          )}
                        </div>

                        {/* Row 2: Clean Metadata Line */}
                        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-muted-foreground font-normal">
                          <span className="flex items-center gap-1 text-foreground/85 font-medium">
                            <Building2 className="size-3.5 text-muted-foreground/70" />
                            {job.department}
                          </span>
                          <span className="text-border/80">•</span>
                          <span className="flex items-center gap-1">
                            <Users className="size-3.5 text-muted-foreground/70" />
                            {job.vacancies} {job.vacancies === 1 ? "Vacancy" : "Vacancies"}
                          </span>
                          <span className="text-border/80">•</span>
                          <span className="flex items-center gap-1">
                            <User className="size-3.5 text-muted-foreground/70" />
                            Lead: <span className="text-foreground">{job.assignedPerson}</span>
                          </span>
                          <span className="text-border/80">•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5 text-muted-foreground/70" />
                            Target: {job.targetDate}
                          </span>
                          <span className="text-border/80">•</span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <DollarSign className="size-3.5" />
                            ৳{job.salaryBudgetMin.toLocaleString()} – ৳
                            {job.salaryBudgetMax.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Header Actions & Selection Counter */}
                      <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/30 shrink-0">
                        {/* Payroll & Surplus Pill */}
                        <div className="flex items-center gap-3 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/60">
                          <div>
                            <div className="text-[10px] text-muted-foreground">Payroll</div>
                            <div className="text-xs font-mono font-semibold text-foreground">
                              ৳{totalCandPayroll.toLocaleString()}
                            </div>
                          </div>
                          <div className="h-6 w-px bg-border/60" />
                          <div>
                            <div className="text-[10px] text-muted-foreground">Variance</div>
                            <div
                              className={`text-xs font-mono font-semibold ${
                                isOverBudget
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-emerald-600 dark:text-emerald-400"
                              }`}
                            >
                              {isOverBudget
                                ? `-৳${Math.abs(budgetRemaining).toLocaleString()}`
                                : `+৳${budgetRemaining.toLocaleString()} surplus`}
                            </div>
                          </div>
                        </div>

                        {/* Candidates Count Pill */}
                        <div className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/60 text-xs">
                          <UserCheck className="size-3.5 text-primary" />
                          <span className="font-mono font-bold text-foreground">
                            {approvedInLayerCount}/{layerCandidates.length}
                          </span>
                          <span className="text-muted-foreground">L{activeLayer} Approved</span>
                        </div>

                        {/* Expand / Collapse Button */}
                        <button
                          type="button"
                          onClick={() => toggleJobAccordion(job.id)}
                          className="h-8.5 px-3 bg-card hover:bg-muted text-foreground border border-border/70 font-medium text-xs rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{layerCandidates.length} in L{activeLayer}</span>
                          {isExpanded ? (
                            <ChevronUp className="size-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="size-3.5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Candidates Table for This Job */}
                    {isExpanded && (
                      <div className="p-3.5 sm:p-4 space-y-3">
                        {/* Check if no candidates reached this layer */}
                        {layerCandidates.length === 0 ? (
                          <div className="py-8 px-4 text-center rounded-xl bg-muted/20 border border-dashed border-border space-y-2">
                            <Clock className="size-6 text-muted-foreground mx-auto" />
                            <div className="text-xs font-semibold text-foreground">
                              No candidates in this position have reached Layer {activeLayer} yet
                            </div>
                            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto font-normal">
                              Candidates must be approved in{" "}
                              <strong className="text-foreground">
                                Layer {activeLayer - 1} ({APPROVAL_LAYERS[activeLayer - 2]?.name})
                              </strong>{" "}
                              before they appear here.
                            </p>
                            <button
                              type="button"
                              onClick={() => setActiveLayer((activeLayer - 1) as 1 | 2)}
                              className="mt-1 h-7.5 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition cursor-pointer"
                            >
                              ← Switch to Layer {activeLayer - 1} to endorse candidates
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* ─── CANDIDATES DATA TABLE ───────────────────────── */}
                            <div className="overflow-x-auto rounded-lg border border-border/60">
                              <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                  <tr className="text-[11px] font-semibold text-muted-foreground bg-muted/40 border-b border-border/60">
                                    <th className="px-4 py-2.5">Candidate</th>
                                    <th className="px-4 py-2.5">Experience & Notice</th>
                                    <th className="px-4 py-2.5 text-right">Prev. Salary</th>
                                    <th className="px-4 py-2.5 text-right whitespace-nowrap">
                                      Agreed / Offered Salary
                                    </th>
                                    <th className="px-4 py-2.5 text-center">Selection</th>
                                    <th className="px-4 py-2.5 text-center">Status</th>
                                    <th className="px-4 py-2.5 text-right">Approver Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30 bg-card">
                                  {layerCandidates.map((cand) => {
                                    const tier = getCandidateTier(cand, activeLayer, job);
                                    const isApprovedInLayer = tier?.status === "Approved";
                                    const isSelected = !!selectedCandidateIds[cand.id];

                                    const currentCandidateSalary =
                                      inlineSalaries[cand.id] ??
                                      cand.agreedSalary ??
                                      cand.previousSalary;

                                    const isSalaryModified =
                                      cand.initialAgreedSalary &&
                                      cand.initialAgreedSalary !== currentCandidateSalary;

                                    // Compute approved tiers count for multi-tier status (0/3, 1/3, 2/3, 3/3)
                                    const allTiers = getOrInitCandidateApprovalTiers(cand, job);
                                    const approvedTiersCount = allTiers.filter(
                                      (t) => t.status === "Approved"
                                    ).length;

                                    return (
                                      <tr
                                        key={cand.id}
                                        className={`transition-colors duration-150 ${
                                          isSelected
                                            ? "bg-primary/5 dark:bg-primary/10"
                                            : isApprovedInLayer
                                            ? "bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] hover:bg-emerald-500/[0.08]"
                                            : "hover:bg-muted/30"
                                        }`}
                                      >
                                        {/* Candidate Info */}
                                        <td className="px-4 py-3">
                                          <div className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                                            <span>{cand.name}</span>
                                            {cand.nameBng && (
                                              <span className="text-[10px] text-muted-foreground font-normal">
                                                ({cand.nameBng})
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5 font-mono">
                                            <span>{cand.id}</span>
                                            <span>·</span>
                                            <span>{cand.phone}</span>
                                          </div>
                                        </td>

                                        {/* Experience & Notice */}
                                        <td className="px-4 py-3">
                                          <div className="text-xs font-medium text-foreground">
                                            {cand.experience}
                                          </div>
                                          <div className="text-[11px] text-muted-foreground mt-0.5">
                                            {cand.noticePeriod} notice
                                          </div>
                                        </td>

                                        {/* Previous Salary */}
                                        <td className="px-4 py-3 text-right">
                                          <span className="text-xs text-muted-foreground font-mono">
                                            ৳{cand.previousSalary.toLocaleString()}
                                          </span>
                                        </td>

                                        {/* Agreed / Offered Salary */}
                                        <td className="px-4 py-3 text-right">
                                          <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                              ৳{currentCandidateSalary.toLocaleString()}
                                            </span>
                                            {isSalaryModified && (
                                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-medium">
                                                adjusted (orig: ৳
                                                {cand.initialAgreedSalary?.toLocaleString()})
                                              </span>
                                            )}
                                          </div>
                                        </td>

                                        {/* Selection State (View-Driven: strictly Selected or Not Selected) */}
                                        <td className="px-4 py-3 text-center">
                                          {isSelected ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                                              <Check className="size-3 stroke-[2.5]" />
                                              <span>Selected</span>
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-normal text-muted-foreground bg-muted/40 border border-dashed border-border/70">
                                              <span>Not Selected</span>
                                            </span>
                                          )}
                                        </td>

                                        {/* Status (strictly 0/3, 1/3, 2/3, 3/3 badge without text) */}
                                        <td className="px-4 py-3 text-center">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setHistoryModal({
                                                candidate: cand,
                                                jobTitle: job.title,
                                              })
                                            }
                                            className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-mono font-bold border transition cursor-pointer hover:opacity-90 shadow-2xs ${
                                              approvedTiersCount === 3
                                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                                                : approvedTiersCount === 2
                                                ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
                                                : approvedTiersCount === 1
                                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                                                : "bg-muted/60 text-muted-foreground border-border/70"
                                            }`}
                                            title="Click to view multi-tier approver details & salary history"
                                          >
                                            {approvedTiersCount}/3
                                          </button>
                                        </td>

                                        {/* Approver Actions (strictly View only) */}
                                        <td className="px-4 py-3 text-right">
                                          <div className="flex items-center justify-end">
                                            {/* View Button: Opens CV View, History & Selection Console */}
                                            <button
                                              type="button"
                                              onClick={() => handleOpenReviewModal(job, cand)}
                                              className="h-7.5 px-3 rounded-lg bg-primary hover:opacity-95 text-primary-foreground font-medium text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                                              title="View CV, particulars, adjust salary & select candidate"
                                            >
                                              <Eye className="size-3.5" />
                                              <span>View</span>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* Minimal Card Footer Action Bar */}
                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/20 -mx-3.5 sm:-mx-4 -mb-3.5 sm:-mb-4 p-3.5 sm:p-4 border-t border-border/50">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-normal flex-wrap">
                            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>
                              {layerCandidates.length} candidate(s) in Layer {activeLayer}
                              {selectedInThisJob.length > 0 && (
                                <span className="font-semibold text-foreground">
                                  {" "}· <b className="text-primary">{selectedInThisJob.length}</b> selected via View
                                </span>
                              )}
                              {" "}· Total monthly:{" "}
                              <b className="text-foreground font-mono">
                                ৳{totalCandPayroll.toLocaleString()}
                              </b>{" "}
                              · Surplus:{" "}
                              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                                ৳{Math.max(0, budgetRemaining).toLocaleString()}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Card Footer Approve Button */}
                            <button
                              type="button"
                              disabled={selectedInThisJob.length === 0}
                              onClick={() => {
                                handleApproveCandidates(
                                  job.id,
                                  selectedInThisJob.map((c) => c.id)
                                );
                              }}
                              className={`h-8 px-4 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs ${
                                selectedInThisJob.length > 0
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                  : "bg-muted text-muted-foreground border border-border/60 cursor-not-allowed opacity-60"
                              }`}
                              title={
                                selectedInThisJob.length > 0
                                  ? `Approve ${selectedInThisJob.length} selected candidate(s) in ${job.title}`
                                  : "Click 'View' to inspect and select candidate(s) first before approving"
                              }
                            >
                              <Check className="size-3.5 stroke-[2.5]" />
                              <span>
                                Approve{selectedInThisJob.length > 0 ? ` (${selectedInThisJob.length})` : ""}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* ─── MODAL 1: CANDIDATE VIEW, CV VIEWER, APPROVAL HISTORY & APPROVAL CONSOLE ──────── */}
      {reviewModal && (() => {
        const { job, candidate, adjustedSalary, initialSalary, remarks, activeTab } = reviewModal;
        const delta = adjustedSalary - initialSalary;
        const percentChange =
          initialSalary > 0 ? ((delta / initialSalary) * 100).toFixed(1) : "0";
        const pdfUrl = candidate.pdfUrl || "/Tahmid%20Afsar%20Shapno-details_.pdf";
        const revisions = candidate.salaryHistory || [];
        const isCandidateApproved = candidate.status === "Approved";
        const isApprovedInActiveLayer =
          getCandidateTier(candidate, activeLayer, job)?.status === "Approved";

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-2 sm:p-4 md:p-6 overflow-hidden">
            <div className="bg-card w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Top Header */}
              <div className="px-5 py-3 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <UserCheck className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">{candidate.name}</h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
                        {candidate.id}
                      </span>
                      {isApprovedInActiveLayer ? (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Check className="size-3" /> Approved in Layer {activeLayer}
                        </span>
                      ) : (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Clock className="size-3" /> Pending Layer {activeLayer}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {job.title} · {candidate.department} · {candidate.designation}
                    </p>
                  </div>
                </div>

                {/* Top Tabs: CV View / Approval History */}
                <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/60">
                  <button
                    type="button"
                    onClick={() =>
                      setReviewModal((prev) => (prev ? { ...prev, activeTab: "cv" } : null))
                    }
                    className={`h-7 px-3 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "cv"
                        ? "bg-card text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                  >
                    <FileText className="size-3.5" />
                    <span>CV View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReviewModal((prev) => (prev ? { ...prev, activeTab: "history" } : null))
                    }
                    className={`h-7 px-3 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "history"
                        ? "bg-card text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                  >
                    <History className="size-3.5" />
                    <span>Approval History</span>
                    {revisions.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-bold">
                        {revisions.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Top Tools: Open in Tab, Download, Close */}
                <div className="flex items-center gap-2">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs flex items-center gap-1.5 transition"
                    title="Open original PDF in a new tab"
                  >
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                    <span className="hidden sm:inline">Open in Tab</span>
                  </a>
                  <a
                    href={pdfUrl}
                    download={`${candidate.name}-CV.pdf`}
                    className="h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs flex items-center gap-1.5 transition"
                    title="Download candidate CV"
                  >
                    <Download className="size-3.5 text-muted-foreground" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setReviewModal(null)}
                    className="size-8 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer"
                    title="Close review modal"
                  >
                    <XCircle className="size-4.5" />
                  </button>
                </div>
              </div>

              {/* Main Split Body: Left CV / History, Right Salary Adjust & Approve Console */}
              <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                {/* Left Area: CV Iframe or Approval History */}
                <div className="flex-1 min-w-0 h-full bg-slate-900/5 dark:bg-slate-950 flex flex-col relative overflow-hidden border-b md:border-b-0 md:border-r border-border">
                  {activeTab === "cv" ? (
                    <div className="w-full h-full relative flex flex-col">
                      <iframe
                        src={`${pdfUrl}#view=FitH&toolbar=1`}
                        className="w-full h-full border-0"
                        title={`CV of ${candidate.name}`}
                      />
                    </div>
                  ) : (() => {
                      const tiers = getOrInitCandidateApprovalTiers(candidate, job);
                      const approvedTiersCount = tiers.filter((t) => t.status === "Approved").length;

                      return (
                        <div className="h-full overflow-y-auto p-5 sm:p-6 space-y-4 bg-muted/10">
                          {/* Top Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/70 gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <History className="size-4 text-amber-500" />
                                <span>Multi-Tier Salary & Approval Audit Trail</span>
                              </h4>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Approver verification, designation, company, and authorized salary records.
                              </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 shrink-0 self-start sm:self-center font-mono">
                              {approvedTiersCount} of {tiers.length} Tiers Approved
                            </span>
                          </div>

                          {/* ─── MULTI-TIER APPROVAL CHAIN CARDS ────────────────────── */}
                          <div className="space-y-3">
                            {tiers.map((tier) => {
                              const isTierApproved = tier.status === "Approved";

                              return (
                                <div
                                  key={tier.id || tier.level}
                                  className={`p-4 rounded-xl border transition-all ${
                                    isTierApproved
                                      ? "bg-card border-emerald-500/30 shadow-2xs"
                                      : "bg-card/60 border-dashed border-amber-500/40"
                                  }`}
                                >
                                  {/* Tier Level & Status Header */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border/40">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-foreground">
                                        {tier.tierName}
                                      </span>
                                      {isTierApproved ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                          <CheckCircle2 className="size-3" />
                                          <span>Approved</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                          <Clock className="size-2.5 animate-pulse" />
                                          <span>Pending</span>
                                        </span>
                                      )}
                                    </div>

                                    {tier.actionDate ? (
                                      <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                                        <Calendar className="size-3 text-muted-foreground/70" />
                                        <span>{tier.actionDate}</span>
                                      </span>
                                    ) : (
                                      <span className="text-[11px] text-muted-foreground italic">
                                        Awaiting review
                                      </span>
                                    )}
                                  </div>

                                  {/* Approver Details & Approved Salary Grid */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 text-xs">
                                    {/* Left: Approver Name, Designation & Company */}
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                                        <User className="size-3.5 text-primary" />
                                        <span>{tier.approverName}</span>
                                      </div>
                                      <div className="text-muted-foreground text-xs pl-5">
                                        <span>{tier.approverDesignation}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pl-5 pt-0.5">
                                        <Building2 className="size-3 text-muted-foreground/70" />
                                        <span className="font-medium text-foreground/80">{tier.company}</span>
                                      </div>
                                    </div>

                                    {/* Right: Approved Salary or Pending Amount */}
                                    <div className="sm:border-l sm:border-border/50 sm:pl-4 flex flex-col justify-center space-y-1">
                                      <span className="text-[11px] text-muted-foreground">
                                        {isTierApproved ? "Approved Salary:" : "Proposed Salary (Pending):"}
                                      </span>
                                      <div className="flex items-baseline gap-1.5">
                                        <span
                                          className={`text-base font-bold font-mono ${
                                            isTierApproved
                                              ? "text-emerald-600 dark:text-emerald-400"
                                              : "text-amber-600 dark:text-amber-400"
                                          }`}
                                        >
                                          ৳{tier.approvedSalary.toLocaleString()}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground">/ month</span>
                                      </div>
                                      {tier.remarks && (
                                        <div className="text-[11px] text-muted-foreground italic pt-0.5">
                                          "{tier.remarks}"
                                        </div>
                                      )}
                                      {!isTierApproved && (
                                        <div className="text-[11px] text-amber-600/90 dark:text-amber-400/90 pt-0.5 flex items-center gap-1">
                                          <span>• Awaiting authorization from this approver</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Candidate Selection & Previous Salary Baseline */}
                          <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-foreground flex items-center gap-1.5">
                                <BadgeCheck className="size-3.5 text-primary" />
                                <span>Candidate Selection & Previous Salary Baseline</span>
                              </span>
                              <span className="text-[11px] font-mono text-muted-foreground">
                                {candidate.selectedAt || "Nomination Phase"}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
                              <div>
                                <span className="text-[11px] text-muted-foreground">Previous Salary:</span>
                                <div className="font-mono font-medium text-foreground">
                                  ৳{candidate.previousSalary.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <span className="text-[11px] text-muted-foreground">Initial Proposed Salary:</span>
                                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                  ৳{(candidate.initialAgreedSalary || candidate.agreedSalary).toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <span className="text-[11px] text-muted-foreground">Initial Delta:</span>
                                <div className="font-mono font-medium text-foreground">
                                  +৳{((candidate.initialAgreedSalary || candidate.agreedSalary) - candidate.previousSalary).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Subsequent Revisions Log if any adjustments were made */}
                          {revisions.length > 0 && (
                            <div className="space-y-2 pt-1">
                              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Salary Revision Delta Log ({revisions.length})
                              </h5>
                              <div className="space-y-2.5">
                                {revisions.map((rev, idx) => (
                                  <div
                                    key={rev.id || idx}
                                    className="p-3.5 rounded-xl border border-amber-500/30 bg-card shadow-2xs space-y-2"
                                  >
                                    <div className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-amber-700 dark:text-amber-400">
                                          Revision #{idx + 1}
                                        </span>
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium">
                                          {rev.approverRole || "HR Director"}
                                        </span>
                                      </div>
                                      <span className="text-[11px] font-mono text-muted-foreground">
                                        {rev.timestamp}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs pt-1">
                                      <span className="font-mono text-muted-foreground line-through">
                                        ৳{rev.previousSalary.toLocaleString()}
                                      </span>
                                      <ArrowRight className="size-3 text-muted-foreground shrink-0" />
                                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                        ৳{rev.newSalary.toLocaleString()}
                                      </span>
                                      <span
                                        className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                                          rev.delta > 0
                                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                            : rev.delta < 0
                                            ? "bg-blue-500/10 text-blue-700 dark:text-blue-300"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                      >
                                        {rev.delta > 0 ? `+৳${rev.delta.toLocaleString()}` : rev.delta < 0 ? `-৳${Math.abs(rev.delta).toLocaleString()}` : "No change"}
                                      </span>
                                    </div>

                                    {rev.reason && (
                                      <div className="pt-1.5 text-xs text-muted-foreground border-t border-border/50">
                                        <span className="font-semibold text-foreground">Remarks: </span>
                                        {rev.reason}
                                      </div>
                                    )}
                                    <div className="text-[10px] text-muted-foreground font-mono">
                                      Authorized by: {rev.approverName || "Tahmid Afsar"} ({rev.approverDesignation || "HR Director"})
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                </div>

                {/* Right Side: Focused Salary Adjust & Inside Approval Console */}
                <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-border bg-card p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <Sliders className="size-4 text-emerald-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Salary Adjust & Approval
                      </h4>
                    </div>

                    {/* Candidate Particulars */}
                    <div className="space-y-2 text-xs p-3 rounded-xl border border-border/70 bg-muted/20">
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-mono text-foreground">{candidate.phone}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Experience</span>
                        <span className="text-foreground">{candidate.experience}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Notice Period</span>
                        <span className="text-foreground">{candidate.noticePeriod}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Department</span>
                        <span className="text-foreground">{candidate.department}</span>
                      </div>
                    </div>

                    {/* Previous vs Proposed Comparison */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl border border-border/70 bg-muted/20">
                        <span className="text-[11px] text-muted-foreground">Previous Salary</span>
                        <div className="font-mono font-bold text-sm text-foreground mt-0.5">
                          ৳{candidate.previousSalary.toLocaleString()}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-border/70 bg-muted/20">
                        <span className="text-[11px] text-muted-foreground">Initial Agreed</span>
                        <div className="font-mono font-bold text-sm text-foreground mt-0.5">
                          ৳{initialSalary.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Live Salary Input */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                        <span>Final Approved Salary (BDT ৳) *</span>
                        {delta !== 0 && (
                          <span
                            className={`text-[11px] font-mono font-bold ${
                              delta > 0 ? "text-amber-600" : "text-emerald-600"
                            }`}
                          >
                            {delta > 0 ? "+" : ""}৳{delta.toLocaleString()} ({percentChange}%)
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                          ৳
                        </span>
                        <input
                          type="number"
                          min={1000}
                          step={500}
                          value={adjustedSalary}
                          disabled={isCandidateApproved}
                          onChange={(e) =>
                            setReviewModal((prev) =>
                              prev ? { ...prev, adjustedSalary: Number(e.target.value) } : null
                            )
                          }
                          className="w-full h-10 pl-8 pr-3 rounded-xl border border-border bg-background text-sm font-mono font-bold text-foreground outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 disabled:opacity-60"
                          placeholder="e.g. 50000"
                        />
                      </div>

                      {/* Quick Adjust Buttons */}
                      {!isCandidateApproved && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setReviewModal((prev) =>
                                prev
                                  ? { ...prev, adjustedSalary: Math.max(0, prev.adjustedSalary - 1000) }
                                  : null
                              )
                            }
                            className="h-6.5 px-2 rounded-md bg-muted hover:bg-muted/80 text-[11px] font-mono text-muted-foreground hover:text-foreground transition cursor-pointer"
                          >
                            -1k
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setReviewModal((prev) =>
                                prev
                                  ? { ...prev, adjustedSalary: prev.adjustedSalary + 1000 }
                                  : null
                              )
                            }
                            className="h-6.5 px-2 rounded-md bg-muted hover:bg-muted/80 text-[11px] font-mono text-muted-foreground hover:text-foreground transition cursor-pointer"
                          >
                            +1k
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setReviewModal((prev) =>
                                prev
                                  ? { ...prev, adjustedSalary: prev.adjustedSalary + 2000 }
                                  : null
                              )
                            }
                            className="h-6.5 px-2 rounded-md bg-muted hover:bg-muted/80 text-[11px] font-mono text-muted-foreground hover:text-foreground transition cursor-pointer"
                          >
                            +2k
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Remarks / Reason for adjustment */}
                    {!isCandidateApproved && (
                      <div className="space-y-1.5 pt-1">
                        <label className="text-xs font-semibold text-foreground">
                          Approval Notes / Remarks
                        </label>
                        <textarea
                          rows={2}
                          value={remarks}
                          onChange={(e) =>
                            setReviewModal((prev) =>
                              prev ? { ...prev, remarks: e.target.value } : null
                            )
                          }
                          placeholder="e.g. Approved compensation package after management review..."
                          className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-emerald-600 resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Modal Action Buttons: ONLY TWO BUTTONS - Select & Close */}
                  <div className="pt-4 border-t border-border/70 flex flex-col gap-2 mt-auto">
                    <button
                      type="button"
                      onClick={() => {
                        const isCurrentlySelected = !!selectedCandidateIds[candidate.id];
                        toggleCandidateSelect(candidate.id);
                        setInlineSalaries((prev) => ({
                          ...prev,
                          [candidate.id]: adjustedSalary,
                        }));
                        toast.success(
                          isCurrentlySelected
                            ? `Deselected ${candidate.name}`
                            : `✓ ${candidate.name} selected`
                        );
                      }}
                      className={`w-full h-10 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                        selectedCandidateIds[candidate.id]
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      {selectedCandidateIds[candidate.id] ? (
                        <>
                          <Check className="size-4 stroke-[2.5]" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="size-4" />
                          <span>Select</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewModal(null)}
                      className="w-full h-9 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition cursor-pointer flex items-center justify-center"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── MODAL 2: REVISION HISTORY MODAL ──────────────────────────────── */}
      {historyModal && (() => {
        const { candidate, jobTitle } = historyModal;
        const revisions = candidate.salaryHistory || [];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <History className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Salary Revision History
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {candidate.name} ({candidate.id}) · {jobTitle}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHistoryModal(null)}
                  className="size-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center cursor-pointer transition"
                >
                  <XCircle className="size-4.5" />
                </button>
              </div>

              <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
                {/* ─── MULTI-TIER APPROVAL CHAIN CARDS ────────────────────── */}
                <div className="space-y-3">
                  {(() => {
                    const tiers = getOrInitCandidateApprovalTiers(candidate, { department: candidate.department });
                    return tiers.map((tier) => {
                      const isTierApproved = tier.status === "Approved";

                      return (
                        <div
                          key={tier.id || tier.level}
                          className={`p-3.5 rounded-xl border transition-all ${
                            isTierApproved
                              ? "bg-card border-emerald-500/30 shadow-2xs"
                              : "bg-muted/30 border-dashed border-amber-500/40"
                          }`}
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-border/40">
                            <span className="text-xs font-bold text-foreground">
                              {tier.tierName}
                            </span>
                            {isTierApproved ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="size-3" />
                                <span>Approved</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                <Clock className="size-2.5 animate-pulse" />
                                <span>Pending</span>
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 font-semibold text-foreground">
                                <User className="size-3 text-primary" />
                                <span>{tier.approverName}</span>
                              </div>
                              <div className="text-[11px] text-muted-foreground pl-4">
                                {tier.approverDesignation}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-muted-foreground pl-4 pt-0.5">
                                <Building2 className="size-3 text-muted-foreground/70" />
                                <span>{tier.company}</span>
                              </div>
                            </div>

                            <div className="sm:border-l sm:border-border/50 sm:pl-3 flex flex-col justify-center">
                              <span className="text-[10px] text-muted-foreground">
                                {isTierApproved ? "Approved Salary:" : "Proposed Salary (Pending):"}
                              </span>
                              <div className="font-mono font-bold text-sm text-foreground">
                                <span className={isTierApproved ? "text-emerald-600" : "text-amber-600"}>
                                  ৳{tier.approvedSalary.toLocaleString()}
                                </span>{" "}
                                <span className="text-[10px] font-normal text-muted-foreground">/ mo</span>
                              </div>
                              {tier.actionDate && (
                                <div className="text-[10px] text-muted-foreground font-mono pt-0.5">
                                  {tier.actionDate}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Candidate Selection Baseline */}
                <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">Initial Nomination Baseline</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {candidate.selectedAt || "Entry Phase"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Previous: ৳{candidate.previousSalary.toLocaleString()} · Proposed:{" "}
                    <b className="text-emerald-600 font-mono">
                      ৳
                      {(candidate.initialAgreedSalary || candidate.agreedSalary).toLocaleString()}
                    </b>
                  </div>
                </div>

                {/* Subsequent Revisions */}
                {revisions.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <h5 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Modifications & Delta Log
                    </h5>
                    {revisions.map((rev, idx) => (
                      <div
                        key={rev.id || idx}
                        className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-amber-700 dark:text-amber-300">
                            Revision #{idx + 1}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {rev.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-muted-foreground">
                            ৳{rev.previousSalary.toLocaleString()}
                          </span>
                          <ArrowRight className="size-3 text-muted-foreground" />
                          <span className="font-bold text-emerald-600">
                            ৳{rev.newSalary.toLocaleString()}
                          </span>
                          <span
                            className={`text-[10px] font-semibold ${
                              rev.delta > 0 ? "text-amber-600" : "text-emerald-600"
                            }`}
                          >
                            ({rev.delta > 0 ? "+" : ""}৳{rev.delta.toLocaleString()})
                          </span>
                        </div>
                        {rev.reason && (
                          <p className="text-[11px] text-muted-foreground italic bg-background/50 p-2 rounded-lg border border-border/40">
                            "{rev.reason}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setHistoryModal(null)}
                  className="h-8 px-4 rounded-lg bg-primary hover:opacity-90 text-primary-foreground text-xs font-medium cursor-pointer"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── MODAL 3: APPROVAL DOCKET PRINT PREVIEW ───────────────────────── */}
      {docketModalJob && (() => {
        const job = docketModalJob;
        const selectedCands = job.candidates.filter(
          (c) => c.selected || c.status === "Approved"
        );
        const totalPayroll = selectedCands.reduce(
          (sum, c) => sum + (c.agreedSalary || 0),
          0
        );

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto print:p-0">
            <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:border-none print:shadow-none print:rounded-none">
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 print:hidden">
                <div className="flex items-center gap-2">
                  <Printer className="size-4.5 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900">
                    Candidate Selection Approval Docket Preview
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="h-8 px-3 rounded-lg bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs hover:bg-emerald-700 cursor-pointer"
                  >
                    <Printer className="size-3.5" />
                    <span>Print</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocketModalJob(null)}
                    className="size-8 rounded-lg text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                  >
                    <XCircle className="size-4.5" />
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-800">
                {/* Header */}
                <div className="text-center border-b border-slate-300 pb-4">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
                    CRIPTON GROUP LTD
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    Human Resources & Talent Acquisition Directorate
                  </p>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-800 mt-2">
                    Executive Candidate Selection & Compensation Authorization Docket
                  </h3>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 border border-slate-200 p-3.5 rounded-lg bg-slate-50">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Position Title
                    </span>
                    <div className="font-bold text-slate-900">{job.title}</div>
                    <div className="text-[11px] text-slate-600">
                      Job Code: {job.id} · {job.department}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Approval Authorization
                    </span>
                    <div className="font-bold text-emerald-800">OFFICIALLY AUTHORIZED</div>
                    <div className="text-[11px] text-slate-600">
                      Date: {job.closedAt || new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Candidate Table */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-2">
                    Approved Candidates & Finalized Compensation
                  </h4>
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead className="bg-slate-100 text-[11px]">
                      <tr>
                        <th className="border border-slate-300 px-3 py-2 text-left">Candidate Name</th>
                        <th className="border border-slate-300 px-3 py-2 text-left">Temp ID</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">Previous Salary</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">
                          Approved Salary
                        </th>
                        <th className="border border-slate-300 px-3 py-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCands.map((c) => (
                        <tr key={c.id}>
                          <td className="border border-slate-300 px-3 py-2 font-semibold">
                            {c.name}
                          </td>
                          <td className="border border-slate-300 px-3 py-2 font-mono text-slate-600">
                            {c.id}
                          </td>
                          <td className="border border-slate-300 px-3 py-2 text-right font-mono text-slate-600">
                            ৳{c.previousSalary.toLocaleString()}
                          </td>
                          <td className="border border-slate-300 px-3 py-2 text-right font-mono font-bold text-slate-900">
                            ৳{c.agreedSalary.toLocaleString()}
                          </td>
                          <td className="border border-slate-300 px-3 py-2 text-center font-semibold text-emerald-700">
                            Approved
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={3} className="border border-slate-300 px-3 py-2 text-right">
                          Total Approved Payroll:
                        </td>
                        <td className="border border-slate-300 px-3 py-2 text-right font-mono text-emerald-800">
                          ৳{totalPayroll.toLocaleString()}
                        </td>
                        <td className="border border-slate-300 px-3 py-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Sign-off */}
                <div className="grid grid-cols-2 gap-8 pt-12 text-center">
                  <div className="border-t border-slate-400 pt-2">
                    <div className="font-bold text-slate-900">{job.assignedPerson}</div>
                    <div className="text-[11px] text-slate-600">
                      Hiring Manager / Department Lead
                    </div>
                  </div>
                  <div className="border-t border-slate-400 pt-2">
                    <div className="font-bold text-slate-900">
                      {job.closedBy || "Executive Management"}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Head of HR / Authorized Signatory
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
