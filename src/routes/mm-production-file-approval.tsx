import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import { ProductionFileApprovalView } from "../components/marketing-merchandising/ProductionFileApprovalView";

export const Route = createFileRoute("/mm-production-file-approval")({
  head: () => ({
    meta: [
      { title: "Production File Approval — CriptonHRIS" },
      {
        name: "description",
        content: "Review submitted production files, verify 7 attachment categories, and execute Approve/Reject decisions.",
      },
    ],
  }),
  component: MMProductionFileApprovalPage,
});

function MMProductionFileApprovalPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-production-file-approval"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Production File Management", to: "/mm-production-file" },
        { label: "Production File Approval", to: "/mm-production-file-approval" },
      ]}
      title="Production File Approval"
      subtitle="Review submitted production files and approve or reject them"
    >
      <ProductionFileApprovalView />
    </MarketingMerchandisingLayout>
  );
}
export default MMProductionFileApprovalPage;
