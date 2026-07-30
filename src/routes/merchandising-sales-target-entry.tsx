import { createFileRoute } from "@tanstack/react-router";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import { Percent } from "lucide-react";

export const Route = createFileRoute("/merchandising-sales-target-entry")({
  head: () => ({
    meta: [
      { title: "Sales Target Entry — RMG Merchandising" },
      { name: "description", content: "Monthly factory line efficiency calculations, machine capacities, and booking ledger." },
    ],
  }),
  component: SalesTargetEntryPage,
});

function SalesTargetEntryPage() {
  return (
    <MerchandisingLayout
      activePath="sales-target-entry"
      breadcrumbs={[{ label: "Capacity" }, { label: "Sales Target Entry" }]}
      title="Sales Target Entry Ledger"
    >
      <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6 transition-colors duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 shadow-3xs">
          <div className="size-14 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center mx-auto">
            <Percent size={24} />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Sales Target Entry</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure merchant-wise and buyer-wise sales target values and margins. (Backend integration required)</p>
          </div>

          {/* High-fidelity mock entries */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden max-w-xl mx-auto text-left text-xs font-semibold">
            <div className="bg-slate-50 dark:bg-slate-950 p-3 font-extrabold border-b border-slate-100 dark:border-slate-850 flex justify-between">
              <span className="text-slate-900 dark:text-white">Monthly Target Ledger</span>
              <span className="text-[10px] text-blue-500 font-mono">2026 Target: $12.5M</span>
            </div>
            <div className="p-4 space-y-3">
              {[
                { merchant: "Tariqul Islam (Sr. Merchant)", buyer: "Zara", target: "$4,500,000", status: "Achieved (102%)" },
                { merchant: "Asif Zaman (Merchant)", buyer: "H&M", target: "$5,200,000", status: "On Track (88%)" },
                { merchant: "Rubel Ahmed (Assoc. Merchant)", buyer: "Target", target: "$2,800,000", status: "On Track (91%)" },
              ].map((d, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 text-slate-700 dark:text-slate-350">
                  <div>
                    <div className="font-extrabold text-slate-950 dark:text-white">{d.merchant}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Primary Account: {d.buyer}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-blue-500 font-extrabold">{d.target}</div>
                    <div className={`text-[10px] font-black mt-0.5 uppercase ${d.status.includes("Achieved") ? "text-emerald-500" : "text-amber-500"}`}>{d.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MerchandisingLayout>
  );
}
