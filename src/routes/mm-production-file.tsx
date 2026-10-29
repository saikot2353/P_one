import { createFileRoute, useSearch } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import { ProductionFileForm } from "../components/marketing-merchandising/ProductionFileForm";

export const Route = createFileRoute("/mm-production-file")({
  head: () => ({
    meta: [
      { title: "Production File — CriptonHRIS" },
      {
        name: "description",
        content: "Production file creation, source data selection, auto-fill, PO details, and document attachments.",
      },
    ],
  }),
  component: MMProductionFilePage,
});

function MMProductionFilePage() {
  const searchParams = useSearch({ strict: false }) as {
    id?: string;
    mode?: "create" | "edit" | "view" | "amend";
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-production-file"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Production File Management", to: "/mm-production-file" },
        { label: "Production File", to: "/mm-production-file" },
      ]}
      title="Production File"
    >
      <ProductionFileForm
        initialRecordId={searchParams.id}
        isEditMode={searchParams.mode === "edit"}
        isAmendmentMode={searchParams.mode === "amend"}
      />
    </MarketingMerchandisingLayout>
  );
}
export default MMProductionFilePage;
