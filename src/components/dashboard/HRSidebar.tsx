import { Users } from "lucide-react";
import { BaseSidebar } from "./BaseSidebar";
import { nav } from "./navigation";
import type { NavItem } from "./navigation/types";

export { nav };

export function HRSidebar() {
  return (
    <BaseSidebar
      moduleTitle="HR & Governance"
      moduleSubtitle="Enterprise Personnel & Admin"
      moduleBadge="HR"
      moduleIcon={Users}
      nav={nav}
      storageKey="hr_sidebar_scroll"
    />
  );
}


