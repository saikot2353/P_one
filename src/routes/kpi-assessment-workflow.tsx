import { useState, useMemo, useRef, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ClipboardCheck, ChevronRight, BarChart3, Lock, Unlock, CheckCircle2, ChevronDown, Search, Check,
  Building, User, TrendingUp, Printer, RefreshCw, Star, AlertCircle, X
} from "lucide-react";

export const Route = createFileRoute("/kpi-assessment-workflow")({
  head: () => ({
    meta: [
      { title: "KPI Assessment Workflow — CRIPTON" },
      { name: "description", content: "Appraisal approval workflow across HOD, HR, Plant Head, Managing Director, and final evaluation." },
    ],
  }),
  component: KpiAssessmentWorkflowPage,
});

// Custom Searchable Dropdown
interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function SearchableSelect({ options, value, onChange, placeholder = "Select option...", className = "" }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  const filteredOptions = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    o.value.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className="w-full h-10 px-3.5 rounded-xl bg-card border border-border/80 text-xs font-semibold flex items-center justify-between text-left focus:border-[#1e88e5] hover:bg-muted/30 transition duration-150 cursor-pointer"
      >
        <span className="truncate text-foreground font-bold">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-card border border-border rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-150">
          <div className="p-2 border-b border-border/30 relative">
            <Search className="size-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full h-8 pl-8 pr-3 bg-muted/60 focus:bg-card border border-border/40 focus:border-[#1e88e5] focus:ring-1 focus:ring-[#1e88e5]/20 rounded-lg outline-none text-xs font-bold transition font-sans"
            />
          </div>

          <div className="max-h-48 overflow-y-auto p-1 divide-y divide-border/10 font-sans text-xs">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left rounded-lg transition duration-100 flex items-center justify-between font-bold ${isSelected
                        ? "bg-[#1e88e5]/10 text-[#1e88e5]"
                        : "text-foreground/80 hover:bg-muted/80 hover:text-foreground"
                      }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check className="size-3 text-[#1e88e5]" />}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2.5 text-center text-muted-foreground text-[11px] font-medium">
                No matching options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Appraisal targets
interface AppraisalEmployee {
  id: string;
  name: string;
  department: string;
  jobTitle: string;
  grossSalary: number;
}

const appraisalEmployees: Record<string, AppraisalEmployee> = {
  "2024091802": { id: "2024091802", name: "Md. Anik Islam", department: "Business Innovation", jobTitle: "Business Analyst", grossSalary: 79000.00 },
  "2023043910": { id: "2023043910", name: "Tahmid Afsar Shapno", department: "Business Innovation", jobTitle: "Asst. Manager", grossSalary: 152000.00 },
  "2025110293": { id: "2025110293", name: "Riazul Islam", department: "Operations & HR", jobTitle: "HR Officer", grossSalary: 45000.00 }
};

interface TaskItem {
  id: number;
  name: string;
  detail: string;
}

const taskItems: TaskItem[] = [
  { id: 1, name: "Decision Making/ Problem Solving", detail: "Measures effectiveness in understanding problems and making timely practical decisions, best suited for the business." },
  { id: 2, name: "Independent Action", detail: "Takes initiative, solves problems independently, makes decisions without needing step-by-step guidance, seeks solutions instead of waiting for instructions, accepts responsibility for actions taken." },
  { id: 3, name: "Leadership", detail: "Influence, guide, and support others toward achieving goals — whether in a formal leadership role or through informal influence." },
  { id: 4, name: "Dependability", detail: "Delivers quality work on time, can be trusted to follow instructions accurately, requires minimal supervision, is consistent and reliable in their duties, is accountable for their actions and mistakes." },
  { id: 5, name: "Teamwork", detail: "The ability to inspire subordinates & others with collaboration effort to achieve a common goal / complete a task." },
  { id: 6, name: "Verbal & Written Communication", detail: "The ability to communicate effectively & efficiently within the organization & out of organization." },
  { id: 7, name: "Knowledge of law & SOP", detail: "KPI evaluates how well an employee understands and applies relevant legal regulations, industry standards, and internal procedures in their daily work." },
  { id: 8, name: "Loyalty of company", detail: "KPI measures how committed an employee is to the organization's mission, values, and long-term success." }
];

function KpiAssessmentWorkflowPage() {
  const [selectedEmpId, setSelectedEmpId] = useState("2024091802");
  const activeEmp = appraisalEmployees[selectedEmpId] || appraisalEmployees["2024091802"];

  // Step state: 1: HOD, 2: HR, 3: Plant Head, 4: MD, 5: Final Evaluation
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Increment History dialog
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Dynamic values
  const [taskMarks, setTaskMarks] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0
  });
  const [taskNotes, setTaskNotes] = useState<Record<number, string>>({
    1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: ""
  });

  // HOD Form State
  const [hodManualMarks, setHodManualMarks] = useState("0");
  const [hodRecommendation, setHodRecommendation] = useState("");
  const [improvementPlan, setImprovementPlan] = useState("");
  const [specialComments, setSpecialComments] = useState("");
  const [jdDetails, setJdDetails] = useState("");

  // HR Form State
  const [hrdStrength, setHrdStrength] = useState("");
  const [hrdImprovementPlan, setHrdImprovementPlan] = useState("");
  const [hrdSpecialComments, setHrdSpecialComments] = useState("");

  // Plant Head Form State
  const [plantHeadComments, setPlantHeadComments] = useState("");
  const [plantHeadApproval, setPlantHeadApproval] = useState("Approved");

  // Managing Director Form State
  const [mdComments, setMdComments] = useState("");
  const [mdApproval, setMdApproval] = useState("Approved");

  // Final Evaluation State
  const [incAmount, setIncAmount] = useState("");
  const [givePromotion, setGivePromotion] = useState("No");
  const [effectYear, setEffectYear] = useState("2026");
  const [effectMonth, setEffectMonth] = useState("May");
  const [finalNotes, setFinalNotes] = useState("");

  // Calculate new gross salary dynamically
  const newGrossSalary = useMemo(() => {
    const incVal = parseFloat(incAmount) || 0;
    return activeEmp.grossSalary + incVal;
  }, [activeEmp.grossSalary, incAmount]);

  // Complete step helpers
  const handleCompleteHod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hodRecommendation.trim() || !improvementPlan.trim()) {
      alert("Please enter HOD Recommendations and Improvement Plan!");
      return;
    }
    setCompletedSteps(prev => [...prev, 1]);
    setActiveStep(2);
  };

  const handleCompleteHr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hrdStrength.trim() || !hrdImprovementPlan.trim()) {
      alert("Please enter HRD Strengths and Improvement Plan!");
      return;
    }
    setCompletedSteps(prev => [...prev, 2]);
    setActiveStep(3);
  };

  const handleCompletePlantHead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantHeadComments.trim()) {
      alert("Please enter Plant Head Comments!");
      return;
    }
    setCompletedSteps(prev => [...prev, 3]);
    setActiveStep(4);
  };

  const handleCompleteMd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mdComments.trim()) {
      alert("Please enter Managing Director Comments!");
      return;
    }
    setCompletedSteps(prev => [...prev, 4]);
    setActiveStep(5);
  };

  const handleCompleteFinal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incAmount.trim() || isNaN(parseFloat(incAmount))) {
      alert("Please specify a valid Increment Amount!");
      return;
    }
    setCompletedSteps(prev => [...prev, 5]);
    alert("KPI Appraisal Assessment Workflow Completed Successfully!");
  };

  const handleResetWorkflow = () => {
    setActiveStep(1);
    setCompletedSteps([]);
    setTaskMarks({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 });
    setTaskNotes({ 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "" });
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

  const employeeOptions = useMemo(() => {
    return Object.keys(appraisalEmployees).map(id => ({
      value: id,
      label: `${id} - ${appraisalEmployees[id].name} (${appraisalEmployees[id].jobTitle})`
    }));
  }, []);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">

          {/* Title Header Section */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">KPI</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Assessment Workflow</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <ClipboardCheck className="size-5.5 text-primary animate-pulse" />
                <span>KPI Assessment Workflow</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleResetWorkflow}
                className="h-9 px-4 border border-[#1e88e5] text-[#1e88e5] hover:bg-[#1e88e5]/5 font-bold text-xs rounded-lg flex items-center gap-2 transition uppercase"
                title="Reset appraisal stages to try step lock process again"
              >
                <RefreshCw className="size-3.5" />
                <span>Reset Workflow</span>
              </button>

              <button
                onClick={() => setIsHistoryOpen(true)}
                className="h-9 px-5 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider"
              >
                <TrendingUp className="size-4" />
                <span>View Increment History</span>
              </button>
            </div>
          </div>

          {/* Search Selection Card for Appraisal Employee */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-5 items-center print:hidden">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Appraisal Target Employee</span>
              <SearchableSelect
                options={employeeOptions}
                value={selectedEmpId}
                onChange={setSelectedEmpId}
              />
            </div>

            <div className="flex items-center gap-3 bg-muted/30 px-4 py-2.5 rounded-xl border border-border/40">
              <User className="size-5 text-primary" />
              <div>
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Role & Dept</span>
                <span className="text-xs font-black text-foreground">{activeEmp.jobTitle} — {activeEmp.department}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-muted/30 px-4 py-2.5 rounded-xl border border-border/40">
              <Building className="size-5 text-emerald-500" />
              <div>
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Current Gross Salary</span>
                <span className="text-xs font-black text-foreground">{activeEmp.grossSalary.toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT</span>
              </div>
            </div>
          </div>

          {/* Workflow Stepper Status Banner */}
          <div className="bg-card rounded-lg border border-border/80 p-6 shadow-xs print:hidden space-y-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                <Star className="size-4 animate-spin text-[#1e88e5]" />
                <span>Approval Sequence Progress</span>
              </span>
              <span className="text-xs font-bold text-muted-foreground/80">
                Current Active: <span className="text-[#1e88e5] font-black">Step {activeStep} — {activeStep === 1 ? "HOD Assessment" : activeStep === 2 ? "HR Review" : activeStep === 3 ? "Plant Head" : activeStep === 4 ? "Managing Director" : "Final Appraisal"}</span>
              </span>
            </div>

            {/* Stepper Layout */}
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
                    {/* Step Marker Badge */}
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

          {/* Stepper dynamic workflow form contents */}
          <div className="space-y-6">

            {/* STAGE 1: HOD Appraisal (Editable at Step 1, locked otherwise) */}
            <div className={`bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep !== 1 ? "opacity-75" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`}>
              {/* Locked overlay banner for stage 1 */}
              {activeStep > 1 && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[9px] px-3.5 py-1 uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5 z-10">
                  <CheckCircle2 className="size-3" />
                  <span>HOD Stage Completed</span>
                </div>
              )}

              <div className="p-5 border-b border-border/30 bg-muted/20 flex items-center justify-between">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                  <span className="size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs">1</span>
                  <span>Assessment Details For - {activeEmp.name}</span>
                </h2>
                {activeStep > 1 && <span className="text-[10.5px] font-bold text-emerald-500">Inputs Locked & Archived</span>}
              </div>

              <div className="p-5 space-y-5">
                {/* Score spreadsheet matching image 3 */}
                <div className="overflow-x-auto border border-border/50 rounded-xl">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 text-xs">
                        <th className="px-4 py-3 font-extrabold text-center w-12 border-r border-border/30">#</th>
                        <th className="px-4 py-3 font-extrabold w-[45%] border-r border-border/30">Task Name</th>
                        <th className="px-4 py-3 font-extrabold text-center w-28 border-r border-border/30">HOD Marks</th>
                        <th className="px-4 py-3 font-extrabold">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 text-xs font-semibold">
                      {taskItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/50">
                          <td className="px-4 py-3 text-center text-muted-foreground/60 border-r border-border/20 font-bold">{idx + 1}</td>
                          <td className="px-4 py-3 border-r border-border/20">
                            <span className="text-foreground font-bold block">{item.name}</span>
                            <span className="text-[10px] text-muted-foreground leading-relaxed block mt-0.5">{item.detail}</span>
                          </td>
                          <td className="px-4 py-3 text-center border-r border-border/20">
                            <input
                              type="number"
                              min={0}
                              max={20}
                              disabled={activeStep !== 1}
                              value={taskMarks[item.id]}
                              onChange={(e) => {
                                const val = Math.min(20, Math.max(0, parseInt(e.target.value) || 0));
                                setTaskMarks(prev => ({ ...prev, [item.id]: val }));
                              }}
                              className="w-18 h-7 text-center rounded border border-border/40 focus:border-[#1e88e5] outline-none text-xs font-bold font-mono bg-card disabled:bg-muted/50 disabled:cursor-not-allowed"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              placeholder="Remarks..."
                              disabled={activeStep !== 1}
                              value={taskNotes[item.id]}
                              onChange={(e) => setTaskNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                              className="w-full h-7 px-2.5 rounded border border-border/40 focus:border-[#1e88e5] outline-none text-xs font-bold bg-card disabled:bg-muted/50 disabled:cursor-not-allowed"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Score Summary & HOD Recommendation details matching Image 4 */}
                <form onSubmit={handleCompleteHod} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase">HOD Manual Marks( Out of 20 ) *</label>
                      <input
                        type="number"
                        required
                        disabled={activeStep !== 1}
                        value={hodManualMarks}
                        onChange={(e) => setHodManualMarks(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="border-t border-border/30 pt-4 space-y-4">
                    <span className="text-[11px] font-black text-[#1e88e5] uppercase tracking-wider block">Recommendation By Reporting HOD</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">HOD Recommendation *</label>
                        <textarea
                          required
                          disabled={activeStep !== 1}
                          value={hodRecommendation}
                          onChange={(e) => setHodRecommendation(e.target.value)}
                          placeholder="Provide performance feedback or justification for promotions/increments..."
                          className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Improvement Plan *</label>
                        <textarea
                          required
                          disabled={activeStep !== 1}
                          value={improvementPlan}
                          onChange={(e) => setImprovementPlan(e.target.value)}
                          placeholder="Action steps or professional training program recommended..."
                          className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Special Comments</label>
                        <textarea
                          disabled={activeStep !== 1}
                          value={specialComments}
                          onChange={(e) => setSpecialComments(e.target.value)}
                          placeholder="Additional context or exceptional work mentions..."
                          className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Existing JD & New JD</label>
                        <textarea
                          disabled={activeStep !== 1}
                          value={jdDetails}
                          onChange={(e) => setJdDetails(e.target.value)}
                          placeholder="Notes on current Job Description responsibilities and recommended extensions..."
                          className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {activeStep === 1 && (
                    <div className="flex justify-end pt-3 border-t border-border/30">
                      <button
                        type="submit"
                        className="h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase tracking-wider"
                      >
                        Submit HOD Assessment & Unlock HR Stage
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* STAGE 2: HR Review (Locked unless activeStep === 2) */}
            <div className={`bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep !== 2 ? "opacity-70 bg-slate-50/10" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`}>
              {/* Lock Shield */}
              {activeStep < 2 && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-2 select-none">
                  <Lock className="size-6 text-muted-foreground/60" />
                  <span className="text-xs font-black text-muted-foreground/80 tracking-wide uppercase">HR Stage Locked</span>
                  <span className="text-[10px] text-muted-foreground/65">Pending HOD Appraisal completion</span>
                </div>
              )}
              {activeStep > 2 && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[9px] px-3.5 py-1 uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5 z-10">
                  <CheckCircle2 className="size-3" />
                  <span>HR Review Completed</span>
                </div>
              )}

              <div className="p-5 border-b border-border/30 bg-muted/20">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                  <span className="size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs">2</span>
                  <span>Recommendation By HRD</span>
                </h2>
              </div>

              <div className="p-5">
                <form onSubmit={handleCompleteHr} className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">HRD Strength *</label>
                      <textarea
                        required
                        disabled={activeStep !== 2}
                        value={hrdStrength}
                        onChange={(e) => setHrdStrength(e.target.value)}
                        placeholder="Detail the employee's core organizational strengths..."
                        className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">HRD Improvement Plan *</label>
                      <textarea
                        required
                        disabled={activeStep !== 2}
                        value={hrdImprovementPlan}
                        onChange={(e) => setHrdImprovementPlan(e.target.value)}
                        placeholder="Detail the target plan for skill enhancement..."
                        className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">HRD Special Comments</label>
                      <textarea
                        disabled={activeStep !== 2}
                        value={hrdSpecialComments}
                        onChange={(e) => setHrdSpecialComments(e.target.value)}
                        placeholder="Include other background remarks or records audit clearance notes..."
                        className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {activeStep === 2 && (
                    <div className="flex justify-end pt-3 border-t border-border/30">
                      <button
                        type="submit"
                        className="h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase tracking-wider"
                      >
                        Submit HR Review & Unlock Plant Head Stage
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* STAGE 3: Plant Head Review (Locked unless activeStep === 3) */}
            <div className={`bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep !== 3 ? "opacity-70 bg-slate-50/10" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`}>
              {/* Lock Shield */}
              {activeStep < 3 && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-2 select-none">
                  <Lock className="size-6 text-muted-foreground/60" />
                  <span className="text-xs font-black text-muted-foreground/80 tracking-wide uppercase">Plant Head Stage Locked</span>
                  <span className="text-[10px] text-muted-foreground/65">Pending HR Review completion</span>
                </div>
              )}
              {activeStep > 3 && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[9px] px-3.5 py-1 uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5 z-10">
                  <CheckCircle2 className="size-3" />
                  <span>Plant Head Stage Completed</span>
                </div>
              )}

              <div className="p-5 border-b border-border/30 bg-muted/20">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                  <span className="size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs">3</span>
                  <span>Endorsement By Plant Head / Executive Director</span>
                </h2>
              </div>

              <div className="p-5">
                <form onSubmit={handleCompletePlantHead} className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Plant Head Decision</label>
                      <select
                        disabled={activeStep !== 3}
                        value={plantHeadApproval}
                        onChange={(e) => setPlantHeadApproval(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-muted/20 border border-border/40 text-xs outline-none"
                      >
                        <option value="Approved">Approved for increment recommendation</option>
                        <option value="Approved with Adjustment">Approved with adjustment suggestions</option>
                        <option value="Hold">Hold for review</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Plant Head Comments & Remarks *</label>
                      <textarea
                        required
                        disabled={activeStep !== 3}
                        value={plantHeadComments}
                        onChange={(e) => setPlantHeadComments(e.target.value)}
                        placeholder="Enter Plant Head specific recommendation remarks..."
                        className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {activeStep === 3 && (
                    <div className="flex justify-end pt-3 border-t border-border/30">
                      <button
                        type="submit"
                        className="h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase tracking-wider"
                      >
                        Submit Plant Head Approval & Unlock Managing Director Stage
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* STAGE 4: Managing Director Review (Locked unless activeStep === 4) */}
            <div className={`bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep !== 4 ? "opacity-70 bg-slate-50/10" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`}>
              {/* Lock Shield */}
              {activeStep < 4 && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-2 select-none">
                  <Lock className="size-6 text-muted-foreground/60" />
                  <span className="text-xs font-black text-muted-foreground/80 tracking-wide uppercase">MD Stage Locked</span>
                  <span className="text-[10px] text-muted-foreground/65">Pending Plant Head approval completion</span>
                </div>
              )}
              {activeStep > 4 && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[9px] px-3.5 py-1 uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5 z-10">
                  <CheckCircle2 className="size-3" />
                  <span>MD Stage Completed</span>
                </div>
              )}

              <div className="p-5 border-b border-border/30 bg-muted/20">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                  <span className="size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs">4</span>
                  <span>Evaluation & Signature By Managing Director</span>
                </h2>
              </div>

              <div className="p-5">
                <form onSubmit={handleCompleteMd} className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Managing Director Decision</label>
                      <select
                        disabled={activeStep !== 4}
                        value={mdApproval}
                        onChange={(e) => setMdApproval(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-muted/20 border border-border/40 text-xs outline-none"
                      >
                        <option value="Approved">Approved for final assessment</option>
                        <option value="Adjusted">Adjusted salary increment band</option>
                        <option value="Declined">Declined appraisal recommendation</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">MD Directive Comments *</label>
                      <textarea
                        required
                        disabled={activeStep !== 4}
                        value={mdComments}
                        onChange={(e) => setMdComments(e.target.value)}
                        placeholder="Enter the Managing Director final executive instructions..."
                        className="w-full h-20 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {activeStep === 4 && (
                    <div className="flex justify-end pt-3 border-t border-border/30">
                      <button
                        type="submit"
                        className="h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase tracking-wider"
                      >
                        Submit MD Directive & Unlock Final Evaluation
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* STAGE 5: Final Evaluation & Appraisal Completion (Locked unless activeStep === 5) */}
            <div className={`bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300 ${activeStep !== 5 ? "opacity-70 bg-slate-50/10" : "border-[#1e88e5]/40 shadow-[#1e88e5]/5"}`}>
              {/* Lock Shield */}
              {activeStep < 5 && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-2 select-none">
                  <Lock className="size-6 text-muted-foreground/60" />
                  <span className="text-xs font-black text-muted-foreground/80 tracking-wide uppercase">Final Evaluation Stage Locked</span>
                  <span className="text-[10px] text-muted-foreground/65">Pending Managing Director final endorsement</span>
                </div>
              )}
              {completedSteps.includes(5) && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[9px] px-3.5 py-1 uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5 z-10 animate-pulse">
                  <CheckCircle2 className="size-3" />
                  <span>Workflow Finalized & Archived</span>
                </div>
              )}

              <div className="p-5 border-b border-border/30 bg-muted/20">
                <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                  <span className="size-6 rounded bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-bold text-xs">5</span>
                  <span>Evaluation & Increment Execution</span>
                </h2>
              </div>

              <div className="p-5">
                <form onSubmit={handleCompleteFinal} className="space-y-5 text-xs font-semibold">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-end">

                    {/* Existing Gross */}
                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Existing Gross</label>
                      <div className="w-full h-9 px-3 bg-muted/50 rounded-lg border border-border/40 flex items-center text-xs font-bold font-mono text-foreground/80">
                        {activeEmp.grossSalary.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Increment Amount Input */}
                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Inc Amount *</label>
                      <input
                        type="number"
                        required
                        disabled={completedSteps.includes(5)}
                        value={incAmount}
                        onChange={(e) => setIncAmount(e.target.value)}
                        placeholder="e.g. 8500"
                        className="w-full h-9 px-3 rounded-lg bg-card border border-border/40 focus:border-[#1e88e5] text-xs font-bold font-mono outline-none disabled:bg-muted/50"
                      />
                    </div>

                    {/* New Gross Salary (Calculated Dynamically!) */}
                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase">New Gross Salary</label>
                      <div className="w-full h-9 px-3 bg-[#1e88e5]/5 rounded-lg border border-[#1e88e5]/30 flex items-center text-xs font-black font-mono text-[#1e88e5]">
                        {newGrossSalary.toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT
                      </div>
                    </div>

                    {/* Give Promotion Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Give Promotion *</label>
                      <select
                        disabled={completedSteps.includes(5)}
                        value={givePromotion}
                        onChange={(e) => setGivePromotion(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-card border border-border/40 text-xs font-bold outline-none"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes (Promote Job Title)</option>
                      </select>
                    </div>

                    {/* Effect Year */}
                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Effect Year *</label>
                      <select
                        disabled={completedSteps.includes(5)}
                        value={effectYear}
                        onChange={(e) => setEffectYear(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-card border border-border/40 text-xs font-bold outline-none"
                      >
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2025">2025</option>
                      </select>
                    </div>

                    {/* Effect Month */}
                    <div className="space-y-1.5">
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase">Effect Month *</label>
                      <select
                        disabled={completedSteps.includes(5)}
                        value={effectMonth}
                        onChange={(e) => setEffectMonth(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-card border border-border/40 text-xs font-bold outline-none"
                      >
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="January">January</option>
                      </select>
                    </div>

                  </div>

                  {/* Notes Remarks */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Final Appraisal Execution Notes</label>
                    <textarea
                      disabled={completedSteps.includes(5)}
                      value={finalNotes}
                      onChange={(e) => setFinalNotes(e.target.value)}
                      placeholder="Add final appraisal summary comments..."
                      className="w-full h-16 p-3 rounded-lg bg-muted/20 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5] disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Red Save Action Button matching Image 5 exactly! */}
                  {!completedSteps.includes(5) && (
                    <div className="flex justify-start pt-3 border-t border-border/30">
                      <button
                        type="submit"
                        className="h-10 px-10 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg shadow-md transition uppercase tracking-wider"
                      >
                        SAVE appraisal & execute
                      </button>
                    </div>
                  )}

                  {completedSteps.includes(5) && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3.5 text-emerald-600">
                      <CheckCircle2 className="size-5 animate-bounce shrink-0" />
                      <div>
                        <span className="font-extrabold text-xs block">Appraisal Workflow Finalized Successfully!</span>
                        <span className="text-[10.5px] font-bold block opacity-90 mt-0.5">
                          New gross salary of {newGrossSalary.toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT has been committed. Increment effective from {effectMonth}, {effectYear}.
                        </span>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Increment History Dialog Pop-up */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs">
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5">
              <TrendingUp className="size-5 text-[#1e88e5]" />
              <span>Increment History — {activeEmp.name}</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-muted/40 p-3 rounded-xl border border-border/40">
                <div>
                  <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Base Joining Gross</span>
                  <span className="text-sm font-black text-foreground">60,000.00 BDT</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Joining Date</span>
                  <span className="text-xs font-bold text-muted-foreground">01/06/2023</span>
                </div>
              </div>

              {/* History Timeline */}
              <div className="relative border-l border-border pl-6 space-y-5 ml-3 font-semibold">

                {/* Year 2025 */}
                <div className="relative">
                  <div className="absolute -left-8.5 top-0.5 size-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 grid place-items-center">
                    <Check className="size-3" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-foreground text-xs">Annual Performance appraisal 2025</span>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded">+10,000 BDT</span>
                    </div>
                    <span className="text-[10.5px] text-muted-foreground block mt-1">
                      Increment from 69,000 BDT to 79,000 BDT. Endorsed by HR and MD. Effective May 2025.
                    </span>
                  </div>
                </div>

                {/* Year 2024 */}
                <div className="relative">
                  <div className="absolute -left-8.5 top-0.5 size-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 grid place-items-center">
                    <Check className="size-3" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-foreground text-xs">Annual Performance appraisal 2024</span>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded">+9,000 BDT</span>
                    </div>
                    <span className="text-[10.5px] text-muted-foreground block mt-1">
                      Increment from 60,000 BDT to 69,000 BDT. Effective May 2024.
                    </span>
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-3 border-t border-border/30 mt-5">
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="h-9 px-6 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
