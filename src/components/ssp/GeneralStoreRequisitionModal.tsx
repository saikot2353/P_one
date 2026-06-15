import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, CheckCircle2 } from "lucide-react";

interface GeneralStoreRequisitionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GeneralStoreRequisitionModal({ open, onOpenChange }: GeneralStoreRequisitionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 bg-white border border-border/40 shadow-2xl rounded-lg overflow-hidden gap-0 max-h-[95vh] [&>button]:hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between bg-muted/10 shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-foreground tracking-tight">General Product Store Requisition</h2>
            <p className="text-[11px] text-muted-foreground/80 mt-0.5">Requisition Detail View</p>
          </div>
          <button onClick={() => onOpenChange(false)} className="size-8 rounded-full bg-white hover:bg-muted border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm">
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6 overflow-hidden">

          {/* Reference & Requester Card */}
          <div className="bg-muted/10 border border-border/30 rounded-xl p-4 flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reference No.</p>
              <div className="text-[13px] font-semibold text-foreground bg-white px-2 py-0.5 rounded border border-border/50 shadow-sm w-fit flex flex-col gap-0.5">
                <span>PSL-RQ-GEN-STO-378956</span>
                <span className="text-[10px] text-muted-foreground/70 font-medium">PSL/REC/STR/39</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Submitted By</p>
              <p className="text-[13px] font-semibold text-foreground">Tahmid Afsar</p>
              <p className="text-[11px] text-muted-foreground font-medium">Emp ID: 2023043910 · Asst. Manager</p>
              <p className="text-[11px] text-muted-foreground font-medium">Business Innovation · Rev 00</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-foreground border-b border-border/30 pb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Requisition Items
            </h3>
            <div className="border border-border/30 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-muted/30 text-muted-foreground">
                  <tr>
                    {["#", "Item Name", "Justification", "Req Qty", "Apd Qty", "Status"].map(h => (
                      <th key={h} className="px-4 py-2 font-semibold border-b border-border/30">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground">1</td>
                    <td className="px-4 py-3 font-semibold text-foreground">Pencil Battery (Size: AA)</td>
                    <td className="px-4 py-3 text-muted-foreground">For mouse use</td>
                    <td className="px-4 py-3 font-medium">2.000 PCS</td>
                    <td className="px-4 py-3 font-medium text-blue-600">2.000 PCS</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-bold">Issued</span>
                        <p className="text-[9px] text-muted-foreground/80 font-medium">P: 0.000 · D: 2.000 · S: 0.000</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Approvals Cards */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-foreground border-b border-border/30 pb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Approval Signatures
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { role: "Manager", name: "Md. Zahidul Islam", title: "COO", date: "19 May 2026 · 13:33" },
                { role: "Store", name: "Rajebul Hasan Rajon", title: "Deputy Manager", date: "20 May 2026 · 09:56" },
              ].map(a => (
                <div key={a.role} className="p-3.5 bg-emerald-50/30 border border-emerald-100 rounded-xl flex items-start gap-3">
                  <div className="mt-0.5 bg-emerald-100 p-1.5 rounded-full text-emerald-600">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                      {a.role} Approved
                    </span>
                    <p className="text-[12px] font-bold text-foreground">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 border-t border-border/30 flex justify-between items-center">
            <p className="text-[11px] text-muted-foreground/60 italic">No comments recorded.</p>
            <button className="h-9 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[11px] font-bold transition-colors shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" />
              MARK AS RECEIVED
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
