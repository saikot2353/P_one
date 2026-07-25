import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  TrendingUp,
  Download,
  Printer,
  PieChart as PieIcon,
  BarChart2,
  FileSpreadsheet,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-reports")({
  head: () => ({
    meta: [
      { title: "Merchandising Reports — RMG BI Suite" },
      { name: "description", content: "Daily order status reports, buyer share analytics, and yarn/fabric stock reconciliation ledgers." },
    ],
  }),
  component: MerchandisingReportsPage,
});

interface OrderReportRow {
  sl: number;
  poNo: string;
  styleNo: string;
  buyer: string;
  garmentType: string;
  orderQty: number;
  fobUsd: number;
  totalValUsd: number;
  exFactoryDate: string;
  shippedQty: number;
  balanceQty: number;
  status: string;
}

const mockOrderReports: OrderReportRow[] = [
  { sl: 1, poNo: "PO-2026-ITPS", styleNo: "ST-8822", buyer: "ITPS", garmentType: "Basic T-Shirt (Knit)", orderQty: 12000, fobUsd: 4.85, totalValUsd: 58200.0, exFactoryDate: "2026-08-15", shippedQty: 0, balanceQty: 12000, status: "In Production" },
  { sl: 2, poNo: "PO-LND-899", styleNo: "AM-899", buyer: "A-M-London Fashion Ltd", garmentType: "Chino Pants (Woven)", orderQty: 5400, fobUsd: 12.50, totalValUsd: 67500.0, exFactoryDate: "2026-08-20", shippedQty: 0, balanceQty: 5400, status: "Pre-Production" },
  { sl: 3, poNo: "PO-SW-440", styleNo: "SW-Crew", buyer: "ITPS", garmentType: "Pullover Sweater", orderQty: 7500, fobUsd: 8.20, totalValUsd: 61500.0, exFactoryDate: "2026-09-05", shippedQty: 0, balanceQty: 7500, status: "Yarn Booking" },
];

function MerchandisingReportsPage() {
  const [activeReport, setActiveReport] = useState<"daily" | "buyerShare" | "stock">("daily");
  const [searchQuery, setSearchQuery] = useState("");

  const handleExport = (format: string) => {
    toast.success(`Exporting ${activeReport.toUpperCase()} report as ${format}`);
  };

  const filteredOrders = mockOrderReports.filter(o =>
    o.poNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.styleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.buyer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MerchandisingLayout
      activePath="reports"
      breadcrumbs={[{ label: "Reports & Analytics" }, { label: "Merchandising BI Reports" }]}
      title="Merchandising Business Intelligence Reports"
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">
        
        {/* Banner */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><TrendingUp className="size-5" /></span>
              Merchandising Executive BI Reports
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time export reports for Order Status, Buyer Concentration Share, and Material Ledger Reconciliation</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport("Excel")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FileSpreadsheet size={14} /> EXPORT EXCEL
            </button>
            <button
              onClick={() => handleExport("PDF")}
              className="bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download size={14} /> PDF
            </button>
          </div>
        </div>

        {/* Report Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: "daily", label: "Daily Order Status Report", icon: BarChart2 },
            { id: "buyerShare", label: "Buyer Share & Ex-Factory", icon: PieIcon },
            { id: "stock", label: "Material Stock Reconciliation", icon: TrendingUp },
          ].map((r) => {
            const Icon = r.icon;
            const isSel = activeReport === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveReport(r.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
                  isSel
                    ? "bg-teal-500 text-white shadow-md shadow-teal-500/15"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                }`}
              >
                <Icon size={14} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: DAILY ORDER STATUS REPORT */}
        {activeReport === "daily" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-4 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <input
                type="text"
                placeholder="Search PO, style, buyer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
              />
              <span className="text-xs font-bold text-slate-400">Total Live Orders: {filteredOrders.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-center">SL</th>
                    <th className="px-4 py-3">PO Number</th>
                    <th className="px-4 py-3">Style No</th>
                    <th className="px-4 py-3">Buyer</th>
                    <th className="px-4 py-3">Garment Category</th>
                    <th className="px-4 py-3 text-right">Order Qty</th>
                    <th className="px-4 py-3 text-right">FOB Rate ($)</th>
                    <th className="px-4 py-3 text-right">Total Order Value ($)</th>
                    <th className="px-4 py-3">Ex-Factory Date</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold">
                  {filteredOrders.map((o) => (
                    <tr key={o.sl} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 text-center font-bold text-slate-400">{o.sl}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{o.poNo}</td>
                      <td className="px-4 py-3 font-bold text-teal-600 dark:text-teal-400">{o.styleNo}</td>
                      <td className="px-4 py-3">{o.buyer}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{o.garmentType}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold">{o.orderQty.toLocaleString()} Pcs</td>
                      <td className="px-4 py-3 text-right font-mono">${o.fobUsd.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-mono font-extrabold text-teal-600 dark:text-teal-400">${o.totalValUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{o.exFactoryDate}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2 & 3 PLACEHOLDERS WITH METRICS */}
        {activeReport !== "daily" && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="p-3 bg-teal-500/10 text-teal-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {activeReport === "buyerShare" ? "Buyer Concentration & Shipment Report" : "Material Stock Ledger Reconciliation"}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Interactive analytics ledger showing month-on-month export distribution and fabric/yarn stock variance across factories.
            </p>
          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}
