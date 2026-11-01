import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  Plus,
  Trash2,
  Edit,
  X,
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  Eye,
  CheckCircle2,
  RefreshCw,
  Home,
  ChevronRight,
  Filter,
  Package,
  Wrench,
  Clock,
  RotateCcw,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  PurchaseOrder,
  getStoredPurchaseOrders,
  setStoredPurchaseOrders,
  getStoredPoItems,
  setStoredPoItems,
  getStoredWoItems,
  setStoredWoItems,
} from "@/lib/procurement-order-inventory-data";
import { PurchaseOrderReportModal, PurchaseOrderReportData } from "@/components/procurement/PurchaseOrderReportModal";
import pakizaSoftwareLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export const Route = createFileRoute("/procurement-po-list")({
  head: () => ({
    meta: [
      { title: "Purchase Order / Work Order List — CRIPTON Procurement" },
      {
        name: "description",
        content:
          "Official Purchase Order & Work Order Registry with multi-method tracking, status management, PDF preview, and edit/delete actions.",
      },
    ],
  }),
  component: PurchaseOrderListPage,
});

export function PurchaseOrderListPage() {
  const navigate = useNavigate();

  const [poList, setPoList] = useState<PurchaseOrder[]>(() => getStoredPurchaseOrders());
  const poItemsMap = useMemo(() => getStoredPoItems(), []);
  const woItemsMap = useMemo(() => getStoredWoItems(), []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDocType, setFilterDocType] = useState("All");
  const [filterMethod, setFilterMethod] = useState("All");
  const [filterPaymentMode, setFilterPaymentMode] = useState("All");
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [drillDownInfo, setDrillDownInfo] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const supp = sp.get("supplier");
    const statusParam = sp.get("status");
    const q = sp.get("search");
    const ret = sp.get("returnTo");

    const badges: string[] = [];

    if (supp && supp !== "All" && supp !== "All Suppliers") {
      setSearchQuery(supp);
      badges.push(`Supplier: ${supp}`);
    } else if (q) {
      setSearchQuery(q);
      badges.push(`Search: ${q}`);
    }

    if (statusParam && statusParam !== "All") {
      setFilterStatus(statusParam);
      badges.push(`Status: ${statusParam}`);
    }

    if (badges.length > 0) {
      setDrillDownInfo(badges.join(" • "));
    }

    if (ret) setReturnTo(ret);
  }, []);

  // Document Viewer Modal State
  const [viewingPo, setViewingPo] = useState<PurchaseOrder | null>(null);

  const viewingReportData: PurchaseOrderReportData | null = useMemo(() => {
    if (!viewingPo) return null;
    const items = poItemsMap[viewingPo.orderNumber] || viewingPo.items || [];
    const woItems = woItemsMap[viewingPo.orderNumber] || viewingPo.woItems || [];
    const taxAmount = (viewingPo as any).taxTotal ?? Math.round((viewingPo.subtotal || 0) * 0.03);

    return {
      orderNumber: viewingPo.orderNumber,
      orderDate: viewingPo.orderDate,
      documentType: viewingPo.documentType,
      supplierName: viewingPo.supplierName,
      supplierAddress: (viewingPo as any).supplierAddress || "Tejgaon I/A, Dhaka-1208",
      supplierContact: (viewingPo as any).contactPerson || (viewingPo as any).supplierContact || "Engr. Farhan Ahmed",
      supplierMobile: (viewingPo as any).mobile || (viewingPo as any).supplierMobile || "+880 1712-345678",
      paymentMode: viewingPo.paymentMode,
      deliveryWarehouse: viewingPo.deliveryWarehouse,
      prepareBy: viewingPo.prepareBy,
      department: (viewingPo as any).department || "Procurement & Commercial",
      currency: (viewingPo as any).currency || "BDT",
      subtotal: viewingPo.subtotal,
      discountTotal: viewingPo.discountTotal,
      taxTotal: taxAmount,
      vatTotal: viewingPo.vatTotal,
      grandTotal: viewingPo.grandTotal,
      termsAndConditions: viewingPo.termsAndConditions,
      items: items.map((it: any) => ({
        itemCode: it.itemCode,
        itemName: it.itemName,
        specification: it.specification,
        uom: it.uom,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        discount: it.discount || 0,
        vatPercent: it.vatPercent ?? 5,
        vatAmount: it.vatAmount ?? Math.round((it.quantity * it.unitPrice) * 0.05),
        taxPercent: it.taxPercent ?? 3,
        taxAmount: it.taxAmount ?? Math.round((it.quantity * it.unitPrice) * 0.03),
        lineTotal: it.lineTotal,
      })),
      woItems: woItems.map((w: any) => ({
        serviceCode: w.serviceCode,
        serviceName: w.serviceName,
        workDescription: w.workDescription,
        specification: w.specification,
        uom: w.uom,
        workOrderQuantity: w.workOrderQuantity,
        unitRate: w.unitRate,
        discount: w.discount || 0,
        vatPercent: w.vatPercent ?? 5,
        vatAmount: w.vatAmount ?? Math.round((w.workOrderQuantity * w.unitRate) * 0.05),
        taxPercent: w.taxPercent ?? 3,
        taxAmount: w.taxAmount ?? Math.round((w.workOrderQuantity * w.unitRate) * 0.03),
        lineTotal: w.lineTotal,
      })),
    };
  }, [viewingPo, poItemsMap, woItemsMap]);

  // Delete Action
  const handleDeleteOrder = (order: PurchaseOrder) => {
    if (order.orderStatus === "Approved") {
      toast.error("Approved orders cannot be deleted as they are locked for accounting and receiving integrity.");
      return;
    }

    if (
      confirm(
        `Are you sure you want to permanently delete ${order.documentType} "${order.orderNumber}"?`
      )
    ) {
      const updated = poList.filter((o) => o.id !== order.id);
      setPoList(updated);
      setStoredPurchaseOrders(updated);

      if (order.documentType === "Purchase Order") {
        const storedPo = getStoredPoItems();
        delete storedPo[order.orderNumber];
        setStoredPoItems(storedPo);
      } else {
        const storedWo = getStoredWoItems();
        delete storedWo[order.orderNumber];
        setStoredWoItems(storedWo);
      }

      toast.success(`${order.documentType} "${order.orderNumber}" deleted successfully.`);
    }
  };

  // Edit Action
  const handleEditOrder = (order: PurchaseOrder) => {
    if (order.orderStatus === "Approved") {
      toast.error("Approved orders cannot be modified. You may review its details in read-only mode.");
      return;
    }
    navigate({
      to: "/procurement-po-new",
      search: { editId: order.id, mode: "edit" },
    });
  };

  // Filtered List
  const filteredPoList = useMemo(() => {
    return poList.filter((po) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          po.orderNumber.toLowerCase().includes(q) ||
          po.supplierName.toLowerCase().includes(q) ||
          (po.prepareBy && po.prepareBy.toLowerCase().includes(q)) ||
          (po.deliveryWarehouse && po.deliveryWarehouse.toLowerCase().includes(q)) ||
          (po.workLocation && po.workLocation.toLowerCase().includes(q));
        if (!matchesQ) return false;
      }

      // Date Filters
      if (filterDateFrom && po.orderDate < filterDateFrom) return false;
      if (filterDateTo && po.orderDate > filterDateTo) return false;

      // Status Filter
      if (filterStatus !== "All") {
        if (filterStatus === "Submitted") {
          if (po.orderStatus !== "Submitted" && po.orderStatus !== "Pending Approval") return false;
        } else if (po.orderStatus !== filterStatus) {
          return false;
        }
      }

      // Document Type Filter
      if (filterDocType !== "All" && po.documentType !== filterDocType) return false;

      // Method Filter
      if (filterMethod !== "All") {
        const currentMethod =
          po.creationMethod ||
          (po.csId ? "Comparative Statement" : po.prIds?.length ? "Purchase Requisition" : "Direct Purchase Order / Work Order");
        if (currentMethod !== filterMethod) return false;
      }

      // Payment Mode Filter
      if (filterPaymentMode !== "All" && po.paymentMode && !po.paymentMode.toLowerCase().includes(filterPaymentMode.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [poList, searchQuery, filterDateFrom, filterDateTo, filterStatus, filterDocType, filterMethod, filterPaymentMode]);

  // Export Excel / CSV
  const handleExportCsv = () => {
    const headers = [
      "SL",
      "Order Number",
      "Date",
      "Document Type",
      "Creation Method",
      "Supplier",
      "Delivery / Work Location",
      "Department",
      "Prepared By",
      "Currency",
      "Total Amount (BDT)",
      "Status",
      "PR Reference",
      "CS Reference",
      "Payment Terms",
    ];

    const rows = filteredPoList.map((po, index) => [
      (index + 1).toString(),
      po.orderNumber,
      po.orderDate,
      po.documentType,
      po.creationMethod || (po.csId ? "Comparative Statement" : po.prIds?.length ? "Purchase Requisition" : "Direct"),
      po.supplierName,
      po.deliveryWarehouse || po.workLocation || "",
      po.department,
      po.prepareBy,
      po.currency,
      po.grandTotal.toString(),
      po.orderStatus,
      po.prIds?.join(";") || "",
      po.csId || "",
      po.paymentMode || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `po_wo_registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel/CSV export generated successfully.");
  };

  return (
    <div className="min-h-screen flex bg-slate-100/70 dark:bg-background text-foreground transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-5 w-full max-w-[1600px] mx-auto">
          {returnTo && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 text-blue-950 px-4 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                  <ArrowLeft className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      Procurement Dashboard Drill-Down
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      Stage: Purchase Order / Work Order
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 font-medium mt-0.5">
                    {drillDownInfo ? drillDownInfo : "Viewing purchase order transactions from the Procurement Workflow."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate({ to: returnTo as any })}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
              >
                <ArrowLeft className="size-3.5" /> Back to Dashboard
              </button>
            </div>
          )}

          {/* Breadcrumb Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-card p-4 rounded-2xl border border-border shadow-2xs">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
                <Home className="size-3.5" />
                <span>Home</span>
                <ChevronRight className="size-3" />
                <span>Purchase Order</span>
                <ChevronRight className="size-3" />
                <span className="text-blue-600 dark:text-blue-400 font-bold">Purchase Order / Work Order List</span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <FileText className="size-5.5 text-blue-600 dark:text-blue-400" />
                Purchase Order / Work Order List
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* 1. Create Purchase Order / Work Order option */}
              <button
                type="button"
                onClick={() => navigate({ to: "/procurement-po-new", search: { editId: undefined, mode: undefined } })}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="size-4" /> Create Purchase Order / Work Order
              </button>
            </div>
          </div>

          {/* FILTER CONTROLS CARD */}
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Filter className="size-4 text-blue-600 dark:text-blue-400" /> Filter &amp; Search Parameters
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                  setFilterStatus("All");
                  setFilterDocType("All");
                  setFilterMethod("All");
                  setFilterPaymentMode("All");
                }}
                className="text-[11px] font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition cursor-pointer"
              >
                <RefreshCw className="size-3" /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              {/* Search input */}
              <div className="lg:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Search Keyword</label>
                <div className="relative">
                  <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search Order No, Vendor, Store, Preparer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-8 pr-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Date From */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date From</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date To</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>

              {/* Document Type */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Order Type</label>
                <select
                  value={filterDocType}
                  onChange={(e) => setFilterDocType(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Purchase Order">Purchase Order</option>
                  <option value="Work Order">Work Order</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted (Pending)</option>
                  <option value="Approved">Approved</option>
                  <option value="Draft">Draft</option>
                  <option value="Returned for Correction">Returned for Correction</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* MAIN REGISTRY TABLE CONTAINER */}
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-xs overflow-hidden flex flex-col">
            {/* Toolbar Header & Exports */}
            <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Purchase Orders &amp; Work Orders ({filteredPoList.length})
                </span>
              </div>

              {/* Export Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="h-8 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5" /> Excel
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="size-3.5" /> Print
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-slate-100/80 dark:bg-slate-800/80 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    <th className="p-3 text-center w-12 border-r border-border/60">SL</th>
                    <th className="p-3 border-r border-border/60">Order No</th>
                    <th className="p-3 text-center w-24 border-r border-border/60">Order Date</th>
                    <th className="p-3 text-center w-28 border-r border-border/60">Doc Type</th>
                    <th className="p-3 border-r border-border/60">Supplier / Vendor</th>
                    <th className="p-3 border-r border-border/60">Prepared By</th>
                    <th className="p-3 text-right w-28 border-r border-border/60">Total Amount</th>
                    <th className="p-3 text-center w-28 border-r border-border/60">Status</th>
                    <th className="p-3 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-white dark:bg-transparent font-normal">
                  {filteredPoList.map((po, index) => {
                    const isApproved = po.orderStatus === "Approved";

                    return (
                      <tr key={po.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition">
                        <td className="p-3 text-center text-slate-500 border-r border-border/60">{index + 1}</td>

                        {/* Order No */}
                        <td className="p-3 border-r border-border/60 font-mono font-bold">
                          <button
                            type="button"
                            onClick={() => setViewingPo(po)}
                            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-left font-mono font-bold"
                          >
                            {po.orderNumber}
                          </button>
                        </td>

                        <td className="p-3 text-center text-slate-600 dark:text-slate-400 border-r border-border/60 font-medium whitespace-nowrap">
                          {po.orderDate}
                        </td>

                        {/* Doc Type */}
                        <td className="p-3 text-center border-r border-border/60">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                            {po.documentType === "Purchase Order" ? (
                              <Package className="size-3 text-amber-500" />
                            ) : (
                              <Wrench className="size-3 text-cyan-500" />
                            )}
                            {po.documentType}
                          </span>
                        </td>

                        <td className="p-3 border-r border-border/60 font-semibold text-slate-900 dark:text-white max-w-[220px] truncate" title={po.supplierName}>
                          {po.supplierName}
                        </td>

                        <td className="p-3 border-r border-border/60 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                          {po.prepareBy}
                        </td>

                        <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white border-r border-border/60 whitespace-nowrap">
                          ৳{po.grandTotal.toLocaleString()}
                        </td>

                        {/* Status Badge */}
                        <td className="p-3 text-center border-r border-border/60 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide inline-flex items-center gap-1 ${
                              po.orderStatus === "Approved"
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                : po.orderStatus === "Submitted" || po.orderStatus === "Pending Approval"
                                ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                : po.orderStatus === "Returned for Correction"
                                ? "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                                : po.orderStatus === "Rejected"
                                ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {po.orderStatus}
                          </span>
                        </td>

                        {/* 1. View, Edit, Delete Actions */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View */}
                            <button
                              type="button"
                              onClick={() =>
                                navigate({
                                  to: "/procurement-po-new",
                                  search: { editId: po.id, mode: "view" },
                                })
                              }
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition cursor-pointer"
                              title="View Purchase Order / Work Order Details"
                            >
                              <Eye className="size-4" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleEditOrder(po)}
                              disabled={isApproved}
                              className={`p-1.5 rounded-lg transition ${
                                isApproved
                                  ? "text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50"
                                  : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                              }`}
                              title={isApproved ? "Approved orders cannot be edited" : "Edit Order"}
                            >
                              <Edit className="size-4" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(po)}
                              disabled={isApproved}
                              className={`p-1.5 rounded-lg transition ${
                                isApproved
                                  ? "text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50"
                                  : "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                              }`}
                              title={isApproved ? "Approved orders cannot be deleted" : "Delete Order"}
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredPoList.length === 0 && (
                    <tr>
                      <td colSpan={14} className="p-12 text-center text-slate-500 dark:text-slate-400">
                        <Package className="size-8 mx-auto text-slate-400 mb-2 opacity-50" />
                        <p className="font-semibold text-slate-700 dark:text-slate-200">No Purchase Orders or Work Orders found.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Try modifying your filter search parameters or create a new order.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Official Purchase Order / Work Order Landscape Report Modal */}
        <PurchaseOrderReportModal
          isOpen={!!viewingPo}
          onClose={() => setViewingPo(null)}
          order={viewingReportData}
        />
      </main>
    </div>
  );
}
