import { CalendarX } from "lucide-react";
import type { NavItem } from "./types";

export const leaveNav: NavItem[] = [
  {
    label: "Leave",
    icon: CalendarX,
    subitems: [
      { label: "Leave Application", to: "/leave-application" },
      { label: "Bulk Leave", to: "/bulk-leave" },
      {
        label: "Maternity Leave",
        subitems: [
          { label: "Welfare Verification", to: "/maternity-welfare-verification" },
          { label: "Medical Verification", to: "/maternity-medical-verification" },
          { label: "HR Verification", to: "/maternity-hr-verification" },
          { label: "Maternity Payment", to: "/maternity-payment" },
          { label: "Maternity Payment Report", to: "/maternity-payment-report" },
        ],
      },
      { label: "Leave Approved & List", to: "/leave-list" },
      { label: "Leave Approve", to: "/leave-approve" },
      { label: "Earn Leave Process (Year)", to: "/earn-leave-process", search: { type: "year" } },
      { label: "Earn Leave Process (Month)", to: "/earn-leave-process", search: { type: "month" } },
      { label: "Earn Leave Submit & List", to: "/earn-leave-workflow" },
    ],
  },
];

