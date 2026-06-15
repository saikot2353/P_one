import { useState, useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Sparkles, ChevronRight, Send, Search } from "lucide-react";

export const Route = createFileRoute("/recruitment-hr-list")({
  head: () => ({
    meta: [
      { title: "HR Assessment List — CRIPTON HRIS" },
      { name: "description", content: "List of candidates pending HR evaluation." },
    ],
  }),
  component: HRAssessmentListPage,
});

function HRAssessmentListPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<any[]>([]);

  // Search Filters
  const [assessStatus, setAssessStatus] = useState("HR Pending");
  const [dojFrom, setDojFrom] = useState("");
  const [dojTo, setDojTo] = useState("");
  const [empType, setEmpType] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [designation, setDesignation] = useState("");
  const [unit, setUnit] = useState("");
  const [line, setLine] = useState("");
  const [empIdTemp, setEmpIdTemp] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recruitment_candidates");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCandidates(parsed);
        // By default, show candidates that are pending HR approval
        setFilteredCandidates(parsed.filter((c: any) => c.assessStatus === "HR Pending" || c.assessStatus === "IE Submitted"));
      }
    }
  }, []);

  const handleSearch = () => {
    const filtered = candidates.filter(c => {
      if (assessStatus && c.assessStatus !== assessStatus) return false;
      if (empIdTemp && !c.empIdTemp.toLowerCase().includes(empIdTemp.toLowerCase())) return false;
      if (empType && c.employeeType !== empType) return false;
      if (department && c.department !== department) return false;
      if (section && c.section !== section) return false;
      if (designation && c.designation !== designation) return false;
      if (dojFrom && new Date(c.doj) < new Date(dojFrom)) return false;
      if (dojTo && new Date(c.doj) > new Date(dojTo)) return false;
      return true;
    });
    setFilteredCandidates(filtered);
  };

  const handleExecute = (id: string) => {
    router.navigate({ to: `/recruitment-hr-assessment/${id}` });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="bg-card rounded-lg border border-border/85 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>IE Recruitment</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">HR Assessment</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="size-5.5 text-primary" />
                <span>HR Assessment Search</span>
              </h1>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border/80 shadow-xs p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-primary uppercase">Assess Status *</label><select value={assessStatus} onChange={e => setAssessStatus(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted text-primary font-bold border border-border/40 text-xs focus:border-primary/80 outline-none"><option value="HR Pending">HR Pending</option><option value="HR Approved">HR Approved</option><option value="HR Rejected">HR Rejected</option><option value="">All</option></select></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-red-500 uppercase">DOJ From *</label><input type="date" value={dojFrom} onChange={e => setDojFrom(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-red-500 uppercase">DOJ To *</label><input type="date" value={dojTo} onChange={e => setDojTo(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted-foreground uppercase">Emp Type</label><select value={empType} onChange={e => setEmpType(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none"><option value="">Select/Multi</option><option value="Office Executive">Office Executive</option><option value="Worker">Worker</option></select></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted-foreground uppercase">Department</label><select value={department} onChange={e => setDepartment(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none"><option value="">Select/Multi</option><option value="RMG Production">RMG Production</option></select></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted-foreground uppercase">Section</label><select value={section} onChange={e => setSection(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none"><option value="">Select/Multi</option><option value="RMG-Production-IE & Planning">IE & Planning</option></select></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted-foreground uppercase">Designation</label><select value={designation} onChange={e => setDesignation(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none"><option value="">Select/Multi</option><option value="Production Operator">Production Operator</option></select></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted-foreground uppercase">Unit</label><select value={unit} onChange={e => setUnit(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none"><option value="">Select/Multi</option><option value="Unit-01">Unit-01</option></select></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-muted-foreground uppercase">Line</label><select value={line} onChange={e => setLine(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none"><option value="">Select/Multi</option><option value="Line-04">Line-04</option></select></div>
              <div className="space-y-1.5 flex items-end gap-2">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Emp ID-Temp</label>
                  <input type="text" placeholder="Single/Multi" value={empIdTemp} onChange={e => setEmpIdTemp(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs focus:border-primary/80 outline-none" />
                </div>
                <button onClick={handleSearch} className="h-10 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-black text-xs transition flex items-center justify-center gap-1.5 shadow-sm border border-border/50">
                  <Search className="size-4 text-primary" /> Search
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-border/40 rounded-xl">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-muted/40 text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3">SL</th>
                    <th className="px-4 py-3">Execute</th>
                    <th className="px-4 py-3">Emp ID (Temp)</th>
                    <th className="px-4 py-3">Emp Name (Eng)</th>
                    <th className="px-4 py-3">Emp Type</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Job Nature</th>
                    <th className="px-4 py-3">Unit</th>
                    <th className="px-4 py-3">Line</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">DOJ</th>
                    <th className="px-4 py-3">DOB</th>
                    <th className="px-4 py-3">Personal Contact No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-foreground font-semibold">
                  {filteredCandidates.map((item, idx) => (
                    <tr key={item.empIdTemp} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleExecute(item.empIdTemp)} className="p-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-400 hover:text-black border border-yellow-300 transition-colors" title="Execute Assessment">
                          <Send className="size-4" />
                        </button>
                      </td>
                      <td className="px-4 py-3 font-mono text-primary">{item.empIdTemp}</td>
                      <td className="px-4 py-3">{item.nameEng}</td>
                      <td className="px-4 py-3">{item.empCategory || item.employeeType}</td>
                      <td className="px-4 py-3">{item.department || "RMG Operation"}</td>
                      <td className="px-4 py-3">{item.section || "Sewing"}</td>
                      <td className="px-4 py-3">{item.appliedFor || item.designation || "Operator"}</td>
                      <td className="px-4 py-3">{item.jobNature || "Permanent"}</td>
                      <td className="px-4 py-3">{item.unit || "Unit-6"}</td>
                      <td className="px-4 py-3">{item.line || "52"}</td>
                      <td className="px-4 py-3 font-bold">{item.grade || "-"}</td>
                      <td className="px-4 py-3">{item.doj}</td>
                      <td className="px-4 py-3">{item.dob}</td>
                      <td className="px-4 py-3">{item.personalContact}</td>
                    </tr>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan={15} className="px-4 py-10 text-center text-muted-foreground text-xs font-bold">
                        No pending candidates found.
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
