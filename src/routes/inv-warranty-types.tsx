import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { toast } from "sonner";
import {
  ShieldCheck,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import {
  WarrantyTypeRecord,
  getStoredWarrantyTypes,
  saveStoredWarrantyTypes,
} from "@/lib/warranty-types-data";

export const Route = createFileRoute("/inv-warranty-types")({
  component: WarrantyTypesPage,
});

function WarrantyTypesPage() {
  const [warrantyTypes, setWarrantyTypes] = useState<WarrantyTypeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedRecord, setSelectedRecord] = useState<WarrantyTypeRecord | null>(null);

  // Form State
  const [formWarrantyType, setFormWarrantyType] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  // Load from Local Storage on mount
  useEffect(() => {
    const data = getStoredWarrantyTypes();
    setWarrantyTypes(data);
  }, []);

  // Filtered List
  const filteredRecords = useMemo(() => {
    return warrantyTypes.filter((record) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        record.warrantyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "All" || record.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [warrantyTypes, searchQuery, statusFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setSelectedRecord(null);
    setFormWarrantyType("");
    setFormDescription("");
    setFormStatus("Active");
    setModalMode("create");
    setModalOpen(true);
  };

  // Open View Modal
  const handleOpenView = (record: WarrantyTypeRecord) => {
    setSelectedRecord(record);
    setFormWarrantyType(record.warrantyType);
    setFormDescription(record.description);
    setFormStatus(record.status);
    setModalMode("view");
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (record: WarrantyTypeRecord) => {
    setSelectedRecord(record);
    setFormWarrantyType(record.warrantyType);
    setFormDescription(record.description);
    setFormStatus(record.status);
    setModalMode("edit");
    setModalOpen(true);
  };

  // Handle Delete
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete warranty type "${name}"?`)) {
      const updated = warrantyTypes.filter((r) => r.id !== id);
      setWarrantyTypes(updated);
      saveStoredWarrantyTypes(updated);
      toast.success(`Warranty Type "${name}" deleted successfully.`);
    }
  };

  // Save or Update Record
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWarrantyType.trim()) {
      toast.error("Please enter a Warranty Type.");
      return;
    }

    if (modalMode === "create") {
      const newRecord: WarrantyTypeRecord = {
        id: `wt-${Date.now()}`,
        warrantyType: formWarrantyType.trim(),
        description: formDescription.trim(),
        status: formStatus,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      const updated = [newRecord, ...warrantyTypes];
      setWarrantyTypes(updated);
      saveStoredWarrantyTypes(updated);
      toast.success(`Warranty Type "${newRecord.warrantyType}" created successfully.`);
    } else if (modalMode === "edit" && selectedRecord) {
      const updated = warrantyTypes.map((r) =>
        r.id === selectedRecord.id
          ? {
              ...r,
              warrantyType: formWarrantyType.trim(),
              description: formDescription.trim(),
              status: formStatus,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : r
      );
      setWarrantyTypes(updated);
      saveStoredWarrantyTypes(updated);
      toast.success(`Warranty Type "${formWarrantyType.trim()}" updated.`);
    }

    setModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Header & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-1">
                <span>Inventory</span>
                <ChevronRight className="size-3" />
                <span>Inventory Master Data</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-bold">Types of Warranty</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <ShieldCheck className="size-7 text-primary" />
                Types of Warranty
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Manage warranty classifications, SLA descriptions, and active status for inventory &amp; work order services.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all cursor-pointer"
              >
                <Plus className="size-4" /> Create Warranty Type
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search warranty type or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl focus:border-primary outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Status:</span>
              <div className="flex rounded-xl border border-border p-0.5 bg-muted/40">
                {(["All", "Active", "Inactive"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      statusFilter === tab
                        ? "bg-background text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Warranty Type List Table */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                    <th className="py-3 px-4 w-12 text-center font-bold">SL</th>
                    <th className="py-3 px-4 font-bold min-w-[200px]">Warranty Type</th>
                    <th className="py-3 px-4 font-bold">Description</th>
                    <th className="py-3 px-4 w-28 text-center font-bold">Status</th>
                    <th className="py-3 px-4 w-28 font-bold text-center">Created Date</th>
                    <th className="py-3 px-4 w-32 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 text-center font-bold text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                            <ShieldCheck className="size-3.5 text-primary shrink-0" />
                            {item.warrantyType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs leading-relaxed max-w-md">
                          {item.description || "—"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === "Active"
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                item.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                            />
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-[11px] text-muted-foreground">
                          {item.createdAt}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            {/* View Action */}
                            <button
                              type="button"
                              onClick={() => handleOpenView(item)}
                              title="View Details"
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 transition-colors cursor-pointer"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            {/* Edit Action */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              title="Edit Record"
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer"
                            >
                              <Edit className="size-3.5" />
                            </button>
                            {/* Delete Action */}
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.warrantyType)}
                              title="Delete Record"
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground text-xs">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ShieldCheck className="size-8 text-muted-foreground/30" />
                          <span className="font-semibold text-foreground">
                            No warranty types found matching criteria.
                          </span>
                          <button
                            type="button"
                            onClick={handleOpenCreate}
                            className="mt-2 text-primary hover:underline font-bold text-xs"
                          >
                            + Create a new Warranty Type
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 bg-muted/20 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing {filteredRecords.length} of {warrantyTypes.length} records
              </span>
              <span className="text-[11px]">
                Active Warranty Types are automatically selectable in Material Receive &amp; Work Order forms.
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* ── Create / Edit / View Modal ───────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  {modalMode === "create" && "Create Warranty Type"}
                  {modalMode === "edit" && "Edit Warranty Type"}
                  {modalMode === "view" && "Warranty Type Details"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-foreground uppercase tracking-wider block mb-1">
                  Warranty Type *
                </label>
                <input
                  type="text"
                  disabled={modalMode === "view"}
                  value={formWarrantyType}
                  onChange={(e) => setFormWarrantyType(e.target.value)}
                  placeholder="e.g. Standard Manufacturer Warranty"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl outline-none focus:border-primary disabled:opacity-75 disabled:cursor-not-allowed font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-foreground uppercase tracking-wider block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  disabled={modalMode === "view"}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Provide scope, defect coverage terms, conditions, or service parameters..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl outline-none focus:border-primary disabled:opacity-75 disabled:cursor-not-allowed resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-foreground uppercase tracking-wider block mb-1">
                  Status *
                </label>
                {modalMode === "view" ? (
                  <div className="py-2 px-3 bg-muted/40 border border-border rounded-xl font-bold">
                    {formStatus}
                  </div>
                ) : (
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "Active" | "Inactive")}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl outline-none focus:border-primary font-medium cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                )}
                <p className="text-[10px] text-muted-foreground mt-1">
                  Only &quot;Active&quot; warranty types are available for selection in Material Receive &amp; Work Order forms.
                </p>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors cursor-pointer"
                >
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>

                {modalMode !== "view" && (
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="size-3.5" />
                    {modalMode === "create" ? "Save Warranty Type" : "Update Warranty Type"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

