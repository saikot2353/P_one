import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  FileX2,
  Plus,
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
  Edit,
  Send,
  AlertOctagon,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import {
  StockWriteOff,
  getStoredStockWriteOffs,
  saveStoredStockWriteOffs,
  MASTER_COMPANIES,
} from "@/lib/inventory-stock-management-data";
import { DEFAULT_WAREHOUSES, getStoredData } from "@/lib/procurement-master-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-stock-writeoff-list")({
  head: () => ({
    meta: [
      { title: "Stock Write-Off List — Inventory ERP" },
      {
        name: "description",
        content: "Track damaged, expired, or scraped inventory disposal and write-off requests.",
      },
    ],
  }),
  component: StockWriteOffListPage,
});

function StockWriteOffListPage() {
  const navigate = useNavigate();
  const [writeOffs, setWriteOffs] = useState<StockWriteOff[]>(() =>
    getStoredStockWriteOffs()
  );

  useEffect(() => {
    saveStoredStockWriteOffs(writeOffs);
  }, [writeOffs]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [writeOffIdFilter, setWriteOffIdFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Status Tab
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved">("all");

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTargetWO, setReportTargetWO] = useState<StockWriteOff | null>(null);

  // Filtered
  const filteredWriteOffs = useMemo(() => {
    return writeOffs.filter((wo) => {
      if (activeTab === "pending" && wo.status !== "Submitted") return false;
      if (activeTab === "approved" && wo.status !== "Approved" && wo.status !== "Posted") return false;

      if (statusFilter !== "All" && wo.status !== statusFilter) return false;
      if (categoryFilter !== "All" && wo.category !== categoryFilter) return false;
      if (companyFilter !== "All" && wo.company !== companyFilter) return false;

      if (writeOffIdFilter.trim() && !wo.writeOffId.toLowerCase().includes(writeOffIdFilter.toLowerCase()))
        return false;

      if (fromDate && wo.date < fromDate) return false;
      if (toDate && wo.date > toDate) return false;

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
  }, [writeOffs, activeTab, statusFilter, categoryFilter, companyFilter, writeOffIdFilter, fromDate, toDate, searchQuery]);

  const handleSubmit = (id: string) => {
    setWriteOffs((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "Submitted" } : w))
    );
    toast.success("Write-Off submitted for executive committee approval!");
  };

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

  // Preview Report Data
  const previewReportData: StandardReportData | null = useMemo(() => {
    if (!reportTargetWO) return null;
    return {
      companyName: reportTargetWO.company,
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: "SCRAP & MATERIAL WRITE-OFF PROPOSAL",
      reportNumber: reportTargetWO.writeOffId,
      reportDate: reportTargetWO.date,
      statusBadge: reportTargetWO.status,
      metaFields: [
        { label: "Write-Off ID", value: reportTargetWO.writeOffId },
        { label: "Date", value: reportTargetWO.date },
        { label: "Company", value: reportTargetWO.company },
        { label: "Warehouse Store", value: reportTargetWO.warehouseStore },
        { label: "Reason Category", value: reportTargetWO.category },
        { label: "Disposal Method", value: reportTargetWO.disposalMethod },
        { label: "Investigation Ref", value: reportTargetWO.investigationRef || "-" },
        { label: "Initiated By", value: reportTargetWO.initiatedBy },
      ],
      tableHeaders: [
        "SL",
        "ITEM CODE",
        "DESCRIPTION",
        "UOM",
        "WRITE-OFF QTY",
        "UNIT COST (৳)",
        "TOTAL LOSS VALUE (৳)",
        "DAMAGE SPECIFICATION",
      ],
      tableRows: reportTargetWO.items.map((it, idx) => [
        String(idx + 1),
        it.itemCode,
        it.itemName,
        it.uom,
        String(it.writeOffQty),
        String(it.unitCost),
        String(it.totalLossValue.toLocaleString()),
        it.damageReasonDetails,
      ]),
      summaryCards: [
        { label: "Total Items", value: String(reportTargetWO.totalItems) },
        { label: "Total Write-Off Qty", value: `${reportTargetWO.totalWriteOffQty} units` },
        { label: "Total Loss Value", value: `৳ ${reportTargetWO.totalLossValue.toLocaleString()}` },
      ],
      notes: [
        `Write-off category: ${reportTargetWO.category}. Disposal to be carried out via ${reportTargetWO.disposalMethod}.`,
        "Approved stock deduction only takes effect upon final executive committee authorization.",
      ],
      signatures: [
        { title: "Store Officer", name: reportTargetWO.initiatedBy, date: reportTargetWO.date },
        { title: "Quality Assurance", name: "QA Head", date: reportTargetWO.date },
        { title: "Managing Director / COO", name: reportTargetWO.approvedBy || "Awaiting Signature", date: reportTargetWO.approvalDate || reportTargetWO.date },
      ],
    };
  }, [reportTargetWO]);

  return (
    <div className="min-h-screen flex bg-slate-100/70 text-slate-800">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
                <FileX2 className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    Stock Write-Off Requests
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {filteredWriteOffs.length} records
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Manage inventory scrap, damaged goods disposal, and write-off loss approvals
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/inv-stock-writeoff-approval-list"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors"
              >
                <ShieldAlert className="size-4 text-amber-600" />
                Approval Desk
              </Link>

              <Link
                to="/inv-stock-writeoff"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 active:scale-95 transition-all"
              >
                <Plus className="size-4" />
                New Stock Write-Off
              </Link>
            </div>
          </div>

          {/* Quick Stats Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "all", label: "All Requests", count: writeOffs.length, color: "text-slate-800" },
              {
                id: "pending",
                label: "Pending Approval",
                count: writeOffs.filter((w) => w.status === "Submitted").length,
                color: "text-amber-600",
              },
              {
                id: "approved",
                label: "Approved & Written Off",
                count: writeOffs.filter((w) => w.status === "Approved" || w.status === "Posted").length,
                color: "text-emerald-600",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-white border-rose-500 shadow-sm ring-1 ring-rose-500/20"
                    : "bg-white/60 border-slate-200/80 hover:bg-white"
                }`}
              >
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{tab.label}</div>
                <div className={`text-xl font-black mt-1 ${tab.color}`}>{tab.count}</div>
              </button>
            ))}
          </div>

          {/* Filter Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Filter className="size-4 text-slate-400" />
                <span>Search & Filter Write-Offs</span>
              </div>
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                {isFiltersOpen ? "Collapse" : "Expand"}
                <ChevronDown className={`size-3.5 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {isFiltersOpen && (
              <div className="p-4 space-y-3 bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Write-Off ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. WO-2026-001"
                      value={writeOffIdFilter}
                      onChange={(e) => setWriteOffIdFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Reason Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value="All">All Categories</option>
                      <option value="Damaged / Broken">Damaged / Broken</option>
                      <option value="Expired Material">Expired Material</option>
                      <option value="Quality Rejection / Scrap">Quality Rejection / Scrap</option>
                      <option value="Lost / Stolen">Lost / Stolen</option>
                      <option value="Obsolete Stock">Obsolete Stock</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Company
                    </label>
                    <select
                      value={companyFilter}
                      onChange={(e) => setCompanyFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value="All">All Companies</option>
                      {MASTER_COMPANIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Draft">Draft</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Search Keyword
                    </label>
                    <div className="relative">
                      <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search item, reason, or initiated by..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

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
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3 text-center">Items</th>
                    <th className="py-3 px-3 text-right">Write-Off Qty</th>
                    <th className="py-3 px-3 text-right">Loss Value (৳)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center sticky right-0 bg-slate-100">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredWriteOffs.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        <FileX2 className="size-8 mx-auto text-slate-300 stroke-[1.5] mb-2" />
                        <p className="text-xs font-semibold text-slate-600">No write-off records found</p>
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
                        <td className="py-3 px-3 text-center sticky right-0 bg-white hover:bg-slate-50/70 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.04)]">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              title="View Write-Off Details"
                              onClick={() =>
                                navigate({
                                  to: "/inv-stock-writeoff",
                                  search: { writeOffId: wo.id, mode: "view" },
                                })
                              }
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Eye className="size-3.5" />
                            </button>

                            {wo.status === "Draft" && (
                              <>
                                <button
                                  title="Edit Draft"
                                  onClick={() =>
                                    navigate({
                                      to: "/inv-stock-writeoff",
                                      search: { writeOffId: wo.id, mode: "edit" },
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                >
                                  <Edit className="size-3.5" />
                                </button>

                                <button
                                  title="Submit for Approval"
                                  onClick={() => handleSubmit(wo.id)}
                                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                  <Send className="size-3.5" />
                                </button>
                              </>
                            )}

                            <button
                              title="Print Proposal"
                              onClick={() => {
                                setReportTargetWO(wo);
                                setPreviewReportOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <Printer className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {previewReportOpen && previewReportData && (
          <StandardPreviewReportModal
            isOpen={previewReportOpen}
            onClose={() => setPreviewReportOpen(false)}
            data={previewReportData}
          />
        )}
      </main>
    </div>
  );
}
