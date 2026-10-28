import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  PackageCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShoppingCart,
  Zap,
  RotateCcw,
  UserCheck,
  FileText,
  Boxes,
  Send,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  StoreImplementationRecord,
  loadImplementationRequisitions,
  saveImplementationRequisitions,
  ImplementationStatus,
} from "./-ssp-implementation-data";
import { StoreImplementationModal } from "@/components/ssp/StoreImplementationModal";

export const Route = createFileRoute("/ssp-implementation")({
  head: () => ({
    meta: [
      { title: "Store Requisition Implementation — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Fulfill approved store requisitions directly from available store inventory or dispatch purchase requisitions to procurement.",
      },
    ],
  }),
  component: SspImplementationPage,
});

export function SspImplementationPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<StoreImplementationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"All" | "InStock" | "OutOfStock">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | ImplementationStatus>("All");
  const [selectedRecord, setSelectedRecord] = useState<StoreImplementationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (record: StoreImplementationRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setRecords(loadImplementationRequisitions());
  }, []);

  // Update records in state and localStorage
  const handleUpdateRecord = (
    id: string,
    newStatus: ImplementationStatus,
    note?: string
  ) => {
    setRecords((prev) => {
      const updated = prev.map((r) => {
        if (r.id !== id) return r;
        const nowStr = new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const newComment = {
          id: "cm-" + Date.now(),
          author: "Tahmid Afsar",
          designation: "Assistant Manager — HR & Admin",
          role: "Store In-Charge",
          date: nowStr,
          text:
            note ||
            (newStatus === "Executed"
              ? "✓ Requisition executed. Items issued from store warehouse to employee."
              : "Requisition sent to Procurement / Purchase department for external purchase ordering."),
        };

        const updatedComments = [newComment, ...(r.viewData.comments || [])];

        const updatedRec = {
          ...r,
          implementationStatus: newStatus,
          executedDate: newStatus === "Executed" ? nowStr : r.executedDate,
          executedBy:
            newStatus === "Executed"
              ? "Tahmid Afsar (Store In-Charge)"
              : r.executedBy,
          sentToPurchaseDate:
            newStatus === "Sent to Purchase" ? nowStr : r.sentToPurchaseDate,
          viewData: {
            ...r.viewData,
            comments: updatedComments,
          },
        };

        if (selectedRecord && selectedRecord.id === id) {
          setSelectedRecord(updatedRec);
        }

        return updatedRec;
      });
      saveImplementationRequisitions(updated);
      return updated;
    });
  };

  // Quick Execute
  const handleQuickExecute = (record: StoreImplementationRecord) => {
    if (!record.hasStock) {
      toast.error(
        `Cannot execute "${record.ref}": Stock is unavailable in store warehouse. Please send to Purchase.`
      );
      return;
    }

    handleUpdateRecord(
      record.id,
      "Executed",
      `✓ Executed by Store Officer. Items (${record.itemsSummary}) issued to ${record.requesterName}.`
    );
    toast.success(
      `✓ Requisition ${record.ref} executed! Stock issued to ${record.requesterName}.`
    );
  };

  // Quick Send to Purchase
  const handleQuickSendToPurchase = (record: StoreImplementationRecord) => {
    handleUpdateRecord(
      record.id,
      "Sent to Purchase",
      `Requisition forwarded to Purchase Module due to zero store warehouse inventory.`
    );
    toast.success(
      `✓ Requisition ${record.ref} forwarded to Purchase Module successfully!`
    );
    // Navigate to purchase requisition
    setTimeout(() => {
      navigate({ to: "/procurement-purchase-requisition" });
    }, 900);
  };

  // Filtered list
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        r.ref.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.requesterName.toLowerCase().includes(q) ||
        r.requesterDept.toLowerCase().includes(q) ||
        r.itemsSummary.toLowerCase().includes(q);

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "InStock" && r.hasStock) ||
        (stockFilter === "OutOfStock" && !r.hasStock);

      const matchesStatus =
        statusFilter === "All" || r.implementationStatus === statusFilter;

      return matchesSearch && matchesStock && matchesStatus;
    });
  }, [records, searchQuery, stockFilter, statusFilter]);

  // Summary counts
  const totalApproved = records.length;
  const inStockCount = records.filter((r) => r.hasStock && r.implementationStatus !== "Executed").length;
  const outOfStockCount = records.filter((r) => !r.hasStock && r.implementationStatus !== "Executed" && r.implementationStatus !== "Sent to Purchase").length;
  const executedCount = records.filter((r) => r.implementationStatus === "Executed").length;
  const sentToPurchaseCount = records.filter((r) => r.implementationStatus === "Sent to Purchase").length;

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full">
          {/* Header & Breadcrumb */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <Link to="/ssp-my-requisition" className="hover:text-primary transition-colors">
                  SSP
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-extrabold">Implementation</span>
              </div>

              <div className="flex items-center gap-2.5 pt-0.5">
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-600">
                  <PackageCheck className="size-5" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                    <span>Store Requisition Implementation</span>
                    <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase">
                      Post-Approval Stage
                    </span>
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Fulfill approved store requisitions directly from available store stock, or forward out-of-stock demands to Purchase.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <Link
                to="/ssp-my-requisition"
                className="px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition flex items-center gap-1.5 shadow-2xs"
              >
                <span>← Requisition List</span>
              </Link>
              <Link
                to="/procurement-purchase-requisition"
                className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition flex items-center gap-1.5 shadow-xs hover:opacity-90"
              >
                <ShoppingCart className="size-3.5" />
                <span>Purchase Module</span>
              </Link>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-3 text-blue-500" />
                Total Approved
              </span>
              <div className="text-2xl font-black text-foreground font-mono">
                {totalApproved}
              </div>
              <p className="text-[10.5px] text-muted-foreground">Store requests cleared</p>
            </div>

            <div className="bg-card border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Boxes className="size-3 text-emerald-600" />
                In Stock (Ready)
              </span>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                {inStockCount}
              </div>
              <p className="text-[10.5px] text-emerald-600/80">Can execute immediately</p>
            </div>

            <div className="bg-card border border-rose-500/20 bg-rose-500/5 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="size-3 text-rose-600" />
                Out of Stock
              </span>
              <div className="text-2xl font-black text-rose-700 dark:text-rose-400 font-mono">
                {outOfStockCount}
              </div>
              <p className="text-[10.5px] text-rose-600/80">Needs purchase forward</p>
            </div>

            <div className="bg-card border border-indigo-500/20 bg-indigo-500/5 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <ShoppingCart className="size-3 text-indigo-600" />
                Sent to Purchase
              </span>
              <div className="text-2xl font-black text-indigo-700 dark:text-indigo-400 font-mono">
                {sentToPurchaseCount}
              </div>
              <p className="text-[10.5px] text-indigo-600/80">In procurement pipeline</p>
            </div>

            <div className="bg-card border border-primary/20 bg-primary/5 rounded-2xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <CheckCircle2 className="size-3 text-primary" />
                Executed (Issued)
              </span>
              <div className="text-2xl font-black text-primary font-mono">
                {executedCount}
              </div>
              <p className="text-[10.5px] text-muted-foreground">Store inventory issued</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Ref ID, requester, department, or item name..."
                className="w-full h-9.5 pl-9 pr-3 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:border-primary transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Stock Filter */}
              <div className="flex items-center gap-1.5 bg-muted/30 p-1 rounded-xl border border-border/60">
                <span className="text-[10px] font-bold uppercase text-muted-foreground px-2">
                  Stock:
                </span>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="h-7 px-2.5 rounded-lg bg-background text-xs font-semibold text-foreground border-0 outline-none cursor-pointer"
                >
                  <option value="All">All Stock</option>
                  <option value="InStock">In Stock (Available)</option>
                  <option value="OutOfStock">Out of Stock (Zero)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-muted/30 p-1 rounded-xl border border-border/60">
                <span className="text-[10px] font-bold uppercase text-muted-foreground px-2">
                  Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="h-7 px-2.5 rounded-lg bg-background text-xs font-semibold text-foreground border-0 outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Ready to Execute">Ready to Execute</option>
                  <option value="Needs Purchase">Needs Purchase</option>
                  <option value="Sent to Purchase">Sent to Purchase</option>
                  <option value="Executed">Executed</option>
                </select>
              </div>

              {(searchQuery || stockFilter !== "All" || statusFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStockFilter("All");
                    setStatusFilter("All");
                  }}
                  className="h-9 px-3 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Approved Store Requisitions Table */}
          <div className="bg-card border border-border/80 rounded-2xl shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Approved Requisitions Queue ({filteredRecords.length})
                </h3>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Showing all approved requisitions ready for execution or purchase
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="py-3 px-4">Ref / Docket ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Requester & Dept</th>
                    <th className="py-3 px-4">Items & Demand</th>
                    <th className="py-3 px-4 text-center">Store Stock</th>
                    <th className="py-3 px-4 text-center">Implementation Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        <PackageCheck className="size-8 mx-auto mb-2 opacity-40" />
                        <p className="font-semibold text-xs">No approved store requisitions found</p>
                        <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                          Try adjusting search keywords or filter criteria.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* Ref / ID */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(r)}
                            className="font-mono font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer text-left"
                            title="Click to view requisition modal"
                          >
                            <span>{r.ref}</span>
                            <FileText className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                          </button>
                          <span className="text-[10px] text-muted-foreground font-mono block mt-0.5">
                            ID: {r.id} &bull; {r.reqType}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3 px-4 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                          {r.date}
                        </td>

                        {/* Requester & Dept */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-foreground">
                            {r.requesterName}
                          </div>
                          <div className="text-[10.5px] text-muted-foreground truncate max-w-[200px]">
                            {r.requesterDept}
                          </div>
                          {r.onBehalf && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded mt-0.5">
                              <UserCheck className="size-2.5" />
                              {r.onBehalfFor || "On Behalf"}
                            </span>
                          )}
                        </td>

                        {/* Items & Demand */}
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-medium text-foreground line-clamp-2">
                            {r.itemsSummary}
                          </p>
                          <span className="text-[10px] font-bold text-muted-foreground/80 mt-0.5 block">
                            Total Demand: {r.totalDemand}
                          </span>
                        </td>

                        {/* Store Stock */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {r.hasStock ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              In Stock ({r.availableStock} Avail)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/25">
                              <span className="size-1.5 rounded-full bg-rose-500" />
                              Out of Stock (0 Avail)
                            </span>
                          )}
                        </td>

                        {/* Implementation Status */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {r.implementationStatus === "Executed" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                              <CheckCircle2 className="size-3" />
                              Executed
                            </span>
                          ) : r.implementationStatus === "Sent to Purchase" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/25">
                              <ShoppingCart className="size-3" />
                              Sent to Purchase
                            </span>
                          ) : r.hasStock ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <Zap className="size-3" />
                              Ready to Execute
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              <Clock className="size-3" />
                              Needs Purchase
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Requisition button (opens modal without approval/comments) */}
                            <button
                              type="button"
                              onClick={() => handleOpenModal(r)}
                              className="px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-[11px] font-semibold text-foreground transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                              title="View requisition modal"
                            >
                              <FileText className="size-3 text-primary" />
                              <span>View</span>
                            </button>

                            {/* Sent to Purchase button */}
                            {r.implementationStatus !== "Executed" &&
                              r.implementationStatus !== "Sent to Purchase" && (
                                <button
                                  type="button"
                                  onClick={() => handleQuickSendToPurchase(r)}
                                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                                  title="Send to Purchase Module"
                                >
                                  <ShoppingCart className="size-3" />
                                  <span>Sent to Purchase</span>
                                </button>
                              )}

                            {/* Execute button */}
                            {r.implementationStatus !== "Executed" && (
                              <button
                                type="button"
                                disabled={!r.hasStock}
                                onClick={() => handleQuickExecute(r)}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs transition ${
                                  r.hasStock
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                    : "bg-muted text-muted-foreground cursor-not-allowed border border-border/70 opacity-60"
                                }`}
                                title={
                                  r.hasStock
                                    ? "Execute & Issue from Store"
                                    : "Cannot execute: Out of Stock"
                                }
                              >
                                <Zap className="size-3" />
                                <span>Execute</span>
                              </button>
                            )}
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

        {/* Modal for Store Requisition Implementation View */}
        <StoreImplementationModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          record={selectedRecord}
          onExecute={handleQuickExecute}
          onSendToPurchase={handleQuickSendToPurchase}
        />
      </main>
    </div>
  );
}
