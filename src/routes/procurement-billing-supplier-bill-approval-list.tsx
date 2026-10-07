import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  CreditCard,
  Building2,
  Calendar,
  Search,
  Eye,
  FileSpreadsheet,
  Printer,
  FileText,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  Filter,
  Clock,
  RotateCcw,
  XCircle,
  ShieldCheck,
  Check,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  SupplierBill,
  getStoredSupplierBills,
} from "@/lib/procurement-order-inventory-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/procurement-billing-supplier-bill-approval-list")({
  head: () => ({
    meta: [
      { title: "Supplier Bill Approval List — CRIPTON Procurement" },
      {
        name: "description",
        content:
          "Supplier Bill Approval registry and queue. Filter pending, approved, and returned supplier bills and process approval decisions.",
      },
    ],
  }),
  component: SupplierBillApprovalListPage,
});

export function SupplierBillApprovalListPage() {
  const navigate = useNavigate();

  const [bills] = useState<SupplierBill[]>(() => {
    const all = getStoredSupplierBills();
    // Default ensure at least one pending bill exists for interactive review
    if (all.length > 0 && !all.some((b) => b.approvalStatus === "Pending Approval")) {
      all[0].approvalStatus = "Pending Approval";
    }
    return all;
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [filterPo, setFilterPo] = useState("");
  const [filterMrr, setFilterMrr] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Pending Approval");

  // Preview Report state
  const [previewBill, setPreviewBill] = useState<SupplierBill | null>(null);

  // Unique suppliers for dropdown
  const uniqueSuppliers = useMemo(() => {
    const set = new Set<string>();
    bills.forEach((b) => {
      if (b.supplierName) set.add(b.supplierName);
    });
    return Array.from(set).sort();
  }, [bills]);

  // Filtered bills
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      // General search: Bill No, Vendor Bill No, Supplier, PO, MRR
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          b.billNumber.toLowerCase().includes(q) ||
          b.supplierBillNo.toLowerCase().includes(q) ||
          b.supplierName.toLowerCase().includes(q) ||
          b.poNumber.toLowerCase().includes(q) ||
          (b.mrrNumbers && b.mrrNumbers.some((m) => m.toLowerCase().includes(q))) ||
          (b.submittedBy && b.submittedBy.toLowerCase().includes(q));
        if (!matchesQ) return false;
      }

      // Supplier filter
      if (filterSupplier !== "All" && b.supplierName !== filterSupplier) {
        return false;
      }

      // PO filter
      if (filterPo.trim()) {
        if (!b.poNumber.toLowerCase().includes(filterPo.toLowerCase().trim())) {
          return false;
        }
      }

      // MRR filter
      if (filterMrr.trim()) {
        const mrrMatch = b.mrrNumbers?.some((m) =>
          m.toLowerCase().includes(filterMrr.toLowerCase().trim())
        );
        if (!mrrMatch) return false;
      }

      // Date range filter
      if (filterDateFrom && b.billDate < filterDateFrom) return false;
      if (filterDateTo && b.billDate > filterDateTo) return false;

      // Status filter
      if (filterStatus !== "All") {
        if (b.approvalStatus !== filterStatus) return false;
      }

      return true;
    });
  }, [
    bills,
    searchQuery,
    filterSupplier,
    filterPo,
    filterMrr,
    filterDateFrom,
    filterDateTo,
    filterStatus,
  ]);

  // Statistics Cards
  const stats = useMemo(() => {
    const total = bills.length;
    const pending = bills.filter((b) => b.approvalStatus === "Pending Approval").length;
    const approved = bills.filter((b) => b.approvalStatus === "Approved").length;
    const returned = bills.filter((b) => b.approvalStatus === "Returned").length;
    const rejected = bills.filter((b) => b.approvalStatus === "Rejected").length;
    const pendingAmount = bills
      .filter((b) => b.approvalStatus === "Pending Approval")
      .reduce((sum, b) => sum + (b.netBillAmount || 0), 0);

    return { total, pending, approved, returned, rejected, pendingAmount };
  }, [bills]);

  // Generate Report Data for selected preview bill
  const previewReportData: StandardReportData | null = useMemo(() => {
    if (!previewBill) return null;
    return {
      reportType: "supplier-bill",
      title: "Supplier Commercial Bill / Invoice Dossier",
      documentNo: previewBill.billNumber,
      documentDate: previewBill.billDate,
      department: "Finance & Accounts (Procurement Billing Approval)",
      status: previewBill.approvalStatus,
      metadata: [
        { label: "Internal Bill No", value: previewBill.billNumber, highlight: true },
        { label: "Bill Date", value: previewBill.billDate },
        { label: "Supplier / Vendor", value: previewBill.supplierName, highlight: true },
        { label: "Vendor Invoice No", value: previewBill.supplierBillNo || "—" },
        { label: "Vendor Invoice Date", value: previewBill.supplierBillDate || "—" },
        { label: "PO Reference", value: previewBill.poNumber },
        { label: "Linked MRR References", value: (previewBill.mrrNumbers || []).join(", ") },
        { label: "Currency", value: previewBill.currency || "BDT" },
        { label: "Payment Due Date", value: previewBill.paymentDueDate },
      ],
      tableHeaders: [
        "SL",
        "Item Description & Spec",
        "Brand / Origin",
        "UOM",
        "Billed Qty",
        "Unit Price",
        "Total Amount",
        "Remarks",
      ],
      tableRows: (previewBill.items || []).map((item, idx) => [
        idx + 1,
        `${item.itemName} (${item.itemCode})`,
        `${item.brand} / ${item.origin}`,
        item.uom,
        item.currentBillQty,
        `৳ ${item.unitPrice.toLocaleString()}`,
        `৳ ${item.lineAmount.toLocaleString()}`,
        `MRR Qty: ${item.mrrReceivedQty}`,
      ]),
      summaryCards: [
        { label: "Subtotal", value: `৳ ${previewBill.subtotal.toLocaleString()}` },
        { label: "Discount", value: `- ৳ ${previewBill.discount.toLocaleString()}` },
        { label: "VAT", value: `+ ৳ ${previewBill.vat.toLocaleString()}` },
        { label: "Other Charges", value: `+ ৳ ${previewBill.otherCharges.toLocaleString()}` },
        { label: "Adjustment", value: `৳ ${previewBill.adjustment.toLocaleString()}` },
        {
          label: "Net Bill Amount",
          value: `৳ ${previewBill.netBillAmount.toLocaleString()}`,
          isBold: true,
          isHighlight: true,
        },
      ],
      signatures: [
        { role: "Submitted By", name: previewBill.submittedBy || "Tahmid Afsar Shapno", designation: "Commercial Billing Officer" },
        { role: "Approved By", name: previewBill.approvedBy || "Engr. Tanvir Ahmed", designation: "Director (SCM & Operations)" },
      ],
    };
  }, [previewBill]);

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
                <span className="text-amber-500 font-bold">Supplier Bill Approval List</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <ShieldCheck className="size-7 text-amber-500" />
                Supplier Bill Approval Queue
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Comprehensive audit and authorization queue for submitted supplier commercial invoices linked with MRRs.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate({ to: "/procurement-billing-supplier-bill" })}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted transition-colors cursor-pointer"
              >
                <Receipt className="size-3.5" /> Supplier Bill Entry
              </button>
            </div>
          </div>

          {/* Quick KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => setFilterStatus("Pending Approval")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                filterStatus === "Pending Approval"
                  ? "bg-amber-500/10 border-amber-500/40 ring-2 ring-amber-500/20"
                  : "bg-card border-border hover:border-amber-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Pending Approval</span>
                <Clock className="size-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600 mt-2 font-mono">
                {stats.pending}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                ৳ {stats.pendingAmount.toLocaleString()}
              </div>
            </div>

            <div
              onClick={() => setFilterStatus("Approved")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                filterStatus === "Approved"
                  ? "bg-emerald-500/10 border-emerald-500/40 ring-2 ring-emerald-500/20"
                  : "bg-card border-border hover:border-emerald-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Approved Bills</span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">
                {stats.approved}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Disbursement cleared</div>
            </div>

            <div
              onClick={() => setFilterStatus("Returned")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                filterStatus === "Returned"
                  ? "bg-rose-500/10 border-rose-500/40 ring-2 ring-rose-500/20"
                  : "bg-card border-border hover:border-rose-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Returned / Correction</span>
                <RotateCcw className="size-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600 mt-2 font-mono">
                {stats.returned}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Sent for revision</div>
            </div>

            <div
              onClick={() => setFilterStatus("All")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                filterStatus === "All"
                  ? "bg-primary/10 border-primary/40 ring-2 ring-primary/20"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Total Bills In Queue</span>
                <CreditCard className="size-4 text-primary" />
              </div>
              <div className="text-2xl font-black text-foreground mt-2 font-mono">
                {stats.total}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">All registered invoices</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Filter className="size-3.5 text-amber-500" />
                Filter Supplier Bills for Approval
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterSupplier("All");
                  setFilterPo("");
                  setFilterMrr("");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                  setFilterStatus("Pending Approval");
                }}
                className="text-[11px] text-muted-foreground hover:text-amber-600 flex items-center gap-1 cursor-pointer font-semibold"
              >
                <RefreshCw className="size-3" /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                  Search Bill / Supplier / Submitter
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bill no, vendor invoice, submitter..."
                    className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Supplier Dropdown */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                  Supplier
                </label>
                <select
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="All">All Suppliers</option>
                  {uniqueSuppliers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* PO Number */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                  PO / WO No.
                </label>
                <input
                  type="text"
                  value={filterPo}
                  onChange={(e) => setFilterPo(e.target.value)}
                  placeholder="e.g. PO-2026..."
                  className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              {/* MRR Number */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                  MRR No.
                </label>
                <input
                  type="text"
                  value={filterMrr}
                  onChange={(e) => setFilterMrr(e.target.value)}
                  placeholder="e.g. MRR-2026..."
                  className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-amber-500 cursor-pointer font-bold text-amber-600"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Returned">Returned</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Supplier Bill Table */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-foreground">Supplier Bills For Approval</h2>
                <p className="text-[11px] text-muted-foreground">
                  Showing {filteredBills.length} of {bills.length} bills
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-3.5">Supplier Bill No.</th>
                    <th className="py-3 px-3">Bill Date</th>
                    <th className="py-3 px-3">Supplier</th>
                    <th className="py-3 px-3">PO / WO Number</th>
                    <th className="py-3 px-3 text-right">Bill Amount</th>
                    <th className="py-3 px-3">Requested By / Submitted By</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Submitted Date</th>
                    <th className="py-3 px-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBills.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() =>
                        navigate({
                          to: "/procurement-billing-supplier-bill-approval",
                          search: { id: b.id },
                        })
                      }
                    >
                      <td className="py-3 px-3.5 font-mono">
                        <div className="font-bold text-foreground">{b.billNumber}</div>
                        <div className="text-[10px] text-muted-foreground font-sans">
                          Inv: {b.supplierBillNo}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                        {b.billDate}
                      </td>
                      <td className="py-3 px-3 font-semibold text-foreground max-w-[180px] truncate">
                        {b.supplierName}
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        {b.poNumber}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-foreground whitespace-nowrap">
                        ৳ {b.netBillAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        <div className="font-medium text-foreground">
                          {b.submittedBy || "Tahmid Afsar"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">Billing Officer</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                            b.approvalStatus === "Approved"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : b.approvalStatus === "Returned"
                              ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                              : b.approvalStatus === "Rejected"
                              ? "bg-red-500/10 text-red-600 border-red-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }`}
                        >
                          {b.approvalStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                        {b.submittedDate || b.billDate}
                      </td>
                      <td
                        className="py-3 px-3.5 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewBill(b)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                            title="Preview Report"
                          >
                            <Printer className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              navigate({
                                to: "/procurement-billing-supplier-bill-approval",
                                search: { id: b.id },
                              })
                            }
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              b.approvalStatus === "Pending Approval"
                                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs shadow-amber-500/20"
                                : "bg-muted hover:bg-muted/80 text-foreground border border-border"
                            }`}
                          >
                            <span>{b.approvalStatus === "Pending Approval" ? "Process" : "Review"}</span>
                            <ArrowRight className="size-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBills.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-10 text-center text-muted-foreground">
                        <CreditCard className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                        <div className="font-semibold text-foreground">No Supplier Bills Found</div>
                        <div className="text-[11px]">
                          No supplier bills match your active filter criteria.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Preview Report Modal */}
      {previewReportData && (
        <StandardPreviewReportModal
          isOpen={!!previewBill}
          onClose={() => setPreviewBill(null)}
          data={previewReportData}
        />
      )}
    </div>
  );
}
