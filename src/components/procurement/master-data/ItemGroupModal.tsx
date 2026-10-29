import React, { useState, useEffect } from "react";
import { X, FolderTree, Save } from "lucide-react";
import { ItemGroup } from "@/lib/procurement-master-data";

interface ItemGroupModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialData?: Partial<ItemGroup> | null;
  onSave: (group: ItemGroup) => void;
  onClose: () => void;
}

export function ItemGroupModal({
  isOpen,
  mode,
  initialData,
  onSave,
  onClose,
}: ItemGroupModalProps) {
  const [formData, setFormData] = useState<Partial<ItemGroup>>({
    groupCode: `GRP-${Math.floor(100 + Math.random() * 900)}`,
    groupName: "",
    description: "",
    serviceFlag: false,
    status: "Active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          status: initialData.status || "Active",
          serviceFlag: !!initialData.serviceFlag,
        });
      } else {
        setFormData({
          groupCode: `GRP-${Math.floor(100 + Math.random() * 900)}`,
          groupName: "",
          description: "",
          serviceFlag: false,
          status: "Active",
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.groupCode?.trim()) newErrors.groupCode = "Group Code is required";
    if (!formData.groupName?.trim()) newErrors.groupName = "Group Name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: ItemGroup = {
      id: initialData?.id || `grp-${Date.now()}`,
      groupCode: formData.groupCode?.trim() || `GRP-${Date.now()}`,
      groupName: formData.groupName?.trim() || "",
      description: formData.description?.trim() || "",
      serviceFlag: !!formData.serviceFlag,
      status: (formData.status as any) || "Active",
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FolderTree className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground">
                {mode === "create" ? "Create Main Item Group" : "Edit Item Group"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {mode === "create"
                  ? "Define a top-level parent group in the item hierarchy"
                  : "Update item group metadata and configurations"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Group Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.groupCode || ""}
                onChange={(e) => setFormData({ ...formData, groupCode: e.target.value })}
                placeholder="e.g. GRP-001"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none"
              />
              {errors.groupCode && (
                <p className="text-[10px] text-rose-500 mt-1">{errors.groupCode}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Group Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.groupName || ""}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                placeholder="e.g. Raw Material, Spare Parts"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
              />
              {errors.groupName && (
                <p className="text-[10px] text-rose-500 mt-1">{errors.groupName}</p>
              )}
            </div>



            <div className="flex items-center gap-2 pt-1 sm:col-span-2">
              <input
                type="checkbox"
                id="serviceFlag"
                checked={!!formData.serviceFlag}
                onChange={(e) => setFormData({ ...formData, serviceFlag: e.target.checked })}
                className="size-4 rounded border-border text-amber-500 focus:ring-amber-500/20"
              />
              <label htmlFor="serviceFlag" className="text-xs font-semibold text-foreground cursor-pointer">
                Service Item Group (Non-physical goods or external services)
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Status</label>
              <select
                value={formData.status || "Active"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border/70 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{mode === "create" ? "Save Group" : "Update Group"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
