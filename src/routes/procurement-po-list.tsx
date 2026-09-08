import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Plus,
  Trash2,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  Eye,
  Building2,
  CheckCircle2,
  Sparkles,
  Download,
  Check,
  Send,
  ShieldCheck,
  RefreshCw,
  Home,
  ChevronRight,
  Filter,
} from "lucide-react";
import pakizaSoftwareLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export const Route = createFileRoute("/procurement-po-list")({
  head: () => ({
    meta: [
      { title: "Purchase Order List — CRIPTON Procurement" },
      { name: "description", content: "Executive Purchase Order Registry with date filters, status tracking, document viewer, and local storage integration." },
    ],
  }),
  component: PurchaseOrderListPage,
});

export interface PurchaseOrderItem {
  sl: number;
  description: string;
  uom: string;
  qty: number;
  unitPrice: number;
  discount: number;
  netPrice: number;
  currency: string;
  curRate: number;
  amount: number;
  amountBdt: number;
}

export interface PurchaseOrderRecord {
  id: string;
  poNo: string;
  poDate: string;
  csRef?: string;
  reqNo: string;
  supplier: string;
  supplierContact?: string;
  deliveryTo: string;
  deliveryContact?: string;
  jobDescription?: string;
  poValidDate?: string;
  paymentMode: string;
  currency?: string;
  grossAmount: number;
  discount: number;
  grandTotal: number;
  netAmount: number;
  advance: number;
  status: "Draft" | "Forwarded" | "Approved" | "Review Pending" | "Rejected" | "Saved";
  preparedBy: string;
  preparedDesignation?: string;
  preparedDate?: string;
  poType?: string;
  itemType?: string;
  selectedTerms?: string[];
  items: PurchaseOrderItem[];
}

const INITIAL_MOCK_POS: PurchaseOrderRecord[] = [
  {
    id: "po-115",
    poNo: "PO/PSL/2026/000115",
    poDate: "04/08/2025",
    csRef: "CS-2026-332576",
    reqNo: "332576,338726",
    supplier: "Mokkah Electric",
    supplierContact: "Md. Jahangir Alam — 01711223344",
    deliveryTo: "Pakiza Software Limited, PSL-Operation",
    deliveryContact: "Store In-Charge",
    jobDescription: "Electrical Cabling Materials & Single Sockets",
    poValidDate: "04/09/2025",
    paymentMode: "Credit / LC 90 Days",
    grossAmount: 1850.0,
    discount: 95.0,
    grandTotal: 1755.0,
    netAmount: 1755.0,
    advance: 0.0,
    status: "Saved",
    preparedBy: "Rajebul Hasan Rajon",
    preparedDesignation: "Sr. Procurement Executive",
    preparedDate: "04/08/2025 11:30 AM",
    poType: "Purchase Order",
    itemType: "Requisition",
    selectedTerms: [
      "Total payment will be done after delivery.",
      "Please refer to the W.O. # in all correspondence.",
      "Total bill will be at actual quantity.",
    ],
    items: [
      {
        sl: 1,
        description: "MK One Gang Socket (Flush Mounting 13A Single)",
        uom: "PCS",
        qty: 3.0,
        unitPrice: 350.0,
        discount: 0.0,
        netPrice: 350.0,
        currency: "BDT",
        curRate: 1.0,
        amount: 1050.0,
        amountBdt: 1050.0,
      },
      {
        sl: 2,
        description: "PVC Tape High Insulation (Flame Retardant Black 20m)",
        uom: "PCS",
        qty: 32.0,
        unitPrice: 25.0,
        discount: 0.0,
        netPrice: 25.0,
        currency: "BDT",
        curRate: 1.0,
        amount: 800.0,
        amountBdt: 800.0,
      },
    ],
  },
  {
    id: "po-114",
    poNo: "PO/PSL/2026/000114",
    poDate: "28/08/2026",
    csRef: "CS-2026-361008",
    reqNo: "361008",
    supplier: "Pakiza Apparel Accessories",
    supplierContact: "Store & Sales Desk — 01912345678",
    deliveryTo: "Pakiza Software Limited [PSL-Operation]",
    deliveryContact: "Store & Receiving In-Charge",
    jobDescription: "Ricoh Printer Spare Parts & Cleaning Blades",
    poValidDate: "28/09/2026",
    paymentMode: "30 Days Credit",
    grossAmount: 3250.0,
    discount: 0.0,
    grandTotal: 3250.0,
    netAmount: 3250.0,
    advance: 0.0,
    status: "Approved",
    preparedBy: "Tahmid Afsar",
    preparedDesignation: "Procurement Officer",
    preparedDate: "28/08/2026 04:15 PM",
    poType: "Purchase Order",
    itemType: "Spare Parts",
    selectedTerms: [
      "Total payment will be done after 100% physical delivery verification.",
      "Defective items must be replaced within 7 working days.",
    ],
    items: [
      {
        sl: 1,
        description: "Ricoh MP 2555 Cleaning Blade (Heavy Duty)",
        uom: "PCS",
        qty: 1.0,
        unitPrice: 450.0,
        discount: 0.0,
        netPrice: 450.0,
        currency: "BDT",
        curRate: 1.0,
        amount: 450.0,
        amountBdt: 450.0,
      },
      {
        sl: 2,
        description: "Ricoh MP 2555 Drum (Original OPC Assembly)",
        uom: "PCS",
        qty: 1.0,
        unitPrice: 2800.0,
        discount: 0.0,
        netPrice: 2800.0,
        currency: "BDT",
        curRate: 1.0,
        amount: 2800.0,
        amountBdt: 2800.0,
      },
    ],
  },
  {
    id: "po-113",
    poNo: "PO/PSL/2026/000113",
    poDate: "20/08/2026",
    csRef: "CS-2026-REQ091",
    reqNo: "REQ-2026-091",
    supplier: "Zhejiang Yarn Spinning Co.",
    supplierContact: "Mr. Lin Wei — +86 571 889900",
    deliveryTo: "Pakiza Spinning Mills Ltd (Spinning Unit)",
    deliveryContact: "Plant Manager",
    jobDescription: "30s Carded Cotton Yarn Import",
    poValidDate: "20/10/2026",
    paymentMode: "At Sight L/C",
    grossAmount: 40800.0,
    discount: 0.0,
    grandTotal: 40800.0,
    netAmount: 40800.0,
    advance: 5000.0,
    status: "Review Pending",
    preparedBy: "Kazi Morshed",
    preparedDesignation: "Commercial Manager",
    preparedDate: "20/08/2026 10:00 AM",
    poType: "Work Order",
    itemType: "Material",
    selectedTerms: [
      "Payment will be processed via Irrevocable At Sight L/C.",
      "Pre-shipment inspection certificate from SGS is mandatory.",
    ],
    items: [
      {
        sl: 1,
        description: "30s Carded Cotton Yarn 100% Ring Spun Import",
        uom: "Kg",
        qty: 12000.0,
        unitPrice: 3.4,
        discount: 0.0,
        netPrice: 3.4,
        currency: "USD",
        curRate: 120.0,
        amount: 40800.0,
        amountBdt: 4896000.0,
      },
    ],
  },
];

export function PurchaseOrderListPage() {
  const navigate = useNavigate();

  // Filter Form State
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState("All...");
  const [filterPaymentMode, setFilterPaymentMode] = useState("Select One");
  const [filterPoNo, setFilterPoNo] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");

  // PO Records List (synced with localStorage)
  const [poList, setPoList] = useState<PurchaseOrderRecord[]>(INITIAL_MOCK_POS);

  // Active Modals State
  const [viewingPo, setViewingPo] = useState<PurchaseOrderRecord | null>(null);
  const [forwardingPo, setForwardingPo] = useState<PurchaseOrderRecord | null>(null);

  // Forward Modal State
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [activeForwardTerms, setActiveForwardTerms] = useState<string[]>([]);
  const [customTermInput, setCustomTermInput] = useState("");

  // Load POs from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("procurement_cs_po_list_v3");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge stored with mock, ensuring no duplicates by poNo
            const combinedMap = new Map<string, PurchaseOrderRecord>();
            parsed.forEach((po: PurchaseOrderRecord) => combinedMap.set(po.poNo, po));
            INITIAL_MOCK_POS.forEach((po: PurchaseOrderRecord) => {
              if (!combinedMap.has(po.poNo)) {
                combinedMap.set(po.poNo, po);
              }
            });
            setPoList(Array.from(combinedMap.values()));
          }
        } catch (e) {}
      }
    }
  }, []);

  // Filter Logic
  const filteredPoList = useMemo(() => {
    return poList.filter((po) => {
      // Filter Status
      if (filterStatus !== "All..." && po.status.toLowerCase() !== filterStatus.toLowerCase()) {
        return false;
      }
      // Filter Payment Mode
      if (
        filterPaymentMode !== "Select One" &&
        !po.paymentMode.toLowerCase().includes(filterPaymentMode.toLowerCase())
      ) {
        return false;
      }
      // Filter PO No
      if (filterPoNo && !po.poNo.toLowerCase().includes(filterPoNo.toLowerCase())) {
        return false;
      }
      // Filter Supplier
      if (filterSupplier && !po.supplier.toLowerCase().includes(filterSupplier.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [poList, filterStatus, filterPaymentMode, filterPoNo, filterSupplier]);

  // Open Forward Modal
  const handleOpenForwardModal = (po: PurchaseOrderRecord) => {
    setForwardingPo(po);
    setActiveForwardTerms(
      po.selectedTerms || [
        "Total payment will be done after 100% physical delivery verification & quality inspection.",
        "Please explicitly refer to the P.O. Number in all correspondence, shipping invoices, and delivery challans.",
        "Total bill settlement will be calculated based on actual verified quantity received at store site.",
      ]
    );
    setModalSearchTerm("");
    setCustomTermInput("");
  };

  // Process Forward Action
  const handleProcessForward = () => {
    if (!forwardingPo) return;
    const updated = poList.map((item) =>
      item.id === forwardingPo.id
        ? { ...item, status: "Forwarded" as const, selectedTerms: activeForwardTerms }
        : item
    );
    setPoList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("procurement_cs_po_list_v3", JSON.stringify(updated));
    }
    setForwardingPo(null);
  };

  // Print Document Window
  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-slate-100/70 dark:bg-background text-foreground transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-5 w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-card p-4 rounded-2xl border border-border shadow-2xs">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
                <Home className="size-3.5" />
                <span>Home</span>
                <ChevronRight className="size-3" />
                <span>Purchase</span>
                <ChevronRight className="size-3" />
                <span className="text-blue-600 dark:text-blue-400 font-bold">Purchase Order List</span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <FileText className="size-5.5 text-blue-600 dark:text-blue-400" />
                Purchase Order List
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => navigate({ to: "/procurement-po-requisition-wise" })}
                className="h-9 px-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="size-4" /> Requisition Wise PO
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/procurement-po-new" })}
                className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="size-4" /> New Purchase Order
              </button>
            </div>
          </div>

          {/* FILTER CONTROLS CARD */}
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Filter className="size-4 text-blue-600 dark:text-blue-400" /> Filter Parameters
              </h3>
              <button
                type="button"
                onClick={() => {
                  setFilterDateFrom("");
                  setFilterDateTo("");
                  setFilterStatus("All...");
                  setFilterPaymentMode("Select One");
                  setFilterPoNo("");
                  setFilterSupplier("");
                }}
                className="text-[11px] font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition cursor-pointer"
              >
                <RefreshCw className="size-3" /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {/* Date From */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date From</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-normal outline-none focus:border-blue-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date To</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-normal outline-none focus:border-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
                >
                  <option value="All...">All...</option>
                  <option value="Saved">Saved</option>
                  <option value="Draft">Draft</option>
                  <option value="Review Pending">Review Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Mode</label>
                <select
                  value={filterPaymentMode}
                  onChange={(e) => setFilterPaymentMode(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
                >
                  <option value="Select One">Select One</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit</option>
                  <option value="Advance">Advance</option>
                  <option value="Credit / LC 90 Days">Credit / LC 90 Days</option>
                </select>
              </div>

              {/* PO No */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PO No</label>
                <input
                  type="text"
                  placeholder="e.g. 000115"
                  value={filterPoNo}
                  onChange={(e) => setFilterPoNo(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-medium outline-none focus:border-blue-500"
                />
              </div>

              {/* Supplier Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Supplier Name</label>
                <input
                  type="text"
                  placeholder="e.g. Makkah Electric"
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-normal outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* MAIN REGISTRY TABLE CONTAINER */}
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-xs overflow-hidden flex flex-col">
            {/* Toolbar Header & Exports */}
            <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Purchase Orders ({filteredPoList.length})
                </span>
              </div>

              {/* Export Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => alert("Exporting Excel file...")}
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
                <button
                  type="button"
                  onClick={() => alert("Downloading PDF document...")}
                  className="h-8 px-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileText className="size-3.5" /> PDF
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-slate-100/80 dark:bg-slate-800/80 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    <th className="p-3 text-center w-12 border-r border-border/60">SL</th>
                    <th className="p-3 border-r border-border/60">PO No</th>
                    <th className="p-3 text-center w-24 border-r border-border/60">PO Date</th>
                    <th className="p-3 border-r border-border/60">Delivery To</th>
                    <th className="p-3 border-r border-border/60">Bill To</th>
                    <th className="p-3 text-center w-24 border-r border-border/60">Type</th>
                    <th className="p-3 text-center w-16 border-r border-border/60">Currency</th>
                    <th className="p-3 border-r border-border/60">Prepared By</th>
                    <th className="p-3 text-right w-28 border-r border-border/60">Total Amount</th>
                    <th className="p-3 text-center w-24 border-r border-border/60">ItemType</th>
                    <th className="p-3 text-center w-28 border-r border-border/60">Status</th>
                    <th className="p-3 text-center w-28 border-r border-border/60">Req.No</th>
                    <th className="p-3 text-center w-28 border-r border-border/60">Payment Type</th>
                    <th className="p-3 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-white dark:bg-transparent font-normal">
                  {filteredPoList.map((po, index) => (
                    <tr key={po.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition">
                      <td className="p-3 text-center text-slate-500 border-r border-border/60">{index + 1}</td>

                      {/* PO No (Clickable to open document view) */}
                      <td className="p-3 border-r border-border/60 font-mono font-bold">
                        <button
                          type="button"
                          onClick={() => setViewingPo(po)}
                          className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 transition cursor-pointer text-left font-mono font-bold"
                        >
                          {po.poNo}
                        </button>
                      </td>

                      <td className="p-3 text-center text-slate-600 dark:text-slate-400 border-r border-border/60 font-medium whitespace-nowrap">
                        {po.poDate}
                      </td>

                      <td className="p-3 border-r border-border/60 font-medium text-slate-800 dark:text-slate-200 max-w-[220px] truncate" title={po.deliveryTo}>
                        {po.deliveryTo}
                      </td>

                      <td className="p-3 border-r border-border/60 font-semibold text-slate-900 dark:text-white max-w-[180px] truncate" title={po.supplier}>
                        {po.supplier}
                      </td>

                      <td className="p-3 text-center border-r border-border/60">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                          {po.poType || "Purchase Order"}
                        </span>
                      </td>

                      <td className="p-3 text-center font-bold font-mono text-slate-700 dark:text-slate-300 border-r border-border/60">
                        {po.currency || "BDT"}
                      </td>

                      <td className="p-3 border-r border-border/60 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                        {po.preparedBy}
                      </td>

                      <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white border-r border-border/60 whitespace-nowrap">
                        {po.currency === "USD" ? "$" : "৳"}
                        {po.grandTotal.toFixed(2)}
                      </td>

                      <td className="p-3 text-center border-r border-border/60">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                          {po.itemType || "Requisition"}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="p-3 text-center border-r border-border/60 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide inline-flex items-center gap-1 ${
                            po.status === "Approved"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : po.status === "Forwarded"
                              ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              : po.status === "Saved"
                              ? "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                              : po.status === "Review Pending"
                              ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {po.status}
                        </span>
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400 border-r border-border/60 max-w-[140px] truncate" title={po.reqNo}>
                        {po.reqNo}
                      </td>

                      <td className="p-3 text-center text-slate-600 dark:text-slate-400 font-semibold border-r border-border/60 whitespace-nowrap">
                        {po.paymentMode}
                      </td>

                      {/* Actions Column */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingPo(po)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition cursor-pointer"
                            title="View Document"
                          >
                            <Eye className="size-4" />
                          </button>
                          {po.status === "Draft" && (
                            <button
                              type="button"
                              onClick={() => handleOpenForwardModal(po)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition cursor-pointer"
                              title="Forward PO"
                            >
                              <Send className="size-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredPoList.length === 0 && (
                    <tr>
                      <td colSpan={14} className="p-8 text-center text-slate-400 font-medium">
                        No purchase order records match your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Table Footer */}
            <div className="p-4 border-t border-border bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
              <span>Showing 1 to {filteredPoList.length} of {filteredPoList.length} entries</span>
              <div className="flex items-center gap-1">
                <button disabled className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-400 cursor-not-allowed">Previous</button>
                <button className="px-3 py-1 bg-blue-600 text-white font-bold rounded-md">1</button>
                <button disabled className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-400 cursor-not-allowed">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* EXECUTIVE PURCHASE ORDER DOCUMENT VIEW MODAL */}
        {/* ========================================== */}
        {viewingPo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto relative border border-slate-200">
              
              {/* Modal Control Bar (Screen view only) */}
              <div className="sticky top-0 z-20 bg-slate-900 text-white p-4 flex justify-between items-center print:hidden rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-amber-400" />
                  <span className="font-bold text-sm font-mono">{viewingPo.poNo}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    {viewingPo.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintDocument}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="size-4" /> Print Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingPo(null)}
                    className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* PRINTABLE DOCUMENT CONTAINER */}
              <div className="p-8 space-y-6 relative font-sans text-slate-800 bg-white">
                
                {/* Watermark Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                  <span className="text-[120px] font-black tracking-widest text-slate-900 uppercase -rotate-12">
                    PAKIZA GROUP
                  </span>
                </div>

                {/* Company Header Bar */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div className="space-y-1">
                    <img src={pakizaSoftwareLogo} alt="Pakiza Group" className="h-12 w-auto object-contain mb-1" />
                    <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                      Pakiza Software Limited
                    </h2>
                    <p className="text-xs text-slate-600 font-medium">
                      House# 97, Road# 11/A, Dhanmondi, Dhaka-1209, Bangladesh.
                    </p>
                    <p className="text-[11px] text-slate-500">Phone: +880 2 9123456 | Email: info@pakizaknit.com</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="px-3 py-1 bg-slate-900 text-white text-xs font-black uppercase tracking-widest inline-block rounded">
                      {viewingPo.poType || "PURCHASE ORDER"}
                    </span>
                    <p className="text-sm font-mono font-bold text-slate-900 pt-1">{viewingPo.poNo}</p>
                    <p className="text-xs text-slate-600 font-semibold">Date: {viewingPo.poDate}</p>
                    <p className="text-xs text-slate-500 font-mono">Ref: {viewingPo.csRef || "REF-2026"}</p>
                  </div>
                </div>

                {/* Vendor & Delivery Information Grid */}
                <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <span className="font-black text-slate-900 uppercase tracking-wider block text-[10px] text-blue-700">
                      SUPPLIER / VENDOR DETAILS:
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{viewingPo.supplier}</p>
                    <p className="text-slate-600 leading-relaxed font-normal">{viewingPo.supplierContact || "Corporate Vendor Contact"}</p>
                    <p className="text-slate-500 font-mono text-[11px]">Payment Mode: {viewingPo.paymentMode}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-black text-slate-900 uppercase tracking-wider block text-[10px] text-blue-700">
                      DELIVERY DESTINATION &amp; SHIP TO:
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{viewingPo.deliveryTo}</p>
                    <p className="text-slate-600 leading-relaxed font-normal">{viewingPo.deliveryContact || "Store In-Charge"}</p>
                    <p className="text-slate-500 font-mono text-[11px]">Validity Date: {viewingPo.poValidDate || "30 Days"}</p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="border border-slate-900 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider border-b border-slate-900">
                        <th className="p-2.5 text-center w-10 border-r border-slate-700">SL</th>
                        <th className="p-2.5 border-r border-slate-700">ITEM DESCRIPTION &amp; SPECIFICATIONS</th>
                        <th className="p-2.5 text-center w-16 border-r border-slate-700">UOM</th>
                        <th className="p-2.5 text-center w-20 border-r border-slate-700">QTY</th>
                        <th className="p-2.5 text-right w-24 border-r border-slate-700">UNIT PRICE</th>
                        <th className="p-2.5 text-right w-28">LINE TOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {viewingPo.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 text-center text-slate-500 border-r border-slate-200 font-mono">{idx + 1}</td>
                          <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900">{item.description}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 text-slate-600 font-semibold">{item.uom}</td>
                          <td className="p-2.5 text-center border-r border-slate-200 font-mono font-bold">{item.qty}</td>
                          <td className="p-2.5 text-right border-r border-slate-200 font-mono">{item.unitPrice.toFixed(2)}</td>
                          <td className="p-2.5 text-right font-mono font-black text-slate-900">
                            {viewingPo.currency === "USD" ? "$" : "৳"}{item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary Breakdown */}
                <div className="flex justify-end pt-2">
                  <div className="w-72 space-y-1.5 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between text-slate-600">
                      <span>Gross Amount:</span>
                      <span className="font-bold">{viewingPo.currency === "USD" ? "$" : "৳"}{viewingPo.grossAmount.toFixed(2)}</span>
                    </div>
                    {viewingPo.discount > 0 && (
                      <div className="flex justify-between text-rose-600">
                        <span>Discount Deducted:</span>
                        <span>-{viewingPo.currency === "USD" ? "$" : "৳"}{viewingPo.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-slate-900 border-t border-slate-300 pt-1">
                      <span>Net Total Payable:</span>
                      <span className="text-sm font-black">{viewingPo.currency === "USD" ? "$" : "৳"}{viewingPo.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions Block */}
                {viewingPo.selectedTerms && viewingPo.selectedTerms.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                    <span className="font-black text-slate-900 uppercase tracking-wider block text-[10px]">
                      TERMS &amp; CONDITIONS:
                    </span>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-700 font-normal leading-relaxed">
                      {viewingPo.selectedTerms.map((term, i) => (
                        <li key={i}>{term}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Signatures Block */}
                <div className="pt-12 grid grid-cols-3 gap-6 text-center text-xs font-bold text-slate-700">
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-black text-slate-900">{viewingPo.preparedBy}</p>
                    <p className="text-[10px] text-slate-500 font-normal">{viewingPo.preparedDesignation || "Prepared By"}</p>
                  </div>
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-black text-slate-900">Engr. Monirul Islam</p>
                    <p className="text-[10px] text-slate-500 font-normal">Verified &amp; Checked By</p>
                  </div>
                  <div className="space-y-1 border-t border-slate-400 pt-2">
                    <p className="font-black text-slate-900">Managing Director</p>
                    <p className="text-[10px] text-slate-500 font-normal">Authorized Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* FORWARD PURCHASE ORDER MODAL */}
        {/* ========================================== */}
        {forwardingPo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="p-5 border-b border-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Send className="size-5 text-emerald-600" /> Forward Purchase Order
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Review and confirm Terms &amp; Conditions before forwarding PO <strong className="text-foreground">{forwardingPo.poNo}</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForwardingPo(null)}
                  className="size-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto flex-1 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search terms & conditions..."
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-amber-500"
                  />
                </div>

                {/* Terms Checklist */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {activeForwardTerms
                    .filter((t) => !modalSearchTerm || t.toLowerCase().includes(modalSearchTerm.toLowerCase()))
                    .map((term, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (activeForwardTerms.includes(term)) {
                            setActiveForwardTerms(activeForwardTerms.filter((t) => t !== term));
                          } else {
                            setActiveForwardTerms([...activeForwardTerms, term]);
                          }
                        }}
                        className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-amber-500 transition cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={activeForwardTerms.includes(term)}
                          onChange={() => {}}
                          className="mt-0.5 size-4 accent-amber-500 rounded cursor-pointer shrink-0"
                        />
                        <span className="text-slate-800 dark:text-slate-200 leading-relaxed font-normal flex-1">
                          <strong className="mr-1.5">{idx + 1}.</strong> {term}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Add Custom Clause */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add custom clause for this Purchase Order..."
                    value={customTermInput}
                    onChange={(e) => setCustomTermInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (customTermInput.trim()) {
                          setActiveForwardTerms([...activeForwardTerms, customTermInput.trim()]);
                          setCustomTermInput("");
                        }
                      }
                    }}
                    className="flex-1 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customTermInput.trim()) {
                        setActiveForwardTerms([...activeForwardTerms, customTermInput.trim()]);
                        setCustomTermInput("");
                      }
                    }}
                    className="h-9 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                  >
                    <Plus className="size-4" /> Add Clause
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <strong className="text-amber-500 font-bold">{activeForwardTerms.length}</strong> Clause(s) Selected
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setForwardingPo(null)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleProcessForward}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Send className="size-4" /> Confirm &amp; Forward PO
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
