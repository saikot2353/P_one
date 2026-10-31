import { useRouterState } from "@tanstack/react-router";
import { HRSidebar } from "./HRSidebar";
import { HRReportsSidebar } from "./HRReportsSidebar";
import { WelfareSidebar } from "./WelfareSidebar";
import { PayrollSidebar } from "./PayrollSidebar";
import { LeaveSidebar } from "./LeaveSidebar";
import { RecruitmentSidebar } from "./RecruitmentSidebar";
import { SSPSidebar } from "./SSPSidebar";

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
 * Universal router-aware Sidebar.
 * Automatically delegates rendering to the dedicated module-specific sidebar component
 * based on the active route, while allowing routes to import individual module sidebars directly.
 */
export function Sidebar() {
  const routerState = useRouterState();
  const path = routerState.location.pathname;

  // 1. Welfare & Support Module
  if (
    path.startsWith("/zakat") ||
    path.startsWith("/financial-aid") ||
    path.startsWith("/absent-counseling") ||
    path.startsWith("/disciplinary-")
  ) {
    return <WelfareSidebar />;
  }

  // 2. HR Reports Module
  if (
    path.startsWith("/hr-report") ||
    path === "/hr-reports" ||
    path === "/working-hour-analysis" ||
    path === "/pending-ot-request" ||
    path === "/increment-history" ||
    path === "/increment-queuelist"
  ) {
    return <HRReportsSidebar />;
  }

  // 3. Payroll & Compensation Module
  if (
    path.startsWith("/payroll") ||
    path.startsWith("/monthly-salary") ||
    path.startsWith("/monthly-advance") ||
    path.startsWith("/monthly-lefty") ||
    path.startsWith("/summary-salary") ||
    path.startsWith("/holiday-summary") ||
    path.startsWith("/advance-salary") ||
    path.startsWith("/yearly-bonus") ||
    path.startsWith("/festival-allowance") ||
    path.startsWith("/final-settlement") ||
    path.startsWith("/loan-") ||
    path.startsWith("/incentive-allowance") ||
    path.startsWith("/mobile-billing") ||
    path.startsWith("/manage-overtime") ||
    path.startsWith("/allowance-") ||
    path.startsWith("/extra-ot") ||
    path.startsWith("/night-allowance") ||
    path.startsWith("/check-salary") ||
    path.startsWith("/check-approve-salary") ||
    path.startsWith("/dept-wise-salary") ||
    path.startsWith("/employee-salary-history") ||
    path.startsWith("/employee-tax-pay")
  ) {
    return <PayrollSidebar />;
  }

  // 4. Leave & Attendance Module
  if (
    path.startsWith("/leave") ||
    path.startsWith("/bulk-leave") ||
    path.startsWith("/maternity") ||
    path.startsWith("/earn-leave") ||
    path.startsWith("/create-roster") ||
    path.startsWith("/company-holiday") ||
    path.startsWith("/shift-") ||
    path.startsWith("/manual-attendance") ||
    path.startsWith("/employee-job-card")
  ) {
    return <LeaveSidebar />;
  }

  // 5. Recruitment Module
  if (
    path.startsWith("/recruitment") ||
    path.startsWith("/e-recruitment")
  ) {
    return <RecruitmentSidebar />;
  }

  // 6. SSP (Self Service Portal) Module
  if (path.startsWith("/ssp")) {
    return <SSPSidebar />;
  }

  // 7. Core HR & Governance Module (Default)
  return <HRSidebar />;
}
