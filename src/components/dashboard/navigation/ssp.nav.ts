import { Briefcase } from "lucide-react";
import type { NavItem } from "./types";

export const sspNav: NavItem[] = [
  {
    label: "SSP",
    icon: Briefcase,
    subitems: [
      { label: "New Requisition", to: "/ssp-new-requisition" },
      { label: "My Requisition", to: "/ssp-my-requisition" },
      { label: "Implementation", to: "/ssp-implementation" },
      {
        label: "Attendance",
        subitems: [
          { label: "My Attendance", to: "/ssp-my-attendance" },
          { label: "Request Manual Attendance", to: "/ssp-request-manual-attendance" },
          { label: "Approve Manual Attendance", to: "/ssp-approve-manual-attendance" },
        ],
      },
    ],
  },
];

