import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { 
  Sparkles, ChevronRight, Search, Plus, Trash2, Edit3, ShieldAlert,
  Eye, CheckCircle2, XCircle, X, User, GraduationCap, Briefcase, MapPin, Heart, Mail, Phone, Calendar, Clock, Info
} from "lucide-react";
import { toast } from "sonner";
import { initializeRecruitmentMockData } from "@/lib/recruitment-mock-data";

export const Route = createFileRoute("/recruitment-basic-list")({
  head: () => ({
    meta: [
      { title: "Application Queue List — CRIPTON HRIS" },
      { name: "description", content: "Directory of registered candidate profiles temporarily enrolled." },
    ],
  }),
  component: BasicInfoListPage,
});

interface Candidate {
  empIdTemp: string;
  nameEng: string;
  nameBng?: string;
  doj: string;
  personalContact: string;
  personalEmail?: string;
  department: string;
  designation: string;
  assessStatus: string;
  dob?: string;
  religion?: string;
  maritalStatus?: string;
  nidNumber?: string;
  birthReg?: string;
  fatherNameEng?: string;
  fatherNameBng?: string;
  motherNameEng?: string;
  motherNameBng?: string;
  emergencyContact?: string;
  contactPerson?: string;
  relationship?: string;
  photo?: string | null;
  presentAddress?: string;
  permanentAddress?: string;
  academics?: any[];
  experiences?: any[];
  nominee?: {
    name?: string;
    relation?: string;
    nidReg?: string;
    contact?: string;
  };
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "IE Pending":    "bg-[#fef3c7] text-[#b45309] border-[#fde68a]", // Amber
    "IE Submitted":  "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]", // Blue
    "HR Pending":    "bg-[#faf5ff] text-[#7e22ce] border-[#e9d5ff]", // Purple
    "HR Approved":   "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]", // Green/Emerald
    "HR Rejected":   "bg-[#fdf2f2] text-[#b91c1c] border-[#fde8e8]", // Red
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${map[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {status}
    </span>
  );
}

function BasicInfoListPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Load from local storage
  const loadData = () => {
    if (typeof window !== "undefined") {
      initializeRecruitmentMockData();
      const saved = localStorage.getItem("recruitment_candidates");
      if (saved) {
        setCandidates(JSON.parse(saved));
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = (empId: string) => {
    const updated = candidates.map(c => {
      if (c.empIdTemp === empId) {
        return { ...c, assessStatus: "IE Pending" };
      }
      return c;
    });
    setCandidates(updated);
    localStorage.setItem("recruitment_candidates", JSON.stringify(updated));
    toast.success(`Candidate ${empId} has been Approved and moved to IE Assessment.`);
    setSelectedCandidate(null);
  };

  const handleReject = (empId: string) => {
    const updated = candidates.map(c => {
      if (c.empIdTemp === empId) {
        return { ...c, assessStatus: "HR Rejected" };
      }
      return c;
    });
    setCandidates(updated);
    localStorage.setItem("recruitment_candidates", JSON.stringify(updated));
    toast.error(`Candidate ${empId} has been Rejected.`);
    setSelectedCandidate(null);
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.nameEng.toLowerCase().includes(q) ||
        c.empIdTemp.toLowerCase().includes(q) ||
        c.personalContact.toLowerCase().includes(q) ||
        (c.personalEmail && c.personalEmail.toLowerCase().includes(q)) ||
        c.assessStatus.toLowerCase().includes(q)
      );
    });
  }, [candidates, searchQuery]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="bg-card rounded-2xl border border-border/85 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>e-Recruitment</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Application Queue</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="size-5.5 text-primary" />
                <span>e-Recruitment Application Queue</span>
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="bg-muted border border-border/40 rounded-lg px-3 py-1.5 text-[10px] font-bold text-muted-foreground">
                Total Queue: <strong className="text-foreground">{candidates.length}</strong>
              </span>
              <Link
                to="/recruitment-basic-entry"
                className="h-9.5 px-4 bg-primary hover:opacity-95 text-primary-foreground font-black text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Plus className="size-4" />
                <span>Apply Form</span>
              </Link>
            </div>
          </div>

          {/* Directory Data Grid */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            {/* Search and stats bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20">
              <span className="text-xs font-bold text-muted-foreground">
                Review applicant dossiers, credentials and assign approval determinations.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-64">
                <Search className="size-4 text-muted-foreground/60 shrink-0" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold text-foreground outline-none focus:border-primary/50"
                />
              </div>
            </div>

            {/* Candidate Grid */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20">
                    <th className="px-4 py-3 text-center w-14">SL</th>
                    <th className="px-4 py-3">Candidate ID</th>
                    <th className="px-4 py-3">Applicant Name</th>
                    <th className="px-4 py-3">Contact No</th>
                    <th className="px-4 py-3">Email Address</th>
                    <th className="px-4 py-3">Submission Date</th>
                    <th className="px-4 py-3 text-center">Workflow Status</th>
                    <th className="px-4 py-3 text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredCandidates.map((c, idx) => (
                    <tr key={c.empIdTemp} className="hover:bg-muted/40 transition duration-150">
                      <td className="px-4 py-3.5 text-center font-mono text-muted-foreground/70 font-semibold">{idx + 1}</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-foreground">{c.empIdTemp}</td>
                      <td className="px-4 py-3.5 font-bold text-foreground">{c.nameEng}</td>
                      <td className="px-4 py-3.5 font-semibold text-muted-foreground font-mono">{c.personalContact}</td>
                      <td className="px-4 py-3.5 font-medium text-muted-foreground font-mono">{c.personalEmail || "—"}</td>
                      <td className="px-4 py-3.5 font-semibold text-muted-foreground/75 font-mono">{c.doj}</td>
                      <td className="px-4 py-3.5 text-center"><StatusBadge status={c.assessStatus} /></td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedCandidate(c)}
                            className="h-7 px-3 rounded bg-primary/10 text-primary border border-primary/15 hover:bg-primary/20 flex items-center justify-center gap-1 text-[10px] font-bold transition"
                            title="Review Dossier"
                          >
                            <Eye className="size-3.5" /> Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-10 font-bold text-muted-foreground text-xs">
                        No temporary candidates found in registration queue.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── HIGH FIDELITY CANDIDATE DETAILED VIEW DRAWER / DRAWER MODAL ── */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-3xl bg-card border-l border-border/80 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
              
              {/* Header */}
              <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    <User className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-black text-foreground uppercase tracking-wider">{selectedCandidate.nameEng}</h2>
                    <p className="text-[10px] text-muted-foreground font-mono">Dossier Code: {selectedCandidate.empIdTemp}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="size-8 rounded-full border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
                
                {/* Visual Identity & Avatar Card */}
                <div className="flex flex-col sm:flex-row gap-5 items-center bg-muted/10 border border-border/60 p-5 rounded-2xl">
                  {selectedCandidate.photo ? (
                    <img 
                      src={selectedCandidate.photo} 
                      alt={selectedCandidate.nameEng} 
                      className="size-24 rounded-xl border border-border object-cover shadow-sm"
                    />
                  ) : (
                    <div className="size-24 rounded-xl border border-border/60 bg-card flex items-center justify-center text-muted-foreground/40 shrink-0">
                      <User className="size-10" />
                    </div>
                  )}
                  <div className="space-y-2 text-center sm:text-left min-w-0 flex-1">
                    <h3 className="text-base font-black text-foreground">{selectedCandidate.nameEng}</h3>
                    <p className="text-xs text-muted-foreground font-bold">{selectedCandidate.nameBng || "বাংলা নাম নেই"}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-[10px] font-bold text-muted-foreground/80">
                      <span className="flex items-center gap-1"><Calendar className="size-3" /> DOB: {selectedCandidate.dob || "—"}</span>
                      <span className="flex items-center gap-1"><Clock className="size-3" /> Status: {selectedCandidate.assessStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Grid Group 1: Personal Details */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-primary tracking-widest border-b border-border/30 pb-1 flex items-center gap-1">
                    <Info className="size-3.5" /> Personal Credentials
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 text-xs">
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">Religion</p>
                      <p className="font-bold text-foreground">{selectedCandidate.religion || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">Marital Status</p>
                      <p className="font-bold text-foreground">{selectedCandidate.maritalStatus || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">NID Number</p>
                      <p className="font-bold text-foreground font-mono">{selectedCandidate.nidNumber || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">Birth Registration No</p>
                      <p className="font-bold text-foreground font-mono">{selectedCandidate.birthReg || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">Father Name (ENG)</p>
                      <p className="font-bold text-foreground">{selectedCandidate.fatherNameEng || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">Father Name (BNG)</p>
                      <p className="font-bold text-foreground">{selectedCandidate.fatherNameBng || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">Mother Name (ENG)</p>
                      <p className="font-bold text-foreground">{selectedCandidate.motherNameEng || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">Mother Name (BNG)</p>
                      <p className="font-bold text-foreground">{selectedCandidate.motherNameBng || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Grid Group 2: Contact Details */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-primary tracking-widest border-b border-border/30 pb-1 flex items-center gap-1">
                    <Phone className="size-3.5" /> Contacts & emergency References
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 text-xs">
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">Personal Contact No</p>
                      <p className="font-bold text-foreground font-mono">{selectedCandidate.personalContact}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">Emergency Contact No</p>
                      <p className="font-bold text-foreground font-mono">{selectedCandidate.emergencyContact || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">Personal Email</p>
                      <p className="font-bold text-foreground font-mono">{selectedCandidate.personalEmail || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">Emergency Contact Person</p>
                      <p className="font-bold text-foreground">{selectedCandidate.contactPerson || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground/60">Relationship</p>
                      <p className="font-bold text-foreground">{selectedCandidate.relationship || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Grid Group 3: Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/10 border border-border/60 rounded-xl p-4 space-y-2">
                    <p className="text-[10px] font-black uppercase text-primary flex items-center gap-1"><MapPin className="size-3.5" /> Present Address</p>
                    <p className="text-[11.5px] font-semibold text-foreground/80 leading-relaxed">{selectedCandidate.presentAddress || "—"}</p>
                  </div>
                  <div className="bg-muted/10 border border-border/60 rounded-xl p-4 space-y-2">
                    <p className="text-[10px] font-black uppercase text-primary flex items-center gap-1"><MapPin className="size-3.5" /> Permanent Address</p>
                    <p className="text-[11.5px] font-semibold text-foreground/80 leading-relaxed">{selectedCandidate.permanentAddress || "—"}</p>
                  </div>
                </div>

                {/* Academics Section */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-primary tracking-widest border-b border-border/30 pb-1 flex items-center gap-1">
                    <GraduationCap className="size-3.5" /> Academic Qualifications
                  </h4>
                  {selectedCandidate.academics && selectedCandidate.academics.length > 0 ? (
                    <div className="space-y-2.5">
                      {selectedCandidate.academics.map((ac: any, i: number) => (
                        <div key={ac.id || i} className="flex items-center justify-between border border-border/50 bg-card p-3.5 rounded-xl shadow-3xs">
                          <div>
                            <p className="text-xs font-bold text-foreground">{ac.title || "—"}</p>
                            <p className="text-[10px] text-muted-foreground font-semibold">{ac.institution || "—"}</p>
                          </div>
                          <div className="text-right text-[10px] font-bold">
                            <p className="text-foreground">GPA/Result: {ac.result || "—"}</p>
                            <p className="text-muted-foreground/75 font-mono">Passing Year: {ac.year || "—"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground/60 italic font-semibold">No academic credentials declared.</p>
                  )}
                </div>

                {/* Job Experiences Section */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-primary tracking-widest border-b border-border/30 pb-1 flex items-center gap-1">
                    <Briefcase className="size-3.5" /> Job Experience History
                  </h4>
                  {selectedCandidate.experiences && selectedCandidate.experiences.length > 0 ? (
                    <div className="space-y-2.5">
                      {selectedCandidate.experiences.map((exp: any, i: number) => (
                        <div key={exp.id || i} className="border border-border/50 bg-card p-3.5 rounded-xl shadow-3xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-foreground">{exp.company || "—"}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">{exp.from || "—"} to {exp.to || "—"}</p>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground/85">
                            <p>Designation: <span className="text-foreground">{exp.designation || "—"}</span></p>
                            <p>Leaving Reason: <span className="text-foreground">{exp.reason || "—"}</span></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground/60 italic font-semibold">No job experience declared.</p>
                  )}
                </div>

                {/* Nominee Section */}
                {selectedCandidate.nominee && (
                  <div className="bg-muted/10 border border-border/60 rounded-xl p-4 space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-primary flex items-center gap-1"><Heart className="size-3.5" /> Nominee Declaration</h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                      <div>
                        <p className="text-[9px] font-black uppercase text-muted-foreground/60">Nominee Name</p>
                        <p className="font-bold text-foreground">{selectedCandidate.nominee.name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-muted-foreground/60">Relationship</p>
                        <p className="font-bold text-foreground">{selectedCandidate.nominee.relation || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-muted-foreground/60">NID / Birth Registration</p>
                        <p className="font-bold text-foreground font-mono">{selectedCandidate.nominee.nidReg || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-muted-foreground/60">Contact Number</p>
                        <p className="font-bold text-foreground font-mono">{selectedCandidate.nominee.contact || "—"}</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons in Drawer Footer */}
              <div className="p-4 border-t border-border/50 bg-muted/20 flex gap-3">
                <button
                  onClick={() => handleReject(selectedCandidate.empIdTemp)}
                  className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition"
                >
                  <XCircle className="size-4" /> Reject Candidate
                </button>
                <button
                  onClick={() => handleApprove(selectedCandidate.empIdTemp)}
                  className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-primary text-primary-foreground hover:opacity-90 font-black rounded-xl text-xs shadow-md transition"
                >
                  <CheckCircle2 className="size-4" /> Approve &amp; Move to IE
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
