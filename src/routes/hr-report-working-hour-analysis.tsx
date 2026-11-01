import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hr-report-working-hour-analysis")({
  beforeLoad: () => {
    throw redirect({ to: "/working-hour-analysis" });
  },
});
