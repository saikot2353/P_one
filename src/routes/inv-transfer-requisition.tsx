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
  Info,
} from "lucide-react";
import { toast } from "sonner";
import {
  TransferRequisition,
  TransferRequisitionItem,
  TransferType,
  MASTER_COMPANIES,
  getStoredTransferRequisitions,
  saveTransferRequisition,
} from "@/lib/inventory-stock-management-data";
import {
  DEFAULT_WAREHOUSES,
  DEFAULT_ITEMS,
  ItemProductMaster,
  WarehouseStore,
  getStoredData,
} from "@/lib/procurement-master-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-transfer-requisition")({
  validateSearch: (
    search: Record<string, unknown>
  ): { id?: string; mode?: "view" | "edit" } => ({
    id: search.id as string | undefined,
    mode: search.mode as "view" | "edit" | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Transfer Requisition Entry — Inventory ERP" },
      {
        name: "description",
        content: "Submit inter-company and intra-company transfer requisitions with multi-store item allocation.",
      },
    ],
  }),
  component: TransferRequisitionFormPage,
});

function TransferRequisitionFormPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const isViewMode = searchParams.mode === "view";
  const editingRequisitionId = searchParams.id;

  const rawWarehouses = getStoredData<WarehouseStore[]>("proc_warehouses_v2", DEFAULT_WAREHOUSES);
  const warehouses = useMemo(() => {
    const list = rawWarehouses && rawWarehouses.length > 0 ? rawWarehouses : DEFAULT_WAREHOUSES;
    return list.map((w) => ({
      ...w,
      storeName: w.storeName || (w as any).name || w.storeCode,
    }));
  }, [rawWarehouses]);

  const catalogItems = getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS);

  // Load existing requisition if editing or viewing
  const existingReq = useMemo(() => {
    if (!editingRequisitionId) return null;
    const all = getStoredTransferRequisitions();
    return all.find((r) => r.id === editingRequisitionId || r.requisitionNumber === editingRequisitionId) || null;
  }, [editingRequisitionId]);

  // Header State
  const [requisitionNumber] = useState<string>(() => {
    if (existingReq) return existingReq.requisitionNumber;
    return `TR-2026-${String(Math.floor(100 + Math.random() * 900))}`;
  });

  const [requisitionDate, setRequisitionDate] = useState<string>(() => {
    return existingReq?.requisitionDate || new Date().toISOString().slice(0, 10);
  });

  const [requestedBy] = useState<string>(() => {
    return existingReq?.requestedBy || "Tahmid Afsar Shapno (Store Manager)";
  });

  const [remarks, setRemarks] = useState<string>(() => {
    return existingReq?.remarks || "";
  });

  // Requisitioning Entity (From / Requester)
  const [requisitioningCompany, setRequisitioningCompany] = useState<string>(() => {
    return existingReq?.requisitioningCompany || "Pakiza Knit Composite Ltd";
  });

  const [requisitioningStore, setRequisitioningStore] = useState<string>(() => {
    return existingReq?.requisitioningStore || "PKCL Central Raw Material Warehouse";
  });

  // Requested From Entity (To / Source Supplier)
  const [requestedFromCompany, setRequestedFromCompany] = useState<string>(() => {
    return existingReq?.requestedFromCompany || "Pakiza Spinning Mills Ltd";
  });

  const [requestedFromStore, setRequestedFromStore] = useState<string>(() => {
    return existingReq?.requestedFromStore || "Spinning Spare Parts & Consumables Store";
  });

  // Determine Transfer Type
  const transferType: TransferType = useMemo(() => {
    return requisitioningCompany === requestedFromCompany ? "Intra-Company" : "Inter-Company";
  }, [requisitioningCompany, requestedFromCompany]);

  // Stores under Requisitioning Company
  const requisitioningStores = useMemo(() => {
    const list = warehouses.filter((w) => w.organization === requisitioningCompany && w.status === "Active");
    return list.length > 0 ? list : warehouses;
  }, [warehouses, requisitioningCompany]);

  // Stores under Requested From Company
  const requestedFromStores = useMemo(() => {
    const list = warehouses.filter((w) => w.organization === requestedFromCompany && w.status === "Active");
    return list.length > 0 ? list : warehouses;
  }, [warehouses, requestedFromCompany]);

  // Items State
  const [items, setItems] = useState<TransferRequisitionItem[]>(() => {
    if (existingReq) return existingReq.items;
    return [
      {
        id: `tr-row-1`,
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Pakiza Spin",
        origin: "Bangladesh",
        uom: "KG",
        requiredQty: 250,
        issuedQty: 0,
        availableStock: 25000,
        estimatedUnitPrice: 420,
        totalEstimatedValue: 105000,
        remarks: "Production batch allocation",
      },
    ];
  });

  // Item Search Modal State
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState("");

  const filteredCatalogItems = useMemo(() => {
    if (!itemSearchQuery.trim()) return catalogItems;
    const q = itemSearchQuery.toLowerCase();
    return catalogItems.filter(
      (c) =>
        c.itemName.toLowerCase().includes(q) ||
        c.itemCode.toLowerCase().includes(q) ||
        (c.specification && c.specification.toLowerCase().includes(q))
    );
  }, [catalogItems, itemSearchQuery]);

  const handleAddCatalogItem = (catItem: ItemProductMaster) => {
    if (items.some((i) => i.itemCode === catItem.itemCode)) {
      toast.error(`Item "${catItem.itemName}" is already in this requisition.`);
      return;
    }

    const newItem: TransferRequisitionItem = {
      id: `tr-item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      sl: items.length + 1,
      itemCode: catItem.itemCode,
      itemName: catItem.itemName,
      specification: catItem.specification || "-",
      brand: catItem.brand || "Standard",
      origin: catItem.origin || "Bangladesh",
      uom: catItem.stockUOM || "PCS",
      requiredQty: 10,
      issuedQty: 0,
      availableStock: catItem.maximumStock || 100,
      estimatedUnitPrice: catItem.standardPurchasePrice || 250,
      totalEstimatedValue: 10 * (catItem.standardPurchasePrice || 250),
      remarks: "",
    };

    setItems((prev) => [...prev, newItem]);
    setItemSearchOpen(false);
    toast.success(`Added "${catItem.itemName}" to requisition.`);
  };

  const handleRemoveItem = (id: string) => {
    if (isViewMode) return;
    if (items.length === 1) {
      toast.error("Requisition must have at least one item.");
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id).map((it, idx) => ({ ...it, sl: idx + 1 })));
  };

  const handleUpdateItem = (id: string, field: "requiredQty" | "remarks", value: any) => {
    if (isViewMode) return;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        if (field === "requiredQty") {
          const qty = Math.max(1, Number(value) || 1);
          return {
            ...it,
            requiredQty: qty,
            totalEstimatedValue: qty * it.estimatedUnitPrice,
          };
        }
        return { ...it, [field]: value };
      })
    );
  };

  // Totals
  const totalRequiredQty = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.requiredQty) || 0), 0);
  }, [items]);

  const totalEstimatedValue = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.totalEstimatedValue) || 0), 0);
  }, [items]);

  // Validation
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    if (!requisitionNumber.trim()) errs.push("Requisition Number is required.");
    if (!requisitioningCompany) errs.push("Requisitioning Company is required.");
    if (!requisitioningStore) errs.push("Requisitioning Store is required.");
    if (!requestedFromCompany) errs.push("Requested From Company is required.");
    if (!requestedFromStore) errs.push("Requested From Store is required.");
    if (items.length === 0) errs.push("At least one required item must be added.");
    items.forEach((it) => {
      if (it.requiredQty <= 0) {
        errs.push(`${it.itemName}: Required quantity must be greater than zero.`);
      }
    });
    return errs;
  }, [requisitionNumber, requisitioningCompany, requisitioningStore, requestedFromCompany, requestedFromStore, items]);

  // Save / Submit Handlers
  const handleSaveRequisition = (targetStatus: "Draft" | "Approval Pending") => {
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    const payload: TransferRequisition = {
      id: existingReq?.id || `tr-${Date.now()}`,
      requisitionNumber,
      requisitionDate,
      transferType,
      requisitioningCompany,
      requisitioningStore,
      requestedFromCompany,
      requestedFromStore,
      requestedBy,
      remarks,
      totalItems: items.length,
      totalRequiredQty,
      totalEstimatedValue,
      status: targetStatus,
      items,
      createdAt: existingReq?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveTransferRequisition(payload);

    if (targetStatus === "Approval Pending") {
      if (transferType === "Inter-Company") {
        toast.success(
          `Inter-Company Requisition "${requisitionNumber}" submitted! It now appears in the Approval Pending list for "${requestedFromCompany}".`
        );
      } else {
        toast.success(`Intra-Company Requisition "${requisitionNumber}" submitted successfully.`);
      }
    } else {
      toast.success(`Transfer Requisition draft "${requisitionNumber}" saved successfully!`);
    }

    navigate({ to: "/inv-transfer-requisition-list" });
  };

  // Preview Report Modal
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      reportType: "transfer-requisition",
      title: "STOCK TRANSFER REQUISITION DOSSIER",
      documentNumber: requisitionNumber,
      documentNo: requisitionNumber,
      documentDate: requisitionDate,
      department: "Central Inventory & Materials Supply",
      status: existingReq?.status || "Approval Pending",
      metadata: [
        { label: "Requisition No", value: requisitionNumber, highlight: true },
        { label: "Requisition Date", value: requisitionDate },
        { label: "Transfer Type", value: transferType, highlight: true },
        { label: "Requisitioning Company", value: requisitioningCompany },
        { label: "Requisitioning Store", value: requisitioningStore },
        { label: "Requested From Company", value: requestedFromCompany, highlight: true },
        { label: "Requested From Store", value: requestedFromStore },
        { label: "Requested By", value: requestedBy },
      ],
      tableHeaders: ["SL", "Item Description", "Specification", "UOM", "Requested Qty", "Est. Unit Price (৳)", "Total Est. Value (৳)", "Remarks"],
      tableRows: items.map((it, idx) => [
        idx + 1,
        <div key={idx}>
          <div className="font-bold text-slate-900">{it.itemName}</div>
          <div className="text-[10px] text-slate-500 font-mono">{it.itemCode}</div>
        </div>,
        it.specification || "-",
        it.uom,
        it.requiredQty.toLocaleString(),
        `৳ ${it.estimatedUnitPrice.toLocaleString()}`,
        `৳ ${it.totalEstimatedValue.toLocaleString()}`,
        it.remarks || "-",
      ]),
      summaryCards: [
        { label: "Total Items", value: String(items.length) },
        { label: "Total Requested Qty", value: `${totalRequiredQty.toLocaleString()} units` },
        { label: "Total Est. Value", value: `৳ ${totalEstimatedValue.toLocaleString()}`, isBold: true, isHighlight: true },
      ],
      signatures: [
        { role: "Requisitioner", name: requestedBy, designation: "Store Officer" },
        { role: "Store In-charge", name: "Md. Anik Islam", designation: "Asst. Manager" },
        { role: "Authorized Approver", name: "Engr. Tanvir Ahmed", designation: "Head of Operations" },
      ],
    };
  }, [
    requisitionNumber,
    requisitionDate,
    transferType,
    requisitioningCompany,
    requisitioningStore,
    requestedFromCompany,
    requestedFromStore,
    requestedBy,
    items,
    totalRequiredQty,
    totalEstimatedValue,
    existingReq,
  ]);

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans text-slate-900 overflow-hidden">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Top Bar & Breadcrumbs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Link
                to="/inv-transfer-requisition-list"
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-xs"
                title="Back to Requisition Register"
              >
                <ArrowLeft className="size-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Stock Transfers / Transfer Requisition
                  </span>
                  <span className="text-slate-300">•</span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      transferType === "Inter-Company"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {transferType}
                  </span>
                  {existingReq && (
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        existingReq.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : existingReq.status === "Approval Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : existingReq.status === "Returned for Correction"
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : existingReq.status === "Rejected"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {existingReq.status}
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                  {isViewMode
                    ? `Transfer Requisition Dossier — ${requisitionNumber}`
                    : existingReq
                      ? `Edit Transfer Requisition — ${requisitionNumber}`
                      : "New Transfer Requisition"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewReportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Printer className="size-3.5" />
                <span>Preview Report</span>
              </button>

              <Link
                to="/inv-transfer-requisition-approval"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
              >
                <FileCheck2 className="size-3.5" />
                <span>Approval Desk</span>
              </Link>

              {!isViewMode && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSaveRequisition("Draft")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Save className="size-3.5" />
                    <span>Save Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveRequisition("Approval Pending")}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>Submit Requisition</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Inter-Company vs. Intra-Company Policy Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
              transferType === "Inter-Company"
                ? "bg-purple-50/70 border-purple-200 text-purple-900"
                : "bg-blue-50/70 border-blue-200 text-blue-900"
            }`}
          >
            <Info className={`size-4 shrink-0 mt-0.5 ${transferType === "Inter-Company" ? "text-purple-600" : "text-blue-600"}`} />
            <div>
              <strong className="font-bold block text-sm">
                {transferType === "Inter-Company"
                  ? "Inter-Company Stock Transfer Policy"
                  : "Intra-Company Stock Transfer Policy"}
              </strong>
              {transferType === "Inter-Company" ? (
                <p className="mt-0.5">
                  Goods are being requested from a separate legal entity (
                  <span className="font-bold">{requestedFromCompany}</span>).
                  <span className="font-bold underline ml-1">Transfer Requisition is mandatory</span> and requires explicit approval by the requested company before goods can be issued via Transfer Issue.
                </p>
              ) : (
                <p className="mt-0.5">
                  Both stores belong to the same company (<span className="font-bold">{requisitioningCompany}</span>).
                  Transfer Requisition is <span className="font-bold">optional</span> and approval is <span className="font-bold">not required</span>; goods can alternatively be transferred directly via Transfer Issue.
                </p>
              )}
            </div>
          </div>

          {/* Section 1: Requisition Header Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building2 className="size-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">1. Requisition & Entity Routing</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700">
                  Requisition ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={requisitionNumber}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-100 font-mono text-xs font-bold text-blue-700 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700">
                  Requisition Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  disabled={isViewMode}
                  value={requisitionDate}
                  onChange={(e) => setRequisitionDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:border-blue-500 outline-none disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700">
                  Requested By
                </label>
                <input
                  type="text"
                  readOnly
                  value={requestedBy}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-100 text-xs font-medium text-slate-600 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700">
                  Transfer Type
                </label>
                <div className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{transferType}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      transferType === "Inter-Company"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {transferType === "Inter-Company" ? "Approval Req." : "Direct / Optional"}
                  </span>
                </div>
              </div>

              {/* Requisitioning (Requester) Entity */}
              <div className="p-3.5 bg-blue-50/50 border border-blue-200/80 rounded-xl space-y-3 lg:col-span-2">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                  Requisitioning Entity (Goods Recipient)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold mb-1 text-slate-700">
                      Requisitioning Company <span className="text-rose-500">*</span>
                    </label>
                    <select
                      disabled={isViewMode}
                      value={requisitioningCompany}
                      onChange={(e) => {
                        const comp = e.target.value;
                        setRequisitioningCompany(comp);
                        const subWh = warehouses.filter((w) => w.organization === comp && w.status === "Active");
                        if (subWh[0]) setRequisitioningStore(subWh[0].storeName);
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:border-blue-500 outline-none disabled:bg-slate-50"
                    >
                      {MASTER_COMPANIES.map((mc) => (
                        <option key={mc.id} value={mc.name}>
                          {mc.name} ({mc.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold mb-1 text-slate-700">
                      Requisitioning Store <span className="text-rose-500">*</span>
                    </label>
                    <select
                      disabled={isViewMode}
                      value={requisitioningStore}
                      onChange={(e) => setRequisitioningStore(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:border-blue-500 outline-none disabled:bg-slate-50"
                    >
                      {requisitioningStores.map((w) => (
                        <option key={w.id} value={w.storeName}>
                          {w.storeName} ({w.storeCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Requested From (Source) Entity */}
              <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-3 lg:col-span-2">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  Requested From Entity (Goods Provider / Source)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold mb-1 text-slate-700">
                      Requested From Company <span className="text-rose-500">*</span>
                    </label>
                    <select
                      disabled={isViewMode}
                      value={requestedFromCompany}
                      onChange={(e) => {
                        const comp = e.target.value;
                        setRequestedFromCompany(comp);
                        const subWh = warehouses.filter((w) => w.organization === comp && w.status === "Active");
                        if (subWh[0]) setRequestedFromStore(subWh[0].storeName);
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:border-blue-500 outline-none disabled:bg-slate-50"
                    >
                      {MASTER_COMPANIES.map((mc) => (
                        <option key={mc.id} value={mc.name}>
                          {mc.name} ({mc.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold mb-1 text-slate-700">
                      Requested From Store <span className="text-rose-500">*</span>
                    </label>
                    <select
                      disabled={isViewMode}
                      value={requestedFromStore}
                      onChange={(e) => setRequestedFromStore(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:border-blue-500 outline-none disabled:bg-slate-50"
                    >
                      {requestedFromStores.map((w) => (
                        <option key={w.id} value={w.storeName}>
                          {w.storeName} ({w.storeCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="lg:col-span-4">
                <label className="block text-xs font-bold mb-1 text-slate-700">
                  Requisition Remarks / Justification
                </label>
                <input
                  type="text"
                  disabled={isViewMode}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Specify reason for requisition, production batch order #, urgency details..."
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:border-blue-500 outline-none disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Required Items and Quantities */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="size-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  2. Required Items & Requisition Quantities
                </h2>
              </div>

              {!isViewMode && (
                <button
                  type="button"
                  onClick={() => setItemSearchOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add Item from Catalog</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 font-semibold text-slate-700 text-[11px]">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3 min-w-[240px]">Item Description</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Specification</th>
                    <th className="py-2.5 px-3 w-28">Brand / Origin</th>
                    <th className="py-2.5 px-3 w-20 text-center">UOM</th>
                    <th className="py-2.5 px-3 w-28 text-right">Required Qty</th>
                    <th className="py-2.5 px-3 min-w-[150px]">Remarks</th>
                    {!isViewMode && <th className="py-2.5 px-3 w-12 text-center">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((it, idx) => (
                    <tr key={it.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{it.itemName}</div>
                        <div className="font-mono text-[10px] text-blue-600">{it.itemCode}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-[220px] truncate" title={it.specification}>
                        {it.specification || "-"}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                        {it.brand} / {it.origin}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                        {it.uom}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {isViewMode ? (
                          <span className="font-bold text-slate-900">{it.requiredQty.toLocaleString()}</span>
                        ) : (
                          <input
                            type="number"
                            min="1"
                            value={it.requiredQty}
                            onChange={(e) => handleUpdateItem(it.id, "requiredQty", e.target.value)}
                            className="w-24 h-8 px-2 rounded border border-slate-200 text-right font-bold text-slate-900 focus:border-blue-500 outline-none text-xs"
                          />
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {isViewMode ? (
                          <span className="text-slate-500 text-[11px]">{it.remarks || "-"}</span>
                        ) : (
                          <input
                            type="text"
                            value={it.remarks || ""}
                            onChange={(e) => handleUpdateItem(it.id, "remarks", e.target.value)}
                            placeholder="Line remarks..."
                            className="w-full h-8 px-2 rounded border border-slate-200 text-xs text-slate-700 focus:border-blue-500 outline-none"
                          />
                        )}
                      </td>
                      {!isViewMode && (
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(it.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer Totals */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-slate-500">
                Total Line Items: <span className="font-bold text-slate-800">{items.length}</span>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-500">Total Required Qty: </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {totalRequiredQty.toLocaleString()} units
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Catalog Item Search Modal */}
      {itemSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Package className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Add Item from Catalog</h2>
                  <p className="text-xs text-slate-500">Select an item to add to this Transfer Requisition</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setItemSearchOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-200 bg-slate-50/60">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={itemSearchQuery}
                  onChange={(e) => setItemSearchQuery(e.target.value)}
                  placeholder="Search item by name, code, specification, brand, origin..."
                  className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-500 outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
              {filteredCatalogItems.map((cat) => {
                const isAlready = items.some((i) => i.itemCode === cat.itemCode);
                return (
                  <div
                    key={cat.id}
                    className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-lg transition"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-slate-900">{cat.itemName}</div>
                      <div className="text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-700">Specification:</span> {cat.specification || "Standard"}
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-3">
                        <span><span className="font-semibold text-slate-700">Brand:</span> {cat.brand || "—"}</span>
                        <span>•</span>
                        <span><span className="font-semibold text-slate-700">Origin:</span> {cat.origin || "—"}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-slate-400">{cat.itemCode} ({cat.stockUOM})</span>
                      </div>
                    </div>
                    {isAlready ? (
                      <span className="px-2 py-1 rounded text-[11px] font-bold bg-slate-100 text-slate-400 shrink-0">
                        Already Added
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddCatalogItem(cat)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shrink-0"
                      >
                        + Select
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setItemSearchOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standard Preview Report Modal */}
      {previewReportOpen && (
        <StandardPreviewReportModal
          open={previewReportOpen}
          onOpenChange={setPreviewReportOpen}
          reportData={previewReportData}
        />
      )}
    </div>
  );
}
