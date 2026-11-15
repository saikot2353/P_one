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
  Shirt,
  Globe,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMBuyerStyleRecord,
  MMBuyerMasterRecord,
  MMMasterDataRepository,
} from "../../../lib/merchandising-master-data";
import { SearchableSelect } from "../../ui/searchable-select";

export function BuyerStyleManager() {
  const [styles, setStyles] = useState<MMBuyerStyleRecord[]>(() =>
    MMMasterDataRepository.getBuyerStyles()
  );
  const [buyers, setBuyers] = useState<MMBuyerMasterRecord[]>(() =>
    MMMasterDataRepository.getBuyers()
  );

  const saveRecords = (newRecords: MMBuyerStyleRecord[]) => {
    setStyles(newRecords);
    MMMasterDataRepository.saveBuyerStyles(newRecords);
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cripton_mm_master_buyer_style_v1") {
        setStyles(MMMasterDataRepository.getBuyerStyles());
      }
      if (e.key === "cripton_mm_buyer_master_v1") {
        setBuyers(MMMasterDataRepository.getBuyers());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeItem, setActiveItem] = useState<MMBuyerStyleRecord | null>(null);

  // Form Fields
  const [selectedBuyerName, setSelectedBuyerName] = useState("");
  const [styleRows, setStyleRows] = useState<string[]>([""]);
  const [editStyle, setEditStyle] = useState("");
  const [editStatus, setEditStatus] = useState<"Active" | "Inactive">("Active");

  // Delete Dialog
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    item: MMBuyerStyleRecord | null;
  }>({ isOpen: false, item: null });

  const selectedBuyer = useMemo(() => {
    return buyers.find((b) => b.buyerName === selectedBuyerName) || null;
  }, [buyers, selectedBuyerName]);

  const buyerOptions = useMemo(() => {
    return buyers.map((b) => ({ value: b.buyerName, label: b.buyerName }));
  }, [buyers]);

  const uniqueBuyerNames = useMemo(() => {
    const names = Array.from(new Set(styles.map((s) => s.buyerName).filter(Boolean)));
    return names.sort();
  }, [styles]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setActiveItem(null);
    setModalMode("create");
    setSelectedBuyerName(buyers[0]?.buyerName || "");
    setStyleRows([""]);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MMBuyerStyleRecord) => {
    setActiveItem(item);
    setModalMode("edit");
    setSelectedBuyerName(item.buyerName);
    setEditStyle(item.style);
    setEditStatus(item.status);
    setIsModalOpen(true);
  };

  // Open View Modal
  const handleOpenView = (item: MMBuyerStyleRecord) => {
    setActiveItem(item);
    setModalMode("view");
    setSelectedBuyerName(item.buyerName);
    setEditStyle(item.style);
    setEditStatus(item.status);
    setIsModalOpen(true);
  };

  // Toggle Status
  const handleToggleStatus = (item: MMBuyerStyleRecord) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updated = styles.map((s) =>
      s.id === item.id ? { ...s, status: nextStatus as "Active" | "Inactive", updatedAt: now } : s
    );
    saveRecords(updated);
    toast.success(`Style "${item.style}" status updated to ${nextStatus}.`);
  };

  // Save Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuyerName.trim()) {
      toast.error("Please select a Buyer.");
      return;
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const buyerObj = buyers.find((b) => b.buyerName === selectedBuyerName);
    const buyerId = buyerObj ? buyerObj.id : `byr-${Date.now()}`;

    if (modalMode === "create") {
      const validStyles = styleRows
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (validStyles.length === 0) {
        toast.error("Please enter at least one Style name.");
        return;
      }

      const existingForBuyer = styles.filter(
        (s) => s.buyerName.toLowerCase() === selectedBuyerName.toLowerCase()
      );
      const newRecords: MMBuyerStyleRecord[] = [];

      for (let i = 0; i < validStyles.length; i++) {
        const styleName = validStyles[i];
        const exists = existingForBuyer.some(
          (s) => s.style.toLowerCase() === styleName.toLowerCase()
        );
        if (exists) {
          toast.warning(`Style "${styleName}" already exists for ${selectedBuyerName}. Skipped duplicate.`);
          continue;
        }

        newRecords.push({
          id: `bst-${Date.now()}-${i}`,
          code: `BST-${String(styles.length + newRecords.length + 1).padStart(3, "0")}`,
          buyerId,
          buyerName: selectedBuyerName,
          style: styleName,
          status: "Active",
          createdAt: now,
          updatedAt: now,
        });
      }

      if (newRecords.length > 0) {
        saveRecords([...newRecords, ...styles]);
        toast.success(`Added ${newRecords.length} style(s) for ${selectedBuyerName}.`);
      }
    } else if (modalMode === "edit" && activeItem) {
      const trimmed = editStyle.trim();
      if (!trimmed) {
        toast.error("Style Name is required.");
        return;
      }

      const duplicate = styles.some(
        (s) =>
          s.id !== activeItem.id &&
          s.buyerName.toLowerCase() === selectedBuyerName.toLowerCase() &&
          s.style.toLowerCase() === trimmed.toLowerCase()
      );
      if (duplicate) {
        toast.error(`Style "${trimmed}" already exists for ${selectedBuyerName}.`);
        return;
      }

      const updated = styles.map((s) =>
        s.id === activeItem.id
          ? {
              ...s,
              buyerId,
              buyerName: selectedBuyerName,
              style: trimmed,
              status: editStatus,
              updatedAt: now,
            }
          : s
      );
      saveRecords(updated);
      toast.success(`Style "${trimmed}" updated.`);
    }

    setIsModalOpen(false);
  };

  // Delete Handler
  const handleDeleteConfirm = () => {
    if (!confirmDelete.item) return;
    const toDelete = confirmDelete.item;
    const filtered = styles.filter((s) => s.id !== toDelete.id);
    saveRecords(filtered);
    toast.success(`Style "${toDelete.style}" deleted.`);
    setConfirmDelete({ isOpen: false, item: null });
  };

  // Filter & Pagination
  const filteredStyles = useMemo(() => {
    return styles.filter((item) => {
      if (buyerFilter !== "ALL" && item.buyerName !== buyerFilter) {
        return false;
      }
      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const b = buyers.find((x) => x.buyerName === item.buyerName);
        const matchName = item.buyerName.toLowerCase().includes(q);
        const matchStyle = item.style.toLowerCase().includes(q);
        const matchCountry = (b?.country || "").toLowerCase().includes(q);
        const matchAc = (b?.accountHolder || "").toLowerCase().includes(q);
        if (!matchName && !matchStyle && !matchCountry && !matchAc) {
          return false;
        }
      }
      return true;
    });
  }, [styles, buyers, buyerFilter, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredStyles.length / itemsPerPage) || 1;
  const paginatedStyles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStyles.slice(start, start + itemsPerPage);
  }, [filteredStyles, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Top Controls: Header, Counter, Search, Filters, and Button */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Buyer Style Register
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                {styles.length} {styles.length === 1 ? "Record" : "Records"}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {styles.filter((s) => s.status === "Active").length} Active
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
              Create Buyer Style
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by buyer, style, country, account holder..."
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
              value={buyerFilter}
              onChange={(e) => {
                setBuyerFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">All Buyers ({uniqueBuyerNames.length})</option>
              {uniqueBuyerNames.map((b) => (
                <option key={b} value={b}>
                  {b}
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
                <th className="py-3 px-4">Buyer Name</th>
                <th className="py-3 px-4">Style</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Account Holder</th>
                <th className="py-3 px-3 text-center w-28">Status</th>
                <th className="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedStyles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <Shirt className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-medium">No buyer style records found.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click 'Create Buyer Style' to add styles for buyers.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedStyles.map((item, index) => {
                  const sl = (currentPage - 1) * itemsPerPage + index + 1;
                  const buyerObj = buyers.find((b) => b.buyerName === item.buyerName);
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

                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {item.buyerName}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          <Shirt className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{item.style}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span>{buyerObj?.country || "—"}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-teal-500" />
                          <span>{buyerObj?.accountHolder || "—"}</span>
                        </div>
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
              {filteredStyles.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredStyles.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {filteredStyles.length}
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

      {/* Create / Edit / View Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {modalMode === "create" && "Create Buyer Style"}
                    {modalMode === "edit" && "Edit Buyer Style"}
                    {modalMode === "view" && "Buyer Style Details"}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Buyer Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Buyer Name *
                </label>
                {modalMode === "view" ? (
                  <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {selectedBuyerName}
                  </div>
                ) : (
                  <SearchableSelect
                    options={buyerOptions}
                    value={selectedBuyerName}
                    onChange={(val) => setSelectedBuyerName(val)}
                    placeholder="Select buyer..."
                    className="h-[38px] text-xs"
                  />
                )}
              </div>

              {/* Auto-loaded Buyer Information Card */}
              {selectedBuyer && (
                <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 text-xs space-y-1">
                  <div className="flex items-center justify-between text-indigo-900 dark:text-indigo-200 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      Country: {selectedBuyer.country || "—"}
                    </span>
                    <span className="text-[11px] font-normal text-indigo-700 dark:text-indigo-300">
                      Code: {selectedBuyer.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300 text-[11px]">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Account Holder: {selectedBuyer.accountHolder || "—"}
                  </div>
                </div>
              )}

              {/* Styles (Multiple allowed on Create, single on Edit/View) */}
              {modalMode === "create" ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Styles *
                    </label>
                    <button
                      type="button"
                      onClick={() => setStyleRows((prev) => [...prev, ""])}
                      className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Style Row
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {styleRows.map((row, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 w-5 text-right font-mono">
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          value={row}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStyleRows((prev) =>
                              prev.map((r, i) => (i === idx ? val : r))
                            );
                          }}
                          placeholder="e.g. HM-KT-8841 (Ladies Ribbed Henley Neck T-Shirt)"
                          className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        {styleRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setStyleRows((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-md"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Style *
                    </label>
                    {modalMode === "view" ? (
                      <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {editStyle}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={editStyle}
                        onChange={(e) => setEditStyle(e.target.value)}
                        placeholder="e.g. HM-KT-8841 (Ladies Ribbed Henley Neck T-Shirt)"
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

              {/* Modal Actions */}
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
                        Edit Style
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
                      {modalMode === "create" ? "Save Styles" : "Update Style"}
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
                  Delete Buyer Style
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete this style record?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                {confirmDelete.item.style}
              </div>
              <div className="text-slate-500">Buyer: {confirmDelete.item.buyerName}</div>
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

export default BuyerStyleManager;

