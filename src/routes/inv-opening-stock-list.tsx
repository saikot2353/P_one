import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  Boxes,
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  AlertTriangle,
  Calendar,
  Building2,
  Package,
  Printer,
  ChevronRight,
  Truck,
  Layers,
  MapPin,
  X,
} from "lucide-react";
import {
  OpeningStockRecord,
  getStoredOpeningStocks,
  setStoredOpeningStocks,
} from "@/lib/procurement-order-inventory-data";
import { toast } from "sonner";

export const Route = createFileRoute("/inv-opening-stock-list")({
  head: () => ({
    meta: [
      { title: "Opening Stock List — Inventory Management | CRIPTON" },
      {
        name: "description",
        content:
          "View, filter, and inspect registered warehouse opening stock vouchers with batch, location, and item breakdown details.",
      },
    ],
  }),
  component: OpeningStockListPage,
});

export function OpeningStockListPage() {
  const navigate = useNavigate();
  const [openingRecords, setOpeningRecords] = useState<OpeningStockRecord[]>(() => getStoredOpeningStocks());
  const [recordToDelete, setRecordToDelete] = useState<OpeningStockRecord | null>(null);

  // Sync state with Local Storage
  useEffect(() => {
    setOpeningRecords(getStoredOpeningStocks());
  }, []);

  const handleConfirmDelete = () => {
    if (!recordToDelete) return;
    const updated = openingRecords.filter((r) => r.id !== recordToDelete.id);
    setOpeningRecords(updated);
    setStoredOpeningStocks(updated);
    toast.success(`Opening Stock "${recordToDelete.openingStockId}" deleted successfully.`);
    setRecordToDelete(null);
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [viewRecord, setViewRecord] = useState<OpeningStockRecord | null>(null);

  const stores = useMemo(() => {
    const set = new Set<string>();
    openingRecords.forEach((r) => set.add(r.storeName));
    return Array.from(set);
  }, [openingRecords]);

  const filteredRecords = useMemo(() => {
    return openingRecords.filter((rec) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          rec.openingStockId.toLowerCase().includes(q) ||
          rec.storeName.toLowerCase().includes(q) ||
          rec.organization.toLowerCase().includes(q) ||
          (rec.items &&
            rec.items.some(
              (i) =>
                i.itemName.toLowerCase().includes(q) ||
                i.itemCode.toLowerCase().includes(q) ||
                (i.batchNumber && i.batchNumber.toLowerCase().includes(q)) ||
                (i.location && i.location.toLowerCase().includes(q))
            ));
        if (!matches) return false;
      }

      if (selectedStore !== "All" && rec.storeName !== selectedStore) {
        return false;
      }

      if (dateFrom && rec.stockDate < dateFrom) return false;
      if (dateTo && rec.stockDate > dateTo) return false;

      return true;
    });
  }, [openingRecords, searchQuery, selectedStore, dateFrom, dateTo]);

  const totalQuantitySum = useMemo(() => {
    return filteredRecords.reduce((sum, r) => sum + (r.totalQuantity || 0), 0);
  }, [filteredRecords]);

  const totalValuationSum = useMemo(() => {
    return filteredRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
  }, [filteredRecords]);

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          <div className="w-full max-w-[1550px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-1">
                <span>Inventory</span>
                <ChevronRight className="size-3" />
                <span>Material Receive</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-bold">Opening Stock List</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <Boxes className="size-7 text-primary" />
                Opening Stock List
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Store-wise warehouse opening stock register with batch/location data, item-level valuation, and ledger auditing.
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
                onClick={() => navigate({ to: "/inv-yarn-opening-stock" })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all cursor-pointer"
              >
                <Plus className="size-4" /> New Opening Stock
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-2xl border border-border/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Opening Vouchers
              </span>
              <div className="text-2xl font-black font-mono text-foreground">
                {filteredRecords.length} <span className="text-xs text-muted-foreground font-normal">Registered</span>
              </div>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Units Initialized
              </span>
              <div className="text-2xl font-black font-mono text-primary">
                {totalQuantitySum.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">Units</span>
              </div>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Opening Valuation
              </span>
              <div className="text-2xl font-black font-mono text-foreground">
                ৳ {totalValuationSum.toLocaleString()}
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
                  placeholder="Search by ID, Store, Item Name, Batch, Location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-muted/30 border border-border rounded-xl outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="lg:col-span-2">
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-xl outline-none focus:border-primary text-xs cursor-pointer font-medium"
                >
                  <option value="All">All Warehouses / Stores</option>
                  {stores.map((s) => (
                    <option key={s} value={s}>
                      {s}
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

          {/* Opening Stock Register Table */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                    <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                    <th className="py-2.5 px-3 font-bold w-32">Opening Stock ID</th>
                    <th className="py-2.5 px-3 font-bold w-24">Date</th>
                    <th className="py-2.5 px-3 font-bold">Warehouse / Store</th>
                    <th className="py-2.5 px-3 font-bold">Item Summary</th>
                    <th className="py-2.5 px-3 text-right font-bold w-24">Item Count</th>
                    <th className="py-2.5 px-3 text-right font-bold w-28">Total Qty</th>
                    <th className="py-2.5 px-3 text-right font-bold w-32">Total Valuation</th>
                    <th className="py-2.5 px-3 text-center font-bold w-28 whitespace-nowrap">Transaction Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRecords.map((rec, idx) => {
                    const firstItem = rec.items?.[0];
                    const moreItemsCount = (rec.items?.length || 0) - 1;

                    return (
                      <tr key={rec.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 text-center text-muted-foreground font-bold">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">
                          {rec.openingStockId}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                          {rec.stockDate}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-foreground max-w-[200px] truncate" title={rec.storeName}>
                          {rec.storeName}
                          <span className="text-[10px] text-muted-foreground block font-normal">{rec.organization}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          {firstItem ? (
                            <div className="space-y-0.5">
                              <span className="font-bold text-foreground">
                                {firstItem.itemName} ({firstItem.openingQuantity} {firstItem.uom})
                              </span>
                              {moreItemsCount > 0 && (
                                <div className="text-[10.5px] text-muted-foreground">
                                  <span className="font-semibold text-primary">
                                    +{moreItemsCount} more item(s)
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">General Inventory</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                          {rec.totalItems}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-primary">
                          {rec.totalQuantity.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground whitespace-nowrap">
                          ৳ {rec.totalValue.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View Button */}
                            <button
                              type="button"
                              onClick={() =>
                                navigate({
                                  to: "/inv-yarn-opening-stock",
                                  search: { mode: "view", id: rec.id, voucherNo: rec.openingStockId },
                                })
                              }
                              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-colors inline-flex items-center justify-center"
                              title="View Opening Stock Form"
                            >
                              <Eye className="size-3.5" />
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() =>
                                navigate({
                                  to: "/inv-yarn-opening-stock",
                                  search: { mode: "edit", id: rec.id, voucherNo: rec.openingStockId },
                                })
                              }
                              className="p-1.5 rounded-lg border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer transition-colors inline-flex items-center justify-center"
                              title="Edit Opening Stock Balance"
                            >
                              <Pencil className="size-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setRecordToDelete(rec)}
                              className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors inline-flex items-center justify-center"
                              title="Delete Opening Stock Record"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-muted-foreground">
                        No opening stock records found. Click &quot;New Opening Stock&quot; to initialize warehouse stock.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </main>
      </div>

      {/* View Detail Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-3xl rounded-2xl border border-border shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Opening Stock Dossier — {viewRecord.openingStockId}
                </h3>
                <span className="text-xs text-muted-foreground">
                  Store: {viewRecord.storeName} ({viewRecord.organization}) • Date: {viewRecord.stockDate}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-muted/20 p-3 rounded-xl border border-border text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block font-bold">Total Items</span>
                <span className="font-bold text-foreground">{viewRecord.totalItems}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block font-bold">Total Quantity</span>
                <span className="font-mono font-bold text-primary">{viewRecord.totalQuantity.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block font-bold">Total Valuation</span>
                <span className="font-mono font-bold text-foreground">৳ {viewRecord.totalValue.toLocaleString()}</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border sticky top-0">
                  <tr>
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5">Batch No.</th>
                    <th className="p-2.5">Location</th>
                    <th className="p-2.5 text-right">Quantity</th>
                    <th className="p-2.5 text-right">Unit Cost</th>
                    <th className="p-2.5 text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {viewRecord.items.map((i) => (
                    <tr key={i.id} className="hover:bg-muted/10">
                      <td className="p-2.5">
                        <span className="font-bold text-foreground block">{i.itemName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{i.itemCode}</span>
                      </td>
                      <td className="p-2.5 font-mono text-purple-600 font-semibold">{i.batchNumber || "—"}</td>
                      <td className="p-2.5 text-blue-600 font-medium">{i.location || "—"}</td>
                      <td className="p-2.5 text-right font-mono font-bold">{i.openingQuantity} {i.uom}</td>
                      <td className="p-2.5 text-right font-mono">৳ {i.unitCost.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-mono font-bold">৳ {i.totalValue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Confirm Delete</h3>
                <p className="text-xs text-muted-foreground">Opening Stock Removal</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Voucher ID:</span>
                <span className="font-mono font-bold text-foreground">{recordToDelete.openingStockId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Store / Warehouse:</span>
                <span className="font-semibold text-foreground truncate max-w-[220px]" title={recordToDelete.storeName}>
                  {recordToDelete.storeName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Quantity:</span>
                <span className="font-mono font-bold text-primary">
                  {recordToDelete.totalQuantity.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Valuation:</span>
                <span className="font-mono font-bold text-foreground">
                  ৳ {recordToDelete.totalValue.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete Opening Stock voucher <strong className="text-foreground">{recordToDelete.openingStockId}</strong>? This action will permanently remove this record from the register.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
