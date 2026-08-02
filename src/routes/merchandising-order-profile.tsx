import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import { List, Plus, X, UploadCloud, Save, ArrowRight, LayoutGrid, Layers } from "lucide-react";

type OrderProfileSearch = {
  type?: "Knit" | "Woven" | "Sweater";
  editId?: string;
};

export const Route = createFileRoute("/merchandising-order-profile")({
  validateSearch: (search: Record<string, unknown>): OrderProfileSearch => {
    return {
      type: (search.type as "Knit" | "Woven" | "Sweater") || "Knit",
      editId: search.editId as string | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Order Profile — Merchandising" }
    ],
  }),
  component: MerchandisingOrderProfilePage,
});

// Interfaces
interface SizeQty { size: string; qty: number; }
interface OrderStyle {
  id: string; styleNo: string; color: string; itemName: string; qty: number;
  sizeGroup: string; sizes: string[]; sizesQty: number[]; print: string;
  embroidery: string; wash: string; special: string; unitPrice: number; deliveryDate: string;
}

const MOCK_REGISTERED_POS = [
  {
    poNumber: "PO-HM-9801",
    quotationNo: "QT-2026-001",
    buyerName: "H&M Group (SE)",
    styleRef: "HM-SS26-KNT-001",
    productType: "Knit" as const,
    quantity: 50000,
    unitFOB: 3.82,
    totalValue: 191000,
    receiveDate: "2026-08-01",
    shipDate: "2026-10-15",
    shipmentMode: "Sea",
    paymentTerms: "90 Days BBLC",
    portOfLoading: "Chittagong, BD",
    portOfDischarge: "Gothenburg, SE",
    buyingHouse: "Li & Fung",
    department: "Boys",
    season: "ANS-SS27",
    itemDescription: "Men's Basic Round Neck T-Shirt",
    lcNumber: "LC-HM-2026-4412",
    lcValue: 191000,
    lcAdvisingBank: "Standard Chartered BD",
    lcIssueDate: "2026-08-01",
    nominatedYarnSupplier: "Simco Spinning Ltd",
    nominatedFabricSupplier: "Pakiza Knit Composite",
    nominatedTrimsSupplier: "Coats Bangladesh"
  },
  {
    poNumber: "PO-ZR-4521",
    quotationNo: "QT-2026-002",
    buyerName: "ZARA (Inditex)",
    styleRef: "ZR-AW26-WVN-045",
    productType: "Woven" as const,
    quantity: 25000,
    unitFOB: 7.42,
    totalValue: 185500,
    receiveDate: "2026-08-02",
    shipDate: "2026-11-30",
    shipmentMode: "Sea",
    paymentTerms: "At Sight LC",
    portOfLoading: "Chittagong, BD",
    portOfDischarge: "Valencia, ES",
    buyingHouse: "Synergy",
    department: "Women",
    season: "FW27",
    itemDescription: "Ladies Casual Shirt",
    lcNumber: "LC-ZR-2026-0091",
    lcValue: 185500,
    lcAdvisingBank: "HSBC Bangladesh",
    lcIssueDate: "2026-08-02",
    nominatedYarnSupplier: "Apex Spinning Ltd",
    nominatedFabricSupplier: "Hamid Fabrics Ltd",
    nominatedTrimsSupplier: "YKK Bangladesh"
  }
];

function MerchandisingOrderProfilePage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const orderType = search.type || "Knit";  // 1. Order Basic Information State with dynamic RMG parameters
  const [basicInfo, setBasicInfo] = useState({
    jobNo: "5", queryNo: "5", orderQty: 7000, queryType: "Regular",
    refNo: "PO#12", queryDate: "2026-07-23", buyingHouse: "ITPS", buyerName: "ITPS",
    department: "Boys", orderType: orderType, opd: "2026-07-23", shipDate: "2026-07-31",
    styleNo: "", itemType: "", buyerAgent: "select...", buyerBrand: "",
    qualityLevel: "AQL Standard", season: "ANS-SS27", factory: "select...",
    currency: "USD", exchangeRate: 121, shippingMode: "Sea", payTerm: "120 Days BBLC",
    tenor: "", specialInstructions: "", penaltyClauses: "", repeatedJobNo: "select...",
    // Knit specific
    fabricGsm: "160",
    knitStructure: "Single Jersey",
    yarnComposition: "98% Cotton 2% Spandex",
    // Woven specific
    warpWeftCount: "40s x 40s",
    fabricConstruction: "133 x 72",
    weaveDensity: "2/1 Twill",
    // Sweater specific
    gauge: "12GG",
    yarnPly: "2/32 Nm",
    knittingPattern: "Jacquard",
    // LC & nominations fields
    lcNumber: "",
    lcValue: 0,
    lcAdvisingBank: "",
    lcIssueDate: "",
    nominatedYarnSupplier: "",
    nominatedFabricSupplier: "",
    nominatedTrimsSupplier: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 2. Order Style Information State
  const [styleForm, setStyleForm] = useState({
    styleNo: "", color: "Select...", styleOrderQty: "", cuttingPct: 0.00,
    unitPrice: 0, deliveryDate: "2026-07-31", itemType: "Pcs", sizeGroup: ""
  });

  // Size Modal
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showFabricModal, setShowFabricModal] = useState(false);
  const [showYarnModal, setShowYarnModal] = useState(false);
  const [showTrimsModal, setShowTrimsModal] = useState(false);

  const [sizeQtys, setSizeQtys] = useState<SizeQty[]>([
    { size: "XS", qty: 1050 }, { size: "S", qty: 1050 }, { size: "M", qty: 1050 },
    { size: "L", qty: 1050 }, { size: "XL", qty: 1050 }, { size: "2XL", qty: 700 }, { size: "3XL", qty: 1050 }
  ]);

  // Process Toggles
  const [processes, setProcesses] = useState({ print: false, embroidery: false, wash: false, special: false });

  // 3. Style Summary List
  const [stylesList, setStylesList] = useState<OrderStyle[]>([
    {
      id: "style-1", styleNo: "", color: "", itemName: "", qty: 7000, sizeGroup: "XS-3XL",
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"], sizesQty: [1050, 1050, 1050, 1050, 1050, 700, 1050],
      print: "Pigment (Chest)", embroidery: "Plain", wash: "Garment dyed", special: "",
      unitPrice: 5, deliveryDate: "31/07/2026"
    }
  ]);

  useEffect(() => {
    if (search.editId) {
      const matched = MOCK_REGISTERED_POS.find(p => p.poNumber === search.editId);
      if (matched) {
        setBasicInfo(prev => ({
          ...prev,
          refNo: matched.poNumber,
          queryNo: matched.quotationNo,
          buyerName: matched.buyerName,
          styleNo: matched.styleRef,
          orderQty: matched.quantity,
          shipDate: matched.shipDate,
          shippingMode: matched.shipmentMode,
          payTerm: matched.paymentTerms,
          buyingHouse: matched.buyingHouse,
          department: matched.department,
          season: matched.season,
          orderType: matched.productType,
          lcNumber: matched.lcNumber || "",
          lcValue: matched.lcValue || 0,
          lcAdvisingBank: matched.lcAdvisingBank || "",
          lcIssueDate: matched.lcIssueDate || "",
          nominatedYarnSupplier: matched.nominatedYarnSupplier || "",
          nominatedFabricSupplier: matched.nominatedFabricSupplier || "",
          nominatedTrimsSupplier: matched.nominatedTrimsSupplier || "",
        }));
        
        setStyleForm(prev => ({
          ...prev,
          styleNo: matched.styleRef,
          styleOrderQty: String(matched.quantity),
          unitPrice: matched.unitFOB,
          deliveryDate: matched.shipDate,
        }));
        
        setStylesList([
          {
            id: "style-1",
            styleNo: matched.styleRef,
            color: "Navy Blue",
            itemName: matched.itemDescription,
            qty: matched.quantity,
            sizeGroup: "XS-3XL",
            sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
            sizesQty: [
              Math.round(matched.quantity * 0.15),
              Math.round(matched.quantity * 0.15),
              Math.round(matched.quantity * 0.15),
              Math.round(matched.quantity * 0.15),
              Math.round(matched.quantity * 0.15),
              Math.round(matched.quantity * 0.10),
              Math.round(matched.quantity * 0.15),
            ],
            print: "Chest Print",
            embroidery: "None",
            wash: "Normal Wash",
            special: "None",
            unitPrice: matched.unitFOB,
            deliveryDate: matched.shipDate,
          }
        ]);
        toast.success(`Successfully loaded contract details for PO: ${matched.poNumber}`);
      }
    }
  }, [search.editId]);

  // Costing
  const [additionalCosting, setAdditionalCosting] = useState(false);

  // Calculations
  const planCutQty = useMemo(() => {
    const qty = Number(styleForm.styleOrderQty) || 0;
    const cut = styleForm.cuttingPct || 0;
    return Math.round(qty * (1 + cut / 100));
  }, [styleForm.styleOrderQty, styleForm.cuttingPct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdateOrder = () => {
    toast.success("Order Updated Successfully");
    navigate({ to: "/merchandising-order-list" });
  };

  // Clean Input Component
  const InputField = ({ label, value, onChange, required = false, type = "text", placeholder = "" }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-tight">
        {label} {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 shadow-2xs"
      />
    </div>
  );

  // Clean Select Component
  const SelectField = ({ label, value, onChange, options, required = false }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-tight">
        {label} {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.75rem_center] shadow-2xs"
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
      activePath="order-profile"
      breadcrumbs={[{ label: "Manage Order" }, { label: "Order Profile" }]}
      title="Unified Order Workspace"
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Layers className="size-5"/></span>
              Unified Order Entry
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure style parameters, material requirements, and details for Job #{basicInfo.jobNo}</p>
          </div>
          <button
            onClick={handleUpdateOrder}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-650 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-teal-500/10 font-bold text-xs transition-all active:scale-97 cursor-pointer"
          >
            <Save className="size-4" />
            Save & Update
          </button>
        </div>

        {/* Segmented Order Type Toggle at the Top */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">Garment Division</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Select order type to configure specific product parameters</span>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-250 dark:border-slate-800">
            {["Knit", "Woven", "Sweater"].map((t) => {
              const isSel = basicInfo.orderType === t;
              return (
                <button
                  key={t}
                  onClick={() => setBasicInfo({ ...basicInfo, orderType: t as any })}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSel
                      ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {t} Order
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 1: Order Basic Information */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-4">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-455 uppercase tracking-tight">
                    Link Registered PO
                  </label>
                  <select
                    value={basicInfo.refNo}
                    onChange={e => {
                      const matched = MOCK_REGISTERED_POS.find(p => p.poNumber === e.target.value);
                      if (matched) {
                        setBasicInfo(prev => ({
                          ...prev,
                          refNo: matched.poNumber,
                          queryNo: matched.quotationNo,
                          buyerName: matched.buyerName,
                          styleNo: matched.styleRef,
                          orderQty: matched.quantity,
                          shipDate: matched.shipDate,
                          shippingMode: matched.shipmentMode,
                          payTerm: matched.paymentTerms,
                          buyingHouse: matched.buyingHouse,
                          department: matched.department,
                          season: matched.season,
                          orderType: matched.productType,
                          lcNumber: matched.lcNumber || "",
                          lcValue: matched.lcValue || 0,
                          lcAdvisingBank: matched.lcAdvisingBank || "",
                          lcIssueDate: matched.lcIssueDate || "",
                          nominatedYarnSupplier: matched.nominatedYarnSupplier || "",
                          nominatedFabricSupplier: matched.nominatedFabricSupplier || "",
                          nominatedTrimsSupplier: matched.nominatedTrimsSupplier || "",
                        }));
                        setStyleForm(prev => ({
                          ...prev,
                          styleNo: matched.styleRef,
                          styleOrderQty: String(matched.quantity),
                          unitPrice: matched.unitFOB,
                          deliveryDate: matched.shipDate,
                        }));
                        setStylesList([
                          {
                            id: "style-1",
                            styleNo: matched.styleRef,
                            color: "Navy Blue",
                            itemName: matched.itemDescription,
                            qty: matched.quantity,
                            sizeGroup: "XS-3XL",
                            sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
                            sizesQty: [
                              Math.round(matched.quantity * 0.15),
                              Math.round(matched.quantity * 0.15),
                              Math.round(matched.quantity * 0.15),
                              Math.round(matched.quantity * 0.15),
                              Math.round(matched.quantity * 0.15),
                              Math.round(matched.quantity * 0.10),
                              Math.round(matched.quantity * 0.15),
                            ],
                            print: "Chest Print",
                            embroidery: "None",
                            wash: "Normal Wash",
                            special: "None",
                            unitPrice: matched.unitFOB,
                            deliveryDate: matched.shipDate,
                          }
                        ]);
                        toast.success(`Loaded PO ${matched.poNumber} specs!`);
                      }
                    }}
                    className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.75rem_center] cursor-pointer shadow-2xs"
                  >
                    <option value="">-- Choose registered PO --</option>
                    {MOCK_REGISTERED_POS.map(p => (
                      <option key={p.poNumber} value={p.poNumber}>{p.poNumber} ({p.buyerName} — {p.styleRef})</option>
                    ))}
                  </select>
                </div>
                <InputField label="Job No" value={basicInfo.jobNo} onChange={(e: any) => setBasicInfo({...basicInfo, jobNo: e.target.value})} />
                <InputField label="Query No" value={basicInfo.queryNo} onChange={(e: any) => setBasicInfo({...basicInfo, queryNo: e.target.value})} />
                <InputField label="Order Quantity" type="number" value={basicInfo.orderQty} onChange={(e: any) => setBasicInfo({...basicInfo, orderQty: e.target.value})} />
                <SelectField label="Query Type" required value={basicInfo.queryType} onChange={(e: any) => setBasicInfo({...basicInfo, queryType: e.target.value})} options={["Regular", "Urgent"]} />

                <InputField label="Ref No" value={basicInfo.refNo} onChange={(e: any) => setBasicInfo({...basicInfo, refNo: e.target.value})} />
                <InputField label="Query Date" required type="date" value={basicInfo.queryDate} onChange={(e: any) => setBasicInfo({...basicInfo, queryDate: e.target.value})} />
                <SelectField label="Buying House" value={basicInfo.buyingHouse} onChange={(e: any) => setBasicInfo({...basicInfo, buyingHouse: e.target.value})} options={["ITPS", "Li & Fung", "Synergy", "Apex Group", "Pearl Global"]} />
                <SelectField label="Buyer Name" required value={basicInfo.buyerName} onChange={(e: any) => setBasicInfo({...basicInfo, buyerName: e.target.value})} options={["ITPS", "H&M Group (SE)", "ZARA (Inditex)", "Primark Ltd (UK)", "Walmart", "Target", "Gap"]} />

                <SelectField label="Department" required value={basicInfo.department} onChange={(e: any) => setBasicInfo({...basicInfo, department: e.target.value})} options={["Boys", "Girls", "Men", "Women"]} />
                <InputField label="OPD" required type="date" value={basicInfo.opd} onChange={(e: any) => setBasicInfo({...basicInfo, opd: e.target.value})} />
                <InputField label="Ship Date" required type="date" value={basicInfo.shipDate} onChange={(e: any) => setBasicInfo({...basicInfo, shipDate: e.target.value})} />
                <InputField label="Style No" required value={basicInfo.styleNo} onChange={(e: any) => setBasicInfo({...basicInfo, styleNo: e.target.value})} />
                
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-tight">
                    Item Type <span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={basicInfo.itemType}
                      onChange={(e) => setBasicInfo({...basicInfo, itemType: e.target.value})}
                      className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.75rem_center] shadow-2xs"
                    >
                      <option value="">Select Item...</option>
                      <option value="T-Shirt">T-Shirt</option>
                      <option value="Polo Shirt">Polo Shirt</option>
                      <option value="Jacket">Jacket</option>
                      <option value="Trousers">Trousers</option>
                      <option value="Sweater">Sweater</option>
                    </select>
                    <button className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 h-[34px] w-[34px] rounded-lg border border-slate-200 dark:border-slate-750 transition-colors text-slate-500 flex items-center justify-center cursor-pointer">
                      <List size={14} />
                    </button>
                  </div>
                </div>

                <SelectField label="Buyer Agent" value={basicInfo.buyerAgent} onChange={(e: any) => setBasicInfo({...basicInfo, buyerAgent: e.target.value})} options={["select...", "Agent Alpha", "Agent Beta"]} />
                <SelectField label="Buyer Brand" value={basicInfo.buyerBrand} onChange={(e: any) => setBasicInfo({...basicInfo, buyerBrand: e.target.value})} options={["", "Brand Core", "Brand Premium"]} />
                <SelectField label="Quality Level" required value={basicInfo.qualityLevel} onChange={(e: any) => setBasicInfo({...basicInfo, qualityLevel: e.target.value})} options={["AQL Standard", "AQL Premium"]} />

                <SelectField label="Season" required value={basicInfo.season} onChange={(e: any) => setBasicInfo({...basicInfo, season: e.target.value})} options={["ANS-SS27", "FW27"]} />
                <SelectField label="Factory" value={basicInfo.factory} onChange={(e: any) => setBasicInfo({...basicInfo, factory: e.target.value})} options={["select...", "PSL Composite", "PSKC Factory"]} />
                <SelectField label="Currency" value={basicInfo.currency} onChange={(e: any) => setBasicInfo({...basicInfo, currency: e.target.value})} options={["USD", "EUR", "BDT"]} />
                <InputField label="Exchange Rate" value={basicInfo.exchangeRate} onChange={(e: any) => setBasicInfo({...basicInfo, exchangeRate: e.target.value})} />

                <SelectField label="Shipping Mode" value={basicInfo.shippingMode} onChange={(e: any) => setBasicInfo({...basicInfo, shippingMode: e.target.value})} options={["Sea", "Air", "Road"]} />
                <SelectField label="Pay Term" value={basicInfo.payTerm} onChange={(e: any) => setBasicInfo({...basicInfo, payTerm: e.target.value})} options={["120 Days BBLC", "90 Days LC", "Cash"]} />
                <InputField label="Tenor" value={basicInfo.tenor} onChange={(e: any) => setBasicInfo({...basicInfo, tenor: e.target.value})} />
              </div>

              {/* Dynamic Division-specific configuration block */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 mt-2 space-y-3">
                <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-850 pb-2 mb-2">
                  <div className="w-1 h-3.5 bg-teal-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-650 dark:text-teal-400">
                    {basicInfo.orderType} Specific Configuration
                  </span>
                </div>

                {basicInfo.orderType === "Knit" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InputField
                      label="Fabric GSM"
                      value={basicInfo.fabricGsm}
                      onChange={(e: any) => setBasicInfo({ ...basicInfo, fabricGsm: e.target.value })}
                    />
                    <SelectField
                      label="Knit Structure"
                      value={basicInfo.knitStructure}
                      onChange={(e: any) => setBasicInfo({ ...basicInfo, knitStructure: e.target.value })}
                      options={["Single Jersey", "1x1 Rib", "Interlock", "French Terry", "Pique"]}
                    />
                    <InputField
                      label="Yarn Composition"
                      value={basicInfo.yarnComposition}
                      onChange={(e: any) => setBasicInfo({ ...basicInfo, yarnComposition: e.target.value })}
                    />
                  </div>
                )}

                {basicInfo.orderType === "Woven" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InputField
                      label="Warp x Weft Count"
                      value={basicInfo.warpWeftCount}
                      onChange={(e: any) => setBasicInfo({ ...basicInfo, warpWeftCount: e.target.value })}
                    />
                    <InputField
                      label="Fabric Construction Density"
                      value={basicInfo.fabricConstruction}
                      onChange={(e: any) => setBasicInfo({ ...basicInfo, fabricConstruction: e.target.value })}
                    />
                    <SelectField
                      label="Weave Density / Pattern"
                      value={basicInfo.weaveDensity}
                      onChange={(e: any) => setBasicInfo({ ...basicInfo, weaveDensity: e.target.value })}
                      options={["2/1 Twill", "Plain/Poplin", "Satin/Sateen", "Canvas", "Oxford"]}
                    />
                  </div>
                )}

                {basicInfo.orderType === "Sweater" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SelectField
                      label="Machine Gauge (GG)"
                      value={basicInfo.gauge}
                      onChange={(e: any) => setBasicInfo({ ...basicInfo, gauge: e.target.value })}
                      options={["12GG", "7GG", "3GG", "5GG", "14GG"]}
                    />
                    <InputField
                      label="Yarn Ply / Count"
                      value={basicInfo.yarnPly}
                      onChange={(e: any) => setBasicInfo({ ...basicInfo, yarnPly: e.target.value })}
                    />
                    <SelectField
                      label="Knitting Pattern Type"
                      value={basicInfo.knittingPattern}
                      onChange={(e: any) => setBasicInfo({ ...basicInfo, knittingPattern: e.target.value })}
                      options={["Jacquard", "Cable", "Ribbing", "Pointelle", "Flat Knit"]}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <InputField label="Special Instructions" placeholder="Any specific requirements..." value={basicInfo.specialInstructions} onChange={(e: any) => setBasicInfo({...basicInfo, specialInstructions: e.target.value})} />
                <InputField label="Penalty Clauses" placeholder="e.g. 5% off for 1 week delay" value={basicInfo.penaltyClauses} onChange={(e: any) => setBasicInfo({...basicInfo, penaltyClauses: e.target.value})} />
              </div>

              {/* Linked PO L/C details & nominated suppliers */}
              {basicInfo.refNo && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 mt-4 space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-850 pb-2">
                    <div className="w-1 h-3.5 bg-teal-500 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-650 dark:text-teal-400">
                      Linked PO Master L/C & Nominated Suppliers (Read Only)
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">L/C Number</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{basicInfo.lcNumber || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">L/C Advising Bank</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{basicInfo.lcAdvisingBank || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">L/C Net Value</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{basicInfo.lcValue ? `$ ${basicInfo.lcValue.toLocaleString()}` : "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">L/C Issue Date</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{basicInfo.lcIssueDate || "N/A"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-850">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Nominated Yarn Spinner</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{basicInfo.nominatedYarnSupplier || "Buyer Nominated"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Nominated Fabric Weaver</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{basicInfo.nominatedFabricSupplier || "Buyer Nominated"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Nominated Trims & Thread</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{basicInfo.nominatedTrimsSupplier || "Buyer Nominated"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Image Uploader */}
            <div className="w-full xl:w-[260px] shrink-0 flex flex-col">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-tight mb-1.5">Style Reference Image</label>
              <div className="w-full h-full min-h-[220px] rounded-[10px] border-[1.5px] border-dashed border-slate-300 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-900/50 flex flex-col items-center justify-center relative overflow-hidden group hover:bg-slate-50 transition-colors cursor-pointer">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium text-sm flex items-center gap-2"><UploadCloud size={16}/> Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <div className="bg-[#e2e8f0] dark:bg-slate-800 rounded-full w-[40px] h-[40px] flex items-center justify-center mx-auto mb-3 text-slate-500">
                      <UploadCloud size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Upload Design</span>
                    <span className="text-[9px] text-slate-400 font-medium tracking-wide">JPG, PNG or PDF</span>
                  </div>
                )}
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </div>
            </div>
          </div>
        </section>


        {/* SECTION 2: Style Breakdown & Costing */}
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block"></span>
              Style & Costing Setup
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
              <InputField label="Style No" required value={styleForm.styleNo} onChange={(e: any) => setStyleForm({...styleForm, styleNo: e.target.value})} />
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                  Colour <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={styleForm.color}
                    onChange={(e) => setStyleForm({...styleForm, color: e.target.value})}
                    className="flex-1 text-[13px] px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none"
                  >
                    <option value="Select...">Select...</option>
                  </select>
                  <button className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-2 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors text-indigo-600 dark:text-indigo-400">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <InputField label="Style Order Qty" type="number" required value={styleForm.styleOrderQty} onChange={(e: any) => setStyleForm({...styleForm, styleOrderQty: e.target.value})} />
              <InputField label="Cutting Buffer (%)" type="number" value={styleForm.cuttingPct} onChange={(e: any) => setStyleForm({...styleForm, cuttingPct: Number(e.target.value)})} />
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  Plan Cut Qty <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">Auto</span>
                </label>
                <div className="w-full text-[13px] px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-300 font-mono font-medium shadow-inner h-9 flex items-center">
                  {planCutQty > 0 ? planCutQty.toLocaleString() : "-"}
                </div>
              </div>

              <InputField label="Unit Price ($)" type="number" required value={styleForm.unitPrice} onChange={(e: any) => setStyleForm({...styleForm, unitPrice: e.target.value})} />
              
              <InputField label="Delivery Date" required type="date" value={styleForm.deliveryDate.split("/").reverse().join("-")} onChange={(e: any) => setStyleForm({...styleForm, deliveryDate: e.target.value})} />
              
              <SelectField label="Item Type" required value={styleForm.itemType} onChange={(e: any) => setStyleForm({...styleForm, itemType: e.target.value})} options={["Pcs", "Sets", "Dzn"]} />
              <SelectField label="Size Group" required value={styleForm.sizeGroup} onChange={(e: any) => setStyleForm({...styleForm, sizeGroup: e.target.value})} options={["", "XS-3XL", "S-XL"]} />
              
              <div className="flex items-end pb-0.5 w-full xl:col-span-3">
                <button
                  onClick={() => setShowSizeModal(true)}
                  className="w-full h-[38px] flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 text-[12px] font-bold rounded-lg transition-colors shadow-sm"
                >
                  <LayoutGrid size={16}/> SET SIZE BREAKDOWN
                </button>
              </div>
            </div>

            {/* Process Toggles */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 block mb-3">Required Processes</label>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'print', label: 'PRINT', state: processes.print },
                    { id: 'embroidery', label: 'EMBROIDERY', state: processes.embroidery },
                    { id: 'wash', label: 'WASH', state: processes.wash },
                    { id: 'special', label: 'SPECIAL', state: processes.special }
                  ].map((proc) => (
                    <button
                      key={proc.id}
                      onClick={() => setProcesses({...processes, [proc.id]: !proc.state})}
                      className={`px-6 py-2 rounded-full text-[11px] font-bold tracking-wide transition-all shadow-sm border ${
                        proc.state 
                        ? "bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-500/50 dark:text-purple-300 ring-2 ring-purple-500/20" 
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                    >
                      {proc.label}
                    </button>
                  ))}
                </div>

                <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-[12px] font-bold rounded-lg shadow-sm transition-colors active:scale-95">
                  ADD TO MASTER LIST <ArrowRight size={16}/>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Style Summary Ledger (The Master Grid) */}
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-orange-500 rounded-full inline-block"></span>
              Style Master Data
            </h2>
            
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 shadow-sm">
              <input
                type="checkbox"
                id="costingToggle"
                checked={additionalCosting}
                onChange={(e) => setAdditionalCosting(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="costingToggle" className="text-[12px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                Enable Additional Costing
              </label>
            </div>
          </div>          <div className="overflow-x-auto">
            <table className="w-full text-left text-[9px] whitespace-nowrap text-slate-700 dark:text-slate-300 border-collapse border border-slate-300 dark:border-slate-700 bg-white tracking-tight">
              <thead className="bg-[#dee2e6] dark:bg-slate-800/50 font-bold text-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700 text-center">#</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">Style No</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">Colour</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">Item Name</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">OrderQty</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">Size Group</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">Sizes</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">SizesQty</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">Print</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">Embroidery</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">Wash</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">Special</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">UnitPrice</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">DeliveryDate</th>
                  <th className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700 text-center" colSpan={2}>∇</th>
                </tr>
              </thead>
              <tbody>
                {/* Master Data Row */}
                <tr className="bg-[#f5cbab] dark:bg-orange-900/10 text-slate-800 dark:text-slate-300 font-medium">
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700 text-center font-bold">1</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700 font-bold">ABC</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">01 White</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700 whitespace-normal">Boyes T-Shirts - Short Sleeves</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">7000</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">XS-3XL</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700 text-[8px] truncate max-w-[80px]" title="XS,S,M,L,XL,2XL,3XL">XS,S,M,L,XL,2XL,3XL</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700 text-[8px] truncate max-w-[80px]" title="1050,1050,1050,1050,1050,700,1050">1050,1050,1050,1050...</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">Pigment</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">Plain</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">Garment dyed</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700"></td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">5</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700">31/07/2026</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 dark:border-slate-700" colSpan={2}>
                     <div className="flex items-center justify-center gap-1">
                       <button className="text-red-500 font-bold text-xs">✕</button>
                       <button className="text-amber-500 font-bold text-xs">✎</button>
                     </div>
                  </td>
                </tr>

                {/* FABRIC HEADER */}
                <tr className="bg-[#e2efda] text-slate-800 font-bold">
                  <td className="px-0.5 py-0.5 border border-slate-300 text-center text-blue-500 bg-white" rowSpan={3}>
                    <svg className="w-3.5 h-3.5 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
                  </td>
                  <td className="px-0.5 py-0.5 border border-slate-300 text-center">#</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">GMT Item</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">GMT Qty</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">PrintType</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">BodyPart</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">FabType</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Construction</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">GSM</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Composition</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Dyeing</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Finishing</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Consump Qty</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Source</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">FabQty</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 text-center w-16">
                     <button onClick={() => setShowFabricModal(true)} className="bg-white hover:bg-slate-100 transition-colors border border-slate-400 px-1 py-0.5 rounded text-[8px] w-full text-slate-800 flex items-center justify-center gap-1 shadow-sm font-semibold">+ Fabric</button>
                  </td>
                </tr>

                {/* FABRIC DATA 1 */}
                <tr className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-0.5 py-0.5 border border-slate-300 text-center">1</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 whitespace-normal">Boyes T-Shirts - Short Sleeves</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">7000.00</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">YD</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Body</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Knit</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 whitespace-normal">Single Jersey</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">160</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 whitespace-normal">98% Cotton 2% Spandex</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 whitespace-normal">Black,Dark</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 whitespace-normal">Heat Set,Stenter,Compacting</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">2.8050</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Production</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">1718.06</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 text-center">
                     <div className="flex items-center justify-center gap-1"><button className="text-red-500 font-bold text-xs">✕</button><button className="text-amber-500 font-bold text-xs">✎</button></div>
                  </td>
                </tr>

                {/* FABRIC DATA 2 */}
                <tr className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-0.5 py-0.5 border border-slate-300 text-center">2</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 whitespace-normal">Boyes T-Shirts - Short Sleeves</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">7000.00</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">AOP</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Rib</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Knit</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 whitespace-normal">2X2 Lycra Rib</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">240</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 whitespace-normal">98% Cotton 2% Spandex</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 whitespace-normal">Black,Dark</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 whitespace-normal">Brushing,Compacting,Heat Set</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">0.5891</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Production</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">360.79</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 text-center">
                     <div className="flex items-center justify-center gap-1"><button className="text-red-500 font-bold text-xs">✕</button><button className="text-amber-500 font-bold text-xs">✎</button></div>
                  </td>
                </tr>

                {/* YARN HEADER */}
                <tr className="bg-[#f3e8f6] text-slate-800 font-bold">
                  <td className="px-0.5 py-0.5 border border-slate-300 text-center">#</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">BodyPart</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Yarn Type</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Count</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Composition</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Color</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Yarn(%)</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Yarn Consump</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">YarnQty</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Spandex(%)</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Spndx Cnt</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Spndx Consmp</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Spndx Qty</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Req Date</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 text-center" colSpan={2}>
                     <button onClick={() => setShowYarnModal(true)} className="bg-white hover:bg-slate-100 transition-colors border border-slate-400 px-1 py-0.5 rounded text-[8px] w-full text-slate-800 flex items-center justify-center gap-1 shadow-sm font-semibold">+ Yarn</button>
                  </td>
                </tr>

                {/* TRIMS HEADER */}
                <tr className="bg-[#fff2cc] text-slate-800 font-bold">
                  <td className="px-0.5 py-0.5 border border-slate-300 text-center">#</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">GMT Item</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Trim Name</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Color Sense</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Base UOM</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Market UOM</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">UomFactor</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Buffer(%)</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Req Per Dzn</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">TotalQty</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">UnitRate</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">TotalPrice</td>
                  <td className="px-0.5 py-0.5 border border-slate-300">Description</td>
                  <td className="px-0.5 py-0.5 border border-slate-300 text-center" colSpan={3}>
                     <button onClick={() => setShowTrimsModal(true)} className="bg-white hover:bg-slate-100 transition-colors border border-slate-400 px-1 py-0.5 rounded text-[8px] w-full text-slate-800 flex items-center justify-center gap-1 shadow-sm font-semibold">+ Trims</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* MODALS */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="font-bold text-[14px] text-slate-800 dark:text-white">Define Size Matrix</h3>
              <button onClick={() => setShowSizeModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={16}/></button>
            </div>
            
            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                <span>Size Label</span>
                <span>Quantity</span>
              </div>
              {sizeQtys.map((s, idx) => (
                <div key={s.size} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
                  <span className="font-bold text-[13px] text-slate-700 dark:text-slate-200 w-16 text-center">{s.size}</span>
                  <input
                    type="number"
                    value={s.qty}
                    onChange={(e) => {
                      const newQtys = [...sizeQtys];
                      newQtys[idx].qty = Number(e.target.value);
                      setSizeQtys(newQtys);
                    }}
                    className="w-24 px-3 py-1.5 text-right text-[13px] font-mono border border-slate-200 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-900"
                  />
                </div>
              ))}
              <div className="flex justify-between items-center p-3 mt-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                <span className="font-bold text-indigo-700 dark:text-indigo-400">Total Sum</span>
                <span className="font-bold font-mono text-indigo-700 dark:text-indigo-400">
                  {sizeQtys.reduce((sum, item) => sum + item.qty, 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
              <button onClick={() => setShowSizeModal(false)} className="px-4 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => setShowSizeModal(false)} className="px-6 py-2 text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">Apply Breakdown</button>
            </div>
          </div>
        </div>
      )}

      {showFabricModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Fabric Details</h3>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectField label="Gmt Item" required options={["Select..."]} />
                <SelectField label="Gmt Color" options={["Select..."]} />
                <SelectField label="Fabric Source" required options={["Production"]} />
                <SelectField label="Print/Color Type" options={["Select..."]} />
              </div>
              
              <hr className="border-slate-100 dark:border-slate-800"/>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SelectField label="Fabric Color" options={["Select..."]} />
                <SelectField label="UOM" required options={["Kg"]} />
                <SelectField label="Body Part" required options={[""]} />
                <SelectField label="Fabric Nature" required options={[""]} />
                
                <SelectField label="Construction" required options={[""]} />
                <SelectField label="Composition" required options={[""]} />
                
                <InputField label="GSM" required />
                <InputField label="Dyeing Type" />
                <SelectField label="Color Range" required options={["Select"]} />
                <InputField label="Shade Percentage" />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <InputField label="Finishing" placeholder="Select..." />
                <SelectField label="Nominated Supplier" options={["select..."]} />
              </div>

              <hr className="border-slate-100 dark:border-slate-800"/>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="flex gap-2 items-end">
                  <InputField label="Fin.Fab.Consumption(Dzn)" required value="0" />
                  <button className="text-orange-500 mb-2 font-bold text-lg">+</button>
                  <button className="text-orange-500 mb-2 font-bold text-lg">↻</button>
                </div>
                <InputField label="AOP (%)" />
                <InputField label="Dyeing (%)" />
                <InputField label="Knitting (%)" />
                
                <div className="flex gap-2 items-end">
                  <InputField label="Total Cons.QTY" value="0" />
                  <button className="text-orange-500 mb-2 font-bold text-lg">+</button>
                </div>
                <InputField label="Dyeing Rate" value="0" />
                <InputField label="Purchase/Knitting Rate" value="0" />
                <InputField label="AOP Rate" />
              </div>

              <InputField label="Comments" />
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between">
              <button onClick={() => setShowFabricModal(false)} className="px-5 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">CLOSE</button>
              <button onClick={() => setShowFabricModal(false)} className="px-6 py-2 text-[13px] font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-sm transition-colors">SUBMIT</button>
            </div>
          </div>
        </div>
      )}

      {showYarnModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Yarn Details</h3>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <SelectField label="Fabric Name" required options={["Select..."]} />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <InputField label="Required Date" />
                <SelectField label="Yarn Type" required options={[""]} />
                <SelectField label="Count" options={[""]} />
                <div className="flex gap-2 items-end">
                  <SelectField label="Composition" required options={[""]} />
                  <button className="text-orange-500 mb-2 font-bold text-lg">+</button>
                </div>

                <SelectField label="Color Name" required options={[""]} />
                <InputField label="Yarn(%)" value="0" />
                <InputField label="Yarn Consumption Qty" />
                <div className="invisible hidden md:block"></div>
                
                <InputField label="Unit-Rate(Kg)" />
                <SelectField label="Spandex Count" options={[""]} />
                <InputField label="Spandex(%)" value="0" />
                <div className="invisible hidden md:block"></div>

                <InputField label="Spandex Consumption Qty" value="0" />
                <div className="col-span-1 md:col-span-2"></div>
                <InputField label="Spandex Unit-Rate(Kg)" />
              </div>
              
              <InputField label="Comments" />
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
              <button onClick={() => setShowYarnModal(false)} className="px-5 py-2 text-[13px] font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg shadow-sm transition-colors">CLOSE</button>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="text-sm font-bold text-slate-700 mr-4">Yarn Percentage (%) : || Yarn Qty :</span>
                <button className="px-5 py-2 text-[13px] font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg shadow-sm transition-colors">RESET</button>
                <button className="px-5 py-2 text-[13px] font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-sm transition-colors">ADD YARN</button>
                <button onClick={() => setShowYarnModal(false)} className="px-6 py-2 text-[13px] font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-sm transition-colors">SUBMIT</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTrimsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Trims Details</h3>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Copy</label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <SelectField label="Gmt Item" required options={["Select.."]} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="flex gap-2 items-end">
                  <SelectField label="Trims Name" required options={[""]} />
                  <button className="text-orange-500 mb-2 font-bold text-lg">+</button>
                </div>
                <SelectField label="Base UOM" required options={[""]} />
                <SelectField label="Market UOM" required options={[""]} />

                <InputField label="Order Quantity" required />
                <InputField label="Consumption Per Pcs" required />
                <InputField label="Convertion Per Unit" required />

                <InputField label="Additional (%)" value="5" />
                <SelectField label="Sensitivity" required options={["No Sensitivity"]} />
                <div className="invisible hidden md:block"></div>

                <InputField label="Total Quantity ()" value="0" />
                <InputField label="Unit Rate ($)" required value="0" />
                <InputField label="Total Price ($)" />
              </div>
              
              <SelectField label="Nominated Supplier" options={["select..."]} />
              <InputField label="Description" />
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between">
              <button onClick={() => setShowTrimsModal(false)} className="px-5 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">CLOSE</button>
              <button onClick={() => setShowTrimsModal(false)} className="px-6 py-2 text-[13px] font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-sm transition-colors">SUBMIT</button>
            </div>
          </div>
        </div>
      )}

    </MerchandisingLayout>
  );
}
