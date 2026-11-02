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
  Sparkles,
  Layers,
  Paperclip,
  History,
  Lock,
  User,
  MapPin,
  Phone,
  Mail,
  Download,
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
  syncReceiveListWithOrders,
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
      area: pdfPreviewOrder.area,
      contractPerson: pdfPreviewOrder.contractPerson,
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
      syncReceiveListWithOrders();
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

              {/* 1. ORDER CREATION METHOD */}
              <div className="bg-card rounded-2xl border border-border p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="size-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs font-black">
                      1
                    </span>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Order Creation Method</span>
                    </h2>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Method used to initiate this order and bind catalog / comparative statement rates
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      id: "Purchase Requisition",
                      title: "Purchase Requisition",
                      desc: "Convert approved requisition into purchase order",
                      icon: Package,
                    },
                    {
                      id: "Comparative Statement",
                      title: "Comparative Statement",
                      desc: "Bind vendor & rates from approved CS",
                      icon: FileSpreadsheet,
                    },
                    {
                      id: "Direct Purchase Order / Work Order",
                      title: "Direct PO / WO",
                      desc: "Direct procurement entry without prior PR/CS",
                      icon: Sparkles,
                    },
                  ].map((m) => {
                    const effectiveMethod =
                      selectedOrder.creationMethod ||
                      (selectedOrder.csId
                        ? "Comparative Statement"
                        : selectedOrder.prIds && selectedOrder.prIds.length > 0
                        ? "Purchase Requisition"
                        : "Direct Purchase Order / Work Order");
                    const isSelected = effectiveMethod === m.id;
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition ${
                          isSelected
                            ? "border-blue-500/60 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500/30 shadow-xs"
                            : "border-border/60 bg-muted/20 opacity-60"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            isSelected ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                            <span>{m.title}</span>
                            {isSelected && (
                              <CheckCircle2 className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{m.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. ORDER HEADER INFORMATION */}
              <div className="bg-card rounded-2xl border border-border p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs font-black">
                      2
                    </span>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <FileText className="size-4 text-blue-600 dark:text-blue-400" />
                      <span>Order Header Information</span>
                    </h2>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    Status: {selectedOrder.orderStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Field 1: Document Type */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Document Type *</label>
                    <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 font-semibold text-foreground flex items-center">
                      {selectedOrder.documentType === "Purchase Order"
                        ? "Purchase Order (Goods)"
                        : "Work Order (Services)"}
                    </div>
                  </div>

                  {/* Field 2: Order Number */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Order Number</label>
                    <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center">
                      {selectedOrder.orderNumber}
                    </div>
                  </div>

                  {/* Field 3: Order Date */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Order Date *</label>
                    <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 font-medium text-foreground flex items-center">
                      {selectedOrder.orderDate}
                    </div>
                  </div>

                  {/* Field 4: Prepared By */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Prepared By</label>
                    <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 font-medium text-foreground flex items-center">
                      {selectedOrder.prepareBy}
                    </div>
                  </div>

                  {/* Field 5: Department */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Department</label>
                    <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 font-medium text-foreground flex items-center">
                      {selectedOrder.department}
                    </div>
                  </div>

                  {/* Field 6: Supplier / Vendor */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground flex items-center justify-between">
                      <span>Supplier / Vendor *</span>
                      {selectedOrder.creationMethod === "Comparative Statement" && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                          <Lock className="size-2.5" /> CS Locked
                        </span>
                      )}
                    </label>
                    <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 flex flex-col justify-center">
                      <div className="font-bold text-foreground truncate">
                        {selectedOrder.supplierName}{" "}
                        <span className="text-muted-foreground font-mono font-normal text-[11px]">
                          ({selectedOrder.supplierCode || "SUP"})
                        </span>
                      </div>
                      {(selectedOrder.contactPerson || selectedOrder.contactNumber) && (
                        <div className="text-[10px] text-muted-foreground truncate">
                          {selectedOrder.contactPerson} • {selectedOrder.contactNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location Fields: Delivery Warehouse (for PO) vs Work Location, Area, Contract Person (for WO) */}
                  {selectedOrder.documentType === "Purchase Order" ? (
                    <div>
                      <label className="block text-xs font-bold mb-1 text-foreground">
                        Delivery Warehouse *
                      </label>
                      <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 font-semibold text-foreground flex items-center truncate">
                        {selectedOrder.deliveryWarehouse || "Central Raw Material Warehouse"}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Work Location (Company Name) */}
                      <div>
                        <label className="block text-xs font-bold mb-1 text-foreground">
                          Work Location *
                        </label>
                        <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 font-semibold text-foreground flex items-center truncate">
                          {selectedOrder.workLocation || "Pakiza Knit Composite Ltd"}
                        </div>
                      </div>

                      {/* Area */}
                      <div>
                        <label className="block text-xs font-bold mb-1 text-foreground">
                          Area
                        </label>
                        <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 font-medium text-foreground flex items-center truncate">
                          {selectedOrder.area || "—"}
                        </div>
                      </div>

                      {/* Contract Person */}
                      <div>
                        <label className="block text-xs font-bold mb-1 text-foreground">
                          Contract Person
                        </label>
                        <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 font-medium text-foreground flex items-center truncate">
                          {selectedOrder.contractPerson || "—"}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Expected Delivery Date / Expected Service Date */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">
                      {selectedOrder.documentType === "Work Order"
                        ? "Expected Service Date *"
                        : "Expected Delivery Date *"}
                    </label>
                    <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 font-medium text-foreground flex items-center">
                      {selectedOrder.deliveryDate || "—"}
                    </div>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Currency</label>
                    <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 font-bold text-foreground flex items-center justify-between">
                      <span>{selectedOrder.currency || "BDT"}</span>
                      {selectedOrder.currency && selectedOrder.currency !== "BDT" && selectedOrder.exchangeRate && (
                        <span className="text-[11px] font-mono text-muted-foreground font-normal">
                          Rate: ৳{selectedOrder.exchangeRate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Mode / Terms */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Payment Mode / Terms</label>
                    <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 font-medium text-foreground flex items-center">
                      {selectedOrder.paymentMode || "Credit 30 Days"}
                    </div>
                  </div>

                  {/* Purchase Requisition */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Purchase Requisition</label>
                    <div className="w-full min-h-[34px] px-2.5 py-1 bg-muted/40 border border-border/80 rounded-lg text-xs flex flex-wrap items-center gap-1">
                      {selectedOrder.prIds && selectedOrder.prIds.length > 0 ? (
                        selectedOrder.prIds.map((prNo) => (
                          <span
                            key={prNo}
                            className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-bold"
                          >
                            {prNo}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-[11px]">
                          {selectedOrder.creationMethod === "Purchase Requisition"
                            ? "No PRs Tagged"
                            : "Disabled (Method: Not PR)"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comparative Statement (CS) */}
                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">
                      Comparative Statement (CS)
                    </label>
                    <div className="w-full min-h-[34px] px-3 py-1.5 bg-muted/40 border border-border/80 rounded-lg text-xs flex items-center">
                      {selectedOrder.csId ? (
                        <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-bold text-xs">
                          {selectedOrder.csId}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">
                          {selectedOrder.creationMethod === "Comparative Statement"
                            ? "None Selected"
                            : "Disabled (Method: Not CS)"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Job Description / Remarks (Immediately after Comparative Statement, spans 3 cols in Work Order) */}
                  <div
                    className={
                      selectedOrder.documentType === "Work Order"
                        ? "sm:col-span-1 lg:col-span-3"
                        : "sm:col-span-1 lg:col-span-1"
                    }
                  >
                    <label className="block text-xs font-bold mb-1 text-foreground">
                      Job Description / Subject Remarks
                    </label>
                    <div className="w-full min-h-[34px] px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 text-xs text-foreground flex items-center">
                      {selectedOrder.remarks || "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* 3. MATERIAL / SERVICE LINE ITEMS */}
              {/* ============================================================== */}
              <div className="bg-card rounded-2xl border border-border p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-6 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center text-xs font-black">
                      3
                    </span>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Layers className="size-4 text-purple-600 dark:text-purple-400" />
                      <span>
                        {selectedOrder.documentType === "Purchase Order"
                          ? "Order Item Details"
                          : "Service / Scope of Work Details"}
                      </span>
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
                        {currentPoItems.length === 0 && (
                          <tr>
                            <td colSpan={14} className="py-8 text-center text-xs text-muted-foreground">
                              No Material items recorded for this Purchase Order.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border whitespace-nowrap">
                          <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                          <th className="py-2.5 px-3 min-w-[200px] font-bold">Service / Work Name</th>
                          <th className="py-2.5 px-3 min-w-[220px] font-bold">Specification</th>
                          <th className="py-2.5 px-3 text-center w-20 font-bold">UOM</th>
                          <th className="py-2.5 px-3 text-right w-24 font-bold">Work Qty</th>
                          <th className="py-2.5 px-3 text-right min-w-[110px] w-28 font-bold">Unit Rate (৳)</th>
                          <th className="py-2.5 px-3 text-right min-w-[80px] w-20 font-bold">VAT (%)</th>
                          <th className="py-2.5 px-3 text-right min-w-[80px] w-20 font-bold">Tax (%)</th>
                          <th className="py-2.5 px-3 text-right w-28 font-bold">Total (৳)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {currentWoItems.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-muted/20">
                            <td className="py-2.5 px-3 text-center text-muted-foreground font-mono font-bold">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-foreground">{item.serviceName}</div>
                              <div className="text-[10px] text-muted-foreground font-mono">{item.serviceCode}</div>
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground text-xs">
                              {item.workDescription || item.specification || "—"}
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <span className="inline-block font-mono font-bold text-foreground text-xs px-2.5 py-1 bg-muted/40 rounded border border-border/60">
                                {item.uom}
                              </span>
                            </td>
                            <td className="py-2.5 px-2 text-right font-mono font-bold text-foreground">
                              {item.workOrderQuantity}
                            </td>
                            <td className="py-2.5 px-2 text-right font-mono text-muted-foreground">
                              ৳{(item.unitRate || 0).toLocaleString()}
                            </td>
                            <td className="py-2.5 px-2 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                              {item.vatRate != null ? `${item.vatRate}%` : "5%"}
                            </td>
                            <td className="py-2.5 px-2 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                              {item.taxRate != null ? `${item.taxRate}%` : "0%"}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                              ৳{(item.lineTotal || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        {currentWoItems.length === 0 && (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-xs text-muted-foreground">
                              No Service lines recorded for this Work Order.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Financial Summary Card */}
                <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground font-medium">
                    <span className="font-semibold text-foreground">
                      Line Items:{" "}
                      <strong className="text-blue-600 dark:text-blue-400 font-mono">
                        {selectedOrder.documentType === "Purchase Order"
                          ? currentPoItems.length
                          : currentWoItems.length}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Subtotal:{" "}
                      <strong className="text-foreground font-mono">
                        ৳{selectedOrder.subtotal.toLocaleString()}
                      </strong>
                    </span>
                    <span>•</span>
                    <span className="text-rose-600 dark:text-rose-400">
                      Discount:{" "}
                      <strong className="font-mono">
                        -৳{selectedOrder.discountTotal.toLocaleString()}
                      </strong>
                    </span>
                    <span>•</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      Applicable VAT:{" "}
                      <strong className="font-mono">
                        +৳{selectedOrder.vatTotal.toLocaleString()}
                      </strong>
                    </span>
                    <span>•</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      Applicable Tax:{" "}
                      <strong className="font-mono">
                        +৳{((selectedOrder as any).taxTotal || 0).toLocaleString()}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                      Grand Total ({selectedOrder.currency || "BDT"}):
                    </span>
                    <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-500/20">
                      ৳{selectedOrder.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. TERMS & CONDITIONS AND SUPPORTING ATTACHMENTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
                    <FileSpreadsheet className="size-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Terms &amp; Conditions
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-line bg-muted/20 p-3.5 rounded-xl border border-border leading-relaxed">
                    {selectedOrder.termsAndConditions || "Standard commercial terms apply."}
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
                    <Paperclip className="size-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Supporting Attachments
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedOrder.attachments?.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="size-4 text-blue-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-foreground block truncate">
                              {att.documentName || att.fileName}
                            </span>
                            {att.fileSize && (
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {att.fileSize}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold underline cursor-pointer shrink-0">
                          Download
                        </span>
                      </div>
                    ))}
                    {(!selectedOrder.attachments || selectedOrder.attachments.length === 0) && (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        No attachments uploaded for this order.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. APPROVAL WORKFLOW & AUDIT TRAIL */}
              {selectedOrder.approvalHistory && selectedOrder.approvalHistory.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <History className="size-4 text-blue-600 dark:text-blue-400" />
                      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                        Approval Workflow &amp; Audit Trail
                      </h2>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {selectedOrder.approvalHistory.length} Recorded Step(s)
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border whitespace-nowrap">
                          <th className="py-2.5 px-3 w-12 text-center font-bold">Step</th>
                          <th className="py-2.5 px-3 font-bold">Reviewer / Approver</th>
                          <th className="py-2.5 px-3 font-bold">Designation</th>
                          <th className="py-2.5 px-3 text-center font-bold">Action Taken</th>
                          <th className="py-2.5 px-3 font-bold">Date &amp; Time</th>
                          <th className="py-2.5 px-3 font-bold">Comments / Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedOrder.approvalHistory.map((step, idx) => (
                          <tr key={idx} className="hover:bg-muted/20">
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-muted-foreground">
                              {step.level}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-foreground">{step.approver}</td>
                            <td className="py-2.5 px-3 text-muted-foreground">{step.designation}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                  step.action === "Approved"
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : step.action === "Rejected"
                                    ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                    : step.action === "Returned for Correction"
                                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                    : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                }`}
                              >
                                {step.action}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                              {step.dateTime}
                            </td>
                            <td className="py-2.5 px-3 text-xs text-muted-foreground">
                              {step.remarks || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
