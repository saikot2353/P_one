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
    "IE Pending": "bg-[#fef3c7] text-[#b45309] border-[#fde68a]", // Amber
    "IE Submitted": "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]", // Blue
    "HR Pending": "bg-[#faf5ff] text-[#7e22ce] border-[#e9d5ff]", // Purple
    "HR Approved": "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]", // Green/Emerald
    "HR Rejected": "bg-[#fdf2f2] text-[#b91c1c] border-[#fde8e8]", // Red
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${map[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}
    >
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
    const filtered = candidates.filter((c) => {
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
    setAssessStatus("IE Pending");
    setDojFrom("");
    setDojTo("");
    setEmpType("");
    setDepartment("");
    setSection("");
    setDesignation("");
    setUnit("");
    setLine("");
    setEmpIdTemp("");
    setFilteredCandidates(candidates.filter((c) => c.assessStatus === "IE Pending"));
  };

  const filterClass =
    "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all";
  const labelClass = "text-[10px] font-black text-muted-foreground uppercase tracking-wide";

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-5 max-w-[1400px] mx-auto w-full">
          {/* Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span>IE Recruitment</span>
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
          <div className="bg-card rounded-lg border border-border/80 shadow-xs p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-3">
              <div className="space-y-1.5">
                <label className={labelClass}>Assess Status</label>
                <select
                  value={assessStatus}
                  onChange={(e) => setAssessStatus(e.target.value)}
                  className={filterClass}
                >
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
                <input
                  type="date"
                  value={dojFrom}
                  onChange={(e) => setDojFrom(e.target.value)}
                  className={filterClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>DOJ To</label>
                <input
                  type="date"
                  value={dojTo}
                  onChange={(e) => setDojTo(e.target.value)}
                  className={filterClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Emp Type</label>
                <select
                  value={empType}
                  onChange={(e) => setEmpType(e.target.value)}
                  className={filterClass}
                >
                  <option value="">All Types</option>
                  <option value="Worker">Worker</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={filterClass}
                >
                  <option value="">All Departments</option>
                  <option value="RMG Operation">RMG Operation</option>
                  <option value="Quality Control">Quality Control</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className={filterClass}
                >
                  <option value="">All Sections</option>
                  <option value="Sewing">Sewing</option>
                  <option value="Cutting">Cutting</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Designation</label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className={filterClass}
                >
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
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className={filterClass}
                >
                  <option value="">All Units</option>
                  <option value="Unit-6">Unit-6</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Line</label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className={filterClass}
                >
                  <option value="">All Lines</option>
                  {["52", "53", "54", "55", "56", "57", "58", "59", "F-1", "F-2"].map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Emp ID (Temp)</label>
                <input
                  type="text"
                  placeholder="e.g. PAL000001"
                  value={empIdTemp}
                  onChange={(e) => setEmpIdTemp(e.target.value)}
                  className={filterClass}
                />
              </div>
              <div className="flex items-end gap-2 col-span-2 md:col-span-1">
                <button
                  onClick={handleSearch}
                  className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Search className="size-3.5" /> Search
                </button>
                <button
                  onClick={handleReset}
                  className="h-10 px-3 rounded-xl bg-muted hover:bg-muted/80 border border-border/40 text-muted-foreground transition-all"
                  title="Reset"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table
                className="w-full text-left text-xs border-collapse"
                style={{ minWidth: "1100px" }}
              >
                <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                  <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                    <th className="px-4 py-3.5 w-12 text-center border-r border-border/30">#</th>
                    <th className="px-4 py-3.5 w-20 text-center border-r border-border/30">
                      Execute
                    </th>
                    <th className="px-4 py-3.5 min-w-[110px] border-r border-border/30">Emp ID</th>
                    <th className="px-4 py-3.5 min-w-[100px] border-r border-border/30 text-center">
                      Status
                    </th>
                    <th className="px-4 py-3.5 min-w-[180px] border-r border-border/30">Name</th>
                    <th className="px-4 py-3.5 min-w-[80px] border-r border-border/30">Emp Type</th>
                    <th className="px-4 py-3.5 min-w-[140px] border-r border-border/30">
                      Department
                    </th>
                    <th className="px-4 py-3.5 min-w-[100px] border-r border-border/30">Section</th>
                    <th className="px-4 py-3.5 min-w-[120px] border-r border-border/30">
                      Designation
                    </th>
                    <th className="px-4 py-3.5 min-w-[90px] border-r border-border/30">
                      Job Nature
                    </th>
                    <th className="px-4 py-3.5 min-w-[70px] border-r border-border/30">Unit</th>
                    <th className="px-4 py-3.5 min-w-[60px] border-r border-border/30">Line</th>
                    <th className="px-4 py-3.5 min-w-[60px] border-r border-border/30">Grade</th>
                    <th className="px-4 py-3.5 min-w-[100px] border-r border-border/30">DOJ</th>
                    <th className="px-4 py-3.5 min-w-[100px] border-r border-border/30">DOB</th>
                    <th className="px-4 py-3.5 min-w-[120px]">Contact No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 text-foreground">
                  {filteredCandidates.map((item, idx) => {
                    const isEven = idx % 2 === 0;
                    const rowBgClass = isEven
                      ? "bg-white dark:bg-[#0f172a]"
                      : "bg-[#f8fafc] dark:bg-[#131d30]";

                    return (
                      <tr
                        key={item.empIdTemp}
                        className={`hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all cursor-pointer ${rowBgClass}`}
                      >
                        <td className="px-4 py-3 text-center text-slate-500 font-bold border-r border-border/30">
                          {idx + 1}
                        </td>
                        <td
                          className="px-4 py-3 text-center border-r border-border/30"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-center">
                            <button
                              onClick={() =>
                                router.navigate({
                                  to: `/recruitment-ie-assessment/${item.empIdTemp}`,
                                })
                              }
                              title="Start IE Assessment"
                              className="w-7 h-7 rounded border border-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition flex items-center justify-center shadow-2xs"
                            >
                              <PlayCircle className="size-4 text-primary" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-[#2563eb] border-r border-border/30">
                          {item.empIdTemp}
                        </td>
                        <td className="px-4 py-3 border-r border-border/30 text-center">
                          <StatusBadge status={item.assessStatus} />
                        </td>
                        <td className="px-4 py-3 border-r border-border/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30 shrink-0 shadow-2xs">
                              {item.nameEng
                                .split(" ")
                                .map((s: string) => s[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </div>
                            <span className="truncate max-w-[150px] font-bold text-slate-800 dark:text-slate-200">
                              {item.nameEng}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 border-r border-border/30">
                          <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded">
                            {item.employeeType}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-r border-border/30">{item.department}</td>
                        <td className="px-4 py-3 border-r border-border/30">{item.section}</td>
                        <td className="px-4 py-3 border-r border-border/30 font-semibold">
                          {item.designation}
                        </td>
                        <td className="px-4 py-3 border-r border-border/30 text-muted-foreground/80">
                          Permanent
                        </td>
                        <td className="px-4 py-3 border-r border-border/30">{item.unit}</td>
                        <td className="px-4 py-3 border-r border-border/30">{item.line}</td>
                        <td className="px-4 py-3 border-r border-border/30">
                          {item.grade ? (
                            <span className="font-black text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-1.5 py-0.5 rounded">
                              {item.grade}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/45">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 border-r border-border/30 font-mono text-[11px] text-muted-foreground/80">
                          {item.doj}
                        </td>
                        <td className="px-4 py-3 border-r border-border/30 font-mono text-[11px] text-muted-foreground/80">
                          {item.dob}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground/90">
                          {item.personalContact}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan={16} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <ClipboardCheck className="size-10 text-muted-foreground/30" />
                          <div className="text-sm font-bold text-muted-foreground">
                            No pending IE candidates
                          </div>
                        </div>
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
