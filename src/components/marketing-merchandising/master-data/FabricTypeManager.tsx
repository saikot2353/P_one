import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Palette,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { MMFabricType, MMMasterDataRepository } from "../../../lib/merchandising-master-data";

export function FabricTypeManager() {
  const [types, setTypes] = useState<MMFabricType[]>(() => MMMasterDataRepository.getFabricTypes());

  const saveRecords = (newRecords: MMFabricType[]) => {
    setTypes(newRecords);
    MMMasterDataRepository.saveFabricTypes(newRecords);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeItem, setActiveItem] = useState<MMFabricType | null>(null);

  // Form Fields
  const [typeName, setTypeName] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  // Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "status";
    item: MMFabricType | null;
    targetStatus?: "Active" | "Inactive";
  }>({ isOpen: false, type: "delete", item: null });

  const handleOpenCreate = () => {
    setActiveItem(null);
    setModalMode("create");
    setTypeName("");
    setFormStatus("Active");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MMFabricType) => {
    setActiveItem(item);
    setModalMode("edit");
    setTypeName(item.name);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  const handleOpenView = (item: MMFabricType) => {
    setActiveItem(item);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = typeName.trim();
    if (!trimmed) {
      toast.error("Fabric Type Name is required.");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    if (modalMode === "create") {
      const newRecord: MMFabricType = {
        id: `ft-${Date.now()}`,
        code: `FT-${String(types.length + 1).padStart(3, "0")}`,
        name: trimmed,
        status: formStatus,
        createdAt: now,
        updatedAt: now,
      };
      saveRecords([newRecord, ...types]);
      toast.success(`Fabric Type "${trimmed}" created.`);
    } else if (modalMode === "edit" && activeItem) {
      const updated = types.map((t) =>
        t.id === activeItem.id ? { ...t, name: trimmed, status: formStatus, updatedAt: now } : t,
      );
      saveRecords(updated);
      toast.success(`Fabric Type "${trimmed}" updated.`);
    }

    setIsModalOpen(false);
  };

  const promptStatusChange = (item: MMFabricType) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";
    setConfirmDialog({
      isOpen: true,
      type: "status",
      item,
      targetStatus: nextStatus,
    });
  };

  const promptDelete = (item: MMFabricType) => {
    setConfirmDialog({ isOpen: true, type: "delete", item });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.item) return;

    if (confirmDialog.type === "delete") {
      const filtered = types.filter((t) => t.id !== confirmDialog.item!.id);
      saveRecords(filtered);
      toast.success(`Fabric Type "${confirmDialog.item.name}" deleted.`);
    } else if (confirmDialog.type === "status" && confirmDialog.targetStatus) {
      const updated = types.map((t) =>
        t.id === confirmDialog.item!.id
          ? {
              ...t,
              status: confirmDialog.targetStatus!,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : t,
      );
      saveRecords(updated);
      toast.success(`Status updated for "${confirmDialog.item.name}".`);
    }

    setConfirmDialog({ isOpen: false, type: "delete", item: null });
  };

  const filteredRecords = useMemo(() => {
    return types.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q || t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q);
      const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [types, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Palette className="size-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Fabric Type Master
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold">
                {types.length} records
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Manage Knit & Woven fabric types (Single Jersey, 1x1 Rib, French Terry, Fleece, Pique,
              Interlock).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="size-4" />
          <span>Create Fabric Type</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fabric type name or code..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          {(["ALL", "Active", "Inactive"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === s
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Fabric Type Name</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Palette className="size-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold">No Fabric Types found</p>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                      {item.code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => promptStatusChange(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                          item.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                        }`}
                      >
                        {item.status === "Active" ? (
                          <>
                            <CheckCircle2 className="size-3 text-emerald-600" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="size-3 text-rose-600" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">{item.createdAt}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenView(item)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                          title="View"
                        >
                          <Eye className="size-3.5 text-indigo-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="size-3.5 text-amber-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => promptDelete(item)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-600 dark:text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredRecords.length)} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of{" "}
              {filteredRecords.length} records
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <span className="font-bold px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="size-4 text-teal-600" />
                {modalMode === "create"
                  ? "Create Fabric Type"
                  : modalMode === "edit"
                    ? `Edit Fabric Type — ${activeItem?.code}`
                    : `View Fabric Type — ${activeItem?.code}`}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {modalMode === "view" ? (
              <div className="p-6 space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Fabric Type Name
                  </span>
                  <p className="text-base font-black text-slate-900 dark:text-white">
                    {activeItem?.name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Status
                    </span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold ${
                        activeItem?.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {activeItem?.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Code
                    </span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {activeItem?.code}
                    </span>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fabric Type Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    placeholder="e.g. Single Jersey, 1x1 Rib, French Terry"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Status
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="ft-status"
                        checked={formStatus === "Active"}
                        onChange={() => setFormStatus("Active")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        Active
                      </span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="ft-status"
                        checked={formStatus === "Inactive"}
                        onChange={() => setFormStatus("Inactive")}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span className="font-semibold text-rose-700 dark:text-rose-400">
                        Inactive
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    {modalMode === "create" ? "Save Fabric Type" : "Update Fabric Type"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && confirmDialog.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  confirmDialog.type === "delete"
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60"
                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/60"
                }`}
              >
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {confirmDialog.type === "delete"
                    ? "Delete Fabric Type?"
                    : `Change Status to ${confirmDialog.targetStatus}?`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {confirmDialog.type === "delete"
                    ? `Are you sure you want to permanently delete "${confirmDialog.item.name}"?`
                    : `Are you sure you want to change status to ${confirmDialog.targetStatus}?`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog({ isOpen: false, type: "delete", item: null })}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-xs cursor-pointer ${
                  confirmDialog.type === "delete"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {confirmDialog.type === "delete" ? "Delete Record" : "Confirm Status Change"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FabricTypeManager;
