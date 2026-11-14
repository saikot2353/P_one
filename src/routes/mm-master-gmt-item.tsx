import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import GmtItemManager from "../components/marketing-merchandising/master-data/GmtItemManager";

export const Route = createFileRoute("/mm-master-gmt-item")({
  head: () => ({
    meta: [
      { title: "GMT Item Master — CriptonHRIS" },
      {
        name: "description",
        content: "Manage garment item master records with multi-entry support and status management.",
      },
    ],
  }),
  component: MMGmtItemPage,
});

function MMGmtItemPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-gmt-item"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-buyer-name" },
        { label: "GMT Item" },
      ]}
      title="GMT Item Master"
    >
      <GmtItemManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMGmtItemPage;

