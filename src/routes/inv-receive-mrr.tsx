import { useState, useMemo, useEffect } from "react";
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
  Upload,
  ArrowLeft,
  MapPin,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import {
  DEFAULT_WAREHOUSES,
  DEFAULT_STORE_LOCATIONS,
  DEFAULT_ITEMS,
} from "@/lib/procurement-master-data";
import {
  MaterialReceive,
  MRRItem,
  getStoredMaterialReceipts,
  setStoredMaterialReceipts,
  getStoredPurchaseOrders,
  getStoredPoItems,
  getStoredReceiveList,
  setStoredReceiveList,
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

export const Route = createFileRoute("/inv-receive-mrr")({
  validateSearch: (search: Record<string, unknown>): { poNumber?: string; warehouse?: string; mode?: string } => ({
    poNumber: search.poNumber as string | undefined,
    warehouse: search.warehouse as string | undefined,
    mode: search.mode as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Material Receive (MRR) — Inventory Management | CRIPTON" },
      {
        name: "description",
        content:
          "Perform official Material Receive / MRR transactions linked with approved Purchase Orders with batch, location, and QA inspection controls.",
      },
    ],
  }),
  component: MaterialReceiveMRRPage,
});

export function MaterialReceiveMRRPage() {
  const navigate = useNavigate();
  const searchParams =
    (Route.useSearch() as {
      poNumber?: string;
      warehouse?: string;
      mode?: string;
    }) || {};

  const isViewMode = searchParams.mode === "view";

  const purchaseOrders = useMemo(() => getStoredPurchaseOrders(), []);
  const poItemsMap = useMemo(() => getStoredPoItems(), []);
  const [materialReceipts, setMaterialReceipts] = useState<MaterialReceive[]>(() =>
    getStoredMaterialReceipts()
  );

  // Active PO reference
  const selectedPoNumber = searchParams.poNumber || "PO-2026-0001";
  const currentPo = useMemo(() => {
    return purchaseOrders.find((p) => p.orderNumber === selectedPoNumber) || purchaseOrders[0];
  }, [purchaseOrders, selectedPoNumber]);

  // Warehouse auto-populated from PO/selected store, cannot be changed
  const selectedStore = searchParams.warehouse || currentPo?.deliveryWarehouse || "Pakiza Technovation Central IT & Hardware Depot";

  // 1. Receive Header Information
  const [receiveNumber] = useState(
    () => `MRR-2026-000${Math.floor(10 + Math.random() * 90)}`
  );
  const [receiveDate, setReceiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [challanNo, setChallanNo] = useState("CH-2026-9901");
  const [challanDate, setChallanDate] = useState(new Date().toISOString().slice(0, 10));
  const [receivedBy] = useState("Tahmid Afsar Shapno - Store Officer");
  const [remarks, setRemarks] = useState("");

  // Quality / Inspection Global Remarks
  const [inspectionRemarks, setInspectionRemarks] = useState(
    "Visual inspection completed, serial numbers recorded, items in good condition."
  );

  // Material Receive Details Items State
  // Populated using Base/SKU UOM (Order Qty × Conversion Factor)
  const [mrrItems, setMrrItems] = useState<MRRItem[]>(() => {
    const rawItems = poItemsMap[selectedPoNumber] || currentPo?.items || [];
    if (rawItems && rawItems.length > 0) {
      return rawItems.map((it: any, idx: number) => {
        const factor = it.conversionFactor && it.conversionFactor > 0 ? it.conversionFactor : 1;
        const baseOrderedQty = Math.round((it.orderedQuantity || 1) * factor);
        const prevReceived = 0;
        const currentReceive = baseOrderedQty;
        return {
          id: `mrri-${it.id || idx + 1}`,
          sl: idx + 1,
          itemCode: it.itemCode,
          itemName: it.itemName,
          specification: it.specification || "",
          brand: it.brand || "Standard",
          origin: it.origin || "Local",
          uom: it.uom, // Base/SKU UOM
          orderedQty: baseOrderedQty,
          previouslyReceivedQty: prevReceived,
          currentReceiveQty: currentReceive,
          remainingQty: baseOrderedQty - prevReceived - currentReceive,
          unitPrice: Math.round(it.unitPrice / factor) || it.unitPrice,
          lineTotal: currentReceive * (Math.round(it.unitPrice / factor) || it.unitPrice),
          batchNumber: "BAT-2026-01",
          createDate: new Date().toISOString().slice(0, 10),
          expiryDate: "",
          location: "",
          acceptedQty: currentReceive,
          rejectedQty: 0,
          remarks: "",
        };
      });
    }

    // Default fallback sample items
    return [
      {
        id: "mrri-1",
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        orderedQty: 240, // Base Qty
        previouslyReceivedQty: 0,
        currentReceiveQty: 240,
        remainingQty: 0,
        unitPrice: 420,
        lineTotal: 100800,
        batchNumber: "BAT-YRN-2026-A1",
        createDate: new Date().toISOString().slice(0, 10),
        expiryDate: "2027-09-30",
        location: "Rack A1 - Raw Cotton Pallet",
        acceptedQty: 240,
        rejectedQty: 0,
        remarks: "",
      },
      {
        id: "mrri-2",
        sl: 2,
        itemCode: "ITM-IT-LAT-5440",
        itemName: "Dell Latitude 5440 Core i7 Business Laptop",
        specification: "13th Gen Intel Core i7-1370P, 16GB DDR5, 512GB NVMe SSD, 14 FHD IPS",
        brand: "Dell Technologies",
        origin: "Malaysia",
        uom: "PCS",
        orderedQty: 10,
        previouslyReceivedQty: 0,
        currentReceiveQty: 10,
        remainingQty: 0,
        unitPrice: 125000,
        lineTotal: 1250000,
        batchNumber: "",
        createDate: new Date().toISOString().slice(0, 10),
        expiryDate: "",
        location: "Shelf B - Laptop Storage Units",
        acceptedQty: 10,
        rejectedQty: 0,
        remarks: "",
      },
    ];
  });

  // Track location and batch assignments per item
  const [itemLocations, setItemLocations] = useState<Record<string, LocationEntry[]>>({});
  const [itemBatches, setItemBatches] = useState<Record<string, BatchEntry[]>>({});

  // Active Modals State
  const [activeLocationItemId, setActiveLocationItemId] = useState<string | null>(null);
  const [activeBatchItemId, setActiveBatchItemId] = useState<string | null>(null);
  const [tempLocationEntries, setTempLocationEntries] = useState<LocationEntry[]>([]);
  const [tempBatchEntries, setTempBatchEntries] = useState<BatchEntry[]>([]);

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [previewReportData, setPreviewReportData] = useState<StandardReportData | null>(null);

  const handleOpenPreviewReport = () => {
    const supplierName = currentPo?.supplierName || "Groz-Beckert KG / Dell Tech";
    const warehouseStore = selectedStore;
    const vehicleNumber = currentPo?.transportMethod || "Covered Van (DHK-METRO-11-2041)";
    const department = currentPo?.department || "Central Inventory & Stores";

    const report: StandardReportData = {
      reportType: "mrr",
      title: "MATERIAL RECEIVE REPORT (MRR)",
      documentNumber: receiveNumber,
      documentDate: receiveDate,
      hideLogo: true,
      metadata: [
        { label: "MRR Number", value: receiveNumber, highlight: true },
        { label: "Receive Date", value: receiveDate },
        { label: "PO / WO Number", value: `${currentPo?.orderNumber || selectedPoNumber} (${currentPo?.orderDate || "2026-09-15"})` },
        { label: "Supplier", value: supplierName, highlight: true },
        { label: "Warehouse / Store", value: warehouseStore },
        { label: "Challan Number", value: challanNo },
        { label: "Challan Date", value: challanDate },
        { label: "Received By", value: receivedBy },
      ],
      tableHeaders: [
        "SL",
        "Item Description & Spec",
        "Brand / Origin",
        "UOM",
        "Ordered Qty",
        "Receive Qty",
        "Accepted",
        "Rejected",
      ],
      tableRows: mrrItems.map((item, idx) => {
        return [
          idx + 1,
          <div>
            <div className="font-bold">{item.itemName}</div>
            <div className="text-[9.5px] text-slate-500 font-mono">{item.itemCode}</div>
          </div>,
          `${item.brand} / ${item.origin}`,
          item.uom,
          item.orderedQty,
          item.currentReceiveQty,
          item.acceptedQty ?? item.currentReceiveQty,
          item.rejectedQty ?? 0,
        ];
      }),
      summaryCards: [
        { label: "Total Received Qty", value: totalReceived },
        { label: "Quality Accepted Qty", value: totalAccepted },
        { label: "Quality Rejected Qty", value: totalRejected },
      ],
      signatures: [
        { role: "Store Officer", name: receivedBy, designation: "Received By" },
        { role: "QA Inspector", name: "Md. Rafiqul Islam", designation: "Inspected & Verified" },
        { role: "Warehouse In-Charge", name: "Nazmul Huda", designation: "Store In-Charge" },
      ],
      notes: remarks || "Goods physically verified and accepted according to purchase order specifications.",
    };

    setPreviewReportData(report);
    setPreviewReportOpen(true);
  };

  // Available Store Locations for the active store
  const storeLocations = useMemo(() => {
    return DEFAULT_STORE_LOCATIONS.filter((l) => l.trackingMode === "Location" || l.locationTrackingEnabled);
  }, []);

  // Available Batches
  const registeredBatches = useMemo(() => {
    return DEFAULT_STORE_LOCATIONS.filter((l) => l.batchNumbering || l.batchTrackingEnabled);
  }, []);

  // Check if item is location-tracked or batch-tracked
  const getItemTracking = (itemCode: string) => {
    const master = DEFAULT_ITEMS.find((it) => it.itemCode === itemCode);
    const isLocationTracked = master ? (master.warehouses?.length || master.defaultBin || master.batchTrackingRequired === false) : true;
    const isBatchTracked = master ? master.batchTrackingRequired : true;
    return {
      isLocationTracked: Boolean(isLocationTracked),
      isBatchTracked: Boolean(isBatchTracked),
    };
  };

  // Open Location Modal
  const handleOpenLocationModal = (item: MRRItem) => {
    const existing = itemLocations[item.id] || (item.location ? [{ locationName: item.location, quantity: item.currentReceiveQty }] : []);
    setTempLocationEntries(existing.length > 0 ? existing : [{ locationName: storeLocations[0]?.locationName || "Default Bin", quantity: item.currentReceiveQty }]);
    setActiveLocationItemId(item.id);
  };

  // Save Location Modal
  const handleSaveLocationModal = () => {
    if (!activeLocationItemId) return;
    const currentItem = mrrItems.find((i) => i.id === activeLocationItemId);
    if (!currentItem) return;

    const totalAssigned = tempLocationEntries.reduce((sum, e) => sum + (Number(e.quantity) || 0), 0);
    if (totalAssigned > currentItem.currentReceiveQty) {
      toast.error(
        `Total quantity assigned to locations (${totalAssigned} ${currentItem.uom}) exceeds Receive Qty (${currentItem.currentReceiveQty} ${currentItem.uom}).`
      );
      return;
    }

    setItemLocations((prev) => ({
      ...prev,
      [activeLocationItemId]: tempLocationEntries.filter((e) => e.locationName && e.quantity > 0),
    }));

    const locSummary = tempLocationEntries
      .filter((e) => e.quantity > 0)
      .map((e) => `${e.locationName} (${e.quantity})`)
      .join(", ");

    setMrrItems((prev) =>
      prev.map((i) => (i.id === activeLocationItemId ? { ...i, location: locSummary } : i))
    );

    toast.success("Locations assigned successfully!");
    setActiveLocationItemId(null);
  };

  // Open Batch Modal
  const handleOpenBatchModal = (item: MRRItem) => {
    const existing = itemBatches[item.id] || (item.batchNumber ? [{
      batchNumber: item.batchNumber,
      quantity: item.currentReceiveQty,
      createDate: item.createDate || new Date().toISOString().slice(0, 10),
      expiryDate: item.expiryDate || "",
    }] : []);

    setTempBatchEntries(
      existing.length > 0
        ? existing
        : [
            {
              batchNumber: `BAT-${item.itemCode.slice(-4)}-${new Date().getFullYear()}`,
              quantity: item.currentReceiveQty,
              createDate: new Date().toISOString().slice(0, 10),
              expiryDate: "2027-12-31",
            },
          ]
    );
    setActiveBatchItemId(item.id);
  };

  // Save Batch Modal
  const handleSaveBatchModal = () => {
    if (!activeBatchItemId) return;
    const currentItem = mrrItems.find((i) => i.id === activeBatchItemId);
    if (!currentItem) return;

    const totalBatchQty = tempBatchEntries.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);
    if (totalBatchQty > currentItem.currentReceiveQty) {
      toast.error(
        `Total quantity assigned across batches (${totalBatchQty} ${currentItem.uom}) exceeds Receive Qty (${currentItem.currentReceiveQty} ${currentItem.uom}).`
      );
      return;
    }

    setItemBatches((prev) => ({
      ...prev,
      [activeBatchItemId]: tempBatchEntries.filter((b) => b.batchNumber && b.quantity > 0),
    }));

    const batchSummary = tempBatchEntries
      .filter((b) => b.quantity > 0)
      .map((b) => `${b.batchNumber} (${b.quantity})`)
      .join(", ");

    setMrrItems((prev) =>
      prev.map((i) => (i.id === activeBatchItemId ? { ...i, batchNumber: batchSummary } : i))
    );

    toast.success("Batches assigned successfully!");
    setActiveBatchItemId(null);
  };

  // Update Item Receiving Qty
  const handleUpdateQty = (id: string, qty: number) => {
    setMrrItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const maxRemaining = item.orderedQty - item.previouslyReceivedQty;
          if (qty > maxRemaining) {
            toast.error(
              `Receive quantity (${qty}) cannot exceed remaining PO quantity (${maxRemaining}).`
            );
            qty = maxRemaining;
          }
          if (qty < 0) qty = 0;
          return {
            ...item,
            currentReceiveQty: qty,
            acceptedQty: qty,
            rejectedQty: 0,
            lineTotal: qty * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  // Update Accepted & Rejected quantities directly at item level
  const handleUpdateAcceptedRejected = (id: string, field: "accepted" | "rejected", value: number) => {
    setMrrItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const val = Math.max(0, value);
          const accepted = field === "accepted" ? val : (item.acceptedQty || 0);
          const rejected = field === "rejected" ? val : (item.rejectedQty || 0);

          if (accepted + rejected > item.currentReceiveQty) {
            toast.error(
              `Accepted (${accepted}) + Rejected (${rejected}) cannot exceed Receive Qty (${item.currentReceiveQty}).`
            );
            return item;
          }

          return {
            ...item,
            acceptedQty: accepted,
            rejectedQty: rejected,
          };
        }
        return item;
      })
    );
  };

  // Grand totals
  const totalReceived = useMemo(() => {
    return mrrItems.reduce((sum, i) => sum + i.currentReceiveQty, 0);
  }, [mrrItems]);

  const totalAccepted = useMemo(() => {
    return mrrItems.reduce((sum, i) => sum + (i.acceptedQty || 0), 0);
  }, [mrrItems]);

  const totalRejected = useMemo(() => {
    return mrrItems.reduce((sum, i) => sum + (i.rejectedQty || 0), 0);
  }, [mrrItems]);

  const totalAmount = useMemo(() => {
    return mrrItems.reduce((sum, i) => sum + i.lineTotal, 0);
  }, [mrrItems]);

  // Submit MRR
  const handleSubmitMRR = () => {
    if (!challanNo.trim()) {
      toast.error("Delivery Challan / Note Number is required");
      return;
    }
    if (mrrItems.length === 0 || totalReceived === 0) {
      toast.error("At least one received item with quantity > 0 is required");
      return;
    }

    // Validate QA acceptance totals
    for (const it of mrrItems) {
      if ((it.acceptedQty || 0) + (it.rejectedQty || 0) > it.currentReceiveQty) {
        toast.error(`Item "${it.itemName}": Accepted + Rejected exceeds Receive Qty.`);
        return;
      }
    }

    const newMRR: MaterialReceive = {
      id: `mrr-${Date.now()}`,
      receiveNumber,
      receiveDate,
      receiveType: "Purchase Order",
      receiveSource: "Against Purchase Order",
      poNumber: selectedPoNumber,
      poDate: currentPo?.orderDate || "2026-09-15",
      supplierId: currentPo?.supplierId || "sup-1",
      supplierName: currentPo?.supplierName || "Default Supplier",
      supplierCode: currentPo?.supplierCode || "SUP-VENDOR",
      department: currentPo?.department || "Central Operations",
      warehouseStore: selectedStore,
      receiveLocation: "Multiple / Store Defined",
      challanNo,
      challanDate,
      receivedBy,
      inspectionRequired: true,
      inspectionStatus: totalRejected > 0 ? "Partially Accepted" : "Passed",
      inspectionRemarks,
      items: mrrItems,
      totalReceivedQty: totalReceived,
      totalAcceptedQty: totalAccepted,
      totalRejectedQty: totalRejected,
      totalAmount,
      receiveStatus: totalReceived > 0 ? "Full Received" : "Partially Received",
      remarks,
    };

    const updatedMRRs = [newMRR, ...materialReceipts];
    setMaterialReceipts(updatedMRRs);
    setStoredMaterialReceipts(updatedMRRs);

    // Update Receive List status for this PO
    const receiveList = getStoredReceiveList();
    const updatedList = receiveList.map((rec) => {
      if (rec.poNumber === selectedPoNumber) {
        const newPrev = rec.previouslyReceivedQty + totalReceived;
        const newPending = Math.max(0, rec.totalOrderedQty - newPrev);
        return {
          ...rec,
          previouslyReceivedQty: newPrev,
          pendingQty: newPending,
          receiveStatus: newPending === 0 ? "Complete" : "Partial",
        };
      }
      return rec;
    });
    setStoredReceiveList(updatedList as any);

    toast.success(
      `Material Receive Report "${receiveNumber}" submitted! Inventory updated with ${totalAccepted} accepted units.`
    );
    navigate({ to: "/procurement-material-receive-list" });
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
                <span>Receiving Operations</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-bold">Material Receive (MRR)</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <Package className="size-7 text-primary" />
                Material Receive / MRR Transaction
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Record physical store goods receipt against approved Purchase Orders with batch tracking and inspection sign-off.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleOpenPreviewReport}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                <Printer className="size-3.5" /> Preview Report
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/procurement-material-receive-list" })}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-3.5" /> Back to Receive List
              </button>
              <span className="font-mono font-bold text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-xl border border-primary/20">
                {receiveNumber}
              </span>
            </div>
          </div>

          {/* Section 1: Receive Header Information */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Receive Header Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Receive Date*
                </label>
                <input
                  type="date"
                  value={receiveDate}
                  onChange={(e) => setReceiveDate(e.target.value)}
                  className="w-full px-3 py-2 font-semibold bg-background border border-border rounded-lg outline-none focus:border-primary"
                />
              </div>

              {/* Purchase Order / Work Order* (Displays only WO/PO Number) */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Lock className="size-3 text-muted-foreground" /> Purchase Order / Work Order*
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentPo?.orderNumber || selectedPoNumber}
                  className="w-full px-3 py-2 font-bold font-mono bg-muted/50 border border-border rounded-lg cursor-not-allowed text-primary"
                />
              </div>

              {/* PO/WO Date (Auto-populated, Read-only) */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Lock className="size-3 text-muted-foreground" /> PO / WO Date
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentPo?.orderDate || "2026-09-15"}
                  className="w-full px-3 py-2 font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground"
                />
              </div>

              {/* Supplier (Auto-populated, Read-only) */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Lock className="size-3 text-muted-foreground" /> Supplier / Vendor
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${currentPo?.supplierName || "Apex Textile Chemical"} (${currentPo?.supplierCode || "SUP-VENDOR"})`}
                  className="w-full px-3 py-2 font-bold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground truncate"
                />
              </div>

              {/* Warehouse / Store* (Auto-populated from selected store, Cannot be changed) */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Lock className="size-3 text-muted-foreground" /> Warehouse / Store*
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedStore}
                  className="w-full px-3 py-2 font-bold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground truncate"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Challan / Delivery Note No.*
                </label>
                <input
                  type="text"
                  value={challanNo}
                  onChange={(e) => setChallanNo(e.target.value)}
                  className="w-full px-3 py-2 font-mono font-bold bg-background border border-border rounded-lg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Challan Date*
                </label>
                <input
                  type="date"
                  value={challanDate}
                  onChange={(e) => setChallanDate(e.target.value)}
                  className="w-full px-3 py-2 font-semibold bg-background border border-border rounded-lg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Received By
                </label>
                <input
                  type="text"
                  readOnly
                  value={receivedBy}
                  className="w-full px-3 py-2 font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed truncate"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  General Remarks
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional delivery notes"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Material Receive Details Table with Dynamic Batch & Location and Item-level Quality */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Material Receive Details
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                Ordered Qty is shown in Base/SKU UOM
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                    <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                    <th className="py-2.5 px-3 font-bold min-w-[180px]">Item Description & Spec</th>
                    <th className="py-2.5 px-3 font-bold w-24">Brand / Origin</th>
                    <th className="py-2.5 px-3 w-16 font-bold text-center">SKU UOM</th>
                    <th className="py-2.5 px-3 text-right font-bold w-20">Ordered Qty</th>
                    <th className="py-2.5 px-3 text-right font-bold w-20">Prev Rec</th>
                    <th className="py-2.5 px-3 text-right font-bold w-24 text-primary">
                      Receive Qty*
                    </th>
                    <th className="py-2.5 px-3 text-right font-bold w-20">Remaining</th>
                    <th className="py-2.5 px-2 text-center font-bold w-24 text-emerald-600">Accepted</th>
                    <th className="py-2.5 px-2 text-center font-bold w-24 text-rose-600">Rejected</th>
                    <th className="py-2.5 px-2 text-center font-bold w-24">Tracking (B/L)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mrrItems.map((item, idx) => {
                    const tracking = getItemTracking(item.itemCode);
                    const itemLocCount = itemLocations[item.id]?.length || (item.location ? 1 : 0);
                    const itemBatchCount = itemBatches[item.id]?.length || (item.batchNumber ? 1 : 0);

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
                        {/* Base / SKU UOM */}
                        <td className="py-2.5 px-3 text-center font-bold text-muted-foreground">
                          {item.uom}
                        </td>
                        {/* Ordered Qty in Base/SKU UOM */}
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                          {item.orderedQty}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                          {item.previouslyReceivedQty}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <input
                            type="number"
                            min="0"
                            disabled={isViewMode}
                            max={item.orderedQty - item.previouslyReceivedQty}
                            value={item.currentReceiveQty}
                            onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
                            className="w-20 text-right font-mono font-bold px-2 py-1 bg-background border border-primary/40 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs disabled:opacity-75 disabled:cursor-not-allowed"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-600">
                          {Math.max(
                            0,
                            item.orderedQty - item.previouslyReceivedQty - item.currentReceiveQty
                          )}
                        </td>

                        {/* Item-level Quality Accepted */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            disabled={isViewMode}
                            max={item.currentReceiveQty}
                            value={item.acceptedQty}
                            onChange={(e) =>
                              handleUpdateAcceptedRejected(item.id, "accepted", Number(e.target.value))
                            }
                            className="w-16 text-center font-mono font-bold px-1.5 py-1 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 rounded outline-none focus:border-emerald-600 text-xs disabled:opacity-75 disabled:cursor-not-allowed"
                          />
                        </td>

                        {/* Item-level Quality Rejected */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            disabled={isViewMode}
                            max={item.currentReceiveQty}
                            value={item.rejectedQty}
                            onChange={(e) =>
                              handleUpdateAcceptedRejected(item.id, "rejected", Number(e.target.value))
                            }
                            className="w-16 text-center font-mono font-bold px-1.5 py-1 bg-rose-50/50 dark:bg-rose-950/30 border border-rose-500/40 text-rose-700 dark:text-rose-400 rounded outline-none focus:border-rose-600 text-xs disabled:opacity-75 disabled:cursor-not-allowed"
                          />
                        </td>

                        {/* Tracking (B/L) Cell: Shows ONLY B or ONLY L based on item configuration */}
                        <td className="py-2.5 px-2 text-center">
                          <ItemTrackingCell
                            mode={getItemTrackingMode(item.itemCode)}
                            batchCount={itemBatches[item.id]?.length || (item.batchNumber ? 1 : 0)}
                            locationCount={itemLocations[item.id]?.length || (item.location ? 1 : 0)}
                            onOpenBatch={() => handleOpenBatchModal(item)}
                            onOpenLocation={() => handleOpenLocationModal(item)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 text-xs bg-muted/20 p-3 rounded-xl border border-border">
              <div className="flex items-center gap-4 font-mono font-bold">
                <span className="text-emerald-600">Total Accepted: {totalAccepted}</span>
                <span className="text-rose-600">Total Rejected: {totalRejected}</span>
                <span className="text-foreground">Total Receive: {totalReceived}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Final Submission */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border/80 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground block">
                Total Received: <span className="text-primary font-mono">{totalReceived} Units</span> | Accepted Stock: <span className="text-emerald-600 font-mono font-bold">{totalAccepted} Units</span> | Total Value: <span className="text-foreground font-mono font-black">৳{totalAmount.toLocaleString()}</span>
              </span>
              <p className="text-[11px] text-muted-foreground">
                Upon submitting, stock in warehouse &ldquo;{selectedStore}&rdquo; will automatically increment.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isViewMode ? (
                <span className="px-4 py-2 rounded-xl text-xs font-bold bg-muted text-muted-foreground border border-border">
                  Viewing Material Receive (Read Only)
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitMRR}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all cursor-pointer"
                >
                  <CheckCircle2 className="size-4" /> Submit Material Receive
                </button>
              )}
            </div>
          </div>

          {/* Location Assignment Modal */}
          {activeLocationItemId && (() => {
            const item = mrrItems.find((i) => i.id === activeLocationItemId);
            if (!item) return null;
            return (
              <LocationAllocationModal
                isOpen={true}
                onClose={() => setActiveLocationItemId(null)}
                itemName={item.itemName}
                itemCode={item.itemCode}
                transactionQty={item.currentReceiveQty}
                uom={item.uom}
                currentStore={selectedStore}
                initialEntries={
                  itemLocations[item.id] ||
                  (item.location ? [{ locationName: item.location, quantity: item.currentReceiveQty }] : [])
                }
                onSave={(entries) => {
                  setItemLocations((prev) => ({ ...prev, [item.id]: entries }));
                  const locSummary = entries.map((e) => `${e.locationName} (${e.quantity})`).join(", ");
                  setMrrItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, location: locSummary } : i))
                  );
                  toast.success(`Assigned store locations for ${item.itemName}`);
                }}
              />
            );
          })()}

          {/* Batch Assignment Modal */}
          {activeBatchItemId && (() => {
            const item = mrrItems.find((i) => i.id === activeBatchItemId);
            if (!item) return null;
            return (
              <BatchAllocationModal
                isOpen={true}
                onClose={() => setActiveBatchItemId(null)}
                itemName={item.itemName}
                itemCode={item.itemCode}
                transactionQty={item.currentReceiveQty}
                uom={item.uom}
                currentStore={selectedStore}
                initialEntries={
                  itemBatches[item.id] ||
                  (item.batchNumber
                    ? [
                        {
                          batchNumber: item.batchNumber,
                          quantity: item.currentReceiveQty,
                          createDate: item.createDate,
                          expiryDate: item.expiryDate,
                        },
                      ]
                    : [])
                }
                onSave={(entries) => {
                  setItemBatches((prev) => ({ ...prev, [item.id]: entries }));
                  const batchSummary = entries.map((b) => `${b.batchNumber} (${b.quantity})`).join(", ");
                  setMrrItems((prev) =>
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
        </main>
      </div>
    </div>
  );
}
