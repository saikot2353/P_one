import { LogOut } from "lucide-react";
import type { NavItem } from "./types";

export const separationNav: NavItem[] = [
  {
    label: "Separation",
    icon: LogOut,
    subitems: [
      { label: "Resignation Request", to: "/separation-resignation-request" },
      { label: "Clearance", to: "/separation-clearance" },
      { label: "Clearance Approval", to: "/separation-clearance-approval" },
      { label: "Clearance Configuration", to: "/separation-clearance-configuration" },
      { label: "Other Separations", to: "/separation-company-initiated" },
      { label: "Payment", to: "/separation-payment" },
      { label: "Exit Documents", to: "/separation-exit-documents" },
    ],
  },
];

