import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import { ProductionFileRegisterView } from "../components/marketing-merchandising/ProductionFileRegisterView";

export const Route = createFileRoute("/mm-production-file-register")({
  head: () => ({
    meta: [
      { title: "Production File Register — CriptonHRIS" },
      {
        name: "description",
        content: "Search, filter, view, and manage centralized production file records and status tracking.",
      },
    ],
  }),
  component: MMProductionFileRegisterPage,
});

function MMProductionFileRegisterPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-production-file-register"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Production File Management", to: "/mm-production-file" },
        { label: "Production File Register", to: "/mm-production-file-register" },
      ]}
      title="Production File Register"
      subtitle="Search, filter, view, and manage production file records"
    >
      <ProductionFileRegisterView />
    </MarketingMerchandisingLayout>
  );
}
export default MMProductionFileRegisterPage;
