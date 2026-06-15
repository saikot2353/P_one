import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileSpreadsheet, Printer, FileDown, Plus, Search, Trash2, Edit2, CheckCircle, ChevronRight, BarChart3, X
} from "lucide-react";

export const Route = createFileRoute("/kpi-task-name")({
  head: () => ({
    meta: [
      { title: "KPI Task Name Registry — CRIPTON" },
      { name: "description", content: "Management and configuration of Key Performance Indicators (KPIs) and operational criteria." },
    ],
  }),
  component: KpiTaskNamePage,
});

interface KpiTask {
  id: string;
  department: string;
  criteriaName: string;
  criteriaDetail: string;
  status: "Active" | "Inactive";
}

const initialTasks: KpiTask[] = [
  {
    id: "KPI-001",
    department: "All Departments",
    criteriaName: "Decision Making/ Problem Solving",
    criteriaDetail: "Measures effectiveness in understanding problems and making timely practical decisions, best suited for the business.",
    status: "Active"
  },
  {
    id: "KPI-002",
    department: "All Departments",
    criteriaName: "Independent Action",
    criteriaDetail: "Takes initiative, solves problems independently, makes decisions without needing step-by-step guidance, seeks solutions instead of waiting for instructions, accepts responsibility for actions taken.",
    status: "Active"
  },
  {
    id: "KPI-003",
    department: "All Departments",
    criteriaName: "Leadership",
    criteriaDetail: "Influence, guide, and support others toward achieving goals — whether in a formal leadership role or through informal influence.",
    status: "Active"
  },
  {
    id: "KPI-004",
    department: "All Departments",
    criteriaName: "Dependability",
    criteriaDetail: "Delivers quality work on time, can be trusted to follow instructions accurately, requires minimal supervision, is consistent and reliable in their duties, is accountable for their actions and mistakes.",
    status: "Active"
  },
  {
    id: "KPI-005",
    department: "All Departments",
    criteriaName: "Teamwork",
    criteriaDetail: "The ability to inspire subordinates & others with collaboration effort to achieve a common goal / complete a task.",
    status: "Active"
  },
  {
    id: "KPI-006",
    department: "All Departments",
    criteriaName: "Verbal & Written Communication",
    criteriaDetail: "The ability to communicate effectively & efficiently within the organization & out of organization.",
    status: "Active"
  },
  {
    id: "KPI-007",
    department: "All Departments",
    criteriaName: "Knowledge of law & SOP",
    criteriaDetail: "KPI evaluates how well an employee understands and applies relevant legal regulations, industry standards, and internal procedures in their daily work.",
    status: "Active"
  },
  {
    id: "KPI-008",
    department: "All Departments",
    criteriaName: "Loyalty of company",
    criteriaDetail: "KPI measures how committed an employee is to the organization's mission, values, and long-term success.",
    status: "Active"
  }
];

function KpiTaskNamePage() {
  const [tasks, setTasks] = useState<KpiTask[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<KpiTask | null>(null);

  // Form states
  const [dept, setDept] = useState("All Departments");
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.criteriaName.toLowerCase().includes(q) ||
          t.criteriaDetail.toLowerCase().includes(q) ||
          t.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tasks, searchQuery]);

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !detail.trim()) {
      alert("Please fill in all fields!");
      return;
    }

    if (editTask) {
      setTasks(prev => prev.map(t => t.id === editTask.id ? { ...t, department: dept, criteriaName: name, criteriaDetail: detail, status } : t));
    } else {
      const newTask: KpiTask = {
        id: `KPI-${String(tasks.length + 1).padStart(3, "0")}`,
        department: dept,
        criteriaName: name,
        criteriaDetail: detail,
        status
      };
      setTasks(prev => [newTask, ...prev]);
    }

    // Reset
    setIsModalOpen(false);
    setEditTask(null);
    setName("");
    setDetail("");
    setDept("All Departments");
    setStatus("Active");
  };

  const handleEdit = (task: KpiTask) => {
    setEditTask(task);
    setName(task.criteriaName);
    setDetail(task.criteriaDetail);
    setDept(task.department);
    setStatus(task.status);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this KPI criteria from the registry?")) {
      setTasks(prev => prev.filter(t => t.id !== id));
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

          {/* Breadcrumbs and Title Card */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">KPI</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Task Name</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <BarChart3 className="size-5.5 text-primary animate-pulse" />
                <span>KPI Task Name Setup</span>
              </h1>
            </div>

            <button
              onClick={() => {
                setEditTask(null);
                setName("");
                setDetail("");
                setDept("All Departments");
                setStatus("Active");
                setIsModalOpen(true);
              }}
              className="h-9 px-5 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider"
            >
              <Plus className="size-4" />
              <span>Add KPI Criteria</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
            {[
              { label: "TOTAL CRITERIA", val: `${tasks.length} KPIs`, desc: "Active performance metrics", color: "text-primary bg-primary/5 border-primary/10" },
              { label: "ALL DEPARTMENTS", val: "Shared", desc: "Applicable company-wide", color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" },
              { label: "ACTIVE CRITERIA", val: `${tasks.filter(t => t.status === "Active").length} Metrics`, desc: "Live in evaluation workflows", color: "text-blue-500 bg-blue-500/5 border-blue-500/10" }
            ].map((st, idx) => (
              <div key={idx} className={`p-4 rounded-lg border bg-card ${st.color} shadow-xs space-y-1 transition duration-200 hover:scale-[1.01]`}>
                <span className="text-[9px] font-black tracking-wider uppercase opacity-75">{st.label}</span>
                <div className="text-xl font-black">{st.val}</div>
                <div className="text-[10px] opacity-60 font-semibold">{st.desc}</div>
              </div>
            ))}
          </div>

          {/* Spreadsheet Table Container */}
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
                    placeholder="Search KPI name, details..."
                    className="w-full h-8 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Table layout matching Image 1 */}
            <div className="overflow-x-auto border border-border/50 rounded-xl">
              <table className="w-full border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap">
                    <th className="px-4 py-3 font-extrabold text-center w-24 border-r border-border/30">Status</th>
                    <th className="px-4 py-3 font-extrabold w-48 border-r border-border/30">Department</th>
                    <th className="px-4 py-3 font-extrabold w-64 border-r border-border/30">Criteria Name</th>
                    <th className="px-4 py-3 font-extrabold border-r border-border/30">Criteria Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 font-sans text-xs">
                  {filteredTasks.map((row) => (
                    <tr key={row.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-75">
                      <td className="px-4 py-3.5 border-r border-border/20 text-center print:hidden flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(row)}
                          className="p-1 hover:bg-primary/10 text-amber-500 rounded transition"
                          title="Edit Criteria"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="p-1 hover:bg-rose-500/10 text-rose-500 rounded transition"
                          title="Delete Criteria"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                        <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[9.5px] ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}>
                          <span>{row.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-foreground/80 border-r border-border/20">{row.department}</td>
                      <td className="px-4 py-3.5 font-black text-foreground border-r border-border/20">{row.criteriaName}</td>
                      <td className="px-4 py-3.5 text-muted-foreground leading-relaxed border-r border-border/20">{row.criteriaDetail}</td>
                    </tr>
                  ))}

                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-16 text-center text-muted-foreground font-semibold">
                        No performance criteria found matching query parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider pt-2">
              <span>Showing 1 to {filteredTasks.length} of {filteredTasks.length} entries</span>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 rounded bg-muted hover:bg-muted/80">Previous</button>
                <span className="px-3 py-1 rounded bg-primary text-white">1</span>
                <button className="px-3 py-1 rounded bg-muted hover:bg-muted/80">Next</button>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Add/Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5">
              <BarChart3 className="size-5 text-primary" />
              <span>{editTask ? "Edit Performance KPI" : "Create KPI Criteria"}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Target Department</label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none"
                  >
                    <option value="All Departments">All Departments</option>
                    <option value="Business Innovation">Business Innovation</option>
                    <option value="Project Resource & Strategy">Project Resource & Strategy</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Operations & HR">Operations & HR</option>
                  </select>
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Criteria Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Technical Problem Solving"
                  className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Criteria Detail *</label>
                <textarea
                  required
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="Comprehensive description of how performance in this criteria is graded..."
                  className="w-full h-24 p-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card resize-none"
                />
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
                  {editTask ? "Save Changes" : "Save Criteria"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
