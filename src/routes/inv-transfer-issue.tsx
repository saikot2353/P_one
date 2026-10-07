import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/inv-transfer-issue")({
  validateSearch: (
    search: Record<string, unknown>
  ): { transferId?: string; mode?: "view" | "edit" } => ({
    transferId: search.transferId as string | undefined,
    mode: search.mode as "view" | "edit" | undefined,
  }),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/inv-intercompany-transfer",
      search,
    });
  },
  component: TransferIssueRedirect,
});

function TransferIssueRedirect() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  useEffect(() => {
    navigate({
      to: "/inv-intercompany-transfer",
      search,
    });
  }, [navigate, search]);

  return null;
}
