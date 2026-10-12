import { useState } from "react";
import { ArrowLeft, Save, Building2, Edit } from "lucide-react";
import { BusinessType } from "@/lib/procurement-master-data";

interface BusinessTypePageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: BusinessType | null;
  onSave: (data: BusinessType) => void;
  onCancel: () => void;
  onSwitchToEdit?: () => void;
}

export function BusinessTypePageForm({
  mode,
  initialData,
  onSave,
  onCancel,
  onSwitchToEdit,
}: BusinessTypePageFormProps) {
  const [formData, setFormData] = useState<Partial<BusinessType>>(() => {
    if (initialData) return { ...initialData };
    return {
      typeCode: `BT-${Math.floor(100 + Math.random() * 900)}`,
      businessTypeName: "",
      description: "",
      status: "Active",
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isView = mode === "view";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    const errors: Record<string, string> = {};
    if (!formData.typeCode?.trim()) errors.typeCode = "Type Code is required";
    if (!formData.businessTypeName?.trim())
      errors.businessTypeName = "Business Type Name is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload: BusinessType = {
      id: initialData?.id || `bt-${Date.now()}`,
      typeCode: formData.typeCode?.trim() || `BT-${Date.now()}`,
      businessTypeName: formData.businessTypeName?.trim() || "",
      description: formData.description?.trim() || "",
      status: (formData.status as any) || "Active",
    };

    onSave(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition shadow-2xs cursor-pointer"
            title="Back to Business Types"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Master Data / Business Type
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
                {mode === "create" ? "New Business Type" : mode === "edit" ? "Edit Mode" : "Read-Only View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              {mode === "create"
                ? "Create Business Type"
                : mode === "edit"
                  ? `Edit Business Type — ${formData.businessTypeName || formData.typeCode}`
                  : `Business Type Details — ${formData.businessTypeName || formData.typeCode}`}
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
              <span>{mode === "create" ? "Save Business Type" : "Update Changes"}</span>
            </button>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Building2 className="size-4 text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">Business Type Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Type Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.typeCode || ""}
                onChange={(e) => setFormData({ ...formData, typeCode: e.target.value })}
                placeholder="e.g. BT-MFG, BT-DIST, BT-IMP"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.typeCode && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.typeCode}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Business Type Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.businessTypeName || ""}
                onChange={(e) => setFormData({ ...formData, businessTypeName: e.target.value })}
                placeholder="e.g. Manufacturing, Distributor, Direct Importer"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.businessTypeName && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.businessTypeName}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1 text-foreground">Description</label>
              <textarea
                disabled={isView}
                rows={3}
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this commercial business type and applicable vendor scopes..."
                className="w-full p-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
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
      </form>
    </div>
  );
}
