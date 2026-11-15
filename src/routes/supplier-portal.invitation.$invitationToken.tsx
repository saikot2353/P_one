import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  getInvitationByToken,
  recordInvitationOpened,
  saveInvitationDraft,
  submitQuotation,
  requestRevision,
  simulateProcurementDecision,
} from "@/lib/supplier-portal/storage";
import {
  SupplierInvitationRecord,
  PortalStep,
  SupplierContactInfo,
  ItemQuotationEntry,
  OverallQuotation,
  CommercialTerms,
  PortalAttachment,
} from "@/lib/supplier-portal/types";
import { calculateFinancialSummary } from "@/lib/supplier-portal/mock-data";
import { SupplierPortalHeader } from "@/components/supplier-portal/SupplierPortalHeader";
import { SupplierPortalStepNav } from "@/components/supplier-portal/SupplierPortalStepNav";
import { SupplierPortalFooter } from "@/components/supplier-portal/SupplierPortalFooter";
import { SupplierPortalSidebar } from "@/components/supplier-portal/SupplierPortalSidebar";
import { SupplierPortalActionBar } from "@/components/supplier-portal/SupplierPortalActionBar";
import { QuotationPdfModal } from "@/components/supplier-portal/QuotationPdfModal";
import { Step1InvitationOverview } from "@/components/supplier-portal/steps/Step1InvitationOverview";
import { Step2SupplierInfo } from "@/components/supplier-portal/steps/Step2SupplierInfo";
import { Step3ItemWiseQuotation } from "@/components/supplier-portal/steps/Step3ItemWiseQuotation";
import { Step4OverallQuotation } from "@/components/supplier-portal/steps/Step4OverallQuotation";
import { Step5CommercialTerms } from "@/components/supplier-portal/steps/Step5CommercialTerms";
import { Step6Attachments } from "@/components/supplier-portal/steps/Step6Attachments";
import { Step7ReviewAndSubmit } from "@/components/supplier-portal/steps/Step7ReviewAndSubmit";
import { Step8StatusAndHistory } from "@/components/supplier-portal/steps/Step8StatusAndHistory";
import { InvalidInvitationView } from "@/components/supplier-portal/InvalidInvitationView";

const STEP_TITLES: Record<PortalStep, string> = {
  1: "Invitation Overview",
  2: "Supplier Information",
  3: "Item-wise Quotation",
  4: "Overall Quotation",
  5: "Commercial Terms",
  6: "Supporting Attachments",
  7: "Review & Submit",
  8: "Submission Status & History",
};

export const Route = createFileRoute(
  "/supplier-portal/invitation/$invitationToken"
)({
  head: () => ({
    meta: [
      { title: "Supplier Quotation Portal — Pakiza Group" },
      {
        name: "description",
        content:
          "Official Supplier Quotation & Comparative Statement submission portal.",
      },
    ],
  }),
  component: SupplierPortalInvitationPage,
});

function SupplierPortalInvitationPage() {
  const { invitationToken } = Route.useParams();
  const navigate = useNavigate();

  // Load invitation record
  const [invitation, setInvitation] =
    useState<SupplierInvitationRecord | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState<PortalStep>(1);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Initialize invitation on mount or token change
  useEffect(() => {
    if (!invitationToken) {
      setHasLoaded(true);
      return;
    }

    // Record open event
    recordInvitationOpened(invitationToken);
    const record = getInvitationByToken(invitationToken);

    if (record) {
      setInvitation(record);
      // If already submitted or past draft, default to Step 8
      if (
        record.currentQuotation.status !== "Draft" &&
        record.currentQuotation.status !== "Link Opened" &&
        record.currentQuotation.status !== "Invitation Sent"
      ) {
        setCurrentStep(8);
      } else {
        setCurrentStep(1);
      }
    } else {
      setInvitation(null);
    }
    setHasLoaded(true);
  }, [invitationToken]);

  const isReadOnly = useMemo(() => {
    if (!invitation) return false;
    const s = invitation.currentQuotation.status;
    return (
      s === "Submitted" ||
      s === "Revision Requested" ||
      s === "Under Review" ||
      s === "Closed"
    );
  }, [invitation]);

  // Persist draft updates helper
  const persistDraft = useCallback(
    (updatedInvitation: SupplierInvitationRecord) => {
      setIsSaving(true);
      setInvitation(updatedInvitation);
      saveInvitationDraft(
        updatedInvitation.invitationToken,
        updatedInvitation.currentQuotation,
        updatedInvitation.supplierContact
      );
      setTimeout(() => {
        setIsSaving(false);
        setLastSavedTime(
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        );
      }, 250);
    },
    []
  );

  // Handlers for steps
  const handleUpdateContact = (contact: SupplierContactInfo) => {
    if (!invitation) return;
    const updated: SupplierInvitationRecord = {
      ...invitation,
      supplierContact: contact,
      lastUpdatedDate: new Date().toISOString(),
    };
    persistDraft(updated);
  };

  const handleUpdateItemQuotes = (
    itemQuotes: Record<string, ItemQuotationEntry>
  ) => {
    if (!invitation) return;
    const updated: SupplierInvitationRecord = {
      ...invitation,
      currentQuotation: {
        ...invitation.currentQuotation,
        itemQuotes,
      },
      lastUpdatedDate: new Date().toISOString(),
    };
    persistDraft(updated);
  };

  const handleUpdateOverallQuote = (overallQuote: OverallQuotation) => {
    if (!invitation) return;
    const updated: SupplierInvitationRecord = {
      ...invitation,
      currentQuotation: {
        ...invitation.currentQuotation,
        overallQuote,
      },
      lastUpdatedDate: new Date().toISOString(),
    };
    persistDraft(updated);
  };

  const handleUpdateTerms = (terms: CommercialTerms) => {
    if (!invitation) return;
    const updated: SupplierInvitationRecord = {
      ...invitation,
      currentQuotation: {
        ...invitation.currentQuotation,
        commercialTerms: terms,
      },
      lastUpdatedDate: new Date().toISOString(),
    };
    persistDraft(updated);
  };

  const handleUpdateAttachments = (attachments: PortalAttachment[]) => {
    if (!invitation) return;
    const updated: SupplierInvitationRecord = {
      ...invitation,
      currentQuotation: {
        ...invitation.currentQuotation,
        attachments,
      },
      lastUpdatedDate: new Date().toISOString(),
    };
    persistDraft(updated);
  };

  const handleToggleDeclaration = (accepted: boolean) => {
    if (!invitation) return;
    const updated: SupplierInvitationRecord = {
      ...invitation,
      currentQuotation: {
        ...invitation.currentQuotation,
        declarationAccepted: accepted,
      },
      lastUpdatedDate: new Date().toISOString(),
    };
    persistDraft(updated);
  };

  const handleSubmitQuotation = () => {
    if (!invitation) return;
    const submitted = submitQuotation(invitation.invitationToken);
    if (submitted) {
      setInvitation({ ...submitted });
      setCurrentStep(8);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRequestRevision = (reason: string) => {
    if (!invitation) return;
    const updated = requestRevision(invitation.invitationToken, reason);
    if (updated) {
      setInvitation({ ...updated });
    }
  };

  const handleSimulateDecision = (
    decision: "Approved" | "Rejected",
    remarks?: string
  ) => {
    if (!invitation) return;
    const updated = simulateProcurementDecision(
      invitation.invitationToken,
      decision,
      remarks
    );
    if (updated) {
      setInvitation({ ...updated });
    }
  };

  const handleUnlockForEditing = () => {
    if (!invitation) return;
    const updated: SupplierInvitationRecord = {
      ...invitation,
      currentQuotation: {
        ...invitation.currentQuotation,
        version: invitation.currentQuotation.version + 1,
        quotationReference: invitation.currentQuotation.quotationReference.replace(
          /(-v\d+)?$/i,
          `-V${invitation.currentQuotation.version + 1}`
        ),
        status: "Draft",
        submittedAt: undefined,
        revisionReason: undefined,
        revisionRequestedAt: undefined,
        declarationAccepted: false,
      },
      lastUpdatedDate: new Date().toISOString(),
    };
    persistDraft(updated);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSwitchInvitation = (token: string) => {
    navigate({
      to: "/supplier-portal/invitation/$invitationToken",
      params: { invitationToken: token },
    });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as PortalStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(8, prev + 1) as PortalStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canSubmit = useMemo(() => {
    if (!invitation) return false;
    const fin = calculateFinancialSummary(
      invitation.items,
      invitation.currentQuotation.itemQuotes,
      invitation.currentQuotation.overallQuote
    );
    return fin.quotedItemsCount > 0 && invitation.currentQuotation.declarationAccepted && !isReadOnly;
  }, [invitation, isReadOnly]);

  if (!hasLoaded) {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex items-center justify-center">
        <div className="text-[#4169E1] text-sm font-semibold flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#4169E1] animate-ping" />
          Loading Supplier Portal Session...
        </div>
      </div>
    );
  }

  if (!invitation) {
    return <InvalidInvitationView token={invitationToken} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF] text-[#172554] flex flex-col font-sans selection:bg-[#4169E1] selection:text-white">
      {/* Full-Width Top Header */}
      <SupplierPortalHeader
        invitation={invitation}
        currentStep={currentStep}
        lastSavedTime={lastSavedTime}
        isSaving={isSaving}
        onSwitchInvitation={handleSwitchInvitation}
      />

      {/* Full-Width Step Navigation */}
      <SupplierPortalStepNav
        currentStep={currentStep}
        onSelectStep={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        invitation={invitation}
      />

      {/* Main Workspace Layout (Full-Width Responsive 72% / 28% Grid) */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-8 lg:px-12 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Workspace Area (approx 72%) */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-6">
            {currentStep === 1 && (
              <Step1InvitationOverview
                invitation={invitation}
                onNext={() => {
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {currentStep === 2 && (
              <Step2SupplierInfo
                invitation={invitation}
                onUpdateContact={handleUpdateContact}
                onNext={() => {
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPrev={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                isReadOnly={isReadOnly}
              />
            )}

            {currentStep === 3 && (
              <Step3ItemWiseQuotation
                invitation={invitation}
                onUpdateItemQuotes={handleUpdateItemQuotes}
                onNext={() => {
                  setCurrentStep(4);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPrev={() => {
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                isReadOnly={isReadOnly}
              />
            )}

            {currentStep === 4 && (
              <Step4OverallQuotation
                invitation={invitation}
                onUpdateOverallQuote={handleUpdateOverallQuote}
                onNext={() => {
                  setCurrentStep(5);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPrev={() => {
                  setCurrentStep(3);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                isReadOnly={isReadOnly}
              />
            )}

            {currentStep === 5 && (
              <Step5CommercialTerms
                invitation={invitation}
                onUpdateTerms={handleUpdateTerms}
                onNext={() => {
                  setCurrentStep(6);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPrev={() => {
                  setCurrentStep(4);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                isReadOnly={isReadOnly}
              />
            )}

            {currentStep === 6 && (
              <Step6Attachments
                invitation={invitation}
                onUpdateAttachments={handleUpdateAttachments}
                onNext={() => {
                  setCurrentStep(7);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPrev={() => {
                  setCurrentStep(5);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                isReadOnly={isReadOnly}
              />
            )}

            {currentStep === 7 && (
              <Step7ReviewAndSubmit
                invitation={invitation}
                onToggleDeclaration={handleToggleDeclaration}
                onSubmitQuotation={handleSubmitQuotation}
                onGoToStep={(step) => {
                  setCurrentStep(step as PortalStep);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPrev={() => {
                  setCurrentStep(6);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                isReadOnly={isReadOnly}
              />
            )}

            {currentStep === 8 && (
              <Step8StatusAndHistory
                invitation={invitation}
                onRequestRevision={handleRequestRevision}
                onSimulateDecision={handleSimulateDecision}
                onUnlockForEditing={handleUnlockForEditing}
                onGoToStep={(step) => {
                  setCurrentStep(step as PortalStep);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </div>

          {/* Contextual Side Information Panel (approx 28%) */}
          <div className="lg:col-span-4 xl:col-span-4 sticky top-24">
            <SupplierPortalSidebar
              invitation={invitation}
              currentStep={currentStep}
              onGoToStep={(step) => {
                setCurrentStep(step);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onPreviewPdf={() => setShowPdfModal(true)}
              lastSavedTime={lastSavedTime}
              isSaving={isSaving}
            />
          </div>
        </div>
      </main>

      {/* Persistent Full-Width Action Bar */}
      <SupplierPortalActionBar
        currentStep={currentStep}
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmitQuotation}
        onPreviewPdf={() => setShowPdfModal(true)}
        isReadOnly={isReadOnly}
        canSubmit={canSubmit}
        lastSavedTime={lastSavedTime}
        isSaving={isSaving}
        stepTitle={STEP_TITLES[currentStep]}
      />

      {/* Footer */}
      <SupplierPortalFooter />

      {/* Printable Quotation PDF Preview Modal */}
      {showPdfModal && (
        <QuotationPdfModal
          invitation={invitation}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
}
