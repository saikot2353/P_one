import { createFileRoute } from "@tanstack/react-router";
import { LunchRequisitionApprovalPage } from "./lunch-requisition-approval";

export const Route = createFileRoute("/lunce-requisition-approval")({
  head: () => ({
    meta: [
      { title: "Lunce Requisition Approval — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Review, audit, and approve submitted employee lunch requisitions for overtime and festival duty meals.",
      },
    ],
  }),
  component: LunchRequisitionApprovalPage,
});
