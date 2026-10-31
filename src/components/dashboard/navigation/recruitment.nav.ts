import { UserPlus } from "lucide-react";
import type { NavItem } from "./types";

export const recruitmentNav: NavItem[] = [
  {
    label: "e-Recruitment",
    icon: UserPlus,
    subitems: [
      { label: "Application Queue", to: "/recruitment-basic-list" },
      { label: "Candidate Selection", to: "/recruitment-candidate-selection" },
      { label: "Candidate Selection Approval", to: "/recruitment-candidate-selection-approval" },
    ],
  },
  {
    label: "IE Recruitment",
    icon: UserPlus,
    subitems: [
      { label: "Organization Setting", to: "/recruitment-basic-setup" },
      { label: "Basic Entry Form", to: "/recruitment-basic-entry" },
      { label: "Basic Info List", to: "/recruitment-basic-info-list" },
      { label: "IE Configuration", to: "/recruitment-configuration" },
      { label: "IE Assessment", to: "/recruitment-ie-list" },
      { label: "HR Assessment", to: "/recruitment-hr-list" },
      { label: "Assessment List", to: "/recruitment-assessment-list" },
    ],
  },
];

