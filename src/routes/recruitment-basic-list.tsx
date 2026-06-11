import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Sparkles, ChevronRight, Search, Plus, Trash2, Edit3, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/recruitment-basic-list")({
  head: () => ({
    meta: [
      { title: "Basic Info List — CRIPTON HRIS" },
      { name: "description", content: "Directory of registered candidate profiles temporarily enrolled." },
    ],
  }),
  component: BasicInfoListPage,
});

interface Candidate {
  empIdTemp: string;
  nameEng: string;
  doj: string;
  personalContact: string;
  department: string;
  designation: string;
  assessStatus: string;
}

const INITIAL_CANDIDATES: Candidate[] = [
  { empIdTemp: "RMG-00001", nameEng: "Rubel Hossain", doj: "2026-06-15", personalContact: "01712345678", department: "RMG Production", designation: "Production Operator", assessStatus: "IE Pending" },
  { empIdTemp: "BA-00002", nameEng: "Jannatul Ferdous", doj: "2026-06-12", personalContact: "01823456789", department: "Business Automation (HR)", designation: "Officer", assessStatus: "IE Pending" },
  { empIdTemp: "CD-00003", nameEng: "Ahsan Habib", doj: "2026-06-18", personalContact: "01934567890", department: "Core Development", designation: "Junior Developer", assessStatus: "IE Pending" },
];

function BasicInfoListPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("Sys Admin");

  // Load from local storage, fallback to initial mock data if empty
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("recruitment_user_role") || "Sys Admin";
      setRole(savedRole);

      const saved = localStorage.getItem("recruitment_candidates");
      if (saved) {
        setCandidates(JSON.parse(saved));
      } else {
        localStorage.setItem("recruitment_candidates", JSON.stringify(INITIAL_CANDIDATES));
        setCandidates(INITIAL_CANDIDATES);
      }
    }
  }, []);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    localStorage.setItem("recruitment_user_role", newRole);
    toast.info(`Simulating view as: ${newRole}`);
  };

  const handleDelete = (empId: string) => {
    if (role !== "Sys Admin") {
      toast.error("Access Denied: Only Sys Admin can delete candidates!");
      return;
    }
    const updated = candidates.filter((c) => c.empIdTemp !== empId);
    setCandidates(updated);
    localStorage.setItem("recruitment_candidates", JSON.stringify(updated));
    toast.success(`Candidate ${empId} deleted successfully.`);
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.nameEng.toLowerCase().includes(q) ||
        c.empIdTemp.toLowerCase().includes(q) ||
        c.personalContact.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.designation.toLowerCase().includes(q)
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
                <span>IE Recruitment</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Basic Info List</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="size-5.5 text-primary" />
                <span>Basic Info List</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Role Toggle */}
              <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl border border-border/40">
                <span className="text-[10px] font-bold text-muted-foreground uppercase px-2">Role:</span>
                <button
                  onClick={() => handleRoleChange("User")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    role === "User"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  User
                </button>
                <button
                  onClick={() => handleRoleChange("Sys Admin")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    role === "Sys Admin"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sys Admin
                </button>
              </div>

              <Link
                to="/recruitment-basic-entry"
                className="h-9.5 px-4 bg-primary hover:opacity-95 text-primary-foreground font-black text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Plus className="size-4" />
                <span>Add Candidate</span>
              </Link>
            </div>
          </div>

          {/* Candidates Directory Data Grid */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in-50 duration-200">
            {/* Search and stats bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20">
              <span className="text-xs font-bold text-muted-foreground">
                Showing {filteredCandidates.length} of {candidates.length} Registered Temp Profiles
              </span>
              <div className="flex items-center gap-2 w-full sm:w-64">
                <Search className="size-4 text-muted-foreground/60 shrink-0" />
                <input
                  type="text"
                  placeholder="Search candidates..."
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
                    <th className="px-4 py-3">Emp ID (Temp)</th>
                    <th className="px-4 py-3">Employee Name</th>
                    <th className="px-4 py-3">Contact No</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">DOJ</th>
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
                      <td className="px-4 py-3.5 font-medium text-foreground">{c.department}</td>
                      <td className="px-4 py-3.5 font-medium text-muted-foreground">{c.designation}</td>
                      <td className="px-4 py-3.5 font-semibold text-muted-foreground/75 font-mono">{c.doj}</td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            to="/recruitment-basic-entry"
                            className="size-7 rounded bg-blue-500/10 text-blue-600 border border-blue-500/15 hover:bg-blue-500/25 flex items-center justify-center transition"
                            title="Edit Candidate Details"
                          >
                            <Edit3 className="size-3.5" />
                          </Link>

                          {/* Delete X icon restricted to Sys Admin */}
                          {role === "Sys Admin" ? (
                            <button
                              onClick={() => handleDelete(c.empIdTemp)}
                              className="size-7 rounded bg-red-500/10 text-red-600 border border-red-500/15 hover:bg-red-500/25 flex items-center justify-center transition"
                              title="Delete Candidate (Sys Admin Only)"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          ) : (
                            <div
                              className="size-7 rounded bg-muted/40 text-muted-foreground/45 border border-border/20 flex items-center justify-center cursor-not-allowed"
                              title="Delete (X) visible only to Sys Admin"
                            >
                              <Trash2 className="size-3.5" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-10 font-bold text-muted-foreground text-xs">
                        No temporary candidates found.
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
