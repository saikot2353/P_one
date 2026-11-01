import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMAccessoriesBooking,
  BookingStatus,
} from "../lib/marketing-merchandising-data";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Package,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-accessories-booking-approval")({
  head: () => ({
    meta: [
      { title: "Accessories Booking Approval — CriptonHRIS" },
      {
        name: "description",
        content: "Dedicated approval register for Accessories Bookings submitted for management review and authorization.",
      },
    ],
  }),
  component: MMAccessoriesBookingApprovalPage,
});

type ApprovalTab = "Pending" | "Approved" | "Rejected" | "Returned" | "All";

function MMAccessoriesBookingApprovalPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<MMAccessoriesBooking[]>([]);
  const [activeTab, setActiveTab] = useState<ApprovalTab>("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");

  const loadData = () => {
    const accList = MMRepository.getAccessoriesBookings();
    const manualList = MMRepository.getManualBookings();
    const combined = [...accList];
    manualList.forEach((mb) => {
      if (!combined.some((b) => b.id === mb.id || b.bookingNo === mb.bookingNo)) {
        combined.push(mb);
      }
    });
    setBookings(combined);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Normalize status for filtering
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
      Pending: pending,
      Approved: approved,
      Rejected: rejected,
      Returned: returned,
      All: bookings.length,
    };
  }, [bookings]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const norm = normalizeStatus(b.status);
      if (activeTab !== "All" && norm !== activeTab) {
        return false;
      }
      if (supplierFilter !== "All" && b.supplierName !== supplierFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNo = b.bookingNo.toLowerCase().includes(q);
        const matchSupplier = b.supplierName?.toLowerCase().includes(q);
        const matchJob = (b.ourRef || b.lines?.[0]?.ourRef || "").toLowerCase().includes(q);
        const matchStyle = (b.lines?.[0]?.style || (b.items?.[0] as any)?.styleNo || "").toLowerCase().includes(q);
        if (!matchNo && !matchSupplier && !matchJob && !matchStyle) {
          return false;
        }
      }
      return true;
    });
  }, [bookings, activeTab, supplierFilter, searchQuery]);

  // Helper to extract Style summary
  const getStyleSummary = (b: MMAccessoriesBooking): string => {
    const styles = new Set<string>();
    if (b.lines) {
      b.lines.forEach((l) => {
        if (l.style) styles.add(l.style);
      });
    }
    if (b.items) {
      b.items.forEach((it) => {
        if ((it as any).styleNo) styles.add((it as any).styleNo);
        if ((it as any).style) styles.add((it as any).style);
      });
    }
    const arr = Array.from(styles);
    if (arr.length === 0) return "—";
    if (arr.length === 1) return arr[0];
    return `${arr[0]} (+${arr.length - 1} more)`;
  };

  // Helper to extract Job ID summary
  const getJobSummary = (b: MMAccessoriesBooking): string => {
    if (b.ourRef) return b.ourRef;
    if (b.lines?.[0]?.ourRef) return b.lines[0].ourRef;
    return b.bookingNo.split("/")[0] || "—";
  };

  // Helper to get booking quantity
  const getBookingQty = (b: MMAccessoriesBooking): number => {
    if (b.lines && b.lines.length > 0) {
      const sum = b.lines.reduce((acc, l) => {
        if (l.sizeWiseDetails && l.sizeWiseDetails.length > 0) {
          return acc + l.sizeWiseDetails.reduce((sAcc, s) => sAcc + (s.bookQty || 0), 0);
        }
        return acc + (l.requiredQty || 0);
      }, 0);
      if (sum > 0) return sum;
    }
    if (b.items && b.items.length > 0) {
      const sum = b.items.reduce((acc, it) => acc + (it.bookedQty || 0), 0);
      if (sum > 0) return sum;
    }
    return b.totalBookedQty || 0;
  };

  // Helper to compute pre cost value linked to pre-cost items without duplication
  const getPreCostValue = (b: MMAccessoriesBooking): number => {
    if (b.lines && b.lines.length > 0) {
      const distinctBudgetItems = new Map<string, number>();
      b.lines.forEach((l, idx) => {
        const itemKey = l.estimationItemId || l.accessoryItem || `line-${idx}`;
        if (!distinctBudgetItems.has(itemKey)) {
          distinctBudgetItems.set(itemKey, l.budgetValue ?? l.bookAmt ?? 0);
        }
      });
      const linesBudget = Array.from(distinctBudgetItems.values()).reduce((sum, v) => sum + v, 0);
      if (linesBudget > 0) return linesBudget;
    }
    if (b.items && b.items.length > 0) {
      const distinctBudgetItems = new Map<string, number>();
      b.items.forEach((it, idx) => {
        const itemKey = it.preCostItemId || it.estimationItemId || `item-${idx}`;
        if (!distinctBudgetItems.has(itemKey)) {
          distinctBudgetItems.set(itemKey, it.preCostAmount ?? it.totalAmount ?? 0);
        }
      });
      const itemsBudget = Array.from(distinctBudgetItems.values()).reduce((sum, v) => sum + v, 0);
      if (itemsBudget > 0) return itemsBudget;
    }
    if (b.totalPreCostAmount && b.totalPreCostAmount > 0) return b.totalPreCostAmount;
    return b.totalBookedAmount || 0;
  };

  // Helper to get booking value
  const getBookingValue = (b: MMAccessoriesBooking): number => {
    if (b.totalBookedAmount && b.totalBookedAmount > 0) return b.totalBookedAmount;
    if (b.lines && b.lines.length > 0) {
      return b.lines.reduce((acc, l) => acc + (l.bookAmt || 0), 0);
    }
    return 0;
  };

  // Render status badge
  const renderStatusBadge = (status?: string) => {
    const norm = normalizeStatus(status);
    switch (norm) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
            Pending Approval
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Rejected
          </span>
        );
      case "Returned":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800">
            <RotateCcw className="w-3.5 h-3.5 text-purple-500" />
            Returned
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            Draft
          </span>
        );
    }
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-accessories-booking-approval"
      title="Accessories Booking Approval"
      subtitle="Dedicated authorization register for Accessories Bookings submitted for review, validation, and approval"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Booking Information" },
        { label: "Accessories Booking Approval" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/mm-accessories-booking-register"
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Package className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Accessories Booking Register
          </Link>
        </div>
      }
    >
      <div className="space-y-4 p-4 max-w-[1600px] mx-auto">
        {/* Top Filter and Search Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
            {(["Pending", "Approved", "Rejected", "Returned", "All"] as ApprovalTab[]).map((tab) => {
              const count = tabCounts[tab];
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
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

          {/* Search and Supplier Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Booking No, Job, Style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-teal-500"
              >
                <option value="All">All Suppliers</option>
                {suppliers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Approval Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Booking No.</th>
                  <th className="py-3 px-3">Booking Date</th>
                  <th className="py-3 px-3">Job ID</th>
                  <th className="py-3 px-3">Style</th>
                  <th className="py-3 px-3 text-right">Booking Qty</th>
                  <th className="py-3 px-3">Supplier</th>
                  <th className="py-3 px-3 text-right">Booking Value</th>
                  <th className="py-3 px-3 text-right">Pre Cost Value</th>
                  <th className="py-3 px-3 text-right">Variance</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Submitted By</th>
                  <th className="py-3 px-3">Submitted Date</th>
                  <th className="py-3 px-3 text-center sticky right-0 bg-slate-50 dark:bg-slate-800 shadow-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-12 text-center text-slate-400">
                      <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-slate-600 dark:text-slate-400">No accessories bookings found</p>
                      <p className="text-[11px] text-slate-400">
                        {activeTab === "Pending"
                          ? "There are currently no accessories bookings awaiting approval in this queue."
                          : `No accessories bookings match the current filter (${activeTab}).`}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const bookingQty = getBookingQty(b);
                    const bookingVal = getBookingValue(b);
                    const preCostVal = getPreCostValue(b);
                    const variance = preCostVal - bookingVal; // Positive = Saving, Negative = Overrun
                    const isSaving = variance >= 0;
                    const jobSummary = getJobSummary(b);
                    const styleSummary = getStyleSummary(b);

                    const isManual = b.bookType === "Block Booking" || b.bookingNo.startsWith("MB-") || !!MMRepository.getManualBookingById(b.id);

                    return (
                      <tr
                        key={b.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-semibold text-teal-700 dark:text-teal-400 whitespace-nowrap">
                          <Link
                            to={isManual ? "/mm-manual-booking" : "/mm-accessories-booking"}
                            search={{ bookingId: b.id }}
                            className="hover:underline flex items-center gap-1"
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
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-medium">
                          {bookingQty.toLocaleString()} {b.bookingUnit || "Pcs"}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap max-w-[180px] truncate" title={b.supplierName}>
                          {b.supplierName || "—"}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-bold text-slate-900 dark:text-white">
                          ${bookingVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono text-slate-600 dark:text-slate-400">
                          ${preCostVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-semibold">
                          <span
                            className={`inline-flex items-center gap-0.5 ${
                              isSaving ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {isSaving ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                            {isSaving ? "+" : ""}${variance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {renderStatusBadge(b.status)}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {b.submittedBy || b.createdBy || "Tanvir Ahmed"}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                          {b.submittedDate ? b.submittedDate.split("T")[0] : b.createdDate || b.bookingDate || "—"}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap sticky right-0 bg-white dark:bg-slate-900 shadow-sm">
                          <Link
                            to="/mm-accessories-booking-approval-details"
                            search={{ id: b.id, type: isManual ? "manual" : undefined } as any}
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
