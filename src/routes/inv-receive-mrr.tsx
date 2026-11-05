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
  Paperclip,
  Download,
  FileText,
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
  ItemWarrantyDetail,
  getStoredMaterialReceipts,
  setStoredMaterialReceipts,
  getStoredPurchaseOrders,
  getStoredPoItems,
  getStoredWoItems,
  getStoredReceiveList,
  setStoredReceiveList,
  syncReceiveListWithOrders,
} from "@/lib/procurement-order-inventory-data";
import { getActiveWarrantyTypes } from "@/lib/warranty-types-data";
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
  validateSearch: (search: Record<string, unknown>): { poNumber?: string; warehouse?: string; mode?: string; receiveNo?: string } => ({
    poNumber: search.poNumber as string | undefined,
    warehouse: search.warehouse as string | undefined,
    mode: search.mode as string | undefined,
    receiveNo: search.receiveNo as string | undefined,
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
      receiveNo?: string;
    }) || {};

  const isViewMode = searchParams.mode === "view";
  const isEditMode = searchParams.mode === "edit";

  const purchaseOrders = useMemo(() => getStoredPurchaseOrders(), []);
  const poItemsMap = useMemo(() => getStoredPoItems(), []);
  const woItemsMap = useMemo(() => getStoredWoItems(), []);
  const [materialReceipts, setMaterialReceipts] = useState<MaterialReceive[]>(() =>
    getStoredMaterialReceipts()
  );

  // If a specific receiveNo is requested, locate that receipt
  const targetReceipt = useMemo(() => {
    if (searchParams.receiveNo) {
      return (
        materialReceipts.find(
          (r) => r.receiveNumber === searchParams.receiveNo || r.id === searchParams.receiveNo
        ) || null
      );
    }
    if (isViewMode && searchParams.poNumber) {
      return (
        materialReceipts.find((r) => r.poNumber === searchParams.poNumber) || null
      );
    }
    return null;
  }, [materialReceipts, searchParams.receiveNo, searchParams.poNumber, isViewMode]);

  // Active PO/WO reference
  const selectedPoNumber =
    targetReceipt?.poNumber || searchParams.poNumber || "PO-2026-0001";
  const currentPo = useMemo(() => {
    return purchaseOrders.find((p) => p.orderNumber === selectedPoNumber) || purchaseOrders[0];
  }, [purchaseOrders, selectedPoNumber]);

  // Warehouse auto-populated from receipt / PO / selected store, cannot be changed
  const selectedStore =
    targetReceipt?.warehouseStore ||
    searchParams.warehouse ||
    currentPo?.deliveryWarehouse ||
    currentPo?.workLocation ||
    "Pakiza Technovation Central IT & Hardware Depot";

  const isWorkOrder =
    currentPo?.documentType === "Work Order" ||
    targetReceipt?.receiveType === "Work Order" ||
    selectedPoNumber.startsWith("WO-");

  const activeWorkLocation =
    currentPo?.workLocation ||
    targetReceipt?.receiveLocation ||
    "Pakiza Knit Composite Ltd";

  const activeArea =
    currentPo?.area ||
    "PAL-Fabric Dyeing";

  // 1. Receive Header Information
  const [receiveNumber, setReceiveNumber] = useState(
    () => targetReceipt?.receiveNumber || `MRR-2026-000${Math.floor(10 + Math.random() * 90)}`
  );
  const [receiveDate, setReceiveDate] = useState(
    () => targetReceipt?.receiveDate || new Date().toISOString().slice(0, 10)
  );
  const [challanNo, setChallanNo] = useState(
    () => targetReceipt?.challanNo || "CH-2026-9901"
  );
  const [challanDate, setChallanDate] = useState(
    () => targetReceipt?.challanDate || new Date().toISOString().slice(0, 10)
  );
  const [receivedBy, setReceivedBy] = useState(
    () => targetReceipt?.receivedBy || "Tahmid Afsar Shapno - Store Officer"
  );
  const [remarks, setRemarks] = useState(() => targetReceipt?.remarks || "");

  // Quality / Inspection Global Remarks
  const [inspectionRemarks, setInspectionRemarks] = useState(
    () =>
      targetReceipt?.inspectionRemarks ||
      "Visual inspection completed, serial numbers recorded, items in good condition."
  );

  // Material Receive Details Items State
  // Populated using Base/SKU UOM for POs or Work Order services, or saved receipt items
  const [mrrItems, setMrrItems] = useState<MRRItem[]>(() => {
    if (targetReceipt && targetReceipt.items && targetReceipt.items.length > 0) {
      return targetReceipt.items;
    }

    const existingPoReceipts = materialReceipts.filter(
      (r) => r.poNumber === selectedPoNumber && (!targetReceipt || r.id !== targetReceipt.id)
    );

    const getPrevReceivedForItem = (code: string) => {
      return existingPoReceipts.reduce((sum, r) => {
        const matched = r.items?.find((i) => i.itemCode === code);
        return sum + (Number(matched?.currentReceiveQty) || Number(matched?.acceptedQty) || 0);
      }, 0);
    };

    // If active order is a Work Order (Services)
    if (currentPo?.documentType === "Work Order") {
      const rawWo = woItemsMap[selectedPoNumber] || currentPo?.woItems || [];
      if (rawWo && rawWo.length > 0) {
        return rawWo.map((it: any, idx: number) => {
          const orderedQty = it.workOrderQuantity || it.estimatedQuantity || 1;
          const prevReceived = getPrevReceivedForItem(it.serviceCode);
          const remaining = Math.max(0, orderedQty - prevReceived);
          const currentReceive = remaining;
          const unitRate = it.unitRate || 0;

          return {
            id: `mrri-${it.id || idx + 1}`,
            sl: idx + 1,
            itemCode: it.serviceCode,
            itemName: it.serviceName,
            specification: it.specification || it.workDescription || "",
            brand: "Service / In-House",
            origin: "Work Order",
            uom: it.uom,
            orderedQty,
            previouslyReceivedQty: prevReceived,
            currentReceiveQty: currentReceive,
            remainingQty: Math.max(0, orderedQty - prevReceived - currentReceive),
            unitPrice: unitRate,
            lineTotal: currentReceive * unitRate,
            batchNumber: "",
            createDate: new Date().toISOString().slice(0, 10),
            expiryDate: "",
            location: currentPo?.workLocation || "On-Site Location",
            acceptedQty: currentReceive,
            rejectedQty: 0,
            remarks: it.remarks || "",
          };
        });
      }
    }

    // Purchase Order Items
    const rawItems = poItemsMap[selectedPoNumber] || currentPo?.items || [];
    if (rawItems && rawItems.length > 0) {
      return rawItems.map((it: any, idx: number) => {
        const factor = it.conversionFactor && it.conversionFactor > 0 ? it.conversionFactor : 1;
        const baseOrderedQty = Math.round((it.orderedQuantity || 1) * factor);
        const prevReceived = getPrevReceivedForItem(it.itemCode);
        const remaining = Math.max(0, baseOrderedQty - prevReceived);
        const currentReceive = remaining;
        const unitPrice = Math.round(it.unitPrice / factor) || it.unitPrice || 0;

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
          remainingQty: Math.max(0, baseOrderedQty - prevReceived - currentReceive),
          unitPrice,
          lineTotal: currentReceive * unitPrice,
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

  // Synchronize when targetReceipt is loaded or changed
  useEffect(() => {
    if (targetReceipt) {
      setReceiveNumber(targetReceipt.receiveNumber);
      setReceiveDate(targetReceipt.receiveDate);
      setChallanNo(targetReceipt.challanNo);
      setChallanDate(targetReceipt.challanDate);
      setReceivedBy(targetReceipt.receivedBy);
      setRemarks(targetReceipt.remarks || "");
      if (targetReceipt.inspectionRemarks) {
        setInspectionRemarks(targetReceipt.inspectionRemarks);
      }
      if (targetReceipt.items && targetReceipt.items.length > 0) {
        setMrrItems(targetReceipt.items);
      }
    }
  }, [targetReceipt]);

  // Active Modals State
  const [activeLocationItemId, setActiveLocationItemId] = useState<string | null>(null);
  const [activeBatchItemId, setActiveBatchItemId] = useState<string | null>(null);
  const [tempLocationEntries, setTempLocationEntries] = useState<LocationEntry[]>([]);
  const [tempBatchEntries, setTempBatchEntries] = useState<BatchEntry[]>([]);

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [previewReportData, setPreviewReportData] = useState<StandardReportData | null>(null);

  const handleOpenPreviewReport = () => {
    const isWO = currentPo?.documentType === "Work Order";
    const supplierName = currentPo?.supplierName || "Groz-Beckert KG / Dell Tech";
    const warehouseStore = selectedStore;
    const workLocation = currentPo?.workLocation || selectedStore;
    const workArea = currentPo?.area || "PAL-Fabric Dyeing";
    const vehicleNumber = currentPo?.transportMethod || "Covered Van (DHK-METRO-11-2041)";
    const department = currentPo?.department || "Central Inventory & Stores";

    const report: StandardReportData = {
      reportType: "mrr",
      title: isWO ? "WORK ORDER SERVICE RECEIVE REPORT (MRR)" : "MATERIAL RECEIVE REPORT (MRR)",
      documentNumber: receiveNumber,
      documentDate: receiveDate,
      hideLogo: true,
      metadata: [
        { label: "MRR Number", value: receiveNumber, highlight: true },
        { label: "Receive Date", value: receiveDate },
        {
          label: isWO ? "Work Order Number" : "PO / WO Number",
          value: `${currentPo?.orderNumber || selectedPoNumber} (${currentPo?.orderDate || "2026-09-15"})`,
        },
        { label: isWO ? "Contractor / Vendor" : "Supplier", value: supplierName, highlight: true },
        ...(isWO
          ? [
              { label: "Work Location", value: workLocation },
              { label: "Area", value: workArea },
            ]
          : [{ label: "Warehouse / Store", value: warehouseStore }]),
        { label: isWO ? "Challan / Work Certificate" : "Challan Number", value: challanNo },
        { label: "Challan Date", value: challanDate },
        { label: "Received By", value: receivedBy },
      ],
      tableHeaders: isWO
        ? [
            "SL",
            "Service Description & Scope",
            "UOM",
            "Ordered Qty",
            "Service Receive Qty",
            "Total Received",
            "Payable Value",
          ]
        : [
            "SL",
            "Item Description & Spec",
            "Brand / Origin",
            "UOM",
            "Ordered Qty",
            "Regular Qty",
            "FOC Qty",
            "Total Received",
            "Accepted",
            "Rejected",
            "Payable Value",
          ],
      tableRows: mrrItems.map((item, idx) => {
        const foc = Number(item.focQty) || 0;
        const reg = Number(item.currentReceiveQty) || 0;
        const totalLineReceived = reg + foc;
        const payableVal = (reg * (item.unitPrice || 0)).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        if (isWO) {
          return [
            idx + 1,
            <div>
              <div className="font-bold">{item.itemName}</div>
              <div className="text-[9.5px] text-slate-500 font-mono">
                {item.itemCode} • {item.specification}
              </div>
            </div>,
            item.uom,
            item.orderedQty,
            reg,
            totalLineReceived,
            `৳ ${payableVal}`,
          ];
        }

        return [
          idx + 1,
          <div>
            <div className="font-bold">{item.itemName}</div>
            <div className="text-[9.5px] text-slate-500 font-mono">{item.itemCode}</div>
          </div>,
          `${item.brand} / ${item.origin}`,
          item.uom,
          item.orderedQty,
          reg,
          foc > 0 ? (
            <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              +{foc} (FOC)
            </span>
          ) : (
            "—"
          ),
          totalLineReceived,
          item.acceptedQty ?? totalLineReceived,
          item.rejectedQty ?? 0,
          `৳ ${payableVal}`,
        ];
      }),
      summaryCards: isWO
        ? [
            {
              label: "Total Service Received Qty",
              value: mrrItems.reduce((acc, i) => acc + (Number(i.currentReceiveQty) || 0), 0),
            },
            {
              label: "Total Payable Value",
              value: `৳ ${mrrItems
                .reduce((acc, i) => acc + (Number(i.currentReceiveQty) || 0) * (Number(i.unitPrice) || 0), 0)
                .toLocaleString()}`,
            },
          ]
        : [
            { label: "Regular Received Qty", value: mrrItems.reduce((acc, i) => acc + (Number(i.currentReceiveQty) || 0), 0) },
            { label: "FOC (Free of Cost) Qty", value: mrrItems.reduce((acc, i) => acc + (Number(i.focQty) || 0), 0) },
            {
              label: "Total Physical Received Qty",
              value: mrrItems.reduce((acc, i) => acc + (Number(i.currentReceiveQty) || 0) + (Number(i.focQty) || 0), 0),
            },
            {
              label: "Payable Value (Excl. FOC)",
              value: `৳ ${mrrItems
                .reduce((acc, i) => acc + (Number(i.currentReceiveQty) || 0) * (Number(i.unitPrice) || 0), 0)
                .toLocaleString()}`,
            },
          ],
      signatures: [
        { role: isWO ? "Contract Supervisor" : "Store Officer", name: receivedBy, designation: "Received By" },
        { role: isWO ? "Site Engineer" : "QA Inspector", name: "Md. Rafiqul Islam", designation: "Inspected & Verified" },
        { role: isWO ? "Maintenance In-Charge" : "Warehouse In-Charge", name: "Nazmul Huda", designation: isWO ? "Service Sign-Off" : "Store In-Charge" },
      ],
      notes: remarks || (isWO ? "Service delivery physically inspected and verified according to work order scope." : "Goods physically verified and accepted according to purchase order specifications."),
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

  // ── Action: Delete Item from Form ──────────────────────────────
  const handleDeleteItem = (itemId: string) => {
    if (isViewMode) {
      toast.error("Items cannot be deleted in read-only mode.");
      return;
    }
    if (mrrItems.length <= 1) {
      toast.error("At least one item must remain in the receive list.");
      return;
    }
    setMrrItems((prev) => {
      const filtered = prev.filter((i) => i.id !== itemId);
      return filtered.map((it, idx) => ({ ...it, sl: idx + 1 }));
    });
    toast.success("Item removed from receive list.");
  };

  // ── Attachment State & Handlers (PI Entry Pattern) ─────────────
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [attachments, setAttachments] = useState<any[]>(() => {
    if (targetReceipt && (targetReceipt as any).attachments) {
      return (targetReceipt as any).attachments;
    }
    return [
      {
        id: "att-mrr-1",
        fileName: "Vendor_Challan_Signed.pdf",
        title: "Vendor Delivery Challan",
        note: "Physical challan signed by gate security and vehicle driver",
        fileSize: "1.4 MB",
        uploadedBy: "Tahmid Afsar Shapno - Store Officer",
        uploadTime: "2026-09-15 11:30",
      },
    ];
  });
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadNote, setUploadNote] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 3 MB.`);
      setSelectedUploadFile(null);
      e.target.value = "";
      return;
    }

    setSelectedUploadFile(file);
    if (!uploadTitle.trim()) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      setUploadTitle(nameWithoutExt);
    }
  };

  const handleUploadAttachment = () => {
    setUploadError(null);
    if (!selectedUploadFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    if (!uploadTitle.trim()) {
      setUploadError("Attachment Title is required.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newAtt = {
        id: `att-${Date.now()}`,
        fileName: selectedUploadFile.name,
        title: uploadTitle.trim(),
        note: uploadNote.trim(),
        fileSize:
          selectedUploadFile.size < 1024 * 1024
            ? `${(selectedUploadFile.size / 1024).toFixed(1)} KB`
            : `${(selectedUploadFile.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedBy: receivedBy,
        uploadTime: new Date().toISOString().replace("T", " ").substring(0, 16),
        dataUrl,
      };

      setAttachments((prev) => [newAtt, ...prev]);
      setSelectedUploadFile(null);
      setUploadTitle("");
      setUploadNote("");
      toast.success(`Attachment "${newAtt.title}" uploaded successfully.`);
    };
    reader.readAsDataURL(selectedUploadFile);
  };

  const handleDeleteAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    toast.info("Attachment removed.");
  };

  const handleDownloadAttachment = (att: any) => {
    try {
      const link = document.createElement("a");
      if (att.dataUrl && (att.dataUrl.startsWith("data:") || att.dataUrl.startsWith("blob:"))) {
        link.href = att.dataUrl;
      } else {
        const textContent = `CRIPTON Material Receive Document\nMRR: ${receiveNumber}\nFilename: ${att.fileName}\nTitle: ${att.title}\nUploaded By: ${att.uploadedBy}\nUpload Time: ${att.uploadTime}\nNote: ${att.note || "N/A"}`;
        const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
        link.href = URL.createObjectURL(blob);
      }
      link.download = att.fileName || `${att.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error("Failed to download attachment.");
    }
  };

  // ── Warranty Details State & Handlers ───────────────────────────
  const [activeWarrantyItemId, setActiveWarrantyItemId] = useState<string | null>(null);
  const [isAddingWarranty, setIsAddingWarranty] = useState(false);
  const [warrSearch, setWarrSearch] = useState("");
  const [warrTypeSelectOpen, setWarrTypeSelectOpen] = useState(false);
  const [newWarrantyType, setNewWarrantyType] = useState("");
  const [newWarrantyStartDate, setNewWarrantyStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [newWarrantyEndDate, setNewWarrantyEndDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [newWarrantyRemarks, setNewWarrantyRemarks] = useState("");

  const activeWarrantyItem = useMemo(
    () => mrrItems.find((i) => i.id === activeWarrantyItemId),
    [mrrItems, activeWarrantyItemId]
  );

  const activeWarrantyTypes = useMemo(() => getActiveWarrantyTypes(), [activeWarrantyItemId]);

  const handleOpenWarrantyModal = (itemId: string) => {
    setActiveWarrantyItemId(itemId);
    setIsAddingWarranty(false);
    setWarrSearch("");
    setWarrTypeSelectOpen(false);
    const activeTypes = getActiveWarrantyTypes();
    setNewWarrantyType(activeTypes[0]?.warrantyType || "Standard Manufacturer Warranty");
    setNewWarrantyStartDate(receiveDate || new Date().toISOString().slice(0, 10));
    const d = new Date(receiveDate || Date.now());
    d.setFullYear(d.getFullYear() + 1);
    setNewWarrantyEndDate(d.toISOString().slice(0, 10));
    setNewWarrantyRemarks("");
  };

  const handleSaveWarrantyEntry = () => {
    if (!activeWarrantyItemId) return;
    if (!newWarrantyType.trim()) {
      toast.error("Please select a Warranty Type.");
      return;
    }
    if (!newWarrantyStartDate || !newWarrantyEndDate) {
      toast.error("Please specify both Start Date and End Date.");
      return;
    }

    const newEntry: ItemWarrantyDetail = {
      id: `warr-${Date.now()}`,
      warrantyType: newWarrantyType.trim(),
      startDate: newWarrantyStartDate,
      endDate: newWarrantyEndDate,
      remarks: newWarrantyRemarks.trim(),
    };

    setMrrItems((prev) =>
      prev.map((i) => {
        if (i.id === activeWarrantyItemId) {
          const currentWarrs = i.warranties || [];
          return {
            ...i,
            warranties: [...currentWarrs, newEntry],
          };
        }
        return i;
      })
    );

    setIsAddingWarranty(false);
    setNewWarrantyRemarks("");
    toast.success(`Warranty "${newEntry.warrantyType}" added.`);
  };

  const handleDeleteWarrantyEntry = (warrantyId: string) => {
    if (!activeWarrantyItemId) return;
    setMrrItems((prev) =>
      prev.map((i) => {
        if (i.id === activeWarrantyItemId) {
          return {
            ...i,
            warranties: (i.warranties || []).filter((w) => w.id !== warrantyId),
          };
        }
        return i;
      })
    );
    toast.info("Warranty entry removed.");
  };

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

    // If editing an existing receipt record (Edit Mode), update the existing record
    if (targetReceipt) {
      const updatedMRR: MaterialReceive = {
        ...targetReceipt,
        receiveNumber,
        receiveDate,
        receiveType: currentPo?.documentType === "Work Order" ? "Work Order" : "Purchase Order",
        receiveSource: currentPo?.documentType === "Work Order" ? "Against Work Order" : "Against Purchase Order",
        poNumber: selectedPoNumber,
        poDate: currentPo?.orderDate || targetReceipt.poDate || "2026-09-15",
        supplierId: currentPo?.supplierId || targetReceipt.supplierId || "sup-1",
        supplierName: currentPo?.supplierName || targetReceipt.supplierName || "Default Supplier",
        supplierCode: currentPo?.supplierCode || targetReceipt.supplierCode || "SUP-VENDOR",
        department: currentPo?.department || targetReceipt.department || "Central Operations",
        warehouseStore: selectedStore,
        receiveLocation: currentPo?.workLocation || targetReceipt.receiveLocation || "Multiple / Store Defined",
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
        attachments,
        remarks,
      };

      const updatedMRRs = materialReceipts.map((r) =>
        r.id === targetReceipt.id || r.receiveNumber === targetReceipt.receiveNumber ? updatedMRR : r
      );
      setMaterialReceipts(updatedMRRs);
      setStoredMaterialReceipts(updatedMRRs);

      // Recalculate receive status and quantities for all orders across all receipts
      syncReceiveListWithOrders();

      toast.success(
        isWorkOrder
          ? `Work Order Service Receive "${receiveNumber}" updated successfully!`
          : `Material Receive "${receiveNumber}" updated successfully! Stock updated with ${totalAccepted} accepted units.`
      );
      navigate({ to: "/procurement-material-receive-list" });
      return;
    }

    const newMRR: MaterialReceive = {
      id: `mrr-${Date.now()}`,
      receiveNumber,
      receiveDate,
      receiveType: currentPo?.documentType === "Work Order" ? "Work Order" : "Purchase Order",
      receiveSource: currentPo?.documentType === "Work Order" ? "Against Work Order" : "Against Purchase Order",
      poNumber: selectedPoNumber,
      poDate: currentPo?.orderDate || "2026-09-15",
      supplierId: currentPo?.supplierId || "sup-1",
      supplierName: currentPo?.supplierName || "Default Supplier",
      supplierCode: currentPo?.supplierCode || "SUP-VENDOR",
      department: currentPo?.department || "Central Operations",
      warehouseStore: selectedStore,
      receiveLocation: currentPo?.workLocation || "Multiple / Store Defined",
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
      attachments,
      remarks,
    };

    const updatedMRRs = [newMRR, ...materialReceipts];
    setMaterialReceipts(updatedMRRs);
    setStoredMaterialReceipts(updatedMRRs);

    // Update Receive List status for all POs and WOs
    syncReceiveListWithOrders();

    toast.success(
      isWorkOrder
        ? `Work Order Service Receive Report "${receiveNumber}" submitted successfully!`
        : `Material Receive Report "${receiveNumber}" submitted! Inventory updated with ${totalAccepted} accepted units.`
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
              {isViewMode && (
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20 flex items-center gap-1.5">
                  <Eye className="size-3.5" /> Read-Only Mode
                </span>
              )}
              {isEditMode && (
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1.5">
                  <Save className="size-3.5" /> Edit Mode: {receiveNumber}
                </span>
              )}
              <button
                type="button"
                onClick={() => setAttachmentModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                <Paperclip className="size-3.5 text-teal-600" />
                <span>Attachment ({attachments.length})</span>
              </button>
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
                  disabled={isViewMode}
                  value={receiveDate}
                  onChange={(e) => setReceiveDate(e.target.value)}
                  className="w-full px-3 py-2 font-semibold bg-background border border-border rounded-lg outline-none focus:border-primary disabled:opacity-80 disabled:cursor-not-allowed"
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

              {/* Warehouse / Store* (For PO) or Work Location * & Area (For Work Order) */}
              {isWorkOrder ? (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                      <Lock className="size-3 text-muted-foreground" /> Work Location *
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={activeWorkLocation}
                      className="w-full px-3 py-2 font-bold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground truncate"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                      <Lock className="size-3 text-muted-foreground" /> Area
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={activeArea}
                      className="w-full px-3 py-2 font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground truncate"
                    />
                  </div>
                </>
              ) : (
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
              )}

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Challan / Delivery Note No.*
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  value={challanNo}
                  onChange={(e) => setChallanNo(e.target.value)}
                  className="w-full px-3 py-2 font-mono font-bold bg-background border border-border rounded-lg outline-none focus:border-primary disabled:opacity-80 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Challan Date*
                </label>
                <input
                  type="date"
                  disabled={isViewMode}
                  value={challanDate}
                  onChange={(e) => setChallanDate(e.target.value)}
                  className="w-full px-3 py-2 font-semibold bg-background border border-border rounded-lg outline-none focus:border-primary disabled:opacity-80 disabled:cursor-not-allowed"
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

              <div className={isWorkOrder ? "" : "lg:col-span-2"}>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  General Remarks
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional delivery notes"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary text-xs disabled:opacity-80 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Material Receive Details Table with Dynamic Batch & Location and Item-level Quality */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  {isWorkOrder ? "Work Order Service Details" : "Material Receive Details"}
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {isWorkOrder ? "Ordered Qty is shown in Service UOM" : "Ordered Qty is shown in Base/SKU UOM"}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                    <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                    <th className="py-2.5 px-3 font-bold min-w-[180px]">
                      {isWorkOrder ? "Service Description & Scope" : "Item Description & Spec"}
                    </th>
                    <th className="py-2.5 px-3 font-bold w-24">Brand / Origin</th>
                    <th className="py-2.5 px-3 w-16 font-bold text-center">
                      {isWorkOrder ? "UOM" : "SKU UOM"}
                    </th>
                    <th className="py-2.5 px-2 text-center font-bold w-20">Warranty</th>
                    <th className="py-2.5 px-3 text-right font-bold w-20">Ordered Qty</th>
                    <th className="py-2.5 px-3 text-right font-bold w-20">Prev Rec</th>
                    <th className="py-2.5 px-3 text-right font-bold w-24 text-primary">
                      {isWorkOrder ? "Service Receive Qty *" : "Receive Qty*"}
                    </th>
                    <th className="py-2.5 px-3 text-right font-bold w-20">Remaining</th>
                    {!isWorkOrder && (
                      <>
                        <th className="py-2.5 px-2 text-center font-bold w-24 text-emerald-600">Accepted</th>
                        <th className="py-2.5 px-2 text-center font-bold w-24 text-rose-600">Rejected</th>
                        <th className="py-2.5 px-2 text-center font-bold w-24">Tracking (B/L)</th>
                      </>
                    )}
                    <th className="py-2.5 px-2 text-center font-bold w-16">Action</th>
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
                        {/* Warranty Column (Available for both PO and Work Order) */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenWarrantyModal(item.id)}
                            className={`inline-flex items-center justify-center size-7 rounded-lg text-xs font-black transition-all cursor-pointer border ${
                              item.warranties && item.warranties.length > 0
                                ? "bg-amber-500 text-white border-amber-600 shadow-xs hover:bg-amber-600"
                                : "bg-muted/70 hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/40 text-muted-foreground border-border"
                            }`}
                            title={`Warranty Details (${item.warranties?.length || 0} registered)`}
                          >
                            W
                          </button>
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
                          {item.focQty ? (
                            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                              +{item.focQty} FOC
                            </div>
                          ) : null}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-600">
                          {Math.max(
                            0,
                            item.orderedQty - item.previouslyReceivedQty - item.currentReceiveQty
                          )}
                        </td>

                        {!isWorkOrder && (
                          <>
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
                                onOpenBatch={() => {
                                  if (isViewMode) {
                                    toast.info("Batch allocations are read-only in View Mode.");
                                    return;
                                  }
                                  handleOpenBatchModal(item);
                                }}
                                onOpenLocation={() => {
                                  if (isViewMode) {
                                    toast.info("Location allocations are read-only in View Mode.");
                                    return;
                                  }
                                  handleOpenLocationModal(item);
                                }}
                              />
                            </td>
                          </>
                        )}

                        {/* Action Column: Absolute last position */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            disabled={isViewMode}
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Delete Item"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 text-xs bg-muted/20 p-3 rounded-xl border border-border">
              <div className="flex items-center gap-4 font-mono font-bold">
                {isWorkOrder ? (
                  <span className="text-foreground">Total Service Receive: {totalReceived}</span>
                ) : (
                  <>
                    <span className="text-emerald-600">Total Accepted: {totalAccepted}</span>
                    <span className="text-rose-600">Total Rejected: {totalRejected}</span>
                    <span className="text-foreground">Total Receive: {totalReceived}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Final Submission */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border/80 shadow-2xs">
            <div className="space-y-0.5">
              {isWorkOrder ? (
                <span className="text-xs font-bold text-foreground block">
                  Total Service Received: <span className="text-primary font-mono">{totalReceived} Units</span> | Total Value: <span className="text-foreground font-mono font-black">৳{totalAmount.toLocaleString()}</span>
                </span>
              ) : (
                <>
                  <span className="text-xs font-bold text-foreground block">
                    Total Received: <span className="text-primary font-mono">{totalReceived} Units</span> | Accepted Stock: <span className="text-emerald-600 font-mono font-bold">{totalAccepted} Units</span> | Total Value: <span className="text-foreground font-mono font-black">৳{totalAmount.toLocaleString()}</span>
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Upon submitting, stock in warehouse &ldquo;{selectedStore}&rdquo; will automatically increment.
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAttachmentModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                <Paperclip className="size-3.5 text-teal-600" />
                <span>Attachment ({attachments.length})</span>
              </button>
              {isViewMode ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-muted text-muted-foreground border border-border">
                  <Lock className="size-3.5" /> Read-Only Mode (Viewing Saved Receipt)
                </div>
              ) : isEditMode ? (
                <button
                  type="button"
                  onClick={handleSubmitMRR}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all cursor-pointer"
                >
                  <Save className="size-4" /> {isWorkOrder ? "Update Service Receive" : "Update Material Receive"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitMRR}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all cursor-pointer"
                >
                  <CheckCircle2 className="size-4" /> {isWorkOrder ? "Submit Service Receive" : "Submit Material Receive"}
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
                showFocButton={true}
                onClose={() => setActiveLocationItemId(null)}
                itemName={item.itemName}
                itemCode={item.itemCode}
                transactionQty={item.currentReceiveQty}
                uom={item.uom}
                currentStore={selectedStore}
                focQty={item.focQty || 0}
                onSaveFoc={(focQty, focAllocations) => {
                  setMrrItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, focQty, focAllocations } : i))
                  );
                }}
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
                showFocButton={true}
                onClose={() => setActiveBatchItemId(null)}
                itemName={item.itemName}
                itemCode={item.itemCode}
                transactionQty={item.currentReceiveQty}
                uom={item.uom}
                currentStore={selectedStore}
                focQty={item.focQty || 0}
                onSaveFoc={(focQty, focAllocations) => {
                  setMrrItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, focQty, focAllocations } : i))
                  );
                }}
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

          {/* ── Attachment Modal (PI Entry Form Pattern) ───────────── */}
          {attachmentModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-card w-full max-w-4xl rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <Paperclip className="size-4 text-teal-600" />
                      <span>Document Storage — Material Receive Attachments</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      MRR: <span className="font-mono font-bold text-foreground">{receiveNumber}</span> &bull; Supplier: <span className="font-semibold text-foreground">{supplierName}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachmentModalOpen(false)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5 overflow-y-auto">
                  {/* File Upload Box */}
                  {!isViewMode && (
                    <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Upload className="size-3.5 text-teal-600" /> Upload Supporting Document
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Max file size: 3 MB (PDF, Images, Excel, Scanned Challan)
                        </span>
                      </div>

                      {uploadError && (
                        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
                          <AlertCircle className="size-4 shrink-0" />
                          <span>{uploadError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                            Select File *
                          </label>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                            Attachment Title *
                          </label>
                          <input
                            type="text"
                            value={uploadTitle}
                            onChange={(e) => setUploadTitle(e.target.value)}
                            placeholder="e.g. Vendor Challan Signed Copy"
                            className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                            Note / Remarks
                          </label>
                          <input
                            type="text"
                            value={uploadNote}
                            onChange={(e) => setUploadNote(e.target.value)}
                            placeholder="Optional remarks"
                            className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleUploadAttachment}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Upload className="size-3.5" /> Upload File
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Attachments Table */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
                      Attached Documents ({attachments.length})
                    </span>

                    <div className="rounded-xl border border-border overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                            <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                            {!isViewMode && (
                              <th className="py-2.5 px-2 w-12 text-center font-bold">Remove</th>
                            )}
                            <th className="py-2.5 px-3 font-bold">Document Title</th>
                            <th className="py-2.5 px-3 font-bold">Note</th>
                            <th className="py-2.5 px-3 font-bold">Uploaded By</th>
                            <th className="py-2.5 px-3 font-bold text-center w-28">Upload Time</th>
                            <th className="py-2.5 px-3 font-bold text-right w-20">Size</th>
                            <th className="py-2.5 px-3 font-bold text-center w-24">Download</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {attachments.length > 0 ? (
                            attachments.map((att, idx) => (
                              <tr key={att.id || idx} className="hover:bg-muted/30">
                                <td className="py-2 px-3 text-center text-muted-foreground font-bold">
                                  {idx + 1}
                                </td>
                                {!isViewMode && (
                                  <td className="py-2 px-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteAttachment(att.id)}
                                      className="p-1 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                                      title="Delete attachment"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  </td>
                                )}
                                <td className="py-2 px-3">
                                  <div className="font-bold text-foreground flex items-center gap-1.5">
                                    <FileText className="size-3.5 text-teal-600 shrink-0" />
                                    <span>{att.title}</span>
                                  </div>
                                  <div className="text-[10px] text-muted-foreground font-mono">
                                    {att.fileName}
                                  </div>
                                </td>
                                <td className="py-2 px-3 text-muted-foreground text-xs">
                                  {att.note || "—"}
                                </td>
                                <td className="py-2 px-3 text-muted-foreground">
                                  {att.uploadedBy}
                                </td>
                                <td className="py-2 px-3 text-center text-[11px] font-mono text-muted-foreground">
                                  {att.uploadTime}
                                </td>
                                <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                                  {att.fileSize}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadAttachment(att)}
                                    className="px-2.5 py-1 rounded-md text-[11px] font-bold border border-border bg-card hover:bg-muted transition-colors cursor-pointer inline-flex items-center gap-1 text-primary"
                                  >
                                    <Download className="size-3" /> Download
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={isViewMode ? 7 : 8} className="py-8 text-center text-muted-foreground text-xs">
                                No documents attached to this receipt yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setAttachmentModalOpen(false)}
                    className="px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Warranty Details Modal ─────────────────────────────── */}
          {activeWarrantyItemId && activeWarrantyItem && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-card w-full max-w-3xl rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-border bg-muted/40 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <ShieldCheck className="size-4 text-amber-500" />
                      <span>Warranty Details</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Item: <span className="font-bold text-foreground">{activeWarrantyItem.itemName}</span> &bull; Code: <span className="font-mono text-foreground">{activeWarrantyItem.itemCode}</span> &bull; UOM: {activeWarrantyItem.uom}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWarrantyItemId(null);
                      setIsAddingWarranty(false);
                    }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5 overflow-y-auto">
                  {/* Header bar with Add button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Configured Warranties ({(activeWarrantyItem.warranties || []).length})
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Multiple warranty policies and coverage periods can be registered for this service line item.
                      </p>
                    </div>

                    {!isViewMode && !isAddingWarranty && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingWarranty(true);
                          setWarrSearch("");
                          const activeTypes = getActiveWarrantyTypes();
                          if (activeTypes[0]) setNewWarrantyType(activeTypes[0].warrantyType);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-all cursor-pointer"
                      >
                        <Plus className="size-3.5" /> Add
                      </button>
                    )}
                  </div>

                  {/* Add Warranty Form with Searchable Warranty Type dropdown */}
                  {isAddingWarranty && (
                    <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/5 space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <span className="text-[11px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="size-3.5 text-amber-500" /> New Warranty Entry
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAddingWarranty(false)}
                          className="text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        {/* Searchable Warranty Type Dropdown */}
                        <div className="sm:col-span-2 relative">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                            Warranty Type *
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setWarrTypeSelectOpen((prev) => !prev)}
                              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-left flex items-center justify-between outline-none focus:border-amber-500 cursor-pointer"
                            >
                              <span className={newWarrantyType ? "font-bold text-foreground" : "text-muted-foreground"}>
                                {newWarrantyType || "Select Active Warranty Type..."}
                              </span>
                              <ChevronRight className={`size-3.5 transition-transform ${warrTypeSelectOpen ? "rotate-90" : ""}`} />
                            </button>

                            {warrTypeSelectOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-card border border-border rounded-xl shadow-xl p-2 space-y-2 animate-in fade-in">
                                <div className="relative">
                                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                                  <input
                                    type="text"
                                    placeholder="Search warranty type..."
                                    value={warrSearch}
                                    onChange={(e) => setWarrSearch(e.target.value)}
                                    className="w-full pl-8 pr-2.5 py-1 text-xs bg-muted/40 border border-border rounded-lg outline-none focus:border-amber-500"
                                  />
                                </div>
                                <div className="max-h-48 overflow-y-auto divide-y divide-border/50">
                                  {activeWarrantyTypes
                                    .filter((w) =>
                                      !warrSearch.trim() ||
                                      w.warrantyType.toLowerCase().includes(warrSearch.toLowerCase()) ||
                                      w.description.toLowerCase().includes(warrSearch.toLowerCase())
                                    )
                                    .map((w) => (
                                      <button
                                        key={w.id}
                                        type="button"
                                        onClick={() => {
                                          setNewWarrantyType(w.warrantyType);
                                          setWarrTypeSelectOpen(false);
                                        }}
                                        className={`w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors flex flex-col gap-0.5 cursor-pointer ${
                                          newWarrantyType === w.warrantyType ? "bg-amber-500/10 font-bold" : ""
                                        }`}
                                      >
                                        <span className="text-xs text-foreground font-semibold flex items-center gap-1.5">
                                          <ShieldCheck className="size-3 text-amber-500 shrink-0" />
                                          {w.warrantyType}
                                        </span>
                                        {w.description && (
                                          <span className="text-[10px] text-muted-foreground line-clamp-1">
                                            {w.description}
                                          </span>
                                        )}
                                      </button>
                                    ))}
                                  {activeWarrantyTypes.filter((w) =>
                                    !warrSearch.trim() ||
                                    w.warrantyType.toLowerCase().includes(warrSearch.toLowerCase())
                                  ).length === 0 && (
                                    <div className="p-3 text-center text-[11px] text-muted-foreground">
                                      No active warranty types match &quot;{warrSearch}&quot;.
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Warranty Start Date */}
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                            Warranty Start Date *
                          </label>
                          <input
                            type="date"
                            value={newWarrantyStartDate}
                            onChange={(e) => setNewWarrantyStartDate(e.target.value)}
                            className="w-full px-2.5 py-2 bg-background border border-border rounded-xl outline-none focus:border-amber-500 font-medium"
                          />
                        </div>

                        {/* Warranty End Date */}
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                            Warranty End Date *
                          </label>
                          <input
                            type="date"
                            value={newWarrantyEndDate}
                            onChange={(e) => setNewWarrantyEndDate(e.target.value)}
                            className="w-full px-2.5 py-2 bg-background border border-border rounded-xl outline-none focus:border-amber-500 font-medium"
                          />
                        </div>

                        {/* Remarks */}
                        <div className="sm:col-span-3">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                            Remarks
                          </label>
                          <input
                            type="text"
                            value={newWarrantyRemarks}
                            onChange={(e) => setNewWarrantyRemarks(e.target.value)}
                            placeholder="e.g. Free parts replacement and quarterly calibration support"
                            className="w-full px-3 py-2 bg-background border border-border rounded-xl outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={handleSaveWarrantyEntry}
                            className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="size-3.5" /> Save Warranty
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Warranties Table */}
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                          <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                          <th className="py-2.5 px-3 font-bold min-w-[200px]">Warranty Type</th>
                          <th className="py-2.5 px-3 font-bold text-center w-28">Start Date</th>
                          <th className="py-2.5 px-3 font-bold text-center w-28">End Date</th>
                          <th className="py-2.5 px-3 font-bold">Remarks</th>
                          {!isViewMode && (
                            <th className="py-2.5 px-2 w-12 text-center font-bold">Action</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {activeWarrantyItem.warranties && activeWarrantyItem.warranties.length > 0 ? (
                          activeWarrantyItem.warranties.map((w, idx) => (
                            <tr key={w.id || idx} className="hover:bg-muted/30">
                              <td className="py-2.5 px-3 text-center text-muted-foreground font-bold">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="font-bold text-foreground flex items-center gap-1.5">
                                  <ShieldCheck className="size-3.5 text-amber-500 shrink-0" />
                                  {w.warrantyType}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono text-[11px] text-foreground">
                                {w.startDate}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono text-[11px] text-foreground">
                                {w.endDate}
                              </td>
                              <td className="py-2.5 px-3 text-muted-foreground text-xs">
                                {w.remarks || "—"}
                              </td>
                              {!isViewMode && (
                                <td className="py-2.5 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteWarrantyEntry(w.id)}
                                    className="p-1 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                                    title="Remove warranty"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={isViewMode ? 5 : 6} className="py-8 text-center text-muted-foreground text-xs">
                              <div className="flex flex-col items-center justify-center gap-1.5">
                                <ShieldCheck className="size-6 text-muted-foreground/30" />
                                <span>No warranty details registered for this service item yet.</span>
                                {!isViewMode && !isAddingWarranty && (
                                  <button
                                    type="button"
                                    onClick={() => setIsAddingWarranty(true)}
                                    className="text-amber-500 hover:underline font-bold text-xs mt-1"
                                  >
                                    + Click Add to register a warranty
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWarrantyItemId(null);
                      setIsAddingWarranty(false);
                    }}
                    className="px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
