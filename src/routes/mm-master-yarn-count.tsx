import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import YarnCountManager from "../components/marketing-merchandising/master-data/YarnCountManager";

export const Route = createFileRoute("/mm-master-yarn-count")({
  head: () => ({
    meta: [
      { title: "Yarn Count Master — CriptonHRIS" },
      {
        name: "description",
        content:
          "Manage Yarn Count master records (10/1, 20/1, 26/1, 30/1, 34/1, 40/1, 20/2, etc.).",
      },
    ],
  }),
  component: MMYarnCountPage,
});

function MMYarnCountPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-yarn-count"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-fabric-composition" },
        { label: "Yarn Count" },
      ]}
      title="Yarn Count Master"
      subtitle="Standardized yarn counts for costing estimation, fabric consumption, and yarn procurement."
    >
      <YarnCountManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMYarnCountPage;
