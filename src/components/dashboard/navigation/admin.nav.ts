import { Users } from "lucide-react";
import type { NavItem } from "./types";

export const adminNav: NavItem[] = [
  {
    label: "User Management",
    icon: Users,
    subitems: [
      { label: "User List", to: "/user-management" },
      { label: "Permission Management", to: "/permission-management" },
    ],
  },
];

