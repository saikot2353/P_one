import { useState, useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ChevronRight, ClipboardCheck, PlayCircle, Search, RotateCcw } from "lucide-react";
import { initializeRecruitmentMockData } from "@/lib/recruitment-mock-data";

export const Route = createFileRoute("/recruitment-ie-list")({
  head: () => ({
    meta: [
      { title: "IE Assessment List — CRIPTON HRIS" },
      { name: "description", content: "Candidates pending IE evaluation." },
    ],
  }),
  component: IEAssessmentListPage,
});

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "IE Pending":   "bg-amber-100 text-amber-800 border-amber-200",
    "IE Submitted": "bg-blue-100 text-blue-800 border-blue-200",
    "HR Pending":   "bg-purple-100 text-purple-800 border-purple-200",
    "HR Approved":  "bg-green-100 text-green-800 border-green-200",
    "HR Rejected":  "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border whitespace-nowrap ${map[status] || "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}

function IEAssessmentListPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<any[]>([]);

  const [assessStatus, setAssessStatus] = useState("IE Pending");
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
      initializeRecruitmentMockData();
      const saved = localStorage.getItem("recruitment_candidates");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCandidates(parsed);
        setFilteredCandidates(parsed.filter((c: any) => c.assessStatus === "IE Pending"));
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

  const handleReset = () => {
    setAssessStatus("IE Pending"); setDojFrom(""); setDojTo(""); setEmpType("");
    setDepartment(""); setSection(""); setDesignation(""); setUnit(""); setLine(""); setEmpIdTemp("");
    setFilteredCandidates(candidates.filter(c => c.assessStatus === "IE Pending"));
  };

  const filterClass = "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all";
  const labelClass = "text-[10px] font-black text-muted-foreground uppercase tracking-wide";

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-5 max-w-[1400px] mx-auto w-full">

          {/* Header */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>e-Recruitment</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">IE Assessment</span>
              </div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                <ClipboardCheck className="size-5.5 text-primary" />
                IE Assessment Search
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-1.5 font-bold">
                IE Pending: <strong>{filteredCandidates.length}</strong>
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-3">
              <div className="space-y-1.5">
                <label className={labelClass}>Assess Status</label>
                <select value={assessStatus} onChange={e => setAssessStatus(e.target.value)} className={filterClass}>
                  <option value="IE Pending">IE Pending</option>
                  <option value="IE Submitted">IE Submitted</option>
                  <option value="HR Pending">HR Pending</option>
                  <option value="HR Approved">HR Approved</option>
                  <option value="HR Rejected">HR Rejected</option>
                  <option value="">All</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>DOJ From</label>
                <input type="date" value={dojFrom} onChange={e => setDojFrom(e.target.value)} className={filterClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>DOJ To</label>
                <input type="date" value={dojTo} onChange={e => setDojTo(e.target.value)} className={filterClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Emp Type</label>
                <select value={empType} onChange={e => setEmpType(e.target.value)} className={filterClass}>
                  <option value="">All Types</option>
                  <option value="Worker">Worker</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Department</label>
                <select value={department} onChange={e => setDepartment(e.target.value)} className={filterClass}>
                  <option value="">All Departments</option>
                  <option value="RMG Operation">RMG Operation</option>
                  <option value="Quality Control">Quality Control</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Section</label>
                <select value={section} onChange={e => setSection(e.target.value)} className={filterClass}>
                  <option value="">All Sections</option>
                  <option value="Sewing">Sewing</option>
                  <option value="Cutting">Cutting</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Designation</label>
                <select value={designation} onChange={e => setDesignation(e.target.value)} className={filterClass}>
                  <option value="">All Designations</option>
                  <option value="Operator">Operator</option>
                  <option value="Helper">Helper</option>
                  <option value="Cutter">Cutter</option>
                  <option value="Iron Man">Iron Man</option>
                  <option value="Folder">Folder</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Unit</label>
                <select value={unit} onChange={e => setUnit(e.target.value)} className={filterClass}>
                  <option value="">All Units</option>
                  <option value="Unit-6">Unit-6</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Line</label>
                <select value={line} onChange={e => setLine(e.target.value)} className={filterClass}>
                  <option value="">All Lines</option>
                  {["52","53","54","55","56","57","58","59","F-1","F-2"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Emp ID (Temp)</label>
                <input type="text" placeholder="e.g. PAL000001" value={empIdTemp} onChange={e => setEmpIdTemp(e.target.value)} className={filterClass} />
              </div>
              <div className="flex items-end gap-2 col-span-2 md:col-span-1">
                <button onClick={handleSearch} className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-1.5">
                  <Search className="size-3.5" /> Search
                </button>
                <button onClick={handleReset} className="h-10 px-3 rounded-xl bg-muted hover:bg-muted/80 border border-border/40 text-muted-foreground transition-all" title="Reset">
                  <RotateCcw className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" style={{ minWidth: "1100px" }}>
                <thead className="bg-muted/60 text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 w-10 text-center">#</th>
                    <th className="px-4 py-3 w-20 text-center">Execute</th>
                    <th className="px-4 py-3 min-w-[110px]">Emp ID</th>
                    <th className="px-4 py-3 min-w-[100px]">Status</th>
                    <th className="px-4 py-3 min-w-[160px]">Name</th>
                    <th className="px-4 py-3 min-w-[80px]">Emp Type</th>
                    <th className="px-4 py-3 min-w-[140px]">Department</th>
                    <th className="px-4 py-3 min-w-[100px]">Section</th>
                    <th className="px-4 py-3 min-w-[120px]">Designation</th>
                    <th className="px-4 py-3 min-w-[90px]">Job Nature</th>
                    <th className="px-4 py-3 min-w-[70px]">Unit</th>
                    <th className="px-4 py-3 min-w-[60px]">Line</th>
                    <th className="px-4 py-3 min-w-[60px]">Grade</th>
                    <th className="px-4 py-3 min-w-[100px]">DOJ</th>
                    <th className="px-4 py-3 min-w-[100px]">DOB</th>
                    <th className="px-4 py-3 min-w-[120px]">Contact No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredCandidates.map((item, idx) => (
                    <tr key={item.empIdTemp} className={`hover:bg-primary/5 transition-colors ${idx % 2 === 0 ? "bg-background" : "bg-muted/10"}`}>
                      <td className="px-4 py-2.5 text-center text-muted-foreground font-bold">{idx + 1}</td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => router.navigate({ to: `/recruitment-ie-assessment/${item.empIdTemp}` })}
                          title="Start IE Assessment"
                          className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 transition-all"
                        >
                          <PlayCircle className="size-4" />
                        </button>
                      </td>
                      <td className="px-4 py-2.5 font-mono font-bold text-primary text-[11px]">{item.empIdTemp}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={item.assessStatus} /></td>
                      <td className="px-4 py-2.5 font-semibold">{item.nameEng}</td>
                      <td className="px-4 py-2.5"><span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded">{item.employeeType}</span></td>
                      <td className="px-4 py-2.5">{item.department}</td>
                      <td className="px-4 py-2.5">{item.section}</td>
                      <td className="px-4 py-2.5">{item.designation}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">Permanent</td>
                      <td className="px-4 py-2.5">{item.unit}</td>
                      <td className="px-4 py-2.5">{item.line}</td>
                      <td className="px-4 py-2.5">{item.grade ? <span className="font-black text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">{item.grade}</span> : <span className="text-muted-foreground/40">—</span>}</td>
                      <td className="px-4 py-2.5 font-mono text-[11px]">{item.doj}</td>
                      <td className="px-4 py-2.5 font-mono text-[11px]">{item.dob}</td>
                      <td className="px-4 py-2.5 font-mono text-[11px]">{item.personalContact}</td>
                    </tr>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <tr><td colSpan={16} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <ClipboardCheck className="size-10 text-muted-foreground/30" />
                        <div className="text-sm font-bold text-muted-foreground">No pending IE candidates</div>
                      </div>
                    </td></tr>
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
