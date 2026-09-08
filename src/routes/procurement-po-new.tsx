import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Plus,
  Trash2,
  Building2,
  Save,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  FileText,
  Boxes,
  ShieldCheck,
  ChevronRight,
  Home,
} from "lucide-react";

export const Route = createFileRoute("/procurement-po-new")({
  head: () => ({
    meta: [
      { title: "Create Purchase Order — CRIPTON Procurement" },
      { name: "description", content: "Create New Purchase Order with PO Details, Item Details, and Financial Summary." },
    ],
  }),
  component: CreatePurchaseOrderPage,
});

// Sample Pre-populated Items catalog
const ITEM_CATALOG = [
  { id: "IT-001", group: "Spare Parts", name: "Ricoh MP 2555 Cleaning Blade", spec: "Heavy Duty Polyurethane Blade", uom: "PCS", price: 450.0 },
  { id: "IT-002", group: "Spare Parts", name: "Ricoh MP 2555 OPC Drum", spec: "Original OPC Drum Assembly", uom: "PCS", price: 2800.0 },
  { id: "IT-003", group: "Electrical Equipment", name: "MK One Gang Socket 13A", spec: "Flush Mounting Single", uom: "PCS", price: 350.0 },
  { id: "IT-004", group: "Electrical Equipment", name: "PVC Tape High Insulation", spec: "Flame Retardant Black 20m", uom: "PCS", price: 25.0 },
  { id: "IT-005", group: "Textile Yarn", name: "30s Carded Cotton Yarn 100% Ring Spun", spec: "Weaving Grade 100% Cotton", uom: "Kg", price: 3.40 },
  { id: "IT-006", group: "Dyes & Chemicals", name: "Reactive Dye Blue B (99% Fixation)", spec: "Textile Dyeing Grade", uom: "Kg", price: 6.20 },
];

const BILL_TO_ADDRESSES: Record<string, { address: string; contact: string }> = {
  "Pakiza Software Limited [PSL-Operation]": {
    address: "House# 97, Road# 11/A, Dhanmondi, Dhaka-1209, Bangladesh.",
    contact: "Md. Jahangir Alam (Manager Procurement) — 01711223344",
  },
  "Pakiza Spinning Mills Ltd (Spinning Unit)": {
    address: "Plot #12-16, BSCIC Industrial Area, Dhamrai, Dhaka, Bangladesh.",
    contact: "Engr. Monirul Islam (Plant Manager) — 01819887766",
  },
  "Pakiza Apparel Accessories Ltd": {
    address: "Khan ABC Tradeplex House#37, Floor#11, Road#2, Dhaka-1205.",
    contact: "Store & Receiving In-Charge — 01912345678",
  },
};

// Terms & Conditions Preset Templates from Configuration
const TNC_TEMPLATES: Record<string, string[]> = {
  "Standard Local Purchase Terms": [
    "Total payment will be done after delivery.",
    "Please refer to the W.O. # in all correspondence.",
    "Total bill will be at actual quantity.",
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

interface AddedPoItem {
  id: string;
  store: string;
  group: string;
  name: string;
  uom: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export function CreatePurchaseOrderPage() {
  const navigate = useNavigate();

  // PO Details Form State
  const [poType, setPoType] = useState("Work Order");
  const [itemType, setItemType] = useState("Material");
  const [billTo, setBillTo] = useState("Pakiza Software Limited [PSL-Operation]");
  const [deliveryTo, setDeliveryTo] = useState("Pakiza Software Limited [PSL-Operation]");
  const [poNo, setPoNo] = useState("PO/PSL/2026/000" + Math.floor(100 + Math.random() * 900));
  const [poDate, setPoDate] = useState("08/09/2026");
  const [poValidDate, setPoValidDate] = useState("08/10/2026");
  const [currency, setCurrency] = useState("USD");
  const [curRate, setCurRate] = useState("120.00");
  const [referenceNo, setReferenceNo] = useState("");
  const [billingContact, setBillingContact] = useState("Tahmid Afsar — Accounts");
  const [deliveryContact, setDeliveryContact] = useState("Store In-Charge");
  const [jobDescription, setJobDescription] = useState("");

  // Item Addition Form State
  const [itemStore, setItemStore] = useState("Main Store - Gazipur");
  const [itemGroup, setItemGroup] = useState("Spare Parts");
  const [selectedItemId, setSelectedItemId] = useState("IT-001");
  const [itemQty, setItemQty] = useState<number | "">(1);
  const [itemUnitPrice, setItemUnitPrice] = useState<number | "">(450.0);

  // Added Items List State
  const [poItems, setPoItems] = useState<AddedPoItem[]>([
    {
      id: "IT-001",
      store: "Main Store - Gazipur",
      group: "Spare Parts",
      name: "Ricoh MP 2555 Cleaning Blade",
      uom: "PCS",
      qty: 1,
      unitPrice: 450.0,
      lineTotal: 450.0,
    },
    {
      id: "IT-002",
      store: "Main Store - Gazipur",
      group: "Spare Parts",
      name: "Ricoh MP 2555 OPC Drum",
      uom: "PCS",
      qty: 1,
      unitPrice: 2800.0,
      lineTotal: 2800.0,
    },
  ]);

  // Smart Terms & Conditions State (From System Configuration)
  const [selectedTncTemplate, setSelectedTncTemplate] = useState("Standard Local Purchase Terms");
  const [selectedTerms, setSelectedTerms] = useState<string[]>([
    ...TNC_TEMPLATES["Standard Local Purchase Terms"],
  ]);
  const [customTermInput, setCustomTermInput] = useState("");
  const [termSearchQuery, setTermSearchQuery] = useState("");

  // Load T&C Template from Configuration
  const handleLoadTncTemplate = (templateName: string) => {
    setSelectedTncTemplate(templateName);
    if (TNC_TEMPLATES[templateName]) {
      setSelectedTerms([...TNC_TEMPLATES[templateName]]);
    }
  };

  // Financial Computations State
  const [discountAmt, setDiscountAmt] = useState<number>(0);
  const [vatAmt, setVatAmt] = useState<number>(0);
  const [taxAmt, setTaxAmt] = useState<number>(0);
  const [advanceAmt, setAdvanceAmt] = useState<number>(0);

  // Notification Banner
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Derived Addresses
  const billingAddress = BILL_TO_ADDRESSES[billTo]?.address || "Corporate Billing Address";
  const deliveryAddress = BILL_TO_ADDRESSES[deliveryTo]?.address || "Destination Delivery Address";

  // Handle Item Dropdown Selection Change
  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
    const item = ITEM_CATALOG.find((i) => i.id === itemId);
    if (item) {
      setItemUnitPrice(item.price);
    }
  };

  // Add Item to Table
  const handleAddItem = () => {
    const catalogItem = ITEM_CATALOG.find((i) => i.id === selectedItemId);
    if (!catalogItem) return;
    const qtyNum = typeof itemQty === "number" ? itemQty : parseFloat(itemQty) || 0;
    const priceNum = typeof itemUnitPrice === "number" ? itemUnitPrice : parseFloat(itemUnitPrice) || 0;

    if (qtyNum <= 0) {
      alert("Please enter a valid quantity greater than 0.");
      return;
    }

    const newItem: AddedPoItem = {
      id: Date.now().toString(),
      store: itemStore,
      group: itemGroup,
      name: catalogItem.name,
      uom: catalogItem.uom,
      qty: qtyNum,
      unitPrice: priceNum,
      lineTotal: qtyNum * priceNum,
    };

    setPoItems((prev) => [...prev, newItem]);
  };

  // Remove Item from Table
  const handleRemoveItem = (id: string) => {
    setPoItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Financial Calculations
  const totalAmt = useMemo(() => {
    return poItems.reduce((acc, item) => acc + item.lineTotal, 0);
  }, [poItems]);

  const grandTotal = useMemo(() => {
    return Math.max(0, totalAmt - discountAmt + vatAmt + taxAmt);
  }, [totalAmt, discountAmt, vatAmt, taxAmt]);

  const balanceAmt = useMemo(() => {
    return Math.max(0, grandTotal - advanceAmt);
  }, [grandTotal, advanceAmt]);

  // Save / Submit PO Workflow
  const handleSavePurchaseOrder = (status: "Draft" | "Submitted") => {
    if (poItems.length === 0) {
      alert("Please add at least one item to the Purchase Order.");
      return;
    }

    const newPoRecord = {
      id: Date.now().toString(),
      poNo: poNo,
      poDate: poDate,
      csRef: referenceNo || `WO-REF-${Math.floor(100 + Math.random() * 900)}`,
      reqNo: "DIRECT-PO",
      supplier: billTo,
      supplierContact: billingContact,
      deliveryTo: deliveryTo,
      deliveryContact: deliveryContact,
      jobDescription: jobDescription || `${poType} for ${itemType} procurement`,
      poValidDate: poValidDate,
      paymentMode: "Credit / LC",
      grossAmount: totalAmt,
      discount: discountAmt,
      grandTotal: grandTotal,
      netAmount: grandTotal,
      advance: advanceAmt,
      status: status,
      preparedBy: "Tahmid Afsar",
      preparedDesignation: "Procurement Officer",
      preparedDate: new Date().toLocaleString("en-GB"),
      selectedTerms: selectedTerms,
      items: poItems.map((item, idx) => ({
        sl: idx + 1,
        description: item.name,
        uom: item.uom,
        qty: item.qty,
        unitPrice: item.unitPrice,
        discount: 0,
        netPrice: item.unitPrice,
        currency: currency,
        curRate: parseFloat(curRate) || 1.0,
        amount: item.lineTotal,
        amountBdt: item.lineTotal * (parseFloat(curRate) || 1.0),
      })),
    };

    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("procurement_cs_po_list_v3");
      let list = [];
      if (existing) {
        try {
          list = JSON.parse(existing);
        } catch (e) {}
      }
      localStorage.setItem("procurement_cs_po_list_v3", JSON.stringify([newPoRecord, ...list]));
    }

    setSuccessMessage(
      `Purchase Order ${poNo} has been successfully ${status === "Submitted" ? "Submitted for Approval" : "Saved as Draft"}!`
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-100/70 dark:bg-background text-foreground transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-5 w-full max-w-[1600px] mx-auto">
          {/* Top Breadcrumb & Page Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-card p-4 rounded-2xl border border-border shadow-2xs">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
                <Home className="size-3.5" />
                <span>Home</span>
                <ChevronRight className="size-3" />
                <span>Purchase</span>
                <ChevronRight className="size-3" />
                <span className="text-blue-600 dark:text-blue-400 font-bold">Create Purchase Order</span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Building2 className="size-5.5 text-blue-600 dark:text-blue-400" />
                Create Purchase Order
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPoItems([]);
                  setJobDescription("");
                  setSuccessMessage(null);
                }}
                className="h-9 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className="size-3.5" /> Reset Form
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/procurement-cs-create-workorder" })}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <FileText className="size-4" /> View PO List
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-in fade-in duration-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
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
                  onClick={() => setSuccessMessage(null)}
                  className="px-2 py-1 text-emerald-700 hover:text-emerald-950 text-xs font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* MAIN FORM CONTENT */}
          <div className="space-y-6">
            {/* CARD 1: PO DETAILS */}
            <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-xs p-6 space-y-5">
              <div className="border-b border-border/80 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Building2 className="size-4" /> PO Details
                </h3>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {/* Type * */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={poType}
                    onChange={(e) => setPoType(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-blue-500"
                  >
                    <option value="Work Order">Work Order</option>
                    <option value="Purchase Order">Purchase Order</option>
                  </select>
                </div>

                {/* ItemType */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ItemType</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-blue-500"
                  >
                    <option value="Material">Material</option>
                    <option value="Service">Service</option>
                    <option value="Spare Parts">Spare Parts</option>
                    <option value="Chemicals">Chemicals</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                {/* Bill To * */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bill To <span className="text-rose-500">*</span>
                  </label>
                  <SearchableSelect
                    options={[
                      { value: "Pakiza Software Limited [PSL-Operation]", label: "Pakiza Software Limited [PSL-Operation]" },
                      { value: "Pakiza Spinning Mills Ltd (Spinning Unit)", label: "Pakiza Spinning Mills Ltd (Spinning Unit)" },
                      { value: "Pakiza Apparel Accessories Ltd", label: "Pakiza Apparel Accessories Ltd" },
                    ]}
                    value={billTo}
                    onChange={setBillTo}
                    placeholder="Select Bill To..."
                  />
                </div>

                {/* Delivery To * */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Delivery To <span className="text-rose-500">*</span>
                  </label>
                  <SearchableSelect
                    options={[
                      { value: "Pakiza Software Limited [PSL-Operation]", label: "Pakiza Software Limited [PSL-Operation]" },
                      { value: "Pakiza Spinning Mills Ltd (Spinning Unit)", label: "Pakiza Spinning Mills Ltd (Spinning Unit)" },
                      { value: "Pakiza Apparel Accessories Ltd", label: "Pakiza Apparel Accessories Ltd" },
                    ]}
                    value={deliveryTo}
                    onChange={setDeliveryTo}
                    placeholder="Select Delivery To..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {/* PO No */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PO No</label>
                  <input
                    type="text"
                    value={poNo}
                    onChange={(e) => setPoNo(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 outline-none"
                  />
                </div>

                {/* PO Valid Date * */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PO Valid Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={poValidDate}
                    onChange={(e) => setPoValidDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                {/* Billing Address * */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Billing Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={billingAddress}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 outline-none resize-none"
                  />
                </div>

                {/* Delivery Address * */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Delivery Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {/* PO Date * */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PO Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={poDate}
                    onChange={(e) => setPoDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="BDT">BDT (৳)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                {/* Billing Contact Person * */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Billing Contact Person <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={billingContact}
                    onChange={(e) => setBillingContact(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>

                {/* Delivery Contact Person * */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Delivery Contact Person <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryContact}
                    onChange={(e) => setDeliveryContact(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {/* Reference No */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Reference No</label>
                  <input
                    type="text"
                    placeholder="Enter reference number..."
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>

                {/* Currency Rate * */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Currency Rate <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={curRate}
                    onChange={(e) => setCurRate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Job Description</label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed job description or order summary notes..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-normal outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* CARD 2: PO ITEM DETAILS */}
            <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-xs p-6 space-y-5">
              <div className="border-b border-border/80 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Boxes className="size-4" /> PO Item Details
                </h3>
              </div>

              {/* Item Adder Controls Bar */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Item Store <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={itemStore}
                    onChange={(e) => setItemStore(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium outline-none focus:border-blue-500"
                  >
                    <option value="Main Store - Gazipur">Main Store - Gazipur</option>
                    <option value="Central Store - Dhanmondi">Central Store - Dhanmondi</option>
                    <option value="Accessories Store">Accessories Store</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Item Group <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={itemGroup}
                    onChange={(e) => setItemGroup(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium outline-none focus:border-blue-500"
                  >
                    <option value="Spare Parts">Spare Parts</option>
                    <option value="Textile Yarn">Textile Yarn</option>
                    <option value="Dyes & Chemicals">Dyes &amp; Chemicals</option>
                    <option value="Electrical Equipment">Electrical Equipment</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Items <span className="text-rose-500">*</span>
                  </label>
                  <SearchableSelect
                    options={ITEM_CATALOG.filter((i) => !itemGroup || i.group === itemGroup).map((i) => ({
                      value: i.id,
                      label: `${i.name} (${i.spec})`,
                    }))}
                    value={selectedItemId}
                    onChange={handleItemSelect}
                    placeholder="Select Item..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={itemQty}
                    onChange={(e) => setItemQty(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    className="w-full h-9 px-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold text-center outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Unit Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={itemUnitPrice}
                      onChange={(e) => setItemUnitPrice(e.target.value === "" ? "" : parseFloat(e.target.value))}
                      className="w-full h-9 px-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold text-right outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition cursor-pointer shrink-0 shadow-xs"
                  >
                    ADD
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-rose-50/70 dark:bg-rose-950/30 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      <th className="p-3 text-center w-12 border-r border-slate-200/60 dark:border-slate-800">SL</th>
                      <th className="p-3 border-r border-slate-200/60 dark:border-slate-800">Item Description</th>
                      <th className="p-3 text-center w-20 border-r border-slate-200/60 dark:border-slate-800">Uom</th>
                      <th className="p-3 text-center w-24 border-r border-slate-200/60 dark:border-slate-800">Quantity</th>
                      <th className="p-3 text-right w-28 border-r border-slate-200/60 dark:border-slate-800">Unit Price</th>
                      <th className="p-3 text-right w-32 border-r border-slate-200/60 dark:border-slate-800">Line Total</th>
                      <th className="p-3 text-center w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-transparent font-normal">
                    {poItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                        <td className="p-3 text-center text-slate-500 border-r border-slate-100 dark:border-slate-800/40">
                          {index + 1}
                        </td>
                        <td className="p-3 border-r border-slate-100 dark:border-slate-800/40 font-semibold text-slate-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="p-3 text-center font-medium text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/40">
                          {item.uom}
                        </td>
                        <td className="p-3 text-center font-mono font-semibold border-r border-slate-100 dark:border-slate-800/40">
                          {item.qty}
                        </td>
                        <td className="p-3 text-right font-mono border-r border-slate-100 dark:border-slate-800/40">
                          {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/40">
                          {item.lineTotal.toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-rose-500 hover:text-rose-700 transition p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Remove Item"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {poItems.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                          No items added yet. Select an item above and click ADD.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Layout: Terms & Conditions (Left) and Financial Summary (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                {/* Left Side: Terms & Conditions Configuration Selector */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Terms &amp; Conditions (From Configuration)
                    </label>
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      {selectedTerms.length} Active Clause(s)
                    </span>
                  </div>

                  {/* Preset Template Selector */}
                  <div>
                    <SearchableSelect
                      options={Object.keys(TNC_TEMPLATES).map((key) => ({
                        value: key,
                        label: key,
                      }))}
                      value={selectedTncTemplate}
                      onChange={handleLoadTncTemplate}
                      placeholder="Select Preset T&C Template..."
                    />
                  </div>

                  {/* Search terms */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Filter or search clauses..."
                      value={termSearchQuery}
                      onChange={(e) => setTermSearchQuery(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Interactive Terms List */}
                  <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
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
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 transition cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTerms.includes(term)}
                            onChange={() => {}}
                            className="mt-0.5 size-3.5 accent-blue-600 rounded cursor-pointer shrink-0"
                          />
                          <span className="text-slate-800 dark:text-slate-200 leading-normal font-medium flex-1">
                            <strong className="mr-1">{idx + 1}.</strong> {term}
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Add Custom Clause */}
                  <div className="flex items-center gap-2 pt-0.5">
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
                      className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-xs outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customTermInput.trim()) {
                          setSelectedTerms([...selectedTerms, customTermInput.trim()]);
                          setCustomTermInput("");
                        }
                      }}
                      className="h-8 px-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg flex items-center gap-1 shrink-0 transition cursor-pointer"
                    >
                      <Plus className="size-3.5" /> Add
                    </button>
                  </div>
                </div>

                {/* Right Side: Financial Calculation Table */}
                <div className="lg:col-span-5 bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center py-1">
                    <span className="font-sans font-bold text-slate-700 dark:text-slate-300">Total Amt :</span>
                    <span className="font-bold text-slate-900 dark:text-white">{totalAmt.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="font-sans font-bold text-slate-700 dark:text-slate-300">Discount :</span>
                    <input
                      type="number"
                      step="0.01"
                      value={discountAmt}
                      onChange={(e) => setDiscountAmt(parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-slate-300 dark:border-slate-700 rounded-md text-right font-mono text-xs bg-white dark:bg-slate-950 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="font-sans font-bold text-slate-700 dark:text-slate-300">VAT Amt :</span>
                    <input
                      type="number"
                      step="0.01"
                      value={vatAmt}
                      onChange={(e) => setVatAmt(parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-slate-300 dark:border-slate-700 rounded-md text-right font-mono text-xs bg-white dark:bg-slate-950 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="font-sans font-bold text-slate-700 dark:text-slate-300">TAX Amt :</span>
                    <input
                      type="number"
                      step="0.01"
                      value={taxAmt}
                      onChange={(e) => setTaxAmt(parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-slate-300 dark:border-slate-700 rounded-md text-right font-mono text-xs bg-white dark:bg-slate-950 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-between items-center py-1.5 px-2 bg-slate-200/80 dark:bg-slate-800 rounded-lg font-bold text-slate-900 dark:text-white">
                    <span className="font-sans">Grand Total :</span>
                    <span>{grandTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="font-sans font-bold text-slate-700 dark:text-slate-300">Advance :</span>
                    <input
                      type="number"
                      step="0.01"
                      value={advanceAmt}
                      onChange={(e) => setAdvanceAmt(parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-slate-300 dark:border-slate-700 rounded-md text-right font-mono text-xs bg-white dark:bg-slate-950 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-between items-center py-1.5 px-2 bg-slate-200/80 dark:bg-slate-800 rounded-lg font-bold text-slate-900 dark:text-white">
                    <span className="font-sans">Balance :</span>
                    <span>{balanceAmt.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Submit & Save Action Buttons */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleSavePurchaseOrder("Draft")}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer uppercase tracking-wider"
                >
                  SAVE
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePurchaseOrder("Submitted")}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer uppercase tracking-wider"
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
