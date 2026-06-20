import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Plus, Search, Edit3, Trash2, X, CheckCircle2,
  BarChart3, AlertCircle, Target, Layers, Filter
} from "lucide-react";
import {
  type KpiCriteria, type ScoringRubric,
  loadKpiCriteria, saveKpiCriteria,
  getCategoryBg, CATEGORY_LIST, DEPARTMENT_LIST
} from "@/lib/kpi-data";

export const Route = createFileRoute("/kpi-task-name")({
  head: () => ({
    meta: [
      { title: "KPI Criteria Setup — CRIPTON" },
      { name: "description", content: "Configure weighted KPI evaluation criteria with categories, scoring rubrics, and department assignments." },
    ],
  }),
  component: KpiCriteriaSetupPage,
});

function KpiCriteriaSetupPage() {
  const [criteria, setCriteria] = useState<KpiCriteria[]>(() => loadKpiCriteria());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<{
    category: KpiCriteria["category"];
    criteriaName: string;
    criteriaDetail: string;
    weight: number;
    maxScore: number;
    scoringRubric: ScoringRubric;
    department: string;
    status: "Active" | "Inactive";
  }>({
    category: "Core Competency",
    criteriaName: "",
    criteriaDetail: "",
    weight: 5,
    maxScore: 10,
    scoringRubric: { excellent: "", good: "", average: "", poor: "" },
    department: "All Departments",
    status: "Active"
  });

  // Computed
  const totalWeight = useMemo(() => criteria.reduce((s, c) => s + c.weight, 0), [criteria]);
  const activeCount = useMemo(() => criteria.filter(c => c.status === "Active").length, [criteria]);

  const filtered = useMemo(() => {
    let list = criteria;
    if (activeCategory !== "All") {
      list = list.filter(c => c.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.criteriaName.toLowerCase().includes(q) ||
        c.criteriaDetail.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [criteria, activeCategory, searchQuery]);

  // Category weight breakdown
  const categoryWeights = useMemo(() => {
    const map: Record<string, number> = {};
    CATEGORY_LIST.forEach(cat => {
      map[cat] = criteria.filter(c => c.category === cat).reduce((s, c) => s + c.weight, 0);
    });
    return map;
  }, [criteria]);

  const openAddModal = () => {
    setEditId(null);
    setForm({
      category: "Core Competency", criteriaName: "", criteriaDetail: "",
      weight: 5, maxScore: 10,
      scoringRubric: { excellent: "", good: "", average: "", poor: "" },
      department: "All Departments", status: "Active"
    });
    setShowModal(true);
  };

  const openEditModal = (item: KpiCriteria) => {
    setEditId(item.id);
    setForm({
      category: item.category,
      criteriaName: item.criteriaName,
      criteriaDetail: item.criteriaDetail,
      weight: item.weight,
      maxScore: item.maxScore,
      scoringRubric: { ...item.scoringRubric },
      department: item.department,
      status: item.status
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.criteriaName.trim() || !form.criteriaDetail.trim()) {
      alert("Please fill in all required fields!");
      return;
    }

    let updated: KpiCriteria[];
    if (editId) {
      updated = criteria.map(c => c.id === editId ? { ...c, ...form } : c);
    } else {
      const newId = `KPI-${String(criteria.length + 1).padStart(3, "0")}`;
      updated = [...criteria, { id: newId, ...form }];
    }
    setCriteria(updated);
    saveKpiCriteria(updated);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const updated = criteria.filter(c => c.id !== id);
    setCriteria(updated);
    saveKpiCriteria(updated);
    setDeleteConfirm(null);
  };

  const handleToggleStatus = (id: string) => {
    const updated = criteria.map(c => c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" as const : "Active" as const } : c);
    setCriteria(updated);
    saveKpiCriteria(updated);
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
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">KPI</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Criteria Setup</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <Target className="size-5.5 text-primary" />
                <span>KPI Criteria Setup</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">Configure weighted evaluation criteria with scoring rubrics and category assignments</p>
            </div>

            <button
              onClick={openAddModal}
              className="h-9 px-5 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider shrink-0"
            >
              <Plus className="size-4" />
              <span>Add Criteria</span>
            </button>
          </div>

          {/* Weight Distribution Summary */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                Weight Distribution
              </h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black px-3 py-1 rounded-lg border ${totalWeight === 100
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-red-500/10 text-red-600 border-red-500/20 animate-pulse"
                  }`}>
                  Total: {totalWeight}%
                </span>
                {totalWeight !== 100 && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    Must equal 100%
                  </span>
                )}
              </div>
            </div>

            {/* Visual bar */}
            <div className="h-8 rounded-lg overflow-hidden flex bg-muted/30 border border-border/30">
              {CATEGORY_LIST.map(cat => {
                const w = categoryWeights[cat] || 0;
                if (w === 0) return null;
                const colors: Record<string, string> = {
                  "Core Competency": "bg-blue-500",
                  "Technical": "bg-violet-500",
                  "Behavioral": "bg-amber-500",
                  "Organizational": "bg-emerald-500"
                };
                return (
                  <div
                    key={cat}
                    className={`${colors[cat]} flex items-center justify-center text-white text-[10px] font-black transition-all duration-500`}
                    style={{ width: `${Math.min(w, 100)}%` }}
                    title={`${cat}: ${w}%`}
                  >
                    {w >= 8 ? `${cat.split(" ")[0]} ${w}%` : `${w}%`}
                  </div>
                );
              })}
            </div>

            {/* Category cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORY_LIST.map(cat => {
                const w = categoryWeights[cat] || 0;
                const count = criteria.filter(c => c.category === cat).length;
                const colors: Record<string, string> = {
                  "Core Competency": "border-blue-500/20 bg-blue-500/5",
                  "Technical": "border-violet-500/20 bg-violet-500/5",
                  "Behavioral": "border-amber-500/20 bg-amber-500/5",
                  "Organizational": "border-emerald-500/20 bg-emerald-500/5"
                };
                return (
                  <div key={cat} className={`p-3 rounded-xl border ${colors[cat]} space-y-1`}>
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{cat}</span>
                    <div className="flex items-end gap-2">
                      <span className="text-lg font-black text-foreground">{w}%</span>
                      <span className="text-[10px] font-bold text-muted-foreground mb-0.5">{count} criteria</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs">
              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">Total Criteria</span>
              <p className="text-2xl font-black text-foreground mt-1">{criteria.length}</p>
            </div>
            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs">
              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">Active</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
            </div>
            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs">
              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">Inactive</span>
              <p className="text-2xl font-black text-amber-600 mt-1">{criteria.length - activeCount}</p>
            </div>
            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs">
              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">Max Score Each</span>
              <p className="text-2xl font-black text-primary mt-1">10</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Filter className="size-3.5 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["All", ...CATEGORY_LIST].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`h-7 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-150 border ${activeCategory === cat
                      ? "bg-[#1e88e5] text-white border-[#1e88e5] shadow-sm"
                      : "bg-card text-muted-foreground border-border/40 hover:bg-muted/50"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="ml-auto relative">
              <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search criteria..."
                className="h-8 w-56 pl-8 pr-3 rounded-lg bg-muted/50 border border-border/40 text-xs font-semibold outline-none focus:border-[#1e88e5] transition"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/40 text-[9.5px] uppercase font-black tracking-wider text-muted-foreground/60">
                    <th className="px-4 py-3 text-center w-12">#</th>
                    <th className="px-4 py-3 w-28">Category</th>
                    <th className="px-4 py-3">Criteria Name</th>
                    <th className="px-4 py-3 text-center w-20">Weight</th>
                    <th className="px-4 py-3 text-center w-20">Max Score</th>
                    <th className="px-4 py-3 w-36">Department</th>
                    <th className="px-4 py-3 text-center w-20">Status</th>
                    <th className="px-4 py-3 text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filtered.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition duration-100 group">
                      <td className="px-4 py-3 text-center text-xs font-mono text-muted-foreground/50 font-bold">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${getCategoryBg(item.category)}`}>
                          {item.category.split(" ")[0]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-foreground block">{item.criteriaName}</span>
                        <span className="text-[10px] text-muted-foreground/70 block mt-0.5 max-w-md truncate">{item.criteriaDetail}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-black text-primary">{item.weight}%</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-foreground/70">{item.maxScore}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-semibold text-muted-foreground">{item.department}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border cursor-pointer transition hover:opacity-80 ${item.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                            }`}
                        >
                          {item.status === "Active" && <CheckCircle2 className="size-2.5" />}
                          {item.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => openEditModal(item)}
                            className="size-7 rounded-lg bg-[#1e88e5]/10 text-[#1e88e5] hover:bg-[#1e88e5]/20 grid place-items-center transition"
                            title="Edit"
                          >
                            <Edit3 className="size-3" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="size-7 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 grid place-items-center transition"
                            title="Delete"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-xs font-bold text-muted-foreground">
                        No criteria found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-border/30 text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
              <span>Showing {filtered.length} of {criteria.length} criteria</span>
              <span>Total Weight: <span className={`font-black ${totalWeight === 100 ? "text-emerald-600" : "text-red-500"}`}>{totalWeight}%</span></span>
            </div>
          </div>

        </div>
      </main>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-4xl rounded-xl border border-border/80 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition z-10"
            >
              <X className="size-5" />
            </button>

            <div className="p-6 border-b border-border/30">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Target className="size-5 text-primary" />
                {editId ? "Edit KPI Criteria" : "Add New KPI Criteria"}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">Define criteria with weight, rubric, and department assignment</p>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(p => ({ ...p, category: e.target.value as KpiCriteria["category"] }))}
                    className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
                  >
                    {CATEGORY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm(p => ({ ...p, department: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
                  >
                    {DEPARTMENT_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Criteria Name *</label>
                <input
                  type="text"
                  required
                  value={form.criteriaName}
                  onChange={(e) => setForm(p => ({ ...p, criteriaName: e.target.value }))}
                  placeholder="e.g., Decision Making & Problem Solving"
                  className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Description *</label>
                <textarea
                  required
                  value={form.criteriaDetail}
                  onChange={(e) => setForm(p => ({ ...p, criteriaDetail: e.target.value }))}
                  placeholder="Detailed description of what this criteria measures..."
                  className="w-full h-20 p-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-semibold outline-none resize-none focus:border-[#1e88e5]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Weight (%) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={50}
                    value={form.weight}
                    onChange={(e) => setForm(p => ({ ...p, weight: parseInt(e.target.value) || 0 }))}
                    className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold font-mono outline-none focus:border-[#1e88e5]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Max Score</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={form.maxScore}
                    onChange={(e) => setForm(p => ({ ...p, maxScore: parseInt(e.target.value) || 10 }))}
                    className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold font-mono outline-none focus:border-[#1e88e5]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(p => ({ ...p, status: e.target.value as "Active" | "Inactive" }))}
                    className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Scoring Rubric */}
              <div className="border-t border-border/30 pt-4 space-y-3">
                <span className="text-[11px] font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="size-3.5" />
                  Scoring Rubric
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(["excellent", "good", "average", "poor"] as const).map(level => {
                    const colors: Record<string, string> = {
                      excellent: "border-l-emerald-500",
                      good: "border-l-blue-500",
                      average: "border-l-amber-500",
                      poor: "border-l-red-500"
                    };
                    return (
                      <div key={level} className={`space-y-1 border-l-2 ${colors[level]} pl-3`}>
                        <label className="text-[9px] font-extrabold uppercase text-muted-foreground tracking-wider capitalize">{level}</label>
                        <textarea
                          value={form.scoringRubric[level]}
                          onChange={(e) => setForm(p => ({ ...p, scoringRubric: { ...p.scoringRubric, [level]: e.target.value } }))}
                          placeholder={`Describe ${level} performance...`}
                          className="w-full h-14 p-2 rounded-lg bg-muted/30 border border-border/30 text-[10.5px] font-semibold outline-none resize-none focus:border-[#1e88e5]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

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
                  {editId ? "Update Criteria" : "Save Criteria"}
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
                <h4 className="text-sm font-black text-foreground">Delete Criteria</h4>
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
