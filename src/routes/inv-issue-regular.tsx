import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { toast } from "sonner";
import {
  PackageOpen,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Search,
  User,
  Layers,
  ChevronDown,
  Warehouse,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  MaterialRequisition,
  MaterialIssue,
  MaterialIssueItem,
  getStoredMaterialRequisitions,
  getStoredMaterialIssues,
  getAvailableStockForItem,
  postMaterialIssue,
} from "@/lib/inventory-requisition-issue-data";
import {
  DEFAULT_ITEMS,
  DEFAULT_WAREHOUSES,
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

interface IssueRegularSearch {
  mrId?: string;
  issueId?: string;
  mode?: "view" | "edit";
}

export const Route = createFileRoute("/inv-issue-regular")({
  validateSearch: (search: Record<string, unknown>): IssueRegularSearch => {
    return {
      mrId: search.mrId as string | undefined,
      issueId: search.issueId as string | undefined,
      mode: search.mode as "view" | "edit" | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Material Issue — Inventory ERP" },
      {
        name: "description",
        content: "Issue materials against approved Material Requisitions with live stock deduction.",
      },
    ],
  }),
  component: InvIssueRegularPage,
});

function InvIssueRegularPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const requisitions = useMemo(() => getStoredMaterialRequisitions(), []);
  const catalogItems = useMemo(
    () => getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS),
    []
  );

  const isViewMode = searchParams.mode === "view";
  const storedIssues = useMemo(() => getStoredMaterialIssues(), []);

  // If viewing an existing issue record by issueId or mrId
  const viewingIssueRecord = useMemo(() => {
    if (!isViewMode) return null;
    if (searchParams.issueId) {
      return (
        storedIssues.find(
          (i: MaterialIssue) => i.id === searchParams.issueId || i.issueNumber === searchParams.issueId
        ) || null
      );
    }
    if (searchParams.mrId) {
      return (
        storedIssues.find(
          (i: MaterialIssue) => i.mrId === searchParams.mrId || i.mrNumber === searchParams.mrId
        ) || null
      );
    }
    return null;
  }, [isViewMode, searchParams.issueId, searchParams.mrId, storedIssues]);

  // Available approved MRs for dropdown selection
  const approvedMRs = useMemo(() => {
    return requisitions.filter(
      (r) =>
        (r.status === "Approved" || r.status === "Partially Issued") && r.remainingQuantity > 0
    );
  }, [requisitions]);

  const [selectedMRId, setSelectedMRId] = useState<string>(() => {
    if (viewingIssueRecord) return viewingIssueRecord.mrId;
    if (searchParams.mrId) return searchParams.mrId;
    if (approvedMRs.length > 0) return approvedMRs[0].id;
    return "";
  });

  const activeMR = useMemo(() => {
    if (!selectedMRId) return null;
    return requisitions.find((r) => r.id === selectedMRId || r.mrNumber === selectedMRId) || null;
  }, [selectedMRId, requisitions]);

  // Form Fields
  const [issueNumber] = useState<string>(
    () => viewingIssueRecord?.issueNumber || `ISS-2026-${String(Math.floor(1000 + Math.random() * 9000))}`
  );
  const [issueDate, setIssueDate] = useState<string>(
    () => viewingIssueRecord?.issueDate || new Date().toISOString().slice(0, 10)
  );
  const [issueType, setIssueType] = useState<"Issue Regular" | "Issue Special">(
    () => (viewingIssueRecord?.issueType as any) || "Issue Regular"
  );
  const [srnNo, setSrnNo] = useState<string>(
    () => viewingIssueRecord?.srnNo || `SRN-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [remarks, setRemarks] = useState<string>(
    () => viewingIssueRecord?.remarks || ""
  );

  // Items State (loaded from viewingIssueRecord or activeMR)
  const [issueItems, setIssueItems] = useState<MaterialIssueItem[]>([]);

  const warehouses = useMemo(
    () => getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES),
    []
  );

  const [selectedIssueStore, setSelectedIssueStore] = useState<string>(() => {
    return (
      viewingIssueRecord?.warehouseStore ||
      activeMR?.warehouseStore ||
      warehouses[0]?.name ||
      "Pakiza Technovation Central IT & Hardware Depot"
    );
  });

  useEffect(() => {
    if (viewingIssueRecord) {
      setSelectedIssueStore(viewingIssueRecord.warehouseStore);
      setIssueItems(viewingIssueRecord.items);
      return;
    }
    if (activeMR?.warehouseStore) {
      setSelectedIssueStore(activeMR.warehouseStore);
    }
  }, [viewingIssueRecord, activeMR]);

  // Auto-populate when activeMR changes (only in non-view mode or if no view record)
  useEffect(() => {
    if (viewingIssueRecord) return;
    if (activeMR) {
      const storeToUse = selectedIssueStore || activeMR.warehouseStore;
      const items: MaterialIssueItem[] = activeMR.items.map((it, idx) => {
        const itemStore = it.requisitionStore || storeToUse;
        const availableStock = getAvailableStockForItem(itemStore, it.itemCode);
        const remainingMRQty =
          Number(it.remainingQuantity) > 0
            ? Number(it.remainingQuantity)
            : Number(it.requestedQuantity) - (Number(it.issuedQuantity) || 0);

        // Default default issue qty: min(remainingMRQty, availableStock)
        const defaultIssueQty = Math.max(0, Math.min(remainingMRQty, availableStock));

        return {
          id: `isi-${Date.now()}-${idx}`,
          sl: idx + 1,
          mrItemId: it.id,
          itemCode: it.itemCode,
          itemName: it.itemName,
          specification: it.specification,
          brand: it.brand,
          origin: it.origin,
          uom: it.uom,
          mrRequestedQty: it.requestedQuantity,
          previouslyIssuedQty: it.issuedQuantity || 0,
          remainingIssueQty: remainingMRQty,
          availableStock: availableStock,
          issueStore: itemStore,
          issueQty: defaultIssueQty,
          unitPrice: 150,
          totalPrice: defaultIssueQty * 150,
          batchAllocations: it.batchNumber
            ? [{ batchNumber: it.batchNumber, quantity: defaultIssueQty }]
            : [],
          locationAllocations: it.location
            ? [{ locationName: it.location, quantity: defaultIssueQty }]
            : [],
          remarks: "",
        };
      });
      setIssueItems(items);
    } else {
      setIssueItems([]);
    }
  }, [activeMR]);

  const handleStoreChange = (newStore: string) => {
    setSelectedIssueStore(newStore);
    setIssueItems((prev) =>
      prev.map((item) => {
        const stock = getAvailableStockForItem(newStore, item.itemCode);
        const maxPermitted = Math.min(item.remainingIssueQty, stock);
        const newIssueQty = Math.min(item.issueQty, maxPermitted);
        return {
          ...item,
          issueStore: newStore,
          availableStock: stock,
          issueQty: newIssueQty,
          totalPrice: newIssueQty * (item.unitPrice || 0),
        };
      })
    );
  };

  const handleItemStoreChange = (itemId: string, newStore: string) => {
    setIssueItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const stock = getAvailableStockForItem(newStore, item.itemCode);
          const maxPermitted = Math.min(item.remainingIssueQty, stock);
          const newIssueQty = Math.min(item.issueQty, maxPermitted);
          return {
            ...item,
            issueStore: newStore,
            availableStock: stock,
            issueQty: newIssueQty,
            totalPrice: newIssueQty * (item.unitPrice || 0),
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setIssueItems((prev) => prev.filter((it) => it.id !== itemId));
    toast.info("Item removed from current issue transaction.");
  };

  // Handle Qty Change with strict validation
  const handleIssueQtyChange = (id: string, newQtyStr: string) => {
    const qty = Number(newQtyStr) || 0;
    setIssueItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const maxPermitted = Math.min(item.remainingIssueQty, item.availableStock);
          return {
            ...item,
            issueQty: qty,
            totalPrice: qty * (item.unitPrice || 0),
          };
        }
        return item;
      })
    );
  };

  // Tracking Modal State
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [activeTrackingItem, setActiveTrackingItem] = useState<MaterialIssueItem | null>(null);

  const openTrackingModal = (item: MaterialIssueItem) => {
    const trackingMode = getItemTrackingMode(item.itemCode, catalogItems);
    setActiveTrackingItem(item);
    if (trackingMode === "Batch") {
      setBatchModalOpen(true);
    } else if (trackingMode === "Location") {
      setLocationModalOpen(true);
    }
  };

  const handleSaveLocationAllocations = (allocations: LocationEntry[]) => {
    if (!activeTrackingItem) return;
    setIssueItems((prev) =>
      prev.map((it) =>
        it.id === activeTrackingItem.id
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
    if (!activeTrackingItem) return;
    setIssueItems((prev) =>
      prev.map((it) =>
        it.id === activeTrackingItem.id
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

  // Validation Checks
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!activeMR) {
      errors.push("No Material Requisition selected.");
      return errors;
    }

    let hasNonZero = false;
    issueItems.forEach((it) => {
      if (it.issueQty > 0) hasNonZero = true;
      if (it.issueQty > it.remainingIssueQty) {
        errors.push(
          `${it.itemName}: Issue quantity (${it.issueQty}) exceeds remaining MR quantity (${it.remainingIssueQty}).`
        );
      }
      if (it.issueQty > it.availableStock) {
        errors.push(
          `${it.itemName}: Issue quantity (${it.issueQty}) exceeds available warehouse stock (${it.availableStock}).`
        );
      }
    });

    if (!hasNonZero) {
      errors.push("At least one item must have an issue quantity greater than 0.");
    }
    return errors;
  }, [activeMR, issueItems]);

  const totalIssueQuantity = useMemo(() => {
    return issueItems.reduce((acc, i) => acc + (Number(i.issueQty) || 0), 0);
  }, [issueItems]);

  // Submit / Post Issue
  const handlePostIssue = () => {
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }
    if (!activeMR) return;

    const newIssue: MaterialIssue = {
      id: `iss-${Date.now()}`,
      issueNumber,
      mrId: activeMR.id,
      mrNumber: activeMR.mrNumber,
      issueDate,
      organization: activeMR.organization,
      department: activeMR.department,
      issuedTo: activeMR.requestedBy,
      employeeId: "EMP-00142",
      requiredDate: activeMR.requiredDate,
      warehouseStore: selectedIssueStore || activeMR.warehouseStore,
      issueType,
      srnNo,
      totalItems: issueItems.filter((i) => i.issueQty > 0).length,
      totalIssueQty: totalIssueQuantity,
      status: "Posted",
      items: issueItems.filter((i) => i.issueQty > 0),
      remarks,
      previouslyReturnedQty: 0,
      returnableQty: totalIssueQuantity,
    };

    // Deducts stock, updates MR remaining/issued quantities, saves issue
    postMaterialIssue(newIssue);

    toast.success(
      `Material Issue ${issueNumber} posted! Stock deducted and balance updated successfully.`
    );
    navigate({ to: "/inv-issue-list" });
  };

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      companyName: activeMR?.organization || "Pakiza Knit Composite Ltd",
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "STORE MATERIAL ISSUE SLIP",
      reportNumber: issueNumber,
      reportDate: issueDate,
      statusBadge: "Posted",
      metaFields: [
        { label: "Material Requisition ID", value: activeMR?.mrNumber || "-" },
        { label: "Issue Type", value: issueType },
        { label: "Department", value: activeMR?.department || "-" },
        { label: "Issued To", value: activeMR?.requestedBy || "-" },
        { label: "Warehouse / Store", value: activeMR?.warehouseStore || "-" },
        { label: "SRN Number", value: srnNo },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "ITEM DESCRIPTION",
        "UOM",
        "MR REQ QTY",
        "PREV ISSUED",
        "REMAINING QTY",
        "ISSUE QTY",
        "AVL STOCK",
      ],
      tableRows: issueItems.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        String(it.mrRequestedQty),
        String(it.previouslyIssuedQty),
        String(it.remainingIssueQty),
        String(it.issueQty),
        String(it.availableStock),
      ]),
      summaryCards: [
        { label: "Total Items", value: String(issueItems.length) },
        { label: "Total Issue Qty", value: String(totalIssueQuantity) },
      ],
      notes: [
        `Issued against approved Material Requisition ${activeMR?.mrNumber}.`,
        "Physical receipt verified and store ledgers updated upon posting.",
      ],
      signatures: [
        { title: "Store In-Charge", name: "Warehouse Dispatcher", date: issueDate },
        { title: "Receiver Signature", name: activeMR?.requestedBy || "Employee", date: "-" },
      ],
    };
  }, [activeMR, issueNumber, issueDate, issueType, srnNo, issueItems, totalIssueQuantity]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <Link
                to="/inv-issue-list"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back to Material Issue List"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    Material Issue Entry
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {issueNumber}
                  </span>
                  {activeMR && (
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Against {activeMR.mrNumber}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Fulfill approved Material Requisitions with automated stock validation and location/batch allocation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewReportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="size-3.5 text-slate-600" />
                Preview Issue Slip
              </button>

              {!isViewMode && (
                <button
                  type="button"
                  onClick={handlePostIssue}
                  disabled={validationErrors.length > 0}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="size-4" />
                  Confirm & Post Issue
                </button>
              )}
            </div>
          </div>

          {/* Validation Errors Notice */}
          {!isViewMode && validationErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">
                  Cannot Post Issue (Resolve Validation Rules):
                </h4>
                <ul className="text-xs text-rose-700 mt-1 list-disc list-inside space-y-0.5 font-medium">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section 1: Auto-populated MR & Issue Header */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Building2 className="size-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Material Requisition & Issue Header
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {activeMR ? "Auto-populated from selected MR" : "Select an approved MR below"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Select MR Dropdown */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Material Requisition ID *
                </label>
                <select
                  disabled={isViewMode}
                  value={selectedMRId}
                  onChange={(e) => setSelectedMRId(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-mono font-bold text-blue-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="">-- Choose Approved MR --</option>
                  {approvedMRs.map((mr) => (
                    <option key={mr.id} value={mr.id}>
                      {mr.mrNumber} — {mr.department} ({mr.requestedBy})
                    </option>
                  ))}
                </select>
              </div>

              {/* Organization */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeMR?.organization || "Pakiza Knit Composite Ltd"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600 cursor-not-allowed outline-none"
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Department
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeMR?.department || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-800 cursor-not-allowed outline-none"
                />
              </div>

              {/* Requested By / Issued To */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Requested By (Issued To)
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeMR?.requestedBy || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 cursor-not-allowed outline-none"
                />
              </div>

              {/* Required Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  MR Required Date
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeMR?.requiredDate || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-mono text-slate-600 cursor-not-allowed outline-none"
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Issue Date *
                </label>
                <input
                  type="date"
                  disabled={isViewMode}
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed"
                />
              </div>

              {/* Remarks Field under Material Requisition & Issue Header Section */}
              <div className="sm:col-span-2 md:col-span-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Remarks / Dispatch Notes
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  placeholder="Enter overall dispatch remarks or notes..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Items Details & Live Quantities */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="size-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Issue Items & Validation Matrix
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-3 px-3 text-center w-10">SL</th>
                    <th className="py-3 px-3">Item Code</th>
                    <th className="py-3 px-3">Item Name</th>
                    <th className="py-3 px-3">Issue Store</th>
                    <th className="py-3 px-3 text-center w-16">UOM</th>
                    <th className="py-3 px-3 text-right w-24">Req QTY</th>
                    <th className="py-3 px-3 text-right w-24">Prev Issued</th>
                    <th className="py-3 px-3 text-right w-28 text-amber-700">Rem. QTY</th>
                    <th className="py-3 px-3 text-right w-28 text-emerald-700">Cur. Stock</th>
                    <th className="py-3 px-3 text-right w-32 bg-indigo-50/60 font-black text-indigo-900">
                      Issue Quantity *
                    </th>
                    <th className="py-3 px-3 text-center w-28">Tracking (B/L)</th>
                    {!isViewMode && <th className="py-3 px-2 text-center w-12">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {issueItems.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-10 text-center text-slate-400">
                        No requisition items available. Please select an approved Material Requisition.
                      </td>
                    </tr>
                  ) : (
                    issueItems.map((item, idx) => {
                      const trackingMode = getItemTrackingMode(item.itemCode, catalogItems);
                      const maxPermitted = Math.min(item.remainingIssueQty, item.availableStock);
                      const isOverRemaining = item.issueQty > item.remainingIssueQty;
                      const isOverStock = item.issueQty > item.availableStock;
                      const hasError = isOverRemaining || isOverStock;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/70 transition-colors whitespace-nowrap"
                        >
                          <td className="py-3 px-3 text-center text-slate-400 font-mono text-[10px]">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-blue-600">
                            {item.itemCode}
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">
                            {item.itemName}
                          </td>
                          <td className="py-3 px-3">
                            {isViewMode ? (
                              <span className="font-semibold text-slate-800 text-[11px] whitespace-nowrap">
                                {item.issueStore || selectedIssueStore}
                              </span>
                            ) : (
                              <select
                                value={item.issueStore || selectedIssueStore}
                                onChange={(e) => handleItemStoreChange(item.id, e.target.value)}
                                className="h-7 text-[11px] rounded border border-slate-200 bg-white px-2 font-medium text-slate-700 outline-none focus:border-indigo-500"
                              >
                                {warehouses.map((w) => (
                                  <option key={w.id || w.name} value={w.name}>
                                    {w.name}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-slate-600">
                            {item.uom}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                            {item.mrRequestedQty.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-slate-500">
                            {item.previouslyIssuedQty.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-amber-600">
                            {item.remainingIssueQty.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                            {item.availableStock.toLocaleString()}
                          </td>

                          {/* Issue Quantity Input with Max Badge */}
                          <td className="py-3 px-3 text-right bg-indigo-50/30">
                            <div className="flex flex-col items-end gap-1">
                              {isViewMode ? (
                                <span className="font-mono font-bold text-xs text-indigo-900">
                                  {item.issueQty}
                                </span>
                              ) : (
                                <>
                                  <input
                                    type="number"
                                    min="0"
                                    max={maxPermitted}
                                    value={item.issueQty}
                                    onChange={(e) => handleIssueQtyChange(item.id, e.target.value)}
                                    className={`w-24 h-7 rounded border px-2 text-right font-mono font-bold text-xs outline-none transition-all ${
                                      hasError
                                        ? "border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20"
                                        : "border-indigo-300 bg-white text-indigo-900 focus:ring-2 focus:ring-indigo-500/20"
                                    }`}
                                  />
                                  <span className="text-[9.5px] font-semibold text-slate-400">
                                    Max: {maxPermitted}
                                  </span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Common Tracking Cell (Batch or Location mutually exclusive) */}
                          <td className="py-3 px-3 text-center">
                            <ItemTrackingCell
                              trackingMode={trackingMode}
                              mode={trackingMode}
                              batchAllocations={item.batchAllocations}
                              locationAllocations={item.locationAllocations}
                              onOpenModal={() => openTrackingModal(item)}
                              disabled={!isViewMode && item.issueQty === 0}
                            />
                          </td>

                          {/* Item-Level Delete Action (only when not in view mode) */}
                          {!isViewMode && (
                            <td className="py-3 px-2 text-center">
                              <button
                                type="button"
                                title="Remove item from current issue transaction"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
                <tfoot>
                  <tr className="bg-slate-50 border-t border-slate-200 text-slate-800 font-bold text-xs">
                    <td colSpan={5} className="py-3 px-3">
                      Total Items: <span className="font-mono text-indigo-600 font-bold">{issueItems.length}</span>
                    </td>
                    <td colSpan={4} className="py-3 px-3 text-right uppercase text-[10px] tracking-wider text-slate-500">
                      Total Issue Quantity:
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-indigo-600">
                      {totalIssueQuantity.toLocaleString()}
                    </td>
                    <td colSpan={isViewMode ? 1 : 2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Location Allocation Modal */}
        {activeTrackingItem && (
          <LocationAllocationModal
            isOpen={locationModalOpen}
            onClose={() => setLocationModalOpen(false)}
            storeName={activeTrackingItem.issueStore || activeMR?.warehouseStore || "Central Warehouse"}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            totalTransactionQty={activeTrackingItem.issueQty}
            readOnly={isViewMode}
            currentAllocations={
              activeTrackingItem.locationAllocations?.map((l, i) => ({
                id: String(i),
                locationName: l.locationName,
                quantity: l.quantity,
              })) || []
            }
            onSave={handleSaveLocationAllocations}
          />
        )}

        {/* Batch Allocation Modal */}
        {activeTrackingItem && (
          <BatchAllocationModal
            isOpen={batchModalOpen}
            onClose={() => setBatchModalOpen(false)}
            storeName={activeTrackingItem.issueStore || activeMR?.warehouseStore || "Central Warehouse"}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            totalTransactionQty={activeTrackingItem.issueQty}
            readOnly={isViewMode}
            currentAllocations={
              activeTrackingItem.batchAllocations?.map((b, i) => ({
                id: String(i),
                batchNumber: b.batchNumber,
                quantity: b.quantity,
              })) || []
            }
            onSave={handleSaveBatchAllocations}
          />
        )}

        {/* Preview Report Modal */}
        <StandardPreviewReportModal
          isOpen={previewReportOpen}
          onClose={() => setPreviewReportOpen(false)}
          data={previewReportData}
        />
      </main>
    </div>
  );
}
