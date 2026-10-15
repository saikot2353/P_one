import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileSpreadsheet,
  Award,
  AlertCircle,
  X,
  ToggleLeft,
  ToggleRight,
  Globe,
  Building2,
} from "lucide-react";
import {
  Brand,
  Origin,
  DEFAULT_BRANDS,
  DEFAULT_ORIGINS,
  getStoredData,
  setStoredData,
} from "@/lib/procurement-master-data";
import { BrandMasterPageForm } from "@/components/procurement/master-data/BrandMasterPageForm";
import { ExcelDataUploadModal } from "@/components/procurement/master-data/ExcelDataUploadModal";

export interface BrandManufacturerSetupViewProps {
  embedded?: boolean;
  onBackToOverview?: () => void;
}

export function BrandManufacturerSetupView({
  embedded = false,
  onBackToOverview,
}: BrandManufacturerSetupViewProps) {
  const [pageMode, setPageMode] = useState<"list" | "create" | "edit" | "view">("list");
  const [selectedRecord, setSelectedRecord] = useState<Brand | null>(null);

  // Master Data collections from localStorage (synced with proc_brands and proc_origins)
  const [brands, setBrands] = useState<Brand[]>(() =>
    getStoredData("proc_brands", DEFAULT_BRANDS),
  );
  const [origins, setOrigins] = useState<Origin[]>(() =>
    getStoredData("proc_origins", DEFAULT_ORIGINS),
  );

  // Sync to localStorage
  useEffect(() => {
    setStoredData("proc_brands", brands);
  }, [brands]);

  useEffect(() => {
    setStoredData("proc_origins", origins);
  }, [origins]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Brand | null>(null);

  // Filtered rows
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        brand.brandCode.toLowerCase().includes(q) ||
        brand.brandName.toLowerCase().includes(q) ||
        (brand.manufacturer && brand.manufacturer.toLowerCase().includes(q)) ||
        (brand.countryOfOrigin && brand.countryOfOrigin.toLowerCase().includes(q)) ||
        (brand.website && brand.website.toLowerCase().includes(q)) ||
        (brand.description && brand.description.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || brand.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [brands, searchQuery, statusFilter]);

  const totalRecords = filteredBrands.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBrands.slice(start, start + pageSize);
  }, [filteredBrands, currentPage, pageSize]);

  // Excel Upload Import handler
  const handleExcelImport = (importedRows: any[]) => {
    setBrands((prev) => [...importedRows, ...prev]);
    toast.success(`Successfully imported ${importedRows.length} brand(s).`);
  };

  // Toggle status handler
  const handleToggleStatus = (brand: Brand) => {
    const nextStatus: "Active" | "Inactive" =
      brand.status === "Active" ? "Inactive" : "Active";
    setBrands((prev) =>
      prev.map((b) => (b.id === brand.id ? { ...b, status: nextStatus } : b)),
    );
    toast.success(`"${brand.brandName}" status updated to ${nextStatus}.`);
  };

  // Delete handlers
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setBrands((prev) => prev.filter((b) => b.id !== itemToDelete.id));
    toast.success(`Brand "${itemToDelete.brandName}" deleted.`);
    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Brand Code",
      "Brand Name",
      "Manufacturer",
      "Country of Origin",
      "Website",
      "Status",
      "Description",
    ];
    const rows = filteredBrands.map((b, idx) => [
      idx + 1,
      `"${b.brandCode}"`,
      `"${b.brandName.replace(/"/g, '""')}"`,
      `"${(b.manufacturer || "").replace(/"/g, '""')}"`,
      `"${b.countryOfOrigin || ""}"`,
      `"${b.website || ""}"`,
      `"${b.status}"`,
      `"${(b.description || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Brand_Master_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Brand records exported to CSV.");
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Embedded Breadcrumb / Back to Overview */}
      {embedded && onBackToOverview && (
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={onBackToOverview}
            className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Master Overview (All Menus)</span>
          </button>

          <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
            Category: Material & Item Master Setup
          </span>
        </div>
      )}

      {/* Main Top Header Card matching /inventory-configuration?tab=brand */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border/80 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Award className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                Material & Item Master Setup
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-xs text-muted-foreground font-semibold">
                {pageMode === "list" ? "Brand Management" : "Brand Form View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              Brand & Manufacturer Master
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Master repository of all registered brands, manufacturers, authorized dealers and country of origin.
            </p>
          </div>
        </div>

        {pageMode === "list" && (
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setIsExcelUploadOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-600/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="size-4" />
              <span>Upload Excel</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRecord(null);
                setPageMode("create");
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Add Brand</span>
            </button>
          </div>
        )}
      </div>

      {/* DEDICATED PAGE FORM VIEW */}
      {pageMode !== "list" && (
        <BrandMasterPageForm
          mode={pageMode}
          initialData={selectedRecord}
          origins={origins}
          onSave={(saved) => {
            if (pageMode === "create") {
              setBrands((prev) => [saved, ...prev]);
              toast.success("Brand created successfully.");
            } else {
              setBrands((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
              toast.success("Brand updated successfully.");
            }
            setPageMode("list");
          }}
          onCancel={() => setPageMode("list")}
          onSwitchToEdit={() => setPageMode("edit")}
        />
      )}

      {/* LIST TABLE VIEW */}
      {pageMode === "list" && (
        <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
          {/* Filter / Search Console matching /inventory-configuration?tab=brand */}
          <div className="p-4 border-b border-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search brands by code, name, manufacturer, origin..."
                  className="w-full pl-8.5 pr-8 h-8.5 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60">
                {(["All", "Active", "Inactive"] as const).map((st) => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      statusFilter === st
                        ? "bg-card text-amber-500 shadow-2xs font-extrabold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted-foreground font-medium ml-auto">
              Showing{" "}
              <span className="font-bold text-foreground">
                {totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-bold text-foreground">
                {Math.min(currentPage * pageSize, totalRecords)}
              </span>{" "}
              of <span className="font-bold text-foreground">{totalRecords}</span> entries
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="py-3 px-3.5 w-14 text-center">SL</th>
                  <th className="py-3 px-3.5">Brand Code</th>
                  <th className="py-3 px-3.5">Brand Name</th>
                  <th className="py-3 px-3.5">Manufacturer</th>
                  <th className="py-3 px-3.5">Origin Country</th>
                  <th className="py-3 px-3.5">Website</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      <div className="font-bold text-foreground">No brand records found</div>
                      <p className="text-xs mt-1">Try adjusting your search query or filters.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecord(null);
                          setPageMode("create");
                        }}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        <span>Add Brand</span>
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((item, index) => {
                    const slNumber = (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3.5 text-center text-muted-foreground font-mono font-medium">
                          {slNumber}
                        </td>
                        <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                          {item.brandCode}
                        </td>
                        <td className="py-2.5 px-3.5 font-bold text-foreground">
                          {item.brandName}
                        </td>
                        <td className="py-2.5 px-3.5">
                          {item.manufacturer ? (
                            <span className="flex items-center gap-1.5">
                              <Building2 className="size-3 text-muted-foreground shrink-0" />
                              <span>{item.manufacturer}</span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5">
                          {item.countryOfOrigin ? (
                            <span className="flex items-center gap-1.5">
                              <Globe className="size-3 text-muted-foreground shrink-0" />
                              <span>{item.countryOfOrigin}</span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-muted-foreground truncate max-w-xs">
                          {item.website ? (
                            <a
                              href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                            >
                              <span>{item.website}</span>
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            title="Click to toggle status"
                            className={`text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full border transition cursor-pointer ${
                              item.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20"
                            }`}
                          >
                            {item.status}
                          </button>
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRecord(item);
                                setPageMode("view");
                              }}
                              title="View Brand Details"
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRecord(item);
                                setPageMode("edit");
                              }}
                              title="Edit Brand"
                              className="p-1 rounded hover:bg-muted text-amber-500 hover:text-amber-600 cursor-pointer"
                            >
                              <Edit className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(item)}
                              title="Toggle Status"
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              {item.status === "Active" ? (
                                <ToggleRight className="size-3.5 text-emerald-500" />
                              ) : (
                                <ToggleLeft className="size-3.5 text-slate-400" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setItemToDelete(item);
                                setIsDeleteConfirmOpen(true);
                              }}
                              title="Delete Brand"
                              className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
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

          {/* Pagination Controls */}
          {totalRecords > 0 && (
            <div className="p-3 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <div>
                Page <span className="font-bold text-foreground">{currentPage}</span> of{" "}
                <span className="font-bold text-foreground">{totalPages}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-md border border-border/80 bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    type="button"
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`size-7 rounded-md text-xs font-bold transition cursor-pointer ${
                      currentPage === pg
                        ? "bg-amber-500 text-white shadow-2xs"
                        : "border border-border/80 bg-background hover:bg-muted text-foreground"
                    }`}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded-md border border-border/80 bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 rounded-xl bg-rose-500/10">
                <AlertCircle className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Confirm Brand Deletion</h3>
                <p className="text-xs text-muted-foreground">
                  Are you sure you want to permanently delete this brand?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60 text-xs space-y-1">
              <p>
                <span className="font-bold text-foreground">Brand Name:</span>{" "}
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  {itemToDelete.brandName}
                </span>
              </p>
              <p>
                <span className="font-bold text-foreground">Brand Code:</span>{" "}
                <span className="font-mono">{itemToDelete.brandCode}</span>
              </p>
              {itemToDelete.manufacturer && (
                <p>
                  <span className="font-bold text-foreground">Manufacturer:</span>{" "}
                  {itemToDelete.manufacturer}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold hover:bg-muted transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Delete Brand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Data Upload Modal */}
      <ExcelDataUploadModal
        isOpen={isExcelUploadOpen}
        onClose={() => setIsExcelUploadOpen(false)}
        activeTab="brand"
        onImportData={handleExcelImport}
      />
    </div>
  );
}
