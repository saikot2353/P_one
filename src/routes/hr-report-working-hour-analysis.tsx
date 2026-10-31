import { createFileRoute } from "@tanstack/react-router";
import { WorkingHourAnalysisPage } from "./working-hour-analysis";

export const Route = createFileRoute("/hr-report-working-hour-analysis")({
  head: () => ({
    meta: [
      { title: "Working Hour Analysis — CRIPTON HRIS" },
      {
        name: "description",
        content: "Detailed employee weekly and daily highest working hour analysis report including overtime.",
      },
    ],
  }),
  component: WorkingHourAnalysisPage,
});
