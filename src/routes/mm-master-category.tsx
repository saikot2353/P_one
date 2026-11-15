import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import CategoryManager from "../components/marketing-merchandising/master-data/CategoryManager";

export const Route = createFileRoute("/mm-master-category")({
  head: () => ({
    meta: [
      { title: "Category Master — CriptonHRIS" },
      {
        name: "description",
        content: "Manage merchandising garment category master records with multi-entry support.",
      },
    ],
  }),
  component: MMCategoryPage,
});

function MMCategoryPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-category"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-buyer-name" },
        { label: "Category" },
      ]}
      title="Category Master"
    >
      <CategoryManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMCategoryPage;

