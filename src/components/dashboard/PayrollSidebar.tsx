import { Banknote } from "lucide-react";
import { BaseSidebar } from "./BaseSidebar";
import { payrollCompensationNav } from "./navigation/payroll.nav";
import type { NavItem } from "./navigation/types";

export const nav: NavItem[] = payrollCompensationNav;

export function PayrollSidebar() {
  return (
    <BaseSidebar
      moduleTitle="Payroll Hub"
      moduleSubtitle="Compensation & Benefits"
      moduleBadge="Payroll"
      moduleIcon={Banknote}
      nav={payrollCompensationNav}
      storageKey="payroll_sidebar_scroll"
    />
  );
}

