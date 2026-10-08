import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/inv-intra-company-transfer")({
  validateSearch: (
    search: Record<string, unknown>
  ): { transferId?: string; mode?: "view" | "edit"; type?: string } => ({
    transferId: search.transferId as string | undefined,
    mode: search.mode as "view" | "edit" | undefined,
    type: "intra",
  }),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/inv-intercompany-transfer",
      search: { ...search, type: "intra" },
    });
  },
  component: IntraCompanyTransferRedirect,
});

function IntraCompanyTransferRedirect() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  useEffect(() => {
    navigate({
      to: "/inv-intercompany-transfer",
      search: { ...search, type: "intra" },
    });
  }, [navigate, search]);

  return null;
}
