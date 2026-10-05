import { useState } from "react";
import { ArrowLeft, Save, CheckCircle2, XCircle, RotateCcw, Edit } from "lucide-react";
import { BudgetApproval, ApprovalDecision } from "@/lib/procurement-master-data";

interface BudgetApprovalPageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: BudgetApproval | null;
  onSave: (data: BudgetApproval) => void;
  onCancel: () => void;
  onSwitchToEdit?: () => void;
}

export function BudgetApprovalPageForm({
  mode,
  initialData,
  onSave,
  onCancel,
  onSwitchToEdit,
}: BudgetApprovalPageFormProps) {
  const [formData, setFormData] = useState<Partial<BudgetApproval>>(() => {
    if (initialData) return { ...initialData };
    return {
      budgetCode: `BGT-${new Date().getFullYear()}-001`,
      budgetYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      department: "Information Technology",
      totalBudget: 5000000,
      submittedBy: "Tahmid Afsar Shapno",
      submittedDate: new Date().toISOString().split("T")[0],
      approvalLevel: "Level 1 — HOD Review",
      reviewer: "Md. Rafiqul Islam (Director)",
      decision: "Approved",
      remarks: "Recommended and approved within operational cap.",
    };
  });

  const isView = mode === "view";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    const payload: BudgetApproval = {
      id: initialData?.id || `bapp-${Date.now()}`,
      budgetId: initialData?.budgetId || `bgt-${Date.now()}`,
      budgetCode: formData.budgetCode || "",
      budgetYear: formData.budgetYear || `${new Date().getFullYear()}`,
      department: formData.department || "",
      totalBudget: Number(formData.totalBudget) || 0,
      submittedBy: formData.submittedBy || "",
      submittedDate: formData.submittedDate || new Date().toISOString().split("T")[0],
      approvalLevel: formData.approvalLevel || "Level 1",
      reviewer: formData.reviewer || "",
      decision: (formData.decision as ApprovalDecision) || "Approved",
      remarks: formData.remarks || "",
      approvalDate: new Date().toISOString().split("T")[0],
    };

    onSave(payload);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition shadow-2xs cursor-pointer"
            title="Back to Approvals"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Master Data / Budget Workflow Review
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  mode === "create"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : mode === "edit"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                }`}
              >
                {mode === "create" ? "New Decision" : mode === "edit" ? "Decision Review" : "Read-Only View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              {mode === "create"
                ? "Record Budget Decision"
                : mode === "edit"
                  ? `Review Decision — ${formData.budgetCode}`
                  : `Approval Details — ${formData.budgetCode}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to Approvals" : "Cancel"}
          </button>
          {isView && onSwitchToEdit ? (
            <button
              type="button"
              onClick={onSwitchToEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Edit className="size-3.5" />
              <span>Modify Decision</span>
            </button>
          ) : !isView ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>Submit Decision</span>
            </button>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-foreground pb-3 border-b border-border/60">
            Budget Approval Workflow Console
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Budget Code *</label>
              <input
                type="text"
                disabled={isView}
                value={formData.budgetCode || ""}
                onChange={(e) => setFormData({ ...formData, budgetCode: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Department</label>
              <input
                type="text"
                disabled={isView}
                value={formData.department || ""}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Total Budget (BDT)
              </label>
              <input
                type="number"
                disabled={isView}
                value={formData.totalBudget || 0}
                onChange={(e) => setFormData({ ...formData, totalBudget: Number(e.target.value) })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Submitted By</label>
              <input
                type="text"
                disabled={isView}
                value={formData.submittedBy || ""}
                onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Submitted Date</label>
              <input
                type="date"
                disabled={isView}
                value={formData.submittedDate || ""}
                onChange={(e) => setFormData({ ...formData, submittedDate: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Approval Level</label>
              <input
                type="text"
                disabled={isView}
                value={formData.approvalLevel || ""}
                onChange={(e) => setFormData({ ...formData, approvalLevel: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Reviewer</label>
              <input
                type="text"
                disabled={isView}
                value={formData.reviewer || ""}
                onChange={(e) => setFormData({ ...formData, reviewer: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Decision *</label>
              <select
                disabled={isView}
                value={formData.decision || "Approved"}
                onChange={(e) =>
                  setFormData({ ...formData, decision: e.target.value as ApprovalDecision })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="Approved">Approved</option>
                <option value="Under Review">Under Review</option>
                <option value="Returned">Returned with Queries</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold mb-1 text-foreground">
                Review Remarks / Instructions
              </label>
              <textarea
                rows={3}
                disabled={isView}
                value={formData.remarks || ""}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Audit notes, reason for return or approval conditions..."
                className="w-full p-2.5 rounded-lg border border-border/80 bg-background text-xs resize-none focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to Approvals" : "Cancel"}
          </button>
          {!isView && (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>Submit Decision</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
