// src/routes/inv-loan-receive-against-issue-list.tsx
import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  Inbox,
  Filter,
  Search,
  ChevronDown,
  Printer,
  Calendar,
  Building2,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import {
  LoanReceiveAgainstIssue,
  LoanIssueAgainstReceive,
  getStoredLoanReceiveAgainstIssue,
  getStoredLoanIssueAgainstReceive,
  MASTER_COMPANIES,
} from "@/lib/inventory-stock-loan-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-loan-receive-against-issue-list")({
  head: () => ({
    meta: [
      { title: "Loan Receive Against Issue Register — Inventory ERP" },
      {
        name: "description",
        content: "Track and receive return shipments against loan issues with pending, partially received, and complete status tabs.",
      },
    ],
  }),
  component: LoanReceiveAgainstIssueListPage,
});

export default function LoanReceiveAgainstIssueListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Pending" | "Partially Received" | "Complete">("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");

  const [receives, setReceives] = useState<LoanReceiveAgainstIssue[]>([]);
  const [loanIssues, setLoanIssues] = useState<LoanIssueAgainstReceive[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<LoanReceiveAgainstIssue | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    setReceives(getStoredLoanReceiveAgainstIssue());
    setLoanIssues(getStoredLoanIssueAgainstReceive());
  }, []);

  // Eligible records for Pending tab: Loan Issues that haven't been received yet or are in Draft/Completed state
  const pendingRecords = useMemo(() => {
    return loanIssues
      .filter((li) => {
        const existingRec = receives.find((r) => r.loanIssueId === li.id || r.loanIssueNo === li.issueNo);
        return !existingRec || existingRec.status === "Pending";
      })
      .map((li) => ({
        id: li.id,
        receiveNo: `PENDING-${li.issueNo}`,
        receiveDate: li.issueDate,
        loanIssueNo: li.issueNo,
        loanIssueId: li.id,
        issuingCompany: li.issuingCompany,
        issuingStore: li.issuingStore,
        receivingCompany: li.receivingCompany,
        receivingStore: li.receivingStore,
        status: "Pending" as const,
        receivedBy: "Pending Acknowledgment",
        totalItems: li.totalItems,
        totalIssuedQty: li.totalIssueQty,
        totalReceivedQty: 0,
        items: [],
        createdAt: li.createdAt,
        updatedAt: li.updatedAt,
      }));
  }, [loanIssues, receives]);

  // Tab Data
  const currentTabRecords = useMemo(() => {
    let source: LoanReceiveAgainstIssue[] = [];
    if (activeTab === "Pending") {
      source = pendingRecords;
    } else if (activeTab === "Partially Received") {
      source = receives.filter((r) => r.status === "Partially Received");
    } else {
      source = receives.filter((r) => r.status === "Complete");
    }

    return source.filter((rec) => {
      const matchSearch =
        rec.loanIssueNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.receiveNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.issuingCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.receivingCompany.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCompany =
        companyFilter === "All" ||
        rec.issuingCompany === companyFilter ||
        rec.receivingCompany === companyFilter;

      return matchSearch && matchCompany;
    });
  }, [activeTab, pendingRecords, receives, searchTerm, companyFilter]);

  const handleOpenReport = (rec: LoanReceiveAgainstIssue) => {
    setSelectedRecord(rec);
    setIsReportOpen(true);
  };

  const previewReportData: StandardReportData | null = useMemo(() => {
    if (!selectedRecord) return null;
    return {
      reportType: "stock-transfer",
      title: "LOAN RECEIVE AGAINST ISSUE ACKNOWLEDGMENT",
      documentNumber: selectedRecord.receiveNo,
      documentDate: selectedRecord.receiveDate,
      metadata: [
        { label: "Receive No", value: selectedRecord.receiveNo, highlight: true },
        { label: "Receive Date", value: selectedRecord.receiveDate },
        { label: "Loan Issue Reference", value: selectedRecord.loanIssueNo },
        { label: "Issuing Company", value: selectedRecord.issuingCompany },
        { label: "Issuing Store", value: selectedRecord.issuingStore },
        { label: "Receiving Company", value: selectedRecord.receivingCompany },
        { label: "Receiving Store", value: selectedRecord.receivingStore },
        { label: "Received By", value: selectedRecord.receivedBy },
        { label: "Status", value: selectedRecord.status, highlight: true },
      ],
      tableHeaders: [
        "SL",
        "Item Description & Code",
        "Brand / Origin",
        "UOM",
        "Dispatched Qty",
        "Received Qty",
        "Damage/Short Qty",
      ],
      tableRows: (selectedRecord.items || []).map((it, idx) => [
        idx + 1,
        it.itemName,
        `${it.brand} / ${it.origin}`,
        it.uom,
        it.issuedQty,
        it.currentReceiveQty || it.previouslyReceivedQty || 0,
        it.damageShortQty || it.rejectedQty || 0,
      ]),
      summaryCards: [
        { label: "Total Items", value: selectedRecord.totalItems },
        { label: "Issued Qty", value: selectedRecord.totalIssuedQty },
        { label: "Received Qty", value: selectedRecord.totalReceivedQty },
      ],
      notes: selectedRecord.remarks || "Stock loan receipt verified and inventory store balance updated.",
    };
  }, [selectedRecord]);

  return (
    <div className="flex h-screen bg-background text-foreground antialiased overflow-hidden font-sans">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          <div className="w-full max-w-[1550px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold mb-1">
                <span>Inventory</span>
                <span>/</span>
                <span>Stock Loan</span>
                <span>/</span>
                <span className="text-foreground">Loan Receive Against Issue</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
                <Inbox className="size-6 text-amber-500" />
                Loan Receive Against Issue Register
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monitor and acknowledge return shipments issued against loans across Pending, Partially Received, and Complete tabs.
              </p>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 border-b border-border">
            {(["Pending", "Partially Received", "Complete"] as const).map((tab) => {
              const isActive = activeTab === tab;
              const count =
                tab === "Pending"
                  ? pendingRecords.length
                  : tab === "Partially Received"
                    ? receives.filter((r) => r.status === "Partially Received").length
                    : receives.filter((r) => r.status === "Complete").length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                    isActive
                      ? "border-amber-500 text-amber-600 bg-amber-500/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
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
                  placeholder="Search by Loan Issue No, Receive No, or Company..."
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

          {/* Register Table */}
          <div className="border border-border rounded-2xl bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-3">Receive Reference</th>
                    <th className="py-3 px-3">Loan Issue No</th>
                    <th className="py-3 px-3">Issuing Company / Store</th>
                    <th className="py-3 px-3">Receiving Company / Store</th>
                    <th className="py-3 px-3 text-right">Items / Issued Qty</th>
                    <th className="py-3 px-3 text-right">Received Qty</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right w-32">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {currentTabRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-muted-foreground">
                        No records found in {activeTab} tab.
                      </td>
                    </tr>
                  ) : (
                    currentTabRecords.map((rec, idx) => {
                      const isEligibleToReceive = rec.status === "Pending" || rec.status === "Partially Received";

                      return (
                        <tr key={rec.id} className="hover:bg-muted/30 transition">
                          <td className="py-3 px-3 text-center text-muted-foreground font-mono">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-foreground font-mono">{rec.receiveNo}</div>
                            <div className="text-[11px] text-muted-foreground">{rec.receiveDate}</div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-amber-600 font-mono">
                            {rec.loanIssueNo}
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
                            <div>{rec.totalIssuedQty.toLocaleString()}</div>
                            <div className="text-[10px] text-muted-foreground font-normal">
                              {rec.totalItems} item(s)
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                            {rec.totalReceivedQty.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                rec.status === "Complete"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                  : rec.status === "Partially Received"
                                    ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                                    : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                              }`}
                            >
                              {rec.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isEligibleToReceive && (
                                <Link
                                  to="/inv-loan-receive-against-issue"
                                  search={{ loanIssueId: rec.loanIssueId, mode: "receive" }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-2xs transition cursor-pointer"
                                >
                                  <span>Receive</span>
                                  <ArrowRight className="size-3" />
                                </Link>
                              )}
                              {rec.status === "Complete" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenReport(rec)}
                                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                                    title="Print Slip"
                                  >
                                    <Printer className="size-3.5" />
                                  </button>
                                  <Link
                                    to="/inv-loan-receive-against-issue"
                                    search={{ receiveId: rec.id, mode: "view" }}
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
                      );
                    })
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
          </div>
        </main>
      </div>
    </div>
  );
}

