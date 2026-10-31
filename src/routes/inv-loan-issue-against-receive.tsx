// src/routes/inv-loan-issue-against-receive.tsx
import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  Layers,
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
} from "lucide-react";
import { toast } from "sonner";
import {
  LoanIssueAgainstReceive,
  LoanIssueAgainstReceiveItem,
  StockLoanRequisition,
  StockLoanReceipt,
  getStoredLoanRequisitions,
  getStoredLoanReceipts,
  getStoredLoanIssueAgainstReceive,
  saveStoredLoanIssueAgainstReceive,
  MASTER_COMPANIES,
} from "@/lib/inventory-stock-loan-data";
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

export const Route = createFileRoute("/inv-loan-issue-against-receive")({
  validateSearch: (
    search: Record<string, unknown>
  ): { issueId?: string; mode?: string; reqId?: string; receiptNo?: string } => ({
    issueId: search.issueId as string | undefined,
    mode: search.mode as string | undefined,
    reqId: search.reqId as string | undefined,
    receiptNo: search.receiptNo as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Loan Issue Against Receive — Inventory ERP" },
      {
        name: "description",
        content: "Issue repayment against previously received loan consignments with strict step verification.",
      },
    ],
  }),
  component: LoanIssueAgainstReceivePage,
});

export default function LoanIssueAgainstReceivePage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const isViewMode = search.mode === "view";

  const allRequisitions = useMemo(() => getStoredLoanRequisitions(), []);
  const allReceipts = useMemo(() => getStoredLoanReceipts(), []);
  const catalogItems = useMemo(
    () => getStoredData<ItemProductMaster[]>("cripton_master_item_creation", DEFAULT_ITEMS),
    []
  );

  // Form State (Issue No is preserved in state for data & reports, but removed from visible form per Section 14.2)
  const [issueNo, setIssueNo] = useState(
    `LIAR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));

  // Step 1: Selected Loan Requisition
  const [selectedReq, setSelectedReq] = useState<StockLoanRequisition | null>(null);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [reqSearchQuery, setReqSearchQuery] = useState("");

  // Step 2: Selected Loan Receipt Numbers
  const [selectedReceiptNumbers, setSelectedReceiptNumbers] = useState<string[]>([]);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Company Information
  const [issuingCompany, setIssuingCompany] = useState<string>(
    MASTER_COMPANIES[0]?.name || "Pakiza Knit Composite Ltd."
  );
  const [issuingStore, setIssuingStore] = useState("Dyeing Chemical Store");
  const [receivingCompany, setReceivingCompany] = useState<string>(
    MASTER_COMPANIES[1]?.name || "Pakiza Apparels Ltd."
  );
  const [receivingStore, setReceivingStore] = useState("Finishing Store - Norshingdi");
  const [issuedBy, setIssuedBy] = useState("Md. Aminul Islam");
  const [remarks, setRemarks] = useState("");

  // Items State & Allocation
  const [items, setItems] = useState<LoanIssueAgainstReceiveItem[]>([]);

  // Tracking Modals
  const [activeBatchItem, setActiveBatchItem] = useState<LoanIssueAgainstReceiveItem | null>(null);
  const [activeLocationItem, setActiveLocationItem] = useState<LoanIssueAgainstReceiveItem | null>(null);

  // Preview Report State
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Helper to load items from selected receipts
  const loadItemsFromReceipts = (receiptNumbers: string[]) => {
    const matchedReceipts = allReceipts.filter((r) => receiptNumbers.includes(r.receiveId));
    const loadedItems: LoanIssueAgainstReceiveItem[] = [];

    matchedReceipts.forEach((rcpt) => {
      rcpt.items.forEach((rit, idx) => {
        const receivedQty = rit.acceptedQty || rit.receivedQty || rit.dispatchedQty;
        loadedItems.push({
          id: `liar-it-${Date.now()}-${idx}-${Math.random().toString().slice(-4)}`,
          sl: loadedItems.length + 1,
          itemCode: rit.itemCode,
          itemName: rit.itemName,
          specification: rit.specification || "-",
          brand: rit.brand || "Standard",
          origin: rit.origin || "Local",
          uom: rit.uom,
          receivedQty,
          availableReceivedQty: receivedQty,
          issueQty: receivedQty, // default full return, editable
          unitPrice: rit.unitPrice || 100,
          totalValue: receivedQty * (rit.unitPrice || 100),
          receiptNumber: rcpt.receiveId,
          batchAllocations: rit.batchAllocations || [
            { batchNumber: `BAT-RET-${rit.itemCode.slice(-4)}`, quantity: receivedQty },
          ],
          locationAllocations: rit.locationAllocations || [
            { locationName: "Return Bay 1", quantity: receivedQty },
          ],
        });
      });
    });

    setItems(loadedItems);
  };

  // Initialize from search if viewing existing or navigating from Return Issue
  useEffect(() => {
    if (search.issueId) {
      const all = getStoredLoanIssueAgainstReceive();
      const match = all.find((i) => i.id === search.issueId);
      if (match) {
        setIssueNo(match.issueNo);
        setIssueDate(match.issueDate);
        setIssuingCompany(match.issuingCompany);
        setIssuingStore(match.issuingStore);
        setReceivingCompany(match.receivingCompany);
        setReceivingStore(match.receivingStore);
        setIssuedBy(match.issuedBy);
        setRemarks(match.remarks || "");
        setSelectedReceiptNumbers(match.selectedReceiptNumbers);
        setItems(match.items);

        const foundReq = allRequisitions.find((r) => r.id === match.loanRequisitionId);
        if (foundReq) setSelectedReq(foundReq);
      }
    } else if (search.reqId || search.receiptNo) {
      let foundReq = allRequisitions.find(
        (r) => r.id === search.reqId || r.requisitionNumber === search.reqId
      );
      if (!foundReq && search.receiptNo) {
        const rMatch = allReceipts.find((r) => r.receiveId === search.receiptNo);
        if (rMatch) {
          const rNum = rMatch.remarks?.match(/LR-\d{4}-\d+/)?.[0];
          if (rNum) foundReq = allRequisitions.find((r) => r.requisitionNumber === rNum);
          if (!foundReq && allRequisitions.length > 0) foundReq = allRequisitions[0];
        }
      }
      if (foundReq) {
        setSelectedReq(foundReq);
        setIssuingCompany(foundReq.requisitioningCompany);
        setIssuingStore(foundReq.requisitioningStore);
        setReceivingCompany(foundReq.requestedFromCompany);
        setReceivingStore(foundReq.requestedFromStore);
      }
      if (search.receiptNo) {
        setSelectedReceiptNumbers([search.receiptNo]);
        loadItemsFromReceipts([search.receiptNo]);
      }
    }
  }, [search.issueId, search.reqId, search.receiptNo, allRequisitions, allReceipts]);

  // Filtered Approved Requisitions for Step 1
  const approvedRequisitions = useMemo(() => {
    return allRequisitions.filter(
      (r) =>
        (r.status === "Approved" || r.status === "Partially Issued" || r.status === "Fully Issued") &&
        (r.requisitionNumber.toLowerCase().includes(reqSearchQuery.toLowerCase()) ||
          r.requisitioningCompany.toLowerCase().includes(reqSearchQuery.toLowerCase()) ||
          r.requestedFromCompany.toLowerCase().includes(reqSearchQuery.toLowerCase()))
    );
  }, [allRequisitions, reqSearchQuery]);

  // Receipts available for selected Requisition in Step 2
  const availableReceiptsForReq = useMemo(() => {
    if (!selectedReq) return [];
    return allReceipts.filter(
      (rcpt) =>
        rcpt.toCompany === selectedReq.requisitioningCompany ||
        rcpt.fromCompany === selectedReq.requestedFromCompany ||
        rcpt.remarks?.includes(selectedReq.requisitionNumber)
    );
  }, [selectedReq, allReceipts]);

  // Step 1 Selection Handler
  const handleSelectRequisition = (req: StockLoanRequisition) => {
    setSelectedReq(req);
    setIssuingCompany(req.requisitioningCompany);
    setIssuingStore(req.requisitioningStore);
    setReceivingCompany(req.requestedFromCompany);
    setReceivingStore(req.requestedFromStore);
    setSelectedReceiptNumbers([]);
    setItems([]);
    setIsReqModalOpen(false);
    toast.success(`Selected Loan Requisition "${req.requisitionNumber}". Now select Receipt Numbers.`);
  };

  // Step 2 Selection Confirmation & Item Loading
  const handleConfirmReceiptSelection = () => {
    if (selectedReceiptNumbers.length === 0) {
      toast.error("Please select at least one Loan Receipt Number.");
      return;
    }
    loadItemsFromReceipts(selectedReceiptNumbers);
    setIsReceiptModalOpen(false);
    toast.success(
      `Loaded item(s) from receipt(s): ${selectedReceiptNumbers.join(", ")}`
    );
  };

  // Quantity Change with strict validation against availableReceivedQty
  const handleQtyChange = (itemId: string, newQty: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        if (newQty > it.availableReceivedQty) {
          toast.error(
            `Issue quantity cannot exceed available received quantity (${it.availableReceivedQty} ${it.uom}).`
          );
          return it;
        }
        const validQty = Math.max(0, newQty);
        return {
          ...it,
          issueQty: validQty,
          totalValue: validQty * it.unitPrice,
        };
      })
    );
  };

  // Summary Metrics
  const totalIssueQty = useMemo(
    () => items.reduce((sum, it) => sum + (it.issueQty || 0), 0),
    [items]
  );
  const totalValue = useMemo(
    () => items.reduce((sum, it) => sum + (it.totalValue || 0), 0),
    [items]
  );

  // Save / Submit
  const handleSave = (submitFinal: boolean) => {
    if (!selectedReq) {
      toast.error("Please select a Loan Requisition (Step 1).");
      return;
    }
    if (selectedReceiptNumbers.length === 0) {
      toast.error("Please select Loan Receipt Numbers (Step 2).");
      return;
    }
    if (items.length === 0) {
      toast.error("No items loaded for this loan issue.");
      return;
    }

    // Validate Batch & Location allocations against issueQty
    for (const it of items) {
      if (it.issueQty <= 0) {
        toast.error(`Item "${it.itemName}" has an invalid issue quantity.`);
        return;
      }
      const mode = getItemTrackingMode(it.itemCode, catalogItems);
      if (mode === "Batch" && it.batchAllocations) {
        const totalBatch = it.batchAllocations.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);
        if (totalBatch !== it.issueQty) {
          toast.error(
            `Batch allocations (${totalBatch} ${it.uom}) must match issue quantity (${it.issueQty} ${it.uom}) for ${it.itemName}.`
          );
          return;
        }
      }
      if (mode === "Location" && it.locationAllocations) {
        const totalLoc = it.locationAllocations.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0);
        if (totalLoc !== it.issueQty) {
          toast.error(
            `Location allocations (${totalLoc} ${it.uom}) must match issue quantity (${it.issueQty} ${it.uom}) for ${it.itemName}.`
          );
          return;
        }
      }
    }

    const record: LoanIssueAgainstReceive = {
      id: search.issueId || `liar-${Date.now()}`,
      issueNo,
      issueDate,
      loanRequisitionId: selectedReq.id,
      loanRequisitionNumber: selectedReq.requisitionNumber,
      selectedReceiptNumbers,
      issuingCompany,
      issuingStore,
      receivingCompany,
      receivingStore,
      status: submitFinal ? "Completed" : "Draft",
      issuedBy,
      remarks,
      totalItems: items.length,
      totalIssueQty,
      totalValue,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const currentAll = getStoredLoanIssueAgainstReceive();
    const idx = currentAll.findIndex((i) => i.id === record.id);
    if (idx >= 0) {
      currentAll[idx] = record;
    } else {
      currentAll.unshift(record);
    }
    saveStoredLoanIssueAgainstReceive(currentAll);

    toast.success(
      submitFinal
        ? `Loan Issue Against Receive "${issueNo}" successfully completed and physical stock updated!`
        : `Loan Issue Against Receive "${issueNo}" saved as draft.`
    );
    navigate({ to: "/inv-loan-issue-against-receive-list" });
  };

  // Section 15: Preview Report without Rate (৳), Total (৳), and Total Value (৳) summary
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      reportType: "stock-transfer",
      title: "LOAN ISSUE AGAINST RECEIVE SLIP",
      documentNumber: issueNo,
      documentDate: issueDate,
      metadata: [
        { label: "Issue No", value: issueNo, highlight: true },
        { label: "Issue Date", value: issueDate },
        { label: "Loan Requisition No", value: selectedReq?.requisitionNumber || "—" },
        { label: "Receipt Ref(s)", value: selectedReceiptNumbers.join(", ") || "—" },
        { label: "Issuing Company", value: issuingCompany },
        { label: "Issuing Store", value: issuingStore },
        { label: "Receiving Company", value: receivingCompany },
        { label: "Receiving Store", value: receivingStore },
        { label: "Issued By", value: issuedBy },
      ],
      tableHeaders: [
        "SL",
        "Item Description & Spec",
        "Brand / Origin",
        "UOM",
        "Receipt No",
        "Received Qty",
        "Issue Qty",
      ],
      tableRows: items.map((it, idx) => [
        idx + 1,
        it.itemName,
        `${it.brand} / ${it.origin}`,
        it.uom,
        it.receiptNumber,
        it.receivedQty,
        it.issueQty,
      ]),
      summaryCards: [
        { label: "Total Items", value: items.length },
        { label: "Total Issue Qty", value: totalIssueQty },
      ],
      notes: remarks || "Stock loan issued against received consignment. Stock allocated.",
    };
  }, [
    issueNo,
    issueDate,
    selectedReq,
    selectedReceiptNumbers,
    issuingCompany,
    issuingStore,
    receivingCompany,
    receivingStore,
    issuedBy,
    items,
    totalIssueQty,
    remarks,
  ]);

  return (
    <div className="flex h-screen bg-background text-foreground antialiased overflow-hidden font-sans">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Link
                to="/inv-loan-issue-against-receive-list"
                className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground transition cursor-pointer"
              >
                <ArrowLeft className="size-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold mb-0.5">
                  <span>Stock Loan</span>
                  <span>/</span>
                  <span className="text-foreground">Loan Issue Against Receive</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                  <Layers className="size-6 text-amber-500" />
                  {isViewMode ? "View Loan Issue Against Receive" : "New Loan Issue Against Receive"}
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
                <>
                  <button
                    type="button"
                    onClick={() => handleSave(false)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition cursor-pointer shadow-xs"
                  >
                    <Save className="size-3.5" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>Confirm & Complete Issue</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Section 14.1: The 4 KPI cards removed */}

          {/* Form Header Card: Section 14.2 Issue No removed from visible form */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border pb-2.5">
              <Building2 className="size-4 text-amber-500" />
              Document Header & Association Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">Issue Date *</label>
                <input
                  type="date"
                  disabled={isViewMode}
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground font-medium focus:border-amber-500 outline-none"
                />
              </div>

              {/* Section 14.3: Step 1: Loan Requisition * */}
              <div>
                <label className="block font-bold text-foreground mb-1">
                  Step 1: Loan Requisition *
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    readOnly
                    placeholder="Click Select to pick..."
                    value={selectedReq ? selectedReq.requisitionNumber : ""}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-muted/20 font-bold text-foreground outline-none"
                  />
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={() => setIsReqModalOpen(true)}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 cursor-pointer shadow-2xs"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>

              {/* Section 14.3: Step 2: Loan Requisition * (updated label) */}
              <div>
                <label className="block font-bold text-foreground mb-1">
                  Step 2: Loan Requisition *
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    readOnly
                    placeholder="Click Select to tag..."
                    value={
                      selectedReceiptNumbers.length > 0
                        ? `${selectedReceiptNumbers.length} tagged: ${selectedReceiptNumbers.join(", ")}`
                        : ""
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-muted/20 font-bold text-foreground outline-none truncate"
                  />
                  {!isViewMode && (
                    <button
                      type="button"
                      disabled={!selectedReq}
                      onClick={() => setIsReceiptModalOpen(true)}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold text-xs shrink-0 cursor-pointer shadow-2xs"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>

              {/* Company Information */}
              <div>
                <label className="block font-bold text-foreground mb-1">Issuing Company *</label>
                <input
                  type="text"
                  disabled={isViewMode}
                  value={issuingCompany}
                  onChange={(e) => setIssuingCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground font-medium focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Issuing Store / Warehouse *</label>
                <input
                  type="text"
                  disabled={isViewMode}
                  value={issuingStore}
                  onChange={(e) => setIssuingStore(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground font-medium focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Receiving Company *</label>
                <input
                  type="text"
                  disabled={isViewMode}
                  value={receivingCompany}
                  onChange={(e) => setReceivingCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground font-medium focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Receiving Store *</label>
                <input
                  type="text"
                  disabled={isViewMode}
                  value={receivingStore}
                  onChange={(e) => setReceivingStore(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground font-medium focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Issued By *</label>
                <input
                  type="text"
                  disabled={isViewMode}
                  value={issuedBy}
                  onChange={(e) => setIssuedBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground font-medium focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Remarks</label>
                <input
                  type="text"
                  disabled={isViewMode}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional notes or return dispatch reference..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground font-medium focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 14.3 & 14.4: Item Details & Allocation Matrix (explanatory text and Total Value summary removed) */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Package className="size-4 text-amber-500" />
                  Item Details & Allocation Matrix
                </h3>
              </div>
              <div className="text-xs font-bold text-muted-foreground">
                Total Issue Qty: <span className="font-mono text-foreground font-black">{totalIssueQty.toLocaleString()}</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border whitespace-nowrap">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-10">SL</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Item Description & Code</th>
                    <th className="py-2.5 px-3 min-w-[140px]">Specification</th>
                    <th className="py-2.5 px-3">Brand / Origin</th>
                    <th className="py-2.5 px-2 text-center w-16">UOM</th>
                    <th className="py-2.5 px-3">Receipt No</th>
                    <th className="py-2.5 px-3 text-right">Received Qty</th>
                    <th className="py-2.5 px-3 text-right">Avail Rec Qty</th>
                    <th className="py-2.5 px-3 text-right w-28 text-amber-600 font-black">
                      Issue Qty *
                    </th>
                    <th className="py-2.5 px-3 text-center w-28">Tracking (B/L)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-10 text-center text-muted-foreground">
                        No items loaded yet. Complete Steps 1 & 2 above to populate receipt items.
                      </td>
                    </tr>
                  ) : (
                    items.map((row, idx) => {
                      const mode = getItemTrackingMode(row.itemCode, catalogItems);
                      const isOver = row.issueQty > row.availableReceivedQty;

                      return (
                        <tr
                          key={row.id}
                          className={`hover:bg-muted/30 transition ${
                            isOver ? "bg-rose-50/50 dark:bg-rose-950/20" : ""
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center text-muted-foreground font-mono text-[10px]">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-foreground">{row.itemName}</div>
                            <div className="font-mono text-[10px] text-amber-600">{row.itemCode}</div>
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">{row.specification}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {row.brand} / {row.origin}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono">{row.uom}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                            {row.receiptNumber}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                            {row.receivedQty.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                            {row.availableReceivedQty.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right bg-amber-500/5">
                            {isViewMode ? (
                              <span className="font-mono font-black text-amber-600">
                                {row.issueQty.toLocaleString()}
                              </span>
                            ) : (
                              <input
                                type="number"
                                min="1"
                                max={row.availableReceivedQty}
                                value={row.issueQty}
                                onChange={(e) => handleQtyChange(row.id, Number(e.target.value) || 0)}
                                className={`w-24 h-8 px-2 text-right font-mono font-bold text-xs rounded-lg border outline-none ${
                                  isOver
                                    ? "border-rose-400 bg-rose-50 text-rose-700"
                                    : "border-border bg-background focus:border-amber-500"
                                }`}
                              />
                            )}
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
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 1 Modal: Select Loan Requisition */}
          {isReqModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
              <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-3xl w-full p-5 space-y-4 max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Layers className="size-4 text-amber-500" />
                      Step 1: Select Approved Loan Requisition
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Select an approved stock loan requisition to initiate this issue.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReqModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={reqSearchQuery}
                    onChange={(e) => setReqSearchQuery(e.target.value)}
                    placeholder="Search by Requisition ID or Company..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-background focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="overflow-y-auto flex-1 border border-border rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                      <tr>
                        <th className="py-2.5 px-3">Requisition No & Date</th>
                        <th className="py-2.5 px-3">Requisitioning Company</th>
                        <th className="py-2.5 px-3">Requested From Company</th>
                        <th className="py-2.5 px-3 text-center">Items</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {approvedRequisitions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground">
                            No approved loan requisitions found.
                          </td>
                        </tr>
                      ) : (
                        approvedRequisitions.map((req) => (
                          <tr key={req.id} className="hover:bg-muted/40 transition">
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-amber-600 font-mono">{req.requisitionNumber}</div>
                              <div className="text-[10.5px] text-muted-foreground">{req.requisitionDate}</div>
                            </td>
                            <td className="py-2.5 px-3">{req.requisitioningCompany}</td>
                            <td className="py-2.5 px-3">{req.requestedFromCompany}</td>
                            <td className="py-2.5 px-3 text-center font-bold">{req.totalItems}</td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleSelectRequisition(req)}
                                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-2xs"
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 Modal: Select Loan Receipts */}
          {isReceiptModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
              <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full p-5 space-y-4 max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <FileCheck2 className="size-4 text-amber-500" />
                      Step 2: Select Loan Receipt Numbers
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Select receipt(s) associated with {selectedReq?.requisitionNumber} to load received item balances.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReceiptModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 border border-border rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">#</th>
                        <th className="py-2.5 px-3">Receipt No & Date</th>
                        <th className="py-2.5 px-3">From Company</th>
                        <th className="py-2.5 px-3 text-right">Dispatched</th>
                        <th className="py-2.5 px-3 text-right">Received Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {availableReceiptsForReq.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground">
                            No receipts found matching this requisition.
                          </td>
                        </tr>
                      ) : (
                        availableReceiptsForReq.map((rcpt) => {
                          const isChecked = selectedReceiptNumbers.includes(rcpt.receiveId);
                          return (
                            <tr
                              key={rcpt.id}
                              onClick={() => {
                                setSelectedReceiptNumbers((prev) =>
                                  prev.includes(rcpt.receiveId)
                                    ? prev.filter((id) => id !== rcpt.receiveId)
                                    : [...prev, rcpt.receiveId]
                                );
                              }}
                              className={`cursor-pointer transition ${
                                isChecked ? "bg-amber-500/10" : "hover:bg-muted/40"
                              }`}
                            >
                              <td className="py-2.5 px-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}} // handled by row click
                                  className="size-4 accent-amber-500"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="font-bold font-mono text-foreground">{rcpt.receiveId}</div>
                                <div className="text-[10px] text-muted-foreground">{rcpt.receiveDate}</div>
                              </td>
                              <td className="py-2.5 px-3">{rcpt.fromCompany}</td>
                              <td className="py-2.5 px-3 text-right font-mono">{rcpt.totalDispatchedQty}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                                {rcpt.totalReceivedQty}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Selected: <strong>{selectedReceiptNumbers.length}</strong> receipt(s)
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReceiptModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={selectedReceiptNumbers.length === 0}
                      onClick={handleConfirmReceiptSelection}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white cursor-pointer shadow-sm"
                    >
                      Confirm & Load Items
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location Allocation Modal */}
          {activeLocationItem && (
            <LocationAllocationModal
              isOpen={true}
              onClose={() => setActiveLocationItem(null)}
              itemName={activeLocationItem.itemName}
              itemCode={activeLocationItem.itemCode}
              transactionQty={activeLocationItem.issueQty}
              uom={activeLocationItem.uom}
              currentStore={issuingStore}
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
              transactionQty={activeBatchItem.issueQty}
              uom={activeBatchItem.uom}
              currentStore={issuingStore}
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
        </main>
      </div>
    </div>
  );
}
