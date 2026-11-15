import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import AccessoriesSetupManager from "../components/marketing-merchandising/master-data/AccessoriesSetupManager";

export const Route = createFileRoute("/mm-master-accessories-setup")({
  head: () => ({
    meta: [
      { title: "Accessories Setup Master — CriptonHRIS" },
      {
        name: "description",
        content: "Manage master accessories specification, market units, UoM and relation factors.",
      },
    ],
  }),
  component: MMAccessoriesSetupPage,
});

function MMAccessoriesSetupPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-accessories-setup"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-buyer-name" },
        { label: "Accessories Setup" },
      ]}
      title="Accessories Master"
    >
      <AccessoriesSetupManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMAccessoriesSetupPage;

