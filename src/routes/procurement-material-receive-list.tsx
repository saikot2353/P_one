import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  ShieldCheck,
  Building2,
  Calendar,
  Search,
  Filter,
  Eye,
  ArrowRight,
  Package,
  Wrench,
  CheckCircle2,
  Clock,
  ChevronRight,
  RotateCcw,
  Truck,
  Layers,
  X,
  FileSpreadsheet,
  Printer,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_WAREHOUSES, DEFAULT_SUPPLIERS } from "@/lib/procurement-master-data";
import {
  MaterialReceiveListItem,
  MaterialReceive,
  getStoredReceiveList,
  setStoredReceiveList,
  getStoredPurchaseOrders,
  getStoredMaterialReceipts,
} from "@/lib/procurement-order-inventory-data";

export const Route = createFileRoute("/procurement-material-receive-list")({
  head: () => ({
    meta: [
      { title: "Material Receive List — CRIPTON Procurement" },
      {
        name: "description",
        content:
          "Store-wise material receiving list for approved Purchase Orders and Work Orders across Pending, Partial, and Complete statuses.",
      },
    ],
  }),
  component: MaterialReceiveListPage,
});

export function MaterialReceiveListPage() {
  const navigate = useNavigate();
  const [receiveRecords, setReceiveRecords] = useState<MaterialReceiveListItem[]>(() =>
    getStoredReceiveList()
  );

  // Filters State
  const [selectedStore, setSelectedStore] = useState<string>("All Stores");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("All Organizations");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("All Suppliers");
  const [selectedDocType, setSelectedDocType] = useState<string>("All");
  const [poSearch, setPoSearch] = useState<string>("");
  const [orderDateFrom, setOrderDateFrom] = useState<string>("");
  const [orderDateTo, setOrderDateTo] = useState<string>("");
  const [deliveryDateFrom, setDeliveryDateFrom] = useState<string>("");
  const [deliveryDateTo, setDeliveryDateTo] = useState<string>("");
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [drillDownInfo, setDrillDownInfo] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const org = sp.get("company") || sp.get("organization");
    const dept = sp.get("department");
    const supp = sp.get("supplier");
    const ret = sp.get("returnTo");

    if (org && org !== "All" && org !== "All Organizations") setSelectedOrganization(org);
    if (dept && dept !== "All" && dept !== "All Departments") setSelectedDepartment(dept);
    if (supp && supp !== "All" && supp !== "All Suppliers") {
      setSelectedSupplier(supp);
      setDrillDownInfo(`Filtered for Supplier: ${supp}`);
    }

    if (ret) setReturnTo(ret);
  }, []);

  // Tabs State: "Pending" | "Partial" | "Complete"
  const [activeTab, setActiveTab] = useState<"Pending" | "Partial" | "Complete">("Pending");

  // View Modal State
  const [viewRecord, setViewRecord] = useState<MaterialReceiveListItem | null>(null);

  // State for PO-wise Material Receive Transactions Modal ("D" button)
  const [selectedPoForReceipts, setSelectedPoForReceipts] = useState<MaterialReceiveListItem | null>(null);
  const [isReceiptsModalOpen, setIsReceiptsModalOpen] = useState(false);
  const [materialReceipts, setMaterialReceipts] = useState<MaterialReceive[]>(() =>
    getStoredMaterialReceipts()
  );

  // Refresh stored material receipts whenever modal opens
  useEffect(() => {
    if (isReceiptsModalOpen) {
      setMaterialReceipts(getStoredMaterialReceipts());
    }
  }, [isReceiptsModalOpen]);

  const poMatchingReceipts = useMemo(() => {
    if (!selectedPoForReceipts) return [];
    return materialReceipts.filter(
      (r) => r.poNumber === selectedPoForReceipts.poNumber
    );
  }, [materialReceipts, selectedPoForReceipts]);

  // Tab Counts
  const tabCounts = useMemo(() => {
    let p = 0;
    let part = 0;
    let c = 0;
    receiveRecords.forEach((r) => {
      if (r.receiveStatus === "Pending") p++;
      else if (r.receiveStatus === "Partial") part++;
      else if (r.receiveStatus === "Complete") c++;
    });
    return { pending: p, partial: part, complete: c };
  }, [receiveRecords]);

  // Filtered Records
  const filteredList = useMemo(() => {
    return receiveRecords.filter((rec) => {
      // Primary Tab Filter
      if (rec.receiveStatus !== activeTab) return false;

      // Primary Store Filter
      if (selectedStore !== "All Stores" && rec.deliveryStore !== selectedStore) {
        return false;
      }

      // Supplier Filter
      if (selectedSupplier !== "All Suppliers" && rec.supplierName !== selectedSupplier) {
        return false;
      }

      // Doc Type Filter
      if (selectedDocType !== "All" && rec.documentType !== selectedDocType) {
        return false;
      }

      // PO No Search
      if (poSearch && !rec.poNumber.toLowerCase().includes(poSearch.toLowerCase())) {
        return false;
      }

      // Date Ranges
      if (orderDateFrom && rec.orderDate < orderDateFrom) return false;
      if (orderDateTo && rec.orderDate > orderDateTo) return false;
      if (deliveryDateFrom && rec.expectedDeliveryDate < deliveryDateFrom) return false;
      if (deliveryDateTo && rec.expectedDeliveryDate > deliveryDateTo) return false;

      return true;
    });
  }, [
    receiveRecords,
    activeTab,
    selectedStore,
    selectedSupplier,
    selectedDocType,
    poSearch,
    orderDateFrom,
    orderDateTo,
    deliveryDateFrom,
    deliveryDateTo,
  ]);

  const handleResetFilters = () => {
    setSelectedStore("All Stores");
    setSelectedOrganization("All Organizations");
    setSelectedDepartment("All Departments");
    setSelectedSupplier("All Suppliers");
    setSelectedDocType("All");
    setPoSearch("");
    setOrderDateFrom("");
    setOrderDateTo("");
    setDeliveryDateFrom("");
    setDeliveryDateTo("");
    toast.info("Filters reset to default");
  };

  const handleInitiateReceive = (rec: MaterialReceiveListItem) => {
    toast.info(`Initiating Material Receive for order ${rec.poNumber}...`);
    // Navigate to inventory receive form with query params
    navigate({
      to: "/inv-receive-mrr",
      search: { poNumber: rec.poNumber, warehouse: rec.deliveryStore } as any,
    });
  };

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {returnTo && (
            <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200 text-teal-950 px-4 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-600 text-white shadow-xs">
                  <ArrowLeft className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-900">
                      Procurement Dashboard Drill-Down
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800 border border-teal-200">
                      Stage: Material Receipt (MRR)
                    </span>
                  </div>
                  <p className="text-xs text-teal-700 font-medium mt-0.5">
                    {drillDownInfo ? drillDownInfo : "Viewing material receipt transactions from the Procurement Workflow."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate({ to: returnTo as any })}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
              >
                <ArrowLeft className="size-3.5" /> Back to Dashboard
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-1">
                <span>Inventory Management</span>
                <ChevronRight className="size-3" />
                <span>Material Receive</span>
                <ChevronRight className="size-3" />
                <span className="text-amber-500 font-bold">Material Receive List</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <Truck className="size-7 text-amber-500" />
                Material Receive — Pending / Partial / Complete List
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                <Printer className="size-3.5" /> Print Ledger
              </button>
            </div>
          </div>

          {/* Store-wise Filter / Header Section */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Store-Wise Filters & Search Criteria
                </h2>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3" /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              {/* Delivery Store (PRIMARY FILTER) */}
              <div>
                <label className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
                  Delivery Store *
                </label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full px-3 py-2 bg-amber-500/5 border-2 border-amber-500/30 rounded-xl font-bold text-xs text-foreground outline-none focus:border-amber-500 cursor-pointer shadow-xs"
                >
                  <option value="All Stores">All Delivery Stores / Warehouses</option>
                  {DEFAULT_WAREHOUSES.map((wh) => (
                    <option key={wh.id} value={wh.storeName}>
                      {wh.storeName} ({wh.storeCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Supplier / Vendor */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Supplier / Vendor
                </label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl font-medium outline-none"
                >
                  <option value="All Suppliers">All Suppliers</option>
                  {DEFAULT_SUPPLIERS.map((s) => (
                    <option key={s.id} value={s.vendorName}>
                      {s.vendorName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Document Type */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Document Type
                </label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl font-medium outline-none"
                >
                  <option value="All">All Document Types</option>
                  <option value="Purchase Order">Purchase Order</option>
                  <option value="Work Order">Work Order</option>
                </select>
              </div>

              {/* PO/WO No. Search */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  PO / WO No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. PO-2026-0001"
                  value={poSearch}
                  onChange={(e) => setPoSearch(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl font-medium outline-none font-mono text-xs"
                />
              </div>

              {/* Order Date From */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Order Date From
                </label>
                <input
                  type="date"
                  value={orderDateFrom}
                  onChange={(e) => setOrderDateFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl font-medium text-xs outline-none"
                />
              </div>

              {/* Order Date To */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Order Date To
                </label>
                <input
                  type="date"
                  value={orderDateTo}
                  onChange={(e) => setOrderDateTo(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl font-medium text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Status Tabs: Pending, Partial, Complete */}
          <div className="flex border-b border-border/80 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("Pending")}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "Pending"
                  ? "border-amber-500 text-amber-600 bg-amber-500/5 rounded-t-xl"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="size-4" />
              <span>Pending Receiving</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-600 font-black">
                {tabCounts.pending}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("Partial")}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "Partial"
                  ? "border-blue-500 text-blue-600 bg-blue-500/5 rounded-t-xl"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="size-4" />
              <span>Partial Receiving</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-600 font-black">
                {tabCounts.partial}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("Complete")}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "Complete"
                  ? "border-emerald-500 text-emerald-600 bg-emerald-500/5 rounded-t-xl"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckCircle2 className="size-4" />
              <span>Complete Receiving</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 font-black">
                {tabCounts.complete}
              </span>
            </button>
          </div>

          {/* 3. Main Receiving Table */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                    <th className="py-3 px-3 w-10 text-center font-bold">SL</th>
                    <th className="py-3 px-3 font-bold">PO / WO No.</th>
                    <th className="py-3 px-3 font-bold">Document Type</th>
                    <th className="py-3 px-3 font-bold">Order Date</th>
                    <th className="py-3 px-3 font-bold">Supplier / Vendor</th>
                    <th className="py-3 px-3 font-bold">Delivery Store</th>
                    <th className="py-3 px-3 font-bold">Exp. Delivery</th>
                    <th className="py-3 px-3 text-right font-bold">Total Ordered</th>
                    <th className="py-3 px-3 text-right font-bold">Prev Received</th>
                    <th className="py-3 px-3 text-right font-bold">Pending Qty</th>
                    <th className="py-3 px-3 text-center font-bold">Status</th>
                    <th className="py-3 px-3 text-center font-bold w-14">View</th>
                    <th className="py-3 px-3 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredList.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 text-center text-muted-foreground font-bold">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-foreground">
                        {row.poNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          {row.documentType === "Purchase Order" ? (
                            <Package className="size-3 text-amber-500" />
                          ) : (
                            <Wrench className="size-3 text-cyan-500" />
                          )}
                          {row.documentType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{row.orderDate}</td>
                      <td className="py-3 px-3 font-semibold text-foreground truncate max-w-[180px]">
                        {row.supplierName}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground truncate max-w-[200px]">
                        {row.deliveryStore}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {row.expectedDeliveryDate}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-foreground">
                        {row.totalOrderedQty}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-muted-foreground">
                        {row.previouslyReceivedQty}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-600">
                        {row.pendingQty}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            row.receiveStatus === "Complete"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : row.receiveStatus === "Partial"
                              ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          }`}
                        >
                          {row.receiveStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPoForReceipts(row);
                            setIsReceiptsModalOpen(true);
                          }}
                          className="size-7 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white font-black text-xs transition-all shadow-2xs border border-amber-500/30 inline-flex items-center justify-center cursor-pointer active:scale-95"
                          title={`View Material Receive transactions for ${row.poNumber}`}
                        >
                          D
                        </button>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Receive Button (Only for Pending & Partial records) */}
                          {row.receiveStatus !== "Complete" ? (
                            <button
                              type="button"
                              onClick={() => handleInitiateReceive(row)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10.5px] cursor-pointer shadow-xs transition-all"
                            >
                              <Truck className="size-3" /> Receive
                            </button>
                          ) : (
                            <span className="text-muted-foreground text-xs font-mono">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredList.length === 0 && (
                    <tr>
                      <td colSpan={13} className="py-12 text-center text-muted-foreground">
                        No orders currently in the &quot;{activeTab}&quot; receiving stage matching the selected store and filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* View Detail Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-xl rounded-2xl border border-border shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Order Details — {viewRecord.poNumber}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {viewRecord.documentType} • {viewRecord.deliveryStore}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-muted/20 p-4 rounded-xl border border-border">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">
                    Supplier Name
                  </span>
                  <span className="font-bold text-foreground">{viewRecord.supplierName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">
                    Order Date
                  </span>
                  <span className="font-semibold text-foreground">{viewRecord.orderDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">
                    Delivery Warehouse
                  </span>
                  <span className="font-semibold text-foreground">{viewRecord.deliveryStore}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">
                    Expected Delivery Date
                  </span>
                  <span className="font-semibold text-foreground">
                    {viewRecord.expectedDeliveryDate}
                  </span>
                </div>
              </div>

              <div className="border-t border-border/60 pt-3 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-card rounded-lg border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase block">
                    Ordered Qty
                  </span>
                  <span className="text-sm font-black font-mono">{viewRecord.totalOrderedQty}</span>
                </div>
                <div className="p-2 bg-card rounded-lg border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase block">
                    Received Qty
                  </span>
                  <span className="text-sm font-black font-mono text-emerald-600">
                    {viewRecord.previouslyReceivedQty}
                  </span>
                </div>
                <div className="p-2 bg-card rounded-lg border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase block">
                    Pending Qty
                  </span>
                  <span className="text-sm font-black font-mono text-amber-600">
                    {viewRecord.pendingQty}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
              >
                Close
              </button>
              {viewRecord.receiveStatus !== "Complete" && (
                <button
                  type="button"
                  onClick={() => {
                    const rec = viewRecord;
                    setViewRecord(null);
                    handleInitiateReceive(rec);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 text-white cursor-pointer"
                >
                  Proceed to Receive
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Material Receive Transactions Modal (Triggered by "D" button in View Column) */}
      {isReceiptsModalOpen && selectedPoForReceipts && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-3.5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                  <FileSpreadsheet className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Material Receive Transactions
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Receipt transactions for Purchase Order{" "}
                    <span className="font-mono font-bold text-foreground">
                      {selectedPoForReceipts.poNumber}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsReceiptsModalOpen(false);
                  setSelectedPoForReceipts(null);
                }}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Receipts List Table */}
            {poMatchingReceipts.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                      <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                      <th className="py-2.5 px-4 font-bold">Receive No</th>
                      <th className="py-2.5 px-4 font-bold">Receive Date</th>
                      <th className="py-2.5 px-3 text-center font-bold w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {poMatchingReceipts.map((receipt, rIdx) => (
                      <tr key={receipt.id || rIdx} className="hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-3 text-center text-muted-foreground font-bold">
                          {rIdx + 1}
                        </td>
                        <td className="py-2.5 px-4">
                          <button
                            type="button"
                            onClick={() => {
                              setIsReceiptsModalOpen(false);
                              navigate({
                                to: "/inv-receive-mrr",
                                search: {
                                  mode: "edit",
                                  poNumber: selectedPoForReceipts.poNumber,
                                  receiveNo: receipt.receiveNumber,
                                  warehouse: receipt.warehouseStore || selectedPoForReceipts.deliveryStore,
                                } as any,
                              });
                            }}
                            className="font-mono font-bold text-amber-600 hover:text-amber-700 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                            title={`Open ${receipt.receiveNumber} in Edit Mode`}
                          >
                            <span>{receipt.receiveNumber}</span>
                            <ChevronRight className="size-3" />
                          </button>
                        </td>
                        <td className="py-2.5 px-4 text-muted-foreground font-medium">
                          {receipt.receiveDate}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setIsReceiptsModalOpen(false);
                              navigate({
                                to: "/inv-receive-mrr",
                                search: {
                                  mode: "view",
                                  poNumber: selectedPoForReceipts.poNumber,
                                  receiveNo: receipt.receiveNumber,
                                  warehouse: receipt.warehouseStore || selectedPoForReceipts.deliveryStore,
                                } as any,
                              });
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                            title="View Material Receive (Read-Only Mode)"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 px-4 rounded-xl border border-dashed border-border bg-muted/20 space-y-2">
                <div className="size-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <Package className="size-5" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  No Material Receive Transactions Found
                </h4>
                <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
                  No Material Receive transactions have been created yet against Purchase Order{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {selectedPoForReceipts.poNumber}
                  </span>
                  . Transactions will appear here once goods are received.
                </p>
                {selectedPoForReceipts.receiveStatus !== "Complete" && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const rec = selectedPoForReceipts;
                        setIsReceiptsModalOpen(false);
                        handleInitiateReceive(rec);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs transition-all"
                    >
                      <Truck className="size-3.5" /> Receive Goods Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-[11px] text-muted-foreground">
                Total Receipts Found:{" "}
                <span className="font-bold text-foreground font-mono">
                  {poMatchingReceipts.length}
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsReceiptsModalOpen(false);
                  setSelectedPoForReceipts(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
