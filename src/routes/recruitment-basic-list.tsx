import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Sparkles,
  ChevronRight,
  Search,
  Plus,
  Trash2,
  Edit3,
  ShieldAlert,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Heart,
  Mail,
  Phone,
  Calendar,
  Clock,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { initializeRecruitmentMockData } from "@/lib/recruitment-mock-data";

export const Route = createFileRoute("/recruitment-basic-list")({
  head: () => ({
    meta: [
      { title: "Application Queue List — CRIPTON HRIS" },
      {
        name: "description",
        content: "Directory of registered candidate profiles temporarily enrolled.",
      },
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
    Pending: "bg-[#faf5ff] text-[#7e22ce] border-[#e9d5ff]", // Purple
    Approved: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]", // Green/Emerald
    Rejected: "bg-[#fdf2f2] text-[#b91c1c] border-[#fde8e8]", // Red
  };

  let displayStatus = "Pending";
  if (status && status.includes("Approved")) {
    displayStatus = "Approved";
  } else if (status && status.includes("Rejected")) {
    displayStatus = "Rejected";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${map[displayStatus] || "bg-slate-50 text-slate-600 border-slate-200"}`}
    >
      {displayStatus}
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
    const updated = candidates.map((c) => {
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
    const updated = candidates.map((c) => {
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
          <div className="bg-card rounded-lg border border-border/85 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
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
                to="/e-recruitment-form"
                className="h-9.5 px-4 bg-primary hover:opacity-95 text-primary-foreground font-black text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Plus className="size-4" />
                <span>Apply Form</span>
              </Link>
            </div>
          </div>

          {/* Directory Data Grid */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
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
                      <td className="px-4 py-3.5 text-center font-mono text-muted-foreground/70 font-semibold">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-foreground">
                        {c.empIdTemp}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-foreground">{c.nameEng}</td>
                      <td className="px-4 py-3.5 font-semibold text-muted-foreground font-mono">
                        {c.personalContact}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-muted-foreground font-mono">
                        {c.personalEmail || "—"}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-muted-foreground/75 font-mono">
                        {c.doj}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <StatusBadge status={c.assessStatus} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            to="/recruitment-detail/$id"
                            params={{ id: c.empIdTemp }}
                            className="h-7 px-3 rounded bg-primary/10 text-primary border border-primary/15 hover:bg-primary/20 flex items-center justify-center gap-1 text-[10px] font-bold transition"
                            title="Review Dossier"
                          >
                            <Eye className="size-3.5" /> Review
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-10 font-bold text-muted-foreground text-xs"
                      >
                        No temporary candidates found in registration queue.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
