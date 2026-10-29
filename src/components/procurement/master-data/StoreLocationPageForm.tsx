import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Save, Layers, Edit, CheckSquare, Layers2 } from "lucide-react";
import { StoreLocation, WarehouseStore } from "@/lib/procurement-master-data";
import { getOrgAreaSections, AreaSectionOption } from "./WarehouseStorePageForm";

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
    if (initialData) {
      return {
        ...initialData,
        defaultLocationName:
          initialData.trackingMode === "Location" ? !!initialData.defaultLocationName : false,
      };
    }
    const firstStore = warehouses[0]?.storeName || "PKCL Central Raw Material Warehouse";
    return {
      trackingMode: "Location",
      locationTrackingEnabled: true,
      batchTrackingEnabled: false,
      defaultLocationName: false,
      store: firstStore,
      companyAreaSection: warehouses[0]?.companyAreaSection || "",
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

  // Selected warehouse for organization-based company area/section options
  const selectedWarehouse = useMemo(() => {
    return (
      warehouses.find(
        (w) =>
          w.storeName === formData.store ||
          w.storeCode === formData.store ||
          w.id === formData.store
      ) || warehouses[0]
    );
  }, [warehouses, formData.store]);

  // Load area & section options using exact same logic from WarehouseStorePageForm
  const availableAreaSections = useMemo<AreaSectionOption[]>(() => {
    const org = selectedWarehouse?.organization || "Pakiza Software Limited";
    return getOrgAreaSections(org);
  }, [selectedWarehouse]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        defaultLocationName:
          initialData.trackingMode === "Location" ? !!initialData.defaultLocationName : false,
      });
    } else {
      const firstStore = warehouses[0]?.storeName || "PKCL Central Raw Material Warehouse";
      setFormData({
        trackingMode: "Location",
        locationTrackingEnabled: true,
        batchTrackingEnabled: false,
        defaultLocationName: false,
        store: firstStore,
        companyAreaSection: warehouses[0]?.companyAreaSection || "",
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
      });
    }
    setFormErrors({});
  }, [initialData, mode, warehouses]);

  // If companyAreaSection not set or changed, sync if appropriate
  useEffect(() => {
    if (!formData.companyAreaSection && availableAreaSections.length > 0) {
      const defaultVal =
        selectedWarehouse?.companyAreaSection ||
        availableAreaSections[0]?.value ||
        "";
      if (defaultVal) {
        setFormData((prev) => ({ ...prev, companyAreaSection: defaultVal }));
      }
    }
  }, [availableAreaSections, selectedWarehouse, formData.companyAreaSection]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isView = mode === "view";

  const handleTrackingModeToggle = (modeType: "Location" | "Batch") => {
    if (isView) return;
    setFormData((prev) => ({
      ...prev,
      trackingMode: modeType,
      locationTrackingEnabled: modeType === "Location",
      batchTrackingEnabled: modeType === "Batch",
      defaultLocationName: modeType === "Location" ? (prev.defaultLocationName ?? false) : false,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    const finalLocationCode =
      formData.locationCode?.trim() ||
      initialData?.locationCode ||
      `LOC-${Math.floor(100 + Math.random() * 900)}`;
    const errors: Record<string, string> = {};
    if (formData.trackingMode === "Location") {
      if (!formData.locationName?.trim()) errors.locationName = "Location Name is required";
    } else {
      if (!formData.batchNumbering?.trim()) errors.batchNumbering = "Batch Numbering is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const matchedArea = availableAreaSections.find(
      (a) => a.value === formData.companyAreaSection || a.label === formData.companyAreaSection
    );
    const resolvedAreaName = matchedArea ? matchedArea.label : (formData.companyAreaSection || "");

    const payload: StoreLocation = {
      id: initialData?.id || `loc-${Date.now()}`,
      trackingMode: formData.trackingMode || "Location",
      locationTrackingEnabled: formData.trackingMode === "Location",
      batchTrackingEnabled: formData.trackingMode === "Batch",
      store: formData.store || warehouses[0]?.storeName || "",
      companyAreaSection: formData.companyAreaSection || "",
      companyAreaSectionName: resolvedAreaName,
      locationCode: finalLocationCode,
      locationName: formData.locationName || "",
      locationType: (formData.locationType as any) || "Rack",
      locationStatus: (formData.locationStatus as any) || "Active",
      defaultLocationName:
        formData.trackingMode === "Location" ? !!formData.defaultLocationName : false,
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
      {/* Top Header */}
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

      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-5">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-amber-500" />
              <h2 className="text-sm font-bold text-foreground">
                Location & Batch Details
              </h2>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">
              Standard 2-row configuration layout
            </span>
          </div>

          {/* ROW 1: Tracking Mode | Target Store | Company Area/Section | Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {/* 1. Tracking Mode Toggle (Moved immediately to the left of Target Store) */}
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Tracking Mode
              </label>
              <div className="grid grid-cols-2 h-9 p-0.5 rounded-lg border border-border/80 bg-muted/60">
                <button
                  type="button"
                  disabled={isView}
                  onClick={() => handleTrackingModeToggle("Location")}
                  className={`h-full text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-1 ${
                    formData.trackingMode === "Location"
                      ? "bg-amber-500 text-white shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  } disabled:cursor-not-allowed`}
                >
                  <span>Location</span>
                </button>
                <button
                  type="button"
                  disabled={isView}
                  onClick={() => handleTrackingModeToggle("Batch")}
                  className={`h-full text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-1 ${
                    formData.trackingMode === "Batch"
                      ? "bg-amber-500 text-white shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  } disabled:cursor-not-allowed`}
                >
                  <span>Batch</span>
                </button>
              </div>
            </div>

            {/* 2. Target Store */}
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Target Store <span className="text-rose-500">*</span>
              </label>
              <select
                disabled={isView}
                value={formData.store || ""}
                onChange={(e) => {
                  const newStore = e.target.value;
                  const targetWh = warehouses.find(
                    (w) => w.storeName === newStore || w.storeCode === newStore
                  );
                  setFormData({
                    ...formData,
                    store: newStore,
                    companyAreaSection: targetWh?.companyAreaSection || formData.companyAreaSection,
                  });
                }}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.storeName}>
                    {w.storeName}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Company Area/Section */}
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Company Area/Section
              </label>
              <select
                disabled={isView || availableAreaSections.length === 0}
                value={formData.companyAreaSection || ""}
                onChange={(e) =>
                  setFormData({ ...formData, companyAreaSection: e.target.value })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                {availableAreaSections.length === 0 ? (
                  <option value="">No Area/Section available</option>
                ) : (
                  availableAreaSections.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* 4. Status */}
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

          {/* ROW 2: Conditional Fields (Location Tracking vs Batch Tracking) */}
          {formData.trackingMode === "Location" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start pt-2 border-t border-border/40">
              {/* Col 1: Location Name (Location Code hidden from visible form) */}
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">
                  Location Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isView}
                  value={formData.locationName || ""}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  placeholder="e.g. Rack A - Shelf 01"
                  className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                />
                {formErrors.locationName && (
                  <p className="text-[10px] text-rose-500 mt-1">{formErrors.locationName}</p>
                )}
              </div>

              {/* Col 2: Location Type */}
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">
                  Location Type
                </label>
                <select
                  disabled={isView}
                  value={formData.locationType || "Rack"}
                  onChange={(e) =>
                    setFormData({ ...formData, locationType: e.target.value as any })
                  }
                  className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                >
                  <option value="Rack">Rack</option>
                  <option value="Shelf">Shelf</option>
                  <option value="Bin">Bin</option>
                  <option value="Floor">Floor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Col 3: Default Location Name Checkbox */}
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">
                  Default Flag
                </label>
                <label className="h-9 px-3 rounded-lg border border-border/80 bg-background flex items-center gap-2 cursor-pointer select-none hover:bg-muted/20 transition-colors">
                  <input
                    type="checkbox"
                    id="defaultLocationName"
                    disabled={isView}
                    checked={!!formData.defaultLocationName}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultLocationName: e.target.checked })
                    }
                    className="size-4 rounded border-border text-amber-500 focus:ring-amber-500/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <span className="text-xs font-semibold text-foreground">
                    Default Location Name
                  </span>
                </label>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start pt-2 border-t border-border/40">
              {/* Col 1: Batch Numbering */}
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">
                  Batch Numbering <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isView}
                  value={formData.batchNumbering || ""}
                  onChange={(e) => setFormData({ ...formData, batchNumbering: e.target.value })}
                  placeholder="e.g. BATCH-2026-001"
                  className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                />
                {formErrors.batchNumbering && (
                  <p className="text-[10px] text-rose-500 mt-1">{formErrors.batchNumbering}</p>
                )}
              </div>

              {/* Col 2: Create Date */}
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

              {/* Col 3: Expire Date */}
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

              {/* Col 4: Batch Status / Identifier Indicator */}
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">
                  Batch Status
                </label>
                <select
                  disabled={isView}
                  value={formData.batchStatus || "Active"}
                  onChange={(e) => setFormData({ ...formData, batchStatus: e.target.value as any })}
                  className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
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
