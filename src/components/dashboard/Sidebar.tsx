import { HRSidebar } from "./HRSidebar";

export { HRSidebar } from "./HRSidebar";
export { HRReportsSidebar } from "./HRReportsSidebar";
export { WelfareSidebar } from "./WelfareSidebar";
export { PayrollSidebar } from "./PayrollSidebar";
export { LeaveSidebar } from "./LeaveSidebar";
export { RecruitmentSidebar } from "./RecruitmentSidebar";
export { SSPSidebar } from "./SSPSidebar";
export { BaseSidebar } from "./BaseSidebar";
export { nav } from "./navigation";
export type { NestedItem, SubItem, NavItem } from "./navigation";

/**
 * HR & Payroll Module Sidebar.
 * Displays the complete navigation hierarchy for HRIS.
 */
export function Sidebar() {
  return <HRSidebar />;
}

