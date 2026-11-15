import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import ColorManager from "../components/marketing-merchandising/master-data/ColorManager";

export const Route = createFileRoute("/mm-master-color")({
  head: () => ({
    meta: [
      { title: "Color Master — CriptonHRIS" },
      {
        name: "description",
        content: "Manage color master records with swatch indicators, multi-entry, and status management.",
      },
    ],
  }),
  component: MMColorPage,
});

function MMColorPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-color"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-buyer-name" },
        { label: "Color" },
      ]}
      title="Color Master"
    >
      <ColorManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMColorPage;

