import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import FabricTypeManager from "../components/marketing-merchandising/master-data/FabricTypeManager";

export const Route = createFileRoute("/mm-master-fabric-type")({
  head: () => ({
    meta: [
      { title: "Fabric Type Master — CriptonHRIS" },
      {
        name: "description",
        content:
          "Manage Fabric Type master records for knit and woven constructions (Single Jersey, Rib, Fleece, French Terry, Interlock).",
      },
    ],
  }),
  component: MMFabricTypePage,
});

function MMFabricTypePage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-fabric-type"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-fabric-composition" },
        { label: "Fabric Type" },
      ]}
      title="Fabric Type Master"
      subtitle="Standardized knit & woven fabric constructions for production, costing, and booking."
    >
      <FabricTypeManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMFabricTypePage;
