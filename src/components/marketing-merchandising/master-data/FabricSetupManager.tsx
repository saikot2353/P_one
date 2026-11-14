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
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMFabricSetupRecord,
  MMMasterDataRepository,
  generateFabricName,
} from "../../../lib/merchandising-master-data";
import { SearchableSelect } from "../../ui/searchable-select";

const KNIT_FEEDER_OPTIONS = ["Half Feeder", "Full Feeder", ""];

const KNIT_WASH_OPTIONS = [
  "Acid Wash",
  "Stone Wash",
  "Enzyme Wash",
  "Panel Wash",
  "Hydrophilic Softener Wash",
];

const KNIT_FINISH_OPTIONS = [
  "Heatset Finish",
  "Brush Finish",
  "Peach Finish",
  "Peach-Brush Finish",
  "Shearing Finish",
  "Moisture Wicking Finish",
  "Teflon Finish",
];

const KNIT_SPINNING_OPTIONS = [
  "Ring",
  "Combed",
  "Carded",
  "Slub",
  "Filament",
  "Rotor",
  "Vortex",
  "Airjet",
];

const FABRIC_CATEGORY_OPTIONS = [
  "Knit Fabric",
  "Woven Fabric",
  "Fleece Fabric",
  "Rib Fabric",
  "Collar & Cuff",
];

export function FabricSetupManager() {
  const [fabrics, setFabrics] = useState<MMFabricSetupRecord[]>(() =>
    MMMasterDataRepository.getFabricSetups()
  );

  const saveRecords = (newRecords: MMFabricSetupRecord[]) => {
    setFabrics(newRecords);
    MMMasterDataRepository.saveFabricSetups(newRecords);
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cripton_mm_master_fabric_setup_v1") {
        setFabrics(MMMasterDataRepository.getFabricSetups());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeItem, setActiveItem] = useState<MMFabricSetupRecord | null>(null);

  // Form Fields (Duplicated from Pre Costing Entry Knit modal)
  const [fabricComposition, setFabricComposition] = useState("100% Cotton");
  const [fabricType, setFabricType] = useState("Single Jersey");
  const [gsm, setGsm] = useState<number | string>(180);
  const [spinningType, setSpinningType] = useState("Ring");
  const [feederType, setFeederType] = useState("");
  const [washType, setWashType] = useState("Hydrophilic Softener Wash");
  const [finishType, setFinishType] = useState("Heatset Finish");
  const [colorType, setColorType] = useState<"Solid" | "Y/D">("Solid");
  const [otherSpecs, setOtherSpecs] = useState("");
  const [fabricCategory, setFabricCategory] = useState("Knit Fabric");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  // Dynamic Master Data options for Composition and Fabric Type
  const masterCompositions = useMemo(() => {
    return MMMasterDataRepository.getFabricCompositions();
  }, [isModalOpen]);

  const masterFabricTypes = useMemo(() => {
    return MMMasterDataRepository.getFabricTypes();
  }, [isModalOpen]);

  const compositionOptions = useMemo(() => {
    const list = masterCompositions.map((fc) => ({
      value: fc.name,
      label: fc.name,
    }));
    if (fabricComposition && !list.some((o) => o.value === fabricComposition)) {
      list.unshift({ value: fabricComposition, label: fabricComposition });
    }
    return list;
  }, [masterCompositions, fabricComposition]);

  const fabricTypeOptions = useMemo(() => {
    const list = masterFabricTypes.map((ft) => ({
      value: ft.name,
      label: ft.name,
    }));
    if (fabricType && !list.some((o) => o.value === fabricType)) {
      list.unshift({ value: fabricType, label: fabricType });
    }
    return list;
  }, [masterFabricTypes, fabricType]);

  // Delete Dialog
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    item: MMFabricSetupRecord | null;
  }>({ isOpen: false, item: null });

  // Live Auto-Generated Fabric Name
  const liveFabricName = useMemo(() => {
    return generateFabricName({
      fabricComposition,
      fabricType,
      gsm,
      spinningType,
      feederType,
      washType,
      finishType,
      colorType,
      otherSpecs,
      fabricCategory,
    });
  }, [
    fabricComposition,
    fabricType,
    gsm,
    spinningType,
    feederType,
    washType,
    finishType,
    colorType,
    otherSpecs,
    fabricCategory,
  ]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setActiveItem(null);
    setModalMode("create");
    setFabricComposition(masterCompositions[0]?.name || "100% Cotton");
    setFabricType(masterFabricTypes[0]?.name || "Single Jersey");
    setGsm(180);
    setSpinningType("Ring");
    setFeederType("");
    setWashType("Hydrophilic Softener Wash");
    setFinishType("Heatset Finish");
    setColorType("Solid");
    setOtherSpecs("");
    setFabricCategory("Knit Fabric");
    setFormStatus("Active");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MMFabricSetupRecord) => {
    setActiveItem(item);
    setModalMode("edit");
    setFabricComposition(item.fabricComposition || "100% Cotton");
    setFabricType(item.fabricType || "Single Jersey");
    setGsm(item.gsm || 180);
    setSpinningType(item.spinningType || "Ring");
    setFeederType(item.feederType || "");
    setWashType(item.washType || "Hydrophilic Softener Wash");
    setFinishType(item.finishType || "Heatset Finish");
    setColorType(item.colorType || "Solid");
    setOtherSpecs(item.otherSpecs || "");
    setFabricCategory(item.fabricCategory || "Knit Fabric");
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  // Open View Modal
  const handleOpenView = (item: MMFabricSetupRecord) => {
    setActiveItem(item);
    setModalMode("view");
    setFabricComposition(item.fabricComposition || "");
    setFabricType(item.fabricType || "");
    setGsm(item.gsm || "");
    setSpinningType(item.spinningType || "");
    setFeederType(item.feederType || "");
    setWashType(item.washType || "");
    setFinishType(item.finishType || "");
    setColorType(item.colorType || "Solid");
    setOtherSpecs(item.otherSpecs || "");
    setFabricCategory(item.fabricCategory || "");
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  // Toggle Status
  const handleToggleStatus = (item: MMFabricSetupRecord) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";
    const now = new Date().toISOString().replace("T", " ").substring(0, 10);
    const updated = fabrics.map((f) =>
      f.id === item.id ? { ...f, status: nextStatus as "Active" | "Inactive", updatedAt: now } : f
    );
    saveRecords(updated);
    toast.success(`Fabric status updated to ${nextStatus}.`);
  };

  // Save Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().replace("T", " ").substring(0, 10);

    if (!fabricComposition.trim()) {
      toast.error("Fabric Composition is required.");
      return;
    }
    if (!fabricType.trim()) {
      toast.error("Fabric Type is required.");
      return;
    }
    const gsmNum = Number(gsm) || 0;
    if (gsmNum <= 0) {
      toast.error("Valid GSM is required.");
      return;
    }

    const generatedName = liveFabricName;

    if (modalMode === "create") {
      const exists = fabrics.some(
        (f) => f.fabricName.toLowerCase() === generatedName.toLowerCase()
      );
      if (exists) {
        toast.error("A fabric with identical specifications already exists.");
        return;
      }

      const newRecord: MMFabricSetupRecord = {
        id: `fs-${Date.now()}`,
        code: `FAB-${String(fabrics.length + 1).padStart(3, "0")}`,
        fabricName: generatedName,
        fabricComposition: fabricComposition.trim(),
        fabricType: fabricType.trim(),
        gsm: gsmNum,
        spinningType: spinningType.trim(),
        feederType: feederType.trim(),
        washType: washType.trim(),
        finishType: finishType.trim(),
        colorType,
        otherSpecs: otherSpecs.trim(),
        fabricCategory: fabricCategory.trim(),
        status: formStatus,
        createdAt: now,
        updatedAt: now,
      };

      saveRecords([newRecord, ...fabrics]);
      toast.success("Fabric setup record created successfully.");
    } else if (modalMode === "edit" && activeItem) {
      const exists = fabrics.some(
        (f) =>
          f.id !== activeItem.id &&
          f.fabricName.toLowerCase() === generatedName.toLowerCase()
      );
      if (exists) {
        toast.error("Another fabric with identical specifications already exists.");
        return;
      }

      const updated = fabrics.map((f) =>
        f.id === activeItem.id
          ? {
              ...f,
              fabricName: generatedName,
              fabricComposition: fabricComposition.trim(),
              fabricType: fabricType.trim(),
              gsm: gsmNum,
              spinningType: spinningType.trim(),
              feederType: feederType.trim(),
              washType: washType.trim(),
              finishType: finishType.trim(),
              colorType,
              otherSpecs: otherSpecs.trim(),
              fabricCategory: fabricCategory.trim(),
              status: formStatus,
              updatedAt: now,
            }
          : f
      );

      saveRecords(updated);
      toast.success("Fabric setup record updated successfully.");
    }

    setIsModalOpen(false);
  };

  // Delete Handler
  const handleDeleteConfirm = () => {
    if (!confirmDelete.item) return;
    const toDelete = confirmDelete.item;
    const filtered = fabrics.filter((f) => f.id !== toDelete.id);
    saveRecords(filtered);
    toast.success("Fabric record deleted.");
    setConfirmDelete({ isOpen: false, item: null });
  };

  // Filter & Pagination
  const filteredFabrics = useMemo(() => {
    return fabrics.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.fabricName.toLowerCase().includes(q);
        const matchComp = item.fabricComposition.toLowerCase().includes(q);
        const matchType = item.fabricType.toLowerCase().includes(q);
        const matchCat = item.fabricCategory.toLowerCase().includes(q);
        const matchColor = item.colorType.toLowerCase().includes(q);
        if (!matchName && !matchComp && !matchType && !matchCat && !matchColor) return false;
      }
      return true;
    });
  }, [fabrics, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredFabrics.length / itemsPerPage) || 1;
  const paginatedFabrics = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFabrics.slice(start, start + itemsPerPage);
  }, [filteredFabrics, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Fabric Register
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                {fabrics.length} {fabrics.length === 1 ? "Fabric" : "Fabrics"}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {fabrics.filter((f) => f.status === "Active").length} Active
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
              Create Fabric
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by generated fabric name, composition, type, category..."
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
                <th className="py-3 px-4 min-w-[320px]">Fabric Name</th>
                <th className="py-3 px-4">Fabric Type</th>
                <th className="py-3 px-3 text-center">GSM</th>
                <th className="py-3 px-3 text-center">Color Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-3 text-center w-28">Status</th>
                <th className="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedFabrics.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <Layers className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-medium">No fabric records found.</p>
                  </td>
                </tr>
              ) : (
                paginatedFabrics.map((item, index) => {
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
                        <div
                          className="font-bold text-slate-900 dark:text-white text-xs hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                          onClick={() => handleOpenView(item)}
                        >
                          {item.fabricName}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {item.fabricType}
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                        {item.gsm}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                            item.colorType === "Y/D"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                              : "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300"
                          }`}
                        >
                          {item.colorType}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {item.fabricCategory}
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
              {filteredFabrics.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredFabrics.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {filteredFabrics.length}
            </span>{" "}
            fabrics
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

      {/* Create / Edit / View Modal (Duplicated and enhanced from Pre Costing Knit Fabric Create) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Layers className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {modalMode === "create" && "Create Fabric Specification"}
                    {modalMode === "edit" && "Edit Fabric Specification"}
                    {modalMode === "view" && "Fabric Specification Details"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Master Fabric Definition with automated naming
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Live Generated Fabric Name Box */}
              <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Automatically Generated Fabric Name</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white font-mono leading-relaxed">
                  {liveFabricName}
                </div>
              </div>

              {/* 3 fields per row layout (matching Pre Costing Knit modal) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Fabric Composition */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Fabric Composition <span className="text-rose-500">*</span>
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {fabricComposition}
                    </div>
                  ) : (
                    <SearchableSelect
                      options={compositionOptions}
                      value={fabricComposition}
                      onChange={(val) => setFabricComposition(val)}
                      placeholder="Select Fabric Composition..."
                      className="h-9 text-xs font-semibold"
                      allowCustom
                    />
                  )}
                </div>

                {/* 2. Fabric Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Fabric Type <span className="text-rose-500">*</span>
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {fabricType}
                    </div>
                  ) : (
                    <SearchableSelect
                      options={fabricTypeOptions}
                      value={fabricType}
                      onChange={(val) => setFabricType(val)}
                      placeholder="Select Fabric Type..."
                      className="h-9 text-xs font-semibold"
                      allowCustom
                    />
                  )}
                </div>

                {/* 3. GSM */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    GSM <span className="text-rose-500">*</span>
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">
                      {gsm}
                    </div>
                  ) : (
                    <input
                      type="number"
                      value={gsm}
                      onChange={(e) => setGsm(e.target.value)}
                      placeholder="e.g. 220"
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold font-mono"
                    />
                  )}
                </div>

                {/* 4. Spinning Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Spinning Type <span className="text-rose-500">*</span>
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {spinningType}
                    </div>
                  ) : (
                    <select
                      value={spinningType}
                      onChange={(e) => setSpinningType(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      {KNIT_SPINNING_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 5. Feeder Type (Half Feeder, Full Feeder, Blank) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Feeder Type <span className="text-rose-500">*</span>
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {feederType || "—"}
                    </div>
                  ) : (
                    <select
                      value={feederType}
                      onChange={(e) => setFeederType(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      {KNIT_FEEDER_OPTIONS.map((ft) => (
                        <option key={ft} value={ft}>
                          {ft}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 6. Wash Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Wash Type <span className="text-rose-500">*</span>
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {washType}
                    </div>
                  ) : (
                    <select
                      value={washType}
                      onChange={(e) => setWashType(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      {KNIT_WASH_OPTIONS.map((wt) => (
                        <option key={wt} value={wt}>
                          {wt}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 7. Finish Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Finish Type <span className="text-rose-500">*</span>
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {finishType}
                    </div>
                  ) : (
                    <select
                      value={finishType}
                      onChange={(e) => setFinishType(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      {KNIT_FINISH_OPTIONS.map((ft) => (
                        <option key={ft} value={ft}>
                          {ft}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* NEW: Color Type (immediately after Finish Type) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Color Type <span className="text-rose-500">*</span>
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {colorType}
                    </div>
                  ) : (
                    <select
                      value={colorType}
                      onChange={(e) => setColorType(e.target.value as "Solid" | "Y/D")}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      <option value="Solid">Solid</option>
                      <option value="Y/D">Y/D</option>
                    </select>
                  )}
                </div>

                {/* 8. Other Specifications */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Other Specifications
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {otherSpecs || "—"}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={otherSpecs}
                      onChange={(e) => setOtherSpecs(e.target.value)}
                      placeholder="e.g. Bio-washed combed cotton"
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    />
                  )}
                </div>

                {/* 9. Fabric Category */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Fabric Category <span className="text-rose-500">*</span>
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {fabricCategory}
                    </div>
                  ) : (
                    <select
                      value={fabricCategory}
                      onChange={(e) => setFabricCategory(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      {FABRIC_CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Status
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {formStatus}
                    </div>
                  ) : (
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end gap-2.5">
                {modalMode === "view" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Close
                    </button>
                    {activeItem && (
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(activeItem)}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Fabric
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                    >
                      {modalMode === "create" ? "Save Fabric Record" : "Update Fabric"}
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
                  Delete Fabric Setup
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete this fabric setup record?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">
                {confirmDelete.item.fabricName}
              </div>
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

export default FabricSetupManager;

