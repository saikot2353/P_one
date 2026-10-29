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
      { title: "Style Pre-Costing Management — CriptonHRIS" },
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

  return (
    <MarketingMerchandisingLayout
      activePath={activePath}
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Style Pre-Costing", to: "/mm-pre-costing" },
        {
          label:
            activeTab === "create"
              ? "Pre Costing Entry"
              : activeTab === "compare"
              ? "Amendment & Comparison"
              : "Pre-Costing Register",
        },
      ]}
      title="Style Pre-Costing Management"
      subtitle="Style-wise item-level pre-costing, multiple PO entry, revision amendments, side-by-side version comparison & printable reports"
    >
      <PreCostingManager
        initialTab={activeTab}
        onTabChange={(newTab) => {
          navigate({
            to: "/mm-pre-costing",
            search: newTab === "register" ? {} : { tab: newTab },
          });
        }}
      />
    </MarketingMerchandisingLayout>
  );
}

export default MMPreCostingPage;
