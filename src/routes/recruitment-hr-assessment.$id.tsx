import { useState, useEffect } from "react";
import { createFileRoute, Link, useRouter, useParams } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Sparkles, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/recruitment-hr-assessment/$id")({
  head: () => ({
    meta: [
      { title: "HR Assessment Form — CRIPTON HRIS" },
      { name: "description", content: "HR Assessment evaluation." },
    ],
  }),
  component: HRAssessmentPage,
});

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
          if (found.ieEvaluation) {
            setIeData(found.ieEvaluation);
            setHrDesignation(found.ieEvaluation.ieDesignation || "Operator");
            setProposedSalary(found.ieEvaluation.maxPossibleSalary || "0.00");
          }
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
    // Save to localStorage as HR Approved and trigger Personnel Form creation mockup
    const saved = localStorage.getItem("recruitment_candidates");
    if (saved) {
      let parsed = JSON.parse(saved);
      parsed = parsed.map((c: any) => {
        if (c.empIdTemp === id) {
          return {
            ...c,
            assessStatus: "HR Approved", // Promotes to HR Approved
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
      
      // Navigate to Personnel Form generation mock
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

  if (!candidate || !ieData) return <div className="p-10 text-center">Loading Candidate Evaluation Data...</div>;

  const isViewOnly = candidate.assessStatus === "HR Approved" || candidate.assessStatus === "HR Rejected";

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full">
          {/* Header */}
          <div className="bg-orange-50 border border-orange-200 p-2 text-center text-orange-800 font-black text-sm uppercase tracking-wider">
            Employee Skill Evaluation Form
          </div>
          
          <div className="text-center font-black text-xl">
            Menu Name: {isViewOnly ? "Assessment View" : "HR Assessment"}
          </div>

          <div className="bg-card rounded-xl border border-border/80 shadow-xs p-6 space-y-8 pointer-events-none">
            
            {/* Basic Info (Readonly) */}
            <div>
              <h2 className="text-sm font-black underline mb-4 uppercase">Basic Info</h2>
              <div className="grid grid-cols-2 gap-x-20 gap-y-4">
                <div className="flex items-center gap-4">
                  <span className="w-32 text-xs font-semibold">Employee Name:</span>
                  <span className="flex-1 text-primary font-bold text-xs pb-1 italic">{candidate.nameEng}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-xs font-semibold">Designation:</span>
                  <span className="flex-1 text-primary font-bold text-xs pb-1 italic">{candidate.appliedFor || candidate.designation || "Operator"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-xs font-semibold">Employee Temp ID:</span>
                  <span className="flex-1 text-primary font-bold text-xs pb-1 italic">{candidate.empIdTemp}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-xs font-semibold">Unit:</span>
                  <span className="flex-1 text-primary font-bold text-xs pb-1 italic">{candidate.unit || "Unit-6"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-xs font-semibold">Department:</span>
                  <span className="flex-1 text-primary font-bold text-xs pb-1 italic">{candidate.department || "RMG Operation"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-xs font-semibold">Line:</span>
                  <span className="flex-1 text-primary font-bold text-xs pb-1 italic">{candidate.line || "55"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-xs font-semibold">Section:</span>
                  <span className="flex-1 text-primary font-bold text-xs pb-1 italic">{candidate.section || "Sewing"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-32 text-xs font-semibold">DOJ:</span>
                  <span className="flex-1 text-primary font-bold text-xs pb-1 italic">{candidate.doj}</span>
                </div>
              </div>
            </div>

            {/* Skill Details (Readonly) */}
            <div>
              <h2 className="text-sm font-black underline mb-4 uppercase">Skill Details</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="pb-2">Operation Name</th>
                      <th className="pb-2">M/C</th>
                      <th className="pb-2">Meas.</th>
                      <th className="pb-2">CT1</th>
                      <th className="pb-2">CT2</th>
                      <th className="pb-2">CT3</th>
                      <th className="pb-2">CT4</th>
                      <th className="pb-2">CT5</th>
                      <th className="pb-2">Capacity (Pcs/Hr)</th>
                      <th className="pb-2">Standard (Pcs/Hr)</th>
                      <th className="pb-2">Efficiency (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ieData.skills.map((skill: any, idx: number) => (
                      <tr key={skill.id} className="border-b border-border/40">
                        <td className="py-2 px-1 text-left">{idx+1}. {skill.opName}</td>
                        <td className="py-2 px-1">{skill.mc}</td>
                        <td className="py-2 px-1">{skill.meas}</td>
                        <td className="py-2 px-1">{skill.ct1}</td>
                        <td className="py-2 px-1">{skill.ct2}</td>
                        <td className="py-2 px-1">{skill.ct3}</td>
                        <td className="py-2 px-1">{skill.ct4}</td>
                        <td className="py-2 px-1">{skill.ct5}</td>
                        <td className="py-2 px-1">{skill.capacity}</td>
                        <td className="py-2 px-1">{skill.standard}</td>
                        <td className="py-2 px-1">{skill.eff}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <div className="bg-card rounded-xl border border-border/80 shadow-xs p-6 space-y-8 mt-6">
            {/* Summaries & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Assessment Summary (Readonly) */}
              <div>
                <h3 className="text-sm font-black underline mb-4 text-center">Assessment Summary</h3>
                <div className="space-y-3 pointer-events-none">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">Total Grade Point:</span>
                    <div className="border border-border/80 px-2 py-1 text-red-500 font-bold text-sm w-28 text-center">{ieData.totalGradePoint}</div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">Grade:</span>
                    <div className="border border-border/80 px-2 py-1 text-red-500 font-bold text-sm w-28 text-center">{ieData.grade}</div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">Salary Range:</span>
                    <div className="border border-border/80 px-2 py-1 text-red-500 font-bold text-sm w-32 text-center">{ieData.salaryRange}</div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">No of M/C can handle:</span>
                    <div className="border border-border/80 px-2 py-1 text-red-500 font-bold text-sm w-32 text-center truncate">{ieData.noOfMc}</div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">Add. Amt (Multi/Special):</span>
                    <div className="border border-border/80 px-2 py-1 text-red-500 font-bold text-sm w-28 text-center">{ieData.additionalAmt}</div>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <span className="text-xs font-black">Max Proposed Salary:</span>
                    <div className="border-2 border-border px-2 py-1 text-red-500 font-black text-sm w-28 text-center">{ieData.maxPossibleSalary}</div>
                  </div>
                </div>
              </div>

              {/* IE Recommendation (Readonly) */}
              <div>
                <h3 className="text-sm font-black underline mb-4 text-center">IE Recommendation</h3>
                <div className="space-y-3 pointer-events-none">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">Designation:</span>
                    <div className="border border-border/80 px-2 py-1 text-red-500 font-bold text-sm w-32 text-center">{ieData.ieDesignation}</div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">Note:</span>
                    <div className="border border-border/80 px-2 py-1 text-red-500 font-bold text-sm w-full text-center truncate">{ieData.ieNote}</div>
                  </div>
                </div>
              </div>

              {/* HR Recommendation (Editable / Readonly if View) */}
              <div>
                <h3 className="text-sm font-black underline mb-4 text-center">HR Recommendation</h3>
                <div className={`space-y-3 ${isViewOnly ? 'pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">Proposed Gross Salary:</span>
                    <input 
                      type="text" 
                      value={proposedSalary}
                      onChange={e=>setProposedSalary(e.target.value)}
                      className="border border-border/80 px-2 py-1 text-red-500 font-bold text-sm w-32 text-center outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">Designation:</span>
                    <input 
                      type="text" 
                      value={hrDesignation}
                      onChange={e=>setHrDesignation(e.target.value)}
                      className="border border-border/80 px-2 py-1 text-red-500 font-bold text-sm w-32 text-center outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">Note:</span>
                    <input 
                      type="text" 
                      value={hrNote}
                      onChange={e=>setHrNote(e.target.value)}
                      placeholder="Manual/Text Type Data"
                      className="border border-border/80 px-2 py-1 text-red-500 font-bold text-sm w-full text-center outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            {!isViewOnly && (
              <div className="flex items-center justify-center gap-4 pt-10">
                <Link to="/recruitment-assessment-list" className="h-8 px-6 rounded bg-gray-100 text-red-500 font-bold text-xs border border-gray-300 hover:bg-gray-200 transition">
                  Close
                </Link>
                <button onClick={handleSubmit} className="h-8 px-6 rounded bg-green-100 text-green-700 font-bold text-xs border border-green-300 hover:bg-green-200 transition">
                  Submit
                </button>
                <button onClick={handleReject} className="h-8 px-6 rounded bg-red-100 text-red-700 font-bold text-xs border border-red-300 hover:bg-red-200 transition">
                  Reject
                </button>
              </div>
            )}

            {isViewOnly && (
              <div className="pt-20 pb-10 flex justify-between items-end border-t border-border/40 mt-10 text-[10px] font-bold text-muted-foreground uppercase">
                <div className="w-32 border-t border-muted-foreground text-center pt-2">Operator</div>
                <div className="w-32 border-t border-muted-foreground text-center pt-2">Assessor's sign (IE)</div>
                <div className="w-32 border-t border-muted-foreground text-center pt-2">PM / Sr. PM</div>
                <div className="w-32 border-t border-muted-foreground text-center pt-2">HR Executive</div>
                <div className="w-32 border-t border-muted-foreground text-center pt-2">Unit Leader, (IE)</div>
                <div className="w-32 border-t border-muted-foreground text-center pt-2">Sr.Manager(IE)</div>
                <div className="w-32 border-t border-muted-foreground text-center pt-2">Head of Production</div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
