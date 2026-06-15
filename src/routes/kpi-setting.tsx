import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Plus, Edit3, Trash2, X, CheckCircle2,
  TrendingUp, Award, Activity, AlertCircle
} from "lucide-react";
import { type GradeBand, loadGradeBands, saveGradeBands } from "@/lib/kpi-data";

export const Route = createFileRoute("/kpi-setting")({
  head: () => ({
    meta: [
      { title: "Grade Band Configuration — CRIPTON" },
      { name: "description", content: "Configure KPI scoring bands, letter grades, and increment/promotion eligibility." },
    ],
  }),
  component: GradeBandConfigPage,
});

function GradeBandConfigPage() {
  const [bands, setBands] = useState<GradeBand[]>(() => {
    // Ensure they are sorted by pointFrom descending on load
    const loaded = loadGradeBands();
    return loaded.sort((a, b) => b.pointFrom - a.pointFrom);
  });
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState<{
    pointFrom: number;
    pointTo: number;
    grade: string;
    assessment: string;
    color: string;
    incrementEligible: boolean;
    promotionEligible: boolean;
    status: "Active" | "Inactive";
  }>({
    pointFrom: 0,
    pointTo: 0,
    grade: "",
    assessment: "",
    color: "#3b82f6",
    incrementEligible: false,
    promotionEligible: false,
    status: "Active"
  });

  const activeBands = useMemo(() => bands.filter(b => b.status === "Active"), [bands]);

  const openAddModal = () => {
    setEditId(null);
    setErrorMsg("");
    setForm({
      pointFrom: 0, pointTo: 0, grade: "", assessment: "", color: "#3b82f6",
      incrementEligible: false, promotionEligible: false, status: "Active"
    });
    setShowModal(true);
  };

  const openEditModal = (item: GradeBand) => {
    setEditId(item.id);
    setErrorMsg("");
    setForm({
      pointFrom: item.pointFrom,
      pointTo: item.pointTo,
      grade: item.grade,
      assessment: item.assessment,
      color: item.color,
      incrementEligible: item.incrementEligible,
      promotionEligible: item.promotionEligible,
      status: item.status
    });
    setShowModal(true);
  };

  const checkOverlap = (from: number, to: number, currentId: string | null): boolean => {
    for (const band of bands) {
      if (currentId && band.id === currentId) continue;
      // Overlap condition
      if (Math.max(from, band.pointFrom) <= Math.min(to, band.pointTo)) {
        return true;
      }
    }
    return false;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (form.pointFrom > form.pointTo) {
      setErrorMsg("Starting point cannot be greater than ending point.");
      return;
    }
    if (!form.grade.trim() || !form.assessment.trim()) {
      setErrorMsg("Grade and Assessment labels are required.");
      return;
    }

    if (checkOverlap(form.pointFrom, form.pointTo, editId)) {
      setErrorMsg("The specified point range overlaps with an existing grade band.");
      return;
    }

    let updated: GradeBand[];
    if (editId) {
      updated = bands.map(b => b.id === editId ? { ...b, ...form } : b);
    } else {
      const newId = `GB-${String(bands.length + 1).padStart(3, "0")}`;
      updated = [...bands, { id: newId, ...form }];
    }
    
    // Sort descending
    updated.sort((a, b) => b.pointFrom - a.pointFrom);
    
    setBands(updated);
    saveGradeBands(updated);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const updated = bands.filter(b => b.id !== id);
    setBands(updated);
    saveGradeBands(updated);
    setDeleteConfirm(null);
  };

  const handleToggleStatus = (id: string) => {
    const updated = bands.map(b => b.id === id ? { ...b, status: b.status === "Active" ? "Inactive" as const : "Active" as const } : b);
    setBands(updated);
    saveGradeBands(updated);
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
                <span className="text-primary font-semibold">Grade Bands</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <TrendingUp className="size-5.5 text-primary" />
                <span>Grade Band Configuration</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">Configure scoring ranges, letter grades, and eligibility rules for appraisals</p>
            </div>

            <button
              onClick={openAddModal}
              className="h-9 px-5 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider shrink-0"
            >
              <Plus className="size-4" />
              <span>Add Grade Band</span>
            </button>
          </div>

          {/* Visual Spectrum Bar */}
          <div className="bg-card rounded-lg border border-border/80 p-6 shadow-xs space-y-6">
            <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              Active Grade Spectrum
            </h3>
            
            {activeBands.length > 0 ? (
              <div className="h-10 rounded-xl overflow-hidden flex shadow-inner bg-muted/20">
                {activeBands.map((band) => {
                  const width = Math.max(1, band.pointTo - band.pointFrom);
                  return (
                    <div
                      key={band.id}
                      className="flex flex-col items-center justify-center text-white border-r border-white/20 last:border-0 transition-all hover:brightness-110"
                      style={{ width: `${width}%`, backgroundColor: band.color }}
                      title={`${band.grade}: ${band.pointFrom}-${band.pointTo}`}
                    >
                      <span className="text-[11px] font-black">{band.grade}</span>
                      <span className="text-[8px] font-bold opacity-80">{band.pointFrom}-{band.pointTo}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-10 rounded-xl bg-muted/40 border border-border/40 border-dashed flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                No active grade bands configured
              </div>
            )}
          </div>

          {/* Grade Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {bands.map((band) => (
              <div key={band.id} className={`bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden relative group ${band.status === "Inactive" ? "opacity-60 grayscale" : ""}`}>
                <div className="h-2 w-full" style={{ backgroundColor: band.color }} />
                
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-black" style={{ color: band.color }}>{band.grade}</h4>
                      <span className="text-xs font-bold text-foreground block">{band.assessment}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Range</span>
                      <span className="text-sm font-mono font-bold text-foreground">{band.pointFrom} - {band.pointTo}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-3 border-t border-border/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Increment</span>
                      {band.incrementEligible ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">Eligible</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">Ineligible</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Promotion</span>
                      {band.promotionEligible ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">Eligible</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">Ineligible</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(band)} className="size-7 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary transition" title="Edit">
                    <Edit3 className="size-3.5" />
                  </button>
                  <button onClick={() => handleToggleStatus(band.id)} className="size-7 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-amber-500 transition" title={band.status === "Active" ? "Deactivate" : "Activate"}>
                    <Activity className="size-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirm(band.id)} className="size-7 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-red-500 transition" title="Delete">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-xl border border-border/80 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition z-10"
            >
              <X className="size-5" />
            </button>

            <div className="p-6 border-b border-border/30">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Award className="size-5 text-primary" />
                {editId ? "Edit Grade Band" : "Add Grade Band"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-600 text-xs font-semibold">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Point From *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={form.pointFrom}
                    onChange={(e) => setForm(p => ({ ...p, pointFrom: parseInt(e.target.value) || 0 }))}
                    className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold font-mono outline-none focus:border-[#1e88e5]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Point To *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={form.pointTo}
                    onChange={(e) => setForm(p => ({ ...p, pointTo: parseInt(e.target.value) || 0 }))}
                    className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold font-mono outline-none focus:border-[#1e88e5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Letter Grade *</label>
                  <input
                    type="text"
                    required
                    value={form.grade}
                    onChange={(e) => setForm(p => ({ ...p, grade: e.target.value }))}
                    placeholder="e.g., A+"
                    className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Brand Color *</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={form.color}
                      onChange={(e) => setForm(p => ({ ...p, color: e.target.value }))}
                      className="h-9 w-9 rounded border border-border/40 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.color}
                      onChange={(e) => setForm(p => ({ ...p, color: e.target.value }))}
                      className="flex-1 h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold font-mono outline-none focus:border-[#1e88e5]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Assessment Label *</label>
                <input
                  type="text"
                  required
                  value={form.assessment}
                  onChange={(e) => setForm(p => ({ ...p, assessment: e.target.value }))}
                  placeholder="e.g., Outstanding"
                  className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
                />
              </div>

              <div className="border-t border-border/30 pt-4 space-y-3">
                <span className="text-[10px] font-black uppercase text-foreground">Eligibility Rules</span>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.incrementEligible}
                    onChange={(e) => setForm(p => ({ ...p, incrementEligible: e.target.checked }))}
                    className="size-4 rounded border-border/40 text-[#1e88e5] focus:ring-[#1e88e5]/20 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-foreground block">Eligible for Annual Increment</span>
                    <span className="text-[10px] text-muted-foreground">Employee qualifies for salary increase</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.promotionEligible}
                    onChange={(e) => setForm(p => ({ ...p, promotionEligible: e.target.checked }))}
                    className="size-4 rounded border-border/40 text-[#1e88e5] focus:ring-[#1e88e5]/20 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-foreground block">Eligible for Promotion</span>
                    <span className="text-[10px] text-muted-foreground">Employee qualifies for designation change</span>
                  </div>
                </label>
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
                  {editId ? "Update Band" : "Save Band"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-xl border border-border/80 shadow-2xl p-6 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-500/10 grid place-items-center">
                <Trash2 className="size-5 text-red-500" />
              </div>
              <div>
                <h4 className="text-sm font-black text-foreground">Delete Grade Band</h4>
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
