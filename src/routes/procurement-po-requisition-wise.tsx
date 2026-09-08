import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Plus,
  SlidersHorizontal,
  FileText,
  Search,
  CheckCircle2,
  Building2,
  Save,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  X,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/procurement-po-requisition-wise")({
  head: () => ({
    meta: [
      { title: "Requisition Wise PO — CRIPTON Procurement" },
      { name: "description", content: "Generate Purchase Orders directly from Requisitions with smart Terms & Conditions configuration." },
    ],
  }),
  component: ProcurementPoRequisitionWisePage,
});

// Requisition Mock Data
interface ReqItem {
  id: string;
  reqNo: string;
  name: string;
  spec: string;
  uom: string;
  approvedQty: number;
  remainQty: number;
  defaultPrice: number;
}

interface RequisitionRecord {
  reqNo: string;
  title: string;
  date: string;
  items: ReqItem[];
}

const SAMPLE_REQUISITIONS: RequisitionRecord[] = [
  {
    reqNo: "361008",
    title: "Ricoh Printer Spare Parts & Cleaning Blades",
    date: "04/09/2026",
    items: [
      { id: "R-101", reqNo: "361008", name: "Ricoh MP 2555 Cleaning Blade", spec: "Heavy Duty Polyurethane Blade", uom: "PCS", approvedQty: 1.0, remainQty: 1.0, defaultPrice: 450.0 },
      { id: "R-102", reqNo: "361008", name: "Ricoh MP 2555 Drum", spec: "Original OPC Drum Assembly", uom: "PCS", approvedQty: 1.0, remainQty: 1.0, defaultPrice: 2800.0 },
    ],
  },
  {
    reqNo: "332576",
    title: "Electrical Fittings & Cabling Materials for Unit #2",
    date: "01/09/2026",
    items: [
      { id: "E-201", reqNo: "332576", name: "MK One Gang Socket", spec: "Flush Mounting 13A Single", uom: "PCS", approvedQty: 50.0, remainQty: 50.0, defaultPrice: 350.0 },
      { id: "E-202", reqNo: "332576", name: "PVC Tape High Insulation", spec: "Flame Retardant Black 20m", uom: "PCS", approvedQty: 100.0, remainQty: 100.0, defaultPrice: 25.0 },
      { id: "E-203", reqNo: "332576", name: "Cable NYY 1X4 Rm Copper Heavy Duty", spec: "BYA 4.0 sq.mm Copper Cable", uom: "Yards", approvedQty: 500.0, remainQty: 500.0, defaultPrice: 92.0 },
    ],
  },
  {
    reqNo: "REQ-2026-091",
    title: "30s Carded Cotton Yarn 100% Ring Spun Import",
    date: "28/08/2026",
    items: [
      { id: "Y-301", reqNo: "REQ-2026-091", name: "30s Carded Cotton Yarn 100% Cotton Ring Spun", spec: "Weaving Grade 100% Cotton", uom: "Kg", approvedQty: 12000.0, remainQty: 12000.0, defaultPrice: 3.4 },
    ],
  },
  {
    reqNo: "REQ-2026-084",
    title: "Reactive Dye Blue B & Non-Ionic Softeners",
    date: "25/08/2026",
    items: [
      { id: "C-401", reqNo: "REQ-2026-084", name: "Reactive Dye Blue B (High Fixation Rate)", spec: "Textile Dyeing Grade 99%", uom: "Kg", approvedQty: 2500.0, remainQty: 2500.0, defaultPrice: 6.2 },
      { id: "C-402", reqNo: "REQ-2026-084", name: "Textile Softener Liquid Non-Ionic", spec: "High Softness Concentrated Liquid", uom: "Ltr", approvedQty: 4000.0, remainQty: 4000.0, defaultPrice: 1.2 },
    ],
  },
];

// Terms & Conditions Preset Templates
const TNC_TEMPLATES: Record<string, string[]> = {
  "Standard Local Purchase Terms": [
    "Total payment will be done after 100% physical delivery verification & quality inspection.",
    "Please explicitly refer to the P.O. Number in all correspondence, shipping invoices, and delivery challans.",
    "Total bill settlement will be calculated based on actual verified quantity received at store site.",
  ],
  "Import L/C Payment & Inspection Terms": [
    "Payment will be processed via Irrevocable At Sight L/C upon shipment document verification.",
    "Pre-shipment inspection certificate from SGS or equivalent authority is mandatory.",
    "All shipping documents must state the L/C & P.O. Reference numbers clearly.",
  ],
  "Credit Purchase (30 Days Settlement) Terms": [
    "Payment term is 30 calendar days from the date of verified store receipt.",
    "Defective or non-conforming items must be replaced by vendor within 7 working days.",
    "Price is fixed and firm during the validity of this Purchase Order.",
  ],
  "Urgent Delivery & Penalty Clause Terms": [
    "Delivery must be completed strictly within 10 days of PO issuance date.",
    "Penalty clause: 0.5% per week delay up to a maximum limit of 5% of total PO value.",
    "Quality inspection will be conducted at destination store upon arrival.",
  ],
};

// Supplier Preset Contacts & Addresses
const SUPPLIER_DETAILS: Record<string, { contact: string; address: string }> = {
  "Makkah Electric": {
    contact: "Md. Jahangir Alam (Sales In-Charge) — 01711223344",
    address: "Stall #14, Nawabpur Electric Market, Dhaka-1100, Bangladesh.",
  },
  "Zhejiang Yarn Spinning Co.": {
    contact: "Mr. Lin Wei (Export Sales Director) — +86 571 889900",
    address: "No. 88 Textile Industry Zone, Shaoxing, Zhejiang, China.",
  },
  "Apex Textile Chemical Ltd": {
    contact: "Engr. Monirul Islam — 01819887766",
    address: "Plot #42, Tejgaon Industrial Area, Dhaka-1208.",
  },
  "Pakiza Apparel Accessories": {
    contact: "Store & Sales Desk — 01912345678",
    address: "Khan ABC Tradeplex House#37, Floor#11, Road#2, Dhaka-1205.",
  },
};

export function ProcurementPoRequisitionWisePage() {
  const navigate = useNavigate();

  // PO Form Header State
  const [poType, setPoType] = useState("Purchase Order");
  const [supplier, setSupplier] = useState("Makkah Electric");
  const [deliveryTo, setDeliveryTo] = useState("Pakiza Software Limited [PSL-Operation]");
  const [region, setRegion] = useState("PSL-Operation");
  const [poDate, setPoDate] = useState(new Date().toLocaleDateString("en-GB"));
  const [poValidDate, setPoValidDate] = useState("08/10/2026");
  const [currency, setCurrency] = useState("BDT");
  const [curRate, setCurRate] = useState("1.00");
  const [referenceNo, setReferenceNo] = useState("REF-2026-PO99");
  const [paymentMode, setPaymentMode] = useState("Credit / LC 90 Days");
  const [comments, setComments] = useState("");

  // Supplier & Delivery Details
  const supplierInfo = SUPPLIER_DETAILS[supplier] || {
    contact: "Sales Representative",
    address: "Corporate Supplier Address",
  };
  const deliveryAddress = "House# 97, Road# 11/A, Dhanmondi, Dhaka-1209, Bangladesh.";
  const deliveryContact = "Store & Receiving In-Charge";

  // Multi-Select Requisitions State & Modal
  const [selectedReqNos, setSelectedReqNos] = useState<string[]>(["361008", "332576"]);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [tempSelectedReqNos, setTempSelectedReqNos] = useState<string[]>(["361008", "332576"]);

  // Item Inputs State (qty, price, discount, enabled)
  const [itemInputs, setItemInputs] = useState<
    Record<string, { qty: number; price: number; discount: number; enabled: boolean }>
  >({});

  // Financial Summary State
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);

  // Smart Terms & Conditions Setup
  const [selectedTncTemplate, setSelectedTncTemplate] = useState("Standard Local Purchase Terms");
  const [selectedTerms, setSelectedTerms] = useState<string[]>([...TNC_TEMPLATES["Standard Local Purchase Terms"]]);
  const [customTermInput, setCustomTermInput] = useState("");
  const [termSearchQuery, setTermSearchQuery] = useState("");

  // Notification Toast State
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Toggle Requisition Selection
  const toggleReqSelection = (reqNo: string) => {
    setSelectedReqNos((prev) => {
      if (prev.includes(reqNo)) {
        if (prev.length === 1) return prev; // Keep at least one requisition
        return prev.filter((r) => r !== reqNo);
      }
      return [...prev, reqNo];
    });
  };

  // Combine Items from Selected Requisitions
  const combinedReqItems = useMemo(() => {
    const items: ReqItem[] = [];
    SAMPLE_REQUISITIONS.forEach((req) => {
      if (selectedReqNos.includes(req.reqNo)) {
        req.items.forEach((item) => {
          items.push(item);
        });
      }
    });
    return items;
  }, [selectedReqNos]);

  // Active PO Items with Input Values & Enabled state
  const activePoItems = useMemo(() => {
    return combinedReqItems.map((item) => {
      const input = itemInputs[item.id] || {
        qty: item.remainQty,
        price: item.defaultPrice,
        discount: 0,
        enabled: true,
      };
      const netPrice = Math.max(0, input.price - input.discount);
      const lineTotal = input.qty * netPrice;
      return {
        id: item.id,
        reqNo: item.reqNo,
        name: item.name,
        spec: item.spec,
        description: `${item.name} (${item.spec})`,
        uom: item.uom,
        approvedQty: item.approvedQty,
        remainQty: item.remainQty,
        qty: input.qty,
        unitPrice: input.price,
        discount: input.discount,
        netPrice: netPrice,
        lineTotal: lineTotal,
        enabled: input.enabled,
      };
    });
  }, [combinedReqItems, itemInputs]);

  // Financial Summary Computations
  const enabledItems = useMemo(() => {
    return activePoItems.filter((item) => item.enabled);
  }, [activePoItems]);

  const grossAmount = useMemo(() => {
    return enabledItems.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);
  }, [enabledItems]);

  const totalDiscount = useMemo(() => {
    return enabledItems.reduce((acc, item) => acc + item.qty * item.discount, 0);
  }, [enabledItems]);

  const netAmount = useMemo(() => {
    return Math.max(0, grossAmount - totalDiscount);
  }, [grossAmount, totalDiscount]);

  const grandTotal = useMemo(() => {
    return Math.max(0, netAmount - advanceAmount);
  }, [netAmount, advanceAmount]);

  // Load T&C Template
  const handleLoadTncTemplate = (templateName: string) => {
    setSelectedTncTemplate(templateName);
    if (TNC_TEMPLATES[templateName]) {
      setSelectedTerms([...TNC_TEMPLATES[templateName]]);
    }
  };

  // Save Purchase Order Workflow
  const handleSavePurchaseOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (enabledItems.length === 0) {
      alert("Please select at least one active item to include in the Purchase Order.");
      return;
    }

    const autoNum = Math.floor(120 + Math.random() * 800);
    const newPoNo = `PO/PSL/2026/000${autoNum}`;
    const timestamp = new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

    // Construct PurchaseOrderRecord
    const newPoRecord = {
      id: Date.now().toString(),
      poNo: newPoNo,
      poDate: poDate,
      csRef: `CS-2026-REQ${selectedReqNos.join("-")}`,
      reqNo: selectedReqNos.join(" "),
      supplier: supplier,
      supplierContact: supplierInfo.contact,
      deliveryTo: deliveryTo,
      deliveryContact: deliveryContact,
      jobDescription: enabledItems[0]?.description || "Requisition Wise Procurement Material Package",
      poValidDate: poValidDate,
      paymentMode: paymentMode,
      grossAmount: grossAmount,
      discount: totalDiscount,
      grandTotal: netAmount,
      netAmount: netAmount,
      advance: advanceAmount,
      status: "Draft" as const,
      preparedBy: "Tahmid Afsar",
      preparedDesignation: "Procurement Specialist",
      preparedDate: timestamp,
      selectedTerms: selectedTerms,
      items: enabledItems.map((item, idx) => ({
        sl: idx + 1,
        description: item.description,
        uom: item.uom,
        qty: item.qty,
        unitPrice: item.unitPrice,
        discount: item.discount,
        netPrice: item.netPrice,
        currency: currency,
        curRate: parseFloat(curRate) || 1.0,
        amount: item.lineTotal,
        amountBdt: item.lineTotal * (parseFloat(curRate) || 1.0),
      })),
    };

    // Save to Local Storage "procurement_cs_po_list_v3"
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("procurement_cs_po_list_v3");
      let list = [];
      if (existing) {
        try {
          list = JSON.parse(existing);
        } catch (err) {}
      }
      localStorage.setItem("procurement_cs_po_list_v3", JSON.stringify([newPoRecord, ...list]));
    }

    setSuccessNotice(`Purchase Order ${newPoNo} generated successfully for Requisitions (${selectedReqNos.join(", ")})!`);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <SlidersHorizontal className="size-5.5 text-amber-500" />
                Requisition Wise PO
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-normal">
                Procurement Workspace &gt; Purchase Order &gt;{" "}
                <span className="text-amber-500 font-semibold">Requisition Wise PO</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedReqNos(["361008"]);
                  setItemInputs({});
                  setSuccessNotice(null);
                }}
                className="h-9 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className="size-3.5" /> Reset Form
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/procurement-cs-create-workorder" })}
                className="h-9 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <FileText className="size-4" /> View CS PO List
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {successNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-in fade-in duration-200 shadow-sm">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>{successNotice}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/procurement-cs-create-workorder" })}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition cursor-pointer"
                >
                  Go to PO List <ArrowRight className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSuccessNotice(null)}
                  className="px-2 py-1 text-emerald-700 hover:text-emerald-950 text-xs font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSavePurchaseOrder} className="space-y-6">
            {/* SECTION 1: PO GENERAL DETAILS */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Building2 className="size-4 text-amber-500" /> PO General Details
                </h3>
                <span className="text-[11px] text-muted-foreground">Header Information &amp; Vendor Parameters</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {/* Type */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Document Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={poType}
                    onChange={(e) => setPoType(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-amber-500"
                  >
                    <option value="Purchase Order">Purchase Order</option>
                    <option value="Work Order">Work Order</option>
                  </select>
                </div>

                {/* Supplier */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Supplier / Vendor <span className="text-rose-500">*</span>
                  </label>
                  <SearchableSelect
                    options={[
                      { value: "Makkah Electric", label: "Makkah Electric" },
                      { value: "Zhejiang Yarn Spinning Co.", label: "Zhejiang Yarn Spinning Co." },
                      { value: "Apex Textile Chemical Ltd", label: "Apex Textile Chemical Ltd" },
                      { value: "Pakiza Apparel Accessories", label: "Pakiza Apparel Accessories" },
                    ]}
                    value={supplier}
                    onChange={setSupplier}
                    placeholder="Select Supplier..."
                  />
                </div>

                {/* Delivery To */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Delivery Destination <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={deliveryTo}
                    onChange={(e) => setDeliveryTo(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-amber-500"
                  >
                    <option value="Pakiza Software Limited [PSL-Operation]">Pakiza Software Limited [PSL-Operation]</option>
                    <option value="Pakiza Spinning Mills Ltd (Spinning Unit)">Pakiza Spinning Mills Ltd (Spinning Unit)</option>
                    <option value="Pakiza Dyeing & Processing Plant">Pakiza Dyeing & Processing Plant</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Region / Branch <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-amber-500"
                  >
                    <option value="PSL-Operation">PSL-Operation (Head Office)</option>
                    <option value="Gazipur Unit 1">Gazipur Industrial Unit 1</option>
                    <option value="Dhamrai Plant">Dhamrai Spinning Plant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {/* PO Date */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PO Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={poDate}
                    onChange={(e) => setPoDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium outline-none focus:border-amber-500"
                  />
                </div>

                {/* PO Valid Date */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PO Valid Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={poValidDate}
                    onChange={(e) => setPoValidDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium outline-none focus:border-amber-500"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-amber-500"
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                {/* Currency Rate */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Currency Exchange Rate</label>
                  <input
                    type="text"
                    value={curRate}
                    onChange={(e) => setCurRate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Addresses & Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Supplier Address &amp; Contact</label>
                  <textarea
                    rows={2}
                    value={`${supplierInfo.address} | ${supplierInfo.contact}`}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-normal text-slate-600 dark:text-slate-400 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Delivery Address &amp; Contact</label>
                  <textarea
                    rows={2}
                    value={`${deliveryAddress} | ${deliveryContact}`}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-normal text-slate-600 dark:text-slate-400 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Reference No */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Reference No</label>
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-amber-500"
                  />
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-amber-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="30 Days Credit">30 Days Credit</option>
                    <option value="At Sight L/C">At Sight L/C</option>
                    <option value="Credit / LC 90 Days">Credit / LC 90 Days</option>
                  </select>
                </div>

                {/* Comments */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PO Remarks / Comments</label>
                  <input
                    type="text"
                    placeholder="Optional header notes..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-normal outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: MULTI-SELECT REQUISITIONS & UNIFIED ITEMS TABLE */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border/80 pb-3">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="size-4 text-amber-500" /> Multi-Requisition Selection &amp; Combined Items
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-900/50">
                  {selectedReqNos.length} Requisition(s) Selected
                </span>
              </div>

              {/* Multi-Requisition Picker Header & Trigger */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Select Requisitions to Include in PO
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTempSelectedReqNos([...selectedReqNos]);
                      setModalSearchQuery("");
                      setIsReqModalOpen(true);
                    }}
                    className="h-10 px-4 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer shrink-0"
                  >
                    <Plus className="size-4 stroke-[2.5]" /> Select / Browse Requisitions
                  </button>
                </div>

                {/* Selected Requisition Chips */}
                {selectedReqNos.length > 0 ? (
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Active Included Requisitions ({selectedReqNos.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedReqNos.map((reqNo) => {
                        const reqData = SAMPLE_REQUISITIONS.find((r) => r.reqNo === reqNo);
                        return (
                          <div
                            key={reqNo}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-700/60 shadow-sm text-xs"
                          >
                            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{reqNo}</span>
                            {reqData && (
                              <span className="text-slate-600 dark:text-slate-400 max-w-[200px] truncate hidden md:inline">
                                ({reqData.title})
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (selectedReqNos.length > 1) {
                                  setSelectedReqNos(selectedReqNos.filter((r) => r !== reqNo));
                                } else {
                                  alert("At least one requisition must be selected for the PO.");
                                }
                              }}
                              className="text-slate-400 hover:text-rose-500 transition p-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Remove Requisition"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50">
                    No requisition selected. Click "+ Select / Browse Requisitions" to pick requisitions.
                  </div>
                )}
              </div>

              {/* Unified Items Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs space-y-0">
                <div className="p-3 bg-slate-100/90 dark:bg-slate-800/90 font-bold text-slate-700 dark:text-slate-200 text-[11px] uppercase tracking-wider flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
                  <span>Requisition Items ({activePoItems.length} Total Items)</span>
                  <span className="text-[10px] font-normal text-slate-500">
                    Toggle checkboxes to include/exclude items in this PO
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="p-3 text-center w-10">SL</th>
                        <th className="p-3 text-center w-10">INC</th>
                        <th className="p-3 text-center w-24">REQ NO</th>
                        <th className="p-3">ITEM DESCRIPTION &amp; SPEC</th>
                        <th className="p-3 text-center w-14">UOM</th>
                        <th className="p-3 text-center w-20">APPROVED QTY</th>
                        <th className="p-3 text-center w-20">REMAIN QTY</th>
                        <th className="p-3 text-center w-24">PURCHASE QTY</th>
                        <th className="p-3 text-right w-28">UNIT PRICE</th>
                        <th className="p-3 text-right w-24">DISCOUNT</th>
                        <th className="p-3 text-right w-24">NET PRICE</th>
                        <th className="p-3 text-right w-28">LINE TOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-transparent font-normal">
                      {activePoItems.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`transition ${
                            item.enabled
                              ? "hover:bg-slate-50 dark:hover:bg-slate-900"
                              : "opacity-40 bg-slate-50/50 dark:bg-slate-900/40"
                          }`}
                        >
                          <td className="p-3 text-center text-slate-500 font-normal">{index + 1}</td>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={item.enabled}
                              onChange={(e) =>
                                setItemInputs({
                                  ...itemInputs,
                                  [item.id]: {
                                    qty: item.qty,
                                    price: item.unitPrice,
                                    discount: item.discount,
                                    enabled: e.target.checked,
                                  },
                                })
                              }
                              className="size-4 accent-amber-500 rounded cursor-pointer"
                            />
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                            {item.reqNo}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900 dark:text-white text-xs">{item.name}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{item.spec}</div>
                          </td>
                          <td className="p-3 text-center font-semibold text-slate-600 dark:text-slate-400">{item.uom}</td>
                          <td className="p-3 text-center font-mono text-slate-500">{item.approvedQty}</td>
                          <td className="p-3 text-center font-mono font-bold text-amber-600 dark:text-amber-400">
                            {item.remainQty}
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min={1}
                              disabled={!item.enabled}
                              value={item.qty}
                              onChange={(e) =>
                                setItemInputs({
                                  ...itemInputs,
                                  [item.id]: {
                                    qty: parseFloat(e.target.value) || 0,
                                    price: item.unitPrice,
                                    discount: item.discount,
                                    enabled: item.enabled,
                                  },
                                })
                              }
                              className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-700 rounded-lg text-center font-mono font-bold text-xs bg-slate-50 dark:bg-slate-900 outline-none focus:border-amber-500 disabled:opacity-50"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              disabled={!item.enabled}
                              value={item.unitPrice}
                              onChange={(e) =>
                                setItemInputs({
                                  ...itemInputs,
                                  [item.id]: {
                                    qty: item.qty,
                                    price: parseFloat(e.target.value) || 0,
                                    discount: item.discount,
                                    enabled: item.enabled,
                                  },
                                })
                              }
                              className="w-24 px-2 py-1 border border-slate-300 dark:border-slate-700 rounded-lg text-right font-mono font-bold text-xs bg-slate-50 dark:bg-slate-900 outline-none focus:border-amber-500 disabled:opacity-50"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              disabled={!item.enabled}
                              value={item.discount}
                              onChange={(e) =>
                                setItemInputs({
                                  ...itemInputs,
                                  [item.id]: {
                                    qty: item.qty,
                                    price: item.unitPrice,
                                    discount: parseFloat(e.target.value) || 0,
                                    enabled: item.enabled,
                                  },
                                })
                              }
                              className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-700 rounded-lg text-right font-mono text-xs bg-slate-50 dark:bg-slate-900 outline-none focus:border-amber-500 disabled:opacity-50"
                            />
                          </td>
                          <td className="p-3 text-right font-mono font-semibold">{item.netPrice.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                            {currency === "USD" ? "$" : "৳"}
                            {item.lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}

                      {activePoItems.length === 0 && (
                        <tr>
                          <td colSpan={12} className="p-8 text-center text-slate-400 font-medium">
                            No requisitions selected. Please select at least one Requisition above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SECTION 3: SMART TERMS & CONDITIONS CONFIGURATION SELECTOR */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border/80 pb-3">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-600" /> Smart Terms &amp; Conditions Configuration
                  </h3>
                </div>
              </div>

              {/* Template Preset Selector Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Preset T&amp;C Template (From Configuration)
                  </label>
                  <SearchableSelect
                    options={Object.keys(TNC_TEMPLATES).map((key) => ({
                      value: key,
                      label: key,
                    }))}
                    value={selectedTncTemplate}
                    onChange={handleLoadTncTemplate}
                    placeholder="Choose Terms Template..."
                  />
                </div>

                <div className="shrink-0 text-right pt-4 sm:pt-0">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Active Clauses: <span className="font-bold text-amber-600 dark:text-amber-400">{selectedTerms.length} Selected</span>
                  </span>
                </div>
              </div>

              {/* Search Filter for Terms */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search terms & conditions..."
                  value={termSearchQuery}
                  onChange={(e) => setTermSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-400 transition"
                />
              </div>

              {/* Terms Checklist */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {selectedTerms
                  .filter((term) => !termSearchQuery || term.toLowerCase().includes(termSearchQuery.toLowerCase()))
                  .map((term, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (selectedTerms.includes(term)) {
                          setSelectedTerms(selectedTerms.filter((t) => t !== term));
                        } else {
                          setSelectedTerms([...selectedTerms, term]);
                        }
                      }}
                      className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 transition cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTerms.includes(term)}
                        onChange={() => {}}
                        className="mt-0.5 size-4 accent-slate-800 rounded cursor-pointer shrink-0"
                      />
                      <span className="text-slate-800 dark:text-slate-200 leading-relaxed font-normal flex-1">
                        <span className="font-bold mr-1.5">{idx + 1}.</span> {term}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Add Custom Term Input */}
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
                        setSelectedTerms([...selectedTerms, customTermInput.trim()]);
                        setCustomTermInput("");
                      }
                    }
                  }}
                  className="flex-1 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customTermInput.trim()) {
                      setSelectedTerms([...selectedTerms, customTermInput.trim()]);
                      setCustomTermInput("");
                    }
                  }}
                  className="h-9 px-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                >
                  <Plus className="size-4" /> Add Clause
                </button>
              </div>
            </div>

            {/* SECTION 4: FINANCIAL SUMMARY & SAVE ACTION BAR */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6 bg-card border border-border rounded-2xl shadow-sm p-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                  Advance &amp; Payment Options
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Advance Payment Amount ({currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Financial Calculations Box */}
              <div className="md:col-span-6 bg-card border border-border rounded-2xl shadow-sm p-6 space-y-3 font-mono text-xs">
                <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-800 dark:text-slate-100">
                  Financial Summary
                </h4>
                <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="font-sans font-medium">Gross Amount:</span>
                    <span className="font-bold">{currency === "USD" ? "$" : "৳"}{grossAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="font-sans font-medium">Discount Total:</span>
                    <span className="font-bold text-rose-500">-{currency === "USD" ? "$" : "৳"}{totalDiscount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="font-sans">Net Amount:</span>
                    <span>{currency === "USD" ? "$" : "৳"}{netAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="font-sans font-medium">Advance Deducted:</span>
                    <span className="font-bold">-{currency === "USD" ? "$" : "৳"}{advanceAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center font-black text-sm text-emerald-600 dark:text-emerald-400 pt-2 border-t-2 border-slate-900 dark:border-slate-100">
                    <span className="font-sans uppercase">Grand Total Payable:</span>
                    <span>{currency === "USD" ? "$" : "৳"}{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Save Action Footer */}
            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-muted-foreground font-normal">
                Ready to generate Purchase Order for <strong className="text-foreground">{selectedReqNos.length} Requisitions</strong> with <strong className="text-foreground">{enabledItems.length} Items</strong> and <strong className="text-foreground">{selectedTerms.length} Terms &amp; Conditions</strong>.
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/procurement-cs-create-workorder" })}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
                >
                  <Save className="size-4" /> Save &amp; Generate Purchase Order
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* REQUISITION SELECTION MODAL */}
        {isReqModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-5 border-b border-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="size-5 text-amber-500" /> Select Requisitions for Purchase Order
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose approved requisitions to combine their items into this PO workspace.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReqModalOpen(false)}
                  className="size-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Filter Search */}
              <div className="p-4 bg-slate-50/30 dark:bg-slate-900/30 border-b border-border flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Requisition ID, Title, or Date..."
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-normal outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTempSelectedReqNos(SAMPLE_REQUISITIONS.map((r) => r.reqNo))}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempSelectedReqNos([])}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Modal Body / Table */}
              <div className="p-4 overflow-y-auto flex-1 space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  {SAMPLE_REQUISITIONS.filter(
                    (r) =>
                      !modalSearchQuery ||
                      r.reqNo.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                      r.title.toLowerCase().includes(modalSearchQuery.toLowerCase())
                  ).map((req) => {
                    const isChecked = tempSelectedReqNos.includes(req.reqNo);
                    const totalEst = req.items.reduce((acc, i) => acc + i.remainQty * i.defaultPrice, 0);
                    return (
                      <div
                        key={req.reqNo}
                        onClick={() => {
                          if (isChecked) {
                            setTempSelectedReqNos(tempSelectedReqNos.filter((id) => id !== req.reqNo));
                          } else {
                            setTempSelectedReqNos([...tempSelectedReqNos, req.reqNo]);
                          }
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                          isChecked
                            ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-500 dark:border-amber-500/80 shadow-sm"
                            : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`size-5 mt-0.5 rounded-md border flex items-center justify-center shrink-0 transition ${
                            isChecked
                              ? "bg-amber-500 border-amber-500 text-white"
                              : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                          }`}
                        >
                          {isChecked && <Check className="size-3.5 stroke-[3]" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                                {req.reqNo}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-900">
                                Approved
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">Req Date: {req.date}</span>
                          </div>

                          <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">{req.title}</p>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap justify-between items-center gap-2 text-[11px]">
                            <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                              <Sparkles className="size-3" /> {req.items.length} Item(s) Included
                            </span>
                            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                              Est. Total: ৳{totalEst.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <strong className="text-amber-500 font-bold">{tempSelectedReqNos.length}</strong> Requisition(s) Selected
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsReqModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (tempSelectedReqNos.length === 0) {
                        alert("Please select at least one requisition.");
                        return;
                      }
                      setSelectedReqNos(tempSelectedReqNos);
                      setIsReqModalOpen(false);
                    }}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <CheckCircle2 className="size-4" /> Apply Selection &amp; Proceed
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
