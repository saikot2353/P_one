import { HeartHandshake, LifeBuoy, ShieldAlert } from "lucide-react";
import type { NavItem } from "./types";

export const welfareNav: NavItem[] = [
  {
    label: "Welfare & Support",
    icon: HeartHandshake,
    subitems: [
      {
        label: "Zakat Management",
        subitems: [
          { label: "Budget Configuration", to: "/zakat-budget-configuration" },
          { label: "Zakat List", to: "/zakat-list" },
          { label: "Asset Master Data", to: "/zakat-asset-master" },
          { label: "Zakat Report Report", to: "/zakat-executive-report" },
        ],
      },
      {
        label: "Financial Aid",
        subitems: [
          { label: "Budget Configuration", to: "/financial-aid-budget-configuration" },
          { label: "Financial Aid List", to: "/financial-aid-list" },
        ],
      },
    ],
  },
  {
    label: "Counseling",
    icon: LifeBuoy,
    subitems: [
      { label: "Absent Counseling", to: "/absent-counseling" },
      { label: "Welfare Verification", to: "/welfare-verification" },
    ],
  },
  {
    label: "Disciplinary Action",
    icon: ShieldAlert,
    subitems: [
      { label: "Show Cause Notices", to: "/disciplinary-showcause-notices" },
      { label: "Warning Letters", to: "/disciplinary-warning-letters" },
      { label: "Case Files", to: "/disciplinary-case-files" },
    ],
  },
];

