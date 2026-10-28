import { createFileRoute } from "@tanstack/react-router";
import { Route as PendingOTRoute } from "./pending-ot-request";

export const Route = createFileRoute("/hr-report-pending-ot-request")({
  head: () => ({
    meta: [
      { title: "Pending OT Request — CRIPTON HRIS" },
      {
        name: "description",
        content: "Track, inspect, and approve pending overtime requisitions and authorized amounts.",
      },
    ],
  }),
  component: PendingOTRoute.options.component,
});
