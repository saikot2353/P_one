import { useState, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Printer,
  AlertTriangle,
  Building2,
  Package,
  Layers,
  Send,
  Eye,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  StockWriteOff,
  StockWriteOffItem,
  WriteOffStatus,
  getStoredStockWriteOffs,
  saveStockWriteOff,
} from "@/lib/inventory-stock-management-data";
import { getItemTrackingMode } from "@/lib/item-tracking-utils";
import {
  LocationAllocationModal,
  BatchAllocationModal,
  ItemTrackingCell,
} from "@/components/inventory/ItemBatchLocationModals";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-stock-writeoff-approval")({
  validateSearch: (search: Record<string, unknown>): { writeOffId?: string } => ({
    writeOffId: search.writeOffId as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Review Stock Write-Off Proposal — Inventory ERP" },
      {
        name: "description",
        content: "Review technical damage justification, evaluate loss valuation, and approve or reject write-off.",
      },
    ],
  }),
  component: StockWriteOffApprovalPage,
});

function StockWriteOffApprovalPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const writeOffId = searchParams.writeOffId;

  const writeOffs = useMemo(() => getStoredStockWriteOffs(), []);
  const activeWriteOff = useMemo(() => {
    return writeOffs.find((w) => w.id === writeOffId || w.writeOffId === writeOffId) || writeOffs[0] || null;
  }, [writeOffs, writeOffId]);

  // Decision State
  const [decision, setDecision] = useState<"Approve" | "Reject" | "Return">("Approve");
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [approverName] = useState<string>("Head of Operations & Finance (Executive Committee)");
  const [approvalDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [approvalRemarks, setApprovalRemarks] = useState<string>("");

  // Tracking Inspection Modal State
  const [trackingModalItem, setTrackingModalItem] = useState<StockWriteOffItem | null>(null);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Validation
  const decisionErrors = useMemo(() => {
    const errs: string[] = [];
    if (!activeWriteOff) {
      errs.push("No write-off proposal selected for review.");
      return errs;
    }
    if ((decision === "Reject" || decision === "Return") && !approvalRemarks.trim()) {
      errs.push("Approver justification remarks are required when Rejecting or Returning a proposal.");
    }
    return errs;
  }, [activeWriteOff, decision, approvalRemarks]);

  const handleConfirmDecision = () => {
    if (decisionErrors.length > 0 || !activeWriteOff) {
      toast.error(decisionErrors[0] || "Validation failed");
      return;
    }

    let nextStatus: WriteOffStatus = "Approved";
    if (decision === "Reject") nextStatus = "Rejected";
    if (decision === "Return") nextStatus = "Returned";

    const updated: StockWriteOff = {
      ...activeWriteOff,
      status: nextStatus,
      approvedBy: approverName,
      approvalDate,
      approvalRemarks: approvalRemarks.trim() ? approvalRemarks : "Approved as per scrap inspection report.",
    };

    saveStockWriteOff(updated);

    if (decision === "Approve") {
      toast.success(
        `Write-off proposal ${activeWriteOff.writeOffId} APPROVED! Stock ledger written off permanently.`
      );
    } else if (decision === "Reject") {
      toast.error(`Write-off proposal ${activeWriteOff.writeOffId} REJECTED.`);
    } else {
      toast.info(`Write-off proposal ${activeWriteOff.writeOffId} returned to initiator for revision.`);
    }

    navigate({ to: "/inv-stock-writeoff-approval-list" });
  };

  // Preview Note State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const previewReportData: StandardReportData | null = useMemo(() => {
    if (!activeWriteOff) return null;
    return {
      companyName: activeWriteOff.company,
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "SCRAP & MATERIAL WRITE-OFF PROPOSAL",
      reportNumber: activeWriteOff.writeOffId,
      reportDate: activeWriteOff.date,
      statusBadge: activeWriteOff.status,
      metaFields: [
        { label: "Write-Off ID", value: activeWriteOff.writeOffId },
        { label: "Proposal Date", value: activeWriteOff.date },
        { label: "Company", value: activeWriteOff.company },
        { label: "Store", value: activeWriteOff.warehouseStore },
        { label: "Category", value: activeWriteOff.category },
        { label: "Disposal Method", value: activeWriteOff.disposalMethod },
        { label: "Initiator", value: activeWriteOff.initiatedBy },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "DESCRIPTION",
        "UOM",
        "WRITE-OFF QTY",
        "UNIT COST (৳)",
        "LOSS VALUE (৳)",
        "DAMAGE SPECIFICATION",
      ],
      tableRows: activeWriteOff.items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        String(it.writeOffQty),
        String(it.unitCost),
        String(it.totalLossValue.toLocaleString()),
        it.damageReasonDetails,
      ]),
      summaryCards: [
        { label: "Total Items", value: String(activeWriteOff.totalItems) },
        { label: "Total Quantity", value: `${activeWriteOff.totalWriteOffQty} units` },
        { label: "Financial Loss Impact", value: `৳ ${activeWriteOff.totalLossValue.toLocaleString()}` },
      ],
      notes: [
        `Write-off category: ${activeWriteOff.category}. Proposed disposal method: ${activeWriteOff.disposalMethod}.`,
        "Approved stock deduction only takes effect upon final committee authorization.",
      ],
      signatures: [
        { title: "Store Officer", name: activeWriteOff.initiatedBy, date: activeWriteOff.date },
        { title: "Reviewing Executive", name: approverName, date: approvalDate },
      ],
    };
  }, [activeWriteOff, approverName, approvalDate]);

  if (!activeWriteOff) {
    return (
      <div className="min-h-screen flex bg-slate-100/70 text-slate-800">
        <InventorySidebar />
        <main className="flex-1 p-8 text-center">
          <p>No write-off proposal found.</p>
          <Link to="/inv-stock-writeoff-approval-list" className="text-indigo-600 underline mt-2 inline-block">
            Back to Approval List
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100/70 text-slate-800">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <Link
                to="/inv-stock-writeoff-approval-list"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back to Approvals"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    Review Write-Off Proposal
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {activeWriteOff.writeOffId}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Status: {activeWriteOff.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Authorize scrap disposal, examine financial impact, and commit inventory write-downs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewReportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="size-3.5 text-slate-600" />
                Preview Note
              </button>
            </div>
          </div>

          {/* Validation Notice */}
          {decisionErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">Cannot Proceed:</h4>
                <ul className="text-xs text-rose-700 mt-1 list-disc list-inside space-y-0.5 font-medium">
                  {decisionErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section 1: Proposal Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Building2 className="size-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Proposal Information
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Submitted by {activeWriteOff.initiatedBy}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Write-Off ID</div>
                <div className="font-mono font-bold text-rose-700 text-sm mt-0.5">{activeWriteOff.writeOffId}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Proposal Date</div>
                <div className="font-medium text-slate-800 mt-0.5">{activeWriteOff.date}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Company & Warehouse</div>
                <div className="font-semibold text-slate-800 mt-0.5">{activeWriteOff.company}</div>
                <div className="text-[10.5px] text-slate-400">{activeWriteOff.warehouseStore}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Category</div>
                <div className="font-bold text-rose-700 mt-0.5">{activeWriteOff.category}</div>
              </div>

              {activeWriteOff.remarks && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-2 lg:col-span-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Initiator Remarks</div>
                  <div className="text-slate-700 mt-0.5">{activeWriteOff.remarks}</div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="size-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Proposed Write-Off Line Items
                </h3>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[460px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200 whitespace-nowrap">
                    <tr>
                      <th className="py-3 px-3 text-center w-10">SL</th>
                      <th className="py-3 px-3 min-w-[200px]">Item Description</th>
                      <th className="py-3 px-3 min-w-[140px]">Specification</th>
                      <th className="py-3 px-3 min-w-[130px]">Brand / Origin</th>
                      <th className="py-3 px-2 text-center w-14">UOM</th>
                      <th className="py-3 px-3 text-right w-24">Available Stock</th>
                      <th className="py-3 px-3 text-right w-28 text-rose-700 font-bold">Write-Off Qty</th>
                      <th className="py-3 px-3 text-right w-24">Unit Cost (৳)</th>
                      <th className="py-3 px-3 text-right w-28 text-rose-700 font-bold">Loss Impact (৳)</th>
                      <th className="py-3 px-3 text-center w-28">Tracking (B/L)</th>
                      <th className="py-3 px-3 min-w-[200px]">Damage Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {activeWriteOff.items.map((row, idx) => {
                      const trackingMode = getItemTrackingMode(row.itemCode);
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                          <td className="py-3 px-3 text-center font-mono text-slate-400 text-[10px]">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-800">{row.itemName}</div>
                            <div className="font-mono text-[10.5px] text-blue-600">{row.itemCode}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-xs">
                            {row.specification || "—"}
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-xs">
                            {row.brand || row.origin
                              ? [row.brand, row.origin].filter(Boolean).join(" / ")
                              : "—"}
                          </td>
                          <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-600">
                            {row.uom}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-slate-600">
                            {row.availableStock.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-rose-700">
                            {row.writeOffQty.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-slate-600">
                            {row.unitCost.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-rose-700">
                            ৳ {row.totalLossValue.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <ItemTrackingCell
                              trackingMode={trackingMode}
                              batchCount={row.batchAllocations?.length || 0}
                              locationCount={row.locationAllocations?.length || 0}
                              onOpenBatch={() => {
                                setTrackingModalItem(row);
                                setBatchModalOpen(true);
                              }}
                              onOpenLocation={() => {
                                setTrackingModalItem(row);
                                setLocationModalOpen(true);
                              }}
                            />
                          </td>
                          <td className="py-3 px-3 text-slate-700 text-xs">
                            {row.damageReasonDetails}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Loss Valuation Summary
              </span>
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Total Items: </span>
                  <span className="font-bold text-slate-900 font-mono">{activeWriteOff.totalItems}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Total Units: </span>
                  <span className="font-bold text-rose-700 font-mono">{activeWriteOff.totalWriteOffQty} units</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Total Financial Loss: </span>
                  <span className="font-bold text-rose-700 font-mono">
                    ৳ {activeWriteOff.totalLossValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <Link
              to="/inv-stock-writeoff-approval-list"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to Approvals
            </Link>

            {activeWriteOff.status === "Submitted" ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDecision("Return");
                    setDecisionModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-3.5 text-amber-600" />
                  Return for Correction
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDecision("Reject");
                    setDecisionModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <XCircle className="size-3.5 text-rose-600" />
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDecision("Approve");
                    setDecisionModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="size-3.5" />
                  Approve Write-Off
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span>Decision already finalized ({activeWriteOff.status}) — Read-Only</span>
              </div>
            )}
          </div>
        </div>

        {/* Decision Modal */}
        {decisionModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      decision === "Approve"
                        ? "bg-emerald-50 text-emerald-600"
                        : decision === "Reject"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {decision === "Approve" ? (
                      <CheckCircle2 className="size-5" />
                    ) : decision === "Reject" ? (
                      <XCircle className="size-5" />
                    ) : (
                      <RotateCcw className="size-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800">
                      {decision === "Approve"
                        ? "Confirm Write-Off Approval"
                        : decision === "Reject"
                        ? "Reject Write-Off Proposal"
                        : "Return Proposal for Revision"}
                    </h3>
                    <p className="text-xs text-slate-500">Proposal ID: {activeWriteOff.writeOffId}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDecisionModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Company:</span>
                    <strong className="text-slate-800">{activeWriteOff.company}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Store:</span>
                    <strong className="text-slate-800">{activeWriteOff.warehouseStore}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Loss Impact:</span>
                    <strong className="text-rose-600 font-mono">৳ {activeWriteOff.totalLossValue.toLocaleString()}</strong>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Comments / Approval Remarks {(decision === "Reject" || decision === "Return") && "*"}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={
                      decision === "Approve"
                        ? "Enter optional approval notes or instructions..."
                        : "Please state specific reasons or required corrections (mandatory)..."
                    }
                    value={approvalRemarks}
                    onChange={(e) => setApprovalRemarks(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                  {(decision === "Reject" || decision === "Return") && !approvalRemarks.trim() && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">
                      * Comments are mandatory when rejecting or returning a proposal.
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDecisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDecision}
                  disabled={(decision === "Reject" || decision === "Return") && !approvalRemarks.trim()}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed ${
                    decision === "Approve"
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                      : decision === "Reject"
                      ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                      : "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
                  }`}
                >
                  <CheckCircle2 className="size-3.5" />
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Modals (Read-only view) */}
        {locationModalOpen && trackingModalItem && (
          <LocationAllocationModal
            isOpen={locationModalOpen}
            onClose={() => {
              setLocationModalOpen(false);
              setTrackingModalItem(null);
            }}
            itemCode={trackingModalItem.itemCode}
            itemName={trackingModalItem.itemName}
            uom={trackingModalItem.uom}
            transactionQty={trackingModalItem.writeOffQty}
            currentStore={activeWriteOff.warehouseStore}
            initialEntries={trackingModalItem.locationAllocations}
            onSave={() => {
              setLocationModalOpen(false);
              setTrackingModalItem(null);
            }}
          />
        )}

        {batchModalOpen && trackingModalItem && (
          <BatchAllocationModal
            isOpen={batchModalOpen}
            onClose={() => {
              setBatchModalOpen(false);
              setTrackingModalItem(null);
            }}
            itemCode={trackingModalItem.itemCode}
            itemName={trackingModalItem.itemName}
            uom={trackingModalItem.uom}
            transactionQty={trackingModalItem.writeOffQty}
            currentStore={activeWriteOff.warehouseStore}
            initialEntries={trackingModalItem.batchAllocations}
            onSave={() => {
              setBatchModalOpen(false);
              setTrackingModalItem(null);
            }}
          />
        )}

        {/* Modal */}
        {previewReportOpen && previewReportData && (
          <StandardPreviewReportModal
            isOpen={previewReportOpen}
            onClose={() => setPreviewReportOpen(false)}
            data={previewReportData}
          />
        )}
      </main>
    </div>
  );
}
