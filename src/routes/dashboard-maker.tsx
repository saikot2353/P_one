import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { DashboardMakerView } from "@/components/dashboard-maker/DashboardMakerView";

export const Route = createFileRoute("/dashboard-maker")({
  head: () => ({
    meta: [
      { title: "Dashboard Maker — Build & Customize Enterprise Dashboards" },
      {
        name: "description",
        content:
          "Enterprise Dashboard Studio: Create, organize, and customize dynamic dashboards with modular widgets from HRIS, Merchandising, Inventory, Accounts, and Procurement.",
      },
      { property: "og:title", content: "Dashboard Maker — CRIPTON HRIS" },
      {
        property: "og:description",
        content: "Build and customize multi-module enterprise dashboards.",
      },
    ],
  }),
  component: DashboardMakerPage,
});

function DashboardMakerPage() {
  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <div className="p-3.5 md:p-4.5 lg:p-5">
          <DashboardMakerView />
        </div>
      </main>
    </div>
  );
}
