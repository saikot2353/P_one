import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMFabricBooking,
  MMAccessoriesBooking,
} from "../lib/marketing-merchandising-data";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Filter,
  Scissors,
  Package,
  Layers,
  FileText,
  Percent,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-booking-approval-queue")({
  head: () => ({
    meta: [
      { title: "Booking Approval Queue — CriptonHRIS" },
      {
        name: "description",
        content: "Unified approval queue for Fabric & Accessories bookings, saving target exceptions, and above-budget variance reviews.",
      },
    ],
  }),
  component: MMBookingApprovalQueuePage,
});

interface UnifiedBookingRow {
  id: string;
  type: "Fabric" | "Accessories";
  bookingNo: string;
  supplierName: string;
  orderStyle: string;
  bookedAmount: number;
  preCostAmount: number;
  savingAmount: number;
  savingPct: number;
  status: string;
  hasOverrun: boolean;
  hasTargetMiss: boolean;
  exceptionReason?: string;
  rawRef: MMFabricBooking | MMAccessoriesBooking;
}

function MMBookingApprovalQueuePage() {
  const [fabricBookings, setFabricBookings] = useState<MMFabricBooking[]>([]);
  const [accBookings, setAccBookings] = useState<MMAccessoriesBooking[]>([]);
  const [policy, setPolicy] = useState(MMRepository.getPolicy());
  const [filterType, setFilterType] = useState<"All" | "Fabric" | "Accessories">("All");
  const [filterExceptionsOnly, setFilterExceptionsOnly] = useState(false);

  // Reject modal
  const [rejectingItem, setRejectingItem] = useState<UnifiedBookingRow | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const refreshData = () => {
    setFabricBookings(MMRepository.getFabricBookings());
    setAccBookings(MMRepository.getAccessoriesBookings());
    setPolicy(MMRepository.getPolicy());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const unifiedList = useMemo<UnifiedBookingRow[]>(() => {
    const list: UnifiedBookingRow[] = [];

    // Fabric lines
    fabricBookings.forEach((fb) => {
      const isOver = fb.totalBookedAmount > fb.totalPreCostAmount;
      const isMiss = fb.overallSavingPct < policy.savingTargetPercentage;
      list.push({
        id: fb.id,
        type: "Fabric",
        bookingNo: fb.bookingNo,
        supplierName: fb.supplierName,
        orderStyle: `${fb.items[0]?.orderNo || "ORD"} (${fb.items[0]?.styleNo || "HM"})`,
        bookedAmount: fb.totalBookedAmount,
        preCostAmount: fb.totalPreCostAmount,
        savingAmount: fb.totalSavingAmount,
        savingPct: fb.overallSavingPct,
        status: fb.status,
        hasOverrun: isOver,
        hasTargetMiss: isMiss,
        exceptionReason: fb.items[0]?.exceptionReason || fb.notes,
        rawRef: fb,
      });
    });

    // Accessories lines
    accBookings.forEach((ab) => {
      const isOver = ab.totalBookedAmount > ab.totalPreCostAmount;
      const isMiss = ab.overallSavingPct < policy.savingTargetPercentage;
      list.push({
        id: ab.id,
        type: "Accessories",
        bookingNo: ab.bookingNo,
        supplierName: ab.supplierName,
        orderStyle: `${ab.items[0]?.orderNo || "ORD"} (${ab.items[0]?.styleNo || "ZR"})`,
        bookedAmount: ab.totalBookedAmount,
        preCostAmount: ab.totalPreCostAmount,
        savingAmount: ab.totalSavingAmount,
        savingPct: ab.overallSavingPct,
        status: ab.status,
        hasOverrun: isOver,
        hasTargetMiss: isMiss,
        exceptionReason: ab.items[0]?.exceptionReason || ab.notes,
        rawRef: ab,
      });
    });

    return list;
  }, [fabricBookings, accBookings, policy]);

  const filteredList = useMemo(() => {
    return unifiedList.filter((item) => {
      const matchType = filterType === "All" || item.type === filterType;
      const matchExceptions = !filterExceptionsOnly || item.hasOverrun || item.hasTargetMiss;
      return matchType && matchExceptions;
    });
  }, [unifiedList, filterType, filterExceptionsOnly]);

  const handleApprove = (row: UnifiedBookingRow) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 19);
    if (row.type === "Fabric") {
      const updated: MMFabricBooking = {
        ...(row.rawRef as MMFabricBooking),
        status: "Approved",
        approvedBy: "Rashidul Islam (Head of Merchandising)",
        approvalDate: now,
      };
      MMRepository.saveFabricBooking(updated);
    } else {
      const updated: MMAccessoriesBooking = {
        ...(row.rawRef as MMAccessoriesBooking),
        status: "Approved",
        approvedBy: "Rashidul Islam (Head of Merchandising)",
        approvalDate: now,
      };
      MMRepository.saveAccessoriesBooking(updated);
    }

    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: now,
      entityType: row.type === "Fabric" ? "FabricBooking" : "AccessoriesBooking",
      entityId: row.bookingNo,
      action: "Approve",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Approved ${row.type} Booking ${row.bookingNo} (${row.savingPct.toFixed(2)}% saving).`,
    });

    refreshData();
    toast.success(`${row.type} Booking ${row.bookingNo} approved successfully!`);
  };

  const handleReject = () => {
    if (!rejectingItem || !rejectionReason.trim()) {
      toast.error("Please enter a mandatory rejection reason.");
      return;
    }
    const now = new Date().toISOString().replace("T", " ").substring(0, 19);

    if (rejectingItem.type === "Fabric") {
      const updated: MMFabricBooking = {
        ...(rejectingItem.rawRef as MMFabricBooking),
        status: "Rejected",
        rejectionReason: rejectionReason.trim(),
      };
      MMRepository.saveFabricBooking(updated);
    } else {
      const updated: MMAccessoriesBooking = {
        ...(rejectingItem.rawRef as MMAccessoriesBooking),
        status: "Rejected",
        rejectionReason: rejectionReason.trim(),
      };
      MMRepository.saveAccessoriesBooking(updated);
    }

    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: now,
      entityType: rejectingItem.type === "Fabric" ? "FabricBooking" : "AccessoriesBooking",
      entityId: rejectingItem.bookingNo,
      action: "Reject",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Rejected ${rejectingItem.type} Booking ${rejectingItem.bookingNo}. Reason: ${rejectionReason.trim()}`,
    });

    setRejectingItem(null);
    setRejectionReason("");
    refreshData();
    toast.error(`Booking ${rejectingItem.bookingNo} marked as Rejected.`);
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-booking-approval-queue"
      breadcrumbs={[{ label: "Booking Approval Queue" }]}
      title="Booking Approval & Exception Management Queue"
      subtitle="Unified governance queue for Fabric and Accessories bookings, price overruns, and saving exceptions"
    >
      <div className="space-y-6">
        {/* Exception Policy Banner */}
        <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Performance Target vs Budget Overrun:</strong> The {policy.savingTargetPercentage}% saving target
              is a performance benchmark, not a hard cap. Bookings below target require justification. Bookings exceeding
              the Pre-Cost baseline require special management clearance before PI creation.
            </span>
          </div>
          <span className="font-mono font-bold text-amber-700 dark:text-amber-300 text-[11px] shrink-0">
            Target: {policy.savingTargetPercentage}%
          </span>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === "All" ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              All Bookings ({unifiedList.length})
            </button>
            <button
              onClick={() => setFilterType("Fabric")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                filterType === "Fabric" ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Scissors className="w-3.5 h-3.5" /> Fabric ({fabricBookings.length})
            </button>
            <button
              onClick={() => setFilterType("Accessories")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                filterType === "Accessories"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Package className="w-3.5 h-3.5" /> Accessories ({accBookings.length})
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={filterExceptionsOnly}
              onChange={(e) => setFilterExceptionsOnly(e.target.checked)}
              className="rounded text-teal-600"
            />
            <span>Show Only Exceptions & Overruns</span>
          </label>
        </div>

        {/* Unified Queue Table */}
        <div className="rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b font-semibold">
                <tr>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Booking No</th>
                  <th className="py-3 px-3">Supplier Name</th>
                  <th className="py-3 px-3">Order Ref</th>
                  <th className="py-3 px-3">Booked Value ($)</th>
                  <th className="py-3 px-3">Pre-Cost Baseline</th>
                  <th className="py-3 px-3">Saving / Variance</th>
                  <th className="py-3 px-3">Exception Tag</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredList.map((row) => (
                  <tr key={`${row.type}-${row.id}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.type === "Fabric"
                            ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {row.type === "Fabric" ? <Scissors className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">{row.bookingNo}</td>
                    <td className="py-3 px-3 font-semibold">{row.supplierName}</td>
                    <td className="py-3 px-3 font-mono">{row.orderStyle}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      ${row.bookedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">
                      ${row.preCostAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-mono font-bold ${row.savingAmount >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {row.savingAmount >= 0 ? `+$${row.savingAmount.toFixed(2)}` : `-$${Math.abs(row.savingAmount).toFixed(2)}`}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono">({row.savingPct.toFixed(2)}%)</span>
                    </td>
                    <td className="py-3 px-3">
                      {row.hasOverrun && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 block mb-1">
                          ⚠ Price Overrun
                        </span>
                      )}
                      {row.hasTargetMiss && !row.hasOverrun && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 block">
                          Target Miss (&lt; {policy.savingTargetPercentage}%)
                        </span>
                      )}
                      {!row.hasOverrun && !row.hasTargetMiss && (
                        <span className="text-[10px] text-emerald-600 font-bold">✓ Target Met</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          row.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : row.status === "Pending Approval"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {row.status === "Approved" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {row.status === "Pending Approval" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(row)}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-300"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setRejectingItem(row);
                              setRejectionReason("");
                            }}
                            className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold border border-rose-300"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── REJECTION MODAL ──────────────────────────────────────────────── */}
        {rejectingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-600">
                <XCircle className="w-5 h-5" />
                <span>Reject {rejectingItem.type} Booking ({rejectingItem.bookingNo})</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Please enter the formal rejection reason. The merchandiser will be notified to renegotiate rates.
              </p>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Unit rate exceeds pre-cost baseline without acceptable commercial justification..."
                className="w-full text-xs p-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setRejectingItem(null)}
                  className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-1.5 rounded text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
