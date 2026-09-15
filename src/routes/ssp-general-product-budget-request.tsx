import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/ssp-general-product-budget-request")({
  component: () => <Navigate to="/ssp-product-budget-request" search={{ type: "General" }} replace />,
});
