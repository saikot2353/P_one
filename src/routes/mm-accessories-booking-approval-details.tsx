import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMAccessoriesBooking,
  MMBookingApprovalHistoryItem,
  MMAccessoriesEstimationRecord,
  MMPreCosting,
} from "../lib/marketing-merchandising-data";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Package,
  DollarSign,
  TrendingDown,
  TrendingUp,
  FileText,
  AlertCircle,
  User,
  History,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface SearchParams {
  id?: string;
  bookingNo?: string;
}

export const Route = createFileRoute("/mm-accessories-booking-approval-details")({
  head: () => ({
    meta: [
      { title: "Accessories Booking Details — Approval Review" },
      {
        name: "description",
        content: "Dedicated review and approval page for Accessories Booking details, budget comparison, and approval history.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    id: typeof search.id === "string" ? search.id : (search.bookingNo as string) || (search.id as string) || undefined,
    bookingNo: typeof search.bookingNo === "string" ? search.bookingNo : undefined,
  }),
  component: MMAccessoriesBookingApprovalDetailsPage,
});

function MMAccessoriesBookingApprovalDetailsPage() {
  const search = Route.useSearch();
  const rawId = search.id || search.bookingNo;
  const targetId = rawId ? decodeURIComponent(rawId).trim() : undefined;
  const navigate = useNavigate();

  const [booking, setBooking] = useState<MMAccessoriesBooking | null>(() => {
    if (typeof window === "undefined" || !targetId) return null;
    const list = MMRepository.getAccessoriesBookings();
    return (
      list.find(
        (b) =>
          b.id === rawId ||
          b.id === targetId ||
          b.bookingNo === rawId ||
          b.bookingNo === targetId ||
          decodeURIComponent(b.bookingNo || "") === targetId
      ) || null
    );
  });

  const [orders, setOrders] = useState(() => MMRepository.getOrders());
  const [estimations, setEstimations] = useState<MMAccessoriesEstimationRecord[]>(() => MMRepository.getAccessoriesEstimations());
  const [preCostings, setPreCostings] = useState<MMPreCosting[]>(() => MMRepository.getPreCostings());

  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  const [approveComment, setApproveComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [returnComment, setReturnComment] = useState("");
  const [approverName, setApproverName] = useState("Authorized Merchandising Approver");

  const loadBooking = () => {
    if (!targetId) {
      setBooking(null);
      return;
    }
    const list = MMRepository.getAccessoriesBookings();
    const found =
      list.find(
        (b) =>
          b.id === rawId ||
          b.id === targetId ||
          b.bookingNo === rawId ||
          b.bookingNo === targetId ||
          decodeURIComponent(b.bookingNo || "") === targetId
      ) || null;
    setBooking(found);
    setOrders(MMRepository.getOrders());
    setEstimations(MMRepository.getAccessoriesEstimations());
    setPreCostings(MMRepository.getPreCostings());
  };

  useEffect(() => {
    loadBooking();
  }, [rawId, targetId]);

  // Helper to map accessories booking item to pre-cost item and budget value
  const resolvePreCostItem = (
    jobId: string,
    styleNo: string,
    accItemName?: string,
    estimationId?: string,
    estimationItemId?: string,
    preCostItemId?: string
  ): { preCostItemId: string; preCostItemName: string; pciBudgetValue: number } => {
    let est = estimations.find((e) => e.id === estimationId);
    if (!est) {
      est = estimations.find(
        (e) => (e.jobNo === jobId || e.ourRef === jobId || e.ourRef === booking?.ourRef) && (e.style === styleNo || !styleNo)
      );
    }

    const estRow = est?.accessoriesRows?.find(
      (r) =>
        r.id === estimationItemId ||
        (accItemName && (r.itemName === accItemName || r.budgetItemName === accItemName))
    );

    let preCosting = preCostings.find(
      (pc) => (pc.jobNo === jobId || pc.orderNo === jobId || pc.jobNo === booking?.ourRef) && (pc.styleNo === styleNo || !styleNo)
    );
    if (!preCosting) {
      const ord = orders.find(
        (o) => o.jobNo === jobId || o.ourRef === jobId || o.orderNo === jobId || o.ourRef === booking?.ourRef
      );
      if (ord?.preCostId) {
        preCosting = preCostings.find((pc) => pc.preCostId === ord.preCostId);
      }
    }

    let pci = preCosting?.items?.find((it) => it.preCostItemId === preCostItemId);
    if (!pci && estRow?.budgetItemName) {
      pci = preCosting?.items?.find((it) => it.itemDescription === estRow?.budgetItemName);
    }
    if (!pci && estRow?.itemName) {
      pci = preCosting?.items?.find((it) => it.itemDescription === estRow?.itemName);
    }
    if (!pci && accItemName) {
      pci = preCosting?.items?.find((it) => it.itemDescription === accItemName);
    }

    let preCostItemName = "Pre-Cost Item Not Linked";
    let pciBudgetValue = 0;

    if (pci) {
      preCostItemName = pci.itemDescription;
      const order = orders.find(
        (o) => o.jobNo === jobId || o.ourRef === jobId || o.orderNo === jobId || o.ourRef === booking?.ourRef
      );
      const orderQty = order?.orderQuantity || preCosting?.orderQuantity || est?.quantity || 0;
      if (orderQty > 0 && pci.totalAmountPerDzn) {
        pciBudgetValue = Math.round(((orderQty / 12) * pci.totalAmountPerDzn) * 100) / 100;
      }
    } else if (estRow?.budgetItemName) {
      preCostItemName = estRow.budgetItemName;
    }

    if (pciBudgetValue === 0 && estRow) {
      if (estRow.amount) {
        pciBudgetValue = estRow.amount;
      } else if (estRow.marketQty && estRow.unitRate) {
        pciBudgetValue = Math.round(estRow.marketQty * estRow.unitRate * 100) / 100;
      }
    }

    return {
      preCostItemId: preCostItemId || (pci ? pci.preCostItemId : ""),
      preCostItemName,
      pciBudgetValue,
    };
  };

  // Helper to compute PO QTY for Section B summary row
  const getLinePoQty = (
    jobId: string,
    styleNo: string,
    allocs: { poNo?: string; poNumber?: string; gmtQty?: number }[]
  ): number => {
    const order = orders.find(
      (o) =>
        o.jobNo === jobId ||
        o.ourRef === jobId ||
        o.orderNo === jobId ||
        (o.styleNo === styleNo && (o.jobNo === booking?.ourRef || o.orderNo === booking?.ourRef))
    );

    if (allocs && allocs.length > 0) {
      const uniquePoNumbers = Array.from(
        new Set(allocs.map((a) => a.poNo || a.poNumber).filter(Boolean))
      );

      let totalQty = 0;
      for (const poNo of uniquePoNumbers) {
        let poQty = 0;
        const poRow = order?.poDetails?.find((p: any) => p.poNumber === poNo || p.po === poNo);
        if (poRow && typeof poRow.qty === "number" && poRow.qty > 0) {
          poQty = poRow.qty;
        } else if (poRow?.breakdown?.poQty && poRow.breakdown.poQty > 0) {
          poQty = poRow.breakdown.poQty;
        }

        if (!poQty && order?.poWiseBreakdown) {
          const bk = order.poWiseBreakdown.find((p: any) => p.poNumber === poNo || (p as any).poNo === poNo);
          if (bk && typeof bk.quantity === "number" && bk.quantity > 0) {
            poQty = bk.quantity;
          }
        }

        if (!poQty) {
          const matchAlloc = allocs.find((a) => (a.poNo || a.poNumber) === poNo);
          if (matchAlloc && typeof matchAlloc.gmtQty === "number" && matchAlloc.gmtQty > 0) {
            poQty = matchAlloc.gmtQty;
          }
        }

        totalQty += poQty;
      }

      if (totalQty > 0) return totalQty;
    }

    if (order?.orderQuantity && order.orderQuantity > 0) {
      return order.orderQuantity;
    }

    return 0;
  };

  if (!booking) {
    return (
      <MarketingMerchandisingLayout
        activePath="/mm-accessories-booking-approval"
        title="Accessories Booking Details"
        subtitle="Review booking details, budget variances, and workflow authorization"
        breadcrumbs={[
          { label: "Marketing & Merchandising", to: "/mm-dashboard" },
          { label: "Booking Information", to: "/mm-accessories-booking-approval" },
          { label: "Accessories Booking Approval", to: "/mm-accessories-booking-approval" },
          { label: "Booking Record Not Found" },
        ]}
      >
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto my-12 shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-800 dark:text-white mb-1">
            Booking record not found
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {targetId
              ? `The requested Accessories Booking record "${targetId}" does not exist or has been removed.`
              : "No Accessories Booking identifier was provided in the request."}
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link
              to="/mm-accessories-booking-approval"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Accessories Booking Approval
            </Link>
            <Link
              to="/mm-accessories-booking-register"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm transition-colors"
            >
              Accessories Booking Register
            </Link>
          </div>
        </div>
      </MarketingMerchandisingLayout>
    );
  }

  // Normalize status
  const currentStatus = booking.status || "Draft";
  const isPending =
    currentStatus.toLowerCase().includes("pending") ||
    currentStatus.toLowerCase().includes("submit");
  const isApproved = currentStatus.toLowerCase().includes("approve");
  const isRejected = currentStatus.toLowerCase().includes("reject");
  const isReturned = currentStatus.toLowerCase().includes("return");

  // Memoized consolidated comparison rows grouped by Job ID, Style, and Pre Cost Item
  const comparisonRows = useMemo(() => {
    if (!booking) return [];

    interface AggregatedItem {
      id: string;
      jobId: string;
      style: string;
      preCostItemName: string;
      accessoryItem: string;
      description: string;
      bookedQty: number;
      bookedUnit: string;
      bookedValue: number;
      preCostingValue: number;
    }

    const groups = new Map<string, AggregatedItem>();

    if (booking.items && booking.items.length > 0) {
      booking.items.forEach((it, idx) => {
        const jobId = (it as any).jobId || it.orderNo || booking.ourRef || "—";
        const style = (it as any).style || it.styleNo || "—";
        const accName = (it as any).accessoryName || it.itemDescription || (it as any).itemName || "Accessory Item";
        const desc = (it as any).description || it.specification || (it as any).itemDescription || "—";
        const unit = it.unit || "Pcs";
        const bookedQty = Number((it as any).bookQty ?? it.bookedQty ?? 0);
        const bookedRate = Number((it as any).rate ?? it.bookedRate ?? 0);
        const bookedVal = Number((it as any).total ?? it.totalAmount ?? (bookedQty * bookedRate));

        const { preCostItemName, pciBudgetValue } = resolvePreCostItem(
          jobId,
          style,
          accName,
          undefined,
          it.estimationItemId,
          it.preCostItemId
        );

        const groupKey = `${jobId}___${style}___${preCostItemName}`;
        if (!groups.has(groupKey)) {
          const defaultBudget = pciBudgetValue > 0 ? pciBudgetValue : Number((it as any).preCostAmount || bookedVal);
          groups.set(groupKey, {
            id: (it as any).id || it.bookingItemId || `grp-${idx}`,
            jobId,
            style,
            preCostItemName,
            accessoryItem: accName,
            description: desc,
            bookedQty,
            bookedUnit: unit,
            bookedValue: bookedVal,
            preCostingValue: defaultBudget,
          });
        } else {
          const existing = groups.get(groupKey)!;
          existing.bookedQty += bookedQty;
          existing.bookedValue += bookedVal;
        }
      });
    } else if (booking.lines && booking.lines.length > 0) {
      booking.lines.forEach((l, idx) => {
        const jobId = l.ourRef || booking.ourRef || "—";
        const style = l.style || "—";
        const accName = l.accessoryItem || "—";
        const desc = l.description || "—";
        const unit = l.unit || "Pcs";

        const { preCostItemName, pciBudgetValue } = resolvePreCostItem(
          jobId,
          style,
          accName,
          l.estimationId,
          l.estimationItemId
        );

        const groupKey = `${jobId}___${style}___${preCostItemName}`;

        if (l.sizeWiseDetails && l.sizeWiseDetails.length > 0) {
          l.sizeWiseDetails.forEach((sd) => {
            const sBookQty = Number(sd.bookQty || 0);
            const sBookVal = Number(sd.total ?? (sBookQty * (sd.rate || 0)));
            const sUnit = sd.unit || unit;

            if (!groups.has(groupKey)) {
              const defaultBudget = pciBudgetValue > 0 ? pciBudgetValue : Number(l.budgetValue || l.bookAmt || sBookVal);
              groups.set(groupKey, {
                id: sd.id || `line-${idx}`,
                jobId,
                style,
                preCostItemName,
                accessoryItem: accName,
                description: desc,
                bookedQty: sBookQty,
                bookedUnit: sUnit,
                bookedValue: sBookVal,
                preCostingValue: defaultBudget,
              });
            } else {
              const existing = groups.get(groupKey)!;
              existing.bookedQty += sBookQty;
              existing.bookedValue += sBookVal;
            }
          });
        } else {
          const bookedRate = Number(l.rate || 0);
          const bookedVal = Number(l.bookAmt || 0);
          const bookedQty = bookedRate > 0 ? Math.round(bookedVal / bookedRate) : Number(l.requiredQty || 0);

          if (!groups.has(groupKey)) {
            const defaultBudget = pciBudgetValue > 0 ? pciBudgetValue : Number(l.budgetValue || l.bookAmt || 0);
            groups.set(groupKey, {
              id: l.id || `line-${idx}`,
              jobId,
              style,
              preCostItemName,
              accessoryItem: accName,
              description: desc,
              bookedQty,
              bookedUnit: unit,
              bookedValue: bookedVal,
              preCostingValue: defaultBudget,
            });
          } else {
            const existing = groups.get(groupKey)!;
            existing.bookedQty += bookedQty;
            existing.bookedValue += bookedVal;
          }
        }
      });
    }

    return Array.from(groups.values()).map((g) => {
      const bookedRate = g.bookedQty > 0 ? g.bookedValue / g.bookedQty : 0;
      const valueVariance = g.preCostingValue - g.bookedValue;
      let status = "Within Budget";
      if (valueVariance > 0.005) status = "Under Budget";
      else if (valueVariance < -0.005) status = "Over Budget";

      return {
        ...g,
        bookedRate,
        valueVariance,
        status,
      };
    });
  }, [booking, estimations, preCostings, orders]);

  const comparisonTotals = useMemo(() => {
    let preCostingValue = 0;
    let bookedQty = 0;
    let bookedValue = 0;

    comparisonRows.forEach((r) => {
      preCostingValue += r.preCostingValue;
      bookedQty += r.bookedQty;
      bookedValue += r.bookedValue;
    });

    const valueVariance = preCostingValue - bookedValue;
    let overallStatus = "Within Budget";
    if (valueVariance > 0.005) overallStatus = "Under Budget";
    else if (valueVariance < -0.005) overallStatus = "Over Budget";

    return {
      preCostingValue,
      bookedQty,
      bookedValue,
      valueVariance,
      overallStatus,
    };
  }, [comparisonRows]);

  // Approve action handler
  const handleApprove = () => {
    const success = MMRepository.approveAccessoriesBooking(
      booking.id,
      approverName,
      approveComment.trim() || undefined
    );
    if (success) {
      toast.success(`Accessories Booking ${booking.bookingNo} has been successfully Approved.`);
      setIsApproveOpen(false);
      setApproveComment("");
      loadBooking();
    } else {
      toast.error("Failed to approve Accessories Booking.");
    }
  };

  // Reject action handler
  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }
    const success = MMRepository.rejectAccessoriesBooking(booking.id, approverName, rejectReason);
    if (success) {
      toast.success(`Accessories Booking ${booking.bookingNo} has been Rejected.`);
      setIsRejectOpen(false);
      setRejectReason("");
      loadBooking();
    } else {
      toast.error("Failed to reject Accessories Booking.");
    }
  };

  // Return action handler
  const handleReturn = () => {
    if (!returnComment.trim()) {
      toast.error("Please explain what correction is required.");
      return;
    }
    const success = MMRepository.returnAccessoriesBooking(booking.id, approverName, returnComment);
    if (success) {
      toast.success(`Accessories Booking ${booking.bookingNo} has been Returned for correction.`);
      setIsReturnOpen(false);
      setReturnComment("");
      loadBooking();
    } else {
      toast.error("Failed to return Accessories Booking.");
    }
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-accessories-booking-approval"
      title={`Accessories Booking: ${booking.bookingNo}`}
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Booking Information", to: "/mm-accessories-booking-approval" },
        { label: "Accessories Booking Approval", to: "/mm-accessories-booking-approval" },
        { label: booking.bookingNo },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back();
              } else {
                navigate({ to: "/mm-accessories-booking-approval" });
              }
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          {/* Approval Buttons */}
          <button
            type="button"
            onClick={() => setIsReturnOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Return
          </button>

          <button
            type="button"
            onClick={() => setIsRejectOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>

          <button
            type="button"
            onClick={() => setIsApproveOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approve Booking
          </button>
        </div>
      }
    >
      <div className="space-y-6 p-4 max-w-[1600px] mx-auto">
        {/* Status Alert Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isApproved
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : isRejected
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                  : isReturned
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
              }`}
            >
              {isApproved && <CheckCircle2 className="w-5 h-5" />}
              {isRejected && <XCircle className="w-5 h-5" />}
              {isReturned && <RotateCcw className="w-5 h-5" />}
              {isPending && <Clock className="w-5 h-5 animate-pulse" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white">
                  Booking #{booking.bookingNo}
                </h1>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isApproved
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300"
                      : isRejected
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300"
                      : isReturned
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300"
                  }`}
                >
                  {currentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Supplier: <span className="font-semibold text-slate-700 dark:text-slate-300">{booking.supplierName}</span> |
                Submitted By: <span className="font-medium">{booking.submittedBy || booking.createdBy || "Tanvir Ahmed"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 self-end md:self-auto">
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Booking Value
              </span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                ${comparisonTotals.bookedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Pre-Cost Budget
              </span>
              <span className="text-base font-extrabold text-slate-700 dark:text-slate-300 font-mono">
                ${comparisonTotals.preCostingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Variance
              </span>
              <span
                className={`text-base font-extrabold font-mono inline-flex items-center gap-1 ${
                  comparisonTotals.valueVariance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {comparisonTotals.valueVariance >= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                {comparisonTotals.valueVariance >= 0 ? "+" : ""}${comparisonTotals.valueVariance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Section A — Accessories Booking Information */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
              Accessories Booking Information
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Booking Number</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                {booking.bookingNo}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Job ID</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {booking.ourRef || booking.lines?.[0]?.ourRef || "—"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Supplier Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {booking.supplierName || "—"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Booking Date</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {booking.bookingDate || "—"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Delivery Date</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {booking.deliveryDate || "—"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Delivery Mode</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {booking.deliveryMode || booking.delMode || "Road"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Delivery Place</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {booking.deliveryPlace || booking.delPlace || "Central Accessories Store"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Booking Unit</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {booking.bookingUnit || "Pcs / Gross"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Booking Type</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {booking.bookType || "Nominated Accessories Booking"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Payment Mode / Terms</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {booking.paymentTerms || booking.payMode || "TT 30 Days"}
              </span>
            </div>
            <div className="col-span-2 md:col-span-3">
              <span className="text-slate-400 block text-[11px]">Terms and Conditions</span>
              <span className="font-normal text-slate-600 dark:text-slate-400">
                {booking.termsAndConditions || "Standard OEKO-TEX certified trims specification and inspection warranty."}
              </span>
            </div>
            <div className="col-span-2 md:col-span-3">
              <span className="text-slate-400 block text-[11px]">Notes</span>
              <span className="font-normal text-slate-600 dark:text-slate-400">
                {booking.note || booking.notes || "Accessories booking submitted through Marketing & Merchandising engine."}
              </span>
            </div>
          </div>
        </div>

        {/* Section B — Style and PO Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
              Style & PO Summary
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3">Job ID</th>
                  <th className="py-2.5 px-3">Style</th>
                  <th className="py-2.5 px-3">Accessories Item</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Associated PO Details</th>
                  <th className="py-2.5 px-3 text-right">PO QTY</th>
                  <th className="py-2.5 px-3 text-right">Book Amount</th>
                  <th className="py-2.5 px-3 text-right">Pre Cost Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {booking.lines && booking.lines.length > 0 ? (
                  booking.lines.map((l, idx) => {
                    const lineJobId = l.ourRef || booking.ourRef || "—";
                    const lineStyle = l.style || "—";
                    const allocs = l.allocations || [];
                    const poQty = getLinePoQty(lineJobId, lineStyle, allocs);
                    const lineBookAmt = Number(l.bookAmt || 0);
                    const { pciBudgetValue } = resolvePreCostItem(
                      lineJobId,
                      lineStyle,
                      l.accessoryItem,
                      l.estimationId,
                      l.estimationItemId
                    );
                    const linePreCost = pciBudgetValue > 0 ? pciBudgetValue : Number(l.budgetValue || lineBookAmt);

                    return (
                      <tr key={l.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-mono font-medium">{lineJobId}</td>
                        <td className="py-2 px-3 font-semibold">{lineStyle}</td>
                        <td className="py-2 px-3 font-bold text-teal-700 dark:text-teal-400">{l.accessoryItem}</td>
                        <td className="py-2 px-3 max-w-xs truncate">{l.description}</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                          {allocs.length > 0
                            ? allocs.map((a) => a.poNo).filter(Boolean).join(", ")
                            : "All style POs"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-medium">
                          {poQty > 0 ? `${poQty.toLocaleString()} Pcs` : "—"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold">
                          ${lineBookAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                          ${linePreCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })
                ) : booking.items && booking.items.length > 0 ? (
                  booking.items.map((it, idx) => {
                    const itemJobId = (it as any).jobId || it.orderNo || booking.ourRef || "—";
                    const itemStyle = (it as any).style || it.styleNo || "—";
                    const poQty = getLinePoQty(itemJobId, itemStyle, it.poNumber ? [{ poNo: it.poNumber }] : []);
                    const itemBookAmt = Number((it as any).total ?? it.totalAmount ?? ((it.bookedQty || 0) * (it.bookedRate || 0)));
                    const { pciBudgetValue } = resolvePreCostItem(
                      itemJobId,
                      itemStyle,
                      it.itemDescription,
                      undefined,
                      it.estimationItemId,
                      it.preCostItemId
                    );
                    const itemPreCost = pciBudgetValue > 0 ? pciBudgetValue : Number((it as any).preCostAmount || itemBookAmt);

                    return (
                      <tr key={it.bookingItemId || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-mono font-medium">{itemJobId}</td>
                        <td className="py-2 px-3 font-semibold">{itemStyle}</td>
                        <td className="py-2 px-3 font-bold text-teal-700 dark:text-teal-400">
                          {it.itemDescription || "Trims Item"}
                        </td>
                        <td className="py-2 px-3 max-w-xs truncate">{it.specification || "—"}</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{it.poNumber || "Standard PO"}</td>
                        <td className="py-2 px-3 text-right font-mono font-medium">
                          {poQty > 0 ? `${poQty.toLocaleString()} Pcs` : "—"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold">
                          ${itemBookAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                          ${itemPreCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="py-2 px-3 font-mono font-medium">{booking.ourRef || "—"}</td>
                    <td className="py-2 px-3 font-semibold">{booking.items?.[0]?.styleNo || "—"}</td>
                    <td className="py-2 px-3 font-bold text-teal-700 dark:text-teal-400">
                      {booking.items?.[0]?.itemDescription || "Trims Item"}
                    </td>
                    <td className="py-2 px-3 max-w-xs truncate">{booking.items?.[0]?.specification || "—"}</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">PO-1001, PO-1002</td>
                    <td className="py-2 px-3 text-right font-mono font-medium">—</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">${comparisonTotals.bookedValue.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600 dark:text-slate-400">${comparisonTotals.preCostingValue.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section C — Consolidated Item-wise Budget vs. Booking Comparison */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                Item-wise Budget vs. Booking Comparison
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              Consolidated side-by-side financial comparison
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Job ID</th>
                  <th className="py-2.5 px-3">Style</th>
                  <th className="py-2.5 px-3">Pre Cost Item</th>
                  <th className="py-2.5 px-3">Accessories Item</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right bg-slate-100/60 dark:bg-slate-850">Pre Costing Value</th>
                  <th className="py-2.5 px-3 text-right bg-teal-50/60 dark:bg-teal-950/30">Total Booked Qty</th>
                  <th className="py-2.5 px-3 text-center bg-teal-50/60 dark:bg-teal-950/30">Booked Unit</th>
                  <th className="py-2.5 px-3 text-right bg-teal-50/60 dark:bg-teal-950/30">Booked Rate</th>
                  <th className="py-2.5 px-3 text-right bg-teal-50/60 dark:bg-teal-950/30 font-bold">Booked Value</th>
                  <th className="py-2.5 px-3 text-right font-bold">Value Variance</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {comparisonRows.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-slate-400">
                      No accessories booking items found for budget comparison.
                    </td>
                  </tr>
                ) : (
                  comparisonRows.map((r) => {
                    const isSaving = r.valueVariance >= 0;
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-2 px-3 font-mono font-medium">{r.jobId}</td>
                        <td className="py-2 px-3 font-semibold max-w-[120px] truncate" title={r.style}>
                          {r.style}
                        </td>
                        <td className="py-2 px-3 font-bold text-teal-700 dark:text-teal-400 whitespace-nowrap">
                          {r.preCostItemName}
                        </td>
                        <td className="py-2 px-3 font-medium whitespace-nowrap">
                          {r.accessoryItem}
                        </td>
                        <td className="py-2 px-3 max-w-[200px] truncate" title={r.description}>
                          {r.description}
                        </td>

                        {/* Pre Costing Value */}
                        <td className="py-2 px-3 text-right font-mono font-semibold bg-slate-50/40 dark:bg-slate-850/40">
                          ${r.preCostingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Booked Columns */}
                        <td className="py-2 px-3 text-right font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50/30 dark:bg-teal-950/20">
                          {r.bookedQty.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-[11px] bg-teal-50/30 dark:bg-teal-950/20">
                          {r.bookedUnit}
                        </td>
                        <td className="py-2 px-3 text-right font-mono bg-teal-50/30 dark:bg-teal-950/20">
                          ${r.bookedRate.toFixed(3)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-white bg-teal-50/30 dark:bg-teal-950/20">
                          ${r.bookedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Value Variance */}
                        <td className="py-2 px-3 text-right font-mono font-bold whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-0.5 ${
                              Math.abs(r.valueVariance) <= 0.005
                                ? "text-slate-500"
                                : isSaving
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {Math.abs(r.valueVariance) <= 0.005
                              ? "$0.00"
                              : `${isSaving ? "+" : ""}$${r.valueVariance.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          {r.status === "Under Budget" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300">
                              Under Budget
                            </span>
                          ) : r.status === "Over Budget" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300">
                              Over Budget
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300">
                              Within Budget
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Grand Total Row */}
              {comparisonRows.length > 0 && (
                <tfoot>
                  <tr className="bg-slate-100 dark:bg-slate-800 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                    <td colSpan={5} className="py-2.5 px-3 uppercase tracking-wider text-xs">
                      Grand Total
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-teal-800 dark:text-teal-300">
                      ${comparisonTotals.preCostingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-teal-800 dark:text-teal-300">
                      {comparisonTotals.bookedQty.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center text-[11px]">Units</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">—</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-900 dark:text-white font-extrabold">
                      ${comparisonTotals.bookedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-extrabold whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          Math.abs(comparisonTotals.valueVariance) <= 0.005
                            ? "text-slate-500"
                            : comparisonTotals.valueVariance >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {Math.abs(comparisonTotals.valueVariance) <= 0.005
                          ? "$0.00"
                          : `${comparisonTotals.valueVariance >= 0 ? "+" : ""}$${comparisonTotals.valueVariance.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {comparisonTotals.overallStatus === "Under Budget" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300">
                          Under Budget
                        </span>
                      ) : comparisonTotals.overallStatus === "Over Budget" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300">
                          Over Budget
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100 border border-slate-400">
                          Within Budget
                        </span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* Section D — Workflow & Approval History */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <History className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
              Workflow & Approval History
            </h2>
          </div>
          <div className="space-y-3">
            {booking.approvalHistory && booking.approvalHistory.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {booking.approvalHistory.map((h, idx) => {
                  let formattedTime = "—";
                  if (h.timestamp) {
                    try {
                      const d = new Date(h.timestamp);
                      formattedTime = isNaN(d.getTime()) ? h.timestamp : d.toLocaleString();
                    } catch {
                      formattedTime = h.timestamp;
                    }
                  }

                  return (
                    <div key={h.id || idx} className="py-3 flex items-start gap-4">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                          h.action === "Approved"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : h.action === "Rejected"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : h.action === "Returned"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-white">
                            Action: {h.action} ({h.previousStatus} → {h.newStatus})
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {formattedTime}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                          Performed By: <span className="font-semibold">{h.performedBy}</span>
                        </p>
                        {h.comment && (
                          <p className="text-slate-700 dark:text-slate-200 mt-1 p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] italic">
                            &ldquo;{h.comment}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-3">
                <p>
                  Submitted By: <span className="font-semibold text-slate-700 dark:text-slate-300">{booking.submittedBy || booking.createdBy || "Tanvir Ahmed"}</span> on{" "}
                  {booking.submittedDate ? new Date(booking.submittedDate).toLocaleDateString() : booking.bookingDate || "—"}.
                </p>
                {booking.approvalDate && (
                  <p className="mt-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    Approved By: {booking.approvedBy || "Authorized Approver"} on {new Date(booking.approvalDate).toLocaleDateString()}.
                  </p>
                )}
                {booking.rejectionReason && (
                  <p className="mt-1 text-rose-600 dark:text-rose-400 font-medium">
                    Rejection Reason: &ldquo;{booking.rejectionReason}&rdquo;
                  </p>
                )}
                {booking.returnReason && (
                  <p className="mt-1 text-purple-600 dark:text-purple-400 font-medium">
                    Return Note: &ldquo;{booking.returnReason}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approve Confirmation Dialog */}
      {isApproveOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Approve Accessories Booking</h3>
                <p className="text-xs text-slate-500">Booking #{booking.bookingNo}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Are you sure you want to approve this Accessories Booking? Once approved, the booking will become eligible for Proforma Invoice (PI) allocation.
            </p>
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Approver Identity
              </label>
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Approval Comments <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={approveComment}
                onChange={(e) => setApproveComment(e.target.value)}
                placeholder="Add optional approval remarks or conditions..."
                rows={3}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsApproveOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reject Accessories Booking</h3>
                <p className="text-xs text-slate-500">Booking #{booking.bookingNo}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Please enter the specific reason for rejecting this booking. A reason is required:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason (e.g., Unacceptable price variance above pre-costing target)..."
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 mb-4 outline-none focus:border-rose-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRejectOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {isReturnOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Return Booking for Correction</h3>
                <p className="text-xs text-slate-500">Booking #{booking.bookingNo}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Please specify the required corrections. The booking owner will be notified to revise and resubmit:
            </p>
            <textarea
              rows={3}
              value={returnComment}
              onChange={(e) => setReturnComment(e.target.value)}
              placeholder="Explain required changes (e.g., Please update button size allocation and adjust supplier pricing)..."
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 mb-4 outline-none focus:border-purple-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReturnOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturn}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
              >
                Return Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </MarketingMerchandisingLayout>
  );
}
