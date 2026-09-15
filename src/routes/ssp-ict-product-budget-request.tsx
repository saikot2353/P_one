import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/ssp-ict-product-budget-request")({
  component: () => <Navigate to="/ssp-product-budget-request" search={{ type: "ICT" }} replace />,
});
