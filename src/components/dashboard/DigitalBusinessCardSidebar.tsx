import { CreditCard } from "lucide-react";
import { BaseSidebar } from "./BaseSidebar";
import { digitalBusinessCardNav } from "./navigation/digital-business-card.nav";
import type { NavItem } from "./navigation/types";

export const nav: NavItem[] = digitalBusinessCardNav;

export function DigitalBusinessCardSidebar() {
  return (
    <BaseSidebar
      moduleTitle="Digital Business Card"
      moduleSubtitle="Smart Cards & Identity"
      moduleBadge="CARD"
      moduleIcon={CreditCard}
      nav={digitalBusinessCardNav}
      storageKey="dbc_sidebar_scroll"
    />
  );
}

export { DigitalBusinessCardSidebar as default };

