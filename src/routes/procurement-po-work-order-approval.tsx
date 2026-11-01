import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Calendar,
  Building2,
  Package,
  Wrench,
  Search,
  Eye,
  FileText,
  Clock,
  ChevronRight,
  Filter,
  Check,
  ArrowLeft,
  X,
  Printer,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import {
  PurchaseOrder,
  POItem,
  WOServiceItem,
  getStoredPurchaseOrders,
  setStoredPurchaseOrders,
  getStoredPoItems,
  getStoredWoItems,
} from "@/lib/procurement-order-inventory-data";
import { PurchaseOrderReportModal, PurchaseOrderReportData } from "@/components/procurement/PurchaseOrderReportModal";

export const Route = createFileRoute("/procurement-po-work-order-approval")({
  head: () => ({
    meta: [
      { title: "Purchase Order / Work Order Approval — CRIPTON Procurement" },
      {
        name: "description",
        content: "Dedicated Approval console for submitted Purchase Orders and Work Orders with full-page review dossier and action modals.",
      },
    ],
  }),
  component: PurchaseOrderWorkOrderApprovalPage,
});

export function PurchaseOrderWorkOrderApprovalPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(() => getStoredPurchaseOrders());
  const poItemsMap = useMemo(() => getStoredPoItems(), []);
  const woItemsMap = useMemo(() => getStoredWoItems(), []);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Selected Order for Full-Page Details Review
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  // PDF Preview Modal
  const [pdfPreviewOrder, setPdfPreviewOrder] = useState<PurchaseOrder | null>(null);

  const pdfReportData: PurchaseOrderReportData | null = useMemo(() => {
    if (!pdfPreviewOrder) return null;
    const items = poItemsMap[pdfPreviewOrder.orderNumber] || pdfPreviewOrder.items || [];
    const woItems = woItemsMap[pdfPreviewOrder.orderNumber] || pdfPreviewOrder.woItems || [];
    const taxAmount = (pdfPreviewOrder as any).taxTotal ?? Math.round((pdfPreviewOrder.subtotal || 0) * 0.03);

    return {
      orderNumber: pdfPreviewOrder.orderNumber,
      orderDate: pdfPreviewOrder.orderDate,
      documentType: pdfPreviewOrder.documentType,
      supplierName: pdfPreviewOrder.supplierName,
      supplierAddress: pdfPreviewOrder.supplierAddress || "Tejgaon I/A, Dhaka-1208",
      supplierContact: pdfPreviewOrder.contactPerson || "Engr. Farhan Ahmed",
      supplierMobile: pdfPreviewOrder.contactNumber || "+880 1712-345678",
      paymentMode: pdfPreviewOrder.paymentMode,
      deliveryWarehouse: pdfPreviewOrder.deliveryWarehouse,
      workLocation: pdfPreviewOrder.workLocation,
      prepareBy: pdfPreviewOrder.prepareBy,
      department: pdfPreviewOrder.department || "Procurement & Commercial",
      currency: pdfPreviewOrder.currency || "BDT",
      subtotal: pdfPreviewOrder.subtotal,
      discountTotal: pdfPreviewOrder.discountTotal,
      vatTotal: pdfPreviewOrder.vatTotal,
      taxTotal: taxAmount,
      grandTotal: pdfPreviewOrder.grandTotal,
      termsAndConditions: pdfPreviewOrder.termsAndConditions,
      items: items.map((it) => ({
        itemName: it.itemName,
        itemCode: it.itemCode,
        specification: it.specification,
        uom: it.uom,
        quantity: it.orderedQuantity,
        unitPrice: it.unitPrice,
        discount: it.discount || 0,
        vatPercent: it.vatRate,
        vatAmount: it.vatAmount,
        taxPercent: it.taxRate,
        taxAmount: it.taxAmount,
        lineTotal: it.lineTotal,
      })),
      woItems: woItems.map((w) => ({
        serviceName: w.serviceName,
        serviceCode: w.serviceCode,
        workDescription: w.workDescription,
        specification: w.specification || w.workDescription,
        uom: w.uom,
        workOrderQuantity: w.workOrderQuantity,
        unitRate: w.unitRate,
        discount: 0,
        vatPercent: w.vatRate,
        vatAmount: w.vatAmount,
        taxPercent: w.taxRate,
        taxAmount: w.taxAmount,
        lineTotal: w.lineTotal,
      })),
    };
  }, [pdfPreviewOrder, poItemsMap, woItemsMap]);

  // Approval Action Modal State
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<"Approve" | "Return for Correction" | "Reject Order">("Approve");
  const [actionComments, setActionComments] = useState("");

  const approverName = "Engr. Mahmudul Hassan";
  const approverDesignation = "Head of Procurement & Technical Services";
  const approvalDateTime = new Date().toLocaleString();

  // 13. Separate Approval List: ONLY "Submitted" (or "Pending Approval") orders appear in this list
  const submittedOrders = useMemo(() => {
    return orders.filter((ord) => {
      const isSubmitted =
        ord.orderStatus === "Submitted" ||
        ord.orderStatus === "Pending Approval";

      if (!isSubmitted) return false;

      const matchesSearch =
        ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ord.prepareBy && ord.prepareBy.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === "All" || ord.documentType === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [orders, searchQuery, typeFilter]);

  // Open Action Modal
  const handleOpenActionModal = (action: "Approve" | "Return for Correction" | "Reject Order") => {
    setActiveAction(action);
    setActionComments("");
    setActionModalOpen(true);
  };

  // Confirm Approval Action
  const handleConfirmAction = () => {
    if (!selectedOrder) return;

    if (activeAction !== "Approve" && !actionComments.trim()) {
      toast.error(`Comments are mandatory when you choose to ${activeAction.toLowerCase()}.`);
      return;
    }

    let nextStatus: PurchaseOrder["orderStatus"] = "Approved";
    if (activeAction === "Return for Correction") {
      nextStatus = "Returned for Correction";
    } else if (activeAction === "Reject Order") {
      nextStatus = "Rejected";
    }

    const newStep = {
      level: (selectedOrder.currentApprovalLevel || 1) + 1,
      approver: approverName,
      designation: approverDesignation,
      action: activeAction === "Reject Order" ? ("Rejected" as const) : activeAction === "Return for Correction" ? ("Returned for Correction" as const) : ("Approved" as const),
      dateTime: approvalDateTime,
      remarks: actionComments || "Approved without conditions.",
    };

    const updatedOrder: PurchaseOrder = {
      ...selectedOrder,
      orderStatus: nextStatus,
      approverName,
      approvalDate: approvalDateTime,
      approvalRemarks: actionComments,
      approvalHistory: [...(selectedOrder.approvalHistory || []), newStep],
    };

    const updatedList = orders.map((o) =>
      o.id === selectedOrder.id ? updatedOrder : o
    );

    setOrders(updatedList);
    setStoredPurchaseOrders(updatedList);
    setActionModalOpen(false);
    setSelectedOrder(null);

    if (activeAction === "Approve") {
      toast.success(`${selectedOrder.documentType} "${selectedOrder.orderNumber}" has been Approved successfully!`);
    } else if (activeAction === "Return for Correction") {
      toast.warning(`${selectedOrder.documentType} "${selectedOrder.orderNumber}" has been returned to requester for correction.`);
    } else {
      toast.error(`${selectedOrder.documentType} "${selectedOrder.orderNumber}" has been Rejected.`);
    }
  };

  // Items for the selected order
  const currentPoItems = useMemo(() => {
    if (!selectedOrder) return [];
    return poItemsMap[selectedOrder.orderNumber] || selectedOrder.items || [];
  }, [selectedOrder, poItemsMap]);

  const currentWoItems = useMemo(() => {
    if (!selectedOrder) return [];
    return woItemsMap[selectedOrder.orderNumber] || selectedOrder.woItems || [];
  }, [selectedOrder, woItemsMap]);

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <ProcurementSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProcurementTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* ============================================================== */}
          {/* 14. FULL-PAGE APPROVAL DETAILS VIEW (NO ORDER QUEUE SECTION) */}
          {/* ============================================================== */}
          {selectedOrder ? (
            <div className="space-y-6 w-full pb-6">
              {/* Top Navigation & Breadcrumb */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-1">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(null)}
                      className="hover:text-foreground flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 cursor-pointer"
                    >
                      <ArrowLeft className="size-3" /> Back to Approval List
                    </button>
                    <ChevronRight className="size-3" />
                    <span>Approval Details</span>
                    <ChevronRight className="size-3" />
                    <span className="font-mono font-bold text-foreground">{selectedOrder.orderNumber}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                    <ShieldCheck className="size-7 text-amber-500" />
                    {selectedOrder.documentType} Approval Dossier
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPdfPreviewOrder(selectedOrder)}
                    className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0 min-w-fit"
                  >
                    <Printer className="size-4 text-blue-600 dark:text-blue-400" /> View / Print PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="h-9 px-3.5 bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0 min-w-fit"
                  >
                    <X className="size-4" /> Close Details
                  </button>
                </div>
              </div>

              {/* Order Header & Supplier Overview */}
              <div className="bg-card rounded-2xl border border-border p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs font-black">
                      1
                    </span>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      Order Header &amp; Supplier Information
                    </h2>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    Status: {selectedOrder.orderStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Order Type</span>
                    <span className="font-bold text-foreground mt-0.5 block">{selectedOrder.documentType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Order Number</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">{selectedOrder.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Order Date</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedOrder.orderDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Prepared By</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedOrder.prepareBy}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Department</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedOrder.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Supplier / Vendor</span>
                    <span className="font-bold text-foreground mt-0.5 block truncate">
                      {selectedOrder.supplierName} ({selectedOrder.supplierCode || "SUP"})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Contact &amp; Mobile</span>
                    <span className="font-medium text-muted-foreground mt-0.5 block">
                      {selectedOrder.contactPerson} • {selectedOrder.contactNumber || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                      {selectedOrder.documentType === "Purchase Order" ? "Delivery Warehouse" : "Work Location"}
                    </span>
                    <span className="font-semibold text-foreground mt-0.5 block truncate">
                      {selectedOrder.documentType === "Purchase Order" ? selectedOrder.deliveryWarehouse : selectedOrder.workLocation}
                    </span>
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* 15. MATERIAL LINE ITEMS */}
              {/* ============================================================== */}
              <div className="bg-card rounded-2xl border border-border p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-6 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center text-xs font-black">
                      2
                    </span>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      {selectedOrder.documentType === "Purchase Order"
                        ? "Material Line Items"
                        : "Scope of Work / Services"}
                    </h2>
                  </div>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {selectedOrder.documentType === "Purchase Order"
                      ? `${currentPoItems.length} Material Item(s)`
                      : `${currentWoItems.length} Service Line(s)`}
                  </span>
                </div>

                {selectedOrder.documentType === "Purchase Order" ? (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border whitespace-nowrap">
                          <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                          <th className="py-2.5 px-3 font-bold">Item Name &amp; Code</th>
                          <th className="py-2.5 px-3 font-bold">Specification</th>
                          <th className="py-2.5 px-3 font-bold">Brand / Origin</th>
                          <th className="py-2.5 px-3 w-16 font-bold text-center">SKU UOM</th>
                          <th className="py-2.5 px-3 w-20 font-bold text-center">Market Unit</th>
                          <th className="py-2.5 px-3 w-28 font-bold">Conversion</th>
                          <th className="py-2.5 px-3 w-24 text-right font-bold">Order Qty</th>
                          <th className="py-2.5 px-3 w-24 text-right font-bold text-blue-600 dark:text-blue-400">Base Qty</th>
                          <th className="py-2.5 px-3 w-28 text-right font-bold">Unit Price</th>
                          <th className="py-2.5 px-3 w-20 text-right font-bold">Discount</th>
                          <th className="py-2.5 px-3 w-20 text-right font-bold">VAT</th>
                          <th className="py-2.5 px-3 w-20 text-right font-bold">Tax</th>
                          <th className="py-2.5 px-3 w-28 text-right font-bold">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {currentPoItems.map((item, idx) => {
                          const marketUnit = item.marketUnit || item.purchaseUom || item.uom;
                          const factor = item.conversionFactor && item.conversionFactor > 0 ? item.conversionFactor : 1;
                          const eqBaseQty = item.equivalentBaseQty != null ? item.equivalentBaseQty : (item.orderedQuantity * factor);

                          return (
                            <tr key={item.id || idx} className="hover:bg-muted/20">
                              <td className="py-2 px-3 text-center text-muted-foreground font-bold">
                                {idx + 1}
                              </td>
                              <td className="py-2 px-3">
                                <div className="font-bold text-foreground">{item.itemName}</div>
                                <div className="font-mono text-[10px] text-muted-foreground">{item.itemCode}</div>
                              </td>
                              <td className="py-2 px-3 text-[11px] text-muted-foreground max-w-[180px] truncate" title={item.specification}>
                                {item.specification || "—"}
                              </td>
                              <td className="py-2 px-3 text-muted-foreground text-[11px]">
                                {[item.brand, item.origin].filter(Boolean).join(" / ") || "—"}
                              </td>
                              <td className="py-2 px-3 text-center font-semibold text-muted-foreground">
                                {item.uom}
                              </td>
                              <td className="py-2 px-3 text-center font-bold text-blue-600 dark:text-blue-400">
                                {marketUnit}
                              </td>
                              <td className="py-2 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                                {item.conversion || (factor !== 1 ? `1 ${marketUnit} = ${factor} ${item.uom}` : `1:1 Standard`)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                                {item.orderedQuantity} {marketUnit}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                {eqBaseQty} {item.uom}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-muted-foreground whitespace-nowrap">
                                ৳{item.unitPrice.toLocaleString()} <span className="text-[10px] text-muted-foreground">/ {marketUnit}</span>
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-rose-600 whitespace-nowrap">
                                {item.discount ? `-৳${Number(item.discount).toLocaleString()}` : "৳0"}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-muted-foreground whitespace-nowrap">
                                {item.vatRate ? `${item.vatRate}% (৳${(item.vatAmount || 0).toLocaleString()})` : "—"}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-muted-foreground whitespace-nowrap">
                                {item.taxRate ? `${item.taxRate}% (৳${(item.taxAmount || 0).toLocaleString()})` : (item.taxAmount ? `৳${Number(item.taxAmount).toLocaleString()}` : "—")}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-foreground whitespace-nowrap">
                                ৳{item.lineTotal.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border whitespace-nowrap">
                          <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                          <th className="py-2.5 px-3 font-bold">Service / Work Name</th>
                          <th className="py-2.5 px-3 font-bold">Service Code</th>
                          <th className="py-2.5 px-3 font-bold">Work Description &amp; Scope</th>
                          <th className="py-2.5 px-3 w-16 font-bold text-center">UOM</th>
                          <th className="py-2.5 px-3 w-20 text-right font-bold">Work Order Qty</th>
                          <th className="py-2.5 px-3 w-24 text-right font-bold">Unit Rate</th>
                          <th className="py-2.5 px-3 w-28 text-right font-bold">Line Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {currentWoItems.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-muted/20">
                            <td className="py-2 px-3 text-center text-muted-foreground font-bold">{idx + 1}</td>
                            <td className="py-2 px-3 font-bold text-foreground">{item.serviceName}</td>
                            <td className="py-2 px-3 font-mono text-[11px] text-muted-foreground">{item.serviceCode}</td>
                            <td className="py-2 px-3 text-[11px] text-muted-foreground">{item.workDescription} • {item.specification}</td>
                            <td className="py-2 px-3 text-center text-muted-foreground font-semibold">{item.uom}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-foreground">{item.workOrderQuantity}</td>
                            <td className="py-2 px-3 text-right font-mono text-muted-foreground">৳{item.unitRate.toLocaleString()}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-foreground">৳{item.lineTotal.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Financial Summary */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border flex flex-wrap justify-between items-center text-xs">
                  <div className="text-muted-foreground space-y-1">
                    <div>Subtotal: <strong className="text-foreground">৳{selectedOrder.subtotal.toLocaleString()}</strong></div>
                    <div>Discount Deducted: <strong className="text-rose-600">-৳{selectedOrder.discountTotal.toLocaleString()}</strong></div>
                    <div>Applicable VAT: <strong className="text-blue-600 dark:text-blue-400">+৳{selectedOrder.vatTotal.toLocaleString()}</strong></div>
                    <div>Tax (AIT): <strong className="text-amber-600 dark:text-amber-400">+৳{((selectedOrder as any).taxTotal ?? 0).toLocaleString()}</strong></div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Total Sanctioned Value
                    </span>
                    <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      ৳{selectedOrder.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions & Attachments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Terms &amp; Conditions
                  </span>
                  <div className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-line bg-muted/20 p-3 rounded-xl border border-border leading-relaxed">
                    {selectedOrder.termsAndConditions || "Standard commercial terms apply."}
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Order Attachments (Optional)
                  </span>
                  <div className="space-y-2">
                    {selectedOrder.attachments?.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="size-4 text-blue-600 shrink-0" />
                          <span className="font-semibold text-foreground truncate">{att.documentName || att.fileName}</span>
                        </div>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold underline cursor-pointer shrink-0">
                          Download
                        </span>
                      </div>
                    ))}
                    {(!selectedOrder.attachments || selectedOrder.attachments.length === 0) && (
                      <div className="py-4 text-center text-xs text-muted-foreground">
                        No attachments uploaded for this order.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* 13. DEDICATED PURCHASE ORDER / WORK ORDER APPROVAL LIST */
            /* ============================================================== */
            <div className="space-y-6 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-1">
                    <span>Procurement</span>
                    <ChevronRight className="size-3" />
                    <span>Purchase Order</span>
                    <ChevronRight className="size-3" />
                    <span className="text-amber-500 font-bold">PO / WO Approval</span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                    <ShieldCheck className="size-7 text-amber-500" />
                    Purchase Order / Work Order Approval
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                    Official review queue displaying submitted orders awaiting managerial verification and approval sign-off.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-bold flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {submittedOrders.length} Submitted Order(s)
                  </span>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-card rounded-2xl border border-border p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by order no, supplier, requester..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-muted/40 border border-border rounded-xl outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="text-xs px-3 py-2 bg-muted/40 border border-border rounded-xl outline-none font-semibold cursor-pointer"
                  >
                    <option value="All">All Document Types</option>
                    <option value="Purchase Order">Purchase Order</option>
                    <option value="Work Order">Work Order</option>
                  </select>
                </div>
              </div>

              {/* Dedicated Approval List Table */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/80 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border whitespace-nowrap">
                        <th className="py-3 px-4 w-12 text-center font-bold">SL</th>
                        <th className="py-3 px-4 font-bold">Order Number</th>
                        <th className="py-3 px-4 font-bold">Type</th>
                        <th className="py-3 px-4 font-bold">Date</th>
                        <th className="py-3 px-4 font-bold">Supplier / Vendor</th>
                        <th className="py-3 px-4 font-bold">Department</th>
                        <th className="py-3 px-4 font-bold">Prepared By</th>
                        <th className="py-3 px-4 text-right font-bold">Total Amount</th>
                        <th className="py-3 px-4 text-center font-bold">Status</th>
                        <th className="py-3 px-4 text-center font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {submittedOrders.map((ord, idx) => (
                        <tr key={ord.id || idx} className="hover:bg-muted/20 transition">
                          <td className="py-3 px-4 text-center text-muted-foreground font-bold">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(ord)}
                              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            >
                              {ord.orderNumber}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-foreground font-semibold text-[10px]">
                              {ord.documentType === "Purchase Order" ? (
                                <Package className="size-3 text-amber-500" />
                              ) : (
                                <Wrench className="size-3 text-cyan-500" />
                              )}
                              {ord.documentType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground font-medium">
                            {ord.orderDate}
                          </td>
                          <td className="py-3 px-4 font-bold text-foreground max-w-[200px] truncate" title={ord.supplierName}>
                            {ord.supplierName}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {ord.department}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {ord.prepareBy}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                            ৳{ord.grandTotal.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-amber-500/10 text-amber-600 border border-amber-500/20 inline-flex items-center gap-1">
                              <Clock className="size-3" /> Submitted
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(ord)}
                                className="h-7 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-xs transition cursor-pointer"
                                title="Open Approval Details"
                              >
                                Review &amp; Decide
                              </button>
                              <button
                                type="button"
                                onClick={() => setPdfPreviewOrder(ord)}
                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition cursor-pointer"
                                title="View PDF Document"
                              >
                                <Eye className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {submittedOrders.length === 0 && (
                        <tr>
                          <td colSpan={10} className="py-12 text-center text-xs text-muted-foreground">
                            <CheckCircle2 className="size-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                            <p className="font-semibold text-foreground">All caught up!</p>
                            <p className="text-[11px]">There are currently no submitted Purchase Orders or Work Orders awaiting approval.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ============================================================== */}
        {/* 16. STATIONARY DOCKED APPROVAL ACTIONS BAR (PERSISTENT VIEWPORT DOCK) */}
        {/* ============================================================== */}
        {selectedOrder && (
          <div className="shrink-0 bg-white/95 dark:bg-card/95 backdrop-blur-md border-t border-border p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-amber-500 animate-ping" />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Order <strong className="font-mono text-foreground">{selectedOrder.orderNumber}</strong> is awaiting your authorization decision.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleOpenActionModal("Reject Order")}
                className="flex-1 sm:flex-none h-10 px-5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer whitespace-nowrap shrink-0 min-w-fit"
              >
                <XCircle className="size-4" /> Reject Order
              </button>

              <button
                type="button"
                onClick={() => handleOpenActionModal("Return for Correction")}
                className="flex-1 sm:flex-none h-10 px-5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer whitespace-nowrap shrink-0 min-w-fit"
              >
                <RotateCcw className="size-4" /> Return for Correction
              </button>

              <button
                type="button"
                onClick={() => handleOpenActionModal("Approve")}
                className="flex-1 sm:flex-none h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer whitespace-nowrap shrink-0 min-w-fit"
              >
                <CheckCircle2 className="size-4" /> Approve
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 16. APPROVAL ACTION MODAL (COMMENTS TEXTBOX & CONFIRM/CANCEL) */}
      {/* ============================================================== */}
      {actionModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className={`p-4 border-b flex justify-between items-center ${
              activeAction === "Approve"
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900"
                : activeAction === "Return for Correction"
                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900"
                : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900"
            }`}>
              <div className="flex items-center gap-2">
                {activeAction === "Approve" && <CheckCircle2 className="size-5 text-emerald-600" />}
                {activeAction === "Return for Correction" && <RotateCcw className="size-5 text-amber-600" />}
                {activeAction === "Reject Order" && <XCircle className="size-5 text-rose-600" />}
                <h3 className="text-sm font-bold text-foreground">
                  Confirm Decision: {activeAction}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActionModalOpen(false)}
                className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-muted/40 p-3 rounded-xl border border-border space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-mono font-bold text-foreground">{selectedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supplier:</span>
                  <span className="font-semibold text-foreground">{selectedOrder.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-mono font-bold text-emerald-600">৳{selectedOrder.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Comments {activeAction !== "Approve" && <span className="text-rose-500">* (Mandatory)</span>}
                </label>
                <textarea
                  rows={4}
                  placeholder={
                    activeAction === "Approve"
                      ? "Enter any approval notes, caveats, or remarks (optional)..."
                      : activeAction === "Return for Correction"
                      ? "Specify what corrections or adjustments the requester must make..."
                      : "State the mandatory justification for rejecting this order..."
                  }
                  value={actionComments}
                  onChange={(e) => setActionComments(e.target.value)}
                  className="w-full p-3 bg-muted/30 border border-border rounded-xl text-xs outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div className="text-[11px] text-muted-foreground">
                Approver: <strong className="text-foreground">{approverName}</strong> • {approverDesignation}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border flex items-center justify-end gap-2 bg-muted/10">
              <button
                type="button"
                onClick={() => setActionModalOpen(false)}
                className="h-9 px-4 bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground font-bold text-xs rounded-xl cursor-pointer whitespace-nowrap shrink-0 min-w-fit"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`h-9 px-5 text-white font-bold text-xs rounded-xl cursor-pointer transition flex items-center gap-1.5 whitespace-nowrap shrink-0 min-w-fit ${
                  activeAction === "Approve"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                    : activeAction === "Return for Correction"
                    ? "bg-amber-500 hover:bg-amber-600 shadow-sm"
                    : "bg-rose-600 hover:bg-rose-700 shadow-sm"
                }`}
              >
                <Check className="size-4" /> Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Purchase Order / Work Order Landscape Report Modal */}
      <PurchaseOrderReportModal
        isOpen={!!pdfPreviewOrder}
        onClose={() => setPdfPreviewOrder(null)}
        order={pdfReportData}
      />
    </div>
  );
}
