import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import FabricCompositionManager from "../components/marketing-merchandising/master-data/FabricCompositionManager";

export const Route = createFileRoute("/mm-master-fabric-composition")({
  head: () => ({
    meta: [
      { title: "Fabric Composition Master — CriptonHRIS" },
      {
        name: "description",
        content:
          "Manage Fabric Composition master records with 3-ratio fiber blends, 100% total validation, and specifications.",
      },
    ],
  }),
  component: MMFabricCompositionPage,
});

function MMFabricCompositionPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-fabric-composition"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-fabric-composition" },
        { label: "Fabric Composition" },
      ]}
      title="Fabric Composition Master"
      subtitle="Define multi-fiber blend ratios with exact 100% total validation, fiber references, and yarn specifications."
    >
      <FabricCompositionManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMFabricCompositionPage;
