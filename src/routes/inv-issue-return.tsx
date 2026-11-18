import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { toast } from "sonner";
import {
  RotateCcw,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  User,
  Layers,
  Printer,
  ChevronDown,
  Warehouse,
  PackageCheck,
  Check,
  Trash2,
  Eye,
  Edit,
} from "lucide-react";
import {
  MaterialIssue,
  StoreReturn,
  StoreReturnItem,
  getStoredMaterialIssues,
  getStoredStoreReturns,
  postStoreReturn,
  isIssueReturnable,
} from "@/lib/inventory-requisition-issue-data";
import { DEFAULT_ITEMS, ItemProductMaster, getStoredData } from "@/lib/procurement-master-data";
import { getItemTrackingMode } from "@/lib/item-tracking-utils";
import { SearchableSelect } from "@/components/ui/searchable-select";
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

interface IssueReturnSearch {
  issueId?: string;
  returnId?: string;
  mode?: "edit" | "view";
}

export const Route = createFileRoute("/inv-issue-return")({
  validateSearch: (search: Record<string, unknown>): IssueReturnSearch => {
    return {
      issueId: search.issueId as string | undefined,
      returnId: search.returnId as string | undefined,
      mode: search.mode as "edit" | "view" | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Return to Store — Inventory ERP" },
      {
        name: "description",
        content: "Process return of unused or excess materials back to store with automated stock replenishment.",
      },
    ],
  }),
  component: InvIssueReturnPage,
});

function InvIssueReturnPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const issues = useMemo(() => getStoredMaterialIssues(), []);
  const returns = useMemo(() => getStoredStoreReturns(), []);
  const catalogItems = useMemo(
    () => getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS),
    []
  );

  // Check if viewing or editing an existing Return slip
  const existingReturn = useMemo(() => {
    if (!searchParams.returnId) return null;
    return (
      returns.find(
        (r) => r.id === searchParams.returnId || r.returnNumber === searchParams.returnId
      ) || null
    );
  }, [searchParams.returnId, returns]);

  const isViewMode = searchParams.mode === "view";
  const isEditMode = searchParams.mode === "edit" || Boolean(existingReturn && !isViewMode);

  // Issues eligible for return (Strictly marked as returnable with returnable qty > 0)
  const eligibleIssues = useMemo(() => {
    return issues.filter((iss) => {
      if (!isIssueReturnable(iss)) return false;
      const returnable =
        iss.returnableQty !== undefined
          ? iss.returnableQty
          : Math.max(0, iss.totalIssueQty - (iss.previouslyReturnedQty || 0));
      return returnable > 0;
    });
  }, [issues]);

  const [selectedIssueId, setSelectedIssueId] = useState<string>(() => {
    if (existingReturn) return existingReturn.issueId;
    if (searchParams.issueId) {
      const match = issues.find((i) => i.id === searchParams.issueId || i.issueNumber === searchParams.issueId);
      if (match && isIssueReturnable(match)) return match.id;
    }
    if (eligibleIssues.length > 0) return eligibleIssues[0].id;
    return "";
  });

  const activeIssue = useMemo(() => {
    if (!selectedIssueId) return null;
    return (
      issues.find((i) => i.id === selectedIssueId || i.issueNumber === selectedIssueId) || null
    );
  }, [selectedIssueId, issues]);

  // Form Fields
  const [returnNumber] = useState<string>(() => {
    if (existingReturn) return existingReturn.returnNumber;
    return `RET-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
  });
  const [returnDate, setReturnDate] = useState<string>(() => {
    if (existingReturn) return existingReturn.returnDate;
    return new Date().toISOString().slice(0, 10);
  });
  const [remarks, setRemarks] = useState<string>(() => {
    if (existingReturn) return existingReturn.remarks || "";
    return "";
  });

  // Items State
  const [returnItems, setReturnItems] = useState<StoreReturnItem[]>([]);

  // Auto-populate when existingReturn or activeIssue changes
  useEffect(() => {
    if (existingReturn) {
      const items: StoreReturnItem[] = existingReturn.items.map((it, idx) => ({
        id: it.id || `sri-${Date.now()}-${idx}`,
        sl: idx + 1,
        issueItemId: it.issueItemId,
        itemCode: it.itemCode,
        itemName: it.itemName,
        specification: it.specification,
        uom: it.uom,
        originallyIssuedQty: it.originallyIssuedQty,
        previouslyReturnedQty: it.previouslyReturnedQty || 0,
        returnableQty: it.returnableQty || it.originallyIssuedQty,
        returnStore: it.returnStore || existingReturn.warehouseStore || "Central Store",
        returnQty: it.returnQty,
        returnCondition: it.returnCondition || "Good (Restock)",
        batchAllocations: it.batchAllocations || [],
        locationAllocations: it.locationAllocations || [],
        remarks: it.remarks || "",
      }));
      setReturnItems(items);
    } else if (activeIssue) {
      const items: StoreReturnItem[] = activeIssue.items.map((it, idx) => {
        const originallyIssued = Number(it.issueQty) || 0;
        const previouslyReturned = 0; // Per item base
        const returnable = Math.max(0, originallyIssued - previouslyReturned);

        return {
          id: `sri-${Date.now()}-${idx}`,
          sl: idx + 1,
          issueItemId: it.id,
          itemCode: it.itemCode,
          itemName: it.itemName,
          specification: it.specification,
          uom: it.uom,
          originallyIssuedQty: originallyIssued,
          previouslyReturnedQty: previouslyReturned,
          returnableQty: returnable,
          returnStore: it.issueStore || activeIssue.warehouseStore || "Central Store",
          returnQty: 0, // Defaults to 0 so user selects items to return
          returnCondition: "Good (Restock)",
          batchAllocations: it.batchAllocations || [],
          locationAllocations: it.locationAllocations || [],
          remarks: "",
        };
      });
      setReturnItems(items);
    } else {
      setReturnItems([]);
    }
  }, [existingReturn, activeIssue]);

  // Options for Searchable Material Issue ID select (Strictly returnable issues)
  const issueOptions = useMemo(() => {
    const optionsMap = new Map<string, string>();
    eligibleIssues.forEach((iss) => {
      if (isIssueReturnable(iss)) {
        optionsMap.set(iss.id, `${iss.issueNumber} — ${iss.issuedTo} (${iss.department})`);
      }
    });
    if (activeIssue && (existingReturn || isIssueReturnable(activeIssue)) && !optionsMap.has(activeIssue.id)) {
      optionsMap.set(
        activeIssue.id,
        `${activeIssue.issueNumber} — ${activeIssue.issuedTo} (${activeIssue.department})`
      );
    }
    return Array.from(optionsMap.entries()).map(([value, label]) => ({ value, label }));
  }, [eligibleIssues, activeIssue, existingReturn]);

  // Handle Return Qty Change with strict validation
  const handleReturnQtyChange = (id: string, newQtyStr: string) => {
    const qty = Number(newQtyStr) || 0;
    setReturnItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            returnQty: qty,
          };
        }
        return item;
      })
    );
  };

  const handleConditionChange = (
    id: string,
    condition: "Good (Restock)" | "Damaged (Scrap)" | "Defective (Vendor Return)"
  ) => {
    setReturnItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, returnCondition: condition } : item))
    );
  };

  // Tracking Modal State
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [activeTrackingItem, setActiveTrackingItem] = useState<StoreReturnItem | null>(null);

  const openTrackingModal = (item: StoreReturnItem) => {
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
    setReturnItems((prev) =>
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
    toast.success("Return location confirmed.");
  };

  const handleSaveBatchAllocations = (allocations: BatchEntry[]) => {
    if (!activeTrackingItem) return;
    setReturnItems((prev) =>
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
    toast.success("Return batch confirmed.");
  };

  const handleDeleteReturnItem = (id: string) => {
    setReturnItems((prev) => prev.filter((item) => item.id !== id));
    toast.info("Item removed from current return transaction.");
  };

  // Validation Checks
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!activeIssue) {
      errors.push("No Material Issue record selected.");
      return errors;
    }

    if (returnItems.length === 0) {
      errors.push("No items remaining in this return transaction.");
      return errors;
    }

    let hasNonZero = false;
    returnItems.forEach((it) => {
      if (it.returnQty > 0) hasNonZero = true;
      if (it.returnQty > it.originallyIssuedQty) {
        errors.push(
          `${it.itemName}: Return quantity (${it.returnQty}) cannot exceed original issued quantity (${it.originallyIssuedQty}).`
        );
      } else if (it.returnQty > it.returnableQty) {
        errors.push(
          `${it.itemName}: Return quantity (${it.returnQty}) exceeds returnable quantity (${it.returnableQty}).`
        );
      }
    });

    if (!hasNonZero) {
      errors.push("Please enter a return quantity greater than 0 for at least one item.");
    }
    return errors;
  }, [activeIssue, returnItems]);

  const totalReturnQuantity = useMemo(() => {
    return returnItems.reduce((acc, i) => acc + (Number(i.returnQty) || 0), 0);
  }, [returnItems]);

  // Post / Confirm Return
  const handlePostReturn = () => {
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }
    if (!activeIssue) return;

    const itemsToReturn = returnItems.filter((i) => i.returnQty > 0);

    const newReturn: StoreReturn = {
      id: existingReturn ? existingReturn.id : `ret-${Date.now()}`,
      returnNumber,
      issueId: activeIssue.id,
      issueNumber: activeIssue.issueNumber,
      mrId: activeIssue.mrId,
      mrNumber: activeIssue.mrNumber,
      returnDate,
      department: activeIssue.department,
      issuedTo: activeIssue.issuedTo,
      employeeId: activeIssue.employeeId || "EMP-00142",
      warehouseStore: activeIssue.warehouseStore,
      totalItems: itemsToReturn.length,
      totalReturnQty: totalReturnQuantity,
      receivedQty: existingReturn?.receivedQty || 0,
      status: existingReturn?.status || "Pending Receive",
      items: itemsToReturn,
      remarks,
    };

    // Records return for store receive queue and updates issue returnable balance
    postStoreReturn(newReturn);

    toast.success(
      existingReturn
        ? `Return to Store ${returnNumber} updated successfully!`
        : `Return to Store ${returnNumber} submitted for store receive! Issue returnable balance updated.`
    );
    navigate({ to: "/inv-return-to-store-list" });
  };

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      companyName: "Pakiza Knit Composite Ltd",
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "RETURN TO STORE RECEIPT NOTE",
      reportNumber: returnNumber,
      reportDate: returnDate,
      statusBadge: "Posted",
      metaFields: [
        { label: "Material Issue ID", value: activeIssue?.issueNumber || "-" },
        { label: "Material Requisition ID", value: activeIssue?.mrNumber || "-" },
        { label: "Department", value: activeIssue?.department || "-" },
        { label: "Returned By (Employee)", value: activeIssue?.issuedTo || "-" },
        { label: "Employee ID", value: activeIssue?.employeeId || "EMP-00142" },
        { label: "Receiving Warehouse / Store", value: activeIssue?.warehouseStore || "-" },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "ITEM DESCRIPTION",
        "UOM",
        "ORIGINAL ISSUED",
        "RETURNABLE QTY",
        "RETURN QTY",
        "CONDITION",
        "REMARKS",
      ],
      tableRows: returnItems
        .filter((i) => i.returnQty > 0)
        .map((it, idx) => [
          String(idx + 1),
          it.itemCode,
          it.itemName,
          it.uom,
          String(it.originallyIssuedQty),
          String(it.returnableQty),
          String(it.returnQty),
          it.returnCondition,
          it.remarks || "-",
        ]),
      summaryCards: [
        {
          label: "Total Returned Items",
          value: String(returnItems.filter((i) => i.returnQty > 0).length),
        },
        { label: "Total Return Qty", value: String(totalReturnQuantity) },
      ],
      notes: [
        `Materials returned against Issue ${activeIssue?.issueNumber}.`,
        "Good condition materials added back to active warehouse stock ledger.",
      ],
      signatures: [
        { title: "Returned By (Employee)", name: activeIssue?.issuedTo || "Employee", date: returnDate },
        { title: "Store Verified By", name: "Warehouse Store In-Charge", date: returnDate },
      ],
    };
  }, [activeIssue, returnNumber, returnDate, returnItems, totalReturnQuantity]);

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
                to="/inv-return-to-store-list"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back to Return to Store List"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    {isViewMode
                      ? "Return to Store (View Only)"
                      : isEditMode
                      ? "Edit Return to Store"
                      : "Return to Store Entry"}
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                    {returnNumber}
                  </span>
                  {activeIssue && (
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Against Issue {activeIssue.issueNumber}
                    </span>
                  )}
                  {isViewMode && (
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                      View-Only Mode
                    </span>
                  )}
                  {isEditMode && (
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-300">
                      Editable Mode
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {isViewMode
                    ? "View-only inspection of store return transaction"
                    : "Return unconsumed materials back to store with automated stock replenishment"}
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

              {isViewMode ? (
                <>
                  {existingReturn && (
                    <Link
                      to="/inv-issue-return"
                      search={{ returnId: existingReturn.id, issueId: existingReturn.issueId, mode: "edit" }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <Edit className="size-3.5" />
                      Edit Return
                    </Link>
                  )}
                  <Link
                    to="/inv-return-to-store-list"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <ArrowLeft className="size-4" />
                    Back to List
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handlePostReturn}
                  disabled={validationErrors.length > 0}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="size-4" />
                  {existingReturn ? "Save & Update Return" : "Confirm & Post Return"}
                </button>
              )}
            </div>
          </div>

          {/* Validation Notice */}
          {!isViewMode && validationErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">
                  Cannot Post Return (Rule Violations):
                </h4>
                <ul className="text-xs text-rose-700 mt-1 list-disc list-inside space-y-0.5 font-medium">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section 1: Auto-Loaded Issue Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Building2 className="size-4 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Material Issue & Return Information
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {activeIssue ? "Auto-loaded from selected Material Issue" : "Select an Issue record"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Select Issue Dropdown (Searchable) */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Material Issue ID *
                </label>
                <SearchableSelect
                  options={issueOptions}
                  value={selectedIssueId}
                  onChange={(val) => !isViewMode && setSelectedIssueId(val)}
                  placeholder="Search Material Issue ID..."
                  disabled={isViewMode}
                  className="w-full text-xs font-mono font-bold text-indigo-600"
                />
              </div>

              {/* MR ID */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Material Requisition ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeIssue?.mrNumber || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-mono font-bold text-blue-600 cursor-not-allowed outline-none"
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
                  value={activeIssue?.department || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-800 cursor-not-allowed outline-none"
                />
              </div>

              {/* Employee / Issued To */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Issued To (Responsible Employee)
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeIssue?.issuedTo || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 cursor-not-allowed outline-none"
                />
              </div>

              {/* Employee ID */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeIssue?.employeeId || "EMP-00142"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-mono text-slate-600 cursor-not-allowed outline-none"
                />
              </div>

              {/* Return Store */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Return Store
                </label>
                <input
                  type="text"
                  readOnly
                  value={activeIssue?.warehouseStore || "-"}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 cursor-not-allowed outline-none"
                />
              </div>

              {/* Return Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Return Date *
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  disabled={isViewMode}
                  readOnly={isViewMode}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Remarks */}
              <div className="sm:col-span-2 md:col-span-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Remarks
                </label>
                <input
                  type="text"
                  placeholder="Enter overall return remarks or reason..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  disabled={isViewMode}
                  readOnly={isViewMode}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Return Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="size-4 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Issued Items & Return Quantities
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-3 px-3 text-center w-10">SL</th>
                    <th className="py-3 px-3">Item Code</th>
                    <th className="py-3 px-3">Item Description</th>
                    <th className="py-3 px-3">Return Store</th>
                    <th className="py-3 px-3 text-center w-16">UOM</th>
                    <th className="py-3 px-3 text-right w-24">Issued</th>
                    <th className="py-3 px-3 text-right w-24">Prev Returned</th>
                    <th className="py-3 px-3 text-right w-28 text-emerald-700">Returnable Qty</th>
                    <th className="py-3 px-3 text-right w-32 bg-orange-50/60 font-black text-orange-900">
                      Return Qty *
                    </th>
                    {!isViewMode && <th className="py-3 px-3 text-center w-16">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {returnItems.length === 0 ? (
                    <tr>
                      <td colSpan={isViewMode ? 9 : 10} className="py-10 text-center text-slate-400">
                        No issued items loaded. Please select a Material Issue above.
                      </td>
                    </tr>
                  ) : (
                    returnItems.map((item, idx) => {
                      const isOverOriginal = item.returnQty > item.originallyIssuedQty;
                      const isOverReturnable = item.returnQty > item.returnableQty;
                      const hasError = isOverOriginal || isOverReturnable;

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
                          <td className="py-3 px-3 font-semibold text-slate-700 text-xs">
                            {item.returnStore || activeIssue?.warehouseStore || "-"}
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-slate-600">
                            {item.uom}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                            {item.originallyIssuedQty.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-slate-500">
                            {item.previouslyReturnedQty.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                            {item.returnableQty.toLocaleString()}
                          </td>

                          {/* Return Quantity Input */}
                          <td className="py-3 px-3 text-right bg-orange-50/30">
                            <div className="flex flex-col items-end gap-1">
                              <input
                                type="number"
                                min="0"
                                max={item.originallyIssuedQty}
                                value={item.returnQty}
                                readOnly={isViewMode}
                                disabled={isViewMode}
                                onChange={(e) => handleReturnQtyChange(item.id, e.target.value)}
                                className={`w-24 h-7 rounded border px-2 text-right font-mono font-bold text-xs outline-none transition-all disabled:bg-slate-100 disabled:text-slate-700 ${
                                  hasError
                                    ? "border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20"
                                    : "border-orange-300 bg-white text-orange-900 focus:ring-2 focus:ring-orange-500/20"
                                }`}
                              />
                              {!isViewMode && (
                                <span className="text-[9.5px] font-semibold text-slate-400">
                                  Max: {item.originallyIssuedQty}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Delete Item Action */}
                          {!isViewMode && (
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                title="Remove item from this return"
                                onClick={() => handleDeleteReturnItem(item.id)}
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
        </div>

        {/* Location Allocation Modal */}
        {activeTrackingItem && (
          <LocationAllocationModal
            isOpen={locationModalOpen}
            onClose={() => setLocationModalOpen(false)}
            storeName={activeIssue?.warehouseStore || "Central Warehouse"}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            totalTransactionQty={activeTrackingItem.returnQty}
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
            storeName={activeIssue?.warehouseStore || "Central Warehouse"}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            totalTransactionQty={activeTrackingItem.returnQty}
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
