import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  RotateCcw,
  Printer,
  ChevronRight,
  ShieldCheck,
  History,
  Info,
  Calendar,
  Building2,
  Eye,
  Check,
  X,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  SupplierInvitationRecord,
  RevisionRecord,
  FinancialSummary,
} from "@/lib/supplier-portal/types";
import { calculateFinancialSummary } from "@/lib/supplier-portal/mock-data";
import { QuotationPdfModal } from "../QuotationPdfModal";

interface Props {
  invitation: SupplierInvitationRecord;
  onRequestRevision: (reason: string) => void;
  onSimulateDecision?: (
    decision: "Approved" | "Rejected",
    remarks?: string
  ) => void;
  onUnlockForEditing: () => void;
  onGoToStep: (step: number) => void;
}

export const Step8StatusAndHistory: React.FC<Props> = ({
  invitation,
  onRequestRevision,
  onSimulateDecision,
  onUnlockForEditing,
  onGoToStep,
}) => {
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionReasonInput, setRevisionReasonInput] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedHistoricalRecord, setSelectedHistoricalRecord] =
    useState<RevisionRecord | null>(null);

  const { currentQuotation, revisionHistory, csInfo, supplierMaster } =
    invitation;
  const status = currentQuotation.status;

  const financialSummary: FinancialSummary = calculateFinancialSummary(
    invitation.items,
    currentQuotation.itemQuotes,
    currentQuotation.overallQuote
  );

  const handleRequestRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionReasonInput.trim()) return;
    onRequestRevision(revisionReasonInput.trim());
    setShowRevisionModal(false);
    setRevisionReasonInput("");
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                Step 8
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Submission Status & Revision History
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Track your quotation's official status, manage formal revision
              requests, and review historical version audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Status Display Card */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${
          status === "Submitted"
            ? "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white border-emerald-300"
            : status === "Revision Requested"
            ? "bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border-amber-300"
            : status === "Revision Approved"
            ? "bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-white border-cyan-300"
            : status === "Revision Rejected"
            ? "bg-gradient-to-br from-red-500/10 via-red-500/5 to-white border-red-300"
            : "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-white border-blue-300"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                status === "Submitted"
                  ? "bg-emerald-600 text-white"
                  : status === "Revision Requested"
                  ? "bg-amber-500 text-white"
                  : status === "Revision Approved"
                  ? "bg-cyan-600 text-white"
                  : status === "Revision Rejected"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              {status === "Submitted" && <CheckCircle2 className="w-8 h-8" />}
              {status === "Revision Requested" && <Clock className="w-8 h-8" />}
              {status === "Revision Approved" && <Check className="w-8 h-8" />}
              {status === "Revision Rejected" && <X className="w-8 h-8" />}
              {status !== "Submitted" &&
                status !== "Revision Requested" &&
                status !== "Revision Approved" &&
                status !== "Revision Rejected" && <FileText className="w-8 h-8" />}
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-white/80 border border-slate-300 shadow-sm text-slate-700">
                  Version {currentQuotation.version}.0
                </span>
                <span
                  className={`text-xs uppercase font-extrabold tracking-wider px-3 py-0.5 rounded-full shadow-sm text-white ${
                    status === "Submitted"
                      ? "bg-emerald-600"
                      : status === "Revision Requested"
                      ? "bg-amber-600"
                      : status === "Revision Approved"
                      ? "bg-cyan-700"
                      : status === "Revision Rejected"
                      ? "bg-red-600"
                      : "bg-blue-600"
                  }`}
                >
                  {status}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mt-2">
                Quotation Ref: {currentQuotation.quotationReference}
              </h3>

              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                {status === "Submitted" &&
                  "Your quotation has been successfully submitted and is locked for Comparative Statement evaluation by Pakiza Procurement Team."}
                {status === "Revision Requested" &&
                  "A revision request has been submitted to the Procurement Team. Editing will be unlocked once approved."}
                {status === "Revision Approved" &&
                  "Procurement has approved your revision request! You can now unlock this quotation to update prices, terms, or attachments."}
                {status === "Revision Rejected" &&
                  "Your request for quotation revision was declined. Your previously submitted version remains active."}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200/60">
                <span>
                  Submitted:{" "}
                  <strong className="text-slate-800">
                    {currentQuotation.submittedAt
                      ? new Date(currentQuotation.submittedAt).toLocaleString()
                      : "Pending"}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Net Total:{" "}
                  <strong className="text-blue-700 font-mono">
                    {csInfo.currency}{" "}
                    {financialSummary.netQuotationAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Items Quoted:{" "}
                  <strong className="text-slate-800">
                    {financialSummary.quotedItemsCount} of{" "}
                    {financialSummary.totalItems}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2 shrink-0 self-start md:self-center">
            {status === "Submitted" && (
              <button
                type="button"
                onClick={() => setShowRevisionModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold shadow-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-amber-700" />
                Request Quotation Revision
              </button>
            )}

            {status === "Revision Approved" && (
              <button
                type="button"
                onClick={onUnlockForEditing}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] active:bg-[#1E3FA8] text-white text-xs font-bold shadow-md shadow-[#4169E1]/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Unlock & Edit Quotation (v{currentQuotation.version + 1}.0)
              </button>
            )}
          </div>
        </div>

        {/* Reason banner if Revision Requested */}
        {status === "Revision Requested" && currentQuotation.revisionReason && (
          <div className="mt-5 p-4 rounded-xl bg-amber-100/70 border border-amber-300 text-xs text-amber-900">
            <div className="font-bold mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              Pending Revision Request Details:
            </div>
            <p className="italic">"{currentQuotation.revisionReason}"</p>
            <div className="text-[11px] text-amber-700 mt-2">
              Requested at:{" "}
              {currentQuotation.revisionRequestedAt
                ? new Date(currentQuotation.revisionRequestedAt).toLocaleString()
                : "Just now"}
            </div>
          </div>
        )}

        {/* Procurement Demo Simulator Bar */}
        {onSimulateDecision && (
          <div className="mt-6 pt-4 border-t border-slate-200/80 bg-white/70 p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="font-bold">Evaluation Sandbox Tool:</span>
                <span className="text-slate-500">
                  Simulate Internal Procurement Decision
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onSimulateDecision(
                      "Approved",
                      "Procurement committee approved supplier request to update raw material index rates."
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Simulate: Approve Revision
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onSimulateDecision(
                      "Rejected",
                      "Comparative statement deadline has passed; rate adjustments cannot be entertained."
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Simulate: Reject Revision
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Revision History Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Quotation Revision & Version History ({revisionHistory.length + 1}{" "}
              Total Recorded)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Immutable Audit Trail
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Active Version Entry */}
          <div className="p-4 bg-blue-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                v{currentQuotation.version}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {currentQuotation.quotationReference}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Active Version
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                  <span>
                    Net:{" "}
                    <strong className="text-slate-800 font-mono">
                      {csInfo.currency}{" "}
                      {financialSummary.netQuotationAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Status:{" "}
                    <strong className="text-blue-700">{status}</strong>
                  </span>
                  {currentQuotation.submittedAt && (
                    <>
                      <span>•</span>
                      <span>
                        Date: {new Date(currentQuotation.submittedAt).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setShowPdfModal(true)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                View Document
              </button>
            </div>
          </div>

          {/* Historical Versions */}
          {revisionHistory.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 italic">
              No previous revisions archived. This is the initial quotation iteration (v1.0).
            </div>
          ) : (
            revisionHistory.map((rev) => (
              <div
                key={rev.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                    v{rev.version}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">
                        {rev.quotationReference}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Superseded / Archived
                      </span>
                      {rev.revisionDecision && (
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            rev.revisionDecision === "Approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          Revision {rev.revisionDecision}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span>
                        Net:{" "}
                        <strong className="text-slate-700 font-mono">
                          {csInfo.currency}{" "}
                          {rev.snapshot.financialSummary.netQuotationAmount.toLocaleString(
                            undefined,
                            { minimumFractionDigits: 2 }
                          )}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Submitted:{" "}
                        {new Date(rev.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {rev.revisionReason && (
                      <div className="text-xs text-slate-600 mt-1 italic bg-slate-50 p-2 rounded border border-slate-100">
                        Reason: "{rev.revisionReason}"
                        {rev.decisionRemarks && (
                          <span className="block not-italic font-semibold text-slate-700 mt-0.5">
                            Procurement Remark: {rev.decisionRemarks}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setSelectedHistoricalRecord(rev)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    Inspect Snapshot
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Revision Request Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Request Quotation Revision
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRevisionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestRevisionSubmit} className="pt-4 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                Formal revision requests are forwarded directly to the Pakiza
                Procurement Evaluation Committee. Once approved, you will be
                permitted to re-submit updated rates and terms under a new revision
                version.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Reason for Revision Request *
                </label>
                <textarea
                  required
                  rows={4}
                  value={revisionReasonInput}
                  onChange={(e) => setRevisionReasonInput(e.target.value)}
                  placeholder="Detail the specific justification (e.g., raw material price change, currency fluctuation, updated delivery lead time, spec clarification)..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!revisionReasonInput.trim()}
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all disabled:opacity-50"
                >
                  Transmit Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Historical Record Inspect Modal */}
      {selectedHistoricalRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Historical Version v{selectedHistoricalRecord.version}.0 Snapshot
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Ref: {selectedHistoricalRecord.quotationReference} | Submitted:{" "}
                  {new Date(selectedHistoricalRecord.submittedAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHistoricalRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                <span className="font-semibold text-slate-700">
                  Net Quotation Amount:
                </span>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {csInfo.currency}{" "}
                  {selectedHistoricalRecord.snapshot.financialSummary.netQuotationAmount.toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2 }
                  )}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2 uppercase tracking-wider text-[11px]">
                  Commercial Terms
                </h4>
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Payment:</span>
                    <span className="font-medium text-slate-800">
                      {selectedHistoricalRecord.snapshot.commercialTerms.paymentTerms}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Delivery:</span>
                    <span className="font-medium text-slate-800">
                      {selectedHistoricalRecord.snapshot.commercialTerms.deliveryTerms}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lead Time:</span>
                    <span className="font-medium text-slate-800">
                      {selectedHistoricalRecord.snapshot.commercialTerms.overallLeadTimeDays} Days
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Validity:</span>
                    <span className="font-medium text-slate-800">
                      {selectedHistoricalRecord.snapshot.commercialTerms.offerValidity}
                    </span>
                  </div>
                </div>
              </div>

              {selectedHistoricalRecord.revisionReason && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="font-bold text-amber-900 block text-[11px]">
                    Revision Reason:
                  </span>
                  <p className="text-amber-800 italic mt-0.5">
                    {selectedHistoricalRecord.revisionReason}
                  </p>
                  {selectedHistoricalRecord.decisionRemarks && (
                    <p className="text-emerald-800 font-semibold mt-1">
                      Decision Note: {selectedHistoricalRecord.decisionRemarks}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedHistoricalRecord(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {showPdfModal && (
        <QuotationPdfModal
          invitation={invitation}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
};

