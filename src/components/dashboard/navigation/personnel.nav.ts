import { UserRound, CreditCard } from "lucide-react";
import type { NavItem } from "./types";

export const personnelNav: NavItem[] = [
  {
    label: "Personnel Info",
    icon: UserRound,
    subitems: [
      { label: "Personnel List", to: "/personnel-list" },
      { label: "Employee Account Information", to: "/employee-account-information" },
      { label: "Bulk Account Upload", to: "/bulk-account-upload" },
      { label: "ID Card Setup", to: "/id-card-setup" },
      { label: "Employee Doc Issue", to: "/employee-doc-issue" },
      { label: "Set HOD", to: "/set-hod" },
      { label: "Set Manager", to: "/set-manager" },
      { label: "Change Employee Status", to: "/change-employee-status" },
      { label: "Lefty", to: "/disciplinary-lefty" },
    ],
  },
  {
    label: "Digital Business Card",
    icon: CreditCard,
    subitems: [
      { label: "My Digital Business Card", to: "/my-digital-business-card" },
      { label: "Share My Card", to: "/share-my-card" },
      { label: "Business Card Management", to: "/digital-business-cards-admin" },
      { label: "Card Analytics", to: "/digital-business-card-analytics" },
    ],
  },
];

