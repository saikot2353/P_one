import { useState, useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Heart,
  Info,
  Phone,
  Calendar,
  Mail,
  FileText,
  Landmark,
  ChevronRight,
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

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-border/20 pb-3 mb-4">
      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-black uppercase text-foreground/80 tracking-wider">{title}</h3>
        {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-purple-100 text-purple-800 border-purple-200",
    Approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Rejected: "bg-rose-100 text-rose-800 border-rose-200",
  };

  let displayStatus = "Pending";
  if (status && status.includes("Approved")) {
    displayStatus = "Approved";
  } else if (status && status.includes("Rejected")) {
    displayStatus = "Rejected";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${map[displayStatus] || "bg-slate-50 text-slate-200 border-slate-200"}`}
    >
      {displayStatus}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/10 text-xs hover:bg-muted/10 px-1.5 rounded transition-colors duration-150">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className="font-bold text-foreground text-right truncate max-w-[65%]">
        {value || "—"}
      </span>
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
      acStatus: "Active",
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
              <p className="text-sm text-muted-foreground font-semibold">
                Loading applicant dossier...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
        <Topbar />

        <div className="p-4 md:p-6 space-y-4 overflow-y-auto h-full pb-24">
          {/* Top Breadcrumb & Actions */}
          <div className="bg-card rounded-xl border border-border/60 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-3xs">
            <div className="flex items-center gap-3">
              <img
                src={
                  candidate.photo ||
                  `https://images.unsplash.com/photo-${candidate.empIdTemp === "PAL000002" || candidate.empIdTemp === "PAL000004" || candidate.empIdTemp === "PAL000006" || candidate.empIdTemp === "PAL000008" || candidate.empIdTemp === "PAL000010" || candidate.empIdTemp === "PAL000012" || candidate.empIdTemp === "PAL000014" ? "1494790108377-be9c29b29330" : "1535713875002-d1d0cf377fde"}?auto=format&fit=crop&w=120&h=120&q=80`
                }
                alt={candidate.nameEng}
                className="size-11 rounded-full border border-border/60 object-cover shadow-xs"
              />
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  {candidate.nameEng}
                  <StatusBadge status={candidate.assessStatus} />
                </h1>
                <p className="text-[10px] font-semibold text-muted-foreground">
                  ID: {candidate.empIdTemp} — {candidate.designation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/recruitment-basic-list"
                className="h-8 px-3 rounded-lg border border-border/80 bg-card hover:bg-muted text-[11px] font-bold shadow-3xs flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="size-3.5" /> Back to Queue
              </Link>
            </div>
          </div>

          {/* Unified Compact Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Hand: Personal & Contacts & Nominee */}
            <div className="space-y-4">
              {/* Personal Details */}
              <div className="bg-card rounded-xl border border-border/60 p-4 shadow-3xs">
                <SectionHeader
                  icon={<Info className="size-4" />}
                  title="Personal & Identity Dossier"
                />
                <div className="space-y-1">
                  <DetailRow label="Candidate Name (ENG)" value={candidate.nameEng} />
                  <DetailRow label="Candidate Name (BNG)" value={candidate.nameBng} />
                  <DetailRow label="Date of Birth (DOB)" value={candidate.dob} />
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

              {/* Contacts & emergency References */}
              <div className="bg-card rounded-xl border border-border/60 p-4 shadow-3xs">
                <SectionHeader
                  icon={<Phone className="size-4" />}
                  title="Contact & Reachability Channels"
                />
                <div className="space-y-1">
                  <DetailRow label="Personal Contact No" value={candidate.personalContact} />
                  <DetailRow label="Personal Email Address" value={candidate.personalEmail} />
                  <DetailRow label="Emergency Contact No" value={candidate.emergencyContact} />
                  <DetailRow label="Emergency Contact Name" value={candidate.contactPerson} />
                  <DetailRow label="Relationship" value={candidate.relationship} />
                </div>
              </div>

              {/* Nominee Declaration */}
              {candidate.nominee && (
                <div className="bg-card rounded-xl border border-border/60 p-4 shadow-3xs">
                  <SectionHeader
                    icon={<Heart className="size-4" />}
                    title="Nominee Declaration Dossier"
                  />
                  <div className="space-y-1">
                    <DetailRow label="Nominee Full Name" value={candidate.nominee.name} />
                    <DetailRow label="Relationship" value={candidate.nominee.relation} />
                    <DetailRow label="Nominee NID / Birth Reg" value={candidate.nominee.nidReg} />
                    <DetailRow label="Nominee Contact Number" value={candidate.nominee.contact} />
                  </div>
                </div>
              )}
            </div>

            {/* Right Hand: Qualification, Experiences & Addresses */}
            <div className="space-y-4">
              {/* Academic Profile */}
              <div className="bg-card rounded-xl border border-border/60 p-4 shadow-3xs">
                <SectionHeader
                  icon={<GraduationCap className="size-4" />}
                  title="Academic Qualifications"
                />
                <div className="border border-border/30 rounded-lg overflow-hidden mt-2">
                  <table className="w-full text-left text-xs bg-card">
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/20 text-[9px] uppercase font-bold text-muted-foreground/75">
                        <th className="px-3 py-1.5">Exam Title</th>
                        <th className="px-3 py-1.5">Institution</th>
                        <th className="px-3 py-1.5 text-center">Year</th>
                        <th className="px-3 py-1.5 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/25">
                      {candidate.academics && candidate.academics.length > 0 ? (
                        candidate.academics.map((ac: any, idx: number) => (
                          <tr key={ac.id || idx} className="hover:bg-muted/10">
                            <td className="px-3 py-2 font-bold text-foreground">{ac.title}</td>
                            <td className="px-3 py-2 font-semibold text-muted-foreground">
                              {ac.institution}
                            </td>
                            <td className="px-3 py-2 text-center font-mono">{ac.year}</td>
                            <td className="px-3 py-2 text-right font-bold text-primary">
                              {ac.result}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-3 italic text-muted-foreground">
                            No academic profiles declared.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Job History Timeline */}
              <div className="bg-card rounded-xl border border-border/60 p-4 shadow-3xs">
                <SectionHeader
                  icon={<Briefcase className="size-4" />}
                  title="Prior Job Experience Timeline"
                />
                <div className="border border-border/30 rounded-lg overflow-hidden mt-2">
                  <table className="w-full text-left text-xs bg-card">
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/20 text-[9px] uppercase font-bold text-muted-foreground/75">
                        <th className="px-3 py-1.5">Company Name</th>
                        <th className="px-3 py-1.5">Designation</th>
                        <th className="px-3 py-1.5 text-center">Duration</th>
                        <th className="px-3 py-1.5 text-right">Leaving Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/25">
                      {candidate.experiences && candidate.experiences.length > 0 ? (
                        candidate.experiences.map((exp: any, idx: number) => (
                          <tr key={exp.id || idx} className="hover:bg-muted/10">
                            <td className="px-3 py-2 font-bold text-foreground">{exp.company}</td>
                            <td className="px-3 py-2 font-semibold text-muted-foreground">
                              {exp.designation}
                            </td>
                            <td className="px-3 py-2 text-center font-mono whitespace-nowrap text-[10px]">
                              {exp.from} to {exp.to}
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-muted-foreground italic truncate max-w-[150px]">
                              {exp.reason}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-3 italic text-muted-foreground">
                            No experience history declared.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Address Coordinates */}
              <div className="bg-card rounded-xl border border-border/60 p-4 shadow-3xs">
                <SectionHeader
                  icon={<MapPin className="size-4" />}
                  title="Registered Address Coordinates"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs">
                  <div className="bg-muted/10 border border-border/30 rounded-lg p-2.5">
                    <p className="text-[9px] font-bold uppercase text-primary mb-1 flex items-center gap-1">
                      <MapPin className="size-3" /> Present Address
                    </p>
                    <p className="text-foreground/80 leading-normal font-medium">
                      {candidate.presentAddress || "—"}
                    </p>
                  </div>
                  <div className="bg-muted/10 border border-border/30 rounded-lg p-2.5">
                    <p className="text-[9px] font-bold uppercase text-primary mb-1 flex items-center gap-1">
                      <MapPin className="size-3" /> Permanent Address
                    </p>
                    <p className="text-foreground/80 leading-normal font-medium">
                      {candidate.permanentAddress || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Footer Action Bar */}
          <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-background/90 backdrop-blur-md border-t border-border/60 p-3 flex items-center justify-center z-30 shadow-lg">
            <div className="w-full px-4 md:px-6 flex gap-3">
              <button
                type="button"
                onClick={handleReject}
                className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold rounded-lg text-xs transition active:scale-[0.99]"
              >
                <XCircle className="size-4" /> Reject Applicant
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-primary text-primary-foreground hover:opacity-95 font-bold rounded-lg text-xs shadow-sm transition active:scale-[0.99]"
              >
                <CheckCircle2 className="size-4" /> Approve &amp; Onboard
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
