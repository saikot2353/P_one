import { useState } from "react";
import { ArrowLeft, Save, Globe, Edit } from "lucide-react";
import { Origin } from "@/lib/procurement-master-data";

interface OriginMasterPageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Origin | null;
  onSave: (data: Origin) => void;
  onCancel: () => void;
  onSwitchToEdit?: () => void;
}

export function OriginMasterPageForm({
  mode,
  initialData,
  onSave,
  onCancel,
  onSwitchToEdit,
}: OriginMasterPageFormProps) {
  const [formData, setFormData] = useState<Partial<Origin>>(() => {
    if (initialData) return { ...initialData };
    return {
      originCode: `ORG-${Math.floor(100 + Math.random() * 900)}`,
      originName: "",
      status: "Active",
      description: "",
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isView = mode === "view";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    const errors: Record<string, string> = {};
    if (!formData.originName?.trim()) errors.originName = "Origin Name is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload: Origin = {
      id: initialData?.id || `org-${Date.now()}`,
      originCode: formData.originCode?.trim() || initialData?.originCode || `ORG-${Math.floor(100 + Math.random() * 900)}`,
      originName: formData.originName || "",
      status: (formData.status as any) || "Active",
      description: formData.description || "",
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
            title="Back to Origin List"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Master Data / Origin Master
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
                {mode === "create" ? "New Origin" : mode === "edit" ? "Edit Mode" : "Read-Only View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              {mode === "create"
                ? "Create Origin"
                : mode === "edit"
                  ? `Edit Origin — ${formData.originName || formData.originCode}`
                  : `Origin Details — ${formData.originName || formData.originCode}`}
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
              <span>Edit Origin</span>
            </button>
          ) : !isView ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{mode === "create" ? "Save Origin" : "Update Origin"}</span>
            </button>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Globe className="size-4 text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">Origin Master Details</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Origin Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.originName || ""}
                onChange={(e) => setFormData({ ...formData, originName: e.target.value })}
                placeholder="e.g. Bangladesh, Germany, Japan"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.originName && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.originName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Status</label>
              <select
                disabled={isView}
                value={formData.status || "Active"}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 max-w-3xl">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to Origin List" : "Cancel"}
          </button>
          {!isView && (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>{mode === "create" ? "Save Origin" : "Update Origin"}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
