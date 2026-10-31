import { Briefcase } from "lucide-react";
import { BaseSidebar } from "./BaseSidebar";
import { sspNav } from "./navigation/ssp.nav";
import type { NavItem } from "./navigation/types";

export const nav: NavItem[] = sspNav;

export function SSPSidebar() {
  return (
    <BaseSidebar
      moduleTitle="Self Service Portal"
      moduleSubtitle="Employee Requisitions"
      moduleBadge="SSP"
      moduleIcon={Briefcase}
      nav={sspNav}
      storageKey="ssp_sidebar_scroll"
    />
  );
}

