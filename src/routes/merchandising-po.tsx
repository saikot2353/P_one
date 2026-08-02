import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Briefcase,
  Plus,
  Search,
  Pencil,
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  ArrowLeft,
  Save,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-po")({
  head: () => ({
    meta: [
      { title: "PO Management — RMG Merchandising" },
    ],
  }),
  component: MerchandisingPOPage,
});

type POStatus = "Active" | "Pending" | "Completed" | "Cancelled";
type ProductType = "Knit" | "Woven" | "Sweater";

interface ApprovedQuotation {
  quotationNo: string;
  inquiryNo: string;
  buyerName: string;
  styleRef: string;
  productType: ProductType;
  quantity: number;
  quotedFOB: number;
  shipDate: string;
  itemDescription: string;
  buyingHouse?: string;
  department?: string;
  season?: string;
}

const MOCK_APPROVED_QUOTATIONS: ApprovedQuotation[] = [
  {
    quotationNo: "QT-2026-001", inquiryNo: "INQ-2026-001", buyerName: "H&M Group (SE)",
    styleRef: "HM-SS26-KNT-001", productType: "Knit", quantity: 50000,
    quotedFOB: 3.82, shipDate: "2026-10-15", itemDescription: "Men's Basic Round Neck T-Shirt",
    buyingHouse: "Li & Fung", department: "Boys", season: "ANS-SS27"
  },
  {
    quotationNo: "QT-2026-002", inquiryNo: "INQ-2026-002", buyerName: "ZARA (Inditex)",
    styleRef: "ZR-AW26-WVN-045", productType: "Woven", quantity: 25000,
    quotedFOB: 7.42, shipDate: "2026-11-30", itemDescription: "Ladies Casual Shirt",
    buyingHouse: "Synergy", department: "Women", season: "FW27"
  },
  {
    quotationNo: "QT-2026-003", inquiryNo: "INQ-2026-003", buyerName: "Primark Ltd (UK)",
    styleRef: "PRI-WIN26-SWT-011", productType: "Sweater", quantity: 18000,
    quotedFOB: 11.78, shipDate: "2026-12-01", itemDescription: "Men's V-Neck Pullover Sweater",
    buyingHouse: "ITPS", department: "Men", season: "FW27"
  },
];

interface PurchaseOrder {
  id: string;
  poNumber: string;
  quotationNo: string;
  buyerName: string;
  styleRef: string;
  productType: ProductType;
  quantity: number;
  unitFOB: number;
  totalValue: number;
  receiveDate: string;
  shipDate: string;
  shipmentMode: "Sea" | "Air" | "Road";
  paymentTerms: string;
  portOfLoading: string;
  portOfDischarge: string;
  status: POStatus;
  itemDescription: string;
  buyingHouse?: string;
  department?: string;
  season?: string;
  // L/C Details
  lcNumber?: string;
  lcValue?: number;
  lcAdvisingBank?: string;
  lcIssueDate?: string;
  // Nominations
  nominatedYarnSupplier?: string;
  nominatedFabricSupplier?: string;
  nominatedTrimsSupplier?: string;
}

const SAMPLE_POS: PurchaseOrder[] = [
  {
    id: "po-001", poNumber: "PO-HM-9801", quotationNo: "QT-2026-001",
    buyerName: "H&M Group (SE)", styleRef: "HM-SS26-KNT-001", productType: "Knit",
    quantity: 50000, unitFOB: 3.82, totalValue: 191000, receiveDate: "2026-08-01",
    shipDate: "2026-10-15", shipmentMode: "Sea", paymentTerms: "90 Days BBLC",
    portOfLoading: "Chittagong Port, BD", portOfDischarge: "Gothenburg, SE", status: "Active",
    itemDescription: "Men's Basic Round Neck T-Shirt",
    buyingHouse: "Li & Fung", department: "Boys", season: "ANS-SS27",
    lcNumber: "LC-HM-2026-4412", lcValue: 191000, lcAdvisingBank: "Standard Chartered BD",
    lcIssueDate: "2026-08-01", nominatedYarnSupplier: "Simco Spinning Ltd",
    nominatedFabricSupplier: "Pakiza Knit Composite", nominatedTrimsSupplier: "Coats Bangladesh"
  },
];

function StatusBadge({ status }: { status: POStatus }) {
  const cfg: Record<POStatus, { cls: string; icon: React.ReactNode }> = {
    "Active": { cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-450 dark:border-emerald-805", icon: <CheckCircle className="size-3" /> },
    "Pending": { cls: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700", icon: <Clock className="size-3" /> },
    "Completed": { cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800", icon: <CheckCircle className="size-3" /> },
    "Cancelled": { cls: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800", icon: <XCircle className="size-3" /> },
  };
  const { cls, icon } = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cls}`}>
      {icon} {status}
    </span>
  );
}

function MerchandisingPOPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "prepare">("list");

  const [poList, setPoList] = useState<PurchaseOrder[]>(SAMPLE_POS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<POStatus | "All">("All");

  const [editItem, setEditItem] = useState<PurchaseOrder | null>(null);
  const [selectedQuoteNo, setSelectedQuoteNo] = useState("");

  const defaultForm: Partial<PurchaseOrder> = {
    poNumber: "", quotationNo: "", buyerName: "", styleRef: "",
    productType: "Knit", quantity: 0, unitFOB: 0, totalValue: 0,
    receiveDate: "2026-08-02", shipDate: "", shipmentMode: "Sea",
    paymentTerms: "90 Days BBLC", portOfLoading: "Chittagong Port, BD",
    portOfDischarge: "", status: "Pending", itemDescription: "",
    buyingHouse: "Li & Fung", department: "Boys", season: "ANS-SS27",
    lcNumber: "", lcValue: 0, lcAdvisingBank: "", lcIssueDate: "",
    nominatedYarnSupplier: "", nominatedFabricSupplier: "", nominatedTrimsSupplier: ""
  };

  const [form, setForm] = useState<Partial<PurchaseOrder>>(defaultForm);

  const handleQuoteChange = (quoteNo: string) => {
    setSelectedQuoteNo(quoteNo);
    const qt = MOCK_APPROVED_QUOTATIONS.find(q => q.quotationNo === quoteNo);
    if (qt) {
      setForm(p => ({
        ...p,
        quotationNo: qt.quotationNo,
        buyerName: qt.buyerName,
        styleRef: qt.styleRef,
        productType: qt.productType,
        quantity: qt.quantity,
        unitFOB: qt.quotedFOB,
        shipDate: qt.shipDate,
        itemDescription: qt.itemDescription,
        totalValue: qt.quantity * qt.quotedFOB,
        buyingHouse: qt.buyingHouse,
        department: qt.department,
        season: qt.season,
      }));
    }
  };

  const computedTotalValue = useMemo(() => {
    return (form.quantity || 0) * (form.unitFOB || 0);
  }, [form.quantity, form.unitFOB]);

  const filtered = poList.filter(p => {
    const s = searchQuery.toLowerCase();
    const matchSearch = p.poNumber.toLowerCase().includes(s) || p.buyerName.toLowerCase().includes(s) || p.styleRef.toLowerCase().includes(s);
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSave = () => {
    if (!form.poNumber?.trim()) {
      toast.error("Purchase Order Number is required.");
      return;
    }
    if (!form.quotationNo) {
      toast.error("Please link an approved Price Quotation.");
      return;
    }
    
    const finalVal = computedTotalValue;
    if (editItem) {
      setPoList(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form, totalValue: finalVal } as PurchaseOrder : p));
      toast.success("Purchase Order specs updated!");
    } else {
      const newPO: PurchaseOrder = {
        ...defaultForm, ...form,
        id: `po-${Date.now()}`,
        totalValue: finalVal,
      } as PurchaseOrder;
      setPoList(prev => [newPO, ...prev]);
      toast.success(`Purchase Order ${newPO.poNumber} registered successfully!`);
    }
    setViewMode("list");
  };

  const InputField = ({ label, value, onChange, required = false, type = "text", placeholder = "" }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-bold text-slate-655 dark:text-slate-400 tracking-tight">
        {label} {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-lg hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 shadow-2xs"
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options, required = false }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-bold text-slate-655 dark:text-slate-400 tracking-tight">
        {label} {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-lg hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.75rem_center] shadow-2xs cursor-pointer"
      >
        {options.map((opt: any) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <MerchandisingLayout
      activePath="po-management"
      breadcrumbs={[{ label: "PO Register" }, { label: "Contract sheets" }]}
      title={viewMode === "list" ? "PO Management Register" : "Setup Purchase Order Contract"}
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">

        {/* ── VIEW: LIST REGISTER MODE ── */}
        {viewMode === "list" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-2xs">
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span className="p-1.5 bg-teal-500/10 text-teal-555 rounded-lg"><Briefcase className="size-5" /></span>
                  PO Management Register
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Setup confirmed Purchase Orders, assign Nominated Suppliers, and manage Master export L/C contracts.
                </p>
              </div>
              
              <button
                onClick={() => {
                  setForm(defaultForm);
                  setEditItem(null);
                  setSelectedQuoteNo("");
                  setViewMode("prepare");
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-650 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-teal-500/10 font-bold text-xs transition-all active:scale-97 cursor-pointer"
              >
                <Plus className="size-4" /> Register New PO
              </button>
            </div>

            {/* List Controls */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xs">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  className="pl-9 pr-3 py-2 w-full text-xs border border-slate-200 dark:border-slate-850 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                  placeholder="Search PO Number, Buyer, Style..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="text-xs border border-slate-205 dark:border-slate-850 rounded-lg bg-white dark:bg-slate-900 px-3 py-2 focus:outline-none cursor-pointer"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
              >
                <option value="All">All Statuses</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            {/* Register Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-805 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                      <th className="px-5 py-4 w-10 text-center">#</th>
                      <th className="px-5 py-4">PO Number</th>
                      <th className="px-5 py-4">Quote Ref</th>
                      <th className="px-5 py-4">Buyer Name</th>
                      <th className="px-5 py-4">Style Ref</th>
                      <th className="px-5 py-4 text-right">Order Qty</th>
                      <th className="px-5 py-4 text-right">Unit FOB ($)</th>
                      <th className="px-5 py-4 text-right">Total Value ($)</th>
                      <th className="px-5 py-4">Ship Date</th>
                      <th className="px-5 py-4">L/C Ref No</th>
                      <th className="px-5 py-4 text-center">Status</th>
                      <th className="px-5 py-4 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-300">
                    {filtered.map((po, idx) => (
                      <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3.5 text-center text-slate-400 font-bold">{idx + 1}</td>
                        <td className="px-5 py-3.5 font-bold text-teal-650 dark:text-teal-400">{po.poNumber}</td>
                        <td className="px-5 py-3.5 font-semibold text-slate-400">{po.quotationNo}</td>
                        <td className="px-5 py-3.5 font-bold text-slate-805 dark:text-slate-200">{po.buyerName}</td>
                        <td className="px-5 py-3.5 font-mono">{po.styleRef}</td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold">{po.quantity.toLocaleString()} pcs</td>
                        <td className="px-5 py-3.5 text-right font-mono">$ {po.unitFOB.toFixed(2)}</td>
                        <td className="px-5 py-3.5 text-right font-mono font-black text-teal-605">$ {po.totalValue.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-slate-500 font-semibold">{po.shipDate}</td>
                        <td className="px-5 py-3.5 text-slate-500 font-mono">{po.lcNumber || "No L/C linked"}</td>
                        <td className="px-5 py-3.5 text-center"><StatusBadge status={po.status} /></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setForm({ ...po });
                                setEditItem(po);
                                setSelectedQuoteNo(po.quotationNo);
                                setViewMode("prepare");
                              }}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600 transition cursor-pointer"
                              title="Edit PO specifications"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setPoList(prev => prev.filter(p => p.id !== po.id));
                                toast.success("PO Entry deleted.");
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition cursor-pointer"
                              title="Delete PO"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={12} className="px-5 py-16 text-center text-slate-450 font-medium">
                          No registered purchase orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ── VIEW: PREPARE WORKSPACE MODE ── */}
        {viewMode === "prepare" && (
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            
            {/* Toolbar */}
            <div className="h-14 border-b border-slate-200 bg-white dark:bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-20 shadow-2xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode("list")}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-655 transition-colors cursor-pointer"
                  title="Back to Register"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-extrabold text-slate-805 dark:text-white">
                    {editItem ? `Edit Contract specs — PO: ${form.poNumber}` : "Setup Purchase Order Contract"}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-black uppercase">PO Status:</span>
                <select
                  value={form.status || "Pending"}
                  onChange={e => setForm(p => ({ ...p, status: e.target.value as POStatus }))}
                  className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 cursor-pointer font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option>Pending</option>
                  <option>Active</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            {/* Main Form container */}
            <div className="p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Left Column: Form Details (3 cols) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Link Approved Quotation */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-805 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <h2 className="text-base font-bold text-slate-850 dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-teal-500 rounded-full inline-block"></span>
                      Link Approved Quotation Sheet
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-tight uppercase">
                          Select Approved Quote *
                        </label>
                        <select
                          value={selectedQuoteNo}
                          onChange={e => handleQuoteChange(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.75rem_center] shadow-2xs cursor-pointer"
                        >
                          <option value="">-- Choose approved quote --</option>
                          {MOCK_APPROVED_QUOTATIONS.map(q => (
                            <option key={q.quotationNo} value={q.quotationNo}>{q.quotationNo} ({q.buyerName} — {q.styleRef})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase font-bold">Buyer</span>
                          <span className="font-bold text-slate-700">{form.buyerName || "—"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase font-bold">Style Code</span>
                          <span className="font-mono font-bold text-slate-700">{form.styleRef || "—"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase font-bold">Offer FOB Rate</span>
                          <span className="font-bold text-slate-700">{form.unitFOB ? `$ ${form.unitFOB.toFixed(2)}` : "—"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase font-bold">Total quantity</span>
                          <span className="font-bold text-slate-700">{form.quantity ? `${form.quantity.toLocaleString()} Pcs` : "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 1: Basic PO specifications */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-805 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <h2 className="text-base font-bold text-slate-805 dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-teal-500 rounded-full inline-block"></span>
                      PO Contract specifications
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InputField label="Buyer PO Number *" required value={form.poNumber} onChange={(e: any) => setForm({ ...form, poNumber: e.target.value })} placeholder="e.g. PO-HM-9801" />
                      <InputField label="PO Quantity (Pcs) *" required type="number" value={form.quantity} onChange={(e: any) => setForm({ ...form, quantity: Number(e.target.value) })} />
                      <InputField label="Unit FOB Price ($) *" required type="number" step="0.01" value={form.unitFOB} onChange={(e: any) => setForm({ ...form, unitFOB: Number(e.target.value) })} />
                      
                      <InputField label="PO Receive Date" type="date" value={form.receiveDate} onChange={(e: any) => setForm({ ...form, receiveDate: e.target.value })} />
                      <InputField label="Confirmed Ship Date" type="date" value={form.shipDate} onChange={(e: any) => setForm({ ...form, shipDate: e.target.value })} />
                      <SelectField label="Shipment Mode" value={form.shipmentMode} onChange={(e: any) => setForm({ ...form, shipmentMode: e.target.value })} options={["Sea", "Air", "Road"]} />
                      
                      <InputField label="Payment Term details" value={form.paymentTerms} onChange={(e: any) => setForm({ ...form, paymentTerms: e.target.value })} placeholder="e.g. 90 Days BBLC" />
                      <InputField label="Port of Loading" value={form.portOfLoading} onChange={(e: any) => setForm({ ...form, portOfLoading: e.target.value })} />
                      <InputField label="Port of Discharge" value={form.portOfDischarge} onChange={(e: any) => setForm({ ...form, portOfDischarge: e.target.value })} placeholder="e.g. Gothenburg, SE" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Master L/C Details */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-805 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <h2 className="text-base font-bold text-slate-805 dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-purple-500 rounded-full inline-block"></span>
                      Export L/C (Letter of Credit) details
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <InputField label="L/C Contract Number" value={form.lcNumber} onChange={(e: any) => setForm({ ...form, lcNumber: e.target.value })} placeholder="e.g. LC-HM-2026-4412" />
                      <InputField label="L/C Advising Bank" value={form.lcAdvisingBank} onChange={(e: any) => setForm({ ...form, lcAdvisingBank: e.target.value })} placeholder="e.g. Standard Chartered Bank" />
                      <InputField label="L/C Value ($)" type="number" value={form.lcValue || computedTotalValue} onChange={(e: any) => setForm({ ...form, lcValue: Number(e.target.value) })} />
                      <InputField label="L/C Issue Date" type="date" value={form.lcIssueDate} onChange={(e: any) => setForm({ ...form, lcIssueDate: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Section 3: Nominated Suppliers */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-805 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <h2 className="text-base font-bold text-slate-805 dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-orange-500 rounded-full inline-block"></span>
                      Nominated raw materials suppliers
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <InputField label="Nominated Yarn Spinner" value={form.nominatedYarnSupplier} onChange={(e: any) => setForm({ ...form, nominatedYarnSupplier: e.target.value })} placeholder="e.g. Simco Spinning Ltd" />
                      <InputField label="Nominated Fabric Weaver/Knitter" value={form.nominatedFabricSupplier} onChange={(e: any) => setForm({ ...form, nominatedFabricSupplier: e.target.value })} placeholder="e.g. Pakiza Knit Composite" />
                      <InputField label="Nominated Trims & Thread Supplier" value={form.nominatedTrimsSupplier} onChange={(e: any) => setForm({ ...form, nominatedTrimsSupplier: e.target.value })} placeholder="e.g. Coats Thread Bangladesh" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live quotation Analytics (1 col) */}
              <div className="space-y-6">
                
                {/* Cost Analytics card */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-805 space-y-4 shadow-sm text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total contract value</span>
                  
                  <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-4 rounded-xl text-white">
                    <span className="text-[10px] font-bold opacity-80 block uppercase">FOB total Value</span>
                    <span className="text-2xl font-black block mt-1">$ {computedTotalValue.toLocaleString()}</span>
                    <span className="text-[9px] opacity-60 block mt-1">exchange rate: 1 USD = 120 BDT</span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-left">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-505">Linked Quote No:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-350">{form.quotationNo || "None"}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-550">Garment Category:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-350">{form.productType || "Knit"} Division</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Footer Bar */}
            <div className="fixed bottom-0 left-0 right-0 h-16 border-t border-slate-200/80 bg-white shadow-lg flex items-center justify-end px-6 gap-2.5 z-25">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-105 hover:bg-slate-205 text-slate-600 transition cursor-pointer"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white transition active:scale-97 cursor-pointer flex items-center gap-1.5 shadow-sm shadow-teal-500/10"
              >
                <Save className="size-4" /> Save Purchase Order
              </button>
            </div>

          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}
