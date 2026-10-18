import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
} from "lucide-react";

export interface FinancialPeriodSetupViewProps {
  embedded?: boolean;
  onBackToOverview?: () => void;
}

export interface FiscalYear {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isClosed: boolean;
  closedAt?: string;
  closedBy?: string;
  effectiveCompanies?: string[];
}

const DEFAULT_FISCAL_YEARS: FiscalYear[] = [
  {
    id: "fy-2026-2027",
    code: "2026-2027",
    name: "2026-2027",
    startDate: "2026-07-01",
    endDate: "2027-06-30",
    isActive: true,
    isClosed: false,
    effectiveCompanies: [
      "Pakiza Software Ltd.",
      "Pakiza Knit Composite Ltd.",
      "Pakiza Apparels Ltd.",
    ],
  },
  {
    id: "fy-2025-2026",
    code: "2025-2026",
    name: "2025-2026",
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    isActive: false,
    isClosed: true,
    closedAt: "2026-07-15 14:30:00",
    closedBy: "Audit Committee & CFO",
    effectiveCompanies: [
      "Pakiza Software Ltd.",
      "Pakiza Knit Composite Ltd.",
      "Pakiza Apparels Ltd.",
    ],
  },
  {
    id: "fy-2024-2025",
    code: "2024-2025",
    name: "2024-2025",
    startDate: "2024-07-01",
    endDate: "2025-06-30",
    isActive: false,
    isClosed: true,
    closedAt: "2025-07-20 11:15:00",
    closedBy: "Chief Financial Officer",
    effectiveCompanies: [
      "Pakiza Software Ltd.",
      "Pakiza Knit Composite Ltd.",
      "Pakiza Apparels Ltd.",
    ],
  },
  {
    id: "fy-2027-2028",
    code: "2027-2028",
    name: "2027-2028",
    startDate: "2027-07-01",
    endDate: "2028-06-30",
    isActive: false,
    isClosed: false,
    effectiveCompanies: [
      "Pakiza Software Ltd.",
      "Pakiza Knit Composite Ltd.",
      "Pakiza Apparels Ltd.",
    ],
  },
];

export function FinancialPeriodSetupView({
  embedded = false,
  onBackToOverview,
}: FinancialPeriodSetupViewProps) {
  // Fiscal Years State from localStorage
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>(() => {
    try {
      const stored = localStorage.getItem("accounts:fiscal_years");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to parse stored fiscal years", e);
    }
    return DEFAULT_FISCAL_YEARS;
  });

  // Save to storage
  useEffect(() => {
    try {
      localStorage.setItem("accounts:fiscal_years", JSON.stringify(fiscalYears));
    } catch (e) {
      console.error("Failed to save fiscal years", e);
    }
  }, [fiscalYears]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [lockFilter, setLockFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal State for Create / Edit Period
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<FiscalYear | null>(null);

  // Filtered Fiscal Years list
  const filteredFiscalYears = useMemo(() => {
    return fiscalYears.filter((item) => {
      const isClosed = item.isClosed;
      const isActive = item.isActive !== false;

      if (lockFilter === "Locked" && !isClosed) return false;
      if (lockFilter === "Unlocked" && isClosed) return false;

      if (statusFilter === "Active" && !isActive) return false;
      if (statusFilter === "Inactive" && isActive) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (item.name || item.code || "").toLowerCase().includes(q);
        const startMatch = (item.startDate || "").toLowerCase().includes(q);
        const endMatch = (item.endDate || "").toLowerCase().includes(q);
        if (!nameMatch && !startMatch && !endMatch) return false;
      }

      return true;
    });
  }, [fiscalYears, searchQuery, lockFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredFiscalYears.length / pageSize));
  const paginatedFiscalYears = filteredFiscalYears.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Handlers for Fiscal Year operations
  const handleOpenCreateModal = () => {
    setEditingPeriod(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: FiscalYear) => {
    setEditingPeriod(item);
    setIsModalOpen(true);
  };

  const handleDeletePeriod = (code: string) => {
    if (window.confirm(`Are you sure you want to delete Financial Period "${code}"?`)) {
      setFiscalYears((prev) => prev.filter((fy) => fy.code !== code));
      toast.success(`Financial Period "${code}" deleted successfully.`);
    }
  };

  const handleToggleLock = (code: string) => {
    setFiscalYears((prev) =>
      prev.map((fy) => {
        if (fy.code !== code) return fy;
        const newClosed = !fy.isClosed;
        return {
          ...fy,
          isClosed: newClosed,
          closedAt: newClosed ? new Date().toISOString().replace("T", " ").substring(0, 19) : undefined,
          closedBy: newClosed ? "Chief Financial Officer" : undefined,
        };
      })
    );
    toast.success(`Lock status updated for Financial Period "${code}".`);
  };

  const handleSavePeriod = (formData: {
    name: string;
    startDate: string;
    endDate: string;
    lockStatus: string;
    status: string;
  }) => {
    if (editingPeriod) {
      // Update
      setFiscalYears((prev) =>
        prev.map((fy) =>
          fy.code === editingPeriod.code
            ? {
                ...fy,
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                isActive: formData.status === "Active",
                isClosed: formData.lockStatus === "Locked",
              }
            : fy
        )
      );
      toast.success(`Financial Period "${formData.name}" updated successfully.`);
    } else {
      // Create new
      const code = formData.name.trim();
      if (fiscalYears.some((fy) => fy.code === code)) {
        toast.error(`Financial Period "${code}" already exists!`);
        return;
      }
      const newFy: FiscalYear = {
        id: `fy-${code}-${Date.now()}`,
        code,
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.status === "Active",
        isClosed: formData.lockStatus === "Locked",
        effectiveCompanies: [
          "Pakiza Software Ltd.",
          "Pakiza Knit Composite Ltd.",
          "Pakiza Apparels Ltd.",
        ],
      };
      setFiscalYears((prev) => [newFy, ...prev]);
      toast.success(`Financial Period "${formData.name}" created successfully.`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4">
      {/* Top Header & Breadcrumb */}
      <div className="space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground/70 uppercase tracking-wider">
            <span>Home</span>
            <ChevronRight className="size-3 text-muted-foreground/40" />
            <span>Accounts Configuration</span>
            <ChevronRight className="size-3 text-muted-foreground/40" />
            <span className="text-primary font-black">Financial Period Setup</span>
          </div>

          {embedded && onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Master Overview</span>
            </button>
          )}
        </div>

        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center shadow-2xs">
              <CalendarDays className="size-4.5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <span>Financial Period Setup</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {fiscalYears.length} Periods
                </span>
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Define accounting fiscal years, effective start and end dates, and transaction locking rules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-sm shadow-primary/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>New Period</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financial Periods Main Section (Exact Replica of /accounts-config/financial-period-setup) */}
      <div className="space-y-4">
        {/* Search & Filter Card */}
        <div className="bg-card border border-border/70 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search financial period name or date..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-background border border-border/80 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-background border border-border/80 px-2.5 py-1 rounded-lg shadow-2xs">
              <Filter className="size-3 text-muted-foreground" />
              <select
                value={lockFilter}
                onChange={(e) => {
                  setLockFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs font-semibold bg-transparent text-foreground outline-none cursor-pointer"
              >
                <option value="All">All Lock Statuses</option>
                <option value="Unlocked">Unlocked</option>
                <option value="Locked">Locked</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-background border border-border/80 px-2.5 py-1 rounded-lg shadow-2xs">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs font-semibold bg-transparent text-foreground outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/30 border-b border-border/70 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-4 font-black w-14 text-center">SI</th>
                  <th className="py-2.5 px-4 font-black">Name</th>
                  <th className="py-2.5 px-4 font-black">Start</th>
                  <th className="py-2.5 px-4 font-black">End</th>
                  <th className="py-2.5 px-4 font-black text-center w-28">Lock</th>
                  <th className="py-2.5 px-4 font-black text-center w-28">Status</th>
                  <th className="py-2.5 px-4 font-black text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedFiscalYears.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      <CalendarDays className="size-8 mx-auto text-muted-foreground/30 mb-2" />
                      <p className="text-sm font-semibold">No financial periods found</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Click "New Period" to set up your accounting fiscal cycle.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedFiscalYears.map((item, idx) => {
                    const serial = (page - 1) * pageSize + idx + 1;
                    const isClosed = item.isClosed;
                    const isActive = item.isActive !== false;

                    return (
                      <tr key={item.id || item.code} className="hover:bg-muted/25 transition-colors group">
                        {/* SI */}
                        <td className="py-2.5 px-4 text-center font-mono text-[11px] font-semibold text-muted-foreground">
                          {serial}
                        </td>

                        {/* Name */}
                        <td className="py-2.5 px-4 font-bold text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{item.name || item.code}</span>
                            {item.code && item.name && item.code !== item.name && (
                              <span className="text-[10px] font-mono text-muted-foreground/70 bg-muted px-1.5 py-0.5 rounded">
                                {item.code}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Start Date */}
                        <td className="py-2.5 px-4 text-foreground/80 font-medium">
                          {formatDate(item.startDate)}
                        </td>

                        {/* End Date */}
                        <td className="py-2.5 px-4 text-foreground/80 font-medium">
                          {formatDate(item.endDate)}
                        </td>

                        {/* Lock Status */}
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                              isClosed
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                isClosed ? "bg-rose-500" : "bg-emerald-500"
                              }`}
                            />
                            <span>{isClosed ? "Locked" : "Unlocked"}</span>
                          </span>
                        </td>

                        {/* Active / Inactive Status */}
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                              isActive
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                isActive ? "bg-emerald-500" : "bg-muted-foreground/40"
                              }`}
                            />
                            <span>{isActive ? "Active" : "Inactive"}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleToggleLock(item.code)}
                              title={isClosed ? "Unlock Period" : "Lock Period"}
                              className={`size-7 rounded-lg border border-border/60 transition-all flex items-center justify-center cursor-pointer shadow-2xs ${
                                isClosed
                                  ? "hover:border-emerald-400/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-muted-foreground hover:text-emerald-600"
                                  : "hover:border-amber-400/50 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-muted-foreground hover:text-amber-600"
                              }`}
                            >
                              {isClosed ? (
                                <Unlock className="size-3.5" />
                              ) : (
                                <Lock className="size-3.5" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item)}
                              title="Edit Period"
                              className="size-7 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                            >
                              <Edit2 className="size-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeletePeriod(item.code)}
                              title="Delete Period"
                              className="size-7 rounded-lg border border-border/60 hover:border-rose-400/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-muted-foreground hover:text-rose-600 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
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
          <div className="px-4 py-3 border-t border-border/60 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <span>
                Showing{" "}
                <strong className="text-foreground">
                  {filteredFiscalYears.length === 0 ? 0 : (page - 1) * pageSize + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-foreground">
                  {Math.min(page * pageSize, filteredFiscalYears.length)}
                </strong>{" "}
                of{" "}
                <strong className="text-foreground">{filteredFiscalYears.length}</strong>{" "}
                periods
              </span>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold text-xs shadow-2xs"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`size-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      page === pageNum
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold text-xs shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Create / Edit Financial Period (Exact replicate of BXe) */}
      <FinancialPeriodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSavePeriod}
        editPeriod={editingPeriod}
      />
    </div>
  );
}

// Modal Component (Exact replication of BXe from Pakiza Accounts)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    startDate: string;
    endDate: string;
    lockStatus: string;
    status: string;
  }) => void;
  editPeriod: FiscalYear | null;
}

function FinancialPeriodModal({ isOpen, onClose, onSubmit, editPeriod }: ModalProps) {
  const [name, setName] = useState(editPeriod?.name || editPeriod?.code || "");
  const [startDate, setStartDate] = useState(editPeriod?.startDate || "");
  const [endDate, setEndDate] = useState(editPeriod?.endDate || "");
  const [lockStatus, setLockStatus] = useState(
    editPeriod?.isClosed ? "Locked" : "Unlocked"
  );
  const [status, setStatus] = useState(
    editPeriod?.isActive === false ? "Inactive" : "Active"
  );

  useEffect(() => {
    if (editPeriod) {
      setName(editPeriod.name || editPeriod.code || "");
      setStartDate(editPeriod.startDate || "");
      setEndDate(editPeriod.endDate || "");
      setLockStatus(editPeriod.isClosed ? "Locked" : "Unlocked");
      setStatus(editPeriod.isActive === false ? "Inactive" : "Active");
    } else {
      setName("2026-2027");
      setStartDate("2026-07-01");
      setEndDate("2027-06-30");
      setLockStatus("Unlocked");
      setStatus("Active");
    }
  }, [editPeriod, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name,
      startDate,
      endDate,
      lockStatus,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
              <CalendarDays className="size-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {editPeriod ? "Edit Financial Period" : "Create Financial Period"}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Define the fiscal year range and transaction lock rules
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 2026-2027"
              className="w-full h-9 px-3 rounded-xl bg-card border border-border/80 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
            />
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-card border border-border/80 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-card border border-border/80 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Lock & Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                Lock Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={lockStatus}
                onChange={(e) => setLockStatus(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-card border border-border/80 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs cursor-pointer"
              >
                <option value="Unlocked">Unlocked</option>
                <option value="Locked">Locked</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-card border border-border/80 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold shadow-sm shadow-primary/20 transition-all cursor-pointer active:scale-95"
            >
              {editPeriod ? "Update Period" : "Create Period"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
