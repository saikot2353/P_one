import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { BankBranchSetupView } from "@/components/organization/BankBranchSetupView";

export const Route = createFileRoute("/banks")({
  head: () => ({
    meta: [
      { title: "Bank Setup — CRIPTON ERP" },
      {
        name: "description",
        content:
          "Manage bank masters, corporate branch identities, routing numbers, and linked Chart of Accounts heads.",
      },
    ],
  }),
  component: BanksPage,
});

function BanksPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <BankBranchSetupView />
        </main>
      </div>
    </div>
  );
}
