import { useState, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  FileX2,
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
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  StockWriteOff,
  StockWriteOffItem,
  WriteOffCategory,
  DisposalMethod,
  MASTER_COMPANIES,
  getStoredStockWriteOffs,
  saveStockWriteOff,
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

export const Route = createFileRoute("/inv-stock-writeoff")({
  validateSearch: (
    search: Record<string, unknown>
  ): { writeOffId?: string; mode?: "view" | "edit" } => ({
    writeOffId: search.writeOffId as string | undefined,
    mode: search.mode as "view" | "edit" | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Stock Write-Off Entry — Inventory ERP" },
      {
        name: "description",
        content: "Propose scrap, damaged, or expired stock write-offs with loss valuation calculations.",
      },
    ],
  }),
  component: StockWriteOffFormPage,
});

function StockWriteOffFormPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const isViewMode = searchParams.mode === "view";
  const editingWriteOffId = searchParams.writeOffId;

  const warehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);
  const catalogItems = getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS);

  // Load existing write-off if view/edit mode
  const existingWriteOff = useMemo(() => {
    if (!editingWriteOffId) return null;
    const all = getStoredStockWriteOffs();
    return all.find((w) => w.id === editingWriteOffId || w.writeOffId === editingWriteOffId) || null;
  }, [editingWriteOffId]);

  // Header State
  const [writeOffId] = useState<string>(() => {
    if (existingWriteOff) return existingWriteOff.writeOffId;
    return `WO-2026-${String(Math.floor(100 + Math.random() * 900))}`;
  });

  const [date, setDate] = useState<string>(() => {
    return existingWriteOff?.date || new Date().toISOString().slice(0, 10);
  });

  const [company, setCompany] = useState<string>(() => {
    return existingWriteOff?.company || "Pakiza Knit Composite Ltd";
  });

  const [warehouseStore, setWarehouseStore] = useState<string>(() => {
    return existingWriteOff?.warehouseStore || "PKCL Central Raw Material Warehouse";
  });

  const [category, setCategory] = useState<WriteOffCategory>(() => {
    return existingWriteOff?.category || "Damaged / Broken";
  });

  const [disposalMethod, setDisposalMethod] = useState<DisposalMethod>(() => {
    return existingWriteOff?.disposalMethod || "Destruction";
  });

  const [investigationRef, setInvestigationRef] = useState<string>(() => {
    return existingWriteOff?.investigationRef || "";
  });

  const [remarks, setRemarks] = useState<string>(() => {
    return existingWriteOff?.remarks || "";
  });

  const [initiatedBy] = useState<string>(() => {
    return existingWriteOff?.initiatedBy || "Tahmid Afsar Shapno (Store Manager)";
  });

  // Stores filtered by company (Ensures never empty, falls back to all active warehouses)
  const availableStores = useMemo(() => {
    const list = warehouses.filter((w) => w.organization === company && w.status === "Active");
    if (list.length > 0) return list;
    const activeAll = warehouses.filter((w) => w.status === "Active");
    return activeAll.length > 0 ? activeAll : DEFAULT_WAREHOUSES;
  }, [warehouses, company]);

  // Item Search Modal State
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [itemSearchRowIndex, setItemSearchRowIndex] = useState<number | null>(null);

  const handleSelectItemFromSearch = (ci: ItemProductMaster) => {
    if (isViewMode) return;
    const currStock = ci.maximumStock || 100;
    const unitCost = ci.standardPurchasePrice || 100;

    if (itemSearchRowIndex !== null && items[itemSearchRowIndex]) {
      const targetRow = items[itemSearchRowIndex];
      const woQty = targetRow.writeOffQty || 1;
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
                availableStock: currStock,
                unitCost,
                totalLossValue: woQty * unitCost,
              }
            : row
        )
      );
    } else {
      const newItem: StockWriteOffItem = {
        id: `wo-row-${Date.now()}`,
        sl: items.length + 1,
        itemCode: ci.itemCode,
        itemName: ci.itemName,
        specification: ci.specification || "-",
        brand: ci.brand || "Standard",
        origin: ci.origin || "Bangladesh",
        uom: ci.stockUOM || ci.purchaseUOM || "PCS",
        availableStock: currStock,
        writeOffQty: 1,
        unitCost,
        totalLossValue: unitCost,
        damageReasonDetails: "",
      };
      setItems((prev) => [...prev, newItem]);
    }
    setItemSearchOpen(false);
    setItemSearchRowIndex(null);
  };

  // Items State
  const [items, setItems] = useState<StockWriteOffItem[]>(() => {
    if (existingWriteOff) return existingWriteOff.items;
    return [
      {
        id: `wo-row-1`,
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        availableStock: 25000,
        writeOffQty: 25,
        unitCost: 420,
        totalLossValue: 10500,
        damageReasonDetails: "Cone yarn mold contamination from roof leak",
        batchAllocations: [{ batchNumber: "BATCH-COT-2026-01", quantity: 25 }],
      },
    ];
  });

  // Modals for batch/location
  const [activeTrackingItemId, setActiveTrackingItemId] = useState<string | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  const activeTrackingItem = useMemo(() => {
    return items.find((i) => i.id === activeTrackingItemId) || null;
  }, [items, activeTrackingItemId]);

  const openTrackingModal = (item: StockWriteOffItem) => {
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

  // Add / Delete rows
  const handleAddItem = () => {
    if (isViewMode) return;
    const defaultItem =
      catalogItems.find((cat) => !items.some((it) => it.itemCode === cat.itemCode)) || catalogItems[0];
    if (!defaultItem) return;

    const stock = defaultItem.maximumStock || 50;
    const unitCost = defaultItem.standardPurchasePrice || 100;

    const newItem: StockWriteOffItem = {
      id: `wo-row-${Date.now()}`,
      sl: items.length + 1,
      itemCode: defaultItem.itemCode,
      itemName: defaultItem.itemName,
      specification: defaultItem.specification || "-",
      brand: defaultItem.brand || "Standard",
      origin: defaultItem.origin || "Bangladesh",
      uom: defaultItem.stockUOM || "PCS",
      availableStock: stock,
      writeOffQty: 1,
      unitCost,
      totalLossValue: unitCost,
      damageReasonDetails: "Damaged / non-usable scrap",
    };

    setItems((prev) => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    if (isViewMode) return;
    if (items.length === 1) {
      toast.error("At least one item must remain in the write-off request.");
      return;
    }
    setItems((prev) =>
      prev.filter((i) => i.id !== id).map((it, idx) => ({ ...it, sl: idx + 1 }))
    );
  };

  const handleItemFieldChange = (
    id: string,
    field: "itemCode" | "writeOffQty" | "damageReasonDetails",
    value: string
  ) => {
    if (isViewMode) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === "itemCode") {
          const found = catalogItems.find((c) => c.itemCode === value);
          if (!found) return item;
          const stock = found.maximumStock || 50;
          const unitCost = found.standardPurchasePrice || 100;
          const writeOffQty = item.writeOffQty || 1;
          return {
            ...item,
            itemCode: found.itemCode,
            itemName: found.itemName,
            specification: found.specification || "-",
            brand: found.brand || "Standard",
            origin: found.origin || "Bangladesh",
            uom: found.stockUOM || "PCS",
            availableStock: stock,
            unitCost,
            totalLossValue: writeOffQty * unitCost,
          };
        }

        if (field === "writeOffQty") {
          const qty = Math.max(0, parseFloat(value) || 0);
          return {
            ...item,
            writeOffQty: qty,
            totalLossValue: qty * item.unitCost,
          };
        }

        if (field === "damageReasonDetails") {
          return { ...item, damageReasonDetails: value };
        }

        return item;
      })
    );
  };

  // Metrics
  const totalWriteOffQty = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.writeOffQty) || 0), 0);
  }, [items]);

  const totalLossValue = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.totalLossValue) || 0), 0);
  }, [items]);

  // Validations
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    if (items.length === 0) {
      errs.push("Please add at least one line item to write off.");
    }

    items.forEach((it) => {
      if (it.writeOffQty <= 0) {
        errs.push(`${it.itemName}: Write-off quantity must be greater than zero.`);
      }
      if (it.writeOffQty > it.availableStock) {
        errs.push(
          `${it.itemName}: Write-off quantity (${it.writeOffQty}) cannot exceed available stock (${it.availableStock}).`
        );
      }
      if (!it.damageReasonDetails.trim()) {
        errs.push(`${it.itemName}: Damage / write-off justification details are required.`);
      }
    });

    return errs;
  }, [items]);

  // Save / Submit
  const handleSave = (status: "Draft" | "Submitted") => {
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    const payload: StockWriteOff = {
      id: existingWriteOff?.id || `wo-${Date.now()}`,
      writeOffId,
      date,
      company,
      warehouseStore,
      category,
      disposalMethod,
      investigationRef: investigationRef.trim() ? investigationRef : undefined,
      remarks: remarks.trim() ? remarks : undefined,
      initiatedBy,
      totalItems: items.length,
      totalWriteOffQty,
      totalLossValue,
      status,
      items,
      createdAt: existingWriteOff?.createdAt || new Date().toISOString(),
    };

    saveStockWriteOff(payload);

    toast.success(
      status === "Draft"
        ? `Write-off draft ${writeOffId} saved!`
        : `Write-off ${writeOffId} submitted for management approval!`
    );

    navigate({ to: "/inv-stock-writeoff-list" });
  };

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      companyName: company,
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "SCRAP & MATERIAL WRITE-OFF PROPOSAL",
      reportNumber: writeOffId,
      reportDate: date,
      statusBadge: isViewMode ? existingWriteOff?.status || "Draft" : "Draft",
      metaFields: [
        { label: "Write-Off ID", value: writeOffId },
        { label: "Date", value: date },
        { label: "Company", value: company },
        { label: "Store", value: warehouseStore },
        { label: "Category", value: category },
        { label: "Disposal Method", value: disposalMethod },
        { label: "Investigation Ref", value: investigationRef || "-" },
        { label: "Initiator", value: initiatedBy },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "DESCRIPTION",
        "UOM",
        "WRITE-OFF QTY",
        "UNIT COST (৳)",
        "TOTAL LOSS VALUE (৳)",
        "DAMAGE SPECIFICATION",
      ],
      tableRows: items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        String(it.writeOffQty),
        String(it.unitCost),
        String(it.totalLossValue.toLocaleString()),
        it.damageReasonDetails,
      ]),
      summaryCards: [
        { label: "Total Items", value: String(items.length) },
        { label: "Total Quantity", value: `${totalWriteOffQty} units` },
        { label: "Financial Loss Impact", value: `৳ ${totalLossValue.toLocaleString()}` },
      ],
      notes: [
        "Materials must be cordoned off in designated scrap quarantine zone.",
        "Final financial stock ledger write-down takes place upon committee approval.",
      ],
      signatures: [
        { title: "Store Officer", name: initiatedBy, date },
        { title: "QA Inspector", name: "Quality Assurance Head", date },
        { title: "Executive Committee", name: "COO / Director", date },
      ],
    };
  }, [
    company,
    warehouseStore,
    writeOffId,
    date,
    category,
    disposalMethod,
    investigationRef,
    initiatedBy,
    items,
    totalWriteOffQty,
    totalLossValue,
    isViewMode,
    existingWriteOff,
  ]);

  return (
    <div className="min-h-screen flex bg-slate-100/70 text-slate-800">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <Link
                to="/inv-stock-writeoff-list"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back to Write-Offs List"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    {isViewMode ? "View Stock Write-Off" : "Stock Write-Off Entry"}
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {writeOffId}
                  </span>
                  {isViewMode && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Mode: Read-Only
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Propose scrap disposal, damage write-down, or obsolete inventory write-offs for approval
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
                Preview Proposal
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
                    onClick={() => handleSave("Submitted")}
                    disabled={validationErrors.length > 0}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-rose-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    Submit for Approval
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
                <h4 className="text-xs font-bold text-rose-800">Validation Errors:</h4>
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
                <FileX2 className="size-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Write-Off Header & Disposal Specifications
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Identify disposal method and damage category
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Write-Off ID */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Write-Off ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={writeOffId}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-mono font-bold text-rose-700 outline-none cursor-not-allowed"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  disabled={isViewMode}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 disabled:bg-slate-50"
                >
                  {MASTER_COMPANIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Store */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Warehouse / Store *
                </label>
                <select
                  disabled={isViewMode}
                  value={warehouseStore}
                  onChange={(e) => setWarehouseStore(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 disabled:bg-slate-50"
                >
                  {availableStores.map((w) => {
                    const sName = w.storeName || w.name;
                    return (
                      <option key={w.id} value={sName}>
                        {sName} ({w.storeCode || w.id})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Write-Off Category */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Reason Category *
                </label>
                <select
                  disabled={isViewMode}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as WriteOffCategory)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 disabled:bg-slate-50"
                >
                  <option value="Damaged / Broken">Damaged / Broken</option>
                  <option value="Expired Material">Expired Material</option>
                  <option value="Quality Rejection / Scrap">Quality Rejection / Scrap</option>
                  <option value="Lost / Stolen">Lost / Stolen</option>
                  <option value="Obsolete Stock">Obsolete Stock</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Initiated By */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Initiated By
                </label>
                <input
                  type="text"
                  readOnly
                  value={initiatedBy}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none cursor-not-allowed"
                />
              </div>

              {/* Remarks */}
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  General Remarks / Disposal Instructions
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  placeholder="Environmental safety, scrap vendor bidder name, destruction certificate ref..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="size-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Write-Off Items & Loss Value Calculation
                </h3>
              </div>
              {!isViewMode && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  Add Line Item
                </button>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[460px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200 whitespace-nowrap">
                    <tr>
                      <th className="py-3 px-3 text-center w-10">SL</th>
                      <th className="py-3 px-3 min-w-[200px]">Item Description</th>
                      <th className="py-3 px-3 min-w-[140px]">Specification</th>
                      <th className="py-3 px-3 min-w-[140px]">Brand / Origin</th>
                      <th className="py-3 px-2 text-center w-14">UOM</th>
                      <th className="py-3 px-3 text-right w-24">Stock</th>
                      <th className="py-3 px-3 text-right w-32 bg-rose-50/50 text-rose-900 font-black">
                        Write-Off Qty *
                      </th>
                      <th className="py-3 px-3 text-right w-24">Unit Cost (৳)</th>
                      <th className="py-3 px-3 text-right w-28 text-rose-700">Value (৳)</th>
                      <th className="py-3 px-3 text-center w-28">Tracking (B/L)</th>
                      <th className="py-3 px-3 min-w-[200px]">Damage / Disposal Justification *</th>
                      {!isViewMode && <th className="py-3 px-2 text-center w-12">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={isViewMode ? 11 : 12} className="py-8 text-center text-slate-400">
                          No items added yet. Click &quot;Add Line Item&quot; to begin.
                        </td>
                      </tr>
                    ) : (
                      items.map((row, rIdx) => {
                        const trackingMode = getItemTrackingMode(row.itemCode, catalogItems);
                        const isOverStock = row.writeOffQty > row.availableStock;

                        return (
                          <tr
                            key={row.id}
                            className={`hover:bg-slate-50/80 transition-colors whitespace-nowrap ${
                              isOverStock ? "bg-rose-50/50" : ""
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
                                  <div className="font-mono text-[10.5px] text-rose-600">{row.itemCode}</div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 min-w-[200px]">
                                  <div className="flex-1">
                                    <div className="font-bold text-slate-800 line-clamp-1">{row.itemName}</div>
                                    <div className="font-mono text-[10px] text-rose-600">{row.itemCode}</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setItemSearchRowIndex(rIdx);
                                      setItemSearchQuery("");
                                      setItemSearchOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-400 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 shadow-2xs transition cursor-pointer shrink-0"
                                    title="Search item from catalog"
                                  >
                                    <Search className="size-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Specification (Auto-populated + Read-only) */}
                            <td className="py-3 px-3 text-[11px] text-slate-600 max-w-[180px] truncate" title={row.specification}>
                              {row.specification || "—"}
                            </td>

                            {/* Combined Brand / Origin (Auto-populated + Read-only) */}
                            <td className="py-3 px-3 text-[11px] font-medium text-slate-700 whitespace-nowrap">
                              {row.brand || row.origin ? `${row.brand || "—"} / ${row.origin || "—"}` : "—"}
                            </td>

                            <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-600">
                              {row.uom}
                            </td>

                            {/* Stock */}
                            <td className="py-3 px-3 text-right font-mono font-bold text-slate-600">
                              {row.availableStock.toLocaleString()}
                            </td>

                            {/* Write-Off Qty */}
                            <td className="py-3 px-3 text-right bg-rose-50/20">
                              {isViewMode ? (
                                <span className="font-mono font-black text-rose-700">
                                  {row.writeOffQty.toLocaleString()}
                                </span>
                              ) : (
                                <div className="flex flex-col items-end gap-0.5">
                                  <input
                                    type="number"
                                    min="1"
                                    max={row.availableStock}
                                    value={row.writeOffQty}
                                    onChange={(e) =>
                                      handleItemFieldChange(row.id, "writeOffQty", e.target.value)
                                    }
                                    className={`w-24 h-8 px-2 text-right font-mono font-bold text-xs rounded-lg border outline-none transition-colors ${
                                      isOverStock
                                        ? "border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20"
                                        : "border-slate-300 bg-white text-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                    }`}
                                  />
                                  <span className="text-[9.5px] font-semibold text-slate-400">
                                    Max: {row.availableStock}
                                  </span>
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-3 text-right font-mono text-slate-600">
                              {row.unitCost.toLocaleString()}
                            </td>

                            {/* Value (৳) */}
                            <td className="py-3 px-3 text-right font-mono font-bold text-rose-700">
                              ৳ {row.totalLossValue.toLocaleString()}
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

                            {/* Damage Details */}
                            <td className="py-3 px-3">
                              {isViewMode ? (
                                <span className="text-slate-700">{row.damageReasonDetails}</span>
                              ) : (
                                <input
                                  type="text"
                                  placeholder="Specific damage notes..."
                                  value={row.damageReasonDetails}
                                  onChange={(e) =>
                                    handleItemFieldChange(row.id, "damageReasonDetails", e.target.value)
                                  }
                                  className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-rose-500"
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

            {/* Bottom Summary */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Write-Off Cumulative Loss Impact
              </span>
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Total Items: </span>
                  <span className="font-bold text-slate-900 font-mono">{items.length}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Total Quantity: </span>
                  <span className="font-bold text-rose-700 font-mono">
                    {totalWriteOffQty.toLocaleString()} units
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Total Financial Loss: </span>
                  <span className="font-bold text-rose-700 font-mono">
                    ৳ {totalLossValue.toLocaleString()}
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
            transactionQty={activeTrackingItem.writeOffQty}
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
            transactionQty={activeTrackingItem.writeOffQty}
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
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
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
                    className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
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
                            <td className="py-2 px-3 font-mono font-bold text-rose-600">{ci.itemCode}</td>
                            <td className="py-2 px-3 font-bold text-slate-800">{ci.itemName}</td>
                            <td className="py-2 px-3 text-slate-500">{ci.specification || ci.description || "—"}</td>
                            <td className="py-2 px-3 text-slate-600">{ci.brand || "Standard OEM"}</td>
                            <td className="py-2 px-3 text-slate-600">{ci.origin || "Imported"}</td>
                            <td className="py-2 px-3 text-center font-mono font-bold">{ci.stockUOM || ci.purchaseUOM || "PCS"}</td>
                            <td className="py-2 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleSelectItemFromSearch(ci)}
                                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
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
