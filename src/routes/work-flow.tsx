import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/work-flow")({
  beforeLoad: () => {
    throw redirect({ to: "/work-flows" });
  },
});
