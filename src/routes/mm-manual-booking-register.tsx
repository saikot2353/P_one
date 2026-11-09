import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMAccessoriesBooking,
} from "../lib/marketing-merchandising-data";
import {
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Plus,
  Trash2,
  Edit,
  AlertTriangle,
  RotateCw,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-manual-booking-register")({
  head: () => ({
    meta: [
      { title: "Block Yarn Booking Register — CriptonHRIS" },
      {
        name: "description",
        content:
          "Central register of saved Block Yarn Bookings with approval statuses, search, and record management.",
      },
    ],
  }),
  component: MMManualBookingRegisterPage,
});

type StatusFilter = "All" | "Pending" | "Approved" | "Rejected" | "Returned" | "Draft";

function MMManualBookingRegisterPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<MMAccessoriesBooking[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingNoFilter, setBookingNoFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<MMAccessoriesBooking | null>(null);

  const loadData = () => {
    const list = MMRepository.getManualBookings();
    setBookings(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Normalize status
  const normalizeStatus = (
    status?: string
  ): "Pending" | "Approved" | "Rejected" | "Returned" | "Draft" => {
    if (!status) return "Draft";
    const s = status.toLowerCase().trim();
    if (s.includes("pending") || s.includes("submit")) return "Pending";
    if (s.includes("approve")) return "Approved";
    if (s.includes("reject")) return "Rejected";
    if (s.includes("return")) return "Returned";
    return "Draft";
  };

  // Distinct suppliers
  const suppliers = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b) => {
      if (b.supplierName) set.add(b.supplierName);
    });
    return Array.from(set).sort();
  }, [bookings]);

  // Tab counts
  const tabCounts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let returned = 0;
    let draft = 0;
    bookings.forEach((b) => {
      const norm = normalizeStatus(b.status);
      if (norm === "Pending") pending++;
      else if (norm === "Approved") approved++;
      else if (norm === "Rejected") rejected++;
      else if (norm === "Returned") returned++;
      else draft++;
    });
    return {
      All: bookings.length,
      Pending: pending,
      Approved: approved,
      Rejected: rejected,
      Returned: returned,
      Draft: draft,
    };
  }, [bookings]);

  // Filtered list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const norm = normalizeStatus(b.status);
      if (statusFilter !== "All" && norm !== statusFilter) return false;
      if (supplierFilter !== "All" && b.supplierName !== supplierFilter) return false;
      if (
        bookingNoFilter.trim() &&
        !b.bookingNo.toLowerCase().includes(bookingNoFilter.toLowerCase().trim())
      ) {
        return false;
      }
      if (dateFilter && b.bookingDate !== dateFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mNo = b.bookingNo.toLowerCase().includes(q);
        const mSup = b.supplierName?.toLowerCase().includes(q);
        if (!mNo && !mSup) return false;
      }
      return true;
    });
  }, [
    bookings,
    statusFilter,
    supplierFilter,
    bookingNoFilter,
    dateFilter,
    searchQuery,
  ]);

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setBookingNoFilter("");
    setSupplierFilter("All");
    setDateFilter("");
    setStatusFilter("All");
  };

  // Perform delete operation
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const success = MMRepository.deleteManualBooking(deleteTarget.id);
    if (success) {
      toast.success(`Block Yarn Booking ${deleteTarget.bookingNo} deleted successfully.`);
      loadData();
    } else {
      toast.error("Failed to delete block yarn booking record.");
    }
    setDeleteTarget(null);
  };

  // Summary helper methods
  const getBookingValue = (b: MMAccessoriesBooking): number => {
    if (typeof b.totalBookedAmount === "number" && !isNaN(b.totalBookedAmount)) {
      return b.totalBookedAmount;
    }
    if (b.lines && b.lines.length > 0) {
      return b.lines.reduce((sum, l) => sum + (Number(l.bookAmt) || 0), 0);
    }
    if (b.items && b.items.length > 0) {
      return b.items.reduce((sum, it) => sum + (Number((it as any).total || (it as any).bookedAmount) || 0), 0);
    }
    return 0;
  };

  const getBudgetValue = (b: MMAccessoriesBooking): number => {
    if (typeof b.totalPreCostAmount === "number" && !isNaN(b.totalPreCostAmount)) {
      return b.totalPreCostAmount;
    }
    if (b.lines && b.lines.length > 0) {
      return b.lines.reduce((sum, l) => sum + (Number(l.budgetValue) || 0), 0);
    }
    return 0;
  };

  const getJobSummary = (b: MMAccessoriesBooking): string => {
    if (b.ourRef) return b.ourRef;
    if (b.lines && b.lines.length > 0) {
      const set = new Set<string>();
      b.lines.forEach((l) => {
        if (l.ourRef) set.add(l.ourRef);
      });
      if (set.size > 0) return Array.from(set).join(", ");
    }
    return "—";
  };

  const getStyleSummary = (b: MMAccessoriesBooking): string => {
    if (b.lines && b.lines.length > 0) {
      const set = new Set<string>();
      b.lines.forEach((l) => {
        if (l.style) set.add(l.style);
      });
      if (set.size > 0) return Array.from(set).join(", ");
    }
    return "—";
  };

  const getAccessoriesUom = (b: MMAccessoriesBooking): string => {
    if (b.bookingUnit) return b.bookingUnit;
    if (b.lines && b.lines.length > 0 && b.lines[0].unit) {
      return b.lines[0].unit;
    }
    return "Pcs";
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-manual-booking-register"
      title="Block Yarn Booking Register"
      subtitle=""
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Booking Information" },
        { label: "Block Yarn Booking Register" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          {/* Create Block Booking Action */}
          <Link
            to="/mm-manual-booking"
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-teal-600/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Block Booking</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-4 p-4 max-w-[1600px] mx-auto">
        {/* Status Tabs and Quick Controls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg overflow-x-auto">
            {(["All", "Pending", "Approved", "Rejected", "Returned", "Draft"] as StatusFilter[]).map(
              (tab) => {
                const count = tabCounts[tab];
                const isSelected = statusFilter === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredBookings.length}</strong> of{" "}
              {bookings.length} block yarn bookings
            </span>
            <button
              type="button"
              onClick={loadData}
              title="Refresh register"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Search & Filters Row */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block text-[11px] mb-1">Global Search</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block text-[11px] mb-1">Booking No.</label>
            <input
              type="text"
              placeholder="e.g. MB-2026-001"
              value={bookingNoFilter}
              onChange={(e) => setBookingNoFilter(e.target.value)}
              className="w-full px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 block text-[11px] mb-1">Supplier</label>
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="w-full px-2 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block text-[11px] mb-1">Booking Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Booking No.</th>
                  <th className="py-3 px-3">Booking Date</th>
                  <th className="py-3 px-3">Supplier</th>
                  <th className="py-3 px-3 text-right">Booking Qty</th>
                  <th className="py-3 px-3 text-right">Booking Value</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Submitted By</th>
                  <th className="py-3 px-3 text-center sticky right-0 bg-slate-50 dark:bg-slate-800 shadow-sm w-44">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Package className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-slate-600 dark:text-slate-400">
                        No block yarn bookings found
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Click "Create Block Booking" above to add your first block yarn booking.
                      </p>
                      <div className="mt-4">
                        <Link
                          to="/mm-manual-booking"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create Block Booking</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const norm = normalizeStatus(b.status);
                    const bookingVal = getBookingValue(b);

                    return (
                      <tr
                        key={b.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-semibold text-teal-700 dark:text-teal-400 whitespace-nowrap">
                          <Link
                            to="/mm-manual-booking"
                            search={{ bookingId: b.id }}
                            className="hover:underline font-mono"
                          >
                            {b.bookingNo}
                          </Link>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {b.bookingDate || "—"}
                        </td>
                        <td
                          className="py-2.5 px-3 whitespace-nowrap max-w-[180px] truncate"
                          title={b.supplierName}
                        >
                          {b.supplierName || "—"}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-medium">
                          {(b.totalBookedQty || 0).toLocaleString()} {getAccessoriesUom(b)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-bold text-slate-900 dark:text-white">
                          $
                          {bookingVal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {norm === "Approved" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Approved
                            </span>
                          ) : norm === "Pending" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200">
                              <Clock className="w-3 h-3 animate-pulse text-amber-500" />
                              Pending
                            </span>
                          ) : norm === "Rejected" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-500" />
                              Rejected
                            </span>
                          ) : norm === "Returned" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200">
                              <RotateCcw className="w-3 h-3 text-purple-500" />
                              Returned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {b.submittedBy || b.createdBy || "Tanvir Ahmed"}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap sticky right-0 bg-white dark:bg-slate-900 shadow-sm">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View Action */}
                            <Link
                              to="/mm-manual-booking"
                              search={{ bookingId: b.id, mode: "view" }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
                              title="View full Manual Booking record"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </Link>

                            {/* Edit Action */}
                            <Link
                              to="/mm-manual-booking"
                              search={{ bookingId: b.id, mode: "edit" }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:hover:bg-teal-900 dark:text-teal-300 transition-colors"
                              title="Edit Manual Booking record"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </Link>

                            {/* PI Action */}
                            <Link
                              to="/mm-proforma-invoice-create"
                              search={{
                                bookingId: b.id,
                                bookingNo: b.bookingNo,
                                source: "block-booking",
                                item: "Block Booking",
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 dark:text-indigo-300 transition-colors"
                              title="Create / Open Proforma Invoice for this Block Yarn Booking"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>PI</span>
                            </Link>

                            {/* Delete Action */}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(b)}
                              className="inline-flex items-center p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Delete Manual Booking record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Delete Block Yarn Booking
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete this block yarn booking?
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking No:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {deleteTarget.bookingNo}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Supplier:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {deleteTarget.supplierName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Job ID:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {getJobSummary(deleteTarget)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
              This action cannot be undone. Only this Block Yarn Booking record will be removed.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Delete Block Yarn Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </MarketingMerchandisingLayout>
  );
}
