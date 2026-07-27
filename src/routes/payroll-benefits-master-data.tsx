import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useState, useMemo, useEffect } from "react";
import {
  ChevronRight,
  Database,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  Pencil,
  Trash2,
  Plus,
  CheckCircle2,
  XCircle,
  Filter,
  X,
  Sparkles,
  Layers,
  SlidersHorizontal,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/payroll-benefits-master-data")({
  head: () => ({
    meta: [
      { title: "Payroll Master Data — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Configure master definitions for benefits, allowances, deductions, and festival bonus categories.",
      },
    ],
  }),
  component: PayrollMasterDataPage,
});

// ─── Data Types ───────────────────────────────────────────────────────────────
export type MasterCategory =
  | "ALL"
  | "Common Benefit Add"
  | "Common Benefit Deduct"
  | "Individual Benefit Add"
  | "Individual Benefit Deduct"
  | "Bonus Type / Festival Master"
  | "Allowance Category Master"
  | "Deduction Category Master";

export interface MasterRecord {
  id: string;
  category: Exclude<MasterCategory, "ALL">;
  name: string;
  comments: string;
  status: "Active" | "Inactive";
  createdAt?: string;
}

// ─── Initial Master Presets ───────────────────────────────────────────────────
const INITIAL_MASTER_RECORDS: MasterRecord[] = [
  // Common Benefit Add
  { id: "MSTR-101", category: "Common Benefit Add", name: "Conveyance Allowance", comments: "Applicable for all permanent staff", status: "Active" },
  { id: "MSTR-102", category: "Common Benefit Add", name: "Lunch Allowance", comments: "Subsidized daily meal benefit", status: "Active" },
  { id: "MSTR-103", category: "Common Benefit Add", name: "Md. Bazio Mia", comments: "No Need", status: "Inactive" },
  { id: "MSTR-104", category: "Common Benefit Add", name: "Other Allowance", comments: "General miscellaneous addition", status: "Active" },
  { id: "MSTR-105", category: "Common Benefit Add", name: "Mobile Allowance", comments: "Monthly Capped BDT 1,500", status: "Active" },
  { id: "MSTR-106", category: "Common Benefit Add", name: "Attendance Bonus", comments: "100% Monthly Attendance Required", status: "Active" },

  // Common Benefit Deduct
  { id: "MSTR-201", category: "Common Benefit Deduct", name: "Provident Fund (PF)", comments: "8.33% Basic Salary Match", status: "Active" },
  { id: "MSTR-202", category: "Common Benefit Deduct", name: "Revenue Stamp Duty", comments: "10 BDT Flat per payslip", status: "Active" },
  { id: "MSTR-203", category: "Common Benefit Deduct", name: "Advance Salary Recovery", comments: "Auto-deducted from monthly gross", status: "Active" },
  { id: "MSTR-204", category: "Common Benefit Deduct", name: "Welfare Fund Contribution", comments: "Optional Staff Fund", status: "Active" },

  // Individual Benefit Add
  { id: "MSTR-301", category: "Individual Benefit Add", name: "Special Performance Incentive", comments: "Approved by HOD & Management", status: "Active" },
  { id: "MSTR-302", category: "Individual Benefit Add", name: "Night Shift Allowance", comments: "150 BDT per night shift punch", status: "Active" },
  { id: "MSTR-303", category: "Individual Benefit Add", name: "Technical Skill Allowance", comments: "Senior Engineers & Technicians", status: "Active" },

  // Individual Benefit Deduct
  { id: "MSTR-401", category: "Individual Benefit Deduct", name: "Personal Loan EMI Recovery", comments: "Deducted per loan schedule", status: "Active" },
  { id: "MSTR-402", category: "Individual Benefit Deduct", name: "Excess Mobile Usage Fine", comments: "Beyond allocated limit", status: "Active" },
  { id: "MSTR-403", category: "Individual Benefit Deduct", name: "Asset Damage Fine", comments: "Audit approved recovery", status: "Active" },

  // Bonus Type / Festival Master
  { id: "MSTR-501", category: "Bonus Type / Festival Master", name: "Eid-ul-Fitr Festival Bonus", comments: "100% Basic Salary for >= 1 Yr Service", status: "Active" },
  { id: "MSTR-502", category: "Bonus Type / Festival Master", name: "Eid-ul-Azha Festival Bonus", comments: "100% Basic Salary for >= 1 Yr Service", status: "Active" },
  { id: "MSTR-503", category: "Bonus Type / Festival Master", name: "Durga Puja Festival Bonus", comments: "For Hindu faith employees", status: "Active" },
  { id: "MSTR-504", category: "Bonus Type / Festival Master", name: "Year-End Performance Incentive", comments: "Board approved profit share", status: "Active" },
];

const CATEGORIES_LIST: Exclude<MasterCategory, "ALL">[] = [
  "Common Benefit Add",
  "Common Benefit Deduct",
  "Individual Benefit Add",
  "Individual Benefit Deduct",
  "Bonus Type / Festival Master",
  "Allowance Category Master",
  "Deduction Category Master",
];

function PayrollMasterDataPage() {
  const [selectedCategory, setSelectedCategory] = useState<MasterCategory>("Common Benefit Add");
  const [records, setRecords] = useState<MasterRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hris_payroll_master_data");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse hris_payroll_master_data", e);
        }
      }
    }
    return INITIAL_MASTER_RECORDS;
  });

  // Modal Controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalCategory, setModalCategory] = useState<Exclude<MasterCategory, "ALL">>("Common Benefit Add");
  const [modalName, setModalName] = useState("");
  const [modalComments, setModalComments] = useState("");
  const [modalStatus, setModalStatus] = useState<"Active" | "Inactive">("Active");

  // Search Query & Status Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("hris_payroll_master_data", JSON.stringify(records));
  }, [records]);

  // Open Modal for New Record
  const handleOpenAddModal = () => {
    setEditingId(null);
    setModalCategory(selectedCategory === "ALL" ? "Common Benefit Add" : selectedCategory);
    setModalName("");
    setModalComments("");
    setModalStatus("Active");
    setIsModalOpen(true);
  };

  // Open Modal for Editing Record
  const handleOpenEditModal = (rec: MasterRecord) => {
    setEditingId(rec.id);
    setModalCategory(rec.category);
    setModalName(rec.name);
    setModalComments(rec.comments);
    setModalStatus(rec.status);
    setIsModalOpen(true);
  };

  // Toggle Status directly in row
  const handleToggleStatus = (id: string, name: string, currentStatus: "Active" | "Inactive") => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
    toast.success(`Status of "${name}" changed to ${nextStatus}`);
  };

  // Delete Record
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast.success(`Deleted master item: ${name}`);
    }
  };

  // Save Modal Form Submission
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim()) {
      toast.error("Please enter a Name for the Master record!");
      return;
    }

    if (editingId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                category: modalCategory,
                name: modalName.trim(),
                comments: modalComments.trim(),
                status: modalStatus,
              }
            : r
        )
      );
      toast.success(`Updated "${modalName.trim()}" successfully!`);
    } else {
      const exists = records.some(
        (r) => r.category === modalCategory && r.name.toLowerCase() === modalName.trim().toLowerCase()
      );
      if (exists) {
        toast.error(`"${modalName.trim()}" already exists under ${modalCategory}!`);
        return;
      }

      const newRec: MasterRecord = {
        id: `MSTR-${Date.now().toString().slice(-4)}`,
        category: modalCategory,
        name: modalName.trim(),
        comments: modalComments.trim(),
        status: modalStatus,
        createdAt: new Date().toISOString(),
      };
      setRecords((prev) => [newRec, ...prev]);
      toast.success(`Added new master item: "${modalName.trim()}"`);
    }

    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Category", "Name", "Comments", "Status"];
    const rows = filteredRecords.map((r) => [r.id, r.category, `"${r.name}"`, `"${r.comments}"`, r.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Payroll_Master_Data_${selectedCategory.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported Master Data to CSV!");
  };

  // Filtered List View Data
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedCategory !== "ALL" && r.category !== selectedCategory) return false;
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.comments.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, selectedCategory, statusFilter, searchQuery]);

  // Category counts
  const activeCount = useMemo(() => {
    return records.filter(
      (r) => (selectedCategory === "ALL" || r.category === selectedCategory) && r.status === "Active"
    ).length;
  }, [records, selectedCategory]);

  const inactiveCount = useMemo(() => {
    return records.filter(
      (r) => (selectedCategory === "ALL" || r.category === selectedCategory) && r.status === "Inactive"
    ).length;
  }, [records, selectedCategory]);

  return (
    <div className="min-h-screen flex bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1800px] mx-auto w-full">
          {/* Top Breadcrumb & Page Banner */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-1.5 relative z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/80">
                <Link to="/payroll-benefits" className="hover:text-primary transition-colors">
                  Payroll
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="text-foreground font-bold">Master Information</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md">
                  <Database className="size-6" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-foreground tracking-tight">
                    Master Information Management
                  </h1>
                  <p className="text-xs text-muted-foreground font-medium">
                    Configure and manage enterprise benefit, allowance, deduction, and festival parameters.
                  </p>
                </div>
              </div>
            </div>

            {/* Banner Quick Stats & Primary Action Button */}
            <div className="flex items-center gap-3 flex-wrap relative z-10">
              <div className="bg-muted/40 border border-border/60 rounded-xl px-4 py-2 text-center min-w-[90px]">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Total Items</span>
                <span className="text-base font-extrabold text-foreground">{records.length}</span>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 text-center min-w-[90px]">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider block">Active</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{records.filter((r) => r.status === "Active").length}</span>
              </div>

              {/* Primary + ADD MASTER ITEM Button */}
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer uppercase tracking-wider ml-2"
              >
                <Plus className="size-4 stroke-[3]" />
                + Add Master Item
              </button>
            </div>
          </div>

          {/* Master Table Card */}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
            {/* Filter & Toolbar Header */}
            <div className="p-5 border-b border-border/40 bg-card space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Master For Category Dropdown Selector */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xs font-bold text-foreground/80 flex items-center gap-1.5 shrink-0">
                    <FolderOpen className="size-4 text-primary" />
                    Master Category:
                  </span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as MasterCategory)}
                    className="h-10 px-4 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/30 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-xs font-bold outline-none cursor-pointer max-w-xs w-full"
                  >
                    <option value="ALL">All Categories ({records.length})</option>
                    {CATEGORIES_LIST.map((cat) => {
                      const count = records.filter((r) => r.category === cat).length;
                      return (
                        <option key={cat} value={cat}>
                          {cat} ({count})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Right: Exports & Search Bar */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Export Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileSpreadsheet className="size-3.5" />
                      EXCEL
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="size-3.5" />
                      PRINT
                    </button>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileDown className="size-3.5" />
                      PDF
                    </button>
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="h-10 px-3 rounded-xl border border-border/60 bg-background text-xs font-semibold outline-none cursor-pointer"
                  >
                    <option value="ALL">All Status</option>
                    <option value="Active">Active ({activeCount})</option>
                    <option value="Inactive">Inactive ({inactiveCount})</option>
                  </select>

                  {/* Live Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search master item name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-border/60 bg-background text-xs font-medium outline-none focus:border-primary transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-200/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-b border-border/60 font-bold select-none">
                    <th className="py-3.5 px-4 w-16 text-center">Action</th>
                    {selectedCategory === "ALL" && (
                      <th className="py-3.5 px-4 min-w-[180px]">Category</th>
                    )}
                    <th className="py-3.5 px-4 min-w-[240px]">
                      <div className="flex items-center gap-1.5">
                        <span>Name</span>
                        <span className="text-slate-400">↕</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 min-w-[320px]">
                      <div className="flex items-center gap-1.5">
                        <span>Comments</span>
                        <span className="text-slate-400">↕</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-36 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span>Status</span>
                        <span className="text-slate-400">↕</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={selectedCategory === "ALL" ? 5 : 4} className="py-16 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Database className="size-10 text-muted-foreground/30" />
                          <p className="font-bold text-sm">No master records found</p>
                          <p className="text-xs text-muted-foreground">
                            Click "+ Add Master Item" button to create a new option.
                          </p>
                          <button
                            type="button"
                            onClick={handleOpenAddModal}
                            className="mt-3 px-5 py-2.5 rounded-xl bg-pink-600 text-white font-bold text-xs shadow-sm hover:bg-pink-700 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus className="size-4" /> Add Master Item Now
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((rec, index) => (
                      <tr
                        key={rec.id}
                        className={[
                          "transition-colors duration-150 group",
                          index % 2 === 0 ? "bg-card hover:bg-muted/30" : "bg-muted/15 hover:bg-muted/40",
                        ].join(" ")}
                      >
                        {/* Action Pencil & Delete Icons */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(rec)}
                              className="size-8 rounded-lg hover:bg-amber-500/10 text-amber-600 hover:text-amber-700 flex items-center justify-center transition-colors border border-transparent hover:border-amber-500/20 cursor-pointer"
                              title="Edit Master Item"
                            >
                              <Pencil className="size-3.5 text-amber-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(rec.id, rec.name)}
                              className="size-8 rounded-lg hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 flex items-center justify-center transition-colors border border-transparent hover:border-rose-500/20 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Category (When ALL is selected) */}
                        {selectedCategory === "ALL" && (
                          <td className="py-3.5 px-4 font-medium">
                            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border/50">
                              {rec.category}
                            </span>
                          </td>
                        )}

                        {/* Name */}
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          {rec.name}
                        </td>

                        {/* Comments */}
                        <td className="py-3.5 px-4 text-muted-foreground">{rec.comments || "—"}</td>

                        {/* Status Toggle Badge */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(rec.id, rec.name, rec.status)}
                            className={[
                              "inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95",
                              rec.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/20"
                                : "bg-slate-500/10 text-slate-500 border-slate-500/25 hover:bg-slate-500/20 dark:text-slate-400",
                            ].join(" ")}
                            title="Click to toggle status"
                          >
                            {rec.status === "Active" ? (
                              <CheckCircle2 className="size-3.5 text-emerald-500" />
                            ) : (
                              <XCircle className="size-3.5 text-slate-400" />
                            )}
                            <span>{rec.status}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Pagination & Counter */}
            <div className="p-4 bg-muted/10 border-t border-border/40 flex items-center justify-between">
              <div className="text-xs text-muted-foreground font-medium">
                Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries
                {searchQuery && ` (filtered from ${records.filter((r) => selectedCategory === "ALL" || r.category === selectedCategory).length} total entries)`}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 active:bg-primary/95 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <Plus className="size-4" />
                  + Add Master Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Pop-Up Modal containing the 4 Form Fields (Master For *, Name *, Comments, Status *) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border/50 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/40 bg-muted/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-xs">
                  {editingId ? <Pencil className="size-5 text-primary" /> : <Sparkles className="size-5 text-primary" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    {editingId ? "Edit Master Record" : "Add New Master Record"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Fill in the parameters below to save to master information.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-8.5 rounded-xl hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {/* Modal Form Content (Containing the 4 Form Fields) */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              {/* 1. Master For * */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/85 block flex items-center gap-1">
                  Master For <span className="text-rose-500">*</span>
                </label>
                <select
                  value={modalCategory}
                  onChange={(e) => setModalCategory(e.target.value as Exclude<MasterCategory, "ALL">)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border/60 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none cursor-pointer font-medium"
                >
                  {CATEGORIES_LIST.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Name * */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/85 block flex items-center gap-1">
                  Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Master Item Name..."
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border/60 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none font-medium"
                />
              </div>

              {/* 3. Comments */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/85 block">
                  Comments
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional details or comments..."
                  value={modalComments}
                  onChange={(e) => setModalComments(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border/60 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none resize-none"
                />
              </div>

              {/* 4. Status * */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/85 block flex items-center gap-1">
                  Status <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setModalStatus("Active")}
                    className={[
                      "h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer",
                      modalStatus === "Active"
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                        : "bg-muted/30 hover:bg-muted text-muted-foreground border-border/60",
                    ].join(" ")}
                  >
                    <CheckCircle2 className="size-4" /> Active
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalStatus("Inactive")}
                    className={[
                      "h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer",
                      modalStatus === "Inactive"
                        ? "bg-slate-600 text-white border-slate-700 shadow-sm"
                        : "bg-muted/30 hover:bg-muted text-muted-foreground border-border/60",
                    ].join(" ")}
                  >
                    <XCircle className="size-4" /> Inactive
                  </button>
                </div>
              </div>

              {/* Footer Modal Actions */}
              <div className="pt-4 border-t border-border/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-5 rounded-xl bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 active:bg-primary/95 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  {editingId ? "Update Record" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
