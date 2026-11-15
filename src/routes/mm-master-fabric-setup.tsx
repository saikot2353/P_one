import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import FabricSetupManager from "../components/marketing-merchandising/master-data/FabricSetupManager";

export const Route = createFileRoute("/mm-master-fabric-setup")({
  head: () => ({
    meta: [
      { title: "Fabric Setup Master — CriptonHRIS" },
      {
        name: "description",
        content: "Manage master fabric specifications with automated sequence naming and local storage persistence.",
      },
    ],
  }),
  component: MMFabricSetupPage,
});

function MMFabricSetupPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-fabric-setup"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-buyer-name" },
        { label: "Fabric Setup" },
      ]}
      title="Fabric Master"
    >
      <FabricSetupManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMFabricSetupPage;

