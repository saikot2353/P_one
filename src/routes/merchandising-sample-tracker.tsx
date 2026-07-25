import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Scissors,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Send,
  MessageSquare,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-sample-tracker")({
  head: () => ({
    meta: [
      { title: "Sample Tracker — RMG Merchandising" },
      { name: "description", content: "Garments sample development tracking, Proto/Fit/PP sample requisitions, and buyer feedback log." },
    ],
  }),
  component: MerchandisingSampleTrackerPage,
});

interface SampleItem {
  id: string;
  reqNo: string;
  styleNo: string;
  buyerName: string;
  sampleType: "Proto Sample" | "Fit Sample" | "Size Set" | "PP Sample" | "TOP Sample";
  qty: number;
  reqDate: string;
  targetSubmitDate: string;
  actualSubmitDate?: string;
  status: "In Room" | "Sent to Buyer" | "Approved" | "Approved with Comments" | "Rejected";
  buyerComments?: string;
  merchant: string;
}

const initialSamples: SampleItem[] = [
  {
    id: "s-1",
    reqNo: "SR-2026-081",
    styleNo: "ST-8822",
    buyerName: "ITPS",
    sampleType: "Fit Sample",
    qty: 3,
    reqDate: "2026-07-10",
    targetSubmitDate: "2026-07-20",
    actualSubmitDate: "2026-07-19",
    status: "Approved",
    buyerComments: "Measurement matches spec sheet. Proceed to PP sample stage.",
    merchant: "Hanif Uddin",
  },
  {
    id: "s-2",
    reqNo: "SR-2026-094",
    styleNo: "AM-899",
    buyerName: "A-M-London Fashion Ltd",
    sampleType: "PP Sample",
    qty: 6,
    reqDate: "2026-07-15",
    targetSubmitDate: "2026-07-26",
    actualSubmitDate: "2026-07-24",
    status: "Approved with Comments",
    buyerComments: "Approved. Please increase neck rib width by 0.5cm in production.",
    merchant: "Parvej Mahmud",
  },
  {
    id: "s-3",
    reqNo: "SR-2026-102",
    styleNo: "SW-Crew",
    buyerName: "ITPS",
    sampleType: "Proto Sample",
    qty: 2,
    reqDate: "2026-07-22",
    targetSubmitDate: "2026-07-30",
    status: "Sent to Buyer",
    merchant: "Hanif Uddin",
  },
];

function MerchandisingSampleTrackerPage() {
  const [samples, setSamples] = useState<SampleItem[]>(initialSamples);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  // Feedback Dialog State
  const [selectedSample, setSelectedSample] = useState<SampleItem | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<SampleItem["status"]>("Approved");
  const [feedbackComments, setFeedbackComments] = useState("");

  // New Sample Requisition Form State
  const [showReqForm, setShowReqForm] = useState(false);
  const [newForm, setNewForm] = useState({
    styleNo: "",
    buyerName: "ITPS",
    sampleType: "Fit Sample" as SampleItem["sampleType"],
    qty: 3,
    targetSubmitDate: "",
    merchant: "Hanif Uddin",
  });

  const handleCreateRequisition = () => {
    if (!newForm.styleNo.trim()) {
      toast.error("Please enter Style Number");
      return;
    }
    const item: SampleItem = {
      id: `s-${Date.now()}`,
      reqNo: `SR-2026-${Math.floor(100 + Math.random() * 900)}`,
      styleNo: newForm.styleNo,
      buyerName: newForm.buyerName,
      sampleType: newForm.sampleType,
      qty: Number(newForm.qty) || 1,
      reqDate: new Date().toISOString().split("T")[0],
      targetSubmitDate: newForm.targetSubmitDate || "2026-08-10",
      status: "In Room",
      merchant: newForm.merchant,
    };
    setSamples([item, ...samples]);
    setShowReqForm(false);
    setNewForm({ styleNo: "", buyerName: "ITPS", sampleType: "Fit Sample", qty: 3, targetSubmitDate: "", merchant: "Hanif Uddin" });
    toast.success(`Sample Requisition ${item.reqNo} created!`);
  };

  const handleSaveFeedback = () => {
    if (!selectedSample) return;
    setSamples(prev =>
      prev.map(s =>
        s.id === selectedSample.id
          ? { ...s, status: feedbackStatus, buyerComments: feedbackComments }
          : s
      )
    );
    toast.success(`Updated buyer feedback for ${selectedSample.reqNo}`);
    setSelectedSample(null);
  };

  const filteredSamples = samples.filter(s => {
    const matchesSearch =
      s.reqNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.styleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || s.sampleType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <MerchandisingLayout
      activePath="sample"
      breadcrumbs={[{ label: "Sample & Development" }, { label: "Requisition & Approvals Log" }]}
      title="Sample Development & Buyer Feedback Hub"
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">
        
        {/* Banner */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Scissors className="size-5" /></span>
              Sample Development Tracker
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Track sample room workflow from initial Proto & Fit samples to PP (Pre-Production) sample buyer approvals</p>
          </div>

          <button
            onClick={() => setShowReqForm(!showReqForm)}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-teal-500/15 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus size={14} /> NEW SAMPLE REQUISITION
          </button>
        </div>

        {/* REQUISITION INLINE FORM */}
        {showReqForm && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-teal-500/30 shadow-lg space-y-4 animate-in fade-in">
            <h3 className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-2">
              <Plus className="size-4" /> Raise Sample Requisition Sheet
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <input
                type="text"
                placeholder="Style No (e.g. ST-9900)"
                value={newForm.styleNo}
                onChange={(e) => setNewForm({ ...newForm, styleNo: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              />
              <select
                value={newForm.buyerName}
                onChange={(e) => setNewForm({ ...newForm, buyerName: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              >
                <option value="ITPS">ITPS</option>
                <option value="A-M-London Fashion Ltd">A-M-London Fashion Ltd</option>
                <option value="Nordic Wear AS">Nordic Wear AS</option>
              </select>
              <select
                value={newForm.sampleType}
                onChange={(e) => setNewForm({ ...newForm, sampleType: e.target.value as any })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              >
                <option value="Proto Sample">Proto Sample</option>
                <option value="Fit Sample">Fit Sample</option>
                <option value="Size Set">Size Set</option>
                <option value="PP Sample">PP Sample</option>
                <option value="TOP Sample">TOP Sample</option>
              </select>
              <input
                type="number"
                placeholder="Qty Pcs"
                value={newForm.qty}
                onChange={(e) => setNewForm({ ...newForm, qty: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              />
              <input
                type="date"
                value={newForm.targetSubmitDate}
                onChange={(e) => setNewForm({ ...newForm, targetSubmitDate: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              />
              <button
                onClick={handleCreateRequisition}
                className="w-full h-9 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Submit Requisition
              </button>
            </div>
          </div>
        )}

        {/* LEDGER GRID */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search by req, style, buyer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <div className="flex items-center gap-2">
              {["All", "Proto Sample", "Fit Sample", "PP Sample"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                    filterType === t
                      ? "bg-teal-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Req No</th>
                  <th className="px-4 py-3">Style No</th>
                  <th className="px-4 py-3">Buyer Name</th>
                  <th className="px-4 py-3">Sample Stage</th>
                  <th className="px-4 py-3 text-center">Qty Pcs</th>
                  <th className="px-4 py-3">Target Date</th>
                  <th className="px-4 py-3">Buyer Status</th>
                  <th className="px-4 py-3">Buyer Comments</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                {filteredSamples.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{s.reqNo}</td>
                    <td className="px-4 py-3 font-bold text-teal-600 dark:text-teal-400">{s.styleNo}</td>
                    <td className="px-4 py-3">{s.buyerName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        {s.sampleType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold">{s.qty}</td>
                    <td className="px-4 py-3 text-slate-500">{s.targetSubmitDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        s.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : s.status === "Approved with Comments"
                          ? "bg-teal-500/10 text-teal-600 border border-teal-500/20"
                          : s.status === "Rejected"
                          ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[220px] truncate text-slate-500" title={s.buyerComments || "No comments yet"}>
                      {s.buyerComments || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedSample(s);
                          setFeedbackStatus(s.status);
                          setFeedbackComments(s.buyerComments || "");
                        }}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] rounded-lg transition cursor-pointer flex items-center gap-1 mx-auto"
                      >
                        <MessageSquare size={12} /> Feedback
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FEEDBACK DIALOG */}
        {selectedSample && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Update Buyer Feedback ({selectedSample.reqNo})</h3>
                <button onClick={() => setSelectedSample(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Buyer Decision</label>
                  <select
                    value={feedbackStatus}
                    onChange={(e) => setFeedbackStatus(e.target.value as any)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Approved with Comments">Approved with Comments</option>
                    <option value="Rejected">Rejected (Resubmit Required)</option>
                    <option value="Sent to Buyer">Sent to Buyer (Awaiting)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Buyer Remarks & Spec Comments</label>
                  <textarea
                    rows={3}
                    placeholder="Enter detailed feedback from buyer..."
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
                <button onClick={() => setSelectedSample(null)} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300">Cancel</button>
                <button onClick={handleSaveFeedback} className="px-5 py-2 text-xs font-bold text-white bg-teal-500 hover:bg-teal-600 rounded-lg shadow-sm">Save Feedback</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}
