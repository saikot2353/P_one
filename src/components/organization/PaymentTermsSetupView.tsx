import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileSpreadsheet,
  Clock,
  CalendarClock,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Percent,
} from "lucide-react";
import {
  PaymentTerm,
  DEFAULT_PAYMENT_TERMS,
  getStoredData,
  setStoredData,
} from "@/lib/procurement-master-data";
import { PaymentTermsPageForm } from "@/components/procurement/master-data/PaymentTermsPageForm";
import { ExcelDataUploadModal } from "@/components/procurement/master-data/ExcelDataUploadModal";

export interface PaymentTermsSetupViewProps {
  embedded?: boolean;
  onBackToOverview?: () => void;
}

export function PaymentTermsSetupView({
  embedded = false,
  onBackToOverview,
}: PaymentTermsSetupViewProps) {
  const [pageMode, setPageMode] = useState<"list" | "create" | "edit" | "view">("list");
  const [selectedRecord, setSelectedRecord] = useState<PaymentTerm | null>(null);

  // Master Data collections from localStorage (synced with proc_payment_terms)
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>(() =>
    getStoredData("proc_payment_terms", DEFAULT_PAYMENT_TERMS),
  );

  // Sync to storage on state change
  useEffect(() => {
    setStoredData("proc_payment_terms", paymentTerms);
  }, [paymentTerms]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PaymentTerm | null>(null);

  // Selected checkbox rows for bulk selection
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({});

  // Filtered rows
  const filteredPaymentTerms = useMemo(() => {
    return paymentTerms.filter((term) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        term.termCode.toLowerCase().includes(q) ||
        term.termName.toLowerCase().includes(q) ||
        (term.description && term.description.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || term.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [paymentTerms, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPaymentTerms.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPaymentTerms.slice(start, start + pageSize);
  }, [filteredPaymentTerms, currentPage, pageSize]);

  // Excel Upload Import handler
  const handleExcelImport = (importedRows: any[]) => {
    setPaymentTerms((prev) => [...importedRows, ...prev]);
    toast.success(`Successfully imported ${importedRows.length} payment term(s).`);
  };

  // Delete handlers
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setPaymentTerms((prev) => prev.filter((p) => p.id !== itemToDelete.id));
    toast.success(`Payment Term "${itemToDelete.termName}" deleted.`);
    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
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
            Category: Commercial & Terms / Finance References
          </span>
        </div>
      )}

      {/* Main Top Header Card matching /procurement-master-data?tab=payment-terms */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border/80 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                Commercial & Terms
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-xs text-muted-foreground font-semibold">
                {pageMode === "list" ? "List Overview" : "Dedicated Form View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              Payment Terms
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Payment conditions, credit periods, due-date rules & settlement terms.
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
              onClick={() => {
                setSelectedRecord(null);
                setPageMode("create");
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Create Payment Term</span>
            </button>
          </div>
        )}
      </div>

      {/* DEDICATED FORM PAGE VIEW (Create / Edit / Read-Only View) */}
      {pageMode !== "list" ? (
        <div className="bg-card rounded-2xl border border-border/80 p-5 lg:p-7 shadow-xs">
          <PaymentTermsPageForm
            mode={pageMode}
            initialData={selectedRecord}
            onSave={(saved) => {
              if (pageMode === "create") {
                setPaymentTerms((prev) => [saved, ...prev]);
                toast.success("Payment Term created successfully.");
              } else {
                setPaymentTerms((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
                toast.success("Payment Term updated successfully.");
              }
              setPageMode("list");
            }}
            onCancel={() => setPageMode("list")}
            onSwitchToEdit={() => setPageMode("edit")}
          />
        </div>
      ) : (
        /* LIST VIEW TABLE & FILTERS */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 sm:p-4 rounded-xl border border-border/80">
            <div className="relative flex-1 max-w-md">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by term code, name or description..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>

              <span className="text-xs font-semibold text-muted-foreground ml-2">
                Total: <span className="font-bold text-foreground">{filteredPaymentTerms.length}</span>
              </span>
            </div>
          </div>

          {/* Payment Terms Data Table */}
          <div className="bg-card rounded-xl border border-border/80 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-[11px] font-extrabold uppercase text-muted-foreground tracking-wider">
                    <th className="py-3 px-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          paginatedRows.length > 0 &&
                          paginatedRows.every((r) => selectedRowIds[r.id])
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const next: Record<string, boolean> = { ...selectedRowIds };
                          paginatedRows.forEach((r) => {
                            next[r.id] = checked;
                          });
                          setSelectedRowIds(next);
                        }}
                        className="rounded border-border text-amber-500 focus:ring-amber-500/20 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3.5">Term Code</th>
                    <th className="py-3 px-3.5">Term Name</th>
                    <th className="py-3 px-3.5">Description</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5 text-right w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        <Clock className="size-8 mx-auto text-muted-foreground/30 mb-2" />
                        <p className="font-semibold text-xs">No payment terms found.</p>
                        <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                          Try adjusting your search query or create a new term.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((term) => (
                      <tr
                        key={term.id}
                        className="hover:bg-muted/40 transition-colors group"
                      >
                        <td className="py-2.5 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!selectedRowIds[term.id]}
                            onChange={(e) =>
                              setSelectedRowIds((prev) => ({
                                ...prev,
                                [term.id]: e.target.checked,
                              }))
                            }
                            className="rounded border-border text-amber-500 focus:ring-amber-500/20 cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                          {term.termCode}
                        </td>
                        <td className="py-2.5 px-3.5 font-bold text-foreground">
                          {term.termName}
                        </td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">
                          {term.description || "—"}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <span
                            className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                              term.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                            }`}
                          >
                            {term.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Eye */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRecord(term);
                                setPageMode("view");
                              }}
                              className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="size-3.5" />
                            </button>

                            {/* Edit Pencil */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRecord(term);
                                setPageMode("edit");
                              }}
                              className="p-1.5 rounded-lg hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 transition cursor-pointer"
                              title="Edit Term"
                            >
                              <Edit className="size-3.5" />
                            </button>

                            {/* Delete Trash */}
                            <button
                              type="button"
                              onClick={() => {
                                setItemToDelete(term);
                                setIsDeleteConfirmOpen(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition cursor-pointer"
                              title="Delete Term"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredPaymentTerms.length > pageSize && (
              <div className="flex items-center justify-between p-3.5 border-t border-border bg-muted/20 text-xs">
                <span className="text-muted-foreground text-[11px]">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, filteredPaymentTerms.length)} of{" "}
                  {filteredPaymentTerms.length} terms
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded-md border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <span className="px-2 text-xs font-bold text-foreground">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2.5 py-1 rounded-md border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Excel Data Upload Modal */}
      <ExcelDataUploadModal
        isOpen={isExcelUploadOpen}
        onClose={() => setIsExcelUploadOpen(false)}
        targetTab="payment-terms"
        onImportSuccess={handleExcelImport}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <AlertCircle className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Delete Payment Term</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete payment term{" "}
              <strong className="text-foreground">
                "{itemToDelete.termName} ({itemToDelete.termCode})"
              </strong>
              ? Any associated purchase orders or supplier profiles will retain historic references.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold hover:bg-muted text-foreground transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Delete Term
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
