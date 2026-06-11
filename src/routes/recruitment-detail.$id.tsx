import { useState, useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ArrowLeft, CheckCircle2, XCircle, User, GraduationCap, Briefcase, MapPin, Heart, Info, Phone, Calendar, Mail, FileText, Landmark
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/recruitment-detail/$id")({
  head: () => ({
    meta: [
      { title: "Review Candidate Dossier — CRIPTON HRIS" },
      { name: "description", content: "Review and approve/reject candidate applications." },
    ],
  }),
  component: RecruitmentDetailPage,
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
    "IE Pending":    "bg-amber-100 text-amber-800 border-amber-200",
    "IE Submitted":  "bg-blue-100 text-blue-800 border-blue-200",
    "HR Pending":    "bg-purple-100 text-purple-800 border-purple-200",
    "HR Approved":   "bg-emerald-100 text-emerald-800 border-emerald-200",
    "HR Rejected":   "bg-rose-100 text-rose-800 border-rose-200",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${map[status] || "bg-slate-50 text-slate-655 border-slate-200"}`}>
      {status}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1 bg-muted/5 border border-border/40 p-3 rounded-xl hover:bg-muted/10 transition-colors">
      <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-foreground truncate">{value || "—"}</p>
    </div>
  );
}

function RecruitmentDetailPage() {
  const router = useRouter();
  const { id } = Route.useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recruitment_candidates");
      if (saved) {
        const parsed = JSON.parse(saved);
        const found = parsed.find((c: any) => c.empIdTemp === id);
        if (found) {
          setCandidate(found);
        }
      }
    }
  }, [id]);

  const handleApprove = () => {
    if (!candidate) return;

    // 1. Move to Personnel List (recruitment_synced_employees key)
    const syncedKey = "recruitment_synced_employees";
    const savedSynced = localStorage.getItem(syncedKey);
    const parsedSynced = savedSynced ? JSON.parse(savedSynced) : [];

    const newEmployeeRecord = {
      id: candidate.empIdTemp,
      offcId: "—",
      name: candidate.nameEng,
      type: "Worker",
      dept: candidate.department || "RMG Operation",
      sect: "Sewing",
      title: candidate.designation || "Operator",
      unit: "Unit-6",
      line: "52",
      grade: "None",
      shift: "General Shift",
      shiftStart: new Date().toLocaleDateString("en-GB"),
      joinDate: candidate.doj || new Date().toLocaleDateString("en-GB"),
      holiday: "—",
      blood: "—",
      basic: "9000.00",
      gross: "15000.00",
      email: candidate.personalEmail || "",
      phone: "—",
      officeMob: candidate.personalContact,
      personalContact: "—",
      gender: "Male",
      dob: candidate.dob ? new Date(candidate.dob).toLocaleDateString("en-GB") : "—",
      otStatus: "N/A",
      otRate: "0",
      status: "Working",
      empStatus: "Probation",
      confirmDate: "—",
      village: candidate.presentAddress || "—",
      acStatus: "Active"
    };

    localStorage.setItem(syncedKey, JSON.stringify([...parsedSynced, newEmployeeRecord]));

    // 2. Update status in candidates database
    const savedCandidates = localStorage.getItem("recruitment_candidates");
    if (savedCandidates) {
      const parsedCandidates = JSON.parse(savedCandidates);
      const updated = parsedCandidates.map((c: any) => {
        if (c.empIdTemp === id) {
          return { ...c, assessStatus: "HR Approved" };
        }
        return c;
      });
      localStorage.setItem("recruitment_candidates", JSON.stringify(updated));
    }

    toast.success(`Candidate ${id} approved successfully and moved to the Personnel database.`);
    router.navigate({ to: "/recruitment-basic-list" });
  };

  const handleReject = () => {
    if (!candidate) return;

    const savedCandidates = localStorage.getItem("recruitment_candidates");
    if (savedCandidates) {
      const parsedCandidates = JSON.parse(savedCandidates);
      const updated = parsedCandidates.map((c: any) => {
        if (c.empIdTemp === id) {
          return { ...c, assessStatus: "HR Rejected" };
        }
        return c;
      });
      localStorage.setItem("recruitment_candidates", JSON.stringify(updated));
    }

    toast.error(`Candidate ${id} has been rejected.`);
    router.navigate({ to: "/recruitment-basic-list" });
  };

  if (!candidate) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Topbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="size-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <p className="text-sm text-muted-foreground font-semibold">Loading applicant dossier...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full pb-28">
          
          {/* Breadcrumbs & Actions Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>e-Recruitment</span>
                <ChevronRight className="size-3" />
                <Link to="/recruitment-basic-list" className="hover:text-primary transition-colors">Queue</Link>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">{id}</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <span>Dossier: {candidate.nameEng}</span>
              </h1>
            </div>
            <Link
              to="/recruitment-basic-list"
              className="inline-flex items-center justify-center gap-1.5 h-9.5 px-4 rounded-xl border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold transition-all shadow-3xs"
            >
              <ArrowLeft className="size-4" /> Back to Queue
            </Link>
          </div>

          {/* Candidate Card Banner */}
          <div className="bg-card rounded-3xl border border-border/80 p-6 flex flex-col md:flex-row gap-6 items-center shadow-2xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
            
            {candidate.photo ? (
              <img 
                src={candidate.photo} 
                alt={candidate.nameEng} 
                className="size-28 rounded-2xl border border-border/60 object-cover shadow-sm z-10"
              />
            ) : (
              <div className="size-28 rounded-2xl border border-border/60 bg-muted/30 flex items-center justify-center text-muted-foreground/45 z-10 shrink-0">
                <User className="size-12" />
              </div>
            )}

            <div className="text-center md:text-left space-y-2 z-10 flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h2 className="text-xl font-black text-foreground tracking-tight">{candidate.nameEng}</h2>
                <StatusBadge status={candidate.assessStatus} />
              </div>
              <p className="text-xs font-semibold text-muted-foreground">{candidate.nameBng || "বাংলা নাম নেই"}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10.5px] font-bold text-muted-foreground/80">
                <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-primary" /> DOB: {candidate.dob || "—"}</span>
                <span className="flex items-center gap-1.5"><Mail className="size-3.5 text-primary" /> {candidate.personalEmail || "—"}</span>
              </div>
            </div>
          </div>

          {/* Dossier Tabs/Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Block 1: Identification & Credentials */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-3xs overflow-hidden flex flex-col">
              <SectionHeader icon={<Info className="size-4" />} title="Personal & Identity Dossier" />
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <DetailRow label="Religion" value={candidate.religion} />
                <DetailRow label="Marital Status" value={candidate.maritalStatus} />
                <DetailRow label="National ID (NID)" value={candidate.nidNumber} />
                <DetailRow label="Birth Registration No" value={candidate.birthReg} />
                <DetailRow label="Father Name (ENG)" value={candidate.fatherNameEng} />
                <DetailRow label="Father Name (BNG)" value={candidate.fatherNameBng} />
                <DetailRow label="Mother Name (ENG)" value={candidate.motherNameEng} />
                <DetailRow label="Mother Name (BNG)" value={candidate.motherNameBng} />
              </div>
            </div>

            {/* Block 2: Contacts & References */}
            <div className="bg-card rounded-2xl border border-border/80 shadow-3xs overflow-hidden flex flex-col">
              <SectionHeader icon={<Phone className="size-4" />} title="Contact & References" />
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <DetailRow label="Personal Contact No" value={candidate.personalContact} />
                <DetailRow label="Emergency Contact No" value={candidate.emergencyContact} />
                <DetailRow label="Emergency Reference Name" value={candidate.contactPerson} />
                <DetailRow label="Relationship" value={candidate.relationship} />
              </div>
            </div>

          </div>

          {/* Address Details */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-3xs overflow-hidden">
            <SectionHeader icon={<MapPin className="size-4" />} title="Address Registration Coordinates" />
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-muted/10 border border-border/60 rounded-xl p-4.5 space-y-2">
                <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5">
                  <MapPin className="size-4" /> Present Address
                </p>
                <p className="text-xs font-semibold text-foreground/80 leading-relaxed">{candidate.presentAddress || "—"}</p>
              </div>
              <div className="bg-muted/10 border border-border/60 rounded-xl p-4.5 space-y-2">
                <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5">
                  <MapPin className="size-4" /> Permanent Address
                </p>
                <p className="text-xs font-semibold text-foreground/80 leading-relaxed">{candidate.permanentAddress || "—"}</p>
              </div>
            </div>
          </div>

          {/* Academic Profile */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-3xs overflow-hidden">
            <SectionHeader icon={<GraduationCap className="size-4" />} title="Academic Profile" />
            <div className="p-5">
              {candidate.academics && candidate.academics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {candidate.academics.map((ac: any, i: number) => (
                    <div key={ac.id || i} className="flex items-center justify-between border border-border/50 bg-muted/5 p-4 rounded-xl">
                      <div>
                        <p className="text-xs font-black text-foreground">{ac.title || "—"}</p>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{ac.institution || "—"}</p>
                      </div>
                      <div className="text-right text-[10px] font-bold">
                        <p className="text-primary">GPA: {ac.result || "—"}</p>
                        <p className="text-muted-foreground/75 font-mono mt-0.5">{ac.year || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/75 italic">No academic qualifications listed.</p>
              )}
            </div>
          </div>

          {/* Job History Timeline */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-3xs overflow-hidden">
            <SectionHeader icon={<Briefcase className="size-4" />} title="Job Experience Timeline" />
            <div className="p-5">
              {candidate.experiences && candidate.experiences.length > 0 ? (
                <div className="space-y-3">
                  {candidate.experiences.map((exp: any, i: number) => (
                    <div key={exp.id || i} className="border border-border/50 bg-muted/5 p-4.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-foreground">{exp.company || "—"}</p>
                        <p className="text-[10px] text-muted-foreground font-semibold">Designation: <strong className="text-foreground">{exp.designation || "—"}</strong></p>
                      </div>
                      <div className="text-left sm:text-right text-[10px] font-bold space-y-1">
                        <p className="text-primary font-mono">{exp.from || "—"} to {exp.to || "—"}</p>
                        <p className="text-muted-foreground/75 font-semibold">Leaving Reason: {exp.reason || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/75 italic">No job experience history declared.</p>
              )}
            </div>
          </div>

          {/* Nominee Declaration Dossier */}
          {candidate.nominee && (
            <div className="bg-card rounded-2xl border border-border/80 shadow-3xs overflow-hidden">
              <SectionHeader icon={<Heart className="size-4" />} title="Nominee Declaration Dossier" />
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <DetailRow label="Nominee Full Name" value={candidate.nominee.name} />
                <DetailRow label="Relationship" value={candidate.nominee.relation} />
                <DetailRow label="NID / Birth Reg" value={candidate.nominee.nidReg} />
                <DetailRow label="Nominee Contact No" value={candidate.nominee.contact} />
              </div>
            </div>
          )}

          {/* Floating Footer Action Bar */}
          <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-background/85 backdrop-blur-md border-t border-border/60 p-4 flex items-center justify-center z-30 shadow-lg">
            <div className="max-w-5xl w-full flex gap-4">
              <button
                type="button"
                onClick={handleReject}
                className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition"
              >
                <XCircle className="size-4" /> Reject Applicant
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-primary text-primary-foreground hover:opacity-90 font-black rounded-xl text-xs shadow-md transition"
              >
                <CheckCircle2 className="size-4" /> Approve &amp; Onboard to Personnel List
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
