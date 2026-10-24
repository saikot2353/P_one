import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronRight,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileSpreadsheet,
  Tags,
  Users,
  Truck,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  Globe,
  Phone,
} from "lucide-react";
import {
  VendorCategory,
  SupplierVendor,
  Origin,
  BusinessType,
  DEFAULT_VENDOR_CATEGORIES,
  DEFAULT_SUPPLIERS,
  DEFAULT_ORIGINS,
  DEFAULT_BUSINESS_TYPES,
  getStoredData,
  setStoredData,
} from "@/lib/procurement-master-data";
import { VendorCategoryPageForm } from "@/components/procurement/master-data/VendorCategoryPageForm";
import { SupplierVendorPageForm } from "@/components/procurement/master-data/SupplierVendorPageForm";

export type SupplierTabType = "vendor-category" | "supplier-vendor";

export interface SupplierManagementViewProps {
  initialTab?: SupplierTabType;
  embedded?: boolean;
  onTabChange?: (tab: SupplierTabType) => void;
  onBackToOverview?: () => void;
}

export function SupplierManagementView({
  initialTab = "vendor-category",
  embedded = false,
  onTabChange,
  onBackToOverview,
}: SupplierManagementViewProps) {
  const [activeTab, setActiveTab] = useState<SupplierTabType>(initialTab || "vendor-category");
  const [pageMode, setPageMode] = useState<"list" | "create" | "edit" | "view">("list");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Synchronize initialTab prop
  useEffect(() => {
    if (initialTab && ["vendor-category", "supplier-vendor"].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Master Data collections from localStorage
  const [vendorCategories, setVendorCategories] = useState<VendorCategory[]>(() =>
    getStoredData("proc_vendor_categories", DEFAULT_VENDOR_CATEGORIES),
  );
  const [suppliers, setSuppliers] = useState<SupplierVendor[]>(() =>
    getStoredData("proc_suppliers", DEFAULT_SUPPLIERS),
  );
  const [origins, setOrigins] = useState<Origin[]>(() =>
    getStoredData("proc_origins", DEFAULT_ORIGINS),
  );
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>(() =>
    getStoredData("proc_business_types", DEFAULT_BUSINESS_TYPES),
  );

  // Sync to storage on state change
  useEffect(() => {
    setStoredData("proc_vendor_categories", vendorCategories);
  }, [vendorCategories]);

  useEffect(() => {
    setStoredData("proc_suppliers", suppliers);
  }, [suppliers]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Delete modal state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Reset filters when switching tabs
  const handleTabChange = (tab: SupplierTabType) => {
    setActiveTab(tab);
    setSearchQuery("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setCurrentPage(1);
    setPageMode("list");
    setSelectedRecord(null);
    onTabChange?.(tab);
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (activeTab === "vendor-category") {
      return vendorCategories.filter((cat) => {
        if (statusFilter !== "All" && cat.status !== statusFilter) return false;
        if (!q) return true;
        return (
          cat.categoryCode.toLowerCase().includes(q) ||
          cat.categoryName.toLowerCase().includes(q) ||
          (cat.description && cat.description.toLowerCase().includes(q))
        );
      });
    }

    if (activeTab === "supplier-vendor") {
      return suppliers.filter((sup) => {
        if (statusFilter !== "All" && sup.status !== statusFilter) return false;
        if (categoryFilter !== "All" && sup.vendorCategory !== categoryFilter) return false;
        if (!q) return true;
        return (
          sup.vendorCode.toLowerCase().includes(q) ||
          sup.vendorName.toLowerCase().includes(q) ||
          (sup.supplierName && sup.supplierName.toLowerCase().includes(q)) ||
          sup.vendorCategory.toLowerCase().includes(q) ||
          (sup.contactPersonName && sup.contactPersonName.toLowerCase().includes(q)) ||
          (sup.mobileNumber && sup.mobileNumber.toLowerCase().includes(q)) ||
          (sup.country && sup.country.toLowerCase().includes(q))
        );
      });
    }

    return [];
  }, [activeTab, vendorCategories, suppliers, searchQuery, statusFilter, categoryFilter]);

  // Pagination slice
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  // Confirm delete handler
  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (activeTab === "vendor-category") {
      setVendorCategories((prev) => prev.filter((c) => c.id !== itemToDelete.id));
      toast.success(`Vendor Category "${itemToDelete.categoryName}" removed.`);
    } else if (activeTab === "supplier-vendor") {
      setSuppliers((prev) => prev.filter((s) => s.id !== itemToDelete.id));
      toast.success(`Supplier "${itemToDelete.vendorName || itemToDelete.supplierName}" removed.`);
    }

    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // Export to Excel / CSV
  const handleExport = () => {
    if (filteredData.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    let csvContent = "";
    if (activeTab === "vendor-category") {
      const headers = ["Category Code", "Category Name", "Description", "Status"];
      const rows = (filteredData as VendorCategory[]).map((c) => [
        `"${c.categoryCode}"`,
        `"${c.categoryName}"`,
        `"${c.description || ""}"`,
        `"${c.status}"`,
      ]);
      csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    } else {
      const headers = [
        "Supplier Code",
        "Supplier Name",
        "Category",
        "Contact Person",
        "Mobile",
        "Country",
        "Origin Type",
        "Status",
      ];
      const rows = (filteredData as SupplierVendor[]).map((s) => [
        `"${s.vendorCode}"`,
        `"${s.vendorName || s.supplierName || ""}"`,
        `"${s.vendorCategory || ""}"`,
        `"${s.contactPersonName || ""}"`,
        `"${s.mobileNumber || ""}"`,
        `"${s.country || "Bangladesh"}"`,
        `"${s.localForeignStatus || "Local"}"`,
        `"${s.status}"`,
      ]);
      csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${activeTab === "vendor-category" ? "Vendor_Categories" : "Suppliers_Vendors"}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Master dataset exported successfully!");
  };

  const tabsList: { type: SupplierTabType; label: string; icon: any; count: number }[] = [
    {
      type: "vendor-category",
      label: "Vendor Category",
      icon: Tags,
      count: vendorCategories.length,
    },
    {
      type: "supplier-vendor",
      label: "Supplier / Vendor",
      icon: Users,
      count: suppliers.length,
    },
  ];

  return (
    <div className="space-y-4 w-full">
      {/* STEP 1: Breadcrumb & Overview header (when embedded) */}
      {embedded && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToOverview}
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Master Overview</span>
            </button>

            <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              Category: Business Partner Management
            </span>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <span>Business Partner Management</span>
                <ChevronRight className="size-3.5" />
                <span className="text-primary font-bold">Supplier Management</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 text-foreground">
                <Truck className="size-6 text-primary" />
                Supplier & Vendor Management
              </h1>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                Centralized authority records for vendor categories, supplier profiles, contact
                persons, commercial registrations, and banking coordinates.
              </p>
            </div>

            {pageMode === "list" && (
              <button
                onClick={() => {
                  setSelectedRecord(null);
                  setPageMode("create");
                }}
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="size-4" />
                {activeTab === "vendor-category" ? "Add Category" : "Add Supplier / Vendor"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: FORM MODE (create, edit, or view) */}
      {pageMode !== "list" ? (
        <div className="bg-card rounded-2xl border border-border/70 p-6 shadow-sm animate-in fade-in duration-200">
          {activeTab === "vendor-category" && (
            <VendorCategoryPageForm
              mode={pageMode}
              initialData={selectedRecord}
              onSave={(saved) => {
                if (pageMode === "create") {
                  setVendorCategories((prev) => [saved, ...prev]);
                  toast.success("Vendor Category created successfully.");
                } else {
                  setVendorCategories((prev) =>
                    prev.map((c) => (c.id === saved.id ? saved : c)),
                  );
                  toast.success("Vendor Category updated successfully.");
                }
                setPageMode("list");
              }}
              onCancel={() => setPageMode("list")}
              onSwitchToEdit={() => setPageMode("edit")}
            />
          )}

          {activeTab === "supplier-vendor" && (
            <SupplierVendorPageForm
              mode={pageMode}
              initialData={selectedRecord}
              vendorCategories={vendorCategories}
              businessTypes={businessTypes}
              origins={origins}
              onSave={(saved) => {
                if (pageMode === "create") {
                  setSuppliers((prev) => [saved, ...prev]);
                  toast.success("Supplier created successfully.");
                } else {
                  setSuppliers((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
                  toast.success("Supplier updated successfully.");
                }
                setPageMode("list");
              }}
              onCancel={() => setPageMode("list")}
              onSwitchToEdit={() => setPageMode("edit")}
            />
          )}
        </div>
      ) : (
        /* STEP 3: LIST VIEW WITH 2 TABS, FILTERS & DATA TABLE */
        <div className="space-y-4">
          {/* Horizontal Master Tabs */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 pb-3 border-b border-border/50">
            {tabsList.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.type;
              return (
                <button
                  key={tab.type}
                  onClick={() => handleTabChange(tab.type)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "bg-card border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground font-medium"
                  }`}
                >
                  <TabIcon className="size-4" />
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Filter Console & Action Tools */}
          <div className="bg-card rounded-2xl border border-border/60 p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={`Search ${activeTab === "vendor-category" ? "categories" : "suppliers"}...`}
                  className="w-full pl-9 pr-8 h-9.5 rounded-xl border border-border/70 bg-muted/15 focus:bg-background focus:border-primary text-xs font-medium outline-none transition-all placeholder:text-muted-foreground/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter (Supplier Tab Only) */}
              {activeTab === "supplier-vendor" && (
                <div className="w-full sm:w-48">
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-9.5 px-3 rounded-xl border border-border/70 bg-muted/15 focus:bg-background focus:border-primary text-xs font-medium outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {vendorCategories.map((c) => (
                      <option key={c.id} value={c.categoryName}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status Filter */}
              <div className="w-full sm:w-36">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9.5 px-3 rounded-xl border border-border/70 bg-muted/15 focus:bg-background focus:border-primary text-xs font-medium outline-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Actions: Export & Add */}
            <div className="flex items-center gap-2 justify-end shrink-0">
              <button
                onClick={handleExport}
                className="h-9.5 px-3.5 rounded-xl border border-border/60 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                title="Export current view to Excel / CSV"
              >
                <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Export</span>
              </button>

              <button
                onClick={() => {
                  setSelectedRecord(null);
                  setPageMode("create");
                }}
                className="h-9.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="size-4" />
                <span>{activeTab === "vendor-category" ? "Add Category" : "Add Supplier"}</span>
              </button>
            </div>
          </div>

          {/* Master Data Table */}
          <div className="bg-card rounded-2xl border border-border/70 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-14 text-center">SL</th>
                    <th className="py-3 px-4 w-28 text-center">Actions</th>

                    {/* VENDOR CATEGORY COLUMNS */}
                    {activeTab === "vendor-category" && (
                      <>
                        <th className="py-3 px-4">Category Code</th>
                        <th className="py-3 px-4">Category Name</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4 text-center w-24">Status</th>
                      </>
                    )}

                    {/* SUPPLIER / VENDOR COLUMNS */}
                    {activeTab === "supplier-vendor" && (
                      <>
                        <th className="py-3 px-4">Supplier Code</th>
                        <th className="py-3 px-4">Supplier / Vendor Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Contact Person</th>
                        <th className="py-3 px-4">Mobile</th>
                        <th className="py-3 px-4">Country</th>
                        <th className="py-3 px-4 text-center">Origin</th>
                        <th className="py-3 px-4 text-center w-24">Status</th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60 text-foreground font-medium">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={activeTab === "vendor-category" ? 6 : 10}
                        className="py-12 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="size-8 text-muted-foreground/40" />
                          <p className="text-sm font-semibold">No records found</p>
                          <p className="text-xs text-muted-foreground">
                            Try adjusting your search terms or filters above.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item: any, idx: number) => {
                      const serial = (currentPage - 1) * pageSize + idx + 1;
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-muted/40 transition-colors group cursor-pointer"
                          onClick={() => {
                            setSelectedRecord(item);
                            setPageMode("view");
                          }}
                        >
                          <td className="py-3 px-4 text-center text-muted-foreground font-mono">
                            {serial}
                          </td>
                          <td
                            className="py-3 px-4 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setPageMode("view");
                                }}
                                title="View Record"
                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              >
                                <Eye className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setPageMode("edit");
                                }}
                                title="Edit Record"
                                className="p-1.5 rounded-lg hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500 transition-colors cursor-pointer"
                              >
                                <Edit className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setItemToDelete(item);
                                  setIsDeleteConfirmOpen(true);
                                }}
                                title="Delete Record"
                                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* VENDOR CATEGORY CELLS */}
                          {activeTab === "vendor-category" && (
                            <>
                              <td className="py-3 px-4 font-mono font-bold text-foreground">
                                {item.categoryCode}
                              </td>
                              <td className="py-3 px-4 font-bold text-foreground">
                                {item.categoryName}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">
                                {item.description || "—"}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                    item.status === "Active"
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                                      : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                            </>
                          )}

                          {/* SUPPLIER / VENDOR CELLS */}
                          {activeTab === "supplier-vendor" && (
                            <>
                              <td className="py-3 px-4 font-mono font-bold text-foreground">
                                {item.vendorCode}
                              </td>
                              <td className="py-3 px-4 font-bold text-foreground">
                                {item.vendorName || item.supplierName}
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-foreground">
                                  {item.vendorCategory}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-foreground">
                                {item.contactPersonName || "—"}
                              </td>
                              <td className="py-3 px-4 font-mono text-muted-foreground">
                                {item.mobileNumber || "—"}
                              </td>
                              <td className="py-3 px-4 text-foreground">
                                {item.country || "Bangladesh"}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`inline-block text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                    (
                                      item.localForeignStatus ||
                                      (item.country?.toLowerCase() === "bangladesh"
                                        ? "Local"
                                        : "Foreign")
                                    ) === "Local"
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                                  }`}
                                >
                                  {item.localForeignStatus ||
                                    (item.country?.toLowerCase() === "bangladesh"
                                      ? "Local"
                                      : "Foreign")}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                    item.status === "Active"
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                                      : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredData.length > 0 && (
              <div className="p-4 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                <div>
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}{" "}
                  entries
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-border/70 hover:bg-muted font-bold disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    Previous
                  </button>

                  <span className="px-2.5 font-semibold text-foreground">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1.5 rounded-lg border border-border/70 hover:bg-muted font-bold disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border/80 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="size-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Confirm Permanent Delete</h3>
                <p className="text-xs text-muted-foreground">This operation cannot be reversed.</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-bold text-foreground">
                {activeTab === "vendor-category"
                  ? itemToDelete.categoryName
                  : itemToDelete.vendorName || itemToDelete.supplierName}
              </span>
              ? All historical references will maintain integrity, but the active master record will
              be removed.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 rounded-xl border border-border/70 hover:bg-muted font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-500 transition-colors shadow-sm cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
