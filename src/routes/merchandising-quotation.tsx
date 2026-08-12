import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Search, Plus, Pencil, FileText, ArrowLeft, Save, Printer,
  Upload, Image as ImageIcon, X, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp, Info,
} from "lucide-react";
import { toast } from "sonner";
import defaultDressSketch from "../components/0330c3d6-5cae-49e0-b777-d34891afcc09.jpg";

export const Route = createFileRoute("/merchandising-quotation")({
  head: () => ({ meta: [{ title: "Buyer Costing — Pakiza Knit" }] }),
  component: MerchandisingQuotationPage,
});

type Status = "Draft" | "Sent to Buyer" | "Buyer Approved" | "Converted to PO" | "Rejected";
interface FabricRow   { id: number; name: string; usedIn: string; cons: number; unit: string; rate: number; }
interface CostRow     { id: number; name: string; unit: string; rate: number; }
interface YarnRow     { id: number; yarnType: string; rate: number; pct: number; }
interface KnittingRow { id: number; name: string; rate: number; }
interface DyeingRow   { id: number; name: string; rate: number; }

interface Q {
  id: string; costingNo: string; date: string;
  buyerName: string; department: string; season: string;
  styleName: string; styleDescription: string; shipmentDate: string;
  sizeRange: string; fabrication1: string; fabrication2: string;
  actualFabricConsCad: number; consWithCuttingWastagePct: number;
  color1: string; garmentQuantity: number; buyerTargetFob: number;
  status: Status; image: string;
  fabricRows: FabricRow[];
  accessoryRows: CostRow[];
  embRows: CostRow[];
  washRows: CostRow[];
  otherCostRows: CostRow[];
  yarnRows: YarnRow[];
  knittingRows: KnittingRow[];
  dyeingRows: DyeingRow[];
  fabricProcessLossPct: number;
  aopCostRate: number; aopProcessLossPct: number;
  productivityPerDay: number; machinesRequired: number;
  cmPerDozen: number; gmtWastagePct: number;
  bankDeferredPct: number; commercialCostPct: number; profitPct: number;
}

const DEF_FABRIC: FabricRow[]   = [
  { id:1, name:"MAIN FABRIC",      usedIn:"Body", cons:1.890, unit:"KG", rate:0 },
  { id:2, name:"SECONDARY FABRIC", usedIn:"",     cons:0,     unit:"KG", rate:0 },
  { id:3, name:"RIB FABRIC",       usedIn:"",     cons:0,     unit:"KG", rate:0 },
];
const DEF_ACC: CostRow[] = [
  { id:1, name:"Basic Accessories",       unit:"Dzn", rate:1.80 },
  { id:2, name:"Elastic",                 unit:"Dzn", rate:0 },
  { id:3, name:"Eyelet",                  unit:"Dzn", rate:0 },
  { id:4, name:"Sewing Thread",           unit:"Dzn", rate:0.12 },
  { id:5, name:"Hanger Bag",              unit:"Dzn", rate:0 },
  { id:6, name:"Main Label / Size Label", unit:"Dzn", rate:0.15 },
  { id:7, name:"Hang Tag / Price Tag",    unit:"Dzn", rate:0.20 },
  { id:8, name:"Poly Bag",               unit:"Dzn", rate:0.10 },
  { id:9, name:"Master Carton",          unit:"Dzn", rate:0.30 },
];
const DEF_EMB: CostRow[] = [
  { id:1, name:"Print (HD)", unit:"Dzn", rate:3.00 },
  { id:2, name:"Embroidery", unit:"Dzn", rate:0 },
  { id:3, name:"Sequins",    unit:"Dzn", rate:0 },
  { id:4, name:"Applique",   unit:"Dzn", rate:0 },
];
const DEF_WASH: CostRow[] = [
  { id:1, name:"Pigment Dye",  unit:"Dzn", rate:0 },
  { id:2, name:"Garment Wash", unit:"Dzn", rate:0 },
];
const DEF_OTHER: CostRow[] = [
  { id:1, name:"Lab Test",          unit:"Dzn", rate:0.10 },
  { id:2, name:"Inspection Charge", unit:"Dzn", rate:0.05 },
  { id:3, name:"Commission",        unit:"Dzn", rate:0.12 },
];
const DEF_YARN: YarnRow[]     = [{ id:1, yarnType:"26s Cotton", rate:2.900, pct:100 }];
const DEF_KNIT: KnittingRow[] = [{ id:1, name:"Lycra Single Jersey", rate:0.200 }];
const DEF_DYE: DyeingRow[]    = [
  { id:1, name:"Anti-Gulor Dyeing", rate:0.800 },
  { id:2, name:"YARN DYED: RG",     rate:0 },
  { id:3, name:"HEAT SET",          rate:0 },
  { id:4, name:"BRUSHING",          rate:0 },
  { id:5, name:"RAISING",           rate:0 },
];

const SAMPLE: Q[] = [{
  id:"QT-001", costingNo:"PKCL-Costing-36/0", date:"2026-08-02",
  buyerName:"PEPCO", department:"OLDER GIRLS", season:"AW26",
  styleName:"AW26OG512-2", styleDescription:"T-shirt with print",
  shipmentDate:"2026-10-15", sizeRange:"XS-XXL",
  fabrication1:"100% Cotton SJ-160 GSM", fabrication2:"",
  actualFabricConsCad:1.890, consWithCuttingWastagePct:3.00,
  color1:"White", garmentQuantity:50000, buyerTargetFob:2.00,
  status:"Buyer Approved", image:defaultDressSketch,
  fabricRows:DEF_FABRIC.map(r=>({...r})), accessoryRows:DEF_ACC.map(r=>({...r})),
  embRows:DEF_EMB.map(r=>({...r})), washRows:DEF_WASH.map(r=>({...r})),
  otherCostRows:DEF_OTHER.map(r=>({...r})),
  yarnRows:DEF_YARN.map(r=>({...r})), knittingRows:DEF_KNIT.map(r=>({...r})),
  dyeingRows:DEF_DYE.map(r=>({...r})),
  fabricProcessLossPct:12.00, aopCostRate:0, aopProcessLossPct:0,
  productivityPerDay:1200, machinesRequired:5,
  cmPerDozen:3.00, gmtWastagePct:0,
  bankDeferredPct:2.40, commercialCostPct:2.00, profitPct:10.0,
}];

function calc(f: Q) {
  const cww  = f.actualFabricConsCad * (1 + f.consWithCuttingWastagePct / 100);
  const yarn = f.yarnRows.reduce((s,y) => s + y.rate*(y.pct/100), 0);
  const knit = f.knittingRows.reduce((s,r) => s + r.rate, 0);
  const dye  = f.dyeingRows.reduce((s,r) => s + r.rate, 0);
  const sub  = yarn + knit + dye;
  const loss = sub * (f.fabricProcessLossPct / 100);
  const fkgBase = sub + loss;
  const aopLoss = f.aopCostRate * (f.aopProcessLossPct / 100);
  const fkg  = fkgBase + f.aopCostRate + aopLoss;

  const fab  = cww * fkg + f.fabricRows.slice(1).reduce((s,r)=>s+r.cons*r.rate,0);
  const acc  = f.accessoryRows.reduce((s,r)=>s+r.rate,0);
  const emb  = f.embRows.reduce((s,r)=>s+r.rate,0);
  const wash = f.washRows.reduce((s,r)=>s+r.rate,0);
  const oth  = f.otherCostRows.reduce((s,r)=>s+r.rate,0);
  const total = fab + acc + emb + wash + oth + f.cmPerDozen;
  const gmt  = total * (f.gmtWastagePct / 100);
  const sub2 = total + gmt;
  const bank = sub2 * (f.bankDeferredPct / 100);
  const com  = sub2 * (f.commercialCostPct / 100);
  const ppc  = (sub2 + bank + com) / 12;
  const fob  = f.profitPct >= 100 ? ppc : ppc / (1 - f.profitPct/100);
  const gap  = f.buyerTargetFob - fob;
  return { cww, yarn, knit, dye, sub, loss, fkgBase, fkg, fab, acc, emb, wash, oth, total, gmt, sub2, bank, com, ppc, fob, gap };
}

let _id = 300;
const nid = () => ++_id;

const ST: Record<Status,string> = {
  "Draft":           "bg-slate-100 text-slate-600",
  "Sent to Buyer":   "bg-blue-50 text-blue-600",
  "Buyer Approved":  "bg-emerald-50 text-emerald-600",
  "Converted to PO": "bg-violet-50 text-violet-600",
  "Rejected":        "bg-rose-50 text-rose-600",
};

export default function MerchandisingQuotationPage() {
  const [view, setView]   = useState<"list"|"form"|"sheet">("list");
  const [data, setData]   = useState<Q[]>(SAMPLE);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All"|Status>("All");
  const [editId, setEditId] = useState<string|null>(null);
  const [img, setImg]     = useState<string|null>(defaultDressSketch);
  const [collapsed, setCollapsed] = useState<Record<string,boolean>>({});

  const blank = (): Q => ({
    id:"", costingNo:"", date: new Date().toISOString().split("T")[0],
    buyerName:"", department:"", season:"", styleName:"", styleDescription:"",
    shipmentDate:"", sizeRange:"", fabrication1:"", fabrication2:"",
    actualFabricConsCad:1.890, consWithCuttingWastagePct:3.00,
    color1:"", garmentQuantity:0, buyerTargetFob:0, status:"Draft", image:defaultDressSketch,
    fabricRows: DEF_FABRIC.map(r=>({...r})), accessoryRows: DEF_ACC.map(r=>({...r})),
    embRows: DEF_EMB.map(r=>({...r})), washRows: DEF_WASH.map(r=>({...r})),
    otherCostRows: DEF_OTHER.map(r=>({...r})),
    yarnRows: DEF_YARN.map(r=>({...r})), knittingRows: DEF_KNIT.map(r=>({...r})),
    dyeingRows: DEF_DYE.map(r=>({...r})),
    fabricProcessLossPct:12, aopCostRate:0, aopProcessLossPct:0,
    productivityPerDay:1200, machinesRequired:5,
    cmPerDozen:3, gmtWastagePct:0, bankDeferredPct:2.40, commercialCostPct:2, profitPct:10,
  });

  const [form, setForm] = useState<Q>(blank());
  const C = useMemo(() => calc(form), [form]);
  const sf = (p: Partial<Q>) => setForm(prev => ({...prev,...p}));
  const tog = (k: string) => setCollapsed(prev => ({...prev,[k]:!prev[k]}));

  const updFabric = (id: number, p: Partial<FabricRow>) =>
    sf({ fabricRows: form.fabricRows.map(r=>r.id===id?{...r,...p}:r) });
  const updCost = (key: keyof Q, id: number, p: Partial<CostRow>) =>
    sf({ [key]: (form[key] as CostRow[]).map((r: CostRow)=>r.id===id?{...r,...p}:r) } as any);
  const addCost = (key: keyof Q) =>
    sf({ [key]: [...(form[key] as CostRow[]), { id:nid(), name:"", unit:"Dzn", rate:0 }] } as any);
  const delCost = (key: keyof Q, id: number) =>
    sf({ [key]: (form[key] as CostRow[]).filter((r: CostRow)=>r.id!==id) } as any);

  const save = () => {
    if (!form.styleName.trim()) { toast.error("Style Name is required."); return; }
    const updatedForm = { ...form, image: img || "" };
    if (editId) {
      setData(prev => prev.map(q=>q.id===editId?{...updatedForm,id:editId}:q));
      toast.success("Costing updated!");
    } else {
      const cNo = `PKCL-Costing-${String(data.length+37).padStart(2,"0")}/0`;
      setData(prev => [{...updatedForm,id:`QT-${Date.now()}`,costingNo:cNo},...prev]);
      toast.success(`${cNo} created!`);
    }
    setView("list");
  };

  const openNew   = () => { setForm(blank()); setEditId(null); setImg(defaultDressSketch); setView("form"); };
  const openEdit  = (q: Q) => { setForm({...q}); setEditId(q.id); setImg(q.image||defaultDressSketch); setView("form"); };
  const openSheet = (q: Q) => { setForm({...q}); setImg(q.image||defaultDressSketch); setView("sheet"); };

  const rows = data.filter(q => {
    const s = search.toLowerCase();
    return (q.costingNo.toLowerCase().includes(s)||q.buyerName.toLowerCase().includes(s)||q.styleName.toLowerCase().includes(s))
      && (filter==="All"||q.status===filter);
  });

  // ── Reusable UI atoms ─────────────────────────────────────────
  const NI = ({ val, onChange, disabled=false, cls="" }: { val:number; onChange:(v:number)=>void; disabled?:boolean; cls?:string }) => (
    <input type="number" step="any" value={val||""} onChange={e=>onChange(Number(e.target.value))} disabled={disabled}
      className={`w-full text-right font-mono text-xs px-2 py-1.5 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
        ${disabled ? "bg-teal-50 text-teal-700 border-teal-200 font-black cursor-default" : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"} ${cls}`} />
  );
  const TI = ({ val, onChange, ph="", cls="" }: { val:string; onChange:(v:string)=>void; ph?:string; cls?:string }) => (
    <input type="text" value={val} onChange={e=>onChange(e.target.value)} placeholder={ph}
      className={`w-full text-xs px-2 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white text-slate-800 placeholder-slate-350 transition-all ${cls}`} />
  );
  const DI = ({ val, onChange }: { val:string; onChange:(v:string)=>void }) => (
    <input type="date" value={val} onChange={e=>onChange(e.target.value)}
      className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white text-slate-800 transition-all" />
  );
  const Label = ({ children, hint }: { children: React.ReactNode; hint?:string }) => (
    <div className="flex items-center gap-1 mb-1">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{children}</span>
      {hint && <span className="text-[10px] text-slate-350" title={hint}><Info className="size-3" /></span>}
    </div>
  );
  const Chip = ({ val, color="teal" }: { val:string; color?:string }) => {
    const c = color==="teal" ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-indigo-50 text-indigo-700 border-indigo-200";
    return <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${c} font-mono whitespace-nowrap`}>{val}</span>;
  };
  const AddBtn = ({ onClick, label="Add row" }: { onClick:()=>void; label?:string }) => (
    <button onClick={onClick}
      className="flex items-center gap-1.5 w-full text-xs font-bold text-indigo-600 border border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-lg px-3 py-1.5 transition-all cursor-pointer mt-2">
      <Plus className="size-3.5 shrink-0" />{label}
    </button>
  );
  const DelBtn = ({ onClick }: { onClick:()=>void }) => (
    <button onClick={onClick} className="p-1 rounded-md hover:bg-rose-50 hover:text-rose-500 text-slate-300 transition cursor-pointer shrink-0" title="Remove row">
      <X className="size-3.5" />
    </button>
  );

  // Section with collapsible + total chip
  const Section = ({ id, title, total, color="indigo", children }: {
    id:string; title:string; total?:number; color?:"indigo"|"violet"|"pink"|"amber"|"teal"; children:React.ReactNode
  }) => {
    const bar = { indigo:"bg-indigo-500", violet:"bg-violet-500", pink:"bg-pink-500", amber:"bg-amber-500", teal:"bg-teal-500" }[color];
    const isOpen = !collapsed[id];
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button onClick={()=>tog(id)} className="flex items-center gap-2.5 px-4 py-2.5 w-full text-left hover:bg-slate-50 transition cursor-pointer border-b border-slate-100">
          <span className={`w-1 h-4 rounded-full shrink-0 ${bar}`} />
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex-1">{title}</span>
          {total !== undefined && total > 0 && (
            <Chip val={`$ ${total.toFixed(2)} /dzn`} color="indigo" />
          )}
          {isOpen ? <ChevronUp className="size-3.5 text-slate-400" /> : <ChevronDown className="size-3.5 text-slate-400" />}
        </button>
        {isOpen && <div className="p-4">{children}</div>}
      </div>
    );
  };

  // Universal cost-row table
  const CostSection = ({ rows, rowKey, onUpd, onAdd, onDel }: {
    rows: CostRow[]; rowKey: keyof Q;
    onUpd:(id:number,p:Partial<CostRow>)=>void;
    onAdd:()=>void; onDel:(id:number)=>void;
  }) => (
    <div>
      <div className="grid grid-cols-12 gap-2 px-1 mb-1.5">
        <span className="col-span-6 text-[9px] font-black text-slate-400 uppercase tracking-wide">Description</span>
        <span className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-wide text-center">Unit</span>
        <span className="col-span-3 text-[9px] font-black text-slate-400 uppercase tracking-wide text-right">Rate ($/Dzn)</span>
        <span className="col-span-1" />
      </div>
      <div className="space-y-1.5">
        {rows.map(r => (
          <div key={r.id} className={`grid grid-cols-12 gap-2 items-center group rounded-lg px-1 py-0.5 transition-colors ${r.rate > 0 ? "hover:bg-indigo-50/40" : "hover:bg-slate-50"}`}>
            <div className="col-span-6"><TI val={r.name} onChange={v=>onUpd(r.id,{name:v})} /></div>
            <div className="col-span-2">
              <select value={r.unit} onChange={e=>onUpd(r.id,{unit:e.target.value})}
                className="w-full text-[10px] text-center border border-slate-200 rounded-lg py-1.5 bg-white focus:outline-none focus:border-indigo-400 cursor-pointer">
                <option>Dzn</option><option>Pcs</option><option>KG</option>
              </select>
            </div>
            <div className="col-span-3">
              <NI val={r.rate} onChange={v=>onUpd(r.id,{rate:v})} />
            </div>
            <div className="col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <DelBtn onClick={()=>onDel(r.id)} />
            </div>
          </div>
        ))}
      </div>
      <AddBtn onClick={onAdd} />
    </div>
  );

  // ── VIEWS ─────────────────────────────────────────────────────
  return (
    <MerchandisingLayout activePath="quotation" breadcrumbs={[{label:"Buyer Costing"}]} title="Buyer Costing Sheet">
      <div className="bg-slate-50 dark:bg-slate-950 min-h-full">

        {/* ── LIST ── */}
        {view==="list" && (
          <div className="p-4 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div>
                <h1 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><FileText className="size-4" /></span>
                  Buyer Costing Register
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">Manage costing worksheets, fabric formulas and FOB quotations.</p>
              </div>
              <button onClick={openNew} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm cursor-pointer transition">
                <Plus className="size-3.5" /> New Buyer Costing
              </button>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input className="pl-9 pr-3 py-2 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" placeholder="Search costing number, buyer, style..." value={search} onChange={e=>setSearch(e.target.value)} />
              </div>
              <select className="text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none bg-white cursor-pointer font-semibold text-slate-700" value={filter} onChange={e=>setFilter(e.target.value as any)}>
                <option value="All">All Statuses</option>
                {["Draft","Sent to Buyer","Buyer Approved","Converted to PO","Rejected"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-xs whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>{["#","Costing No","Date","Buyer","Style","Season","Qty","Target FOB","Quoted FOB","Status",""].map((h,i)=>(
                    <th key={i} className="px-4 py-2.5 text-[10px] font-black uppercase text-slate-400 text-left">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rows.map((q,i)=>{
                    const c=calc(q);
                    return (
                      <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-350 font-bold text-[11px]">{i+1}</td>
                        <td className="px-4 py-3 font-bold text-indigo-600">{q.costingNo}</td>
                        <td className="px-4 py-3 text-slate-500">{q.date}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{q.buyerName}</td>
                        <td className="px-4 py-3 font-mono text-slate-700">{q.styleName}</td>
                        <td className="px-4 py-3 text-slate-500">{q.season}</td>
                        <td className="px-4 py-3 font-mono font-semibold">{q.garmentQuantity.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono">$ {q.buyerTargetFob.toFixed(2)}</td>
                        <td className={`px-4 py-3 font-mono font-black ${c.gap>=0?"text-teal-600":"text-rose-500"}`}>$ {c.fob.toFixed(3)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${ST[q.status]}`}>{q.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <button onClick={()=>openEdit(q)} className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 cursor-pointer border border-amber-100 transition" title="Edit"><Pencil className="size-3.5" /></button>
                            <button onClick={()=>openSheet(q)} className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer border border-indigo-100 transition" title="Print"><Printer className="size-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── FORM ── */}
        {view==="form" && (
          <div className="pb-24">
            {/* Toolbar */}
            <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-5 sticky top-0 z-30 shadow-xs">
              <div className="flex items-center gap-3">
                <button onClick={()=>setView("list")} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer transition"><ArrowLeft size={16} /></button>
                <div>
                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Buyer Costing Sheet</span>
                  <span className="hidden sm:inline text-[10px] text-slate-400 font-semibold ml-2">— Teal fields are auto-calculated</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setView("sheet")} className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition">
                  <Printer className="size-3.5" /> Preview
                </button>
                <button onClick={save} className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 transition shadow-sm">
                  <Save className="size-3.5" /> Save Costing
                </button>
              </div>
            </div>

            <div className="p-4 md:p-5 max-w-[1600px] mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* ── LEFT (2 cols): Cost entry ── */}
                <div className="xl:col-span-2 space-y-4">

                  {/* Style Info */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                      <FileText className="size-4 text-indigo-600 shrink-0" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Style & Order Information</span>
                    </div>
                    <div className="p-4">
                      {/* Row 1 */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        <div><Label>Date *</Label><DI val={form.date} onChange={v=>sf({date:v})} /></div>
                        <div><Label>Buyer *</Label><TI val={form.buyerName} onChange={v=>sf({buyerName:v})} ph="e.g. H&M, PEPCO" /></div>
                        <div><Label>Department *</Label><TI val={form.department} onChange={v=>sf({department:v})} ph="e.g. Men's, Kids" /></div>
                        <div><Label>Season *</Label><TI val={form.season} onChange={v=>sf({season:v})} ph="e.g. AW26" /></div>
                        <div className="col-span-2"><Label>Style Name *</Label><TI val={form.styleName} onChange={v=>sf({styleName:v})} ph="e.g. AW26OG512-2" /></div>
                        <div className="col-span-2"><Label>Style Description</Label><TI val={form.styleDescription} onChange={v=>sf({styleDescription:v})} ph="e.g. T-shirt with print" /></div>
                        <div><Label>Shipment Date *</Label><DI val={form.shipmentDate} onChange={v=>sf({shipmentDate:v})} /></div>
                        <div><Label>Size Range</Label><TI val={form.sizeRange} onChange={v=>sf({sizeRange:v})} ph="XS-XXL" /></div>
                        <div className="col-span-2"><Label>Fabrication 1 *</Label><TI val={form.fabrication1} onChange={v=>sf({fabrication1:v})} ph="100% Cotton SJ-160 GSM" /></div>
                        <div className="col-span-2"><Label>Fabrication 2</Label><TI val={form.fabrication2} onChange={v=>sf({fabrication2:v})} ph="Optional secondary fabric" /></div>
                      </div>
                      {/* Row 2 — key metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div><Label>Color *</Label><TI val={form.color1} onChange={v=>sf({color1:v})} ph="White" /></div>
                        <div><Label>Quantity (Pcs)</Label><NI val={form.garmentQuantity} onChange={v=>sf({garmentQuantity:v})} /></div>
                        <div><Label hint="CAD pattern consumption in KG per dozen">CAD Cons (KG)</Label><NI val={form.actualFabricConsCad} onChange={v=>sf({actualFabricConsCad:v})} /></div>
                        <div><Label hint="Cutting table wastage percentage">Cutting Wastage %</Label><NI val={form.consWithCuttingWastagePct} onChange={v=>sf({consWithCuttingWastagePct:v})} /></div>
                        <div><Label>Cons w/ Wastage</Label><NI val={C.cww} onChange={()=>{}} disabled /></div>
                        <div><Label>Buyer Target FOB ($)</Label><NI val={form.buyerTargetFob} onChange={v=>sf({buyerTargetFob:v})} /></div>
                      </div>
                    </div>
                  </div>

                  {/* Fabric Components */}
                  <Section id="fab" title="Fabric Components" color="indigo">
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 px-1 mb-1">
                        <span className="col-span-3 text-[9px] font-black text-slate-400 uppercase">Fabric Class</span>
                        <span className="col-span-2 text-[9px] font-black text-slate-400 uppercase">Used In</span>
                        <span className="col-span-2 text-[9px] font-black text-slate-400 uppercase text-center">Cons (KG)</span>
                        <span className="col-span-1 text-[9px] font-black text-slate-400 uppercase text-center">Unit</span>
                        <span className="col-span-2 text-[9px] font-black text-slate-400 uppercase text-right">Rate ($)</span>
                        <span className="col-span-2 text-[9px] font-black text-slate-400 uppercase text-right">Cost ($/Dzn)</span>
                      </div>
                      {form.fabricRows.map((row,idx) => {
                        const isMain = idx===0;
                        const cons = isMain ? C.cww : row.cons;
                        const rate = isMain ? C.fkg  : row.rate;
                        const cost = cons * rate;
                        return (
                          <div key={row.id} className={`grid grid-cols-12 gap-2 items-center group rounded-lg px-1 py-1 transition-colors ${isMain?"bg-indigo-50/30 border border-indigo-100":"hover:bg-slate-50"}`}>
                            <div className="col-span-3"><TI val={row.name} onChange={v=>updFabric(row.id,{name:v})} /></div>
                            <div className="col-span-2"><TI val={row.usedIn} onChange={v=>updFabric(row.id,{usedIn:v})} ph="Body…" /></div>
                            <div className="col-span-2">
                              {isMain
                                ? <NI val={C.cww} onChange={()=>{}} disabled />
                                : <NI val={row.cons} onChange={v=>updFabric(row.id,{cons:v})} />}
                            </div>
                            <div className="col-span-1">
                              <select value={row.unit} onChange={e=>updFabric(row.id,{unit:e.target.value})}
                                className="w-full text-[10px] text-center border border-slate-200 rounded-lg py-1.5 bg-white focus:outline-none focus:border-indigo-400 cursor-pointer">
                                <option>KG</option><option>Dzn</option><option>Pcs</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              {isMain
                                ? <NI val={C.fkg} onChange={()=>{}} disabled />
                                : <NI val={row.rate} onChange={v=>updFabric(row.id,{rate:v})} />}
                            </div>
                            <div className="col-span-2 flex items-center justify-end gap-1">
                              <span className={`text-xs font-mono font-black ${cost>0?"text-slate-800":"text-slate-350"}`}>{cost.toFixed(3)}</span>
                              {!isMain && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <DelBtn onClick={()=>sf({fabricRows:form.fabricRows.filter(r=>r.id!==row.id)})} />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <AddBtn onClick={()=>sf({fabricRows:[...form.fabricRows,{id:nid(),name:"",usedIn:"",cons:0,unit:"KG",rate:0}]})} label="Add fabric row" />
                    </div>
                  </Section>

                  {/* Accessories + Embellishments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Section id="acc" title="Accessories" total={C.acc} color="violet">
                      <CostSection rows={form.accessoryRows} rowKey="accessoryRows"
                        onUpd={(id,p)=>updCost("accessoryRows",id,p)}
                        onAdd={()=>addCost("accessoryRows")}
                        onDel={(id)=>delCost("accessoryRows",id)} />
                    </Section>
                    <Section id="emb" title="Embellishments" total={C.emb} color="pink">
                      <CostSection rows={form.embRows} rowKey="embRows"
                        onUpd={(id,p)=>updCost("embRows",id,p)}
                        onAdd={()=>addCost("embRows")}
                        onDel={(id)=>delCost("embRows",id)} />
                    </Section>
                  </div>

                  {/* Washing + Other */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Section id="wash" title="Washing & Garment Dye" total={C.wash} color="amber">
                      <CostSection rows={form.washRows} rowKey="washRows"
                        onUpd={(id,p)=>updCost("washRows",id,p)}
                        onAdd={()=>addCost("washRows")}
                        onDel={(id)=>delCost("washRows",id)} />
                    </Section>
                    <Section id="other" title="Other Costs" total={C.oth} color="teal">
                      <CostSection rows={form.otherCostRows} rowKey="otherCostRows"
                        onUpd={(id,p)=>updCost("otherCostRows",id,p)}
                        onAdd={()=>addCost("otherCostRows")}
                        onDel={(id)=>delCost("otherCostRows",id)} />
                    </Section>
                  </div>

                  {/* Markup Parameters */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                      <span className="w-1 h-4 rounded-full bg-indigo-500 shrink-0" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Costing Markups & CM</span>
                    </div>
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {[
                        { label:"CM Per Dozen ($)",         hint:"Making charge per dozen garments",     val:form.cmPerDozen,        key:"cmPerDozen" },
                        { label:"GMT Wastage % (Print/Wash)",hint:"Print/wash wastage addition",          val:form.gmtWastagePct,     key:"gmtWastagePct" },
                        { label:"Bank Deferred %",           hint:"Bank financing deferred cost",         val:form.bankDeferredPct,   key:"bankDeferredPct" },
                        { label:"Commercial Cost %",         hint:"Freight, C&F, export cost",            val:form.commercialCostPct, key:"commercialCostPct" },
                        { label:"Net Profit Margin %",       hint:"Target profit over base cost",         val:form.profitPct,         key:"profitPct" },
                      ].map(({ label, hint, val, key }) => (
                        <div key={key}>
                          <Label hint={hint}>{label}</Label>
                          <NI val={val} onChange={v=>sf({[key]:v} as any)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Style Image */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                      <span className="w-1 h-4 rounded-full bg-slate-400 shrink-0" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Style Image / Mockup</span>
                    </div>
                    <div className="p-4">
                      <div className="h-40 border-[1.5px] border-dashed border-slate-300 rounded-xl relative flex items-center justify-center overflow-hidden group cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 transition bg-slate-50/50">
                        {img
                          ? <><img src={img} className="h-full object-contain" /><div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><span className="text-white text-xs font-bold flex items-center gap-1.5"><Upload className="size-4" /> Replace Image</span></div></>
                          : <div className="text-center"><ImageIcon className="size-10 mx-auto text-slate-300 mb-2" /><span className="text-[11px] text-slate-400 font-semibold">Click to upload style image or sketch</span></div>
                        }
                        <input type="file" accept="image/*" onChange={e=>{if(e.target.files?.[0])setImg(URL.createObjectURL(e.target.files[0]));}} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* ── RIGHT: Fabric Calculator + Pricing ── */}
                <div className="space-y-4">

                  {/* Quoted FOB Card */}
                  <div className={`rounded-xl border-2 shadow-sm p-5 sticky top-16 z-10 space-y-4 ${C.gap>=0 ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-white"}`}>
                    {/* FOB Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Quoted FOB / Piece</p>
                        <p className={`text-3xl font-black font-mono tracking-tight ${C.gap>=0 ? "text-emerald-700" : "text-slate-900"}`}>
                          $ {C.fob.toFixed(3)}
                        </p>
                      </div>
                      {form.buyerTargetFob > 0 && (
                        <div className={`flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-xl ${C.gap>=0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
                          {C.gap>=0 ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}
                          {C.gap>=0 ? `+${C.gap.toFixed(3)}` : C.gap.toFixed(3)}
                        </div>
                      )}
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-2 text-xs">
                      {[
                        ["Fabric Cost / Dzn",    C.fab],
                        ["Accessories / Dzn",    C.acc],
                        ["Embellishments / Dzn", C.emb],
                        ["Washing & Others / Dzn", C.wash+C.oth],
                        ["CM Per Dozen",          form.cmPerDozen],
                      ].map(([l,v]) => (
                        <div key={l as string} className="flex justify-between items-center">
                          <span className="text-slate-500">{l as string}</span>
                          <span className={`font-mono font-bold ${(v as number)>0?"text-slate-800":"text-slate-350"}`}>$ {(v as number).toFixed(3)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-black">
                        <span className="text-slate-700">Total Cost / Dozen</span>
                        <span className="font-mono text-slate-900">$ {C.total.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Bank + Commercial</span>
                        <span className="font-mono font-bold">$ {(C.bank+C.com).toFixed(3)}</span>
                      </div>
                    </div>

                    {/* Target comparison */}
                    {form.buyerTargetFob > 0 && (
                      <div className={`rounded-lg p-3 text-xs space-y-1.5 ${C.gap>=0 ? "bg-emerald-100/70" : "bg-rose-50"}`}>
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-600">Buyer Target FOB</span>
                          <span className="font-mono text-slate-800">$ {form.buyerTargetFob.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between font-black">
                          <span className={C.gap>=0?"text-emerald-700":"text-rose-600"}>Price GAP</span>
                          <span className={`font-mono ${C.gap>=0?"text-emerald-700":"text-rose-600"}`}>{C.gap>=0?"+":""}{C.gap.toFixed(3)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fabric Price Calculator */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                      <span className="w-1 h-4 rounded-full bg-teal-500 shrink-0" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Fabric Price Calculator</span>
                      <Chip val={`$ ${C.fkg.toFixed(3)} /KG`} />
                    </div>
                    <div className="p-4 space-y-5">

                      {/* Yarn Blend */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Yarn Blend Ratios</span>
                          <button onClick={()=>sf({yarnRows:[...form.yarnRows,{id:nid(),yarnType:"",rate:0,pct:0}]})}
                            className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:text-indigo-700 cursor-pointer transition">
                            <Plus className="size-3" /> Add yarn
                          </button>
                        </div>
                        <div className="grid grid-cols-12 gap-1.5 mb-1.5 px-0.5">
                          <span className="col-span-4 text-[9px] font-black text-slate-350 uppercase">Yarn Count</span>
                          <span className="col-span-4 text-[9px] font-black text-slate-350 uppercase text-right">Rate ($/Kg)</span>
                          <span className="col-span-3 text-[9px] font-black text-slate-350 uppercase text-right">Blend %</span>
                          <span className="col-span-1" />
                        </div>
                        {form.yarnRows.map(r=>(
                          <div key={r.id} className="grid grid-cols-12 gap-1.5 mb-1.5 items-center group">
                            <div className="col-span-4"><TI val={r.yarnType} onChange={v=>sf({yarnRows:form.yarnRows.map(y=>y.id===r.id?{...y,yarnType:v}:y)})} /></div>
                            <div className="col-span-4"><NI val={r.rate} onChange={v=>sf({yarnRows:form.yarnRows.map(y=>y.id===r.id?{...y,rate:v}:y)})} /></div>
                            <div className="col-span-3"><NI val={r.pct} onChange={v=>sf({yarnRows:form.yarnRows.map(y=>y.id===r.id?{...y,pct:v}:y)})} /></div>
                            <div className="col-span-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DelBtn onClick={()=>sf({yarnRows:form.yarnRows.filter(y=>y.id!==r.id)})} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Knitting */}
                      <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Knitting Charge</span>
                          <button onClick={()=>sf({knittingRows:[...form.knittingRows,{id:nid(),name:"",rate:0}]})}
                            className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:text-indigo-700 cursor-pointer transition">
                            <Plus className="size-3" /> Add
                          </button>
                        </div>
                        {form.knittingRows.map(r=>(
                          <div key={r.id} className="grid grid-cols-12 gap-1.5 mb-1.5 items-center group">
                            <div className="col-span-8"><TI val={r.name} onChange={v=>sf({knittingRows:form.knittingRows.map(k=>k.id===r.id?{...k,name:v}:k)})} /></div>
                            <div className="col-span-3"><NI val={r.rate} onChange={v=>sf({knittingRows:form.knittingRows.map(k=>k.id===r.id?{...k,rate:v}:k)})} /></div>
                            <div className="col-span-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DelBtn onClick={()=>sf({knittingRows:form.knittingRows.filter(k=>k.id!==r.id)})} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Dyeing */}
                      <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Dyeing & Finishing</span>
                          <button onClick={()=>sf({dyeingRows:[...form.dyeingRows,{id:nid(),name:"",rate:0}]})}
                            className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:text-indigo-700 cursor-pointer transition">
                            <Plus className="size-3" /> Add
                          </button>
                        </div>
                        {form.dyeingRows.map(r=>(
                          <div key={r.id} className="grid grid-cols-12 gap-1.5 mb-1.5 items-center group">
                            <div className="col-span-8"><TI val={r.name} onChange={v=>sf({dyeingRows:form.dyeingRows.map(d=>d.id===r.id?{...d,name:v}:d)})} /></div>
                            <div className="col-span-3"><NI val={r.rate} onChange={v=>sf({dyeingRows:form.dyeingRows.map(d=>d.id===r.id?{...d,rate:v}:d)})} /></div>
                            <div className="col-span-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DelBtn onClick={()=>sf({dyeingRows:form.dyeingRows.filter(d=>d.id!==r.id)})} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary */}
                      <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-600">
                          <span>Yarn Sub-Total</span>
                          <span className="font-mono font-bold text-slate-800">$ {C.sub.toFixed(3)} /Kg</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="flex items-center gap-1.5">
                            Fabric Process Loss
                            <NI val={form.fabricProcessLossPct} onChange={v=>sf({fabricProcessLossPct:v})} cls="w-14 text-center" />
                            <span className="text-slate-400 font-bold shrink-0">%</span>
                          </span>
                          <span className="font-mono font-bold text-slate-800">$ {C.loss.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between items-center font-black bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 text-teal-800">
                          <span>Fabric Price / KG</span>
                          <span className="font-mono">$ {C.fkgBase.toFixed(3)}</span>
                        </div>
                      </div>

                      {/* AOP */}
                      <div className="border-t border-slate-100 pt-4 space-y-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide block">AOP Cost (If Applicable)</span>
                        <div className="grid grid-cols-2 gap-3">
                          <div><Label>AOP Rate ($/Kg)</Label><NI val={form.aopCostRate} onChange={v=>sf({aopCostRate:v})} /></div>
                          <div><Label>AOP Loss %</Label><NI val={form.aopProcessLossPct} onChange={v=>sf({aopProcessLossPct:v})} /></div>
                        </div>
                        {form.aopCostRate > 0 && (
                          <div className="flex justify-between bg-teal-50 rounded-lg px-3 py-2 text-xs font-black text-teal-800 border border-teal-200">
                            <span>Final Fabric Price / KG</span>
                            <span className="font-mono">$ {C.fkg.toFixed(3)}</span>
                          </div>
                        )}
                      </div>

                      {/* Machine Income */}
                      <div className="border-t border-slate-100 pt-4 space-y-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide block">Machine Income Estimate</span>
                        <div className="grid grid-cols-2 gap-3">
                          <div><Label hint="Productivity per day per machine">Productivity/Day</Label><NI val={form.productivityPerDay} onChange={v=>sf({productivityPerDay:v})} /></div>
                          <div><Label>No. of Machines</Label><NI val={form.machinesRequired} onChange={v=>sf({machinesRequired:v})} /></div>
                        </div>
                        <div className="flex justify-between bg-indigo-50 rounded-lg px-3 py-2 text-xs font-black text-indigo-700 border border-indigo-100">
                          <span>Daily Machine Income</span>
                          <span className="font-mono">$ {(C.fob * form.productivityPerDay * form.machinesRequired).toFixed(0)}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PRINT SHEET ── */}
        {view==="sheet" && (
          <div className="p-4 md:p-8 max-w-[1500px] mx-auto pb-24 space-y-4 print:p-0">
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 print:hidden shadow-xs">
              <button onClick={()=>setView("list")} className="flex items-center gap-1.5 text-xs font-bold text-slate-655 hover:text-slate-900 cursor-pointer transition">
                <ArrowLeft className="size-4" /> Back to List
              </button>
              <div className="flex gap-2">
                <button onClick={()=>window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                  <Printer className="size-3.5" /> Print Costing
                </button>
                <button onClick={()=>setView("form")} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition">
                  Edit Costing
                </button>
              </div>
            </div>

            {/* Buyer Costing Sheet Document Container */}
            <div className="bg-white border border-slate-350 shadow-md p-6 md:p-8 space-y-6 text-[10px] text-slate-800 leading-relaxed max-w-full mx-auto print:border-none print:shadow-none print:p-0">
              
              {/* Header Title Block */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <div className="bg-[#8b2525] text-white py-2.5 text-center select-none">
                  <h1 className="text-sm font-black uppercase tracking-widest leading-none">PAKIZA KNIT COMPOSITE LTD</h1>
                  <p className="text-[10px] font-bold tracking-widest uppercase mt-1 opacity-90">Buyer Costing Sheet</p>
                </div>
              </div>

              {/* Basic Information Layout (Side-by-side Table) */}
              <div className="grid grid-cols-12 gap-5 items-stretch">
                
                {/* Left Side Table */}
                <div className="col-span-12 md:col-span-8">
                  <table className="w-full border-collapse border border-slate-300 text-[10px] text-slate-700">
                    <tbody>
                      <tr className="border-b border-slate-300">
                        <td className="w-40 bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">Costing No</td>
                        <td colSpan={3} className="px-2 py-1.5 font-black text-slate-900 border-r border-slate-300">{form.costingNo || "PKCL-Costing-36/0"}</td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">DATE *</td>
                        <td className="px-2 py-1.5 font-semibold border-r border-slate-300">{form.date}</td>
                        <td className="w-40 bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">BUYER *</td>
                        <td className="px-2 py-1.5 font-black text-slate-950">{form.buyerName}</td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">DEPARTMENT *</td>
                        <td className="px-2 py-1.5 font-semibold border-r border-slate-300">{form.department}</td>
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">SEASON *</td>
                        <td className="px-2 py-1.5 font-semibold">{form.season}</td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">STYLE NAME *</td>
                        <td className="px-2 py-1.5 font-black text-indigo-900 border-r border-slate-300">{form.styleName}</td>
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">STYLE DESCRIPTION</td>
                        <td className="px-2 py-1.5 text-slate-600">{form.styleDescription || "—"}</td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">SHIPMENT DATE *</td>
                        <td className="px-2 py-1.5 font-semibold border-r border-slate-300">{form.shipmentDate}</td>
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">SIZE RANGE</td>
                        <td className="px-2 py-1.5 font-medium">{form.sizeRange || "—"}</td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">FABRICATION 1</td>
                        <td colSpan={3} className="px-2 py-1.5 font-medium border-r border-slate-300">{form.fabrication1}</td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">FABRICATION 2</td>
                        <td colSpan={3} className="px-2 py-1.5 font-medium border-r border-slate-300">{form.fabrication2 || "—"}</td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">ACTUAL FABRIC CONSUMPTION FROM CAD</td>
                        <td className="px-2 py-1.5 font-mono font-bold border-r border-slate-300">{form.actualFabricConsCad.toFixed(3)}</td>
                        <td colSpan={2} className="px-2 py-1 font-bold text-slate-500">KG</td>
                      </tr>
                      <tr>
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">CONSUMPTION WITH CUTTING WASTAGE</td>
                        <td className="px-2 py-1.5 font-mono font-bold border-r border-slate-300">{form.consWithCuttingWastagePct.toFixed(3)}</td>
                        <td className="px-2 py-1.5 font-mono font-bold border-r border-slate-300 text-indigo-750">{C.cww.toFixed(3)}</td>
                        <td className="px-2 py-1.5 font-bold text-slate-500 flex items-center justify-between">
                          <span>KG</span>
                          <input type="checkbox" checked readOnly className="rounded border-slate-350 text-indigo-650 focus:ring-indigo-500 size-3 mr-1" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right Side Table with Dress Sketch image */}
                <div className="col-span-12 md:col-span-4 flex flex-col justify-between">
                  <div className="border border-slate-300 rounded-lg p-2 flex items-center justify-center bg-slate-50/50 flex-1 min-h-[140px] mb-3 relative overflow-hidden group">
                    <div className="absolute top-1 left-2 text-[8px] font-black uppercase tracking-widest text-slate-400">Sketch Image</div>
                    {img ? (
                      <img src={img} alt="Quotation Sketch" className="max-h-[120px] object-contain rounded" />
                    ) : (
                      <div className="text-center text-slate-450 pointer-events-none">
                        <ImageIcon className="size-8 mx-auto text-slate-300 mb-1" />
                        <span className="text-[8px] uppercase tracking-wider font-bold">No Image Mockup Available</span>
                      </div>
                    )}
                  </div>
                  <table className="w-full border-collapse border border-slate-300 text-[10px] text-slate-700">
                    <tbody>
                      <tr className="border-b border-slate-300">
                        <td className="w-40 bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">COLOR 1</td>
                        <td className="px-2 py-1.5 font-semibold text-slate-800">{form.color1}</td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">GARMENT QUANTITY (Pcs)</td>
                        <td className="px-2 py-1.5 font-mono font-bold text-slate-900">{form.garmentQuantity.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="bg-slate-50 px-2 py-1.5 font-bold border-r border-slate-300 text-slate-500 uppercase text-[8.5px]">BUYER'S TARGET/FOB</td>
                        <td className="px-2 py-1.5 font-mono font-black text-indigo-700">$ {form.buyerTargetFob.toFixed(3)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* ── Cost Breakdown Grid Side-By-Side ── */}
              <div className="grid grid-cols-12 gap-5 items-stretch">
                
                {/* ── Left Column: GARMENT COST BREAKDOWN (7 cols) ── */}
                <div className="col-span-12 lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <div className="bg-[#e2d8eb] text-[#3c1d56] px-3 py-1.5 text-center font-black uppercase tracking-wider text-[9.5px]">
                      Garment Cost Breakdown
                    </div>
                    <table className="w-full border-collapse border-t border-slate-300 text-[9.5px] text-slate-800">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-300 text-slate-500 font-bold uppercase text-[8px] tracking-wider">
                          <th colSpan={2} className="px-2 py-1 text-left border-r border-slate-300">Fabric</th>
                          <th className="px-2 py-1 text-left border-r border-slate-300">Used In</th>
                          <th className="px-2 py-1 text-right border-r border-slate-300">Cons.</th>
                          <th className="px-2 py-1 text-left border-r border-slate-300">Unit</th>
                          <th className="px-2 py-1 text-right border-r border-slate-300">Rate</th>
                          <th className="px-2 py-1 text-right">Cost (USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-300">
                          <td colSpan={2} className="px-2 py-1.5 font-black text-slate-900 border-r border-slate-300">MAIN FABRIC</td>
                          <td className="px-2 py-1.5 text-slate-600 border-r border-slate-300">Body</td>
                          <td className="px-2 py-1.5 text-right font-mono border-r border-slate-300">{C.cww.toFixed(3)}</td>
                          <td className="px-2 py-1.5 font-bold border-r border-slate-300">KG</td>
                          <td className="px-2 py-1.5 text-right font-mono border-r border-slate-300">{C.fkg.toFixed(3)}</td>
                          <td className="px-2 py-1.5 text-right font-mono font-bold text-slate-900">{C.fab.toFixed(3)}</td>
                        </tr>
                        
                        {/* Accessories Section */}
                        <tr className="bg-slate-50 font-black border-y border-slate-300 text-[8.5px] text-slate-650 tracking-wider">
                          <td colSpan={7} className="px-2 py-1 uppercase">Accessories</td>
                        </tr>
                        {form.accessoryRows.map(row => (
                          <tr key={row.id} className="border-b border-slate-300 hover:bg-slate-50/30 transition-colors">
                            <td colSpan={3} className="px-2 py-1 text-slate-700 border-r border-slate-300">{row.name}</td>
                            <td className="px-2 py-1 text-right font-mono border-r border-slate-300">—</td>
                            <td className="px-2 py-1 font-bold border-r border-slate-300">{row.unit}</td>
                            <td className="px-2 py-1 text-right font-mono border-r border-slate-300">{(row.rate / 12).toFixed(3)}</td>
                            <td className="px-2 py-1 text-right font-mono font-bold text-slate-800">{row.rate.toFixed(3)}</td>
                          </tr>
                        ))}

                        {/* Embellishment Section */}
                        <tr className="bg-slate-50 font-black border-y border-slate-300 text-[8.5px] text-slate-650 tracking-wider">
                          <td colSpan={7} className="px-2 py-1 uppercase">Embellishment</td>
                        </tr>
                        {form.embRows.map(row => (
                          <tr key={row.id} className="border-b border-slate-300 hover:bg-slate-50/30 transition-colors">
                            <td colSpan={3} className="px-2 py-1 text-slate-700 border-r border-slate-300">{row.name}</td>
                            <td className="px-2 py-1 text-right font-mono border-r border-slate-300">—</td>
                            <td className="px-2 py-1 font-bold border-r border-slate-300">{row.unit}</td>
                            <td className="px-2 py-1 text-right font-mono border-r border-slate-300">{(row.rate / 12).toFixed(3)}</td>
                            <td className="px-2 py-1 text-right font-mono font-bold text-slate-800">{row.rate.toFixed(3)}</td>
                          </tr>
                        ))}

                        {/* Washing & Garment Dye Section */}
                        <tr className="bg-slate-50 font-black border-y border-slate-300 text-[8.5px] text-slate-650 tracking-wider">
                          <td colSpan={7} className="px-2 py-1 uppercase">Washing & Garment Dye</td>
                        </tr>
                        {form.washRows.length === 0 ? (
                          <tr className="border-b border-slate-300"><td colSpan={7} className="px-2 py-1.5 text-center text-slate-450 font-semibold">— No Washing/Dye items —</td></tr>
                        ) : (
                          form.washRows.map(row => (
                            <tr key={row.id} className="border-b border-slate-300 hover:bg-slate-50/30 transition-colors">
                              <td colSpan={3} className="px-2 py-1 text-slate-700 border-r border-slate-300">{row.name}</td>
                              <td className="px-2 py-1 text-right font-mono border-r border-slate-300">—</td>
                              <td className="px-2 py-1 font-bold border-r border-slate-300">{row.unit}</td>
                              <td className="px-2 py-1 text-right font-mono border-r border-slate-300">{(row.rate / 12).toFixed(3)}</td>
                              <td className="px-2 py-1 text-right font-mono font-bold text-slate-850">{row.rate.toFixed(3)}</td>
                            </tr>
                          ))
                        )}

                        {/* Other Costs Section */}
                        <tr className="bg-slate-50 font-black border-y border-slate-300 text-[8.5px] text-slate-650 tracking-wider">
                          <td colSpan={7} className="px-2 py-1 uppercase">Other Costs</td>
                        </tr>
                        {form.otherCostRows.map(row => (
                          <tr key={row.id} className="border-b border-slate-300 hover:bg-slate-50/30 transition-colors">
                            <td colSpan={3} className="px-2 py-1 text-slate-700 border-r border-slate-300">{row.name}</td>
                            <td className="px-2 py-1 text-right font-mono border-r border-slate-300">—</td>
                            <td className="px-2 py-1 font-bold border-r border-slate-300">{row.unit}</td>
                            <td className="px-2 py-1 text-right font-mono border-r border-slate-300">{(row.rate / 12).toFixed(3)}</td>
                            <td className="px-2 py-1 text-right font-mono font-bold text-slate-800">{row.rate.toFixed(3)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Garment Cost Calculations Summary */}
                  <div className="border border-slate-300 rounded-lg overflow-hidden bg-white text-[9.5px]">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr className="border-b border-slate-300">
                          <td colSpan={5} className="px-3 py-1 font-bold text-slate-600">CM PER DOZEN</td>
                          <td className="px-3 py-1 text-right font-mono font-black text-slate-900 w-36">$ {form.cmPerDozen.toFixed(3)}</td>
                        </tr>
                        <tr className="border-b border-slate-300 bg-slate-50 font-black text-slate-900">
                          <td colSpan={5} className="px-3 py-1.5">TOTAL COST PER DOZEN</td>
                          <td className="px-3 py-1.5 text-right font-mono text-slate-900">$ {C.total.toFixed(3)}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="px-3 py-1 font-bold text-slate-600 w-44">ADDING GMT. WASTAGE FOR PRINT/WASH</td>
                          <td className="px-2 py-1 font-mono font-bold text-slate-800 w-16">{form.gmtWastagePct.toFixed(3)}</td>
                          <td className="px-2 py-1 font-bold text-slate-500 w-10">%</td>
                          <td colSpan={2}/>
                          <td className="px-3 py-1 text-right font-mono font-bold text-slate-800">$ {C.gmt.toFixed(3)}</td>
                        </tr>
                        <tr className="border-b border-slate-300 bg-slate-50 font-bold text-slate-800">
                          <td colSpan={5} className="px-3 py-1.5">SUB TOTAL COST / DOZEN</td>
                          <td className="px-3 py-1.5 text-right font-mono">$ {C.sub2.toFixed(3)}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="px-3 py-1 font-bold text-slate-600">BANK DEFERRED COST</td>
                          <td className="px-2 py-1 font-mono font-bold text-slate-800">{form.bankDeferredPct.toFixed(3)}</td>
                          <td className="px-2 py-1 font-bold text-slate-500">%</td>
                          <td colSpan={2}/>
                          <td className="px-3 py-1 text-right font-mono font-bold text-slate-800">$ {C.bank.toFixed(3)}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="px-3 py-1 font-bold text-slate-600">COMMERCIAL COST</td>
                          <td className="px-2 py-1 font-mono font-bold text-slate-800">{form.commercialCostPct.toFixed(3)}</td>
                          <td className="px-2 py-1 font-bold text-slate-500">%</td>
                          <td colSpan={2}/>
                          <td className="px-3 py-1 text-right font-mono font-bold text-slate-800">$ {C.com.toFixed(3)}</td>
                        </tr>
                        <tr className="border-b border-slate-300 bg-slate-50 font-black text-indigo-700">
                          <td colSpan={5} className="px-3 py-1.5">Garment Price / Pcs</td>
                          <td className="px-3 py-1.5 text-right font-mono">$ {C.ppc.toFixed(3)}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="px-3 py-1 font-bold text-slate-600">Price Per Pcs</td>
                          <td className="px-2 py-1 font-mono font-bold text-slate-850">1.000</td>
                          <td className="px-2 py-1 font-bold text-slate-500">Pcs</td>
                          <td colSpan={2}/>
                          <td className="px-3 py-1 text-right font-mono font-bold text-slate-850">$ {C.ppc.toFixed(3)}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="px-3 py-1 font-bold text-slate-600">Profit *</td>
                          <td className="px-2 py-1 font-mono font-bold text-slate-800">{form.profitPct.toFixed(3)}</td>
                          <td className="px-2 py-1 font-bold text-slate-500">%</td>
                          <td colSpan={2}/>
                          <td className="px-3 py-1 text-right font-mono font-bold text-indigo-650">$ {C.fob.toFixed(3)}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td colSpan={5} className="px-3 py-1 font-bold text-slate-600">Target Per Pcs</td>
                          <td className="px-3 py-1 text-right font-mono font-black text-slate-900">$ {form.buyerTargetFob.toFixed(3)}</td>
                        </tr>
                        <tr className={`font-black ${C.gap >= 0 ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                          <td colSpan={5} className="px-3 py-1.5 uppercase tracking-wider">Price GAP</td>
                          <td className="px-3 py-1.5 text-right font-mono text-lg">{C.gap.toFixed(3)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Right Column: FABRIC PRICE CALCULATION (5 cols) ── */}
                <div className="col-span-12 lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="border border-slate-300 rounded-lg overflow-hidden flex-1">
                    <div className="bg-[#e2d8eb] text-[#3c1d56] px-3 py-1.5 text-center font-black uppercase tracking-wider text-[9.5px]">
                      Fabric Price Calculation
                    </div>
                    <table className="w-full border-collapse border-t border-slate-300 text-[9.5px] text-slate-800">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-300 text-slate-500 font-bold uppercase text-[8px] tracking-wider">
                          <th className="px-2 py-1 text-left border-r border-slate-300">Particulars</th>
                          <th className="px-2 py-1 text-left border-r border-slate-300">Yarn</th>
                          <th className="px-2 py-1 text-right border-r border-slate-300">Rate</th>
                          <th className="px-2 py-1 text-right border-r border-slate-300">% *</th>
                          <th className="px-2 py-1 text-right">Cost (USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.yarnRows.map(row => (
                          <tr key={row.id} className="border-b border-slate-300 hover:bg-slate-50/30 transition-colors">
                            <td className="px-2 py-1.5 font-bold border-r border-slate-300">YARN</td>
                            <td className="px-2 py-1.5 text-slate-700 border-r border-slate-300">{row.yarnType}</td>
                            <td className="px-2 py-1.5 text-right font-mono border-r border-slate-300">{row.rate.toFixed(3)}</td>
                            <td className="px-2 py-1.5 text-right font-mono border-r border-slate-300">{row.pct.toFixed(3)}</td>
                            <td className="px-2 py-1.5 text-right font-mono font-bold text-slate-900">{(row.rate * row.pct / 100).toFixed(3)}</td>
                          </tr>
                        ))}

                        {/* Knitting Section */}
                        <tr className="bg-slate-50 font-black border-y border-slate-300 text-[8.5px] text-slate-650 tracking-wider">
                          <td colSpan={5} className="px-2 py-1 uppercase">Knitting Charge</td>
                        </tr>
                        {form.knittingRows.map(row => (
                          <tr key={row.id} className="border-b border-slate-300 hover:bg-slate-50/30 transition-colors">
                            <td colSpan={2} className="px-2 py-1 text-slate-700 border-r border-slate-300">{row.name || "SINGLE JERSEY"}</td>
                            <td colSpan={2} className="px-2 py-1 text-right font-mono border-r border-slate-300">—</td>
                            <td className="px-2 py-1 text-right font-mono font-bold text-slate-900">{row.rate.toFixed(3)}</td>
                          </tr>
                        ))}

                        {/* Dyeing Section */}
                        <tr className="bg-slate-50 font-black border-y border-slate-300 text-[8.5px] text-slate-650 tracking-wider">
                          <td colSpan={5} className="px-2 py-1 uppercase">Dyeing & Finishing Charge</td>
                        </tr>
                        {form.dyeingRows.filter(d=>d.rate>0).length === 0 ? (
                          <tr className="border-b border-slate-300"><td colSpan={5} className="px-2 py-1.5 text-center text-slate-450 font-semibold">— No Dyeing Charge —</td></tr>
                        ) : (
                          form.dyeingRows.filter(d=>d.rate>0).map(row => (
                            <tr key={row.id} className="border-b border-slate-300 hover:bg-slate-50/30 transition-colors">
                              <td colSpan={2} className="px-2 py-1 text-slate-700 border-r border-slate-300">{row.name}</td>
                              <td colSpan={2} className="px-2 py-1 text-right font-mono border-r border-slate-300">—</td>
                              <td className="px-2 py-1 text-right font-mono font-bold text-slate-900">{row.rate.toFixed(3)}</td>
                            </tr>
                          ))
                        )}
                        
                        {/* Sub-Total / Process Loss */}
                        <tr className="bg-slate-50 border-t border-slate-300 font-bold text-slate-800 border-b border-slate-300">
                          <td colSpan={4} className="px-2 py-1.5">SUB-TOTAL</td>
                          <td className="px-2 py-1.5 text-right font-mono font-black text-slate-900">$ {C.sub.toFixed(3)}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="px-2 py-1 font-bold text-slate-600">FABRIC PROCESS LOSS</td>
                          <td className="px-2 py-1 font-mono font-bold text-slate-800 text-center">{form.fabricProcessLossPct.toFixed(3)}</td>
                          <td className="px-2 py-1 font-bold text-slate-500">%</td>
                          <td className="border-r border-slate-300"/>
                          <td className="px-2 py-1 text-right font-mono font-bold text-slate-800">$ {C.loss.toFixed(3)}</td>
                        </tr>
                        <tr className="bg-slate-50/70 font-black text-teal-850 border-b border-slate-300">
                          <td colSpan={4} className="px-2 py-1.5">FABRIC PRICE PER KG</td>
                          <td className="px-2 py-1.5 text-right font-mono">$ {C.fkgBase.toFixed(3)}</td>
                        </tr>

                        {/* AOP (If Applicable) */}
                        <tr className="bg-slate-50 font-black border-y border-slate-300 text-[8.5px] text-slate-650 tracking-wider">
                          <td colSpan={5} className="px-2 py-1 uppercase">AOP Cost (If Applicable)</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="px-2 py-1 font-bold text-slate-600">AOP PROCESS LOSS</td>
                          <td className="px-2 py-1 font-mono font-bold text-slate-800 text-center">{form.aopProcessLossPct.toFixed(3)}</td>
                          <td className="px-2 py-1 font-bold text-slate-500">%</td>
                          <td className="border-r border-slate-300"/>
                          <td className="px-2 py-1 text-right font-mono font-bold text-slate-800">$ {(form.aopCostRate * form.aopProcessLossPct / 100).toFixed(3)}</td>
                        </tr>
                        <tr className="bg-slate-50/70 font-black text-teal-850 border-b border-slate-350">
                          <td colSpan={4} className="px-2 py-1.5">FINAL FABRIC PRICE PER KG</td>
                          <td className="px-2 py-1.5 text-right font-mono">$ {C.fkg.toFixed(3)}</td>
                        </tr>

                        {/* Machine Income Calculation */}
                        <tr className="bg-slate-50 font-black border-b border-slate-300 text-[8.5px] text-slate-650 tracking-wider">
                          <td colSpan={5} className="px-2 py-1 uppercase">Machine Income Calculation</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td colSpan={4} className="px-2 py-1 text-slate-650 border-r border-slate-300">CM PER DOZEN</td>
                          <td className="px-2 py-1 text-right font-mono text-slate-800">0.000</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td colSpan={4} className="px-2 py-1 text-slate-650 border-r border-slate-300">PRODUCTIVITY PER DAY</td>
                          <td className="px-2 py-1 text-right font-mono text-slate-800">0.000</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td colSpan={4} className="px-2 py-1 text-slate-650 border-r border-slate-300">NO. OF MACHINE REQUIRED</td>
                          <td className="px-2 py-1 text-right font-mono text-slate-800">0.000</td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="px-2 py-1 text-slate-650 border-r border-slate-300">MACHINE INCOME</td>
                          <td className="px-2 py-1 text-right font-mono text-slate-800 font-bold">0.000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Highlights banner quotation cost */}
                  <div className="bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb] rounded-lg py-2.5 text-center font-black tracking-wide text-xs select-none">
                    THIS QUOTATION &nbsp; &nbsp; &nbsp; &nbsp; $ {C.fob.toFixed(3)}
                  </div>

                  {/* ── BUDGET SUMMARY ── */}
                  {(() => {
                    const qtyDozen = form.garmentQuantity / 12;
                    const orderValue = form.garmentQuantity * C.fob;
                    const netOrderValue = orderValue;

                    const b1 = qtyDozen * (C.fab - (C.cww * C.fkg));
                    const b2 = qtyDozen * C.cww * C.yarn;
                    const b3 = 0;
                    const b4 = qtyDozen * C.cww * (C.fkg - C.yarn);
                    const b5 = qtyDozen * C.acc;
                    const b6 = qtyDozen * (C.emb + C.wash);
                    const totalVarCost = b1 + b2 + b3 + b4 + b5 + b6;

                    const cm = netOrderValue - totalVarCost;
                    const cmCost = qtyDozen * form.cmPerDozen;
                    const opProfit = cm - cmCost;

                    const fComm = 0;
                    const gSpec = qtyDozen * C.gmt;
                    const hOth = qtyDozen * (C.oth + C.bank + C.com);
                    const iSamp = 0;
                    const totalCost = totalVarCost + cmCost + fComm + gSpec + hOth + iSamp;
                    const netProfit = netOrderValue - totalCost;

                    const pct = (val: number) => netOrderValue > 0 ? ((val / netOrderValue) * 100).toFixed(2) : "0.00";
                    const fAmt = (val: number) => `$ ${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

                    return (
                      <div className="border border-slate-300 shadow-sm rounded-lg overflow-hidden w-full print:max-w-none print:shadow-none print:border-slate-300">
                        <div className="bg-white border-b border-slate-300 px-3 py-2.5 flex items-center gap-2">
                          <div className="w-1.5 h-4 bg-indigo-600 rounded-sm"></div>
                          <h3 className="font-black text-indigo-950 tracking-widest text-[10.5px] uppercase">Budget Summary</h3>
                        </div>
                        <table className="w-full text-[9.5px] border-collapse text-slate-700 bg-white">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[9px] bg-slate-50/50">
                              <th className="px-3 py-1.5 text-left w-12">Ref</th>
                              <th className="px-3 py-1.5 text-left">Particulars</th>
                              <th className="px-3 py-1.5 text-right">Amount</th>
                              <th className="px-3 py-1.5 text-right w-16">%</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                              <td className="px-3 py-1.5 font-bold text-slate-400">A</td>
                              <td className="px-3 py-1.5 font-bold text-slate-800">Order Value</td>
                              <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{fAmt(orderValue)}</td>
                              <td className="px-3 py-1.5"></td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-slate-500">
                              <td className="px-3 py-1.5 text-slate-400">A.1</td>
                              <td className="px-3 py-1.5">Less Buyer Sup. Mat.</td>
                              <td className="px-3 py-1.5 text-right font-mono">{fAmt(0)}</td>
                              <td className="px-3 py-1.5"></td>
                            </tr>
                            <tr className="border-b border-slate-200 bg-slate-50/80">
                              <td className="px-3 py-1.5 font-bold text-slate-400">A.2</td>
                              <td className="px-3 py-1.5 font-black text-slate-900">Net Order Value</td>
                              <td className="px-3 py-1.5 text-right font-mono font-black text-slate-900">{fAmt(netOrderValue)}</td>
                              <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-900">100</td>
                            </tr>
                            
                            <tr>
                              <td colSpan={4} className="px-3 pt-2.5 pb-1 font-bold text-indigo-800/80 text-[9px] tracking-wider uppercase">Variable Cost</td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors text-slate-600">
                              <td className="px-3 py-1 text-slate-400">B.1</td>
                              <td className="px-3 py-1">Fabric Purchase Cost</td>
                              <td className="px-3 py-1 text-right font-mono">{fAmt(b1)}</td>
                              <td className="px-3 py-1 text-right font-mono">{pct(b1)}</td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors text-slate-600">
                              <td className="px-3 py-1 text-slate-400">B.2</td>
                              <td className="px-3 py-1">Yarn Cost</td>
                              <td className="px-3 py-1 text-right font-mono font-medium text-slate-800">{fAmt(b2)}</td>
                              <td className="px-3 py-1 text-right font-mono">{pct(b2)}</td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors text-slate-600">
                              <td className="px-3 py-1 text-slate-400">B.3</td>
                              <td className="px-3 py-1">Dyed Yarn</td>
                              <td className="px-3 py-1 text-right font-mono">{fAmt(b3)}</td>
                              <td className="px-3 py-1 text-right font-mono">{pct(b3)}</td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors text-slate-600">
                              <td className="px-3 py-1 text-slate-400">B.4</td>
                              <td className="px-3 py-1">Fabric Conv. Cost</td>
                              <td className="px-3 py-1 text-right font-mono font-medium text-slate-800">{fAmt(b4)}</td>
                              <td className="px-3 py-1 text-right font-mono">{pct(b4)}</td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors text-slate-600">
                              <td className="px-3 py-1 text-slate-400">B.5</td>
                              <td className="px-3 py-1">Accessories</td>
                              <td className="px-3 py-1 text-right font-mono font-medium text-slate-800">{fAmt(b5)}</td>
                              <td className="px-3 py-1 text-right font-mono">{pct(b5)}</td>
                            </tr>
                            <tr className="border-b border-slate-200 hover:bg-slate-50/80 transition-colors text-slate-600">
                              <td className="px-3 py-1 text-slate-400">B.6</td>
                              <td className="px-3 py-1">Embellishment Cost</td>
                              <td className="px-3 py-1 text-right font-mono">{fAmt(b6)}</td>
                              <td className="px-3 py-1 text-right font-mono">{pct(b6)}</td>
                            </tr>
                            <tr className="border-b border-slate-200 bg-rose-50/30">
                              <td className="px-3 py-1.5"></td>
                              <td className="px-3 py-1.5 font-black text-rose-700">Total Variable Cost</td>
                              <td className="px-3 py-1.5 text-right font-mono font-black text-rose-700">{fAmt(totalVarCost)}</td>
                              <td className="px-3 py-1.5 text-right font-mono font-bold text-rose-700">{pct(totalVarCost)}</td>
                            </tr>
                            
                            <tr className="border-b border-slate-200 bg-blue-50/30">
                              <td className="px-3 py-1.5 font-bold text-slate-400">C</td>
                              <td className="px-3 py-1.5 font-black text-blue-700 text-[9.5px]">Contribution Margin</td>
                              <td className="px-3 py-1.5 text-right font-mono font-black text-blue-700 text-[9.5px]">{fAmt(cm)}</td>
                              <td className="px-3 py-1.5 text-right font-mono font-bold text-blue-700">{pct(cm)}</td>
                            </tr>
                            
                            <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                              <td className="px-3 py-1.5 font-bold text-slate-400">D</td>
                              <td className="px-3 py-1.5 font-bold text-slate-800">CM Cost</td>
                              <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">{fAmt(cmCost)}</td>
                              <td className="px-3 py-1.5 text-right font-mono">{pct(cmCost)}</td>
                            </tr>
                            
                            <tr className="border-b border-slate-200 bg-slate-50/80">
                              <td className="px-3 py-1.5 font-bold text-slate-400">E</td>
                              <td className="px-3 py-1.5 font-black text-slate-900">Operating Profit</td>
                              <td className="px-3 py-1.5 text-right font-mono font-black text-slate-900">{fAmt(opProfit)}</td>
                              <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-900">{pct(opProfit)}</td>
                            </tr>
                            
                            <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-slate-600">
                              <td className="px-3 py-1 text-slate-400">F</td>
                              <td className="px-3 py-1">Commission Cost</td>
                              <td className="px-3 py-1 text-right font-mono">{fAmt(fComm)}</td>
                              <td className="px-3 py-1 text-right font-mono">{pct(fComm)}</td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-slate-600">
                              <td className="px-3 py-1 text-slate-400">G</td>
                              <td className="px-3 py-1">Special Cost</td>
                              <td className="px-3 py-1 text-right font-mono">{fAmt(gSpec)}</td>
                              <td className="px-3 py-1 text-right font-mono">{pct(gSpec)}</td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-slate-600">
                              <td className="px-3 py-1 text-slate-400">H</td>
                              <td className="px-3 py-1">Others Cost</td>
                              <td className="px-3 py-1 text-right font-mono font-medium text-slate-800">{fAmt(hOth)}</td>
                              <td className="px-3 py-1 text-right font-mono">{pct(hOth)}</td>
                            </tr>
                            <tr className="border-b border-slate-200 hover:bg-slate-50/80 transition-colors text-slate-600">
                              <td className="px-3 py-1 text-slate-400">I</td>
                              <td className="px-3 py-1">Sample Cost</td>
                              <td className="px-3 py-1 text-right font-mono">{fAmt(iSamp)}</td>
                              <td className="px-3 py-1 text-right font-mono">{pct(iSamp)}</td>
                            </tr>
                            
                            <tr className="border-b border-slate-200 bg-slate-100/60">
                              <td className="px-3 py-1.5 font-bold text-slate-400">J</td>
                              <td className="px-3 py-1.5 font-black text-slate-900 text-[9.5px]">Total Cost</td>
                              <td className="px-3 py-1.5 text-right font-mono font-black text-slate-900 text-[9.5px]">{fAmt(totalCost)}</td>
                              <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-900">{pct(totalCost)}</td>
                            </tr>
                            
                            <tr className={netProfit >= 0 ? "bg-emerald-50/60" : "bg-rose-50/60"}>
                              <td className="px-3 py-1.5 font-bold text-slate-400">K</td>
                              <td className={`px-3 py-1.5 font-black text-[10.5px] ${netProfit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>Net Profit</td>
                              <td className={`px-3 py-1.5 text-right font-mono font-black text-[10.5px] ${netProfit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{fAmt(netProfit)}</td>
                              <td className={`px-3 py-1.5 text-right font-mono font-bold ${netProfit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{pct(netProfit)}</td>
                            </tr>
                            
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

              </div>


              {/* Bottom Signature Blocks (3 Column Grid) */}
              <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] text-slate-500">
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/30 text-center flex flex-col justify-between min-h-[90px]">
                  <div className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider border-b pb-1 mb-1">Prepared By</div>
                  <div className="font-bold text-slate-800">Md. Ashikujjaman</div>
                  <div className="text-[8.5px] text-slate-500 font-semibold">Sr. Merchandiser</div>
                  <div className="text-[8px] font-mono mt-1 text-slate-400">19/11/2025 16:07:25</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/30 text-center flex flex-col justify-between min-h-[90px]">
                  <div className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider border-b pb-1 mb-1">Checked By Team Leader: Approved</div>
                  <div className="font-bold text-slate-800">Md. Sadekur Rahman</div>
                  <div className="text-[8.5px] text-slate-500 font-semibold">DGM</div>
                  <div className="text-[8px] font-mono mt-1 text-slate-400">02/12/2025 11:52:38</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/30 text-center flex flex-col justify-between min-h-[90px]">
                  <div className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider border-b pb-1 mb-1">Approved By HOD: Approved</div>
                  <div className="font-bold text-slate-800">Md. Sadekur Rahman</div>
                  <div className="text-[8.5px] text-slate-500 font-semibold">DGM</div>
                  <div className="text-[8px] font-mono mt-1 text-slate-400">06/12/2025 18:16:59</div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}
