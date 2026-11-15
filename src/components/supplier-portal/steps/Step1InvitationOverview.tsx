import React from "react";
import {
  FileText,
  Calendar,
  Building,
  MapPin,
  Clock,
  Download,
  Eye,
  ArrowRight,
  ShieldCheck,
  Info,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Package,
} from "lucide-react";
import { SupplierInvitationRecord } from "@/lib/supplier-portal/types";
import { toast } from "sonner";

interface Props {
  invitation: SupplierInvitationRecord;
  onNext?: () => void;
  onContinue?: () => void;
  isReadOnly?: boolean;
}

export function Step1InvitationOverview({
  invitation,
  onNext,
  onContinue,
  isReadOnly = false,
}: Props) {
  const { csInfo, supplierMaster, invitationStatus } = invitation;
  const handleProceed = onNext || onContinue || (() => {});

  const deadline = new Date(csInfo.submissionDeadline);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const isExpired = diffMs <= 0;

  const handleDownloadDoc = (docName: string) => {
    toast.success(`Downloading "${docName}"...`);
    const blob = new Blob(
      [
        `Pakiza Group - Enterprise Procurement\nDocument: ${docName}\nCS Reference: ${csInfo.csNumber}\nDate: ${new Date().toLocaleDateString()}`,
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = docName.endsWith(".pdf") ? docName.replace(".pdf", ".txt") : docName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Official Invitation Banner */}
      <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-4 text-blue-950 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-[#4169E1] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#4169E1]/20">
          <Info className="size-5" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-[#172554]">
              Official Request for Quotation (RFQ) Tender Invitation
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#4169E1] font-bold text-[10px]">
              Active Tender
            </span>
          </div>
          <p className="text-[#64748B] leading-relaxed">
            You are formally invited by the <strong>Pakiza Group Central Procurement Committee</strong> to
            review specifications and submit your commercial &amp; technical offer against Comparative
            Statement reference <strong className="text-[#172554] font-mono">{csInfo.csNumber}</strong>. Please
            carefully inspect all requirements and complete your quotation prior to the submission deadline.
          </p>
        </div>
      </div>

      {/* Main CS Information Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E2E8F0] gap-3">
          <div>
            <span className="text-[11px] font-bold text-[#4169E1] uppercase tracking-wider block">
              Comparative Statement Specification
            </span>
            <h2 className="text-xl font-black text-[#172554] flex items-center gap-2.5 mt-0.5">
              <FileText className="size-5 text-[#4169E1]" />
              <span>{csInfo.csNumber}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 text-[#172554] font-bold border border-slate-200">
              Currency: <strong>{csInfo.currency}</strong>
            </span>
            <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1.5">
              <Package className="size-3.5 text-emerald-600" />
              <span>{invitation.items.length} Required Items</span>
            </span>
          </div>
        </div>

        {/* CS Subject & Scope */}
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Tender Subject &amp; Procurement Scope
            </label>
            <p className="text-base font-bold text-[#172554] mt-1 leading-snug">
              {csInfo.csSubject}
            </p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              General Requirements &amp; Quality Mandates
            </label>
            <div className="mt-1.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#172554] leading-relaxed font-medium">
              {csInfo.generalRequirements}
            </div>
          </div>
        </div>

        {/* 4-Column Metadata Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase flex items-center gap-1 tracking-wider">
              <Calendar className="size-3 text-[#4169E1]" />
              Issuance Date
            </span>
            <div className="font-bold text-[#172554] text-sm">{csInfo.csDate}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase flex items-center gap-1 tracking-wider">
              <Building className="size-3 text-[#4169E1]" />
              Procuring Dept
            </span>
            <div className="font-bold text-[#172554] text-sm truncate" title={csInfo.department}>
              {csInfo.department}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase flex items-center gap-1 tracking-wider">
              <Clock className="size-3 text-rose-600" />
              Submission Deadline
            </span>
            <div className="font-bold text-rose-600 text-sm">
              {new Date(csInfo.submissionDeadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              RFQ Reference
            </span>
            <div className="font-mono font-bold text-[#172554] text-xs truncate">
              {csInfo.invitationReference}
            </div>
          </div>
        </div>

        {/* Designated Delivery Location */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3 text-xs">
          <MapPin className="size-4 text-[#4169E1] shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              Designated Delivery Facility &amp; Warehouse
            </span>
            <span className="font-bold text-[#172554] mt-0.5 block">
              {csInfo.deliveryLocation}
            </span>
          </div>
        </div>
      </div>

      {/* Supporting Tender Documents */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <FileCheck className="size-5 text-[#4169E1]" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#172554]">
              Buyer Supporting Documents &amp; Specifications ({csInfo.supportingDocuments?.length || 0})
            </h3>
          </div>
          <span className="text-xs text-[#64748B]">Click to download attachment</span>
        </div>

        {csInfo.supportingDocuments && csInfo.supportingDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {csInfo.supportingDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-blue-50/40 hover:border-[#4169E1]/50 flex items-center justify-between gap-3 text-xs transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#4169E1] flex items-center justify-center shrink-0">
                    <FileText className="size-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-[#172554] truncate group-hover:text-[#4169E1]" title={doc.name}>
                      {doc.name}
                    </div>
                    <span className="text-[10px] text-[#64748B] font-mono">{doc.size} • {doc.type}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadDoc(doc.name)}
                  className="p-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#4169E1] text-[#64748B] hover:text-white transition-all shadow-2xs cursor-pointer"
                  title="Download Document"
                >
                  <Download className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#64748B] italic py-2">No external documents attached to this tender.</p>
        )}
      </div>

      {/* Continue CTA Card */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#172554]">
            Ready to confirm your contact and start quoting?
          </h4>
          <p className="text-xs text-[#64748B] mt-0.5">
            Proceed to Step 2 to verify your authorized representative details.
          </p>
        </div>

        <button
          type="button"
          onClick={handleProceed}
          className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] active:bg-[#1E3FA8] text-white font-bold text-xs shadow-md shadow-[#4169E1]/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
        >
          <span>{invitationStatus === "Draft" ? "Continue Quotation Draft" : "Start Quotation Workflow"}</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
