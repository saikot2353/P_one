import { HeartHandshake } from "lucide-react";
import { BaseSidebar } from "./BaseSidebar";
import { welfareNav } from "./navigation/welfare.nav";
import type { NavItem } from "./navigation/types";

export const nav: NavItem[] = welfareNav;

export function WelfareSidebar() {
  return (
    <BaseSidebar
      moduleTitle="Welfare & Aid"
      moduleSubtitle="Zakat & Financial Aid"
      moduleBadge="Welfare"
      moduleIcon={HeartHandshake}
      nav={welfareNav}
      storageKey="welfare_sidebar_scroll"
    />
  );
}

