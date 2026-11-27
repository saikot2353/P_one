import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  SlidersHorizontal,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Printer,
  AlertTriangle,
  Building2,
  Package,
  Layers,
  Save,
  Send,
  Eye,
  TrendingUp,
  TrendingDown,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  StockAdjustment,
  StockAdjustmentItem,
  AdjustmentType,
  AdjustmentReasonType,
  MASTER_COMPANIES,
  getStoredStockAdjustments,
  saveStockAdjustment,
} from "@/lib/inventory-stock-management-data";
import {
  DEFAULT_WAREHOUSES,
  DEFAULT_ITEMS,
  ItemProductMaster,
  getStoredData,
} from "@/lib/procurement-master-data";
import { getItemTrackingMode } from "@/lib/item-tracking-utils";
import {
  LocationAllocationModal,
  BatchAllocationModal,
  ItemTrackingCell,
  LocationEntry,
  BatchEntry,
} from "@/components/inventory/ItemBatchLocationModals";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-stock-adjustment")({
  validateSearch: (
    search: Record<string, unknown>
  ): { adjustmentId?: string; mode?: "view" | "edit" } => ({
    adjustmentId: search.adjustmentId as string | undefined,
    mode: search.mode as "view" | "edit" | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Stock Adjustment Form — Inventory ERP" },
      {
        name: "description",
        content: "Record physical store count differences, inventory reconciliations, and stock ledger adjustments.",
      },
    ],
  }),
  component: StockAdjustmentFormPage,
});

function StockAdjustmentFormPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const isViewMode = searchParams.mode === "view";
  const editingAdjustmentId = searchParams.adjustmentId;

  const warehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);
  const catalogItems = getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS);

  // Load existing adjustment if any
  const existingAdjustment = useMemo(() => {
    if (!editingAdjustmentId) return null;
    const all = getStoredStockAdjustments();
    return all.find((a) => a.id === editingAdjustmentId || a.adjustmentId === editingAdjustmentId) || null;
  }, [editingAdjustmentId]);

  // Header State
  const [adjustmentId] = useState<string>(() => {
    if (existingAdjustment) return existingAdjustment.adjustmentId;
    return `ADJ-2026-${String(Math.floor(100 + Math.random() * 900))}`;
  });

  const [adjustmentDate, setAdjustmentDate] = useState<string>(() => {
    return existingAdjustment?.adjustmentDate || new Date().toISOString().slice(0, 10);
  });

  const [company, setCompany] = useState<string>(() => {
    return existingAdjustment?.company || "Pakiza Knit Composite Ltd";
  });

  const [warehouseStore, setWarehouseStore] = useState<string>(() => {
    return existingAdjustment?.warehouseStore || "PKCL Central Raw Material Warehouse";
  });

  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>(() => {
    return existingAdjustment?.adjustmentType || "Increase (+)";
  });

  const [adjustmentReason, setAdjustmentReason] = useState<AdjustmentReasonType>(() => {
    return existingAdjustment?.adjustmentReason || "Physical Count Variance";
  });

  const [reasonDetails, setReasonDetails] = useState<string>(() => {
    return existingAdjustment?.reasonDetails || "";
  });

  const [remarks, setRemarks] = useState<string>(() => {
    return existingAdjustment?.remarks || "";
  });

  const [createdBy] = useState<string>(() => {
    return existingAdjustment?.createdBy || "Tahmid Afsar Shapno (Store Manager)";
  });

  // Filtered stores
  const availableStores = useMemo(() => {
    const list = warehouses.filter((w) => w.organization === company && w.status === "Active");
    return list.length > 0 ? list : warehouses;
  }, [warehouses, company]);

  // Items State
  const [items, setItems] = useState<StockAdjustmentItem[]>(() => {
    if (existingAdjustment) return existingAdjustment.items;
    return [
      {
        id: `adj-row-1`,
        sl: 1,
        itemCode: "ITM-PAP-A4-80",
        itemName: "Double A Premium A4 Printing Paper 80 GSM",
        specification: "80 GSM high brightness photocopy paper",
        brand: "Double A",
        origin: "Thailand",
        uom: "REAM",
        currentStock: 68,
        adjustmentQty: 12,
        newStock: 80,
        unitCost: 480,
        adjustmentValue: 5760,
        remarks: "Audit reconciliation",
      },
    ];
  });

  // Tracking modal
  const [activeTrackingItemId, setActiveTrackingItemId] = useState<string | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  const activeTrackingItem = useMemo(() => {
    return items.find((i) => i.id === activeTrackingItemId) || null;
  }, [items, activeTrackingItemId]);

  const openTrackingModal = (item: StockAdjustmentItem) => {
    if (isViewMode) return;
    const mode = getItemTrackingMode(item.itemCode, catalogItems);
    setActiveTrackingItemId(item.id);
    if (mode === "Batch") {
      setBatchModalOpen(true);
    } else if (mode === "Location") {
      setLocationModalOpen(true);
    }
  };

  const handleSaveLocationAllocations = (allocations: LocationEntry[]) => {
    if (!activeTrackingItemId) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === activeTrackingItemId
          ? {
              ...it,
              locationAllocations: allocations.map((a) => ({
                locationName: a.locationName,
                quantity: a.quantity,
              })),
            }
          : it
      )
    );
    setLocationModalOpen(false);
    toast.success("Location allocations confirmed.");
  };

  const handleSaveBatchAllocations = (allocations: BatchEntry[]) => {
    if (!activeTrackingItemId) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === activeTrackingItemId
          ? {
              ...it,
              batchAllocations: allocations.map((b) => ({
                batchNumber: b.batchNumber,
                quantity: b.quantity,
              })),
            }
          : it
      )
    );
    setBatchModalOpen(false);
    toast.success("Batch allocations confirmed.");
  };

  // Item Search Modal State
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [itemSearchRowIndex, setItemSearchRowIndex] = useState<number | null>(null);

  const handleSelectItemFromSearch = (ci: ItemProductMaster) => {
    if (isViewMode) return;
    const isIncrease = adjustmentType === "Increase (+)";
    const currStock = ci.maximumStock || 100;
    const unitCost = ci.standardPurchasePrice || 100;

    if (itemSearchRowIndex !== null && items[itemSearchRowIndex]) {
      const targetRow = items[itemSearchRowIndex];
      const adjQty = Math.abs(targetRow.adjustmentQty) || 1;
      const newStock = isIncrease ? currStock + adjQty : Math.max(0, currStock - adjQty);
      setItems((prev) =>
        prev.map((row, idx) =>
          idx === itemSearchRowIndex
            ? {
                ...row,
                itemCode: ci.itemCode,
                itemName: ci.itemName,
                specification: ci.specification || "-",
                brand: ci.brand || "Standard",
                origin: ci.origin || "Bangladesh",
                uom: ci.stockUOM || ci.purchaseUOM || "PCS",
                currentStock: currStock,
                adjustmentQty: isIncrease ? adjQty : -adjQty,
                newStock,
                unitCost,
                adjustmentValue: adjQty * unitCost * (isIncrease ? 1 : -1),
              }
            : row
        )
      );
    } else {
      const adjQty = 1;
      const newStock = isIncrease ? currStock + adjQty : Math.max(0, currStock - adjQty);
      const newItem: StockAdjustmentItem = {
        id: `adj-row-${Date.now()}`,
        sl: items.length + 1,
        itemCode: ci.itemCode,
        itemName: ci.itemName,
        specification: ci.specification || "-",
        brand: ci.brand || "Standard",
        origin: ci.origin || "Bangladesh",
        uom: ci.stockUOM || ci.purchaseUOM || "PCS",
        currentStock: currStock,
        adjustmentQty: isIncrease ? adjQty : -adjQty,
        newStock,
        unitCost,
        adjustmentValue: adjQty * unitCost * (isIncrease ? 1 : -1),
        remarks: "",
      };
      setItems((prev) => [...prev, newItem]);
    }
    setItemSearchOpen(false);
    setItemSearchRowIndex(null);
  };

  // Item Table Manipulation
  const handleAddItem = () => {
    if (isViewMode) return;
    const defaultCatalogItem =
      catalogItems.find((cat) => !items.some((it) => it.itemCode === cat.itemCode)) || catalogItems[0];
    if (!defaultCatalogItem) return;

    const currStock = defaultCatalogItem.maximumStock || 100;
    const adjQty = 1;
    const isIncrease = adjustmentType === "Increase (+)";
    const newStock = isIncrease ? currStock + adjQty : currStock - adjQty;
    const unitCost = defaultCatalogItem.standardPurchasePrice || 100;

    const newItem: StockAdjustmentItem = {
      id: `adj-row-${Date.now()}`,
      sl: items.length + 1,
      itemCode: defaultCatalogItem.itemCode,
      itemName: defaultCatalogItem.itemName,
      specification: defaultCatalogItem.specification || "-",
      brand: defaultCatalogItem.brand || "Standard",
      origin: defaultCatalogItem.origin || "Bangladesh",
      uom: defaultCatalogItem.stockUOM || "PCS",
      currentStock: currStock,
      adjustmentQty: isIncrease ? adjQty : -adjQty,
      newStock,
      unitCost,
      adjustmentValue: adjQty * unitCost * (isIncrease ? 1 : -1),
      remarks: "",
    };

    setItems((prev) => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    if (isViewMode) return;
    if (items.length === 1) {
      toast.error("At least one item must remain in the stock adjustment.");
      return;
    }
    setItems((prev) =>
      prev.filter((i) => i.id !== id).map((it, idx) => ({ ...it, sl: idx + 1 }))
    );
  };

  // Recalculate row upon changes
  const handleItemFieldChange = (
    id: string,
    field: "itemCode" | "inputQty" | "unitCost" | "remarks",
    value: string
  ) => {
    if (isViewMode) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const isIncrease = adjustmentType === "Increase (+)";

        if (field === "itemCode") {
          const found = catalogItems.find((c) => c.itemCode === value);
          if (!found) return item;
          const currStock = found.maximumStock || 50;
          const absQty = Math.abs(item.adjustmentQty) || 1;
          const signedQty = isIncrease ? absQty : -absQty;
          const unitCost = found.standardPurchasePrice || 100;
          return {
            ...item,
            itemCode: found.itemCode,
            itemName: found.itemName,
            specification: found.specification || "-",
            brand: found.brand || "Standard",
            origin: found.origin || "Bangladesh",
            uom: found.stockUOM || "PCS",
            currentStock: currStock,
            adjustmentQty: signedQty,
            newStock: currStock + signedQty,
            unitCost,
            adjustmentValue: signedQty * unitCost,
          };
        }

        if (field === "inputQty") {
          const absQty = Math.max(0, parseFloat(value) || 0);
          const signedQty = isIncrease ? absQty : -absQty;
          return {
            ...item,
            adjustmentQty: signedQty,
            newStock: item.currentStock + signedQty,
            adjustmentValue: signedQty * item.unitCost,
          };
        }

        if (field === "unitCost") {
          const cost = Math.max(0, parseFloat(value) || 0);
          return {
            ...item,
            unitCost: cost,
            adjustmentValue: item.adjustmentQty * cost,
          };
        }

        if (field === "remarks") {
          return { ...item, remarks: value };
        }

        return item;
      })
    );
  };

  // When Adjustment Type changes (Increase vs Decrease), re-sign the adjustmentQty
  useEffect(() => {
    setItems((prev) =>
      prev.map((it) => {
        const absQty = Math.abs(it.adjustmentQty) || 1;
        const isIncrease = adjustmentType === "Increase (+)";
        const signedQty = isIncrease ? absQty : -absQty;
        return {
          ...it,
          adjustmentQty: signedQty,
          newStock: it.currentStock + signedQty,
          adjustmentValue: signedQty * it.unitCost,
        };
      })
    );
  }, [adjustmentType]);

  // Metrics
  const totalAdjustedQty = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.adjustmentQty) || 0), 0);
  }, [items]);

  const totalAdjustmentValue = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.adjustmentValue) || 0), 0);
  }, [items]);

  // Validations
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    if (adjustmentReason === "Other" && !reasonDetails.trim()) {
      errs.push("Reason Details is mandatory when Adjustment Reason is 'Other'.");
    }
    if (items.length === 0) {
      errs.push("Please add at least one item to adjust.");
    }

    items.forEach((it) => {
      if (Math.abs(it.adjustmentQty) <= 0) {
        errs.push(`${it.itemName}: Adjustment quantity must be greater than zero.`);
      }
      if (it.adjustmentQty < 0 && Math.abs(it.adjustmentQty) > it.currentStock) {
        errs.push(
          `${it.itemName}: Negative adjustment (${Math.abs(it.adjustmentQty)}) cannot exceed current available stock (${it.currentStock}).`
        );
      }
    });

    return errs;
  }, [adjustmentReason, reasonDetails, items]);

  // Save / Post Handlers
  const handleSave = (status: "Draft" | "Posted") => {
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    const payload: StockAdjustment = {
      id: existingAdjustment?.id || `adj-${Date.now()}`,
      adjustmentId,
      adjustmentDate,
      company,
      warehouseStore,
      adjustmentType,
      adjustmentReason,
      reasonDetails: adjustmentReason === "Other" ? reasonDetails : undefined,
      remarks,
      createdBy,
      totalItems: items.length,
      totalAdjustmentQty: totalAdjustedQty,
      totalAdjustmentValue,
      status,
      postedDate: status === "Posted" ? new Date().toISOString().slice(0, 10) : undefined,
      items,
      createdAt: existingAdjustment?.createdAt || new Date().toISOString(),
    };

    saveStockAdjustment(payload);

    toast.success(
      status === "Draft"
        ? `Stock adjustment draft ${adjustmentId} saved!`
        : `Stock adjustment ${adjustmentId} posted! Warehouse stock ledger balances updated.`
    );

    navigate({ to: "/inv-stock-adjustment-list" });
  };

  // Preview Note State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      companyName: company,
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "STOCK ADJUSTMENT JOURNAL VOUCHER",
      reportNumber: adjustmentId,
      reportDate: adjustmentDate,
      statusBadge: isViewMode ? existingAdjustment?.status || "Draft" : "Draft",
      metaFields: [
        { label: "Adjustment ID", value: adjustmentId },
        { label: "Adjustment Date", value: adjustmentDate },
        { label: "Company", value: company },
        { label: "Store / Warehouse", value: warehouseStore },
        { label: "Adjustment Type", value: adjustmentType },
        { label: "Reason Category", value: adjustmentReason },
        { label: "Authorized Controller", value: createdBy },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "ITEM DESCRIPTION",
        "UOM",
        "CURR STOCK",
        "ADJ QTY",
        "NEW STOCK",
        "UNIT COST (৳)",
        "VALUATION IMPACT (৳)",
      ],
      tableRows: items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        String(it.currentStock),
        `${it.adjustmentQty > 0 ? "+" : ""}${it.adjustmentQty}`,
        String(it.newStock),
        String(it.unitCost),
        String(it.adjustmentValue.toLocaleString()),
      ]),
      summaryCards: [
        { label: "Total Items", value: String(items.length) },
        { label: "Net Quantity Impact", value: `${totalAdjustedQty > 0 ? "+" : ""}${totalAdjustedQty} units` },
        { label: "Valuation Net Impact", value: `৳ ${totalAdjustmentValue.toLocaleString()}` },
      ],
      notes: [
        "Inventory ledger will immediately reconcile upon final voucher posting.",
        "Audited against physical warehouse inventory counts.",
      ],
      signatures: [
        { title: "Physical Count Officer", name: createdBy, date: adjustmentDate },
        { title: "Warehouse Store In-Charge", name: "Store Manager", date: adjustmentDate },
        { title: "Financial Auditor", name: "Cost Controller", date: adjustmentDate },
      ],
    };
  }, [
    company,
    warehouseStore,
    adjustmentId,
    adjustmentDate,
    adjustmentType,
    adjustmentReason,
    createdBy,
    items,
    totalAdjustedQty,
    totalAdjustmentValue,
    isViewMode,
    existingAdjustment,
  ]);

  return (
    <div className="min-h-screen flex bg-slate-100/70 text-slate-800">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <Link
                to="/inv-stock-adjustment-list"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back to Adjustments List"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    {isViewMode ? "View Stock Adjustment" : "Stock Adjustment (+/-) Entry"}
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    {adjustmentId}
                  </span>
                  {isViewMode && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Mode: Read-Only
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Reconcile store ledger with physical count variances, damage write-downs, or found inventory
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewReportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="size-3.5 text-slate-600" />
                Preview Voucher
              </button>

              {!isViewMode && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSave("Draft")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    <Save className="size-3.5" />
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSave("Posted")}
                    disabled={validationErrors.length > 0}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-teal-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="size-3.5" />
                    Confirm & Post Adjustment
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Validation Notice */}
          {!isViewMode && validationErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">Adjustment Rule Violations:</h4>
                <ul className="text-xs text-rose-700 mt-1 list-disc list-inside space-y-0.5 font-medium">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section 1: Header Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="size-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Adjustment Header & Parameters
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Specify adjustment type and audit reason
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Adjustment ID */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Adjustment ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={adjustmentId}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-mono font-bold text-teal-700 outline-none cursor-not-allowed"
                />
              </div>

              {/* Adjustment Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Adjustment Date *
                </label>
                <input
                  type="date"
                  disabled={isViewMode}
                  value={adjustmentDate}
                  onChange={(e) => setAdjustmentDate(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Company */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Company / Organization *
                </label>
                <select
                  disabled={isViewMode}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:bg-slate-50"
                >
                  {MASTER_COMPANIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Warehouse Store */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Warehouse / Store *
                </label>
                <select
                  disabled={isViewMode}
                  value={warehouseStore}
                  onChange={(e) => setWarehouseStore(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:bg-slate-50"
                >
                  {availableStores.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Adjustment Type */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Adjustment Type *
                </label>
                <select
                  disabled={isViewMode}
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value as AdjustmentType)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-bold text-teal-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:bg-slate-50"
                >
                  <option value="Increase (+)">Stock Increase (+)</option>
                  <option value="Decrease (-)">Stock Decrease (-)</option>
                </select>
              </div>

              {/* Adjustment Reason */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Adjustment Reason *
                </label>
                <select
                  disabled={isViewMode}
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value as AdjustmentReasonType)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:bg-slate-50"
                >
                  <option value="Physical Count Variance">Physical Count Variance</option>
                  <option value="Damaged Stock Found">Damaged Stock Found</option>
                  <option value="Expiry Write-Down">Expiry Write-Down</option>
                  <option value="Data Entry Correction">Data Entry Correction</option>
                  <option value="Re-classification">Re-classification</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Created By */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Created By (Store Officer)
                </label>
                <input
                  type="text"
                  readOnly
                  value={createdBy}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none cursor-not-allowed"
                />
              </div>

              {/* Overall Remarks */}
              <div className={adjustmentReason === "Other" ? "" : "sm:col-span-2 lg:col-span-1"}>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  General Remarks
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  placeholder="Optional audit remarks..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:bg-slate-50"
                />
              </div>

              {/* Conditional Reason Details */}
              {adjustmentReason === "Other" && (
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Reason Details *
                  </label>
                  <input
                    type="text"
                    disabled={isViewMode}
                    placeholder="Provide specific justification for Other reason..."
                    value={reasonDetails}
                    onChange={(e) => setReasonDetails(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:bg-slate-50"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Items Table with section-level scrolling */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="size-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Adjusted Line Items & Physical Variance Matrix
                </h3>
              </div>
              {!isViewMode && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200 transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  Add Item
                </button>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[460px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200 whitespace-nowrap">
                    <tr>
                      <th className="py-3 px-3 text-center w-10">SL</th>
                      <th className="py-3 px-3 min-w-[220px]">Item Description & Code</th>
                      <th className="py-3 px-2 text-center w-16">UOM</th>
                      <th className="py-3 px-3 text-right w-24">Current Stock</th>
                      <th
                        className={`py-3 px-3 text-right w-32 font-black ${
                          adjustmentType === "Increase (+)"
                            ? "bg-emerald-50/60 text-emerald-900"
                            : "bg-rose-50/60 text-rose-900"
                        }`}
                      >
                        Adj Qty ({adjustmentType === "Increase (+)" ? "+" : "-"}) *
                      </th>
                      <th className="py-3 px-3 text-right w-24">Unit Cost (৳)</th>
                      <th className="py-3 px-3 text-right w-28">Valuation Impact (৳)</th>
                      <th className="py-3 px-3 text-center w-28">Tracking (B/L)</th>
                      <th className="py-3 px-3 min-w-[160px]">Line Remarks</th>
                      {!isViewMode && <th className="py-3 px-2 text-center w-12">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-400">
                          No items added yet. Click &quot;Add Item&quot; to begin.
                        </td>
                      </tr>
                    ) : (
                      items.map((row, rIdx) => {
                        const trackingMode = getItemTrackingMode(row.itemCode, catalogItems);
                        const isDecreaseOverStock =
                          row.adjustmentQty < 0 && Math.abs(row.adjustmentQty) > row.currentStock;

                        return (
                          <tr
                            key={row.id}
                            className={`hover:bg-slate-50/80 transition-colors whitespace-nowrap ${
                              isDecreaseOverStock ? "bg-rose-50/50" : ""
                            }`}
                          >
                            <td className="py-3 px-3 text-center font-mono text-slate-400 text-[10px]">
                              {row.sl}
                            </td>

                            {/* Item Selector & Search */}
                            <td className="py-3 px-3">
                              {isViewMode ? (
                                <div>
                                  <div className="font-bold text-slate-800">{row.itemName}</div>
                                  <div className="font-mono text-[10.5px] text-teal-600">{row.itemCode}</div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 min-w-[220px]">
                                  <div className="flex-1">
                                    <div className="font-bold text-slate-800 line-clamp-1">{row.itemName}</div>
                                    <div className="font-mono text-[10px] text-teal-600">{row.itemCode}</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setItemSearchRowIndex(rIdx);
                                      setItemSearchQuery("");
                                      setItemSearchOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50 text-slate-600 hover:text-teal-600 shadow-2xs transition cursor-pointer shrink-0"
                                    title="Search item from catalog"
                                  >
                                    <Search className="size-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-600">
                              {row.uom}
                            </td>

                            <td className="py-3 px-3 text-right font-mono text-slate-600">
                              {row.currentStock.toLocaleString()}
                            </td>

                            {/* Adjustment Qty Input */}
                            <td
                              className={`py-3 px-3 text-right ${
                                adjustmentType === "Increase (+)" ? "bg-emerald-50/20" : "bg-rose-50/20"
                              }`}
                            >
                              {isViewMode ? (
                                <span
                                  className={`font-mono font-bold ${
                                    row.adjustmentQty >= 0 ? "text-emerald-700" : "text-rose-700"
                                  }`}
                                >
                                  {row.adjustmentQty > 0 ? `+${row.adjustmentQty}` : row.adjustmentQty}
                                </span>
                              ) : (
                                <div className="flex flex-col items-end gap-0.5">
                                  <div className="flex items-center gap-1">
                                    <span
                                      className={`font-mono font-bold text-xs ${
                                        adjustmentType === "Increase (+)" ? "text-emerald-700" : "text-rose-700"
                                      }`}
                                    >
                                      {adjustmentType === "Increase (+)" ? "+" : "-"}
                                    </span>
                                    <input
                                      type="number"
                                      min="1"
                                      value={Math.abs(row.adjustmentQty)}
                                      onChange={(e) =>
                                        handleItemFieldChange(row.id, "inputQty", e.target.value)
                                      }
                                      className={`w-20 h-8 px-2 text-right font-mono font-bold text-xs rounded-lg border outline-none transition-colors ${
                                        isDecreaseOverStock
                                          ? "border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20"
                                          : "border-slate-300 bg-white text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                      }`}
                                    />
                                  </div>
                                  {adjustmentType === "Decrease (-)" && (
                                    <span className="text-[9.5px] font-semibold text-slate-400">
                                      Max: {row.currentStock}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Unit Cost */}
                            <td className="py-3 px-3 text-right">
                              {isViewMode ? (
                                <span className="font-mono text-slate-700">{row.unitCost.toLocaleString()}</span>
                              ) : (
                                <input
                                  type="number"
                                  min="0"
                                  value={row.unitCost}
                                  onChange={(e) =>
                                    handleItemFieldChange(row.id, "unitCost", e.target.value)
                                  }
                                  className="w-20 h-8 px-2 text-right font-mono text-xs rounded-lg border border-slate-200 bg-white outline-none focus:ring-1 focus:ring-teal-500"
                                />
                              )}
                            </td>

                            {/* Valuation Impact */}
                            <td
                              className={`py-3 px-3 text-right font-mono font-bold ${
                                row.adjustmentValue >= 0 ? "text-emerald-700" : "text-rose-700"
                              }`}
                            >
                              ৳ {row.adjustmentValue.toLocaleString()}
                            </td>

                            {/* Tracking Cell */}
                            <td className="py-3 px-3 text-center">
                              <ItemTrackingCell
                                trackingMode={trackingMode}
                                batchCount={row.batchAllocations?.length || 0}
                                locationCount={row.locationAllocations?.length || 0}
                                onOpenBatch={() => openTrackingModal(row)}
                                onOpenLocation={() => openTrackingModal(row)}
                              />
                            </td>

                            {/* Line Remarks */}
                            <td className="py-3 px-3">
                              {isViewMode ? (
                                <span className="text-slate-600">{row.remarks || "-"}</span>
                              ) : (
                                <input
                                  type="text"
                                  placeholder="Physical note..."
                                  value={row.remarks || ""}
                                  onChange={(e) =>
                                    handleItemFieldChange(row.id, "remarks", e.target.value)
                                  }
                                  className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500"
                                />
                              )}
                            </td>

                            {!isViewMode && (
                              <td className="py-3 px-2 text-center">
                                <button
                                  type="button"
                                  title="Remove Item"
                                  onClick={() => handleDeleteItem(row.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Stock Adjustment Reconciled Totals
              </span>
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Total Items: </span>
                  <span className="font-bold text-slate-900 font-mono">{items.length}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Net Qty Impact: </span>
                  <span
                    className={`font-bold font-mono ${
                      totalAdjustedQty >= 0 ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {totalAdjustedQty > 0 ? `+${totalAdjustedQty}` : totalAdjustedQty} units
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Net Financial Impact: </span>
                  <span
                    className={`font-bold font-mono ${
                      totalAdjustmentValue >= 0 ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    ৳ {totalAdjustmentValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Allocation Modal */}
        {locationModalOpen && activeTrackingItem && (
          <LocationAllocationModal
            isOpen={true}
            onClose={() => setLocationModalOpen(false)}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            transactionQty={Math.abs(activeTrackingItem.adjustmentQty)}
            uom={activeTrackingItem.uom}
            currentStore={warehouseStore}
            initialEntries={activeTrackingItem.locationAllocations}
            onSave={handleSaveLocationAllocations}
          />
        )}

        {/* Batch Allocation Modal */}
        {batchModalOpen && activeTrackingItem && (
          <BatchAllocationModal
            isOpen={true}
            onClose={() => setBatchModalOpen(false)}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            transactionQty={Math.abs(activeTrackingItem.adjustmentQty)}
            uom={activeTrackingItem.uom}
            currentStore={warehouseStore}
            initialEntries={activeTrackingItem.batchAllocations}
            onSave={handleSaveBatchAllocations}
          />
        )}

        {/* Preview Report Modal */}
        {previewReportOpen && (
          <StandardPreviewReportModal
            isOpen={previewReportOpen}
            onClose={() => setPreviewReportOpen(false)}
            data={previewReportData}
          />
        )}

        {/* Item Search Modal */}
        {itemSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                    <Search className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Select Item from Catalog</h2>
                    <p className="text-xs text-slate-500">Search and select item code, name, specification, brand, origin, and UOM</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setItemSearchOpen(false);
                    setItemSearchRowIndex(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-4 border-b border-slate-100 bg-slate-50/30">
                <div className="relative">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={itemSearchQuery}
                    onChange={(e) => setItemSearchQuery(e.target.value)}
                    placeholder="Search by Item Code, Name, Specification, Brand, Origin, UOM..."
                    className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Item Code</th>
                        <th className="py-2.5 px-3">Item Name</th>
                        <th className="py-2.5 px-3">Specification</th>
                        <th className="py-2.5 px-3">Brand</th>
                        <th className="py-2.5 px-3">Origin</th>
                        <th className="py-2.5 px-3 text-center">UOM</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {catalogItems
                        .filter((it) => {
                          if (!itemSearchQuery.trim()) return true;
                          const q = itemSearchQuery.toLowerCase();
                          return (
                            it.itemCode.toLowerCase().includes(q) ||
                            it.itemName.toLowerCase().includes(q) ||
                            (it.specification && it.specification.toLowerCase().includes(q)) ||
                            (it.description && it.description.toLowerCase().includes(q)) ||
                            (it.brand && it.brand.toLowerCase().includes(q)) ||
                            (it.origin && it.origin.toLowerCase().includes(q)) ||
                            (it.stockUOM && it.stockUOM.toLowerCase().includes(q))
                          );
                        })
                        .map((ci) => (
                          <tr key={ci.id} className="hover:bg-slate-50 transition">
                            <td className="py-2 px-3 font-mono font-bold text-teal-600">{ci.itemCode}</td>
                            <td className="py-2 px-3 font-bold text-slate-800">{ci.itemName}</td>
                            <td className="py-2 px-3 text-slate-500">{ci.specification || ci.description || "—"}</td>
                            <td className="py-2 px-3 text-slate-600">{ci.brand || "Standard OEM"}</td>
                            <td className="py-2 px-3 text-slate-600">{ci.origin || "Imported"}</td>
                            <td className="py-2 px-3 text-center font-mono font-bold">{ci.stockUOM || ci.purchaseUOM || "PCS"}</td>
                            <td className="py-2 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleSelectItemFromSearch(ci)}
                                className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer"
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
