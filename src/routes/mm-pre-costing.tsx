import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import PreCostingManager, {
  PreCostingItemRow,
  PreCostingRecord,
} from "../components/marketing-merchandising/PreCostingManager";

export type { PreCostingItemRow, PreCostingRecord };

export interface PreCostingSearchParams {
  tab?: "register" | "create" | "compare" | "report";
  id?: string;
  quotationId?: string;
  [key: string]: unknown;
}

export const Route = createFileRoute("/mm-pre-costing")({
  validateSearch: (search: Record<string, unknown>): PreCostingSearchParams => ({
    tab: (search.tab as PreCostingSearchParams["tab"]) || "register",
    id: search.id ? String(search.id) : undefined,
    quotationId: search.quotationId ? String(search.quotationId) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Style Pre-Costing (Woven) — CriptonHRIS" },
      {
        name: "description",
        content:
          "Style-wise item-level pre-costing, multiple PO entry, revision amendments with visual diff comparison, and approval control.",
      },
    ],
  }),
  component: MMPreCostingPage,
});

function MMPreCostingPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const activeTab = searchParams.tab || "register";
  const activePath =
    activeTab === "create"
      ? "/mm-pre-costing?tab=create"
      : activeTab === "compare"
      ? "/mm-pre-costing?tab=compare"
      : "/mm-pre-costing";

  const pageTitle =
    activeTab === "create"
      ? "Pre Costing Entry (Woven)"
      : activeTab === "report"
      ? "Pre-Cost Sheet Report"
      : activeTab === "compare"
      ? "Pre Costing Comparison"
      : "Pre Costing Register (Woven)";

  return (
    <MarketingMerchandisingLayout
      activePath={activePath}
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Style Pre-Costing", to: "/mm-pre-costing" },
        { label: pageTitle },
      ]}
      title={pageTitle}
      subtitle="Style-wise item-level pre-costing, multiple PO entry, revision amendments, side-by-side version comparison & printable reports"
    >
      <PreCostingManager
        initialTab={activeTab}
        initialRecordId={searchParams.id}
        onTabChange={(newTab, recId) => {
          navigate({
            to: "/mm-pre-costing",
            search:
              newTab === "register"
                ? {}
                : recId
                ? { tab: newTab, id: recId }
                : { tab: newTab },
          });
        }}
      />
    </MarketingMerchandisingLayout>
  );
}

export default MMPreCostingPage;
