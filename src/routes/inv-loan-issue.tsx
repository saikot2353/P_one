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
} from "lucide-react";
import { toast } from "sonner";
import {
  StockLoanIssue,
  StockLoanIssueItem,
  LoanReasonType,
  LoanType,
  StockLoanRequisition,
  MASTER_COMPANIES,
  getStoredStockLoanIssues,
  saveStockLoanIssue,
  getStoredStockLoanRequisitions,
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

export const Route = createFileRoute("/inv-loan-issue")({
  validateSearch: (
    search: Record<string, unknown>
  ): { loanIssueId?: string; reqId?: string; mode?: "view" | "edit"; type?: string } => ({
    loanIssueId: search.loanIssueId as string | undefined,
    reqId: search.reqId as string | undefined,
    mode: search.mode as "view" | "edit" | undefined,
    type: search.type as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Stock Loan Issue Entry — Inventory ERP" },
      {
        name: "description",
        content: "Stock loan issue fulfillment against approved loan requisitions with real-time stock and batch validation.",
      },
    ],
  }),
  component: StockLoanIssueFormPage,
});

function StockLoanIssueFormPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const isViewMode = searchParams.mode === "view";
  const editingLoanId = searchParams.loanIssueId;
  const incomingReqId = searchParams.reqId;

  const warehouses = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);
  const catalogItems = getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS);
  const storedReqs = useMemo(() => getStoredStockLoanRequisitions(), []);

  // Load existing loan if in edit/view mode
  const existingLoan = useMemo(() => {
    if (!editingLoanId) return null;
    const all = getStoredStockLoanIssues();
    return all.find((t) => t.id === editingLoanId || t.loanIssueId === editingLoanId) || null;
  }, [editingLoanId]);

  // Section 3.3: Automatically find the selected requisition from reqId passed via Loan Issue Register
  const loadedRequisition = useMemo(() => {
    if (!incomingReqId) return null;
    return (
      storedReqs.find(
        (r) => r.id === incomingReqId || r.requisitionNumber === incomingReqId
      ) || null
    );
  }, [incomingReqId, storedReqs]);

  // Internal Loan Issue identifier (preserved in background for database/storage integrity)
  const [loanIssueId] = useState<string>(() => {
    if (existingLoan) return existingLoan.loanIssueId;
    return `LI-2026-${String(Math.floor(100 + Math.random() * 900))}`;
  });

  // Section 3.4: Loan Requisition Number reference
  const [taggedReqNumber, setTaggedReqNumber] = useState<string>(() => {
    return (
      existingLoan?.loanRequisitionNumber ||
      loadedRequisition?.requisitionNumber ||
      ""
    );
  });

  const [taggedReqId, setTaggedReqId] = useState<string>(() => {
    return (
      existingLoan?.loanRequisitionId ||
      loadedRequisition?.id ||
      ""
    );
  });

  const [loanDate, setLoanDate] = useState<string>(() => {
    return existingLoan?.loanDate || new Date().toISOString().slice(0, 10);
  });

  const [loanReason, setLoanReason] = useState<LoanReasonType>(() => {
    return (existingLoan?.loanReason as LoanReasonType) || "Stock Replenishment";
  });

  const [reasonDetails, setReasonDetails] = useState<string>(() => {
    return existingLoan?.reasonDetails || "";
  });

  const [remarks, setRemarks] = useState<string>(() => {
    return existingLoan?.remarks || "";
  });

  // Source & Destination State
  const [fromCompany, setFromCompany] = useState<string>(() => {
    return (
      existingLoan?.fromCompany ||
      loadedRequisition?.requestedFromCompany ||
      "Pakiza Knit Composite Ltd"
    );
  });

  const [fromStore, setFromStore] = useState<string>(() => {
    return (
      existingLoan?.fromStore ||
      loadedRequisition?.requestedFromStore ||
      "PKCL Central Raw Material Warehouse"
    );
  });

  const [toCompany, setToCompany] = useState<string>(() => {
    return (
      existingLoan?.toCompany ||
      loadedRequisition?.requisitioningCompany ||
      "Pakiza Spinning Mills Ltd"
    );
  });

  const [toStore, setToStore] = useState<string>(() => {
    return (
      existingLoan?.toStore ||
      loadedRequisition?.requisitioningStore ||
      "Spinning Spare Parts & Consumables Store"
    );
  });

  const [loanType, setLoanType] = useState<LoanType>(() => {
    if (searchParams.type === "intra") return "Intra-Company";
    return (
      existingLoan?.loanType ||
      loadedRequisition?.loanType ||
      "Inter-Company"
    );
  });

  const [requestedBy] = useState<string>(() => {
    return existingLoan?.requestedBy || "Tahmid Afsar Shapno (Store Manager)";
  });

  // Loan Items State
  const [items, setItems] = useState<StockLoanIssueItem[]>(() => {
    if (existingLoan) return existingLoan.items;
    if (loadedRequisition) {
      return loadedRequisition.items.map((it, idx) => {
        const cat = catalogItems.find((c) => c.itemCode === it.itemCode);
        const availStock = cat?.maximumStock || it.availableStock || 1000;
        const qty = it.approvedQty ?? it.requiredQty;
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
          lrRequisitionQty: it.requiredQty,
          loanQty: qty,
          unitPrice: rate,
          totalValue: qty * rate,
          batchAllocations: [{ batchNumber: `BAT-${it.itemCode.slice(-4)}-01`, quantity: qty }],
          locationAllocations: [{ locationName: "General Bay 1", quantity: qty }],
          remarks: it.remarks || `Against LR #${loadedRequisition.requisitionNumber}`,
        };
      });
    }
    return [];
  });

  // Section 3.3: Automatic Data Population Effect when navigating or refreshing with reqId
  useEffect(() => {
    if (loadedRequisition && !existingLoan) {
      setTaggedReqNumber(loadedRequisition.requisitionNumber);
      setTaggedReqId(loadedRequisition.id);
      setLoanType(loadedRequisition.loanType);
      setFromCompany(loadedRequisition.requestedFromCompany);
      setFromStore(loadedRequisition.requestedFromStore);
      setToCompany(loadedRequisition.requisitioningCompany);
      setToStore(loadedRequisition.requisitioningStore);

      const mappedItems: StockLoanIssueItem[] = loadedRequisition.items.map((it, idx) => {
        const cat = catalogItems.find((c) => c.itemCode === it.itemCode);
        const availStock = cat?.maximumStock || it.availableStock || 1000;
        const qty = it.approvedQty ?? it.requiredQty;
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
          lrRequisitionQty: it.requiredQty,
          loanQty: qty,
          unitPrice: rate,
          totalValue: qty * rate,
          batchAllocations: [{ batchNumber: `BAT-${it.itemCode.slice(-4)}-01`, quantity: qty }],
          locationAllocations: [{ locationName: "General Bay 1", quantity: qty }],
          remarks: it.remarks || `Against LR #${loadedRequisition.requisitionNumber}`,
        };
      });

      if (mappedItems.length > 0) {
        setItems(mappedItems);
      }
    }
  }, [loadedRequisition, existingLoan, catalogItems]);

  // Filtered Stores
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

  // Modal State for Batch/Location
  const [activeTrackingItemId, setActiveTrackingItemId] = useState<string | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  const activeTrackingItem = useMemo(() => {
    return items.find((i) => i.id === activeTrackingItemId) || null;
  }, [items, activeTrackingItemId]);

  const openTrackingModal = (item: StockLoanIssueItem) => {
    if (isViewMode) return;
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
    setItems((prev) =>
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
    toast.success("Location allocations confirmed.");
  };

  const handleSaveBatchAllocations = (allocations: BatchEntry[]) => {
    if (!activeTrackingItemId) return;
    setItems((prev) =>
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
    toast.success("Batch allocations confirmed.");
  };

  const handleDeleteItem = (id: string) => {
    if (isViewMode) return;
    if (items.length === 1) {
      toast.error("At least one item must remain in the stock loan.");
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
    field: "loanQty" | "remarks",
    val: string
  ) => {
    if (isViewMode) return;
    setItems((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        if (field === "loanQty") {
          const num = Number(val) || 0;
          return {
            ...row,
            loanQty: num,
            totalValue: num * row.unitPrice,
          };
        }
        return { ...row, [field]: val };
      })
    );
  };

  // Summary Metrics
  const totalLoanQty = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.loanQty) || 0), 0);
  }, [items]);

  const totalLoanValue = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.totalValue) || 0), 0);
  }, [items]);

  // Validations (Section 3.1: Tagging requirement text removed)
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    if (loanReason === "Other" && !reasonDetails.trim()) {
      errs.push("Reason Details is mandatory when Loan Reason is 'Other'.");
    }
    if (items.length === 0) {
      errs.push("Please add at least one item to loan.");
    }

    items.forEach((it) => {
      if (it.loanQty <= 0) {
        errs.push(`${it.itemName}: Loan quantity must be greater than zero.`);
      }
      if (it.loanQty > it.availableStock) {
        errs.push(
          `${it.itemName}: Loan quantity (${it.loanQty}) exceeds available stock (${it.availableStock}).`
        );
      }
    });

    return errs;
  }, [loanReason, reasonDetails, items]);

  // Save / Submit Handlers
  const handleSaveLoan = (status: "Draft" | "Submitted") => {
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    const payload: StockLoanIssue = {
      id: existingLoan?.id || `ict-${Date.now()}`,
      loanIssueId,
      loanId: loanIssueId,
      issueDate: loanDate,
      loanDate,
      loanType,
      loanRequisitionNumber: taggedReqNumber || undefined,
      loanRequisitionId: taggedReqId || undefined,
      loanReason,
      reasonDetails: loanReason === "Other" ? reasonDetails : undefined,
      remarks,
      fromCompany,
      fromStore,
      toCompany,
      toStore,
      issuedBy: requestedBy,
      requestedBy,
      totalItems: items.length,
      totalLoanQty,
      totalValue: totalLoanValue,
      totalLoanValue,
      status,
      items,
      createdAt: existingLoan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveStockLoanIssue(payload);

    toast.success(
      status === "Draft"
        ? `Loan draft saved successfully for Requisition ${taggedReqNumber || loanIssueId}!`
        : `Stock Loan for Requisition ${taggedReqNumber || loanIssueId} issued successfully!`
    );

    navigate({ to: "/inv-loan-issue-list" });
  };

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);

  const previewReportData: StandardReportData = useMemo(() => {
    return {
      reportType: "stock-transfer",
      title: "Loan Issue Challan",
      reportTitle: "Official Preview Report — Loan Issue Challan",
      documentNumber: taggedReqNumber || loanIssueId,
      documentDate: loanDate,
      organizationName: fromCompany,
      metadata: [
        { label: "Loan Requisition No", value: taggedReqNumber || "—", highlight: true },
        { label: "Loan Date", value: loanDate },
        { label: "Lending Company", value: fromCompany },
        { label: "Lending Store", value: fromStore },
        { label: "Borrowing Company", value: toCompany },
        { label: "Borrowing Store", value: toStore },
        { label: "Loan Reason", value: loanReason },
        { label: "Authorized By", value: requestedBy },
      ],
      tableHeaders: [
        "SL",
        "Item Code",
        "Item Description",
        "UOM",
        "Loan Qty",
        "Remarks",
      ],
      tableRows: items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        it.loanQty.toLocaleString(),
        it.remarks || "-",
      ]),
      summaryCards: [
        { label: "Total Items", value: `${items.length}` },
        { label: "Total Loan Qty", value: `${totalLoanQty.toLocaleString()} units` },
      ],
      signatures: [
        { title: "Issued By", name: requestedBy, date: loanDate },
        { title: "Source Store In-Charge", name: "Store Manager", date: loanDate },
        { title: "Authorized Signatory", name: "Executive Approver", date: loanDate },
      ],
    };
  }, [
    fromCompany,
    toCompany,
    fromStore,
    toStore,
    loanIssueId,
    loanDate,
    taggedReqNumber,
    requestedBy,
    items,
    totalLoanQty,
    loanReason,
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
                to="/inv-loan-issue-list"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back to Loans List"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    {isViewMode ? "View Stock Loan Issue" : "Stock Loan Issue Entry"}
                  </h1>
                  {taggedReqNumber && (
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {taggedReqNumber}
                    </span>
                  )}
                  {isViewMode && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Mode: Read-Only
                    </span>
                  )}
                </div>
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
                    onClick={() => handleSaveLoan("Draft")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    <Save className="size-3.5" />
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveLoan("Submitted")}
                    disabled={validationErrors.length > 0}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    Issue Loan
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

          {/* Section 1: Loan Header & Route */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <ArrowLeftRight className="size-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Loan Header & Organizational Route
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Source and destination entities must be distinct
              </span>
            </div>

            {/* Section 3.2: Requisition Tagging Section removed completely */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Section 3.4: Loan Requisition Number reference displayed instead of separate Loan ID */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Loan Requisition Number
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={taggedReqNumber || "—"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-mono font-bold text-indigo-600 outline-none cursor-not-allowed"
                />
              </div>

              {/* Loan Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Loan Date *
                </label>
                <input
                  type="date"
                  disabled={isViewMode}
                  value={loanDate}
                  onChange={(e) => setLoanDate(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Loan Reason */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Loan Reason *
                </label>
                <select
                  disabled={isViewMode}
                  value={loanReason}
                  onChange={(e) => setLoanReason(e.target.value as LoanReasonType)}
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
                  Requested By (Authorized)
                </label>
                <input
                  type="text"
                  readOnly
                  value={requestedBy}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none cursor-not-allowed"
                />
              </div>

              {/* Reason Details (conditional) */}
              {loanReason === "Other" && (
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
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-blue-500 inline-block" />
                  Source (From) Organization & Store
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      From Company / Organization *
                    </label>
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
                            {sName} ({w.storeCode || w.id})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* DESTINATION (TO) SECTION */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 sm:col-span-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 inline-block" />
                  Destination (To) Organization & Store
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      To Company / Organization *
                    </label>
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
                            {sName} ({w.storeCode || w.id})
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
                  Overall Loan Remarks / Log Notes
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  placeholder="Optional loan notes or carrier transport instructions..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="size-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Loan Items & Batch / Location Matrix
                </h3>
              </div>
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
                      <th className="py-3 px-3 text-right w-28 text-slate-700">LR Requisition Qty</th>
                      <th className="py-3 px-3 text-right w-32 bg-indigo-50/50 text-indigo-900 font-black">
                        Loan Qty *
                      </th>
                      <th className="py-3 px-3 text-center w-28">Tracking (B/L)</th>
                      {!isViewMode && <th className="py-3 px-2 text-center w-12">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-400">
                          No items loaded for this loan requisition.
                        </td>
                      </tr>
                    ) : (
                      items.map((row, rIdx) => {
                        const isOverStock = row.loanQty > row.availableStock;
                        const trackingMode = getItemTrackingMode(row.itemCode, catalogItems);

                        return (
                          <tr
                            key={row.id}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isOverStock ? "bg-rose-50/30" : ""
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

                            {/* Specification */}
                            <td className="py-3 px-3 text-slate-600 text-[11px]">
                              {row.specification}
                            </td>

                            {/* Brand / Origin */}
                            <td className="py-3 px-3 text-slate-600 text-[11px]">
                              <div>{row.brand}</div>
                              <div className="text-[10px] text-slate-400">{row.origin}</div>
                            </td>

                            {/* UOM */}
                            <td className="py-3 px-2 text-center font-mono font-semibold text-slate-700">
                              {row.uom}
                            </td>

                            {/* Available Stock */}
                            <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                              {row.availableStock.toLocaleString()}
                            </td>

                            {/* LR Requisition Qty */}
                            <td className="py-3 px-3 text-right font-mono font-bold text-slate-600">
                              {row.lrRequisitionQty !== undefined ? row.lrRequisitionQty.toLocaleString() : "—"}
                            </td>

                            {/* Loan Qty */}
                            <td className="py-3 px-3 text-right bg-indigo-50/30">
                              {isViewMode ? (
                                <span className="font-mono font-black text-xs text-indigo-700">
                                  {row.loanQty.toLocaleString()}
                                </span>
                              ) : (
                                <div className="flex flex-col items-end gap-0.5">
                                  <input
                                    type="number"
                                    min="1"
                                    max={row.availableStock}
                                    value={row.loanQty}
                                    onChange={(e) =>
                                      handleItemFieldChange(row.id, "loanQty", e.target.value)
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
                Loan Dispatch Totals
              </span>
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Total Items: </span>
                  <span className="font-bold text-slate-900 font-mono">{items.length}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Total Loan Qty: </span>
                  <span className="font-bold text-indigo-700 font-mono">
                    {totalLoanQty.toLocaleString()} units
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
            transactionQty={activeTrackingItem.loanQty}
            uom={activeTrackingItem.uom}
            currentStore={fromStore}
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
            transactionQty={activeTrackingItem.loanQty}
            uom={activeTrackingItem.uom}
            currentStore={fromStore}
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
