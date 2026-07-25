import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import { List, Plus, X, UploadCloud, Save, ArrowRight, LayoutGrid } from "lucide-react";

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

export default function MerchandisingOrderProfilePage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const orderType = search.type || "Knit";

  // 1. Order Basic Information State
  const [basicInfo, setBasicInfo] = useState({
    jobNo: "5", queryNo: "5", orderQty: 7000, queryType: "Regular",
    refNo: "PO#12", queryDate: "2026-07-23", buyingHouse: "ITPS", buyerName: "ITPS",
    department: "Boys", orderType: orderType, opd: "2026-07-23", shipDate: "2026-07-31",
    styleNo: "", itemType: "", buyerAgent: "select...", buyerBrand: "",
    qualityLevel: "AQL Standard", season: "ANS-SS27", factory: "select...",
    currency: "USD", exchangeRate: 121, shippingMode: "Sea", payTerm: "120 Days BBLC",
    tenor: "", specialInstructions: "", penaltyClauses: "", repeatedJobNo: "select..."
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

  // Modern Input Component
  const InputField = ({ label, value, onChange, required = false, type = "text", placeholder = "" }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-rose-500 font-bold">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-[13px] px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100"
      />
    </div>
  );

  // Modern Select Component
  const SelectField = ({ label, value, onChange, options, required = false }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-rose-500 font-bold">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full text-[13px] px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.75rem_center]"
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
      title="Order Profile"
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Order Details</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage specifications and styles for Job No {basicInfo.jobNo}</p>
          </div>
          <button
            onClick={handleUpdateOrder}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-semibold transition-all active:scale-95"
          >
            <Save className="size-4" />
            Save & Update
          </button>
        </div>

        {/* SECTION 1: Order Basic Information */}
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-teal-500 rounded-full inline-block"></span>
              Basic Information
            </h2>
          </div>
          
          <div className="p-6 flex flex-col xl:flex-row gap-8">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
              <InputField label="Job No" value={basicInfo.jobNo} onChange={(e: any) => setBasicInfo({...basicInfo, jobNo: e.target.value})} />
              <InputField label="Query No" value={basicInfo.queryNo} onChange={(e: any) => setBasicInfo({...basicInfo, queryNo: e.target.value})} />
              <InputField label="Order Quantity" type="number" value={basicInfo.orderQty} onChange={(e: any) => setBasicInfo({...basicInfo, orderQty: e.target.value})} />
              <SelectField label="Query Type" required value={basicInfo.queryType} onChange={(e: any) => setBasicInfo({...basicInfo, queryType: e.target.value})} options={["Regular", "Urgent"]} />

              <InputField label="Ref No" value={basicInfo.refNo} onChange={(e: any) => setBasicInfo({...basicInfo, refNo: e.target.value})} />
              <InputField label="Query Date" required type="date" value={basicInfo.queryDate} onChange={(e: any) => setBasicInfo({...basicInfo, queryDate: e.target.value})} />
              <SelectField label="Buying House" value={basicInfo.buyingHouse} onChange={(e: any) => setBasicInfo({...basicInfo, buyingHouse: e.target.value})} options={["ITPS"]} />
              <SelectField label="Buyer Name" required value={basicInfo.buyerName} onChange={(e: any) => setBasicInfo({...basicInfo, buyerName: e.target.value})} options={["ITPS"]} />

              <SelectField label="Department" required value={basicInfo.department} onChange={(e: any) => setBasicInfo({...basicInfo, department: e.target.value})} options={["Boys", "Girls", "Men", "Women"]} />
              <SelectField label="Order Type" value={basicInfo.orderType} onChange={(e: any) => setBasicInfo({...basicInfo, orderType: e.target.value})} options={["Knit", "Woven", "Sweater"]} />
              <InputField label="OPD" required type="date" value={basicInfo.opd} onChange={(e: any) => setBasicInfo({...basicInfo, opd: e.target.value})} />
              <InputField label="Ship Date" required type="date" value={basicInfo.shipDate} onChange={(e: any) => setBasicInfo({...basicInfo, shipDate: e.target.value})} />

              <InputField label="Style No" required value={basicInfo.styleNo} onChange={(e: any) => setBasicInfo({...basicInfo, styleNo: e.target.value})} />
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                  Item Type <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={basicInfo.itemType}
                    onChange={(e) => setBasicInfo({...basicInfo, itemType: e.target.value})}
                    className="flex-1 text-[13px] px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  >
                    <option value="">select...</option>
                  </select>
                  <button className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-2 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors text-slate-600 dark:text-slate-300">
                    <List size={16} />
                  </button>
                </div>
              </div>

              <SelectField label="Buyer Agent" value={basicInfo.buyerAgent} onChange={(e: any) => setBasicInfo({...basicInfo, buyerAgent: e.target.value})} options={["select..."]} />
              <SelectField label="Buyer Brand" value={basicInfo.buyerBrand} onChange={(e: any) => setBasicInfo({...basicInfo, buyerBrand: e.target.value})} options={[""]} />

              <SelectField label="Quality Level" required value={basicInfo.qualityLevel} onChange={(e: any) => setBasicInfo({...basicInfo, qualityLevel: e.target.value})} options={["AQL Standard", "AQL Premium"]} />
              <SelectField label="Season" required value={basicInfo.season} onChange={(e: any) => setBasicInfo({...basicInfo, season: e.target.value})} options={["ANS-SS27", "FW27"]} />
              <SelectField label="Factory" value={basicInfo.factory} onChange={(e: any) => setBasicInfo({...basicInfo, factory: e.target.value})} options={["select..."]} />
              <SelectField label="Currency" value={basicInfo.currency} onChange={(e: any) => setBasicInfo({...basicInfo, currency: e.target.value})} options={["USD", "EUR", "BDT"]} />

              <InputField label="Exchange Rate" value={basicInfo.exchangeRate} onChange={(e: any) => setBasicInfo({...basicInfo, exchangeRate: e.target.value})} />
              <SelectField label="Shipping Mode" value={basicInfo.shippingMode} onChange={(e: any) => setBasicInfo({...basicInfo, shippingMode: e.target.value})} options={["Sea", "Air", "Road"]} />
              <SelectField label="Pay Term" value={basicInfo.payTerm} onChange={(e: any) => setBasicInfo({...basicInfo, payTerm: e.target.value})} options={["120 Days BBLC", "90 Days LC", "Cash"]} />
              <InputField label="Tenor" value={basicInfo.tenor} onChange={(e: any) => setBasicInfo({...basicInfo, tenor: e.target.value})} />

              <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Special Instructions" placeholder="Any specific requirements..." value={basicInfo.specialInstructions} onChange={(e: any) => setBasicInfo({...basicInfo, specialInstructions: e.target.value})} />
                <InputField label="Penalty Clauses" placeholder="e.g. 5% off for 1 week delay" value={basicInfo.penaltyClauses} onChange={(e: any) => setBasicInfo({...basicInfo, penaltyClauses: e.target.value})} />
              </div>
            </div>

            {/* Image Uploader */}
            <div className="w-full xl:w-56 shrink-0 flex flex-col items-center">
              <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 w-full text-left mb-1.5">Style Reference Image</label>
              <div className="w-full aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center relative overflow-hidden group hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors cursor-pointer">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium text-sm flex items-center gap-2"><UploadCloud size={16}/> Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <div className="bg-slate-200 dark:bg-slate-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40 transition-colors">
                      <UploadCloud className="text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" size={24} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1">Upload Design</span>
                    <span className="text-[11px] text-slate-500">JPG, PNG or PDF</span>
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1500px] text-left text-[12px] text-slate-700 dark:text-slate-300 border-collapse border border-slate-300 dark:border-slate-700 bg-white">
              <thead className="bg-[#dee2e6] dark:bg-slate-800/50 text-[11px] font-bold text-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700 w-10 text-center">#</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">Style No</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">Colour</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">Item Name</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">OrderQty</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">Size Group</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">Sizes</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">SizesQty</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">Print</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">Embroidery</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">Wash</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">Special</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">UnitPrice</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700">DeliveryDate</th>
                  <th className="px-2 py-2 border border-slate-300 dark:border-slate-700 text-center w-14">∇</th>
                </tr>
              </thead>
              <tbody>
                {/* Master Data Row */}
                <tr className="bg-[#f5cbab] dark:bg-orange-900/10 text-slate-800 dark:text-slate-300">
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700 text-center font-bold">1</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700 font-medium">ABC</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700">01 White</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700">Boyes T-Shirts - Short Sleeves</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700">7000</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700">XS-3XL</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700">XS,S,M,L,XL,2XL,3XL</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700 text-[10px]">1050,1050,1050,1050,1050,700,1050</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700">Pigment (Chest)</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700">Plain</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700">Garment dyed</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700"></td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700">5</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700 text-[11px]">31/07/2026</td>
                  <td className="px-2 py-3 border border-slate-300 dark:border-slate-700">
                     <div className="flex flex-col items-center justify-center gap-1">
                       <button className="text-red-500 font-bold text-sm">✕</button>
                       <button className="text-amber-500 font-bold text-sm">✎</button>
                     </div>
                  </td>
                </tr>

                {/* FABRIC ROW */}
                <tr>
                  <td colSpan={15} className="p-0 border border-slate-300 dark:border-slate-700">
                    <table className="w-full text-left text-[11px] text-slate-700 dark:text-slate-300 border-collapse">
                      <thead className="bg-[#e2efda] text-slate-800 font-bold">
                        <tr>
                          <th className="px-2 py-2 border-r border-b border-slate-300 text-center w-10 text-blue-500 text-lg" rowSpan={3}>
                            <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
                          </th>
                          <th className="px-2 py-2 border-r border-b border-slate-300 w-8 text-center">#</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">GMT Item</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">GMT Qty</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">PrintType</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">BodyPart</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">FabType</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Construction</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">GSM</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Composition</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Dyeing</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Finishing</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Consump Qty</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Source</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">FabQty</th>
                          <th className="px-1 py-1 border-b border-slate-300 text-center w-16">
                             <button onClick={() => setShowFabricModal(true)} className="bg-white hover:bg-slate-100 transition-colors border border-slate-400 px-1 py-0.5 rounded text-[9px] w-full text-slate-800 flex items-center justify-center gap-1 shadow-sm font-semibold">+ Fabric</button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white hover:bg-slate-50 transition-colors">
                          <td className="px-2 py-3 border-r border-b border-slate-300 text-center">1</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Boyes T-Shirts - Short Sleeves</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">7000.0000</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">YD</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Body</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Knit</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Single Jersey</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">160</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">98% Cotton 2% Spandex</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Black,Dark(65.00)</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Heat Set,Stenter,Compacting</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">2.8050</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Production</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">1718.0627</td>
                          <td className="px-2 py-3 border-b border-slate-300 text-center">
                             <div className="flex items-center justify-center gap-1.5"><button className="text-red-500 font-bold">✕</button><button className="text-amber-500 font-bold">✎</button></div>
                          </td>
                        </tr>
                        <tr className="bg-white hover:bg-slate-50 transition-colors">
                          <td className="px-2 py-3 border-r border-b border-slate-300 text-center">2</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Boyes T-Shirts - Short Sleeves</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">7000.0000</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">AOP</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Rib</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Knit</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">2X2 Lycra Rib</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">240</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">98% Cotton 2% Spandex</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Black,Dark(65.00)</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Brushing,Compacting,Heat Set</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">0.5891</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">Production</td>
                          <td className="px-2 py-3 border-r border-b border-slate-300">360.7933</td>
                          <td className="px-2 py-3 border-b border-slate-300 text-center">
                             <div className="flex items-center justify-center gap-1.5"><button className="text-red-500 font-bold">✕</button><button className="text-amber-500 font-bold">✎</button></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                
                {/* YARN ROW */}
                <tr>
                  <td colSpan={15} className="p-0 border border-slate-300 dark:border-slate-700">
                    <table className="w-full text-left text-[11px] text-slate-700 dark:text-slate-300 border-collapse">
                      <thead className="bg-[#f3e8f6] text-slate-800 font-bold">
                        <tr>
                          <th className="px-2 py-2 border-r border-b border-slate-300 text-center w-10">#</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">BodyPart</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Yarn Type</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Count</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Composition</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Color</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Yarn(%)</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Yarn Consumption Qty</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">YarnQty</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Spandex(%)</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Spandex Count</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Spandex Consumption Qty</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Spandex Qty</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Required Date</th>
                          <th className="px-1 py-1 border-b border-slate-300 text-center w-16">
                             <button onClick={() => setShowYarnModal(true)} className="bg-white hover:bg-slate-100 transition-colors border border-slate-400 px-1 py-0.5 rounded text-[9px] w-full text-slate-800 flex items-center justify-center gap-1 shadow-sm font-semibold">+ Yarn</button>
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </td>
                </tr>

                {/* TRIMS ROW */}
                <tr>
                  <td colSpan={15} className="p-0 border border-slate-300 dark:border-slate-700">
                    <table className="w-full text-left text-[11px] text-slate-700 dark:text-slate-300 border-collapse">
                      <thead className="bg-[#fff2cc] text-slate-800 font-bold">
                        <tr>
                          <th className="px-2 py-2 border-r border-b border-slate-300 text-center w-10">#</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">GMT Item</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Trim Name</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Color Sensetivity</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Base UOM</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Market UOM</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">UomFactor</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Buffer(%)</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Req for Per Dzn RMG</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">TotalQty</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">UnitRate</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">TotalPrice</th>
                          <th className="px-2 py-2 border-r border-b border-slate-300">Description</th>
                          <th className="px-1 py-1 border-b border-slate-300 text-center w-16">
                             <button onClick={() => setShowTrimsModal(true)} className="bg-white hover:bg-slate-100 transition-colors border border-slate-400 px-1 py-0.5 rounded text-[9px] w-full text-slate-800 flex items-center justify-center gap-1 shadow-sm font-semibold">+ Trims</button>
                          </th>
                        </tr>
                      </thead>
                    </table>
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
