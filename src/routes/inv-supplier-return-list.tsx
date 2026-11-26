import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  RotateCcw,
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  Building2,
  Package,
  Printer,
  ChevronRight,
  Truck,
  Layers,
  ArrowRight,
  Pencil,
} from "lucide-react";
import {
  SupplierReturn,
  getStoredSupplierReturns,
} from "@/lib/procurement-order-inventory-data";

export const Route = createFileRoute("/inv-supplier-return-list")({
  head: () => ({
    meta: [
      { title: "Supplier Return List — Inventory Management | CRIPTON" },
      {
        name: "description",
        content:
          "View, filter, and track all registered Supplier Return vouchers without approval delays.",
      },
    ],
  }),
  component: SupplierReturnListPage,
});

export function SupplierReturnListPage() {
  const navigate = useNavigate();
  const [returnsList] = useState<SupplierReturn[]>(() => getStoredSupplierReturns());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("All");
  const [selectedReason, setSelectedReason] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const suppliers = useMemo(() => {
    const set = new Set<string>();
    returnsList.forEach((r) => set.add(r.supplierName));
    return Array.from(set);
  }, [returnsList]);

  const reasons = useMemo(() => {
    const set = new Set<string>();
    returnsList.forEach((r) => set.add(r.returnReason));
    return Array.from(set);
  }, [returnsList]);

  const filteredReturns = useMemo(() => {
    return returnsList.filter((ret) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          ret.returnNumber.toLowerCase().includes(q) ||
          ret.poNumber.toLowerCase().includes(q) ||
          ret.mrrNumber.toLowerCase().includes(q) ||
          ret.supplierName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedSupplier !== "All" && ret.supplierName !== selectedSupplier) {
        return false;
      }
      if (selectedReason !== "All" && ret.returnReason !== selectedReason) {
        return false;
      }
      if (dateFrom && ret.returnDate < dateFrom) return false;
      if (dateTo && ret.returnDate > dateTo) return false;
      return true;
    });
  }, [returnsList, searchQuery, selectedSupplier, selectedReason, dateFrom, dateTo]);

  const totalReturnedQty = useMemo(() => {
    return filteredReturns.reduce((sum, r) => sum + (r.totalReturnedQty || 0), 0);
  }, [filteredReturns]);

  const totalReturnValue = useMemo(() => {
    return filteredReturns.reduce((sum, r) => sum + (r.totalReturnValue || 0), 0);
  }, [filteredReturns]);

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
                <span>Inventory</span>
                <ChevronRight className="size-3" />
                <span>Material Receive</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-bold">Supplier Return List</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <RotateCcw className="size-7 text-rose-600" />
                Supplier Return List
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Complete audit ledger of all issued material returns to suppliers. Direct completion without approval workflow.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                <Printer className="size-3.5" /> Print Ledger
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/inv-issue-mrr-return" })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                <Plus className="size-4" /> Supplier Return
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-2xl border border-border/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Returns Issued
              </span>
              <div className="text-2xl font-black font-mono text-foreground">
                {filteredReturns.length} <span className="text-xs text-muted-foreground font-normal">Vouchers</span>
              </div>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Material Units Deducted
              </span>
              <div className="text-2xl font-black font-mono text-rose-600">
                {totalReturnedQty} <span className="text-xs text-muted-foreground font-normal">Units</span>
              </div>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Debit Value
              </span>
              <div className="text-2xl font-black font-mono text-primary">
                ৳ {totalReturnValue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-card p-4 rounded-2xl border border-border/80 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="lg:col-span-2 relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Return No, PO No, MRR No, Supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-muted/30 border border-border rounded-xl outline-none focus:border-primary text-xs"
                />
              </div>

              <div>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-xl outline-none focus:border-primary text-xs cursor-pointer font-medium"
                >
                  <option value="All">All Suppliers</option>
                  {suppliers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-xl outline-none focus:border-primary text-xs cursor-pointer font-medium"
                >
                  <option value="All">All Return Reasons</option>
                  {reasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-1/2 px-2 py-2 bg-muted/30 border border-border rounded-xl outline-none text-xs"
                />
                <span className="text-muted-foreground text-xs">-</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-1/2 px-2 py-2 bg-muted/30 border border-border rounded-xl outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Supplier Return List Table */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                    <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                    <th className="py-2.5 px-3 font-bold w-32">Return ID</th>
                    <th className="py-2.5 px-3 font-bold w-24">Date</th>
                    <th className="py-2.5 px-3 font-bold">Supplier / Vendor</th>
                    <th className="py-2.5 px-3 font-bold w-28">PO Number</th>
                    <th className="py-2.5 px-3 font-bold w-28">MRR Ref</th>
                    <th className="py-2.5 px-3 font-bold w-32">Return Reason</th>
                    <th className="py-2.5 px-3 text-right font-bold w-24">Qty Returned</th>
                    <th className="py-2.5 px-3 text-right font-bold w-28">Total Value</th>
                    <th className="py-2.5 px-3 text-center font-bold w-24">Store</th>
                    <th className="py-2.5 px-3 text-center font-bold w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredReturns.map((ret, idx) => (
                    <tr key={ret.id} className="hover:bg-muted/20">
                      <td className="py-2.5 px-3 text-center text-muted-foreground font-bold">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-rose-600 dark:text-rose-400">
                        {ret.returnNumber}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                        {ret.returnDate}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-foreground">
                        {ret.supplierName}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">
                        {ret.poNumber}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-amber-600 font-semibold">
                        {ret.mrrNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-lg bg-muted text-[11px] font-medium">
                          {ret.returnReason}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                        {ret.totalReturnedQty}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground whitespace-nowrap">
                        ৳ {ret.totalReturnValue.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center text-[11px] text-muted-foreground max-w-[140px] truncate" title={ret.storeName}>
                        {ret.storeName}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            title="Edit Supplier Return"
                            onClick={() =>
                              navigate({
                                to: "/inv-issue-mrr-return",
                                search: { mode: "edit", id: ret.id, returnNo: ret.returnNumber },
                              })
                            }
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-amber-600 hover:border-amber-500/40 hover:bg-amber-500/5 transition-colors cursor-pointer inline-flex items-center justify-center"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            title="View Supplier Return Details"
                            onClick={() =>
                              navigate({
                                to: "/inv-issue-mrr-return",
                                search: { mode: "view", id: ret.id, returnNo: ret.returnNumber },
                              })
                            }
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer inline-flex items-center justify-center"
                          >
                            <Eye className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredReturns.length === 0 && (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-muted-foreground">
                        No supplier return records found. Click &quot;Supplier Return&quot; above to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
