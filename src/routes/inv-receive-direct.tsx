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
  RotateCcw,
  Sparkles,
  MapPin,
  Layers,
  ArrowLeft,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import {
  DEFAULT_WAREHOUSES,
  DEFAULT_STORE_LOCATIONS,
  DEFAULT_SUPPLIERS,
  DEFAULT_ITEMS,
  SupplierVendorMaster,
  ItemProductMaster,
} from "@/lib/procurement-master-data";
import {
  MaterialReceive,
  MRRItem,
  ReceiveSource,
  getStoredMaterialReceipts,
  setStoredMaterialReceipts,
  getStoredDirectMRRs,
  setStoredDirectMRRs,
  DirectMRRRecord,
  ItemWarrantyDetail,
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

export const Route = createFileRoute("/inv-receive-direct")({
  validateSearch: (search: Record<string, unknown>): { mode?: string; id?: string } => ({
    mode: search.mode as string | undefined,
    id: search.id as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Direct MRR — Inventory Management | CRIPTON" },
      {
        name: "description",
        content:
          "Direct Material Receive Report (MRR) without Purchase Order reference with conditional store, batch, and location tracking.",
      },
    ],
  }),
  component: DirectMRRPage,
});

interface DirectMRRRow {
  id: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  receiveQuantity: number;
  unitPrice: number;
  estimatedValue: number;
  batchNumber?: string;
  expiryDate?: string;
  location?: string;
  acceptedQuantity: number;
  rejectedQuantity: number;
  remarks?: string;
  warranties?: ItemWarrantyDetail[];
}

export function DirectMRRPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const isViewMode = searchParams.mode === "view";
  const isEditMode = searchParams.mode === "edit";

  const [materialReceipts, setMaterialReceipts] = useState<MaterialReceive[]>(() =>
    getStoredMaterialReceipts()
  );

  // Stored Direct MRRs for loading by ID
  const directMRRs = useMemo(() => getStoredDirectMRRs(), []);
  const loadedDirectMRR = useMemo(() => {
    if (!searchParams.id) return null;
    return directMRRs.find((r) => r.id === searchParams.id || r.directMrrNumber === searchParams.id || r.mrrNumber === searchParams.id) || null;
  }, [directMRRs, searchParams.id]);

  // 1. Receive Header Information
  const [mrrNumber] = useState(
    () => loadedDirectMRR?.mrrNumber || loadedDirectMRR?.directMrrNumber || `DMRR-2026-000${Math.floor(10 + Math.random() * 90)}`
  );
  const [mrrDate, setMrrDate] = useState(() => loadedDirectMRR?.mrrDate || new Date().toISOString().slice(0, 10));
  const [receiveSource] = useState<ReceiveSource>("Direct MRR");
  const [department] = useState(() => loadedDirectMRR?.department || "Dyeing & Finishing");
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierVendorMaster>(() => {
    if (loadedDirectMRR?.supplier) {
      const match = DEFAULT_SUPPLIERS.find((s) => s.vendorName === loadedDirectMRR.supplier);
      if (match) return match;
    }
    return (
      DEFAULT_SUPPLIERS[0] || ({
        id: "sup-1",
        vendorName: "Apex Textile Chemical & Dyestuffs Ltd",
        vendorCode: "SUP-TX-001",
        contactPersonName: "Engr. Rafiqul Islam",
        mobileNumber: "+880 1711-234567",
        address: "Plot 42, Tejgaon I/A, Dhaka-1208",
      } as any)
    );
  });
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");

  const [challanNo, setChallanNo] = useState("CH-DIR-5050");
  const [challanDate, setChallanDate] = useState(new Date().toISOString().slice(0, 10));
  const [vehicleNumber, setVehicleNumber] = useState("Dhaka Metro-TA-14-8899");
  const [receivedBy] = useState(() => loadedDirectMRR?.createdBy || "Easin Mia - Central Store In-Charge");
  const [warehouseStoreCode, setWarehouseStoreCode] = useState(() => {
    if (loadedDirectMRR?.warehouse) {
      const whName = loadedDirectMRR.warehouse;
      const match = DEFAULT_WAREHOUSES.find((w) => w.storeName.includes(whName) || whName.includes(w.storeName));
      if (match) return match.storeCode;
    }
    return "WH-PKCL-01";
  });
  const [remarks, setRemarks] = useState(
    () => loadedDirectMRR?.remarks || "Emergency spot procurement authorized by Plant Manager."
  );

  // Modals & Search for Items
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [itemFilterQuery, setItemFilterQuery] = useState("");

  // Store Configuration
  const selectedStoreConfig = useMemo(() => {
    return (
      DEFAULT_WAREHOUSES.find((w) => w.storeCode === warehouseStoreCode) || DEFAULT_WAREHOUSES[0]
    );
  }, [warehouseStoreCode]);

  // Available Locations for this store
  const storeLocations = useMemo(() => {
    return DEFAULT_STORE_LOCATIONS.filter(
      (l) => l.trackingMode === "Location" || l.locationTrackingEnabled
    );
  }, []);

  const registeredBatches = useMemo(() => {
    return DEFAULT_STORE_LOCATIONS.filter((l) => l.batchNumbering || l.batchTrackingEnabled);
  }, []);

  // Direct MRR Line Items
  const [items, setItems] = useState<DirectMRRRow[]>(() => {
    if (loadedDirectMRR?.items && loadedDirectMRR.items.length > 0) {
      return loadedDirectMRR.items.map((it: any, idx: number) => ({
        id: it.id || `dm-${idx + 1}`,
        sl: it.sl || idx + 1,
        itemCode: it.itemCode,
        itemName: it.itemName,
        specification: it.specification || "",
        brand: it.brand || "Pakiza Standard",
        origin: it.origin || "Local",
        uom: it.uom || "PCS",
        receiveQuantity: it.receiveQuantity ?? 1,
        unitPrice: it.unitPrice ?? 0,
        estimatedValue: it.estimatedValue ?? ((it.receiveQuantity || 0) * (it.unitPrice || 0)),
        batchNumber: it.batchNumber || "",
        expiryDate: it.expiryDate || "",
        location: it.location || "",
        acceptedQuantity: it.acceptedQuantity ?? it.receiveQuantity ?? 1,
        rejectedQuantity: it.rejectedQuantity ?? 0,
        remarks: it.remarks || "",
        warranties: it.warranties || [],
      }));
    }
    return [
      {
        id: "dm-1",
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        receiveQuantity: 500,
        unitPrice: 420,
        estimatedValue: 210000,
        batchNumber: "BAT-YRN-2026-DIR",
        expiryDate: "",
        location: "Rack A1 - Raw Cotton Pallet",
        acceptedQuantity: 500,
        rejectedQuantity: 0,
        remarks: "Direct urgent delivery for production line #4",
      },
      {
        id: "dm-2",
        sl: 2,
        itemCode: "ITM-IT-LAT-5440",
        itemName: "Dell Latitude 5440 Core i7 Business Laptop",
        specification: "13th Gen Intel Core i7-1370P, 16GB DDR5, 512GB NVMe SSD, 14 FHD IPS",
        brand: "Dell Technologies",
        origin: "Malaysia",
        uom: "PCS",
        receiveQuantity: 2,
        unitPrice: 125000,
        estimatedValue: 250000,
        batchNumber: "",
        expiryDate: "",
        location: "Shelf B - Laptop Storage Units",
        acceptedQuantity: 2,
        rejectedQuantity: 0,
        remarks: "Replacement unit for Head Office",
        warranties: [
          {
            id: "warr-dm-1",
            warrantyType: "Standard Manufacturer Warranty",
            startDate: "2026-09-01",
            endDate: "2029-08-31",
            remarks: "3-Year ProSupport Plus on-site next business day warranty",
          },
        ],
      },
    ];
  });

  // Location and Batch modals state
  const [itemLocations, setItemLocations] = useState<Record<string, LocationEntry[]>>({});
  const [itemBatches, setItemBatches] = useState<Record<string, BatchEntry[]>>({});
  const [activeLocationItemId, setActiveLocationItemId] = useState<string | null>(null);
  const [activeBatchItemId, setActiveBatchItemId] = useState<string | null>(null);

  const handleOpenLocationModal = (item: DirectMRRRow) => {
    setActiveLocationItemId(item.id);
  };

  const handleOpenBatchModal = (item: DirectMRRRow) => {
    setActiveBatchItemId(item.id);
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
    () => items.find((i) => i.id === activeWarrantyItemId),
    [items, activeWarrantyItemId]
  );

  const activeWarrantyTypes = useMemo(() => getActiveWarrantyTypes(), [activeWarrantyItemId]);

  const handleOpenWarrantyModal = (itemId: string) => {
    setActiveWarrantyItemId(itemId);
    setIsAddingWarranty(false);
    setWarrSearch("");
    setWarrTypeSelectOpen(false);
    const activeTypes = getActiveWarrantyTypes();
    setNewWarrantyType(activeTypes[0]?.warrantyType || "Standard Manufacturer Warranty");
    setNewWarrantyStartDate(mrrDate || new Date().toISOString().slice(0, 10));
    const d = new Date(mrrDate || Date.now());
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

    setItems((prev) =>
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
    setItems((prev) =>
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

  // Filter Catalog Items for Search Modal (Large modal, No price column)
  const filteredCatalogItems = useMemo(() => {
    const q = itemFilterQuery.toLowerCase().trim();
    if (!q) return DEFAULT_ITEMS;
    return DEFAULT_ITEMS.filter(
      (item) =>
        item.itemName.toLowerCase().includes(q) ||
        item.itemCode.toLowerCase().includes(q) ||
        (item.specification && item.specification.toLowerCase().includes(q)) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.origin && item.origin.toLowerCase().includes(q)) ||
        item.stockUOM.toLowerCase().includes(q)
    );
  }, [itemFilterQuery]);

  // Add Item from Catalog
  const handleAddItemFromCatalog = (catalogItem: ItemProductMaster) => {
    const exists = items.some((i) => i.itemCode === catalogItem.itemCode);
    if (exists) {
      toast.info(`Item ${catalogItem.itemCode} is already added in this MRR.`);
      return;
    }

    const newItem: DirectMRRRow = {
      id: `dm-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      sl: items.length + 1,
      itemCode: catalogItem.itemCode,
      itemName: catalogItem.itemName,
      specification: catalogItem.specification || "Standard Quality Grade",
      brand: catalogItem.brand || "Local Standard",
      origin: catalogItem.origin || "Bangladesh",
      uom: catalogItem.stockUOM || "PCS",
      receiveQuantity: 10,
      unitPrice: catalogItem.standardPurchasePrice || 500,
      estimatedValue: 10 * (catalogItem.standardPurchasePrice || 500),
      batchNumber: "",
      location: "",
      acceptedQuantity: 10,
      rejectedQuantity: 0,
    };

    setItems((prev) => [...prev, newItem]);
    setItemSearchOpen(false);
    toast.success(`Added item: ${catalogItem.itemName}`);
  };

  // Update Item Fields
  const handleUpdateItem = (id: string, field: keyof DirectMRRRow, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "receiveQuantity" || field === "unitPrice") {
            const qty = field === "receiveQuantity" ? Number(value) : item.receiveQuantity;
            const price = field === "unitPrice" ? Number(value) : item.unitPrice;
            updated.estimatedValue = (qty || 0) * (price || 0);
            if (field === "receiveQuantity") {
              updated.acceptedQuantity = qty || 0;
              updated.rejectedQuantity = 0;
            }
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Update Accepted / Rejected at item level
  const handleUpdateAcceptedRejected = (id: string, field: "accepted" | "rejected", value: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const val = Math.max(0, value);
          const accepted = field === "accepted" ? val : item.acceptedQuantity;
          const rejected = field === "rejected" ? val : item.rejectedQuantity;

          if (accepted + rejected > item.receiveQuantity) {
            toast.error(
              `Accepted (${accepted}) + Rejected (${rejected}) cannot exceed Receive Qty (${item.receiveQuantity}).`
            );
            return item;
          }

          return {
            ...item,
            acceptedQuantity: accepted,
            rejectedQuantity: rejected,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id).map((it, idx) => ({ ...it, sl: idx + 1 })));
  };

  // Totals
  const totalReceivedQty = useMemo(() => {
    return items.reduce((sum, i) => sum + (Number(i.receiveQuantity) || 0), 0);
  }, [items]);

  const totalAcceptedQty = useMemo(() => {
    return items.reduce((sum, i) => sum + (Number(i.acceptedQuantity) || 0), 0);
  }, [items]);

  const totalRejectedQty = useMemo(() => {
    return items.reduce((sum, i) => sum + (Number(i.rejectedQuantity) || 0), 0);
  }, [items]);

  const totalEstimatedValue = useMemo(() => {
    return items.reduce((sum, i) => sum + (Number(i.estimatedValue) || 0), 0);
  }, [items]);

  const [previewReportOpen, setPreviewReportOpen] = useState(false);

  const previewReportData: StandardReportData = useMemo(() => {
    return {
      reportType: "direct-mrr",
      title: "Direct Material Receive Report (MRR)",
      documentNo: mrrNumber,
      documentNumber: mrrNumber,
      documentDate: mrrDate,
      department,
      status: "Approved",
      metadata: [
        { label: "MRR Number", value: mrrNumber, highlight: true },
        { label: "MRR Date", value: mrrDate },
        { label: "Receive Source", value: "Direct MRR (No PO Required)" },
        { label: "Department", value: department },
        {
          label: "Warehouse / Store",
          value: `${selectedStoreConfig.storeName} (${selectedStoreConfig.storeCode})`,
        },
        {
          label: "Supplier / Vendor",
          value: `${selectedSupplier.vendorName} (${selectedSupplier.vendorCode || "SUP"})`,
        },
        { label: "Challan / Invoice No", value: challanNo || "N/A" },
        { label: "Challan Date", value: challanDate || "N/A" },
        { label: "Vehicle / Truck No", value: vehicleNumber || "N/A" },
        { label: "Supplier Contact", value: selectedSupplier.mobileNumber || "N/A" },
      ],
      tableHeaders: [
        "SL",
        "Item Description & Spec",
        "Brand / Origin",
        "UOM",
        "Receive Qty",
        "Accepted Qty",
        "Rejected Qty",
        "Unit Price",
        "Line Total (৳)",
      ],
      tableRows: items.map((i, idx) => [
        idx + 1,
        <div>
          <div className="font-bold text-foreground">{i.itemName}</div>
          <div className="text-[9.5px] text-muted-foreground font-mono">{i.itemCode}</div>
        </div>,
        `${i.brand} / ${i.origin}`,
        i.uom,
        i.receiveQuantity,
        i.acceptedQuantity,
        i.rejectedQuantity,
        `৳ ${i.unitPrice.toLocaleString()}`,
        `৳ ${i.estimatedValue.toLocaleString()}`,
      ]),
      summaryCards: [
        { label: "Total Received Qty", value: `${totalReceivedQty} units` },
        { label: "Total Accepted Qty", value: `${totalAcceptedQty} units` },
        { label: "Total Rejected Qty", value: `${totalRejectedQty} units` },
        {
          label: "Grand Total Value",
          value: `৳ ${totalEstimatedValue.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
          isBold: true,
          isHighlight: true,
        },
      ],
      remarks: remarks || "Received directly into warehouse inventory without PO reference. QA inspected.",
      signatures: [
        { role: "Receiving Officer", name: "S. M. Rahman", title: "Assistant Store Incharge", date: mrrDate },
        { role: "Quality Inspector", name: "K. H. Mahmud", title: "Sr. Quality Assurance Executive", date: mrrDate },
        { role: "Warehouse In-Charge", name: "Md. Rafiqul Islam", title: "Manager, Central Store", date: mrrDate },
        { role: "Authorized Signatory", name: "Engr. Tanvir Ahmed", title: "Head of Supply Chain & Logistics", date: mrrDate },
      ],
    };
  }, [
    mrrNumber,
    mrrDate,
    department,
    selectedStoreConfig,
    selectedSupplier,
    challanNo,
    challanDate,
    vehicleNumber,
    items,
    totalReceivedQty,
    totalAcceptedQty,
    totalRejectedQty,
    totalEstimatedValue,
    remarks,
  ]);

  // Submit Direct MRR
  const handleSubmitDirectMRR = () => {
    if (!challanNo.trim()) {
      toast.error("Challan / Delivery Note Number is required");
      return;
    }
    if (items.length === 0 || totalReceivedQty === 0) {
      toast.error("Please add at least one material line item with receive quantity > 0");
      return;
    }

    for (const it of items) {
      if (it.acceptedQuantity + it.rejectedQuantity > it.receiveQuantity) {
        toast.error(`Item "${it.itemName}": Accepted + Rejected exceeds Receive Qty.`);
        return;
      }
    }

    const newRecord: MaterialReceive = {
      id: `dmrr-${Date.now()}`,
      receiveNumber: mrrNumber,
      receiveDate: mrrDate,
      receiveType: "Purchase Order",
      receiveSource: "Direct MRR",
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.vendorName,
      supplierCode: selectedSupplier.vendorCode,
      department,
      warehouseStore: selectedStoreConfig.storeName,
      challanNo,
      challanDate,
      vehicleNumber,
      receivedBy,
      inspectionRequired: true,
      inspectionStatus: totalRejectedQty > 0 ? "Partially Accepted" : "Passed",
      inspectionRemarks: "Inspected at line level during Direct MRR.",
      totalReceivedQty,
      totalAcceptedQty,
      totalRejectedQty,
      totalAmount: totalEstimatedValue,
      receiveStatus: "Full Received",
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
        orderedQty: i.receiveQuantity,
        previouslyReceivedQty: 0,
        currentReceiveQty: i.receiveQuantity,
        remainingQty: 0,
        unitPrice: i.unitPrice,
        lineTotal: i.estimatedValue,
        batchNumber: i.batchNumber,
        location: i.location,
        acceptedQty: i.acceptedQuantity,
        rejectedQty: i.rejectedQuantity,
        remarks: i.remarks,
        warranties: i.warranties,
      })),
    };

    // Update Direct MRR Record in stored list
    const directRecord: DirectMRRRecord = {
      id: loadedDirectMRR?.id || `dmrr-${Date.now()}`,
      mrrNumber,
      directMrrNumber: mrrNumber,
      mrrDate,
      supplierId: selectedSupplier.id,
      supplier: selectedSupplier.vendorName,
      supplierName: selectedSupplier.vendorName,
      supplierCode: selectedSupplier.vendorCode,
      warehouseStore: selectedStoreConfig.storeName,
      warehouse: selectedStoreConfig.storeName,
      storeName: selectedStoreConfig.storeName,
      department,
      challanNo,
      challanDate,
      vehicleNumber,
      remarks,
      totalItems: items.length,
      totalQuantity: totalReceivedQty,
      totalAmount: totalEstimatedValue,
      status: "Approved",
      createdBy: receivedBy,
      createdDate: loadedDirectMRR?.createdDate || mrrDate,
      items: items.map((i) => ({
        id: i.id,
        sl: i.sl,
        itemCode: i.itemCode,
        itemName: i.itemName,
        specification: i.specification,
        brand: i.brand,
        origin: i.origin,
        uom: i.uom,
        receiveQuantity: i.receiveQuantity,
        unitPrice: i.unitPrice,
        estimatedValue: i.estimatedValue,
        batchNumber: i.batchNumber,
        location: i.location,
        acceptedQuantity: i.acceptedQuantity,
        rejectedQuantity: i.rejectedQuantity,
        remarks: i.remarks,
        warranties: i.warranties,
      })),
      attachments: loadedDirectMRR?.attachments || [],
    };

    let updatedDirectList: DirectMRRRecord[];
    if (isEditMode && loadedDirectMRR) {
      updatedDirectList = directMRRs.map((r) =>
        r.id === loadedDirectMRR.id || r.mrrNumber === loadedDirectMRR.mrrNumber || r.directMrrNumber === loadedDirectMRR.directMrrNumber
          ? directRecord
          : r
      );
    } else {
      updatedDirectList = [directRecord, ...directMRRs];
    }
    setStoredDirectMRRs(updatedDirectList);

    const updated = [newRecord, ...materialReceipts.filter(m => m.receiveNumber !== mrrNumber)];
    setMaterialReceipts(updated);
    setStoredMaterialReceipts(updated);

    toast.success(
      isEditMode
        ? `Direct MRR "${mrrNumber}" updated successfully!`
        : `Direct MRR "${mrrNumber}" created! Inventory in ${selectedStoreConfig.storeName} increased by ${totalAcceptedQty} accepted units.`
    );
    navigate({ to: "/inv-direct-mrr-list" });
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
                <span>Stock Receipts</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-bold">Direct MRR</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <Truck className="size-7 text-primary" />
                Direct MRR (Material Receive Report)
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Receive spot or emergency stock directly into warehouse inventory without a Purchase Order reference.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: "/inv-direct-mrr-list" })}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-3.5" /> Direct MRR List
              </button>
              <button
                type="button"
                onClick={() => setPreviewReportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-primary/30 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
              >
                <Printer className="size-3.5" /> Preview Report
              </button>
              {isViewMode && (
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  View Mode
                </span>
              )}
              <span className="font-mono font-bold text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-xl border border-primary/20">
                {mrrNumber}
              </span>
            </div>
          </div>

          {/* Section 1: Direct MRR Header Information */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Direct MRR Header Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  MRR Number*
                </label>
                <input
                  type="text"
                  readOnly
                  value={mrrNumber}
                  className="w-full px-3 py-2 font-mono font-bold bg-muted/50 border border-border rounded-lg cursor-not-allowed select-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  MRR Date*
                </label>
                <input
                  type="date"
                  value={mrrDate}
                  onChange={(e) => setMrrDate(e.target.value)}
                  className="w-full px-3 py-2 font-semibold bg-background border border-border rounded-lg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Receive Source*
                </label>
                <input
                  type="text"
                  readOnly
                  value="Direct MRR (No PO Required)"
                  className="w-full px-3 py-2 font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground"
                />
              </div>

              {/* Department* (non-editable) */}
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

              {/* Searchable Supplier / Vendor Modal Button & Display */}
              <div className="lg:col-span-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Supplier / Vendor*
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-muted/30 border border-border rounded-lg text-xs font-semibold text-foreground truncate">
                    <span className="font-bold">{selectedSupplier.vendorName}</span>{" "}
                    <span className="text-muted-foreground font-mono">({selectedSupplier.vendorCode})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSupplierModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-bold text-xs border border-primary/20 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Search className="size-3.5" /> Select Supplier
                  </button>
                </div>
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
                  Vehicle Number
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary font-mono"
                />
              </div>

              {/* Warehouse / Store* (Renamed from Mandatory Destination) */}
              <div className="lg:col-span-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Warehouse / Store*
                </label>
                <select
                  value={warehouseStoreCode}
                  onChange={(e) => setWarehouseStoreCode(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-bold outline-none focus:border-primary cursor-pointer"
                >
                  {DEFAULT_WAREHOUSES.map((wh) => (
                    <option key={wh.id} value={wh.storeCode}>
                      {wh.storeName} ({wh.storeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Received By
                </label>
                <input
                  type="text"
                  readOnly
                  value={receivedBy}
                  className="w-full px-3 py-2 font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Direct MRR Material Details Table with Search & Add Item, Batch/Location & Quality */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Material Details Table
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setItemFilterQuery("");
                  setItemSearchOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="size-3.5" /> Search & Add Item
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                    <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                    <th className="py-2.5 px-3 min-w-[200px] font-bold">Item Description & Spec*</th>
                    <th className="py-2.5 px-3 font-bold w-24">Brand / Origin</th>
                    <th className="py-2.5 px-3 w-16 font-bold text-center">UOM</th>
                    <th className="py-2.5 px-2 text-center font-bold w-20">Warranty</th>
                    <th className="py-2.5 px-3 text-right font-bold w-24 text-primary">
                      Receive Qty*
                    </th>
                    <th className="py-2.5 px-2 text-center font-bold w-24 text-emerald-600">Quality Accepted</th>
                    <th className="py-2.5 px-2 text-center font-bold w-24 text-rose-600">Quality Rejected</th>
                    <th className="py-2.5 px-2 text-center font-bold w-28">Tracking (B/L)</th>
                    <th className="py-2.5 px-3 text-right font-bold w-28">Unit Price (৳)</th>
                    <th className="py-2.5 px-3 text-right font-bold w-28">Est. Value (৳)</th>
                    <th className="py-2.5 px-3 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item, idx) => {
                    const trackingMode = getItemTrackingMode(item.itemCode);
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
                        <td className="py-2.5 px-3 text-center font-semibold text-muted-foreground">
                          {item.uom}
                        </td>
                        {/* Warranty Column */}
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
                        <td className="py-2.5 px-3 text-right">
                          <input
                            type="number"
                            min="1"
                            value={item.receiveQuantity}
                            onChange={(e) =>
                              handleUpdateItem(item.id, "receiveQuantity", Number(e.target.value))
                            }
                            className="w-20 text-right font-mono font-bold px-2 py-1 bg-background border border-primary/40 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs"
                          />
                        </td>

                        {/* Item-level Quality Accepted */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max={item.receiveQuantity}
                            value={item.acceptedQuantity}
                            onChange={(e) =>
                              handleUpdateAcceptedRejected(item.id, "accepted", Number(e.target.value))
                            }
                            className="w-16 text-center font-mono font-bold px-1.5 py-1 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 rounded outline-none focus:border-emerald-600 text-xs"
                          />
                        </td>

                        {/* Item-level Quality Rejected */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max={item.receiveQuantity}
                            value={item.rejectedQuantity}
                            onChange={(e) =>
                              handleUpdateAcceptedRejected(item.id, "rejected", Number(e.target.value))
                            }
                            className="w-16 text-center font-mono font-bold px-1.5 py-1 bg-rose-50/50 dark:bg-rose-950/30 border border-rose-500/40 text-rose-700 dark:text-rose-400 rounded outline-none focus:border-rose-600 text-xs"
                          />
                        </td>

                        {/* Tracking (B or L only) Cell */}
                        <td className="py-2.5 px-2 text-center">
                          <ItemTrackingCell
                            mode={trackingMode}
                            locationCount={itemLocCount}
                            batchCount={itemBatchCount}
                            onOpenLocation={() => handleOpenLocationModal(item)}
                            onOpenBatch={() => handleOpenBatchModal(item)}
                          />
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <input
                            type="number"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleUpdateItem(item.id, "unitPrice", Number(e.target.value))
                            }
                            className="w-20 text-right font-mono px-2 py-1 bg-background border border-border rounded outline-none text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                          ৳ {item.estimatedValue.toLocaleString()}
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={13} className="py-8 text-center text-muted-foreground">
                        No items added yet. Click &quot;Search & Add Item&quot; to begin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Strip */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3.5 rounded-xl bg-muted/20 border border-border text-xs">
              <span className="text-muted-foreground font-medium">
                Items: <strong className="text-foreground">{items.length}</strong> | Receive Units: <strong className="text-primary font-mono">{totalReceivedQty}</strong> | Accepted: <strong className="text-emerald-600 font-mono">{totalAcceptedQty}</strong> | Rejected: <strong className="text-rose-600 font-mono">{totalRejectedQty}</strong>
              </span>
              <span className="font-bold">
                Estimated Value:{" "}
                <span className="font-mono text-sm text-primary font-black">
                  ৳ {totalEstimatedValue.toLocaleString()}
                </span>
              </span>
            </div>
          </div>

          {/* Section 3: Final Stock Update & Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border/80 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground block">
                Total Direct Received: <span className="text-primary font-mono">{totalReceivedQty} Units</span> | Accepted into Stock: <span className="text-emerald-600 font-mono font-bold">{totalAcceptedQty} Units</span>
              </span>
              <p className="text-[11px] text-muted-foreground">
                Only accepted quantity will be incremented in inventory under {selectedStoreConfig.storeName}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isViewMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/inv-direct-mrr-list" })}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
                  >
                    Back to Direct MRR List
                  </button>
                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-muted text-muted-foreground border border-border">
                    Viewing Direct MRR (Read Only)
                  </span>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/inv-direct-mrr-list" })}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitDirectMRR}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="size-4" /> {isEditMode ? "Update Direct MRR" : "Save Direct MRR"}
                  </button>
                </>
              )}
            </div>
          </div>
          </div>
        </main>
      </div>

      {/* Searchable Supplier / Vendor Modal */}
      {supplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Select Supplier / Vendor</h3>
                <p className="text-xs text-muted-foreground">
                  Search and choose an approved supplier for this direct goods receipt.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSupplierModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by vendor name, code, contact person, mobile, or address..."
                value={supplierSearchQuery}
                onChange={(e) => setSupplierSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-muted/30 border border-border rounded-xl outline-none focus:border-primary"
              />
            </div>

            <div className="max-h-72 overflow-y-auto rounded-xl border border-border divide-y divide-border">
              {DEFAULT_SUPPLIERS.filter((s) => {
                const q = supplierSearchQuery.toLowerCase().trim();
                if (!q) return true;
                return (
                  s.vendorName.toLowerCase().includes(q) ||
                  s.vendorCode.toLowerCase().includes(q) ||
                  (s.contactPersonName && s.contactPersonName.toLowerCase().includes(q)) ||
                  (s.mobileNumber && s.mobileNumber.toLowerCase().includes(q)) ||
                  (s.address && s.address.toLowerCase().includes(q))
                );
              }).map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedSupplier(s);
                    setSupplierModalOpen(false);
                    toast.success(`Selected supplier: ${s.vendorName}`);
                  }}
                  className={`p-3 hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs ${
                    selectedSupplier.id === s.id ? "bg-primary/15" : ""
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-foreground">{s.vendorName}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Code: <span className="font-mono font-semibold">{s.vendorCode}</span> • Contact: {s.contactPersonName || "N/A"} • Mobile: {s.mobileNumber || "N/A"}
                    </div>
                    {s.address && <div className="text-[10px] text-muted-foreground truncate">{s.address}</div>}
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-primary text-primary-foreground pointer-events-none"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Larger Item Catalog Search Modal (NO PRICE COLUMN, Item Code, Item Name, Specification, Brand, Origin, UoM) */}
      {itemSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-4xl rounded-2xl border border-border shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Search & Add Item</h3>
                <p className="text-xs text-muted-foreground">
                  Select an item from the master catalog to add to Direct MRR.
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
                value={itemFilterQuery}
                onChange={(e) => setItemFilterQuery(e.target.value)}
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
            transactionQty={item.receiveQuantity}
            uom={item.uom}
            currentStore={selectedStoreConfig.storeName}
            initialEntries={
              itemLocations[item.id] ||
              (item.location ? [{ locationName: item.location, quantity: item.receiveQuantity }] : [])
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
            transactionQty={item.receiveQuantity}
            uom={item.uom}
            currentStore={selectedStoreConfig.storeName}
            initialEntries={
              itemBatches[item.id] ||
              (item.batchNumber
                ? [
                    {
                      batchNumber: item.batchNumber,
                      quantity: item.receiveQuantity,
                      createDate: new Date().toISOString().slice(0, 10),
                      expiryDate: "2027-12-31",
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
                    Multiple warranty policies and coverage periods can be registered for this item.
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
                            <span>No warranty details registered for this item yet.</span>
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
    </div>
  );
}
