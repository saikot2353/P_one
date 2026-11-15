import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Building2,
  X,
} from "lucide-react";
import { SupplierInvitationRecord } from "@/lib/supplier-portal/types";
import { getStoredInvitations, resetSupplierPortalData } from "@/lib/supplier-portal/storage";
import { toast } from "sonner";

interface Props {
  invitation: SupplierInvitationRecord;
  isSaving?: boolean;
  lastSavedTime: string | null;
  onSelectInvitation?: (token: string) => void;
  onSwitchInvitation?: (token: string) => void;
  onResetData?: () => void;
  currentStep?: number;
}

export function SupplierPortalHeader({
  invitation,
  isSaving = false,
  lastSavedTime,
  onSelectInvitation,
  onSwitchInvitation,
  onResetData,
}: Props) {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const allInvitations = getStoredInvitations();
  const handleSwitch = onSwitchInvitation || onSelectInvitation;

  // Compute countdown to submission deadline
  const deadline = new Date(invitation.csInfo.submissionDeadline);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const isExpired = diffMs <= 0;

  const handleReset = () => {
    if (confirm("Reset all Supplier Portal demonstration data back to default?")) {
      resetSupplierPortalData();
      toast.success("Supplier Portal demonstration data reset successfully.");
      if (onResetData) onResetData();
      else window.location.reload();
    }
  };

  return (
    <header className="bg-white border-b border-[#E2E8F0] text-[#172554] sticky top-0 z-40 shadow-xs">
      {/* Top Utility Ribbon */}
      <div className="border-b border-[#E2E8F0]/70 bg-[#F8FAFC]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-[#4169E1] font-bold border border-blue-200 text-[11px]">
              <span className="size-1.5 rounded-full bg-[#4169E1] animate-pulse" />
              STANDALONE SUPPLIER PORTAL
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-[#64748B] font-medium hidden sm:inline">
              Comparative Statement E-Quotation Platform
            </span>
          </div>

          {/* Demo Switcher & Auto-save status */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Auto-save indicator */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
              {isSaving ? (
                <>
                  <span className="size-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-amber-700 font-medium">Saving draft...</span>
                </>
              ) : lastSavedTime ? (
                <>
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span className="text-[#64748B]">Draft saved {lastSavedTime}</span>
                </>
              ) : null}
            </div>

            {/* Switch Demo Invitation Dropdown Button */}
            <button
              type="button"
              onClick={() => setShowDemoModal(true)}
              className="h-7 px-2.5 rounded-lg bg-white hover:bg-slate-50 text-[#172554] border border-[#E2E8F0] text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              title="Switch between sample supplier invitations"
            >
              <Sparkles className="size-3 text-[#4169E1]" />
              <span>Switch Demo ({allInvitations.length})</span>
              <ChevronDown className="size-3 text-[#64748B]" />
            </button>

            {/* Reset Demo Data Button */}
            <button
              type="button"
              onClick={handleReset}
              className="h-7 px-2.5 rounded-lg hover:bg-slate-100 text-[#64748B] hover:text-[#172554] text-xs transition flex items-center gap-1 cursor-pointer"
              title="Reset demonstration data"
            >
              <RotateCcw className="size-3 text-[#4169E1]" />
              <span className="hidden md:inline font-medium">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Invitation Header */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Organization & Portal Title */}
        <div className="flex items-center gap-3.5">
          <div className="size-11 rounded-xl bg-[#4169E1] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#4169E1]/20 shrink-0">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#172554]">
                PAKIZA GROUP
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-[#4169E1] font-bold border border-blue-200">
                OFFICIAL RFQ
              </span>
            </div>
            <p className="text-xs text-[#64748B] truncate max-w-xl font-medium mt-0.5">
              {invitation.csInfo.csSubject}
            </p>
          </div>
        </div>

        {/* Right: Supplier & Deadline Badges */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Supplier Info Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2.5 text-left shadow-2xs">
            <Building2 className="size-4 text-[#4169E1] shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
                Invited Supplier
              </div>
              <div className="text-xs font-bold text-[#172554] truncate max-w-[180px]">
                {invitation.supplierMaster.supplierName}
              </div>
            </div>
          </div>

          {/* Submission Deadline Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2.5 text-left shadow-2xs ${
              isExpired
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : diffDays <= 3
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-blue-50 border-blue-200 text-[#172554]"
            }`}
          >
            <Clock
              className={`size-4 shrink-0 ${
                isExpired
                  ? "text-rose-600"
                  : diffDays <= 3
                  ? "text-amber-600"
                  : "text-[#4169E1]"
              }`}
            />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                Submission Deadline
              </div>
              <div className="text-xs font-bold whitespace-nowrap">
                {isExpired
                  ? "Deadline Expired"
                  : `${diffDays} Day${diffDays === 1 ? "" : "s"} Remaining (${new Date(
                      invitation.csInfo.submissionDeadline
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })})`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Switcher Modal */}
      {showDemoModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowDemoModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xl text-[#172554] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-[#4169E1]" />
                <h3 className="text-base font-bold text-[#172554]">
                  Switch Demonstration Supplier Invitation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDemoModal(false)}
                className="size-8 rounded-lg hover:bg-slate-100 text-[#64748B] hover:text-[#172554] flex items-center justify-center transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-[#64748B]">
              Select any of the realistic pre-configured supplier invitations below to experience
              different CS items, quotation workflows, statuses, and historical revisions:
            </p>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {allInvitations.map((inv) => {
                const isCurrent =
                  inv.invitationToken.toLowerCase() ===
                  invitation.invitationToken.toLowerCase();
                return (
                  <div
                    key={inv.invitationToken}
                    onClick={() => {
                      setShowDemoModal(false);
                      if (handleSwitch) {
                        handleSwitch(inv.invitationToken);
                      } else {
                        window.location.href = `/supplier-portal/invitation/${inv.invitationToken}`;
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrent
                        ? "bg-blue-50/80 border-[#4169E1] text-[#172554] shadow-xs"
                        : "bg-white border-[#E2E8F0] hover:border-[#4169E1]/50 hover:bg-[#F8FAFC] text-[#172554]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#172554]">
                          {inv.supplierMaster.supplierName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-[#64748B] font-mono">
                          {inv.supplierMaster.supplierCode}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            inv.invitationStatus === "Submitted"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : inv.invitationStatus === "Revision Approved"
                              ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                              : inv.invitationStatus === "Draft"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-[#4169E1] border-blue-200"
                          }`}
                        >
                          {inv.invitationStatus}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748B]">
                        <span className="font-semibold text-[#172554]">
                          {inv.csInfo.csNumber}
                        </span>{" "}
                        • {inv.csInfo.csSubject}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {inv.items.length} Items to Quote • Currency:{" "}
                        <strong className="text-[#172554]">{inv.csInfo.currency}</strong> • Version{" "}
                        {inv.currentQuotation.version}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isCurrent ? (
                        <span className="px-3 py-1.5 rounded-lg bg-[#4169E1] text-white text-xs font-bold flex items-center gap-1 shadow-xs">
                          <CheckCircle2 className="size-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-[#64748B] hover:text-[#172554] text-xs font-semibold">
                          Open Portal →
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
