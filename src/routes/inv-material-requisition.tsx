import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Trash2,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Save,
  Send,
  Eye,
  Printer,
  ChevronDown,
  Warehouse,
  User,
  ShoppingBag,
  Clock,
  RotateCcw,
  XCircle,
  Paperclip,
  Check,
  AlertCircle,
  Layers,
} from "lucide-react";
import {
  MaterialRequisition,
  MRItem,
  getStoredMaterialRequisitions,
  setStoredMaterialRequisitions,
  getAvailableStockForItem,
  MRStatus,
  MRPriority,
} from "@/lib/inventory-requisition-issue-data";
import {
  DEFAULT_WAREHOUSES,
  DEFAULT_ITEMS,
  ItemProductMaster,
  WarehouseStore,
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

const COMPANY_AVAILABLE_STOCK_POLICIES_KEY = "cripton_company_stock_policies_v1";
const DEFAULT_COMPANY_STOCK_POLICIES: Record<string, boolean> = {
  "Pakiza Knit Composite Ltd": true,
  "Pakiza Cotton Mills Ltd": true,
  "Pakiza Apparels Ltd": true,
  "Pakiza Woven Composite Ltd": true,
};

interface MRSearch {
  action?: "create" | "edit" | "view" | "approve";
  id?: string;
}

export const Route = createFileRoute("/inv-material-requisition")({
  validateSearch: (search: Record<string, unknown>): MRSearch => {
    return {
      action: search.action as any,
      id: search.id as string | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Material Requisition — Inventory ERP" },
      { name: "description", content: "Create and process Material Requisitions with live stock tracking and shortage detection." },
    ],
  }),
  component: MaterialRequisitionPage,
});

function MaterialRequisitionPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const [requisitions, setRequisitions] = useState<MaterialRequisition[]>(() =>
    getStoredMaterialRequisitions()
  );

  useEffect(() => {
    setStoredMaterialRequisitions(requisitions);
  }, [requisitions]);

  const rawWarehouses = getStoredData<WarehouseStore[]>("proc_warehouses_v2", DEFAULT_WAREHOUSES);
  const warehouses = useMemo(() => {
    const list = rawWarehouses && rawWarehouses.length > 0 ? rawWarehouses : DEFAULT_WAREHOUSES;
    return list.map((w) => ({
      ...w,
      storeName: w.storeName || (w as any).name || w.storeCode,
      name: w.storeName || (w as any).name || w.storeCode,
    }));
  }, [rawWarehouses]);
  const catalogItems = getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS);

  const mode = searchParams.action || "create";
  const targetId = searchParams.id;

  const currentMR = useMemo(() => {
    if (targetId) {
      return requisitions.find((r) => r.id === targetId) || null;
    }
    return null;
  }, [targetId, requisitions]);

  // Form Fields State
  const [mrNumber, setMrNumber] = useState<string>(() => {
    if (currentMR) return currentMR.mrNumber;
    return `MR-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
  });
  const [requisitionDate, setRequisitionDate] = useState<string>(() => {
    if (currentMR) return currentMR.requisitionDate;
    return new Date().toISOString().slice(0, 10);
  });
  const [organization, setOrganization] = useState<string>(() => {
    if (currentMR) return currentMR.organization;
    return "Pakiza Knit Composite Ltd";
  });

  // Company-wise Policy for Available Stock
  const [companyStockPolicies, setCompanyStockPolicies] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(COMPANY_AVAILABLE_STOCK_POLICIES_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_COMPANY_STOCK_POLICIES;
    } catch {
      return DEFAULT_COMPANY_STOCK_POLICIES;
    }
  });

  const isAvailableStockPolicyEnabled = companyStockPolicies[organization] ?? true;

  const handleToggleCompanyPolicy = () => {
    const next = !isAvailableStockPolicyEnabled;
    const updated = { ...companyStockPolicies, [organization]: next };
    setCompanyStockPolicies(updated);
    try {
      localStorage.setItem(COMPANY_AVAILABLE_STOCK_POLICIES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    toast.info(`Available Stock display ${next ? "ENABLED" : "DISABLED"} for "${organization}".`);
  };
  const [department, setDepartment] = useState<string>(() => {
    if (currentMR) return currentMR.department;
    return "Production (Knitting)";
  });
  const [requestedBy, setRequestedBy] = useState<string>(() => {
    if (currentMR) return currentMR.requestedBy;
    return "Md. Anik Islam (Deputy Manager)";
  });
  const [requesterDesignation, setRequesterDesignation] = useState<string>(() => {
    if (currentMR) return currentMR.requesterDesignation || "";
    return "Deputy Manager (Knitting)";
  });
  const [requiredDate, setRequiredDate] = useState<string>(() => {
    if (currentMR) return currentMR.requiredDate;
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().slice(0, 10);
  });
  const [priority, setPriority] = useState<MRPriority>(() => {
    if (currentMR) return currentMR.priority;
    return "Urgent";
  });
  const [warehouseStore, setWarehouseStore] = useState<string>(() => {
    if (currentMR && currentMR.warehouseStore) return currentMR.warehouseStore;
    return warehouses[0]?.storeName || "PKCL Central Raw Material Warehouse";
  });
  const [purpose, setPurpose] = useState<string>(() => {
    if (currentMR) return currentMR.purpose || "";
    return "";
  });
  const [remarks, setRemarks] = useState<string>(() => {
    if (currentMR) return currentMR.remarks || "";
    return "";
  });

  // Items State
  const [items, setItems] = useState<MRItem[]>(() => {
    if (currentMR && currentMR.items) return currentMR.items;
    return [];
  });

  // Keep form in sync when currentMR changes
  useEffect(() => {
    if (currentMR) {
      setMrNumber(currentMR.mrNumber);
      setRequisitionDate(currentMR.requisitionDate);
      setOrganization(currentMR.organization);
      setDepartment(currentMR.department);
      setRequestedBy(currentMR.requestedBy);
      setRequesterDesignation(currentMR.requesterDesignation || "");
      setRequiredDate(currentMR.requiredDate);
      setPriority(currentMR.priority);
      setWarehouseStore(currentMR.warehouseStore);
      setPurpose(currentMR.purpose || "");
      setRemarks(currentMR.remarks || "");
      setItems(currentMR.items || []);
    }
  }, [currentMR]);

  // Recalculate available stock and shortage whenever warehouseStore changes
  const refreshStockAndShortages = (itemsList: MRItem[], store: string) => {
    return itemsList.map((item) => {
      const stock = getAvailableStockForItem(store, item.itemCode);
      const reqQty = Number(item.requestedQuantity) || 0;
      const shortage = Math.max(0, reqQty - stock);
      return {
        ...item,
        availableStock: stock,
        shortageQuantity: shortage,
      };
    });
  };

  const handleWarehouseChange = (newStore: string) => {
    setWarehouseStore(newStore);
    setItems((prev) =>
      prev.map((item) => {
        const storeToUse = item.requisitionStore || newStore;
        const stock = getAvailableStockForItem(storeToUse, item.itemCode);
        const reqQty = Number(item.requestedQuantity) || 0;
        return {
          ...item,
          requisitionStore: storeToUse,
          availableStock: stock,
          shortageQuantity: Math.max(0, reqQty - stock),
        };
      })
    );
  };

  // Item Search Modal State (same item selection structure as Purchase Requisition)
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState("");

  const handleSelectItemFromModal = (cat: ItemProductMaster) => {
    // Prevent duplicate items within a single Material Request
    const isDuplicate = items.some(
      (item) => item.itemId === cat.id || item.itemCode === cat.itemCode
    );
    if (isDuplicate) {
      toast.error(`Item "${cat.itemName}" (${cat.itemCode}) has already been added to this requisition.`);
      return;
    }

    const store = warehouseStore || warehouses[0]?.storeName || "PKCL Central Raw Material Warehouse";
    const stock = getAvailableStockForItem(store, cat.itemCode);
    const uomValue = cat.stockUOM || cat.purchaseUOM || (cat as any).uom || "PCS";

    const newItem: MRItem = {
      id: `mri-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      sl: items.length + 1,
      itemId: cat.id,
      itemCode: cat.itemCode,
      itemName: cat.itemName,
      specification: cat.specification || `${cat.brand || ""} ${cat.origin || ""}`.trim() || "-",
      brand: cat.brand || "-",
      origin: cat.origin || "-",
      requisitionStore: store,
      uom: uomValue,
      requestedQuantity: 1,
      availableStock: stock,
      issuedQuantity: 0,
      remainingQuantity: 1,
      shortageQuantity: Math.max(0, 1 - stock),
      remarks: "",
    };

    setItems((prev) => [...prev, newItem]);
    setItemSearchOpen(false);
    toast.success(`Added ${cat.itemName} (${uomValue}) to requisition.`);
  };

  const handleItemStoreChange = (id: string, newStore: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const stock = getAvailableStockForItem(newStore, item.itemCode);
          const reqQty = Number(item.requestedQuantity) || 0;
          return {
            ...item,
            requisitionStore: newStore,
            availableStock: stock,
            shortageQuantity: Math.max(0, reqQty - stock),
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    const updated = items
      .filter((i) => i.id !== id)
      .map((it, idx) => ({ ...it, sl: idx + 1 }));
    setItems(updated);
  };

  const handleQuantityChange = (id: string, newQtyStr: string) => {
    const newQty = Number(newQtyStr) || 0;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const shortage = Math.max(0, newQty - item.availableStock);
          return {
            ...item,
            requestedQuantity: newQty,
            remainingQuantity: newQty - (item.issuedQuantity || 0),
            shortageQuantity: shortage,
          };
        }
        return item;
      })
    );
  };

  // Tracking Modal State
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [activeTrackingItem, setActiveTrackingItem] = useState<MRItem | null>(null);

  const openTrackingModal = (item: MRItem) => {
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
    const locNames = allocations.map((a) => a.locationName).join(", ");
    setItems((prev) =>
      prev.map((it) => (it.id === activeTrackingItem.id ? { ...it, location: locNames } : it))
    );
    setLocationModalOpen(false);
    toast.success("Location allocations updated.");
  };

  const handleSaveBatchAllocations = (allocations: BatchEntry[]) => {
    if (!activeTrackingItem) return;
    const batchNames = allocations.map((b) => b.batchNumber).join(", ");
    setItems((prev) =>
      prev.map((it) => (it.id === activeTrackingItem.id ? { ...it, batchNumber: batchNames } : it))
    );
    setBatchModalOpen(false);
    toast.success("Batch allocations updated.");
  };

  // Shortage & Totals calculations
  const totalRequestedQty = useMemo(() => {
    return items.reduce((acc, i) => acc + (Number(i.requestedQuantity) || 0), 0);
  }, [items]);

  const totalIssuedQty = useMemo(() => {
    return items.reduce((acc, i) => acc + (Number(i.issuedQuantity) || 0), 0);
  }, [items]);

  const totalRemainingQty = useMemo(() => {
    return items.reduce((acc, i) => acc + (Number(i.remainingQuantity) || 0), 0);
  }, [items]);

  const totalShortageQty = useMemo(() => {
    return items.reduce((acc, i) => acc + (Number(i.shortageQuantity) || 0), 0);
  }, [items]);

  const hasShortage = totalShortageQty > 0;

  // Read-only checks
  const isReadOnly = mode === "view" || mode === "approve";

  // Approval Reason Modal State (Approve, Return, Reject)
  const [approvalModalAction, setApprovalModalAction] = useState<"Approve" | "Reject" | "Return" | null>(null);
  const [approvalComment, setApprovalComment] = useState("");

  // Approver Action Handlers
  const handleApprove = () => {
    setApprovalModalAction("Approve");
    setApprovalComment("");
  };

  const handleSave = (statusToSave: MRStatus) => {
    if (items.length === 0) {
      toast.error("Please add at least one item to the requisition.");
      return;
    }

    const newRecord: MaterialRequisition = {
      id: currentMR?.id || `MR-${Date.now()}`,
      mrNumber: mrNumber || `MR-${Date.now().toString().slice(-6)}`,
      requisitionDate,
      organization,
      department,
      requestedBy,
      requesterDesignation,
      requiredDate,
      priority,
      warehouseStore,
      purpose,
      remarks,
      items,
      totalItems: items.length,
      requestedQuantity: totalRequestedQty,
      issuedQuantity: totalIssuedQty,
      remainingQuantity: totalRemainingQty,
      shortageQuantity: totalShortageQty,
      status: statusToSave,
      createdDate: currentMR?.createdDate || new Date().toISOString().slice(0, 10),
      submittedDate: statusToSave === "Submitted" ? new Date().toISOString().slice(0, 10) : currentMR?.submittedDate,
      approvalHistory: currentMR?.approvalHistory || [
        {
          level: 1,
          approver: requestedBy || "Requester",
          designation: requesterDesignation || "Executive",
          action: statusToSave === "Submitted" ? "Submitted" : "Draft",
          dateTime: new Date().toISOString().replace("T", " ").slice(0, 16),
          remarks: remarks || (statusToSave === "Submitted" ? "Submitted for review" : "Draft saved"),
        },
      ],
    };

    const exists = requisitions.some((r) => r.id === newRecord.id);
    const updated = exists
      ? requisitions.map((r) => (r.id === newRecord.id ? newRecord : r))
      : [newRecord, ...requisitions];

    setRequisitions(updated);
    toast.success(
      statusToSave === "Submitted"
        ? "Material Requisition submitted successfully!"
        : "Material Requisition draft saved."
    );
    navigate({ to: "/inv-material-requisition-list" });
  };

  const handleConfirmApprovalModal = () => {
    if (!currentMR || !approvalModalAction) return;

    if (approvalModalAction === "Approve") {
      const updated = requisitions.map((r) => {
        if (r.id === currentMR.id) {
          return {
            ...r,
            status: "Approved" as MRStatus,
            approvedDate: new Date().toISOString().replace("T", " ").slice(0, 16),
            approvalHistory: [
              ...(r.approvalHistory || []),
              {
                level: (r.approvalHistory?.length || 0) + 1,
                approver: "Rafiqul Islam",
                designation: "Store Manager",
                action: "Approved" as const,
                dateTime: new Date().toISOString().replace("T", " ").slice(0, 16),
                remarks: approvalComment || "Approved for warehouse issue dispatch",
              },
            ],
          };
        }
        return r;
      });
      setRequisitions(updated);
      toast.success("Material Requisition approved! Now eligible for Material Issue.");
      setApprovalModalAction(null);
      setApprovalComment("");
      navigate({ to: "/inv-material-requisition-approval-list" });
      return;
    }

    if (!approvalComment.trim()) {
      toast.error(`Please enter comments for ${approvalModalAction === "Reject" ? "rejection" : "returning"}.`);
      return;
    }

    const isReject = approvalModalAction === "Reject";
    const newStatus: MRStatus = isReject ? "Rejected" : "Returned for Correction";

    const updated = requisitions.map((r) => {
      if (r.id === currentMR.id) {
        return {
          ...r,
          status: newStatus,
          rejectionReason: isReject ? approvalComment : undefined,
          returnReason: !isReject ? approvalComment : undefined,
          approvalHistory: [
            ...(r.approvalHistory || []),
            {
              level: (r.approvalHistory?.length || 0) + 1,
              approver: "Rafiqul Islam",
              designation: "Store Manager",
              action: (isReject ? "Rejected" : "Returned for Correction") as any,
              dateTime: new Date().toISOString().replace("T", " ").slice(0, 16),
              remarks: approvalComment,
            },
          ],
        };
      }
      return r;
    });

    setRequisitions(updated);
    toast.info(
      isReject
        ? "Material Requisition has been rejected."
        : "Material Requisition returned for requester correction."
    );
    setApprovalModalAction(null);
    setApprovalComment("");
    navigate({ to: "/inv-material-requisition-approval-list" });
  };

  // Preview Report
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      companyName: organization,
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "MATERIAL REQUISITION NOTE",
      reportNumber: mrNumber,
      reportDate: requisitionDate,
      statusBadge: currentMR?.status || "Draft",
      metaFields: [
        { label: "Department", value: department },
        { label: "Requested By", value: requestedBy },
        { label: "Required Date", value: requiredDate },
        { label: "Priority", value: priority },
        { label: "Warehouse / Store", value: warehouseStore },
        { label: "Purpose", value: purpose || "General Inventory Requisition" },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "ITEM DESCRIPTION",
        "SPECIFICATION",
        "UOM",
        "REQ QTY",
        "AVL STOCK",
        "SHORTAGE",
        "REMARKS",
      ],
      tableRows: items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.specification || "-",
        it.uom,
        String(it.requestedQuantity),
        String(it.availableStock),
        String(it.shortageQuantity),
        it.remarks || "-",
      ]),
      summaryCards: [
        { label: "Total Items", value: String(items.length) },
        { label: "Requested Qty", value: String(totalRequestedQty) },
        { label: "Issued Qty", value: String(totalIssuedQty) },
        { label: "Remaining Qty", value: String(totalRemainingQty) },
        { label: "Shortage Qty", value: String(totalShortageQty) },
      ],
      notes: [
        `Requisition Date: ${requisitionDate}`,
        hasShortage
          ? `CRITICAL SHORTAGE: ${totalShortageQty} units shortage identified. PR required.`
          : "Stock fully available in warehouse.",
      ],
      signatures: [
        { title: "Requested By", name: requestedBy, date: requisitionDate },
        {
          title: "Approved By",
          name: currentMR?.approvalHistory?.[0]?.approver || "Department Head",
          date: currentMR?.approvedDate || "-",
        },
        { title: "Store In-Charge", name: "Store Officer", date: "-" },
        { title: "Receiver Signature", name: "-", date: "-" },
      ],
    };
  }, [
    organization,
    mrNumber,
    requisitionDate,
    currentMR,
    department,
    requestedBy,
    requiredDate,
    priority,
    warehouseStore,
    purpose,
    items,
    totalRequestedQty,
    totalIssuedQty,
    totalRemainingQty,
    totalShortageQty,
    hasShortage,
  ]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <Link
                to="/inv-material-requisition-list"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back to Requisition List"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    {mode === "approve"
                      ? "Material Requisition Approval"
                      : mode === "view"
                      ? "View Material Requisition"
                      : mode === "edit"
                      ? "Edit Material Requisition"
                      : "Create Material Requisition"}
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {mrNumber}
                  </span>
                  {currentMR && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        currentMR.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : currentMR.status === "Submitted"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {currentMR.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Request materials from warehouse inventory with real-time stock & shortage checks
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setPreviewReportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors"
              >
                <Printer className="size-3.5 text-slate-600" />
                Preview Note
              </button>

              {/* Mode: APPROVE */}
              {mode === "approve" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setApprovalModalAction("Return");
                      setApprovalComment("");
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-colors"
                  >
                    <RotateCcw className="size-3.5" />
                    Return for Correction
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setApprovalModalAction("Reject");
                      setApprovalComment("");
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
                  >
                    <XCircle className="size-3.5" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="size-4" />
                    Approve Requisition
                  </button>
                </>
              )}

              {/* Mode: CREATE / EDIT */}
              {!isReadOnly && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSave("Draft")}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors"
                  >
                    <Save className="size-3.5 text-slate-600" />
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave("Submitted")}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
                  >
                    <Send className="size-3.5" />
                    Submit Requisition
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Shortage Warning Banner & PR Link (Only shown when Available Stock policy is enabled) */}
          {hasShortage && isAvailableStockPolicyEnabled && (
            <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Inventory Stock Shortage Detected ({totalShortageQty.toLocaleString()} units)
                  </h4>
                  <p className="text-xs text-amber-700/90 mt-0.5">
                    The requested quantity for one or more items exceeds currently available store
                    stock. You can raise a Purchase Requisition directly for procurement.
                  </p>
                </div>
              </div>

              <Link
                to="/procurement-purchase-requisition"
                search={{ action: "create" }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 whitespace-nowrap active:scale-95 transition-all"
              >
                <ShoppingBag className="size-4" />
                Generate Purchase Requisition (PR)
              </Link>
            </div>
          )}

          {/* Section 1: Requisition Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Building2 className="size-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Requisition & Department Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Organization / Company with Policy Indicator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Company / Organization *
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleCompanyPolicy}
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition cursor-pointer ${
                      isAvailableStockPolicyEnabled
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : "bg-slate-100 text-slate-600 border-slate-300"
                    }`}
                    title="Click to toggle Available Stock policy for this company"
                  >
                    Policy: {isAvailableStockPolicyEnabled ? "Stock ON" : "Stock OFF"}
                  </button>
                </div>
                <select
                  disabled={isReadOnly}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="Pakiza Knit Composite Ltd">Pakiza Knit Composite Ltd</option>
                  <option value="Pakiza Cotton Mills Ltd">Pakiza Cotton Mills Ltd</option>
                  <option value="Pakiza Spinning Mills Ltd">Pakiza Spinning Mills Ltd (Policy: Hidden)</option>
                  <option value="Pakiza Woven Fashion Ltd">Pakiza Woven Fashion Ltd (Policy: Hidden)</option>
                  <option value="Pakiza Apparels Ltd">Pakiza Apparels Ltd</option>
                </select>
              </div>

              {/* MR ID */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Requisition ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={mrNumber}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-mono font-bold text-blue-600 cursor-not-allowed outline-none"
                />
              </div>

              {/* Requisition Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Requisition Date *
                </label>
                <input
                  type="date"
                  disabled={isReadOnly}
                  value={requisitionDate}
                  onChange={(e) => setRequisitionDate(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Department (Non-editable, auto from logged-in user profile) */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  readOnly
                  value={department}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 cursor-not-allowed outline-none"
                />
              </div>

              {/* Requested By (Non-editable, auto from logged-in user profile) */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Requested By *
                </label>
                <input
                  type="text"
                  readOnly
                  value={requestedBy}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 cursor-not-allowed outline-none"
                />
              </div>

              {/* Required Date */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Required Date *
                </label>
                <input
                  type="date"
                  disabled={isReadOnly}
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Priority *
                </label>
                <select
                  disabled={isReadOnly}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as MRPriority)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="Critical">Critical</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Requisition Store (Active Stores) */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Requisition Store *
                </label>
                <select
                  disabled={isReadOnly}
                  value={warehouseStore}
                  onChange={(e) => handleWarehouseChange(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.storeName}>
                      {w.storeName} ({w.storeCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Purpose */}
              <div className="sm:col-span-2 md:col-span-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Requisition Purpose & Justification
                </label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  placeholder="Enter detailed purpose (e.g. Order #ORD-8820 yarn consumption batch)..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Requisition Items & Live Stock Checking */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="size-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Requisition Items & Stock Verification
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {items.length} item(s) in requisition
                </span>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Available Stock:</span>
                    <button
                      type="button"
                      onClick={handleToggleCompanyPolicy}
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border cursor-pointer transition ${
                        isAvailableStockPolicyEnabled
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {isAvailableStockPolicyEnabled ? "✓ Visible (Policy)" : "✕ Hidden (Policy)"}
                    </button>
                  </div>

                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setItemSearchQuery("");
                        setItemSearchOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Item</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-3 px-3 text-center w-10">SL</th>
                    <th className="py-3 px-3">Item Description</th>
                    <th className="py-3 px-3">Specification</th>
                    <th className="py-3 px-3">Brand / Origin</th>
                    <th className="py-3 px-3">Requisition Store</th>
                    <th className="py-3 px-3 text-center w-16">UOM</th>
                    {isAvailableStockPolicyEnabled && (
                      <th className="py-3 px-3 text-right w-28">Available Stock</th>
                    )}
                    <th className="py-3 px-3 text-right w-28">Requested Qty</th>
                    {!isReadOnly && <th className="py-3 px-3 text-center w-14">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={
                          isReadOnly
                            ? isAvailableStockPolicyEnabled
                              ? 8
                              : 7
                            : isAvailableStockPolicyEnabled
                              ? 9
                              : 8
                        }
                        className="py-10 text-center text-slate-400"
                      >
                        No requisition items added yet. Click &ldquo;Add Item&rdquo; above to select from catalog.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => {
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/70 transition-colors whitespace-nowrap"
                        >
                          <td className="py-3 px-3 text-center text-slate-400 font-mono text-[10px]">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-800">{item.itemName}</div>
                            <div className="font-mono text-[10px] text-blue-600">{item.itemCode}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-500 max-w-[200px] truncate" title={item.specification}>
                            {item.specification || "-"}
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {item.brand || "-"} / {item.origin || "-"}
                          </td>
                          <td className="py-3 px-3">
                            {isReadOnly ? (
                              <span className="font-medium text-slate-700">{item.requisitionStore || warehouseStore}</span>
                            ) : (
                              <select
                                value={item.requisitionStore || warehouseStore}
                                onChange={(e) => handleItemStoreChange(item.id, e.target.value)}
                                className="h-7 px-2 text-xs rounded border border-slate-200 bg-white font-medium outline-none focus:border-blue-500"
                              >
                                {warehouses.map((w) => (
                                  <option key={w.id} value={w.storeName}>
                                    {w.storeName}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                            {item.uom}
                          </td>
                          {isAvailableStockPolicyEnabled && (
                            <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                              {item.availableStock.toLocaleString()}
                            </td>
                          )}
                          <td className="py-3 px-3 text-right">
                            {isReadOnly ? (
                              <span className="font-mono font-bold text-slate-900">
                                {item.requestedQuantity.toLocaleString()}
                              </span>
                            ) : (
                              <input
                                type="number"
                                min="1"
                                value={item.requestedQuantity}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                className="w-20 h-7 rounded border border-slate-200 bg-white px-2 text-right font-mono font-bold text-xs outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            )}
                          </td>
                          {!isReadOnly && (
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-xs">
                    <td colSpan={4} className="py-3 px-4 text-slate-800">
                      Total Items: <span className="font-mono text-blue-600 ml-1">{items.length}</span>
                    </td>
                    <td colSpan={isReadOnly ? 4 : 5} className="py-3 px-4 text-right text-slate-800">
                      Total Requested Quantity: <span className="font-mono text-blue-600 ml-1">{totalRequestedQty.toLocaleString()}</span>
                    </td>
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
            storeName={warehouseStore}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            totalTransactionQty={activeTrackingItem.requestedQuantity}
            currentAllocations={
              activeTrackingItem.location
                ? [{ id: "1", locationName: activeTrackingItem.location, quantity: activeTrackingItem.requestedQuantity }]
                : []
            }
            onSave={handleSaveLocationAllocations}
          />
        )}

        {/* Batch Allocation Modal */}
        {activeTrackingItem && (
          <BatchAllocationModal
            isOpen={batchModalOpen}
            onClose={() => setBatchModalOpen(false)}
            storeName={warehouseStore}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            totalTransactionQty={activeTrackingItem.requestedQuantity}
            currentAllocations={
              activeTrackingItem.batchNumber
                ? [{ id: "1", batchNumber: activeTrackingItem.batchNumber, quantity: activeTrackingItem.requestedQuantity }]
                : []
            }
            onSave={handleSaveBatchAllocations}
          />
        )}

        {/* Approver Action Modal (Approve, Return, Reject) */}
        {approvalModalAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-800">
                {approvalModalAction === "Approve"
                  ? "Approve Requisition"
                  : approvalModalAction === "Reject"
                  ? "Reject Material Requisition"
                  : "Return for Correction"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {approvalModalAction === "Approve"
                  ? "Confirm approval for this material requisition. You may optionally include comments or dispatch notes."
                  : "Please provide the reason or feedback for the requester. This will be recorded in the audit log."}
              </p>

              <div className="mt-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Comments {approvalModalAction !== "Approve" && "*"}
                </label>
                <textarea
                  rows={4}
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder={
                    approvalModalAction === "Approve"
                      ? "Enter approval remarks (optional)..."
                      : "Enter detailed reason here..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setApprovalModalAction(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApprovalModal}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-colors cursor-pointer ${
                    approvalModalAction === "Approve"
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                      : approvalModalAction === "Reject"
                      ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                      : "bg-orange-600 hover:bg-orange-700 shadow-orange-500/20"
                  }`}
                >
                  {approvalModalAction === "Approve"
                    ? "Approve Requisition"
                    : approvalModalAction === "Reject"
                    ? "Reject"
                    : "Return"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ITEM SEARCH MODAL (matching Purchase Requisition approach) */}
        {itemSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <ShoppingBag className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Select Item from Master Catalog</h2>
                    <p className="text-xs text-slate-500">Search and select items with real-time specification &amp; UOM</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setItemSearchOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <XCircle className="size-5" />
                </button>
              </div>

              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                  <input
                    type="text"
                    value={itemSearchQuery}
                    onChange={(e) => setItemSearchQuery(e.target.value)}
                    placeholder="Search by Item Code, Name, Specification, Brand, Origin..."
                    className="w-full h-9 pl-4 pr-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:border-blue-500 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[600px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Item Details</th>
                        <th className="py-2.5 px-3">Specification</th>
                        <th className="py-2.5 px-3">Brand / Origin</th>
                        <th className="py-2.5 px-3 text-center">UOM</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {catalogItems
                        .filter((ci) => {
                          if (!itemSearchQuery.trim()) return true;
                          const q = itemSearchQuery.toLowerCase();
                          return (
                            ci.itemCode.toLowerCase().includes(q) ||
                            ci.itemName.toLowerCase().includes(q) ||
                            (ci.specification && ci.specification.toLowerCase().includes(q)) ||
                            (ci.brand && ci.brand.toLowerCase().includes(q)) ||
                            (ci.origin && ci.origin.toLowerCase().includes(q))
                          );
                        })
                        .map((ci) => {
                          const uomVal = ci.stockUOM || ci.purchaseUOM || (ci as any).uom || "PCS";
                          const isAlreadyAdded = items.some(
                            (item) => item.itemId === ci.id || item.itemCode === ci.itemCode
                          );
                          return (
                            <tr
                              key={ci.id}
                              className={`transition ${isAlreadyAdded ? "bg-slate-50/50 opacity-75" : "hover:bg-slate-50/80"}`}
                            >
                              <td className="py-2.5 px-3">
                                <div className="font-bold text-slate-800">{ci.itemName}</div>
                                <div className="font-mono text-[10px] text-blue-600">{ci.itemCode}</div>
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 max-w-[200px] truncate" title={ci.specification}>
                                {ci.specification || "-"}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600">
                                {ci.brand || "-"} / {ci.origin || "-"}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                                {uomVal}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                {isAlreadyAdded ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toast.error(
                                        `Item "${ci.itemName}" (${ci.itemCode}) has already been added to this requisition.`
                                      )
                                    }
                                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                  >
                                    Already Added
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSelectItemFromModal(ci)}
                                    className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
                                  >
                                    Select Item
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Standard Preview Report Modal */}
        <StandardPreviewReportModal
          isOpen={previewReportOpen}
          onClose={() => setPreviewReportOpen(false)}
          data={previewReportData}
        />
      </main>
    </div>
  );
}
