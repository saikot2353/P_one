import { CreditCard } from "lucide-react";
import type { NavItem } from "./types";

export const digitalBusinessCardNav: NavItem[] = [
  {
    label: "Digital Business Card",
    icon: CreditCard,
    subitems: [
      { label: "Share My Card", to: "/share-my-card" },
      { label: "My Digital Business Card", to: "/my-digital-business-card" },
      { label: "Business Card Management", to: "/digital-business-cards-admin" },
      { label: "Card Analytics", to: "/digital-business-card-analytics" },
    ],
  },
];

