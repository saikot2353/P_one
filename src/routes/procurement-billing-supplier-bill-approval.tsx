import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  CreditCard,
  Building2,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  Eye,
  FileSpreadsheet,
  X,
  Layers,
  ChevronRight,
  Calculator,
  Lock,
  ArrowRight,
  Upload,
  Receipt,
  Check,
  Printer,
  Edit,
  ArrowLeft,
  Paperclip,
  ShieldCheck,
  FileText,
  DollarSign,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import {
  SupplierBill,
  SupplierBillItem,
  MaterialReceive,
  PurchaseOrder,
  getStoredSupplierBills,
  setStoredSupplierBills,
  getStoredMaterialReceipts,
  getStoredPurchaseOrders,
} from "@/lib/procurement-order-inventory-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/procurement-billing-supplier-bill-approval")({
  validateSearch: (search: Record<string, unknown>): { id?: string; billId?: string } => ({
    id: typeof search.id === "string" ? search.id : undefined,
    billId: typeof search.billId === "string" ? search.billId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Supplier Bill Approval — Billing | CRIPTON Procurement" },
      {
        name: "description",
        content:
          "Supplier Bill Approval workflow. Approvers review comprehensive vendor bill details matching create form structure, audit MRR quantities and financial adjustments, and execute approval actions.",
      },
    ],
  }),
  component: SupplierBillApprovalPage,
});

export function SupplierBillApprovalPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();

  const [bills, setBills] = useState<SupplierBill[]>(() => {
    const all = getStoredSupplierBills();
    // Default ensure at least one pending bill exists for interactive review
    if (all.length > 0 && !all.some((b) => b.approvalStatus === "Pending Approval")) {
      all[0].approvalStatus = "Pending Approval";
    }
    return all;
  });

  const purchaseOrders = useMemo(() => getStoredPurchaseOrders(), []);

  // Selected Bill for Approval Review
  const [selectedBillId, setSelectedBillId] = useState<string>(() => {
    const target = searchParams.id || searchParams.billId;
    if (target) return target;
    const pending = bills.find((b) => b.approvalStatus === "Pending Approval");
    return pending ? pending.id : bills[0]?.id || "";
  });

  // Keep in sync with search param if changed
  useEffect(() => {
    const target = searchParams.id || searchParams.billId;
    if (target) {
      setSelectedBillId(target);
    }
  }, [searchParams.id, searchParams.billId]);

  const selectedBill = useMemo(() => {
    return bills.find((b) => b.id === selectedBillId) || bills[0] || null;
  }, [bills, selectedBillId]);

  // PO Reference for the selected bill
  const currentPo = useMemo(() => {
    if (!selectedBill) return purchaseOrders[0];
    return (
      purchaseOrders.find((p) => p.orderNumber === selectedBill.poNumber) || {
        supplierName: selectedBill.supplierName,
        orderDate: selectedBill.poDate || "2026-09-15",
      }
    );
  }, [purchaseOrders, selectedBill]);

  // Action Confirmation Modal State
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    type: "Approve" | "Return" | "Reject" | null;
  }>({ open: false, type: null });
  const [actionRemarks, setActionRemarks] = useState("");
  const [previewReportOpen, setPreviewReportOpen] = useState(false);

  const handleOpenActionModal = (type: "Approve" | "Return" | "Reject") => {
    setActionModal({ open: true, type });
    setActionRemarks("");
  };

  const handleConfirmAction = () => {
    if (!selectedBill || !actionModal.type) return;

    if ((actionModal.type === "Return" || actionModal.type === "Reject") && !actionRemarks.trim()) {
      toast.error(`Please enter remarks for ${actionModal.type.toLowerCase()}ing this bill.`);
      return;
    }

    let nextStatus: SupplierBill["approvalStatus"] = "Approved";
    let toastMsg = "";

    if (actionModal.type === "Approve") {
      nextStatus = "Approved";
      toastMsg = `Supplier Bill "${selectedBill.billNumber}" has been Approved successfully!`;
    } else if (actionModal.type === "Return") {
      nextStatus = "Returned";
      toastMsg = `Supplier Bill "${selectedBill.billNumber}" has been Returned for correction.`;
    } else if (actionModal.type === "Reject") {
      nextStatus = "Rejected";
      toastMsg = `Supplier Bill "${selectedBill.billNumber}" has been Rejected.`;
    }

    const updated = bills.map((b) =>
      b.id === selectedBill.id
        ? {
            ...b,
            approvalStatus: nextStatus,
            approvedBy:
              actionModal.type === "Approve"
                ? "Engr. Tanvir Ahmed (Director - SCM & Operations)"
                : undefined,
            approvedDate:
              actionModal.type === "Approve"
                ? new Date().toISOString().slice(0, 10)
                : undefined,
            approvalRemarks:
              actionRemarks ||
              (actionModal.type === "Approve" ? "Verified and approved." : undefined),
          }
        : b
    );

    setBills(updated);
    setStoredSupplierBills(updated);
    setActionModal({ open: false, type: null });
    setActionRemarks("");
    toast.success(toastMsg);
    navigate({ to: "/procurement-billing-supplier-bill-approval-list" });
  };

  // Standard Preview Report Data
  const billReportData: StandardReportData = useMemo(() => {
    if (!selectedBill) {
      return {
        reportType: "supplier-bill",
        title: "Supplier Commercial Bill / Invoice Dossier",
        documentNo: "BIL-2026-0001",
        documentDate: new Date().toISOString().slice(0, 10),
        department: "Finance & Accounts",
        status: "Draft",
        metadata: [],
        items: [],
        financials: [],
        signatures: [],
      };
    }

    return {
      reportType: "supplier-bill",
      title: "Supplier Commercial Bill / Invoice Dossier",
      documentNo: selectedBill.billNumber,
      documentDate: selectedBill.billDate,
      department: "Finance & Accounts (Procurement Billing Approval)",
      status: selectedBill.approvalStatus,
      metadata: [
        { label: "Internal Bill No", value: selectedBill.billNumber, highlight: true },
        { label: "Bill Date", value: selectedBill.billDate },
        { label: "Supplier / Vendor", value: selectedBill.supplierName, highlight: true },
        { label: "Vendor Invoice No", value: selectedBill.supplierBillNo || "—" },
        { label: "Vendor Invoice Date", value: selectedBill.supplierBillDate || "—" },
        { label: "PO Reference", value: selectedBill.poNumber },
        { label: "Linked MRR References", value: (selectedBill.mrrNumbers || []).join(", ") },
        { label: "Currency", value: selectedBill.currency || "BDT" },
        { label: "Payment Due Date", value: selectedBill.paymentDueDate },
      ],
      items: (selectedBill.items || []).map((item, idx) => ({
        sl: idx + 1,
        itemCode: item.itemCode,
        itemName: item.itemName,
        specification: item.specification,
        brandOrigin: `${item.brand} / ${item.origin}`,
        uom: item.uom,
        quantity: item.currentBillQty,
        unitPrice: item.unitPrice,
        totalAmount: item.lineAmount,
        remarks: `MRR Qty: ${item.mrrReceivedQty} (Prev Billed: ${item.previouslyBilledQty})`,
      })),
      financials: [
        {
          label: "Subtotal (Items Base)",
          value: `৳ ${selectedBill.subtotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
        },
        {
          label: "Discount",
          value: `- ৳ ${selectedBill.discount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
        },
        {
          label: "VAT",
          value: `+ ৳ ${selectedBill.vat.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
        },
        {
          label: "Other Charges",
          value: `+ ৳ ${selectedBill.otherCharges.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
        },
        {
          label: "Adjustment (+/-)",
          value: `৳ ${selectedBill.adjustment.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
        },
        {
          label: "Net Approved Amount",
          value: `৳ ${selectedBill.netBillAmount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
          isTotal: true,
        },
      ],
      remarks:
        selectedBill.approvalRemarks ||
        selectedBill.remarks ||
        "Supplier bill audited against purchase order terms, delivered MRR quantities, and tax calculations.",
      signatures: [
        {
          role: "Bill Submitted By",
          name: selectedBill.submittedBy || "Tahmid Afsar Shapno",
          title: "Commercial Billing Officer",
          date: selectedBill.submittedDate || selectedBill.billDate,
        },
        {
          role: "Store & Inventory Verified",
          name: "Md. Rafiqul Islam",
          title: "Manager, Central Warehouse",
          date: selectedBill.billDate,
        },
        {
          role: "Accounts & Tax Auditor",
          name: "K. H. Mahmud",
          title: "Head of Accounts",
          date: selectedBill.billDate,
        },
        {
          role: "Approving Authority",
          name: selectedBill.approvedBy || "Engr. Tanvir Ahmed",
          title: "Director (SCM & Operations)",
          date: selectedBill.approvedDate || selectedBill.billDate,
        },
      ],
    };
  }, [selectedBill]);

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <ProcurementSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProcurementTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-1">
                <span>Procurement</span>
                <ChevronRight className="size-3" />
                <span>Billing</span>
                <ChevronRight className="size-3" />
                <span className="text-amber-500 font-bold">Supplier Bill Approval</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <ShieldCheck className="size-7 text-amber-500" />
                Supplier Bill Approval
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Review submitted supplier invoices with matching creation form structure, verify MRR quantities, and execute approval actions.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewReportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer"
                title="Preview Standard Report"
              >
                <Printer className="size-3.5" /> Preview Report
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/procurement-billing-supplier-bill-approval-list" })}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-3.5" /> Back to Approval List
              </button>
            </div>
          </div>

          {/* Supplier Bill Review Dossier Form (Identical Form Structure to Create Bill) */}
          {selectedBill && (
            <div className="bg-card rounded-2xl border-2 border-border/80 p-6 shadow-sm space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <Receipt className="size-5 text-amber-500" />
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Supplier Bill Review Dossier — {selectedBill.billNumber}
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      Review all submitted vendor invoice fields, MRR quantities, and financial adjustments before authorization.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border ${
                      selectedBill.approvalStatus === "Approved"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : selectedBill.approvalStatus === "Returned"
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }`}
                  >
                    Status: {selectedBill.approvalStatus}
                  </span>
                  <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {selectedBill.billNumber}
                  </span>
                </div>
              </div>

              {/* 1. Bill Header Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Bill ID / Number
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedBill.billNumber}
                    className="w-full px-3 py-2 font-mono font-bold bg-muted/50 border border-border rounded-lg cursor-not-allowed select-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Bill Date
                  </label>
                  <input
                    type="date"
                    readOnly
                    value={selectedBill.billDate}
                    className="w-full px-3 py-2 font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Purchase Order / Work Order
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${selectedBill.poNumber} (${currentPo.orderDate || ""})`}
                    className="w-full px-3 py-2 font-mono font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Lock className="size-3" /> Supplier / Vendor
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedBill.supplierName}
                    className="w-full px-3 py-2 font-bold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Supplier Bill / Invoice No.
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedBill.supplierBillNo}
                    className="w-full px-3 py-2 font-mono font-bold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Supplier Bill Date
                  </label>
                  <input
                    type="date"
                    readOnly
                    value={selectedBill.supplierBillDate}
                    className="w-full px-3 py-2 font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${selectedBill.currency || "BDT"} (৳ Bangladeshi Taka)`}
                    className="w-full px-3 py-2 font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    readOnly
                    value={selectedBill.paymentDueDate}
                    className="w-full px-3 py-2 font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>

              {/* 2. MRR Reference Section */}
              <div className="bg-muted/20 p-4 rounded-xl border border-border space-y-3">
                <div className="flex items-center gap-2">
                  <span className="size-5 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-[10px] font-black">
                    2
                  </span>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Linked Material Receive Report (MRR) References
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(selectedBill.mrrNumbers || []).map((mrrNo) => (
                    <span
                      key={mrrNo}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs"
                    >
                      {mrrNo}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  PO Reference: <span className="font-bold text-foreground">{selectedBill.poNumber}</span> • Supplier: <span className="font-bold text-foreground">{selectedBill.supplierName}</span>
                </div>
              </div>

              {/* 3. Bill Item Details from MRR */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    Bill Item Details (MRR Verified Quantities)
                    <span className="text-[10px] text-muted-foreground normal-case font-normal">
                      (Current Bill Qty ≤ MRR Received Qty − Previously Billed Qty)
                    </span>
                  </h3>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                        <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                        <th className="py-2.5 px-3 font-bold">Item & Specification</th>
                        <th className="py-2.5 px-3 font-bold">Brand / Origin</th>
                        <th className="py-2.5 px-3 w-16 font-bold">UOM</th>
                        <th className="py-2.5 px-3 text-right font-bold">MRR Rec. Qty</th>
                        <th className="py-2.5 px-3 text-right font-bold">Prev Billed</th>
                        <th className="py-2.5 px-3 text-right font-bold w-28 text-amber-600">
                          Current Bill Qty
                        </th>
                        <th className="py-2.5 px-3 text-right font-bold">Unit Price (৳)</th>
                        <th className="py-2.5 px-3 text-right font-bold">VAT</th>
                        <th className="py-2.5 px-3 text-right font-bold">Line Total (৳)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(selectedBill.items || []).map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-muted/20">
                          <td className="py-2.5 px-3 text-center text-muted-foreground font-bold">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-foreground">{item.itemName}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {item.itemCode} • {item.specification}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {item.brand} / {item.origin}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground font-semibold">
                            {item.uom}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                            {item.mrrReceivedQty}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                            {item.previouslyBilledQty}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-600 text-xs">
                            {item.currentBillQty}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                            ৳ {item.unitPrice.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                            ৳ {item.vatAmount.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                            ৳ {item.lineAmount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Bill Amount Summary & Calculations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Submitter Remarks & Payment Notes
                  </label>
                  <textarea
                    rows={3}
                    readOnly
                    value={selectedBill.remarks || "No vendor remarks provided."}
                    className="w-full p-2.5 text-xs bg-muted/40 border border-border rounded-xl cursor-not-allowed"
                  />

                  {/* Financial inputs display: Other Charges, Adjustment, Discount, VAT */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                        Other Charges (Freight/Loading)
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={`৳ ${selectedBill.otherCharges.toLocaleString()}`}
                        className="w-full px-2.5 py-1.5 font-mono bg-muted/40 border border-border rounded-lg cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                        Adjustment (+/-)
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={`৳ ${selectedBill.adjustment.toLocaleString()}`}
                        className="w-full px-2.5 py-1.5 font-mono bg-muted/40 border border-border rounded-lg cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-emerald-600 uppercase block mb-1">
                        Discount (৳)
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={`- ৳ ${selectedBill.discount.toLocaleString()}`}
                        className="w-full px-2.5 py-1.5 font-mono bg-muted/40 border border-emerald-500/30 text-emerald-600 rounded-lg cursor-not-allowed font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-blue-600 uppercase block mb-1">
                        VAT Amount (৳)
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={`+ ৳ ${selectedBill.vat.toLocaleString()}`}
                        className="w-full px-2.5 py-1.5 font-mono bg-muted/40 border border-blue-500/30 text-blue-600 rounded-lg cursor-not-allowed font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Summary Box */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-foreground">
                      ৳ {selectedBill.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Discount</span>
                    <span className="font-mono text-emerald-600 font-bold">
                      - ৳ {selectedBill.discount.toLocaleString()}
                    </span>
                  </div>
                  {/* VAT Label: standard VAT (not VAT 5%) */}
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>VAT</span>
                    <span className="font-mono font-bold text-foreground">
                      + ৳ {selectedBill.vat.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Other Charges</span>
                    <span className="font-mono font-bold text-foreground">
                      + ৳ {selectedBill.otherCharges.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Adjustment</span>
                    <span className="font-mono font-bold text-foreground">
                      ৳ {selectedBill.adjustment.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between items-baseline">
                    <span className="text-xs font-black uppercase text-foreground">
                      Net Payable Amount
                    </span>
                    <span className="text-lg font-black font-mono text-amber-600">
                      ৳ {selectedBill.netBillAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Supporting Attachments */}
              <div className="space-y-3 pt-2 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <Paperclip className="size-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Supporting Attachments & Vendor Invoices
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-muted/20 text-xs">
                    <FileText className="size-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-foreground font-mono">
                        Invoice_{selectedBill.supplierBillNo}.pdf
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Vendor certified scan • 1.4 MB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.info(`Viewing vendor scan for ${selectedBill.supplierBillNo}`)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted cursor-pointer"
                  >
                    <Eye className="size-3.5" /> View Document
                  </button>
                </div>
              </div>

              {/* Approval Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/70">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-amber-500" />
                  <span>Execute authorization decision. You will be prompted for comments/remarks in the confirmation window.</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOpenActionModal("Reject")}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-rose-500/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-all cursor-pointer"
                  >
                    Reject Bill
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenActionModal("Return")}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
                  >
                    Return for Correction
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenActionModal("Approve")}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Check className="size-4" /> Approve Supplier Bill
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Approval Action Confirmation Modal */}
      {actionModal.open && actionModal.type && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                {actionModal.type === "Approve" ? (
                  <CheckCircle2 className="size-5 text-emerald-500" />
                ) : actionModal.type === "Return" ? (
                  <RotateCcw className="size-5 text-amber-500" />
                ) : (
                  <AlertTriangle className="size-5 text-rose-500" />
                )}
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {actionModal.type === "Approve"
                      ? "Approve Supplier Bill"
                      : actionModal.type === "Return"
                      ? "Return Bill for Correction"
                      : "Reject Supplier Bill"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Bill No: {selectedBill?.billNumber} • Supplier: {selectedBill?.supplierName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActionModal({ open: false, type: null })}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Comments / Remarks {actionModal.type !== "Approve" && <span className="text-rose-500">*</span>}
              </label>
              <textarea
                rows={3}
                value={actionRemarks}
                onChange={(e) => setActionRemarks(e.target.value)}
                placeholder={
                  actionModal.type === "Approve"
                    ? "Optional approval remarks or verification notes..."
                    : actionModal.type === "Return"
                    ? "Enter specific corrections required before resubmission..."
                    : "Enter justification remarks for rejection..."
                }
                className="w-full p-2.5 text-xs bg-background border border-border rounded-xl outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setActionModal({ open: false, type: null })}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer transition-all ${
                  actionModal.type === "Approve"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                    : actionModal.type === "Return"
                    ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                    : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                }`}
              >
                Confirm {actionModal.type === "Approve" ? "Approval" : actionModal.type === "Return" ? "Return" : "Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standard Preview Report Modal */}
      <StandardPreviewReportModal
        isOpen={previewReportOpen}
        onClose={() => setPreviewReportOpen(false)}
        data={billReportData}
      />
    </div>
  );
}
