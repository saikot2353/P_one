import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Send,
  Eye,
  BarChart2,
  ArrowLeft,
  UploadCloud,
  Save,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-inquiry")({
  head: () => ({
    meta: [
      { title: "Buyer Inquiry — RMG Merchandising" },
    ],
  }),
  component: MerchandisingInquiryPage,
});

type InquiryStatus = "Draft" | "Sent to Buyer" | "Buyer Approved" | "Converted to PO" | "Rejected";
type ProductType = "Knit" | "Woven" | "Sweater";
type PaymentTerms = "At Sight LC" | "90 Days BBLC" | "120 Days BBLC" | "TT Advance";

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
  buyingHouse?: string;
  department?: string;
  season?: string;
  fabricGsm?: string;
  knitStructure?: string;
  warpWeftCount?: string;
  fabricConstruction?: string;
  weaveDensity?: string;
  gauge?: string;
  yarnPly?: string;
  knittingPattern?: string;
  print?: boolean;
  embroidery?: boolean;
  wash?: boolean;
  special?: boolean;
  image?: string;
  // Sample Requirement Checklist
  fitSample?: boolean;
  sizeSetSample?: boolean;
  smsSample?: boolean;
  photoSample?: boolean;
}

const SAMPLE_INQUIRIES: Inquiry[] = [
  {
    id: "inq-001", inquiryNo: "INQ-2026-001", buyerName: "H&M Group (SE)",
    styleRef: "HM-SS26-KNT-001", productType: "Knit",
    itemDescription: "Men's Basic Round Neck T-Shirt, 100% Cotton Single Jersey",
    quantity: 50005, targetFOB: 3.85, shipDate: "2026-10-15",
    paymentTerms: "90 Days BBLC", status: "Converted to PO",
    submittedDate: "2026-07-10", fabricType: "Single Jersey", gsm: 180,
    yarnComposition: "100% Combed Cotton", fabricConsumptionKgDz: 2.45,
    fabricCostPerKg: 3.20, trimsCostPerDz: 0.85, cmtPerDz: 4.20,
    commercialOHPct: 4, bankChargePct: 2, targetMarginPct: 12, quotedFOB: 3.82,
    buyingHouse: "Li & Fung", department: "Boys", season: "ANS-SS27",
    fabricGsm: "180", knitStructure: "Single Jersey",
    print: true, embroidery: false, wash: true, special: false,
    fitSample: true, sizeSetSample: true, smsSample: false, photoSample: true,
  },
  {
    id: "inq-002", inquiryNo: "INQ-2026-002", buyerName: "ZARA (Inditex)",
    styleRef: "ZR-AW26-WVN-045", productType: "Woven",
    itemDescription: "Ladies Casual Shirt, 60% Cotton 40% Polyester Poplin",
    quantity: 25000, targetFOB: 7.50, shipDate: "2026-11-30",
    paymentTerms: "At Sight LC", status: "Sent to Buyer",
    submittedDate: "2026-07-18", fabricType: "Poplin", gsm: 110,
    yarnComposition: "60% Cotton 40% Polyester", fabricConsumptionKgDz: 1.80,
    fabricCostPerKg: 4.50, trimsCostPerDz: 1.20, cmtPerDz: 8.50,
    commercialOHPct: 4, bankChargePct: 1.5, targetMarginPct: 12, quotedFOB: 7.42,
    buyingHouse: "Synergy", department: "Women", season: "FW27",
    warpWeftCount: "40s x 40s", fabricConstruction: "133 x 72", weaveDensity: "2/1 Twill",
    print: false, embroidery: true, wash: true, special: false,
    fitSample: true, sizeSetSample: false, smsSample: true, photoSample: false,
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
    "Draft": { cls: "bg-slate-100 text-slate-655 border-slate-350 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700", icon: <Clock className="size-3" /> },
    "Sent to Buyer": { cls: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800", icon: <Send className="size-3" /> },
    "Buyer Approved": { cls: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800", icon: <CheckCircle className="size-3" /> },
    "Converted to PO": { cls: "bg-teal-55 text-teal-605 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800", icon: <ChevronRight className="size-3" /> },
    "Rejected": { cls: "bg-red-50 text-red-655 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800", icon: <XCircle className="size-3" /> },
  };
  const { cls, icon } = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cls}`}>
      {icon} {status}
    </span>
  );
}

function MerchandisingInquiryPage() {
  const [viewMode, setViewMode] = useState<"list" | "prepare">("list");
  const [activeListTab, setActiveListTab] = useState<"table" | "kanban">("table");

  const [inquiries, setInquiries] = useState<Inquiry[]>(SAMPLE_INQUIRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | "All">("All");
  const [filterBuyer, setFilterBuyer] = useState("All");

  const [editItem, setEditItem] = useState<Inquiry | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCostingModal, setShowCostingModal] = useState(false);
  const [costingItem, setCostingItem] = useState<Inquiry | null>(null);

  const defaultForm: Partial<Inquiry> = {
    buyerName: "", buyingHouse: "ITPS", styleRef: "", productType: "Knit",
    itemDescription: "", quantity: 0, targetFOB: 0, shipDate: "",
    paymentTerms: "90 Days BBLC", status: "Draft", fabricType: "Single Jersey",
    gsm: 180, yarnComposition: "100% Combed Cotton",
    fabricConsumptionKgDz: 2.4, fabricCostPerKg: 3.20, trimsCostPerDz: 0.85,
    cmtPerDz: 4.50, commercialOHPct: 4, bankChargePct: 2, targetMarginPct: 12,
    department: "Boys", season: "ANS-SS27", fabricGsm: "180", knitStructure: "Single Jersey",
    warpWeftCount: "40s x 40s", fabricConstruction: "133 x 72", weaveDensity: "2/1 Twill",
    gauge: "12GG", yarnPly: "2/32 Nm", knittingPattern: "Jacquard",
    print: false, embroidery: false, wash: false, special: false,
    fitSample: true, sizeSetSample: false, smsSample: false, photoSample: false,
  };

  const [form, setForm] = useState<Partial<Inquiry>>(defaultForm);

  const filtered = inquiries.filter(q => {
    const s = searchQuery.toLowerCase();
    const matchSearch = q.inquiryNo.toLowerCase().includes(s) || q.buyerName.toLowerCase().includes(s) || q.styleRef.toLowerCase().includes(s);
    const matchStatus = filterStatus === "All" || q.status === filterStatus;
    const matchBuyer = filterBuyer === "All" || q.buyerName === filterBuyer;
    return matchSearch && matchStatus && matchBuyer;
  });

  const handleSave = () => {
    if (!form.buyerName?.trim() || !form.styleRef?.trim()) {
      toast.error("Buyer Name and Style Ref are required");
      return;
    }
    const fob = calcFOB(form);
    if (editItem) {
      setInquiries(prev => prev.map(q => q.id === editItem.id ? { ...q, ...form, quotedFOB: fob } as Inquiry : q));
      toast.success("Inquiry updated successfully!");
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
    setViewMode("list");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uniqueBuyers = useMemo(() => {
    return Array.from(new Set(inquiries.map(i => i.buyerName)));
  }, [inquiries]);

  const liveCalcFOB = calcFOB(form);
  const variance = liveCalcFOB - (form.targetFOB || 0);

  const statusCounts = {
    total: inquiries.length,
    draft: inquiries.filter(q => q.status === "Draft").length,
    sent: inquiries.filter(q => q.status === "Sent to Buyer").length,
    approved: inquiries.filter(q => q.status === "Buyer Approved").length,
    converted: inquiries.filter(q => q.status === "Converted to PO").length,
    rejected: inquiries.filter(q => q.status === "Rejected").length,
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
        className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 shadow-2xs"
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
        className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.75rem_center] shadow-2xs cursor-pointer"
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
      activePath="inquiry"
      breadcrumbs={[{ label: "Orders & Costing" }, { label: "Buyer Inquiry" }]}
      title={viewMode === "list" ? "Buyer Inquiries" : editItem ? `Edit Inquiry — ${form.inquiryNo}` : "New Buyer Inquiry"}
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">
        
        {/* ── VIEW: LIST REGISTER MODE ── */}
        {viewMode === "list" && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="p-1.5 bg-teal-500/10 text-teal-555 rounded-lg"><Layers className="size-5" /></span>
                  Buyer Inquiry Register
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Log initial style inquiries, define fabric blend specifications, target quantities, and dates.
                </p>
              </div>
              
              <button
                onClick={() => {
                  setForm(defaultForm);
                  setEditItem(null);
                  setImagePreview(null);
                  setViewMode("prepare");
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-650 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-teal-500/10 font-bold text-xs transition-all active:scale-97 cursor-pointer"
              >
                <Plus className="size-4" /> Log New Inquiry
              </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Total Inquiries", val: statusCounts.total },
                { label: "Drafts", val: statusCounts.draft },
                { label: "Sent to Buyer", val: statusCounts.sent },
                { label: "Buyer Approved", val: statusCounts.approved },
                { label: "PO Created", val: statusCounts.converted },
                { label: "Rejected Inquiries", val: statusCounts.rejected },
              ].map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-4 rounded-xl shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{card.label}</span>
                  <span className="text-xl font-black block mt-2 text-slate-808 dark:text-white">{card.val}</span>
                </div>
              ))}
            </div>

            {/* List Controls */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    className="pl-9 pr-3 py-2 w-full text-xs border border-slate-200 dark:border-slate-850 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    placeholder="Search inquiry, buyer or style..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="text-xs border border-slate-200 dark:border-slate-850 rounded-lg bg-white dark:bg-slate-900 px-3 py-2 focus:outline-none cursor-pointer"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as any)}
                >
                  <option value="All">All Statuses</option>
                  <option>Draft</option>
                  <option>Sent to Buyer</option>
                  <option>Buyer Approved</option>
                  <option>Converted to PO</option>
                  <option>Rejected</option>
                </select>

                <select
                  className="text-xs border border-slate-205 dark:border-slate-855 rounded-lg bg-white dark:bg-slate-900 px-3 py-2 focus:outline-none cursor-pointer"
                  value={filterBuyer}
                  onChange={e => setFilterBuyer(e.target.value)}
                >
                  <option value="All">All Buyers</option>
                  {uniqueBuyers.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* View Switch */}
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-250 dark:border-slate-800">
                <button
                  onClick={() => setActiveListTab("table")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeListTab === "table"
                      ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  List view
                </button>
                <button
                  onClick={() => setActiveListTab("kanban")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeListTab === "kanban"
                      ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Kanban Board
                </button>
              </div>
            </div>

            {/* List Table panel */}
            {activeListTab === "table" ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-205 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                        <th className="px-4 py-3 text-center w-10">#</th>
                        <th className="px-4 py-3">Inquiry No</th>
                        <th className="px-4 py-3">Buyer Name</th>
                        <th className="px-4 py-3">Style Ref</th>
                        <th className="px-4 py-3">Item Description</th>
                        <th className="px-4 py-3">Division</th>
                        <th className="px-4 py-3 text-right">Qty (Pcs)</th>
                        <th className="px-4 py-3 text-right">Target FOB</th>
                        <th className="px-4 py-3 text-center">Samples Required</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {filtered.map((inq, idx) => (
                        <tr key={inq.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                          <td className="px-4 py-3.5 text-center text-slate-400 font-bold">{idx + 1}</td>
                          <td className="px-4 py-3.5 font-bold text-teal-605 dark:text-teal-400">{inq.inquiryNo}</td>
                          <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">{inq.buyerName}</td>
                          <td className="px-4 py-3.5 font-mono">{inq.styleRef}</td>
                          <td className="px-4 py-3.5 max-w-xs truncate" title={inq.itemDescription}>{inq.itemDescription || "—"}</td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                              inq.productType === "Knit" ? "bg-teal-50 text-teal-700 border-teal-200" :
                              inq.productType === "Woven" ? "bg-purple-50 text-purple-700 border-purple-200" :
                              "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              {inq.productType}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-semibold">{inq.quantity.toLocaleString()}</td>
                          <td className="px-4 py-3.5 text-right font-mono">$ {inq.targetFOB.toFixed(2)}</td>
                          <td className="px-4 py-3.5 text-center font-bold text-[10px] text-slate-500">
                            {[
                              inq.fitSample && "Fit",
                              inq.sizeSetSample && "Size-Set",
                              inq.smsSample && "SMS",
                              inq.photoSample && "Photo"
                            ].filter(Boolean).join(" | ") || "None"}
                          </td>
                          <td className="px-4 py-3.5 text-center"><StatusBadge status={inq.status} /></td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setForm({ ...inq });
                                  setEditItem(inq);
                                  setImagePreview(inq.image || null);
                                  setViewMode("prepare");
                                }}
                                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-705 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 transition cursor-pointer"
                                title="Edit Inquiry Workspace"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setInquiries(prev => prev.filter(q => q.id !== inq.id));
                                  toast.success("Inquiry removed.");
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 border border-rose-200 dark:border-rose-900/40 text-rose-600 transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={11} className="px-4 py-16 text-center text-slate-400 font-medium">
                            No style inquiries registered yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Kanban Board
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
                {(["Draft", "Sent to Buyer", "Buyer Approved", "Converted to PO", "Rejected"] as InquiryStatus[]).map(status => {
                  const columnItems = inquiries.filter(q => q.status === status);
                  const statusColors: Record<InquiryStatus, string> = {
                    "Draft": "bg-slate-100 border-slate-300 text-slate-750",
                    "Sent to Buyer": "bg-blue-50 border-blue-200 text-blue-800",
                    "Buyer Approved": "bg-emerald-50 border-emerald-200 text-emerald-800",
                    "Converted to PO": "bg-teal-50 border-teal-200 text-teal-800",
                    "Rejected": "bg-rose-50 border-rose-200 text-rose-800",
                  };
                  return (
                    <div key={status} className={`rounded-xl border ${statusColors[status]} overflow-hidden shadow-2xs`}>
                      <div className="px-3.5 py-3 border-b border-current/15 flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider">{status}</span>
                        <span className="text-[10px] font-black bg-white dark:bg-slate-800 rounded-full px-2 py-0.5 border border-slate-200 shadow-inner">{columnItems.length}</span>
                      </div>
                      <div className="p-3 space-y-3 min-h-60 max-h-[60vh] overflow-y-auto bg-slate-50/50">
                        {columnItems.length === 0 ? (
                          <div className="text-[10px] text-slate-400 text-center py-12">Empty Stage</div>
                        ) : columnItems.map(inq => (
                          <div key={inq.id} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 shadow-2xs">
                            <div className="flex justify-between items-start gap-1">
                              <span className="text-[10px] font-black text-teal-655">{inq.inquiryNo}</span>
                              <span className="text-[9px] font-bold text-slate-400">{inq.productType}</span>
                            </div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 truncate">{inq.buyerName}</div>
                            <div className="text-[10px] text-slate-500 font-mono truncate">{inq.styleRef}</div>
                            
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 text-[10px]">
                              <span className="text-slate-400 font-bold">{inq.quantity.toLocaleString()} pcs</span>
                              <span className="font-extrabold text-slate-700">$ {inq.targetFOB.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ── VIEW: PREPARE WORKSPACE MODE ── */}
        {viewMode === "prepare" && (
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            
            {/* Top Workspace Toolbar */}
            <div className="h-14 border-b border-slate-200 bg-white dark:bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-20 shadow-2xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode("list")}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  title="Back to Register"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-extrabold text-slate-805 dark:text-white">
                    {editItem ? `Edit Inquiry Specs — ${form.inquiryNo}` : "Log Buyer Inquiry Workspace"}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-bold hidden sm:inline mr-2 uppercase">Status:</span>
                <select
                  value={form.status || "Draft"}
                  onChange={e => setForm(p => ({ ...p, status: e.target.value as InquiryStatus }))}
                  className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 cursor-pointer font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option>Draft</option>
                  <option>Sent to Buyer</option>
                  <option>Buyer Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>

            {/* Main Workspace Body */}
            <div className="p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Left Form: Details (3 cols) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Segmented Division Selector */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Garment Division *</span>
                    <span className="text-xs font-bold text-slate-808 dark:text-slate-200">Select product type to dynamically render specs inputs</span>
                  </div>

                  <div className="flex bg-slate-100 dark:bg-slate-955 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    {["Knit", "Woven", "Sweater"].map((t) => {
                      const isSel = form.productType === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm({ ...form, productType: t as any })}
                          className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isSel
                              ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs"
                              : "text-slate-500 hover:text-slate-805"
                          }`}
                        >
                          {t} Order
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 1: Basic Information */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-805 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <h2 className="text-base font-bold text-slate-805 dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-teal-500 rounded-full inline-block"></span>
                      Basic Inquiry specifications
                    </h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
                      <InputField label="Buyer Name" required value={form.buyerName} onChange={(e: any) => setForm({ ...form, buyerName: e.target.value })} placeholder="e.g. H&M Group (SE)" />
                      <InputField label="Buying House" value={form.buyingHouse} onChange={(e: any) => setForm({ ...form, buyingHouse: e.target.value })} placeholder="e.g. Li & Fung" />
                      <InputField label="Style Reference" required value={form.styleRef} onChange={(e: any) => setForm({ ...form, styleRef: e.target.value })} placeholder="e.g. HM-SS26-KNT-001" />
                      
                      <InputField label="Inquiry Quantity (Pcs)" type="number" required value={form.quantity} onChange={(e: any) => setForm({ ...form, quantity: Number(e.target.value) })} />
                      <InputField label="Buyer Target FOB ($)" type="number" step="0.01" required value={form.targetFOB} onChange={(e: any) => setForm({ ...form, targetFOB: Number(e.target.value) })} />
                      <InputField label="Required Ship Date" type="date" required value={form.shipDate} onChange={(e: any) => setForm({ ...form, shipDate: e.target.value })} />
                      
                      <SelectField label="Payment Terms" value={form.paymentTerms} onChange={(e: any) => setForm({ ...form, paymentTerms: e.target.value })} options={["At Sight LC", "90 Days BBLC", "120 Days BBLC", "TT Advance"]} />
                      <SelectField label="Department" value={form.department} onChange={(e: any) => setForm({ ...form, department: e.target.value })} options={["Boys", "Girls", "Men", "Women"]} />
                      <SelectField label="Season" value={form.season} onChange={(e: any) => setForm({ ...form, season: e.target.value })} options={["ANS-SS27", "FW27"]} />
                    </div>

                    <div className="pt-2">
                      <InputField label="Item Description / Fabric Blend Comments" value={form.itemDescription} onChange={(e: any) => setForm({ ...form, itemDescription: e.target.value })} placeholder="Men's Basic Round Neck T-Shirt, 100% Cotton Single Jersey, 180 GSM..." />
                    </div>
                  </div>
                </div>

                {/* Section 2: Garment Division specific configuration */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-805 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <h2 className="text-base font-bold text-slate-805 dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-purple-500 rounded-full inline-block"></span>
                      {form.productType} Division Configuration Specs
                    </h2>
                  </div>

                  <div className="p-6">
                    {form.productType === "Knit" && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InputField label="Fabric GSM" value={form.fabricGsm} onChange={(e: any) => setForm({ ...form, fabricGsm: e.target.value })} placeholder="e.g. 180" />
                        <SelectField label="Knit Structure" value={form.knitStructure} onChange={(e: any) => setForm({ ...form, knitStructure: e.target.value })} options={["Single Jersey", "1x1 Rib", "Interlock", "French Terry", "Pique"]} />
                        <InputField label="Yarn Composition" value={form.yarnComposition} onChange={(e: any) => setForm({ ...form, yarnComposition: e.target.value })} placeholder="e.g. 100% Cotton" />
                      </div>
                    )}

                    {form.productType === "Woven" && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InputField label="Warp x Weft Count" value={form.warpWeftCount} onChange={(e: any) => setForm({ ...form, warpWeftCount: e.target.value })} placeholder="e.g. 40s x 40s" />
                        <InputField label="Fabric Construction Density" value={form.fabricConstruction} onChange={(e: any) => setForm({ ...form, fabricConstruction: e.target.value })} placeholder="e.g. 133 x 72" />
                        <SelectField label="Weave Density / Pattern" value={form.weaveDensity} onChange={(e: any) => setForm({ ...form, weaveDensity: e.target.value })} options={["2/1 Twill", "Plain/Poplin", "Satin/Sateen", "Canvas", "Oxford"]} />
                      </div>
                    )}

                    {form.productType === "Sweater" && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <SelectField label="Machine Gauge (GG)" value={form.gauge} onChange={(e: any) => setForm({ ...form, gauge: e.target.value })} options={["12GG", "7GG", "3GG", "5GG", "14GG"]} />
                        <InputField label="Yarn Ply / Count" value={form.yarnPly} onChange={(e: any) => setForm({ ...form, yarnPly: e.target.value })} placeholder="e.g. 2/32 Nm" />
                        <SelectField label="Knitting Pattern Type" value={form.knittingPattern} onChange={(e: any) => setForm({ ...form, knittingPattern: e.target.value })} options={["Jacquard", "Cable", "Ribbing", "Pointelle", "Flat Knit"]} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Required Processes */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-805 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <h2 className="text-base font-bold text-slate-805 dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-orange-550 rounded-full inline-block"></span>
                      Required operations processes
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: "print", label: "PRINTING", state: form.print },
                        { id: "embroidery", label: "EMBROIDERY", state: form.embroidery },
                        { id: "wash", label: "WASH / DYEING", state: form.wash },
                        { id: "special", label: "SPECIAL PROCESSES", state: form.special },
                      ].map(proc => (
                        <button
                          key={proc.id}
                          type="button"
                          onClick={() => setForm({ ...form, [proc.id]: !proc.state })}
                          className={`px-6 py-2 rounded-full text-[11px] font-bold tracking-wide transition-all shadow-sm border cursor-pointer ${
                            proc.state
                              ? "bg-teal-100 border-teal-300 text-teal-700 dark:bg-teal-900/30 dark:border-teal-500/50 dark:text-teal-300 ring-2 ring-teal-500/20"
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                          }`}
                        >
                          {proc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 4: Sample Requirements Checklist */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-805 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <h2 className="text-base font-bold text-slate-805 dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-sky-500 rounded-full inline-block"></span>
                      Sample Development Checklist
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { id: "fitSample", label: "Fit Sample" },
                        { id: "sizeSetSample", label: "Size Set Sample" },
                        { id: "smsSample", label: "SMS (Salesman Sample)" },
                        { id: "photoSample", label: "Photo Shoot Sample" },
                      ].map(item => (
                        <label key={item.id} className="flex items-center gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={!!(form as any)[item.id]}
                            onChange={e => setForm({ ...form, [item.id]: e.target.checked })}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-750 select-none">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Sidebar: Sketch Upload */}
              <div className="space-y-6">
                
                {/* Tech pack image uploader */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-tight uppercase">Style Sketch / Tech pack</span>
                  
                  <div className="w-full h-56 rounded-xl border-[1.5px] border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center relative overflow-hidden group hover:bg-slate-50 transition cursor-pointer">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <span className="text-white font-medium text-xs flex items-center gap-1.5"><UploadCloud size={14}/> Change Design</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <div className="bg-slate-200 dark:bg-slate-800 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3 text-slate-500">
                          <UploadCloud size={18} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Upload Design</span>
                        <span className="text-[9px] text-slate-400 block font-medium">JPG, PNG or PDF</span>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-5 rounded-2xl text-white space-y-3.5 shadow-md">
                  <h4 className="text-xs font-black uppercase tracking-wider">Garments specs guidelines</h4>
                  <p className="text-[10px] opacity-90 leading-relaxed">
                    Make sure to specify correct GSM, counts, patterns and operations. These values directly populate downstream quotations and PO entries.
                  </p>
                </div>

              </div>

            </div>

            {/* Bottom Sticky Action Footer */}
            <div className="fixed bottom-0 left-0 right-0 h-16 border-t border-slate-200/80 bg-white shadow-lg flex items-center justify-end px-6 gap-2.5 z-25">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-655 transition cursor-pointer"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white transition active:scale-97 cursor-pointer flex items-center gap-1.5 shadow-sm shadow-teal-500/10"
              >
                <Save className="size-4" /> Save Inquiry
              </button>
            </div>

          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}
