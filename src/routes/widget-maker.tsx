import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { WidgetMakerView } from "@/components/dashboard-maker/WidgetMakerView";

export const Route = createFileRoute("/widget-maker")({
  head: () => ({
    meta: [
      { title: "Widget Maker — Build Custom Dynamic Widgets" },
      {
        name: "description",
        content:
          "Dynamic Widget Maker: Create custom KPI cards, Bar, Area, and Donut chart widgets and add them directly to Dashboard Maker.",
      },
    ],
  }),
  component: WidgetMakerPage,
});

function WidgetMakerPage() {
  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <div className="p-3.5 md:p-4.5 lg:p-5">
          <WidgetMakerView />
        </div>
      </main>
    </div>
  );
}
