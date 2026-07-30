import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Activity,
  Plus,
  Search,
  Download,
  Printer,
  FileSpreadsheet,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-sales-target-entry")({
  head: () => ({
    meta: [
      { title: "Sales Target Entry — RMG Merchandising" },
      { name: "description", content: "Monthly factory line efficiency calculations, machine capacities, and booking ledger." },
    ],
  }),
  component: SalesTargetEntryPage,
});

// Sales Target Row Detail
interface SalesTargetDetailRow {
  month: string;
  qtyPcs: number;
  amountUsd: number;
  minute: number;
  marginUsd: number;
  cmPct: number;
  rmPct: number;
  avgSmv: number;
  avgEffPct: number;
  mgtNotes: string;
}

interface SalesTarget {
  id: string;
  year: number;
  buyerName: string;
  details: SalesTargetDetailRow[];
}

const MONTHS_LIST = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const BUYERS_LIST = [
  "MANGO", "FATFACE", "JMC", "Next Sourcing", "RAGNO SPORTS", "H&M", "ZARA", "Gap", "Levis"
];

// Initial seed target records matching the screenshot
const INITIAL_TARGETS: SalesTarget[] = [
  {
    id: "target-1",
    year: 2025,
    buyerName: "MANGO",
    details: MONTHS_LIST.map(month => ({
      month,
      qtyPcs: 10.00,
      amountUsd: 10.00,
      minute: 10.00,
      marginUsd: 10.00,
      cmPct: 10.00,
      rmPct: 0.00,
      avgSmv: 0.00,
      avgEffPct: 0.00,
      mgtNotes: "",
    })),
  },
  {
    id: "target-2",
    year: 2026,
    buyerName: "ZARA",
    details: MONTHS_LIST.map(month => ({
      month,
      qtyPcs: 12.50,
      amountUsd: 15.00,
      minute: 11.20,
      marginUsd: 12.00,
      cmPct: 9.50,
      rmPct: 1.20,
      avgSmv: 5.40,
      avgEffPct: 75.00,
      mgtNotes: "Autumn delivery bookings",
    })),
  },
];

function SalesTargetEntryPage() {
  const [targets, setTargets] = useState<SalesTarget[]>(INITIAL_TARGETS);
  const [filterYear, setFilterYear] = useState<number>(2025);
  const [filterBuyer, setFilterBuyer] = useState<string>("MANGO");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [year, setYear] = useState(2025);
  const [buyerName, setBuyerName] = useState("MANGO");
  const [details, setDetails] = useState<SalesTargetDetailRow[]>([]);

  // Setup default details of 12 months when opening modal
  useEffect(() => {
    if (isModalOpen && !formId) {
      const rows = MONTHS_LIST.map(month => ({
        month,
        qtyPcs: 10.00,
        amountUsd: 10.00,
        minute: 10.00,
        marginUsd: 10.00,
        cmPct: 10.00,
        rmPct: 0.00,
        avgSmv: 0.00,
        avgEffPct: 0.00,
        mgtNotes: "",
      }));
      setDetails(rows);
    }
  }, [isModalOpen, formId]);

  // Handle single row input updates
  const handleRowChange = (index: number, field: keyof SalesTargetDetailRow, value: any) => {
    setDetails(prev => prev.map((row, i) => {
      if (i === index) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  // Run bulk fetch / setup targets for months
  const handleGetMonth = () => {
    const rows = MONTHS_LIST.map(month => ({
      month,
      qtyPcs: 10.00,
      amountUsd: 10.00,
      minute: 10.00,
      marginUsd: 10.00,
      cmPct: 10.00,
      rmPct: 0.00,
      avgSmv: 0.00,
      avgEffPct: 0.00,
      mgtNotes: "",
    }));
    setDetails(rows);
    toast.success(`Loaded 12-month ledger inputs for Year ${year} - Buyer: ${buyerName}`);
  };

  const handleEditTarget = (target: SalesTarget) => {
    setFormId(target.id);
    setYear(target.year);
    setBuyerName(target.buyerName);
    setDetails(target.details);
    setIsModalOpen(true);
  };

  const handleSaveTarget = () => {
    const payload: SalesTarget = {
      id: formId || `target-${Date.now()}`,
      year,
      buyerName,
      details,
    };

    if (formId) {
      setTargets(prev => prev.map(t => t.id === formId ? payload : t));
      toast.success("Sales Target updated successfully!");
    } else {
      setTargets(prev => [payload, ...prev]);
      toast.success("Sales Target saved successfully!");
    }
    setIsModalOpen(false);
    setFormId(null);
  };

  // Compute column totals for details grid
  const totals = useMemo(() => {
    let totalQty = 0;
    let totalAmount = 0;
    let totalMinute = 0;
    let totalMargin = 0;
    let totalSmv = 0;

    details.forEach(d => {
      totalQty += Number(d.qtyPcs) || 0;
      totalAmount += Number(d.amountUsd) || 0;
      totalMinute += Number(d.minute) || 0;
      totalMargin += Number(d.marginUsd) || 0;
      totalSmv += Number(d.avgSmv) || 0;
    });

    return { totalQty, totalAmount, totalMinute, totalMargin, totalSmv };
  }, [details]);

  const filteredTargets = useMemo(() => {
    return targets.filter(t => {
      const matchYear = t.year === filterYear;
      const matchBuyer = filterBuyer === "All" || filterBuyer === "" || t.buyerName === filterBuyer;
      const s = searchQuery.toLowerCase();
      const matchSearch = searchQuery === "" || t.buyerName.toLowerCase().includes(s);
      return matchYear && matchBuyer && matchSearch;
    });
  }, [targets, filterYear, filterBuyer, searchQuery]);

  return (
    <MerchandisingLayout
      activePath="sales-target-entry"
      breadcrumbs={[{ label: "Capacity" }, { label: "Sales Target Entry" }]}
      title="Sales Target Entry Ledger"
    >
      <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6 transition-colors duration-200">
        
        {/* Top Header & Search Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-3xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-black tracking-tight text-slate-955 dark:text-white uppercase flex items-center gap-2">
                <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Activity className="size-4.5" /></span>
                Sales Target Ledger
              </h2>
            </div>
            <button
              onClick={() => {
                setFormId(null);
                setYear(2025);
                setBuyerName("MANGO");
                setDetails([]);
                setIsModalOpen(true);
              }}
              className="h-9.5 px-4 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 hover:opacity-95 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="size-3.5" /> Add Sales Target
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">Year</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">Buyer</label>
              <select
                value={filterBuyer}
                onChange={(e) => setFilterBuyer(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Buyers</option>
                {BUYERS_LIST.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => toast.success("Filtered sales targets.")}
              className="h-9 px-5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-sm"
            >
              <Search size={14} /> Search
            </button>
          </div>
        </div>

        {/* Ledger Table Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-3xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center gap-1.5">
              <button onClick={() => toast.info("Excel...")} className="h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"><FileSpreadsheet className="size-3.5 text-emerald-500" /> EXCEL</button>
              <button onClick={() => toast.info("Print...")} className="h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"><Printer className="size-3.5 text-blue-500" /> PRINT</button>
              <button onClick={() => toast.info("PDF...")} className="h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"><Download className="size-3.5 text-rose-500" /> PDF</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400">Search:</span>
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="text-xs px-3 py-1.5 bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg w-48 focus:outline-none text-slate-800 dark:text-slate-200" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold text-left">
                  <th className="px-4 py-3.5 text-center w-12">SL</th>
                  <th className="px-4 py-3.5 text-center w-10"></th>
                  <th className="px-4 py-3 text-center w-36">Year</th>
                  <th className="px-4 py-3">Buyer Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredTargets.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350 font-bold border-b border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3.5 text-center text-slate-400 font-normal">{idx+1}</td>
                    <td className="px-2 py-3 text-center">
                      <button onClick={()=>handleEditTarget(t)} className="bg-transparent border-0 text-[#F39C12] hover:text-[#D35400] cursor-pointer flex items-center justify-center" title="Edit Target"><Edit2 size={13} /></button>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-900 dark:text-white font-extrabold">{t.year}</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-extrabold">{t.buyerName}</td>
                  </tr>
                ))}
                {filteredTargets.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-450 dark:text-slate-400 font-bold">No data available in table</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- SALES TARGET CREATE & EDIT MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-none">
            <div className="bg-[#F8F9F9] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-[96vw] max-h-[96vh] flex flex-col shadow-2xl overflow-hidden relative">
              
              {/* Modal Header */}
              <div className="absolute top-0 inset-x-0 h-[3.5px] bg-gradient-to-r from-teal-500 to-emerald-600" />
              <div className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase text-slate-950 dark:text-white tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-teal-500" />
                  {formId ? "Edit Sales Target Setup" : "Setup Sales Target Setup"}
                </h3>
                <button 
                  onClick={() => { setIsModalOpen(false); setFormId(null); }} 
                  className="size-7 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                
                {/* Top Side: Master Info */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs relative">
                  <h3 className="text-[12px] font-black uppercase text-blue-500 dark:text-blue-400 pb-2 border-b border-slate-100 dark:border-slate-850">
                    Sales Target Master
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end pt-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Year</label>
                      <select value={year} onChange={(e)=>setYear(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"><option value={2025}>2025</option><option value={2026}>2026</option></select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Buyer</label>
                      <select value={buyerName} onChange={(e)=>setBuyerName(e.target.value)} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none">{BUYERS_LIST.map(b=>(<option key={b} value={b}>{b}</option>))}</select>
                    </div>
                    <button onClick={handleGetMonth} className="h-9 px-5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-[10px] rounded-lg uppercase tracking-wider cursor-pointer shadow-sm">
                      GET MONTH
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSaveTarget} 
                        className="bg-[#27AE60] hover:bg-[#219653] text-white px-5 py-2.5 text-[10px] font-bold rounded-lg shadow-sm cursor-pointer uppercase tracking-wider shadow-emerald-500/20"
                      >
                        SAVE
                      </button>
                      <button 
                        onClick={() => { setIsModalOpen(false); setFormId(null); }} 
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2.5 text-[10px] font-bold rounded-lg cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Side: Details Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col min-h-[480px]">
                  <h3 className="text-[12px] font-black uppercase text-slate-950 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-850">
                    Sales Target Details
                  </h3>
                  
                  <div className="overflow-x-auto flex-1 mt-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <table className="w-full border-collapse text-xs text-left">
                      <thead>
                        <tr className="bg-[#FDF2E9] dark:bg-slate-950 border-b border-[#F5CBA7] dark:border-slate-800 text-[#A04000] dark:text-[#E59866] font-extrabold sticky top-0 z-10">
                          <th className="px-3 py-2.5 text-center w-12">SL</th>
                          <th className="px-3 py-2.5">Month *</th>
                          <th className="px-3 py-2.5">Quantity (Pcs) *</th>
                          <th className="px-3 py-2.5">Amount (USD) *</th>
                          <th className="px-3 py-2.5">Minute *</th>
                          <th className="px-3 py-2.5">Margin (USD) *</th>
                          <th className="px-3 py-2.5">CM (%)</th>
                          <th className="px-3 py-2.5">RM (%)</th>
                          <th className="px-3 py-2.5">Avg. SMV</th>
                          <th className="px-3 py-2.5">Avg. Eff (%)</th>
                          <th className="px-3 py-2.5">Mgt. Notes</th>
                          <th className="px-3 py-2.5 text-center">(Team)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350 font-bold border-b border-slate-100 dark:border-slate-800">
                            <td className="px-3 py-2.5 text-center text-slate-400 font-normal">{index + 1}</td>
                            <td className="px-3 py-2.5 text-slate-900 dark:text-white font-extrabold">{row.month}</td>
                            <td className="px-2 py-1.5">
                              <input
                                type="number"
                                value={row.qtyPcs || ""}
                                onChange={(e) => handleRowChange(index, "qtyPcs", Number(e.target.value))}
                                className="w-full text-xs font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <input
                                type="number"
                                value={row.amountUsd || ""}
                                onChange={(e) => handleRowChange(index, "amountUsd", Number(e.target.value))}
                                className="w-full text-xs font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <input
                                type="number"
                                value={row.minute || ""}
                                onChange={(e) => handleRowChange(index, "minute", Number(e.target.value))}
                                className="w-full text-xs font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <input
                                type="number"
                                value={row.marginUsd || ""}
                                onChange={(e) => handleRowChange(index, "marginUsd", Number(e.target.value))}
                                className="w-full text-xs font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <input
                                type="number"
                                value={row.cmPct || ""}
                                onChange={(e) => handleRowChange(index, "cmPct", Number(e.target.value))}
                                className="w-full text-xs font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <input
                                type="number"
                                value={row.rmPct || ""}
                                onChange={(e) => handleRowChange(index, "rmPct", Number(e.target.value))}
                                className="w-full text-xs font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <input
                                type="number"
                                step="0.01"
                                value={row.avgSmv || ""}
                                onChange={(e) => handleRowChange(index, "avgSmv", Number(e.target.value))}
                                className="w-full text-xs font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <input
                                type="number"
                                value={row.avgEffPct || ""}
                                onChange={(e) => handleRowChange(index, "avgEffPct", Number(e.target.value))}
                                className="w-full text-xs font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <input
                                type="text"
                                value={row.mgtNotes}
                                onChange={(e) => handleRowChange(index, "mgtNotes", e.target.value)}
                                className="w-full text-xs px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                              />
                            </td>
                            <td className="px-2 py-1.5 text-center">
                              <button
                                onClick={() => toast.info(`Action triggered for ${row.month}`)}
                                className="h-6.5 px-3 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-[9px] uppercase rounded cursor-pointer"
                              >
                                ACTION
                              </button>
                            </td>
                          </tr>
                        ))}

                        {/* Summary Row */}
                        <tr className="bg-slate-100/50 dark:bg-slate-950 font-black text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 sticky bottom-0">
                          <td className="px-3 py-3 text-center"></td>
                          <td className="px-3 py-3 font-extrabold uppercase text-right">Total</td>
                          <td className="px-2 py-3 font-mono">{totals.totalQty.toFixed(2)}</td>
                          <td className="px-2 py-3 font-mono">{totals.totalAmount.toFixed(2)}</td>
                          <td className="px-2 py-3 font-mono">{totals.totalMinute.toFixed(2)}</td>
                          <td className="px-2 py-3 font-mono">{totals.totalMargin.toFixed(2)}</td>
                          <td className="px-2 py-3"></td>
                          <td className="px-2 py-3"></td>
                          <td className="px-2 py-3 font-mono">{totals.totalSmv.toFixed(2)}</td>
                          <td className="px-2 py-3"></td>
                          <td className="px-2 py-3"></td>
                          <td className="px-2 py-3 text-center"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </MerchandisingLayout>
  );
}
