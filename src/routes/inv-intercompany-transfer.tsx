import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  ArrowLeftRight,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Printer,
  AlertTriangle,
  Building2,
  Package,
  Layers,
  Search,
  Save,
  Send,
  Eye,
  X,
  FileCheck2,
  Tag,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import {
  InterCompanyTransfer,
  InterCompanyTransferItem,
  TransferReasonType,
  TransferType,
  TransferRequisition,
  MASTER_COMPANIES,
  getStoredInterCompanyTransfers,
  saveInterCompanyTransfer,
  getStoredTransferRequisitions,
  getLoggedInUserCompany,
} from "@/lib/inventory-stock-management-data";
import {
  DEFAULT_WAREHOUSES,
  DEFAULT_ITEMS,
  ItemProductMaster,
  getStoredData,
} from "@/lib/procurement-master-data";
import { getItemTrackingMode } from "@/lib/item-tracking-utils";
import { ItemTrackingCell } from "@/components/inventory/ItemBatchLocationModals";
import {
  TransferLocationAllocationModal,
  TransferBatchAllocationModal,
  TransferLocationEntry,
  TransferBatchEntry,
} from "@/components/inventory/TransferBatchLocationModals";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-intercompany-transfer")({
  validateSearch: (
    search: Record<string, unknown>
  ): { transferId?: string; mode?: "view" | "edit"; type?: string } => ({
    transferId: search.transferId as string | undefined,
    mode: search.mode as "view" | "edit" | undefined,
    type: search.type as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Multi-Company & Intra-Company Stock Transfer Entry — Inventory ERP" },
      {
        name: "description",
        content: "Transfer materials between group entities or internal stores with real-time stock and batch validation.",
      },
    ],
  }),
  component: InterCompanyTransferFormPage,
});

function InterCompanyTransferFormPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const isViewMode = searchParams.mode === "view";
  const editingTransferId = searchParams.transferId;

  const rawWarehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);
  const warehouses = useMemo(() => {
    const list = [...rawWarehouses];
    DEFAULT_WAREHOUSES.forEach((dw) => {
      const dwName = dw.storeName || dw.name || "";
      if (!list.some((w) => (w.storeName || w.name) === dwName || w.id === dw.id)) {
        list.push(dw);
      }
    });
    return list;
  }, [rawWarehouses]);
  const catalogItems = getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS);

  // Load existing transfer if in edit/view mode or restore active draft
  const draftKey = editingTransferId ? `cripton_transfer_draft_${editingTransferId}` : "cripton_transfer_active_draft";
  const existingTransfer = useMemo(() => {
    if (editingTransferId) {
      const all = getStoredInterCompanyTransfers();
      const found = all.find((t) => t.id === editingTransferId || t.transferId === editingTransferId);
      if (found) return found;
    }
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(draftKey);
        if (raw) return JSON.parse(raw);
      } catch {
        // ignore
      }
    }
    return null;
  }, [editingTransferId, draftKey]);

  // Header State
  const [transferId] = useState<string>(() => {
    if (existingTransfer?.transferId) return existingTransfer.transferId;
    return `ICT-2026-${String(Math.floor(100 + Math.random() * 900))}`;
  });

  const [transferDate, setTransferDate] = useState<string>(() => {
    return existingTransfer?.transferDate || new Date().toISOString().slice(0, 10);
  });

  const [transferReason, setTransferReason] = useState<TransferReasonType>(() => {
    return existingTransfer?.transferReason || "Stock Replenishment";
  });

  const [reasonDetails, setReasonDetails] = useState<string>(() => {
    return existingTransfer?.reasonDetails || "";
  });

  const [remarks, setRemarks] = useState<string>(() => {
    return existingTransfer?.remarks || "";
  });

  // Logged-in user's company (Section 2: Fixed and auto-populated)
  const loggedInCompany = useMemo(() => getLoggedInUserCompany(), []);

  // Transfer Type (Multi-Company vs Intra-Company)
  const [transferType, setTransferType] = useState<TransferType>(() => {
    if (searchParams.type === "intra") return "Intra-Company";
    return existingTransfer?.transferType || "Inter-Company";
  });

  const isIntraCompany = transferType === "Intra-Company";

  // Source & Destination State
  const [fromCompany, setFromCompany] = useState<string>(() => {
    if (searchParams.type === "intra" || existingTransfer?.transferType === "Intra-Company") {
      return loggedInCompany;
    }
    return existingTransfer?.fromCompany || loggedInCompany;
  });

  const [fromStore, setFromStore] = useState<string>(() => {
    return existingTransfer?.fromStore || "PKCL Central Raw Material Warehouse";
  });

  const [toCompany, setToCompany] = useState<string>(() => {
    if (searchParams.type === "intra" || existingTransfer?.transferType === "Intra-Company") {
      return loggedInCompany;
    }
    return existingTransfer?.toCompany || "Pakiza Spinning Mills Ltd";
  });

  const [toStore, setToStore] = useState<string>(() => {
    if (existingTransfer?.toStore) return existingTransfer.toStore;
    if (searchParams.type === "intra" || existingTransfer?.transferType === "Intra-Company") {
      return "Dyeing & Finishing Auxiliary Chemical Store";
    }
    return "Spinning Spare Parts & Consumables Store";
  });

  // Handler to switch transfer type
  const handleSwitchTransferType = (type: TransferType) => {
    if (isViewMode) return;
    setTransferType(type);
    if (type === "Intra-Company") {
      setTaggedReqNumber("");
      setTaggedReqId("");
      setFromCompany(loggedInCompany);
      setToCompany(loggedInCompany);

      const sameCompanyStores = warehouses.filter(
        (w) => (w.organization === loggedInCompany || !w.organization) && w.status === "Active"
      );
      const storeList = sameCompanyStores.length > 0 ? sameCompanyStores : DEFAULT_WAREHOUSES;
      const s1 = storeList[0]?.storeName || storeList[0]?.name || "Central Store";
      const s2 =
        storeList.find((s) => (s.storeName || s.name) !== s1)?.storeName ||
        storeList.find((s) => (s.storeName || s.name) !== s1)?.name ||
        storeList[1]?.storeName ||
        storeList[0]?.storeName ||
        s1;

      setFromStore(s1);
      setToStore(s2);
      toast.info(`Switched to Intra-Company Transfer. Organizations locked to logged-in company (${loggedInCompany}).`);
    } else {
      setFromCompany(loggedInCompany);
      const otherComp =
        MASTER_COMPANIES.find((c) => c.name !== loggedInCompany)?.name || "Pakiza Spinning Mills Ltd";
      setToCompany(otherComp);
      toast.info("Switched to Multi-Company (Inter-Company) Transfer.");
    }
  };

  // Tagged Approved Transfer Requisition State
  const [taggedReqNumber, setTaggedReqNumber] = useState<string>(() => {
    return existingTransfer?.transferRequisitionNumber || "";
  });

  const [taggedReqId, setTaggedReqId] = useState<string>(() => {
    return existingTransfer?.transferRequisitionId || "";
  });

  const [reqModalOpen, setReqModalOpen] = useState(false);
  const [reqSearchQuery, setReqSearchQuery] = useState("");

  const [requestedBy] = useState<string>(() => {
    return existingTransfer?.requestedBy || "Tahmid Afsar Shapno (Store Manager)";
  });

  // Filtered Stores (Ensures never empty, falls back to all active warehouses)
  const availableFromStores = useMemo(() => {
    const list = warehouses.filter((w) => w.organization === fromCompany && w.status === "Active");
    if (list.length > 0) return list;
    const activeAll = warehouses.filter((w) => w.status === "Active");
    return activeAll.length > 0 ? activeAll : DEFAULT_WAREHOUSES;
  }, [warehouses, fromCompany]);

  const availableToStores = useMemo(() => {
    const list = warehouses.filter((w) => w.organization === toCompany && w.status === "Active");
    if (list.length > 0) return list;
    const activeAll = warehouses.filter((w) => w.status === "Active");
    return activeAll.length > 0 ? activeAll : DEFAULT_WAREHOUSES;
  }, [warehouses, toCompany]);

  // Available Approved Requisitions that can be tagged
  const storedReqs = getStoredTransferRequisitions();
  const availableApprovedRequisitions = useMemo(() => {
    return storedReqs.filter((r) => {
      if (r.status !== "Approved") return false;
      if (transferType === "Inter-Company" && r.requestedFromCompany !== fromCompany) return false;
      return true;
    });
  }, [storedReqs, fromCompany, transferType]);

  const handleTagRequisition = (req: TransferRequisition) => {
    setTaggedReqNumber(req.requisitionNumber);
    setTaggedReqId(req.id);
    setTransferType(req.transferType);
    setFromCompany(req.requestedFromCompany);
    setFromStore(req.requestedFromStore);
    setToCompany(req.requisitioningCompany);
    setToStore(req.requisitioningStore);

    const mappedItems: InterCompanyTransferItem[] = req.items.map((it, idx) => {
      const cat = catalogItems.find((c) => c.itemCode === it.itemCode);
      const availStock = cat?.maximumStock || it.availableStock || 1000;
      const qty = it.requiredQty;
      const rate = it.estimatedUnitPrice || 100;
      return {
        id: `ict-row-${Date.now()}-${idx}`,
        sl: idx + 1,
        itemCode: it.itemCode,
        itemName: it.itemName,
        specification: it.specification || "-",
        brand: it.brand || "Standard",
        origin: it.origin || "Bangladesh",
        uom: it.uom,
        availableStock: availStock,
        trRequisitionQty: qty,
        transferQty: qty,
        unitPrice: rate,
        totalValue: qty * rate,
        remarks: it.remarks || `Against TR #${req.requisitionNumber}`,
      };
    });

    if (mappedItems.length > 0) {
      setItems(mappedItems);
    }

    setReqModalOpen(false);
    toast.success(`Tagged Approved Transfer Requisition "${req.requisitionNumber}". Items & stores auto-filled.`);
  };

  const handleUntagRequisition = () => {
    setTaggedReqNumber("");
    setTaggedReqId("");
    toast.info("Un-tagged Transfer Requisition.");
  };

  // Item Search Modal State
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [itemSearchRowIndex, setItemSearchRowIndex] = useState<number | null>(null);

  // Transfer Items State
  const [items, setItems] = useState<InterCompanyTransferItem[]>(() => {
    if (existingTransfer?.items && existingTransfer.items.length > 0) return existingTransfer.items;
    return [
      {
        id: `ict-row-1`,
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        availableStock: 25000,
        transferQty: 100,
        unitPrice: 420,
        totalValue: 42000,
        batchAllocations: [
          {
            batchNumber: "BATCH-COT-2026-01",
            quantity: 100,
            toWarehouse: "Spinning Spare Parts & Consumables Store",
            toStore: "Spinning Spare Parts & Consumables Store",
          },
        ],
        remarks: "Production batch allocation",
      },
    ];
  });

  // Modal State for Batch/Location
  const [activeTrackingItemId, setActiveTrackingItemId] = useState<string | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  const activeTrackingItem = useMemo(() => {
    return items.find((i) => i.id === activeTrackingItemId) || null;
  }, [items, activeTrackingItemId]);

  const openTrackingModal = (item: InterCompanyTransferItem) => {
    if (isViewMode) return;
    const mode = getItemTrackingMode(item.itemCode, catalogItems);
    setActiveTrackingItemId(item.id);
    if (mode === "Batch") {
      setBatchModalOpen(true);
    } else if (mode === "Location") {
      setLocationModalOpen(true);
    }
  };

  const handleSaveLocationAllocations = (allocations: TransferLocationEntry[]) => {
    if (!activeTrackingItemId) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === activeTrackingItemId
          ? {
              ...it,
              locationAllocations: allocations.map((a) => ({
                sourceLocationName: a.sourceLocationName,
                destinationLocationName: a.destinationLocationName,
                locationName: a.destinationLocationName || a.locationName,
                quantity: a.quantity,
                fromWarehouse: a.fromWarehouse,
                fromStore: a.fromStore,
                toWarehouse: a.toWarehouse,
                toStore: a.toStore,
              })),
            }
          : it
      )
    );
    setLocationModalOpen(false);
    toast.success("Location allocations confirmed.");
  };

  const handleSaveBatchAllocations = (allocations: TransferBatchEntry[]) => {
    if (!activeTrackingItemId) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === activeTrackingItemId
          ? {
              ...it,
              batchAllocations: allocations.map((b) => ({
                sourceBatchNumber: b.sourceBatchNumber,
                destinationBatchNumber: b.destinationBatchNumber,
                batchNumber: b.destinationBatchNumber || b.batchNumber,
                quantity: b.quantity,
                fromWarehouse: b.fromWarehouse,
                fromStore: b.fromStore,
                toWarehouse: b.toWarehouse,
                toStore: b.toStore,
                expiryDate: b.expiryDate,
              })),
            }
          : it
      )
    );
    setBatchModalOpen(false);
    toast.success("Batch allocations confirmed.");
  };

  // Item Table Manipulation
  const handleAddItem = () => {
    if (isViewMode) return;
    const availableToAdd = catalogItems.find(
      (cat) => !items.some((it) => it.itemCode === cat.itemCode)
    );

    const defaultItem = availableToAdd || catalogItems[0];
    if (!defaultItem) return;

    const newItem: InterCompanyTransferItem = {
      id: `ict-row-${Date.now()}`,
      sl: items.length + 1,
      itemCode: defaultItem.itemCode,
      itemName: defaultItem.itemName,
      specification: defaultItem.specification || "-",
      brand: defaultItem.brand || "Standard",
      origin: defaultItem.origin || "Bangladesh",
      uom: defaultItem.stockUOM || "PCS",
      availableStock: defaultItem.maximumStock || 500,
      transferQty: 1,
      unitPrice: defaultItem.standardPurchasePrice || 100,
      totalValue: defaultItem.standardPurchasePrice || 100,
      remarks: "",
    };

    setItems((prev) => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    if (isViewMode) return;
    if (items.length === 1) {
      toast.error("At least one item must remain in the stock transfer.");
      return;
    }
    setItems((prev) =>
      prev
        .filter((i) => i.id !== id)
        .map((it, idx) => ({ ...it, sl: idx + 1 }))
    );
  };

  const handleItemFieldChange = (
    id: string,
    field: "transferQty" | "itemCode" | "remarks",
    value: string
  ) => {
    if (isViewMode) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === "itemCode") {
          const found = catalogItems.find((c) => c.itemCode === value);
          if (!found) return item;
          const transferQty = item.transferQty || 1;
          const unitPrice = found.standardPurchasePrice || 100;
          return {
            ...item,
            itemCode: found.itemCode,
            itemName: found.itemName,
            specification: found.specification || "-",
            brand: found.brand || "Standard",
            origin: found.origin || "Bangladesh",
            uom: found.stockUOM || "PCS",
            availableStock: found.maximumStock || 500,
            unitPrice,
            totalValue: transferQty * unitPrice,
          };
        }

        if (field === "transferQty") {
          const qty = Math.max(0, parseFloat(value) || 0);
          return {
            ...item,
            transferQty: qty,
            totalValue: qty * item.unitPrice,
          };
        }

        if (field === "remarks") {
          return { ...item, remarks: value };
        }

        return item;
      })
    );
  };

  const handleSelectItemFromSearch = (ci: ItemProductMaster) => {
    if (isViewMode) return;
    if (itemSearchRowIndex !== null && items[itemSearchRowIndex]) {
      const targetRow = items[itemSearchRowIndex];
      const transferQty = targetRow.transferQty || 1;
      const unitPrice = ci.standardPurchasePrice || 100;
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
                availableStock: ci.maximumStock || 500,
                unitPrice,
                totalValue: transferQty * unitPrice,
              }
            : row
        )
      );
    } else {
      // Add new row with this item
      const newItem: InterCompanyTransferItem = {
        id: `ict-row-${Date.now()}`,
        sl: items.length + 1,
        itemCode: ci.itemCode,
        itemName: ci.itemName,
        specification: ci.specification || "-",
        brand: ci.brand || "Standard",
        origin: ci.origin || "Bangladesh",
        uom: ci.stockUOM || ci.purchaseUOM || "PCS",
        availableStock: ci.maximumStock || 500,
        transferQty: 1,
        unitPrice: ci.standardPurchasePrice || 100,
        totalValue: ci.standardPurchasePrice || 100,
        remarks: "",
      };
      setItems((prev) => [...prev, newItem]);
    }
    setItemSearchOpen(false);
    setItemSearchRowIndex(null);
  };

  // Summary Metrics
  const totalTransferQty = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.transferQty) || 0), 0);
  }, [items]);

  const totalTransferValue = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.totalValue) || 0), 0);
  }, [items]);

  // Validations
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    if (transferType === "Inter-Company" && !taggedReqNumber) {
      errs.push("Tagging an approved Transfer Requisition is required.");
    }
    if (transferType === "Intra-Company" && fromStore && toStore && fromStore === toStore) {
      errs.push("Source Store and Destination Store must be different for intra-company transfer.");
    }
    if (transferReason === "Other" && !reasonDetails.trim()) {
      errs.push("Reason Details is mandatory when Transfer Reason is 'Other'.");
    }
    if (items.length === 0) {
      errs.push("Please add at least one item to transfer.");
    }

    items.forEach((it) => {
      if (it.transferQty <= 0) {
        errs.push(`${it.itemName}: Transfer quantity must be greater than zero.`);
      }
      if (it.transferQty > it.availableStock) {
        errs.push(
          `${it.itemName}: Transfer quantity (${it.transferQty}) exceeds available stock (${it.availableStock}).`
        );
      }
    });

    return errs;
  }, [transferType, taggedReqNumber, transferReason, reasonDetails, items]);

  // Save / Submit Handlers
  const handleSaveTransfer = (status: "Draft" | "Submitted") => {
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    const payload: InterCompanyTransfer = {
      id: existingTransfer?.id || `ict-${Date.now()}`,
      transferId,
      transferDate,
      transferType,
      transferRequisitionNumber: taggedReqNumber || undefined,
      transferRequisitionId: taggedReqId || undefined,
      transferReason,
      reasonDetails: transferReason === "Other" ? reasonDetails : undefined,
      remarks,
      fromCompany,
      fromStore,
      toCompany,
      toStore,
      requestedBy,
      totalItems: items.length,
      totalTransferQty,
      totalTransferValue,
      status,
      items,
      createdAt: existingTransfer?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveInterCompanyTransfer(payload);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`cripton_transfer_draft_${transferId}`);
        localStorage.removeItem("cripton_transfer_active_draft");
      } catch {
        // ignore
      }
    }

    toast.success(
      status === "Draft"
        ? `Transfer draft ${transferId} saved successfully!`
        : `Transfer ${transferId} submitted successfully for warehouse dispatch!`
    );

    navigate({ to: "/inv-intercompany-transfer-list" });
  };

  // Section 4: Auto-persist active draft so refreshing browser preserves in-progress input
  useEffect(() => {
    if (isViewMode) return;
    if (typeof window !== "undefined") {
      try {
        const draft = {
          transferId,
          transferDate,
          transferType,
          transferReason,
          reasonDetails,
          remarks,
          fromCompany,
          fromStore,
          toCompany,
          toStore,
          requestedBy,
          taggedReqNumber,
          taggedReqId,
          items,
        };
        const key = editingTransferId ? `cripton_transfer_draft_${editingTransferId}` : "cripton_transfer_active_draft";
        localStorage.setItem(key, JSON.stringify(draft));
      } catch {
        // ignore
      }
    }
  }, [
    isViewMode,
    editingTransferId,
    transferId,
    transferDate,
    transferType,
    transferReason,
    reasonDetails,
    remarks,
    fromCompany,
    fromStore,
    toCompany,
    toStore,
    requestedBy,
    taggedReqNumber,
    taggedReqId,
    items,
  ]);

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      companyName: fromCompany,
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "INTER-COMPANY STOCK TRANSFER REQUISITION",
      reportNumber: transferId,
      reportDate: transferDate,
      statusBadge: isViewMode ? existingTransfer?.status || "Draft" : "Draft",
      metaFields: [
        { label: "Transfer ID", value: transferId },
        { label: "Transfer Date", value: transferDate },
        { label: "From Company", value: fromCompany },
        { label: "From Store", value: fromStore },
        { label: "To Company", value: toCompany },
        { label: "To Store", value: toStore },
        { label: "Transfer Reason", value: transferReason },
        { label: "Requested By", value: requestedBy },
      ],
      tableHeaders: ["SL", "ITEM CODE", "ITEM DESCRIPTION", "UOM", "TRANSFER QTY", "UNIT PRICE (৳)", "TOTAL (৳)"],
      tableRows: items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        String(it.transferQty),
        String(it.unitPrice),
        String(it.totalValue.toLocaleString()),
      ]),
      summaryCards: [
        { label: "Total Items", value: String(items.length) },
        { label: "Total Transfer Qty", value: `${totalTransferQty} units` },
        { label: "Total Transfer Value", value: `৳ ${totalTransferValue.toLocaleString()}` },
      ],
      notes: [
        "Inter-company transfer will deduct stock upon dispatch confirmation.",
        "Destination warehouse will acknowledge goods through Inter-Company Transfer Receive.",
      ],
      signatures: [
        { title: "Requested By", name: requestedBy, date: transferDate },
        { title: "Source Store In-Charge", name: "Store Manager", date: transferDate },
        { title: "Managing Director / COO", name: "Executive Approver", date: transferDate },
      ],
    };
  }, [
    fromCompany,
    toCompany,
    fromStore,
    toStore,
    transferId,
    transferDate,
    transferReason,
    requestedBy,
    items,
    totalTransferQty,
    totalTransferValue,
    isViewMode,
    existingTransfer,
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
                to="/inv-intercompany-transfer-list"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back to Transfers List"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    {isViewMode ? "View Inter-Company Stock Transfer" : "Inter-Company Stock Transfer Entry"}
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {transferId}
                  </span>
                  {isViewMode && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Mode: Read-Only
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Issue inter-company transfer challans between sister companies and allocate tracked batches
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
                Preview Challan
              </button>

              {!isViewMode && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSaveTransfer("Draft")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    <Save className="size-3.5" />
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveTransfer("Submitted")}
                    disabled={validationErrors.length > 0}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    Submit Transfer
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
                <ul className="text-xs text-rose-700 list-disc list-inside space-y-0.5 font-medium">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section 1: Transfer Header & Companies (Section-level scroll enabled if content expands) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <ArrowLeftRight className="size-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Transfer Header & Organizational Route
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Source and destination entities must be distinct
              </span>
            </div>

            {/* Transfer Type Selector & Policy / Tagging Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Transfer Type:</span>
                  <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                    <button
                      type="button"
                      disabled={isViewMode}
                      onClick={() => handleSwitchTransferType("Inter-Company")}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                        transferType === "Inter-Company"
                          ? "bg-purple-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Multi-Company Transfer
                    </button>
                    <button
                      type="button"
                      disabled={isViewMode}
                      onClick={() => handleSwitchTransferType("Intra-Company")}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                        transferType === "Intra-Company"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Intra-Company Transfer
                    </button>
                  </div>
                </div>

                {!isViewMode && transferType === "Inter-Company" && (
                  <button
                    type="button"
                    onClick={() => setReqModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <FileCheck2 className="size-3.5" />
                    <span>+ Tag Approved Requisition</span>
                  </button>
                )}
              </div>

              {/* Tagged Requisition Indicator */}
              {taggedReqNumber && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-emerald-950">Tagged Approved Requisition:</span>
                    <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                      {taggedReqNumber}
                    </span>
                    <span className="text-emerald-700 truncate hidden md:inline">
                      • Requisitioned by {toCompany} ({toStore})
                    </span>
                  </div>
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={handleUntagRequisition}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer shrink-0 ml-2"
                    >
                      Remove Tag
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Transfer ID */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Transfer ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={transferId}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-mono font-bold text-indigo-600 outline-none cursor-not-allowed"
                />
              </div>

              {/* Transfer Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Transfer Date *
                </label>
                <input
                  type="date"
                  disabled={isViewMode}
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Transfer Reason */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Transfer Reason *
                </label>
                <select
                  disabled={isViewMode}
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value as TransferReasonType)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="Stock Replenishment">Stock Replenishment</option>
                  <option value="Stock Balancing">Stock Balancing</option>
                  <option value="Business Requirement">Business Requirement</option>
                  <option value="Emergency Requirement">Emergency Requirement</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Requested / Dispatched By */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Requested By
                </label>
                <input
                  type="text"
                  readOnly
                  value={requestedBy}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none cursor-not-allowed"
                />
              </div>

              {/* Reason Details (conditional) */}
              {transferReason === "Other" && (
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Reason Details *
                  </label>
                  <input
                    type="text"
                    disabled={isViewMode}
                    placeholder="Specify detailed business justification for 'Other'..."
                    value={reasonDetails}
                    onChange={(e) => setReasonDetails(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50"
                  />
                </div>
              )}

              {/* SOURCE (FROM) SECTION */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 sm:col-span-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-blue-500 inline-block" />
                    Source (From) Organization & Store
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      From Company / Organization *
                    </label>
                    {isIntraCompany ? (
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={fromCompany}
                          className="w-full h-9 rounded-lg border border-slate-200 bg-slate-100/90 px-3 text-xs font-bold text-slate-800 outline-none cursor-not-allowed select-all"
                        />
                        <div className="absolute right-2.5 top-2.5">
                          <Lock className="size-3.5 text-slate-400" />
                        </div>
                      </div>
                    ) : (
                      <select
                        disabled={isViewMode}
                        value={fromCompany}
                        onChange={(e) => setFromCompany(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100"
                      >
                        {MASTER_COMPANIES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      From Warehouse / Store *
                    </label>
                    <select
                      disabled={isViewMode}
                      value={fromStore}
                      onChange={(e) => setFromStore(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100"
                    >
                      {availableFromStores.map((w) => {
                        const sName = w.storeName || w.name;
                        return (
                          <option key={w.id} value={sName}>
                            {sName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* DESTINATION (TO) SECTION */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 sm:col-span-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500 inline-block" />
                    Destination (To) Organization & Store
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      To Company / Organization *
                    </label>
                    {isIntraCompany ? (
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={toCompany}
                          className="w-full h-9 rounded-lg border border-slate-200 bg-slate-100/90 px-3 text-xs font-bold text-slate-800 outline-none cursor-not-allowed select-all"
                        />
                        <div className="absolute right-2.5 top-2.5">
                          <Lock className="size-3.5 text-slate-400" />
                        </div>
                      </div>
                    ) : (
                      <select
                        disabled={isViewMode}
                        value={toCompany}
                        onChange={(e) => setToCompany(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100"
                      >
                        {MASTER_COMPANIES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      To Warehouse / Store *
                    </label>
                    <select
                      disabled={isViewMode}
                      value={toStore}
                      onChange={(e) => setToStore(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100"
                    >
                      {availableToStores.map((w) => {
                        const sName = w.storeName || w.name;
                        return (
                          <option key={w.id} value={sName}>
                            {sName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* Overall Remarks */}
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Overall Transfer Remarks / Log Notes
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  placeholder="Optional transfer notes or carrier transport instructions..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Items Table with Section-level scrolling */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="size-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Transfer Items & Batch / Location Matrix
                </h3>
              </div>
              {!isViewMode && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
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
                      <th className="py-3 px-3 min-w-[200px]">Item Description & Code</th>
                      <th className="py-3 px-3 min-w-[140px]">Specification</th>
                      <th className="py-3 px-3 min-w-[120px]">Brand / Origin</th>
                      <th className="py-3 px-2 text-center w-16">UOM</th>
                      <th className="py-3 px-3 text-right w-28">Available Stock</th>
                      <th className="py-3 px-3 text-right w-28 text-slate-700">TR Requisition Qty</th>
                      <th className="py-3 px-3 text-right w-32 bg-indigo-50/50 text-indigo-900 font-black">
                        Transfer Qty *
                      </th>
                      <th className="py-3 px-3 text-center w-28">Tracking (B/L)</th>
                      {!isViewMode && <th className="py-3 px-2 text-center w-12">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-400">
                          No items added yet. Click &quot;Add Line Item&quot; to begin.
                        </td>
                      </tr>
                    ) : (
                      items.map((row, rIdx) => {
                        const isOverStock = row.transferQty > row.availableStock;
                        const trackingMode = getItemTrackingMode(row.itemCode, catalogItems);

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
                                  <div className="font-mono text-[10.5px] text-indigo-600">{row.itemCode}</div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 min-w-[200px]">
                                  <div className="flex-1">
                                    <div className="font-bold text-slate-800 line-clamp-1">{row.itemName}</div>
                                    <div className="font-mono text-[10px] text-indigo-600">{row.itemCode}</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setItemSearchRowIndex(rIdx);
                                      setItemSearchQuery("");
                                      setItemSearchOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 shadow-2xs transition cursor-pointer shrink-0"
                                    title="Search item from catalog"
                                  >
                                    <Search className="size-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Specification */}
                            <td className="py-3 px-3 text-slate-500 max-w-[180px] truncate" title={row.specification}>
                              {row.specification || "-"}
                            </td>

                            {/* Brand / Origin */}
                            <td className="py-3 px-3 text-slate-600">
                              {row.brand} / {row.origin}
                            </td>

                            <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-600">
                              {row.uom}
                            </td>

                            <td className="py-3 px-3 text-right font-mono font-bold text-slate-600">
                              {row.availableStock.toLocaleString()}
                            </td>

                            <td className="py-3 px-3 text-right font-mono font-bold text-slate-700 bg-slate-50/40">
                              {row.trRequisitionQty !== undefined ? row.trRequisitionQty.toLocaleString() : "—"}
                            </td>

                            {/* Transfer Qty Input */}
                            <td className="py-3 px-3 text-right bg-indigo-50/20">
                              {isViewMode ? (
                                <span className="font-mono font-black text-indigo-700">
                                  {row.transferQty.toLocaleString()}
                                </span>
                              ) : (
                                <div className="flex flex-col items-end gap-0.5">
                                  <input
                                    type="number"
                                    min="1"
                                    max={row.availableStock}
                                    value={row.transferQty}
                                    onChange={(e) =>
                                      handleItemFieldChange(row.id, "transferQty", e.target.value)
                                    }
                                    className={`w-24 h-8 px-2 text-right font-mono font-bold text-xs rounded-lg border outline-none transition-colors ${
                                      isOverStock
                                        ? "border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20"
                                        : "border-slate-300 bg-white text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    }`}
                                  />
                                  <span className="text-[9.5px] font-semibold text-slate-400">
                                    Max: {row.availableStock}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Tracking Cell (B / L) */}
                            <td className="py-3 px-3 text-center">
                              <ItemTrackingCell
                                trackingMode={trackingMode}
                                mode={trackingMode}
                                batchAllocations={row.batchAllocations}
                                locationAllocations={row.locationAllocations}
                                onOpenModal={() => openTrackingModal(row)}
                                disabled={isViewMode}
                              />
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

            {/* Table Bottom Summary */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Inter-Company Transfer Totals
              </span>
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Total Items: </span>
                  <span className="font-bold text-slate-900 font-mono">{items.length}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Total Transfer Qty: </span>
                  <span className="font-bold text-indigo-700 font-mono">
                    {totalTransferQty.toLocaleString()} units
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Allocation Modal */}
        {locationModalOpen && activeTrackingItem && (
          <TransferLocationAllocationModal
            isOpen={true}
            onClose={() => setLocationModalOpen(false)}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            transactionQty={activeTrackingItem.transferQty}
            uom={activeTrackingItem.uom}
            transferType={transferType}
            sourceStore={fromStore}
            availableSourceStores={availableFromStores}
            defaultDestinationStore={toStore}
            availableDestinationStores={availableToStores}
            initialEntries={activeTrackingItem.locationAllocations}
            onSave={handleSaveLocationAllocations}
            readOnly={isViewMode}
          />
        )}

        {/* Batch Allocation Modal */}
        {batchModalOpen && activeTrackingItem && (
          <TransferBatchAllocationModal
            isOpen={true}
            onClose={() => setBatchModalOpen(false)}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            transactionQty={activeTrackingItem.transferQty}
            uom={activeTrackingItem.uom}
            transferType={transferType}
            sourceStore={fromStore}
            availableSourceStores={availableFromStores}
            defaultDestinationStore={toStore}
            availableDestinationStores={availableToStores}
            initialEntries={activeTrackingItem.batchAllocations}
            onSave={handleSaveBatchAllocations}
            readOnly={isViewMode}
          />
        )}

        {/* Tag Approved Transfer Requisition Modal */}
        {reqModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-indigo-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                    <FileCheck2 className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">
                      Tag Approved Transfer Requisition
                    </h2>
                    <p className="text-xs text-slate-500">
                      Select an approved requisition to fulfill. Destination company, store, and items will be loaded automatically.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReqModalOpen(false)}
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
                    value={reqSearchQuery}
                    onChange={(e) => setReqSearchQuery(e.target.value)}
                    placeholder="Search by TR #, Requisitioning Company, Store, or Item..."
                    className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Requisition No</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Requisitioning Entity (Recipient)</th>
                        <th className="py-2.5 px-3 text-center">Items</th>
                        <th className="py-2.5 px-3 text-right">Est. Value (৳)</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {availableApprovedRequisitions
                        .filter((r) => {
                          if (!reqSearchQuery.trim()) return true;
                          const q = reqSearchQuery.toLowerCase();
                          return (
                            r.requisitionNumber.toLowerCase().includes(q) ||
                            r.requisitioningCompany.toLowerCase().includes(q) ||
                            r.requisitioningStore.toLowerCase().includes(q) ||
                            r.items.some((i) => i.itemName.toLowerCase().includes(q) || i.itemCode.toLowerCase().includes(q))
                          );
                        })
                        .map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50 transition">
                            <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">
                              {req.requisitionNumber}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">{req.requisitionDate}</td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-800">{req.requisitioningCompany}</div>
                              <div className="text-[10px] text-slate-500">{req.requisitioningStore}</div>
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                              {req.items.length} items ({req.totalRequiredQty} units)
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                              ৳ {req.totalEstimatedValue.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {req.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleTagRequisition(req)}
                                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
                              >
                                + Tag & Load Items
                              </button>
                            </td>
                          </tr>
                        ))}
                      {availableApprovedRequisitions.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-slate-400">
                            No approved requisitions found for source company &quot;{fromCompany}&quot;.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
                <Link
                  to="/inv-transfer-requisition-approval"
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Need approval? Go to Transfer Requisition Approval Desk →
                </Link>
                <button
                  type="button"
                  onClick={() => setReqModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Item Search Modal */}
        {itemSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
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
                    className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
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
                            <td className="py-2 px-3 font-mono font-bold text-indigo-600">{ci.itemCode}</td>
                            <td className="py-2 px-3 font-bold text-slate-800">{ci.itemName}</td>
                            <td className="py-2 px-3 text-slate-500">{ci.specification || ci.description || "—"}</td>
                            <td className="py-2 px-3 text-slate-600">{ci.brand || "Standard OEM"}</td>
                            <td className="py-2 px-3 text-slate-600">{ci.origin || "Imported"}</td>
                            <td className="py-2 px-3 text-center font-mono font-bold">{ci.stockUOM || ci.purchaseUOM || "PCS"}</td>
                            <td className="py-2 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleSelectItemFromSearch(ci)}
                                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
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
        {/* Preview Challan Modal */}
        <StandardPreviewReportModal
          isOpen={previewReportOpen}
          onClose={() => setPreviewReportOpen(false)}
          data={previewReportData}
        />
      </main>
    </div>
  );
}
