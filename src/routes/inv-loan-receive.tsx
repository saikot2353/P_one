import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  Inbox,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Printer,
  AlertTriangle,
  Building2,
  Package,
  Layers,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  StockLoanIssue,
  StockLoanReceipt,
  StockLoanReceiptItem,
  getStoredStockLoanIssues,
  getStoredStockLoanReceipts,
  saveStockLoanReceipt,
} from "@/lib/inventory-stock-loan-data";
import {
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

export const Route = createFileRoute("/inv-loan-receive")({
  validateSearch: (search: Record<string, unknown>): { loanIssueId?: string; receiveId?: string; mode?: string } => ({
    loanIssueId: search.loanIssueId as string | undefined,
    receiveId: search.receiveId as string | undefined,
    mode: search.mode as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "New Loan Receipt Entry — Inventory ERP" },
      {
        name: "description",
        content: "Acknowledge received inter-company loans, verify accepted quantities, and allocate destination bins.",
      },
    ],
  }),
  component: StockLoanReceiptFormPage,
});

function StockLoanReceiptFormPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const isViewMode = searchParams.mode === "view";
  const catalogItems = getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS);

  const loans = useMemo(() => getStoredStockLoanIssues(), []);
  const storedReceives = useMemo(() => getStoredStockLoanReceipts(), []);

  // Find matching existing receive if in view mode or receiveId given
  const existingReceive = useMemo(() => {
    if (searchParams.receiveId) {
      return storedReceives.find((r) => r.receiveId === searchParams.receiveId || r.id === searchParams.receiveId) || null;
    }
    if (searchParams.loanIssueId && isViewMode) {
      return storedReceives.find((r) => r.loanIssueReferenceId === searchParams.loanIssueId || r.loanIssueId === searchParams.loanIssueId) || null;
    }
    return null;
  }, [searchParams.receiveId, searchParams.loanIssueId, isViewMode, storedReceives]);

  // Eligible loans (Dispatched or Submitted)
  const eligibleLoans = useMemo(() => {
    return loans.filter((t) => t.status === "Dispatched" || t.status === "Submitted");
  }, [loans]);

  // Selected Loan
  const [selectedLoanId, setSelectedLoanId] = useState<string>(() => {
    if (existingReceive) return existingReceive.loanIssueId || existingReceive.loanIssueReferenceId;
    if (searchParams.loanIssueId) return searchParams.loanIssueId;
    return eligibleLoans[0]?.id || "";
  });

  const activeLoan: StockLoanIssue | null = useMemo(() => {
    return (
      loans.find(
        (t) => t.id === selectedLoanId || t.loanIssueId === selectedLoanId
      ) || null
    );
  }, [loans, selectedLoanId]);

  // Form Header State
  const [receiveId] = useState<string>(() => {
    if (existingReceive) return existingReceive.receiveId;
    return `ICTR-2026-${String(Math.floor(100 + Math.random() * 900))}`;
  });
  const [receiveDate, setReceiveDate] = useState<string>(() => {
    if (existingReceive) return existingReceive.receiveDate;
    return new Date().toISOString().slice(0, 10);
  });
  const [receivedBy] = useState<string>(() => {
    if (existingReceive) return existingReceive.receivedBy;
    return "Sohanur Rahman Sohan (Store Receiving Officer)";
  });
  const [generalRemarks, setGeneralRemarks] = useState<string>(() => {
    if (existingReceive) return existingReceive.remarks || "";
    return "";
  });

  // Items State (loaded from existingReceive or activeLoan)
  const [receiveItems, setReceiveItems] = useState<StockLoanReceiptItem[]>(() => {
    if (existingReceive && existingReceive.items) {
      return existingReceive.items;
    }
    return [];
  });

  useEffect(() => {
    if (existingReceive && existingReceive.items && existingReceive.items.length > 0) {
      setReceiveItems(existingReceive.items);
      return;
    }
    if (activeLoan) {
      const mapped: StockLoanReceiptItem[] = activeLoan.items.map((it, idx) => ({
        id: `ictr-it-${Date.now()}-${idx}`,
        loanItemId: it.id,
        sl: idx + 1,
        itemCode: it.itemCode,
        itemName: it.itemName,
        specification: it.specification,
        brand: it.brand,
        origin: it.origin,
        uom: it.uom,
        dispatchedQty: it.loanQty,
        receivedQty: it.loanQty,
        acceptedQty: it.loanQty,
        shortageDamagedQty: 0,
        unitPrice: it.unitPrice,
        batchAllocations: it.batchAllocations || [],
        locationAllocations: it.locationAllocations || [],
        remarks: "",
      }));
      setReceiveItems(mapped);
    } else {
      setReceiveItems([]);
    }
  }, [activeLoan, existingReceive]);

  // Modals for Destination Batch/Location
  const [activeTrackingItemId, setActiveTrackingItemId] = useState<string | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  const activeTrackingItem = useMemo(() => {
    return receiveItems.find((i) => i.id === activeTrackingItemId) || null;
  }, [receiveItems, activeTrackingItemId]);

  const openTrackingModal = (item: StockLoanReceiptItem) => {
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
    setReceiveItems((prev) =>
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
    toast.success("Destination location allocation updated.");
  };

  const handleSaveBatchAllocations = (allocations: BatchEntry[]) => {
    if (!activeTrackingItemId) return;
    setReceiveItems((prev) =>
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
    toast.success("Destination batch allocation updated.");
  };

  // Item Table Manipulation
  const handleItemQtyChange = (
    id: string,
    field: "receivedQty" | "acceptedQty" | "remarks",
    value: string
  ) => {
    setReceiveItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === "receivedQty") {
          const rcv = Math.max(0, parseFloat(value) || 0);
          const accepted = Math.min(item.acceptedQty, rcv);
          const shortage = Math.max(0, rcv - accepted);
          return {
            ...item,
            receivedQty: rcv,
            acceptedQty: accepted,
            shortageDamagedQty: shortage,
          };
        }

        if (field === "acceptedQty") {
          const acc = Math.max(0, parseFloat(value) || 0);
          const shortage = Math.max(0, item.receivedQty - acc);
          return {
            ...item,
            acceptedQty: acc,
            shortageDamagedQty: shortage,
          };
        }

        if (field === "remarks") {
          return { ...item, remarks: value };
        }

        return item;
      })
    );
  };

  // Item-level remove (does not delete original loan item)
  const handleDeleteItem = (id: string) => {
    setReceiveItems((prev) => prev.filter((i) => i.id !== id));
    toast.info("Item removed from current receiving operation.");
  };

  // Totals
  const totalDispatched = useMemo(() => {
    return receiveItems.reduce((acc, it) => acc + (Number(it.dispatchedQty) || 0), 0);
  }, [receiveItems]);

  const totalReceived = useMemo(() => {
    return receiveItems.reduce((acc, it) => acc + (Number(it.receivedQty) || 0), 0);
  }, [receiveItems]);

  const totalAccepted = useMemo(() => {
    return receiveItems.reduce((acc, it) => acc + (Number(it.acceptedQty) || 0), 0);
  }, [receiveItems]);

  const totalVariance = useMemo(() => {
    return receiveItems.reduce((acc, it) => acc + (Number(it.shortageDamagedQty) || 0), 0);
  }, [receiveItems]);

  // Validation
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    if (!activeLoan) {
      errs.push("No Inter-Company Loan record selected.");
      return errs;
    }
    if (receiveItems.length === 0) {
      errs.push("No items loaded for receiving.");
    }
    if (totalAccepted <= 0) {
      errs.push("Total accepted quantity must be greater than zero.");
    }

    receiveItems.forEach((it) => {
      if (it.acceptedQty > it.receivedQty) {
        errs.push(`${it.itemName}: Accepted Qty cannot exceed Received Qty.`);
      }
    });

    return errs;
  }, [activeLoan, receiveItems, totalAccepted]);

  // Post Receive
  const handlePostReceive = () => {
    if (validationErrors.length > 0 || !activeLoan) {
      toast.error(validationErrors[0] || "Validation failed");
      return;
    }

    const isFull = totalAccepted === totalDispatched;
    const receiveStatus = isFull ? "Fully Received" : "Partially Received";

    const payload: StockLoanReceipt = {
      id: `ictr-${Date.now()}`,
      receiveId,
      receiveDate,
      loanIssueId: activeLoan.id,
      loanIssueReferenceId: activeLoan.loanIssueId,
      issueDate: activeLoan.issueDate,
      dispatchDate: activeLoan.dispatchDate || activeLoan.issueDate,
      fromCompany: activeLoan.fromCompany,
      fromStore: activeLoan.fromStore,
      toCompany: activeLoan.toCompany,
      toStore: activeLoan.toStore,
      receivedBy,
      remarks: generalRemarks,
      totalItems: receiveItems.length,
      totalDispatchedQty: totalDispatched,
      totalReceivedQty: totalReceived,
      totalAcceptedQty: totalAccepted,
      totalShortageDamagedQty: totalVariance,
      totalVarianceQty: totalVariance,
      status: receiveStatus,
      items: receiveItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveStockLoanReceipt(payload);

    toast.success(
      `Loan Receive ${receiveId} confirmed! ${totalAccepted} units stocked into ${activeLoan.toStore}.`
    );

    navigate({ to: "/inv-loan-receive-list" });
  };

  // Preview Note State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      reportType: "stock-loan-receipt",
      reportTitle: "Official Preview Report - Loan Receipt against Issue",
      title: "Loan Receipt against Issue",
      companyName: activeLoan?.toCompany || "Pakiza Spinning Mills Ltd",
      reportNumber: receiveId,
      reportDate: receiveDate,
      statusBadge: "Verified & Accepted",
      metaFields: [
        { label: "Receive ID", value: receiveId },
        { label: "Loan Ref ID", value: activeLoan?.loanIssueId || "-" },
        { label: "Loan Date", value: activeLoan?.issueDate || "-" },
        { label: "Dispatched From", value: `${activeLoan?.fromCompany} (${activeLoan?.fromStore})` },
        { label: "Destination Entity", value: `${activeLoan?.toCompany} (${activeLoan?.toStore})` },
        { label: "Receiving Officer", value: receivedBy },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "DESCRIPTION",
        "UOM",
        "DISPATCHED",
        "RECEIVED",
        "ACCEPTED",
        "SHORT / DAMAGED",
      ],
      tableRows: receiveItems.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        String(it.dispatchedQty),
        String(it.receivedQty),
        String(it.acceptedQty),
        String(it.shortageDamagedQty),
      ]),
      summaryCards: [
        { label: "Total Items", value: String(receiveItems.length) },
        { label: "Total Accepted", value: `${totalAccepted} units` },
        { label: "Total Discrepancy", value: `${totalVariance} units` },
      ],
      notes: [
        `Materials accepted into ${activeLoan?.toStore} active store ledger.`,
        "Quality and discrepancy observations recorded on goods receipt note.",
      ],
      signatures: [
        { title: "Receiving Officer", name: receivedBy, date: receiveDate },
        { title: "QA Inspector", name: "Quality Assurance Executive", date: receiveDate },
        { title: "Store In-Charge", name: "Warehouse Store Manager", date: receiveDate },
      ],
    };
  }, [
    activeLoan,
    receiveId,
    receiveDate,
    receivedBy,
    receiveItems,
    totalAccepted,
    totalVariance,
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
                to="/inv-loan-receive-list"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back to Receives List"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    New Loan Receipt Entry
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {receiveId}
                  </span>
                  {activeLoan && (
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Against {activeLoan.loanIssueId}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Inspect incoming loan shipments, accept undamaged units, and update destination inventory
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
                Preview IC-GRN
              </button>

              {isViewMode ? (
                <button
                  type="button"
                  onClick={() => navigate({ to: "/inv-loan-receive-list" })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to List
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePostReceive}
                  disabled={validationErrors.length > 0}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="size-3.5" />
                  Confirm & Stock In
                </button>
              )}
            </div>
          </div>

          {/* Validation Notice */}
          {validationErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">Cannot Confirm Receive (Errors):</h4>
                <ul className="text-xs text-rose-700 mt-1 list-disc list-inside space-y-0.5 font-medium">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section 1: Loan Reference & Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Inbox className="size-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Loan Reference & Receiving Details
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Data auto-loaded from dispatched Loan Challan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Loan Issue ID */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Loan Issue ID
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={activeLoan?.loanIssueId || activeLoan?.loanId || selectedLoanId || "—"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs font-mono font-bold text-indigo-700 outline-none cursor-not-allowed"
                />
              </div>

              {/* Loan Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Loan Date
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeLoan?.issueDate || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none cursor-not-allowed"
                />
              </div>

              {/* Receive Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Receive Date *
                </label>
                <input
                  type="date"
                  disabled={isViewMode}
                  value={receiveDate}
                  onChange={(e) => setReceiveDate(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Receiving Officer (Non-editable) */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Store Receiving Officer
                </label>
                <input
                  type="text"
                  readOnly
                  value={receivedBy}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none cursor-not-allowed"
                />
              </div>

              {/* Source Entity Info */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
                <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Originating (From) Entity
                </div>
                <div className="font-bold text-slate-800 text-xs">{activeLoan?.fromCompany || "-"}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{activeLoan?.fromStore || "-"}</div>
              </div>

              {/* Destination Entity Info */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
                <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Receiving (To) Entity & Store
                </div>
                <div className="font-bold text-slate-800 text-xs">{activeLoan?.toCompany || "-"}</div>
                <div className="text-emerald-700 font-semibold text-[11px] mt-0.5">{activeLoan?.toStore || "-"}</div>
              </div>

              {/* General Remarks */}
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Receive Verification Remarks
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  placeholder="Gate pass number, carrier truck inspection, damage observations..."
                  value={generalRemarks}
                  onChange={(e) => setGeneralRemarks(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="size-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Consignment Items & Destination Tracking
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  Total Items: {receiveItems.length}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Accepted Qty: {totalAccepted}
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[460px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200 whitespace-nowrap">
                    <tr>
                      <th className="py-3 px-3 text-center w-10">SL</th>
                      <th className="py-3 px-3 min-w-[180px]">Item Description & Code</th>
                      <th className="py-3 px-3 min-w-[130px]">Specification</th>
                      <th className="py-3 px-3 min-w-[110px]">Brand / Origin</th>
                      <th className="py-3 px-2 text-center w-14">UOM</th>
                      <th className="py-3 px-3 text-right w-24">Dispatched</th>
                      <th className="py-3 px-3 text-right w-28 bg-slate-50">Received Qty *</th>
                      <th className="py-3 px-3 text-right w-28 bg-emerald-50/60 text-emerald-900 font-black">
                        Accepted Qty *
                      </th>
                      <th className="py-3 px-3 text-right w-24 text-rose-600">Damage / Short</th>
                      <th className="py-3 px-3 text-center w-28">Tracking (B/L)</th>
                      {!isViewMode && <th className="py-3 px-2 text-center w-12">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {receiveItems.length === 0 ? (
                      <tr>
                        <td colSpan={isViewMode ? 10 : 11} className="py-8 text-center text-slate-400">
                          No items loaded. Please select an eligible loan above.
                        </td>
                      </tr>
                    ) : (
                      receiveItems.map((row) => {
                        const trackingMode = getItemTrackingMode(row.itemCode, catalogItems);
                        const isAcceptedOverReceived = row.acceptedQty > row.receivedQty;

                        return (
                          <tr
                            key={row.id}
                            className={`hover:bg-slate-50/80 transition-colors whitespace-nowrap ${
                              isAcceptedOverReceived ? "bg-rose-50/50" : ""
                            }`}
                          >
                            <td className="py-3 px-3 text-center font-mono text-slate-400 text-[10px]">
                              {row.sl}
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-800">{row.itemName}</div>
                              <div className="font-mono text-[10.5px] text-blue-600">{row.itemCode}</div>
                            </td>

                            <td className="py-3 px-3 text-slate-500 max-w-[170px] truncate" title={row.specification}>
                              {row.specification || "-"}
                            </td>

                            <td className="py-3 px-3 text-slate-600">
                              {row.brand} / {row.origin}
                            </td>

                            <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-600">
                              {row.uom}
                            </td>

                            <td className="py-3 px-3 text-right font-mono font-bold text-slate-600">
                              {row.dispatchedQty.toLocaleString()}
                            </td>

                            {/* Received Qty */}
                            <td className="py-3 px-3 text-right bg-slate-50/40">
                              {isViewMode ? (
                                <span className="font-mono font-bold text-slate-800 text-xs">
                                  {row.receivedQty.toLocaleString()}
                                </span>
                              ) : (
                                <input
                                  type="number"
                                  min="0"
                                  value={row.receivedQty}
                                  onChange={(e) =>
                                    handleItemQtyChange(row.id, "receivedQty", e.target.value)
                                  }
                                  className="w-20 h-8 px-2 text-right font-mono font-bold text-xs rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                              )}
                            </td>

                            {/* Accepted Qty */}
                            <td className="py-3 px-3 text-right bg-emerald-50/20">
                              {isViewMode ? (
                                <span className="font-mono font-bold text-emerald-900 text-xs">
                                  {row.acceptedQty.toLocaleString()}
                                </span>
                              ) : (
                                <input
                                  type="number"
                                  min="0"
                                  max={row.receivedQty}
                                  value={row.acceptedQty}
                                  onChange={(e) =>
                                    handleItemQtyChange(row.id, "acceptedQty", e.target.value)
                                  }
                                  className={`w-20 h-8 px-2 text-right font-mono font-bold text-xs rounded-lg border outline-none ${
                                    isAcceptedOverReceived
                                      ? "border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20"
                                      : "border-emerald-300 bg-white text-emerald-900 focus:ring-1 focus:ring-emerald-500"
                                  }`}
                                />
                              )}
                            </td>

                            {/* Short / Damaged Qty */}
                            <td className="py-3 px-3 text-right font-mono font-bold text-rose-600">
                              {row.shortageDamagedQty.toLocaleString()}
                            </td>

                            {/* Tracking Cell */}
                            <td className="py-3 px-3 text-center">
                              <ItemTrackingCell
                                trackingMode={trackingMode}
                                mode={trackingMode}
                                batchAllocations={row.batchAllocations}
                                locationAllocations={row.locationAllocations}
                                onOpenModal={() => openTrackingModal(row)}
                              />
                            </td>

                            {/* Item-level delete without altering original loan */}
                            {!isViewMode && (
                              <td className="py-3 px-2 text-center">
                                <button
                                  type="button"
                                  title="Omit from this receive consignment"
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
                Consignment Verification Metrics
              </span>
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Dispatched: </span>
                  <span className="font-bold text-slate-800 font-mono">{totalDispatched.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Received: </span>
                  <span className="font-bold text-slate-800 font-mono">{totalReceived.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Accepted: </span>
                  <span className="font-bold text-emerald-700 font-mono">{totalAccepted.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Short / Damage: </span>
                  <span className="font-bold text-rose-600 font-mono">{totalVariance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Modal */}
        {locationModalOpen && activeTrackingItem && activeLoan && (
          <LocationAllocationModal
            isOpen={true}
            onClose={() => setLocationModalOpen(false)}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            transactionQty={activeTrackingItem.acceptedQty}
            uom={activeTrackingItem.uom}
            readOnly={isViewMode}
            currentStore={activeLoan.toStore}
            initialEntries={activeTrackingItem.locationAllocations}
            onSave={handleSaveLocationAllocations}
          />
        )}

        {/* Batch Modal */}
        {batchModalOpen && activeTrackingItem && activeLoan && (
          <BatchAllocationModal
            isOpen={true}
            onClose={() => setBatchModalOpen(false)}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            transactionQty={activeTrackingItem.acceptedQty}
            uom={activeTrackingItem.uom}
            readOnly={isViewMode}
            currentStore={activeLoan.toStore}
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
      </main>
    </div>
  );
}
