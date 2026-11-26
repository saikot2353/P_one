import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  CreditCard,
  Building2,
  Calendar,
  Search,
  Eye,
  Edit,
  FileSpreadsheet,
  Printer,
  FileText,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  Filter,
  Clock,
  RotateCcw,
  Plus,
  Receipt,
  AlertCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  SupplierBill,
  getStoredSupplierBills,
  setStoredSupplierBills,
} from "@/lib/procurement-order-inventory-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/procurement-billing-supplier-bill-list")({
  head: () => ({
    meta: [
      { title: "Supplier Bill List — Procurement Billing | CRIPTON" },
      {
        name: "description",
        content:
          "Official register of all verified Supplier Bills and vendor invoices linked with MRRs and POs.",
      },
    ],
  }),
  component: SupplierBillListPage,
});

export function SupplierBillListPage() {
  const navigate = useNavigate();

  const [bills, setBills] = useState<SupplierBill[]>(() => getStoredSupplierBills());

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [filterPo, setFilterPo] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [drillDownInfo, setDrillDownInfo] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const supp = sp.get("supplier");
    const statusParam = sp.get("status") || sp.get("paymentStatus");
    const ret = sp.get("returnTo");

    const badges: string[] = [];
    if (supp && supp !== "All" && supp !== "All Suppliers") {
      setFilterSupplier(supp);
      badges.push(`Supplier: ${supp}`);
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
      // Keyword search
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

      // Date range filter
      if (filterDateFrom && b.billDate < filterDateFrom) return false;
      if (filterDateTo && b.billDate > filterDateTo) return false;

      // Status filter
      if (filterStatus !== "All" && b.approvalStatus !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [bills, searchQuery, filterSupplier, filterPo, filterDateFrom, filterDateTo, filterStatus]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = bills.length;
    const pending = bills.filter((b) => b.approvalStatus === "Pending Approval" || b.approvalStatus === "Submitted").length;
    const approved = bills.filter((b) => b.approvalStatus === "Approved").length;
    const totalAmount = bills.reduce((sum, b) => sum + (b.netBillAmount || 0), 0);
    const pendingAmount = bills
      .filter((b) => b.approvalStatus === "Pending Approval" || b.approvalStatus === "Submitted")
      .reduce((sum, b) => sum + (b.netBillAmount || 0), 0);

    return { total, pending, approved, totalAmount, pendingAmount };
  }, [bills]);

  // Report Builder
  const previewReportData: StandardReportData | null = useMemo(() => {
    if (!previewBill) return null;

    const totalAmountSum = (previewBill.items || []).reduce(
      (sum, item) => sum + (Number(item.lineAmount) || 0),
      0
    );

    return {
      reportType: "supplier-bill",
      title: "Supplier Commercial Bill / Invoice Dossier",
      documentNumber: previewBill.billNumber,
      documentDate: previewBill.billDate,
      hideDocHeaderInfo: true,
      metadata: [
        { label: "Bill ID", value: previewBill.billNumber, highlight: true },
        { label: "Bill Date", value: previewBill.billDate },
        { label: "Supplier / Vendor", value: previewBill.supplierName, highlight: true },
        { label: "Vendor Invoice No", value: previewBill.supplierBillNo },
        { label: "Invoice Date", value: previewBill.supplierBillDate },
        { label: "PO / WO Number", value: previewBill.poNumber },
        { label: "MRR References", value: previewBill.mrrNumbers?.join(", ") || "—" },
        { label: "Payment Status", value: previewBill.paymentStatus },
        { label: "Approval Status", value: previewBill.approvalStatus, highlight: true },
      ],
      tableHeaders: [
        "SL",
        "Item Description & Spec",
        "Brand / Origin",
        "UOM",
        "Billed Qty",
        "Unit Price",
        "Discount",
        "VAT",
        "TAX",
        "Total Amount",
      ],
      tableRows: (previewBill.items || []).map((item, idx) => [
        idx + 1,
        <div key={idx}>
          <div className="font-bold text-slate-900">{item.itemName}</div>
          <div className="text-[9.5px] text-slate-500 font-mono">{item.itemCode}</div>
        </div>,
        `${item.brand || "Standard"} / ${item.origin || "Local"}`,
        item.uom,
        item.currentBillQty,
        `৳ ${item.unitPrice.toLocaleString()}`,
        `৳ ${(item.discount || 0).toLocaleString()}`,
        `৳ ${(item.vatAmount || 0).toLocaleString()}`,
        `৳ ${(item.taxAmount || 0).toLocaleString()}`,
        `৳ ${item.lineAmount.toLocaleString()}`,
      ]),
      summaryCards: [
        { label: "Subtotal", value: `৳ ${previewBill.subtotal.toLocaleString()}` },
        { label: "Discount", value: `- ৳ ${previewBill.discount.toLocaleString()}` },
        { label: "VAT", value: `+ ৳ ${previewBill.vat.toLocaleString()}` },
        { label: "Other Charges", value: `+ ৳ ${previewBill.otherCharges.toLocaleString()}` },
        { label: "Adjustment", value: `৳ ${previewBill.adjustment.toLocaleString()}` },
        {
          label: "Total Amount",
          value: `৳ ${(totalAmountSum || previewBill.netBillAmount).toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
          isBold: true,
          isHighlight: true,
        },
      ],
      signatures: [
        { role: "Billing Clerk", name: previewBill.submittedBy || "Tahmid Afsar Shapno", designation: "Asst. Manager - Billing" },
        { role: "Store Verification", name: "Nazmul Huda", designation: "Store Officer" },
        { role: "Audit / Accounts", name: "Kamrul Islam", designation: "Accounts Executive" },
        { role: "Approved By", name: "Engr. Tanvir Ahmed", designation: "Head of Finance & Procurement" },
      ],
    };
  }, [previewBill]);

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <ProcurementSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProcurementTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {returnTo && (
            <div className="bg-gradient-to-r from-amber-50 via-blue-50 to-amber-50 border border-amber-200 text-amber-950 px-4 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
                  <ArrowLeft className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Procurement Dashboard Drill-Down
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Stage: Supplier Bill
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 font-medium mt-0.5">
                    {drillDownInfo ? drillDownInfo : "Viewing supplier invoices from the Procurement Workflow."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate({ to: returnTo as any })}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
              >
                <ArrowLeft className="size-3.5" /> Back to Dashboard
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-1">
                <span>Procurement</span>
                <ChevronRight className="size-3" />
                <span>Billing</span>
                <ChevronRight className="size-3" />
                <span className="text-amber-500 font-bold">Supplier Bill List</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <Receipt className="size-7 text-amber-500" />
                Supplier Bill Registry
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Comprehensive directory of all created supplier bills, invoice statuses, and settlement workflows.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-border bg-card hover:bg-muted transition-all cursor-pointer"
              >
                <Printer className="size-3.5" /> Print Registry
              </button>
              <Link
                to="/procurement-billing-supplier-bill"
                search={{ action: "create" }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Plus className="size-4" /> Create New Supplier Bill
              </Link>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => setFilterStatus("All")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                filterStatus === "All"
                  ? "bg-primary/10 border-primary/40 ring-2 ring-primary/20"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Total Supplier Bills</span>
                <CreditCard className="size-4 text-primary" />
              </div>
              <div className="text-2xl font-black text-foreground mt-2 font-mono">
                {stats.total}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                ৳ {stats.totalAmount.toLocaleString()}
              </div>
            </div>

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
              <div className="text-[11px] text-muted-foreground mt-0.5">Cleared for Payment</div>
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
                {bills.filter((b) => b.approvalStatus === "Returned").length}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Requires Revision</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Filter className="size-3.5 text-amber-500" />
                Filter Supplier Bills
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterSupplier("All");
                  setFilterPo("");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                  setFilterStatus("All");
                }}
                className="text-[11px] text-muted-foreground hover:text-amber-600 flex items-center gap-1 cursor-pointer font-semibold"
              >
                <RefreshCw className="size-3" /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                  Search Keyword
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Bill No, Invoice No, Vendor, PO..."
                    className="w-full pl-8 pr-3 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Supplier */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Supplier Bill Table */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-foreground">Registered Supplier Bills</h2>
                <p className="text-[11px] text-muted-foreground">
                  Showing {filteredBills.length} of {bills.length} bills
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-3.5">Bill Number</th>
                    <th className="py-3 px-3">Bill Date</th>
                    <th className="py-3 px-3">Vendor Invoice No.</th>
                    <th className="py-3 px-3">Supplier</th>
                    <th className="py-3 px-3">PO / WO Number</th>
                    <th className="py-3 px-3 text-right">Net Bill Amount</th>
                    <th className="py-3 px-3 text-center">Payment Status</th>
                    <th className="py-3 px-3 text-center">Approval Status</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBills.map((b) => {
                    const isDraftOrReturned = b.approvalStatus === "Draft" || b.approvalStatus === "Returned";
                    return (
                      <tr
                        key={b.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-3 px-3.5">
                          <div className="font-mono font-bold text-amber-600">{b.billNumber}</div>
                          {b.billType && (
                            <span className="text-[9.5px] font-sans font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 inline-block mt-0.5">
                              {b.billType}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                          {b.billDate}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-foreground">
                          {b.supplierBillNo}
                        </td>
                        <td className="py-3 px-3 font-medium text-foreground max-w-[180px] truncate" title={b.supplierName}>
                          {b.supplierName}
                        </td>
                        <td className="py-3 px-3 font-mono text-muted-foreground">
                          {b.billType === "Service Bill Entry" || b.poNumber === "DIRECT-SERVICE" ? (
                            <span className="text-[10.5px] font-sans px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-semibold inline-block">
                              Direct Service
                            </span>
                          ) : b.billType === "Bill against Receive" || b.poNumber === "DIRECT-RECEIVE" ? (
                            <span className="text-[10.5px] font-sans px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold inline-block">
                              Direct Receive
                            </span>
                          ) : (
                            b.poNumber
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-foreground whitespace-nowrap">
                          ৳ {b.netBillAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              b.paymentStatus === "Fully Paid"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : b.paymentStatus === "Partially Paid"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                            }`}
                          >
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              b.approvalStatus === "Approved"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : b.approvalStatus === "Pending Approval" || b.approvalStatus === "Submitted"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : b.approvalStatus === "Returned"
                                ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                            }`}
                          >
                            {b.approvalStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View Action */}
                            <button
                              type="button"
                              onClick={() =>
                                navigate({
                                  to: "/procurement-billing-supplier-bill",
                                  search: { action: "view", id: b.id },
                                })
                              }
                              className="p-1.5 rounded-lg border border-border text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                              title="View Supplier Bill Details"
                            >
                              <Eye className="size-3.5" />
                            </button>

                            {/* Edit Action */}
                            <button
                              type="button"
                              onClick={() =>
                                navigate({
                                  to: "/procurement-billing-supplier-bill",
                                  search: { action: "edit", id: b.id },
                                })
                              }
                              disabled={!isDraftOrReturned}
                              className={`p-1.5 rounded-lg border transition ${
                                isDraftOrReturned
                                  ? "border-border text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                                  : "border-border/40 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50"
                              }`}
                              title={isDraftOrReturned ? "Edit Supplier Bill" : "Approved / Submitted bills cannot be edited"}
                            >
                              <Edit className="size-3.5" />
                            </button>

                            {/* Preview Report */}
                            <button
                              type="button"
                              onClick={() => setPreviewBill(b)}
                              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                              title="Preview Report"
                            >
                              <Printer className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredBills.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-muted-foreground">
                        No supplier bills found matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Standard Preview Report Modal */}
      <StandardPreviewReportModal
        isOpen={Boolean(previewBill)}
        onClose={() => setPreviewBill(null)}
        data={previewReportData}
      />
    </div>
  );
}
