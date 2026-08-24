import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  ShoppingCart,
  DollarSign,
  FileSpreadsheet,
  Printer,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/procurement-config-purchase-option")({
  head: () => ({
    meta: [
      { title: "Purchase Options Configuration — CRIPTON Procurement" },
      { name: "description", content: "Purchase Options Configuration dynamic mock database console." },
    ],
  }),
  component: ProcurementConfigPurchaseOptionPage,
});

function ProcurementConfigPurchaseOptionPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const tableHeaders = ["ID", "Option Title", "Description", "Required Documents", "Approval Levels", "Status"];
  const columnKeys = ["id", "title", "desc", "docs", "approvals", "status"];
  const initialData = [
    {
        "id": "1",
        "title": "L/C Foreign Import",
        "desc": "Import goods via Letter of Credit",
        "docs": "PI, LC Application, Insurance",
        "approvals": "3 Levels",
        "status": "Active"
    },
    {
        "id": "2",
        "title": "Local Cash Purchase",
        "desc": "Spot purchasing for urgent store materials",
        "docs": "Requisition, Cash Receipt",
        "approvals": "1 Level",
        "status": "Active"
    }
];

  const [tableData] = useState<any[]>(initialData);

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      return Object.values(row).some((val) => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [tableData, searchQuery]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <ProcurementTopbar />
        
        <div className="p-3.5 md:p-4.5 lg:p-5 space-y-4 lg:space-y-5 w-full max-w-[1600px] mx-auto">
          {/* Header breadcrumbs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/45 pb-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                <ShoppingCart className="size-5.5 text-amber-500" />
                Purchase Options Configuration
              </h2>
              <p className="text-[10px] text-muted-foreground/80 mt-0.5 font-semibold">
                Procurement Management Workspace &gt; <span className="text-amber-500 font-bold">Purchase Options Configuration</span>
              </p>
            </div>
          </div>

          {/* Table toolbar & search filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 bg-card border border-border/80 p-3.5 rounded-2xl shadow-xs">
              <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9.5 pr-4 h-9 rounded-lg bg-muted/40 border border-border/60 focus:border-amber-500/80 focus:bg-card focus:ring-4 focus:ring-amber-500/10 outline-none text-xs transition-all font-bold"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button className="h-9 px-3.5 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-lg transition-colors border border-border/80 flex items-center gap-1.5 cursor-pointer">
                  <SlidersHorizontal className="size-3.5" /> Filters
                </button>
                <button className="h-9 px-3.5 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-lg transition-colors border border-border/80 flex items-center gap-1.5 cursor-pointer">
                  <Printer className="size-3.5" /> Print
                </button>
                <button className="h-9 px-3.5 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-lg transition-colors border border-border/80 flex items-center gap-1.5 cursor-pointer">
                  <FileSpreadsheet className="size-3.5" /> Export Excel
                </button>
                <button className="h-9 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <Plus className="size-4" /> Add Option
                </button>
              </div>
            </div>

            {/* High Fidelity Table */}
            <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="px-4.5 py-3 border-b border-border/40 bg-muted/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-muted-foreground/75 tracking-wider">
                    Records List
                  </span>
                  <span className="bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-amber-500/20">
                    {filteredData.length} records found
                  </span>
                </div>
                <div className="text-[9.5px] text-muted-foreground/60 font-semibold font-sans">
                  Columns are auto-configured with default CRIPTON styles.
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/40">
                      {tableHeaders.map((header: string) => (
                        <th key={header} className="px-4.5 py-3.5 font-bold border-r border-border/20 last:border-r-0">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/45">
                    {filteredData.map((row: any) => (
                      <tr key={row.id || row.piNo || row.poNo || row.billNo} className="group hover:bg-muted/15 transition-colors cursor-pointer">
                        {columnKeys.map((key: string) => {
                          const value = row[key];
                          const isStatus = key === "status";

                          return (
                            <td key={key} className="px-4.5 py-3.5 font-medium border-r border-border/20 last:border-r-0 max-w-[220px] truncate">
                              {isStatus ? (
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${
                                  value === "Approved" || value === "Active" || value === "Audit Complete" || value === "Verified"
                                    ? "bg-success/15 text-success-foreground"
                                    : value === "Draft"
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-orange-500/10 text-orange-600 border border-orange-500/20"
                                }`}>
                                  {value}
                                </span>
                              ) : (
                                <span className={key === "id" || key === "poNo" || key === "piNo" || key === "billNo" ? "font-bold text-amber-500" : "text-foreground"}>
                                  {value}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <footer className="pt-6 pb-2 text-center text-[10px] font-medium text-muted-foreground/60 border-t border-border/20">
            © 2026 CRIPTON Procurement Management Portal — built with CRIPTON HRIS premium components.
          </footer>
        </div>
      </main>
    </div>
  );
}
