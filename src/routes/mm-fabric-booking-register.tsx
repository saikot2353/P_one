import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMFabricBooking,
  BookingStatus,
} from "../lib/marketing-merchandising-data";
import {
  Scissors,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Search,
  Filter,
  Eye,
  FileCheck,
  CheckSquare,
  Square,
  AlertTriangle,
  RotateCw,
  Plus,
  ExternalLink,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-fabric-booking-register")({
  head: () => ({
    meta: [
      { title: "Fabric Booking Register — CriptonHRIS" },
      {
        name: "description",
        content: "Central register of saved Fabric Bookings with approval statuses, same-supplier multi-selection, and Proforma Invoice (PI) creation.",
      },
    ],
  }),
  component: MMFabricBookingRegisterPage,
});

type StatusFilter = "All" | "Pending" | "Approved" | "Rejected" | "Returned";

function MMFabricBookingRegisterPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<MMFabricBooking[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingNoFilter, setBookingNoFilter] = useState("");
  const [jobIdFilter, setJobIdFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [styleFilter, setStyleFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Multi-Selection State for PI creation
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [activeSupplier, setActiveSupplier] = useState<string | null>(null);

  const loadData = () => {
    const list = MMRepository.getFabricBookings();
    setBookings(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Normalize status
  const normalizeStatus = (status?: string): "Pending" | "Approved" | "Rejected" | "Returned" | "Draft" => {
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
    bookings.forEach((b) => {
      const norm = normalizeStatus(b.status);
      if (norm === "Pending") pending++;
      else if (norm === "Approved") approved++;
      else if (norm === "Rejected") rejected++;
      else if (norm === "Returned") returned++;
    });
    return {
      All: bookings.length,
      Pending: pending,
      Approved: approved,
      Rejected: rejected,
      Returned: returned,
    };
  }, [bookings]);

  // Filtered list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const norm = normalizeStatus(b.status);
      if (statusFilter !== "All" && norm !== statusFilter) return false;
      if (supplierFilter !== "All" && b.supplierName !== supplierFilter) return false;
      if (bookingNoFilter.trim() && !b.bookingNo.toLowerCase().includes(bookingNoFilter.toLowerCase().trim())) {
        return false;
      }
      const bJob = (b.ourRef || b.lines?.[0]?.jobId || b.items?.[0]?.orderNo || "").toLowerCase();
      if (jobIdFilter.trim() && !bJob.includes(jobIdFilter.toLowerCase().trim())) {
        return false;
      }
      const bStyle = (b.lines?.[0]?.styleNo || b.items?.[0]?.styleNo || "").toLowerCase();
      if (styleFilter.trim() && !bStyle.includes(styleFilter.toLowerCase().trim())) {
        return false;
      }
      if (dateFilter && b.bookingDate !== dateFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mNo = b.bookingNo.toLowerCase().includes(q);
        const mSup = b.supplierName?.toLowerCase().includes(q);
        const mJob = bJob.includes(q);
        const mStyle = bStyle.includes(q);
        if (!mNo && !mSup && !mJob && !mStyle) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, supplierFilter, bookingNoFilter, jobIdFilter, styleFilter, dateFilter, searchQuery]);

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setBookingNoFilter("");
    setJobIdFilter("");
    setSupplierFilter("All");
    setStyleFilter("");
    setDateFilter("");
    setStatusFilter("All");
  };

  // Selection Checkbox Handler with Same-Supplier Validation
  const handleToggleBookingSelection = (booking: MMFabricBooking) => {
    const isAlreadySelected = selectedBookingIds.includes(booking.id);

    if (isAlreadySelected) {
      const next = selectedBookingIds.filter((id) => id !== booking.id);
      setSelectedBookingIds(next);
      if (next.length === 0) {
        setActiveSupplier(null);
      }
      return;
    }

    // Must be Approved to be selected for PI creation
    const norm = normalizeStatus(booking.status);
    if (norm !== "Approved") {
      toast.error(`Booking ${booking.bookingNo} cannot be selected because its status is ${booking.status}. Only Approved bookings can be used for PI creation.`);
      return;
    }

    // Same-supplier validation
    const bookingSupplier = booking.supplierName || "Default Supplier";
    if (selectedBookingIds.length > 0 && activeSupplier && activeSupplier !== bookingSupplier) {
      toast.warning(
        `Cross-supplier selection not allowed. Selected bookings must belong to "${activeSupplier}". Clear current selection to choose "${bookingSupplier}".`
      );
      return;
    }

    // Establish supplier lock on 1st selection
    if (selectedBookingIds.length === 0) {
      setActiveSupplier(bookingSupplier);
    }

    setSelectedBookingIds([...selectedBookingIds, booking.id]);
  };

  // Select All Eligible (Approved bookings of the active or first eligible supplier)
  const handleSelectAllEligible = () => {
    // Find eligible approved bookings in current view
    const approvedInView = filteredBookings.filter((b) => normalizeStatus(b.status) === "Approved");
    if (approvedInView.length === 0) {
      toast.info("No Approved fabric bookings available to select in this view.");
      return;
    }

    // Determine target supplier: either activeSupplier or supplier of first approved item
    const targetSupplier = activeSupplier || approvedInView[0].supplierName;
    const sameSupplierApproved = approvedInView.filter((b) => b.supplierName === targetSupplier);

    const ids = sameSupplierApproved.map((b) => b.id);
    setSelectedBookingIds(ids);
    setActiveSupplier(targetSupplier);
    toast.success(`Selected ${ids.length} eligible Approved bookings for supplier "${targetSupplier}".`);
  };

  // Clear Selection
  const handleClearSelection = () => {
    setSelectedBookingIds([]);
    setActiveSupplier(null);
  };

  // Create Proforma Invoice Action
  const handleCreatePI = () => {
    if (selectedBookingIds.length === 0) {
      toast.error("Please select at least one Approved Fabric Booking to create a Proforma Invoice.");
      return;
    }

    // Validate that all are approved and belong to the same supplier
    const selectedBookings = bookings.filter((b) => selectedBookingIds.includes(b.id));
    const nonApproved = selectedBookings.find((b) => normalizeStatus(b.status) !== "Approved");
    if (nonApproved) {
      toast.error(`Booking ${nonApproved.bookingNo} is not Approved. Only Approved bookings can be used for PI creation.`);
      return;
    }

    const firstSupplier = selectedBookings[0].supplierName;
    const mixed = selectedBookings.find((b) => b.supplierName !== firstSupplier);
    if (mixed) {
      toast.error("Selected bookings belong to different suppliers. PI creation requires the same supplier.");
      return;
    }

    // Navigate to PI Entry form with selected booking collection
    if (selectedBookings.length === 1) {
      navigate({
        to: "/mm-proforma-invoice-create",
        search: {
          source: "fabric",
          item: "Fabric",
          bookingId: selectedBookings[0].id,
          bookingNo: selectedBookings[0].bookingNo,
        },
      });
    } else {
      navigate({
        to: "/mm-proforma-invoice-create",
        search: {
          source: "fabric",
          item: "Fabric",
          bookingIds: selectedBookings.map((b) => b.id).join(","),
          bookingNos: selectedBookings.map((b) => b.bookingNo).join(","),
        },
      });
    }
  };

  const getFabricUom = (b: MMFabricBooking): string => {
    const lineUnit = b.lines?.find((l) => l.unit)?.unit || b.items?.find((i) => i.unit)?.unit;
    return lineUnit || "Kg";
  };

  // Helpers
  const getStyleSummary = (b: MMFabricBooking): string => {
    const styles = new Set<string>();
    if (b.items) b.items.forEach((it) => it.styleNo && styles.add(it.styleNo));
    if (b.lines) b.lines.forEach((l) => l.styleNo && styles.add(l.styleNo));
    const arr = Array.from(styles);
    if (arr.length === 0) return "—";
    if (arr.length === 1) return arr[0];
    return `${arr[0]} (+${arr.length - 1})`;
  };

  const getJobSummary = (b: MMFabricBooking): string => {
    return b.ourRef || b.lines?.[0]?.jobId || b.items?.[0]?.orderNo || b.bookingNo.split("/")[0] || "—";
  };

  const getBookingValue = (b: MMFabricBooking): number => {
    return b.totalBookedAmount || b.totalAmount || 0;
  };

  const getBudgetValue = (b: MMFabricBooking): number => {
    return b.totalPreCostAmount && b.totalPreCostAmount > 0
      ? b.totalPreCostAmount
      : b.lines?.reduce((acc, l) => acc + (l.budgetValue || 0), 0) || getBookingValue(b);
  };

  // Selected totals
  const selectedTotals = useMemo(() => {
    const list = bookings.filter((b) => selectedBookingIds.includes(b.id));
    const totalVal = list.reduce((acc, b) => acc + getBookingValue(b), 0);
    const totalQty = list.reduce((acc, b) => acc + (b.totalBookedQty || 0), 0);
    return { count: list.length, value: totalVal, qty: totalQty };
  }, [bookings, selectedBookingIds]);

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-fabric-booking-register"
      title="Fabric Booking Register"
      subtitle="Central register of all saved Fabric Bookings with approval statuses, same-supplier multi-selection, and Proforma Invoice (PI) creation"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Booking Information" },
        { label: "Fabric Booking Register" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          {/* Create PI Action */}
          <button
            type="button"
            onClick={handleCreatePI}
            disabled={selectedBookingIds.length === 0}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
              selectedBookingIds.length > 0
                ? "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-teal-600/30 ring-2 ring-teal-500/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Create Proforma Invoice</span>
            {selectedBookingIds.length > 0 && (
              <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[11px]">
                {selectedBookingIds.length}
              </span>
            )}
          </button>

          <Link
            to="/mm-fabric-booking"
            search={{ tab: "create" }}
            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            New Fabric Booking
          </Link>
        </div>
      }
    >
      <div className="space-y-4 p-4 max-w-[1600px] mx-auto">
        {/* Selection Notification Banner */}
        {selectedBookingIds.length > 0 && (
          <div className="bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                {selectedTotals.count}
              </div>
              <div className="text-xs">
                <p className="font-bold text-teal-900 dark:text-teal-200">
                  {selectedTotals.count} Approved Booking{selectedTotals.count > 1 ? "s" : ""} Selected for PI Creation
                </p>
                <p className="text-teal-700 dark:text-teal-400">
                  Supplier: <span className="font-bold">{activeSupplier}</span> | Total Value:{" "}
                  <span className="font-mono font-bold">${selectedTotals.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> | Total Qty:{" "}
                  <span className="font-mono">{selectedTotals.qty.toLocaleString()} Kg</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearSelection}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200"
              >
                Clear Selection
              </button>
              <button
                type="button"
                onClick={handleCreatePI}
                className="px-3 py-1 rounded-md text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5" />
                Proceed to PI Entry
              </button>
            </div>
          </div>
        )}

        {/* Status Tabs and Quick Controls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
            {(["All", "Pending", "Approved", "Rejected", "Returned"] as StatusFilter[]).map((tab) => {
              const count = tabCounts[tab];
              const isSelected = statusFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
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
            })}
          </div>

          {/* Selection Helper Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllEligible}
              className="px-2.5 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-700 dark:text-teal-300 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Select All Eligible
            </button>
            {selectedBookingIds.length > 0 && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>

        {/* Detailed Search & Filters Row */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
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
              placeholder="e.g. FB-2026-001"
              value={bookingNoFilter}
              onChange={(e) => setBookingNoFilter(e.target.value)}
              className="w-full px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 block text-[11px] mb-1">Job ID / Our Ref</label>
            <input
              type="text"
              placeholder="e.g. JOB-2026-0001"
              value={jobIdFilter}
              onChange={(e) => setJobIdFilter(e.target.value)}
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
            <label className="text-slate-400 block text-[11px] mb-1">Style</label>
            <input
              type="text"
              placeholder="e.g. HM-KT-8841"
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="w-full px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
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
              className="w-full px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
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
                  <th className="py-3 px-3 text-center w-10">Select</th>
                  <th className="py-3 px-3">Booking No.</th>
                  <th className="py-3 px-3">Booking Date</th>
                  <th className="py-3 px-3">Job ID</th>
                  <th className="py-3 px-3">Style</th>
                  <th className="py-3 px-3">Supplier</th>
                  <th className="py-3 px-3 text-right">Booking Qty</th>
                  <th className="py-3 px-3 text-right">Booking Value</th>
                  <th className="py-3 px-3 text-right">Budget Value</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Submitted By</th>
                  <th className="py-3 px-3 text-center sticky right-0 bg-slate-50 dark:bg-slate-800 shadow-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-slate-400">
                      <Scissors className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-slate-600 dark:text-slate-400">No fabric bookings found</p>
                      <p className="text-[11px] text-slate-400">Try adjusting your filters or search keywords.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const norm = normalizeStatus(b.status);
                    const isApproved = norm === "Approved";
                    const isSelected = selectedBookingIds.includes(b.id);
                    const bookingVal = getBookingValue(b);
                    const budgetVal = getBudgetValue(b);
                    const jobSummary = getJobSummary(b);
                    const styleSummary = getStyleSummary(b);
                    const itemsCount = b.lines?.length || b.items?.length || 1;

                    return (
                      <tr
                        key={b.id}
                        className={`transition-colors ${
                          isSelected
                            ? "bg-teal-50/60 dark:bg-teal-950/40"
                            : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!isApproved}
                            onChange={() => handleToggleBookingSelection(b)}
                            title={
                              isApproved
                                ? "Select this Approved booking for PI creation"
                                : `Cannot select: Booking status is "${b.status}". Only Approved bookings are eligible for PI creation.`
                            }
                            className={`w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 transition-colors ${
                              !isApproved ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                            }`}
                          />
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-teal-700 dark:text-teal-400 whitespace-nowrap">
                          <Link
                            to="/mm-fabric-booking"
                            search={{ bookingId: b.id }}
                            className="hover:underline"
                          >
                            {b.bookingNo}
                          </Link>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {b.bookingDate || "—"}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] font-medium whitespace-nowrap">
                          {jobSummary}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-medium" title={styleSummary}>
                          {styleSummary}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap max-w-[180px] truncate" title={b.supplierName}>
                          {b.supplierName || "—"}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-medium">
                          {(b.totalBookedQty || 0).toLocaleString()} {getFabricUom(b)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-bold text-slate-900 dark:text-white">
                          ${bookingVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono text-slate-600 dark:text-slate-400">
                          ${budgetVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                          <Link
                            to="/mm-fabric-booking-approval-details"
                            search={{ id: b.id }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition-colors shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Link>
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
    </MarketingMerchandisingLayout>
  );
}
