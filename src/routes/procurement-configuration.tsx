// src/routes/procurement-configuration.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import { ProcurementConfigurationForm } from "@/components/procurement/ProcurementConfigurationForm";

export const Route = createFileRoute("/procurement-configuration")({
  head: () => ({
    meta: [
      { title: "Procurement Configuration — CriptonHRIS" },
      {
        name: "description",
        content:
          "Configure company-level settings for procurement processes, multiple categories, and comparative statements.",
      },
    ],
  }),
  component: ProcurementConfigurationRoutePage,
});

function ProcurementConfigurationRoutePage() {
  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <ProcurementSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProcurementTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          <ProcurementConfigurationForm hideHeaderActions={false} />
        </main>
      </div>
    </div>
  );
}
