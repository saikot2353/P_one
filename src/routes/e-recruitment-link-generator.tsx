import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ChevronRight, Link2, Copy, CheckCircle2, RotateCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/e-recruitment-link-generator")({
  component: ERecruitmentLinkGenerator,
});

function ERecruitmentLinkGenerator() {
  const [candidateName, setCandidateName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [reportingBoss, setReportingBoss] = useState("");
  
  const [copied, setCopied] = useState(false);

  const [generatedLink, setGeneratedLink] = useState("");

  const handleGenerateLink = () => {
    if (!candidateName || !department || !designation || !reportingBoss) {
      toast.error("Please fill all fields to generate a link.");
      return;
    }

    const saved = localStorage.getItem("recruitment_candidates");
    const parsed = saved ? JSON.parse(saved) : [];
    
    // Create new temp ID
    const newId = `PAL${String(parsed.length + 1).padStart(6, "0")}`;
    
    const newCandidate = {
      empIdTemp: newId,
      nameEng: candidateName,
      department: department,
      designation: designation,
      reportingBoss: reportingBoss,
      formStatus: "Not Filled",
      assessStatus: "Pending",
      doj: "",
    };

    parsed.push(newCandidate);
    localStorage.setItem("recruitment_candidates", JSON.stringify(parsed));

    const baseUrl = window.location.origin;
    const link = `${baseUrl}/e-recruitment-form?tempId=${newId}`;
    setGeneratedLink(link);
    toast.success("Link generated and candidate added to queue.");
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        
        <div className="flex items-center gap-2 px-6 py-3 border-b border-border/50 bg-muted/20">
          <Link to="/" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider hover:text-primary transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="size-3 text-muted-foreground" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            e-Recruitment
          </span>
          <ChevronRight className="size-3 text-muted-foreground" />
          <span className="text-[10px] font-black text-primary uppercase tracking-wider">
            Link Generator
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <Link2 className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold">Generate e-Recruitment Link</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Create a pre-filled link for the candidate</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Candidate Name</label>
                  <input 
                    type="text" 
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Department</label>
                    <input 
                      type="text" 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="e.g. RMG Operation"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Designation</label>
                    <input 
                      type="text" 
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="e.g. Operator"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reporting Boss</label>
                  <input 
                    type="text" 
                    value={reportingBoss}
                    onChange={(e) => setReportingBoss(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="e.g. Jane Smith"
                  />
                </div>
                
                <div className="pt-4 border-t border-border/50 space-y-4">
                  <button 
                    onClick={handleGenerateLink}
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCw className="size-4" />
                    Generate Link
                  </button>

                  {generatedLink && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Generated Link</label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            readOnly
                            value={generatedLink}
                            className="w-full h-11 px-4 rounded-xl border border-primary/20 bg-primary/5 text-primary text-sm font-medium focus:outline-none pr-12"
                          />
                          <button 
                            onClick={handleCopy}
                            className="absolute right-2 top-1.5 p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                            title="Copy Link"
                          >
                            {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
