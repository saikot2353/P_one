import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  Package,
  Calendar,
  Building2,
  Search,
  Eye,
  FileSpreadsheet,
  Printer,
  FileText,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  Filter,
  Plus,
  Truck,
  RotateCcw,
  Sparkles,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import {
  getStoredDirectMRRs,
  DirectMRRRecord,
} from "@/lib/procurement-order-inventory-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

export const Route = createFileRoute("/inv-direct-mrr-list")({
  head: () => ({
    meta: [
      { title: "Direct MRR List — Inventory Management | CRIPTON" },
      {
        name: "description",
        content:
          "Official Direct Material Receive Report (MRR) registry. Manage, search, and view direct goods received without PO references.",
      },
    ],
  }),
  component: DirectMRRListPage,
});

export function DirectMRRListPage() {
  const navigate = useNavigate();

  const [directMrrList] = useState<DirectMRRRecord[]>(() => getStoredDirectMRRs());

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStore, setFilterStore] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Preview Report state
  const [previewRecord, setPreviewRecord] = useState<DirectMRRRecord | null>(null);

  // Unique stores and departments for dropdowns
  const uniqueStores = useMemo(() => {
    const set = new Set<string>();
    directMrrList.forEach((r) => {
      if (r.storeName) set.add(r.storeName);
    });
    return Array.from(set).sort();
  }, [directMrrList]);

  const uniqueDepartments = useMemo(() => {
    const set = new Set<string>();
    directMrrList.forEach((r) => {
      if (r.department) set.add(r.department);
    });
    return Array.from(set).sort();
  }, [directMrrList]);

  // Filtered List
  const filteredList = useMemo(() => {
    return directMrrList.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          r.mrrNumber.toLowerCase().includes(q) ||
          r.supplierName.toLowerCase().includes(q) ||
          r.storeName.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          (r.challanNo && r.challanNo.toLowerCase().includes(q)) ||
          (r.createdBy && r.createdBy.toLowerCase().includes(q));
        if (!matchesQ) return false;
      }

      if (filterStore !== "All" && r.storeName !== filterStore) return false;
      if (filterDepartment !== "All" && r.department !== filterDepartment) return false;
      if (filterStatus !== "All" && r.status !== filterStatus) return false;
      if (filterDateFrom && r.mrrDate < filterDateFrom) return false;
      if (filterDateTo && r.mrrDate > filterDateTo) return false;

      return true;
    });
  }, [
    directMrrList,
    searchQuery,
    filterStore,
    filterDepartment,
    filterStatus,
    filterDateFrom,
    filterDateTo,
  ]);

  // Statistics
  const stats = useMemo(() => {
    const total = directMrrList.length;
    const totalQty = directMrrList.reduce((sum, r) => sum + r.totalQuantity, 0);
    const totalVal = directMrrList.reduce((sum, r) => sum + r.totalAmount, 0);
    return { total, totalQty, totalVal };
  }, [directMrrList]);

  // Report Data for Modal Preview
  const previewReportData: StandardReportData | null = useMemo(() => {
    if (!previewRecord) return null;
    return {
      reportType: "direct-mrr",
      title: "Direct Material Receive Report (MRR)",
      documentNo: previewRecord.mrrNumber,
      documentNumber: previewRecord.mrrNumber,
      documentDate: previewRecord.mrrDate,
      department: previewRecord.department,
      status: previewRecord.status,
      metadata: [
        { label: "Direct MRR No", value: previewRecord.mrrNumber, highlight: true },
        { label: "MRR Date", value: previewRecord.mrrDate },
        { label: "Supplier / Vendor", value: previewRecord.supplierName, highlight: true },
        { label: "Warehouse / Store", value: previewRecord.storeName },
        { label: "Department", value: previewRecord.department },
        { label: "Challan No", value: previewRecord.challanNo || "—" },
        { label: "Vehicle No", value: previewRecord.vehicleNumber || "—" },
        { label: "Created By", value: previewRecord.createdBy },
      ],
      tableHeaders: [
        "SL",
        "Item Description & Spec",
        "Brand / Origin",
        "UOM",
        "Receive Qty",
        "Accepted Qty",
        "Rejected Qty",
        "Unit Price",
        "Line Total (৳)",
      ],
      tableRows: (previewRecord.items || []).map((i, idx) => [
        idx + 1,
        `${i.itemName} (${i.itemCode})`,
        `${i.brand} / ${i.origin}`,
        i.uom,
        i.receiveQuantity,
        i.acceptedQuantity,
        i.rejectedQuantity,
        `৳ ${i.unitPrice.toLocaleString()}`,
        `৳ ${i.estimatedValue.toLocaleString()}`,
      ]),
      summaryCards: [
        { label: "Total Items", value: previewRecord.totalItems },
        { label: "Total Receive Qty", value: `${previewRecord.totalQuantity} units` },
        {
          label: "Total Valuation",
          value: `৳ ${previewRecord.totalAmount.toLocaleString()}`,
          isBold: true,
          isHighlight: true,
        },
      ],
      signatures: [
        { role: "Created By", name: previewRecord.createdBy, designation: "Store Officer" },
        { role: "Verified By", name: "Md. Rafiqul Islam", designation: "Central Store Incharge" },
      ],
      notes: previewRecord.remarks || "Direct MRR received into stock.",
    };
  }, [previewRecord]);

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-1">
                <span>Inventory Management</span>
                <ChevronRight className="size-3" />
                <span>Receiving Operations</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-bold">Direct MRR List</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <Sparkles className="size-7 text-primary" />
                Direct MRR Registry
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Complete log of direct goods received into stores without Purchase Order references.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate({ to: "/inv-receive-direct" })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all cursor-pointer"
              >
                <Plus className="size-4" /> New Direct MRR
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
              <span className="text-xs font-bold text-muted-foreground">Total Direct MRRs</span>
              <div className="text-2xl font-black text-foreground mt-1 font-mono">
                {stats.total}
              </div>
              <span className="text-[11px] text-muted-foreground">All logged direct receipts</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
              <span className="text-xs font-bold text-muted-foreground">Total Units Received</span>
              <div className="text-2xl font-black text-primary mt-1 font-mono">
                {stats.totalQty.toLocaleString()}
              </div>
              <span className="text-[11px] text-muted-foreground">Goods added to inventory</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
              <span className="text-xs font-bold text-muted-foreground">Cumulative Stock Value</span>
              <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                ৳ {stats.totalVal.toLocaleString()}
              </div>
              <span className="text-[11px] text-muted-foreground">Total direct goods valuation</span>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Filter className="size-3.5 text-primary" />
                Filter Direct MRR Records
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterStore("All");
                  setFilterDepartment("All");
                  setFilterStatus("All");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                }}
                className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 cursor-pointer font-semibold"
              >
                <RefreshCw className="size-3" /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* Search */}
              <div className="sm:col-span-2">
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                  Search MRR / Supplier / Store / Creator
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search direct MRR no, vendor, challan, creator..."
                    className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Warehouse / Store */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                  Warehouse / Store
                </label>
                <select
                  value={filterStore}
                  onChange={(e) => setFilterStore(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-primary cursor-pointer"
                >
                  <option value="All">All Stores</option>
                  {uniqueStores.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                  Department
                </label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg outline-none focus:border-primary cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  {uniqueDepartments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-foreground">Direct MRR Transactions</h2>
                <p className="text-[11px] text-muted-foreground">
                  Showing {filteredList.length} of {directMrrList.length} records
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-3.5">Direct MRR Number</th>
                    <th className="py-3 px-3">MRR Date</th>
                    <th className="py-3 px-3">Supplier</th>
                    <th className="py-3 px-3">Warehouse / Store</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3 text-center">Total Items</th>
                    <th className="py-3 px-3 text-right">Total Quantity</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Created By</th>
                    <th className="py-3 px-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredList.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() =>
                        navigate({
                          to: "/inv-receive-direct",
                          search: { mode: "view", id: r.id } as any,
                        })
                      }
                    >
                      <td className="py-3 px-3.5 font-mono font-bold text-primary whitespace-nowrap">
                        {r.mrrNumber}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                        {r.mrrDate}
                      </td>
                      <td className="py-3 px-3 font-semibold text-foreground max-w-[180px] truncate">
                        {r.supplierName}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground max-w-[200px] truncate">
                        {r.storeName}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                        {r.department}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold">
                        {r.totalItems}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-foreground whitespace-nowrap">
                        {r.totalQuantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                        {r.createdBy}
                      </td>
                      <td
                        className="py-3 px-3.5 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewRecord(r)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                            title="Preview Report"
                          >
                            <Printer className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              navigate({
                                to: "/inv-receive-direct",
                                search: { mode: "edit", id: r.id } as any,
                              })
                            }
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs cursor-pointer transition-colors"
                            title="Edit Direct MRR in Edit Mode"
                          >
                            <Pencil className="size-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              navigate({
                                to: "/inv-receive-direct",
                                search: { mode: "view", id: r.id } as any,
                              })
                            }
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-background hover:bg-muted font-bold text-xs cursor-pointer transition-colors"
                            title="View Direct MRR in View Mode"
                          >
                            <Eye className="size-3.5 text-primary" />
                            <span>View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredList.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-muted-foreground">
                        <Package className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                        <div className="font-semibold text-foreground">No Direct MRR Records Found</div>
                        <div className="text-[11px]">
                          No records match your filter criteria.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Standard Preview Report Modal */}
      {previewReportData && (
        <StandardPreviewReportModal
          isOpen={!!previewRecord}
          onClose={() => setPreviewRecord(null)}
          data={previewReportData}
        />
      )}
    </div>
  );
}
