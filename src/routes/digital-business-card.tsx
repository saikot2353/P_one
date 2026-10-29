import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/digital-business-card")({
  component: DigitalBusinessCardLayout,
});

function DigitalBusinessCardLayout() {
  return <Outlet />;
}
