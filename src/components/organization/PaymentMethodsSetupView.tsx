import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  X,
  ArrowLeft,
  Check,
  FileSpreadsheet,
} from "lucide-react";

export interface PaymentMethod {
  id: string;
  name: string;
  status: "Active" | "Inactive";
}

export interface PaymentMethodsSetupViewProps {
  embedded?: boolean;
  onBackToOverview?: () => void;
}

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pm-1", name: "Cash", status: "Active" },
  { id: "pm-2", name: "Bank Transfer", status: "Active" },
  { id: "pm-3", name: "Cheque", status: "Active" },
  { id: "pm-4", name: "Digital Wallet", status: "Active" },
];

export function PaymentMethodsSetupView({
  embedded = false,
  onBackToOverview,
}: PaymentMethodsSetupViewProps) {
  // Master data state from localStorage
  const [methods, setMethods] = useState<PaymentMethod[]>(() => {
    try {
      const saved = localStorage.getItem("hris_payment_methods_simple");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_PAYMENT_METHODS;
  });

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("hris_payment_methods_simple", JSON.stringify(methods));
    } catch {
      // storage unavailable
    }
  }, [methods]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<PaymentMethod | null>(null);
  const [methodNameInput, setMethodNameInput] = useState("");
  const [statusInput, setStatusInput] = useState<"Active" | "Inactive">("Active");
  const [formError, setFormError] = useState("");

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PaymentMethod | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered methods
  const filteredMethods = useMemo(() => {
    return methods.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || m.name.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [methods, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMethods.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMethods.slice(start, start + pageSize);
  }, [filteredMethods, currentPage, pageSize]);


  // Handlers for Add / Edit
  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingItem(null);
    setMethodNameInput("");
    setStatusInput("Active");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PaymentMethod) => {
    setModalMode("edit");
    setEditingItem(item);
    setMethodNameInput(item.name);
    setStatusInput(item.status);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = methodNameInput.trim();

    if (!trimmed) {
      setFormError("Payment Method Name is required.");
      return;
    }

    // Check duplicate name
    const isDuplicate = methods.some(
      (m) =>
        m.name.toLowerCase() === trimmed.toLowerCase() &&
        (modalMode === "create" || m.id !== editingItem?.id),
    );

    if (isDuplicate) {
      setFormError("This payment method already exists.");
      return;
    }

    if (modalMode === "create") {
      const newItem: PaymentMethod = {
        id: `pm-${Date.now()}`,
        name: trimmed,
        status: statusInput,
      };
      setMethods((prev) => [newItem, ...prev]);
      toast.success(`Payment method "${trimmed}" added successfully.`);
    } else if (modalMode === "edit" && editingItem) {
      setMethods((prev) =>
        prev.map((m) =>
          m.id === editingItem.id
            ? { ...m, name: trimmed, status: statusInput }
            : m,
        ),
      );
      toast.success(`Payment method updated to "${trimmed}".`);
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (item: PaymentMethod) => {
    const newStatus: "Active" | "Inactive" =
      item.status === "Active" ? "Inactive" : "Active";
    setMethods((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, status: newStatus } : m)),
    );
    toast.success(`"${item.name}" marked as ${newStatus}.`);
  };

  const handleDeletePrompt = (item: PaymentMethod) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setMethods((prev) => prev.filter((m) => m.id !== itemToDelete.id));
    toast.success(`Payment method "${itemToDelete.name}" deleted.`);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["SL", "Payment Method Name", "Status"];
    const rows = filteredMethods.map((m, idx) => [
      idx + 1,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.status}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Payment_Methods_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported payment methods to CSV.");
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Embedded Breadcrumb / Back button */}
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
            Category: Finance & Payment References
          </span>
        </div>
      )}

      {/* Main Top Header Card matching Cripton Master Data Design */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border/80 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <CreditCard className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase text-sky-600 dark:text-sky-400 tracking-wider">
                Finance & Payment References
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-xs text-muted-foreground font-semibold">
                Master Setup
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              Payment Method Setup
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage accepted payment method names like Cash, Bank Transfer, Cheque, Digital Wallet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Payment Method</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search payment method name (e.g. Cash, Bank Transfer, Cheque)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border/70 bg-background text-xs font-medium focus:border-sky-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="h-8 px-2.5 rounded-lg border border-border/70 bg-background text-xs font-semibold focus:border-sky-500 outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Container - Full page width with Status column in the middle */}
      <div className="w-full overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 font-bold text-muted-foreground uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4 w-16 text-center">SL</th>
                <th className="py-3 px-6 w-[45%]">Payment Method Name</th>
                <th className="py-3 px-4 w-[35%] text-center">Status</th>
                <th className="py-3 px-6 w-[15%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="font-bold text-sm text-foreground">No payment methods found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Click the button below to add your first payment method.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenCreate}
                      className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Payment Method</span>
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((method, index) => {
                  const slNumber = (currentPage - 1) * pageSize + index + 1;

                  return (
                    <tr
                      key={method.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center text-muted-foreground font-mono font-medium">
                        {slNumber}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-foreground text-sm">
                        {method.name}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(method)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                            method.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20 hover:bg-slate-500/20"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              method.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          <span>{method.status}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(method)}
                            className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 transition cursor-pointer"
                            title="Edit Payment Method"
                          >
                            <Edit className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePrompt(method)}
                            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 transition cursor-pointer"
                            title="Delete Payment Method"
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

        {/* Pagination footer */}
        {filteredMethods.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-border/80 text-xs text-muted-foreground bg-muted/20">
            <p>
              Showing{" "}
              <span className="font-bold text-foreground">
                {Math.min((currentPage - 1) * pageSize + 1, filteredMethods.length)}
              </span>{" "}
              to{" "}
              <span className="font-bold text-foreground">
                {Math.min(currentPage * pageSize, filteredMethods.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-foreground">
                {filteredMethods.length}
              </span>{" "}
              methods
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-md border border-border/70 text-xs font-bold disabled:opacity-40 hover:bg-muted transition cursor-pointer"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`size-7 rounded-md text-xs font-bold transition cursor-pointer ${
                      currentPage === page
                        ? "bg-sky-600 text-white shadow-2xs"
                        : "border border-border/70 hover:bg-muted text-foreground"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded-md border border-border/70 text-xs font-bold disabled:opacity-40 hover:bg-muted transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Modal - ONLY asks for Payment Method Name and Status */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {modalMode === "create" ? "Add Payment Method" : "Edit Payment Method"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {modalMode === "create"
                      ? "Enter the name of the new payment method."
                      : `Update payment method "${editingItem?.name}".`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Payment Method Name Only */}
              <div>
                <label className="block text-xs font-bold mb-1.5 text-foreground">
                  Payment Method Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Cash, Bank Transfer, Cheque, Digital Wallet..."
                  value={methodNameInput}
                  onChange={(e) => {
                    setMethodNameInput(e.target.value);
                    if (formError) setFormError("");
                  }}
                  className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-sm font-semibold focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition"
                />
                {formError && (
                  <p className="text-[11px] font-medium text-rose-500 mt-1.5">{formError}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold mb-1.5 text-foreground">
                  Status
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as "Active" | "Inactive")}
                  className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-xs font-semibold focus:border-sky-500 outline-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold hover:bg-muted transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="size-4" />
                  <span>{modalMode === "create" ? "Add Method" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 rounded-xl bg-rose-500/10">
                <AlertCircle className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Confirm Deletion</h3>
                <p className="text-xs text-muted-foreground">
                  Are you sure you want to delete this payment method?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60 text-xs">
              <span className="font-bold text-foreground">Payment Method:</span>{" "}
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                {itemToDelete.name}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
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
                Delete Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
