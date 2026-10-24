import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { FinancialPeriodSetupView } from "@/components/organization/FinancialPeriodSetupView";

export const Route = createFileRoute("/accounts-config/financial-period-setup")({
  head: () => ({
    meta: [
      { title: "Financial Period Setup — CRIPTON ERP" },
      {
        name: "description",
        content:
          "Define accounting fiscal years, effective start and end dates, monthly accounting periods, and transaction locking rules.",
      },
    ],
  }),
  component: FinancialPeriodSetupPage,
});

function FinancialPeriodSetupPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <FinancialPeriodSetupView />
        </main>
      </div>
    </div>
  );
}
