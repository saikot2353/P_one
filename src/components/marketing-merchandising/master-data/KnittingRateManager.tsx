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
  Gauge,
  DollarSign,
  Percent,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMKnittingRate,
  FeederTypeOption,
  FEEDER_TYPES,
  ColorTypeOption,
  COLOR_TYPES,
  MMMasterDataRepository,
} from "../../../lib/merchandising-master-data";
import { SearchableSelect } from "../../ui/searchable-select";

export function KnittingRateManager() {
  const [rates, setRates] = useState<MMKnittingRate[]>(() =>
    MMMasterDataRepository.getKnittingRates(),
  );

  // Active fabric types from Fabric Type master
  const activeFabricTypes = useMemo(() => {
    return MMMasterDataRepository.getFabricTypes().filter((ft) => ft.status === "Active");
  }, []);

  const saveRecords = (newRecords: MMKnittingRate[]) => {
    setRates(newRecords);
    MMMasterDataRepository.saveKnittingRates(newRecords);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [feederFilter, setFeederFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeItem, setActiveItem] = useState<MMKnittingRate | null>(null);

  // Form Multi-Row State
  const [rows, setRows] = useState<
    {
      id: string;
      fabricTypeId: string;
      colorType: ColorTypeOption | "";
      feederType: FeederTypeOption | "";
      processLossPct: number | string;
      knittingRate: number | string;
    }[]
  >([
    {
      id: "kr-row-1",
      fabricTypeId: "",
      colorType: "Solid",
      feederType: "",
      processLossPct: 3.5,
      knittingRate: 0.45,
    },
  ]);
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "status";
    item: MMKnittingRate | null;
    targetStatus?: "Active" | "Inactive";
  }>({ isOpen: false, type: "delete", item: null });

  const handleOpenCreate = () => {
    setActiveItem(null);
    setModalMode("create");
    setRows([
      {
        id: `kr-row-${Date.now()}`,
        fabricTypeId: activeFabricTypes[0]?.id || "",
        colorType: "Solid",
        feederType: "",
        processLossPct: 3.5,
        knittingRate: 0.45,
      },
    ]);
    setFormStatus("Active");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MMKnittingRate) => {
    setActiveItem(item);
    setModalMode("edit");
    const feeder = (item.feederType !== undefined
      ? item.feederType
      : item.fitterType?.includes("Half")
      ? "Half Feeder"
      : item.fitterType?.includes("Full")
      ? "Full Feeder"
      : "") as FeederTypeOption;
    setRows([
      {
        id: `kr-row-${item.id}`,
        fabricTypeId: item.fabricTypeId,
        colorType: item.colorType || "Solid",
        feederType: feeder,
        processLossPct: item.processLossPct,
        knittingRate: item.knittingRate,
      },
    ]);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  const handleOpenView = (item: MMKnittingRate) => {
    setActiveItem(item);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `kr-row-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        fabricTypeId: activeFabricTypes[0]?.id || "",
        colorType: "Solid",
        feederType: "",
        processLossPct: 3.5,
        knittingRate: 0.45,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) {
      toast.error("At least one Knitting Process Rate row is required.");
      return;
    }
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRowChange = (
    index: number,
    field: "fabricTypeId" | "colorType" | "feederType" | "processLossPct" | "knittingRate",
    value: any,
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
      if (!r.fabricTypeId) {
        toast.error(`Row #${i + 1}: Please select a Fabric Type.`);
        return;
      }
      if (!r.colorType) {
        toast.error(`Row #${i + 1}: Please select a Color Type.`);
        return;
      }
      const lossNum =
        typeof r.processLossPct === "string" ? parseFloat(r.processLossPct) : r.processLossPct;
      if (isNaN(lossNum) || lossNum < 0) {
        toast.error(`Row #${i + 1}: Please enter a valid non-negative Process Loss (%).`);
        return;
      }
      const rateNum =
        typeof r.knittingRate === "string" ? parseFloat(r.knittingRate) : r.knittingRate;
      if (isNaN(rateNum) || rateNum < 0) {
        toast.error(`Row #${i + 1}: Please enter a valid non-negative Rate (USD/kg).`);
        return;
      }
    }

    const now = new Date().toISOString().split("T")[0];

    if (modalMode === "create") {
      const newRecords: MMKnittingRate[] = rows.map((r, idx) => {
        const matchedFabric = activeFabricTypes.find((f) => f.id === r.fabricTypeId);
        const fabricName = matchedFabric ? matchedFabric.name : "Standard Fabric";
        const feeder = (r.feederType ?? "") as FeederTypeOption;
        return {
          id: `kr-${Date.now()}-${idx}`,
          code: `KR-${String(rates.length + idx + 1).padStart(3, "0")}`,
          fabricTypeId: r.fabricTypeId,
          fabricTypeName: fabricName,
          colorType: (r.colorType || "Solid") as ColorTypeOption,
          feederType: feeder,
          fitterType: feeder,
          processLossPct: Number(r.processLossPct) || 0,
          knittingRate: Number(r.knittingRate) || 0,
          status: formStatus,
          createdAt: now,
          updatedAt: now,
        };
      });
      saveRecords([...newRecords, ...rates]);
      toast.success(`Created ${newRecords.length} Knitting Process Rate record(s) successfully.`);
    } else if (modalMode === "edit" && activeItem) {
      const firstRow = rows[0];
      const matchedFabric = activeFabricTypes.find((f) => f.id === firstRow.fabricTypeId);
      const fabricName = matchedFabric ? matchedFabric.name : activeItem.fabricTypeName;
      const feeder = (firstRow.feederType ?? "") as FeederTypeOption;

      const updatedActive: MMKnittingRate = {
        ...activeItem,
        fabricTypeId: firstRow.fabricTypeId,
        fabricTypeName: fabricName,
        colorType: (firstRow.colorType || "Solid") as ColorTypeOption,
        feederType: feeder,
        fitterType: feeder,
        processLossPct: Number(firstRow.processLossPct) || 0,
        knittingRate: Number(firstRow.knittingRate) || 0,
        status: formStatus,
        updatedAt: now,
      };

      const additionalRecords: MMKnittingRate[] = rows.slice(1).map((r, idx) => {
        const mf = activeFabricTypes.find((f) => f.id === r.fabricTypeId);
        const fn = mf ? mf.name : "Standard Fabric";
        const fdr = (r.feederType ?? "") as FeederTypeOption;
        return {
          id: `kr-${Date.now()}-${idx}`,
          code: `KR-${String(rates.length + idx + 1).padStart(3, "0")}`,
          fabricTypeId: r.fabricTypeId,
          fabricTypeName: fn,
          colorType: (r.colorType || "Solid") as ColorTypeOption,
          feederType: fdr,
          fitterType: fdr,
          processLossPct: Number(r.processLossPct) || 0,
          knittingRate: Number(r.knittingRate) || 0,
          status: formStatus,
          createdAt: now,
          updatedAt: now,
        };
      });

      const updatedRates = rates.map((r) => (r.id === activeItem.id ? updatedActive : r));
      saveRecords([...additionalRecords, ...updatedRates]);
      toast.success(`Knitting Process Rate updated successfully.`);
    }

    setIsModalOpen(false);
  };

  const promptStatusChange = (item: MMKnittingRate) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";
    setConfirmDialog({
      isOpen: true,
      type: "status",
      item,
      targetStatus: nextStatus,
    });
  };

  const promptDelete = (item: MMKnittingRate) => {
    setConfirmDialog({ isOpen: true, type: "delete", item });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.item) return;

    if (confirmDialog.type === "delete") {
      const filtered = rates.filter((r) => r.id !== confirmDialog.item!.id);
      saveRecords(filtered);
      toast.success(`Knitting Rate "${confirmDialog.item.fabricTypeName}" deleted.`);
    } else if (confirmDialog.type === "status" && confirmDialog.targetStatus) {
      const updated = rates.map((r) =>
        r.id === confirmDialog.item!.id
          ? {
              ...r,
              status: confirmDialog.targetStatus!,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : r,
      );
      saveRecords(updated);
      toast.success(`Status updated for "${confirmDialog.item.fabricTypeName}".`);
    }

    setConfirmDialog({ isOpen: false, type: "delete", item: null });
  };

  const filteredRecords = useMemo(() => {
    return rates.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.fabricTypeName.toLowerCase().includes(q) ||
        (r.colorType && r.colorType.toLowerCase().includes(q)) ||
        (r.feederType && r.feederType.toLowerCase().includes(q)) ||
        (r.fitterType && r.fitterType.toLowerCase().includes(q)) ||
        r.code.toLowerCase().includes(q);
      const effectiveFeeder =
        r.feederType || (r.fitterType?.includes("Half") ? "Half Feeder" : "Full Feeder");
      const matchFeeder = feederFilter === "ALL" || effectiveFeeder === feederFilter;
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
      return matchSearch && matchFeeder && matchStatus;
    });
  }, [rates, searchQuery, feederFilter, statusFilter]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, feederFilter, statusFilter]);

  const fabricTypeOptions = useMemo(
    () => activeFabricTypes.map((ft) => ({ value: ft.id, label: ft.name })),
    [activeFabricTypes],
  );

  const colorTypeOptions = useMemo(
    () => COLOR_TYPES.map((c) => ({ value: c, label: c })),
    [],
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Gauge className="size-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Knitting Process Rate Master
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold">
                {rates.length} records
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Manage Feeder types (Half / Full Feeder), Color types (Solid / Y/D), active Fabric Type references, process loss (%), and standard rates.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="size-4" />
          <span>Create Knitting Process Rate</span>
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
            placeholder="Search fabric type, feeder, color, code..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Feeder:</span>
          {(["ALL", "Half Feeder", "Full Feeder"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFeederFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                feederFilter === f
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f}
            </button>
          ))}

          <span className="text-xs font-semibold text-slate-500 ml-2">Status:</span>
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
                <th className="py-3.5 px-4">Fabric Type</th>
                <th className="py-3.5 px-4">Color Type</th>
                <th className="py-3.5 px-4">Feeder Type</th>
                <th className="py-3.5 px-4 text-center">Process Loss (%)</th>
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
                    <Gauge className="size-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold">No Knitting Process Rates found</p>
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
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">
                      {item.fabricTypeName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold text-[11px] border border-sky-100 dark:border-sky-900">
                        {item.colorType || "Solid"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-[11px] border border-slate-200 dark:border-slate-700">
                        {item.feederType || "—"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      {item.processLossPct.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 dark:text-white">
                      ${item.knittingRate.toFixed(2)}
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
                  <Gauge className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {modalMode === "create"
                      ? "Create Knitting Process Rate"
                      : modalMode === "edit"
                        ? `Edit Knitting Rate — ${activeItem?.code}`
                        : `View Knitting Rate — ${activeItem?.code}`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {modalMode === "view"
                      ? "Inspection of knitting process rate specifications"
                      : "Define knitting process rate records in structured table rows"}
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
                      Knitting Rate Code
                    </span>
                    <p className="text-sm font-mono font-bold text-teal-700 dark:text-teal-400">
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
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 w-[26%]">
                          Fabric Type <span className="text-rose-500">*</span>
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 w-[18%]">
                          Color Type <span className="text-rose-500">*</span>
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 w-[18%]">
                          Feeder Type
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 text-right w-[18%]">
                          Process Loss (%) <span className="text-rose-500">*</span>
                        </th>
                        <th className="py-2.5 px-3 text-right w-[20%]">
                          Rate (USD/kg) <span className="text-rose-500">*</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900">
                      <tr>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white align-middle">
                          {activeItem?.fabricTypeName}
                        </td>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-700 align-middle">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-lg font-bold text-[11px] border ${
                              activeItem?.colorType === "Y/D"
                                ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                : "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800"
                            }`}
                          >
                            {activeItem?.colorType || "Solid"}
                          </span>
                        </td>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 align-middle">
                          {activeItem?.feederType || "—"}
                        </td>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-700 text-right font-mono font-bold text-amber-600 dark:text-amber-400 align-middle">
                          {activeItem?.processLossPct}%
                        </td>
                        <td className="p-3 text-right font-mono font-black text-teal-700 dark:text-teal-400 align-middle">
                          ${activeItem?.knittingRate.toFixed(2)}
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
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 w-[27%] min-w-[200px]">
                          Fabric Type <span className="text-rose-500">*</span>
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 w-[20%] min-w-[140px]">
                          Color Type <span className="text-rose-500">*</span>
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 w-[20%] min-w-[140px]">
                          Feeder Type
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 text-right w-[15%] min-w-[110px]">
                          Process Loss (%) <span className="text-rose-500">*</span>
                        </th>
                        <th className="py-2.5 px-3 text-right w-[14%] min-w-[110px]">
                          Rate (USD/kg) <span className="text-rose-500">*</span>
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
                          <td className="p-2 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <SearchableSelect
                              options={fabricTypeOptions}
                              value={row.fabricTypeId}
                              onChange={(val) => handleRowChange(idx, "fabricTypeId", val)}
                              placeholder="Select Fabric Type..."
                              className="h-9 text-xs"
                            />
                          </td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <SearchableSelect
                              options={colorTypeOptions}
                              value={row.colorType}
                              onChange={(val) =>
                                handleRowChange(idx, "colorType", val as ColorTypeOption)
                              }
                              placeholder="Select Color Type..."
                              className="h-9 text-xs"
                            />
                          </td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <select
                              value={row.feederType}
                              onChange={(e) =>
                                handleRowChange(idx, "feederType", e.target.value as FeederTypeOption)
                              }
                              className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium cursor-pointer focus:outline-none focus:border-teal-500"
                            >
                              {FEEDER_TYPES.map((f) => (
                                <option key={f} value={f}>
                                  {f}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              required
                              value={row.processLossPct}
                              onChange={(e) =>
                                handleRowChange(idx, "processLossPct", e.target.value)
                              }
                              placeholder="e.g. 3.5"
                              className="w-full px-2.5 py-1.5 text-xs text-right font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-mono"
                            />
                          </td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-700 align-middle">
                            <div className="relative">
                              <DollarSign className="size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={row.knittingRate}
                                onChange={(e) =>
                                  handleRowChange(idx, "knittingRate", e.target.value)
                                }
                                placeholder="0.00"
                                className="w-full pl-6 pr-2.5 py-1.5 text-xs text-right font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-mono"
                              />
                            </div>
                          </td>
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 font-bold text-xs transition-colors cursor-pointer"
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
                          name="kr-status"
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
                          name="kr-status"
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
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    {modalMode === "create" ? "Save Rate" : "Update Rate"}
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
                    ? "Delete Knitting Rate?"
                    : `Change Status to ${confirmDialog.targetStatus}?`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {confirmDialog.type === "delete"
                    ? `Are you sure you want to delete rate for "${confirmDialog.item.fabricTypeName} (${confirmDialog.item.feederType || confirmDialog.item.fitterType})"?`
                    : `Are you sure you want to change status to ${confirmDialog.targetStatus}?`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog({ isOpen: false, type: "delete", item: null })}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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

export default KnittingRateManager;
