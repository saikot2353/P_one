import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import FabricConsumptionCadForm from "../components/marketing-merchandising/FabricConsumptionCadForm";

export const Route = createFileRoute("/mm-fabric-consumption-cad")({
  head: () => ({
    meta: [
      { title: "Fabric Consumption (CAD) — CriptonHRIS" },
      {
        name: "description",
        content:
          "Merchant fabric consumption requests and CAD Excel-based body-part calculation responses.",
      },
    ],
  }),
  component: MMFabricConsumptionCadPage,
});

function MMFabricConsumptionCadPage() {
  const searchParams = useSearch({ strict: false }) as {
    id?: string;
    mode?: "create" | "cad-response" | "view" | "edit";
    source?: "merchant" | "cad";
  };
  const navigate = useNavigate();

  const id = searchParams.id;
  const mode = searchParams.mode || (id ? "view" : "create");
  const source = searchParams.source || (mode === "cad-response" ? "cad" : "merchant");

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-fabric-consumption-cad"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Pre Costing", to: "/mm-pre-costing" },
        { label: "Fabric Consumption (CAD)", to: "/mm-fabric-consumption-cad" },
      ]}
      title="Fabric Consumption (CAD)"
    >
      <FabricConsumptionCadForm
        initialId={id}
        initialMode={mode}
        onBackToList={() =>
          navigate({
            to:
              source === "cad"
                ? "/mm-fabric-consumption-cad-register"
                : "/mm-fabric-consumption-register",
          })
        }
        onNavigateToRequest={(reqId, reqMode) => {
          navigate({
            to: "/mm-fabric-consumption-cad",
            search: { id: reqId, mode: reqMode || "view", source },
          });
        }}
      />
    </MarketingMerchandisingLayout>
  );
}

export default MMFabricConsumptionCadPage;
