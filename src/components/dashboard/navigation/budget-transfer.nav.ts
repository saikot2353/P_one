import { Coins, RefreshCw } from "lucide-react";
import type { NavItem } from "./types";

export const budgetTransferNav: NavItem[] = [
  {
    label: "Manpower Budget",
    icon: Coins,
    subitems: [
      { label: "Dashboard & Statement", to: "/budget-statement" },
      { label: "Budget Planning Hub", to: "/budget-planning" },
      { label: "My Requisitions", to: "/budget-my-requisitions" },
      { label: "Overtime Budget", to: "/budget-overtime" },
      { label: "Over Time Limit", to: "/budget-overtime" },
    ],
  },
  {
    label: "Transfer",
    icon: RefreshCw,
    subitems: [
      { label: "Transfer History", to: "/transfer-control-center", search: { tab: "history" } },
      { label: "Print Transfer Letter", to: "/transfer-control-center", search: { tab: "print" } },
    ],
  },
];

