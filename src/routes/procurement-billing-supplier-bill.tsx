import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  Search,
  Plus,
  FileSpreadsheet,
  Printer,
  FileText,
  Filter,
  Calendar,
  Building2,
  X,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ReceiptText,
  ArrowRight,
  DollarSign,
  Package,
  Calculator,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
} from "lucide-react";

export const Route = createFileRoute("/procurement-billing-supplier-bill")({
  head: () => ({
    meta: [
      { title: "Supplier Bill — Billing | CRIPTON Procurement" },
      { name: "description", content: "Unified supplier bill management with registry, detailed records, and smart bill creation." },
    ],
  }),
  component: SupplierBillPage,
});

// ─── Types ────────────────────────────────────────────────────────────
interface MrrDetail {
  id: string;
  mrrDate: string;
  challanNo: string;
  totalPrice: number;
}

interface SupplierBillRecord {
  id: string;
  supplierName: string;
  billDate: string;
  billType: string;
  billNo: string;
  challanNo: string;
  currency: string;
  exchangeRate: number;
  billValue: number;
  mrrTotal: number;
  vatAmt: number;
  taxAmt: number;
  discountAmt: number;
  advancePayment: number;
  remarks: string;
  auditValue: number;
  paymentStatus: string;
  billStatus: string;
  auditStatus: string;
  vatTaxPostingStatus: string;
  poNo: string;
  mrrDetails: MrrDetail[];
}

// ─── Mock Data ────────────────────────────────────────────────────────
const INITIAL_BILLS: SupplierBillRecord[] = [
  {
    id: "sb-001",
    supplierName: "Gadget & Gaming Zone",
    billDate: "03/09/2026",
    billType: "Local",
    billNo: "1298",
    challanNo: "CH-9001",
    currency: "BDT",
    exchangeRate: 1.0,
    billValue: 450.0,
    mrrTotal: 450.0,
    vatAmt: 0.0,
    taxAmt: 0.0,
    discountAmt: 0.0,
    advancePayment: 0.0,
    remarks: "",
    auditValue: 450.0,
    paymentStatus: "Paid",
    billStatus: "Approved",
    auditStatus: "Complete",
    vatTaxPostingStatus: "Post",
    poNo: "PO/PSL/2026/000115",
    mrrDetails: [
      { id: "mrr-001", mrrDate: "02/09/2026", challanNo: "CH-9001", totalPrice: 450.0 },
    ],
  },
  {
    id: "sb-002",
    supplierName: "Konica Hardware",
    billDate: "12/08/2026",
    billType: "Local",
    billNo: "019",
    challanNo: "CH-7832",
    currency: "BDT",
    exchangeRate: 1.0,
    billValue: 380.0,
    mrrTotal: 380.0,
    vatAmt: 0.0,
    taxAmt: 0.0,
    discountAmt: 0.0,
    advancePayment: 0.0,
    remarks: "",
    auditValue: 380.0,
    paymentStatus: "Paid",
    billStatus: "Approved",
    auditStatus: "Complete",
    vatTaxPostingStatus: "Post",
    poNo: "PO/PSL/2026/000098",
    mrrDetails: [
      { id: "mrr-002", mrrDate: "11/08/2026", challanNo: "CH-7832", totalPrice: 380.0 },
    ],
  },
  {
    id: "sb-003",
    supplierName: "B. BARIA BELT GALLERY",
    billDate: "13/08/2026",
    billType: "Local",
    billNo: "020",
    challanNo: "CH-6500",
    currency: "BDT",
    exchangeRate: 1.0,
    billValue: 2000.0,
    mrrTotal: 2000.0,
    vatAmt: 0.0,
    taxAmt: 0.0,
    discountAmt: 0.0,
    advancePayment: 0.0,
    remarks: "Urgent order",
    auditValue: 2000.0,
    paymentStatus: "Paid",
    billStatus: "Approved",
    auditStatus: "Complete",
    vatTaxPostingStatus: "Post",
    poNo: "PO/PSL/2026/000099",
    mrrDetails: [
      { id: "mrr-003", mrrDate: "12/08/2026", challanNo: "CH-6500", totalPrice: 2000.0 },
    ],
  },
  {
    id: "sb-004",
    supplierName: "Global Net Computers",
    billDate: "15/08/2026",
    billType: "Local",
    billNo: "00628",
    challanNo: "CH-3421",
    currency: "BDT",
    exchangeRate: 1.0,
    billValue: 17500.0,
    mrrTotal: 17500.0,
    vatAmt: 875.0,
    taxAmt: 350.0,
    discountAmt: 500.0,
    advancePayment: 2000.0,
    remarks: "Server room equipment",
    auditValue: 14975.0,
    paymentStatus: "Paid",
    billStatus: "Approved",
    auditStatus: "Complete",
    vatTaxPostingStatus: "Post",
    poNo: "PO/PSL/2026/000100",
    mrrDetails: [
      { id: "mrr-004a", mrrDate: "14/08/2026", challanNo: "CH-3420", totalPrice: 10000.0 },
      { id: "mrr-004b", mrrDate: "15/08/2026", challanNo: "CH-3421", totalPrice: 7500.0 },
    ],
  },
  {
    id: "sb-005",
    supplierName: "Cash Purchase Supplier",
    billDate: "16/08/2026",
    billType: "Local",
    billNo: "00",
    challanNo: "CH-0000",
    currency: "BDT",
    exchangeRate: 1.0,
    billValue: 680.0,
    mrrTotal: 680.0,
    vatAmt: 0.0,
    taxAmt: 0.0,
    discountAmt: 0.0,
    advancePayment: 0.0,
    remarks: "Petty cash",
    auditValue: 680.0,
    paymentStatus: "Paid",
    billStatus: "Approved",
    auditStatus: "Complete",
    vatTaxPostingStatus: "Post",
    poNo: "PO/PSL/2026/000101",
    mrrDetails: [
      { id: "mrr-005", mrrDate: "16/08/2026", challanNo: "CH-0000", totalPrice: 680.0 },
    ],
  },
  {
    id: "sb-006",
    supplierName: "Robotics BD",
    billDate: "18/08/2026",
    billType: "Local",
    billNo: "965",
    challanNo: "CH-5500",
    currency: "BDT",
    exchangeRate: 1.0,
    billValue: 12450.0,
    mrrTotal: 12450.0,
    vatAmt: 622.5,
    taxAmt: 249.0,
    discountAmt: 0.0,
    advancePayment: 3000.0,
    remarks: "Automation components",
    auditValue: 9828.5,
    paymentStatus: "Partial",
    billStatus: "Approved",
    auditStatus: "Pending",
    vatTaxPostingStatus: "Post",
    poNo: "PO/PSL/2026/000102",
    mrrDetails: [
      { id: "mrr-006a", mrrDate: "17/08/2026", challanNo: "CH-5499", totalPrice: 8000.0 },
      { id: "mrr-006b", mrrDate: "18/08/2026", challanNo: "CH-5500", totalPrice: 4450.0 },
    ],
  },
  {
    id: "sb-007",
    supplierName: "Apex Textile Chemical Ltd",
    billDate: "20/08/2026",
    billType: "Import",
    billNo: "IMP-4481",
    challanNo: "CH-IMP-0081",
    currency: "USD",
    exchangeRate: 118.5,
    billValue: 45200.0,
    mrrTotal: 45200.0,
    vatAmt: 2260.0,
    taxAmt: 904.0,
    discountAmt: 1000.0,
    advancePayment: 10000.0,
    remarks: "Quarterly chemical supply",
    auditValue: 36396.0,
    paymentStatus: "Unpaid",
    billStatus: "Pending",
    auditStatus: "Pending",
    vatTaxPostingStatus: "Unpost",
    poNo: "PO/PSL/2026/000103",
    mrrDetails: [
      { id: "mrr-007a", mrrDate: "18/08/2026", challanNo: "CH-IMP-0080", totalPrice: 20000.0 },
      { id: "mrr-007b", mrrDate: "19/08/2026", challanNo: "CH-IMP-0081", totalPrice: 25200.0 },
    ],
  },
  {
    id: "sb-008",
    supplierName: "Zhejiang Yarn Spinning Co.",
    billDate: "25/08/2026",
    billType: "Import",
    billNo: "IMP-4482",
    challanNo: "CH-IMP-0099",
    currency: "USD",
    exchangeRate: 118.5,
    billValue: 32800.0,
    mrrTotal: 32800.0,
    vatAmt: 1640.0,
    taxAmt: 656.0,
    discountAmt: 0.0,
    advancePayment: 5000.0,
    remarks: "",
    auditValue: 27804.0,
    paymentStatus: "Unpaid",
    billStatus: "Saved",
    auditStatus: "N/A",
    vatTaxPostingStatus: "Unpost",
    poNo: "PO/PSL/2026/000104",
    mrrDetails: [
      { id: "mrr-008", mrrDate: "24/08/2026", challanNo: "CH-IMP-0099", totalPrice: 32800.0 },
    ],
  },
  {
    id: "sb-009",
    supplierName: "JAMUNA CHEMICALS",
    billDate: "01/09/2026",
    billType: "Local",
    billNo: "908",
    challanNo: "CH-7780",
    currency: "BDT",
    exchangeRate: 1.0,
    billValue: 5650.0,
    mrrTotal: 5650.0,
    vatAmt: 282.5,
    taxAmt: 113.0,
    discountAmt: 150.0,
    advancePayment: 0.0,
    remarks: "",
    auditValue: 5200.5,
    paymentStatus: "Paid",
    billStatus: "Approved",
    auditStatus: "Complete",
    vatTaxPostingStatus: "Post",
    poNo: "PO/PSL/2026/000105",
    mrrDetails: [
      { id: "mrr-009", mrrDate: "31/08/2026", challanNo: "CH-7780", totalPrice: 5650.0 },
    ],
  },
  {
    id: "sb-010",
    supplierName: "Alpha Corporation",
    billDate: "01/09/2026",
    billType: "Local",
    billNo: "22980",
    challanNo: "CH-8100",
    currency: "BDT",
    exchangeRate: 1.0,
    billValue: 89500.0,
    mrrTotal: 89500.0,
    vatAmt: 4475.0,
    taxAmt: 1790.0,
    discountAmt: 2500.0,
    advancePayment: 15000.0,
    remarks: "Bulk order",
    auditValue: 70235.0,
    paymentStatus: "Partial",
    billStatus: "Approved",
    auditStatus: "Complete",
    vatTaxPostingStatus: "Post",
    poNo: "PO/PSL/2026/000106",
    mrrDetails: [
      { id: "mrr-010a", mrrDate: "30/08/2026", challanNo: "CH-8099", totalPrice: 45000.0 },
      { id: "mrr-010b", mrrDate: "01/09/2026", challanNo: "CH-8100", totalPrice: 44500.0 },
    ],
  },
  {
    id: "sb-011",
    supplierName: "Samuda Chemical Complex Ltd",
    billDate: "01/09/2026",
    billType: "Local",
    billNo: "9496",
    challanNo: "CH-4401",
    currency: "BDT",
    exchangeRate: 1.0,
    billValue: 23400.0,
    mrrTotal: 23400.0,
    vatAmt: 1170.0,
    taxAmt: 468.0,
    discountAmt: 0.0,
    advancePayment: 0.0,
    remarks: "",
    auditValue: 21762.0,
    paymentStatus: "Unpaid",
    billStatus: "Pending",
    auditStatus: "Pending",
    vatTaxPostingStatus: "Post",
    poNo: "PO/PSL/2026/000107",
    mrrDetails: [
      { id: "mrr-011", mrrDate: "31/08/2026", challanNo: "CH-4401", totalPrice: 23400.0 },
    ],
  },
  {
    id: "sb-012",
    supplierName: "Harmony Chem Ltd.",
    billDate: "31/08/2026",
    billType: "Local",
    billNo: "7226",
    challanNo: "CH-6620",
    currency: "BDT",
    exchangeRate: 1.0,
    billValue: 14800.0,
    mrrTotal: 14800.0,
    vatAmt: 740.0,
    taxAmt: 296.0,
    discountAmt: 0.0,
    advancePayment: 0.0,
    remarks: "",
    auditValue: 13764.0,
    paymentStatus: "Unpaid",
    billStatus: "Saved",
    auditStatus: "N/A",
    vatTaxPostingStatus: "Unpost",
    poNo: "PO/PSL/2026/000108",
    mrrDetails: [
      { id: "mrr-012", mrrDate: "30/08/2026", challanNo: "CH-6620", totalPrice: 14800.0 },
    ],
  },
];

const SUPPLIER_NAMES = [...new Set(INITIAL_BILLS.map((b) => b.supplierName))];

const STATUS_COLORS: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Partial: "bg-amber-100 text-amber-700 border-amber-200",
  Unpaid: "bg-red-100 text-red-700 border-red-200",
  Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Saved: "bg-slate-100 text-slate-600 border-slate-200",
  Complete: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "N/A": "bg-slate-100 text-slate-500 border-slate-200",
  Post: "bg-blue-100 text-blue-700 border-blue-200",
  Unpost: "bg-orange-100 text-orange-700 border-orange-200",
};

// ─── Helpers ──────────────────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function StatusBadge({ value }: { value: string }) {
  const cls = STATUS_COLORS[value] || "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase border ${cls}`}>
      {value}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
function SupplierBillPage() {
  const [view, setView] = useState<"list" | "add">("list");
  const [bills, setBills] = useState<SupplierBillRecord[]>(INITIAL_BILLS);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [billStatus, setBillStatus] = useState("All");
  const [billNoFilter, setBillNoFilter] = useState("");
  const [poNoFilter, setPoNoFilter] = useState("");
  const [auditStatus, setAuditStatus] = useState("All");
  const [vatTaxStatus, setVatTaxStatus] = useState("All");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [myEntries, setMyEntries] = useState(true);
  const [tableSearch, setTableSearch] = useState("");

  // View detail modal
  const [detailBill, setDetailBill] = useState<SupplierBillRecord | null>(null);

  // Filtered data
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      if (paymentStatus !== "All" && b.paymentStatus !== paymentStatus) return false;
      if (billStatus !== "All" && b.billStatus !== billStatus) return false;
      if (auditStatus !== "All" && b.auditStatus !== auditStatus) return false;
      if (vatTaxStatus !== "All" && b.vatTaxPostingStatus !== vatTaxStatus) return false;
      if (supplierFilter !== "All" && b.supplierName !== supplierFilter) return false;
      if (billNoFilter && !b.billNo.toLowerCase().includes(billNoFilter.toLowerCase())) return false;
      if (poNoFilter && !b.poNo.toLowerCase().includes(poNoFilter.toLowerCase())) return false;
      if (tableSearch) {
        const q = tableSearch.toLowerCase();
        return (
          b.supplierName.toLowerCase().includes(q) ||
          b.billNo.toLowerCase().includes(q) ||
          b.challanNo.toLowerCase().includes(q) ||
          b.poNo.toLowerCase().includes(q) ||
          b.billDate.includes(q)
        );
      }
      return true;
    });
  }, [bills, paymentStatus, billStatus, auditStatus, vatTaxStatus, supplierFilter, billNoFilter, poNoFilter, tableSearch]);

  // Summary stats
  const stats = useMemo(() => {
    const totalBills = filteredBills.length;
    const totalValue = filteredBills.reduce((s, b) => s + b.billValue, 0);
    const totalVat = filteredBills.reduce((s, b) => s + b.vatAmt, 0);
    const totalPaid = filteredBills.filter((b) => b.paymentStatus === "Paid").length;
    return { totalBills, totalValue, totalVat, totalPaid };
  }, [filteredBills]);

  const handleDeleteBill = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this supplier bill record?")) {
      setBills((prev) => prev.filter((b) => b.id !== id));
    }
  }, []);

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setPaymentStatus("All");
    setBillStatus("All");
    setBillNoFilter("");
    setPoNoFilter("");
    setAuditStatus("All");
    setVatTaxStatus("All");
    setSupplierFilter("All");
    setMyEntries(true);
    setTableSearch("");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-5 w-full max-w-[1800px] mx-auto">
          {/* ═══ HEADER ═══ */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <ReceiptText className="size-5.5 text-primary" />
                Supplier Bill
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-normal">
                Procurement Workspace &gt; Billing &gt;{" "}
                <span className="text-amber-500 font-semibold">Supplier Bill</span>
              </p>
            </div>
            {view === "list" ? (
              <button
                onClick={() => setView("add")}
                className="h-9 px-5 bg-gradient-to-r from-[#0d6efd] to-[#0b5ed7] hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 group"
              >
                <Plus className="size-4 group-hover:rotate-90 transition-transform duration-200" />
                Add New Supplier Bill
              </button>
            ) : (
              <button
                onClick={() => setView("list")}
                className="h-9 px-5 bg-slate-700 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
              >
                <ClipboardList className="size-4" />
                Back to Registry
              </button>
            )}
          </div>

          {/* ═══ VIEWS ═══ */}
          {view === "list" ? (
            <ListViewSection
              stats={stats}
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
              paymentStatus={paymentStatus}
              setPaymentStatus={setPaymentStatus}
              billStatus={billStatus}
              setBillStatus={setBillStatus}
              billNoFilter={billNoFilter}
              setBillNoFilter={setBillNoFilter}
              poNoFilter={poNoFilter}
              setPoNoFilter={setPoNoFilter}
              auditStatus={auditStatus}
              setAuditStatus={setAuditStatus}
              vatTaxStatus={vatTaxStatus}
              setVatTaxStatus={setVatTaxStatus}
              supplierFilter={supplierFilter}
              setSupplierFilter={setSupplierFilter}
              myEntries={myEntries}
              setMyEntries={setMyEntries}
              tableSearch={tableSearch}
              setTableSearch={setTableSearch}
              filteredBills={filteredBills}
              expandedRow={expandedRow}
              setExpandedRow={setExpandedRow}
              onDelete={handleDeleteBill}
              onView={setDetailBill}
              clearFilters={clearFilters}
            />
          ) : (
            <AddNewBillSection onDone={() => setView("list")} setBills={setBills} />
          )}
        </div>

        {/* ═══ DETAIL MODAL ═══ */}
        {detailBill && (
          <DetailModal bill={detailBill} onClose={() => setDetailBill(null)} />
        )}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LIST VIEW SECTION
// ═══════════════════════════════════════════════════════════════════════
interface ListViewProps {
  stats: { totalBills: number; totalValue: number; totalVat: number; totalPaid: number };
  dateFrom: string; setDateFrom: (v: string) => void;
  dateTo: string; setDateTo: (v: string) => void;
  paymentStatus: string; setPaymentStatus: (v: string) => void;
  billStatus: string; setBillStatus: (v: string) => void;
  billNoFilter: string; setBillNoFilter: (v: string) => void;
  poNoFilter: string; setPoNoFilter: (v: string) => void;
  auditStatus: string; setAuditStatus: (v: string) => void;
  vatTaxStatus: string; setVatTaxStatus: (v: string) => void;
  supplierFilter: string; setSupplierFilter: (v: string) => void;
  myEntries: boolean; setMyEntries: (v: boolean) => void;
  tableSearch: string; setTableSearch: (v: string) => void;
  filteredBills: SupplierBillRecord[];
  expandedRow: string | null; setExpandedRow: (v: string | null) => void;
  onDelete: (id: string) => void;
  onView: (b: SupplierBillRecord) => void;
  clearFilters: () => void;
}

function ListViewSection(props: ListViewProps) {
  const { stats, filteredBills, expandedRow, setExpandedRow, onDelete, onView, clearFilters } = props;

  return (
    <>
      {/* ─── Quick Stats ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<ReceiptText className="size-5" />} label="Total Bills" value={String(stats.totalBills)} color="blue" />
        <StatCard icon={<DollarSign className="size-5" />} label="Total Value" value={`৳${fmt(stats.totalValue)}`} color="emerald" />
        <StatCard icon={<Calculator className="size-5" />} label="Total VAT" value={`৳${fmt(stats.totalVat)}`} color="amber" />
        <StatCard icon={<CheckCircle2 className="size-5" />} label="Paid Bills" value={String(stats.totalPaid)} color="violet" />
      </div>

      {/* ─── Filter Panel ─── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            <Filter className="size-3.5 text-blue-500" />
            Advanced Filters
          </div>
          <button
            onClick={clearFilters}
            className="text-[10px] font-medium text-blue-600 hover:text-blue-800 transition flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="size-3" /> Reset
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3">
          <FilterInput icon={<Calendar className="size-3.5" />} label="Date From" type="date" value={props.dateFrom} onChange={props.setDateFrom} />
          <FilterInput icon={<Calendar className="size-3.5" />} label="Date To" type="date" value={props.dateTo} onChange={props.setDateTo} />
          <FilterSelect label="Payment Status" value={props.paymentStatus} onChange={props.setPaymentStatus} options={["All", "Paid", "Partial", "Unpaid"]} />
          <FilterSelect label="Bill Status" value={props.billStatus} onChange={props.setBillStatus} options={["All", "Approved", "Pending", "Saved"]} />
          <FilterInput label="Bill No" value={props.billNoFilter} onChange={props.setBillNoFilter} placeholder="Search bill..." />
          <FilterInput label="Purchase Order No" value={props.poNoFilter} onChange={props.setPoNoFilter} placeholder="PO number..." />
          <FilterSelect label="Audit Status" value={props.auditStatus} onChange={props.setAuditStatus} options={["All", "Complete", "Pending", "N/A"]} />
          <FilterSelect label="VAT & Tax Posting" value={props.vatTaxStatus} onChange={props.setVatTaxStatus} options={["All", "Post", "Unpost"]} />
          <FilterSelect label="Supplier Name" value={props.supplierFilter} onChange={props.setSupplierFilter} options={["All", ...SUPPLIER_NAMES]} />
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={props.myEntries}
                onChange={(e) => props.setMyEntries(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-600 transition">My Entries</span>
            </label>
          </div>
        </div>
      </div>

      {/* ─── Table Container ─── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { icon: <FileSpreadsheet className="size-3.5 text-emerald-600" />, label: "EXCEL" },
              { icon: <Printer className="size-3.5 text-blue-600" />, label: "PRINT" },
              { icon: <FileText className="size-3.5 text-red-600" />, label: "PDF" },
            ].map((btn) => (
              <button key={btn.label} className="h-[30px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[10px] rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer">
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search table..."
              value={props.tableSearch}
              onChange={(e) => props.setTableSearch(e.target.value)}
              className="w-full pl-8 pr-3 h-[30px] bg-[#f8fafc] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 focus:bg-white focus:border-blue-500 rounded-md text-[11px] font-normal text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-[9px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap bg-slate-50 dark:bg-slate-800/80">
                <th className="px-2.5 py-2.5 text-center w-8 border-r border-slate-100 dark:border-slate-700">▼</th>
                <th className="px-2.5 py-2.5 text-center w-10 border-r border-slate-100 dark:border-slate-700">#</th>
                {["Supplier Name", "Bill Date", "Bill Type", "Bill No", "Challan No", "Currency", "Ex. Rate", "Bill Value", "MRR Total", "VAT Amt", "Tax Amt", "Disc. Amt", "Adv. Pay", "Remarks", "Audit Value", "Payment"].map((h) => (
                  <th key={h} className="px-2.5 py-2.5 border-r border-slate-100 dark:border-slate-700 last:border-r-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-normal text-slate-700 dark:text-slate-200 bg-white dark:bg-transparent">
              {filteredBills.map((bill, idx) => (
                <BillRow
                  key={bill.id}
                  bill={bill}
                  idx={idx}
                  isExpanded={expandedRow === bill.id}
                  onToggle={() => setExpandedRow(expandedRow === bill.id ? null : bill.id)}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))}
              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan={18} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="size-8 text-slate-300" />
                      <span className="text-sm font-semibold">No data available in table</span>
                      <span className="text-xs font-normal">Try adjusting your filters</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-[#fcfdfd] dark:bg-slate-900/40 text-[11px] text-muted-foreground font-normal flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Showing 1 to {filteredBills.length} of {filteredBills.length} entries</span>
          <div className="flex items-center gap-1.5">
            <button className="px-2 py-1 text-slate-400 hover:text-slate-700 font-normal cursor-pointer">Previous</button>
            <button className="size-6 bg-[#0d6efd] text-white font-semibold rounded flex items-center justify-center text-[10px]">1</button>
            <button className="px-2 py-1 text-slate-400 hover:text-slate-700 font-normal cursor-pointer">Next</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Bill Row ─────────────────────────────────────────────────────────
function BillRow({
  bill,
  idx,
  isExpanded,
  onToggle,
  onDelete,
  onView,
}: {
  bill: SupplierBillRecord;
  idx: number;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
  onView: (b: SupplierBillRecord) => void;
}) {
  return (
    <>
      <tr className={`hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors ${isExpanded ? "bg-blue-50/30 dark:bg-slate-800/30" : ""}`}>
        <td className="px-2.5 py-2 text-center border-r border-slate-100 dark:border-slate-700">
          <button onClick={onToggle} className="text-slate-400 hover:text-blue-600 transition cursor-pointer">
            {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
        </td>
        <td className="px-2.5 py-2 text-center border-r border-slate-100 dark:border-slate-700 text-slate-400 font-medium">{idx + 1}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap max-w-[180px] truncate">{bill.supplierName}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 whitespace-nowrap">{bill.billDate}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${bill.billType === "Import" ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-sky-100 text-sky-700 border border-sky-200"}`}>
            {bill.billType}
          </span>
        </td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 font-mono text-[10px]">{bill.billNo}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 font-mono text-[10px]">{bill.challanNo}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 font-semibold">{bill.currency}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 text-right font-mono text-[10px]">{bill.exchangeRate.toFixed(3)}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 text-right font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">{fmt(bill.billValue)}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 text-right whitespace-nowrap">{fmt(bill.mrrTotal)}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 text-right whitespace-nowrap text-amber-600">{fmt(bill.vatAmt)}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 text-right whitespace-nowrap text-rose-600">{fmt(bill.taxAmt)}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 text-right whitespace-nowrap text-violet-600">{fmt(bill.discountAmt)}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 text-right whitespace-nowrap text-cyan-600">{fmt(bill.advancePayment)}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 max-w-[120px] truncate text-slate-500">{bill.remarks || "—"}</td>
        <td className="px-2.5 py-2 border-r border-slate-100 dark:border-slate-700 text-right font-semibold whitespace-nowrap">{fmt(bill.auditValue)}</td>
        <td className="px-2.5 py-2">
          <StatusBadge value={bill.paymentStatus} />
        </td>
      </tr>
      {/* Expanded MRR Details */}
      {isExpanded && (
        <tr className="bg-gradient-to-r from-blue-50/60 to-indigo-50/40 dark:from-slate-800/60 dark:to-slate-800/40">
          <td colSpan={18} className="px-6 py-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* MRR Details Table */}
              <div className="flex-1">
                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Package className="size-3.5 text-blue-500" />
                  MRR Details ({bill.mrrDetails.length})
                </h4>
                <table className="w-full text-[11px] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700/60 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-3 py-2 text-left">MRR Date</th>
                      <th className="px-3 py-2 text-left">Challan No</th>
                      <th className="px-3 py-2 text-right">Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.mrrDetails.map((m) => (
                      <tr key={m.id} className="border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/40">
                        <td className="px-3 py-1.5">{m.mrrDate}</td>
                        <td className="px-3 py-1.5 font-mono">{m.challanNo}</td>
                        <td className="px-3 py-1.5 text-right font-semibold">{fmt(m.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Status & Actions */}
              <div className="w-full lg:w-64 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Status Summary</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Bill Status</span>
                    <StatusBadge value={bill.billStatus} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Audit Status</span>
                    <StatusBadge value={bill.auditStatus} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">VAT/Tax Posting</span>
                    <StatusBadge value={bill.vatTaxPostingStatus} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">PO Number</span>
                    <span className="font-mono text-[10px] font-semibold text-blue-600">{bill.poNo}</span>
                  </div>
                </div>
                <div className="pt-2 flex gap-2 border-t border-slate-200 dark:border-slate-700">
                  <button onClick={() => onView(bill)} className="flex-1 h-7 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold rounded flex items-center justify-center gap-1 transition cursor-pointer">
                    <Eye className="size-3" /> View
                  </button>
                  <button onClick={() => onDelete(bill.id)} className="flex-1 h-7 bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold rounded flex items-center justify-center gap-1 transition cursor-pointer">
                    <Trash2 className="size-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ADD NEW BILL SECTION
// ═══════════════════════════════════════════════════════════════════════
interface AddNewBillProps {
  onDone: () => void;
  setBills: React.Dispatch<React.SetStateAction<SupplierBillRecord[]>>;
}

function AddNewBillSection({ onDone, setBills }: AddNewBillProps) {
  const [billDate, setBillDate] = useState(new Date().toISOString().split("T")[0]);
  const [billType, setBillType] = useState("Purchase");
  const [supplierName, setSupplierName] = useState("");
  const [poNo, setPoNo] = useState("");
  const [poValue, setPoValue] = useState(0);
  const [currency, setCurrency] = useState("BDT");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [supplierBillNo, setSupplierBillNo] = useState("");
  const [challanNo, setChallanNo] = useState("");
  const [billValue, setBillValue] = useState(0);
  const [mrrValue, setMrrValue] = useState(0);
  const [totalMrrValue, setTotalMrrValue] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [mrrDetails, setMrrDetails] = useState<MrrDetail[]>([
    { id: "new-mrr-1", mrrDate: "", challanNo: "", totalPrice: 0 },
  ]);

  const totalBillValue = billValue * exchangeRate;
  const billBalance = totalBillValue - totalMrrValue;

  const addMrrRow = () => {
    setMrrDetails((prev) => [
      ...prev,
      { id: `new-mrr-${Date.now()}`, mrrDate: "", challanNo: "", totalPrice: 0 },
    ]);
  };

  const removeMrrRow = (id: string) => {
    setMrrDetails((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMrrRow = (id: string, field: keyof MrrDetail, value: string | number) => {
    setMrrDetails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSave = () => {
    if (!supplierName.trim()) {
      alert("Please enter a supplier name.");
      return;
    }
    const newBill: SupplierBillRecord = {
      id: `sb-${Date.now()}`,
      supplierName,
      billDate: billDate.split("-").reverse().join("/"),
      billType: billType === "Purchase" ? "Local" : "Import",
      billNo: supplierBillNo || "—",
      challanNo: challanNo || "—",
      currency,
      exchangeRate,
      billValue,
      mrrTotal: totalMrrValue,
      vatAmt: 0,
      taxAmt: 0,
      discountAmt: 0,
      advancePayment: 0,
      remarks,
      auditValue: billValue,
      paymentStatus: "Unpaid",
      billStatus: "Saved",
      auditStatus: "N/A",
      vatTaxPostingStatus: "Unpost",
      poNo: poNo || "—",
      mrrDetails: mrrDetails.filter((m) => m.mrrDate || m.challanNo || m.totalPrice > 0),
    };
    setBills((prev) => [newBill, ...prev]);
    onDone();
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* ─── Bill Form Card ─── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ReceiptText className="size-4 text-blue-600" />
            New Supplier Bill Entry
          </h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Fill in the details to create a new supplier bill record</p>
        </div>

        <div className="p-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4 mb-5">
            <FormField label="Bill Date" required>
              <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)}
                className="form-input-style" />
            </FormField>
            <FormField label="Bill Type" required>
              <select value={billType} onChange={(e) => setBillType(e.target.value)}
                className="form-input-style cursor-pointer">
                <option>Purchase</option>
                <option>Import</option>
                <option>Service</option>
              </select>
            </FormField>
            <FormField label="Supplier Name" required>
              <input type="text" value={supplierName} onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Write Min 3 Characters" className="form-input-style" />
            </FormField>
            <FormField label="Purchase Order No" required>
              <select value={poNo} onChange={(e) => setPoNo(e.target.value)}
                className="form-input-style cursor-pointer">
                <option value="">Select PO...</option>
                <option>PO/PSL/2026/000115</option>
                <option>PO/PSL/2026/000098</option>
                <option>PO/PSL/2026/000099</option>
                <option>PO/PSL/2026/000100</option>
                <option>PO/PSL/2026/000101</option>
                <option>PO/PSL/2026/000102</option>
                <option>PO/PSL/2026/000103</option>
              </select>
            </FormField>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4 mb-5">
            <FormField label="PO Value" required>
              <input type="number" value={poValue} onChange={(e) => setPoValue(Number(e.target.value))}
                className="form-input-style text-right font-mono" />
            </FormField>
            <FormField label="Currency" required>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                className="form-input-style cursor-pointer">
                <option>BDT</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>CNY</option>
              </select>
            </FormField>
            <FormField label="Exchange Rate" required>
              <input type="number" value={exchangeRate} onChange={(e) => setExchangeRate(Number(e.target.value))}
                step="0.001" className="form-input-style text-right font-mono" />
            </FormField>
            <FormField label="Supplier Bill No" required>
              <input type="text" value={supplierBillNo} onChange={(e) => setSupplierBillNo(e.target.value)}
                placeholder="Enter bill number" className="form-input-style" />
            </FormField>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4 mb-5">
            <FormField label="Challan No">
              <input type="text" value={challanNo} onChange={(e) => setChallanNo(e.target.value)}
                placeholder="Enter challan number" className="form-input-style" />
            </FormField>
            <FormField label="Bill Value" required>
              <input type="number" value={billValue} onChange={(e) => setBillValue(Number(e.target.value))}
                className="form-input-style text-right font-mono" />
            </FormField>
            <FormField label="Total Bill Value" required>
              <div className="form-display-style font-semibold text-blue-700 dark:text-blue-400">
                {currency} {fmt(totalBillValue)}
              </div>
            </FormField>
            <FormField label="Bill Balance" required>
              <div className={`form-display-style font-semibold ${billBalance >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                {currency} {fmt(billBalance)}
              </div>
            </FormField>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
            <FormField label="MRR Value" required>
              <input type="number" value={mrrValue} onChange={(e) => setMrrValue(Number(e.target.value))}
                className="form-input-style text-right font-mono" />
            </FormField>
            <FormField label="Total MRR Value" required>
              <div className="form-display-style font-semibold text-indigo-700 dark:text-indigo-400">
                {currency} {fmt(totalMrrValue)}
              </div>
            </FormField>
            <div className="lg:col-span-2">
              <FormField label="Remarks">
                <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional notes..." className="form-input-style" />
              </FormField>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MRR Details Card ─── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-slate-800 dark:to-slate-800">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Package className="size-4 text-indigo-600" />
            MRR Details
          </h2>
          <button
            onClick={addMrrRow}
            className="h-7 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-semibold rounded-md flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Plus className="size-3" /> Add Row
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[9px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-2.5 text-center w-16">Action</th>
                <th className="px-4 py-2.5 text-left">MRR Date</th>
                <th className="px-4 py-2.5 text-left">Challan No</th>
                <th className="px-4 py-2.5 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {mrrDetails.map((mrr) => (
                <tr key={mrr.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => removeMrrRow(mrr.id)}
                      className="text-red-500 hover:text-red-700 transition cursor-pointer p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      value={mrr.mrrDate}
                      onChange={(e) => updateMrrRow(mrr.id, "mrrDate", e.target.value)}
                      className="w-full bg-transparent outline-none border-b border-slate-200 dark:border-slate-700 focus:border-blue-500 text-[11px] py-1 font-normal text-slate-700 dark:text-slate-200 transition"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={mrr.challanNo}
                      onChange={(e) => updateMrrRow(mrr.id, "challanNo", e.target.value)}
                      placeholder="Enter challan..."
                      className="w-full bg-transparent outline-none border-b border-slate-200 dark:border-slate-700 focus:border-blue-500 text-[11px] py-1 font-normal text-slate-700 dark:text-slate-200 transition placeholder:text-slate-400"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={mrr.totalPrice || ""}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateMrrRow(mrr.id, "totalPrice", val);
                        // Recalculate total MRR
                        const otherTotal = mrrDetails
                          .filter((m) => m.id !== mrr.id)
                          .reduce((s, m) => s + m.totalPrice, 0);
                        setTotalMrrValue(otherTotal + val);
                      }}
                      placeholder="0.00"
                      className="w-full bg-transparent outline-none border-b border-slate-200 dark:border-slate-700 focus:border-blue-500 text-[11px] py-1 text-right font-mono font-normal text-slate-700 dark:text-slate-200 transition placeholder:text-slate-400"
                    />
                  </td>
                </tr>
              ))}
              {mrrDetails.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    <span className="text-xs">No MRR entries yet. Click "Add Row" to begin.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Save Button ─── */}
      <div className="flex justify-start">
        <button
          onClick={handleSave}
          className="h-10 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer uppercase tracking-wide"
        >
          <Save className="size-4" />
          Save Supplier Bill
        </button>
      </div>

      {/* Inline styles for form fields */}
      <style>{`
        .form-input-style {
          width: 100%;
          height: 36px;
          padding: 0 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 12px;
          font-family: inherit;
          color: #334155;
          background: #f8fafc;
          outline: none;
          transition: all 0.15s;
        }
        .form-input-style:hover { border-color: #cbd5e1; }
        .form-input-style:focus {
          border-color: #3b82f6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
        }
        .dark .form-input-style {
          background: #1e293b;
          border-color: #334155;
          color: #e2e8f0;
        }
        .dark .form-input-style:focus {
          border-color: #3b82f6;
          background: #0f172a;
        }
        .form-display-style {
          width: 100%;
          height: 36px;
          padding: 0 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 12px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          font-family: ui-monospace, SFMono-Regular, monospace;
        }
        .dark .form-display-style {
          background: #1e293b;
          border-color: #334155;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════
function DetailModal({ bill, onClose }: { bill: SupplierBillRecord; onClose: () => void }) {
  const netPayable = bill.billValue + bill.vatAmt + bill.taxAmt - bill.discountAmt - bill.advancePayment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-950 w-full max-w-2xl rounded-xl shadow-2xl border border-border/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ReceiptText className="size-4 text-blue-600" />
              Supplier Bill Details
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Bill #{bill.billNo} — {bill.supplierName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition p-1.5 rounded-lg hover:bg-white/60 cursor-pointer">
            <X className="size-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <DetailField label="Supplier" value={bill.supplierName} />
            <DetailField label="Bill Date" value={bill.billDate} />
            <DetailField label="Bill Type" value={bill.billType} />
            <DetailField label="Bill No" value={bill.billNo} />
            <DetailField label="Challan No" value={bill.challanNo} />
            <DetailField label="PO Number" value={bill.poNo} />
            <DetailField label="Currency" value={bill.currency} />
            <DetailField label="Exchange Rate" value={bill.exchangeRate.toFixed(3)} />
            <DetailField label="Remarks" value={bill.remarks || "—"} />
          </div>

          {/* Financial Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Financial Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <FinRow label="Bill Value" value={fmt(bill.billValue)} />
              <FinRow label="MRR Total" value={fmt(bill.mrrTotal)} />
              <FinRow label="VAT Amount" value={fmt(bill.vatAmt)} color="text-amber-600" />
              <FinRow label="Tax Amount" value={fmt(bill.taxAmt)} color="text-rose-600" />
              <FinRow label="Discount" value={`-${fmt(bill.discountAmt)}`} color="text-violet-600" />
              <FinRow label="Advance Payment" value={`-${fmt(bill.advancePayment)}`} color="text-cyan-600" />
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Net Payable</span>
              <span className="text-sm font-black text-blue-700 dark:text-blue-400">{bill.currency} {fmt(netPayable)}</span>
            </div>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatusField label="Payment" value={bill.paymentStatus} />
            <StatusField label="Bill Status" value={bill.billStatus} />
            <StatusField label="Audit" value={bill.auditStatus} />
            <StatusField label="VAT/Tax" value={bill.vatTaxPostingStatus} />
          </div>

          {/* MRR Details */}
          {bill.mrrDetails.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Package className="size-3.5 text-indigo-500" />
                MRR Details
              </h4>
              <table className="w-full text-[11px] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700/60 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-3 py-2 text-center">#</th>
                    <th className="px-3 py-2 text-left">MRR Date</th>
                    <th className="px-3 py-2 text-left">Challan No</th>
                    <th className="px-3 py-2 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.mrrDetails.map((m, i) => (
                    <tr key={m.id} className="border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/40">
                      <td className="px-3 py-1.5 text-center text-slate-400">{i + 1}</td>
                      <td className="px-3 py-1.5">{m.mrrDate}</td>
                      <td className="px-3 py-1.5 font-mono">{m.challanNo}</td>
                      <td className="px-3 py-1.5 text-right font-semibold">{fmt(m.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="h-8 px-5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-200/60 dark:from-blue-500/10 dark:to-blue-600/5 dark:border-blue-800/40",
    emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-200/60 dark:from-emerald-500/10 dark:to-emerald-600/5 dark:border-emerald-800/40",
    amber: "from-amber-500/10 to-amber-600/5 border-amber-200/60 dark:from-amber-500/10 dark:to-amber-600/5 dark:border-amber-800/40",
    violet: "from-violet-500/10 to-violet-600/5 border-violet-200/60 dark:from-violet-500/10 dark:to-violet-600/5 dark:border-violet-800/40",
  };
  const iconColors: Record<string, string> = { blue: "text-blue-600", emerald: "text-emerald-600", amber: "text-amber-600", violet: "text-violet-600" };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl px-4 py-3 flex items-center gap-3`}>
      <div className={`${iconColors[color]} opacity-80`}>{icon}</div>
      <div>
        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function FilterInput({ label, value, onChange, type = "text", placeholder, icon }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
        {icon}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[32px] px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[11px] text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition placeholder:text-slate-400"
      />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[32px] px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[11px] text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{value}</p>
    </div>
  );
}

function FinRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`font-semibold font-mono ${color || "text-slate-800 dark:text-slate-100"}`}>{value}</span>
    </div>
  );
}

function StatusField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5 text-center">
      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <StatusBadge value={value} />
    </div>
  );
}
