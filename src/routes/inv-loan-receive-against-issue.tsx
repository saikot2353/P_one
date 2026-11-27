// src/routes/inv-loan-receive-against-issue.tsx
import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  Inbox,
  ArrowLeft,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  Package,
  X,
  FileCheck2,
  Printer,
  Save,
  Send,
  AlertTriangle,
  Info,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  LoanReceiveAgainstIssue,
  LoanReceiveAgainstIssueItem,
  LoanIssueAgainstReceive,
  getStoredLoanReceiveAgainstIssue,
  saveStoredLoanReceiveAgainstIssue,
  getStoredLoanIssueAgainstReceive,
} from "@/lib/inventory-stock-loan-data";
import { MASTER_COMPANIES } from "@/lib/inventory-stock-management-data";
import { getItemTrackingMode } from "@/lib/item-tracking-utils";
import {
  LocationAllocationModal,
  BatchAllocationModal,
  ItemTrackingCell,
  LocationEntry,
  BatchEntry,
} from "@/components/inventory/ItemBatchLocationModals";
import {
  DEFAULT_ITEMS,
  DEFAULT_WAREHOUSES,
  ItemProductMaster,
  getStoredData,
} from "@/lib/procurement-master-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-loan-receive-against-issue")({
  validateSearch: (search: Record<string, unknown>): {
    loanIssueId?: string;
    receiveId?: string;
    mode?: string;
  } => ({
    loanIssueId: search.loanIssueId as string | undefined,
    receiveId: search.receiveId as string | undefined,
    mode: search.mode as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Loan Receive Against Issue Entry — Inventory ERP" },
      {
        name: "description",
        content: "Acknowledge received items from loan issue returns, record batch/location allocation, and update destination inventory.",
      },
    ],
  }),
  component: LoanReceiveAgainstIssuePage,
});

export default function LoanReceiveAgainstIssuePage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const isViewMode = search.mode === "view";

  const allLoanIssues = useMemo(() => getStoredLoanIssueAgainstReceive(), []);
  const allReceives = useMemo(() => getStoredLoanReceiveAgainstIssue(), []);
  const catalogItems = useMemo(
    () => getStoredData<ItemProductMaster[]>("cripton_master_item_creation", DEFAULT_ITEMS),
    []
  );

  // Form State (Receive No is preserved in state for record and reports, but removed from visible form per Section 16.1)
  const [receiveNo, setReceiveNo] = useState(
    `LRAI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [receiveDate, setReceiveDate] = useState(new Date().toISOString().slice(0, 10));

  // Selected Loan Issue Source
  const [selectedIssue, setSelectedIssue] = useState<LoanIssueAgainstReceive | null>(null);

  // Header Metadata
  const [issuingCompany, setIssuingCompany] = useState("");
  const [issuingStore, setIssuingStore] = useState("");
  const [receivingCompany, setReceivingCompany] = useState("");
  const [receivingStore, setReceivingStore] = useState("");
  const [receivedBy, setReceivedBy] = useState("Kazi Moniruzzaman");
  const [remarks, setRemarks] = useState("");

  // Items State
  const [items, setItems] = useState<LoanReceiveAgainstIssueItem[]>([]);

  // Tracking Modals
  const [activeBatchItem, setActiveBatchItem] = useState<LoanReceiveAgainstIssueItem | null>(null);
  const [activeLocationItem, setActiveLocationItem] = useState<LoanReceiveAgainstIssueItem | null>(null);

  // Preview Report State
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Auto-populate when loanIssueId is provided
  useEffect(() => {
    if (search.loanIssueId) {
      const match = allLoanIssues.find((li) => li.id === search.loanIssueId || li.issueNo === search.loanIssueId);
      if (match) {
        setSelectedIssue(match);
        setIssuingCompany(match.issuingCompany);
        setIssuingStore(match.issuingStore);
        setReceivingCompany(match.receivingCompany);
        setReceivingStore(match.receivingStore);

        // Check if existing partial receive exists
        const existingRec = allReceives.find((r) => r.loanIssueId === match.id);

        const mapped: LoanReceiveAgainstIssueItem[] = match.items.map((it, idx) => {
          const prevReceived = existingRec
            ? existingRec.items.find((ei) => ei.issueItemId === it.id)?.currentReceiveQty || 0
            : 0;
          const remaining = Math.max(0, it.issueQty - prevReceived);

          return {
            id: `lrai-item-${Date.now()}-${idx}`,
            issueItemId: it.id,
            sl: idx + 1,
            itemCode: it.itemCode,
            itemName: it.itemName,
            specification: it.specification,
            brand: it.brand,
            origin: it.origin,
            uom: it.uom,
            issuedQty: it.issueQty,
            previouslyReceivedQty: prevReceived,
            currentReceiveQty: remaining,
            remainingQty: 0,
            acceptedQty: remaining,
            rejectedQty: 0,
            damageShortQty: 0,
            unitPrice: it.unitPrice,
            batchAllocations: it.batchAllocations,
            locationAllocations: it.locationAllocations,
          };
        });

        setItems(mapped);
      }
    } else if (search.receiveId) {
      const existing = allReceives.find((r) => r.id === search.receiveId);
      if (existing) {
        setReceiveNo(existing.receiveNo);
        setReceiveDate(existing.receiveDate);
        setIssuingCompany(existing.issuingCompany);
        setIssuingStore(existing.issuingStore);
        setReceivingCompany(existing.receivingCompany);
        setReceivingStore(existing.receivingStore);
        setReceivedBy(existing.receivedBy);
        setRemarks(existing.remarks || "");
        setItems(existing.items);

        const match = allLoanIssues.find((li) => li.id === existing.loanIssueId || li.issueNo === existing.loanIssueNo);
        if (match) setSelectedIssue(match);
      }
    } else if (allLoanIssues.length > 0) {
      // Default to first completed loan issue
      const firstIssue = allLoanIssues[0];
      setSelectedIssue(firstIssue);
      setIssuingCompany(firstIssue.issuingCompany);
      setIssuingStore(firstIssue.issuingStore);
      setReceivingCompany(firstIssue.receivingCompany);
      setReceivingStore(firstIssue.receivingStore);

      const mapped: LoanReceiveAgainstIssueItem[] = firstIssue.items.map((it, idx) => ({
        id: `lrai-item-${Date.now()}-${idx}`,
        issueItemId: it.id,
        sl: idx + 1,
        itemCode: it.itemCode,
        itemName: it.itemName,
        specification: it.specification,
        brand: it.brand,
        origin: it.origin,
        uom: it.uom,
        issuedQty: it.issueQty,
        previouslyReceivedQty: 0,
        currentReceiveQty: it.issueQty,
        remainingQty: 0,
        acceptedQty: it.issueQty,
        rejectedQty: 0,
        damageShortQty: 0,
        unitPrice: it.unitPrice,
        batchAllocations: it.batchAllocations,
        locationAllocations: it.locationAllocations,
      }));
      setItems(mapped);
    }
  }, [search.loanIssueId, search.receiveId, allLoanIssues, allReceives]);

  // Handle Receive Qty Change
  const handleReceiveQtyChange = (itemId: string, newQty: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const maxAllowed = it.issuedQty - it.previouslyReceivedQty;
        if (newQty > maxAllowed) {
          toast.error(`Receive quantity cannot exceed remaining balance (${maxAllowed} ${it.uom}).`);
          return it;
        }
        const validQty = Math.max(0, newQty);
        return {
          ...it,
          currentReceiveQty: validQty,
          remainingQty: Math.max(0, maxAllowed - validQty),
          acceptedQty: validQty,
        };
      })
    );
  };

  // Section 16.3: Handle Damage / Short Qty Change
  const handleDamageShortChange = (itemId: string, newQty: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          damageShortQty: Math.max(0, newQty),
          rejectedQty: Math.max(0, newQty),
        };
      })
    );
  };

  // Section 16.3: Handle Delete Row
  const handleDeleteRow = (itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
    toast.success("Row removed from consignment receiving.");
  };

  // Metrics
  const totalIssuedQty = useMemo(() => items.reduce((sum, it) => sum + (it.issuedQty || 0), 0), [items]);
  const totalReceivedQty = useMemo(
    () => items.reduce((sum, it) => sum + (it.currentReceiveQty || 0), 0),
    [items]
  );
  const totalDamageShortQty = useMemo(
    () => items.reduce((sum, it) => sum + (it.damageShortQty || 0), 0),
    [items]
  );

  const computedStatus = useMemo(() => {
    if (items.length === 0) return "Pending" as const;
    const allFull = items.every(
      (it) => it.currentReceiveQty + it.previouslyReceivedQty >= it.issuedQty
    );
    return allFull ? ("Complete" as const) : ("Partially Received" as const);
  }, [items]);

  // Save / Confirm
  const handleSave = () => {
    if (!selectedIssue) {
      toast.error("No Loan Issue selected.");
      return;
    }
    if (items.length === 0) {
      toast.error("No items to receive.");
      return;
    }
    if (totalReceivedQty <= 0 && totalDamageShortQty <= 0) {
      toast.error("Please enter a valid receive or damage/short quantity.");
      return;
    }

    const record: LoanReceiveAgainstIssue = {
      id: search.receiveId || `lrai-${Date.now()}`,
      receiveNo,
      receiveDate,
      loanIssueNo: selectedIssue.issueNo,
      loanIssueId: selectedIssue.id,
      issuingCompany,
      issuingStore,
      receivingCompany,
      receivingStore,
      status: computedStatus,
      receivedBy,
      remarks,
      totalItems: items.length,
      totalIssuedQty,
      totalReceivedQty,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const currentAll = getStoredLoanReceiveAgainstIssue();
    const idx = currentAll.findIndex((r) => r.id === record.id);
    if (idx >= 0) {
      currentAll[idx] = record;
    } else {
      currentAll.unshift(record);
    }
    saveStoredLoanReceiveAgainstIssue(currentAll);

    toast.success(
      `Loan Receive Against Issue "${receiveNo}" successfully saved! Destination stock in ${receivingStore} updated.`
    );
    navigate({ to: "/inv-loan-receive-against-issue-list" });
  };

  // Section 17: Column Changes - Removed Accepted Qty, added Damage/Short Qty at far right
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      reportType: "stock-transfer",
      title: "LOAN RECEIVE AGAINST ISSUE ACKNOWLEDGMENT",
      documentNumber: receiveNo,
      documentDate: receiveDate,
      metadata: [
        { label: "Receive No", value: receiveNo, highlight: true },
        { label: "Receive Date", value: receiveDate },
        { label: "Loan Issue Reference", value: selectedIssue?.issueNo || "—" },
        { label: "Issuing Company", value: issuingCompany },
        { label: "Issuing Store", value: issuingStore },
        { label: "Receiving Company", value: receivingCompany },
        { label: "Receiving Store", value: receivingStore },
        { label: "Received By", value: receivedBy },
        { label: "Status", value: computedStatus, highlight: true },
      ],
      tableHeaders: [
        "SL",
        "Item Description & Code",
        "Brand / Origin",
        "UOM",
        "Issued Qty",
        "Prev Rec Qty",
        "Received Qty",
        "Damage/Short Qty",
      ],
      tableRows: items.map((it, idx) => [
        idx + 1,
        it.itemName,
        `${it.brand} / ${it.origin}`,
        it.uom,
        it.issuedQty,
        it.previouslyReceivedQty,
        it.currentReceiveQty,
        it.damageShortQty || 0,
      ]),
      summaryCards: [
        { label: "Total Items", value: items.length },
        { label: "Total Issued Qty", value: totalIssuedQty },
        { label: "Total Received Qty", value: totalReceivedQty },
        { label: "Total Damage/Short", value: totalDamageShortQty },
      ],
      notes: remarks || "Loan consignment received in full order. Destination store inventory credited.",
    };
  }, [
    receiveNo,
    receiveDate,
    selectedIssue,
    issuingCompany,
    issuingStore,
    receivingCompany,
    receivingStore,
    receivedBy,
    computedStatus,
    items,
    totalIssuedQty,
    totalReceivedQty,
    totalDamageShortQty,
    remarks,
  ]);

  return (
    <div className="flex h-screen bg-background text-foreground antialiased overflow-hidden font-sans">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          <div className="w-full max-w-[1550px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Link
                to="/inv-loan-receive-against-issue-list"
                className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground transition cursor-pointer"
              >
                <ArrowLeft className="size-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold mb-0.5">
                  <span>Stock Loan</span>
                  <span>/</span>
                  <span className="text-foreground">Loan Receive Against Issue</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                  <Inbox className="size-6 text-amber-500" />
                  {isViewMode ? "View Loan Receive Slip" : "Receive Consignment Against Loan Issue"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition cursor-pointer shadow-xs"
              >
                <Printer className="size-3.5" />
                <span>Preview Slip</span>
              </button>

              {!isViewMode && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition cursor-pointer"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Confirm Receipt & Update Stock</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 16.1: Document Header Card — Receive No removed from visible form */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Building2 className="size-4 text-amber-500" />
                Loan Issue Association & Company Parameters
              </h3>
              <div className="text-xs font-bold text-muted-foreground">
                Status: <span className="text-amber-600">{computedStatus}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">Receive Date *</label>
                <input
                  type="date"
                  disabled={isViewMode}
                  value={receiveDate}
                  onChange={(e) => setReceiveDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground font-medium focus:border-amber-500 outline-none"
                />
              </div>

              {/* Loan Issue Selector */}
              <div>
                <label className="block font-bold text-foreground mb-1">
                  Loan Issue Reference *
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedIssue ? selectedIssue.issueNo : "No Issue Selected"}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-muted/20 font-mono font-bold text-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Received By *</label>
                <input
                  type="text"
                  disabled={isViewMode}
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground font-medium focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Issuing Company</label>
                <input
                  type="text"
                  disabled
                  value={issuingCompany}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-muted/20 font-medium text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Issuing Store</label>
                <input
                  type="text"
                  disabled
                  value={issuingStore}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-muted/20 font-medium text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Receiving Company (Destination)</label>
                <input
                  type="text"
                  disabled
                  value={receivingCompany}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-muted/20 font-medium text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Receiving Store (Destination)</label>
                <input
                  type="text"
                  disabled
                  value={receivingStore}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-muted/20 font-medium text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Remarks</label>
                <input
                  type="text"
                  disabled={isViewMode}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Notes on returned condition..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground font-medium focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 16.2 & 16.3: Items & Allocation Matrix (explanatory text removed, Damage / Short column added, Delete button added) */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Package className="size-4 text-amber-500" />
                  Received Items & Store Inward Allocation
                </h3>
              </div>

              <div className="text-right text-xs">
                <span className="font-bold text-muted-foreground">Total Inward: </span>
                <span className="font-mono font-black text-emerald-600">
                  {totalReceivedQty.toLocaleString()} units
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border whitespace-nowrap">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-10">SL</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Item Description & Code</th>
                    <th className="py-2.5 px-3">Brand / Origin</th>
                    <th className="py-2.5 px-2 text-center w-16">UOM</th>
                    <th className="py-2.5 px-3 text-right">Issued Qty</th>
                    <th className="py-2.5 px-3 text-right">Prev Received</th>
                    <th className="py-2.5 px-3 text-right w-24 text-emerald-600 font-black">
                      Receive Qty *
                    </th>
                    {/* Section 16.3: Damage / Short column immediately right of Receive Qty */}
                    <th className="py-2.5 px-3 text-right w-28 text-rose-600 font-black">
                      Damage / Short
                    </th>
                    <th className="py-2.5 px-3 text-right">Remaining</th>
                    <th className="py-2.5 px-3 text-center w-28">Tracking (B/L)</th>
                    {/* Section 16.3: Delete Action column */}
                    {!isViewMode && (
                      <th className="py-2.5 px-2 text-center w-12">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-10 text-center text-muted-foreground">
                        No items found for the selected loan issue.
                      </td>
                    </tr>
                  ) : (
                    items.map((row, idx) => {
                      const mode = getItemTrackingMode(row.itemCode, catalogItems);
                      const maxReceivable = row.issuedQty - row.previouslyReceivedQty;

                      return (
                        <tr key={row.id} className="hover:bg-muted/30 transition">
                          <td className="py-2.5 px-3 text-center text-muted-foreground font-mono text-[10px]">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-foreground">{row.itemName}</div>
                            <div className="font-mono text-[10px] text-amber-600">{row.itemCode}</div>
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {row.brand} / {row.origin}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono">{row.uom}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                            {row.issuedQty.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                            {row.previouslyReceivedQty.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right bg-emerald-500/5">
                            {isViewMode ? (
                              <span className="font-mono font-black text-emerald-600">
                                {row.currentReceiveQty.toLocaleString()}
                              </span>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                max={maxReceivable}
                                value={row.currentReceiveQty}
                                onChange={(e) =>
                                  handleReceiveQtyChange(row.id, Number(e.target.value) || 0)
                                }
                                className="w-20 h-8 px-2 text-right font-mono font-bold text-xs rounded-lg border border-border bg-background focus:border-emerald-500 outline-none"
                              />
                            )}
                          </td>
                          {/* Section 16.3: Damage / Short Input */}
                          <td className="py-2.5 px-3 text-right bg-rose-500/5">
                            {isViewMode ? (
                              <span className="font-mono font-bold text-rose-600">
                                {(row.damageShortQty || 0).toLocaleString()}
                              </span>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                value={row.damageShortQty || 0}
                                onChange={(e) =>
                                  handleDamageShortChange(row.id, Number(e.target.value) || 0)
                                }
                                className="w-20 h-8 px-2 text-right font-mono font-bold text-xs rounded-lg border border-border bg-background focus:border-rose-500 outline-none text-rose-700 dark:text-rose-400"
                              />
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-600">
                            {Math.max(
                              0,
                              maxReceivable - row.currentReceiveQty - (row.damageShortQty || 0)
                            ).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <ItemTrackingCell
                              mode={mode}
                              batchAllocations={row.batchAllocations}
                              locationAllocations={row.locationAllocations}
                              onOpenBatch={() => setActiveBatchItem(row)}
                              onOpenLocation={() => setActiveLocationItem(row)}
                            />
                          </td>
                          {/* Section 16.3: Delete button affecting only selected row */}
                          {!isViewMode && (
                            <td className="py-2.5 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteRow(row.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                title="Remove row"
                              >
                                <Trash2 className="size-4" />
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

          {/* Location Allocation Modal */}
          {activeLocationItem && (
            <LocationAllocationModal
              isOpen={true}
              onClose={() => setActiveLocationItem(null)}
              itemName={activeLocationItem.itemName}
              itemCode={activeLocationItem.itemCode}
              transactionQty={activeLocationItem.currentReceiveQty}
              uom={activeLocationItem.uom}
              currentStore={receivingStore}
              initialEntries={activeLocationItem.locationAllocations}
              onSave={(entries) => {
                setItems((prev) =>
                  prev.map((i) =>
                    i.id === activeLocationItem.id ? { ...i, locationAllocations: entries } : i
                  )
                );
                setActiveLocationItem(null);
                toast.success(`Location allocations saved for ${activeLocationItem.itemName}`);
              }}
            />
          )}

          {/* Batch Allocation Modal */}
          {activeBatchItem && (
            <BatchAllocationModal
              isOpen={true}
              onClose={() => setActiveBatchItem(null)}
              itemName={activeBatchItem.itemName}
              itemCode={activeBatchItem.itemCode}
              transactionQty={activeBatchItem.currentReceiveQty}
              uom={activeBatchItem.uom}
              currentStore={receivingStore}
              initialEntries={activeBatchItem.batchAllocations}
              onSave={(entries) => {
                setItems((prev) =>
                  prev.map((i) =>
                    i.id === activeBatchItem.id ? { ...i, batchAllocations: entries } : i
                  )
                );
                setActiveBatchItem(null);
                toast.success(`Batch allocations saved for ${activeBatchItem.itemName}`);
              }}
            />
          )}

          {/* Preview Report Modal */}
          <StandardPreviewReportModal
            isOpen={isReportOpen}
            onClose={() => setIsReportOpen(false)}
            data={previewReportData}
          />
          </div>
        </main>
      </div>
    </div>
  );
}
