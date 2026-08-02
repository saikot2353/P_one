import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useMemo } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Search, Plus, Pencil, FileText, ArrowLeft, Save, Printer,
  Trash2, FileSpreadsheet, CheckCircle, Clock, AlertCircle, Info, Image as ImageIcon, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import defaultDressSketch from "../components/0330c3d6-5cae-49e0-b777-d34891afcc09.jpg";
import markerNestingImg from "../components/marker_nesting.png";
import styleOrderCardImg from "../components/style_order_card.png";

export const Route = createFileRoute("/merchandising-cad")({
  head: () => ({ meta: [{ title: "CAD Consumption Update — Pakiza Knit" }] }),
  component: CADConsumptionPage,
});

// ── Types ───────────────────────────────────────────────────────
interface CadItemRow {
  id: string;
  bodyPart: string;
  markerLength: string;
  diaFinish: string;
  diaCut: string;
  markerQty: string;
  gsm: string;
  finishCons: number;
  wasteCons: number;
  diaMake: string;
  remarks: string;
}

interface CadRecord {
  id: string;
  jobNo: string;
  styleNo: string;
  buyer: string;
  efficiency: string;
  sizeRange: string;
  fabrication: string;
  pieceWiseLabel: string;
  status: "Draft" | "Approved" | "Review";
  note: string;
  comments: string;
  receiver: string;
  preparedBy: string;
  checkedBy: string;
  approvedBy: string;
  rows: CadItemRow[];
}

// ── Default Row Template ────────────────────────────────────────
const createBlankRow = (idNumber: number): CadItemRow => ({
  id: `row-${idNumber}-${Date.now()}`,
  bodyPart: "",
  markerLength: "",
  diaFinish: "",
  diaCut: "",
  markerQty: "",
  gsm: "",
  finishCons: 0,
  wasteCons: 0,
  diaMake: "OPEN",
  remarks: "",
});

// ── Initial Mock Database ───────────────────────────────────────
const INITIAL_CADS: CadRecord[] = [
  {
    id: "CAD-001",
    jobNo: "JOB-12288",
    styleNo: "271TSHT215-6084",
    buyer: "OVS",
    efficiency: "85%",
    sizeRange: "XS TO XL",
    fabrication: "100% CTN 200 GSM",
    pieceWiseLabel: "12 piece wise All consumption making",
    status: "Approved",
    note: "without wash.",
    comments: "SOLID ONE BODY ONE WAY CUTTING.",
    receiver: "Md. Al Amin",
    preparedBy: "Md. Ashikujjaman (CAD Engineer)",
    checkedBy: "Md. Sadekur Rahman (DGM)",
    approvedBy: "Md. Sadekur Rahman (DGM)",
    rows: [
      {
        id: "r1",
        bodyPart: "BODY BK+FR",
        markerLength: "107.00",
        diaFinish: "76.00",
        diaCut: "74.00",
        markerQty: "6",
        gsm: "200",
        finishCons: 2.099,
        wasteCons: 2.308,
        diaMake: "OPEN",
        remarks: "",
      },
      {
        id: "r2",
        bodyPart: "NECK PIPING",
        markerLength: "0.00",
        diaFinish: "TUBE",
        diaCut: "TUBE",
        markerQty: "12",
        gsm: "200",
        finishCons: 0.180,
        wasteCons: 0.198,
        diaMake: "TUBE",
        remarks: "100% TUBE 38\"",
      },
      {
        id: "r3",
        bodyPart: "BACK TAPE",
        markerLength: "0.00",
        diaFinish: "TUBE",
        diaCut: "TUBE",
        markerQty: "12",
        gsm: "200",
        finishCons: 0.040,
        wasteCons: 0.044,
        diaMake: "TUBE",
        remarks: "100% TUBE 38\"",
      },
      {
        id: "r4",
        bodyPart: "",
        markerLength: "",
        diaFinish: "",
        diaCut: "-2.00",
        markerQty: "",
        gsm: "",
        finishCons: 0,
        wasteCons: 0,
        diaMake: "",
        remarks: "",
      },
      {
        id: "r5",
        bodyPart: "",
        markerLength: "",
        diaFinish: "",
        diaCut: "-2.00",
        markerQty: "",
        gsm: "",
        finishCons: 0,
        wasteCons: 0,
        diaMake: "",
        remarks: "",
      }
    ]
  },
  {
    id: "CAD-002",
    jobNo: "JOB-12290",
    styleNo: "SS27-POLO-88",
    buyer: "PEPCO",
    efficiency: "82%",
    sizeRange: "S TO XXL",
    fabrication: "95% Cotton 5% Elastane 220 GSM",
    pieceWiseLabel: "12 piece wise All consumption making",
    status: "Draft",
    note: "Pre-wash shrinkage included.",
    comments: "COLLAR ONE WAY CUTTING, SLEEVE TWO WAY.",
    receiver: "Md. Rashedul Islam",
    preparedBy: "Md. Ashikujjaman (CAD Engineer)",
    checkedBy: "Md. Sadekur Rahman (DGM)",
    approvedBy: "Md. Sadekur Rahman (DGM)",
    rows: [
      {
        id: "r2-1",
        bodyPart: "FRONT+BACK PANEL",
        markerLength: "112.50",
        diaFinish: "72.00",
        diaCut: "70.00",
        markerQty: "4",
        gsm: "220",
        finishCons: 2.890,
        wasteCons: 3.179,
        diaMake: "OPEN",
        remarks: "Open width setup",
      },
      {
        id: "r2-2",
        bodyPart: "SLEEVES",
        markerLength: "45.00",
        diaFinish: "72.00",
        diaCut: "70.00",
        markerQty: "8",
        gsm: "220",
        finishCons: 0.578,
        wasteCons: 0.636,
        diaMake: "OPEN",
        remarks: "",
      }
    ]
  }
];

function CADConsumptionPage() {
  const [view, setView] = useState<"list" | "form" | "sheet">("list");
  const [database, setDatabase] = useState<CadRecord[]>(INITIAL_CADS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Approved" | "Draft" | "Review">("All");

  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CadRecord>({
    id: "",
    jobNo: "",
    styleNo: "",
    buyer: "",
    efficiency: "85%",
    sizeRange: "XS TO XL",
    fabrication: "",
    pieceWiseLabel: "12 piece wise All consumption making",
    status: "Draft",
    note: "without wash.",
    comments: "",
    receiver: "",
    preparedBy: "Md. Ashikujjaman (CAD Engineer)",
    checkedBy: "Md. Sadekur Rahman (DGM)",
    approvedBy: "Md. Sadekur Rahman (DGM)",
    rows: [createBlankRow(1)]
  });

  // Calculate Totals
  const totals = useMemo(() => {
    const finish = form.rows.reduce((sum, r) => sum + (Number(r.finishCons) || 0), 0);
    const waste = form.rows.reduce((sum, r) => sum + (Number(r.wasteCons) || 0), 0);
    return {
      finish: Number(finish.toFixed(3)),
      waste: Number(waste.toFixed(3))
    };
  }, [form.rows]);

  // Formula: Cons = (Length * Cut DIA * GSM * 12) / (Qty * 1508800)
  const calculateRowCons = (
    length: string,
    cutDia: string,
    qty: string,
    gsm: string
  ): { finish: number; waste: number } => {
    const L = parseFloat(length);
    const W = parseFloat(cutDia);
    const Q = parseFloat(qty);
    const G = parseFloat(gsm);

    if (isNaN(L) || isNaN(W) || isNaN(Q) || isNaN(G) || L <= 0 || W <= 0 || Q <= 0 || G <= 0) {
      return { finish: 0, waste: 0 };
    }

    const finish = (L * W * G * 12) / (Q * 1508800);
    const waste = finish * 1.10; // +10% waste

    return {
      finish: Number(finish.toFixed(3)),
      waste: Number(waste.toFixed(3))
    };
  };

  const handleRowChange = (rowId: string, field: keyof CadItemRow, val: any) => {
    setForm(prev => {
      const updatedRows = prev.rows.map(r => {
        if (r.id !== rowId) return r;
        const updated = { ...r, [field]: val };

        if (["markerLength", "diaCut", "markerQty", "gsm"].includes(field)) {
          const calculated = calculateRowCons(
            updated.markerLength,
            updated.diaCut,
            updated.markerQty,
            updated.gsm
          );
          if (calculated.finish > 0) {
            updated.finishCons = calculated.finish;
            updated.wasteCons = calculated.waste;
          }
        } else if (field === "finishCons") {
          updated.wasteCons = Number((Number(val) * 1.10).toFixed(3));
        }

        return updated;
      });
      return { ...prev, rows: updatedRows };
    });
  };

  const addRow = () => {
    setForm(prev => ({
      ...prev,
      rows: [...prev.rows, createBlankRow(prev.rows.length + 1)]
    }));
  };

  const deleteRow = (rowId: string) => {
    setForm(prev => {
      const filtered = prev.rows.filter(r => r.id !== rowId);
      return {
        ...prev,
        rows: filtered.length > 0 ? filtered : [createBlankRow(1)]
      };
    });
  };

  const openNew = () => {
    setEditId(null);
    setForm({
      id: `CAD-${Date.now()}`,
      jobNo: `JOB-${Math.floor(10000 + Math.random() * 9000)}`,
      styleNo: "",
      buyer: "",
      efficiency: "85%",
      sizeRange: "XS TO XL",
      fabrication: "",
      pieceWiseLabel: "12 piece wise All consumption making",
      status: "Draft",
      note: "without wash.",
      comments: "SOLID ONE BODY ONE WAY CUTTING.",
      receiver: "Md. Al Amin",
      preparedBy: "Md. Ashikujjaman (CAD Engineer)",
      checkedBy: "Md. Sadekur Rahman (DGM)",
      approvedBy: "Md. Sadekur Rahman (DGM)",
      rows: [
        { ...createBlankRow(1), bodyPart: "BODY BK+FR", markerLength: "107.00", diaFinish: "76.00", diaCut: "74.00", markerQty: "6", gsm: "200", finishCons: 2.099, wasteCons: 2.308, diaMake: "OPEN" },
        { ...createBlankRow(2), bodyPart: "NECK PIPING", markerLength: "0.00", diaFinish: "TUBE", diaCut: "TUBE", markerQty: "12", gsm: "200", finishCons: 0.180, wasteCons: 0.198, diaMake: "TUBE", remarks: "100% TUBE 38\"" },
        { ...createBlankRow(3), bodyPart: "BACK TAPE", markerLength: "0.00", diaFinish: "TUBE", diaCut: "TUBE", markerQty: "12", gsm: "200", finishCons: 0.040, wasteCons: 0.044, diaMake: "TUBE", remarks: "100% TUBE 38\"" },
        { ...createBlankRow(4), bodyPart: "", markerLength: "", diaFinish: "", diaCut: "-2.00", markerQty: "", gsm: "", finishCons: 0, wasteCons: 0, diaMake: "", remarks: "" },
        { ...createBlankRow(5), bodyPart: "", markerLength: "", diaFinish: "", diaCut: "-2.00", markerQty: "", gsm: "", finishCons: 0, wasteCons: 0, diaMake: "", remarks: "" }
      ]
    });
    setView("form");
  };

  const openEdit = (record: CadRecord) => {
    setEditId(record.id);
    setForm(JSON.parse(JSON.stringify(record)));
    setView("form");
  };

  const openSheet = (record: CadRecord) => {
    setForm(JSON.parse(JSON.stringify(record)));
    setView("sheet");
  };

  const save = () => {
    if (!form.styleNo.trim()) {
      toast.error("Style/Order is required.");
      return;
    }
    if (!form.buyer.trim()) {
      toast.error("Buyer is required.");
      return;
    }
    if (!form.jobNo.trim()) {
      toast.error("Job No is required.");
      return;
    }

    if (editId) {
      setDatabase(prev => prev.map(item => item.id === editId ? form : item));
      toast.success("CAD Consumption Record Updated!");
    } else {
      setDatabase(prev => [form, ...prev]);
      toast.success("New CAD Consumption Record Saved!");
    }
    setView("list");
  };

  const filteredRecords = database.filter(item => {
    const term = search.toLowerCase();
    const matchesSearch =
      item.styleNo.toLowerCase().includes(term) ||
      item.buyer.toLowerCase().includes(term) ||
      item.jobNo.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <MerchandisingLayout
      activePath="order-management"
      breadcrumbs={[{ label: "CAD Consumption Update" }]}
      title="CAD Consumption Update"
    >
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors">
        
        {/* ── 1. LIST VIEW ── */}
        {view === "list" && (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <FileSpreadsheet className="text-teal-600 size-6" />
                  CAD Consumption Registry
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Manage and calculate fabric marker consumption for buying style cost sheets
                </p>
              </div>
              <button
                onClick={openNew}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs hover:-translate-y-0.5 transition-all"
              >
                <Plus className="size-4" /> Add New CAD Consumption
              </button>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-4 justify-between transition-colors">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Style, Buyer, Job..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-850 text-slate-800 dark:text-slate-100 transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-400 tracking-wider">Status:</span>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  {(["All", "Approved", "Draft", "Review"] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`text-[10px] font-black px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
                        statusFilter === status
                          ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs font-bold"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table Registry */}
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-5 py-3">JOB NO</th>
                    <th className="px-5 py-3">STYLE / ORDER</th>
                    <th className="px-5 py-3">BUYER</th>
                    <th className="px-5 py-3">SIZE RANGE</th>
                    <th className="px-5 py-3">FABRICATION</th>
                    <th className="px-5 py-3 text-right">TOTAL FINISH (KG)</th>
                    <th className="px-5 py-3 text-right">TOTAL WASTE (KG)</th>
                    <th className="px-5 py-3 text-center">STATUS</th>
                    <th className="px-5 py-3 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px] text-slate-700 dark:text-slate-350">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-10 font-bold text-slate-400 dark:text-slate-550">
                        No CAD consumption records found.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map(item => {
                      const recTotals = item.rows.reduce(
                        (acc, r) => ({
                          finish: acc.finish + (r.finishCons || 0),
                          waste: acc.waste + (r.wasteCons || 0)
                        }),
                        { finish: 0, waste: 0 }
                      );

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-205">{item.jobNo}</td>
                          <td className="px-5 py-3.5 font-black text-teal-650 dark:text-teal-455">{item.styleNo}</td>
                          <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-slate-100">{item.buyer}</td>
                          <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-semibold">{item.sizeRange}</td>
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-450 truncate max-w-xs">{item.fabrication}</td>
                          <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-800 dark:text-slate-205">
                            {recTotals.finish.toFixed(3)}
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-855 dark:text-slate-300">
                            {recTotals.waste.toFixed(3)}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                item.status === "Approved"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30"
                                  : item.status === "Review"
                                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-450 border border-amber-100/50 dark:border-amber-900/30"
                                  : "bg-slate-100 dark:bg-slate-850 text-slate-705 dark:text-slate-300"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openSheet(item)}
                                title="View details sheet"
                                className="p-1.5 text-slate-500 hover:text-teal-650 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                              >
                                <FileText className="size-4" />
                              </button>
                              <button
                                onClick={() => openEdit(item)}
                                title="Edit CAD formula"
                                className="p-1.5 text-slate-500 hover:text-amber-650 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                              >
                                <Pencil className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 2. STANDARD ENTRY & EDIT FORM ── */}
        {view === "form" && (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            
            {/* Header controls toolbar */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div>
                <button
                  onClick={() => setView("list")}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition mb-1"
                >
                  <ArrowLeft className="size-4" /> Back to Registry
                </button>
                <h1 className="text-base font-black text-slate-900 dark:text-white">
                  {editId ? `Edit CAD Consumption [${form.styleNo}]` : "New CAD Consumption Formula"}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("list")}
                  className="px-4.5 py-2 rounded-lg text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Save className="size-3.5" /> Save Formula
                </button>
              </div>
            </div>

            {/* Structured Info Card (Standard Fields UI) */}
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-150 dark:border-slate-800">
                <span className="w-1 h-3.5 rounded-full bg-teal-500 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Basic Parameters</span>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Style / Order *</label>
                  <input
                    type="text"
                    value={form.styleNo}
                    onChange={e => setForm({ ...form, styleNo: e.target.value })}
                    placeholder="e.g. 271TSHT215-6084"
                    className="w-full text-xs px-3 py-2 border border-slate-250 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Buyer *</label>
                  <input
                    type="text"
                    value={form.buyer}
                    onChange={e => setForm({ ...form, buyer: e.target.value })}
                    placeholder="e.g. OVS"
                    className="w-full text-xs px-3 py-2 border border-slate-250 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Job No *</label>
                  <input
                    type="text"
                    value={form.jobNo}
                    onChange={e => setForm({ ...form, jobNo: e.target.value })}
                    placeholder="e.g. JOB-12288"
                    className="w-full text-xs px-3 py-2 border border-slate-250 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Efficiency</label>
                  <input
                    type="text"
                    value={form.efficiency}
                    onChange={e => setForm({ ...form, efficiency: e.target.value })}
                    placeholder="e.g. 85%"
                    className="w-full text-xs px-3 py-2 border border-slate-250 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Size Range</label>
                  <input
                    type="text"
                    value={form.sizeRange}
                    onChange={e => setForm({ ...form, sizeRange: e.target.value })}
                    placeholder="e.g. XS TO XL"
                    className="w-full text-xs px-3 py-2 border border-slate-250 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Fabrication</label>
                  <input
                    type="text"
                    value={form.fabrication}
                    onChange={e => setForm({ ...form, fabrication: e.target.value })}
                    placeholder="e.g. 100% CTN 200 GSM"
                    className="w-full text-xs px-3 py-2 border border-slate-250 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Piece-wise Label</label>
                  <input
                    type="text"
                    value={form.pieceWiseLabel}
                    onChange={e => setForm({ ...form, pieceWiseLabel: e.target.value })}
                    placeholder="12 piece wise All consumption making"
                    className="w-full text-xs px-3 py-2 border border-slate-250 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-250 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold transition-all"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Approved">Approved</option>
                    <option value="Review">Review</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Formula Table Card (Professional Structured Inputs) */}
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
              <div className="flex justify-between items-center px-4 py-3 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-150 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 rounded-full bg-teal-500 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Consumption Calculation Grid</span>
                </div>
                <button
                  type="button"
                  onClick={addRow}
                  className="bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900 text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all border border-teal-200/50 dark:border-teal-900/50"
                >
                  <Plus className="size-3" /> Add Part Row
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[1100px]">
                  <thead>
                    {/* Double row header structure matching ERP standards */}
                    <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[9px] uppercase tracking-wider">
                      <th rowSpan={2} className="px-3 py-2 w-48 border-r border-slate-200 dark:border-slate-800">Name of body parts</th>
                      <th className="px-2 py-1 text-center border-r border-slate-200 dark:border-slate-800 w-28">Marker</th>
                      <th className="px-2 py-1 text-center border-r border-slate-200 dark:border-slate-800 w-28">DIA</th>
                      <th className="px-2 py-1 text-center border-r border-slate-200 dark:border-slate-800 w-28">DIA</th>
                      <th className="px-2 py-1 text-center border-r border-slate-200 dark:border-slate-800 w-24">Marker</th>
                      <th className="px-2 py-1 text-center border-r border-slate-200 dark:border-slate-800 w-24">Fabric</th>
                      <th className="px-3 py-2 text-right border-r border-slate-200 dark:border-slate-800 w-32">Finish/KG</th>
                      <th className="px-3 py-2 text-right border-r border-slate-200 dark:border-slate-800 w-32">Waste+10%/KG</th>
                      <th className="px-3 py-2 text-left border-r border-slate-200 dark:border-slate-800 w-28">DIA</th>
                      <th rowSpan={2} className="px-3 py-2">Remarks</th>
                      <th rowSpan={2} className="px-2 py-2 w-16 text-center border-l border-slate-200 dark:border-slate-800"></th>
                    </tr>
                    <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-750 text-slate-500 dark:text-slate-450 text-[8.5px] font-black uppercase tracking-wider">
                      <th className="px-2 py-1 text-center border-r border-slate-200 dark:border-slate-800">Length</th>
                      <th className="px-2 py-1 text-center border-r border-slate-200 dark:border-slate-800">Finish</th>
                      <th className="px-2 py-1 text-center border-r border-slate-200 dark:border-slate-800">Cut</th>
                      <th className="px-2 py-1 text-center border-r border-slate-200 dark:border-slate-800">QTY</th>
                      <th className="px-2 py-1 text-center border-r border-slate-200 dark:border-slate-800">GSM</th>
                      <th className="px-3 py-1 text-right border-r border-slate-200 dark:border-slate-800">Consumption</th>
                      <th className="px-3 py-1 text-right border-r border-slate-200 dark:border-slate-800">Consumption</th>
                      <th className="px-3 py-1 text-left border-r border-slate-200 dark:border-slate-800">make</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                    {form.rows.map((row, index) => (
                      <tr key={row.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
                        <td className="px-2 py-1.5 border-r border-slate-200 dark:border-slate-800">
                          <input
                            type="text"
                            value={row.bodyPart}
                            onChange={e => handleRowChange(row.id, "bodyPart", e.target.value)}
                            placeholder="BODY BK+FR"
                            className="w-full text-xs px-2 py-1 border border-slate-250 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-105 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1.5 border-r border-slate-200 dark:border-slate-800">
                          <input
                            type="text"
                            value={row.markerLength}
                            onChange={e => handleRowChange(row.id, "markerLength", e.target.value)}
                            placeholder="107.00"
                            className="w-full text-xs text-right font-mono px-2 py-1 border border-slate-250 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-105 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1.5 border-r border-slate-200 dark:border-slate-800">
                          <input
                            type="text"
                            value={row.diaFinish}
                            onChange={e => handleRowChange(row.id, "diaFinish", e.target.value)}
                            placeholder="76.00"
                            className="w-full text-xs px-2 py-1 border border-slate-250 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-105 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1.5 border-r border-slate-200 dark:border-slate-800">
                          <input
                            type="text"
                            value={row.diaCut}
                            onChange={e => handleRowChange(row.id, "diaCut", e.target.value)}
                            placeholder="74.00"
                            className="w-full text-xs px-2 py-1 border border-slate-250 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-105 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1.5 border-r border-slate-200 dark:border-slate-800">
                          <input
                            type="text"
                            value={row.markerQty}
                            onChange={e => handleRowChange(row.id, "markerQty", e.target.value)}
                            placeholder="6"
                            className="w-full text-xs text-right font-mono px-2 py-1 border border-slate-250 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-105 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1.5 border-r border-slate-200 dark:border-slate-800">
                          <input
                            type="text"
                            value={row.gsm}
                            onChange={e => handleRowChange(row.id, "gsm", e.target.value)}
                            placeholder="200"
                            className="w-full text-xs text-right font-mono px-2 py-1 border border-slate-250 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-105 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1.5 border-r border-slate-200 dark:border-slate-800">
                          <input
                            type="number"
                            step="any"
                            value={row.finishCons || ""}
                            onChange={e => handleRowChange(row.id, "finishCons", Number(e.target.value))}
                            placeholder="2.099"
                            className="w-full text-xs text-right font-mono font-bold px-2 py-1 border border-slate-250 dark:border-slate-700 rounded bg-teal-50/10 dark:bg-teal-900/10 text-teal-700 dark:text-teal-400 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-3 py-1.5 border-r border-slate-200 dark:border-slate-800 text-right font-mono font-bold text-slate-800 dark:text-slate-350 bg-slate-50 dark:bg-slate-900 select-none">
                          {row.wasteCons > 0 ? row.wasteCons.toFixed(3) : "0.000"}
                        </td>
                        <td className="px-2 py-1.5 border-r border-slate-200 dark:border-slate-800">
                          <input
                            type="text"
                            value={row.diaMake}
                            onChange={e => handleRowChange(row.id, "diaMake", e.target.value)}
                            placeholder="OPEN"
                            className="w-full text-xs px-2 py-1 border border-slate-250 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-105 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="text"
                            value={row.remarks}
                            onChange={e => handleRowChange(row.id, "remarks", e.target.value)}
                            placeholder="Remarks"
                            className="w-full text-xs px-2 py-1 border border-slate-250 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-105 focus:ring-1 focus:ring-teal-500 focus:outline-none placeholder-slate-300"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-center border-l border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => deleteRow(row.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Totals row */}
                    <tr className="bg-slate-50 dark:bg-slate-900/60 font-black text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800">
                      <td colSpan={6} className="px-4 py-3 text-right uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
                        Finish Consumption Total (Kgs)
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-xs text-teal-700 dark:text-teal-400 border-r border-slate-200 dark:border-slate-800 font-black">
                        {totals.finish.toFixed(3)}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-xs text-slate-850 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 font-black">
                        {totals.waste.toFixed(3)}
                      </td>
                      <td colSpan={3} className="px-4 py-3 text-slate-500 dark:text-slate-400 text-[10px] font-bold">
                        Kgs Total
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Note & Remarks Card */}
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Note (e.g. without wash.)</label>
                <input
                  type="text"
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  placeholder="without wash."
                  className="w-full text-xs px-3 py-2 border border-slate-250 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Comments (e.g. SOLID ONE BODY ONE WAY CUTTING.)</label>
                <input
                  type="text"
                  value={form.comments}
                  onChange={e => setForm({ ...form, comments: e.target.value })}
                  placeholder="SOLID ONE BODY ONE WAY CUTTING."
                  className="w-full text-xs px-3 py-2 border border-slate-250 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold transition-all"
                />
              </div>
            </div>

            {/* Signature names card */}
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-150 dark:border-slate-800">
                <span className="w-1 h-3.5 rounded-full bg-teal-500 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Signatures / Approvals</span>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Receiver Name</label>
                  <input
                    type="text"
                    value={form.receiver}
                    onChange={e => setForm({ ...form, receiver: e.target.value })}
                    placeholder="Name of receiver"
                    className="w-full text-xs px-3 py-2 border border-slate-255 dark:border-slate-700 rounded-lg focus:outline-none bg-white dark:bg-slate-900 text-slate-805"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Prepared By</label>
                  <input
                    type="text"
                    value={form.preparedBy}
                    onChange={e => setForm({ ...form, preparedBy: e.target.value })}
                    placeholder="CAD Engineer name"
                    className="w-full text-xs px-3 py-2 border border-slate-255 dark:border-slate-700 rounded-lg focus:outline-none bg-white dark:bg-slate-900 text-slate-805"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Checked By</label>
                  <input
                    type="text"
                    value={form.checkedBy}
                    onChange={e => setForm({ ...form, checkedBy: e.target.value })}
                    placeholder="Team leader or DGM name"
                    className="w-full text-xs px-3 py-2 border border-slate-255 dark:border-slate-700 rounded-lg focus:outline-none bg-white dark:bg-slate-900 text-slate-805"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1">Approved By</label>
                  <input
                    type="text"
                    value={form.approvedBy}
                    onChange={e => setForm({ ...form, approvedBy: e.target.value })}
                    placeholder="Approved by HOD name"
                    className="w-full text-xs px-3 py-2 border border-slate-255 dark:border-slate-700 rounded-lg focus:outline-none bg-white dark:bg-slate-900 text-slate-805"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── 3. PRINT DETAILS SHEET (Clean High-Fidelity Formal Layout) ── */}
        {view === "sheet" && (
          <div className="p-4 md:p-8 max-w-[1500px] mx-auto pb-24 space-y-4 print:p-0">
            {/* Header control buttons */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200 dark:border-slate-850 print:hidden shadow-xs transition-colors">
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition"
              >
                <ArrowLeft className="size-4" /> Back to Registry
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                >
                  <Printer className="size-3.5" /> Print CAD Sheet
                </button>
                <button
                  onClick={() => setView("form")}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer transition"
                >
                  Edit CAD Formula
                </button>
              </div>
            </div>

            {/* Document sheet report container */}
            <div className="bg-white dark:bg-slate-850 border border-slate-350 dark:border-slate-800 shadow-md p-6 md:p-8 space-y-6 text-[10px] text-slate-800 dark:text-slate-200 leading-relaxed max-w-full mx-auto print:border-none print:shadow-none print:p-0 transition-colors">
              
              {/* Header Title Block */}
              <div className="border border-slate-300 dark:border-slate-750 rounded-lg overflow-hidden relative">
                {/* Pakiza Logo Text */}
                <div className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-300 dark:border-slate-750 py-3 text-center transition-colors">
                  <span className="text-lg font-black tracking-widest text-[#a12b2b] dark:text-[#c94949] uppercase font-sans">PAKIZA</span>
                  <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block leading-none">Knit Composite Ltd.</span>
                </div>
              </div>

              {/* Style Information Grid Table (matching the screenshot header exactly) */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-305 min-w-[700px]">
                  <tbody>
                    <tr className="border-b border-slate-300 dark:border-slate-700">
                      <td className="w-1/6 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-2 font-bold border-r border-slate-300 dark:border-slate-700 uppercase tracking-tight text-slate-500 dark:text-slate-400">Style/Order:</td>
                      <td className="w-1/6 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-2 font-bold border-r border-slate-300 dark:border-slate-700 uppercase tracking-tight text-slate-500 dark:text-slate-400">Buyer:</td>
                      <td className="w-1/6 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-2 font-bold border-r border-slate-300 dark:border-slate-700 uppercase tracking-tight text-slate-500 dark:text-slate-400">Efficiency</td>
                      <td className="w-1/4 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-2 font-bold border-r border-slate-300 dark:border-slate-700 uppercase tracking-tight text-slate-500 dark:text-slate-400 text-center">Size range:</td>
                      <td className="w-1/4 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-2 font-bold border-r border-slate-300 dark:border-slate-700 uppercase tracking-tight text-slate-500 dark:text-slate-400">Fabrication:</td>
                      <td className="w-1/12 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-2 font-bold uppercase tracking-tight text-slate-500 dark:text-slate-400">JOB:</td>
                    </tr>
                    <tr className="font-semibold text-slate-900 dark:text-white">
                      <td className="px-2.5 py-2 border-r border-slate-300 dark:border-slate-700 text-indigo-900 dark:text-indigo-400 font-black">{form.styleNo || "—"}</td>
                      <td className="px-2.5 py-2 border-r border-slate-300 dark:border-slate-700 font-bold">{form.buyer || "—"}</td>
                      <td className="px-2.5 py-2 border-r border-slate-300 dark:border-slate-700 font-mono">{form.efficiency || "—"}</td>
                      <td className="px-2.5 py-2 border-r border-slate-300 dark:border-slate-700 text-center font-bold">{form.sizeRange || "—"}</td>
                      <td className="px-2.5 py-2 border-r border-slate-300 dark:border-slate-700">{form.fabrication || "—"}</td>
                      <td className="px-2.5 py-2 font-bold text-slate-800 dark:text-slate-205">{form.jobNo || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Marker description label */}
              <div className="text-center font-bold border-b border-slate-200 dark:border-slate-800 pb-2 text-[9px] text-slate-500 dark:text-slate-400 italic select-none">
                {form.pieceWiseLabel || "12 piece wise All consumption making"}
              </div>

              {/* Main Parts Grid Table (matching screenshot columns) */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-305 min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 text-slate-650 dark:text-slate-400 font-bold text-[9px] uppercase tracking-tight">
                      <th rowSpan={2} className="px-2.5 py-1.5 text-left border-r border-slate-300 dark:border-slate-700">Name of body parts</th>
                      <th className="px-2 py-1 text-center border-r border-slate-300 dark:border-slate-700 w-28">Marker</th>
                      <th className="px-2 py-1 text-center border-r border-slate-300 dark:border-slate-700 w-28">DIA</th>
                      <th className="px-2 py-1 text-center border-r border-slate-300 dark:border-slate-700 w-28">DIA</th>
                      <th className="px-2 py-1 text-center border-r border-slate-300 dark:border-slate-700 w-24">Marker</th>
                      <th className="px-2 py-1 text-center border-r border-slate-300 dark:border-slate-700 w-24">Fabric</th>
                      <th className="px-2.5 py-1.5 text-right border-r border-slate-300 dark:border-slate-700 w-32">Finish/KG</th>
                      <th className="px-2.5 py-1.5 text-right border-r border-slate-300 dark:border-slate-700 w-32">Waste+10%/KG</th>
                      <th className="px-2.5 py-1.5 text-left border-r border-slate-300 dark:border-slate-700 w-28">DIA</th>
                      <th rowSpan={2} className="px-2.5 py-1.5 text-left">Remarks</th>
                    </tr>
                    <tr className="bg-slate-55 dark:bg-slate-900 border-b border-slate-350 dark:border-slate-750 text-slate-550 dark:text-slate-450 text-[8.5px] font-bold uppercase tracking-wider">
                      <th className="px-2 py-1 text-center border-r border-slate-300 dark:border-slate-700">Length</th>
                      <th className="px-2 py-1 text-center border-r border-slate-300 dark:border-slate-700">Finish</th>
                      <th className="px-2 py-1 text-center border-r border-slate-300 dark:border-slate-700">Cut</th>
                      <th className="px-2 py-1 text-center border-r border-slate-300 dark:border-slate-700">QTY</th>
                      <th className="px-2 py-1 text-center border-r border-slate-300 dark:border-slate-700">GSM</th>
                      <th className="px-2.5 py-1 text-right border-r border-slate-300 dark:border-slate-700">Consumption</th>
                      <th className="px-2.5 py-1 text-right border-r border-slate-300 dark:border-slate-700">Consumption</th>
                      <th className="px-2.5 py-1 text-left border-r border-slate-300 dark:border-slate-700">make</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.rows.map((row, idx) => (
                      <tr key={row.id} className="border-b border-slate-250 dark:border-slate-750 font-medium text-slate-800 dark:text-slate-205">
                        <td className="px-2.5 py-2 font-bold border-r border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white bg-slate-50/30 dark:bg-slate-900/10">
                          {row.bodyPart || "—"}
                        </td>
                        <td className="px-2 py-2 text-center border-r border-slate-300 dark:border-slate-700 font-mono">
                          {row.markerLength || "—"}
                        </td>
                        <td className="px-2 py-2 text-center border-r border-slate-300 dark:border-slate-700 font-semibold">
                          {row.diaFinish || "—"}
                        </td>
                        <td className={`px-2 py-2 text-center border-r border-slate-300 dark:border-slate-700 font-semibold ${row.diaCut.startsWith("-") ? "text-rose-600 dark:text-rose-400 font-bold" : ""}`}>
                          {row.diaCut || "—"}
                        </td>
                        <td className="px-2 py-2 text-center border-r border-slate-300 dark:border-slate-700 font-mono">
                          {row.markerQty || "—"}
                        </td>
                        <td className="px-2 py-2 text-center border-r border-slate-300 dark:border-slate-700 font-mono">
                          {row.gsm || "—"}
                        </td>
                        <td className="px-2.5 py-2 text-right border-r border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white">
                          {row.finishCons > 0 ? row.finishCons.toFixed(3) : "0.000"}
                        </td>
                        <td className="px-2.5 py-2 text-right border-r border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-850 dark:text-slate-300">
                          {row.wasteCons > 0 ? row.wasteCons.toFixed(3) : "0.000"}
                        </td>
                        <td className="px-2.5 py-2 border-r border-slate-300 dark:border-slate-700 font-bold uppercase text-[8.5px]">
                          {row.diaMake || "—"}
                        </td>
                        <td className="px-2.5 py-2 text-slate-500 dark:text-slate-455 font-semibold italic text-[9px]">
                          {row.remarks || "—"}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Note row matching screenshot */}
                    <tr className="border-b border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                      <td colSpan={6} className="px-2.5 py-2 font-bold text-slate-650 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">
                        Note: {form.note}
                      </td>
                      <td className="px-2.5 py-2 text-right font-bold text-slate-500 dark:text-slate-455 border-r border-slate-300 dark:border-slate-700 uppercase">
                        Finish
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono font-black text-teal-700 dark:text-teal-400 border-r border-slate-300 dark:border-slate-700">
                        {totals.finish.toFixed(3)}
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono font-black text-slate-900 dark:text-slate-100 border-r border-slate-300 dark:border-slate-700">
                        {totals.waste.toFixed(3)}
                      </td>
                      <td className="px-2.5 py-2 font-bold text-slate-500 dark:text-slate-455 uppercase">
                        Kgs
                      </td>
                    </tr>

                    {/* Comments row matching screenshot */}
                    <tr className="bg-slate-50/20 dark:bg-slate-900/5 font-black">
                      <td colSpan={10} className="px-2.5 py-2.5 uppercase tracking-wide text-indigo-900 dark:text-indigo-400 border-t border-slate-300 dark:border-slate-700">
                        Comments: {form.comments}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Signature and Diagram Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch pt-6 border-t border-slate-300 dark:border-slate-700">
                
                {/* 1. Receiver Sign with Marker Nesting layout preview */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30 text-center flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
                  <div className="absolute top-1.5 left-2.5 text-[8px] font-black uppercase tracking-wider text-slate-400">Receiver</div>
                  <div className="flex-1 flex items-center justify-center pt-3 select-none">
                    <div className="overflow-hidden rounded border border-slate-200 dark:border-slate-750 bg-white p-0.5 max-h-[85px] max-w-full">
                      <img src={markerNestingImg} alt="Marker Nesting Layout" className="max-h-[75px] object-contain rounded" />
                    </div>
                  </div>
                  <div className="font-black text-slate-800 dark:text-slate-250 text-[9px] pt-1.5 mt-2 uppercase border-t border-slate-250 dark:border-slate-700">
                    {form.receiver || "—"}
                  </div>
                </div>

                {/* 2. Prepared By Sign */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30 text-center flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                  <div className="absolute top-1.5 left-2.5 text-[8px] font-black uppercase tracking-wider text-slate-400">Prepared by</div>
                  <div className="flex-1 flex items-center justify-center select-none">
                    <span className="text-[20px] font-black tracking-widest text-slate-300/40 dark:text-slate-700/30 rotate-[-12deg] pointer-events-none uppercase font-serif">
                      PREPARED
                    </span>
                  </div>
                  <div className="font-black text-slate-800 dark:text-slate-250 text-[9px] pt-1.5 mt-2 uppercase border-t border-slate-250 dark:border-slate-700">
                    {form.preparedBy || "—"}
                  </div>
                </div>

                {/* 3. Checked By Sign */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30 text-center flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                  <div className="absolute top-1.5 left-2.5 text-[8px] font-black uppercase tracking-wider text-slate-400">Check by</div>
                  <div className="flex-1 flex items-center justify-center select-none">
                    <div className="border-2 border-emerald-500/50 text-emerald-500/60 text-[9px] font-black rounded-lg px-2.5 py-1 pointer-events-none uppercase tracking-widest rotate-[-5deg]">
                      Checked
                    </div>
                  </div>
                  <div className="font-black text-slate-800 dark:text-slate-250 text-[9px] pt-1.5 mt-2 uppercase border-t border-slate-250 dark:border-slate-700">
                    {form.checkedBy || "—"}
                  </div>
                </div>

                {/* 4. Final Stamp / Reference Sheet */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30 text-center flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
                  <div className="absolute top-1.5 left-2.5 text-[8px] font-black uppercase tracking-wider text-slate-400">FINAL</div>
                  <div className="flex-1 flex flex-col items-center justify-center gap-1.5 pt-3 select-none">
                    <span className="text-[24px] font-black tracking-wider text-emerald-600/35 dark:text-emerald-550/20 rotate-[-15deg] font-serif leading-none">
                      FINAL
                    </span>
                    <div className="h-10 w-14 overflow-hidden rounded bg-white border border-slate-200 p-0.5">
                      <img src={styleOrderCardImg} alt="Ref Order Card" className="h-full w-full object-contain rounded" />
                    </div>
                  </div>
                  <div className="font-black text-slate-850 dark:text-slate-200 text-[9px] pt-1.5 mt-2 uppercase border-t border-slate-250 dark:border-slate-700">
                    Approved: {form.approvedBy || "—"}
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
