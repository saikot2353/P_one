// src/routes/inv-loan-issue-against-receive-list.tsx
import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  Layers,
  Plus,
  Filter,
  Search,
  ChevronDown,
  Printer,
  Calendar,
  Building2,
  Package,
  FileSpreadsheet,
  X,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCheck2,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import {
  LoanIssueAgainstReceive,
  StockLoanReceipt,
  getStoredLoanIssueAgainstReceive,
  saveStoredLoanIssueAgainstReceive,
  getStoredLoanReceipts,
  getStoredLoanRequisitions,
  MASTER_COMPANIES,
} from "@/lib/inventory-stock-loan-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-loan-issue-against-receive-list")({
  head: () => ({
    meta: [
      { title: "Loan Issue Against Receive Register — Inventory ERP" },
      {
        name: "description",
        content: "Register of stock loan issue returns against previously received consignment consignees.",
      },
    ],
  }),
  component: LoanIssueAgainstReceiveListPage,
});

export default function LoanIssueAgainstReceiveListPage() {
  const navigate = useNavigate();
  // Register Layout: Two status/filter cards - "Loan Return Pending" (default) & "Loan Returned Completed"
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [issues, setIssues] = useState<LoanIssueAgainstReceive[]>([]);
  const [receipts, setReceipts] = useState<StockLoanReceipt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string>("All");
  const [selectedIssue, setSelectedIssue] = useState<LoanIssueAgainstReceive | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    setIssues(getStoredLoanIssueAgainstReceive());
    setReceipts(getStoredLoanReceipts());
  }, []);

  // Records for Loan Return Pending:
  // 1. Any existing LoanIssueAgainstReceive where status !== "Completed" (e.g. Draft / In Progress)
  // 2. Any received Loan Receipts from receipts where return is pending
  const pendingRecords = useMemo(() => {
    const list: Array<{
      id: string;
      issueNo: string;
      issueDate: string;
      loanRequisitionNumber: string;
      loanRequisitionId?: string;
      selectedReceiptNumbers: string[];
      issuingCompany: string;
      issuingStore: string;
      receivingCompany: string;
      receivingStore: string;
      totalItems: number;
      totalIssueQty: number;
      status: string;
      rawIssue?: LoanIssueAgainstReceive;
      rawReceipt?: StockLoanReceipt;
    }> = [];

    // Draft / uncompleted issues
    issues
      .filter((i) => i.status !== "Completed")
      .forEach((i) => {
        list.push({
          id: i.id,
          issueNo: i.issueNo,
          issueDate: i.issueDate,
          loanRequisitionNumber: i.loanRequisitionNumber,
          loanRequisitionId: i.loanRequisitionId,
          selectedReceiptNumbers: i.selectedReceiptNumbers,
          issuingCompany: i.issuingCompany,
          issuingStore: i.issuingStore,
          receivingCompany: i.receivingCompany,
          receivingStore: i.receivingStore,
          totalItems: i.totalItems,
          totalIssueQty: i.totalIssueQty,
          status: i.status || "Draft",
          rawIssue: i,
        });
      });

    // Received receipts that have not been returned
    receipts.forEach((rcpt) => {
      const alreadyHasIssue = issues.some(
        (i) => i.selectedReceiptNumbers?.includes(rcpt.receiveId)
      );
      if (!alreadyHasIssue) {
        list.push({
          id: `pending-rcpt-${rcpt.id}`,
          issueNo: `PENDING-${rcpt.receiveId}`,
          issueDate: rcpt.receiveDate,
          loanRequisitionNumber: rcpt.remarks?.match(/LR-\d{4}-\d+/)?.[0] || "LR-2026-0001",
          loanRequisitionId: "slr-seed-001",
          selectedReceiptNumbers: [rcpt.receiveId],
          issuingCompany: rcpt.toCompany, // The receiving company of original receipt is the issuing company of the return
          issuingStore: rcpt.toStore,
          receivingCompany: rcpt.fromCompany,
          receivingStore: rcpt.fromStore,
          totalItems: rcpt.totalItems,
          totalIssueQty: rcpt.totalReceivedQty || rcpt.totalAcceptedQty,
          status: "Return Pending",
          rawReceipt: rcpt,
        });
      }
    });

    return list;
  }, [issues, receipts]);

  // Records for Loan Returned Completed
  const completedRecords = useMemo(() => {
    return issues.filter((i) => i.status === "Completed");
  }, [issues]);

  // Filtered list based on active tab and search/company filters
  const filteredRecords = useMemo(() => {
    if (activeTab === "pending") {
      return pendingRecords.filter((rec) => {
        const matchSearch =
          rec.issueNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.loanRequisitionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.issuingCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.receivingCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.selectedReceiptNumbers.some((rn) => rn.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchCompany =
          companyFilter === "All" ||
          rec.issuingCompany === companyFilter ||
          rec.receivingCompany === companyFilter;

        return matchSearch && matchCompany;
      });
    } else {
      return completedRecords.filter((rec) => {
        const matchSearch =
          rec.issueNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.loanRequisitionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.issuingCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.receivingCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.selectedReceiptNumbers.some((rn) => rn.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchCompany =
          companyFilter === "All" ||
          rec.issuingCompany === companyFilter ||
          rec.receivingCompany === companyFilter;

        return matchSearch && matchCompany;
      });
    }
  }, [activeTab, pendingRecords, completedRecords, searchTerm, companyFilter]);

  const handleOpenReport = (issue: LoanIssueAgainstReceive) => {
    setSelectedIssue(issue);
    setIsReportOpen(true);
  };

  const handleReturnIssue = (rec: (typeof pendingRecords)[0]) => {
    if (rec.rawIssue) {
      navigate({
        to: "/inv-loan-issue-against-receive",
        search: { issueId: rec.rawIssue.id },
      });
    } else if (rec.rawReceipt) {
      navigate({
        to: "/inv-loan-issue-against-receive",
        search: {
          reqId: rec.loanRequisitionId,
          receiptNo: rec.selectedReceiptNumbers[0],
        },
      });
    } else {
      navigate({ to: "/inv-loan-issue-against-receive" });
    }
  };

  // Preview Report: Section 15 requires removing Rate (৳), Total (৳), and Total Value (৳) summary
  const previewReportData: StandardReportData | null = useMemo(() => {
    if (!selectedIssue) return null;
    return {
      reportType: "stock-transfer",
      title: "LOAN ISSUE AGAINST RECEIVE SLIP",
      documentNumber: selectedIssue.issueNo,
      documentDate: selectedIssue.issueDate,
      metadata: [
        { label: "Issue No", value: selectedIssue.issueNo, highlight: true },
        { label: "Issue Date", value: selectedIssue.issueDate },
        { label: "Loan Requisition No", value: selectedIssue.loanRequisitionNumber },
        { label: "Receipt References", value: selectedIssue.selectedReceiptNumbers.join(", ") },
        { label: "Issuing Company", value: selectedIssue.issuingCompany },
        { label: "Issuing Store", value: selectedIssue.issuingStore },
        { label: "Receiving Company", value: selectedIssue.receivingCompany },
        { label: "Receiving Store", value: selectedIssue.receivingStore },
        { label: "Issued By", value: selectedIssue.issuedBy },
      ],
      tableHeaders: [
        "SL",
        "Item Description & Spec",
        "Brand / Origin",
        "UOM",
        "Receipt No",
        "Received Qty",
        "Issue Qty",
      ],
      tableRows: selectedIssue.items.map((it, idx) => [
        idx + 1,
        it.itemName,
        `${it.brand} / ${it.origin}`,
        it.uom,
        it.receiptNumber,
        it.receivedQty,
        it.issueQty,
      ]),
      summaryCards: [
        { label: "Total Items", value: selectedIssue.totalItems },
        { label: "Total Issue Qty", value: selectedIssue.totalIssueQty },
      ],
      notes: selectedIssue.remarks || "Stock loan issued against received consignment. Physical stock updated.",
    };
  }, [selectedIssue]);

  return (
    <div className="flex h-screen bg-background text-foreground antialiased overflow-hidden font-sans">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold mb-1">
                <span>Inventory</span>
                <span>/</span>
                <span>Stock Loan</span>
                <span>/</span>
                <span className="text-foreground">Loan Issue Against Receive</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
                <Layers className="size-6 text-amber-500" />
                Loan Issue Against Receive Register
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Issue repayments against previously received loan receipts and track inventory allocations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/inv-loan-issue-against-receive"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition cursor-pointer"
              >
                <Plus className="size-4" />
                <span>New Issue Against Receive</span>
              </Link>
            </div>
          </div>

          {/* Section 13.1 & 13.2: Two Status / Filter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Loan Return Pending (Selected by default) */}
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative ${
                activeTab === "pending"
                  ? "bg-amber-500/10 border-amber-500 shadow-sm"
                  : "bg-card border-border hover:border-amber-500/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`size-8 rounded-xl flex items-center justify-center ${
                      activeTab === "pending"
                        ? "bg-amber-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Clock className="size-4" />
                  </div>
                  <span className="font-bold text-sm text-foreground">Loan Return Pending</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 text-xs font-black rounded-full font-mono ${
                    activeTab === "pending"
                      ? "bg-amber-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {pendingRecords.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Consignments awaiting loan repayment issue back to the source entity.
              </p>
            </button>

            {/* Card 2: Loan Returned Completed */}
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative ${
                activeTab === "completed"
                  ? "bg-emerald-500/10 border-emerald-500 shadow-sm"
                  : "bg-card border-border hover:border-emerald-500/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`size-8 rounded-xl flex items-center justify-center ${
                      activeTab === "completed"
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="size-4" />
                  </div>
                  <span className="font-bold text-sm text-foreground">Loan Returned Completed</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 text-xs font-black rounded-full font-mono ${
                    activeTab === "completed"
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {completedRecords.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully processed and completed loan repayment return issues.
              </p>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Issue No, Requisition, Receipt, Company..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-background focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:border-amber-500 outline-none font-medium"
                >
                  <option value="All">All Companies</option>
                  {MASTER_COMPANIES.map((c) => (
                    <option key={typeof c === "string" ? c : c.id} value={typeof c === "string" ? c : c.name}>
                      {typeof c === "string" ? c : c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Register Table — Section 13.4: Total Value (৳) column removed */}
          <div className="border border-border rounded-2xl bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-3">Issue No & Date</th>
                    <th className="py-3 px-3">Loan Requisition No</th>
                    <th className="py-3 px-3">Receipt Ref(s)</th>
                    <th className="py-3 px-3">Issuing Company / Store</th>
                    <th className="py-3 px-3">Receiving Company / Store</th>
                    <th className="py-3 px-3 text-right">Items / Total Qty</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-muted-foreground">
                        {activeTab === "pending"
                          ? "No pending loan return records found."
                          : "No completed loan return records found."}
                      </td>
                    </tr>
                  ) : activeTab === "pending" ? (
                    (filteredRecords as typeof pendingRecords).map((rec, idx) => (
                      <tr key={rec.id} className="hover:bg-muted/30 transition">
                        <td className="py-3 px-3 text-center text-muted-foreground font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-foreground font-mono">{rec.issueNo}</div>
                          <div className="text-[11px] text-muted-foreground">{rec.issueDate}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-amber-600 font-mono">
                          {rec.loanRequisitionNumber}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {rec.selectedReceiptNumbers.map((rn) => (
                              <span
                                key={rn}
                                className="px-1.5 py-0.5 text-[10px] rounded bg-muted font-mono font-bold text-slate-700 dark:text-slate-300 border border-border"
                              >
                                {rn}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-foreground">{rec.issuingCompany}</div>
                          <div className="text-[11px] text-muted-foreground">{rec.issuingStore}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-foreground">{rec.receivingCompany}</div>
                          <div className="text-[11px] text-muted-foreground">{rec.receivingStore}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold">
                          <div>{rec.totalIssueQty.toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground font-normal">
                            {rec.totalItems} item(s)
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-500/10 text-amber-600 border-amber-500/30">
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Section 13.3: Return Issue Button */}
                            <button
                              type="button"
                              onClick={() => handleReturnIssue(rec)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition cursor-pointer"
                              title="Return Issue against received consignment"
                            >
                              <span>Return Issue</span>
                              <ArrowRight className="size-3" />
                            </button>
                            {rec.rawIssue && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenReport(rec.rawIssue!)}
                                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                                  title="Print / Preview Slip"
                                >
                                  <Printer className="size-3.5" />
                                </button>
                                <Link
                                  to="/inv-loan-issue-against-receive"
                                  search={{ issueId: rec.rawIssue.id, mode: "view" }}
                                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                                  title="View Details"
                                >
                                  <Eye className="size-3.5" />
                                </Link>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    (filteredRecords as LoanIssueAgainstReceive[]).map((issue, idx) => (
                      <tr key={issue.id} className="hover:bg-muted/30 transition">
                        <td className="py-3 px-3 text-center text-muted-foreground font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-foreground font-mono">{issue.issueNo}</div>
                          <div className="text-[11px] text-muted-foreground">{issue.issueDate}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-amber-600 font-mono">
                          {issue.loanRequisitionNumber}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {issue.selectedReceiptNumbers.map((rn) => (
                              <span
                                key={rn}
                                className="px-1.5 py-0.5 text-[10px] rounded bg-muted font-mono font-bold text-slate-700 dark:text-slate-300 border border-border"
                              >
                                {rn}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-foreground">{issue.issuingCompany}</div>
                          <div className="text-[11px] text-muted-foreground">{issue.issuingStore}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-foreground">{issue.receivingCompany}</div>
                          <div className="text-[11px] text-muted-foreground">{issue.receivingStore}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold">
                          <div>{issue.totalIssueQty.toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground font-normal">
                            {issue.totalItems} item(s)
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                            {issue.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenReport(issue)}
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                              title="Print / Preview Slip"
                            >
                              <Printer className="size-3.5" />
                            </button>
                            <Link
                              to="/inv-loan-issue-against-receive"
                              search={{ issueId: issue.id, mode: "view" }}
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="size-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Standard Preview Report Modal */}
          {previewReportData && (
            <StandardPreviewReportModal
              isOpen={isReportOpen}
              onClose={() => setIsReportOpen(false)}
              data={previewReportData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
