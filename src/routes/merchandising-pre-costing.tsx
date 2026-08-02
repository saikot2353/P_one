import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useMemo } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Plus, Search, Pencil, FileText, ArrowLeft, Save, Printer,
  Eye, X, ChevronDown, ChevronUp, CheckCircle, Clock,
  AlertCircle, Download, FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-pre-costing")({
  head: () => ({ meta: [{ title: "Pre-Costing — Pakiza Knit Composite" }] }),
  component: PreCostingPage,
});

// ── Types ───────────────────────────────────────────────────────
interface StyleFOBRow {
  id: number; styleNo: string; colour: string; itemName: string;
  orderQty: number; unitPrice: number; deliveryDate: string;
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
  id: string; preCostNo: string; queryNo: string; queryType: string;
  styleName: string; deliveryDate: string; buyerName: string;
  orderNo: string; country: string; buyerHouse: string; brand: string;
  preCostDate: string; orderQtyPcs: number; unitPrice: number;
  planCutQty: number; setRatio: number; cmPct: number;
  qualityLevel: string; inspectionType: string; season: string; merchandiser: string;
  exchangeRate: number; shippingMode: string; payTerm: string; tenor: string;
  specialInstructions: string; penaltyClause: string;
  // Key Info
  epm: number; cpm: number; noOfColors: number; extraCuttingPct: number;
  fabricProcessLossPct: number;
  // Key Info by GMT item
  gmtItems: { id: number; name: string; smv: number; mcPerLine: number; efficiencyPct: number; }[];
  // Process Loss
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
  sampleFabricQty: number; sampleFabricRate: number;
  sampleQty: number; sampleRate: number;
  styleImage: string;
  status: "Saved" | "Pending" | "Approved";
}

// ── Sample Data ─────────────────────────────────────────────────
const SAMPLE: PreCostRecord[] = [{
  id: "PC-001", preCostNo: "26918", queryNo: "26918/0", queryType: "Regular",
  styleName: "SS27PB093-SL", deliveryDate: "2026-09-26",
  buyerName: "PEPCO", orderNo: "ORD01833307/08/09/10/11/12_01", country: "Poland",
  buyerHouse: "PGS", brand: "", preCostDate: "2026-08-02",
  orderQtyPcs: 39024, unitPrice: 3.15,
  planCutQty: 39414, setRatio: 1.00, cmPct: 23.81,
  qualityLevel: "", inspectionType: "", season: "SS27", merchandiser: "Md. Al Amin",
  exchangeRate: 120, shippingMode: "Sea", payTerm: "At Sight", tenor: "",
  specialInstructions: "", penaltyClause: "",
  epm: -0.01, cpm: 0.07, noOfColors: 1, extraCuttingPct: 1.00,
  fabricProcessLossPct: 9.85,
  gmtItems: [{ id:1, name:"Sweat Shirt", smv:4.62, mcPerLine:0, efficiencyPct:40 }],
  cuttingPct: 0, printPct: 0, embroideryPct: 0, sewingPct: 0, washDyePct: 0, finishingPct: 0, extraPct: 0,
  styleFOBRows: [
    { id:1, styleNo:"SS27PB093-SL", colour:"Verdant Green", itemName:"Sweat Shirt", orderQty:39024, unitPrice:3.15, deliveryDate:"2026-09-26" },
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
    epm:0, cpm:0.065, noOfColors:1, extraCuttingPct:1, fabricProcessLossPct:0,
    gmtItems:[{id:nid(),name:"",smv:0,mcPerLine:0,efficiencyPct:65}],
    cuttingPct:0, printPct:0, embroideryPct:0, sewingPct:0, washDyePct:0, finishingPct:0, extraPct:0,
    styleFOBRows:[{id:nid(),styleNo:"",colour:"",itemName:"",orderQty:0,unitPrice:0,deliveryDate:""}],
    buyerSupMaterialCost:0,
    fabricRows:[{id:nid(),styleRef:"",fabNature:"Knit",fabricInfo:"",gsm:160,colour:"",source:"Finish Purchase",orderQtyDzn:0,consDzn:0,uom:"Kg",rate:0}],
    yarnRows:[{id:nid(),composition:"",count:"",yarnType:"",colour:"Average",yarnQty:0,rate:0}],
    dyedYarnRows:[],
    conversionRows:[],
    accessoryRows:[{id:nid(),itemName:"",gmtItem:"",sensitivityType:"No Sensitivity",orderQtyDzn:0,consDzn:0,processLossPct:2,uom:"Dzn",rate:0}],
    embellishmentRows:[],
    cmCostRows:[{id:nid(),style:"",gmtItem:"",gmtDzn:0,cpm:0.065,smv:0,efficiencyPct:65}],
    commissionRows:[{id:nid(),style:"",colour:"",commissionPct:0}],
    specialCostRows:[{id:nid(),styleRef:"",colour:"",costHead:"Test Cost",orderQtyDzn:0,ratePerDzn:0.01}],
    otherCostRows:[
      {id:nid(),particulars:"Commercial Cost (%)",percentage:4.5},
      {id:nid(),particulars:"Finance Cost (%)",percentage:0},
      {id:nid(),particulars:"Buying Commission (%)",percentage:0},
    ],
    sampleFabricQty:0, sampleFabricRate:0, sampleQty:0, sampleRate:0,
    styleImage:"", status:"Saved",
  });

  const [form, setForm] = useState<PreCostRecord>(mkBlank());
  const sf = (p: Partial<PreCostRecord>) => setForm(prev=>({...prev,...p}));
  const B  = useMemo(()=>calcBudget(form),[form]);
  const BR = activeRec ? calcBudget(activeRec) : null;

  const filtered = records.filter(r=>{
    const s=search.toLowerCase();
    return (r.preCostNo.includes(s)||r.buyerName.toLowerCase().includes(s)||r.queryNo.includes(s))
      &&(filterStatus==="ALL"||r.status===filterStatus)
      &&(!filterBuyer||r.buyerName.toLowerCase().includes(filterBuyer.toLowerCase()));
  });

  const handleSave = () => {
    if(!form.styleName.trim()){ toast.error("Style Name is required."); return; }
    if(form.id){
      setRecords(prev=>prev.map(r=>r.id===form.id?{...form}:r));
      toast.success("Pre-Costing updated!");
    }else{
      const no=`PC-${String(records.length+26859).padStart(5,"0")}`;
      setRecords(prev=>[{...form,id:`PC-${Date.now()}`,preCostNo:no,queryNo:`${no}/0`},...prev]);
      toast.success(`Pre-Cost ${no} saved!`);
    }
    setView("list");
  };

  const openEdit   = (r: PreCostRecord) => { setForm({...r}); setView("form"); };
  const openDetail = (r: PreCostRecord) => { setActiveRec(r); setView("detail"); };

  // ── Input atoms ───────────────────────────────────────────────
  const TI = ({val,onChange,ph="",cls=""}:{val:string;onChange:(v:string)=>void;ph?:string;cls?:string}) => (
    <input type="text" value={val} onChange={e=>onChange(e.target.value)} placeholder={ph}
      className={`w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300/50 focus:border-indigo-400 bg-white placeholder-slate-350 transition-all ${cls}`}/>
  );
  const NI = ({val,onChange,cls=""}:{val:number;onChange:(v:number)=>void;cls?:string}) => (
    <input type="number" step="any" value={val||""} onChange={e=>onChange(Number(e.target.value))}
      className={`w-full text-right font-mono text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300/50 focus:border-indigo-400 bg-white transition-all ${cls}`}/>
  );
  const DI = ({val,onChange}:{val:string;onChange:(v:string)=>void}) => (
    <input type="date" value={val} onChange={e=>onChange(e.target.value)}
      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300/50 focus:border-indigo-400 bg-white transition-all"/>
  );
  const Label = ({children}:{children:React.ReactNode}) => (
    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-tight mb-1">{children}</label>
  );
  const Lbl = ({children}:{children:React.ReactNode}) => (
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{children}</p>
  );
  const SH = ({id,title,badge,children}:{id:string;title:string;badge?:string;children:React.ReactNode}) => {
    const open=!collapsed[id];
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <button onClick={()=>tog(id)} className="flex items-center gap-2.5 px-4 py-3 w-full text-left hover:bg-slate-50 transition border-b border-slate-100 cursor-pointer">
          <span className="w-1 h-4 rounded-full bg-indigo-500 shrink-0"/>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex-1">{title}</span>
          {badge&&<span className="text-[10px] font-mono font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">{badge}</span>}
          {open?<ChevronUp className="size-3.5 text-slate-400 shrink-0"/>:<ChevronDown className="size-3.5 text-slate-400 shrink-0"/>}
        </button>
        {open&&<div className="p-4">{children}</div>}
      </div>
    );
  };

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
                <button className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer transition"><Printer className="size-3.5"/> Print</button>
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
                        <td className="px-4 py-3 text-slate-600">{r.queryType}</td>
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
            <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-5 sticky top-0 z-30 shadow-xs">
              <div className="flex items-center gap-3">
                <button onClick={()=>setView("list")} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer transition"><ArrowLeft size={16}/></button>
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Prepare Pre-Costing</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 transition shadow-sm">
                  <Save className="size-3.5"/> Save Pre-Cost
                </button>
              </div>
            </div>
            <div className="p-4 md:p-5 max-w-7xl mx-auto space-y-4">
              <SH id="basic" title="Order Basic Information">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <div><Label>Pre-Cost No</Label><div className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1.5">{form.preCostNo||"(Auto)"}</div></div>
                  <div><Label>Query Type</Label><select value={form.queryType} onChange={e=>sf({queryType:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer"><option>Regular</option><option>Sample</option></select></div>
                  <div><Label>Style Name *</Label><TI val={form.styleName} onChange={v=>sf({styleName:v})} ph="e.g. SS27PB093-SL"/></div>
                  <div><Label>Delivery Date *</Label><DI val={form.deliveryDate} onChange={v=>sf({deliveryDate:v})}/></div>
                  <div><Label>Pre-Cost Date</Label><DI val={form.preCostDate} onChange={v=>sf({preCostDate:v})}/></div>
                  <div><Label>Buyer Name *</Label><TI val={form.buyerName} onChange={v=>sf({buyerName:v})} ph="e.g. PEPCO"/></div>
                  <div><Label>Order No / Job No</Label><TI val={form.orderNo} onChange={v=>sf({orderNo:v})}/></div>
                  <div><Label>Country</Label><TI val={form.country} onChange={v=>sf({country:v})}/></div>
                  <div><Label>Buyer House</Label><TI val={form.buyerHouse} onChange={v=>sf({buyerHouse:v})}/></div>
                  <div><Label>Brand</Label><TI val={form.brand} onChange={v=>sf({brand:v})}/></div>
                  <div><Label>Order Qty (Pcs)</Label><NI val={form.orderQtyPcs} onChange={v=>sf({orderQtyPcs:v})}/></div>
                  <div><Label>Unit Price ($)</Label><NI val={form.unitPrice} onChange={v=>sf({unitPrice:v})}/></div>
                  <div><Label>Total Value [Auto]</Label><div className="text-right font-mono font-black text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-2.5 py-1.5">$ {fmt(form.orderQtyPcs*form.unitPrice)}</div></div>
                  <div><Label>Plan Cut Qty</Label><NI val={form.planCutQty} onChange={v=>sf({planCutQty:v})}/></div>
                  <div><Label>Set Ratio</Label><NI val={form.setRatio} onChange={v=>sf({setRatio:v})}/></div>
                  <div><Label>CM %</Label><NI val={form.cmPct} onChange={v=>sf({cmPct:v})}/></div>
                  <div><Label>Season</Label><TI val={form.season} onChange={v=>sf({season:v})} ph="e.g. SS27"/></div>
                  <div><Label>Merchandiser</Label><TI val={form.merchandiser} onChange={v=>sf({merchandiser:v})}/></div>
                  <div><Label>No of Colors</Label><NI val={form.noOfColors} onChange={v=>sf({noOfColors:v})}/></div>
                  <div><Label>Extra Cutting %</Label><NI val={form.extraCuttingPct} onChange={v=>sf({extraCuttingPct:v})}/></div>
                  <div><Label>Fabric Process Loss %</Label><NI val={form.fabricProcessLossPct} onChange={v=>sf({fabricProcessLossPct:v})}/></div>
                  <div><Label>Exchange Rate</Label><NI val={form.exchangeRate} onChange={v=>sf({exchangeRate:v})}/></div>
                  <div><Label>Shipping Mode</Label><select value={form.shippingMode} onChange={e=>sf({shippingMode:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer"><option>Sea</option><option>Air</option></select></div>
                  <div><Label>Pay Term</Label><select value={form.payTerm} onChange={e=>sf({payTerm:e.target.value})} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer"><option>At Sight</option><option>90 Days</option><option>60 Days</option></select></div>
                  <div className="col-span-2"><Label>Special Instructions</Label><TI val={form.specialInstructions} onChange={v=>sf({specialInstructions:v})}/></div>
                  <div className="col-span-2"><Label>Penalty Clauses</Label><TI val={form.penaltyClause} onChange={v=>sf({penaltyClause:v})}/></div>
                </div>
              </SH>

              <SH id="fob" title="Style and FOB Details">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-slate-50 border-b border-slate-200">{["Style No","Color","Item Name","Order Qty","Unit Price ($)","Total Price ($)","Delivery Date",""].map(h=><th key={h} className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase text-left">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {form.styleFOBRows.map(r=>(
                        <tr key={r.id} className="group hover:bg-slate-50">
                          <td className="px-2 py-1.5"><TI val={r.styleNo} onChange={v=>sf({styleFOBRows:form.styleFOBRows.map(x=>x.id===r.id?{...x,styleNo:v}:x)})}/></td>
                          <td className="px-2 py-1.5"><TI val={r.colour} onChange={v=>sf({styleFOBRows:form.styleFOBRows.map(x=>x.id===r.id?{...x,colour:v}:x)})}/></td>
                          <td className="px-2 py-1.5"><TI val={r.itemName} onChange={v=>sf({styleFOBRows:form.styleFOBRows.map(x=>x.id===r.id?{...x,itemName:v}:x)})}/></td>
                          <td className="px-2 py-1.5 w-24"><NI val={r.orderQty} onChange={v=>sf({styleFOBRows:form.styleFOBRows.map(x=>x.id===r.id?{...x,orderQty:v}:x)})}/></td>
                          <td className="px-2 py-1.5 w-24"><NI val={r.unitPrice} onChange={v=>sf({styleFOBRows:form.styleFOBRows.map(x=>x.id===r.id?{...x,unitPrice:v}:x)})}/></td>
                          <td className="px-2 py-1.5 text-right font-mono font-black text-slate-800">{fmt(r.orderQty*r.unitPrice)}</td>
                          <td className="px-2 py-1.5 w-36"><DI val={r.deliveryDate} onChange={v=>sf({styleFOBRows:form.styleFOBRows.map(x=>x.id===r.id?{...x,deliveryDate:v}:x)})}/></td>
                          <td className="px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>sf({styleFOBRows:form.styleFOBRows.filter(x=>x.id!==r.id)})} className="p-1 rounded hover:bg-rose-50 hover:text-rose-500 text-slate-300 cursor-pointer transition"><X className="size-3.5"/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={()=>sf({styleFOBRows:[...form.styleFOBRows,{id:nid(),styleNo:"",colour:"",itemName:"",orderQty:0,unitPrice:0,deliveryDate:""}]})} className="mt-3 flex items-center gap-1.5 w-full text-xs font-bold text-indigo-600 border border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-lg px-3 py-1.5 transition cursor-pointer"><Plus className="size-3.5"/> Add Style Row</button>
              </SH>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-indigo-600">
                  <span className="text-[11px] font-black uppercase tracking-wider text-white">Live Budget Summary</span>
                  <span className="ml-auto text-[10px] text-indigo-200 font-semibold">Auto-calculated</span>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[["Order Value",B.orderValue,"slate"],["Total Variable",B.totalVariable,"rose"],["Contribution",B.contribution,"indigo"],["CM Cost",B.cmCost,"amber"],["Net Profit",B.netProfit,B.netProfit>=0?"teal":"rose"]].map(([l,v,c])=>{
                    const colors:Record<string,string>={slate:"bg-slate-50 text-slate-700 border-slate-200",rose:"bg-rose-50 text-rose-700 border-rose-200",indigo:"bg-indigo-50 text-indigo-700 border-indigo-200",amber:"bg-amber-50 text-amber-700 border-amber-200",teal:"bg-teal-50 text-teal-700 border-teal-200"};
                    return <div key={l as string} className={`rounded-xl border p-3 ${colors[c as string]}`}><p className="text-[9px] font-black uppercase tracking-wide opacity-70">{l as string}</p><p className="text-lg font-black font-mono mt-0.5">$ {fmt(v as number)}</p></div>;
                  })}
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
                          {activeRec.gmtItems.map(g => (
                            <React.Fragment key={g.id}>
                              <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">SMV</td><td className="px-3 py-1.5 text-slate-600 font-semibold">{g.name}</td><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{g.smv.toFixed(2)}</td></tr>
                              <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Efficiency %</td><td className="px-3 py-1.5 text-slate-600 font-semibold">{g.name}</td><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{g.efficiencyPct.toFixed(2)}%</td></tr>
                            </React.Fragment>
                          ))}
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">No of Color</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{activeRec.noOfColors}</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Avg Wgt Per Color</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{fmt(activeRec.fabricRows.reduce((s,x)=>s+(x.orderQtyDzn*x.consDzn),0)/Math.max(activeRec.noOfColors,1))} Kg</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Extra Cutting %</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{activeRec.extraCuttingPct.toFixed(2)}%</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Extra Cut Qty (Pcs)</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{Math.round(activeRec.orderQtyPcs*activeRec.extraCuttingPct/100).toLocaleString()}</td></tr>
                          <tr className="hover:bg-slate-50/50"><td className="px-3 py-1.5 text-slate-500 font-bold">Fabric Process Loss %</td><td/><td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{activeRec.fabricProcessLossPct.toFixed(2)}%</td></tr>
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
                              <td className="px-2 py-1.5 text-slate-600">{r.colour}</td>
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
                            <td className="px-3 py-3 font-mono font-bold text-slate-800">$ {activeRec.sampleFabricRate.toFixed(2)}</td>
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
