import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Layers,
  ChevronDown,
  Info,
  Calendar,
  Layers3,
  CheckCircle,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";

export const Route = createFileRoute("/merchandising-order-list")({
  head: () => ({
    meta: [
      { title: "Order List — Merchandising" }
    ],
  }),
  component: MerchandisingOrderListPage,
});

interface OrderSummaryItem {
  id: string;
  jobNo: string;
  queryNo: string;
  refNo: string;
  qty: number;
  buyer: string;
  orderType: "Knit" | "Woven" | "Sweater";
  shipDate: string;
  status: string;
  styleNo: string;
}

const mockOrders: OrderSummaryItem[] = [
  {
    id: "1",
    jobNo: "5",
    queryNo: "5",
    refNo: "PO#12",
    qty: 7000,
    buyer: "ITPS",
    orderType: "Knit",
    shipDate: "2026-07-31",
    status: "Active",
    styleNo: "ABC"
  },
  {
    id: "2",
    jobNo: "6",
    queryNo: "8",
    refNo: "PO-LND-23",
    qty: 12000,
    buyer: "A-M-London Fashion Ltd",
    orderType: "Woven",
    shipDate: "2026-08-15",
    status: "Confirmed",
    styleNo: "AM-899"
  },
  {
    id: "3",
    jobNo: "7",
    queryNo: "12",
    refNo: "PO-SW-88",
    qty: 5400,
    buyer: "ITPS",
    orderType: "Sweater",
    shipDate: "2026-09-05",
    status: "Draft",
    styleNo: "SW-Crew"
  }
];

export default function MerchandisingOrderListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return mockOrders.filter(
      (o) =>
        o.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.jobNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.styleNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleCreateOrder = (type: "Knit" | "Woven" | "Sweater") => {
    setShowCreateDropdown(false);
    toast.success(`Creating new ${type} order`, {
      description: "Redirecting to Order Profile form workspace..."
    });
    navigate({
      to: "/merchandising-order-profile",
      search: { type }
    });
  };

  return (
    <MerchandisingLayout
      activePath="order-list"
      breadcrumbs={[{ label: "Manage Order" }, { label: "Order List" }]}
      title="Order Management Ledger"
    >
      <div className="p-4 lg:p-6 space-y-6">
        
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-md">
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 text-slate-800 dark:text-slate-200 transition-all"
              placeholder="Search by job, PO, buyer, style..."
            />
          </div>

          {/* Create Order Button with Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowCreateDropdown(!showCreateDropdown)}
              className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-650 hover:to-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-500/10 active:scale-97"
            >
              <Plus size={14} />
              <span>CREATE ORDER</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${showCreateDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Options */}
            {showCreateDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCreateDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fadeIn text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 mb-1">
                    Select Order Type
                  </div>
                  <button
                    onClick={() => handleCreateOrder("Knit")}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-teal-500 font-semibold flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Knit Order
                  </button>
                  <button
                    onClick={() => handleCreateOrder("Woven")}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-teal-500 font-semibold flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Woven Order
                  </button>
                  <button
                    onClick={() => handleCreateOrder("Sweater")}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-teal-500 font-semibold flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Sweater Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Ledger Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2">
            <Layers3 size={16} className="text-teal-500" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200">
              Order Master Ledger
            </h3>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-[11px] font-semibold text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-4 py-3.5 font-extrabold border-r border-slate-200 dark:border-slate-800/40">SL</th>
                  <th className="px-4 py-3.5 font-extrabold border-r border-slate-200 dark:border-slate-800/40">Job No</th>
                  <th className="px-4 py-3.5 font-extrabold border-r border-slate-200 dark:border-slate-800/40">Query No</th>
                  <th className="px-4 py-3.5 font-extrabold border-r border-slate-200 dark:border-slate-800/40">Ref / PO No</th>
                  <th className="px-4 py-3.5 font-extrabold border-r border-slate-200 dark:border-slate-800/40">Buyer Name</th>
                  <th className="px-4 py-3.5 font-extrabold border-r border-slate-200 dark:border-slate-800/40">Style No</th>
                  <th className="px-4 py-3.5 font-extrabold border-r border-slate-200 dark:border-slate-800/40">Order Type</th>
                  <th className="px-4 py-3.5 font-extrabold text-right border-r border-slate-200 dark:border-slate-800/40">Order Qty</th>
                  <th className="px-4 py-3.5 font-extrabold border-r border-slate-200 dark:border-slate-800/40">Ship Date</th>
                  <th className="px-4 py-3.5 font-extrabold border-r border-slate-200 dark:border-slate-800/40">Status</th>
                  <th className="px-4 py-3.5 font-extrabold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o, idx) => (
                    <tr
                      key={o.id}
                      className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40 hover:border-l-4 hover:border-teal-500 transition-all duration-150"
                    >
                      <td className="px-4 py-3.5 border-r border-slate-200/50 dark:border-slate-800/40 text-center">{idx + 1}</td>
                      <td className="px-4 py-3.5 border-r border-slate-200/50 dark:border-slate-800/40 font-bold text-slate-900 dark:text-white">#{o.jobNo}</td>
                      <td className="px-4 py-3.5 border-r border-slate-200/50 dark:border-slate-800/40">{o.queryNo}</td>
                      <td className="px-4 py-3.5 border-r border-slate-200/50 dark:border-slate-800/40 font-semibold">{o.refNo}</td>
                      <td className="px-4 py-3.5 border-r border-slate-200/50 dark:border-slate-800/40 text-teal-650 dark:text-teal-400 font-bold">{o.buyer}</td>
                      <td className="px-4 py-3.5 border-r border-slate-200/50 dark:border-slate-800/40">{o.styleNo}</td>
                      <td className="px-4 py-3.5 border-r border-slate-200/50 dark:border-slate-800/40">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border ${
                          o.orderType === "Knit"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : o.orderType === "Woven"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                        }`}>
                          {o.orderType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right border-r border-slate-200/50 dark:border-slate-800/40 font-extrabold text-slate-800 dark:text-slate-200">{o.qty.toLocaleString()} Pcs</td>
                      <td className="px-4 py-3.5 border-r border-slate-200/50 dark:border-slate-800/40">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-500 dark:text-slate-400">
                          <Calendar size={11} />
                          {o.shipDate}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 border-r border-slate-200/50 dark:border-slate-800/40">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase ${
                          o.status === "Confirmed"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : o.status === "Active"
                            ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Link
                          to="/merchandising-order-profile"
                          search={{ type: o.orderType, editId: o.id }}
                          className="px-2.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/25 text-[10px] font-extrabold uppercase transition-all"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="px-4 py-12 text-center text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-900/10">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Info size={24} className="text-slate-400" />
                        <span>No orders found matching the filter query.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-semibold text-slate-400">
            <span>Showing {filteredOrders.length} of {mockOrders.length} entries</span>
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed">Previous</span>
              <span className="px-2.5 py-1 rounded bg-teal-500 text-white cursor-default">1</span>
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed">Next</span>
            </div>
          </div>
        </div>

      </div>
    </MerchandisingLayout>
  );
}
