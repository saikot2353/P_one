import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import PreCostingKnitManager, {
  PreCostingItemRow,
  PreCostingRecord,
} from "../components/marketing-merchandising/PreCostingKnitManager";

export type { PreCostingItemRow, PreCostingRecord };

export interface PreCostingKnitSearchParams {
  tab?: "register" | "create" | "compare" | "report";
  id?: string;
  quotationId?: string;
  [key: string]: unknown;
}

export const Route = createFileRoute("/mm-pre-costing-knit")({
  validateSearch: (search: Record<string, unknown>): PreCostingKnitSearchParams => ({
    tab: (search.tab as PreCostingKnitSearchParams["tab"]) || "register",
    id: search.id ? String(search.id) : undefined,
    quotationId: search.quotationId ? String(search.quotationId) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Pre Costing (Knit) — CriptonHRIS" },
      {
        name: "description",
        content:
          "Knit style-wise item-level pre-costing register, entry form, and comprehensive pre-cost sheet report.",
      },
    ],
  }),
  component: MMPreCostingKnitPage,
});

function MMPreCostingKnitPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const activeTab = searchParams.tab || "register";
  const activePath =
    activeTab === "create"
      ? "/mm-pre-costing-knit?tab=create"
      : "/mm-pre-costing-knit";

  const pageTitle =
    activeTab === "create"
      ? "Pre Costing Entry (Knit)"
      : activeTab === "report"
      ? "Pre-Cost Sheet Report"
      : activeTab === "compare"
      ? "Pre Costing Comparison"
      : "Pre Costing Register (Knit)";

  return (
    <MarketingMerchandisingLayout
      activePath={activePath}
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Style Pre-Costing", to: "/mm-pre-costing-knit" },
        { label: pageTitle },
      ]}
      title={pageTitle}
      subtitle=""
    >
      <PreCostingKnitManager
        initialTab={activeTab}
        initialRecordId={searchParams.id}
        onTabChange={(newTab, recId) => {
          navigate({
            to: "/mm-pre-costing-knit",
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

export default MMPreCostingKnitPage;
