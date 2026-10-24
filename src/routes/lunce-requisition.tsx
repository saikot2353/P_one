import { createFileRoute } from "@tanstack/react-router";
import { LunchRequisitionPage } from "./lunch-requisition";

export const Route = createFileRoute("/lunce-requisition")({
  head: () => ({
    meta: [
      { title: "Lunce Requisition — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Manage, allocate, and submit employee lunch requisitions during overtime and festival duties.",
      },
    ],
  }),
  component: LunchRequisitionPage,
});
