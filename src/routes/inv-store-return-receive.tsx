import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  RotateCcw,
  ArrowLeft,
  Calendar,
  Building2,
  User,
  CheckCircle2,
  Printer,
  AlertTriangle,
  FileSpreadsheet,
  Package,
  Layers,
  ChevronDown,
  Info,
  Trash2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import {
  StoreReturn,
  getStoredStoreReturns,
  postStoreReturnReceive,
  getStoredStoreReturnReceives,
  StoreReturnReceive,
} from "@/lib/inventory-requisition-issue-data";
import { DEFAULT_WAREHOUSES, getStoredData } from "@/lib/procurement-master-data";
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

export const Route = createFileRoute("/inv-store-return-receive")({
  validateSearch: (search: Record<string, unknown>): {
    returnId?: string;
    receiveId?: string;
    mode?: "view" | "edit";
  } => ({
    returnId: search.returnId as string | undefined,
    receiveId: search.receiveId as string | undefined,
    mode: (search.mode as "view" | "edit" | undefined) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Store Return Receive — Inventory ERP" },
      {
        name: "description",
        content: "Inspect, verify, and receive returned materials back into inventory stock.",
      },
    ],
  }),
  component: StoreReturnReceivePage,
});

interface ReceiveItemRow {
  id: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  uom: string;
  returnedQty: number;
  receivedQty: number;
  receiveStore: string;
  condition: string;
  trackingMode: "Batch" | "Location" | "None";
  batchAllocations: BatchEntry[];
  locationAllocations: LocationEntry[];
  remarks: string;
}

function StoreReturnReceivePage() {
  const { returnId: searchReturnId, receiveId: searchReceiveId, mode: searchMode } = Route.useSearch();
  const navigate = useNavigate();

  const isViewMode = searchMode === "view";
  const isEditMode = searchMode === "edit";
  const isReadOnly = isViewMode;

  const allReturns = useMemo(() => getStoredStoreReturns(), []);
  const allReceives = useMemo(() => getStoredStoreReturnReceives(), []);
  const warehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);

  const existingReceiveRecord: StoreReturnReceive | null = useMemo(() => {
    if (!searchReceiveId) return null;
    return allReceives.find((r) => r.id === searchReceiveId || r.receiveNumber === searchReceiveId) || null;
  }, [allReceives, searchReceiveId]);

  // Selected Return ID (prioritize matching existing receive, then searchReturnId, then pending)
  const [selectedReturnId, setSelectedReturnId] = useState<string>(() => {
    if (existingReceiveRecord?.returnId) {
      return existingReceiveRecord.returnId;
    }
    if (searchReturnId && allReturns.some((r) => r.id === searchReturnId || r.returnNumber === searchReturnId)) {
      return searchReturnId;
    }
    const firstPending = allReturns.find((r) => r.status === "Pending Receive");
    return firstPending ? firstPending.id : allReturns[0]?.id || "";
  });

  const activeReturn: StoreReturn | undefined = useMemo(() => {
    return allReturns.find((r) => r.id === selectedReturnId || r.returnNumber === selectedReturnId);
  }, [allReturns, selectedReturnId]);

  // Form Fields
  const [receiveDate, setReceiveDate] = useState(() => {
    if (existingReceiveRecord?.receiveDate) return existingReceiveRecord.receiveDate;
    return new Date().toISOString().split("T")[0];
  });
  const [receivedBy, setReceivedBy] = useState(() => {
    if (existingReceiveRecord?.receivedBy) return existingReceiveRecord.receivedBy;
    return "Md. Tarek Rahman (Store In-Charge)";
  });
  const [generalRemarks, setGeneralRemarks] = useState(() => {
    if (existingReceiveRecord?.remarks) return existingReceiveRecord.remarks;
    return "";
  });

  // Items State
  const [items, setItems] = useState<ReceiveItemRow[]>([]);

  // Sync items when activeReturn changes or existingReceiveRecord is present
  useEffect(() => {
    if (existingReceiveRecord && existingReceiveRecord.items.length > 0) {
      const rows: ReceiveItemRow[] = existingReceiveRecord.items.map((it, index) => {
        const mode = getItemTrackingMode(it.itemCode);
        return {
          id: it.id || `ret-item-${index}`,
          sl: index + 1,
          itemCode: it.itemCode,
          itemName: it.itemName,
          specification: it.specification || "",
          uom: it.uom,
          returnedQty: Number(it.returnedQty) || 0,
          receivedQty: Number(it.receivedQty) || 0,
          receiveStore: it.receiveStore,
          condition: it.condition || "Good (Restock)",
          trackingMode: mode,
          batchAllocations: it.batchAllocations?.map((b) => ({ batchNumber: b.batchNumber, quantity: b.quantity })) || [],
          locationAllocations: it.locationAllocations?.map((l) => ({ locationName: l.locationName, quantity: l.quantity })) || [],
          remarks: it.remarks || "",
        };
      });
      setItems(rows);
      return;
    }

    if (!activeReturn) {
      setItems([]);
      return;
    }

    const rows: ReceiveItemRow[] = activeReturn.items.map((item, index) => {
      const mode = getItemTrackingMode(item.itemCode);
      const initialStore = item.returnStore || activeReturn.warehouseStore || warehouses[0]?.name || "Central Warehouse";
      
      return {
        id: item.id || `ret-item-${index}`,
        sl: index + 1,
        itemCode: item.itemCode,
        itemName: item.itemName,
        specification: item.specification || "",
        uom: item.uom,
        returnedQty: Number(item.returnQty) || 0,
        // Default received qty to returnedQty
        receivedQty: Number(item.returnQty) || 0,
        receiveStore: initialStore,
        condition: item.returnCondition || "Good (Restock)",
        trackingMode: mode,
        batchAllocations:
          item.batchAllocations?.map((b) => ({
            batchNumber: b.batchNumber,
            quantity: b.quantity,
          })) || [],
        locationAllocations:
          item.locationAllocations?.map((l) => ({
            locationName: l.locationName,
            quantity: l.quantity,
          })) || [],
        remarks: item.remarks || "",
      };
    });

    setItems(rows);
  }, [activeReturn, existingReceiveRecord, warehouses]);

  // Modals for Tracking
  const [activeBatchItemId, setActiveBatchItemId] = useState<string | null>(null);
  const [activeLocationItemId, setActiveLocationItemId] = useState<string | null>(null);

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);

  // Handle Item Row changes
  const handleItemQtyChange = (id: string, rawVal: string) => {
    const val = parseFloat(rawVal);
    setItems((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          if (isNaN(val) || val < 0) {
            return { ...row, receivedQty: 0 };
          }
          // Clamped to returnedQty
          const clamped = Math.min(val, row.returnedQty);
          return { ...row, receivedQty: clamped };
        }
        return row;
      })
    );
  };

  const handleItemStoreChange = (id: string, newStore: string) => {
    setItems((prev) =>
      prev.map((row) => (row.id === id ? { ...row, receiveStore: newStore } : row))
    );
  };

  const handleItemRemarksChange = (id: string, remarks: string) => {
    setItems((prev) =>
      prev.map((row) => (row.id === id ? { ...row, remarks } : row))
    );
  };

  // Summary Metrics
  const totalReturnedQty = useMemo(() => {
    return items.reduce((acc, row) => acc + (Number(row.returnedQty) || 0), 0);
  }, [items]);

  const totalReceivedQty = useMemo(() => {
    return items.reduce((acc, row) => acc + (Number(row.receivedQty) || 0), 0);
  }, [items]);

  // Validation Warnings
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    if (!activeReturn) {
      errs.push("No Return to Store record selected.");
      return errs;
    }
    if (activeReturn.status === "Received" && !isEditMode && !isViewMode) {
      errs.push(`This return (${activeReturn.returnNumber}) has already been fully received into store.`);
    }
    if (items.length === 0) {
      errs.push("No items found in this return record.");
    }
    if (totalReceivedQty <= 0) {
      errs.push("Total received quantity must be greater than zero.");
    }
    for (const it of items) {
      if (it.receivedQty > it.returnedQty) {
        errs.push(`Item ${it.itemCode}: Received Qty (${it.receivedQty}) cannot exceed Returned Qty (${it.returnedQty}).`);
      }
    }
    return errs;
  }, [activeReturn, items, totalReceivedQty, isEditMode, isViewMode]);

  // Save / Post Receive
  const handleConfirmReceive = () => {
    if (isReadOnly) return;
    if (validationErrors.length > 0 || !activeReturn) {
      toast.error(validationErrors[0] || "Validation failed");
      return;
    }

    const payloadItems = items.map((it) => ({
      itemCode: it.itemCode,
      receiveStore: it.receiveStore,
      receivedQty: it.receivedQty,
      condition: it.condition,
      batchAllocations: it.batchAllocations.length > 0 ? it.batchAllocations : undefined,
      locationAllocations: it.locationAllocations.length > 0 ? it.locationAllocations : undefined,
    }));

    postStoreReturnReceive(activeReturn.id, payloadItems, {
      receiveId: existingReceiveRecord?.id,
      receiveNumber: existingReceiveRecord?.receiveNumber,
      receiveDate,
      receivedBy,
      remarks: generalRemarks,
    });

    toast.success(
      isEditMode
        ? `Store Return Receive ${existingReceiveRecord?.receiveNumber || ""} updated successfully!`
        : `Store Return Receive completed! ${totalReceivedQty} units added back to active store inventory.`
    );

    navigate({ to: "/inv-store-return-receive-list" });
  };

  // Preview Note Data (CONDITION and REMARKS removed per Requirement 4.1)
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      companyName: "Pakiza Knit Composite Ltd",
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "STORE RETURN RECEIVE NOTE",
      reportNumber: existingReceiveRecord?.receiveNumber || `SRR-${activeReturn?.returnNumber || "NEW"}`,
      reportDate: receiveDate,
      statusBadge: "Verified & Received",
      metaFields: [
        { label: "Return Note No", value: activeReturn?.returnNumber || "-" },
        { label: "Original Issue ID", value: activeReturn?.issueNumber || "-" },
        { label: "Material Requisition ID", value: activeReturn?.mrNumber || "-" },
        { label: "Returned By", value: activeReturn?.issuedTo || "-" },
        { label: "Department", value: activeReturn?.department || "-" },
        { label: "Receiving Store", value: items[0]?.receiveStore || activeReturn?.warehouseStore || "-" },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "ITEM DESCRIPTION",
        "RECEIVE STORE",
        "UOM",
        "RETURNED",
        "RECEIVED",
      ],
      tableRows: items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.receiveStore,
        it.uom,
        String(it.returnedQty),
        String(it.receivedQty),
      ]),
      summaryCards: [
        { label: "Total Items", value: String(items.length) },
        { label: "Total Returned Qty", value: String(totalReturnedQty) },
        { label: "Total Received Qty", value: String(totalReceivedQty) },
      ],
      notes: [
        "Materials verified and restocked into warehouse inventory ledger.",
        "Store ledger balances updated immediately upon posting this receive note.",
      ],
      signatures: [
        { title: "Received By (Store In-Charge)", name: receivedBy, date: receiveDate },
        { title: "Store Manager Approval", name: "Operations Head", date: receiveDate },
      ],
    };
  }, [existingReceiveRecord, activeReturn, receiveDate, receivedBy, items, totalReturnedQty, totalReceivedQty]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <Link
                to="/inv-store-return-receive-list"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back to Store Return Receive List"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    Store Return Receive
                  </h1>
                  {existingReceiveRecord && (
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {existingReceiveRecord.receiveNumber}
                    </span>
                  )}
                  {activeReturn && (
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      Against {activeReturn.returnNumber}
                    </span>
                  )}
                  {isReadOnly ? (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300">
                      Read-Only View
                    </span>
                  ) : isEditMode ? (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Edit Mode
                    </span>
                  ) : activeReturn?.status ? (
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        activeReturn.status === "Received"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : activeReturn.status === "Pending Receive"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {activeReturn.status}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Inspect and verify returned materials from shop floor and restock into inventory
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
                Preview Note
              </button>

              {isReadOnly ? (
                <span className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                  Read-Only Mode
                </span>
              ) : isEditMode ? (
                <button
                  type="button"
                  onClick={handleConfirmReceive}
                  disabled={validationErrors.length > 0}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Save className="size-4" />
                  Update Store Return Receive
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmReceive}
                  disabled={validationErrors.length > 0}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="size-4" />
                  Confirm & Receive to Store
                </button>
              )}
            </div>
          </div>

          {/* Validation Banner */}
          {!isReadOnly && validationErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">
                  Cannot Complete Receive (Check the following):
                </h4>
                <ul className="text-xs text-rose-700 mt-1 list-disc list-inside space-y-0.5 font-medium">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Return Document Selection & Header Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <RotateCcw className="size-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Return Reference & Receiving Details
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                All return details auto-populated from Return to Store record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Select Return Record - Non-editable without dropdown per Requirement 3.1 */}
              <div className="xl:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Select Return Note ID *
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={activeReturn?.returnNumber || selectedReturnId || ""}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs font-bold text-slate-700 outline-none font-mono cursor-not-allowed select-none"
                />
              </div>

              {/* Material Issue ID */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Material Issue ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeReturn?.issueNumber || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-mono font-medium text-slate-700 cursor-not-allowed outline-none"
                />
              </div>

              {/* Material Requisition ID */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Material Requisition ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeReturn?.mrNumber || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-mono font-medium text-slate-700 cursor-not-allowed outline-none"
                />
              </div>

              {/* Return Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Return Date
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeReturn?.returnDate || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 cursor-not-allowed outline-none"
                />
              </div>

              {/* Returned By */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Returned By (Employee)
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeReturn?.issuedTo || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 cursor-not-allowed outline-none"
                />
              </div>

              {/* Return Store (Original) */}
              <div className="xl:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Return Store (Originating Warehouse)
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeReturn?.warehouseStore || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 cursor-not-allowed outline-none"
                />
              </div>

              {/* Receive Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Receive Date *
                </label>
                <input
                  type="date"
                  value={receiveDate}
                  disabled={isReadOnly}
                  onChange={(e) => setReceiveDate(e.target.value)}
                  className={`w-full h-9 rounded-lg border border-slate-200 px-3 text-xs font-medium outline-none ${
                    isReadOnly
                      ? "bg-slate-100 text-slate-600 cursor-not-allowed"
                      : "bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  }`}
                />
              </div>

              {/* Received By */}
              <div className="xl:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Store Receiving Officer
                </label>
                <input
                  type="text"
                  readOnly
                  value={receivedBy}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 cursor-not-allowed outline-none"
                />
              </div>

              {/* General Remarks */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Remarks / Notes
                </label>
                <input
                  type="text"
                  placeholder="Optional verification remarks..."
                  value={generalRemarks}
                  disabled={isReadOnly}
                  onChange={(e) => setGeneralRemarks(e.target.value)}
                  className={`w-full h-9 rounded-lg border border-slate-200 px-3 text-xs font-medium outline-none ${
                    isReadOnly
                      ? "bg-slate-100 text-slate-600 cursor-not-allowed"
                      : "bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section: Return Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="size-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Store Return Receive Items Table
                </h3>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 w-12 text-center">SL</th>
                      <th className="py-3 px-3 min-w-[130px]">Item Code</th>
                      <th className="py-3 px-3 min-w-[200px]">Item Name</th>
                      <th className="py-3 px-3 min-w-[180px]">Receive Store</th>
                      <th className="py-3 px-2 w-14 text-center">UOM</th>
                      <th className="py-3 px-3 w-24 text-right">Returned Qty</th>
                      <th className="py-3 px-3 w-28 text-right">Received Qty *</th>
                      <th className="py-3 px-3 w-28 text-center">Tracking (B/L)</th>
                      {!isReadOnly && <th className="py-3 px-3 text-center w-16">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={isReadOnly ? 8 : 9} className="py-8 text-center text-slate-400">
                          No items loaded. Please select a valid Return to Store record.
                        </td>
                      </tr>
                    ) : (
                      items.map((row) => {
                        const isExceeded = row.receivedQty > row.returnedQty;
                        return (
                          <tr
                            key={row.id}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isExceeded ? "bg-rose-50/50" : ""
                            }`}
                          >
                            {/* SL */}
                            <td className="py-3 px-3 text-center font-medium text-slate-500">
                              {row.sl}
                            </td>

                            {/* Item Code */}
                            <td className="py-3 px-3">
                              <span className="font-mono font-bold text-slate-800">
                                {row.itemCode}
                              </span>
                            </td>

                            {/* Item Name */}
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-800">{row.itemName}</div>
                              {row.specification && (
                                <div className="text-[11px] text-slate-400 line-clamp-1">
                                  {row.specification}
                                </div>
                              )}
                            </td>

                            {/* Receive Store */}
                            <td className="py-3 px-3">
                              {isReadOnly ? (
                                <span className="font-medium text-slate-700">{row.receiveStore}</span>
                              ) : (
                                <select
                                  value={row.receiveStore}
                                  onChange={(e) => handleItemStoreChange(row.id, e.target.value)}
                                  className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                >
                                  {warehouses.map((w: any) => (
                                    <option key={w.id} value={w.name}>
                                      {w.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </td>

                            {/* UOM */}
                            <td className="py-3 px-2 text-center">
                              <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-600 font-bold">
                                {row.uom}
                              </span>
                            </td>

                            {/* Returned Qty */}
                            <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                              {row.returnedQty}
                            </td>

                            {/* Received Qty (Input) */}
                            <td className="py-3 px-3 text-right">
                              {isReadOnly ? (
                                <span className="font-mono font-bold text-emerald-700 text-xs">
                                  {row.receivedQty}
                                </span>
                              ) : (
                                <input
                                  type="number"
                                  min={0}
                                  max={row.returnedQty}
                                  step="any"
                                  value={row.receivedQty}
                                  onChange={(e) => handleItemQtyChange(row.id, e.target.value)}
                                  className={`w-24 h-8 px-2.5 rounded-lg border text-right font-mono font-bold text-xs focus:ring-2 outline-none transition-colors ${
                                    isExceeded
                                      ? "border-rose-400 bg-rose-50 text-rose-700 focus:ring-rose-500/20"
                                      : "border-slate-200 bg-white text-slate-800 focus:ring-emerald-500/20 focus:border-emerald-500"
                                  }`}
                                />
                              )}
                            </td>

                            {/* Tracking Cell (B or L strictly based on Item Master) */}
                            <td className="py-3 px-3 text-center">
                              <ItemTrackingCell
                                trackingMode={row.trackingMode}
                                batchCount={row.batchAllocations.length}
                                locationCount={row.locationAllocations.length}
                                onOpenBatch={() => !isReadOnly && setActiveBatchItemId(row.id)}
                                onOpenLocation={() => !isReadOnly && setActiveLocationItemId(row.id)}
                              />
                            </td>

                            {/* Delete Action (Hidden in Read-Only Mode) */}
                            {!isReadOnly && (
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  title="Remove item from current receiving operation"
                                  onClick={() => {
                                    setItems((prev) => prev.filter((it) => it.id !== row.id));
                                    toast.info(`Removed ${row.itemName} from current receive operation.`);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
                  {items.length > 0 && (
                    <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-200 text-slate-800">
                      <tr>
                        <td colSpan={5} className="py-3 px-3 text-slate-600">
                          Total Items: <span className="font-mono text-slate-900">{items.length}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">
                          {totalReturnedQty}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-700">
                          {totalReceivedQty}
                        </td>
                        <td colSpan={isReadOnly ? 1 : 2} className="py-3 px-3 text-right text-emerald-800 font-mono text-[11px]">
                          Total Received: <span className="font-bold">{totalReceivedQty} {items[0]?.uom || "PCS"}</span>
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            {/* Receive Summary Card */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500">
                Receive Summary Overview
              </span>
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Total Items: </span>
                  <span className="font-bold text-slate-900 font-mono">{items.length}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Total Received: </span>
                  <span className="font-bold text-emerald-700 font-mono">
                    {totalReceivedQty} {items[0]?.uom || "PCS"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Allocation Modal */}
        {activeLocationItemId && (() => {
          const item = items.find((i) => i.id === activeLocationItemId);
          if (!item) return null;
          return (
            <LocationAllocationModal
              isOpen={true}
              onClose={() => setActiveLocationItemId(null)}
              itemName={item.itemName}
              itemCode={item.itemCode}
              transactionQty={item.receivedQty}
              uom={item.uom}
              currentStore={item.receiveStore}
              initialEntries={item.locationAllocations}
              onSave={(entries) => {
                setItems((prev) =>
                  prev.map((i) => (i.id === item.id ? { ...i, locationAllocations: entries } : i))
                );
                setActiveLocationItemId(null);
                toast.success(`Assigned store locations for ${item.itemName}`);
              }}
            />
          );
        })()}

        {/* Batch Allocation Modal */}
        {activeBatchItemId && (() => {
          const item = items.find((i) => i.id === activeBatchItemId);
          if (!item) return null;
          return (
            <BatchAllocationModal
              isOpen={true}
              onClose={() => setActiveBatchItemId(null)}
              itemName={item.itemName}
              itemCode={item.itemCode}
              transactionQty={item.receivedQty}
              uom={item.uom}
              currentStore={item.receiveStore}
              initialEntries={item.batchAllocations}
              onSave={(entries) => {
                setItems((prev) =>
                  prev.map((i) => (i.id === item.id ? { ...i, batchAllocations: entries } : i))
                );
                setActiveBatchItemId(null);
                toast.success(`Assigned batches for ${item.itemName}`);
              }}
            />
          );
        })()}

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
