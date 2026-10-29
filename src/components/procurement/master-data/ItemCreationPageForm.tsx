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
  ChevronRight,
  X,
} from "lucide-react";
import {
  ItemProductMaster,
  ItemSubGroup,
  ItemGroup,
  DEFAULT_ITEM_GROUPS,
  DEFAULT_ITEM_SUB_GROUPS,
  DEFAULT_STORE_LOCATIONS,
  StoreLocation,
  getStoredData,
  setStoredData,
  ItemCategory,
  Brand,
  Origin,
  UOM,
  WarehouseStore,
} from "@/lib/procurement-master-data";
import { SearchableSelect as UiSearchableSelect } from "@/components/ui/searchable-select";
import { ItemGroupModal } from "@/components/procurement/master-data/ItemGroupModal";
import {
  buildSubGroupTreeNodes,
  getSubGroupBreadcrumb,
  SubGroupTreeNode,
} from "@/routes/procurement-master-data";
import { toast } from "sonner";

interface ItemCreationPageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: ItemProductMaster | null;
  targetSubGroup?: ItemSubGroup | null;
  subGroupBreadcrumb?: string;
  allItemGroups?: ItemGroup[];
  allSubGroups?: ItemSubGroup[];
  onItemGroupsChange?: (groups: ItemGroup[]) => void;
  onItemSubGroupsChange?: (subGroups: ItemSubGroup[]) => void;
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
  allItemGroups,
  allSubGroups,
  onItemGroupsChange,
  onItemSubGroupsChange,
  itemCategories,
  brands,
  origins,
  uoms,
  warehouses,
  onSave,
  onCancel,
  onSwitchToEdit,
}: ItemCreationPageFormProps) {
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>(() => {
    if (allItemGroups && allItemGroups.length > 0) return allItemGroups;
    return getStoredData("proc_item_groups", DEFAULT_ITEM_GROUPS);
  });

  const [itemSubGroups, setItemSubGroups] = useState<ItemSubGroup[]>(() => {
    if (allSubGroups && allSubGroups.length > 0) return allSubGroups;
    return getStoredData("proc_item_sub_groups_v2", DEFAULT_ITEM_SUB_GROUPS);
  });

  useEffect(() => {
    if (allItemGroups && allItemGroups.length > 0) setItemGroups(allItemGroups);
  }, [allItemGroups]);

  useEffect(() => {
    if (allSubGroups && allSubGroups.length > 0) setItemSubGroups(allSubGroups);
  }, [allSubGroups]);

  // Tree Explorer State
  const [isTreeExpanded, setIsTreeExpanded] = useState(false);
  const [treeSearch, setTreeSearch] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Item Group Modal
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupModalMode, setGroupModalMode] = useState<"create" | "edit">("create");
  const [groupModalData, setGroupModalData] = useState<Partial<ItemGroup> | null>(null);

  // Sub Group Modal
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subModalMode, setSubModalMode] = useState<"create" | "edit">("create");
  const [subModalValues, setSubModalValues] = useState<Partial<ItemSubGroup>>({});
  const [subModalErrors, setSubModalErrors] = useState<Record<string, string>>({});

  const handleOpenAddItemGroup = () => {
    setGroupModalMode("create");
    setGroupModalData(null);
    setIsGroupModalOpen(true);
  };

  const handleOpenEditItemGroup = (grp: ItemGroup) => {
    setGroupModalMode("edit");
    setGroupModalData(grp);
    setIsGroupModalOpen(true);
  };

  const handleSaveItemGroup = (savedGroup: ItemGroup) => {
    const updated = [savedGroup, ...itemGroups.filter((g) => g.id !== savedGroup.id)];
    setItemGroups(updated);
    setStoredData("proc_item_groups", updated);
    setStoredData("cripton_master_item_groups", updated);
    onItemGroupsChange?.(updated);
    setExpandedNodes((prev) => ({ ...prev, [savedGroup.id]: true }));
    setIsGroupModalOpen(false);
    toast.success(
      groupModalMode === "create"
        ? "Main Item Group created successfully."
        : "Item Group updated successfully.",
    );
  };

  const handleOpenAddSubGroupUnderGroup = (grp: ItemGroup) => {
    setSubModalMode("create");
    setSubModalValues({
      subGroupCode: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      subGroupName: "",
      itemGroupId: grp.id,
      parentSubGroupId: null,
      description: "",
      status: "Active",
      serviceFlag: !!grp.serviceFlag,
    });
    setSubModalErrors({});
    setIsSubModalOpen(true);
  };

  const handleOpenAddChildSubGroup = (parentSub: ItemSubGroup) => {
    const parentGroup = itemGroups.find((g) => g.id === parentSub.itemGroupId);
    const isService = !!parentSub.serviceFlag || !!parentGroup?.serviceFlag;
    setSubModalMode("create");
    setSubModalValues({
      subGroupCode: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      subGroupName: "",
      itemGroupId: parentSub.itemGroupId,
      parentSubGroupId: parentSub.id,
      description: "",
      status: "Active",
      serviceFlag: isService,
    });
    setSubModalErrors({});
    setIsSubModalOpen(true);
  };

  const handleOpenEditSubGroup = (subGroup: ItemSubGroup) => {
    const parentGroup = itemGroups.find((g) => g.id === subGroup.itemGroupId);
    const parentSub = subGroup.parentSubGroupId
      ? itemSubGroups.find((s) => s.id === subGroup.parentSubGroupId)
      : null;
    const isMandatory = !!parentGroup?.serviceFlag || !!parentSub?.serviceFlag;

    setSubModalMode("edit");
    setSubModalValues({
      ...subGroup,
      serviceFlag: isMandatory ? true : !!subGroup.serviceFlag,
    });
    setSubModalErrors({});
    setIsSubModalOpen(true);
  };

  const handleSelectSubGroup = (node: ItemSubGroup, currentSubs = itemSubGroups) => {
    const parentGroup = itemGroups.find((g) => g.id === node.itemGroupId);
    const bc = getSubGroupBreadcrumb(node.id, currentSubs, itemGroups);
    const isService = !!node.serviceFlag || !!parentGroup?.serviceFlag;
    setFormData((prev) => ({
      ...prev,
      subGroupId: node.id,
      subGroupName: node.subGroupName,
      subGroupBreadcrumb: bc,
      serviceFlag: isService ? true : prev.serviceFlag,
    }));
    toast.info(`Assigned to "${node.subGroupName}"`);
  };

  const handleSaveSubGroupModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subModalValues.subGroupName?.trim()) {
      setSubModalErrors({ subGroupName: "Sub Group Name is required" });
      return;
    }

    const currentParentGroup = itemGroups.find(
      (g) => g.id === (subModalValues.itemGroupId || itemGroups[0]?.id),
    );
    const currentParentSub = subModalValues.parentSubGroupId
      ? itemSubGroups.find((s) => s.id === subModalValues.parentSubGroupId)
      : null;
    const isParentMandatoryService =
      !!currentParentGroup?.serviceFlag || !!currentParentSub?.serviceFlag;

    const newSub: ItemSubGroup = {
      id: subModalValues.id || `sub-${Date.now()}`,
      subGroupCode: subModalValues.subGroupCode || `SUB-${Date.now()}`,
      subGroupName: subModalValues.subGroupName || "",
      itemGroupId: subModalValues.itemGroupId || itemGroups[0]?.id || "",
      parentSubGroupId: subModalValues.parentSubGroupId || null,
      description: subModalValues.description || "",
      status: (subModalValues.status as any) || "Active",
      serviceFlag: isParentMandatoryService ? true : !!subModalValues.serviceFlag,
    };

    const updated =
      subModalMode === "create"
        ? [...itemSubGroups, newSub]
        : itemSubGroups.map((s) => (s.id === newSub.id ? newSub : s));

    setItemSubGroups(updated);
    setStoredData("proc_item_sub_groups_v2", updated);
    onItemSubGroupsChange?.(updated);

    // Auto-select this newly created / updated sub-group for current item
    handleSelectSubGroup(newSub, updated);

    setIsSubModalOpen(false);
    toast.success(
      subModalMode === "create"
        ? "Sub Group created and assigned successfully."
        : "Sub Group updated successfully.",
    );
  };

  const [formData, setFormData] = useState<Partial<ItemProductMaster>>(() => {
    const parentGroup = itemGroups.find((g) => g.id === targetSubGroup?.itemGroupId);
    const inheritedServiceFlag = !!targetSubGroup?.serviceFlag || !!parentGroup?.serviceFlag;

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
        serviceFlag: initialData.serviceFlag ?? inheritedServiceFlag,
        valuationMethod: initialData.valuationMethod ?? "FIFO",
      };
    }

    return {
      itemCode: `ITM-${Math.floor(1000 + Math.random() * 9000)}`,
      hsCode: "",
      itemName: "",
      subGroupId: targetSubGroup?.id || "",
      subGroupName: targetSubGroup?.subGroupName || "",
      subGroupBreadcrumb: subGroupBreadcrumb || "",
      serviceFlag: inheritedServiceFlag,
      valuationMethod: "FIFO",
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

  const availableStoreLocations = useMemo(() => {
    return getStoredData<StoreLocation[]>("cripton_store_locations", DEFAULT_STORE_LOCATIONS);
  }, []);

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
      serviceFlag: !!formData.serviceFlag,
      valuationMethod: formData.valuationMethod || "FIFO",
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

      {/* Integrated Item Group Hierarchy & Classification Console */}
      <div className="bg-card rounded-2xl border border-border/80 shadow-2xs overflow-hidden">
        {/* Active Classification Header Bar */}
        <div className="p-3.5 sm:p-4 bg-muted/20 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <FolderTree className="size-4.5" />
            </div>
            <div className="text-xs min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold uppercase text-[10px] text-amber-600 dark:text-amber-400 tracking-wider">
                  Item Group Hierarchy
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-[11px] text-muted-foreground">
                  Parent Classification
                </span>
              </div>
              <div className="font-bold text-foreground text-sm font-mono truncate mt-0.5">
                {formData.subGroupBreadcrumb ||
                  subGroupBreadcrumb ||
                  (formData.subGroupId
                    ? getSubGroupBreadcrumb(formData.subGroupId, itemSubGroups, itemGroups)
                    : "No Sub-Group Selected (Choose from Hierarchy)")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleOpenAddItemGroup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>+ Add Item Group</span>
            </button>
            <button
              type="button"
              onClick={() =>
                handleOpenAddSubGroupUnderGroup(
                  itemGroups[0] || { id: "grp-1", groupCode: "GRP-01", groupName: "General" } as ItemGroup,
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold transition cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>+ Add Sub Group</span>
            </button>
            <button
              type="button"
              onClick={() => setIsTreeExpanded((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
            >
              <Layers className="size-3.5 text-amber-500" />
              <span>{isTreeExpanded ? "Hide Hierarchy" : "View / Change Hierarchy"}</span>
              <ChevronDown
                className={`size-3.5 transition-transform ${isTreeExpanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Expandable Hierarchy Tree Explorer */}
        {isTreeExpanded && (
          <div className="p-4 bg-background border-b border-border/70 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="relative w-full sm:w-72">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                  placeholder="Search groups or sub-groups..."
                  className="w-full pl-8.5 pr-7 h-8 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
                />
                {treeSearch && (
                  <button
                    type="button"
                    onClick={() => setTreeSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const allExp: Record<string, boolean> = {};
                    itemGroups.forEach((g) => (allExp[g.id] = true));
                    itemSubGroups.forEach((s) => (allExp[s.id] = true));
                    setExpandedNodes(allExp);
                  }}
                  className="px-2.5 py-1 rounded text-[11px] font-bold border border-border bg-card hover:bg-muted text-foreground transition cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedNodes({})}
                  className="px-2.5 py-1 rounded text-[11px] font-bold border border-border bg-card hover:bg-muted text-foreground transition cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Tree nodes list */}
            <div className="rounded-xl border border-border/70 p-3 bg-card space-y-2 max-h-80 overflow-y-auto">
              {itemGroups.map((grp) => {
                const rootSubs = buildSubGroupTreeNodes(itemSubGroups, grp.id, null, 1);
                const isExpanded = expandedNodes[grp.id] !== false;
                const isGrpActive =
                  formData.subGroupId &&
                  itemSubGroups.find((s) => s.id === formData.subGroupId)?.itemGroupId === grp.id;

                const renderTreeNodes = (nodes: SubGroupTreeNode[]) => (
                  <div className="space-y-1">
                    {nodes.map((node) => {
                      const hasKids = node.children && node.children.length > 0;
                      const isNodeExp = !!expandedNodes[node.id];
                      const isSelected = formData.subGroupId === node.id;
                      const matchesSearch =
                        Boolean(treeSearch.trim()) &&
                        (node.subGroupName.toLowerCase().includes(treeSearch.toLowerCase()) ||
                          node.subGroupCode.toLowerCase().includes(treeSearch.toLowerCase()));

                      return (
                        <div key={node.id} className="space-y-1">
                          <div
                            style={{ paddingLeft: `${node.depth * 18 + 6}px` }}
                            className={`flex items-center justify-between p-1.5 rounded-lg text-xs transition border ${
                              isSelected
                                ? "bg-amber-500/20 border-amber-500 font-bold"
                                : matchesSearch
                                  ? "bg-amber-500/10 border-amber-500/40"
                                  : "hover:bg-muted/40 border-border/30 bg-background"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {hasKids ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedNodes((prev) => ({
                                      ...prev,
                                      [node.id]: !prev[node.id],
                                    }))
                                  }
                                  className="size-4.5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                                >
                                  {isNodeExp ? (
                                    <ChevronDown className="size-3 text-amber-500" />
                                  ) : (
                                    <ChevronRight className="size-3" />
                                  )}
                                </button>
                              ) : (
                                <span className="w-4.5 text-center text-muted-foreground/30 font-mono text-[10px] shrink-0">
                                  ─
                                </span>
                              )}
                              <span className="font-semibold text-foreground truncate">
                                {node.subGroupName}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted/70 text-muted-foreground shrink-0">
                                {node.subGroupCode}
                              </span>
                              {node.serviceFlag && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shrink-0">
                                  SERVICE
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              <button
                                type="button"
                                onClick={() => handleOpenAddChildSubGroup(node)}
                                title="Add child sub-group under this node"
                                className="size-5 rounded flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                              >
                                <Plus className="size-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditSubGroup(node)}
                                title="Edit Sub Group"
                                className="size-5 rounded flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-amber-500 transition cursor-pointer"
                              >
                                <Edit className="size-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSelectSubGroup(node)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                  isSelected
                                    ? "bg-amber-500 text-white shadow-2xs"
                                    : "bg-muted hover:bg-amber-500/15 text-muted-foreground hover:text-amber-600"
                                }`}
                              >
                                {isSelected ? "Selected" : "Select for Item"}
                              </button>
                            </div>
                          </div>

                          {hasKids && isNodeExp && (
                            <div className="border-l-2 border-amber-500/20 ml-4 pl-1 space-y-1">
                              {renderTreeNodes(node.children)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );

                return (
                  <div key={grp.id} className="space-y-1">
                    {/* Main Item Group Row */}
                    <div
                      className={`flex items-center justify-between p-2 rounded-xl text-xs border ${
                        isGrpActive
                          ? "bg-amber-500/15 border-amber-500/60"
                          : "bg-muted/40 hover:bg-muted/70 border-border/80"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedNodes((prev) => ({
                              ...prev,
                              [grp.id]: !isExpanded,
                            }))
                          }
                          className="size-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                        >
                          {isExpanded ? (
                            <ChevronDown className="size-3.5 text-amber-500" />
                          ) : (
                            <ChevronRight className="size-3.5" />
                          )}
                        </button>
                        <Layers className="size-4 text-amber-500 shrink-0" />
                        <span className="font-extrabold text-foreground truncate">
                          {grp.groupName}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-background border border-border text-muted-foreground shrink-0">
                          {grp.groupCode}
                        </span>
                        {grp.serviceFlag && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shrink-0">
                            SERVICE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleOpenAddSubGroupUnderGroup(grp)}
                          title={`Add sub group under ${grp.groupName}`}
                          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white transition cursor-pointer"
                        >
                          <Plus className="size-3" />
                          <span>+ Sub Group</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditItemGroup(grp)}
                          title="Edit Group"
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Edit className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Sub Groups under this Main Group */}
                    {isExpanded && rootSubs.length > 0 && (
                      <div className="pl-3 border-l-2 border-amber-500/30 ml-3.5 my-1 space-y-1">
                        {renderTreeNodes(rootSubs)}
                      </div>
                    )}
                    {isExpanded && rootSubs.length === 0 && (
                      <div className="pl-8 py-1 text-[11px] text-muted-foreground italic">
                        No sub-groups configured under this group yet.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Item Group Modal */}
      <ItemGroupModal
        isOpen={isGroupModalOpen}
        mode={groupModalMode}
        initialData={groupModalData}
        onSave={handleSaveItemGroup}
        onClose={() => setIsGroupModalOpen(false)}
      />

      {/* Sub Group Modal */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-border/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FolderTree className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-foreground">
                    {subModalMode === "create" ? "Create Sub Group" : "Edit Sub Group"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Classify items in the dynamic hierarchical tree
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {(() => {
              const currentModalParentGroup = itemGroups.find(
                (g) => g.id === (subModalValues.itemGroupId || itemGroups[0]?.id),
              );
              const currentModalParentSub = subModalValues.parentSubGroupId
                ? itemSubGroups.find((s) => s.id === subModalValues.parentSubGroupId)
                : null;
              const isParentMandatoryService =
                !!currentModalParentGroup?.serviceFlag || !!currentModalParentSub?.serviceFlag;

              return (
                <form onSubmit={handleSaveSubGroupModal} className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 text-foreground">
                        Parent Item Group <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={subModalValues.itemGroupId || ""}
                        onChange={(e) => {
                          const newGroupId = e.target.value;
                          const newParentGroup = itemGroups.find((g) => g.id === newGroupId);
                          const isMandatory =
                            !!newParentGroup?.serviceFlag || !!currentModalParentSub?.serviceFlag;
                          setSubModalValues((prev) => ({
                            ...prev,
                            itemGroupId: newGroupId,
                            serviceFlag: isMandatory ? true : false,
                          }));
                        }}
                        className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
                      >
                        {itemGroups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.groupName} ({g.groupCode}){g.serviceFlag ? " [Service]" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {currentModalParentSub ? (
                      <div>
                        <label className="block text-xs font-bold mb-1 text-foreground">
                          Parent Sub Group
                        </label>
                        <div className="w-full h-9 px-3 rounded-lg border border-border/80 bg-muted/40 text-xs font-medium flex items-center text-muted-foreground truncate">
                          {currentModalParentSub.subGroupName}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold mb-1 text-foreground">
                          Sub Group Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={subModalValues.subGroupCode || ""}
                          onChange={(e) =>
                            setSubModalValues({ ...subModalValues, subGroupCode: e.target.value })
                          }
                          className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none"
                        />
                      </div>
                    )}

                    {currentModalParentSub && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold mb-1 text-foreground">
                          Sub Group Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={subModalValues.subGroupCode || ""}
                          onChange={(e) =>
                            setSubModalValues({ ...subModalValues, subGroupCode: e.target.value })
                          }
                          className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none"
                        />
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold mb-1 text-foreground">
                        Sub Group Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={subModalValues.subGroupName || ""}
                        onChange={(e) =>
                          setSubModalValues({ ...subModalValues, subGroupName: e.target.value })
                        }
                        placeholder="e.g. Cotton Yarns, Circuit Boards"
                        className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
                      />
                      {subModalErrors.subGroupName && (
                        <p className="text-[10px] text-rose-500 mt-1">
                          {subModalErrors.subGroupName}
                        </p>
                      )}
                    </div>



                    <div className="flex items-center gap-2 pt-1 sm:col-span-2">
                      <input
                        type="checkbox"
                        id="subGroupServiceFlag"
                        disabled={isParentMandatoryService}
                        checked={isParentMandatoryService ? true : !!subModalValues.serviceFlag}
                        onChange={(e) =>
                          setSubModalValues({ ...subModalValues, serviceFlag: e.target.checked })
                        }
                        className="size-4 rounded border-border text-amber-500 focus:ring-amber-500/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                      <label
                        htmlFor="subGroupServiceFlag"
                        className={`text-xs font-semibold text-foreground ${
                          isParentMandatoryService ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        Service Item Group (Non-physical goods or external services)
                      </label>
                      {isParentMandatoryService && (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          Inherited from Parent Group
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/70 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsSubModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Save className="size-3.5" />
                      <span>{subModalMode === "create" ? "Save Sub Group" : "Update Sub Group"}</span>
                    </button>
                  </div>
                </form>
              );
            })()}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                HS Code
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.hsCode || ""}
                onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
                placeholder="e.g. 6109.10.00"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
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

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Issue Type</label>
              <select
                disabled={isView}
                value={formData.valuationMethod || "FIFO"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    valuationMethod: e.target.value as "FIFO" | "LIFO",
                  })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="FIFO">FIFO (First In First Out)</option>
                <option value="LIFO">LIFO (Last In First Out)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-muted/20">
              <div>
                <div className="text-xs font-bold text-foreground">Service</div>
                <div className="text-[10px] text-muted-foreground">
                  Service / Non-inventory item
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isView}
                  checked={!!formData.serviceFlag}
                  onChange={(e) => setFormData({ ...formData, serviceFlag: e.target.checked })}
                  className="size-4.5 accent-amber-500 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="col-span-full">
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

        {/* Section: Unit of Measurement (UOM) with Conversion Factor */}
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

        {/* Section: Warehouse Allocation */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-blue-500" />
              <div>
                <h2 className="text-sm font-bold text-foreground">Warehouse Allocation</h2>
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
                  {!isView && <th className="py-2.5 px-3 text-right w-16">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(formData.warehouses || []).length === 0 ? (
                  <tr>
                    <td colSpan={isView ? 3 : 4} className="py-6 text-center text-muted-foreground">
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
                        {(() => {
                          const matchingLocations = availableStoreLocations.filter(
                            (l) =>
                              !row.warehouseName ||
                              l.store === row.warehouseName ||
                              (l as any).warehouseName === row.warehouseName
                          );
                          const locList =
                            matchingLocations.length > 0
                              ? matchingLocations
                              : availableStoreLocations;
                          const binOptions = locList.map((loc) => ({
                            value: loc.locationName || loc.locationCode,
                            label: loc.locationName
                              ? `${loc.locationName} (${loc.locationCode || `Rack ${(loc as any).rackNumber || "-"}`})`
                              : loc.locationCode,
                          }));

                          return (
                            <UiSearchableSelect
                              options={binOptions}
                              value={row.binLocation || ""}
                              onChange={(val) =>
                                handleUpdateWarehouseRow(row.id, "binLocation", val)
                              }
                              disabled={isView}
                              placeholder="Select Bin / Rack..."
                              className="w-full h-8"
                            />
                          );
                        })()}
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
