import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ChevronRight, FileSpreadsheet } from "lucide-react";
import { SalarySheetConfiguration } from "@/components/salary-sheet/SalarySheetConfiguration";

export const Route = createFileRoute("/salary-sheet-configuration")({
  head: () => ({
    meta: [
      { title: "Salary Sheet Configuration — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Configure landscape salary sheet layouts, add/remove columns, customize headers, and map system parameters.",
      },
    ],
  }),
  component: SalarySheetConfigurationPage,
});

export function SalarySheetConfigurationPage() {
  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar />

        <main className="p-4 md:p-6 lg:p-8 space-y-4 max-w-[1800px] w-full mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span>Configure</span>
            <ChevronRight className="size-3.5 text-slate-400" />
            <Link to="/company-setup" className="hover:text-primary transition-colors">
              Company Setup
            </Link>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="text-primary font-bold">Salary Sheet Configuration</span>
          </div>

          <SalarySheetConfiguration />
        </main>
      </div>
    </div>
  );
}

