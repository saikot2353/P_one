import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Layers,
  Save,
  Send,
  Eye,
  X,
  Package,
  Calendar,
  DollarSign,
  TrendingDown,
  Warehouse,
  ShieldAlert,
  Printer,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  StockLoanIssue,
  StockLoanReturn,
  StockLoanReturnItem,
  StockLoanReturnCondition,
  getStoredStockLoanIssues,
  getStoredStockLoanReturns,
  saveStockLoanReturn,
  calculateLoanSettlementSummary,
  syncLoanIssueSettlement,
} from "@/lib/inventory-stock-loan-data";
import {
  DEFAULT_WAREHOUSES,
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

export const Route = createFileRoute("/inv-loan-return")({
  validateSearch: (
    search: Record<string, unknown>
  ): { loanIssueId?: string; returnId?: string; mode?: "view" | "edit" } => ({
    loanIssueId: search.loanIssueId as string | undefined,
    returnId: search.returnId as string | undefined,
    mode: search.mode as "view" | "edit" | undefined,
  }),
  head: () => ({
    meta: [
      { title: "New Loan Return — Physical Item Return | Inventory ERP" },
      {
        name: "description",
        content: "Process physical item returns against outstanding Stock Loan Issues with frozen issue-time valuation.",
      },
    ],
  }),
  component: LoanReturnFormPage,
});

function LoanReturnFormPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const isViewMode = searchParams.mode === "view";
  const catalogItems = getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS);
  const warehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);

  const allLoans = useMemo(() => getStoredStockLoanIssues(), []);
  const allReturns = useMemo(() => getStoredStockLoanReturns(), []);

  // Find existing return if editing/viewing
  const existingReturn = useMemo(() => {
    if (searchParams.returnId) {
      return allReturns.find((r) => r.returnId === searchParams.returnId || r.id === searchParams.returnId) || null;
    }
    return null;
  }, [searchParams.returnId, allReturns]);

  // Valid Loan Issues with remaining unsettled balance
  const eligibleLoans = useMemo(() => {
    return allLoans.filter((l) => {
      if (l.status === "Cancelled" || l.status === "Draft") return false;
      const summary = calculateLoanSettlementSummary(l.loanIssueId || l.id);
      if (!summary) return true;
      // Allow if there are still items remaining to return
      const hasRemainingItems = summary.itemsSummary.some((it) => it.remainingQty > 0);
      return hasRemainingItems || l.loanIssueId === searchParams.loanIssueId || l.id === searchParams.loanIssueId;
    });
  }, [allLoans, searchParams.loanIssueId]);

  // Selected Loan Issue ID
  const [selectedLoanIssueId, setSelectedLoanIssueId] = useState<string>(() => {
    if (existingReturn) return existingReturn.loanIssueId;
    if (searchParams.loanIssueId) return searchParams.loanIssueId;
    return eligibleLoans[0]?.loanIssueId || eligibleLoans[0]?.id || "";
  });

  const activeLoan: StockLoanIssue | null = useMemo(() => {
    return allLoans.find((l) => l.loanIssueId === selectedLoanIssueId || l.id === selectedLoanIssueId) || null;
  }, [allLoans, selectedLoanIssueId]);

  // Settlement summary for selected loan
  const settlementSummary = useMemo(() => {
    if (!selectedLoanIssueId) return null;
    return calculateLoanSettlementSummary(selectedLoanIssueId);
  }, [selectedLoanIssueId, allReturns]);

  // Return Header Fields (Section 5.1)
  const [returnId] = useState<string>(() => {
    if (existingReturn) return existingReturn.returnId;
    return `LRET-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
  });

  const [returnDate, setReturnDate] = useState<string>(() => {
    if (existingReturn) return existingReturn.returnDate;
    return new Date().toISOString().slice(0, 10);
  });

  const [receivingStore, setReceivingStore] = useState<string>(() => {
    if (existingReturn) return existingReturn.receivingStore;
    return activeLoan?.fromStore || "PKCL Central Raw Material Warehouse";
  });

  const [receivedBy, setReceivedBy] = useState<string>(() => {
    if (existingReturn) return existingReturn.receivedBy;
    return "Sohanur Rahman Sohan (Store Receiving Officer)";
  });

  const [remarks, setRemarks] = useState<string>(() => {
    if (existingReturn) return existingReturn.remarks || "";
    return "";
  });

  // Return Items State (Section 5.2)
  const [returnItems, setReturnItems] = useState<StockLoanReturnItem[]>(() => {
    if (existingReturn && existingReturn.items) {
      return existingReturn.items;
    }
    return [];
  });

  // When active loan changes or initializes, populate return items
  useEffect(() => {
    if (existingReturn && existingReturn.items && existingReturn.items.length > 0) {
      setReturnItems(existingReturn.items);
      return;
    }

    if (activeLoan && settlementSummary) {
      setReceivingStore(activeLoan.fromStore || "PKCL Central Raw Material Warehouse");

      const mapped: StockLoanReturnItem[] = settlementSummary.itemsSummary.map((it, idx) => {
        const frozenRate = it.issueAvgCostRate || 0;
        return {
          id: `lret-it-${Date.now()}-${idx}`,
          loanItemId: `li-ref-${idx}`,
          sl: idx + 1,
          itemCode: it.itemCode,
          itemName: it.itemName,
          specification: it.specification,
          brand: "Standard",
          origin: "Bangladesh",
          uom: it.uom,
          originalIssuedQty: it.issuedQty,
          previouslyReturnedQty: it.returnedQty,
          remainingIssuedQty: it.remainingQty,
          issueAvgCostRate: frozenRate,
          returnQty: 0, // Defaults to 0 so user explicitly specifies
          returnValue: 0,
          condition: "Good",
          isAcceptedForStock: true,
          store: activeLoan.fromStore,
          location: "General Bay 1",
          batchAllocations: [],
          locationAllocations: [],
          remarks: "",
        };
      });

      setReturnItems(mapped);
    }
  }, [activeLoan, settlementSummary, existingReturn]);

  // Handle return item row changes
  const handleItemQtyChange = (id: string, qtyStr: string) => {
    if (isViewMode) return;
    const qty = Math.max(0, Number(qtyStr) || 0);

    setReturnItems((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const cappedQty = Math.min(qty, row.remainingIssuedQty);
        const returnValue = cappedQty * row.issueAvgCostRate;
        return {
          ...row,
          returnQty: cappedQty,
          returnValue,
        };
      })
    );
  };

  const handleItemConditionChange = (id: string, condition: StockLoanReturnCondition) => {
    if (isViewMode) return;
    setReturnItems((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        // Section 5.3: Only "Good" condition items increase stock immediately.
        // Damaged / Non-Usable are tagged for inspection without automatic stock addition.
        const isAcceptedForStock = condition === "Good";
        return {
          ...row,
          condition,
          isAcceptedForStock,
        };
      })
    );
  };

  const handleItemRemarksChange = (id: string, val: string) => {
    if (isViewMode) return;
    setReturnItems((prev) =>
      prev.map((row) => (row.id === id ? { ...row, remarks: val } : row))
    );
  };

  // Section 5.5: Dynamic Valuation Calculations
  const currentPhysicalReturnValue = useMemo(() => {
    return returnItems.reduce((sum, it) => {
      // Only accepted Good-condition items contribute to financial return value
      if (it.condition === "Good" && it.isAcceptedForStock) {
        return sum + (it.returnValue || 0);
      }
      return sum;
    }, 0);
  }, [returnItems]);

  const currentTotalReturnQty = useMemo(() => {
    return returnItems.reduce((sum, it) => sum + (Number(it.returnQty) || 0), 0);
  }, [returnItems]);

  const originalLoanValue = settlementSummary?.originalLoanValue || 0;
  const previousPhysicalReturnValue = settlementSummary?.totalPhysicalReturnValue || 0;
  const totalPhysicalReturnValue = previousPhysicalReturnValue + currentPhysicalReturnValue;
  const previousMonetaryRecovery = settlementSummary?.totalMonetaryRecovery || 0;
  const remainingLoanValue = Math.max(0, originalLoanValue - totalPhysicalReturnValue - previousMonetaryRecovery);

  // Check if any returned items have condition Damaged / Non-Usable
  const hasInspectionItems = useMemo(() => {
    return returnItems.some((it) => it.returnQty > 0 && it.condition !== "Good");
  }, [returnItems]);

  // Validation
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    if (!selectedLoanIssueId) {
      errs.push("Please select a valid Loan Issue reference.");
    }
    if (!receivingStore) {
      errs.push("Receiving Store is required.");
    }
    if (!receivedBy.trim()) {
      errs.push("Received By is required.");
    }
    if (currentTotalReturnQty <= 0) {
      errs.push("Please specify a return quantity greater than zero for at least one item.");
    }

    returnItems.forEach((it) => {
      if (it.returnQty > it.remainingIssuedQty) {
        errs.push(
          `${it.itemName}: Return quantity (${it.returnQty}) cannot exceed remaining issued quantity (${it.remainingIssuedQty}).`
        );
      }
    });

    return errs;
  }, [selectedLoanIssueId, receivingStore, receivedBy, currentTotalReturnQty, returnItems]);

  // Save / Confirm Handler
  const handleSaveReturn = (status: "Draft" | "Confirmed") => {
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    if (!activeLoan) return;

    const payload: StockLoanReturn = {
      id: existingReturn?.id || `lret-${Date.now()}`,
      returnId,
      returnDate,
      loanIssueId: activeLoan.loanIssueId,
      loanIssueReferenceId: activeLoan.id,
      loanIssueDate: activeLoan.issueDate || activeLoan.loanDate || "",
      borrowerName: activeLoan.borrowerName || activeLoan.requestedBy || "Store Manager",
      department: activeLoan.department || "Central Inventory & Materials Supply",
      issuingCompany: activeLoan.fromCompany,
      issuingStore: activeLoan.fromStore,
      receivingCompany: activeLoan.toCompany,
      receivingStore,
      receivedBy,
      remarks,
      status: hasInspectionItems && status === "Confirmed" ? "Pending Inspection" : status,
      totalItems: returnItems.filter((i) => i.returnQty > 0).length,
      totalReturnQty: currentTotalReturnQty,
      acceptedReturnValue: currentPhysicalReturnValue,
      originalLoanValue,
      previousPhysicalReturnValue,
      currentPhysicalReturnValue,
      totalPhysicalReturnValue,
      previousMonetaryRecovery,
      remainingLoanValue,
      items: returnItems.filter((i) => i.returnQty > 0),
      createdAt: existingReturn?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveStockLoanReturn(payload);
    syncLoanIssueSettlement(activeLoan.loanIssueId);

    toast.success(
      status === "Draft"
        ? `Loan Return draft saved successfully (#${returnId})!`
        : `Physical Loan Return confirmed successfully (#${returnId})!`
    );

    navigate({ to: "/inv-loan-return-list" });
  };

  // Tracking Modal State
  const [activeTrackingItemId, setActiveTrackingItemId] = useState<string | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  const activeTrackingItem = useMemo(() => {
    return returnItems.find((i) => i.id === activeTrackingItemId) || null;
  }, [returnItems, activeTrackingItemId]);

  const openTrackingModal = (item: StockLoanReturnItem) => {
    if (isViewMode || item.returnQty <= 0) return;
    const mode = getItemTrackingMode(item.itemCode, catalogItems);
    setActiveTrackingItemId(item.id);
    if (mode === "Batch") {
      setBatchModalOpen(true);
    } else {
      setLocationModalOpen(true);
    }
  };

  const handleSaveLocationAllocations = (allocations: LocationEntry[]) => {
    if (!activeTrackingItemId) return;
    setReturnItems((prev) =>
      prev.map((it) => (it.id === activeTrackingItemId ? { ...it, locationAllocations: allocations } : it))
    );
    setLocationModalOpen(false);
    toast.success("Location allocation updated for returned item.");
  };

  const handleSaveBatchAllocations = (allocations: BatchEntry[]) => {
    if (!activeTrackingItemId) return;
    setReturnItems((prev) =>
      prev.map((it) => (it.id === activeTrackingItemId ? { ...it, batchAllocations: allocations } : it))
    );
    setBatchModalOpen(false);
    toast.success("Batch allocation updated for returned item.");
  };

  // Preview Modal
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      reportType: "stock-transfer",
      title: "Physical Loan Return Receipt",
      reportTitle: "Official Return Challan — Physical Item Return",
      documentNumber: returnId,
      documentDate: returnDate,
      organizationName: activeLoan?.fromCompany || "Pakiza Group",
      metadata: [
        { label: "Return ID", value: returnId, highlight: true },
        { label: "Loan Issue Ref", value: activeLoan?.loanIssueId || "—", highlight: true },
        { label: "Return Date", value: returnDate },
        { label: "Borrower / Dept", value: `${activeLoan?.borrowerName || "—"} (${activeLoan?.department || "—"})` },
        { label: "Issuing Store", value: activeLoan?.fromStore || "—" },
        { label: "Receiving Store", value: receivingStore },
        { label: "Received By", value: receivedBy },
      ],
      tableHeaders: [
        "SL",
        "Item Code",
        "Description",
        "UOM",
        "Issued Qty",
        "Return Qty",
        "Avg Cost Rate",
        "Return Value",
        "Condition",
      ],
      tableRows: returnItems
        .filter((i) => i.returnQty > 0)
        .map((it, idx) => [
          String(idx + 1),
          it.itemCode,
          it.itemName,
          it.uom,
          it.originalIssuedQty.toLocaleString(),
          it.returnQty.toLocaleString(),
          `৳${it.issueAvgCostRate.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          `৳${it.returnValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          it.condition,
        ]),
      summaryCards: [
        { label: "Total Returned Qty", value: `${currentTotalReturnQty.toLocaleString()} units` },
        { label: "Accepted Return Value", value: `৳${currentPhysicalReturnValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
        { label: "Remaining Loan Value", value: `৳${remainingLoanValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
      ],
      signatures: [
        { title: "Returned By (Borrower)", name: activeLoan?.borrowerName || "Borrower", date: returnDate },
        { title: "Store Receiving Officer", name: receivedBy, date: returnDate },
        { title: "Authorized In-Charge", name: "Executive Approver", date: returnDate },
      ],
    };
  }, [
    returnId,
    returnDate,
    activeLoan,
    receivingStore,
    receivedBy,
    returnItems,
    currentTotalReturnQty,
    currentPhysicalReturnValue,
    remainingLoanValue,
  ]);

  return (
    <div className="min-h-screen flex bg-slate-100/70 text-slate-800">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <Link
                to="/inv-loan-return-list"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back to Return Register"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    {isViewMode ? "View Physical Loan Return" : "New Loan Return — Physical Item Entry"}
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {returnId}
                  </span>
                  {isViewMode && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Read-Only
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record physical material return against active Loan Issue with frozen issue-time valuation.
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
                Preview Return
              </button>

              {!isViewMode && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSaveReturn("Draft")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    <Save className="size-3.5" />
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveReturn("Confirmed")}
                    disabled={validationErrors.length > 0}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="size-3.5" />
                    Confirm Return
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Validation Notice */}
          {!isViewMode && validationErrors.length > 0 && currentTotalReturnQty > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-rose-800 block">Please correct the following:</span>
                <ul className="list-disc list-inside text-xs text-rose-700 mt-1 space-y-0.5">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section 5.5: Physical Return Valuation Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Original Loan Value</span>
              <span className="text-base font-black text-slate-800 font-mono mt-1 block">
                ৳{originalLoanValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Prev Physical Return</span>
              <span className="text-base font-bold text-slate-700 font-mono mt-1 block">
                ৳{previousPhysicalReturnValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 shadow-xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Current Return Value</span>
              <span className="text-base font-black text-emerald-700 font-mono mt-1 block">
                +৳{currentPhysicalReturnValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Physical Return</span>
              <span className="text-base font-bold text-indigo-700 font-mono mt-1 block">
                ৳{totalPhysicalReturnValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Prev Monetary Recovery</span>
              <span className="text-base font-bold text-amber-700 font-mono mt-1 block">
                ৳{previousMonetaryRecovery.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 shadow-xs">
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Remaining Loan Value</span>
              <span className="text-base font-black text-indigo-950 font-mono mt-1 block">
                ৳{remainingLoanValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Section 5.1: Loan Issue Association & Company Parameters */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building2 className="size-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                1. Loan Issue Association & Company Parameters
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Return ID */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Return ID (Auto-Generated)
                </label>
                <input
                  type="text"
                  readOnly
                  value={returnId}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-mono font-bold text-slate-700 cursor-not-allowed"
                />
              </div>

              {/* Return Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Return Date *
                </label>
                <input
                  type="date"
                  disabled={isViewMode}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Loan Issue Reference (Searchable Dropdown) */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Loan Issue Reference *
                </label>
                <select
                  disabled={isViewMode || Boolean(searchParams.returnId)}
                  value={selectedLoanIssueId}
                  onChange={(e) => setSelectedLoanIssueId(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {eligibleLoans.map((l) => (
                    <option key={l.id} value={l.loanIssueId || l.id}>
                      {l.loanIssueId} — {l.toCompany} (Issued: {l.issueDate || l.loanDate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Borrower / Employee */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Borrower / Employee (Auto)
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeLoan?.borrowerName || activeLoan?.requestedBy || "Store Manager"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 cursor-not-allowed"
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Department (Auto)
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeLoan?.department || "Central Inventory & Materials Supply"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 cursor-not-allowed"
                />
              </div>

              {/* Issuing Company */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Issuing Company (Lending)
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeLoan?.fromCompany || "—"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 cursor-not-allowed"
                />
              </div>

              {/* Issuing Store */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Issuing Store (Origin)
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeLoan?.fromStore || "—"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 cursor-not-allowed"
                />
              </div>

              {/* Receiving Store * */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Receiving Store (Inward Store) *
                </label>
                <select
                  disabled={isViewMode}
                  value={receivingStore}
                  onChange={(e) => setReceivingStore(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {warehouses
                    .filter((w) => w.status === "Active")
                    .map((w) => {
                      const sName = w.storeName || w.name;
                      return (
                        <option key={w.id} value={sName}>
                          {sName} ({w.storeCode || w.id})
                        </option>
                      );
                    })}
                </select>
              </div>

              {/* Received By * */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Received By (Store Officer) *
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Remarks */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Remarks / Return Instructions
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  placeholder="Optional notes regarding physical container, verification, or QC condition..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 5.2: Issued Items & Physical Return Allocation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="size-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  2. Issued Items & Physical Return Allocation
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Loan Issue: <strong className="text-slate-800 font-mono">{activeLoan?.loanIssueId}</strong>
              </span>
            </div>

            {hasInspectionItems && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3 text-xs">
                <ShieldAlert className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Items Marked Damaged or Non-Usable</span>
                  <span>
                    Per Section 5.3 policy, damaged or non-usable returns are not automatically credited to the loan financial balance or inventory stock. They are held for formal technical inspection and QC approval.
                  </span>
                </div>
              </div>
            )}

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[460px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200 whitespace-nowrap">
                    <tr>
                      <th className="py-3 px-3 text-center w-10">SL</th>
                      <th className="py-3 px-3 min-w-[200px]">Item Description & Code</th>
                      <th className="py-3 px-2 text-center w-16">UOM</th>
                      <th className="py-3 px-3 text-right w-24">Original Qty</th>
                      <th className="py-3 px-3 text-right w-24 text-slate-500">Prev Returned</th>
                      <th className="py-3 px-3 text-right w-28 text-indigo-700 font-bold">Remaining Qty</th>
                      <th className="py-3 px-3 text-right w-32 bg-slate-100 text-slate-800 font-bold">
                        Avg Cost Rate
                      </th>
                      <th className="py-3 px-3 text-right w-32 bg-emerald-50/70 text-emerald-900 font-black">
                        Return Qty *
                      </th>
                      <th className="py-3 px-3 text-right w-32 bg-emerald-50/70 text-emerald-900 font-black">
                        Return Value
                      </th>
                      <th className="py-3 px-3 text-center w-36">Item Condition *</th>
                      <th className="py-3 px-3 text-center w-28">Store Inward</th>
                      <th className="py-3 px-3 min-w-[140px]">Row Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {returnItems.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="py-8 text-center text-slate-400">
                          No items loaded for this loan return.
                        </td>
                      </tr>
                    ) : (
                      returnItems.map((row, rIdx) => {
                        const isOverRemaining = row.returnQty > row.remainingIssuedQty;
                        const isDamaged = row.condition !== "Good";
                        const trackingMode = getItemTrackingMode(row.itemCode, catalogItems);

                        return (
                          <tr
                            key={row.id}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isOverRemaining ? "bg-rose-50/40" : isDamaged ? "bg-amber-50/30" : ""
                            }`}
                          >
                            <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                              {rIdx + 1}
                            </td>

                            {/* Item Desc & Code */}
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-800 block">
                                {row.itemName}
                              </span>
                              <span className="font-mono text-[11px] text-indigo-600 block">
                                {row.itemCode}
                              </span>
                            </td>

                            {/* UOM */}
                            <td className="py-3 px-2 text-center font-mono font-semibold text-slate-700">
                              {row.uom}
                            </td>

                            {/* Original Issued Quantity */}
                            <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                              {row.originalIssuedQty.toLocaleString()}
                            </td>

                            {/* Previously Returned Qty */}
                            <td className="py-3 px-3 text-right font-mono text-slate-500">
                              {row.previouslyReturnedQty.toLocaleString()}
                            </td>

                            {/* Remaining Issued Qty */}
                            <td className="py-3 px-3 text-right font-mono font-black text-indigo-700">
                              {row.remainingIssuedQty.toLocaleString()}
                            </td>

                            {/* Issue-time Average Cost Rate */}
                            <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800 bg-slate-50/60">
                              ৳{row.issueAvgCostRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>

                            {/* Return Qty Input */}
                            <td className="py-3 px-3 text-right bg-emerald-50/30">
                              {isViewMode ? (
                                <span className="font-mono font-black text-xs text-emerald-800">
                                  {row.returnQty.toLocaleString()}
                                </span>
                              ) : (
                                <div className="flex flex-col items-end gap-0.5">
                                  <input
                                    type="number"
                                    min="0"
                                    max={row.remainingIssuedQty}
                                    value={row.returnQty || ""}
                                    placeholder="0"
                                    onChange={(e) => handleItemQtyChange(row.id, e.target.value)}
                                    className={`w-24 h-8 px-2 text-right font-mono font-bold text-xs rounded-lg border outline-none transition-colors ${
                                      isOverRemaining
                                        ? "border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20"
                                        : "border-slate-300 bg-white text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    }`}
                                  />
                                  <span className="text-[9.5px] font-semibold text-slate-400">
                                    Eligible: {row.remainingIssuedQty}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Return Value */}
                            <td className="py-3 px-3 text-right font-mono font-black text-emerald-800 bg-emerald-50/30">
                              {row.condition === "Good" ? (
                                `৳${row.returnValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              ) : (
                                <div title="Held pending QC valuation approval">
                                  <span className="line-through text-slate-400 block text-[11px]">
                                    ৳{row.returnValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </span>
                                  <span className="text-[9.5px] font-semibold text-amber-700">
                                    QC Hold
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Item Condition (Section 5.3) */}
                            <td className="py-3 px-3 text-center">
                              {isViewMode ? (
                                <span
                                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                    row.condition === "Good"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-amber-50 text-amber-700 border border-amber-200"
                                  }`}
                                >
                                  {row.condition}
                                </span>
                              ) : (
                                <select
                                  value={row.condition}
                                  onChange={(e) =>
                                    handleItemConditionChange(row.id, e.target.value as StockLoanReturnCondition)
                                  }
                                  className={`h-8 px-2 rounded-lg border text-xs font-semibold outline-none ${
                                    row.condition === "Good"
                                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                      : "border-amber-300 bg-amber-50 text-amber-800"
                                  }`}
                                >
                                  <option value="Good">Good (Accepted)</option>
                                  <option value="Damaged">Damaged (Hold)</option>
                                  <option value="Non-Usable">Non-Usable (Hold)</option>
                                </select>
                              )}
                            </td>

                            {/* Store Inward Allocation (Section 5.4) */}
                            <td className="py-3 px-3 text-center">
                              <ItemTrackingCell
                                trackingMode={trackingMode}
                                mode={trackingMode}
                                batchAllocations={row.batchAllocations}
                                locationAllocations={row.locationAllocations}
                                onOpenModal={() => openTrackingModal(row)}
                                disabled={isViewMode || row.returnQty <= 0}
                              />
                            </td>

                            {/* Row Remarks */}
                            <td className="py-3 px-3">
                              {isViewMode ? (
                                <span className="text-slate-600 text-xs">{row.remarks || "—"}</span>
                              ) : (
                                <input
                                  type="text"
                                  placeholder="Item condition remarks..."
                                  value={row.remarks || ""}
                                  onChange={(e) => handleItemRemarksChange(row.id, e.target.value)}
                                  className="w-full h-8 px-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 focus:bg-white outline-none"
                                />
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Summary Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Physical Return Totals & Inward Valuation
              </span>
              <div className="flex flex-wrap items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Total Return Qty: </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {currentTotalReturnQty.toLocaleString()} units
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Accepted Value: </span>
                  <span className="font-black text-emerald-700 font-mono">
                    ৳{currentPhysicalReturnValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Remaining Loan Value: </span>
                  <span className="font-black text-indigo-700 font-mono">
                    ৳{remainingLoanValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Allocation Modal */}
        {locationModalOpen && activeTrackingItem && (
          <LocationAllocationModal
            isOpen={true}
            onClose={() => setLocationModalOpen(false)}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            transactionQty={activeTrackingItem.returnQty}
            uom={activeTrackingItem.uom}
            currentStore={receivingStore}
            initialEntries={activeTrackingItem.locationAllocations}
            onSave={handleSaveLocationAllocations}
          />
        )}

        {/* Batch Allocation Modal */}
        {batchModalOpen && activeTrackingItem && (
          <BatchAllocationModal
            isOpen={true}
            onClose={() => setBatchModalOpen(false)}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            transactionQty={activeTrackingItem.returnQty}
            uom={activeTrackingItem.uom}
            currentStore={receivingStore}
            initialEntries={activeTrackingItem.batchAllocations}
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
