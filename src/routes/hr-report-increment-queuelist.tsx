import { createFileRoute } from "@tanstack/react-router";
import { IncrementQueueListPage } from "./increment-queuelist";

export const Route = createFileRoute("/hr-report-increment-queuelist")({
  head: () => ({
    meta: [
      { title: "Increment QueueList — CRIPTON HRIS" },
      {
        name: "description",
        content: "Employee salary increment queue and verification list under HR Reports.",
      },
    ],
  }),
  component: IncrementQueueListPage,
});
