import { useState } from "react";
import { ArrowLeft, Save, Tags, Edit } from "lucide-react";
import { VendorCategory } from "@/lib/procurement-master-data";

interface VendorCategoryPageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: VendorCategory | null;
  onSave: (data: VendorCategory) => void;
  onCancel: () => void;
  onSwitchToEdit?: () => void;
}

export function VendorCategoryPageForm({
  mode,
  initialData,
  onSave,
  onCancel,
  onSwitchToEdit,
}: VendorCategoryPageFormProps) {
  const [formData, setFormData] = useState<Partial<VendorCategory>>(() => {
    if (initialData) return { ...initialData };
    return {
      categoryCode: `VCAT-${Math.floor(100 + Math.random() * 900)}`,
      categoryName: "",
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
    if (!formData.categoryName?.trim()) errors.categoryName = "Category Name is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload: VendorCategory = {
      id: initialData?.id || `vcat-${Date.now()}`,
      categoryCode: formData.categoryCode || `VCAT-${Date.now()}`,
      categoryName: formData.categoryName || "",
      description: formData.description || "",
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
            title="Back to Vendor Categories"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Master Data / Vendor Category
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
                {mode === "create" ? "New Category" : mode === "edit" ? "Edit Mode" : "Read-Only View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              {mode === "create"
                ? "Create Vendor Category"
                : mode === "edit"
                  ? `Edit Category — ${formData.categoryName || formData.categoryCode}`
                  : `Category Details — ${formData.categoryName || formData.categoryCode}`}
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
              <span>Edit Category</span>
            </button>
          ) : !isView ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{mode === "create" ? "Save Category" : "Update Category"}</span>
            </button>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Tags className="size-4 text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">Category Specification</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.categoryName || ""}
                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                placeholder="e.g. Yarn Manufacturers, Chemical Suppliers"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.categoryName && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.categoryName}</p>
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

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to List" : "Cancel"}
          </button>
          {!isView && (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>{mode === "create" ? "Save Category" : "Update Category"}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
