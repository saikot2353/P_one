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
  Layers,
  Percent,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMAopProcessRateRecord,
  AOP_TYPES,
  MMMasterDataRepository,
} from "../../../lib/merchandising-master-data";

interface AopFormRow {
  id: string;
  aopType: string;
  processLoss: number | string;
  rate: number | string;
  status: "Active" | "Inactive";
}

export function AopRateManager() {
  const [rates, setRates] = useState<MMAopProcessRateRecord[]>(() =>
    MMMasterDataRepository.getAopProcessRates()
  );

  const saveRecords = (newRecords: MMAopProcessRateRecord[]) => {
    setRates(newRecords);
    MMMasterDataRepository.saveAopProcessRates(newRecords);
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cripton_mm_master_aop_rate_v1") {
        setRates(MMMasterDataRepository.getAopProcessRates());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [aopTypeFilter, setAopTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeItem, setActiveItem] = useState<MMAopProcessRateRecord | null>(null);

  // Form rows for multi-entry creation
  const [createRows, setCreateRows] = useState<AopFormRow[]>([
    {
      id: "row-1",
      aopType: AOP_TYPES[0],
      processLoss: 4.0,
      rate: 0.75,
      status: "Active",
    },
  ]);

  // Single item form state for edit/view
  const [singleAopType, setSingleAopType] = useState<string>(AOP_TYPES[0]);
  const [singleProcessLoss, setSingleProcessLoss] = useState<number | string>(4.0);
  const [singleRate, setSingleRate] = useState<number | string>(0.75);
  const [singleStatus, setSingleStatus] = useState<"Active" | "Inactive">("Active");

  // Confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "status";
    item: MMAopProcessRateRecord | null;
    targetStatus?: "Active" | "Inactive";
  }>({ isOpen: false, type: "delete", item: null });

  // Filtering
  const filteredRates = useMemo(() => {
    return rates.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.aopType.toLowerCase().includes(q);

      const matchesType = aopTypeFilter === "ALL" || item.aopType === aopTypeFilter;
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rates, searchQuery, aopTypeFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRates.length / itemsPerPage) || 1;
  const paginatedRates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRates.slice(start, start + itemsPerPage);
  }, [filteredRates, currentPage, itemsPerPage]);

  const handleOpenCreate = () => {
    setActiveItem(null);
    setModalMode("create");
    setCreateRows([
      {
        id: `row-${Date.now()}-1`,
        aopType: AOP_TYPES[0],
        processLoss: 4.0,
        rate: 0.75,
        status: "Active",
      },
    ]);
    setIsModalOpen(true);
  };

  const handleAddCreateRow = () => {
    setCreateRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${prev.length + 1}`,
        aopType: AOP_TYPES[Math.min(prev.length, AOP_TYPES.length - 1)],
        processLoss: 4.0,
        rate: 0.8,
        status: "Active",
      },
    ]);
  };

  const handleRemoveCreateRow = (id: string) => {
    if (createRows.length === 1) {
      toast.error("At least one entry row is required.");
      return;
    }
    setCreateRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateCreateRow = (
    id: string,
    field: keyof AopFormRow,
    value: string | number
  ) => {
    setCreateRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleOpenEdit = (item: MMAopProcessRateRecord) => {
    setActiveItem(item);
    setModalMode("edit");
    setSingleAopType(item.aopType);
    setSingleProcessLoss(item.processLoss);
    setSingleRate(item.rate);
    setSingleStatus(item.status);
    setIsModalOpen(true);
  };

  const handleOpenView = (item: MMAopProcessRateRecord) => {
    setActiveItem(item);
    setModalMode("view");
    setSingleAopType(item.aopType);
    setSingleProcessLoss(item.processLoss);
    setSingleRate(item.rate);
    setSingleStatus(item.status);
    setIsModalOpen(true);
  };

  const getNextCode = (existingList: MMAopProcessRateRecord[]): string => {
    const highestNum = existingList.reduce((acc, curr) => {
      const match = curr.code.match(/AOP-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > acc ? num : acc;
      }
      return acc;
    }, 0);
    return `AOP-${String(highestNum + 1).padStart(3, "0")}`;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === "create") {
      for (let i = 0; i < createRows.length; i++) {
        const r = createRows[i];
        if (!r.aopType.trim()) {
          toast.error(`Row ${i + 1}: Please select an AOP Type.`);
          return;
        }
        if (Number(r.processLoss) < 0) {
          toast.error(`Row ${i + 1}: Process Loss cannot be negative.`);
          return;
        }
        if (Number(r.rate) < 0) {
          toast.error(`Row ${i + 1}: Rate cannot be negative.`);
          return;
        }
      }

      let runningList = [...rates];
      const now = new Date().toISOString().slice(0, 10);

      createRows.forEach((r) => {
        const nextCode = getNextCode(runningList);
        const newRecord: MMAopProcessRateRecord = {
          id: `aop-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          code: nextCode,
          aopType: r.aopType.trim(),
          processLoss: Number(r.processLoss) || 0,
          rate: Number(r.rate) || 0,
          status: r.status,
          createdAt: now,
          updatedAt: now,
        };
        runningList.push(newRecord);
      });

      saveRecords(runningList);
      toast.success(
        createRows.length === 1
          ? "AOP Process Rate record created successfully"
          : `${createRows.length} AOP Process Rate records created successfully`
      );
      setIsModalOpen(false);
    } else if (modalMode === "edit" && activeItem) {
      if (!singleAopType.trim()) {
        toast.error("Please select an AOP Type.");
        return;
      }
      if (Number(singleProcessLoss) < 0) {
        toast.error("Process Loss cannot be negative.");
        return;
      }
      if (Number(singleRate) < 0) {
        toast.error("Rate cannot be negative.");
        return;
      }

      const now = new Date().toISOString().slice(0, 10);
      const updated = rates.map((r) =>
        r.id === activeItem.id
          ? {
              ...r,
              aopType: singleAopType.trim(),
              processLoss: Number(singleProcessLoss) || 0,
              rate: Number(singleRate) || 0,
              status: singleStatus,
              updatedAt: now,
            }
          : r
      );

      saveRecords(updated);
      toast.success(`AOP Process Rate ${activeItem.code} updated successfully`);
      setIsModalOpen(false);
    }
  };

  const handleToggleStatus = (item: MMAopProcessRateRecord) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";
    setConfirmDialog({
      isOpen: true,
      type: "status",
      item,
      targetStatus: nextStatus,
    });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.item) return;

    if (confirmDialog.type === "delete") {
      const updated = rates.filter((r) => r.id !== confirmDialog.item!.id);
      saveRecords(updated);
      toast.success(`Record ${confirmDialog.item.code} deleted successfully`);
    } else if (confirmDialog.type === "status" && confirmDialog.targetStatus) {
      const now = new Date().toISOString().slice(0, 10);
      const updated = rates.map((r) =>
        r.id === confirmDialog.item!.id
          ? { ...r, status: confirmDialog.targetStatus!, updatedAt: now }
          : r
      );
      saveRecords(updated);
      toast.success(
        `Record ${confirmDialog.item.code} set to ${confirmDialog.targetStatus}`
      );
    }
    setConfirmDialog({ isOpen: false, type: "delete", item: null });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Layers className="w-4 h-4" />
            <span>Merchandising Master Data</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            AOP Process Rate Register
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage all-over-printing process loss percentages and cost rates per kilogram
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create AOP Process Rate</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by code or AOP type..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={aopTypeFilter}
            onChange={(e) => {
              setAopTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by AOP Type"
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All AOP Types</option>
            {AOP_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "ALL" | "Active" | "Inactive");
              setCurrentPage(1);
            }}
            aria-label="Filter by Status"
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Register Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5 w-14 text-center">SL</th>
                <th className="px-4 py-3.5">Code</th>
                <th className="px-4 py-3.5">AOP Type</th>
                <th className="px-4 py-3.5 text-right">Process Loss (%)</th>
                <th className="px-4 py-3.5 text-right">Rate ($/kg)</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedRates.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    No AOP Process Rate records found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedRates.map((item, idx) => {
                  const sl = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-center text-slate-500 font-mono text-xs">
                        {sl}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-indigo-600 dark:text-indigo-400 font-mono text-xs">
                        {item.code}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          <span>{item.aopType}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                        {item.processLoss.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        ${item.rate.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          title={`Click to set ${item.status === "Active" ? "Inactive" : "Active"}`}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                            item.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          <span>{item.status}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenView(item)}
                            title="View Details"
                            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Record"
                            className="p-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                type: "delete",
                                item,
                              });
                            }}
                            title="Delete Record"
                            className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400"
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

        {/* Pagination & Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {filteredRates.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredRates.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {filteredRates.length}
            </span>{" "}
            entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit / View Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {modalMode === "create"
                    ? "Create AOP Process Rate"
                    : modalMode === "edit"
                    ? `Edit AOP Process Rate (${activeItem?.code})`
                    : `View AOP Process Rate Details (${activeItem?.code})`}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {modalMode === "create"
                    ? "Enter process loss and rate per kilogram. You can add multiple rows at once."
                    : modalMode === "edit"
                    ? "Modify existing AOP process rate parameters."
                    : "Read-only summary of the selected AOP process rate."}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {modalMode === "create" ? (
                /* Multi-Row Create Mode */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      AOP Process Rate Rows ({createRows.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddCreateRow}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/70 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add AOP Row</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {createRows.map((row, idx) => (
                      <div
                        key={row.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 relative space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          <span>Row #{idx + 1}</span>
                          {createRows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCreateRow(row.id)}
                              className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 p-1 rounded"
                              title="Remove row"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          {/* AOP Type */}
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              AOP Type <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={row.aopType}
                              onChange={(e) =>
                                handleUpdateCreateRow(row.id, "aopType", e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              {AOP_TYPES.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Process Loss */}
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Process Loss (%) <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                value={row.processLoss}
                                onChange={(e) =>
                                  handleUpdateCreateRow(
                                    row.id,
                                    "processLoss",
                                    e.target.value
                                  )
                                }
                                placeholder="0.0"
                                className="w-full pl-3 pr-8 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                              <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>

                          {/* Rate */}
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Rate ($/kg) <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={row.rate}
                                onChange={(e) =>
                                  handleUpdateCreateRow(
                                    row.id,
                                    "rate",
                                    e.target.value
                                  )
                                }
                                placeholder="0.00"
                                className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                              <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>

                          {/* Status */}
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Status
                            </label>
                            <select
                              value={row.status}
                              onChange={(e) =>
                                handleUpdateCreateRow(
                                  row.id,
                                  "status",
                                  e.target.value as "Active" | "Inactive"
                                )
                              }
                              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Edit & View Modes */
                <div className="space-y-4">
                  {modalMode === "edit" || modalMode === "view" ? (
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg text-xs font-mono text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                      <span>Code: {activeItem?.code}</span>
                      <span>Created: {activeItem?.createdAt}</span>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* AOP Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        AOP Type <span className="text-rose-500">*</span>
                      </label>
                      {modalMode === "view" ? (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                          {singleAopType}
                        </div>
                      ) : (
                        <select
                          value={singleAopType}
                          onChange={(e) => setSingleAopType(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {AOP_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Process Loss */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        AOP Process Loss (%) <span className="text-rose-500">*</span>
                      </label>
                      {modalMode === "view" ? (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm font-mono text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                          {Number(singleProcessLoss).toFixed(2)}%
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={singleProcessLoss}
                            onChange={(e) => setSingleProcessLoss(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      )}
                    </div>

                    {/* Rate */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        AOP Rate ($/kg) <span className="text-rose-500">*</span>
                      </label>
                      {modalMode === "view" ? (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm font-mono font-semibold text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                          ${Number(singleRate).toFixed(2)} / kg
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={singleRate}
                            onChange={(e) => setSingleRate(e.target.value)}
                            className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Status
                      </label>
                      {modalMode === "view" ? (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm border border-slate-200 dark:border-slate-700">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              singleStatus === "Active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {singleStatus}
                          </span>
                        </div>
                      ) : (
                        <select
                          value={singleStatus}
                          onChange={(e) =>
                            setSingleStatus(e.target.value as "Active" | "Inactive")
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>
                {modalMode !== "view" && (
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm transition-all"
                  >
                    {modalMode === "create" ? "Save Records" : "Update Record"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full ${
                  confirmDialog.type === "delete"
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {confirmDialog.type === "delete"
                    ? "Delete AOP Process Rate"
                    : "Change Status"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Record:{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {confirmDialog.item?.code} - {confirmDialog.item?.aopType}
                  </span>
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              {confirmDialog.type === "delete"
                ? "Are you sure you want to permanently delete this AOP process rate record? This action cannot be undone."
                : `Are you sure you want to change the status of this record to ${confirmDialog.targetStatus}?`}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() =>
                  setConfirmDialog({ isOpen: false, type: "delete", item: null })
                }
                className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all ${
                  confirmDialog.type === "delete"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {confirmDialog.type === "delete"
                  ? "Delete"
                  : `Set to ${confirmDialog.targetStatus}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AopRateManager;
