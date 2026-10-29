import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import FabricConsumptionRegisterView from "../components/marketing-merchandising/FabricConsumptionRegisterView";

export const Route = createFileRoute("/mm-fabric-consumption-register")({
  head: () => ({
    meta: [
      { title: "Fabric Consumption Register (Mer) — CriptonHRIS" },
      {
        name: "description",
        content:
          "Central tracking register for Merchant Fabric Consumption (CAD) requests and CAD team responses.",
      },
    ],
  }),
  component: MMFabricConsumptionRegisterPage,
});

function MMFabricConsumptionRegisterPage() {
  const navigate = useNavigate();

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-fabric-consumption-register"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Pre Costing", to: "/mm-pre-costing" },
        { label: "Fabric Consumption Register (Mer)", to: "/mm-fabric-consumption-register" },
      ]}
      title="Fabric Consumption Register (Mer)"
    >
      <FabricConsumptionRegisterView
        registerRole="merchant"
        onCreateRequest={() =>
          navigate({
            to: "/mm-fabric-consumption-cad",
            search: { mode: "create", source: "merchant" },
          })
        }
        onOpenRequest={(id, mode) =>
          navigate({
            to: "/mm-fabric-consumption-cad",
            search: { id, mode: mode || "view", source: "merchant" },
          })
        }
      />
    </MarketingMerchandisingLayout>
  );
}

export default MMFabricConsumptionRegisterPage;
