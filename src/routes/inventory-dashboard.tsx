import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/inventory-dashboard")({
  beforeLoad: () => {
    throw redirect({
      to: "/inv-dashboard",
    });
  },
  component: InventoryDashboardRedirect,
});

function InventoryDashboardRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/inv-dashboard" });
  }, [navigate]);

  return null;
}
