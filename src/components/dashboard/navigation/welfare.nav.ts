import { HeartHandshake, LifeBuoy, ShieldAlert } from "lucide-react";
import type { NavItem } from "./types";

export const welfareNav: NavItem[] = [
  {
    label: "Welfare & Support",
    icon: HeartHandshake,
    subitems: [
      { label: "Zakat and Financial Aid", to: "/zakat-and-financial-aid" },
      { label: "Asset Master Data", to: "/zakat-asset-master" },
      { label: "Zakat Executive Report", to: "/zakat-executive-report" },
      { label: "Financial Aid Report", to: "/financial-aid-report" },
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

