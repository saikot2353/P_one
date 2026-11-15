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
  ChevronLeft,
  ChevronRight,
  Building2,
  Globe,
  MapPin,
  UserCheck,
  Tag,
  Layers,
  Sparkles,
  RefreshCw,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMBuyerMasterRecord,
  MMBuyerDepartment,
  MMMasterDataRepository,
  BUYER_COUNTRIES,
  BUYER_ACCOUNT_HOLDERS,
} from "../../../lib/merchandising-master-data";
import { SearchableSelect } from "../../ui/searchable-select";

// Standard quick-fill presets
const PRESET_ALPHA_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PRESET_NUMERIC_SIZES = ["28", "30", "32", "34", "36", "38"];
const PRESET_KIDS_SIZES = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"];

export function BuyerNameManager() {
  const [buyers, setBuyers] = useState<MMBuyerMasterRecord[]>(() =>
    MMMasterDataRepository.getBuyers()
  );

  const saveRecords = (newRecords: MMBuyerMasterRecord[]) => {
    setBuyers(newRecords);
    MMMasterDataRepository.saveBuyers(newRecords);
  };

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cripton_mm_buyer_master_v1") {
        setBuyers(MMMasterDataRepository.getBuyers());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeItem, setActiveItem] = useState<MMBuyerMasterRecord | null>(null);

  // Form Fields - Section A: Buyer Information
  const [buyerName, setBuyerName] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  // Form Fields - Section B: Buyer Department Information
  const [departments, setDepartments] = useState<MMBuyerDepartment[]>([]);
  const [deptSizeInput, setDeptSizeInput] = useState<{ [deptId: string]: string }>({});

  // Form Fields - Section C: Buyer-wise GMT Size
  const [buyerSizes, setBuyerSizes] = useState<string[]>([]);
  const [newBuyerSizeInput, setNewBuyerSizeInput] = useState("");

  // Confirmation Dialog
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    item: MMBuyerMasterRecord | null;
  }>({ isOpen: false, item: null });

  // List of countries with existing buyers for the filter dropdown
  const availableCountries = useMemo(() => {
    const unique = Array.from(new Set(buyers.map((b) => b.country).filter(Boolean)));
    return unique.sort();
  }, [buyers]);

  // Duplicate Buyer Name Check
  const isDuplicateName = useMemo(() => {
    const trimmed = buyerName.trim().toLowerCase();
    if (!trimmed) return false;
    return buyers.some(
      (b) =>
        b.buyerName.trim().toLowerCase() === trimmed &&
        (modalMode === "create" || b.id !== activeItem?.id)
    );
  }, [buyerName, buyers, modalMode, activeItem]);

  // Reset & Open Create Modal
  const handleOpenCreate = () => {
    setActiveItem(null);
    setModalMode("create");
    setBuyerName("");
    setCountry(BUYER_COUNTRIES[0] || "Bangladesh");
    setAddress("");
    setAccountHolder(BUYER_ACCOUNT_HOLDERS[0] || "");
    setFormStatus("Active");
    setBuyerSizes(["S", "M", "L", "XL", "XXL"]);
    setNewBuyerSizeInput("");
    setDepartments([
      {
        id: `dept-${Date.now()}-1`,
        departmentName: "Ladies Casual & Tops",
        accountHolder: BUYER_ACCOUNT_HOLDERS[0] || "",
        sizes: ["S", "M", "L", "XL"],
      },
    ]);
    setDeptSizeInput({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MMBuyerMasterRecord) => {
    setActiveItem(item);
    setModalMode("edit");
    setBuyerName(item.buyerName);
    setCountry(item.country);
    setAddress(item.address);
    setAccountHolder(item.accountHolder);
    setFormStatus(item.status);
    setBuyerSizes([...(item.buyerSizes || [])]);
    setNewBuyerSizeInput("");
    setDepartments(
      (item.departments || []).map((d) => ({
        ...d,
        sizes: [...(d.sizes || [])],
      }))
    );
    setDeptSizeInput({});
    setIsModalOpen(true);
  };

  // Open View Modal
  const handleOpenView = (item: MMBuyerMasterRecord) => {
    setActiveItem(item);
    setModalMode("view");
    setBuyerName(item.buyerName);
    setCountry(item.country);
    setAddress(item.address);
    setAccountHolder(item.accountHolder);
    setFormStatus(item.status);
    setBuyerSizes([...(item.buyerSizes || [])]);
    setDepartments(
      (item.departments || []).map((d) => ({
        ...d,
        sizes: [...(d.sizes || [])],
      }))
    );
    setIsModalOpen(true);
  };

  // --------------------------------------------------------------------------
  // Department Management Handlers
  // --------------------------------------------------------------------------
  const handleAddDepartment = () => {
    const newDept: MMBuyerDepartment = {
      id: `dept-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      departmentName: "",
      accountHolder: accountHolder || BUYER_ACCOUNT_HOLDERS[0] || "",
      sizes: [],
    };
    setDepartments((prev) => [...prev, newDept]);
  };

  const handleRemoveDepartment = (deptId: string) => {
    if (departments.length <= 1) {
      toast.warning("Buyer must have at least one department.");
      return;
    }
    setDepartments((prev) => prev.filter((d) => d.id !== deptId));
  };

  const handleUpdateDepartment = (
    deptId: string,
    field: keyof MMBuyerDepartment,
    value: any
  ) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === deptId ? { ...d, [field]: value } : d))
    );
  };

  const handleAddDeptSize = (deptId: string, sizeToAdd?: string) => {
    const raw = sizeToAdd !== undefined ? sizeToAdd : (deptSizeInput[deptId] || "");
    const trimmed = raw.trim().toUpperCase();
    if (!trimmed) return;

    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === deptId) {
          if (d.sizes.includes(trimmed)) {
            toast.warning(`Size "${trimmed}" already added to this department.`);
            return d;
          }
          return { ...d, sizes: [...d.sizes, trimmed] };
        }
        return d;
      })
    );

    if (sizeToAdd === undefined) {
      setDeptSizeInput((prev) => ({ ...prev, [deptId]: "" }));
    }
  };

  const handleRemoveDeptSize = (deptId: string, sizeToRemove: string) => {
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === deptId ? { ...d, sizes: d.sizes.filter((s) => s !== sizeToRemove) } : d
      )
    );
  };

  const handleApplyDeptPreset = (deptId: string, presetSizes: string[]) => {
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === deptId) {
          const combined = Array.from(new Set([...d.sizes, ...presetSizes]));
          return { ...d, sizes: combined };
        }
        return d;
      })
    );
    toast.success(`Preset sizes added to department.`);
  };

  // --------------------------------------------------------------------------
  // Buyer-wise GMT Size Handlers
  // --------------------------------------------------------------------------
  const handleAddBuyerSize = (sizeToAdd?: string) => {
    const raw = sizeToAdd !== undefined ? sizeToAdd : newBuyerSizeInput;
    const trimmed = raw.trim().toUpperCase();
    if (!trimmed) return;

    if (buyerSizes.includes(trimmed)) {
      toast.warning(`Buyer GMT Size "${trimmed}" is already added.`);
      return;
    }

    setBuyerSizes((prev) => [...prev, trimmed]);
    if (sizeToAdd === undefined) {
      setNewBuyerSizeInput("");
    }
  };

  const handleRemoveBuyerSize = (sizeToRemove: string) => {
    setBuyerSizes((prev) => prev.filter((s) => s !== sizeToRemove));
  };

  const handleApplyBuyerPreset = (presetSizes: string[]) => {
    const combined = Array.from(new Set([...buyerSizes, ...presetSizes]));
    setBuyerSizes(combined);
    toast.success(`Preset sizes added to Buyer-wise GMT Sizes.`);
  };

  // --------------------------------------------------------------------------
  // Save Handler
  // --------------------------------------------------------------------------
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = buyerName.trim();
    if (!trimmedName) {
      toast.error("Buyer Name is required.");
      return;
    }

    if (isDuplicateName) {
      toast.error(`A buyer with name "${trimmedName}" already exists.`);
      return;
    }

    if (!country.trim()) {
      toast.error("Country is required.");
      return;
    }

    if (!accountHolder.trim()) {
      toast.error("Buyer Account Holder (Main) is required.");
      return;
    }

    // Validate departments
    const validDepts = departments.filter((d) => d.departmentName.trim().length > 0);
    if (validDepts.length === 0) {
      toast.error("Please provide at least one Department with a valid Department Name.");
      return;
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    if (modalMode === "create") {
      const nextCodeNum = buyers.length + 1;
      const newRecord: MMBuyerMasterRecord = {
        id: `byr-${Date.now()}`,
        code: `BYR-${String(nextCodeNum).padStart(3, "0")}`,
        buyerName: trimmedName,
        country: country.trim(),
        address: address.trim(),
        accountHolder: accountHolder.trim(),
        buyerSizes: [...buyerSizes],
        departments: validDepts.map((d) => ({
          ...d,
          departmentName: d.departmentName.trim(),
          accountHolder: d.accountHolder.trim() || accountHolder.trim(),
        })),
        status: formStatus,
        createdAt: now,
        updatedAt: now,
      };

      saveRecords([newRecord, ...buyers]);
      toast.success(`Buyer "${trimmedName}" created successfully.`);
    } else if (modalMode === "edit" && activeItem) {
      const updatedList = buyers.map((b) => {
        if (b.id === activeItem.id) {
          return {
            ...b,
            buyerName: trimmedName,
            country: country.trim(),
            address: address.trim(),
            accountHolder: accountHolder.trim(),
            buyerSizes: [...buyerSizes],
            departments: validDepts.map((d) => ({
              ...d,
              departmentName: d.departmentName.trim(),
              accountHolder: d.accountHolder.trim() || accountHolder.trim(),
            })),
            status: formStatus,
            updatedAt: now,
          };
        }
        return b;
      });

      saveRecords(updatedList);
      toast.success(`Buyer "${trimmedName}" updated successfully.`);
    }

    setIsModalOpen(false);
  };

  // --------------------------------------------------------------------------
  // Delete Handler
  // --------------------------------------------------------------------------
  const handleDeleteConfirm = () => {
    if (!confirmDelete.item) return;
    const toDelete = confirmDelete.item;
    const filtered = buyers.filter((b) => b.id !== toDelete.id);
    saveRecords(filtered);
    toast.success(`Buyer "${toDelete.buyerName}" deleted.`);
    setConfirmDelete({ isOpen: false, item: null });
  };

  // --------------------------------------------------------------------------
  // Filtered List & Pagination
  // --------------------------------------------------------------------------
  const filteredBuyers = useMemo(() => {
    return buyers.filter((item) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.buyerName.toLowerCase().includes(q);
        const matchesCode = item.code.toLowerCase().includes(q);
        const matchesCountry = item.country.toLowerCase().includes(q);
        const matchesAddress = item.address.toLowerCase().includes(q);
        const matchesAc = item.accountHolder.toLowerCase().includes(q);
        const matchesDept = item.departments.some(
          (d) =>
            d.departmentName.toLowerCase().includes(q) ||
            d.accountHolder.toLowerCase().includes(q) ||
            d.sizes.some((s) => s.toLowerCase().includes(q))
        );
        const matchesSizes = item.buyerSizes.some((s) => s.toLowerCase().includes(q));

        if (
          !matchesName &&
          !matchesCode &&
          !matchesCountry &&
          !matchesAddress &&
          !matchesAc &&
          !matchesDept &&
          !matchesSizes
        ) {
          return false;
        }
      }

      // Country Filter
      if (countryFilter !== "ALL" && item.country !== countryFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [buyers, searchQuery, countryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredBuyers.length / itemsPerPage) || 1;
  const paginatedBuyers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBuyers.slice(start, start + itemsPerPage);
  }, [filteredBuyers, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Top Controls: Header, Counter, Search, Filters, and New Buyer Button */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Buyer Register
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                {buyers.length} {buyers.length === 1 ? "Buyer" : "Buyers"}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {buyers.filter((b) => b.status === "Active").length} Active
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
              Create New Buyer
            </button>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by buyer name, country, address, account holder, department, sizes..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
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

          {/* Country Filter */}
          <div>
            <select
              value={countryFilter}
              onChange={(e) => {
                setCountryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">All Countries ({availableCountries.length})</option>
              {availableCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
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

      {/* Buyer Register Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3.5 w-16 text-center">SL</th>
                <th className="py-3 px-4">Buyer Name</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Account Holder</th>
                <th className="py-3 px-4">Departments</th>
                <th className="py-3 px-3 text-center w-24">Status</th>
                <th className="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedBuyers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-medium">No buyer records found.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery || countryFilter !== "ALL" || statusFilter !== "ALL"
                        ? "Try adjusting your search query or filters."
                        : "Click 'Create New Buyer' to add your first buyer record."}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedBuyers.map((item, index) => {
                  const sl = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* SL */}
                      <td className="py-3 px-3.5 text-center font-mono text-slate-500 dark:text-slate-400">
                        <div className="font-semibold text-slate-700 dark:text-slate-300">
                          {String(sl).padStart(2, "0")}
                        </div>
                      </td>

                      {/* Buyer Name */}
                      <td className="py-3 px-4">
                        <div
                          className="font-bold text-slate-900 dark:text-white text-xs hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                          onClick={() => handleOpenView(item)}
                        >
                          {item.buyerName}
                        </div>
                      </td>

                      {/* Country */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.country || "—"}</span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 text-xs" title={item.address}>
                            {item.address || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Account Holder */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                          <span>{item.accountHolder || "—"}</span>
                        </div>
                      </td>

                      {/* Departments */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {item.departments.length}{" "}
                              {item.departments.length === 1 ? "Dept" : "Depts"}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {item.departments.slice(0, 2).map((d) => (
                              <span
                                key={d.id}
                                className="inline-block px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-[140px]"
                                title={`${d.departmentName} (A/C: ${d.accountHolder}) - Sizes: ${d.sizes.join(", ") || "None"}`}
                              >
                                {d.departmentName}
                              </span>
                            ))}
                            {item.departments.length > 2 && (
                              <span className="text-[10px] text-slate-400">
                                +{item.departments.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
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
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenView(item)}
                            title="View Buyer"
                            className="p-1.5 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Buyer"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete({ isOpen: true, item })}
                            title="Delete Buyer"
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

        {/* Pagination & Counter */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {filteredBuyers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredBuyers.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {filteredBuyers.length}
            </span>{" "}
            buyers
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

      {/* ====================================================================== */}
      {/* Create / Edit / View Modal                                             */}
      {/* ====================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {modalMode === "create" && "Create New Buyer"}
                    {modalMode === "edit" && `Edit Buyer: ${activeItem?.buyerName}`}
                    {modalMode === "view" && `Buyer Profile: ${activeItem?.buyerName}`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {modalMode === "create" &&
                      "Register a new buyer with country origin, departments, handlers, and sizes."}
                    {modalMode === "edit" &&
                      "Update buyer details, department accounts, and GMT size configurations."}
                    {modalMode === "view" &&
                      "Comprehensive view of buyer account information and department matrix."}
                  </p>
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

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-7">
              {/* SECTION A: Buyer Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                      A
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Buyer Information
                    </h4>
                  </div>
                  {modalMode !== "view" && (
                    <span className="text-[11px] text-slate-400">* Required fields</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Buyer Name */}
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Buyer Name *</span>
                      {isDuplicateName && (
                        <span className="text-red-500 text-[11px] font-normal flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Duplicate buyer name
                        </span>
                      )}
                    </label>
                    {modalMode === "view" ? (
                      <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {buyerName}
                      </div>
                    ) : (
                      <div>
                        <input
                          type="text"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          placeholder="e.g. H&M Hennes & Mauritz, Zara (Inditex)"
                          className={`w-full px-3 py-2 text-xs rounded-lg border ${
                            isDuplicateName
                              ? "border-red-500 focus:ring-red-500 bg-red-50/30 dark:bg-red-950/20"
                              : "border-slate-300 dark:border-slate-700 focus:ring-teal-500"
                          } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2`}
                        />
                        {isDuplicateName && (
                          <p className="text-[11px] text-red-500 mt-1">
                            A buyer with this name already exists in the system. Please use a unique name.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Country *
                    </label>
                    {modalMode === "view" ? (
                      <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>{country}</span>
                      </div>
                    ) : (
                      <SearchableSelect
                        options={BUYER_COUNTRIES}
                        value={country}
                        onChange={(val) => setCountry(val)}
                        placeholder="Select or search country..."
                        allowCustom
                        className="h-[38px] text-xs"
                      />
                    )}
                  </div>

                  {/* Buyer Address */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Buyer Address *
                    </label>
                    {modalMode === "view" ? (
                      <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span>{address || "—"}</span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Mäster Samuelsgatan 46A, SE-106 38 Stockholm, Sweden"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    )}
                  </div>

                  {/* Account Holder */}
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Account Holder *
                    </label>
                    {modalMode === "view" ? (
                      <div className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-teal-500" />
                        <span>{accountHolder}</span>
                      </div>
                    ) : (
                      <SearchableSelect
                        options={BUYER_ACCOUNT_HOLDERS}
                        value={accountHolder}
                        onChange={(val) => setAccountHolder(val)}
                        placeholder="Select account holder..."
                        allowCustom
                        className="h-[38px] text-xs"
                      />
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Record Status
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
                </div>
              </div>

              {/* SECTION B: Buyer Department Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                      B
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Buyer Department Information
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        One buyer can have multiple departments. Each department has its own designated
                        Account Holder and Department-wise GMT Sizes.
                      </p>
                    </div>
                  </div>
                  {modalMode !== "view" && (
                    <button
                      type="button"
                      onClick={handleAddDepartment}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Department
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {departments.map((dept, idx) => (
                    <div
                      key={dept.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 text-[11px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Department #{idx + 1}
                          </span>
                        </div>

                        {modalMode !== "view" && departments.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDepartment(dept.id)}
                            className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 inline-flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Department Name */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            Buyer Department Name *
                          </label>
                          {modalMode === "view" ? (
                            <div className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                              {dept.departmentName || "—"}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={dept.departmentName}
                              onChange={(e) =>
                                handleUpdateDepartment(dept.id, "departmentName", e.target.value)
                              }
                              placeholder="e.g. Ladies Casual, Mens Wear, Outerwear"
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          )}
                        </div>

                        {/* Department Account Holder */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            Buyer Department Account Holder *
                          </label>
                          {modalMode === "view" ? (
                            <div className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                              <UserCheck className="w-3 h-3 text-indigo-500" />
                              <span>{dept.accountHolder || "—"}</span>
                            </div>
                          ) : (
                            <SearchableSelect
                              options={BUYER_ACCOUNT_HOLDERS}
                              value={dept.accountHolder}
                              onChange={(val) =>
                                handleUpdateDepartment(dept.id, "accountHolder", val)
                              }
                              placeholder="Select department account holder..."
                              allowCustom
                              className="h-[34px] text-xs"
                            />
                          )}
                        </div>
                      </div>

                      {/* Department-wise GMT Size */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                            <Tag className="w-3 h-3 text-indigo-500" />
                            <span>Buyer Department-wise GMT Size</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({dept.sizes.length} {dept.sizes.length === 1 ? "size" : "sizes"})
                            </span>
                          </label>

                          {modalMode !== "view" && (
                            <div className="flex items-center gap-1 text-[10px]">
                              <span className="text-slate-400">Presets:</span>
                              <button
                                type="button"
                                onClick={() => handleApplyDeptPreset(dept.id, PRESET_ALPHA_SIZES)}
                                className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                              >
                                Alpha (XS-XXL)
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleApplyDeptPreset(dept.id, PRESET_NUMERIC_SIZES)
                                }
                                className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                              >
                                Numeric (28-38)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApplyDeptPreset(dept.id, PRESET_KIDS_SIZES)}
                                className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                              >
                                Kids
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Interactive Tag Input */}
                        {modalMode !== "view" && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={deptSizeInput[dept.id] || ""}
                              onChange={(e) =>
                                setDeptSizeInput((prev) => ({
                                  ...prev,
                                  [dept.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddDeptSize(dept.id);
                                }
                              }}
                              placeholder="Type size (e.g. S, M, L, 32, 4-5Y) and press Enter"
                              className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddDeptSize(dept.id)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
                            >
                              Add Size
                            </button>
                          </div>
                        )}

                        {/* Render Size Chips */}
                        <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 items-center">
                          {dept.sizes.length === 0 ? (
                            <span className="text-[11px] text-slate-400 italic">
                              No sizes configured for this department yet.
                            </span>
                          ) : (
                            dept.sizes.map((sz, szIdx) => (
                              <span
                                key={szIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 animate-in fade-in"
                              >
                                <span>{sz}</span>
                                {modalMode !== "view" && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDeptSize(dept.id, sz)}
                                    className="p-0.5 hover:text-red-500 dark:hover:text-red-400 rounded-sm"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION C: Buyer-wise GMT Size */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                      C
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Buyer-wise GMT Size
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Define global GMT sizes applicable across the entire buyer account. These
                        remain independent of department-specific sizes.
                      </p>
                    </div>
                  </div>

                  {modalMode !== "view" && (
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-slate-400">Presets:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyBuyerPreset(PRESET_ALPHA_SIZES)}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                      >
                        + Alpha (XS-XXL)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyBuyerPreset(PRESET_NUMERIC_SIZES)}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                      >
                        + Numeric (28-38)
                      </button>
                      {buyerSizes.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setBuyerSizes([])}
                          className="px-2 py-0.5 rounded bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-100 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Interactive Tag Input for Buyer-wise Sizes */}
                {modalMode !== "view" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newBuyerSizeInput}
                      onChange={(e) => setNewBuyerSizeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddBuyerSize();
                        }
                      }}
                      placeholder="Type buyer size (e.g. S, M, L, XL, 30, 32) and press Enter"
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddBuyerSize()}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
                    >
                      Add Size
                    </button>
                  </div>
                )}

                {/* Buyer Size Chips */}
                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 min-h-[48px] items-center">
                  {buyerSizes.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">
                      No buyer-level GMT sizes defined yet.
                    </span>
                  ) : (
                    buyerSizes.map((sz, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm"
                      >
                        <span>{sz}</span>
                        {modalMode !== "view" && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBuyerSize(sz)}
                            className="p-0.5 hover:text-red-500 dark:hover:text-red-400 rounded-sm"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900 pb-1">
                {modalMode === "view" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Close
                    </button>
                    {activeItem && (
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(activeItem)}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Buyer
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isDuplicateName || !buyerName.trim()}
                      className="px-5 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {modalMode === "create" ? "Save Buyer Record" : "Update Buyer Record"}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete.isOpen && confirmDelete.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Confirm Deletion
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete this buyer record?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                {confirmDelete.item.buyerName}
              </div>
              <div className="text-slate-500">
                {confirmDelete.item.country} • {confirmDelete.item.accountHolder}
              </div>
              <div className="text-[11px] text-slate-400">
                Contains {confirmDelete.item.departments.length} departments and{" "}
                {confirmDelete.item.buyerSizes.length} buyer sizes.
              </div>
            </div>

            <p className="text-xs text-red-600 dark:text-red-400">
              This action cannot be undone. All associated department and size mappings for this
              buyer record will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete({ isOpen: false, item: null })}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm transition-all"
              >
                Yes, Delete Buyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerNameManager;

