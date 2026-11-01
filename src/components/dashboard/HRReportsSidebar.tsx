import { FileSpreadsheet } from "lucide-react";
import { BaseSidebar } from "./BaseSidebar";
import { hrReportsNav } from "./navigation/reports.nav";
import type { NavItem } from "./navigation/types";

export const nav: NavItem[] = hrReportsNav;

export function HRReportsSidebar() {
  return (
    <BaseSidebar
      moduleTitle="HR Reports"
      moduleSubtitle="Enterprise Analytics"
      moduleBadge="Reports"
      moduleIcon={FileSpreadsheet}
      nav={hrReportsNav}
      storageKey="hr_reports_sidebar_scroll"
    />
  );
}

