import { CheckCircle } from "lucide-react";
import type { NavItem } from "./types";

export const approvalsNav: NavItem[] = [
  {
    label: "Approvals",
    icon: CheckCircle,
    count: 42,
    subitems: [
      { label: "All Approvals", to: "/all-approvals" },
      { label: "All Pending Approval List", to: "/pending-approvals", count: 5 },
      { label: "Work Flow", to: "/work-flows", count: 6 },
      { label: "Sync Requisition", to: "/sync-requisition" },
      {
        label: "HR Approvals",
        count: 28,
        subitems: [
          { label: "SSP Approval", to: "/ssp-approval", count: 5 },
          { label: "Personnel Approval", to: "/personnel-approval", count: 2 },
          { label: "Personal Info Approval", to: "/personal-info-approval", count: 2 },
          { label: "Employee Doc Verification", to: "/employee-doc-verification", count: 4 },
          { label: "Manual Attendance", to: "/pending-manual-attendance", count: 7 },
          {
            label: "JD Approvals",
            to: "/hr-policy",
            search: { mode: "list", filterWorkflow: "HR" },
            count: 1,
          },
          { label: "KPI Approval", to: "/kpi-approval", count: 4 },
          { label: "Increment Gadget", to: "/approve-increment-gadget", count: 3 },
          { label: "Increment (HR)", to: "/approve-increment-hr", count: 2 },
          { label: "Final Increment", to: "/final-approve-increment", count: 1 },
          { label: "Budget Requisitions", to: "/budget-requisition-approvals" },
          {
            label: "Transfer Approvals",
            to: "/transfer-control-center",
            search: { tab: "approve" },
            count: 2,
          },
          { label: "Overtime Requisitions", to: "/approve-overtime", count: 1 },
          { label: "Lunce Requisition approval", to: "/lunch-requisition-approval", count: 2 },
          { label: "Festival Allowance Approval", to: "/festival-allowance-approval", count: 1 },
        ],
      },
      {
        label: "Payroll Approval",
        count: 14,
        subitems: [
          { label: "Advance Requisitions", to: "/approve-advance", count: 3 },
          { label: "Loan Applications", to: "/loan-approval", count: 5 },
          { label: "Salary Sheets", to: "/check-approve-salary", count: 6 },
        ],
      },
    ],
  },
];

