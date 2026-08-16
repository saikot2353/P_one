import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Activity,
  CalendarDays,
  CalendarRange,
  Users,
  AlertCircle,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { type KpiCycle, loadKpiCycles, saveKpiCycles, DEPARTMENT_LIST } from "@/lib/kpi-data";
import { MultiSelect } from "@/components/ui/multi-select";

export const Route = createFileRoute("/kpi-cycles")({
  head: () => ({
    meta: [
      { title: "KPI Cycles — CRIPTON" },
      {
        name: "description",
        content: "Manage appraisal periods and performance evaluation cycles.",
      },
    ],
  }),
  component: KpiCyclesPage,
});

export const EMPLOYEE_LIST = [
  "All Employees",
  "2022035599 - Dipon Saha",
  "2023044017 - Md. Rejaul Karim",
  "2021028542 - Zakir Hossain",
  "2024052333 - Mohammad Rahatul Islam",
  "2026000001 - New Employee",
  "2023043910 - Tahmid Afsar Shapno",
  "2024049326 - Hanif Uddin",
  "2023045044 - Sultan Ahmed"
];

function KpiCyclesPage() {
  const [cycles, setCycles] = useState<KpiCycle[]>(() => loadKpiCycles());
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [form, setForm] = useState<{
    name: string;
    type: KpiCycle["type"];
    startDate: string;
    endDate: string;
    status: KpiCycle["status"];
    departments: string[];
    employees: string[];
  }>({
    name: "",
    type: "Annual",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0],
    status: "Draft",
    departments: ["All Departments"],
    employees: ["All Employees"],
  });

  const filteredCycles = useMemo(() => {
    let list = cycles;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [cycles, searchQuery]);

  const activeCount = cycles.filter((c) => c.status === "Active").length;
  const draftCount = cycles.filter((c) => c.status === "Draft").length;
  const closedCount = cycles.filter((c) => c.status === "Closed").length;

  const openAddModal = () => {
    setEditId(null);
    setForm({
      name: "",
      type: "Annual",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      status: "Draft",
      departments: ["All Departments"],
      employees: ["All Employees"],
    });
    setShowModal(true);
  };

  const openEditModal = (item: KpiCycle) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      type: item.type,
      startDate: item.startDate,
      endDate: item.endDate,
      status: item.status,
      departments: [...item.departments],
      employees: item.employees ? [...item.employees] : ["All Employees"],
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.startDate || !form.endDate) {
      alert("Please fill in all required fields!");
      return;
    }

    if (new Date(form.startDate) > new Date(form.endDate)) {
      alert("Start date cannot be after end date!");
      return;
    }

    let updated: KpiCycle[];
    if (editId) {
      const existing = cycles.find((c) => c.id === editId);
      updated = cycles.map((c) =>
        c.id === editId
          ? {
              ...c,
              ...form,
              totalEmployees: existing ? existing.totalEmployees : 0,
              completedCount: existing ? existing.completedCount : 0,
            }
          : c,
      );
    } else {
      const newId = `CYC-${String(cycles.length + 1).padStart(3, "0")}`;
      updated = [
        ...cycles,
        {
          id: newId,
          ...form,
          totalEmployees: 0, // Would normally be calculated based on departments
          completedCount: 0,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ];
    }
    setCycles(updated);
    saveKpiCycles(updated);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const updated = cycles.filter((c) => c.id !== id);
    setCycles(updated);
    saveKpiCycles(updated);
    setDeleteConfirm(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Draft":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Closed":
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
      case "Archived":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Annual":
        return <CalendarRange className="size-4" />;
      case "Mid-Year":
        return <Activity className="size-4" />;
      default:
        return <CalendarDays className="size-4" />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">KPI</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Assessment Cycles</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <CalendarRange className="size-5.5 text-primary" />
                <span>KPI Assessment Cycles</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Manage performance appraisal periods, mid-year reviews, and probation cycles
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="h-9 px-5 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider shrink-0"
            >
              <Plus className="size-4" />
              <span>Create Cycle</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs">
              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">
                Total Cycles
              </span>
              <p className="text-2xl font-black text-foreground mt-1">{cycles.length}</p>
            </div>
            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs">
              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">
                Active Currently
              </span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
            </div>
            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs">
              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">
                Draft / Planning
              </span>
              <p className="text-2xl font-black text-amber-600 mt-1">{draftCount}</p>
            </div>
            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs">
              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">
                Closed
              </span>
              <p className="text-2xl font-black text-slate-600 mt-1">{closedCount}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cycles by name..."
                className="w-full h-9 pl-8 pr-3 rounded-lg bg-muted/50 border border-border/40 text-xs font-semibold outline-none focus:border-[#1e88e5] transition"
              />
            </div>
          </div>

          {/* Cycle Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredCycles.map((cycle) => {
              const progress =
                cycle.totalEmployees > 0
                  ? Math.round((cycle.completedCount / cycle.totalEmployees) * 100)
                  : 0;

              return (
                <div
                  key={cycle.id}
                  className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden flex flex-col transition-all hover:border-[#1e88e5]/40 hover:shadow-md"
                >
                  <div className="p-5 border-b border-border/30 flex items-start justify-between bg-muted/10">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-xl grid place-items-center ${getStatusColor(cycle.status)}`}
                      >
                        {getTypeIcon(cycle.type)}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-foreground">{cycle.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          <span>{cycle.id}</span>
                          <span>•</span>
                          <span>{cycle.type}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase border ${getStatusColor(cycle.status)}`}
                    >
                      {cycle.status === "Active" && <PlayCircle className="size-3" />}
                      {cycle.status === "Closed" && <CheckCircle2 className="size-3" />}
                      {cycle.status}
                    </span>
                  </div>

                  <div className="p-5 flex-1 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                          Timeline
                        </span>
                        <span className="text-xs font-mono font-semibold text-foreground">
                          {cycle.startDate} to {cycle.endDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                          Departments
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          {cycle.departments.includes("All Departments")
                            ? "Organization Wide"
                            : `${cycle.departments.length} Departments`}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Users className="size-3" /> Progress ({cycle.completedCount} /{" "}
                          {cycle.totalEmployees})
                        </span>
                        <span className={progress === 100 ? "text-emerald-500" : "text-[#1e88e5]"}>
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/50 border border-border/30 overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-1000 ${progress === 100 ? "bg-emerald-500" : "bg-[#1e88e5]"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border-t border-border/30 bg-muted/20 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(cycle)}
                      className="h-8 px-4 rounded-lg bg-card border border-border/60 hover:bg-muted text-xs font-bold text-foreground transition flex items-center gap-1.5"
                    >
                      <Edit3 className="size-3" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(cycle.id)}
                      className="h-8 px-3 rounded-lg border border-transparent hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition grid place-items-center"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredCycles.length === 0 && (
              <div className="col-span-1 lg:col-span-2 py-12 text-center text-xs font-bold text-muted-foreground border border-border/40 border-dashed rounded-xl">
                No appraisal cycles found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-xl border border-border/80 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition z-10"
            >
              <X className="size-5" />
            </button>

            <div className="p-6 border-b border-border/30">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <CalendarRange className="size-5 text-primary" />
                {editId ? "Edit Appraisal Cycle" : "Create New Cycle"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Cycle Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Annual Performance Review 2026"
                  className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, type: e.target.value as KpiCycle["type"] }))
                    }
                    className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
                  >
                    <option value="Annual">Annual</option>
                    <option value="Mid-Year">Mid-Year</option>
                    <option value="Probation">Probation</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Status *
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, status: e.target.value as KpiCycle["status"] }))
                    }
                    className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold font-mono outline-none focus:border-[#1e88e5]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold font-mono outline-none focus:border-[#1e88e5]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Applicable Departments *
                </label>
                <MultiSelect
                  options={DEPARTMENT_LIST.map(d => ({ value: d, label: d }))}
                  selected={form.departments}
                  onChange={(selected) => {
                    if (selected.length === 0) setForm(p => ({ ...p, departments: ["All Departments"] }));
                    else if (selected[selected.length - 1] === "All Departments" && !form.departments.includes("All Departments")) {
                      setForm(p => ({ ...p, departments: ["All Departments"] }));
                    } else if (selected.includes("All Departments") && selected.length > 1) {
                      setForm(p => ({ ...p, departments: selected.filter(v => v !== "All Departments") }));
                    } else {
                      setForm(p => ({ ...p, departments: selected }));
                    }
                  }}
                  placeholder="Select Departments..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Applicable Employees *
                </label>
                <MultiSelect
                  options={EMPLOYEE_LIST.map(emp => ({ value: emp, label: emp }))}
                  selected={form.employees}
                  onChange={(selected) => {
                    if (selected.length === 0) setForm(p => ({ ...p, employees: ["All Employees"] }));
                    else if (selected[selected.length - 1] === "All Employees" && !form.employees.includes("All Employees")) {
                      setForm(p => ({ ...p, employees: ["All Employees"] }));
                    } else if (selected.includes("All Employees") && selected.length > 1) {
                      setForm(p => ({ ...p, employees: selected.filter(v => v !== "All Employees") }));
                    } else {
                      setForm(p => ({ ...p, employees: selected }));
                    }
                  }}
                  placeholder="Select Employees..."
                />
              </div>

              {form.status === "Active" && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span className="text-[11px] font-semibold">
                    Activating this cycle will make it available for employees to submit
                    self-assessments and managers to begin evaluations.
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-9 px-5 border border-border/40 text-muted-foreground font-bold text-xs rounded-lg hover:bg-muted/50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase tracking-wider"
                >
                  {editId ? "Update Cycle" : "Create Cycle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-xl rounded-xl border border-border/80 shadow-2xl p-6 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-500/10 grid place-items-center">
                <Trash2 className="size-5 text-red-500" />
              </div>
              <div>
                <h4 className="text-sm font-black text-foreground">Delete Cycle</h4>
                <p className="text-[11px] text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="h-8 px-4 border border-border/40 text-muted-foreground font-bold text-xs rounded-lg hover:bg-muted/50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="h-8 px-4 bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs rounded-lg shadow-sm transition uppercase"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
