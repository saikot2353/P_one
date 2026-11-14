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
  Layers,
  Sparkles,
  Info,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMFabricComposition,
  CompositionEntry,
  STANDARD_FIBER_NAMES,
  MMMasterDataRepository,
} from "../../../lib/merchandising-master-data";
import { SearchableSelect } from "../../ui/searchable-select";

export function FabricCompositionManager() {
  const [compositions, setCompositions] = useState<MMFabricComposition[]>(() =>
    MMMasterDataRepository.getFabricCompositions(),
  );

  // Save changes to localStorage
  const saveRecords = (newRecords: MMFabricComposition[]) => {
    setCompositions(newRecords);
    MMMasterDataRepository.saveFabricCompositions(newRecords);
  };

  // Search & Filter & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeItem, setActiveItem] = useState<MMFabricComposition | null>(null);

  // Form State: 3 composition entries (6 columns across a single table row)
  const [entries, setEntries] = useState<[CompositionEntry, CompositionEntry, CompositionEntry]>([
    { ratio: 60, fiberName: "Cotton", number: 1, cottonSpandex: "Cotton" },
    { ratio: 35, fiberName: "Polyester", number: 2, cottonSpandex: "Polyester" },
    { ratio: 5, fiberName: "Spandex", number: 3, cottonSpandex: "Spandex" },
  ]);
  const [ratioStrings, setRatioStrings] = useState<[string, string, string]>(["60", "35", "5"]);
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "status";
    item: MMFabricComposition | null;
    targetStatus?: "Active" | "Inactive";
  }>({
    isOpen: false,
    type: "delete",
    item: null,
  });

  // Calculate live dynamic ratio total
  const currentTotalRatio = useMemo(() => {
    const sum = entries.reduce((acc, curr) => acc + (Number(curr.ratio) || 0), 0);
    return Math.round(sum * 100) / 100;
  }, [entries]);

  const isTotalValid = Math.abs(currentTotalRatio - 100) < 0.001;

  // Auto-compose composition display name from non-zero entries (space-separated, without slashes)
  const previewName = useMemo(() => {
    const parts = entries
      .filter((e) => (Number(e.ratio) || 0) > 0 && e.fiberName.trim() !== "")
      .map((e) => `${e.ratio}% ${e.fiberName.trim()}`);
    return parts.length > 0 ? parts.join(" ") : "Incomplete Composition";
  }, [entries]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setActiveItem(null);
    setModalMode("create");
    setEntries([
      { ratio: 60, fiberName: "Cotton", number: 1, cottonSpandex: "Cotton" },
      { ratio: 35, fiberName: "Polyester", number: 2, cottonSpandex: "Polyester" },
      { ratio: 5, fiberName: "Spandex", number: 3, cottonSpandex: "Spandex" },
    ]);
    setRatioStrings(["60", "35", "5"]);
    setFormStatus("Active");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MMFabricComposition) => {
    setActiveItem(item);
    setModalMode("edit");
    const e = item.entries || [];
    const entry0 = e[0] || { ratio: 0, fiberName: "", number: 1, cottonSpandex: "" };
    const entry1 = e[1] || { ratio: 0, fiberName: "", number: 2, cottonSpandex: "" };
    const entry2 = e[2] || { ratio: 0, fiberName: "", number: 3, cottonSpandex: "" };
    setEntries([entry0, entry1, entry2]);
    setRatioStrings([
      entry0.ratio !== undefined && entry0.ratio !== null ? String(entry0.ratio) : "0",
      entry1.ratio !== undefined && entry1.ratio !== null ? String(entry1.ratio) : "0",
      entry2.ratio !== undefined && entry2.ratio !== null ? String(entry2.ratio) : "0",
    ]);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  // Open View Modal
  const handleOpenView = (item: MMFabricComposition) => {
    setActiveItem(item);
    setModalMode("view");
    setIsModalOpen(true);
  };

  // Ratio numeric input change handler
  const handleRatioChange = (index: number, valStr: string) => {
    setRatioStrings((prev) => {
      const copy = [...prev] as [string, string, string];
      copy[index] = valStr;
      return copy;
    });
    const parsed = parseFloat(valStr);
    const numeric = isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
    setEntries((prev) => {
      const copy: [CompositionEntry, CompositionEntry, CompositionEntry] = [...prev];
      copy[index] = { ...copy[index], ratio: numeric };
      return copy;
    });
  };

  // Fiber Name searchable select change handler
  const handleFiberChange = (index: number, fiber: string) => {
    setEntries((prev) => {
      const copy: [CompositionEntry, CompositionEntry, CompositionEntry] = [...prev];
      copy[index] = { ...copy[index], fiberName: fiber, cottonSpandex: fiber };
      return copy;
    });
  };

  // Save Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Strict 100% Ratio Validation
    if (!isTotalValid) {
      toast.error(
        `Total ratio must equal exactly 100%. Current total is ${currentTotalRatio}%. (Difference: ${(
          100 - currentTotalRatio
        ).toFixed(1)}%)`,
      );
      return;
    }

    // 2. Validate that entries with ratio > 0 have a selected Fiber Name
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const r = Number(entry.ratio) || 0;
      if (r > 0 && !entry.fiberName?.trim()) {
        toast.error(`Please select a Fiber Name for Column #${i * 2 + 2} where ratio is ${r}%.`);
        return;
      }
      if (r === 0 && entry.fiberName?.trim()) {
        toast.error(
          `Ratio is 0% for "${entry.fiberName}". Please enter a ratio greater than 0% or clear the fiber selection.`,
        );
        return;
      }
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    if (modalMode === "create") {
      const newId = `fc-${Date.now()}`;
      const code = `FC-${String(compositions.length + 1).padStart(3, "0")}`;
      const newRecord: MMFabricComposition = {
        id: newId,
        code,
        name: previewName,
        entries,
        totalRatio: currentTotalRatio,
        status: formStatus,
        createdAt: now,
        updatedAt: now,
      };

      saveRecords([newRecord, ...compositions]);
      toast.success(`Fabric Composition "${previewName}" created successfully.`);
    } else if (modalMode === "edit" && activeItem) {
      const updated = compositions.map((c) =>
        c.id === activeItem.id
          ? {
              ...c,
              name: previewName,
              entries,
              totalRatio: currentTotalRatio,
              status: formStatus,
              updatedAt: now,
            }
          : c,
      );
      saveRecords(updated);
      toast.success(`Fabric Composition "${previewName}" updated successfully.`);
    }

    setIsModalOpen(false);
  };

  // Status Change with Confirmation
  const promptStatusChange = (item: MMFabricComposition) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";
    setConfirmDialog({
      isOpen: true,
      type: "status",
      item,
      targetStatus: nextStatus,
    });
  };

  // Delete with Confirmation
  const promptDelete = (item: MMFabricComposition) => {
    setConfirmDialog({
      isOpen: true,
      type: "delete",
      item,
    });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.item) return;

    if (confirmDialog.type === "delete") {
      const filtered = compositions.filter((c) => c.id !== confirmDialog.item!.id);
      saveRecords(filtered);
      toast.success(`Fabric Composition "${confirmDialog.item.name}" deleted.`);
    } else if (confirmDialog.type === "status" && confirmDialog.targetStatus) {
      const updated = compositions.map((c) =>
        c.id === confirmDialog.item!.id
          ? {
              ...c,
              status: confirmDialog.targetStatus!,
              updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
            }
          : c,
      );
      saveRecords(updated);
      toast.success(
        `Status changed to ${confirmDialog.targetStatus} for "${confirmDialog.item.name}".`,
      );
    }

    setConfirmDialog({ isOpen: false, type: "delete", item: null });
  };

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return compositions.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.entries.some((e) => e.fiberName.toLowerCase().includes(q));
      const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [compositions, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const fiberOptions = useMemo(
    () => [
      { value: "", label: "-- Clear / None --" },
      ...STANDARD_FIBER_NAMES.map((f) => ({ value: f, label: f })),
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Layers className="size-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Fabric Composition Master
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold">
                {compositions.length} items
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Manage multi-fiber blend ratios with exact 100% total validation, fiber references,
              and yarn specifications.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="size-4" />
          <span>Create Fabric Composition</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code, composition, fiber..."
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

      {/* Register Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Composition Name</th>
                <th className="py-3.5 px-4">Fiber Breakdown (3 Ratios)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Layers className="size-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold">No Fabric Composition records found</p>
                    <p className="text-[11px] mt-0.5">
                      Click "Create Fabric Composition" to add one.
                    </p>
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
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.entries
                          .filter((e) => (Number(e.ratio) || 0) > 0)
                          .map((e, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium"
                            >
                              <strong>{e.ratio}%</strong> {e.fiberName}
                              {e.cottonSpandex ? ` (${e.cottonSpandex})` : ""}
                            </span>
                          ))}
                      </div>
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
                        title="Click to toggle Active / Inactive"
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
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {item.updatedAt || item.createdAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenView(item)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                          title="View Details"
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

        {/* Pagination Bar */}
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

      {/* ── CREATE / EDIT / VIEW MODAL ────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
                  <Layers className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {modalMode === "create"
                      ? "Create Fabric Composition"
                      : modalMode === "edit"
                        ? `Edit Fabric Composition — ${activeItem?.code}`
                        : `View Fabric Composition — ${activeItem?.code}`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {modalMode === "view"
                      ? "Full blend specification and fiber details"
                      : "Define fiber entries across 6 columns totaling exactly 100%"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            {modalMode === "view" ? (
              <div className="p-6 space-y-5">
                <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 rounded-xl p-4">
                  <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400 block mb-1">
                    Composition Summary
                  </span>
                  <p className="text-lg font-black text-teal-950 dark:text-teal-100">
                    {activeItem?.name}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                      Code: {activeItem?.code}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        activeItem?.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {activeItem?.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Fabric Composition Specification (6 Columns)
                  </h4>
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200">
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-xs font-bold">
                          <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 w-[12%]">
                            Ratio (%)
                          </th>
                          <th className="py-2.5 px-3 text-left border-r border-slate-200 dark:border-slate-700 w-[21%]">
                            Fiber Name
                          </th>
                          <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 w-[12%]">
                            Ratio (%)
                          </th>
                          <th className="py-2.5 px-3 text-left border-r border-slate-200 dark:border-slate-700 w-[21%]">
                            Fiber Name
                          </th>
                          <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 w-[12%]">
                            Ratio (%)
                          </th>
                          <th className="py-2.5 px-3 text-left w-[22%]">
                            Fiber Name
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-900">
                        <tr>
                          <td className="p-3 border-r border-slate-200 dark:border-slate-700 text-center font-bold text-teal-700 dark:text-teal-300 font-mono text-xs">
                            {activeItem?.entries[0]?.ratio ?? 0}%
                          </td>
                          <td className="p-3 border-r border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {activeItem?.entries[0]?.fiberName || "—"}
                          </td>
                          <td className="p-3 border-r border-slate-200 dark:border-slate-700 text-center font-bold text-teal-700 dark:text-teal-300 font-mono text-xs">
                            {activeItem?.entries[1]?.ratio ?? 0}%
                          </td>
                          <td className="p-3 border-r border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {activeItem?.entries[1]?.fiberName || "—"}
                          </td>
                          <td className="p-3 border-r border-slate-200 dark:border-slate-700 text-center font-bold text-teal-700 dark:text-teal-300 font-mono text-xs">
                            {activeItem?.entries[2]?.ratio ?? 0}%
                          </td>
                          <td className="p-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {activeItem?.entries[2]?.fiberName || "—"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="p-6 space-y-5">
                {/* Dynamic Ratio Validation Banner */}
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    isTotalValid
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                      : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isTotalValid ? (
                      <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="size-5 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <p className="text-xs font-black">Total Ratio: {currentTotalRatio}% / 100%</p>
                      <p className="text-[11px] opacity-90">
                        {isTotalValid
                          ? "✓ Valid composition! Exactly 100% total ratio achieved."
                          : `Total must equal exactly 100%. Remaining: ${(
                              100 - currentTotalRatio
                            ).toFixed(1)}%`}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      isTotalValid ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                    }`}
                  >
                    {isTotalValid ? "100% OK" : `${currentTotalRatio}%`}
                  </span>
                </div>

                {/* Structured Table Layout with 6 columns in a single row */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Fabric Composition Table
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Composition Preview: <strong className="text-teal-700 dark:text-teal-400">{previewName}</strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200">
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-xs font-bold">
                          <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 w-[12%] min-w-[95px]">
                            Ratio (%) <span className="text-rose-500">*</span>
                          </th>
                          <th className="py-2.5 px-3 text-left border-r border-slate-200 dark:border-slate-700 w-[21%] min-w-[190px]">
                            Fiber Name <span className="text-rose-500">*</span>
                          </th>
                          <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 w-[12%] min-w-[95px]">
                            Ratio (%) <span className="text-rose-500">*</span>
                          </th>
                          <th className="py-2.5 px-3 text-left border-r border-slate-200 dark:border-slate-700 w-[21%] min-w-[190px]">
                            Fiber Name <span className="text-rose-500">*</span>
                          </th>
                          <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 w-[12%] min-w-[95px]">
                            Ratio (%) <span className="text-rose-500">*</span>
                          </th>
                          <th className="py-2.5 px-3 text-left w-[22%] min-w-[190px]">
                            Fiber Name <span className="text-rose-500">*</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-900">
                        <tr>
                          {/* Column 1: Ratio (%) */}
                          <td className="p-2.5 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="any"
                              value={ratioStrings[0]}
                              onChange={(e) => handleRatioChange(0, e.target.value)}
                              placeholder="0"
                              className="w-full px-2.5 py-1.5 text-xs text-center font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                          </td>

                          {/* Column 2: Fiber Name */}
                          <td className="p-2.5 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <SearchableSelect
                              options={fiberOptions}
                              value={entries[0].fiberName}
                              onChange={(val) => handleFiberChange(0, val)}
                              placeholder="Select Fiber..."
                              allowCustom
                              className="h-9 text-xs"
                            />
                          </td>

                          {/* Column 3: Ratio (%) */}
                          <td className="p-2.5 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="any"
                              value={ratioStrings[1]}
                              onChange={(e) => handleRatioChange(1, e.target.value)}
                              placeholder="0"
                              className="w-full px-2.5 py-1.5 text-xs text-center font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                          </td>

                          {/* Column 4: Fiber Name */}
                          <td className="p-2.5 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <SearchableSelect
                              options={fiberOptions}
                              value={entries[1].fiberName}
                              onChange={(val) => handleFiberChange(1, val)}
                              placeholder="Select Fiber..."
                              allowCustom
                              className="h-9 text-xs"
                            />
                          </td>

                          {/* Column 5: Ratio (%) */}
                          <td className="p-2.5 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="any"
                              value={ratioStrings[2]}
                              onChange={(e) => handleRatioChange(2, e.target.value)}
                              placeholder="0"
                              className="w-full px-2.5 py-1.5 text-xs text-center font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                          </td>

                          {/* Column 6: Fiber Name */}
                          <td className="p-2.5 align-middle">
                            <SearchableSelect
                              options={fiberOptions}
                              value={entries[2].fiberName}
                              onChange={(val) => handleFiberChange(2, val)}
                              placeholder="Select Fiber..."
                              allowCustom
                              className="h-9 text-xs"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-4">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Status
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="status"
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
                          name="status"
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

                  <span className="text-[11px] text-slate-400">
                    * Entries must sum to exactly 100%
                  </span>
                </div>

                {/* Modal Footer */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isTotalValid}
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    {modalMode === "create" ? "Save Composition" : "Update Composition"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── CONFIRMATION DIALOG (Delete / Status Change) ──────────────────── */}
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
                    ? "Delete Fabric Composition?"
                    : `Change Status to ${confirmDialog.targetStatus}?`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {confirmDialog.type === "delete"
                    ? `Are you sure you want to permanently delete "${confirmDialog.item.name}" (${confirmDialog.item.code})? This action cannot be undone.`
                    : `Are you sure you want to change the status of "${confirmDialog.item.name}" from ${confirmDialog.item.status} to ${confirmDialog.targetStatus}?`}
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

export default FabricCompositionManager;
