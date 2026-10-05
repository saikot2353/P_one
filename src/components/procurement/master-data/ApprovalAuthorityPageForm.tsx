import { useState } from "react";
import { ArrowLeft, Save, ShieldCheck, Edit } from "lucide-react";
import { ApprovalAuthority } from "@/lib/procurement-master-data";

interface ApprovalAuthorityPageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: ApprovalAuthority | null;
  companyList: string[];
  onSave: (data: ApprovalAuthority) => void;
  onCancel: () => void;
  onSwitchToEdit?: () => void;
}

export function ApprovalAuthorityPageForm({
  mode,
  initialData,
  companyList,
  onSave,
  onCancel,
  onSwitchToEdit,
}: ApprovalAuthorityPageFormProps) {
  const [formData, setFormData] = useState<Partial<ApprovalAuthority>>(() => {
    if (initialData) return { ...initialData };
    return {
      authorityCode: `AUTH-LVL-${Math.floor(1 + Math.random() * 5)}`,
      authorityName: "",
      organization: companyList[0] || "Pakiza Knit Composite Ltd",
      department: "Procurement & Commercial",
      roleDesignation: "",
      approvalType: "Purchase Order",
      minimumAmount: 0,
      maximumAmount: 100000,
      approvalLevel: 1,
      effectiveFrom: "2026-01-01",
      effectiveTo: "2030-12-31",
      status: "Active",
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isView = mode === "view";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    const errors: Record<string, string> = {};
    if (!formData.authorityCode?.trim()) errors.authorityCode = "Authority Code is required";
    if (!formData.authorityName?.trim()) errors.authorityName = "Authority Name / Title is required";
    if (!formData.roleDesignation?.trim()) errors.roleDesignation = "Role / Designation is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload: ApprovalAuthority = {
      id: initialData?.id || `auth-${Date.now()}`,
      authorityCode: formData.authorityCode || `AUTH-${Date.now()}`,
      authorityName: formData.authorityName || "",
      organization: formData.organization || companyList[0] || "Pakiza Knit Composite Ltd",
      department: formData.department || "General",
      roleDesignation: formData.roleDesignation || "",
      approvalType: formData.approvalType as any || "Purchase Order",
      minimumAmount: Number(formData.minimumAmount) || 0,
      maximumAmount: Number(formData.maximumAmount) || 0,
      approvalLevel: Number(formData.approvalLevel) || 1,
      effectiveFrom: formData.effectiveFrom || "2026-01-01",
      effectiveTo: formData.effectiveTo || "2030-12-31",
      status: formData.status as any || "Active",
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
            title="Back to Authority List"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Master Data / Approval Authority Rules
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
                {mode === "create" ? "New Authority" : mode === "edit" ? "Edit Mode" : "Read-Only View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              {mode === "create"
                ? "Configure Approval Authority"
                : mode === "edit"
                  ? `Edit Authority Tier — ${formData.authorityCode}`
                  : `Authority Tier Details — ${formData.authorityCode}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to List" : "Cancel"}
          </button>
          {isView && onSwitchToEdit ? (
            <button
              type="button"
              onClick={onSwitchToEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Edit className="size-3.5" />
              <span>Edit Record</span>
            </button>
          ) : !isView ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{mode === "create" ? "Save Authority" : "Update Authority"}</span>
            </button>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <ShieldCheck className="size-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-foreground">Monetary Tier & Designation Authority</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Authority Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.authorityCode || ""}
                onChange={(e) => setFormData({ ...formData, authorityCode: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.authorityCode && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.authorityCode}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1 text-foreground">
                Authority Name / Description <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.authorityName || ""}
                onChange={(e) => setFormData({ ...formData, authorityName: e.target.value })}
                placeholder="e.g. Assistant General Manager - Procurement PO Limit"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.authorityName && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.authorityName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Organization</label>
              <select
                disabled={isView}
                value={formData.organization || companyList[0] || ""}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                {companyList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
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
                Role / Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.roleDesignation || ""}
                onChange={(e) => setFormData({ ...formData, roleDesignation: e.target.value })}
                placeholder="e.g. Chief Operating Officer"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.roleDesignation && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.roleDesignation}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Approval Type</label>
              <select
                disabled={isView}
                value={formData.approvalType || "Purchase Order"}
                onChange={(e) => setFormData({ ...formData, approvalType: e.target.value as any })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="Purchase Requisition">Purchase Requisition</option>
                <option value="Purchase Order">Purchase Order</option>
                <option value="Budget">Budget</option>
                <option value="Supplier Bill">Supplier Bill</option>
                <option value="Payment Voucher">Payment Voucher</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Minimum Amount (BDT)
              </label>
              <input
                type="number"
                disabled={isView}
                value={formData.minimumAmount ?? 0}
                onChange={(e) => setFormData({ ...formData, minimumAmount: Number(e.target.value) })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Maximum Amount (BDT)
              </label>
              <input
                type="number"
                disabled={isView}
                value={formData.maximumAmount ?? 100000}
                onChange={(e) => setFormData({ ...formData, maximumAmount: Number(e.target.value) })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Approval Level / Tier</label>
              <input
                type="number"
                disabled={isView}
                value={formData.approvalLevel ?? 1}
                onChange={(e) => setFormData({ ...formData, approvalLevel: Number(e.target.value) })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Status</label>
              <select
                disabled={isView}
                value={formData.status || "Active"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to Authority List" : "Cancel"}
          </button>
          {!isView && (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>{mode === "create" ? "Save Authority" : "Update Authority"}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
