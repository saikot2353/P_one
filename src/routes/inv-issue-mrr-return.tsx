import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  RotateCcw,
  Building2,
  Calendar,
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
  Package,
  ArrowLeft,
  MapPin,
  Layers,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import {
  SupplierReturn,
  SupplierReturnItem,
  ReturnReason,
  getStoredSupplierReturns,
  setStoredSupplierReturns,
  getStoredMaterialReceipts,
  getStoredPurchaseOrders,
} from "@/lib/procurement-order-inventory-data";
import { DEFAULT_STORE_LOCATIONS } from "@/lib/procurement-master-data";
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

export const Route = createFileRoute("/inv-issue-mrr-return")({
  validateSearch: (search: Record<string, unknown>): { mode?: string; id?: string; returnNo?: string } => ({
    mode: (search.mode as string) || "create",
    id: (search.id as string) || "",
    returnNo: (search.returnNo as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Supplier Return — Inventory Management | CRIPTON" },
      {
        name: "description",
        content:
          "Supplier Return workflow traceable to verified MRRs with current stock quantity validation, batch/location tracking, and automatic inventory deduction.",
      },
    ],
  }),
  component: SupplierReturnPage,
});

export interface ExtendedReturnItem extends SupplierReturnItem {
  currentStockQty: number;
  selectedBatch?: string;
  selectedLocation?: string;
  locationEntries?: LocationEntry[];
  batchEntries?: BatchEntry[];
}

export function SupplierReturnPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const isViewMode = search.mode === "view";
  const isEditMode = search.mode === "edit";

  const purchaseOrders = useMemo(() => getStoredPurchaseOrders(), []);
  const materialReceipts = useMemo(() => getStoredMaterialReceipts(), []);
  const [returnsList, setReturnsList] = useState<SupplierReturn[]>(() =>
    getStoredSupplierReturns()
  );

  const targetReturn = useMemo(() => {
    if (!isViewMode && !isEditMode) return null;
    return (
      returnsList.find(
        (r) =>
          (search.id && r.id === search.id) ||
          (search.returnNo && r.returnNumber === search.returnNo) ||
          (search.id && r.returnNumber === search.id)
      ) ||
      returnsList[0] ||
      null
    );
  }, [returnsList, isViewMode, isEditMode, search.id, search.returnNo]);

  // Return Header Information
  const [returnNumber] = useState(
    () => targetReturn?.returnNumber || `RET-2026-000${Math.floor(10 + Math.random() * 90)}`
  );
  // Return Date is non-editable per requirement
  const [returnDate] = useState(() => targetReturn?.returnDate || new Date().toISOString().slice(0, 10));
  const [department] = useState(() => targetReturn?.department || "Information Technology");

  // Selection Workflow: Step 1: PO Selection -> Step 2: Auto-filled Supplier -> Step 3: MRR Item Selection
  const [selectedPoNumber, setSelectedPoNumber] = useState(
    () => targetReturn?.poNumber || "PO-2026-0001"
  );
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [poSearchQuery, setPoSearchQuery] = useState("");

  const currentPo = useMemo(() => {
    return purchaseOrders.find((p) => p.orderNumber === selectedPoNumber) || purchaseOrders[0];
  }, [purchaseOrders, selectedPoNumber]);

  // Filter MRRs belonging to selected PO
  const availableMrrs = useMemo(() => {
    return materialReceipts.filter(
      (m) => m.poNumber === selectedPoNumber || m.receiveSource === "Direct MRR"
    );
  }, [materialReceipts, selectedPoNumber]);

  // Receiving store auto-populated from MRR, non-editable
  const receivingStore = useMemo(() => {
    if (targetReturn?.storeName) return targetReturn.storeName;
    return availableMrrs[0]?.warehouseStore || currentPo?.deliveryWarehouse || "Pakiza Central Store";
  }, [targetReturn, availableMrrs, currentPo]);

  // Return By auto-populated from currently logged-in user
  const returnBy = useMemo(() => {
    if (targetReturn?.returnedBy) return targetReturn.returnedBy;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cripton_current_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.name) return parsed.name;
          if (parsed?.userId) return parsed.userId;
        }
      } catch {
        // ignore
      }
    }
    return "Tahmid Afsar";
  }, [targetReturn]);

  // MRR item flat rows for multi-select
  interface MrrItemRow {
    mrrNumber: string;
    mrrDate: string;
    challanNo: string;
    storeName: string;
    itemCode: string;
    itemName: string;
    specification: string;
    brand: string;
    origin: string;
    uom: string;
    receivedQty: number;
    unitPrice: number;
    batchNumber?: string;
    location?: string;
    uniqueRowKey: string;
  }

  const flattenedMrrItems = useMemo<MrrItemRow[]>(() => {
    const rows: MrrItemRow[] = [];
    availableMrrs.forEach((mrr) => {
      (mrr.items || []).forEach((it, idx) => {
        rows.push({
          mrrNumber: mrr.receiveNumber,
          mrrDate: mrr.receiveDate,
          challanNo: mrr.challanNo,
          storeName: mrr.warehouseStore,
          itemCode: it.itemCode,
          itemName: it.itemName,
          specification: it.specification,
          brand: it.brand || "Standard",
          origin: it.origin || "Local",
          uom: it.uom,
          receivedQty: it.acceptedQty || it.currentReceiveQty || it.orderedQty,
          unitPrice: it.unitPrice,
          batchNumber: it.batchNumber,
          location: it.location,
          uniqueRowKey: `${mrr.receiveNumber}-${it.itemCode}-${idx}`,
        });
      });
    });
    return rows;
  }, [availableMrrs]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([
    flattenedMrrItems[0]?.uniqueRowKey || "",
  ]);

  // Return Item Details (Populated from selected MRR items or targetReturn)
  const [returnItems, setReturnItems] = useState<ExtendedReturnItem[]>(() => {
    if (targetReturn && targetReturn.items && targetReturn.items.length > 0) {
      return targetReturn.items.map((it, idx) => ({
        id: it.id || `reti-view-${idx}`,
        sl: it.sl || idx + 1,
        itemCode: it.itemCode,
        itemName: it.itemName,
        specification: it.specification,
        brand: it.brand || "Dell Technologies",
        origin: it.origin || "United States",
        uom: it.uom,
        mrrReceivedQty: it.mrrReceivedQty || it.currentReturnQty || 5,
        previouslyReturnedQty: it.previouslyReturnedQty || 0,
        returnableQty: it.returnableQty || it.currentReturnQty || 5,
        currentStockQty: it.currentReturnQty || 5,
        currentReturnQty: it.currentReturnQty,
        unitPrice: it.unitPrice,
        returnValue: it.returnValue,
        batchNumber: it.batchNumber || "BAT-IT-2026-09A",
        location: it.location || "Shelf B - Laptop Storage Units",
        selectedBatch: it.batchNumber || "BAT-IT-2026-09A",
        selectedLocation: it.location || "Shelf B - Laptop Storage Units",
        returnReason: it.returnReason || targetReturn.returnReason || "Defective",
        remarks: it.remarks || "",
      }));
    }
    return [
      {
        id: "reti-1",
        sl: 1,
        itemCode: "IT-LAP-001",
        itemName: "Dell Latitude 5540 Core i7 16GB/512GB",
        specification:
          "Intel Core i7-1365U, 16GB DDR5, 512GB NVMe SSD, 15.6 FHD IPS, 3Y Warranty",
        brand: "Dell Technologies",
        origin: "United States",
        uom: "PCS",
        mrrReceivedQty: 5,
        previouslyReturnedQty: 0,
        returnableQty: 5,
        currentStockQty: 5,
        currentReturnQty: 1,
        unitPrice: 82000,
        returnValue: 82000,
        batchNumber: "BAT-IT-2026-09A",
        location: "Shelf B - Laptop Storage Units",
        selectedBatch: "BAT-IT-2026-09A",
        selectedLocation: "Shelf B - Laptop Storage Units",
        returnReason: "Defective",
        remarks: "Dead pixel line on screen",
      },
    ];
  });

  const [returnRemarks, setReturnRemarks] = useState(
    () =>
      targetReturn?.returnRemarks ||
      "Defective material returned to vendor for immediate credit / replacement."
  );

  // Batch & Location Modals for Return
  const [activeLocItem, setActiveLocItem] = useState<ExtendedReturnItem | null>(null);
  const [activeBatchItem, setActiveBatchItem] = useState<ExtendedReturnItem | null>(null);

  const [tempReturnLocation, setTempReturnLocation] = useState("");
  const [tempReturnBatch, setTempReturnBatch] = useState("");

  // When PO changes, reset selection
  const handleSelectPo = (poNo: string) => {
    setSelectedPoNumber(poNo);
    setPoModalOpen(false);
    toast.success(`Selected PO ${poNo}. Loaded associated MRRs.`);

    // Auto load first MRR item
    const mrrForPo = materialReceipts.filter((m) => m.poNumber === poNo);
    if (mrrForPo.length > 0 && mrrForPo[0].items?.length > 0) {
      const it = mrrForPo[0].items[0];
      const received = it.acceptedQty || it.currentReceiveQty || it.orderedQty;
      const initialItem: ExtendedReturnItem = {
        id: `reti-${Date.now()}-0`,
        sl: 1,
        itemCode: it.itemCode,
        itemName: it.itemName,
        specification: it.specification,
        brand: it.brand || "Standard",
        origin: it.origin || "Local",
        uom: it.uom,
        mrrReceivedQty: received,
        previouslyReturnedQty: 0,
        returnableQty: received,
        currentStockQty: received,
        currentReturnQty: 1,
        unitPrice: it.unitPrice,
        returnValue: it.unitPrice,
        batchNumber: it.batchNumber,
        location: it.location,
        selectedBatch: it.batchNumber,
        selectedLocation: it.location,
        returnReason: "Defective",
        remarks: "",
      };
      setReturnItems([initialItem]);
      setSelectedRowKeys([`${mrrForPo[0].receiveNumber}-${it.itemCode}-0`]);
    } else {
      setReturnItems([]);
      setSelectedRowKeys([]);
    }
  };

  // Toggle MRR item row selection
  const handleToggleMrrItem = (row: MrrItemRow) => {
    const isSelected = selectedRowKeys.includes(row.uniqueRowKey);
    let newKeys: string[];
    if (isSelected) {
      newKeys = selectedRowKeys.filter((k) => k !== row.uniqueRowKey);
    } else {
      newKeys = [...selectedRowKeys, row.uniqueRowKey];
    }
    setSelectedRowKeys(newKeys);

    // Rebuild returnItems from selected keys
    const newItems: ExtendedReturnItem[] = flattenedMrrItems
      .filter((r) => newKeys.includes(r.uniqueRowKey))
      .map((r, idx) => {
        const existing = returnItems.find((i) => i.itemCode === r.itemCode);
        return {
          id: existing?.id || `reti-${Date.now()}-${idx}`,
          sl: idx + 1,
          itemCode: r.itemCode,
          itemName: r.itemName,
          specification: r.specification,
          brand: r.brand,
          origin: r.origin,
          uom: r.uom,
          mrrReceivedQty: r.receivedQty,
          previouslyReturnedQty: 0,
          returnableQty: r.receivedQty,
          currentStockQty: r.receivedQty, // Current Stock Quantity
          currentReturnQty: existing ? existing.currentReturnQty : Math.min(1, r.receivedQty),
          unitPrice: r.unitPrice, // Same unit price from MRR
          returnValue: (existing ? existing.currentReturnQty : Math.min(1, r.receivedQty)) * r.unitPrice,
          batchNumber: r.batchNumber,
          location: r.location,
          selectedBatch: existing?.selectedBatch || r.batchNumber,
          selectedLocation: existing?.selectedLocation || r.location,
          returnReason: existing?.returnReason || "Defective",
          remarks: existing?.remarks || "",
        };
      });

    setReturnItems(newItems);
  };

  // Return Quantity Validation: Cannot exceed Current Stock Qty AND cannot exceed original MRR Received Qty
  const handleUpdateReturnQty = (id: string, qty: number) => {
    setReturnItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const maxAllowed = Math.min(item.currentStockQty, item.mrrReceivedQty);
          if (qty > maxAllowed) {
            toast.error(
              `Return quantity (${qty}) cannot exceed current stock quantity or original received quantity (${maxAllowed} ${item.uom}).`
            );
            qty = maxAllowed;
          }
          if (qty < 0) qty = 0;
          return {
            ...item,
            currentReturnQty: qty,
            returnValue: qty * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  // Open Location modal for return
  const handleOpenLocationModal = (item: ExtendedReturnItem) => {
    setActiveLocItem(item);
  };

  // Open Batch modal for return
  const handleOpenBatchModal = (item: ExtendedReturnItem) => {
    setActiveBatchItem(item);
  };

  // Financial Information Calculations
  const totalReturnedQty = useMemo(() => {
    return returnItems.reduce((s, i) => s + (i.currentReturnQty || 0), 0);
  }, [returnItems]);

  const totalReturnValue = useMemo(() => {
    return returnItems.reduce((s, i) => s + (i.returnValue || 0), 0);
  }, [returnItems]);

  const [previewReportOpen, setPreviewReportOpen] = useState(false);

  const previewReportData: StandardReportData = useMemo(() => {
    return {
      reportType: "supplier-return",
      title: "Material Issue — Supplier Return",
      documentNumber: returnNumber,
      documentNo: returnNumber,
      documentDate: returnDate,
      hideDocHeaderInfo: true,
      department,
      status: "Approved",
      metadata: [
        { label: "Return Number", value: returnNumber, highlight: true },
        { label: "Return Date", value: returnDate },
        {
          label: "PO / WO Number",
          value: `${currentPo?.orderNumber || selectedPoNumber} (${currentPo?.orderDate || "2026-09-15"})`,
        },
        {
          label: "Supplier / Vendor",
          value: `${targetReturn?.supplierName || currentPo?.supplierName || "Apex Textile"} (${currentPo?.supplierCode || "SUP-VENDOR"})`,
        },
        { label: "Receiving Store", value: receivingStore },
        { label: "Department", value: department },
        { label: "Return Reason", value: returnItems[0]?.returnReason || "Defective" },
      ],
      tableHeaders: [
        "SL",
        "Item Description & Spec",
        "Brand / Origin",
        "UOM",
        "Returned Qty",
        "Unit Price (৳)",
        "Return Value (৳)",
        "Reason / Remarks",
      ],
      tableRows: returnItems.map((i, idx) => [
        String(idx + 1),
        <div>
          <div className="font-bold text-slate-900">{i.itemName}</div>
          {i.specification && (
            <div className="text-[10px] text-slate-500 font-mono">{i.specification}</div>
          )}
        </div>,
        `${i.brand || "Pakiza Standard"} / ${i.origin || "Local"}`,
        i.uom,
        String(i.currentReturnQty),
        i.unitPrice.toLocaleString("en-BD", { minimumFractionDigits: 2 }),
        i.returnValue.toLocaleString("en-BD", { minimumFractionDigits: 2 }),
        i.remarks || i.returnReason || "-",
      ]),
      summaryCards: [
        { label: "Total Returned Qty", value: `${totalReturnedQty} units` },
        {
          label: "Total Debit Value",
          value: `৳ ${totalReturnValue.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
          isTotal: true,
        },
      ],
      remarks: returnRemarks || "Material returned to vendor for immediate credit / replacement.",
      signatures: [
        { role: "Store Officer", name: "S. M. Rahman", title: "Assistant Store Incharge", date: returnDate },
        { role: "Quality QA", name: "K. H. Mahmud", title: "Sr. Quality Inspector", date: returnDate },
        { role: "Store Manager", name: "Md. Rafiqul Islam", title: "Manager, Central Store", date: returnDate },
        { role: "Head of Supply Chain", name: "Engr. Tanvir Ahmed", title: "General Manager (SCM)", date: returnDate },
      ],
    };
  }, [
    returnNumber,
    returnDate,
    department,
    currentPo,
    selectedPoNumber,
    targetReturn,
    receivingStore,
    returnItems,
    totalReturnedQty,
    totalReturnValue,
    returnRemarks,
  ]);

  // Submit Supplier Return and deduct stock
  const handleSubmitReturn = () => {
    if (totalReturnedQty === 0) {
      toast.error("Please enter a return quantity greater than 0");
      return;
    }

    // Deduct returned quantity from currentStockQty of items
    const updatedReturnItems = returnItems.map((item) => ({
      ...item,
      currentStockQty: Math.max(0, item.currentStockQty - item.currentReturnQty),
    }));

    const newReturn: SupplierReturn = {
      id: `ret-${Date.now()}`,
      returnNumber,
      returnDate,
      department,
      poNumber: selectedPoNumber,
      mrrNumber: flattenedMrrItems[0]?.mrrNumber || "MRR-2026-0001",
      mrrDate: flattenedMrrItems[0]?.mrrDate || returnDate,
      supplierId: currentPo?.supplierId || "sup-1",
      supplierName: currentPo?.supplierName || "Default Supplier",
      storeName: receivingStore,
      returnedBy: returnBy,
      returnReason: "Defective",
      returnRemarks,
      totalReturnedQty,
      totalReturnValue,
      status: "Approved", // No separate approval workflow required
      items: updatedReturnItems.filter((i) => i.currentReturnQty > 0),
    };

    let updated: SupplierReturn[];
    if (isEditMode && targetReturn) {
      const updatedReturn: SupplierReturn = {
        ...targetReturn,
        department,
        poNumber: selectedPoNumber,
        mrrNumber: flattenedMrrItems[0]?.mrrNumber || targetReturn.mrrNumber,
        mrrDate: flattenedMrrItems[0]?.mrrDate || targetReturn.mrrDate,
        storeName: receivingStore,
        returnRemarks,
        totalReturnedQty,
        totalReturnValue,
        items: updatedReturnItems.filter((i) => i.currentReturnQty > 0),
      };
      updated = returnsList.map((r) => (r.id === targetReturn.id ? updatedReturn : r));
    } else {
      updated = [newReturn, ...returnsList];
    }
    setReturnsList(updated);
    setStoredSupplierReturns(updated);
    setReturnItems(updatedReturnItems);

    toast.success(
      isEditMode
        ? `Supplier Return "${returnNumber}" updated successfully!`
        : `Supplier Return "${returnNumber}" posted! Stock successfully deducted by ${totalReturnedQty} units in ${receivingStore}.`
    );
    navigate({ to: "/inv-supplier-return-list" });
  };

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          <div className="w-full max-w-[1550px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-1">
                <span>Inventory</span>
                <ChevronRight className="size-3" />
                <span>Material Receive</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-bold">Supplier Return</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <RotateCcw className="size-7 text-primary" />
                Supplier Return Management
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Issue materials back to vendor linked with original MRRs with stock reduction and batch/location tracking.
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
                onClick={() => navigate({ to: "/inv-supplier-return-list" })}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-3.5" /> Back to Return List
              </button>
              <button
                type="button"
                onClick={() => setPreviewReportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-primary/30 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
              >
                <Printer className="size-3.5" /> Preview Report
              </button>
              <span className="font-mono font-bold text-xs bg-rose-500/10 text-rose-600 px-3 py-1.5 rounded-xl border border-rose-500/20">
                {returnNumber}
              </span>
            </div>
          </div>

          {/* Section 1: Return Header Information & MRR Traceability */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Return Header Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Return Date* (Non-editable) */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Lock className="size-3 text-muted-foreground" /> Return Date*
                </label>
                <input
                  type="date"
                  readOnly
                  value={returnDate}
                  className="w-full px-3 py-2 font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Lock className="size-3 text-muted-foreground" /> Department*
                </label>
                <input
                  type="text"
                  readOnly
                  value={department}
                  className="w-full px-3 py-2 font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground"
                />
              </div>

              {/* Step 1: Select PO / WO Number (Displays PO No + PO Date, opens searchable modal) */}
              <div className="lg:col-span-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Select PO / WO Number*
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${currentPo?.orderNumber || selectedPoNumber} (${currentPo?.orderDate || "2026-09-15"})`}
                    className={`w-full px-3 py-2 font-bold font-mono bg-muted/30 border border-border rounded-lg text-primary ${isViewMode ? "cursor-default" : "cursor-pointer"}`}
                    onClick={() => !isViewMode && setPoModalOpen(true)}
                  />
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={() => setPoModalOpen(true)}
                      className="px-2.5 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg border border-primary/20 font-bold transition-colors cursor-pointer"
                      title="Search & Select PO/WO"
                    >
                      <Search className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Supplier / Vendor (Auto-populated from PO, non-editable) */}
              <div className="lg:col-span-4">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Lock className="size-3 text-muted-foreground" /> Supplier / Vendor
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${targetReturn?.supplierName || currentPo?.supplierName || "Apex Textile"} (${currentPo?.supplierCode || "SUP-VENDOR"})`}
                  className="w-full px-3 py-2 font-bold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground truncate"
                />
              </div>

              {/* Receiving Store (Auto-populated from MRR, non-editable) */}
              <div className="lg:col-span-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Lock className="size-3 text-muted-foreground" /> Receiving Store
                </label>
                <input
                  type="text"
                  readOnly
                  value={receivingStore}
                  className="w-full px-3 py-2 font-bold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground"
                />
              </div>

              {/* Return By (Auto-populated from logged-in user, non-editable) */}
              <div className="lg:col-span-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Lock className="size-3 text-muted-foreground" /> Return By
                </label>
                <input
                  type="text"
                  readOnly
                  value={returnBy}
                  className="w-full px-3 py-2 font-bold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground"
                />
              </div>

              <div className="lg:col-span-4">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Return Remarks & Debit Note Justification
                </label>
                <input
                  type="text"
                  readOnly={isViewMode}
                  value={returnRemarks}
                  onChange={(e) => setReturnRemarks(e.target.value)}
                  className={`w-full px-3 py-2 border border-border rounded-lg outline-none text-xs ${isViewMode ? "bg-muted/50 cursor-not-allowed" : "bg-background"}`}
                />
              </div>
            </div>
          </div>

          {/* Section 2: MRR Selection Table (Each item appears as separate row; user can select single or multiple) */}
          {!isViewMode && (
            <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      MRR Selection (Items linked to {selectedPoNumber})
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      Select one or multiple items to populate into Return Item Details.
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">
                  {selectedRowKeys.length} Item(s) Selected
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-muted/90 backdrop-blur-xs text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center font-bold">Select</th>
                      <th className="py-2.5 px-3 font-bold w-32">MRR No.</th>
                      <th className="py-2.5 px-3 font-bold w-24">Date</th>
                      <th className="py-2.5 px-3 font-bold w-28">Challan No.</th>
                      <th className="py-2.5 px-3 font-bold">Item Name</th>
                      <th className="py-2.5 px-3 text-right font-bold w-20">Qty</th>
                      <th className="py-2.5 px-3 text-center font-bold w-16">UOM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {flattenedMrrItems.map((row) => {
                      const isSelected = selectedRowKeys.includes(row.uniqueRowKey);
                      return (
                        <tr
                          key={row.uniqueRowKey}
                          onClick={() => handleToggleMrrItem(row)}
                          className={`hover:bg-primary/5 transition-colors cursor-pointer ${
                            isSelected ? "bg-primary/10" : ""
                          }`}
                        >
                          <td className="py-2 px-3 text-center">
                            {isSelected ? (
                              <CheckSquare className="size-4 text-primary mx-auto" />
                            ) : (
                              <Square className="size-4 text-muted-foreground mx-auto" />
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-foreground">
                            {row.mrrNumber}
                          </td>
                          <td className="py-2 px-3 text-muted-foreground">{row.mrrDate}</td>
                          <td className="py-2 px-3 font-mono text-muted-foreground">{row.challanNo}</td>
                          <td className="py-2 px-3">
                            <span className="font-bold text-foreground">{row.itemName}</span>
                            <span className="text-[10px] text-muted-foreground font-mono block">
                              {row.itemCode}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                            {row.receivedQty}
                          </td>
                          <td className="py-2 px-3 text-center text-muted-foreground font-semibold">
                            {row.uom}
                          </td>
                        </tr>
                      );
                    })}
                    {flattenedMrrItems.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-muted-foreground">
                          No MRRs recorded yet for this PO.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 3: Return Item Details Table */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Return Item Details
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                Return Qty cannot exceed Current Stock Qty
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                    <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                    <th className="py-2.5 px-3 min-w-[180px] font-bold">Item Description & Spec</th>
                    <th className="py-2.5 px-3 font-bold w-24">Brand / Origin</th>
                    <th className="py-2.5 px-3 w-16 font-bold text-center">UOM</th>
                    <th className="py-2.5 px-3 text-right font-bold w-20">MRR Rec.</th>
                    {/* Current Stock Qty (Replaces Returnable Qty) */}
                    <th className="py-2.5 px-3 text-right font-bold w-24 text-emerald-600">
                      Current Stock Qty
                    </th>
                    <th className="py-2.5 px-3 text-right font-bold w-24 text-rose-600">
                      Return Qty*
                    </th>
                    <th className="py-2.5 px-2 text-center font-bold w-28">Tracking (B/L)</th>
                    <th className="py-2.5 px-3 text-right font-bold w-28">Unit Price</th>
                    <th className="py-2.5 px-3 text-right font-bold w-28">Return Value (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {returnItems.map((item, idx) => (
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
                      <td className="py-2.5 px-3 text-center text-muted-foreground font-semibold">
                        {item.uom}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                        {item.mrrReceivedQty}
                      </td>
                      {/* Current Stock Quantity */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                        {item.currentStockQty}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {isViewMode ? (
                          <span className="font-mono font-bold text-foreground px-2 py-1">
                            {item.currentReturnQty}
                          </span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            max={Math.min(item.currentStockQty, item.mrrReceivedQty)}
                            value={item.currentReturnQty}
                            onChange={(e) =>
                              handleUpdateReturnQty(item.id, Number(e.target.value))
                            }
                            className="w-20 text-right font-mono font-bold px-2 py-1 bg-background border border-rose-500/40 rounded focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-xs"
                          />
                        )}
                      </td>

                      {/* Unified Tracking (B or L only) Cell */}
                      <td className="py-2.5 px-2 text-center">
                        <ItemTrackingCell
                          mode={getItemTrackingMode(item.itemCode)}
                          locationCount={item.locationEntries?.length || (item.selectedLocation ? 1 : 0)}
                          batchCount={item.batchEntries?.length || (item.selectedBatch ? 1 : 0)}
                          onOpenLocation={isViewMode ? undefined : () => handleOpenLocationModal(item)}
                          onOpenBatch={isViewMode ? undefined : () => handleOpenBatchModal(item)}
                        />
                      </td>

                      {/* Unit Price (Same as MRR, on the same line) */}
                      <td className="py-2.5 px-3 text-right font-mono text-foreground whitespace-nowrap font-medium">
                        ৳ {item.unitPrice.toLocaleString()}
                      </td>

                      {/* Return Value */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground whitespace-nowrap">
                        ৳ {item.returnValue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {returnItems.length === 0 && (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-muted-foreground">
                        No items selected. Please select items from the MRR Selection table above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Action & Stock Deduction */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border/80 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground block">
                Total Return Quantity: <span className="font-mono text-rose-600 font-bold">{totalReturnedQty} Units</span> | Total Value: <span className="text-primary font-mono font-black">৳ {totalReturnValue.toLocaleString()}</span>
              </span>
              <p className="text-[11px] text-muted-foreground">
                {isViewMode
                  ? `Recorded return of ${totalReturnedQty} units.`
                  : `Upon posting, ${totalReturnedQty} units will automatically be deducted from inventory stock.`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!isViewMode ? (
                <button
                  type="button"
                  onClick={handleSubmitReturn}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="size-4" /> {isEditMode ? "Save Changes" : "Post Supplier Return"}
                </button>
              ) : (
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-muted text-muted-foreground border border-border">
                  Return Record Locked (Read-Only)
                </span>
              )}
            </div>
          </div>
          </div>
        </main>
      </div>

      {/* PO / WO Searchable Modal */}
      {poModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Select Purchase Order / Work Order</h3>
                <p className="text-xs text-muted-foreground">
                  Choose approved PO/WO to load corresponding MRR items.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPoModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by PO No., Supplier, or Date..."
                value={poSearchQuery}
                onChange={(e) => setPoSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-muted/30 border border-border rounded-xl outline-none focus:border-primary"
              />
            </div>

            <div className="max-h-72 overflow-y-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/70 text-muted-foreground text-[10px] uppercase font-bold sticky top-0">
                  <tr>
                    <th className="p-2.5">PO No.</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Supplier</th>
                    <th className="p-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {purchaseOrders
                    .filter((po) => {
                      const q = poSearchQuery.toLowerCase().trim();
                      if (!q) return true;
                      return (
                        po.orderNumber.toLowerCase().includes(q) ||
                        po.supplierName.toLowerCase().includes(q) ||
                        po.orderDate.includes(q)
                      );
                    })
                    .map((po) => (
                      <tr
                        key={po.id}
                        onClick={() => handleSelectPo(po.orderNumber)}
                        className="hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <td className="p-2.5 font-mono font-bold text-primary">{po.orderNumber}</td>
                        <td className="p-2.5 text-muted-foreground">{po.orderDate}</td>
                        <td className="p-2.5 font-semibold text-foreground">{po.supplierName}</td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary text-primary-foreground pointer-events-none"
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
      )}

      {/* Return Location Modal */}
      {activeLocItem && (
        <LocationAllocationModal
          isOpen={true}
          onClose={() => setActiveLocItem(null)}
          itemName={activeLocItem.itemName}
          itemCode={activeLocItem.itemCode}
          transactionQty={activeLocItem.currentReturnQty}
          uom={activeLocItem.uom}
          currentStore={receivingStore}
          initialEntries={
            activeLocItem.locationEntries ||
            (activeLocItem.selectedLocation
              ? [{ locationName: activeLocItem.selectedLocation, quantity: activeLocItem.currentReturnQty }]
              : [])
          }
          onSave={(entries) => {
            const locSummary = entries.map((e) => `${e.locationName} (${e.quantity})`).join(", ");
            setReturnItems((prev) =>
              prev.map((i) =>
                i.id === activeLocItem.id
                  ? { ...i, selectedLocation: locSummary, locationEntries: entries }
                  : i
              )
            );
            toast.success(`Location allocated for return: ${locSummary}`);
          }}
        />
      )}

      {/* Return Batch Modal */}
      {activeBatchItem && (
        <BatchAllocationModal
          isOpen={true}
          onClose={() => setActiveBatchItem(null)}
          itemName={activeBatchItem.itemName}
          itemCode={activeBatchItem.itemCode}
          transactionQty={activeBatchItem.currentReturnQty}
          uom={activeBatchItem.uom}
          currentStore={receivingStore}
          initialEntries={
            activeBatchItem.batchEntries ||
            (activeBatchItem.selectedBatch
              ? [
                  {
                    batchNumber: activeBatchItem.selectedBatch,
                    quantity: activeBatchItem.currentReturnQty,
                    createDate: new Date().toISOString().slice(0, 10),
                    expiryDate: "2027-12-31",
                  },
                ]
              : [])
          }
          onSave={(entries) => {
            const batchSummary = entries.map((b) => `${b.batchNumber} (${b.quantity})`).join(", ");
            setReturnItems((prev) =>
              prev.map((i) =>
                i.id === activeBatchItem.id
                  ? { ...i, selectedBatch: batchSummary, batchEntries: entries }
                  : i
              )
            );
            toast.success(`Batch allocated for return: ${batchSummary}`);
          }}
        />
      )}

      {/* Standard Preview Report Modal */}
      <StandardPreviewReportModal
        isOpen={previewReportOpen}
        onClose={() => setPreviewReportOpen(false)}
        data={previewReportData}
      />
    </div>
  );
}
