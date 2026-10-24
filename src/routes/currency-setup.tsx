import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { CurrencySetupView } from "@/components/organization/CurrencySetupView";

export const Route = createFileRoute("/currency-setup")({
  head: () => ({
    meta: [
      { title: "Currency Setup — CRIPTON ERP" },
      {
        name: "description",
        content:
          "Manage configured currencies, base currency rules, and daily exchange rates.",
      },
    ],
  }),
  component: CurrencySetupPage,
});

function CurrencySetupPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <CurrencySetupView />
        </main>
      </div>
    </div>
  );
}
