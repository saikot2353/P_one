import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMProformaInvoice,
  MMBookingApprovalHistoryItem,
  PIStatus,
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
  FileCheck,
  DollarSign,
  FileText,
  AlertCircle,
  User,
  History,
  Check,
  X,
  Printer,
  Edit,
  ExternalLink,
  Info,
  Tag,
  Package,
  Scissors,
  CheckSquare,
} from "lucide-react";
import { toast } from "sonner";

interface SearchParams {
  id?: string;
  piNo?: string;
  from?: "register" | "approval";
}

export const Route = createFileRoute("/mm-pi-approval-details")({
  head: () => ({
    meta: [
      { title: "PI Details & Verification — Marketing & Merchandising | CriptonHRIS" },
      {
        name: "description",
        content: "Dedicated Proforma Invoice (PI) verification and approval details view with booking consolidation, item lines, financial summary, and workflow history.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    id: typeof search.id === "string" ? search.id : (search.piNo as string) || undefined,
    piNo: typeof search.piNo === "string" ? search.piNo : undefined,
    from: search.from === "approval" ? "approval" : "register",
  }),
  component: MMPIApprovalDetailsPage,
});

export default function MMPIApprovalDetailsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const targetId = (search.id || search.piNo || "").trim();

  const [pi, setPi] = useState<MMProformaInvoice | null>(() => {
    if (typeof window === "undefined" || !targetId) return null;
    const list = MMRepository.getPIs();
    return (
      list.find(
        (p) =>
          p.id === targetId ||
          p.piNo === targetId ||
          decodeURIComponent(p.id) === targetId ||
          decodeURIComponent(p.piNo) === targetId
      ) || null
    );
  });

  // Modal dialog states for actions
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  const [approveComment, setApproveComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [returnComment, setReturnComment] = useState("");
  const [approverName, setApproverName] = useState("Authorized Merchandising Approver");

  const loadPI = () => {
    if (!targetId) {
      setPi(null);
      return;
    }
    const list = MMRepository.getPIs();
    const found =
      list.find(
        (p) =>
          p.id === targetId ||
          p.piNo === targetId ||
          decodeURIComponent(p.id) === targetId ||
          decodeURIComponent(p.piNo) === targetId
      ) || null;
    setPi(found);
  };

  useEffect(() => {
    loadPI();
  }, [targetId]);

  // Back destination
  const backDestination = search.from === "approval" ? "/mm-pi-verification-approval" : "/mm-pi";
  const backLabel = search.from === "approval" ? "Back to PI Verification Approval" : "Back to PI Register";

  // Calculations
  const calculations = useMemo(() => {
    if (!pi) return { itemsTotal: 0, chargesTotal: 0, grandTotalUsd: 0, grandTotalBdt: 0, totalQty: 0 };

    const itemsTotal = pi.items?.reduce((sum, it) => sum + (Number(it.totalAmount) || 0), 0) || 0;
    const chargesTotal =
      pi.charges?.reduce((sum, ch) => sum + (Number(ch.amountUsd) || 0), 0) || Number(pi.additionalCharges) || 0;
    const grandTotalUsd = itemsTotal + chargesTotal;

    const bdtRate = pi.bdtRate || (pi.conversionRate > 1 ? pi.conversionRate : 121.5);
    const grandTotalBdt = pi.totalPiValueBdt || grandTotalUsd * bdtRate;

    const totalQty = pi.items?.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0) || 0;

    return { itemsTotal, chargesTotal, grandTotalUsd, grandTotalBdt, totalQty };
  }, [pi]);

  // Action handlers
  const handleApproveConfirm = () => {
    if (!pi) return;
    const success = MMRepository.approvePI(pi.id, approverName, approveComment.trim() || undefined);
    if (success) {
      toast.success(`PI ${pi.piNo} has been successfully Approved!`, {
        description: `Verified and authorized by ${approverName}.`,
      });
      setIsApproveOpen(false);
      setApproveComment("");
      loadPI();
    } else {
      toast.error("Failed to approve PI record.");
    }
  };

  const handleRejectConfirm = () => {
    if (!pi) return;
    if (!rejectReason.trim()) {
      toast.error("Rejection reason is mandatory.", {
        description: "Please specify why this PI is being rejected.",
      });
      return;
    }
    const success = MMRepository.rejectPI(pi.id, approverName, rejectReason.trim());
    if (success) {
      toast.error(`PI ${pi.piNo} has been Rejected.`, {
        description: `Reason recorded: ${rejectReason.trim()}`,
      });
      setIsRejectOpen(false);
      setRejectReason("");
      loadPI();
    } else {
      toast.error("Failed to reject PI record.");
    }
  };

  const handleReturnConfirm = () => {
    if (!pi) return;
    if (!returnComment.trim()) {
      toast.error("Correction instructions are mandatory.", {
        description: "Please specify what needs to be revised or corrected by the merchandiser.",
      });
      return;
    }
    const success = MMRepository.returnPI(pi.id, approverName, returnComment.trim());
    if (success) {
      toast.warning(`PI ${pi.piNo} Returned for Correction.`, {
        description: `Comments sent to merchandiser: ${returnComment.trim()}`,
      });
      setIsReturnOpen(false);
      setReturnComment("");
      loadPI();
    } else {
      toast.error("Failed to return PI record.");
    }
  };

  // Missing or Invalid PI Error State
  if (!pi) {
    return (
      <MarketingMerchandisingLayout
        activePath={backDestination}
        breadcrumbs={[
          { label: "Marketing & Merchandising", to: "/mm-dashboard" },
          { label: "PI / Proforma Invoice", to: "/mm-pi" },
          { label: "PI Record Not Found" },
        ]}
        title="PI Record Not Found"
        subtitle="The requested Proforma Invoice record could not be loaded or does not exist."
      >
        <div className="max-w-2xl mx-auto my-12 bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Proforma Invoice Not Found</h2>
          <p className="text-sm text-slate-600 mb-4">
            We could not locate any Proforma Invoice matching reference{" "}
            <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono font-semibold">
              {targetId || "Unknown"}
            </code>
            . The record may have been removed or you may have followed an outdated link.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/mm-pi"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FileCheck className="w-4 h-4 text-slate-500" />
              <span>Go to PI Register</span>
            </Link>
            <Link
              to="/mm-pi-verification-approval"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Go to Approval Register</span>
            </Link>
          </div>
        </div>
      </MarketingMerchandisingLayout>
    );
  }

  const isPending =
    pi.status?.toLowerCase().includes("pending") || pi.status?.toLowerCase().includes("submit");
  const isApproved =
    pi.status?.toLowerCase().includes("approve") || pi.status?.toLowerCase().includes("pass");
  const isRejected = pi.status?.toLowerCase().includes("reject");
  const isReturned = pi.status?.toLowerCase().includes("return");

  return (
    <MarketingMerchandisingLayout
      activePath={backDestination}
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "PI / Proforma Invoice", to: "/mm-pi" },
        { label: `PI Details — ${pi.piNo}` },
      ]}
      title={`Proforma Invoice Details — ${pi.piNo}`}
      subtitle={`Comprehensive verification view for PI ${pi.piNo} (${pi.supplierName}) with booking consolidation and financial breakdown.`}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to={backDestination}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>{backLabel}</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Summary</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Top Header Review Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
                <FileCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900 font-mono tracking-tight">
                    {pi.piNo}
                  </h1>
                  {pi.entryNo && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                      {pi.entryNo}
                    </span>
                  )}
                  {/* Status Badge */}
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      Pending Approval
                    </span>
                  )}
                  {isApproved && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Approved
                    </span>
                  )}
                  {isRejected && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Rejected
                    </span>
                  )}
                  {isReturned && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                      <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
                      Returned for Correction
                    </span>
                  )}
                  {pi.status === "Draft" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>
                    Supplier: <strong className="text-slate-700">{pi.supplierName}</strong>
                  </span>
                  <span>•</span>
                  <span>PI Date: <strong className="text-slate-700">{pi.piDate}</strong></span>
                  <span>•</span>
                  <span>Created By: <strong className="text-slate-700">{pi.createdBy || pi.merchant}</strong></span>
                </p>
              </div>
            </div>

            {/* Financial Highlights */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Total PI Value ({pi.currency || "USD"})
                </span>
                <span className="text-lg font-bold font-mono text-slate-900">
                  {pi.currency === "USD" ? "$" : "৳"}
                  {calculations.grandTotalUsd.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              {pi.currency === "USD" && (
                <div className="border-l border-slate-200 pl-4">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    BDT Value (৳)
                  </span>
                  <span className="text-lg font-bold font-mono text-slate-800">
                    ৳
                    {calculations.grandTotalBdt.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Toolbar for Verification */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              {isApproved && (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Approved by <strong>{pi.approvedBy || "Management"}</strong> on{" "}
                    <strong>{pi.approvalDate || "Verified Date"}</strong>
                  </span>
                </div>
              )}
              {isRejected && (
                <div className="flex items-center gap-2 text-rose-700 bg-rose-50 px-3 py-1.5 rounded-md border border-rose-200">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>
                    Rejected: <strong>{pi.rejectionReason || "No rejection reason specified"}</strong>
                  </span>
                </div>
              )}
              {isReturned && (
                <div className="flex items-center gap-2 text-orange-700 bg-orange-50 px-3 py-1.5 rounded-md border border-orange-200">
                  <RotateCcw className="w-4 h-4 text-orange-600" />
                  <span>
                    Returned for Correction: <strong>{pi.returnReason || "Requires revision"}</strong>
                  </span>
                </div>
              )}
              {(isPending || pi.status === "Draft") && (
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Review all attached booking lines and financial totals before authorizing.</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Return for edit if returned */}
              {isReturned && (
                <Link
                  to="/mm-proforma-invoice-create"
                  search={{ piId: pi.id } as any}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-md transition-colors shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit in PI Entry Form</span>
                </Link>
              )}

              {/* Approval Action Buttons */}
              <button
                type="button"
                onClick={() => setIsReturnOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-md transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
                <span>Return for Correction</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRejectOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors shadow-sm"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Reject</span>
              </button>

              <button
                type="button"
                onClick={() => setIsApproveOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve PI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section A: PI Header Information */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                A
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                Section A: PI Main Information
              </h2>
            </div>
            <span className="text-xs text-slate-500">Core ERP Header Specification</span>
          </div>

          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                PI Number
              </span>
              <span className="font-mono font-bold text-indigo-700 text-sm">
                {pi.piNo}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Entry Number
              </span>
              <span className="font-mono font-medium text-slate-800">
                {pi.entryNo || "—"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                PI Date
              </span>
              <span className="font-medium text-slate-800">{pi.piDate || "—"}</span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Entry Date
              </span>
              <span className="font-medium text-slate-800">{pi.entryDate || pi.createdDate || "—"}</span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Supplier (Master Data)
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-900">{pi.supplierName}</span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Business Unit
              </span>
              <span className="font-medium text-slate-800">{pi.businessUnit || "—"}</span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Currency & Rates
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 font-mono">
                <span className="font-bold text-slate-900">{pi.currency || "USD"}</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600">BDT @ {pi.bdtRate || 121.5}</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600">USD @ {pi.usdRate || 1.0}</span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Payment Terms
              </span>
              <span className="font-medium text-slate-800">{pi.paymentTerms || "—"}</span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Delivery Terms
              </span>
              <span className="font-medium text-slate-800">{pi.deliveryTerms || "—"}</span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Delivery Mode
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                {pi.deliveryMode || "Road"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Delivery Place
              </span>
              <span className="font-medium text-slate-800">{pi.deliveryPlace || "Factory Savar"}</span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                LC Reference No / Doc No
              </span>
              <span className="font-mono text-slate-800">
                {pi.lcReferenceNo || pi.docNo || "—"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                BBLC Reference No
              </span>
              <span className="font-mono text-slate-800">
                {pi.bblcReferenceNo || "Pending Opening"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Priority Level
              </span>
              <span className="font-semibold text-slate-800">
                {pi.priorityLevel || "Normal"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Created By & Date
              </span>
              <span className="text-slate-700">
                {pi.createdBy || pi.merchant} ({pi.createdDate})
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Submitted By & Date
              </span>
              <span className="text-slate-700">
                {pi.submittedBy || pi.createdBy || "—"} ({pi.submittedDate || pi.createdDate || "—"})
              </span>
            </div>
          </div>

          {/* Notes & Comments Sub-section */}
          {pi.notes && (
            <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-700">PI Remarks / Notes: </span>
              <span className="text-slate-600">{pi.notes}</span>
            </div>
          )}
        </div>

        {/* Section B: Booking Information Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                B
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                Section B: Booking Information Table
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-700">
                {pi.allocatedBookings?.length || 0} Attached Bookings
              </span>
            </div>
            <span className="text-xs text-slate-500">Consolidated Booking Allocations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3.5">Booking Number</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Job ID / Order No</th>
                  <th className="py-2.5 px-3">Style No</th>
                  <th className="py-2.5 px-3">Buyer & Season</th>
                  <th className="py-2.5 px-3">Delivery Date</th>
                  <th className="py-2.5 px-3 text-right">Allocated Amount ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {!pi.allocatedBookings || pi.allocatedBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-slate-500 italic">
                      No external bookings attached. Direct Proforma Invoice.
                    </td>
                  </tr>
                ) : (
                  pi.allocatedBookings.map((b, idx) => (
                    <tr key={b.bookingId || idx} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3.5 font-mono font-bold text-indigo-600">
                        {b.bookingNo}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            b.bookingType === "Fabric"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-teal-50 text-teal-700 border border-teal-200"
                          }`}
                        >
                          {b.bookingType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                        {b.orderNo || "—"}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {b.styleNo || "—"}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {b.buyerName || "—"} {b.season ? `(${b.season})` : ""}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono">
                        {b.deliveryDate || "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        $
                        {Number(b.allocatedAmount || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section C: PI Details Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                C
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                Section C: PI Item Details (Specification & Rates)
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-700">
                {pi.items?.length || 0} Detail Lines
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Total Qty: <strong className="text-slate-800">{calculations.totalQty.toLocaleString("en-US")}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Line #</th>
                  <th className="py-2.5 px-3">Source Booking</th>
                  <th className="py-2.5 px-3.5">Item Description</th>
                  <th className="py-2.5 px-3.5">Specification</th>
                  <th className="py-2.5 px-2.5 text-center">Unit</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Unit Price ($)</th>
                  <th className="py-2.5 px-3.5 text-right">Amount ($)</th>
                  <th className="py-2.5 px-3.5 text-right">Amount (৳ BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {!pi.items || pi.items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-slate-500 italic">
                      No detail items found for this Proforma Invoice.
                    </td>
                  </tr>
                ) : (
                  pi.items.map((it, idx) => {
                    const bdtAmount =
                      it.amountBdt ||
                      it.totalAmount * (pi.bdtRate || (pi.conversionRate > 1 ? pi.conversionRate : 121.5));

                    return (
                      <tr key={it.piItemId || idx} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono text-indigo-600 font-semibold">
                          {it.sourceBookingNo || "Direct"}
                        </td>
                        <td className="py-2.5 px-3.5 font-semibold text-slate-800">
                          {it.itemDescription}
                          {it.fabricCode && (
                            <span className="block text-[10px] text-slate-400 font-mono">
                              Code: {it.fabricCode} {it.color ? `| Color: ${it.color}` : ""}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-600">{it.specification || "—"}</td>
                        <td className="py-2.5 px-2.5 text-center">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                            {it.unit || "Kg"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {Number(it.quantity || 0).toLocaleString("en-US")}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                          $
                          {Number(it.unitPrice || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 5,
                          })}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900">
                          $
                          {Number(it.totalAmount || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono text-slate-700">
                          ৳
                          {Number(bdtAmount || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section D: Financial Summary & Charges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Additional Charges Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                D1
              </span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Section D: Additional Charges & Freight
              </h3>
            </div>

            {pi.charges && pi.charges.length > 0 ? (
              <div className="space-y-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase">
                      <th className="py-1">Particulars</th>
                      <th className="py-1">Note</th>
                      <th className="py-1 text-right">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pi.charges.map((ch) => (
                      <tr key={ch.id}>
                        <td className="py-1.5 font-medium text-slate-800">{ch.particulars}</td>
                        <td className="py-1.5 text-slate-500">{ch.note}</td>
                        <td className="py-1.5 text-right font-mono font-semibold text-slate-800">
                          ${Number(ch.amountUsd || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-4 text-center italic">
                {pi.additionalCharges > 0
                  ? `Standard Additional Charges: $${Number(pi.additionalCharges).toFixed(2)}`
                  : "No additional charges applied to this Proforma Invoice."}
              </div>
            )}
          </div>

          {/* Grand Valuation Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                D2
              </span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Financial Valuation Engine
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal (Items Total):</span>
                <span className="font-mono font-semibold text-slate-800">
                  $
                  {calculations.itemsTotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Additional Charges:</span>
                <span className="font-mono font-semibold text-slate-800">
                  $
                  {calculations.chargesTotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Grand Total (USD):</span>
                <span className="font-mono font-bold text-indigo-700 text-base">
                  $
                  {calculations.grandTotalUsd.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Grand Total in Local Currency (BDT):</span>
                <span className="font-mono font-bold text-slate-900">
                  ৳
                  {calculations.grandTotalBdt.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section E: Approval & Audit History */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                E
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                Section E: Approval Workflow & Audit Trail
              </h2>
            </div>
            <span className="text-xs text-slate-500">Historical Log of Verification Actions</span>
          </div>

          <div className="p-4 sm:p-5">
            {!pi.approvalHistory || pi.approvalHistory.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No Approval History Recorded Yet</p>
                <p className="text-slate-400 mt-1">
                  Actions performed by management (Approve, Reject, Return) will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pi.approvalHistory.map((hist, idx) => (
                  <div
                    key={hist.id || idx}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs ${
                        hist.action === "Approved"
                          ? "bg-emerald-600"
                          : hist.action === "Rejected"
                          ? "bg-rose-600"
                          : hist.action === "Returned"
                          ? "bg-orange-600"
                          : "bg-indigo-600"
                      }`}
                    >
                      {hist.action === "Approved" ? (
                        <Check className="w-4 h-4" />
                      ) : hist.action === "Rejected" ? (
                        <X className="w-4 h-4" />
                      ) : hist.action === "Returned" ? (
                        <RotateCcw className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="font-bold text-slate-900">
                          {hist.action} Action
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {hist.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">
                        Performed by: <strong className="text-slate-800">{hist.performedBy}</strong>
                        {hist.previousStatus && hist.newStatus && (
                          <span className="ml-2 text-slate-500 font-mono text-[11px]">
                            ({hist.previousStatus} → {hist.newStatus})
                          </span>
                        )}
                      </p>
                      {hist.comment && (
                        <p className="mt-1.5 text-slate-700 bg-white p-2 rounded border border-slate-200">
                          "{hist.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* APPROVAL MODAL DIALOG */}
      {isApproveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-emerald-600 mb-3">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Confirm PI Approval</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              You are authorizing Proforma Invoice <strong className="text-slate-900 font-mono">{pi.piNo}</strong>{" "}
              from <strong className="text-slate-900">{pi.supplierName}</strong> for a total amount of{" "}
              <strong className="text-slate-900 font-mono font-bold">
                ${calculations.grandTotalUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </strong>
              . This will mark the PI as Approved and release it for LC opening.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Approver Name
                </label>
                <input
                  type="text"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Approval Comments (Optional)
                </label>
                <textarea
                  rows={3}
                  value={approveComment}
                  onChange={(e) => setApproveComment(e.target.value)}
                  placeholder="e.g. Verified against booking quantities and rates. Approved for commercial department."
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsApproveOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApproveConfirm}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-sm"
              >
                Authorize & Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL DIALOG */}
      {isRejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-rose-600 mb-3">
              <XCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Reject Proforma Invoice</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Rejecting PI <strong className="text-slate-900 font-mono">{pi.piNo}</strong> will mark it as Rejected in
              both the Register and Approval queues. Please provide a clear reason for the audit trail.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Reason for Rejection <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Mandatory: Specify why this PI cannot be authorized..."
                  className="w-full px-2.5 py-1.5 text-xs border border-rose-300 rounded-md focus:ring-1 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRejectOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RETURN FOR CORRECTION MODAL DIALOG */}
      {isReturnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-orange-600 mb-3">
              <RotateCcw className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Return for Correction</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Returning PI <strong className="text-slate-900 font-mono">{pi.piNo}</strong> will unlock it for the
              originating merchandiser to amend rates, quantities, or attachments.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Correction Instructions <span className="text-orange-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={returnComment}
                  onChange={(e) => setReturnComment(e.target.value)}
                  placeholder="Mandatory: Specify what items or rates need correction..."
                  className="w-full px-2.5 py-1.5 text-xs border border-orange-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-orange-50/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReturnOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturnConfirm}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors shadow-sm"
              >
                Return to Merchandiser
              </button>
            </div>
          </div>
        </div>
      )}
    </MarketingMerchandisingLayout>
  );
}
