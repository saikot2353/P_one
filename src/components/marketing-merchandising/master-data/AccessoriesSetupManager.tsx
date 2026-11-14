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
  Package,
  ArrowRightLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMAccessoriesSetupRecord,
  MMMasterDataRepository,
} from "../../../lib/merchandising-master-data";

const UOM_OPTIONS = [
  "PCS",
  "DZN",
  "GG",
  "Gross",
  "MTR",
  "YDS",
  "THS",
  "SET",
  "CONE",
  "ROLL",
  "PKT",
  "BOX",
  "LBS",
  "KG",
];

const MARKET_UNIT_OPTIONS = [
  "Gross",
  "DZN",
  "GG",
  "PCS",
  "CONE",
  "ROLL",
  "PKT",
  "BOX",
  "THS",
  "YDS",
  "MTR",
  "KG",
  "LBS",
];

const HEAD_OPTIONS: Array<"Sewing Trims" | "Finishing Trims"> = [
  "Sewing Trims",
  "Finishing Trims",
];

export function AccessoriesSetupManager() {
  const [accessories, setAccessories] = useState<MMAccessoriesSetupRecord[]>(() =>
    MMMasterDataRepository.getAccessoriesSetups()
  );

  const saveRecords = (newRecords: MMAccessoriesSetupRecord[]) => {
    setAccessories(newRecords);
    MMMasterDataRepository.saveAccessoriesSetups(newRecords);
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cripton_mm_master_accessories_setup_v1") {
        setAccessories(MMMasterDataRepository.getAccessoriesSetups());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [headFilter, setHeadFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeItem, setActiveItem] = useState<MMAccessoriesSetupRecord | null>(null);

  // Form Fields
  const [accessoriesName, setAccessoriesName] = useState("");
  const [uom, setUom] = useState("PCS");
  const [marketUnit, setMarketUnit] = useState("Gross");
  const [relationFactor, setRelationFactor] = useState<number | string>(144);
  const [head, setHead] = useState<"Sewing Trims" | "Finishing Trims">("Sewing Trims");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  // Delete Dialog
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    item: MMAccessoriesSetupRecord | null;
  }>({ isOpen: false, item: null });

  // Open Create Modal
  const handleOpenCreate = () => {
    setActiveItem(null);
    setModalMode("create");
    setAccessoriesName("");
    setUom("PCS");
    setMarketUnit("Gross");
    setRelationFactor(144);
    setHead("Sewing Trims");
    setFormStatus("Active");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MMAccessoriesSetupRecord) => {
    setActiveItem(item);
    setModalMode("edit");
    setAccessoriesName(item.accessoriesName);
    setUom(item.uom);
    setMarketUnit(item.marketUnit);
    setRelationFactor(item.relationFactor);
    setHead(item.head);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  // Open View Modal
  const handleOpenView = (item: MMAccessoriesSetupRecord) => {
    setActiveItem(item);
    setModalMode("view");
    setAccessoriesName(item.accessoriesName);
    setUom(item.uom);
    setMarketUnit(item.marketUnit);
    setRelationFactor(item.relationFactor);
    setHead(item.head);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  // Toggle Status
  const handleToggleStatus = (item: MMAccessoriesSetupRecord) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";
    const now = new Date().toISOString().replace("T", " ").substring(0, 10);
    const updated = accessories.map((a) =>
      a.id === item.id ? { ...a, status: nextStatus as "Active" | "Inactive", updatedAt: now } : a
    );
    saveRecords(updated);
    toast.success(`Accessories "${item.accessoriesName}" status updated to ${nextStatus}.`);
  };

  // Save Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = accessoriesName.trim();
    if (!trimmed) {
      toast.error("Accessories Name is required.");
      return;
    }
    const factorNum = Number(relationFactor) || 0;
    if (factorNum <= 0) {
      toast.error("Relation Factor must be greater than 0.");
      return;
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 10);

    if (modalMode === "create") {
      const exists = accessories.some(
        (a) => a.accessoriesName.toLowerCase() === trimmed.toLowerCase() && a.head === head
      );
      if (exists) {
        toast.error(`Accessories "${trimmed}" already exists under ${head}.`);
        return;
      }

      const newRecord: MMAccessoriesSetupRecord = {
        id: `acc-${Date.now()}`,
        code: `ACC-${String(accessories.length + 1).padStart(3, "0")}`,
        accessoriesName: trimmed,
        uom,
        marketUnit,
        relationFactor: factorNum,
        head,
        status: formStatus,
        createdAt: now,
        updatedAt: now,
      };

      saveRecords([newRecord, ...accessories]);
      toast.success(`Accessories "${trimmed}" created.`);
    } else if (modalMode === "edit" && activeItem) {
      const exists = accessories.some(
        (a) =>
          a.id !== activeItem.id &&
          a.accessoriesName.toLowerCase() === trimmed.toLowerCase() &&
          a.head === head
      );
      if (exists) {
        toast.error(`Accessories "${trimmed}" already exists under ${head}.`);
        return;
      }

      const updated = accessories.map((a) =>
        a.id === activeItem.id
          ? {
              ...a,
              accessoriesName: trimmed,
              uom,
              marketUnit,
              relationFactor: factorNum,
              head,
              status: formStatus,
              updatedAt: now,
            }
          : a
      );

      saveRecords(updated);
      toast.success(`Accessories "${trimmed}" updated.`);
    }

    setIsModalOpen(false);
  };

  // Delete Handler
  const handleDeleteConfirm = () => {
    if (!confirmDelete.item) return;
    const toDelete = confirmDelete.item;
    const filtered = accessories.filter((a) => a.id !== toDelete.id);
    saveRecords(filtered);
    toast.success(`Accessories "${toDelete.accessoriesName}" deleted.`);
    setConfirmDelete({ isOpen: false, item: null });
  };

  // Filter & Pagination
  const filteredAccessories = useMemo(() => {
    return accessories.filter((item) => {
      if (headFilter !== "ALL" && item.head !== headFilter) return false;
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.accessoriesName.toLowerCase().includes(q);
        const matchHead = item.head.toLowerCase().includes(q);
        const matchUom = item.uom.toLowerCase().includes(q);
        const matchMkt = item.marketUnit.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        if (!matchName && !matchHead && !matchUom && !matchMkt && !matchCode) return false;
      }
      return true;
    });
  }, [accessories, headFilter, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredAccessories.length / itemsPerPage) || 1;
  const paginatedAccessories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAccessories.slice(start, start + itemsPerPage);
  }, [filteredAccessories, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Accessories Register
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                {accessories.length} {accessories.length === 1 ? "Item" : "Items"}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {accessories.filter((a) => a.status === "Active").length} Active
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
              Create Accessories
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
                placeholder="Search by accessories name, UoM, Market unit..."
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
              value={headFilter}
              onChange={(e) => {
                setHeadFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">All Heads</option>
              <option value="Sewing Trims">Sewing Trims</option>
              <option value="Finishing Trims">Finishing Trims</option>
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
                <th className="py-3 px-4">Head</th>
                <th className="py-3 px-4 min-w-[200px]">Accessories Name</th>
                <th className="py-3 px-3 text-center">Consumption UoM</th>
                <th className="py-3 px-3 text-center">Market Unit</th>
                <th className="py-3 px-4 text-center">Relation Factor</th>
                <th className="py-3 px-3 text-center w-28">Status</th>
                <th className="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedAccessories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <Package className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-medium">No accessories records found.</p>
                  </td>
                </tr>
              ) : (
                paginatedAccessories.map((item, index) => {
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
                          className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-[10px] border ${
                            item.head === "Sewing Trims"
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                              : "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                          }`}
                        >
                          {item.head}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {item.accessoriesName}
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                        {item.uom}
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                        {item.marketUnit}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          <span>1 {item.marketUnit}</span>
                          <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                          <span>{item.relationFactor} {item.uom}</span>
                        </span>
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
              {filteredAccessories.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredAccessories.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {filteredAccessories.length}
            </span>{" "}
            items
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
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {modalMode === "create" && "Create Accessories"}
                {modalMode === "edit" && "Edit Accessories"}
                {modalMode === "view" && "Accessories Details"}
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
              {/* Head */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Head *
                </label>
                {modalMode === "view" ? (
                  <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {head}
                  </div>
                ) : (
                  <select
                    value={head}
                    onChange={(e) => setHead(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {HEAD_OPTIONS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Accessories Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Accessories Name *
                </label>
                {modalMode === "view" ? (
                  <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {accessoriesName}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={accessoriesName}
                    onChange={(e) => setAccessoriesName(e.target.value)}
                    placeholder="e.g. Button, Sewing Thread, Single Poly"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                )}
              </div>

              {/* UoM and Market Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Consumption UoM *
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {uom}
                    </div>
                  ) : (
                    <select
                      value={uom}
                      onChange={(e) => setUom(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {UOM_OPTIONS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Market Unit *
                  </label>
                  {modalMode === "view" ? (
                    <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {marketUnit}
                    </div>
                  ) : (
                    <select
                      value={marketUnit}
                      onChange={(e) => setMarketUnit(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {MARKET_UNIT_OPTIONS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Relation Factor & Conversion Helper */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Relation Factor *
                </label>
                {modalMode === "view" ? (
                  <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono">
                    {relationFactor}
                  </div>
                ) : (
                  <input
                    type="number"
                    min="0.001"
                    step="any"
                    value={relationFactor}
                    onChange={(e) => setRelationFactor(e.target.value)}
                    placeholder="e.g. 144"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                )}

                {/* Real-time Relation Explanatory Box */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <span className="font-medium text-slate-500">Unit Conversion Rule:</span>
                  <span className="font-mono font-bold text-teal-700 dark:text-teal-300">
                    1 {marketUnit} = {relationFactor || 0} {uom}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </label>
                {modalMode === "view" ? (
                  <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {formStatus}
                  </div>
                ) : (
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                )}
              </div>

              {/* Footer */}
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
                        Edit Accessories
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
                      {modalMode === "create" ? "Save Accessories" : "Update Accessories"}
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
                  Delete Accessories
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete this accessories record?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">
                {confirmDelete.item.accessoriesName}
              </div>
              <div className="text-slate-500">
                {confirmDelete.item.head} • 1 {confirmDelete.item.marketUnit} = {confirmDelete.item.relationFactor} {confirmDelete.item.uom}
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

export default AccessoriesSetupManager;

