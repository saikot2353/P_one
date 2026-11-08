import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import SpinningTypeManager from "../components/marketing-merchandising/master-data/SpinningTypeManager";

export const Route = createFileRoute("/mm-master-spinning-type")({
  head: () => ({
    meta: [
      { title: "Spinning Type Master — CriptonHRIS" },
      {
        name: "description",
        content:
          "Manage Spinning Type master records (Ring Spun, Rotor / Open End, Vortex, Compact, Siro Spun).",
      },
    ],
  }),
  component: MMSpinningTypePage,
});

function MMSpinningTypePage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-spinning-type"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-fabric-composition" },
        { label: "Spinning Type" },
      ]}
      title="Spinning Type Master"
      subtitle="Standardized yarn spinning methods for pre-costing, mill booking, and technical sheets."
    >
      <SpinningTypeManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMSpinningTypePage;
