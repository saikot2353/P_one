import type { NavItem } from "./types";
import {
  coreDashboardNav,
  coreCollaborationNav,
  corePolicyNav,
  coreEngagementNav,
} from "./core.nav";
import { sspNav } from "./ssp.nav";
import { configureNav } from "./configure.nav";
import { approvalsNav } from "./approvals.nav";
import { personnelNav } from "./personnel.nav";
import { attendanceNav, shiftNav } from "./attendance.nav";
import { leaveNav } from "./leave.nav";
import { recruitmentNav } from "./recruitment.nav";
import { budgetTransferNav } from "./budget-transfer.nav";
import { separationNav } from "./separation.nav";
import { adminNav } from "./admin.nav";
import { welfareNav } from "./welfare.nav";
import { payrollCompensationNav } from "./payroll.nav";
import { hrReportsNav } from "./reports.nav";

export * from "./types";
export * from "./core.nav";
export * from "./ssp.nav";
export * from "./configure.nav";
export * from "./approvals.nav";
export * from "./personnel.nav";
export * from "./attendance.nav";
export * from "./leave.nav";
export * from "./recruitment.nav";
export * from "./budget-transfer.nav";
export * from "./separation.nav";
export * from "./admin.nav";
export * from "./welfare.nav";
export * from "./payroll.nav";
export * from "./reports.nav";

/**
 * Combined global navigation tree assembled from domain-specific modules.
 * Editing any module's navigation items in its respective file eliminates git merge conflicts.
 */
export const nav: NavItem[] = [
  ...coreDashboardNav,
  ...sspNav,
  ...configureNav,
  ...approvalsNav,
  ...personnelNav,
  ...attendanceNav,
  ...leaveNav,
  ...coreCollaborationNav,
  payrollCompensationNav[0], // KPI Performance
  payrollCompensationNav[1], // Evaluation
  ...recruitmentNav,
  ...shiftNav, // Manage Shift
  ...budgetTransferNav,
  ...corePolicyNav,
  ...separationNav,
  ...adminNav,
  ...welfareNav,
  payrollCompensationNav[2], // Manage Overtime
  payrollCompensationNav[3], // Manage Allowance
  payrollCompensationNav[4], // Payroll
  payrollCompensationNav[5], // Mobile Billing
  payrollCompensationNav[6], // Processes
  payrollCompensationNav[7], // Compliance
  ...coreEngagementNav,
  ...hrReportsNav,
];

