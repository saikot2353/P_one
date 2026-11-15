import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Printer,
  Save,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { PortalStep } from "@/lib/supplier-portal/types";

interface Props {
  currentStep: PortalStep;
  totalSteps?: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  onPreviewPdf: () => void;
  onSaveDraft?: () => void;
  isReadOnly: boolean;
  canSubmit?: boolean;
  lastSavedTime: string | null;
  isSaving?: boolean;
  stepTitle?: string;
}

export const SupplierPortalActionBar: React.FC<Props> = ({
  currentStep,
  totalSteps = 8,
  onPrev,
  onNext,
  onSubmit,
  onPreviewPdf,
  onSaveDraft,
  isReadOnly,
  canSubmit = false,
  lastSavedTime,
  isSaving = false,
  stepTitle,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-lg py-3.5 px-4 sm:px-8 lg:px-12 transition-all">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Step indicator & Previous Button */}
        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#172554] text-xs font-bold transition-all shadow-2xs hover:border-slate-300 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Previous Step</span>
              <span className="sm:hidden">Back</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 text-xs text-[#64748B]">
            <span className="font-semibold text-[#172554]">
              Step {currentStep} of {totalSteps}
            </span>
            {stepTitle && (
              <>
                <span>•</span>
                <span className="truncate max-w-xs">{stepTitle}</span>
              </>
            )}
          </div>
        </div>

        {/* Center: Save status */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-[#64748B]">
          {isSaving ? (
            <div className="flex items-center gap-1.5 text-amber-600 font-medium">
              <span className="size-2 rounded-full bg-amber-500 animate-ping" />
              <span>Saving draft updates...</span>
            </div>
          ) : lastSavedTime ? (
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>Draft auto-saved at {lastSavedTime}</span>
            </div>
          ) : null}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onPreviewPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#172554] text-xs font-semibold transition-all shadow-2xs hover:border-slate-300 cursor-pointer"
            title="Preview Printable Official Quotation"
          >
            <Printer className="size-3.5 text-[#4169E1]" />
            <span className="hidden sm:inline">Print / PDF Preview</span>
            <span className="sm:hidden">PDF</span>
          </button>

          {/* Conditional Next or Submit Action */}
          {currentStep === 7 && !isReadOnly && onSubmit ? (
            <button
              type="button"
              disabled={!canSubmit}
              onClick={onSubmit}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                canSubmit
                  ? "bg-[#4169E1] hover:bg-[#2347B5] active:bg-[#1E3FA8] text-white shadow-[#4169E1]/25 hover:scale-[1.01] cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              <Send className="size-3.5" />
              <span>Submit Official Quotation</span>
            </button>
          ) : currentStep < 8 ? (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] active:bg-[#1E3FA8] text-white text-xs font-bold transition-all shadow-md shadow-[#4169E1]/20 hover:scale-[1.01] cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="size-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>Review Quotation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

