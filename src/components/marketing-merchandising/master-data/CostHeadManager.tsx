import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMCostHeadRecord,
  CostHeadCategory,
  COST_HEAD_CATEGORIES,
  MMMasterDataRepository,
} from "../../../lib/merchandising-master-data";
import { SearchableSelect } from "../../ui/searchable-select";

export function CostHeadManager() {
  const [costHeads, setCostHeads] = useState<MMCostHeadRecord[]>(() =>
    MMMasterDataRepository.getCostHeads()
  );

  const saveRecords = (newRecords: MMCostHeadRecord[]) => {
    setCostHeads(newRecords);
    MMMasterDataRepository.saveCostHeads(newRecords);
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cripton_mm_master_cost_head_v1") {
        setCostHeads(MMMasterDataRepository.getCostHeads());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeItem, setActiveItem] = useState<MMCostHeadRecord | null>(null);

  // Form Fields - Multi Entry for Create
  const [entryRows, setEntryRows] = useState<
    Array<{ category: CostHeadCategory; costHead: string; status: "Active" | "Inactive" }>
  >([{ category: "Fabric", costHead: "", status: "Active" }]);

  // Single Entry for Edit
  const [editCategory, setEditCategory] = useState<CostHeadCategory>("Fabric");
  const [editCostHead, setEditCostHead] = useState("");
  const [editStatus, setEditStatus] = useState<"Active" | "Inactive">("Active");

  // Delete Dialog
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    item: MMCostHeadRecord | null;
  }>({ isOpen: false, item: null });

  // Open Create Modal
  const handleOpenCreate = () => {
    setActiveItem(null);
    setModalMode("create");
    setEntryRows([{ category: "Fabric", costHead: "", status: "Active" }]);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MMCostHeadRecord) => {
    setActiveItem(item);
    setModalMode("edit");
    setEditCategory(item.category);
    setEditCostHead(item.costHead);
    setEditStatus(item.status);
    setIsModalOpen(true);
  };

  // Open View Modal
  const handleOpenView = (item: MMCostHeadRecord) => {
    setActiveItem(item);
    setModalMode("view");
    setEditCategory(item.category);
    setEditCostHead(item.costHead);
    setEditStatus(item.status);
    setIsModalOpen(true);
  };

  // Toggle Status
  const handleToggleStatus = (item: MMCostHeadRecord) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";
    const now = new Date().toISOString().replace("T", " ").substring(0, 10);
    const updated = costHeads.map((r) =>
      r.id === item.id ? { ...r, status: nextStatus as "Active" | "Inactive", updatedAt: now } : r
    );
    saveRecords(updated);
    toast.success(`Cost Head "${item.costHead}" status updated to ${nextStatus}.`);
  };

  // Save Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().replace("T", " ").substring(0, 10);

    if (modalMode === "create") {
      const validRows = entryRows.filter((r) => r.costHead.trim().length > 0);
      if (validRows.length === 0) {
        toast.error("Please enter at least one Cost Head.");
        return;
      }

      const newRecords: MMCostHeadRecord[] = [];
      for (let i = 0; i < validRows.length; i++) {
        const headName = validRows[i].costHead.trim();
        const cat = validRows[i].category;
        const exists = costHeads.some(
          (c) => c.category === cat && c.costHead.toLowerCase() === headName.toLowerCase()
        );
        if (exists) {
          toast.warning(`Cost Head "${headName}" under "${cat}" already exists. Skipped duplicate.`);
          continue;
        }

        newRecords.push({
          id: `ch-${Date.now()}-${i}`,
          code: `CH-${String(costHeads.length + newRecords.length + 1).padStart(3, "0")}`,
          category: cat,
          costHead: headName,
          status: validRows[i].status,
          createdAt: now,
          updatedAt: now,
        });
      }

      if (newRecords.length > 0) {
        saveRecords([...newRecords, ...costHeads]);
        toast.success(`Added ${newRecords.length} Cost Head(s).`);
      }
    } else if (modalMode === "edit" && activeItem) {
      const trimmed = editCostHead.trim();
      if (!trimmed) {
        toast.error("Cost Head is required.");
        return;
      }

      const duplicate = costHeads.some(
        (c) =>
          c.id !== activeItem.id &&
          c.category === editCategory &&
          c.costHead.toLowerCase() === trimmed.toLowerCase()
      );
      if (duplicate) {
        toast.error(`Cost Head "${trimmed}" already exists under "${editCategory}".`);
        return;
      }

      const updated = costHeads.map((c) =>
        c.id === activeItem.id
          ? { ...c, category: editCategory, costHead: trimmed, status: editStatus, updatedAt: now }
          : c
      );
      saveRecords(updated);
      toast.success(`Cost Head "${trimmed}" updated.`);
    }

    setIsModalOpen(false);
  };

  // Delete Handler
  const handleDeleteConfirm = () => {
    if (!confirmDelete.item) return;
    const toDelete = confirmDelete.item;
    const filtered = costHeads.filter((c) => c.id !== toDelete.id);
    saveRecords(filtered);
    toast.success(`Cost Head "${toDelete.costHead}" deleted.`);
    setConfirmDelete({ isOpen: false, item: null });
  };

  // Filter & Pagination
  const filteredCostHeads = useMemo(() => {
    return costHeads.filter((item) => {
      if (categoryFilter !== "ALL" && item.category !== categoryFilter) return false;
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchHead = item.costHead.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        if (!matchHead && !matchCat && !matchCode) return false;
      }
      return true;
    });
  }, [costHeads, categoryFilter, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredCostHeads.length / itemsPerPage) || 1;
  const paginatedCostHeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCostHeads.slice(start, start + itemsPerPage);
  }, [filteredCostHeads, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Top Controls: Header, Counter, Search, Filters, and Button */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Cost Head Register
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                {costHeads.length} {costHeads.length === 1 ? "Record" : "Records"}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {costHeads.filter((c) => c.status === "Active").length} Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
            >
              <Plus className="w-4 h-4" />
              Create Cost Head
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by cost head or category..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">All Categories</option>
              {COST_HEAD_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Register Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3.5 w-16 text-center">SL</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Cost Head</th>
                <th className="py-3 px-3 text-center w-28">Status</th>
                <th className="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedCostHeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <Receipt className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-medium">No cost head records found.</p>
                  </td>
                </tr>
              ) : (
                paginatedCostHeads.map((item, index) => {
                  const sl = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-3.5 text-center font-mono text-slate-500 dark:text-slate-400">
                        <div className="font-semibold text-slate-700 dark:text-slate-300">
                          {String(sl).padStart(2, "0")}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-md border ${
                            item.category === "Fabric"
                              ? "bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                              : item.category === "Accessorie"
                              ? "bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                              : item.category === "Embellishment"
                              ? "bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                              : "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                          }`}
                        >
                          <Layers className="w-3 h-3" />
                          <span>{item.category}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {item.costHead}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          title="Click to toggle Active/Inactive"
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full transition-transform active:scale-95 cursor-pointer ${
                            item.status === "Active"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          {item.status}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenView(item)}
                            title="View"
                            className="p-1.5 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete({ isOpen: true, item })}
                            title="Delete"
                            className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {filteredCostHeads.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredCostHeads.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {filteredCostHeads.length}
            </span>{" "}
            records
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {modalMode === "create" && "Create Cost Head"}
                {modalMode === "edit" && "Edit Cost Head"}
                {modalMode === "view" && "Cost Head Details"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {modalMode === "create" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Cost Head Entries *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEntryRows((prev) => [
                          ...prev,
                          { category: "Fabric", costHead: "", status: "Active" },
                        ])
                      }
                      className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Cost Head Row
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {entryRows.map((row, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700"
                      >
                        <span className="col-span-1 text-xs text-slate-400 text-center font-mono">
                          {idx + 1}.
                        </span>

                        <div className="col-span-4">
                          <select
                            value={row.category}
                            onChange={(e) => {
                              const val = e.target.value as CostHeadCategory;
                              setEntryRows((prev) =>
                                prev.map((r, i) => (i === idx ? { ...r, category: val } : r))
                              );
                            }}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            {COST_HEAD_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-4">
                          <input
                            type="text"
                            value={row.costHead}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEntryRows((prev) =>
                                prev.map((r, i) => (i === idx ? { ...r, costHead: val } : r))
                              );
                            }}
                            placeholder="e.g. Main Fabric, Sewing Thread"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div className="col-span-2">
                          <select
                            value={row.status}
                            onChange={(e) => {
                              const val = e.target.value as "Active" | "Inactive";
                              setEntryRows((prev) =>
                                prev.map((r, i) => (i === idx ? { ...r, status: val } : r))
                              );
                            }}
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>

                        <div className="col-span-1 text-center">
                          {entryRows.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setEntryRows((prev) => prev.filter((_, i) => i !== idx))
                              }
                              className="p-1 text-slate-400 hover:text-red-500 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Category *
                    </label>
                    {modalMode === "view" ? (
                      <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {editCategory}
                      </div>
                    ) : (
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as CostHeadCategory)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        {COST_HEAD_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Cost Head *
                    </label>
                    {modalMode === "view" ? (
                      <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {editCostHead}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={editCostHead}
                        onChange={(e) => setEditCostHead(e.target.value)}
                        placeholder="e.g. Main Fabric"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Status
                    </label>
                    {modalMode === "view" ? (
                      <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {editStatus}
                      </div>
                    ) : (
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                {modalMode === "view" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Close
                    </button>
                    {activeItem && (
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(activeItem)}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Cost Head
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                    >
                      {modalMode === "create" ? "Save Cost Heads" : "Update Cost Head"}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {confirmDelete.isOpen && confirmDelete.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delete Cost Head
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete this Cost Head?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">
                {confirmDelete.item.costHead}
              </div>
              <div className="text-slate-500">Category: {confirmDelete.item.category}</div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete({ isOpen: false, item: null })}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CostHeadManager;

