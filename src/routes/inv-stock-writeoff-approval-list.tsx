import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  ShieldAlert,
  Filter,
  Search,
  ChevronDown,
  Printer,
  Calendar,
  Building2,
  Package,
  Layers,
  FileSpreadsheet,
  X,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  StockWriteOff,
  getStoredStockWriteOffs,
  saveStoredStockWriteOffs,
  MASTER_COMPANIES,
} from "@/lib/inventory-stock-management-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-stock-writeoff-approval-list")({
  head: () => ({
    meta: [
      { title: "Stock Write-Off Approval — Inventory ERP" },
      {
        name: "description",
        content: "Executive review and authorization desk for material write-off proposals.",
      },
    ],
  }),
  component: StockWriteOffApprovalListPage,
});

function StockWriteOffApprovalListPage() {
  const navigate = useNavigate();
  const [writeOffs, setWriteOffs] = useState<StockWriteOff[]>(() =>
    getStoredStockWriteOffs()
  );

  useEffect(() => {
    saveStoredStockWriteOffs(writeOffs);
  }, [writeOffs]);

  // Tab State
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filtered List
  const filteredWriteOffs = useMemo(() => {
    return writeOffs.filter((wo) => {
      if (activeTab === "pending" && wo.status !== "Submitted") return false;
      if (activeTab === "approved" && wo.status !== "Approved" && wo.status !== "Posted") return false;
      if (activeTab === "rejected" && wo.status !== "Rejected" && wo.status !== "Returned") return false;

      if (companyFilter !== "All" && wo.company !== companyFilter) return false;
      if (categoryFilter !== "All" && wo.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          wo.writeOffId.toLowerCase().includes(q) ||
          wo.company.toLowerCase().includes(q) ||
          wo.warehouseStore.toLowerCase().includes(q) ||
          wo.category.toLowerCase().includes(q) ||
          wo.initiatedBy.toLowerCase().includes(q) ||
          wo.items.some((it) => it.itemName.toLowerCase().includes(q) || it.itemCode.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [writeOffs, activeTab, companyFilter, categoryFilter, searchQuery]);

  // Metric counts
  const pendingCount = useMemo(() => writeOffs.filter((w) => w.status === "Submitted").length, [writeOffs]);
  const approvedCount = useMemo(
    () => writeOffs.filter((w) => w.status === "Approved" || w.status === "Posted").length,
    [writeOffs]
  );
  const pendingLossValue = useMemo(() => {
    return writeOffs
      .filter((w) => w.status === "Submitted")
      .reduce((sum, w) => sum + (Number(w.totalLossValue) || 0), 0);
  }, [writeOffs]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Submitted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Approved":
      case "Posted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Returned":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100/70 text-slate-800">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-600">
                <ShieldAlert className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    Write-Off Approval
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {pendingCount} Pending Review
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Executive authorization desk for scrapped inventory, damaged consignments, and financial loss write-offs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/inv-stock-writeoff-list"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors"
              >
                View All Requests
              </Link>
            </div>
          </div>

          {/* Quick Stats Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { id: "pending", label: "Pending Approval", count: pendingCount, color: "text-amber-600" },
              {
                id: "approved",
                label: "Approved & Written Off",
                count: approvedCount,
                color: "text-emerald-600",
              },
              {
                id: "rejected",
                label: "Rejected / Returned",
                count: writeOffs.filter((w) => w.status === "Rejected" || w.status === "Returned").length,
                color: "text-rose-600",
              },
              { id: "all", label: "Total Proposals", count: writeOffs.length, color: "text-slate-800" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-white border-amber-500 shadow-sm ring-1 ring-amber-500/20"
                    : "bg-white/60 border-slate-200/80 hover:bg-white"
                }`}
              >
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{tab.label}</div>
                <div className={`text-xl font-black mt-1 ${tab.color}`}>{tab.count}</div>
              </button>
            ))}
          </div>

          {/* Summary Financial Alert */}
          {pendingCount > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-5 text-amber-600" />
                <div>
                  <div className="text-xs font-bold text-amber-900">
                    {pendingCount} write-off proposal(s) currently awaiting executive authorization
                  </div>
                  <div className="text-[11px] text-amber-700 mt-0.5">
                    Total financial loss impact under review:{" "}
                    <strong className="font-mono">৳ {pendingLossValue.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-3 text-center w-10">SL</th>
                    <th className="py-3 px-3">Write-Off ID</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Company & Store</th>
                    <th className="py-3 px-3">Reason Category</th>
                    <th className="py-3 px-3 text-center">Items</th>
                    <th className="py-3 px-3 text-right">Write-Off Qty</th>
                    <th className="py-3 px-3 text-right">Loss Impact (৳)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3">Initiated By</th>
                    <th className="py-3 px-3 text-center sticky right-0 bg-slate-100">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredWriteOffs.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400">
                        <CheckCircle2 className="size-8 mx-auto text-emerald-300 stroke-[1.5] mb-2" />
                        <p className="text-xs font-semibold text-slate-600">No write-offs pending approval</p>
                      </td>
                    </tr>
                  ) : (
                    filteredWriteOffs.map((wo, idx) => (
                      <tr key={wo.id} className="hover:bg-slate-50/70 transition-colors whitespace-nowrap">
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[10px]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3 font-bold font-mono text-rose-700">
                          {wo.writeOffId}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                          {wo.date}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800 line-clamp-1">{wo.company}</div>
                          <div className="text-[10.5px] text-slate-400">{wo.warehouseStore}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {wo.category}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold">
                          {wo.totalItems}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-rose-600">
                          {wo.totalWriteOffQty.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          ৳ {wo.totalLossValue.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                              wo.status
                            )}`}
                          >
                            {wo.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 text-[11px]">
                          {wo.initiatedBy}
                        </td>
                        <td className="py-3 px-3 text-center sticky right-0 bg-white hover:bg-slate-50/70 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.04)]">
                          {wo.status === "Submitted" ? (
                            <Link
                              to="/inv-stock-writeoff-approval"
                              search={{ writeOffId: wo.id }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
                            >
                              <span>Review & Decide</span>
                              <ArrowRight className="size-3" />
                            </Link>
                          ) : (
                            <Link
                              to="/inv-stock-writeoff-approval"
                              search={{ writeOffId: wo.id }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shadow-xs transition-colors"
                            >
                              <Eye className="size-3.5" />
                              <span>View</span>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
