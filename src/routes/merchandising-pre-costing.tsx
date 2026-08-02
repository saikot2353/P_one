import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useMemo } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Plus, Search, Pencil, FileText, ArrowLeft, Save, Printer,
  Eye, X, ChevronDown, ChevronUp, CheckCircle, Clock,
  AlertCircle, Download, FileSpreadsheet, List, Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-pre-costing")({
  head: () => ({ meta: [{ title: "Pre-Costing — Pakiza Knit Composite" }] }),
  component: PreCostingPage,
});

// ── Types ───────────────────────────────────────────────────────
interface StyleFOBRow {
  id: number;
  styleNo: string;
  colour: string;
  itemName: string; // also itemType
  orderQty: number;
  unitPrice: number;
  deliveryDate: string;
  sizeGroup: string;
  sizes: string;
  sizesQty: number;
  print: boolean;
  embroidery: boolean;
  wash: boolean;
  special: boolean;
  commissionPct: number;
  commissionAmt: number;
  planCutQty: number;
  buyerCosting: string;
}
interface FabricRow {
  id: number; styleRef: string; fabNature: string; fabricInfo: string;
  gsm: number; colour: string; source: string; orderQtyDzn: number;
  consDzn: number; uom: string; rate: number;
}
interface YarnRow {
  id: number; composition: string; count: string; yarnType: string;
  colour: string; yarnQty: number; rate: number;
}
interface DyedYarnRow {
  id: number; style: string; yarnInfo: string; colour: string;
  shade: string; quantity: number; uom: string; rate: number;
}
interface ConversionRow {
  id: number; processType: "Knitting" | "Dyeing"; styleRef: string;
  fabNature: string; fabricInfo: string; gsm: number; colType: string;
  colour: string; shade: string; prQty: number; uom: string; rate: number;
}
interface AccessoryRow {
  id: number; itemName: string; gmtItem: string; sensitivityType: string;
  orderQtyDzn: number; consDzn: number; processLossPct: number;
  uom: string; rate: number;
}
interface EmbellishmentRow {
  id: number; style: string; gmtItem: string; embName: string;
  embDesc: string; qtyDzn: number; ratePerDzn: number;
}
interface CMCostRow {
  id: number; style: string; gmtItem: string; gmtDzn: number;
  cpm: number; smv: number; efficiencyPct: number;
}
interface CommissionRow { id: number; style: string; colour: string; commissionPct: number; }
interface SpecialCostRow { id: number; styleRef: string; colour: string; costHead: string; orderQtyDzn: number; ratePerDzn: number; }
interface OtherCostRow  { id: number; particulars: string; percentage: number; }

interface PreCostRecord {
  id: string;
  preCostNo: string;
  queryNo: string;
  queryType: string;
  styleName: string;
  deliveryDate: string;
  buyerName: string;
  orderNo: string;
  country: string;
  buyerHouse: string;
  brand: string;
  preCostDate: string;
  orderQtyPcs: number;
  unitPrice: number;
  planCutQty: number;
  setRatio: number;
  cmPct: number;
  qualityLevel: string;
  inspectionType: string;
  season: string;
  merchandiser: string;
  exchangeRate: number;
  shippingMode: string;
  payTerm: string;
  tenor: string;
  specialInstructions: string;
  penaltyClause: string;
  refNo: string;
  queryDate: string;
  customerBuyingHouse: string;
  orderType: string;
  buyerAgent: string;
  buyerBrand: string;
  department: string;
  zipFile: string;
  // Key Info
  epm: number; cpm: number; noOfColors: number; extraCuttingPct: number;
  fabricProcessLossPct: number;
  // Key Info by GMT item
  gmtItems: { id: number; name: string; smv: number; mcPerLine: number; efficiencyPct: number; }[];
  // Process Loss (RMG)
  cuttingPct: number; printPct: number; embroideryPct: number; sewingPct: number;
  washDyePct: number; finishingPct: number; extraPct: number;
  // FOB rows
  styleFOBRows: StyleFOBRow[];
  buyerSupMaterialCost: number;
  // Costing rows
  fabricRows: FabricRow[];
  yarnRows: YarnRow[];
  dyedYarnRows: DyedYarnRow[];
  conversionRows: ConversionRow[];
  accessoryRows: AccessoryRow[];
  embellishmentRows: EmbellishmentRow[];
  cmCostRows: CMCostRow[];
  commissionRows: CommissionRow[];
  specialCostRows: SpecialCostRow[];
  otherCostRows: OtherCostRow[];
  // I Sample
  sampleFabricQty: number;
  sampleFabricRate: number;
  sampleQty: number;
  sampleRate: number;
  styleImage: string;
  status: "Saved" | "Pending" | "Approved";
  // Additional costing flags/numbers
  additionalCommercialCostPct: number;
  additionalFinanceCostPct: number;
  additionalBuyingCommissionPct: number;
  additionalCommercialPct: number;
}

// ── Sample Data ─────────────────────────────────────────────────
const SAMPLE: PreCostRecord[] = [{
  id: "PC-001", preCostNo: "26918", queryNo: "Q-26918", queryType: "Regular",
  styleName: "SS27PB093-SL", deliveryDate: "2026-09-26",
  buyerName: "PEPCO", orderNo: "ORD01833307/08/09/10/11/12_01", country: "Poland",
  buyerHouse: "PGS", brand: "", preCostDate: "2026-08-02",
  orderQtyPcs: 39024, unitPrice: 3.15,
  planCutQty: 39414, setRatio: 1.00, cmPct: 23.81,
  qualityLevel: "A-Level", inspectionType: "Final Inspection", season: "SS27", merchandiser: "Md. Al Amin",
  exchangeRate: 120, shippingMode: "Sea", payTerm: "At Sight", tenor: "",
  specialInstructions: "", penaltyClause: "",
  refNo: "REF-99238", queryDate: "2026-08-02", customerBuyingHouse: "PGS House",
  orderType: "Regular", buyerAgent: "PGS Agent", buyerBrand: "Pepco Kids",
  department: "Merchandising Dept", zipFile: "",
  epm: -0.01, cpm: 0.07, noOfColors: 1, extraCuttingPct: 1.00,
  fabricProcessLossPct: 9.85,
  gmtItems: [{ id:1, name:"Sweat Shirt", smv:4.62, mcPerLine:0, efficiencyPct:40 }],
  cuttingPct: 0, printPct: 0, embroideryPct: 0, sewingPct: 0, washDyePct: 0, finishingPct: 0, extraPct: 0,
  styleFOBRows: [
    {
      id: 1, styleNo: "SS27PB093-SL", colour: "Verdant Green", itemName: "Sweat Shirt",
      orderQty: 39024, unitPrice: 3.15, deliveryDate: "2026-09-26",
      sizeGroup: "Boys 8-14", sizes: "S, M, L, XL", sizesQty: 39024,
      print: true, embroidery: false, wash: true, special: false,
      commissionPct: 0, commissionAmt: 0, planCutQty: 39414, buyerCosting: "Pepco Target Costing"
    },
  ],
  buyerSupMaterialCost: 0,
  fabricRows: [
    { id:1, styleRef:"SS27PB093-SL::Verdant Green", fabNature:"Knit", fabricInfo:"FLAT BACK RIB:73% Polyester 27% Cotton", gsm:340, colour:"Verdant Green", source:"Production", orderQtyDzn:3252, consDzn:4.61, uom:"Kg", rate:0 },
    { id:2, styleRef:"SS27PB093-SL::Verdant Green", fabNature:"Knit", fabricInfo:"S/J:73% Polyester 27% Cotton",          gsm:160, colour:"Verdant Green", source:"Production", orderQtyDzn:3252, consDzn:0.24, uom:"Kg", rate:0 },
  ],
  yarnRows: [
    { id:1, composition:"65% Polyester 35% Cotton", count:"24/1", yarnType:"PC",       colour:"Average", yarnQty:11502.08, rate:2.75 },
    { id:2, composition:"100% Polyester",           count:"200D/96F", yarnType:"Filament", colour:"Average", yarnQty:3818.71,  rate:2.20 },
    { id:3, composition:"65% Polyester 35% Cotton", count:"28/1", yarnType:"PC",       colour:"Average", yarnQty:590.50,   rate:3.00 },
  ],
  dyedYarnRows: [],
  conversionRows: [
    { id:1, processType:"Knitting", styleRef:"SS27PB093-SL::Verdant Green", fabNature:"Knit", fabricInfo:"FLAT BACK RIB:73% Polyester 27% Cotton", gsm:340, colType:"Solid", colour:"Verdant Green", shade:"Dark (3.00% - 5.00%)", prQty:15134.25, uom:"Kg", rate:0.70 },
    { id:2, processType:"Knitting", styleRef:"SS27PB093-SL::Verdant Green", fabNature:"Knit", fabricInfo:"S/J:73% Polyester 27% Cotton",          gsm:160, colType:"Solid", colour:"Verdant Green", shade:"Dark (3.00% - 5.00%)", prQty:776.98,   uom:"Kg", rate:0.16 },
    { id:3, processType:"Dyeing",   styleRef:"SS27PB093-SL::Verdant Green", fabNature:"Knit", fabricInfo:"FLAT BACK RIB:73% Polyester 27% Cotton", gsm:340, colType:"Solid", colour:"Verdant Green", shade:"Dark (3.00% - 5.00%)", prQty:15134.25, uom:"Kg", rate:1.55 },
    { id:4, processType:"Dyeing",   styleRef:"SS27PB093-SL::Verdant Green", fabNature:"Knit", fabricInfo:"S/J:73% Polyester 27% Cotton",          gsm:160, colType:"Solid", colour:"Verdant Green", shade:"Dark (3.00% - 5.00%)", prQty:776.98,   uom:"Kg", rate:1.40 },
  ],
  accessoryRows: [
    { id:1,  itemName:"Additional Hangtag", gmtItem:"Sweat Shirt", sensitivityType:"No Sensitivity", orderQtyDzn:3252, consDzn:12.00, processLossPct:2, uom:"PCS",  rate:0.005 },
    { id:2,  itemName:"Blister Poly",       gmtItem:"Sweat Shirt", sensitivityType:"No Sensitivity", orderQtyDzn:3252, consDzn:0.17,  processLossPct:2, uom:"Dzn",  rate:0.75  },
    { id:3,  itemName:"Care Label",         gmtItem:"Sweat Shirt", sensitivityType:"No Sensitivity", orderQtyDzn:3252, consDzn:12.00, processLossPct:2, uom:"PCS",  rate:0.03  },
    { id:4,  itemName:"Carton",             gmtItem:"Sweat Shirt", sensitivityType:"",               orderQtyDzn:3252, consDzn:0.40,  processLossPct:2, uom:"PCS",  rate:0.90  },
    { id:5,  itemName:"Elastic",            gmtItem:"Sweat Shirt", sensitivityType:"No Sensitivity", orderQtyDzn:3252, consDzn:9.60,  processLossPct:2, uom:"Yards",rate:0.07  },
    { id:6,  itemName:"Sewing Thread",      gmtItem:"Sweat Shirt", sensitivityType:"No Sensitivity", orderQtyDzn:3252, consDzn:0.98,  processLossPct:2, uom:"CONE", rate:0.45  },
    { id:7,  itemName:"Zipper",             gmtItem:"Sweat Shirt", sensitivityType:"No Sensitivity", orderQtyDzn:3252, consDzn:1.00,  processLossPct:2, uom:"PCS",  rate:2.20  },
  ],
  embellishmentRows: [],
  cmCostRows: [
    { id:1, style:"SS27PB093-SL", gmtItem:"Sweat Shirt", gmtDzn:3252, cpm:0.065, smv:4.62, efficiencyPct:40 },
  ],
  commissionRows: [
    { id:1, style:"SS27PB093-SL", colour:"Verdant Green", commissionPct:0 },
  ],
  specialCostRows: [
    { id:1, styleRef:"SS27PB093-SL::Verdant Green", colour:"Verdant Green", costHead:"Test Cost", orderQtyDzn:3252, ratePerDzn:0.03 },
  ],
  otherCostRows: [
    { id:1, particulars:"Commercial Cost (%)", percentage:1.10 },
    { id:2, particulars:"Finance Cost (%)",    percentage:2.40 },
    { id:3, particulars:"Buying Commission (%)",percentage:0   },
  ],
  sampleFabricQty:15, sampleFabricRate:4, sampleQty:0, sampleRate:0,
  styleImage: "/src/components/0330c3d6-5cae-49e0-b777-d34891afcc09.jpg",
  status: "Approved",
  additionalCommercialCostPct: 0.00,
  additionalFinanceCostPct: 0.00,
  additionalBuyingCommissionPct: 0.00,
  additionalCommercialPct: 0.00,
}];

let _id = 500;
const nid = () => ++_id;

// ── Calc ─────────────────────────────────────────────────────────
function calcBudget(r: PreCostRecord) {
  const orderValue     = r.orderQtyPcs * r.unitPrice;
  const netOrderValue  = orderValue - r.buyerSupMaterialCost;
  const fabricCost     = r.fabricRows.reduce((s,x)=>s+(x.orderQtyDzn*x.consDzn*x.rate),0);
  const yarnCost       = r.yarnRows.reduce((s,x)=>s+(x.yarnQty*x.rate),0);
  const dyedYarnCost   = r.dyedYarnRows.reduce((s,x)=>s+(x.quantity*x.rate),0);
  const convCost       = r.conversionRows.reduce((s,x)=>s+(x.prQty*x.rate),0);
  const accCost        = r.accessoryRows.reduce((s,x)=>s+(x.orderQtyDzn*x.consDzn*(1+x.processLossPct/100)*x.rate),0);
  const embCost        = r.embellishmentRows.reduce((s,x)=>s+(x.qtyDzn*x.ratePerDzn),0);
  const totalVariable  = fabricCost + yarnCost + dyedYarnCost + convCost + accCost + embCost;
  const contribution   = netOrderValue - totalVariable;
  const cmCost         = r.cmCostRows.reduce((s,x)=>{
    const cmPcs = x.efficiencyPct>0 ? (x.cpm*x.smv)/x.efficiencyPct*100 : 0;
    return s+(cmPcs*12*x.gmtDzn);
  },0);
  const opProfit       = contribution - cmCost;
  const commission     = r.commissionRows.reduce((s,x)=>s+(netOrderValue*x.commissionPct/100),0);
  const specialCost    = r.specialCostRows.reduce((s,x)=>s+(x.orderQtyDzn*x.ratePerDzn),0);
  const otherCost      = r.otherCostRows.reduce((s,x)=>s+(netOrderValue*x.percentage/100),0);
  const sampleCost     = r.sampleFabricQty*r.sampleFabricRate + r.sampleQty*r.sampleRate;
  const totalCost      = totalVariable + cmCost + commission + specialCost + otherCost + sampleCost + r.buyerSupMaterialCost;
  const netProfit      = orderValue - totalCost;
  return { orderValue, netOrderValue, fabricCost, yarnCost, dyedYarnCost, convCost,
    accCost, embCost, totalVariable, contribution, cmCost, opProfit,
    commission, specialCost, otherCost, sampleCost, totalCost, netProfit };
}

const fmt = (v: number, d=2) => v.toLocaleString("en",{minimumFractionDigits:d,maximumFractionDigits:d});
const pct = (v: number, base: number) => base>0 ? ((v/base)*100).toFixed(2) : "0.00";

const StatusBadge = ({ s }: { s: PreCostRecord["status"] }) => {
  const c = { Approved:"bg-emerald-50 text-emerald-700 border-emerald-200", Pending:"bg-amber-50 text-amber-700 border-amber-200", Saved:"bg-slate-100 text-slate-600 border-slate-200" }[s];
  const ic = { Approved:<CheckCircle className="size-3"/>, Pending:<Clock className="size-3"/>, Saved:<AlertCircle className="size-3"/> }[s];
  return <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${c}`}>{ic}{s}</span>;
};

// ── Page ─────────────────────────────────────────────────────────
export default function PreCostingPage() {
  const [view, setView] = useState<"list"|"form"|"detail">("list");
  const [records, setRecords] = useState<PreCostRecord[]>(SAMPLE);
  const [search, setSearch]   = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL"|PreCostRecord["status"]>("ALL");
  const [filterBuyer, setFilterBuyer]   = useState("");
  const [fromDate, setFromDate] = useState("2026-01-08");
  const [toDate,   setToDate]   = useState("2026-09-02");
  const [activeRec, setActiveRec] = useState<PreCostRecord | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string,boolean>>({});
  const tog = (k: string) => setCollapsed(p=>({...p,[k]:!p[k]}));

  const mkBlank = (): PreCostRecord => ({
    id:"", preCostNo:"", queryNo:"", queryType:"Regular", styleName:"", deliveryDate:"",
    buyerName:"", orderNo:"", country:"", buyerHouse:"", brand:"", preCostDate:new Date().toISOString().split("T")[0],
    orderQtyPcs:0, unitPrice:0, planCutQty:0, setRatio:1, cmPct:0,
    qualityLevel:"", inspectionType:"", season:"", merchandiser:"",
    exchangeRate:120, shippingMode:"Sea", payTerm:"At Sight", tenor:"",
    specialInstructions:"", penaltyClause:"",
    refNo: "", queryDate: new Date().toISOString().split("T")[0], customerBuyingHouse: "",
    orderType: "Regular", buyerAgent: "", buyerBrand: "", department: "", zipFile: "",
    epm:0, cpm:0.065, noOfColors:1, extraCuttingPct:1, fabricProcessLossPct:0,
    gmtItems:[{id:nid(),name:"",smv:0,mcPerLine:0,efficiencyPct:65}],
    cuttingPct:0, printPct:0, embroideryPct:0, sewingPct:0, washDyePct:0, finishingPct:0, extraPct:0,
    styleFOBRows:[],
    buyerSupMaterialCost:0,
    fabricRows:[],
    yarnRows:[],
    dyedYarnRows:[],
    conversionRows:[],
    accessoryRows:[],
    embellishmentRows:[],
    cmCostRows:[],
    commissionRows:[],
    specialCostRows:[],
    otherCostRows:[
      {id:nid(),particulars:"Commercial Cost (%)",percentage:0},
      {id:nid(),particulars:"Finance Cost (%)",percentage:0},
      {id:nid(),particulars:"Buying Commission (%)",percentage:0},
    ],
    sampleFabricQty:0, sampleFabricRate:0, sampleQty:0, sampleRate:0,
    styleImage:"", status:"Saved",
    additionalCommercialCostPct: 0.00,
    additionalFinanceCostPct: 0.00,
    additionalBuyingCommissionPct: 0.00,
    additionalCommercialPct: 0.00,
  });

  const [form, setForm] = useState<PreCostRecord>(mkBlank());
  const sf = (p: Partial<PreCostRecord>) => setForm(prev=>({...prev,...p}));
  const B  = useMemo(()=>calcBudget(form),[form]);
  const BR = activeRec ? calcBudget(activeRec) : null;

  // Local state variables for "Order Style Information" entry block
  const [styleNo, setStyleNo] = useState("");
  const [colour, setColour] = useState("");
  const [styleOrderQty, setStyleOrderQty] = useState(0);
  const [itemType, setItemType] = useState("Pcs");
  const [sizeGroup, setSizeGroup] = useState("");
  const [buyerCosting, setBuyerCosting] = useState("");
  const [styleUnitPrice, setStyleUnitPrice] = useState(0);
  const [styleDeliveryDate, setStyleDeliveryDate] = useState("");
  const [planCutQty, setPlanCutQty] = useState(0);
  const [commissionPct, setCommissionPct] = useState(0);

  const [hasPrint, setHasPrint] = useState(false);
  const [hasEmbroidery, setHasEmbroidery] = useState(false);
  const [hasWash, setHasWash] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);

  const calculatedCommissionAmt = styleOrderQty * styleUnitPrice * (commissionPct / 100);

  const addStyleToList = () => {
    if (!styleNo.trim()) { toast.error("Style No is required."); return; }
    if (!colour.trim()) { toast.error("Colour is required."); return; }
    if (styleOrderQty <= 0) { toast.error("Order Quantity must be greater than 0."); return; }
    if (styleUnitPrice <= 0) { toast.error("Unit price must be greater than 0."); return; }

    const newRow: StyleFOBRow = {
      id: nid(),
      styleNo,
      colour,
      itemName: styleNo + " Item",
      orderQty: styleOrderQty,
      unitPrice: styleUnitPrice,
      deliveryDate: styleDeliveryDate || form.deliveryDate || new Date().toISOString().split("T")[0],
      sizeGroup,
      sizes: "Standard",
      sizesQty: styleOrderQty,
      print: hasPrint,
      embroidery: hasEmbroidery,
      wash: hasWash,
      special: hasSpecial,
      commissionPct,
      commissionAmt: calculatedCommissionAmt,
      planCutQty,
      buyerCosting,
    };

    sf({
      styleFOBRows: [...form.styleFOBRows, newRow],
      orderQtyPcs: form.orderQtyPcs + styleOrderQty,
      unitPrice: styleUnitPrice, // sets last style's unit price as base
      planCutQty: form.planCutQty + planCutQty
    });

    // Reset local state fields
    setStyleNo("");
    setColour("");
    setStyleOrderQty(0);
    setSizeGroup("");
    setBuyerCosting("");
    setStyleUnitPrice(0);
    setStyleDeliveryDate("");
    setPlanCutQty(0);
    setCommissionPct(0);
    setHasPrint(false);
    setHasEmbroidery(false);
    setHasWash(false);
    setHasSpecial(false);

    toast.success("Style added to table.");
  };

  const removeStyleFromList = (rowId: number) => {
    const row = form.styleFOBRows.find(x => x.id === rowId);
    if (!row) return;
    sf({
      styleFOBRows: form.styleFOBRows.filter(x => x.id !== rowId),
      orderQtyPcs: Math.max(0, form.orderQtyPcs - row.orderQty),
      planCutQty: Math.max(0, form.planCutQty - row.planCutQty)
    });
    toast.info("Style removed.");
  };

  const filtered = records.filter(r=>{
    const s=search.toLowerCase();
    return (r.preCostNo.includes(s)||r.buyerName.toLowerCase().includes(s)||r.queryNo.includes(s))
      &&(filterStatus==="ALL"||r.status===filterStatus)
      &&(!filterBuyer||r.buyerName.toLowerCase().includes(filterBuyer.toLowerCase()));
  });

  const handleSave = () => {
    if(!form.buyerName.trim()){ toast.error("Buyer Name is required."); return; }
    if(form.id){
      setRecords(prev=>prev.map(r=>r.id===form.id?{...form}:r));
      toast.success("Pre-Costing updated!");
    }else{
      const no=`PC-${String(records.length+26859).padStart(5,"0")}`;
      setRecords(prev=>[{...form,id:`PC-${Date.now()}`,preCostNo:no,queryNo:`Q-${no}`},...prev]);
      toast.success(`Pre-Cost ${no} saved!`);
    }
    setView("list");
  };

  const openEdit   = (r: PreCostRecord) => { setForm({...r}); setView("form"); };
  const openDetail = (r: PreCostRecord) => { setActiveRec(r); setView("detail"); };

  // ── Input atoms ───────────────────────────────────────────────
  const TI = ({val,onChange,ph="",cls=""}:{val:string;onChange:(v:string)=>void;ph?:string;cls?:string}) => (
    <input type="text" value={val} onChange={e=>onChange(e.target.value)} placeholder={ph}
      className={`w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-400 bg-white placeholder-slate-350 transition-all ${cls}`}/>
  );
  const NI = ({val,onChange,cls=""}:{val:number;onChange:(v:number)=>void;cls?:string}) => (
    <input type="number" step="any" value={val||""} onChange={e=>onChange(Number(e.target.value))}
      className={`w-full text-right font-mono text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-355 focus:outline-none focus:ring-2 focus:ring-indigo-300/50 focus:border-indigo-400 bg-white transition-all ${cls}`}/>
  );
  const DI = ({val,onChange}:{val:string;onChange:(v:string)=>void}) => (
    <input type="date" value={val} onChange={e=>onChange(e.target.value)}
      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-indigo-300/50 focus:border-indigo-400 bg-white transition-all"/>
  );
  const Label = ({children, req=false}:{children:React.ReactNode; req?:boolean}) => (
    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-tight mb-1">
      {children} {req && <span className="text-rose-500">*</span>}
    </label>
  );
  const Lbl = ({children}:{children:React.ReactNode}) => (
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{children}</p>
  );

  // ────────────────────────────────────────────────────────────────
  return (
    <MerchandisingLayout activePath="pre-costing" breadcrumbs={[{label:"Pre-Costing"}]} title="Pre-Costing">
      <div className="bg-slate-50 dark:bg-slate-950 min-h-full">

        {/* ══════════ LIST VIEW ══════════ */}
        {view==="list"&&(
          <div className="p-4 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div>
                <h1 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><FileText className="size-4"/></span>
                  Pre-Costing Register
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">Manage all style pre-costings, budget summaries, and FOB calculations.</p>
              </div>
              <button onClick={()=>{setForm(mkBlank());setView("form");}} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm cursor-pointer transition">
                <Plus className="size-3.5"/> New Pre-Costing
              </button>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
                <div><Lbl>From Date</Lbl><DI val={fromDate} onChange={setFromDate}/></div>
                <div><Lbl>To Date</Lbl><DI val={toDate} onChange={setToDate}/></div>
                <div><Lbl>Buyer Name</Lbl><TI val={filterBuyer} onChange={setFilterBuyer} ph="Filter buyer…"/></div>
                <div><Lbl>Status</Lbl>
                  <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value as any)} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-semibold">
                    <option value="ALL">ALL</option><option>Saved</option><option>Pending</option><option>Approved</option>
                  </select>
                </div>
                <div><Lbl>Pre-Cost No</Lbl><TI val={search} onChange={setSearch} ph="Search…"/></div>
                <div className="flex flex-col justify-end">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5">
                    <Search className="size-3.5"/> Search
                  </button>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 cursor-pointer transition"><FileSpreadsheet className="size-3.5"/> Excel</button>
                <button className="flex items-center gap-1 text-xs font-bold text-slate-650 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer transition"><Printer className="size-3.5"/> Print</button>
                <button className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 cursor-pointer transition"><Download className="size-3.5"/> PDF</button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>{["#","Pre-Cost No","Query Type","Date","Buyer","Style","Order Qty","Unit Price","Delivery","Merchandiser","Status",""].map((h,i)=>(
                      <th key={i} className="px-4 py-2.5 text-[10px] font-black uppercase text-slate-400 text-left">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((r,i)=>(
                      <tr key={r.id} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-4 py-3 text-slate-400 font-bold">{i+1}</td>
                        <td className="px-4 py-3 font-black text-indigo-600">{r.preCostNo}</td>
                        <td className="px-4 py-3 text-slate-605">{r.queryType}</td>
                        <td className="px-4 py-3 text-slate-500">{r.preCostDate}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{r.buyerName}</td>
                        <td className="px-4 py-3 font-mono text-slate-700 max-w-[160px] truncate" title={r.styleName}>{r.styleName}</td>
                        <td className="px-4 py-3 font-mono font-semibold">{r.orderQtyPcs.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono">$ {r.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-slate-500">{r.deliveryDate}</td>
                        <td className="px-4 py-3 text-slate-600">{r.merchandiser}</td>
                        <td className="px-4 py-3"><StatusBadge s={r.status}/></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>openDetail(r)} className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer border border-indigo-100 transition" title="View"><Eye className="size-3.5"/></button>
                            <button onClick={()=>openEdit(r)} className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 cursor-pointer border border-amber-100 transition" title="Edit"><Pencil className="size-3.5"/></button>
                            <button onClick={()=>openDetail(r)} className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-600 cursor-pointer border border-teal-100 transition" title="Print"><Printer className="size-3.5"/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
                <span className="text-[11px] text-slate-500 font-semibold">Showing {filtered.length} of {records.length} records</span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ FORM VIEW ══════════ */}
        {view==="form"&&(
          <div className="pb-24">
            <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-5 sticky top-0 z-35 shadow-xs">
              <div className="flex items-center gap-3">
                <button onClick={()=>setView("list")} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer transition"><ArrowLeft size={16}/></button>
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Prepare Pre-Cost</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 transition shadow-sm">
                  <Save className="size-3.5"/> Save Pre-Cost
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6 max-w-8xl mx-auto space-y-6">

              {/* Section 1: Order Basic Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col md:flex-row gap-6 p-5">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                
                {/* Form fields grid */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-xs font-black uppercase text-blue-600 tracking-wider">Order Basic Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label>Query No</Label>
                      <TI val={form.queryNo} onChange={v => sf({queryNo:v})} ph="Enter Query No"/>
                    </div>
                    <div>
                      <Label>Order Quantity</Label>
                      <NI val={form.orderQtyPcs} onChange={v => sf({orderQtyPcs:v})} />
                    </div>
                    <div>
                      <Label req>Query Type</Label>
                      <select value={form.queryType} onChange={e=>sf({queryType:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option>Regular</option>
                        <option>Sample</option>
                      </select>
                    </div>
                    <div>
                      <Label>Ref No</Label>
                      <TI val={form.refNo} onChange={v => sf({refNo:v})} ph="Enter Ref No"/>
                    </div>

                    <div>
                      <Label req>Query Date</Label>
                      <DI val={form.queryDate} onChange={v => sf({queryDate:v})}/>
                    </div>
                    <div>
                      <Label>Delivery Date</Label>
                      <DI val={form.deliveryDate} onChange={v => sf({deliveryDate:v})}/>
                    </div>
                    <div>
                      <Label>Customer/Buying House</Label>
                      <select value={form.customerBuyingHouse} onChange={e=>sf({customerBuyingHouse:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option value="">Select...</option>
                        <option>NITEX</option>
                        <option>PGS House</option>
                      </select>
                    </div>
                    <div>
                      <Label req>Buyer Name</Label>
                      <select value={form.buyerName} onChange={e=>sf({buyerName:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option value="">select...</option>
                        <option>THE SET</option>
                        <option>PEPCO</option>
                      </select>
                    </div>

                    <div>
                      <Label req>Department</Label>
                      <select value={form.department} onChange={e=>sf({department:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option value="">Select...</option>
                        <option>Merchandising Dept</option>
                        <option>Sourcing Dept</option>
                      </select>
                    </div>
                    <div>
                      <Label>Order Type</Label>
                      <select value={form.orderType} onChange={e=>sf({orderType:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option>Regular</option>
                        <option>Sample</option>
                      </select>
                    </div>
                    <div>
                      <Label>Buyer Agent</Label>
                      <select value={form.buyerAgent} onChange={e=>sf({buyerAgent:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option value="">Select...</option>
                        <option>PGS Agent</option>
                      </select>
                    </div>
                    <div>
                      <Label>Buyer Brand</Label>
                      <select value={form.buyerBrand} onChange={e=>sf({buyerBrand:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option value="">Select...</option>
                        <option>Pepco Kids</option>
                      </select>
                    </div>

                    <div>
                      <Label req>Quality Level</Label>
                      <select value={form.qualityLevel} onChange={e=>sf({qualityLevel:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option value="">Select...</option>
                        <option>A-Level</option>
                        <option>B-Level</option>
                      </select>
                    </div>
                    <div>
                      <Label req>Inspection Type</Label>
                      <select value={form.inspectionType} onChange={e=>sf({inspectionType:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option value="">Select...</option>
                        <option>Final Inspection</option>
                        <option>Mid Inspection</option>
                      </select>
                    </div>
                    <div>
                      <Label req>Season</Label>
                      <select value={form.season} onChange={e=>sf({season:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option value="">Select...</option>
                        <option>SS27</option>
                        <option>FW27</option>
                      </select>
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <select value="USD" disabled className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 cursor-not-allowed font-medium">
                        <option>USD</option>
                      </select>
                    </div>

                    <div>
                      <Label>Exchange Rate</Label>
                      <NI val={form.exchangeRate} onChange={v => sf({exchangeRate:v})} />
                    </div>
                    <div>
                      <Label>Shipping Mode</Label>
                      <select value={form.shippingMode} onChange={e=>sf({shippingMode:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option>Sea</option>
                        <option>Air</option>
                        <option>Road</option>
                      </select>
                    </div>
                    <div>
                      <Label>Pay Term</Label>
                      <select value={form.payTerm} onChange={e=>sf({payTerm:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option>At Sight</option>
                        <option>90 Days</option>
                        <option>60 Days</option>
                      </select>
                    </div>
                    <div>
                      <Label>Tenor</Label>
                      <TI val={form.tenor} onChange={v => sf({tenor:v})} ph="Enter Tenor"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Special Instructions</Label>
                      <TI val={form.specialInstructions} onChange={v => sf({specialInstructions:v})} />
                    </div>
                    <div>
                      <Label>Penalty Clauses</Label>
                      <TI val={form.penaltyClause} onChange={v => sf({penaltyClause:v})} />
                    </div>
                  </div>

                  <div>
                    <Label>Zip file Upload</Label>
                    <input type="file" className="block w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer" />
                  </div>
                </div>

                {/* Right Mockup image uploader */}
                <div className="w-full md:w-56 shrink-0 flex flex-col items-center justify-center border border-slate-200 rounded-xl bg-slate-50 p-4">
                  {form.styleImage ? (
                    <img src={form.styleImage} alt="Preview" className="max-h-36 object-contain rounded-lg mb-3" />
                  ) : (
                    <div className="w-full h-36 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-350 text-center mb-3">
                      <ImageIcon className="size-10 stroke-1 mb-1" />
                      <span className="text-[10px] font-black uppercase tracking-wider">NO IMAGE AVAILABLE</span>
                    </div>
                  )}
                  <input type="file" onChange={e => sf({styleImage: "/src/components/0330c3d6-5cae-49e0-b777-d34891afcc09.jpg"})} className="block w-full text-[10px] text-slate-450 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[9.5px] file:font-black file:bg-indigo-50 file:text-indigo-650 hover:file:bg-indigo-100 cursor-pointer" />
                </div>
              </div>

              {/* Section 2: Operation Process Loss (RMG) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden p-5">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                <h3 className="text-xs font-black uppercase text-blue-600 tracking-wider mb-4">Operation Process Loss (RMG)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  <div>
                    <Label>Cutting (%)</Label>
                    <NI val={form.cuttingPct} onChange={v => sf({cuttingPct:v})} />
                  </div>
                  <div>
                    <Label>Print (%)</Label>
                    <NI val={form.printPct} onChange={v => sf({printPct:v})} />
                  </div>
                  <div>
                    <Label>Embroidery (%)</Label>
                    <NI val={form.embroideryPct} onChange={v => sf({embroideryPct:v})} />
                  </div>
                  <div>
                    <Label>Sewing (%)</Label>
                    <NI val={form.sewingPct} onChange={v => sf({sewingPct:v})} />
                  </div>
                  <div>
                    <Label>Garment Wash/Dye (%)</Label>
                    <NI val={form.washDyePct} onChange={v => sf({washDyePct:v})} />
                  </div>
                  <div>
                    <Label>Finishing (%)</Label>
                    <NI val={form.finishingPct} onChange={v => sf({finishingPct:v})} />
                  </div>
                  <div>
                    <Label>Extra (%)</Label>
                    <NI val={form.extraPct} onChange={v => sf({extraPct:v})} />
                  </div>
                </div>
              </div>

              {/* Section 3: Order Style Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden p-5">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                <h3 className="text-xs font-black uppercase text-blue-600 tracking-wider mb-4">Order Style Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label req>Style No</Label>
                    <TI val={styleNo} onChange={setStyleNo} ph="Enter Style No"/>
                  </div>
                  
                  <div>
                    <Label req>Colour</Label>
                    <div className="flex gap-2">
                      <select value={colour} onChange={e=>setColour(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option value="">Select...</option>
                        <option>Verdant Green</option>
                        <option>Lilas AOP</option>
                        <option>Vintage Indigo</option>
                      </select>
                      <button className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-650 cursor-pointer font-black text-xs transition flex items-center justify-center">+</button>
                    </div>
                  </div>

                  <div>
                    <Label req>Style Order Qty</Label>
                    <NI val={styleOrderQty} onChange={setStyleOrderQty} />
                  </div>

                  <div>
                    <Label req>Item Type</Label>
                    <div className="flex gap-2">
                      <select value={itemType} onChange={e=>setItemType(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option>Pcs</option>
                        <option>Dzn</option>
                      </select>
                      <button className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-650 cursor-pointer font-black text-xs transition flex items-center justify-center"><List size={14} /></button>
                    </div>
                  </div>

                  <div>
                    <Label req>Size Group</Label>
                    <div className="flex gap-2 items-end">
                      <select value={sizeGroup} onChange={e=>setSizeGroup(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                        <option value="">Select...</option>
                        <option>Boys 8-14</option>
                        <option>Girls Dress</option>
                        <option>Sweat Shirt</option>
                      </select>
                      <button className="px-2.5 py-1 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 rounded-lg text-[9.5px] font-bold text-indigo-650 cursor-pointer transition uppercase">Size</button>
                      <button className="px-2.5 py-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-[9.5px] font-bold text-slate-500 cursor-pointer transition uppercase">Reset</button>
                    </div>
                  </div>

                  <div>
                    <Label>Buyer Costing</Label>
                    <select value={buyerCosting} onChange={e=>setBuyerCosting(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                      <option value="">Select...</option>
                      <option>Pepco Target Costing</option>
                    </select>
                  </div>

                  <div>
                    <Label req>Style Unit Price ($)</Label>
                    <NI val={styleUnitPrice} onChange={setStyleUnitPrice} />
                  </div>

                  <div>
                    <Label req>Style Delivery Date</Label>
                    <DI val={styleDeliveryDate} onChange={setStyleDeliveryDate} />
                  </div>

                  <div>
                    <Label>Plan Cut Qty</Label>
                    <NI val={planCutQty} onChange={setPlanCutQty} />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label req>Comm(%)</Label>
                      <NI val={commissionPct} onChange={setCommissionPct} />
                    </div>
                    <div>
                      <Label>Comm Amt</Label>
                      <div className="text-right font-mono font-bold text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">$ {fmt(calculatedCommissionAmt)}</div>
                    </div>
                  </div>
                </div>

                {/* Print, Embroidery, Wash, Special switches + Add button */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <div className="flex gap-2">
                    {[
                      { l: "Print", active: hasPrint, fn: setHasPrint },
                      { l: "Embroidery", active: hasEmbroidery, fn: setHasEmbroidery },
                      { l: "Wash", active: hasWash, fn: setHasWash },
                      { l: "Special", active: hasSpecial, fn: setHasSpecial },
                    ].map(btn => (
                      <button
                        key={btn.l}
                        onClick={() => btn.fn(!btn.active)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          btn.active
                            ? "bg-rose-500 text-white border-rose-600 shadow-sm"
                            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                        }`}
                      >
                        {btn.l}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={addStyleToList}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="size-3.5"/> ADD TO LIST
                  </button>
                </div>
              </div>

              {/* Section 4: Basic Information Grid (Added styles list) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden p-5">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                <h3 className="text-xs font-black uppercase text-blue-600 tracking-wider mb-4">Order Basic Information</h3>
                
                <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-xs">
                  <table className="w-full text-xs text-slate-700">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-250">
                        {["#","Style No","Colour","Item Name","OrderQty","Size Group","Sizes","SizesQty","Print","Embroidery","Wash","Special","UnitPrice","DeliveryDate","∇"].map((h,i)=>(
                          <th key={i} className="px-3 py-2 text-left font-black text-slate-500 uppercase tracking-wider text-[8.5px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {form.styleFOBRows.length === 0 ? (
                        <tr><td colSpan={15} className="px-4 py-6 text-center text-slate-400 font-medium">No styles added. Add styles above.</td></tr>
                      ) : (
                        form.styleFOBRows.map((r,i)=>(
                          <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-3 py-2 text-slate-400 font-bold">{i+1}</td>
                            <td className="px-3 py-2 font-bold text-slate-900">{r.styleNo}</td>
                            <td className="px-3 py-2 font-semibold text-slate-650">{r.colour}</td>
                            <td className="px-3 py-2">{r.itemName}</td>
                            <td className="px-3 py-2 font-mono text-right font-semibold">{r.orderQty.toLocaleString()}</td>
                            <td className="px-3 py-2">{r.sizeGroup}</td>
                            <td className="px-3 py-2 text-slate-500">{r.sizes}</td>
                            <td className="px-3 py-2 font-mono text-right">{r.sizesQty.toLocaleString()}</td>
                            <td className="px-3 py-2 font-bold">{r.print ? "Yes" : "No"}</td>
                            <td className="px-3 py-2 font-bold">{r.embroidery ? "Yes" : "No"}</td>
                            <td className="px-3 py-2 font-bold">{r.wash ? "Yes" : "No"}</td>
                            <td className="px-3 py-2 font-bold">{r.special ? "Yes" : "No"}</td>
                            <td className="px-3 py-2 font-mono text-right font-bold text-slate-800">$ {r.unitPrice.toFixed(2)}</td>
                            <td className="px-3 py-2 font-mono">{r.deliveryDate}</td>
                            <td className="px-3 py-2">
                              <button onClick={() => removeStyleFromList(r.id)} className="p-1 rounded hover:bg-rose-50 hover:text-rose-500 text-slate-300 transition cursor-pointer" title="Remove"><X className="size-3.5"/></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 5: Additional Costing Checkbox block */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden p-5">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                <div className="flex items-center gap-2 mb-4">
                  <input type="checkbox" defaultChecked id="add-cost" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer" />
                  <label htmlFor="add-cost" className="text-xs font-black uppercase text-blue-600 tracking-wider cursor-pointer">Additional Costing</label>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-xs text-slate-700">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {["#","Commercial Cost (%)","Finance Cost (%)","Buying Commission (%)","Sample Fabric Qty","Sample Fabric Rate","Commercial(%)"].map((h,i)=>(
                          <th key={i} className="px-3 py-2.5 text-left font-black text-slate-500 uppercase tracking-wider text-[8.5px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      <tr className="bg-white">
                        <td className="px-3 py-2 text-slate-400 font-bold">1</td>
                        <td className="px-2 py-1.5"><input type="number" step="any" value={form.additionalCommercialCostPct} onChange={e=>sf({additionalCommercialCostPct:Number(e.target.value)})} className="w-full font-mono text-xs px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white" /></td>
                        <td className="px-2 py-1.5"><input type="number" step="any" value={form.additionalFinanceCostPct} onChange={e=>sf({additionalFinanceCostPct:Number(e.target.value)})} className="w-full font-mono text-xs px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white" /></td>
                        <td className="px-2 py-1.5"><input type="number" step="any" value={form.additionalBuyingCommissionPct} onChange={e=>sf({additionalBuyingCommissionPct:Number(e.target.value)})} className="w-full font-mono text-xs px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white" /></td>
                        <td className="px-2 py-1.5"><input type="number" step="any" value={form.sampleFabricQty} onChange={e=>sf({sampleFabricQty:Number(e.target.value)})} className="w-full font-mono text-xs px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white" /></td>
                        <td className="px-2 py-1.5"><input type="number" step="any" value={form.sampleFabricRate} onChange={e=>sf({sampleFabricRate:Number(e.target.value)})} className="w-full font-mono text-xs px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white" /></td>
                        <td className="px-2 py-1.5"><input type="number" step="any" value={form.additionalCommercialPct} onChange={e=>sf({additionalCommercialPct:Number(e.target.value)})} className="w-full font-mono text-xs px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Final save button in the bottom right */}
                <div className="mt-6 flex justify-end">
                  <button onClick={handleSave} className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-sm uppercase tracking-wider">
                    Save
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ══════════ DETAIL / PRINT VIEW ══════════ */}
        {view==="detail"&&activeRec&&BR&&(
          <div className="p-3 md:p-6 max-w-[1500px] mx-auto pb-24">
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 mb-4 print:hidden">
              <button onClick={()=>setView("list")} className="flex items-center gap-1.5 text-xs font-bold text-slate-650 hover:text-slate-900 cursor-pointer transition"><ArrowLeft className="size-4"/> Back to List</button>
              <div className="flex gap-2">
                <button onClick={()=>openEdit(activeRec)} className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition"><Pencil className="size-3.5"/> Edit</button>
                <button onClick={()=>window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition"><Printer className="size-3.5"/> Print</button>
              </div>
            </div>

            {/* ── PRINTABLE DOCUMENT ── */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 md:p-8 space-y-6 text-[11px] text-slate-800 leading-relaxed max-w-full mx-auto print:border-none print:shadow-none print:p-0">

              {/* ── Company Header (Premium Letterhead style) ── */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 pb-5 gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-16 h-12 rounded-xl bg-indigo-600 flex flex-col items-center justify-center text-white font-black text-[12px] shadow-sm select-none">
                    <span className="tracking-widest">PK</span>
                    <span className="text-[7px] text-indigo-200 uppercase font-bold tracking-tight">Knit</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-slate-900 tracking-wide uppercase">Pakiza Knit Composite Ltd</h1>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">Composite Textile | Gazipur, Bangladesh</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Pre-Costing Sheet</p>
                  <div className="mt-1.5 flex items-center justify-center sm:justify-end gap-2">
                    <StatusBadge s={activeRec.status}/>
                  </div>
                </div>
              </div>

              {/* ── Style Information Grid ── */}
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                  Style Information
                </p>
                <div className="grid grid-cols-2 md:grid-cols-6 border border-slate-200 rounded-xl overflow-hidden text-[10px] shadow-xs">
                  {[
                    ["Pre-Cost No", activeRec.preCostNo],
                    ["Style Name",  activeRec.styleName],
                    ["Delivery Date", activeRec.deliveryDate],
                    ["Buyer Name",  activeRec.buyerName],
                    ["Order No",    activeRec.orderNo],
                    ["Country",     activeRec.country],
                    ["Buyer House", activeRec.buyerHouse],
                    ["Brand",       activeRec.brand || "-"],
                    ["Pre-Cost Date", activeRec.preCostDate],
                    ["Order Qty (Pcs)", activeRec.orderQtyPcs.toLocaleString()],
                    ["Unit Price",  `$ ${activeRec.unitPrice.toFixed(2)}`],
                    ["Total Value", `$ ${fmt(BR.orderValue)}`],
                    ["Plan Cut Qty", activeRec.planCutQty.toLocaleString()],
                    ["Set Ratio",   activeRec.setRatio.toFixed(2)],
                    ["CM %",        `${activeRec.cmPct.toFixed(2)}%`],
                    ["Cost per Dzn", `$ ${fmt((BR.totalCost/activeRec.orderQtyPcs)*12,4)}`],
                    ["Quality Level", activeRec.qualityLevel || "-"],
                    ["Inspection Type", activeRec.inspectionType || "-"],
                    ["Season",      activeRec.season],
                    ["Merchandiser", activeRec.merchandiser],
                  ].map(([label, val], idx) => (
                    <div key={idx} className="flex border-b border-r border-slate-150 last:border-r-0 col-span-2">
                      <span className="w-28 shrink-0 text-[8.5px] font-black text-slate-500 uppercase px-2.5 py-2 bg-slate-50/50 border-r border-slate-100 flex items-center tracking-wider">{label}</span>
                      <span className="flex-1 px-3 py-2 font-bold text-slate-700 truncate" title={val as string}>{val as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Style & FOB table ── */}
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                  Style and FOB Details
                </p>
                <div className="border border-slate-250 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-[10px] text-slate-750">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {["Style No","Color","Item Name","Order Qty","Unit Price","Total Price","Delivery Date"].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left font-black text-slate-500 uppercase tracking-wider text-[8.5px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeRec.styleFOBRows.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-4 py-2 font-bold text-slate-900">{r.styleNo}</td>
                          <td className="px-4 py-2">{r.colour}</td>
                          <td className="px-4 py-2">{r.itemName}</td>
                          <td className="px-4 py-2 text-right font-mono font-semibold">{r.orderQty.toLocaleString()}</td>
                          <td className="px-4 py-2 text-right font-mono font-semibold">$ {r.unitPrice.toFixed(4)}</td>
                          <td className="px-4 py-2 text-right font-mono font-bold text-indigo-600">$ {fmt(r.orderQty*r.unitPrice)}</td>
                          <td className="px-4 py-2">{r.deliveryDate}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-black border-t border-slate-250 text-[10px] text-slate-800">
                        <td colSpan={3} className="px-4 py-2">Total:</td>
                        <td className="px-4 py-2 text-right font-mono">{activeRec.styleFOBRows.reduce((s,x)=>s+x.orderQty,0).toLocaleString()}</td>
                        <td/>
                        <td className="px-4 py-2 text-right font-mono text-indigo-600">$ {fmt(activeRec.styleFOBRows.reduce((s,x)=>s+x.orderQty*x.unitPrice,0))}</td>
                        <td/>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ── Key Info + Style Image + Budget Summary (Extremely Aligned Grid) ── */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">

                {/* Key Information Table */}
                <div className="col-span-12 md:col-span-4 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                      Key Information
                    </p>
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                      <table className="w-full text-[10px] text-slate-700">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-3 py-2 text-left font-black text-slate-500 uppercase text-[8.5px] tracking-wider">Particulars</th>
                            <th className="px-3 py-2 text-left font-black text-slate-500 uppercase text-[8.5px] tracking-wider">GMT Item</th>
                            <th className="px-3 py-2 text-right font-black text-slate-500 uppercase text-[8.5px] tracking-wider">Info</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[10px]">
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">EPM</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{activeRec.epm.toFixed(2)}</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">CPM</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{activeRec.cpm.toFixed(2)}</td></tr>
                          {activeRec.gmtItems.map(g => {
                            const smvVal = g.smv;
                            const mcPerLineVal = g.mcPerLine;
                            const effPct = g.efficiencyPct;
                            const prodPerHour = mcPerLineVal > 0 ? (mcPerLineVal * 60 / smvVal) * (effPct / 100) : 0;
                            return (
                              <React.Fragment key={g.id}>
                                <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">SMV</td><td className="px-3 py-1.5 text-slate-650 font-semibold">{g.name}</td><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{smvVal.toFixed(2)}</td></tr>
                                <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">M/c Per Line</td><td className="px-3 py-1.5 text-slate-650 font-semibold">{g.name}</td><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{mcPerLineVal.toFixed(2)}</td></tr>
                                <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Efficiency %</td><td className="px-3 py-1.5 text-slate-650 font-semibold">{g.name}</td><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{effPct.toFixed(2)}%</td></tr>
                                <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Production per Hour</td><td className="px-3 py-1.5 text-slate-650 font-semibold">{g.name}</td><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{prodPerHour.toFixed(2)}</td></tr>
                              </React.Fragment>
                            );
                          })}
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Assortment</td><td/><td className="px-3 py-1.5 text-right font-mono text-slate-450 font-semibold">—</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">No of Color</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{activeRec.noOfColors}</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Avg Wgt Per Color</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{fmt(activeRec.fabricRows.reduce((s,x)=>s+(x.orderQtyDzn*x.consDzn),0)/Math.max(activeRec.noOfColors,1))} Kg</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Extra Cutting %</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{activeRec.extraCuttingPct.toFixed(2)}%</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Extra Cut Qty (Pcs)</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{Math.round(activeRec.orderQtyPcs*activeRec.extraCuttingPct/100).toLocaleString()}</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Fabric Process Loss %</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{activeRec.fabricProcessLossPct.toFixed(2)}%</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Fabric Loss Qty (Kg)</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{fmt(activeRec.fabricRows.reduce((s,x)=>s+(x.orderQtyDzn*x.consDzn),0) * (activeRec.fabricProcessLossPct / 100))} Kg</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Lead Time</td><td/><td className="px-3 py-1.5 text-right font-mono text-slate-450 font-semibold">—</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Penalty Clause</td><td colSpan={2} className="px-3 py-1.5 text-slate-800 font-medium">{activeRec.penaltyClause || "None"}</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Special Instructions</td><td colSpan={2} className="px-3 py-1.5 text-slate-800 font-medium">{activeRec.specialInstructions || "None"}</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Sample</td><td/><td className="px-3 py-1.5 text-right font-mono text-slate-450 font-semibold">—</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Style Image center */}
                <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 bg-slate-50/35 relative overflow-hidden group min-h-[300px]">
                  {activeRec.styleImage ? (
                    <img
                      src={activeRec.styleImage}
                      alt="Style Mockup"
                      className="max-h-[320px] w-full object-contain rounded-xl transition duration-500 transform group-hover:scale-102"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileText className="size-10 mb-3 stroke-1 text-slate-300" />
                      <span className="text-[10px] font-bold tracking-wider uppercase">No Sketch Uploaded</span>
                    </div>
                  )}
                </div>

                {/* Budget Summary right */}
                <div className="col-span-12 md:col-span-4">
                  <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                    Budget Summary
                  </p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                    <table className="w-full text-[10px] text-slate-700">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-2 py-2 text-[8.5px] font-black text-slate-500 uppercase w-7 text-center">Ref</th>
                          <th className="px-2 py-2 text-[8.5px] font-black text-slate-500 uppercase text-left tracking-wider">Particulars</th>
                          <th className="px-2 py-2 text-[8.5px] font-black text-slate-500 uppercase text-right tracking-wider">Amount</th>
                          <th className="px-2 py-2 text-[8.5px] font-black text-slate-500 uppercase text-right w-10">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {([
                          ["A",   "Order Value",          BR.orderValue,          "",    "font-bold text-slate-900"],
                          ["A.1", "Less Buyer Sup. Mat.", activeRec.buyerSupMaterialCost,"",""],
                          ["A.2", "Net Order Value",      BR.netOrderValue,       "100", "font-semibold text-slate-800 bg-slate-50/50"],
                          [null,  "Variable Cost",        null,                   "",    "bg-slate-50/30 font-bold text-slate-500"],
                          ["B.1", "Fabric Purchase Cost", BR.fabricCost,          pct(BR.fabricCost,BR.orderValue),""],
                          ["B.2", "Yarn Cost",            BR.yarnCost,            pct(BR.yarnCost,BR.orderValue),""],
                          ["B.3", "Dyed Yarn",            BR.dyedYarnCost,        pct(BR.dyedYarnCost,BR.orderValue),""],
                          ["B.4", "Fabric Conv. Cost",    BR.convCost,            pct(BR.convCost,BR.orderValue),""],
                          ["B.5", "Accessories",          BR.accCost,             pct(BR.accCost,BR.orderValue),""],
                          ["B.6", "Embellishment Cost",   BR.embCost,             pct(BR.embCost,BR.orderValue),""],
                          [null,  "Total Variable Cost",  BR.totalVariable,       pct(BR.totalVariable,BR.orderValue),"font-black bg-rose-50/60 text-rose-800 border-y border-rose-100"],
                          ["C",   "Contribution Margin",  BR.contribution,        pct(BR.contribution,BR.orderValue),"font-black bg-blue-50 text-blue-700 border-y border-blue-100/70"],
                          ["D",   "CM Cost",              BR.cmCost,              pct(BR.cmCost,BR.orderValue),"font-bold text-slate-800"],
                          ["E",   "Operating Profit",     BR.opProfit,            pct(BR.opProfit,BR.orderValue),"font-semibold text-slate-800"],
                          ["F",   "Commission Cost",      BR.commission,          pct(BR.commission,BR.orderValue),""],
                          ["G",   "Special Cost",         BR.specialCost,         pct(BR.specialCost,BR.orderValue),""],
                          ["H",   "Others Cost",          BR.otherCost,           pct(BR.otherCost,BR.orderValue),""],
                          ["I",   "Sample Cost",          BR.sampleCost,          pct(BR.sampleCost,BR.orderValue),""],
                          ["J",   "Total Cost",           BR.totalCost,           pct(BR.totalCost,BR.orderValue),"font-black bg-slate-100 border-y border-slate-200"],
                          ["K",   "Net Profit",           BR.netProfit,           pct(BR.netProfit,BR.orderValue), BR.netProfit>=0?"font-black bg-emerald-50 text-emerald-700 border-y border-emerald-100":"font-black bg-rose-50 text-rose-700 border-y border-rose-100"],
                        ] as const).map(([ref,label,val,pctVal,cls],i)=>(
                          <tr key={i} className={`border-b border-slate-100 last:border-b-0 hover:bg-slate-50/30 transition-colors ${cls as string}`}>
                            <td className="px-2 py-1 text-slate-400 font-bold text-[8.5px] text-center">{ref as string}</td>
                            <td className="px-2 py-1 text-[10px]">{label as string}</td>
                            <td className="px-2 py-1 text-right font-mono font-semibold text-[10px]">{val!==null?`$ ${fmt(val as number)}`:""}</td>
                            <td className="px-2 py-1 text-right font-mono text-[9px] text-slate-450 font-bold">{pctVal as string}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ── B.1 Fabric ── */}
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                  B.1 :: Fabric Consumption & Costing
                </p>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-[10px] text-slate-700 whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {["Style","Fab.Nature","Fabric Info","GSM","Color","Source","Order Qty (Dzn)","Cons/Dzn","Fabric Qty","UOM","Rate","Cost"].map(h=>(
                          <th key={h} className="px-3 py-2.5 text-left font-black text-slate-500 uppercase tracking-wider text-[8.5px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeRec.fabricRows.map(r=>{
                        const fq=r.orderQtyDzn*r.consDzn;
                        const cost=fq*r.rate;
                        return (
                          <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-3 py-2 font-bold text-slate-900 max-w-[140px] truncate">{r.styleRef}</td>
                            <td className="px-3 py-2">{r.fabNature}</td>
                            <td className="px-3 py-2 max-w-[180px] truncate">{r.fabricInfo}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold">{r.gsm}</td>
                            <td className="px-3 py-2">{r.colour}</td>
                            <td className="px-3 py-2">{r.source}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold">{fmt(r.orderQtyDzn)}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold">{r.consDzn.toFixed(2)}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold text-slate-650">{fmt(fq)}</td>
                            <td className="px-3 py-2">{r.uom}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-slate-800">{r.rate>0?`$ ${r.rate.toFixed(2)}`:""}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-indigo-600">{cost>0?`$ ${fmt(cost)}`:""}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-black border-t border-slate-200 text-[10px] text-slate-800">
                        <td colSpan={8} className="px-3 py-2">Total :</td>
                        <td className="px-3 py-2 text-right font-mono">{fmt(activeRec.fabricRows.reduce((s,x)=>s+(x.orderQtyDzn*x.consDzn),0))}</td>
                        <td colSpan={2}/>
                        <td className="px-3 py-2 text-right font-mono text-indigo-600">$ {fmt(BR.fabricCost)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ── B.2 Yarn Cost ── */}
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                  B.2 :: Yarn Cost (Grey Yarn)
                </p>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-[10px] text-slate-700">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {["Composition","Count","Yarn Type","Color","Yarn Qty (Kg)","Rate ($/Kg)","Cost"].map(h=>(
                          <th key={h} className="px-3 py-2.5 text-left font-black text-slate-500 uppercase tracking-wider text-[8.5px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeRec.yarnRows.length===0 ? (
                        <tr key="empty-yarn"><td colSpan={7} className="px-3 py-3 text-center text-slate-450 font-medium bg-slate-50/20">No yarn entries found</td></tr>
                      ) : (
                        activeRec.yarnRows.map(r=>(
                          <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-3 py-2 font-bold text-slate-900">{r.composition}</td>
                            <td className="px-3 py-2 font-mono font-bold text-slate-650">{r.count}</td>
                            <td className="px-3 py-2">{r.yarnType}</td>
                            <td className="px-3 py-2">{r.colour}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold">{fmt(r.yarnQty)}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-slate-800">$ {r.rate.toFixed(2)}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-indigo-600">$ {fmt(r.yarnQty*r.rate)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-black border-t border-slate-200 text-[10px] text-slate-800">
                        <td colSpan={4} className="px-3 py-2">Total :</td>
                        <td className="px-3 py-2 text-right font-mono">{fmt(activeRec.yarnRows.reduce((s,x)=>s+x.yarnQty,0))}</td>
                        <td/>
                        <td className="px-3 py-2 text-right font-mono text-indigo-600">$ {fmt(BR.yarnCost)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ── B.3 Dyed Yarn ── */}
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                  B.3 :: Dyed Yarn
                </p>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-[10px] text-slate-700">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {["Style","Yarn Info","Color","Shade","Quantity","UOM","Rate","Cost"].map(h=>(
                          <th key={h} className="px-3 py-2.5 text-left font-black text-slate-500 uppercase tracking-wider text-[8.5px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeRec.dyedYarnRows.length===0 ? (
                        <tr key="empty-dyedyarn"><td colSpan={8} className="px-3 py-3 text-center text-slate-400 font-medium bg-slate-50/20">No dyed yarn records entered</td></tr>
                      ) : (
                        activeRec.dyedYarnRows.map(r=>(
                          <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-3 py-2 font-bold text-slate-900">{r.style}</td>
                            <td className="px-3 py-2">{r.yarnInfo}</td>
                            <td className="px-3 py-2">{r.colour}</td>
                            <td className="px-3 py-2">{r.shade}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold">{fmt(r.quantity)}</td>
                            <td className="px-3 py-2">{r.uom}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-slate-800">$ {r.rate.toFixed(2)}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-indigo-600">$ {fmt(r.quantity*r.rate)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-black border-t border-slate-200 text-[10px] text-slate-800">
                        <td colSpan={7} className="px-3 py-2">Total :</td>
                        <td className="px-3 py-2 text-right font-mono text-indigo-600">$ {fmt(BR.dyedYarnCost)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ── B.4 Fabric Conversion (grouped by Knitting/Dyeing) ── */}
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                  B.4 :: Fabric Conversion Cost
                </p>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-[10px] text-slate-700 whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {["Style Info","Fab.Nature","Fabric Info","GSM","Col.Type","Color","Shade","Pr.Name","Pr.Qty (Kg)","UOM","Rate ($/Kg)","Cost"].map(h=>(
                          <th key={h} className="px-3 py-2.5 text-left font-black text-slate-500 uppercase tracking-wider text-[8.5px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(["Knitting","Dyeing"] as const)
                        .filter(pt => activeRec.conversionRows.some(r => r.processType === pt))
                        .map(pt=>{
                        const rows=activeRec.conversionRows.filter(r=>r.processType===pt);
                        const subtotal=rows.reduce((s,r)=>s+(r.prQty*r.rate),0);
                        const totalQty=rows.reduce((s,r)=>s+r.prQty,0);
                        return (
                          <React.Fragment key={pt}>
                            <tr className="bg-indigo-50/50 border-y border-indigo-100">
                              <td colSpan={12} className="px-3 py-1.5 text-[9px] font-black text-indigo-700 uppercase tracking-widest">{pt} Processing</td>
                            </tr>
                            {rows.map(r=>(
                              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
                                <td className="px-3 py-2 font-bold text-slate-900 max-w-[130px] truncate">{r.styleRef}</td>
                                <td className="px-3 py-2">{r.fabNature}</td>
                                <td className="px-3 py-2 max-w-[160px] truncate">{r.fabricInfo}</td>
                                <td className="px-3 py-2 text-right font-mono font-semibold">{r.gsm}</td>
                                <td className="px-3 py-2">{r.colType}</td>
                                <td className="px-3 py-2">{r.colour}</td>
                                <td className="px-3 py-2">{r.shade}</td>
                                <td className="px-3 py-2 font-bold text-indigo-650">{pt}</td>
                                <td className="px-3 py-2 text-right font-mono font-semibold">{fmt(r.prQty)}</td>
                                <td className="px-3 py-2">{r.uom}</td>
                                <td className="px-3 py-2 text-right font-mono font-bold text-slate-800">$ {r.rate.toFixed(2)}</td>
                                <td className="px-3 py-2 text-right font-mono font-bold text-indigo-600">$ {fmt(r.prQty*r.rate)}</td>
                              </tr>
                            ))}
                            <tr className="bg-slate-50 font-black border-b border-slate-200 text-[10px] text-slate-800">
                              <td colSpan={8} className="px-3 py-2">Total {pt} Cost</td>
                              <td className="px-3 py-2 text-right font-mono">{fmt(totalQty)}</td>
                              <td colSpan={2}/>
                              <td className="px-3 py-2 text-right font-mono text-indigo-600">$ {fmt(subtotal)}</td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── B.5 Accessories ── */}
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                  B.5 :: Accessories Details
                </p>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-[10px] text-slate-700 whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {["Item Name","Gmt Item","Sensitivity Type","Order Qty (Dzn)","Cons/Dzn","Prs.Loss %","Quantity","UOM","Rate","Cost"].map(h=>(
                          <th key={h} className="px-3 py-2.5 text-left font-black text-slate-500 uppercase tracking-wider text-[8.5px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeRec.accessoryRows.map(r=>{
                        const qty=r.orderQtyDzn*r.consDzn*(1+r.processLossPct/100);
                        const cost=qty*r.rate;
                        return (
                          <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-3 py-2 font-bold text-slate-900">{r.itemName}</td>
                            <td className="px-3 py-2">{r.gmtItem}</td>
                            <td className="px-3 py-2 text-slate-500">{r.sensitivityType || "No Sensitivity"}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold">{fmt(r.orderQtyDzn)}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold">{r.consDzn.toFixed(2)}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold">{r.processLossPct.toFixed(2)}%</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold text-slate-650">{fmt(qty)}</td>
                            <td className="px-3 py-2">{r.uom}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-slate-800">$ {r.rate.toFixed(4)}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-indigo-600">$ {fmt(cost)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-black border-t border-slate-200 text-[10px] text-slate-800">
                        <td colSpan={9} className="px-3 py-2">Total :</td>
                        <td className="px-3 py-2 text-right font-mono text-indigo-600">$ {fmt(BR.accCost)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ── B.6 Embellishment ── */}
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                  B.6 :: Embellishment Cost
                </p>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-[10px] text-slate-700">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {["Style","Gmt Item","Embellishment Name","Emb.Description","Quantity (Dzn)","Rate per Dzn","Cost"].map(h=>(
                          <th key={h} className="px-3 py-2.5 text-left font-black text-slate-500 uppercase tracking-wider text-[8.5px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeRec.embellishmentRows.length===0 ? (
                        <tr key="empty-emb"><td colSpan={7} className="px-3 py-3 text-center text-slate-400 font-medium bg-slate-50/20">No embroidery or printing embellishment costs</td></tr>
                      ) : (
                        activeRec.embellishmentRows.map(r=>(
                          <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-3 py-2 font-bold text-slate-900">{r.style}</td>
                            <td className="px-3 py-2">{r.gmtItem}</td>
                            <td className="px-3 py-2">{r.embName}</td>
                            <td className="px-3 py-2">{r.embDesc}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold">{fmt(r.qtyDzn)}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-slate-800">$ {r.ratePerDzn.toFixed(2)}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-indigo-600">$ {fmt(r.qtyDzn*r.ratePerDzn)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-black border-t border-slate-200 text-[10px] text-slate-800">
                        <td colSpan={6} className="px-3 py-2">Total :</td>
                        <td className="px-3 py-2 text-right font-mono text-indigo-600">$ {fmt(BR.embCost)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ── D CM Cost ── */}
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                  D :: CM Cost
                </p>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-[10px] text-slate-700">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {["Style","GMT Item","GMT/Dzn","CPM ($)","SMV","Efficiency %","CM / Pcs","CM / Dzn","CM Cost"].map(h=>(
                          <th key={h} className="px-3 py-2.5 text-left font-black text-slate-500 uppercase tracking-wider text-[8.5px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeRec.cmCostRows.map(r=>{
                        const cmPcs=r.efficiencyPct>0?(r.cpm*r.smv)/r.efficiencyPct*100:0;
                        const cmDzn=cmPcs*12;
                        const cmCost=cmDzn*r.gmtDzn;
                        return (
                          <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-3 py-2 font-bold text-slate-900">{r.style}</td>
                            <td className="px-3 py-2">{r.gmtItem}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold">{fmt(r.gmtDzn)}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold">{r.cpm.toFixed(4)}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold">{r.smv.toFixed(2)}</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold text-slate-500">{r.efficiencyPct.toFixed(2)}%</td>
                            <td className="px-3 py-2 text-right font-mono font-semibold text-slate-800">$ {cmPcs.toFixed(4)}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-indigo-600">$ {cmDzn.toFixed(4)}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">$ {fmt(cmCost)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-black border-t border-slate-200 text-[10px] text-slate-800">
                        <td colSpan={8} className="px-3 py-2">Total :</td>
                        <td className="px-3 py-2 text-right font-mono text-indigo-600">$ {fmt(BR.cmCost)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ── F Commission ── */}
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                  F :: Commission Cost
                </p>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-[10px] text-slate-700">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {["Style","Color","Commission (%)","Commission Value"].map(h=>(
                          <th key={h} className="px-3 py-2.5 text-left font-black text-slate-500 uppercase tracking-wider text-[8.5px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeRec.commissionRows.map(r=>(
                        <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-3 py-2 font-bold text-slate-900">{r.style}</td>
                          <td className="px-3 py-2">{r.colour}</td>
                          <td className="px-3 py-2 text-right font-mono font-semibold">{r.commissionPct.toFixed(4)}%</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-indigo-600">$ {fmt(BR.netOrderValue*r.commissionPct/100)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-black border-t border-slate-200 text-[10px] text-slate-800">
                        <td colSpan={3} className="px-3 py-2">Total :</td>
                        <td className="px-3 py-2 text-right font-mono text-indigo-600">$ {fmt(BR.commission)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ── G Special + H Others + I Sample side-by-side ── */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                {/* G Special */}
                <div className="col-span-12 md:col-span-4 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                      G :: Special Cost
                    </p>
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                      <table className="w-full text-[10px] text-slate-700">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            {["Style","Color","Cost Head","Qty (Dzn)","Rate/Dzn","Cost"].map(h=>(
                              <th key={h} className="px-2 py-2 text-left font-black text-slate-500 uppercase tracking-wider text-[8px]">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeRec.specialCostRows.map(r=>(
                            <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                              <td className="px-2 py-1.5 font-bold text-slate-900 max-w-[80px] truncate">{r.styleRef}</td>
                              <td className="px-2 py-1.5 text-slate-650">{r.colour}</td>
                              <td className="px-2 py-1.5 text-slate-600">{r.costHead}</td>
                              <td className="px-2 py-1.5 text-right font-mono">{fmt(r.orderQtyDzn)}</td>
                              <td className="px-2 py-1.5 text-right font-mono font-semibold text-slate-800">$ {r.ratePerDzn.toFixed(2)}</td>
                              <td className="px-2 py-1.5 text-right font-mono font-bold text-indigo-600">$ {fmt(r.orderQtyDzn*r.ratePerDzn)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-50 font-black border-t border-slate-200 text-[10px] text-slate-800">
                            <td colSpan={5} className="px-2 py-1.5">Total :</td>
                            <td className="px-2 py-1.5 text-right font-mono text-indigo-600">$ {fmt(BR.specialCost)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* H Others */}
                <div className="col-span-12 md:col-span-4 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                      H :: Others Cost
                    </p>
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                      <table className="w-full text-[10px] text-slate-700">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            {["Particulars","Percentage (%)","Cost"].map(h=>(
                              <th key={h} className="px-2 py-2 text-left font-black text-slate-500 uppercase tracking-wider text-[8px]">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeRec.otherCostRows.map(r=>(
                            <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                              <td className="px-2 py-1.5 font-bold text-slate-900">{r.particulars}</td>
                              <td className="px-2 py-1.5 text-right font-mono font-semibold">{r.percentage.toFixed(2)}%</td>
                              <td className="px-2 py-1.5 text-right font-mono font-bold text-indigo-600">$ {fmt(BR.netOrderValue*r.percentage/100)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-50 font-black border-t border-slate-200 text-[10px] text-slate-800">
                            <td colSpan={2} className="px-2 py-1.5">Total :</td>
                            <td className="px-2 py-1.5 text-right font-mono text-indigo-600">$ {fmt(BR.otherCost)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* I Sample Cost */}
                <div className="col-span-12 md:col-span-4 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                      I :: Sample Cost
                    </p>
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                      <table className="w-full text-[10px] text-slate-700">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            {["Sample Fabric Qty (Kg)","Sample Fabric Rate","Cost"].map(h=>(
                              <th key={h} className="px-3 py-2 text-left font-black text-slate-500 uppercase tracking-wider text-[8px]">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-3 py-3 font-mono font-semibold text-slate-700">{activeRec.sampleFabricQty}</td>
                            <td className="px-3 py-3 font-mono font-bold text-slate-850">$ {activeRec.sampleFabricRate.toFixed(2)}</td>
                            <td className="px-3 py-3 font-mono font-bold text-indigo-600">$ {fmt(activeRec.sampleFabricQty*activeRec.sampleFabricRate)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Approval Signatures (Premium layout) ── */}
              <div className="pt-12 grid grid-cols-2 md:grid-cols-5 gap-6 text-[10px] text-center border-t border-slate-200">
                {[
                  { role:"Prepared By",                status:"",        name:activeRec.merchandiser, title:"Merchandiser", date:activeRec.preCostDate },
                  { role:"Checked By :: Approved",      status:"Approved",name:"Monoranjan Kha",       title:"Manager",      date:"02/08/2026 11:52:45" },
                  { role:"Verified By :: Approved",     status:"Approved",name:"Md. Sadekur Rahman",   title:"DGM",          date:"02/08/2026 11:54:03" },
                  { role:"Verified By Sr. GM :: Pending",status:"Pending",name:"Md. Jamshed Alam",    title:"GM Operation", date:"—" },
                  { role:"Approved By CEO :: Pending",  status:"Pending", name:"Muhammad Azeem",       title:"CEO",          date:"—" },
                ].map(({role,status,name,title,date})=>(
                  <div key={role} className="border-t border-slate-300 pt-3 space-y-1">
                    <p className={`font-black text-[9px] uppercase tracking-wider ${status==="Approved"?"text-emerald-700":status==="Pending"?"text-amber-600":"text-slate-500"}`}>{role}</p>
                    <p className="font-black text-slate-800 text-[11px]">{name}</p>
                    <p className="text-slate-500 font-semibold">{title}</p>
                    {date&&<p className="text-[9px] text-slate-400 font-mono">{date}</p>}
                    {status&&<div className="mt-1"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-black border ${status==="Approved"?"bg-emerald-50 text-emerald-700 border-emerald-100":"bg-amber-50 text-amber-700 border-amber-100"}`}>{status==="Approved"?<CheckCircle className="size-2.5"/>:<Clock className="size-2.5"/>}{status}</span></div>}
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}
