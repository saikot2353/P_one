import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  X,
  Printer,
  Copy,
  CheckCircle2,
  AlertTriangle,
  User,
  UserCheck,
  Check,
  Boxes,
  ShoppingCart,
  Zap,
  Clock,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  StoreImplementationRecord,
  ImplementationStatus,
} from "@/routes/-ssp-implementation-data";

export interface StoreImplementationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: StoreImplementationRecord | null;
  onExecute: (record: StoreImplementationRecord) => void;
  onSendToPurchase: (record: StoreImplementationRecord) => void;
}

export function StoreImplementationModal({
  open,
  onOpenChange,
  record,
  onExecute,
  onSendToPurchase,
}: StoreImplementationModalProps) {
  if (!record) return null;

  const data = record.viewData;
  const items = data.items || [];
  const hasStock = record.hasStock;
  const isExecuted = record.implementationStatus === "Executed";
  const isSentToPurchase = record.implementationStatus === "Sent to Purchase";

  const handleCopyRef = () => {
    if (record.ref) {
      navigator.clipboard.writeText(record.ref);
      toast.success(`Copied Ref: ${record.ref}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden gap-0 max-h-[92vh] flex flex-col [&>button]:hidden text-foreground">
        {/* ─── MODAL TOP HEADER ────────────────────────────────────────── */}
        <div className="border-b border-border bg-muted/25 px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Boxes className="size-4" />
            </span>
            <div>
              <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-foreground">
                Store Requisition Implementation
              </h2>
              <span className="text-[10px] text-muted-foreground font-mono">
                {record.ref} &bull; {record.reqType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {record.onBehalf && (
              <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <UserCheck className="size-3" />
                On Behalf
              </span>
            )}

            {isExecuted ? (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase">
                <CheckCircle2 className="size-3" />
                Executed
              </span>
            ) : isSentToPurchase ? (
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase">
                <ShoppingCart className="size-3" />
                Sent to Purchase
              </span>
            ) : hasStock ? (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase">
                <Check className="size-3" />
                In Stock
              </span>
            ) : (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase">
                <AlertTriangle className="size-3" />
                Out of Stock
              </span>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="size-8 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer"
              title="Print Requisition Docket"
            >
              <Printer className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="size-8 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer"
              title="Close"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* ─── MODAL SCROLLABLE BODY ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-background">
          {/* Document & Employee Details */}
          <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 divide-y md:divide-y-0 md:divide-x divide-border/60">
              {/* Left Column: Requisition Doc Meta */}
              <div className="md:col-span-6 space-y-3 pr-0 md:pr-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs sm:text-sm text-foreground tracking-tight">
                    {data.docCode || "PTVL/REC/STR/02"}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      REVISION:
                    </span>
                    <span className="text-[10px] font-mono font-bold text-foreground bg-muted px-1.5 py-0.2 rounded border border-border">
                      {data.revision || "00"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">Ref:</span>
                    <span className="text-xs font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 select-all">
                      {record.ref}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="p-1 text-muted-foreground hover:text-foreground transition cursor-pointer"
                      title="Copy reference"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>

                  <span className="text-[11px] font-mono font-medium text-muted-foreground">
                    Date: <strong className="text-foreground">{record.date}</strong>
                  </span>
                </div>

                {record.onBehalf && data.requestedBy && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-primary font-bold text-[10.5px] uppercase tracking-wider">
                      <UserCheck className="size-3.5" />
                      <span>Requested On Behalf By</span>
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      {data.requestedBy.name}
                      {data.requestedBy.designation && (
                        <span className="text-muted-foreground font-normal">
                          {" "}• {data.requestedBy.designation}
                        </span>
                      )}
                    </div>
                    {data.requestedBy.empId && (
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Emp ID: {data.requestedBy.empId}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Request For (Employee Details) */}
              <div className="md:col-span-6 pt-4 md:pt-0 pl-0 md:pl-5 space-y-2 text-xs">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <User className="size-3.5 text-primary" />
                  {record.onBehalf ? "Beneficiary Employee:" : "Requester Details:"}
                </span>

                <div className="bg-muted/30 rounded-xl p-3 border border-border/60 space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-foreground">
                        {data.requestFor?.name || record.requesterName}
                      </h4>
                      <p className="text-[11px] font-bold text-primary">
                        {data.requestFor?.designation || record.requesterDept}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block font-mono">
                        Emp ID: <strong className="text-foreground">{data.requestFor?.empId || "2022034013"}</strong>
                      </span>
                      {data.requestFor?.doj && (
                        <span className="text-[9.5px] text-muted-foreground block font-mono">
                          DOJ: {data.requestFor.doj}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 space-y-0.5 text-[11px] text-muted-foreground">
                    <div>
                      <strong className="text-foreground/80">Section:</strong>{" "}
                      {data.requestFor?.section || "Operations"}
                    </div>
                    <div>
                      <strong className="text-foreground/80">Dept:</strong>{" "}
                      {data.requestFor?.dept || record.requesterDept}
                    </div>
                    <div className="font-semibold text-foreground/75 truncate">
                      {data.requestFor?.company || "Pakiza Technovation Limited , PTVL-Operation"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-card rounded-xl border border-border/80 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/70 border-b border-border text-[11px] font-black uppercase text-foreground/90 tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">Grant</th>
                    <th className="py-2.5 px-2 w-10 text-center">#</th>
                    <th className="py-2.5 px-4 min-w-[240px]">Item Description &amp; Justification</th>
                    <th className="py-2.5 px-3 text-right">Store Stock</th>
                    <th className="py-2.5 px-3 text-right">Demand</th>
                    <th className="py-2.5 px-3 text-right">Safety</th>
                    <th className="py-2.5 px-3 text-right">Adjust</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-4 text-center w-28">Approved Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {items.map((row) => {
                    const rowStockNum = parseFloat(row.stock) || 0;
                    const rowDemandNum = parseFloat(row.demand) || 1;
                    const rowHasStock = rowStockNum >= rowDemandNum;

                    return (
                      <tr key={row.sl} className="hover:bg-muted/30 transition-colors">
                        {/* Grant Indicator */}
                        <td className="py-3 px-3 text-center align-top">
                          <div className="size-4.5 rounded border border-border bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                        </td>

                        {/* SL */}
                        <td className="py-3 px-2 text-center align-top font-mono font-bold text-muted-foreground">
                          {row.sl}
                        </td>

                        {/* ItemName & Justification */}
                        <td className="py-3 px-4 align-top space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-foreground text-xs leading-snug">
                              {row.name}
                            </span>
                            {row.category && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
                                {row.category}
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-muted-foreground leading-normal flex items-start gap-1">
                            <strong className="text-foreground shrink-0">Justification:</strong>
                            <span>{row.advJustification}</span>
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-3 text-right align-top font-mono">
                          {rowHasStock ? (
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {row.stock}
                            </span>
                          ) : (
                            <span className="font-bold text-rose-600 dark:text-rose-400">
                              {row.stock}
                            </span>
                          )}
                        </td>

                        {/* Demand */}
                        <td className="py-3 px-3 text-right align-top font-mono font-extrabold text-blue-600 dark:text-blue-400">
                          {row.demand}
                        </td>

                        {/* Safety */}
                        <td className="py-3 px-3 text-right align-top font-mono text-muted-foreground">
                          {row.safety}
                        </td>

                        {/* Adjust */}
                        <td className="py-3 px-3 text-right align-top font-mono text-muted-foreground">
                          {row.adjust}
                        </td>

                        {/* Total */}
                        <td className="py-3 px-3 text-right align-top font-mono font-bold text-foreground">
                          {row.total}
                        </td>

                        {/* ApdQty */}
                        <td className="py-3 px-4 text-center align-top">
                          <div className="inline-flex items-center gap-1.5 justify-center">
                            <div className="w-14 h-7 px-2 rounded-md border border-border bg-card dark:bg-muted/40 font-mono font-bold text-xs text-foreground flex items-center justify-center shadow-2xs">
                              {row.apdQty}
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono">
                              {row.unit}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Bottom Summary Strip */}
            <div className="bg-muted/30 px-4 py-2.5 border-t border-border flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>
                Total Items: <strong className="text-foreground font-mono">{items.length}</strong> lines
              </span>
              <div className="flex items-center gap-4">
                <span>
                  Store Warehouse Availability:{" "}
                  {hasStock ? (
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                      ✓ In Stock ({record.availableStock} Available)
                    </strong>
                  ) : (
                    <strong className="text-rose-600 dark:text-rose-400 font-bold">
                      ⚠ Out of Stock (0 Available)
                    </strong>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MODAL FOOTER ACTION BAR (SENT TO PURCHASE & EXECUTE) ───────── */}
        <div className="border-t border-border bg-muted/20 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          {/* Status Note on Left */}
          <div className="text-xs">
            {isExecuted ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="size-4 shrink-0" />
                Requisition has been Executed. Store items issued to {record.requesterName}.
              </span>
            ) : isSentToPurchase ? (
              <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
                <ShoppingCart className="size-4 shrink-0" />
                Requisition sent to Purchase Module for procurement order placement.
              </span>
            ) : hasStock ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="size-4 shrink-0" />
                Store stock is fully available. Click <strong>Execute</strong> to issue items directly.
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5">
                <AlertTriangle className="size-4 shrink-0" />
                Out of Stock (0 available). Execution disabled. Click <strong>Sent to Purchase</strong> to procure.
              </span>
            )}
          </div>

          {/* Action Buttons on Right */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition cursor-pointer"
            >
              Close
            </button>

            {/* Sent to Purchase Button */}
            <button
              type="button"
              onClick={() => onSendToPurchase(record)}
              className="px-4.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
              title="Forward to Purchase / Procurement module"
            >
              <ShoppingCart className="size-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Sent to Purchase</span>
            </button>

            {/* Execute Button */}
            <button
              type="button"
              onClick={() => onExecute(record)}
              disabled={!hasStock || isExecuted}
              className={`px-5 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-xs ${
                hasStock && !isExecuted
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-[0.98]"
                  : "bg-muted text-muted-foreground/60 border border-border cursor-not-allowed opacity-60"
              }`}
              title={
                !hasStock
                  ? "Cannot execute: Items are out of stock"
                  : isExecuted
                  ? "Already executed"
                  : "Execute requisition and issue stock"
              }
            >
              <Zap className="size-3.5" />
              <span>{isExecuted ? "Executed" : "Execute"}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
