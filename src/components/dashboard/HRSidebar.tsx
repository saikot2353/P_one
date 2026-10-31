import { Users } from "lucide-react";
import { BaseSidebar } from "./BaseSidebar";
import {
  coreDashboardNav,
  corePolicyNav,
  coreCollaborationNav,
  coreEngagementNav,
} from "./navigation/core.nav";
import { configureNav } from "./navigation/configure.nav";
import { approvalsNav } from "./navigation/approvals.nav";
import { personnelNav } from "./navigation/personnel.nav";
import { budgetTransferNav } from "./navigation/budget-transfer.nav";
import { separationNav } from "./navigation/separation.nav";
import { adminNav } from "./navigation/admin.nav";
import type { NavItem } from "./navigation/types";

export const nav: NavItem[] = [
  ...coreDashboardNav,
  ...configureNav,
  ...approvalsNav,
  ...personnelNav,
  ...budgetTransferNav,
  ...corePolicyNav,
  ...separationNav,
  ...adminNav,
  ...coreCollaborationNav,
  ...coreEngagementNav,
];

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

