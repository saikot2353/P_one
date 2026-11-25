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
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMYarnDyeingRate,
  YDTypeOption,
  YDColorShadeOption,
  YDDyeingMethodOption,
  YD_TYPES_OPTIONS,
  YD_COLOR_SHADES,
  YD_DYEING_METHODS_OPTIONS,
  MMMasterDataRepository,
} from "../../../lib/merchandising-master-data";
import { SearchableSelect } from "../../ui/searchable-select";

export function YarnDyeingRateManager() {
  const [rates, setRates] = useState<MMYarnDyeingRate[]>(() =>
    MMMasterDataRepository.getYarnDyeingRates()
  );

  const saveRecords = (newRecords: MMYarnDyeingRate[]) => {
    setRates(newRecords);
    MMMasterDataRepository.saveYarnDyeingRates(newRecords);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [shadeFilter, setShadeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeItem, setActiveItem] = useState<MMYarnDyeingRate | null>(null);

  // Form Multi-Row State for Create Modal
  const [rows, setRows] = useState<
    {
      id: string;
      ydType: YDTypeOption | "";
      colorShade: YDColorShadeOption | "";
      dyeingMethod: YDDyeingMethodOption | "";
      processLoss: number | string;
      rate: number | string;
    }[]
  >([
    {
      id: "ydr-row-1",
      ydType: "Feeder Stripe",
      colorShade: "Medium",
      dyeingMethod: "Reactive",
      processLoss: 3.0,
      rate: 0.75,
    },
  ]);
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "status";
    item: MMYarnDyeingRate | null;
    targetStatus?: "Active" | "Inactive";
  }>({ isOpen: false, type: "delete", item: null });

  const handleOpenCreate = () => {
    setActiveItem(null);
    setModalMode("create");
    setRows([
      {
        id: `ydr-row-${Date.now()}`,
        ydType: "Feeder Stripe",
        colorShade: "Medium",
        dyeingMethod: "Reactive",
        processLoss: 3.0,
        rate: 0.75,
      },
    ]);
    setFormStatus("Active");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MMYarnDyeingRate) => {
    setActiveItem(item);
    setModalMode("edit");
    setRows([
      {
        id: `ydr-row-${item.id}`,
        ydType: item.ydType,
        colorShade: item.colorShade,
        dyeingMethod: item.dyeingMethod,
        processLoss:
          item.processLoss !== undefined && item.processLoss !== null ? item.processLoss : 3.0,
        rate: item.rate,
      },
    ]);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  const handleOpenView = (item: MMYarnDyeingRate) => {
    setActiveItem(item);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `ydr-row-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ydType: "Feeder Stripe",
        colorShade: "Medium",
        dyeingMethod: "Reactive",
        processLoss: 3.0,
        rate: 0.75,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) {
      toast.error("At least one Yarn Dyeing Rate row is required.");
      return;
    }
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRowChange = (
    index: number,
    field: "ydType" | "colorShade" | "dyeingMethod" | "processLoss" | "rate",
    value: any
  ) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.ydType) {
        toast.error(`Row #${i + 1}: Please select a Y/D Type.`);
        return;
      }
      if (!r.colorShade) {
        toast.error(`Row #${i + 1}: Please select a Color Shade.`);
        return;
      }
      if (!r.dyeingMethod) {
        toast.error(`Row #${i + 1}: Please select a Dyeing Method.`);
        return;
      }
      const lossNum = typeof r.processLoss === "string" ? parseFloat(r.processLoss) : r.processLoss;
      if (isNaN(lossNum) || lossNum < 0) {
        toast.error(`Row #${i + 1}: Please enter a valid non-negative Y/D Process Loss (%).`);
        return;
      }
      const rateNum = typeof r.rate === "string" ? parseFloat(r.rate) : r.rate;
      if (isNaN(rateNum) || rateNum < 0) {
        toast.error(`Row #${i + 1}: Please enter a valid non-negative Rate (USD / kg).`);
        return;
      }
    }

    const now = new Date().toISOString().split("T")[0];

    if (modalMode === "create") {
      const newRecords: MMYarnDyeingRate[] = rows.map((r, idx) => ({
        id: `ydr-${Date.now()}-${idx}`,
        code: `YDR-${String(rates.length + idx + 1).padStart(3, "0")}`,
        ydType: r.ydType as YDTypeOption,
        colorShade: r.colorShade as YDColorShadeOption,
        dyeingMethod: r.dyeingMethod as YDDyeingMethodOption,
        processLoss: Number(r.processLoss) || 0,
        rate: Number(r.rate) || 0,
        status: formStatus,
        createdAt: now,
        updatedAt: now,
      }));
      saveRecords([...newRecords, ...rates]);
      toast.success(`Created ${newRecords.length} Yarn Dyeing Rate record(s) successfully.`);
    } else if (modalMode === "edit" && activeItem) {
      const firstRow = rows[0];
      const updatedActive: MMYarnDyeingRate = {
        ...activeItem,
        ydType: firstRow.ydType as YDTypeOption,
        colorShade: firstRow.colorShade as YDColorShadeOption,
        dyeingMethod: firstRow.dyeingMethod as YDDyeingMethodOption,
        processLoss: Number(firstRow.processLoss) || 0,
        rate: Number(firstRow.rate) || 0,
        status: formStatus,
        updatedAt: now,
      };

      const additionalRecords: MMYarnDyeingRate[] = rows.slice(1).map((r, idx) => ({
        id: `ydr-${Date.now()}-${idx}`,
        code: `YDR-${String(rates.length + idx + 1).padStart(3, "0")}`,
        ydType: r.ydType as YDTypeOption,
        colorShade: r.colorShade as YDColorShadeOption,
        dyeingMethod: r.dyeingMethod as YDDyeingMethodOption,
        processLoss: Number(r.processLoss) || 0,
        rate: Number(r.rate) || 0,
        status: formStatus,
        createdAt: now,
        updatedAt: now,
      }));

      const updatedRates = rates.map((r) => (r.id === activeItem.id ? updatedActive : r));
      saveRecords([...additionalRecords, ...updatedRates]);
      toast.success(`Yarn Dyeing Rate updated successfully.`);
    }

    setIsModalOpen(false);
  };

  const promptStatusChange = (item: MMYarnDyeingRate) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";
    setConfirmDialog({
      isOpen: true,
      type: "status",
      item,
      targetStatus: nextStatus,
    });
  };

  const promptDelete = (item: MMYarnDyeingRate) => {
    setConfirmDialog({ isOpen: true, type: "delete", item });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.item) return;

    if (confirmDialog.type === "delete") {
      const filtered = rates.filter((r) => r.id !== confirmDialog.item!.id);
      saveRecords(filtered);
      toast.success(
        `Yarn Dyeing Rate "${confirmDialog.item.ydType} - ${confirmDialog.item.colorShade} (${confirmDialog.item.dyeingMethod})" deleted.`
      );
    } else if (confirmDialog.type === "status" && confirmDialog.targetStatus) {
      const updated = rates.map((r) =>
        r.id === confirmDialog.item!.id
          ? {
              ...r,
              status: confirmDialog.targetStatus!,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : r
      );
      saveRecords(updated);
      toast.success(`Status updated for "${confirmDialog.item.code}".`);
    }

    setConfirmDialog({ isOpen: false, type: "delete", item: null });
  };

  const filteredRecords = useMemo(() => {
    return rates.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.ydType.toLowerCase().includes(q) ||
        r.colorShade.toLowerCase().includes(q) ||
        r.dyeingMethod.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q);
      const matchType = typeFilter === "ALL" || r.ydType === typeFilter;
      const matchShade = shadeFilter === "ALL" || r.colorShade === shadeFilter;
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
      return matchSearch && matchType && matchShade && matchStatus;
    });
  }, [rates, searchQuery, typeFilter, shadeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, shadeFilter, statusFilter]);

  const ydTypeOptions = useMemo(
    () => YD_TYPES_OPTIONS.map((t) => ({ value: t, label: t })),
    []
  );

  const shadeOptions = useMemo(
    () => YD_COLOR_SHADES.map((s) => ({ value: s, label: s })),
    []
  );

  const methodOptions = useMemo(
    () => YD_DYEING_METHODS_OPTIONS.map((m) => ({ value: m, label: m })),
    []
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Layers className="size-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Yarn Dyeing (Y/D) Rate Master
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold">
                {rates.length} records
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Manage yarn dyeing rates by Y/D Type (Feeder Stripe, Engineering Stripe), Color Shade, and Dyeing Method.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="size-4" />
          <span>Create Y/D Rate</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-72">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search type, shade, method, code..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <span className="text-xs font-semibold text-slate-500">Y/D Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">All Types</option>
            {YD_TYPES_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <span className="text-xs font-semibold text-slate-500 ml-2">Shade:</span>
          <select
            value={shadeFilter}
            onChange={(e) => setShadeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">All Shades</option>
            {YD_COLOR_SHADES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <span className="text-xs font-semibold text-slate-500 ml-2">Status:</span>
          {(["ALL", "Active", "Inactive"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === s
                  ? "bg-amber-600 text-white shadow-xs"
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
                <th className="py-3.5 px-4">Y/D Type</th>
                <th className="py-3.5 px-4">Color Shade</th>
                <th className="py-3.5 px-4">Dyeing Method</th>
                <th className="py-3.5 px-4 text-right">Process Loss (%)</th>
                <th className="py-3.5 px-4 text-right">Rate (USD/kg)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Layers className="size-8 mx-auto mb-2 opacity-40 text-amber-500" />
                    <p className="font-bold">No Yarn Dyeing Rates found</p>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                      {item.code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-900">
                        {item.ydType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] border border-indigo-100 dark:border-indigo-900">
                        {item.colorShade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200 font-semibold">
                      {item.dyeingMethod}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                      {item.processLoss !== undefined ? `${item.processLoss}%` : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 dark:text-white">
                      ${item.rate.toFixed(2)}
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

      {/* Modal: Create (Multi-row), Edit, View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Layers className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {modalMode === "create"
                      ? "Create Yarn Dyeing (Y/D) Rate"
                      : modalMode === "edit"
                        ? `Edit Yarn Dyeing (Y/D) Rate — ${activeItem?.code}`
                        : `View Yarn Dyeing (Y/D) Rate — ${activeItem?.code}`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {modalMode === "view"
                      ? "Inspection of yarn dyeing rate specifications"
                      : "Define yarn dyeing rate records in structured table rows with process loss and rates"}
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

            {modalMode === "view" ? (
              <div className="p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Y/D Rate Code
                    </span>
                    <p className="text-sm font-mono font-bold text-amber-700 dark:text-amber-400">
                      {activeItem?.code}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block text-right">
                      Status
                    </span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        activeItem?.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                      }`}
                    >
                      {activeItem?.status}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200">
                      <tr className="border-b border-slate-200 dark:border-slate-700 font-bold text-[11px]">
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 w-[20%]">
                          Y/D Type
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 w-[20%]">
                          Color Shade
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 w-[24%]">
                          Dyeing Method
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 text-right w-[18%]">
                          Y/D Process Loss (%)
                        </th>
                        <th className="py-2.5 px-3 text-right w-[18%]">
                          Y/D Rate ($/kg)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900">
                      <tr>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-700 font-bold align-middle">
                          <span className="inline-block px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-900">
                            {activeItem?.ydType}
                          </span>
                        </td>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-700 font-bold align-middle">
                          <span className="inline-block px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] border border-indigo-100 dark:border-indigo-900">
                            {activeItem?.colorShade}
                          </span>
                        </td>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 align-middle">
                          {activeItem?.dyeingMethod}
                        </td>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-700 text-right font-mono font-bold text-slate-800 dark:text-slate-200 align-middle">
                          {activeItem?.processLoss !== undefined ? `${activeItem.processLoss}%` : "—"}
                        </td>
                        <td className="p-3 text-right font-mono font-black text-amber-700 dark:text-amber-400 align-middle">
                          ${activeItem?.rate.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200">
                      <tr className="border-b border-slate-200 dark:border-slate-700 font-bold text-[11px]">
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 w-[22%] min-w-[150px]">
                          Y/D Type <span className="text-rose-500">*</span>
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 w-[20%] min-w-[140px]">
                          Color Shade <span className="text-rose-500">*</span>
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 w-[24%] min-w-[160px]">
                          Dyeing Method <span className="text-rose-500">*</span>
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 text-right w-[16%] min-w-[110px]">
                          Y/D Process Loss (%) <span className="text-rose-500">*</span>
                        </th>
                        <th className="py-2.5 px-3 text-right w-[14%] min-w-[110px]">
                          Y/D Rate ($/kg) <span className="text-rose-500">*</span>
                        </th>
                        <th className="py-2.5 px-2 text-center w-[4%] min-w-[36px]">
                          {/* Actions */}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                      {rows.map((row, idx) => (
                        <tr
                          key={row.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                        >
                          {/* 1. Y/D Type */}
                          <td className="p-2 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <SearchableSelect
                              options={ydTypeOptions}
                              value={row.ydType}
                              onChange={(val) =>
                                handleRowChange(idx, "ydType", val as YDTypeOption)
                              }
                              placeholder="Select Y/D Type..."
                              className="h-9 text-xs"
                            />
                          </td>

                          {/* 2. Color Shade */}
                          <td className="p-2 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <SearchableSelect
                              options={shadeOptions}
                              value={row.colorShade}
                              onChange={(val) =>
                                handleRowChange(idx, "colorShade", val as YDColorShadeOption)
                              }
                              placeholder="Select Color Shade..."
                              className="h-9 text-xs"
                            />
                          </td>

                          {/* 3. Dyeing Method */}
                          <td className="p-2 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <SearchableSelect
                              options={methodOptions}
                              value={row.dyeingMethod}
                              onChange={(val) =>
                                handleRowChange(idx, "dyeingMethod", val as YDDyeingMethodOption)
                              }
                              placeholder="Select Dyeing Method..."
                              className="h-9 text-xs"
                            />
                          </td>

                          {/* 4. Y/D Process Loss (%) */}
                          <td className="p-2 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              required
                              value={row.processLoss}
                              onChange={(e) => handleRowChange(idx, "processLoss", e.target.value)}
                              placeholder="e.g. 3.0"
                              className="w-full px-2.5 py-1.5 text-xs text-right font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                            />
                          </td>

                          {/* 5. Y/D Rate ($/kg) */}
                          <td className="p-2 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <div className="relative">
                              <DollarSign className="size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={row.rate}
                                onChange={(e) => handleRowChange(idx, "rate", e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-6 pr-2.5 py-1.5 text-xs text-right font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                              />
                            </div>
                          </td>

                          {/* Row Actions */}
                          <td className="p-2 text-center align-middle">
                            <button
                              type="button"
                              disabled={rows.length <= 1}
                              onClick={() => handleRemoveRow(idx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                              title="Delete Row"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Add</span>
                  </button>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Status
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="ydr-status"
                          checked={formStatus === "Active"}
                          onChange={() => setFormStatus("Active")}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          Active
                        </span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="ydr-status"
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
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    {modalMode === "create" ? "Save Records" : "Save Changes"}
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`size-10 rounded-xl flex items-center justify-center ${
                  confirmDialog.type === "delete"
                    ? "bg-rose-100 dark:bg-rose-950/80 text-rose-600"
                    : "bg-amber-100 dark:bg-amber-950/80 text-amber-600"
                }`}
              >
                {confirmDialog.type === "delete" ? (
                  <Trash2 className="size-5" />
                ) : (
                  <AlertTriangle className="size-5" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {confirmDialog.type === "delete" ? "Delete Record?" : "Change Status?"}
                </h4>
                <p className="text-xs text-slate-500">
                  {confirmDialog.type === "delete"
                    ? `Are you sure you want to permanently delete Yarn Dyeing Rate "${confirmDialog.item.code}"?`
                    : `Set status of "${confirmDialog.item.code}" to ${confirmDialog.targetStatus}?`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmDialog({ isOpen: false, type: "delete", item: null })}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-1.5 rounded-xl text-white font-bold text-xs transition-colors cursor-pointer ${
                  confirmDialog.type === "delete"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {confirmDialog.type === "delete" ? "Delete" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YarnDyeingRateManager;
