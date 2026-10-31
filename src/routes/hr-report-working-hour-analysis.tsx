import { createFileRoute } from "@tanstack/react-router";
import { WorkingHourAnalysisPage } from "./working-hour-analysis";

function WorkingHourAnalysisProxy() {
  const Component = WorkingHourRoute.options.component;
  return Component ? <Component /> : null;
}

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
<<<<<<< HEAD
  component: WorkingHourAnalysisPage,
=======
  component: WorkingHourAnalysisProxy,
>>>>>>> 5ed9ff7388ddde3fbed2178bb223bb8ecfab3167
});
