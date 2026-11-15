import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import BuyerQuotationManager, {
  PreCostingItemRow,
  PreCostingRecord,
} from "../components/marketing-merchandising/BuyerQuotationManager";

export type { PreCostingItemRow, PreCostingRecord };

export interface BuyerQuotationSearchParams {
  tab?: "register" | "create" | "compare" | "report";
  id?: string;
  quotationId?: string;
  [key: string]: unknown;
}

export const Route = createFileRoute("/mm-buyer-quotation")({
  validateSearch: (search: Record<string, unknown>): BuyerQuotationSearchParams => ({
    tab: (search.tab as BuyerQuotationSearchParams["tab"]) || "register",
    id: search.id ? String(search.id) : undefined,
    quotationId: search.quotationId ? String(search.quotationId) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Buyer Quotation — CriptonHRIS" },
      {
        name: "description",
        content:
          "Buyer price quotation generation, multi-currency FOB calculation, CM, and negotiations.",
      },
    ],
  }),
  component: MMBuyerQuotationPage,
});

function MMBuyerQuotationPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const activeTab = searchParams.tab || "register";
  const activePath =
    activeTab === "create"
      ? "/mm-buyer-quotation?tab=create"
      : "/mm-buyer-quotation";

  const pageTitle =
    activeTab === "create"
      ? "Create New Buyer Quotation"
      : activeTab === "report"
      ? "Buyer Quotation Sheet"
      : activeTab === "compare"
      ? "Buyer Quotation Comparison"
      : "Buyer Quotation Register";

  return (
    <MarketingMerchandisingLayout
      activePath={activePath}
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Buyer Quotation", to: "/mm-buyer-quotation" },
        { label: pageTitle },
      ]}
      title={pageTitle}
      subtitle=""
    >
      <BuyerQuotationManager
        initialTab={activeTab}
        initialRecordId={searchParams.id || searchParams.quotationId}
        onTabChange={(newTab, recId) => {
          navigate({
            to: "/mm-buyer-quotation",
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

export default MMBuyerQuotationPage;
