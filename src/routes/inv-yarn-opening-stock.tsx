import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  Package,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  Trash2,
  Save,
  Search,
  Eye,
  ShieldCheck,
  ChevronRight,
  Calculator,
  Lock,
  X,
  FileSpreadsheet,
  Printer,
  Boxes,
  RotateCcw,
  Upload,
  Download,
  ArrowLeft,
  MapPin,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import {
  DEFAULT_WAREHOUSES,
  DEFAULT_STORE_LOCATIONS,
  DEFAULT_ITEMS,
  ItemProductMaster,
} from "@/lib/procurement-master-data";
import {
  OpeningStockRecord,
  OpeningStockItem,
  getStoredOpeningStocks,
  setStoredOpeningStocks,
} from "@/lib/procurement-order-inventory-data";
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

export interface ExtendedOpeningStockItem extends OpeningStockItem {
  consumedQty?: number;
}

export const Route = createFileRoute("/inv-yarn-opening-stock")({
  validateSearch: (search: Record<string, unknown>): { mode?: string; id?: string; voucherNo?: string } => ({
    mode: (search.mode as string) || "create",
    id: (search.id as string) || "",
    voucherNo: (search.voucherNo as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Opening Stock Entry — Inventory Management | CRIPTON" },
      {
        name: "description",
        content:
          "Set initial store-wise inventory balances with multi-item entry, batch/location tracking, Excel upload, and stock usage protection.",
      },
    ],
  }),
  component: OpeningStockPage,
});

export function OpeningStockPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const isViewMode = search.mode === "view";

  const [openingRecords, setOpeningRecords] = useState<OpeningStockRecord[]>(() =>
    getStoredOpeningStocks()
  );

  const targetRecord = useMemo(() => {
    if (!isViewMode) return null;
    return (
      openingRecords.find(
        (r) =>
          (search.id && r.id === search.id) ||
          (search.voucherNo && r.openingStockId === search.voucherNo) ||
          (search.id && r.openingStockId === search.id)
      ) ||
      openingRecords[0] ||
      null
    );
  }, [openingRecords, isViewMode, search.id, search.voucherNo]);

  // Form State
  const [openingStockId] = useState(
    () => targetRecord?.openingStockId || `OS-2026-000${Math.floor(10 + Math.random() * 90)}`
  );
  const [stockDate, setStockDate] = useState(
    () => targetRecord?.stockDate || new Date().toISOString().slice(0, 10)
  );
  const [warehouseStoreCode, setWarehouseStoreCode] = useState(
    () => targetRecord?.storeCode || "WH-PKCL-01"
  );
  const [remarks, setRemarks] = useState(
    () => targetRecord?.remarks || "System initialization opening stock count."
  );
  // Warehouse Lock: once posted or in view mode, warehouse cannot be changed
  const [isWarehouseLocked, setIsWarehouseLocked] = useState(() => isViewMode);

  // Modals
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [excelModalOpen, setExcelModalOpen] = useState(false);

  // Active Store Config
  const currentStore = useMemo(() => {
    return (
      DEFAULT_WAREHOUSES.find((w) => w.storeCode === warehouseStoreCode) || DEFAULT_WAREHOUSES[0]
    );
  }, [warehouseStoreCode]);

  // Available Locations for current store
  const storeLocations = useMemo(() => {
    return DEFAULT_STORE_LOCATIONS.filter(
      (l) => l.trackingMode === "Location" || l.locationTrackingEnabled
    );
  }, []);

  const registeredBatches = useMemo(() => {
    return DEFAULT_STORE_LOCATIONS.filter((l) => l.batchNumbering || l.batchTrackingEnabled);
  }, []);

  // Opening Stock Line Items (with simulated consumedQty for protection testing)
  const [items, setItems] = useState<ExtendedOpeningStockItem[]>(() => {
    if (targetRecord && targetRecord.items && targetRecord.items.length > 0) {
      return targetRecord.items.map((it, idx) => ({
        id: it.id || `osi-view-${idx}`,
        sl: it.sl || idx + 1,
        itemCode: it.itemCode,
        itemName: it.itemName,
        specification: it.specification,
        brand: it.brand || "Standard",
        origin: it.origin || "Local",
        uom: it.uom,
        openingQuantity: it.openingQuantity,
        unitCost: it.unitCost,
        totalValue: it.totalValue,
        batchNumber: it.batchNumber || "",
        manufacturingDate: it.manufacturingDate || "",
        expiryDate: it.expiryDate || "",
        location: it.location || "",
        remarks: it.remarks || "",
        consumedQty: it.consumedQty || 0,
      }));
    }
    return [
      {
        id: "osi-1",
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        openingQuantity: 5000,
        unitCost: 420,
        totalValue: 2100000,
        batchNumber: "BAT-YRN-2026-09A",
        manufacturingDate: "2026-08-15",
        expiryDate: "2027-08-15",
        location: "Rack A1 - Raw Cotton Pallet",
        remarks: "Physical warehouse count verified",
        consumedQty: 500, // 500 KG already issued/consumed
      },
      {
        id: "osi-2",
        sl: 2,
        itemCode: "ITM-IT-LAT-5440",
        itemName: "Dell Latitude 5440 Core i7 Business Laptop",
        specification: "13th Gen Intel Core i7-1370P, 16GB DDR5, 512GB NVMe SSD",
        brand: "Dell Technologies",
        origin: "Malaysia",
        uom: "PCS",
        openingQuantity: 15,
        unitCost: 125000,
        totalValue: 1875000,
        batchNumber: "",
        location: "Shelf B - Laptop Storage Units",
        remarks: "Head Office IT inventory",
        consumedQty: 0, // 0 consumed
      },
    ];
  });

  // Location and Batch modals state
  const [itemLocations, setItemLocations] = useState<Record<string, LocationEntry[]>>({});
  const [itemBatches, setItemBatches] = useState<Record<string, BatchEntry[]>>({});
  const [activeLocationItemId, setActiveLocationItemId] = useState<string | null>(null);
  const [activeBatchItemId, setActiveBatchItemId] = useState<string | null>(null);

  const handleOpenLocationModal = (item: ExtendedOpeningStockItem) => {
    setActiveLocationItemId(item.id);
  };

  const handleOpenBatchModal = (item: ExtendedOpeningStockItem) => {
    setActiveBatchItemId(item.id);
  };

  // Catalog Items Filter for Search Modal (NO PRICE COLUMN)
  const filteredCatalogItems = useMemo(() => {
    const q = itemSearchQuery.toLowerCase().trim();
    if (!q) return DEFAULT_ITEMS;
    return DEFAULT_ITEMS.filter(
      (i) =>
        i.itemName.toLowerCase().includes(q) ||
        i.itemCode.toLowerCase().includes(q) ||
        (i.specification && i.specification.toLowerCase().includes(q)) ||
        (i.brand && i.brand.toLowerCase().includes(q)) ||
        (i.origin && i.origin.toLowerCase().includes(q)) ||
        (i.stockUOM && i.stockUOM.toLowerCase().includes(q))
    );
  }, [itemSearchQuery]);

  const handleAddItemFromCatalog = (catalogItem: ItemProductMaster) => {
    const exists = items.some((i) => i.itemCode === catalogItem.itemCode);
    if (exists) {
      toast.info(`Item ${catalogItem.itemCode} is already added in this voucher.`);
      return;
    }

    const newItem: ExtendedOpeningStockItem = {
      id: `osi-${Date.now()}`,
      sl: items.length + 1,
      itemCode: catalogItem.itemCode,
      itemName: catalogItem.itemName,
      specification: catalogItem.specification || "Standard grade",
      brand: catalogItem.brand || "Standard",
      origin: catalogItem.origin || "Local",
      uom: catalogItem.stockUOM || "PCS",
      openingQuantity: 100,
      unitCost: catalogItem.standardPurchasePrice || 500,
      totalValue: 100 * (catalogItem.standardPurchasePrice || 500),
      batchNumber: "",
      location: "",
      remarks: "",
      consumedQty: 0,
    };

    setItems((prev) => [...prev, newItem]);
    setItemSearchOpen(false);
    toast.success(`Added item "${catalogItem.itemName}".`);
  };

  // Opening Stock Quantity Protection:
  // Cannot reduce Opening Stock Quantity below quantity already issued/consumed
  const handleUpdateItemQuantity = (id: string, newQty: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const consumed = item.consumedQty || 0;
    if (consumed > 0 && newQty < consumed) {
      toast.error(
        `Quantity Protection: Cannot reduce Opening Stock Quantity (${newQty}) below already issued/consumed quantity (${consumed} ${item.uom}).`
      );
      return;
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const qty = Math.max(0, newQty);
          return {
            ...i,
            openingQuantity: qty,
            totalValue: qty * i.unitCost,
          };
        }
        return i;
      })
    );
  };

  const handleUpdateItemCost = (id: string, unitCost: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              unitCost,
              totalValue: i.openingQuantity * unitCost,
            }
          : i
      )
    );
  };

  // Opening Stock Quantity Protection:
  // Cannot delete an opening stock line that has already been used/consumed
  const handleRemoveItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if ((item.consumedQty || 0) > 0) {
      toast.error(
        `Quantity Protection: Cannot delete "${item.itemName}" because ${item.consumedQty} ${item.uom} have already been issued/consumed in warehouse transactions.`
      );
      return;
    }

    setItems((prev) => prev.filter((i) => i.id !== id).map((it, idx) => ({ ...it, sl: idx + 1 })));
    toast.info("Line item removed.");
  };

  // Totals
  const totalQty = useMemo(() => {
    return items.reduce((sum, i) => sum + (Number(i.openingQuantity) || 0), 0);
  }, [items]);

  const totalVal = useMemo(() => {
    return items.reduce((sum, i) => sum + (Number(i.totalValue) || 0), 0);
  }, [items]);

  const [previewReportOpen, setPreviewReportOpen] = useState(false);

  const previewReportData: StandardReportData = useMemo(() => {
    return {
      reportType: "opening-stock",
      title: "Opening Stock Inventory Declaration",
      documentNo: openingStockId,
      documentDate: stockDate,
      department: "Central Inventory Store",
      status: "Approved",
      metadata: [
        { label: "Opening Stock ID", value: openingStockId, highlight: true },
        { label: "Stock Date", value: stockDate },
        { label: "Warehouse / Store", value: `${currentStore.storeName} (${currentStore.storeCode})` },
        { label: "Organization", value: currentStore.organization },
        { label: "Total Line Items", value: `${items.length} items` },
      ],
      tableHeaders: [
        "SL",
        "Item Code & Name",
        "Specifications / Brand",
        "UOM",
        "Opening Qty",
        "Unit Cost (৳)",
        "Total Value (৳)",
        "Remarks",
      ],
      tableRows: items.map((i, idx) => [
        String(idx + 1),
        `${i.itemCode} - ${i.itemName}`,
        `${i.specification || "-"} / Brand: ${i.brand} / Origin: ${i.origin}`,
        i.uom,
        i.openingQuantity.toLocaleString(),
        i.unitCost.toLocaleString("en-BD", { minimumFractionDigits: 2 }),
        i.totalValue.toLocaleString("en-BD", { minimumFractionDigits: 2 }),
        i.remarks || (i.consumedQty ? `Issued: ${i.consumedQty}` : "-"),
      ]),
      summaryCards: [
        { label: "Total Line Items", value: `${items.length} items` },
        { label: "Total Opening Quantity", value: `${totalQty.toLocaleString()} units` },
        {
          label: "Total Valuation",
          value: `৳ ${totalVal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
          isTotal: true,
        },
      ],
      remarks: remarks || "Opening inventory stock recorded and verified against physical stock take.",
      signatures: [
        { role: "Inventory Auditor", name: "S. M. Rahman", title: "Assistant Store Incharge", date: stockDate },
        { role: "Store In-Charge", name: "Md. Rafiqul Islam", title: "Manager, Central Store", date: stockDate },
        { role: "Accounts & Audit", name: "K. H. Mahmud", title: "Head of Internal Audit", date: stockDate },
        { role: "Authorized Director", name: "Engr. Tanvir Ahmed", title: "Director (SCM & Operations)", date: stockDate },
      ],
    };
  }, [openingStockId, stockDate, currentStore, items, totalQty, totalVal, remarks]);

  // Excel Upload: Download Sample Template
  const handleDownloadSampleTemplate = () => {
    const header = "Item Code,Item Name,Specification,Brand,Origin,UOM,Opening Quantity,Unit Cost,Batch Number,Location\n";
    const sampleRows = [
      "ITM-YRN-30-1,100% Combed Cotton Yarn Ne 30/1,100% Combed Cotton Ne 30/1 ring spun,Groz-Beckert,Bangladesh,KG,1000,420,BAT-2026-YRN,Rack A1",
      "ITM-IT-LAT-5440,Dell Latitude 5440 Core i7 Laptop,13th Gen Intel Core i7 16GB/512GB,Dell Technologies,Malaysia,PCS,5,125000,,Shelf B",
    ].join("\n");

    const blob = new Blob([header + sampleRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "opening_stock_sample_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Sample template downloaded successfully!");
  };

  // Excel Upload: File Import Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        toast.error("File is empty or contains no valid data rows.");
        return;
      }

      const importedItems: ExtendedOpeningStockItem[] = [];
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim());
        if (cols.length >= 6) {
          const [itemCode, itemName, specification, brand, origin, uom, qtyStr, costStr, batchNumber, location] = cols;
          const qty = parseFloat(qtyStr) || 100;
          const cost = parseFloat(costStr) || 500;
          importedItems.push({
            id: `osi-import-${Date.now()}-${i}`,
            sl: items.length + i,
            itemCode: itemCode || `ITM-IMP-${i}`,
            itemName: itemName || `Imported Item ${i}`,
            specification: specification || "Standard",
            brand: brand || "Standard",
            origin: origin || "Local",
            uom: uom || "PCS",
            openingQuantity: qty,
            unitCost: cost,
            totalValue: qty * cost,
            batchNumber: batchNumber || "",
            location: location || "",
            consumedQty: 0,
          });
        }
      }

      if (importedItems.length > 0) {
        setItems((prev) => [...prev, ...importedItems]);
        setExcelModalOpen(false);
        toast.success(`Successfully imported ${importedItems.length} opening stock items!`);
      } else {
        toast.error("Could not parse valid items from file. Please check format.");
      }
    };
    reader.readAsText(file);
  };

  // Post Opening Stock & Lock Warehouse
  const handleSubmitOpeningStock = () => {
    if (items.length === 0 || totalQty === 0) {
      toast.error("Please add at least one line item with opening quantity > 0");
      return;
    }

    const newRecord: OpeningStockRecord = {
      id: `os-${Date.now()}`,
      openingStockId,
      stockDate,
      storeId: currentStore.id,
      storeCode: currentStore.storeCode,
      storeName: currentStore.storeName,
      organization: currentStore.organization,
      totalItems: items.length,
      totalQuantity: totalQty,
      totalValue: totalVal,
      status: "Approved",
      remarks,
      items: items.map((i) => ({
        id: i.id,
        sl: i.sl,
        itemCode: i.itemCode,
        itemName: i.itemName,
        specification: i.specification,
        brand: i.brand,
        origin: i.origin,
        uom: i.uom,
        openingQuantity: i.openingQuantity,
        unitCost: i.unitCost,
        totalValue: i.totalValue,
        batchNumber: i.batchNumber,
        manufacturingDate: i.manufacturingDate,
        expiryDate: i.expiryDate,
        location: i.location,
        remarks: i.remarks,
      })),
    };

    const updated = [newRecord, ...openingRecords];
    setOpeningRecords(updated);
    setStoredOpeningStocks(updated);

    // Lock warehouse store for this transaction
    setIsWarehouseLocked(true);

    toast.success(
      `Opening Stock "${openingStockId}" posted successfully! Initial inventory recorded for ${currentStore.storeName}.`
    );
    navigate({ to: "/inv-opening-stock-list" });
  };

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-1">
                <span>Inventory</span>
                <ChevronRight className="size-3" />
                <span>Initialization</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-bold">Opening Stock</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <Boxes className="size-7 text-primary" />
                Opening Stock Management
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Set initial store-wise inventory balances with item-level batch & location tracking, Excel upload, and stock usage protection.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isViewMode && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  View Mode
                </span>
              )}
              <button
                type="button"
                onClick={() => navigate({ to: "/inv-opening-stock-list" })}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-3.5" /> Back to Opening Stock List
              </button>
              <button
                type="button"
                onClick={() => setPreviewReportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors cursor-pointer"
                title="Preview Opening Stock Standard Report"
              >
                <Printer className="size-3.5" /> Preview Report
              </button>
              {!isViewMode && (
                <button
                  type="button"
                  onClick={() => setExcelModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <Upload className="size-3.5" /> Upload Excel
                </button>
              )}
              <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-xl border border-primary/20">
                {openingStockId}
              </span>
            </div>
          </div>

          {/* Form Card: Initial Opening Balance Setup */}
          <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Initial Opening Balance Setup
                </h2>
              </div>
              {isWarehouseLocked && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-lg border border-amber-200">
                  <Lock className="size-3" /> Warehouse Locked After Posting
                </span>
              )}
            </div>

            {/* Header Information: Storage Section Cleaned Up (Location & Batch Tracking badges removed) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Opening Stock ID*
                </label>
                <input
                  type="text"
                  readOnly
                  value={openingStockId}
                  className="w-full px-3 py-2 font-mono font-bold bg-muted/50 border border-border rounded-lg cursor-not-allowed select-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Stock Date*
                </label>
                <input
                  type="date"
                  readOnly={isViewMode}
                  value={stockDate}
                  onChange={(e) => setStockDate(e.target.value)}
                  className={`w-full px-3 py-2 font-semibold border border-border rounded-lg outline-none focus:border-primary ${
                    isViewMode ? "bg-muted/50 cursor-not-allowed" : "bg-background"
                  }`}
                />
              </div>

              {/* Warehouse / Store* (Locked once posted) */}
              <div className="lg:col-span-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  {(isWarehouseLocked || isViewMode) && <Lock className="size-3 text-muted-foreground" />} Warehouse / Store*
                </label>
                <select
                  disabled={isWarehouseLocked || isViewMode}
                  value={warehouseStoreCode}
                  onChange={(e) => setWarehouseStoreCode(e.target.value)}
                  className={`w-full px-3 py-2 font-bold rounded-lg border border-border outline-none focus:border-primary cursor-pointer ${
                    isWarehouseLocked || isViewMode ? "bg-muted/60 cursor-not-allowed text-muted-foreground" : "bg-background"
                  }`}
                >
                  {DEFAULT_WAREHOUSES.map((wh) => (
                    <option key={wh.id} value={wh.storeCode}>
                      {wh.storeName} ({wh.storeCode} • {wh.organization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-4">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Opening Stock Remarks
                </label>
                <input
                  type="text"
                  readOnly={isViewMode}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Migration from legacy ERP system"
                  className={`w-full px-3 py-2 border border-border rounded-lg outline-none text-xs ${
                    isViewMode ? "bg-muted/50 cursor-not-allowed" : "bg-background"
                  }`}
                />
              </div>
            </div>

            {/* 2. Opening Stock Item Details Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Opening Stock Line Items
                  </h3>
                </div>
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setItemSearchQuery("");
                      setItemSearchOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
                  >
                    <Plus className="size-3.5" /> Search Item
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                      <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                      <th className="py-2.5 px-3 min-w-[200px] font-bold">Item Description & Spec*</th>
                      <th className="py-2.5 px-3 font-bold w-24">Brand / Origin</th>
                      <th className="py-2.5 px-3 w-16 font-bold text-center">UOM</th>
                      <th className="py-2.5 px-3 text-right font-bold w-28 text-primary">
                        Opening Qty*
                      </th>
                      <th className="py-2.5 px-2 text-center font-bold w-28">Tracking (B/L)</th>
                      <th className="py-2.5 px-3 text-right font-bold w-24">Unit Cost (৳)</th>
                      <th className="py-2.5 px-3 text-right font-bold w-28">Total Value (৳)</th>
                      {!isViewMode && <th className="py-2.5 px-3 w-12 text-center">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((item, idx) => {
                      const trackingMode = getItemTrackingMode(item.itemCode);
                      const itemLocCount = itemLocations[item.id]?.length || (item.location ? 1 : 0);
                      const itemBatchCount = itemBatches[item.id]?.length || (item.batchNumber ? 1 : 0);
                      const consumed = item.consumedQty || 0;

                      return (
                        <tr key={item.id} className="hover:bg-muted/20">
                          <td className="py-2.5 px-3 text-center text-muted-foreground font-bold">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-foreground">{item.itemName}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {item.itemCode} • {item.specification}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground text-[11px] whitespace-nowrap">
                            {item.brand} / {item.origin}
                          </td>
                          <td className="py-2.5 px-3 text-center font-semibold text-muted-foreground">
                            {item.uom}
                          </td>

                          {/* Opening Quantity (Protected against reducing below consumed) */}
                          <td className="py-2.5 px-3 text-right">
                            {isViewMode ? (
                              <span className="font-mono font-bold text-foreground">
                                {item.openingQuantity.toLocaleString()}
                              </span>
                            ) : (
                              <>
                                <input
                                  type="number"
                                  min={consumed || 0.01}
                                  step="any"
                                  value={item.openingQuantity}
                                  onChange={(e) =>
                                    handleUpdateItemQuantity(item.id, Number(e.target.value))
                                  }
                                  className="w-24 text-right font-mono font-bold px-2 py-1 bg-background border border-primary/40 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs"
                                />
                                {consumed > 0 && (
                                  <div className="text-[9.5px] text-rose-600 font-semibold text-right mt-0.5" title="Quantity Protection Active">
                                    Min: {consumed}
                                  </div>
                                )}
                              </>
                            )}
                          </td>

                          {/* Item-level Tracking (B or L) */}
                          <td className="py-2.5 px-2 text-center">
                            <ItemTrackingCell
                              mode={trackingMode}
                              locationCount={itemLocCount}
                              batchCount={itemBatchCount}
                              onOpenLocation={isViewMode ? undefined : () => handleOpenLocationModal(item)}
                              onOpenBatch={isViewMode ? undefined : () => handleOpenBatchModal(item)}
                            />
                          </td>

                          <td className="py-2.5 px-3 text-right">
                            {isViewMode ? (
                              <span className="font-mono text-foreground">
                                ৳ {item.unitCost.toLocaleString()}
                              </span>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                value={item.unitCost}
                                onChange={(e) =>
                                  handleUpdateItemCost(item.id, Number(e.target.value))
                                }
                                className="w-20 text-right font-mono px-2 py-1 bg-background border border-border rounded outline-none text-xs"
                              />
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground whitespace-nowrap">
                            ৳ {item.totalValue.toLocaleString()}
                          </td>

                          {!isViewMode && (
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={consumed > 0}
                                className={`p-1 rounded transition-colors ${
                                  consumed > 0
                                    ? "text-muted-foreground/40 cursor-not-allowed"
                                    : "text-rose-500 hover:text-rose-600 cursor-pointer"
                                }`}
                                title={consumed > 0 ? "Cannot delete item with active consumption" : "Remove line"}
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={isViewMode ? 8 : 9} className="py-8 text-center text-muted-foreground">
                          No opening balance items added yet. Click &quot;Search Item&quot; or &quot;Upload Excel&quot; to begin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 rounded-xl bg-muted/20 border border-border text-xs">
                <span className="text-muted-foreground">
                  Items: <strong className="text-foreground">{items.length}</strong> | Total Opening Quantity: <strong className="text-primary font-mono">{totalQty.toLocaleString()}</strong>
                </span>
                <span className="font-bold">
                  Total Valuation:{" "}
                  <span className="font-mono text-sm text-primary font-black">
                    ৳ {totalVal.toLocaleString()}
                  </span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center pt-3 border-t border-border/60">
              <div className="flex items-center gap-3">
                {!isViewMode ? (
                  <>
                    <button
                      type="button"
                      onClick={() => navigate({ to: "/inv-opening-stock-list" })}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitOpeningStock}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="size-4" /> Post Opening Stock
                    </button>
                  </>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-muted text-muted-foreground border border-border">
                    Opening Stock Voucher Locked (Read-Only)
                  </span>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Larger Catalog Item Search Modal (Item Code, Item Name, Specification, Brand, Origin, UoM) */}
      {itemSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-4xl rounded-2xl border border-border shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Search Master Data Items</h3>
                <p className="text-xs text-muted-foreground">
                  Select item from master catalog to add to opening stock.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setItemSearchOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search items by code, name, specification, brand, origin, UoM..."
                value={itemSearchQuery}
                onChange={(e) => setItemSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-muted/30 border border-border rounded-xl outline-none focus:border-primary font-medium"
              />
            </div>

            <div className="overflow-x-auto rounded-xl border border-border max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-muted/90 backdrop-blur-xs text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3 font-bold w-28">Item Code</th>
                    <th className="py-2.5 px-3 font-bold">Item Name</th>
                    <th className="py-2.5 px-3 font-bold">Specification</th>
                    <th className="py-2.5 px-3 font-bold w-28">Brand</th>
                    <th className="py-2.5 px-3 font-bold w-28">Origin</th>
                    <th className="py-2.5 px-3 font-bold w-16 text-center">UoM</th>
                    <th className="py-2.5 px-3 text-center font-bold w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCatalogItems.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleAddItemFromCatalog(item)}
                      className="hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-primary whitespace-nowrap">
                        {item.itemCode}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-foreground">
                        {item.itemName}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground max-w-[200px] truncate" title={item.specification}>
                        {item.specification || "Standard"}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                        {item.brand || "Standard"}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                        {item.origin || "Local"}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-muted-foreground">
                        {item.stockUOM}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCatalogItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No matching items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Opening Stock Excel Upload Modal */}
      {excelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <Upload className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Upload Opening Stock Excel</h3>
                  <p className="text-xs text-muted-foreground">
                    Import opening inventory lines via sample spreadsheet.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExcelModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-border/80 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Step 1: Download Sample Template</span>
                  <span className="text-[11px] text-muted-foreground">
                    Pre-formatted template with required columns and example data.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSampleTemplate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-bold text-xs border border-primary/20 transition-colors cursor-pointer"
                >
                  <Download className="size-3.5" /> Download Template
                </button>
              </div>

              <div className="pt-2 border-t border-border/60">
                <span className="font-bold text-foreground block mb-1">Step 2: Upload Completed File</span>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-5 hover:bg-muted/40 transition-colors cursor-pointer text-center">
                  <FileSpreadsheet className="size-8 text-emerald-600 mb-2" />
                  <span className="text-xs font-bold text-foreground">
                    Click to select CSV / Excel spreadsheet
                  </span>
                  <span className="text-[10.5px] text-muted-foreground mt-0.5">
                    Validates item code, quantity, and cost automatically
                  </span>
                  <input
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setExcelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Assignment Modal */}
      {activeLocationItemId && (() => {
        const item = items.find((i) => i.id === activeLocationItemId);
        if (!item) return null;
        return (
          <LocationAllocationModal
            isOpen={true}
            onClose={() => setActiveLocationItemId(null)}
            itemName={item.itemName}
            itemCode={item.itemCode}
            transactionQty={item.openingQuantity}
            uom={item.uom}
            currentStore={currentStore.storeName}
            initialEntries={
              itemLocations[item.id] ||
              (item.location ? [{ locationName: item.location, quantity: item.openingQuantity }] : [])
            }
            onSave={(entries) => {
              setItemLocations((prev) => ({ ...prev, [item.id]: entries }));
              const locSummary = entries.map((e) => `${e.locationName} (${e.quantity})`).join(", ");
              setItems((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, location: locSummary } : i))
              );
              toast.success(`Assigned locations for ${item.itemName}`);
            }}
          />
        );
      })()}

      {/* Batch Assignment Modal */}
      {activeBatchItemId && (() => {
        const item = items.find((i) => i.id === activeBatchItemId);
        if (!item) return null;
        return (
          <BatchAllocationModal
            isOpen={true}
            onClose={() => setActiveBatchItemId(null)}
            itemName={item.itemName}
            itemCode={item.itemCode}
            transactionQty={item.openingQuantity}
            uom={item.uom}
            currentStore={currentStore.storeName}
            initialEntries={
              itemBatches[item.id] ||
              (item.batchNumber
                ? [
                    {
                      batchNumber: item.batchNumber,
                      quantity: item.openingQuantity,
                      createDate: item.manufacturingDate || new Date().toISOString().slice(0, 10),
                      expiryDate: item.expiryDate || "2027-12-31",
                    },
                  ]
                : [])
            }
            onSave={(entries) => {
              setItemBatches((prev) => ({ ...prev, [item.id]: entries }));
              const batchSummary = entries.map((b) => `${b.batchNumber} (${b.quantity})`).join(", ");
              setItems((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, batchNumber: batchSummary } : i))
              );
              toast.success(`Assigned batches for ${item.itemName}`);
            }}
          />
        );
      })()}

      {/* Standard Preview Report Modal */}
      <StandardPreviewReportModal
        isOpen={previewReportOpen}
        onClose={() => setPreviewReportOpen(false)}
        data={previewReportData}
      />
    </div>
  );
}
