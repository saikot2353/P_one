import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import FabricConsumptionRegisterView from "../components/marketing-merchandising/FabricConsumptionRegisterView";

export const Route = createFileRoute("/mm-fabric-consumption-cad-register")({
  head: () => ({
    meta: [
      { title: "Fabric Consumption Register (CAD) — CriptonHRIS" },
      {
        name: "description",
        content:
          "Central tracking register for CAD team queue, pending marker estimations, and completed body-part calculations.",
      },
    ],
  }),
  component: MMFabricConsumptionCadRegisterPage,
});

function MMFabricConsumptionCadRegisterPage() {
  const navigate = useNavigate();

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-fabric-consumption-cad-register"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Pre Costing", to: "/mm-pre-costing" },
        {
          label: "Fabric Consumption Register (CAD)",
          to: "/mm-fabric-consumption-cad-register",
        },
      ]}
      title="Fabric Consumption Register (CAD)"
    >
      <FabricConsumptionRegisterView
        registerRole="cad"
        onOpenRequest={(id, mode) =>
          navigate({
            to: "/mm-fabric-consumption-cad",
            search: { id, mode: mode || "view", source: "cad" },
          })
        }
      />
    </MarketingMerchandisingLayout>
  );
}

export default MMFabricConsumptionCadRegisterPage;
