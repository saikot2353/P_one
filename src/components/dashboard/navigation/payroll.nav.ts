import {
  BarChart3,
  ClipboardCheck,
  Timer,
  CreditCard,
  Banknote,
  Smartphone,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import type { NavItem } from "./types";

export const payrollCompensationNav: NavItem[] = [
  {
    label: "KPI Performance",
    icon: BarChart3,
    subitems: [
      { label: "Dashboard", to: "/kpi-dashboard" },
      { label: "Cycles", to: "/kpi-cycles" },
      { label: "Criteria Setup", to: "/kpi-task-name" },
      { label: "Grade Bands", to: "/kpi-setting" },
      { label: "My Self-Assessment", to: "/kpi-self-assessment" },
      { label: "360° Peer Review", to: "/kpi-peer-review" },
      { label: "Assessment Workflow", to: "/kpi-assessment-workflow" },
      { label: "Assesment Final Report", to: "/kpi-final-report" },
      { label: "KPI Reports", to: "/kpi-report" },
    ],
  },
  {
    label: "Evaluation",
    icon: ClipboardCheck,
    subitems: [
      { label: "Increment (Single)", to: "/increment" },
      { label: "Increment (Multi)", to: "/increment-multiple" },
      { label: "Proposed Increment", to: "/propose-increment" },
      { label: "Increment Report", to: "/increment-report" },
      { label: "Increment History", to: "/increment-history" },
    ],
  },
  {
    label: "Manage Overtime",
    icon: Timer,
    subitems: [
      { label: "OT Requisition", to: "/manage-overtime", search: { tab: "requisition" } },
      { label: "Approve OT Requisition", to: "/approve-overtime" },
      { label: "OT Requisition List", to: "/manage-overtime", search: { tab: "requisition-list" } },
      { label: "Submit OT Req", to: "/manage-overtime", search: { tab: "submit" } },
      { label: "Submitted OT List", to: "/manage-overtime", search: { tab: "submitted-list" } },
      {
        label: "Individual OT Review",
        to: "/manage-overtime",
        search: { tab: "individual-review" },
      },
      { label: "Lunce Requisition", to: "/lunch-requisition" },
      { label: "Festival Allowance", to: "/festival-allowance" },
    ],
  },
  {
    label: "Manage Allowance",
    icon: CreditCard,
    subitems: [
      { label: "Allowance Setup", to: "/" },
      { label: "Employee Allowance", to: "/" },
      { label: "Tax Exemption Rules", to: "/" },
      { label: "Allowance Requisition", to: "/allowance-requisition" },
      {
        label: "Festival Allowance",
        subitems: [
          { label: "Festival Allowance", to: "/festival-allowance" },
          { label: "Festival Allowance Check (HR)", to: "/festival-allowance-check-hr" },
          { label: "Festival Allowance Approval", to: "/festival-allowance-approval" },
          { label: "Festival Allowance Payment Sheet", to: "/festival-allowance-payment-sheet" },
        ],
      },
    ],
  },
  {
    label: "Payroll",
    icon: Banknote,
    subitems: [
      {
        label: "Advance",
        subitems: [
          { label: "Advance Req & List", to: "/payroll-advance" },
          { label: "Incentive Allowance", to: "/incentive-allowance" },
        ],
      },
      {
        label: "Loan",
        subitems: [{ label: "Loan Management", to: "/loan-application" }],
      },
      { label: "Deductions", to: "/payroll-deductions" },
      { label: "Tax Update", to: "/employee-tax-pay" },
      {
        label: "Salary Process",
        subitems: [
          {
            label: "Salary Submission",
            subitems: [
              { label: "Salary Submit", to: "/payroll-salary-submit" },
              { label: "Check Salary", to: "/payroll-check-salary" },
              { label: "Check Salary Vat/Tax", to: "/payroll-check-salary-vattax" },
              { label: "Check Salary Audit", to: "/payroll-check-salary-audit" },
              { label: "Check Salary Plant Head", to: "/payroll-check-salary-planthead" },
              { label: "Check Salary Accounts", to: "/payroll-check-salary-accounts" },
            ],
          },
          {
            label: "Bonus Submission",
            subitems: [
              { label: "Bonus Submit", to: "/payroll-bonus-submit" },
              { label: "Check Bonus", to: "/payroll-check-bonus" },
              { label: "Check Bonus Vat/Tax", to: "/payroll-check-bonus-vattax" },
              { label: "Check Bonus Audit", to: "/payroll-check-bonus-audit" },
              { label: "Check Bonus Plant Head", to: "/payroll-check-bonus-planthead" },
              { label: "Check Bonus Accounts", to: "/payroll-check-bonus-accounts" },
            ],
          },
          { label: "Monthly Salary Process", to: "/monthly-salary-process" },
          { label: "Advance Salary Process", to: "/advance-salary-process" },
          { label: "Yearly Bonus Process", to: "/yearly-bonus-process" },
          { label: "Payroll Period Lock & Approval", to: "/payroll-period-lock" },
        ],
      },
      {
        label: "Benefits",
        subitems: [
          { label: "Master Data", to: "/payroll-benefits-master-data" },
          { label: "Common Benefits", to: "/payroll-benefits-common" },
          { label: "Monthly Benefits", to: "/payroll-benefits-monthly" },
        ],
      },
      {
        label: "Final Settlement",
        subitems: [
          { label: "Execute Final Settlement", to: "/final-settlement" },
          { label: "Final Settlement Configuration", to: "/final-settlement-configuration" },
        ],
      },
      { label: "Payroll Configuration", to: "/payroll-configure" },
      {
        label: "Payroll Reports",
        to: "/payroll-reports",
        subitems: [
          { label: "Monthly Salary Details", to: "/monthly-salary-details" },
          { label: "Monthly Lefty Salary Sheet", to: "/monthly-lefty-salary-sheet" },
          { label: "Employee Salary History", to: "/employee-salary-history" },
          { label: "Monthly Advance Salary Sheet", to: "/monthly-advance-salary-sheet" },
          { label: "Summary Salary Sheet", to: "/summary-salary-sheet" },
          { label: "Holiday Summary Sheet", to: "/holiday-summary-sheet" },
          { label: "Yearly Bonus Report", to: "/yearly-bonus-report" },
          { label: "Earn Leave Pay Report", to: "/earn-leave-pay-report" },
          { label: "Festival Allowance Payment Sheet", to: "/festival-allowance-payment-sheet" },
          { label: "Final Settlement Report", to: "/final-settlement-report" },
          { label: "Extra OT", to: "/extra-ot-report" },
          { label: "Night Allowance Report", to: "/night-allowance-report" },
        ],
      },
    ],
  },
  {
    label: "Mobile Billing",
    icon: Smartphone,
    subitems: [
      { label: "Bill Entry", to: "/mobile-billing-entry" },
      { label: "Department wise billing", to: "/mobile-billing-department" },
      { label: "Employee wise billing", to: "/mobile-billing-employee" },
    ],
  },
  {
    label: "Processes",
    icon: Cpu,
    subitems: [
      { label: "Payroll Processing", to: "/" },
      { label: "End of Month Close", to: "/" },
      { label: "Year End Process", to: "/" },
    ],
  },
  {
    label: "Compliance",
    icon: ShieldCheck,
    subitems: [
      { label: "Statutory Compliance", to: "/" },
      { label: "Tax Reports", to: "/" },
      { label: "Audit Logs", to: "/" },
    ],
  },
];

