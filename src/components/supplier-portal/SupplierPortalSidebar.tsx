import React from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  DollarSign,
  Printer,
  Save,
  ShieldCheck,
  Phone,
  Mail,
  ChevronRight,
  TrendingUp,
  Package,
} from "lucide-react";
import {
  SupplierInvitationRecord,
  FinancialSummary,
  PortalStep,
} from "@/lib/supplier-portal/types";
import { calculateFinancialSummary } from "@/lib/supplier-portal/mock-data";

interface Props {
  invitation: SupplierInvitationRecord;
  currentStep: PortalStep;
  onGoToStep: (step: PortalStep) => void;
  onPreviewPdf: () => void;
  lastSavedTime: string | null;
  isSaving?: boolean;
}

export const SupplierPortalSidebar: React.FC<Props> = ({
  invitation,
  currentStep,
  onGoToStep,
  onPreviewPdf,
  lastSavedTime,
  isSaving,
}) => {
  const { csInfo, items, supplierMaster, supplierContact, currentQuotation } =
    invitation;

  const financialSummary: FinancialSummary = calculateFinancialSummary(
    items,
    currentQuotation.itemQuotes,
    currentQuotation.overallQuote
  );

  // Compute countdown to submission deadline
  const deadline = new Date(csInfo.submissionDeadline);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const isExpired = diffMs <= 0;

  const percentQuoted =
    items.length > 0
      ? Math.round((financialSummary.quotedItemsCount / items.length) * 100)
      : 0;

  return (
    <aside className="space-y-6">
      {/* 1. Live Quotation Value & Quoted Progress Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/60 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4169E1] animate-pulse" />
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#64748B]">
              Live Quotation Total
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#4169E1] border border-blue-100">
            {csInfo.currency}
          </span>
        </div>

        <div className="mt-4">
          <div className="text-xs text-[#64748B] font-medium">Net Quotation Value</div>
          <div className="text-2xl sm:text-3xl font-black text-[#172554] tracking-tight mt-1 font-mono">
            {csInfo.currency}{" "}
            {financialSummary.netQuotationAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        {/* Quoted Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#E2E8F0]/70 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#172554]">Quotation Progress</span>
            <span className="font-bold text-[#4169E1] font-mono">
              {financialSummary.quotedItemsCount} of {items.length} Items ({percentQuoted}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#4169E1] transition-all duration-300"
              style={{ width: `${percentQuoted}%` }}
            />
          </div>
        </div>

        {/* Financial Breakdown Mini-List */}
        <div className="mt-4 space-y-2 text-xs pt-3 border-t border-slate-100 text-[#64748B]">
          <div className="flex justify-between">
            <span>Item Subtotal:</span>
            <span className="font-mono font-medium text-[#172554]">
              {csInfo.currency}{" "}
              {financialSummary.itemWiseFinalTotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          {financialSummary.overallDiscountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Overall Discount:</span>
              <span className="font-mono">
                - {csInfo.currency}{" "}
                {financialSummary.overallDiscountAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          )}

          {(financialSummary.overallVatAmount > 0 || financialSummary.overallTaxAmount > 0) && (
            <div className="flex justify-between">
              <span>Overall Taxes:</span>
              <span className="font-mono text-[#172554]">
                + {csInfo.currency}{" "}
                {(financialSummary.overallVatAmount + financialSummary.overallTaxAmount).toLocaleString(
                  undefined,
                  { minimumFractionDigits: 2 }
                )}
              </span>
            </div>
          )}

          {(financialSummary.transportationCharges > 0 ||
            financialSummary.installationCharges > 0 ||
            financialSummary.otherCharges > 0) && (
            <div className="flex justify-between">
              <span>Additional Charges:</span>
              <span className="font-mono text-[#172554]">
                + {csInfo.currency}{" "}
                {(
                  financialSummary.transportationCharges +
                  financialSummary.installationCharges +
                  financialSummary.otherCharges
                ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>

        {/* Quick Review & Submit Link */}
        <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onPreviewPdf}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-[#172554] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="size-3.5 text-[#4169E1]" />
            <span>PDF Preview</span>
          </button>

          {currentStep !== 7 && (
            <button
              type="button"
              onClick={() => onGoToStep(7)}
              className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>Review &amp; Submit</span>
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Tender Status & Deadline Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#64748B]">
            Tender Milestones
          </h3>
          <span
            className={`text-xs uppercase font-bold px-2.5 py-0.5 rounded-full border ${
              currentQuotation.status === "Submitted"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : currentQuotation.status === "Revision Approved"
                ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {currentQuotation.status}
          </span>
        </div>

        {/* Deadline Indicator */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isExpired
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : diffDays <= 3
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-blue-50/70 border-blue-200 text-[#172554]"
          }`}
        >
          <Clock
            className={`size-5 shrink-0 mt-0.5 ${
              isExpired
                ? "text-rose-600"
                : diffDays <= 3
                ? "text-amber-600"
                : "text-[#4169E1]"
            }`}
          />
          <div className="text-xs">
            <span className="font-bold block">
              {isExpired ? "Submission Closed" : `${diffDays} Days Remaining`}
            </span>
            <span className="opacity-80 block mt-0.5">
              Deadline:{" "}
              {new Date(csInfo.submissionDeadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* CS Meta Attributes */}
        <div className="space-y-2.5 text-xs text-[#64748B] pt-1">
          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span>CS Number:</span>
            <span className="font-mono font-bold text-[#172554]">{csInfo.csNumber}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span>Issuance Date:</span>
            <span className="font-medium text-[#172554]">{csInfo.csDate}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span>Department:</span>
            <span className="font-medium text-[#172554] truncate max-w-[150px]">
              {csInfo.department}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span>Delivery Point:</span>
            <span className="font-medium text-[#172554] truncate max-w-[150px]">
              {csInfo.deliveryLocation}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>Quotation Ref:</span>
            <span className="font-mono font-bold text-[#4169E1]">
              {currentQuotation.quotationReference}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Procurement Division Assistance Card */}
      <div className="bg-gradient-to-br from-[#F8FAFC] to-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#4169E1] flex items-center justify-center shrink-0">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#172554]">
              Buyer Procurement Helpdesk
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Pakiza Group Sourcing Division
            </p>
          </div>
        </div>

        <p className="text-xs text-[#64748B] leading-relaxed">
          For technical inquiries, commercial clarification, or sample submission guidance, please reach our sourcing officer:
        </p>

        <div className="space-y-2 pt-2 text-xs">
          <a
            href="mailto:procurement@pakizaknit.com"
            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#4169E1] text-[#172554] hover:text-[#4169E1] transition-all font-medium"
          >
            <Mail className="size-3.5 text-[#4169E1]" />
            <span className="truncate">procurement@pakizaknit.com</span>
          </a>

          <a
            href="tel:+88029669871"
            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#4169E1] text-[#172554] hover:text-[#4169E1] transition-all font-medium"
          >
            <Phone className="size-3.5 text-[#4169E1]" />
            <span>+880 2-9669871 (Ext 402)</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

