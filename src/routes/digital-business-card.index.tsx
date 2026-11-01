import React, { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { employeesData } from "@/routes/personnel-list";
import { DigitalBusinessCardView } from "@/routes/digital-business-card.$id";

export const Route = createFileRoute("/digital-business-card/")({
  head: () => ({
    meta: [
      { title: "Digital Business Card — CRIPTON HRIS" },
      {
        name: "description",
        content: "Verified corporate digital business card and social identity profile.",
      },
    ],
  }),
  component: DigitalBusinessCardIndexPage,
});

function DigitalBusinessCardIndexPage() {
  const queryId = useMemo(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      return (
        sp.get("id") || sp.get("empId") || sp.get("token") || employeesData[0]?.id || "2023043910"
      );
    }
    return employeesData[0]?.id || "2023043910";
  }, []);

  return <DigitalBusinessCardView empIdOrToken={queryId} />;
}
