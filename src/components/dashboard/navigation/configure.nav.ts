import { SlidersHorizontal } from "lucide-react";
import type { NavItem } from "./types";

export const configureNav: NavItem[] = [
  {
    label: "Configure",
    icon: SlidersHorizontal,
    subitems: [
      { label: "Structure Setup", to: "/configure-structure" },
      { label: "Company Setup", to: "/company-setup" },
      { label: "Personnel File Configure", to: "/configure-personnel" },
      { label: "Job & Employee Setup", to: "/configure-employment" },
      { label: "Shift & Time Rules", to: "/configure-time" },
      { label: "Allowances & Bonuses", to: "/configure-compensation" },
      { label: "Tax & Compliance Setup", to: "/configure-tax" },
      { label: "Payroll Configuration", to: "/payroll-configure" },
      { label: "Education & Training", to: "/configure-education" },
      { label: "Leave & Policies", to: "/configure-policies" },
      { label: "Maternity Configuration", to: "/maternity-configuration" },
      { label: "Letter Setup", to: "/configure-letter" },
      { label: "Lunch rate festival", to: "/lunch-rate-festival" },
    ],
  },
];

