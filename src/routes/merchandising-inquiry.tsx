import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Calculator,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Send,
  Eye,
  BarChart2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-inquiry")({
  component: MerchandisingInquiryPage,
});

type InquiryStatus = "Draft" | "Sent to Buyer" | "Buyer Approved" | "Converted to PO" | "Rejected";
type ProductType = "Knit" | "Woven" | "Sweater";
type PaymentTerms = "At Sight LC" | "90 Days BBLC" | "120 Days BBLC" | "TT Advance";
type AQLStandard = "1.5" | "2.5" | "4.0";

interface Inquiry {
  id: string;
  inquiryNo: string;
  buyerName: string;
  styleRef: string;
  productType: ProductType;
  itemDescription: string;
  quantity: number;
  targetFOB: number;
  shipDate: string;
  paymentTerms: PaymentTerms;
  aqlStandard: AQLStandard;
  status: InquiryStatus;
  submittedDate: string;
  fabricType: string;
  gsm: number;
  yarnComposition: string;
  fabricConsumptionKgDz: number;
  fabricCostPerKg: number;
  trimsCostPerDz: number;
  cmtPerDz: number;
  commercialOHPct: number;
  bankChargePct: number;
  targetMarginPct: number;
  quotedFOB: number;
}

const SAMPLE_INQUIRIES: Inquiry[] = [
  {
    id: "inq-001", inquiryNo: "INQ-2026-001", buyerName: "H&M Group (SE)",
    styleRef: "HM-SS26-KNT-001", productType: "Knit",
    itemDescription: "Men's Basic Round Neck T-Shirt, 100% Cotton Single Jersey",
    quantity: 50000, targetFOB: 3.85, shipDate: "2026-10-15",
    paymentTerms: "90 Days BBLC", aqlStandard: "2.5", status: "Converted to PO",
    submittedDate: "2026-07-10", fabricType: "Single Jersey", gsm: 180,
    yarnComposition: "100% Combed Cotton", fabricConsumptionKgDz: 2.45,
    fabricCostPerKg: 3.20, trimsCostPerDz: 0.85, cmtPerDz: 4.20,
    commercialOHPct: 4, bankChargePct: 2, targetMarginPct: 12, quotedFOB: 3.82,
  },
  {
    id: "inq-002", inquiryNo: "INQ-2026-002", buyerName: "ZARA (Inditex)",
    styleRef: "ZR-AW26-WVN-045", productType: "Woven",
    itemDescription: "Ladies Casual Shirt, 60% Cotton 40% Polyester Poplin",
    quantity: 25000, targetFOB: 7.50, shipDate: "2026-11-30",
    paymentTerms: "At Sight LC", aqlStandard: "1.5", status: "Sent to Buyer",
    submittedDate: "2026-07-18", fabricType: "Poplin", gsm: 110,
    yarnComposition: "60% Cotton 40% Polyester", fabricConsumptionKgDz: 1.80,
    fabricCostPerKg: 4.50, trimsCostPerDz: 1.20, cmtPerDz: 8.50,
    commercialOHPct: 4, bankChargePct: 1.5, targetMarginPct: 12, quotedFOB: 7.42,
  },
  {
    id: "inq-003", inquiryNo: "INQ-2026-003", buyerName: "Primark Ltd (UK)",
    styleRef: "PRI-WIN26-SWT-011", productType: "Sweater",
    itemDescription: "Men's V-Neck Pullover Sweater, 100% Acrylic, 12 Gauge",
    quantity: 18000, targetFOB: 12.00, shipDate: "2026-12-01",
    paymentTerms: "120 Days BBLC", aqlStandard: "4.0", status: "Buyer Approved",
    submittedDate: "2026-07-20", fabricType: "Knitted Sweater Panel", gsm: 0,
    yarnComposition: "100% Acrylic", fabricConsumptionKgDz: 4.80,
    fabricCostPerKg: 2.80, trimsCostPerDz: 1.80, cmtPerDz: 14.00,
    commercialOHPct: 4, bankChargePct: 2.5, targetMarginPct: 10, quotedFOB: 11.78,
  },
  {
    id: "inq-004", inquiryNo: "INQ-2026-004", buyerName: "Marks & Spencer (UK)",
    styleRef: "MS-SS26-KNT-022", productType: "Knit",
    itemDescription: "Ladies Polo Shirt, 100% Pique Cotton",
    quantity: 30000, targetFOB: 5.20, shipDate: "2026-09-30",
    paymentTerms: "At Sight LC", aqlStandard: "2.5", status: "Draft",
    submittedDate: "", fabricType: "Pique", gsm: 220,
    yarnComposition: "100% Cotton", fabricConsumptionKgDz: 2.80,
    fabricCostPerKg: 3.60, trimsCostPerDz: 1.10, cmtPerDz: 5.80,
    commercialOHPct: 4, bankChargePct: 2, targetMarginPct: 12, quotedFOB: 5.14,
  },
];

function calcFOB(inq: Partial<Inquiry>): number {
  const fabricCostDz = (inq.fabricConsumptionKgDz || 0) * (inq.fabricCostPerKg || 0);
  const totalDirect = fabricCostDz + (inq.trimsCostPerDz || 0) + (inq.cmtPerDz || 0);
  const withOH = totalDirect * (1 + (inq.commercialOHPct || 0) / 100);
  const withBank = withOH * (1 + (inq.bankChargePct || 0) / 100);
  const fobPerDz = withBank / (1 - (inq.targetMarginPct || 0) / 100);
  return Math.round((fobPerDz / 12) * 100) / 100;
}

function StatusBadge({ status }: { status: InquiryStatus }) {
  const cfg: Record<InquiryStatus, { cls: string; icon: React.ReactNode }> = {
    "Draft": { cls: "bg-slate-100 text-slate-600 border-slate-300", icon: <Clock className="size-3" /> },
    "Sent to Buyer": { cls: "bg-blue-50 text-blue-600 border-blue-200", icon: <Send className="size-3" /> },
    "Buyer Approved": { cls: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: <CheckCircle className="size-3" /> },
    "Converted to PO": { cls: "bg-teal-50 text-teal-600 border-teal-200", icon: <ChevronRight className="size-3" /> },
    "Rejected": { cls: "bg-red-50 text-red-600 border-red-200", icon: <XCircle className="size-3" /> },
  };
  const { cls, icon } = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${cls}`}>
      {icon} {status}
    </span>
  );
}

function MerchandisingInquiryPage() {
  const [activeTab, setActiveTab] = useState<"register" | "costing" | "status">("register");
  const [inquiries, setInquiries] = useState<Inquiry[]>(SAMPLE_INQUIRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | "All">("All");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Inquiry | null>(null);
  const [showCostingModal, setShowCostingModal] = useState(false);
  const [costingItem, setCostingItem] = useState<Inquiry | null>(null);

  const defaultForm: Partial<Inquiry> = {
    buyerName: "", styleRef: "", productType: "Knit", itemDescription: "",
    quantity: 0, targetFOB: 0, shipDate: "", paymentTerms: "90 Days BBLC",
    aqlStandard: "2.5", status: "Draft", fabricType: "Single Jersey",
    gsm: 180, yarnComposition: "100% Combed Cotton",
    fabricConsumptionKgDz: 2.4, fabricCostPerKg: 3.20, trimsCostPerDz: 0.85,
    cmtPerDz: 4.50, commercialOHPct: 4, bankChargePct: 2, targetMarginPct: 12,
  };
  const [form, setForm] = useState<Partial<Inquiry>>(defaultForm);

  const filtered = inquiries.filter(q => {
    const s = searchQuery.toLowerCase();
    const matchSearch = q.inquiryNo.toLowerCase().includes(s) || q.buyerName.toLowerCase().includes(s) || q.styleRef.toLowerCase().includes(s);
    const matchStatus = filterStatus === "All" || q.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSave = () => {
    if (!form.buyerName?.trim() || !form.styleRef?.trim()) {
      toast.error("Buyer Name and Style Ref are required");
      return;
    }
    const fob = calcFOB(form);
    if (editItem) {
      setInquiries(prev => prev.map(q => q.id === editItem.id ? { ...q, ...form, quotedFOB: fob } as Inquiry : q));
      toast.success("Inquiry updated!");
    } else {
      const newInq: Inquiry = {
        ...defaultForm, ...form,
        id: `inq-${Date.now()}`,
        inquiryNo: `INQ-2026-${String(inquiries.length + 1).padStart(3, "0")}`,
        submittedDate: form.status === "Draft" ? "" : new Date().toISOString().split("T")[0],
        quotedFOB: fob,
      } as Inquiry;
      setInquiries(prev => [newInq, ...prev]);
      toast.success(`Inquiry ${newInq.inquiryNo} created!`);
    }
    setShowModal(false);
  };

  const liveCalcFOB = calcFOB(form);

  const statusCounts = {
    total: inquiries.length,
    draft: inquiries.filter(q => q.status === "Draft").length,
    sent: inquiries.filter(q => q.status === "Sent to Buyer").length,
    approved: inquiries.filter(q => q.status === "Buyer Approved").length,
    converted: inquiries.filter(q => q.status === "Converted to PO").length,
    rejected: inquiries.filter(q => q.status === "Rejected").length,
  };

  return (
    <MerchandisingLayout
      activePath="inquiry"
      breadcrumbs={[{ label: "Orders & Costing" }, { label: "Buyer Inquiry & Quotation" }]}
      title="Buyer Inquiry & Pre-Costing Quotation"
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-5">

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg"><FileText className="size-5" /></span>
              Buyer Inquiry &amp; Pre-Costing Quotation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Step 1 of the order lifecycle: Log inquiry → pre-cost FOB → send quotation → convert to PO
            </p>
          </div>
          <button
            onClick={() => { setForm(defaultForm); setEditItem(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition cursor-pointer whitespace-nowrap"
          >
            <Plus className="size-3.5" /> New Inquiry
          </button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
          {[
            { label: "Total", val: statusCounts.total, cls: "text-slate-700 dark:text-slate-200" },
            { label: "Draft", val: statusCounts.draft, cls: "text-slate-500" },
            { label: "Sent to Buyer", val: statusCounts.sent, cls: "text-blue-600" },
            { label: "Approved", val: statusCounts.approved, cls: "text-emerald-600" },
            { label: "→ PO", val: statusCounts.converted, cls: "text-teal-600" },
            { label: "Rejected", val: statusCounts.rejected, cls: "text-red-500" },
          ].map(c => (
            <div key={c.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center">
              <div className={`text-2xl font-black ${c.cls}`}>{c.val}</div>
              <div className="text-[9px] font-bold text-slate-400 mt-0.5">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: "register", label: "Inquiry Register", icon: FileText },
            { id: "costing", label: "Pre-Costing Engine", icon: Calculator },
            { id: "status", label: "Quotation Status Board", icon: BarChart2 },
          ].map(t => {
            const Icon = t.icon;
            const sel = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${sel ? "bg-indigo-500 text-white shadow-md" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                <Icon className="size-3.5" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* ── TAB: REGISTER ── */}
        {activeTab === "register" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input className="pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="Search inquiry / buyer / style..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <select className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 px-3 py-2 focus:outline-none cursor-pointer" value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
                <option value="All">All Status</option>
                <option>Draft</option><option>Sent to Buyer</option><option>Buyer Approved</option><option>Converted to PO</option><option>Rejected</option>
              </select>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
              <table className="w-full text-xs min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                    {["Inquiry No.", "Buyer", "Style Ref", "Type", "Qty (pcs)", "Target FOB", "Quoted FOB", "Ship Date", "Status", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wide text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inq, i) => {
                    const diff = inq.quotedFOB - inq.targetFOB;
                    return (
                      <tr key={inq.id} className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition ${i % 2 !== 0 ? "bg-slate-50/40 dark:bg-slate-900" : ""}`}>
                        <td className="px-4 py-3 font-extrabold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{inq.inquiryNo}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{inq.buyerName}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono whitespace-nowrap">{inq.styleRef}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${inq.productType === "Knit" ? "bg-teal-50 text-teal-700 border-teal-200" : inq.productType === "Woven" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{inq.productType}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{inq.quantity.toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-slate-600 dark:text-slate-400">$ {inq.targetFOB.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`font-extrabold ${diff <= 0 ? "text-emerald-600" : "text-amber-600"}`}>$ {inq.quotedFOB.toFixed(2)}</span>
                          <span className={`ml-1 text-[9px] ${diff <= 0 ? "text-emerald-500" : "text-amber-500"}`}>({diff <= 0 ? "▼" : "▲"}{Math.abs(diff).toFixed(2)})</span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{inq.shipDate || "—"}</td>
                        <td className="px-4 py-3"><StatusBadge status={inq.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => { setCostingItem(inq); setShowCostingModal(true); }} className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition cursor-pointer" title="View Cost Sheet"><Eye className="size-3" /></button>
                            <button onClick={() => { setForm({ ...inq }); setEditItem(inq); setShowModal(true); }} className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition cursor-pointer" title="Edit"><Pencil className="size-3" /></button>
                            {inq.status === "Buyer Approved" && (
                              <button onClick={() => { setInquiries(prev => prev.map(q => q.id === inq.id ? { ...q, status: "Converted to PO" } : q)); toast.success("Converted to PO! Proceed to PO Register."); }} className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-600 transition cursor-pointer" title="Convert to PO"><ChevronRight className="size-3" /></button>
                            )}
                            <button onClick={() => { setInquiries(prev => prev.filter(q => q.id !== inq.id)); toast.success("Removed"); }} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition cursor-pointer" title="Delete"><Trash2 className="size-3" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={10} className="px-4 py-12 text-center text-xs text-slate-400">No inquiries found. Click "New Inquiry" to begin.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: COSTING ENGINE ── */}
        {activeTab === "costing" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2"><Calculator className="size-4 text-indigo-500" /> Quick FOB Calculator</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Fabric Consumption (Kg/Dz)", key: "fabricConsumptionKgDz" },
                  { label: "Fabric Cost per Kg ($)", key: "fabricCostPerKg" },
                  { label: "Trims & Acc. per Dz ($)", key: "trimsCostPerDz" },
                  { label: "CM (Cut-Make) per Dz ($)", key: "cmtPerDz" },
                  { label: "Commercial Overhead (%)", key: "commercialOHPct" },
                  { label: "Bank Charge (%)", key: "bankChargePct" },
                  { label: "Target Profit Margin (%)", key: "targetMarginPct" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{f.label}</label>
                    <input type="number" step="0.01" min="0" className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" value={(form as any)[f.key] || 0} onChange={e => setForm(p => ({ ...p, [f.key]: Number(e.target.value) }))} />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 text-white">
                <div className="text-xs font-bold opacity-75 mb-1">Calculated Quoted FOB (per piece)</div>
                <div className="text-5xl font-black">$ {liveCalcFOB.toFixed(2)}</div>
                <div className="text-xs opacity-60 mt-1">= $ {(liveCalcFOB * 12).toFixed(2)} per dozen</div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Cost Breakdown (Per Dozen)</h3>
                {(() => {
                  const fDz = (form.fabricConsumptionKgDz || 0) * (form.fabricCostPerKg || 0);
                  const tDz = form.trimsCostPerDz || 0;
                  const cDz = form.cmtPerDz || 0;
                  const total = fDz + tDz + cDz;
                  const oh = total * ((form.commercialOHPct || 0) / 100);
                  const bk = (total + oh) * ((form.bankChargePct || 0) / 100);
                  const cost = total + oh + bk;
                  const mg = cost / (1 - (form.targetMarginPct || 0) / 100) - cost;
                  return [
                    { label: "Fabric Cost", val: fDz, cls: "text-teal-600" },
                    { label: "Trims & Accessories", val: tDz, cls: "text-violet-600" },
                    { label: "CM (Cut-Make-Trim)", val: cDz, cls: "text-blue-600" },
                    { label: `Commercial OH (${form.commercialOHPct || 0}%)`, val: oh, cls: "text-amber-600" },
                    { label: `Bank Charges (${form.bankChargePct || 0}%)`, val: bk, cls: "text-orange-500" },
                    { label: `Profit Margin (${form.targetMarginPct || 0}%)`, val: mg, cls: "text-emerald-600" },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between text-xs">
                      <span className="text-slate-500">{r.label}</span>
                      <span className={`font-extrabold ${r.cls}`}>$ {r.val.toFixed(4)}/dz</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: STATUS BOARD ── */}
        {activeTab === "status" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {(["Draft", "Sent to Buyer", "Buyer Approved", "Converted to PO", "Rejected"] as InquiryStatus[]).map(status => {
              const items = inquiries.filter(q => q.status === status);
              const headerCls: Record<InquiryStatus, string> = {
                "Draft": "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600",
                "Sent to Buyer": "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700",
                "Buyer Approved": "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700",
                "Converted to PO": "bg-teal-50 dark:bg-teal-900/20 border-teal-300 dark:border-teal-700",
                "Rejected": "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700",
              };
              return (
                <div key={status} className={`rounded-xl border-2 ${headerCls[status]} overflow-hidden`}>
                  <div className="px-3 py-2.5 border-b border-current/20 flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200">{status}</span>
                    <span className="text-xs font-black bg-white dark:bg-slate-800 rounded-full px-2 py-0.5 shadow-xs">{items.length}</span>
                  </div>
                  <div className="p-2.5 space-y-2 min-h-32">
                    {items.length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-6">Empty</p>
                    ) : items.map(inq => (
                      <div key={inq.id} className="bg-white dark:bg-slate-800 rounded-lg p-2.5 shadow-xs border border-white/50 dark:border-slate-700">
                        <div className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">{inq.inquiryNo}</div>
                        <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{inq.buyerName}</div>
                        <div className="text-[10px] text-slate-400 truncate">{inq.styleRef}</div>
                        <div className="flex justify-between mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-700">
                          <span className="text-[10px] text-slate-500">{inq.quantity.toLocaleString()} pcs</span>
                          <span className="text-[10px] font-extrabold text-emerald-600">$ {inq.quotedFOB.toFixed(2)}</span>
                        </div>
                        {inq.status === "Buyer Approved" && (
                          <button onClick={() => { setInquiries(prev => prev.map(q => q.id === inq.id ? { ...q, status: "Converted to PO" } : q)); toast.success("Converted to PO!"); }} className="w-full mt-2 text-[10px] font-extrabold bg-teal-500 hover:bg-teal-600 text-white py-1 rounded-md transition cursor-pointer">
                            Convert to PO →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── ADD/EDIT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">{editItem ? "Edit Inquiry" : "New Buyer Inquiry"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg leading-none">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Buyer Name *</label>
                  <input className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="e.g. H&M Group (SE)" value={form.buyerName || ""} onChange={e => setForm(p => ({ ...p, buyerName: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Style Reference *</label>
                  <input className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="e.g. HM-SS26-KNT-001" value={form.styleRef || ""} onChange={e => setForm(p => ({ ...p, styleRef: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Product Type</label>
                  <select className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none cursor-pointer" value={form.productType || "Knit"} onChange={e => setForm(p => ({ ...p, productType: e.target.value as ProductType }))}>
                    <option>Knit</option><option>Woven</option><option>Sweater</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Item Description</label>
                  <input className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none" placeholder="e.g. Men's Basic T-Shirt, 100% Cotton S/J, 180 GSM" value={form.itemDescription || ""} onChange={e => setForm(p => ({ ...p, itemDescription: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Order Quantity (pcs)</label>
                  <input type="number" className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none" value={form.quantity || ""} onChange={e => setForm(p => ({ ...p, quantity: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Buyer's Target FOB ($)</label>
                  <input type="number" step="0.01" className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none" value={form.targetFOB || ""} onChange={e => setForm(p => ({ ...p, targetFOB: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Required Ship Date</label>
                  <input type="date" className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none" value={form.shipDate || ""} onChange={e => setForm(p => ({ ...p, shipDate: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Payment Terms</label>
                  <select className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none cursor-pointer" value={form.paymentTerms || "90 Days BBLC"} onChange={e => setForm(p => ({ ...p, paymentTerms: e.target.value as PaymentTerms }))}>
                    <option>At Sight LC</option><option>90 Days BBLC</option><option>120 Days BBLC</option><option>TT Advance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">AQL Standard</label>
                  <select className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none cursor-pointer" value={form.aqlStandard || "2.5"} onChange={e => setForm(p => ({ ...p, aqlStandard: e.target.value as AQLStandard }))}>
                    <option>1.5</option><option>2.5</option><option>4.0</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Status</label>
                  <select className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none cursor-pointer" value={form.status || "Draft"} onChange={e => setForm(p => ({ ...p, status: e.target.value as InquiryStatus }))}>
                    <option>Draft</option><option>Sent to Buyer</option><option>Buyer Approved</option><option>Rejected</option>
                  </select>
                </div>
              </div>
              {/* Pre-costing */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-3">Pre-Costing Parameters</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Fabric Type", key: "fabricType", type: "text" },
                    { label: "Yarn Composition", key: "yarnComposition", type: "text" },
                    { label: "GSM", key: "gsm", type: "number" },
                    { label: "Fabric Consumption (Kg/Dz)", key: "fabricConsumptionKgDz", type: "number" },
                    { label: "Fabric Cost per Kg ($)", key: "fabricCostPerKg", type: "number" },
                    { label: "Trims Cost per Dz ($)", key: "trimsCostPerDz", type: "number" },
                    { label: "CMT per Dz ($)", key: "cmtPerDz", type: "number" },
                    { label: "Commercial OH (%)", key: "commercialOHPct", type: "number" },
                    { label: "Bank Charge (%)", key: "bankChargePct", type: "number" },
                    { label: "Target Margin (%)", key: "targetMarginPct", type: "number" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">{f.label}</label>
                      <input type={f.type} step="0.01" className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none" value={(form as any)[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Calculated Quoted FOB</span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">$ {calcFOB(form).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 rounded-xl text-xs font-extrabold bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 rounded-xl text-xs font-extrabold bg-indigo-500 hover:bg-indigo-600 text-white transition cursor-pointer">Save Inquiry</button>
            </div>
          </div>
        </div>
      )}

      {/* ── COSTING VIEW MODAL ── */}
      {showCostingModal && costingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
              <div>
                <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">Pre-Costing Sheet</h2>
                <p className="text-[10px] text-slate-500 mt-0.5">{costingItem.inquiryNo} — {costingItem.styleRef}</p>
              </div>
              <button onClick={() => setShowCostingModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg leading-none">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                {[
                  ["Buyer", costingItem.buyerName], ["Product", costingItem.productType],
                  ["Fabric Type", costingItem.fabricType], ["Composition", costingItem.yarnComposition],
                  ["GSM", String(costingItem.gsm || "N/A")], ["Quantity", `${costingItem.quantity.toLocaleString()} pcs`],
                  ["Payment", costingItem.paymentTerms], ["AQL", costingItem.aqlStandard],
                ].map(([label, val]) => (
                  <div key={label}>
                    <span className="text-[10px] text-slate-400 block">{label}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{val}</span>
                  </div>
                ))}
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                      <th className="px-4 py-2 text-left text-[10px] font-extrabold text-slate-500">Component</th>
                      <th className="px-4 py-2 text-right text-[10px] font-extrabold text-slate-500">$ / Dozen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const fDz = costingItem.fabricConsumptionKgDz * costingItem.fabricCostPerKg;
                      const tDz = costingItem.trimsCostPerDz;
                      const cDz = costingItem.cmtPerDz;
                      const total = fDz + tDz + cDz;
                      const oh = total * (costingItem.commercialOHPct / 100);
                      const bk = (total + oh) * (costingItem.bankChargePct / 100);
                      const cost = total + oh + bk;
                      const mg = cost / (1 - costingItem.targetMarginPct / 100) - cost;
                      return [
                        { label: `Fabric (${costingItem.fabricConsumptionKgDz}Kg × $${costingItem.fabricCostPerKg})`, val: fDz },
                        { label: "Trims & Accessories", val: tDz },
                        { label: "CM (Cut-Make-Trim)", val: cDz },
                        { label: `Commercial OH (${costingItem.commercialOHPct}%)`, val: oh },
                        { label: `Bank Charges (${costingItem.bankChargePct}%)`, val: bk },
                        { label: `Profit Margin (${costingItem.targetMarginPct}%)`, val: mg, em: true },
                      ].map(r => (
                        <tr key={r.label} className={`border-t border-slate-100 dark:border-slate-800 ${r.em ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : ""}`}>
                          <td className="px-4 py-2">{r.label}</td>
                          <td className="px-4 py-2 text-right font-semibold">{r.val.toFixed(4)}</td>
                        </tr>
                      ));
                    })()}
                    <tr className="border-t-2 border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20">
                      <td className="px-4 py-3 font-extrabold text-indigo-700 dark:text-indigo-300">Quoted FOB (per piece)</td>
                      <td className="px-4 py-3 text-right font-black text-indigo-600 dark:text-indigo-400">$ {costingItem.quotedFOB.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t border-slate-200 dark:border-slate-700">
                      <td className="px-4 py-2 text-slate-500">Buyer's Target FOB</td>
                      <td className="px-4 py-2 text-right font-semibold text-slate-600">$ {costingItem.targetFOB.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-slate-500">Variance</td>
                      <td className={`px-4 py-2 text-right font-extrabold ${costingItem.quotedFOB <= costingItem.targetFOB ? "text-emerald-600" : "text-amber-600"}`}>
                        {costingItem.quotedFOB <= costingItem.targetFOB ? "✓ Within Target" : "⚠ Above Target"} ({Math.abs(costingItem.quotedFOB - costingItem.targetFOB).toFixed(2)})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button onClick={() => setShowCostingModal(false)} className="px-5 py-2 rounded-xl text-xs font-extrabold bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}
    </MerchandisingLayout>
  );
}
