import { useState, useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Sparkles, ChevronRight, Search, Eye, RotateCcw } from "lucide-react";
import { initializeRecruitmentMockData } from "@/lib/recruitment-mock-data";

export const Route = createFileRoute("/recruitment-assessment-list")({
  head: () => ({
    meta: [
      { title: "Assessment List — CRIPTON HRIS" },
      { name: "description", content: "List of all candidate assessments." },
    ],
  }),
  component: AssessmentListPage,
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

function AssessmentListPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<any[]>([]);

  // Search Filters
  const [assessStatus, setAssessStatus] = useState("All");
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
        setFilteredCandidates(parsed);
      }
    }
  }, []);

  // Dynamic values for smart filters
  const uniqueEmpTypes = Array.from(new Set(candidates.map((c) => c.employeeType).filter(Boolean)));
  const uniqueDepartments = Array.from(
    new Set(candidates.map((c) => c.department).filter(Boolean)),
  );
  const uniqueSections = Array.from(new Set(candidates.map((c) => c.section).filter(Boolean)));
  const uniqueDesignations = Array.from(
    new Set(candidates.map((c) => c.designation).filter(Boolean)),
  );
  const uniqueUnits = Array.from(new Set(candidates.map((c) => c.unit).filter(Boolean)));
  const uniqueLines = Array.from(new Set(candidates.map((c) => c.line).filter(Boolean)));

  const handleSearch = () => {
    const filtered = candidates.filter((c) => {
      if (assessStatus && assessStatus !== "All" && c.assessStatus !== assessStatus) return false;
      if (empIdTemp && !c.empIdTemp.toLowerCase().includes(empIdTemp.toLowerCase())) return false;
      if (empType && c.employeeType !== empType) return false;
      if (department && c.department !== department) return false;
      if (section && c.section !== section) return false;
      if (designation && c.designation !== designation) return false;
      if (unit && c.unit !== unit) return false;
      if (line && c.line !== line) return false;
      if (dojFrom && new Date(c.doj) < new Date(dojFrom)) return false;
      if (dojTo && new Date(c.doj) > new Date(dojTo)) return false;
      return true;
    });
    setFilteredCandidates(filtered);
  };

  const handleReset = () => {
    setAssessStatus("All");
    setDojFrom("");
    setDojTo("");
    setEmpType("");
    setDepartment("");
    setSection("");
    setDesignation("");
    setUnit("");
    setLine("");
    setEmpIdTemp("");
    setFilteredCandidates(candidates);
  };

  const handleView = (id: string) => {
    router.navigate({ to: `/recruitment-hr-assessment/${id}` });
  };

  const filterClass =
    "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all";
  const labelClass = "text-[10px] font-black text-muted-foreground uppercase tracking-wide";

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-5 max-w-[1800px] mx-auto w-full">
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
                <span className="text-primary font-black">Assessment List</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="size-5.5 text-primary" />
                <span>Assessment Search List</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="bg-muted border border-border/40 rounded-lg px-3 py-1.5 font-semibold text-muted-foreground">
                Total: <strong className="text-foreground">{candidates.length}</strong>
              </span>
              <span className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 font-semibold text-primary">
                Filtered: <strong>{filteredCandidates.length}</strong>
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-lg border border-border/80 shadow-xs p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Assess Status</label>
                <select
                  value={assessStatus}
                  onChange={(e) => setAssessStatus(e.target.value)}
                  className={filterClass}
                >
                  <option value="All">All Statuses</option>
                  <option value="IE Pending">IE Pending</option>
                  <option value="IE Submitted">IE Submitted</option>
                  <option value="HR Pending">HR Pending</option>
                  <option value="HR Approved">HR Approved</option>
                  <option value="HR Rejected">HR Rejected</option>
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
                  {uniqueEmpTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
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
                  {uniqueDepartments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
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
                  {uniqueSections.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
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
                  {uniqueDesignations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
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
                  {uniqueUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
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
                  {uniqueLines.map((l) => (
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
              <div className="space-y-1.5 flex items-end gap-2 col-span-2 md:col-span-1">
                <button
                  onClick={handleSearch}
                  className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Search className="size-3.5" /> Search
                </button>
                <button
                  onClick={handleReset}
                  className="h-10 px-3 rounded-xl bg-muted hover:bg-muted/80 border border-border/40 text-muted-foreground transition-all"
                  title="Reset filters"
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
                className="w-full text-left text-xs border-collapse whitespace-nowrap"
                style={{ minWidth: "1500px" }}
              >
                <thead className="text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                  <tr className="bg-[#f8fafc] dark:bg-[#0f172a]">
                    <th className="sticky left-0 bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[60px] min-w-[60px] max-w-[60px] text-center border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)]">
                      #
                    </th>
                    <th className="sticky left-[60px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] min-w-[110px] max-w-[110px] text-center border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)]">
                      Actions
                    </th>
                    <th className="sticky left-[170px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[110px] min-w-[110px] max-w-[110px] border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)]">
                      Emp ID
                    </th>
                    <th className="sticky left-[280px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[125px] min-w-[125px] max-w-[125px] border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] text-center">
                      Status
                    </th>
                    <th className="sticky left-[405px] bg-[#f8fafc] dark:bg-[#0f172a] px-5 py-4 w-[220px] min-w-[220px] max-w-[220px] border-r border-border/40 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      Name (Eng)
                    </th>
                    <th className="px-5 py-4 min-w-[160px] border-r border-border/30">
                      Name (Bng)
                    </th>
                    <th className="px-5 py-4 min-w-[100px] border-r border-border/30">Emp Type</th>
                    <th className="px-5 py-4 min-w-[150px] border-r border-border/30">
                      Department
                    </th>
                    <th className="px-5 py-4 min-w-[120px] border-r border-border/30">Section</th>
                    <th className="px-5 py-4 min-w-[140px] border-r border-border/30">
                      Designation
                    </th>
                    <th className="px-5 py-4 min-w-[110px] border-r border-border/30">
                      Job Nature
                    </th>
                    <th className="px-5 py-4 min-w-[80px] border-r border-border/30">Unit</th>
                    <th className="px-5 py-4 min-w-[80px] border-r border-border/30">Line</th>
                    <th className="px-5 py-4 min-w-[80px] border-r border-border/30">Grade</th>
                    <th className="px-5 py-4 min-w-[120px] border-r border-border/30">DOJ</th>
                    <th className="px-5 py-4 min-w-[120px] border-r border-border/30">DOB</th>
                    <th className="px-5 py-4 min-w-[100px] border-r border-border/30">Shift</th>
                    <th className="px-5 py-4 min-w-[130px] border-r border-border/30">
                      Contact No
                    </th>
                    <th className="px-5 py-4 min-w-[130px] border-r border-border/30">
                      Emergency No
                    </th>
                    <th className="px-5 py-4 min-w-[200px] border-r border-border/30">
                      Present Address
                    </th>
                    <th className="px-5 py-4 min-w-[200px] border-r border-border/30">
                      Permanent Address
                    </th>
                    <th className="px-5 py-4 min-w-[160px] text-blue-500">Created By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 text-foreground">
                  {filteredCandidates.map((item, idx) => {
                    const isEven = idx % 2 === 0;
                    const rowBgClass = isEven
                      ? "bg-white dark:bg-[#0f172a]"
                      : "bg-[#f8fafc] dark:bg-[#131d30]";
                    const stickyCellBgClass = isEven
                      ? "bg-white dark:bg-[#0f172a] group-hover:bg-[#f1f5f9] dark:group-hover:bg-[#1c283d]"
                      : "bg-[#f8fafc] dark:bg-[#131d30] group-hover:bg-[#f1f5f9] dark:group-hover:bg-[#1c283d]";

                    return (
                      <tr
                        key={item.empIdTemp}
                        className={`group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all cursor-pointer ${rowBgClass}`}
                        onClick={() => handleView(item.empIdTemp)}
                      >
                        <td
                          className={`sticky left-0 ${stickyCellBgClass} px-5 py-3.5 text-center text-slate-500 font-bold border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[60px] min-w-[60px] max-w-[60px] transition-all`}
                        >
                          {idx + 1}
                        </td>
                        <td
                          className={`sticky left-[60px] ${stickyCellBgClass} px-5 py-3.5 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[110px] min-w-[110px] max-w-[110px] transition-all`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleView(item.empIdTemp)}
                              title="View details"
                              className="w-7 h-7 rounded border border-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition flex items-center justify-center shadow-2xs"
                            >
                              <Eye className="size-3.5 text-primary" />
                            </button>
                          </div>
                        </td>
                        <td
                          className={`sticky left-[170px] ${stickyCellBgClass} px-5 py-3.5 font-bold text-[#2563eb] border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[110px] min-w-[110px] max-w-[110px] transition-all`}
                        >
                          {item.empIdTemp}
                        </td>
                        <td
                          className={`sticky left-[280px] ${stickyCellBgClass} px-5 py-3.5 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[125px] min-w-[125px] max-w-[125px] text-center transition-all`}
                        >
                          <StatusBadge status={item.assessStatus} />
                        </td>
                        <td
                          className={`sticky left-[405px] ${stickyCellBgClass} px-5 py-3.5 border-r border-border/40 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[220px] min-w-[220px] max-w-[220px] transition-all`}
                        >
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
                        <td className="px-5 py-3.5 text-foreground/75 font-medium border-r border-border/30">
                          {item.nameBng || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-foreground/80 font-medium border-r border-border/30">
                          <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded">
                            {item.employeeType}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-foreground/80 font-medium border-r border-border/30">
                          {item.department}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground/90 font-medium border-r border-border/30">
                          {item.section}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-foreground border-r border-border/30">
                          {item.designation}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground/80 font-medium border-r border-border/30">
                          Permanent
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground/80 font-medium border-r border-border/30">
                          {item.unit}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground/80 font-medium border-r border-border/30">
                          {item.line}
                        </td>
                        <td className="px-5 py-3.5 border-r border-border/30">
                          {item.grade ? (
                            <span className="font-black text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-1.5 py-0.5 rounded">
                              {item.grade}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/45">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-[11px] text-muted-foreground/80 font-medium border-r border-border/30">
                          {item.doj}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-[11px] text-muted-foreground/80 font-medium border-r border-border/30">
                          {item.dob}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground/90 font-medium border-r border-border/30">
                          General
                        </td>
                        <td className="px-5 py-3.5 font-mono text-[11px] text-muted-foreground/90 font-medium border-r border-border/30">
                          {item.personalContact}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground/45 border-r border-border/30">
                          —
                        </td>
                        <td
                          className="px-5 py-3.5 text-[11px] text-muted-foreground/80 font-medium truncate max-w-[150px] border-r border-border/30"
                          title="Road-09, Sector-04, Uttara, Dhaka"
                        >
                          Road-09, Sector-04, Uttara, Dhaka
                        </td>
                        <td
                          className="px-5 py-3.5 text-[11px] text-muted-foreground/80 font-medium truncate max-w-[150px] border-r border-border/30"
                          title="Raujan, Chattogram"
                        >
                          Raujan, Chattogram
                        </td>
                        <td className="px-5 py-3.5 text-[10px] text-muted-foreground/80 font-medium">
                          MTS 30/03/2026
                        </td>
                      </tr>
                    );
                  })}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan={22} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Eye className="size-10 text-muted-foreground/30" />
                          <div className="text-sm font-bold text-muted-foreground">
                            No records found
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
