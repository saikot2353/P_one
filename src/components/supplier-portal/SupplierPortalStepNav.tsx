import React, { useMemo } from "react";
import {
  FileText,
  User,
  Layers,
  DollarSign,
  FileCheck2,
  Paperclip,
  Send,
  History,
  Check,
  AlertCircle,
} from "lucide-react";
import { PortalStep, SupplierInvitationRecord } from "@/lib/supplier-portal/types";

interface Props {
  currentStep: PortalStep;
  onStepChange?: (step: PortalStep) => void;
  onSelectStep?: (step: PortalStep) => void;
  completedSteps?: Set<PortalStep>;
  validationErrors?: Partial<Record<PortalStep, string>>;
  isSubmitted?: boolean;
  hasRevisions?: boolean;
  invitation?: SupplierInvitationRecord | null;
}

interface StepMeta {
  step: PortalStep;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepMeta[] = [
  { step: 1, title: "1. Invitation Overview", shortTitle: "Overview", icon: FileText },
  { step: 2, title: "2. Supplier Information", shortTitle: "Supplier", icon: User },
  { step: 3, title: "3. Item-wise Quotation", shortTitle: "Items", icon: Layers },
  { step: 4, title: "4. Overall Quotation", shortTitle: "Pricing", icon: DollarSign },
  { step: 5, title: "5. Commercial Terms", shortTitle: "Terms", icon: FileCheck2 },
  { step: 6, title: "6. Attachments", shortTitle: "Files", icon: Paperclip },
  { step: 7, title: "7. Review & Submit", shortTitle: "Submit", icon: Send },
  { step: 8, title: "8. Status & History", shortTitle: "History", icon: History },
];

export function SupplierPortalStepNav({
  currentStep,
  onStepChange,
  onSelectStep,
  completedSteps,
  validationErrors,
  isSubmitted,
  hasRevisions,
  invitation,
}: Props) {
  const handleStepClick = onSelectStep || onStepChange || (() => {});

  // Compute completed steps safely from invitation data if completedSteps is undefined
  const safeCompletedSteps = useMemo(() => {
    if (completedSteps instanceof Set) {
      return completedSteps;
    }

    const set = new Set<PortalStep>();
    // Step 1: Always completed once visited
    set.add(1);

    if (invitation) {
      // Step 2: Contact person and contact email exist
      if (
        invitation.supplierContact?.contactPerson &&
        invitation.supplierContact?.email
      ) {
        set.add(2);
      }

      // Step 3: At least one item quoted
      const quotes = Object.values(invitation.currentQuotation?.itemQuotes || {});
      const hasQuotedItem = quotes.some(
        (q) => q.status === "Quoted" && Number(q.unitPrice) > 0
      );
      if (hasQuotedItem) {
        set.add(3);
        set.add(4); // Overall quote auto-computes
      }

      // Step 5: Commercial terms set
      if (
        invitation.currentQuotation?.commercialTerms?.paymentTerms &&
        invitation.currentQuotation?.commercialTerms?.deliveryTerms
      ) {
        set.add(5);
      }

      // Step 6: Attachments
      if ((invitation.currentQuotation?.attachments || []).length > 0) {
        set.add(6);
      }

      // Step 7 & 8: Declaration accepted or submitted
      const status = invitation.currentQuotation?.status;
      if (invitation.currentQuotation?.declarationAccepted) {
        set.add(7);
      }
      if (
        status === "Submitted" ||
        status === "Revision Requested" ||
        status === "Revision Approved" ||
        status === "Revision Rejected" ||
        status === "Under Review" ||
        status === "Closed"
      ) {
        set.add(7);
        set.add(8);
      }
    }

    return set;
  }, [completedSteps, invitation]);

  const effectiveIsSubmitted =
    isSubmitted ??
    (invitation?.currentQuotation?.status === "Submitted" ||
      invitation?.currentQuotation?.status === "Under Review" ||
      invitation?.currentQuotation?.status === "Closed");

  const effectiveHasRevisions =
    hasRevisions ?? ((invitation?.revisionHistory || []).length > 0);

  return (
    <nav className="bg-white border-b border-[#E2E8F0] shadow-xs sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center overflow-x-auto scrollbar-none py-2.5 gap-1.5 sm:gap-2">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.step;
            const isCompleted = safeCompletedSteps.has(s.step);
            const error = validationErrors?.[s.step];

            // Highlights Step 8 if already submitted or has revisions
            const isSpecialHighlight =
              s.step === 8 && (effectiveIsSubmitted || effectiveHasRevisions);

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => handleStepClick(s.step)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl text-xs shrink-0 transition-all cursor-pointer relative ${
                  isActive
                    ? "bg-[#4169E1] text-white shadow-md shadow-[#4169E1]/20 font-bold"
                    : isSpecialHighlight
                    ? "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 font-semibold"
                    : isCompleted
                    ? "bg-blue-50/70 text-[#172554] hover:bg-blue-100/70 border border-blue-100 font-medium"
                    : "text-[#64748B] hover:text-[#172554] hover:bg-slate-100/70 font-medium"
                }`}
                title={error || s.title}
              >
                {/* Status Dot / Checkmark / Error Icon */}
                <div className="flex items-center justify-center">
                  {error ? (
                    <AlertCircle className="size-3.5 text-rose-500" />
                  ) : isCompleted && !isActive ? (
                    <div className="size-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      <Check className="size-2.5 stroke-[3]" />
                    </div>
                  ) : (
                    <Icon
                      className={`size-3.5 ${
                        isActive
                          ? "text-white"
                          : isSpecialHighlight
                          ? "text-purple-600"
                          : isCompleted
                          ? "text-[#4169E1]"
                          : "text-slate-400"
                      }`}
                    />
                  )}
                </div>

                <span className="hidden md:inline whitespace-nowrap">{s.title}</span>
                <span className="md:hidden whitespace-nowrap">{s.shortTitle}</span>

                {/* Sub-badge for Step 8 when revisions exist */}
                {s.step === 8 && effectiveHasRevisions && !isActive && (
                  <span className="size-2 rounded-full bg-purple-500 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
