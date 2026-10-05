import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Package,
  Ruler,
  Layers,
  Edit,
  FolderTree,
  Building2,
  Plus,
  Trash2,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  ItemProductMaster,
  ItemSubGroup,
  ItemCategory,
  Brand,
  Origin,
  UOM,
  WarehouseStore,
} from "@/lib/procurement-master-data";

interface ItemCreationPageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: ItemProductMaster | null;
  targetSubGroup?: ItemSubGroup | null;
  subGroupBreadcrumb?: string;
  itemCategories: ItemCategory[];
  brands: Brand[];
  origins: Origin[];
  uoms: UOM[];
  warehouses: WarehouseStore[];
  onSave: (data: ItemProductMaster) => void;
  onCancel: () => void;
  onSwitchToEdit?: () => void;
}

// Reusable Searchable Combobox Component
interface SearchableOption {
  value: string;
  label: string;
  subLabel?: string;
}

interface SearchableSelectProps {
  label: string;
  required?: boolean;
  value: string;
  disabled?: boolean;
  placeholder?: string;
  options: SearchableOption[];
  onChange: (value: string) => void;
}

function SearchableSelect({
  label,
  required,
  value,
  disabled,
  placeholder = "Select...",
  options,
  onChange,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.subLabel && o.subLabel.toLowerCase().includes(q)),
    );
  }, [options, search]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-bold mb-1 text-foreground">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            setSearch("");
          }
        }}
        className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none flex items-center justify-between text-left disabled:bg-muted/50 disabled:text-foreground cursor-pointer"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : <span className="text-muted-foreground">{placeholder}</span>}
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground shrink-0 ml-1" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-card rounded-xl border border-border shadow-xl p-2 space-y-1 max-h-56 flex flex-col">
          <div className="relative shrink-0">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 h-7.5 rounded-lg border border-border/80 bg-muted/40 text-xs font-medium focus:border-amber-500 outline-none"
            />
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-border/40 pr-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-3 text-center text-xs text-muted-foreground">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full py-1.5 px-2.5 rounded-md text-xs font-medium text-left flex items-center justify-between hover:bg-amber-500/10 hover:text-amber-600 transition cursor-pointer ${
                    opt.value === value
                      ? "bg-amber-500/15 text-amber-600 font-bold"
                      : "text-foreground"
                  }`}
                >
                  <div className="truncate">
                    <span className="truncate">{opt.label}</span>
                    {opt.subLabel && (
                      <span className="text-[10px] text-muted-foreground ml-1.5 font-normal">
                        ({opt.subLabel})
                      </span>
                    )}
                  </div>
                  {opt.value === value && <Check className="size-3 text-amber-500 shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ItemCreationPageForm({
  mode,
  initialData,
  targetSubGroup,
  subGroupBreadcrumb,
  itemCategories,
  brands,
  origins,
  uoms,
  warehouses,
  onSave,
  onCancel,
  onSwitchToEdit,
}: ItemCreationPageFormProps) {
  const [formData, setFormData] = useState<Partial<ItemProductMaster>>(() => {
    if (initialData) {
      const existingWarehouses =
        initialData.warehouses && initialData.warehouses.length > 0
          ? initialData.warehouses
          : initialData.defaultWarehouse
            ? [
                {
                  id: `wh-item-1`,
                  warehouseName: initialData.defaultWarehouse,
                  binLocation: initialData.defaultBin || "Main Bay",
                  isPrimary: true,
                },
              ]
            : [
                {
                  id: `wh-item-1`,
                  warehouseName: warehouses[0]?.storeName || "Central Warehouse",
                  binLocation: "A-01",
                  isPrimary: true,
                },
              ];
      return {
        ...initialData,
        warehouses: existingWarehouses,
        conversionFactor: initialData.conversionFactor ?? 1,
      };
    }

    return {
      itemCode: `ITM-${Math.floor(1000 + Math.random() * 9000)}`,
      itemName: "",
      subGroupId: targetSubGroup?.id || "",
      subGroupName: targetSubGroup?.subGroupName || "",
      subGroupBreadcrumb: subGroupBreadcrumb || "",
      itemCategoryId: itemCategories[0]?.id || "",
      itemCategory: itemCategories[0]?.categoryName || "",
      brand: brands[0]?.brandName || "",
      model: "",
      partNumber: "",
      origin: origins[0]?.originName || "Bangladesh",
      status: "Active",
      specification: "",
      purchaseUOM: uoms[0]?.uomCode || "PCS",
      stockUOM: uoms[0]?.uomCode || "PCS",
      conversionFactor: 1,
      minimumStock: 10,
      maximumStock: 100,
      reorderLevel: 20,
      safetyStock: 15,
      batchTrackingRequired: false,
      serialNumberTrackingRequired: false,
      warehouses: [
        {
          id: `wh-item-${Date.now()}`,
          warehouseName: warehouses[0]?.storeName || "Central Raw Material Warehouse",
          binLocation: "Bay-1",
          isPrimary: true,
        },
      ],
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isView = mode === "view";

  // Searchable Options
  const brandOptions: SearchableOption[] = useMemo(
    () =>
      brands.map((b) => ({
        value: b.brandName,
        label: b.brandName,
        subLabel: b.countryOfOrigin,
      })),
    [brands],
  );

  const originOptions: SearchableOption[] = useMemo(
    () =>
      origins.map((o) => ({
        value: o.originName,
        label: o.originName,
        subLabel: o.originCode,
      })),
    [origins],
  );

  const uomOptions: SearchableOption[] = useMemo(
    () =>
      uoms.map((u) => ({
        value: u.uomCode,
        label: `${u.uomCode} — ${u.uomName}`,
        subLabel: u.uomType,
      })),
    [uoms],
  );

  const handleCategoryChange = (catName: string) => {
    const cat = itemCategories.find((c) => c.categoryName === catName);
    setFormData((prev) => ({
      ...prev,
      itemCategory: catName,
      itemCategoryId: cat?.id || prev.itemCategoryId,
    }));
  };

  // Multiple Warehouse Management
  const handleAddWarehouseRow = () => {
    if (isView) return;
    const newEntry = {
      id: `wh-item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      warehouseName: warehouses[0]?.storeName || "Central Store",
      binLocation: "",
      isPrimary: (formData.warehouses || []).length === 0,
    };
    setFormData((prev) => ({
      ...prev,
      warehouses: [...(prev.warehouses || []), newEntry],
    }));
  };

  const handleRemoveWarehouseRow = (id: string) => {
    if (isView) return;
    setFormData((prev) => ({
      ...prev,
      warehouses: (prev.warehouses || []).filter((w) => w.id !== id),
    }));
  };

  const handleUpdateWarehouseRow = (id: string, field: string, value: any) => {
    if (isView) return;
    setFormData((prev) => {
      const updated = (prev.warehouses || []).map((w) => {
        if (w.id === id) {
          return { ...w, [field]: value };
        }
        if (field === "isPrimary" && value === true) {
          // ensure only one primary
          return { ...w, isPrimary: false };
        }
        return w;
      });
      return { ...prev, warehouses: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    const errors: Record<string, string> = {};
    if (!formData.itemCode?.trim()) errors.itemCode = "Item Code is required";
    if (!formData.itemName?.trim()) errors.itemName = "Item Name is required";
    if (!formData.itemCategory?.trim()) errors.itemCategory = "Item Category is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const primaryWh =
      formData.warehouses?.find((w) => w.isPrimary)?.warehouseName ||
      formData.warehouses?.[0]?.warehouseName ||
      "";

    const payload: ItemProductMaster = {
      id: initialData?.id || `itm-${Date.now()}`,
      itemCode: formData.itemCode || `ITM-${Date.now()}`,
      itemName: formData.itemName || "",
      subGroupId: targetSubGroup?.id || formData.subGroupId || "",
      subGroupName: targetSubGroup?.subGroupName || formData.subGroupName || "",
      subGroupBreadcrumb: subGroupBreadcrumb || formData.subGroupBreadcrumb || "",
      itemCategoryId: formData.itemCategoryId || itemCategories[0]?.id || "",
      itemCategory: formData.itemCategory || itemCategories[0]?.categoryName || "",
      brand: formData.brand || "",
      model: formData.model || "",
      partNumber: formData.partNumber || "",
      origin: formData.origin || origins[0]?.originName || "Bangladesh",
      status: formData.status || "Active",
      specification: formData.specification || "",
      purchaseUOM: formData.purchaseUOM || "PCS",
      stockUOM: formData.stockUOM || "PCS",
      conversionFactor: Number(formData.conversionFactor) || 1,
      minimumStock: Number(formData.minimumStock) || 0,
      maximumStock: Number(formData.maximumStock) || 0,
      reorderLevel: Number(formData.reorderLevel) || 0,
      safetyStock: Number(formData.safetyStock) || 0,
      batchTrackingRequired: !!formData.batchTrackingRequired,
      serialNumberTrackingRequired: !!formData.serialNumberTrackingRequired,
      defaultWarehouse: primaryWh,
      warehouses: formData.warehouses || [],
    };

    onSave(payload);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition shadow-2xs cursor-pointer"
            title="Back to Item Creation Tree"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Master Data / Item Creation
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
                {mode === "create" ? "New Item" : mode === "edit" ? "Edit Mode" : "Read-Only View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              {mode === "create"
                ? `Create Item under "${targetSubGroup?.subGroupName || formData.subGroupName || "Sub Group"}"`
                : mode === "edit"
                  ? `Edit Item — ${formData.itemName || formData.itemCode}`
                  : `Item Details — ${formData.itemName || formData.itemCode}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to Tree" : "Cancel"}
          </button>
          {isView && onSwitchToEdit ? (
            <button
              type="button"
              onClick={onSwitchToEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Edit className="size-3.5" />
              <span>Edit Item</span>
            </button>
          ) : !isView ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{mode === "create" ? "Save Item" : "Update Item"}</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Target Sub Group Breadcrumb Card */}
      {(targetSubGroup || formData.subGroupName) && (
        <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <FolderTree className="size-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-amber-700 dark:text-amber-400">
              Assigned Parent Sub Group:
            </span>
            <span className="ml-2 font-mono font-bold text-foreground">
              {subGroupBreadcrumb ||
                formData.subGroupBreadcrumb ||
                targetSubGroup?.subGroupName ||
                formData.subGroupName}
            </span>
            <span className="ml-2 text-[10px] text-muted-foreground">
              (Item is permanently classified under this tree node)
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Item Information */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Package className="size-4 text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">Item Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Item Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.itemCode || ""}
                onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.itemCode && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.itemCode}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1 text-foreground">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.itemName || ""}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                placeholder="e.g. Dell Latitude 5440 Laptop 14-inch Core i7"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.itemName && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.itemName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Item Category <span className="text-rose-500">*</span>
              </label>
              <select
                disabled={isView}
                value={formData.itemCategory || ""}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                {itemCategories.map((c) => (
                  <option key={c.id} value={c.categoryName}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
              {formErrors.itemCategory && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.itemCategory}</p>
              )}
            </div>

            {/* Brand - Searchable */}
            <SearchableSelect
              label="Brand"
              disabled={isView}
              value={formData.brand || ""}
              options={brandOptions}
              placeholder="Search or select brand..."
              onChange={(val) => setFormData({ ...formData, brand: val })}
            />

            {/* Origin - Searchable */}
            <SearchableSelect
              label="Origin"
              disabled={isView}
              value={formData.origin || "Bangladesh"}
              options={originOptions}
              placeholder="Search country/origin..."
              onChange={(val) => setFormData({ ...formData, origin: val })}
            />

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Model / Part No.</label>
              <input
                type="text"
                disabled={isView}
                value={formData.model || formData.partNumber || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    model: e.target.value,
                    partNumber: e.target.value,
                  })
                }
                placeholder="e.g. LAT-5440 / 210-AYTL"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
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

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold mb-1 text-foreground">
                Specification & Description
              </label>
              <textarea
                rows={2}
                disabled={isView}
                value={formData.specification || ""}
                onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                placeholder="Technical specifications, grade, dimensions, tolerances or special handling requirements..."
                className="w-full p-2.5 rounded-lg border border-border/80 bg-background text-xs resize-none focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Unit of Measurement (UOM) with Conversion Factor */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Ruler className="size-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-foreground">Unit of Measurement (UOM)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Purchase UOM - Searchable */}
            <SearchableSelect
              label="Purchase UOM"
              disabled={isView}
              value={formData.purchaseUOM || "PCS"}
              options={uomOptions}
              placeholder="Search Purchase UOM..."
              onChange={(val) => setFormData({ ...formData, purchaseUOM: val })}
            />

            {/* Stock UOM - Searchable */}
            <SearchableSelect
              label="Stock UOM"
              disabled={isView}
              value={formData.stockUOM || "PCS"}
              options={uomOptions}
              placeholder="Search Stock UOM..."
              onChange={(val) => setFormData({ ...formData, stockUOM: val })}
            />

            {/* Added Field: Conversion Factor */}
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Conversion Factor <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min={0.0001}
                disabled={isView}
                value={formData.conversionFactor ?? 1}
                onChange={(e) =>
                  setFormData({ ...formData, conversionFactor: Number(e.target.value) })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                1 {formData.purchaseUOM || "Purchase UOM"} = {formData.conversionFactor ?? 1}{" "}
                {formData.stockUOM || "Stock UOM"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Inventory & Stock Policies */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Layers className="size-4 text-purple-500" />
            <h2 className="text-sm font-bold text-foreground">Inventory & Stock Policies</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Min Stock Level</label>
              <input
                type="number"
                disabled={isView}
                value={formData.minimumStock ?? 10}
                onChange={(e) =>
                  setFormData({ ...formData, minimumStock: Number(e.target.value) })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Max Stock Level</label>
              <input
                type="number"
                disabled={isView}
                value={formData.maximumStock ?? 100}
                onChange={(e) =>
                  setFormData({ ...formData, maximumStock: Number(e.target.value) })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Reorder Level</label>
              <input
                type="number"
                disabled={isView}
                value={formData.reorderLevel ?? 20}
                onChange={(e) =>
                  setFormData({ ...formData, reorderLevel: Number(e.target.value) })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div className="bg-amber-500/5 p-2 rounded-xl border border-amber-500/20">
              <label className="block text-xs font-extrabold mb-1 text-amber-700 dark:text-amber-400">
                Safety Stock (Buffer)
              </label>
              <input
                type="number"
                disabled={isView}
                value={formData.safetyStock ?? 15}
                onChange={(e) =>
                  setFormData({ ...formData, safetyStock: Number(e.target.value) })
                }
                className="w-full h-8 px-3 rounded-lg border border-amber-500/40 bg-background text-xs font-bold text-foreground focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/20 sm:col-span-2">
              <div>
                <div className="text-xs font-bold text-foreground">Location Tracking</div>
                <div className="text-[10px] text-muted-foreground">Serial / Rack / Bin required (Exclusive with Batch)</div>
              </div>
              <input
                type="checkbox"
                disabled={isView}
                checked={!!formData.serialNumberTrackingRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serialNumberTrackingRequired: e.target.checked,
                    batchTrackingRequired: e.target.checked ? false : formData.batchTrackingRequired,
                  })
                }
                className="size-4.5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/20 sm:col-span-2">
              <div>
                <div className="text-xs font-bold text-foreground">Batch Tracking</div>
                <div className="text-[10px] text-muted-foreground">Lot / Batch expiry required (Exclusive with Location)</div>
              </div>
              <input
                type="checkbox"
                disabled={isView}
                checked={!!formData.batchTrackingRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    batchTrackingRequired: e.target.checked,
                    serialNumberTrackingRequired: e.target.checked ? false : formData.serialNumberTrackingRequired,
                  })
                }
                className="size-4.5 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Multi-Warehouse Section (Requirement 3: below Inventory & Stock Policies) */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-blue-500" />
              <div>
                <h2 className="text-sm font-bold text-foreground">Warehouse Allocation</h2>
                <p className="text-[11px] text-muted-foreground">
                  Assign multiple warehouses where this item can be stocked, displayed sequentially.
                </p>
              </div>
            </div>

            {!isView && (
              <button
                type="button"
                onClick={handleAddWarehouseRow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="size-3.5" />
                <span>+ Add Warehouse</span>
              </button>
            )}
          </div>

          <div className="rounded-xl border border-border/70 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="py-2.5 px-3 w-12">SL</th>
                  <th className="py-2.5 px-3">Warehouse / Store</th>
                  <th className="py-2.5 px-3">Default Bin / Rack</th>
                  <th className="py-2.5 px-3 w-28 text-center">Primary Store</th>
                  {!isView && <th className="py-2.5 px-3 text-right w-16">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(formData.warehouses || []).length === 0 ? (
                  <tr>
                    <td colSpan={isView ? 4 : 5} className="py-6 text-center text-muted-foreground">
                      No warehouses allocated. Click "+ Add Warehouse" above.
                    </td>
                  </tr>
                ) : (
                  formData.warehouses?.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-muted/20">
                      <td className="py-2 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                      <td className="py-2 px-3">
                        <select
                          disabled={isView}
                          value={row.warehouseName}
                          onChange={(e) =>
                            handleUpdateWarehouseRow(row.id, "warehouseName", e.target.value)
                          }
                          className="w-full h-8 px-2.5 rounded-md border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                        >
                          {warehouses.map((w) => (
                            <option key={w.id} value={w.storeName}>
                              {w.storeName} ({w.storeCode})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          disabled={isView}
                          value={row.binLocation || ""}
                          onChange={(e) =>
                            handleUpdateWarehouseRow(row.id, "binLocation", e.target.value)
                          }
                          placeholder="e.g. Rack-B, Bin-04"
                          className="w-full h-8 px-2.5 rounded-md border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="checkbox"
                          disabled={isView}
                          checked={!!row.isPrimary}
                          onChange={(e) =>
                            handleUpdateWarehouseRow(row.id, "isPrimary", e.target.checked)
                          }
                          className="size-4 accent-amber-500 rounded cursor-pointer"
                        />
                      </td>
                      {!isView && (
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveWarehouseRow(row.id)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                            title="Remove warehouse"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to Tree" : "Cancel"}
          </button>
          {!isView && (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>{mode === "create" ? "Save Item" : "Update Item"}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
