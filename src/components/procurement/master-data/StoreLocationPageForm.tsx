import { useState } from "react";
import { ArrowLeft, Save, Layers, Edit } from "lucide-react";
import { StoreLocation, WarehouseStore } from "@/lib/procurement-master-data";

interface StoreLocationPageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: StoreLocation | null;
  warehouses: WarehouseStore[];
  onSave: (data: StoreLocation) => void;
  onCancel: () => void;
  onSwitchToEdit?: () => void;
}

export function StoreLocationPageForm({
  mode,
  initialData,
  warehouses,
  onSave,
  onCancel,
  onSwitchToEdit,
}: StoreLocationPageFormProps) {
  const [formData, setFormData] = useState<Partial<StoreLocation>>(() => {
    if (initialData) return { ...initialData };
    return {
      trackingMode: "Location",
      locationTrackingEnabled: true,
      batchTrackingEnabled: false,
      store: warehouses[0]?.storeName || "PKCL Central Raw Material Warehouse",
      locationCode: `LOC-${Math.floor(100 + Math.random() * 900)}`,
      locationName: "Rack A - Shelf 01",
      locationType: "Rack",
      locationStatus: "Active",
      batchNumbering: `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createDate: new Date().toISOString().split("T")[0],
      expireDate: `${new Date().getFullYear() + 2}-12-31`,
      batchStatus: "Active",
      status: "Active",
      capacity: 500,
      capacityUOM: "KG",
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isView = mode === "view";

  const handleTrackingModeToggle = (modeType: "Location" | "Batch") => {
    if (isView) return;
    setFormData((prev) => ({
      ...prev,
      trackingMode: modeType,
      locationTrackingEnabled: modeType === "Location",
      batchTrackingEnabled: modeType === "Batch",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    const errors: Record<string, string> = {};
    if (formData.trackingMode === "Location") {
      if (!formData.locationCode?.trim()) errors.locationCode = "Location Code is required";
      if (!formData.locationName?.trim()) errors.locationName = "Location Name is required";
    } else {
      if (!formData.batchNumbering?.trim()) errors.batchNumbering = "Batch Numbering is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload: StoreLocation = {
      id: initialData?.id || `loc-${Date.now()}`,
      trackingMode: formData.trackingMode || "Location",
      locationTrackingEnabled: formData.trackingMode === "Location",
      batchTrackingEnabled: formData.trackingMode === "Batch",
      store: formData.store || warehouses[0]?.storeName || "",
      locationCode: formData.locationCode || "",
      locationName: formData.locationName || "",
      locationType: (formData.locationType as any) || "Rack",
      locationStatus: (formData.locationStatus as any) || "Active",
      batchNumbering: formData.batchNumbering || "",
      createDate: formData.createDate || new Date().toISOString().split("T")[0],
      expireDate: formData.expireDate || "",
      batchStatus: (formData.batchStatus as any) || "Active",
      status: (formData.status as any) || "Active",
      capacity: Number(formData.capacity) || 0,
      capacityUOM: formData.capacityUOM || "KG",
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
            title="Back to Locations"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Master Data / Store Location & Batch Configuration
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
                {mode === "create" ? "New Entry" : mode === "edit" ? "Edit Mode" : "Read-Only View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              {mode === "create"
                ? "Configure Location / Batch"
                : mode === "edit"
                  ? `Edit Location / Batch — ${formData.locationCode || formData.batchNumbering}`
                  : `Location / Batch Details — ${formData.locationCode || formData.batchNumbering}`}
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
              <span>{mode === "create" ? "Save Record" : "Update Record"}</span>
            </button>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-amber-500" />
              <h2 className="text-sm font-bold text-foreground">Configuration Mode</h2>
            </div>
            {!isView && (
              <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleTrackingModeToggle("Location")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    formData.trackingMode === "Location"
                      ? "bg-amber-500 text-white shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Location Tracking
                </button>
                <button
                  type="button"
                  onClick={() => handleTrackingModeToggle("Batch")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    formData.trackingMode === "Batch"
                      ? "bg-amber-500 text-white shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Batch Tracking
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Target Store</label>
              <select
                disabled={isView}
                value={formData.store || ""}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.storeName}>
                    {w.storeName}
                  </option>
                ))}
              </select>
            </div>

            {formData.trackingMode === "Location" ? (
              <>
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">
                    Location Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isView}
                    value={formData.locationCode || ""}
                    onChange={(e) => setFormData({ ...formData, locationCode: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                  />
                  {formErrors.locationCode && (
                    <p className="text-[10px] text-rose-500 mt-1">{formErrors.locationCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">
                    Location Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isView}
                    value={formData.locationName || ""}
                    onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">Location Type</label>
                  <select
                    disabled={isView}
                    value={formData.locationType || "Rack"}
                    onChange={(e) => setFormData({ ...formData, locationType: e.target.value as any })}
                    className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                  >
                    <option value="Rack">Rack</option>
                    <option value="Shelf">Shelf</option>
                    <option value="Bin">Bin</option>
                    <option value="Floor">Floor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">
                    Batch Numbering <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isView}
                    value={formData.batchNumbering || ""}
                    onChange={(e) => setFormData({ ...formData, batchNumbering: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">Create Date</label>
                  <input
                    type="date"
                    disabled={isView}
                    value={formData.createDate || ""}
                    onChange={(e) => setFormData({ ...formData, createDate: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">Expire Date</label>
                  <input
                    type="date"
                    disabled={isView}
                    value={formData.expireDate || ""}
                    onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                  />
                </div>
              </>
            )}

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
            {isView ? "Back to List" : "Cancel"}
          </button>
          {!isView && (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>{mode === "create" ? "Save Record" : "Update Record"}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
