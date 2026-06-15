import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileSpreadsheet, Printer, FileDown, Plus, Search, Trash2, Edit2, ChevronRight, SlidersHorizontal, X
} from "lucide-react";

export const Route = createFileRoute("/kpi-setting")({
  head: () => ({
    meta: [
      { title: "KPI Setting point configurations — CRIPTON" },
      { name: "description", content: "Grade settings, appraisal bands, and point range definitions." },
    ],
  }),
  component: KpiSettingPage,
});

interface KpiSetting {
  id: string;
  pointFrom: number;
  pointTo: number;
  assessment: string;
  status: "Active" | "Inactive";
}

const initialSettings: KpiSetting[] = [
  { id: "SET-001", pointFrom: 95, pointTo: 100, assessment: "Very Excellent", status: "Active" },
  { id: "SET-002", pointFrom: 80, pointTo: 94, assessment: "Excellent", status: "Active" },
  { id: "SET-003", pointFrom: 60, pointTo: 79, assessment: "Very Good", status: "Active" },
  { id: "SET-004", pointFrom: 40, pointTo: 59, assessment: "Good", status: "Active" },
  { id: "SET-005", pointFrom: 21, pointTo: 39, assessment: "Fair", status: "Active" },
  { id: "SET-006", pointFrom: 11, pointTo: 20, assessment: "Poor", status: "Active" },
  { id: "SET-007", pointFrom: 1, pointTo: 10, assessment: "Very Poor", status: "Active" }
];

function KpiSettingPage() {
  const [settings, setSettings] = useState<KpiSetting[]>(initialSettings);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSetting, setEditSetting] = useState<KpiSetting | null>(null);

  // Form states
  const [pointFrom, setPointFrom] = useState<number>(0);
  const [pointTo, setPointTo] = useState<number>(0);
  const [assessment, setAssessment] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Filter
  const filteredSettings = useMemo(() => {
    return settings.filter(s => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.assessment.toLowerCase().includes(q) ||
          s.pointFrom.toString().includes(q) ||
          s.pointTo.toString().includes(q)
        );
      }
      return true;
    });
  }, [settings, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pointFrom < 0 || pointTo <= pointFrom) {
      alert("Invalid point range constraints!");
      return;
    }
    if (!assessment.trim()) {
      alert("Please define the assessment grade label!");
      return;
    }

    if (editSetting) {
      setSettings(prev => prev.map(s => s.id === editSetting.id ? { ...s, pointFrom, pointTo, assessment, status } : s));
    } else {
      const newRecord: KpiSetting = {
        id: `SET-${String(settings.length + 1).padStart(3, "0")}`,
        pointFrom,
        pointTo,
        assessment,
        status
      };
      setSettings(prev => [newRecord, ...prev]);
    }

    setIsModalOpen(false);
    setEditSetting(null);
    setPointFrom(0);
    setPointTo(0);
    setAssessment("");
    setStatus("Active");
  };

  const handleEdit = (s: KpiSetting) => {
    setEditSetting(s);
    setPointFrom(s.pointFrom);
    setPointTo(s.pointTo);
    setAssessment(s.assessment);
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this point threshold configuration?")) {
      setSettings(prev => prev.filter(s => s.id !== id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">

          {/* Breadcrumbs */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">KPI</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">KPI Setting</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <SlidersHorizontal className="size-5.5 text-primary animate-pulse" />
                <span>KPI Band Settings</span>
              </h1>
            </div>

            <button
              onClick={() => {
                setEditSetting(null);
                setPointFrom(0);
                setPointTo(0);
                setAssessment("");
                setStatus("Active");
                setIsModalOpen(true);
              }}
              className="h-9 px-5 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider"
            >
              <Plus className="size-4" />
              <span>Add Grade Setup</span>
            </button>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
            {[
              { label: "GRADE BANDS", val: `${settings.length} Ranges`, desc: "Appraisal thresholds", color: "text-primary bg-primary/5 border-primary/10" },
              { label: "MAX POINTS LIMIT", val: "100 Points", desc: "Highest evaluation index", color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" },
              { label: "HIGHEST RATING", val: "Very Excellent", desc: "Grade score >= 95", color: "text-blue-500 bg-blue-500/5 border-blue-500/10" }
            ].map((st, idx) => (
              <div key={idx} className={`p-4 rounded-lg border bg-card ${st.color} shadow-xs space-y-1 transition duration-200 hover:scale-[1.01]`}>
                <span className="text-[9px] font-black tracking-wider uppercase opacity-75">{st.label}</span>
                <div className="text-xl font-black">{st.val}</div>
                <div className="text-[10px] opacity-60 font-semibold">{st.desc}</div>
              </div>
            ))}
          </div>

          {/* Grade configuration list */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">

            {/* Utilities Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4 print:hidden">
              <div className="flex items-center gap-1.5 select-none">
                <button className="h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition">
                  <FileSpreadsheet className="size-3.5 text-emerald-500" />
                  <span>EXCEL</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition"
                >
                  <Printer className="size-3.5 text-blue-500" />
                  <span>PRINT</span>
                </button>
                <button className="h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition">
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Text Search */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Search:</span>
                <div className="relative w-56 sm:w-64">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search grade band, point limit..."
                    className="w-full h-8 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Table layout matching Image 2 */}
            <div className="overflow-x-auto border border-border/50 rounded-xl">
              <table className="w-full border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap">
                    <th className="px-4 py-3 font-extrabold text-center w-24 border-r border-border/30">Status</th>
                    <th className="px-4 py-3 font-extrabold w-48 text-center border-r border-border/30">Point From</th>
                    <th className="px-4 py-3 font-extrabold w-48 text-center border-r border-border/30">Point To</th>
                    <th className="px-4 py-3 font-extrabold border-r border-border/30">Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 font-sans text-xs">
                  {filteredSettings.map((row) => (
                    <tr key={row.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-75">
                      <td className="px-4 py-3.5 border-r border-border/20 text-center print:hidden flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(row)}
                          className="p-1 hover:bg-primary/10 text-amber-500 rounded transition"
                          title="Edit Grade Setup"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="p-1 hover:bg-rose-500/10 text-rose-500 rounded transition"
                          title="Delete Configuration"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                        <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[9.5px] ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}>
                          <span>{row.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold font-mono text-foreground/80 border-r border-border/20">{row.pointFrom}</td>
                      <td className="px-4 py-3.5 text-center font-bold font-mono text-foreground border-r border-border/20">{row.pointTo}</td>
                      <td className="px-4 py-3.5 font-black text-foreground border-r border-border/20">{row.assessment}</td>
                    </tr>
                  ))}

                  {filteredSettings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-16 text-center text-muted-foreground font-semibold">
                        No point bands setup found matching constraints.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider pt-2">
              <span>Showing 1 to {filteredSettings.length} of {filteredSettings.length} entries</span>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 rounded bg-muted hover:bg-muted/80">Previous</button>
                <span className="px-3 py-1 rounded bg-primary text-white">1</span>
                <button className="px-3 py-1 rounded bg-muted hover:bg-muted/80">Next</button>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5">
              <SlidersHorizontal className="size-5 text-primary" />
              <span>{editSetting ? "Edit Point Band Grade" : "Add Grade Range Setup"}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Point From *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={pointFrom}
                    onChange={(e) => setPointFrom(parseInt(e.target.value) || 0)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-mono font-bold outline-none focus:border-primary focus:bg-card transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Point To *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={pointTo}
                    onChange={(e) => setPointTo(parseInt(e.target.value) || 0)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-mono font-bold outline-none focus:border-primary focus:bg-card transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Grade Label *</label>
                  <input
                    type="text"
                    required
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    placeholder="e.g. Highly Promising"
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/30 mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-6 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider"
                >
                  {editSetting ? "Save Changes" : "Save Threshold"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
