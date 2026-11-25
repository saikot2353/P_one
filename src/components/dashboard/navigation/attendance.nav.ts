import { Fingerprint, CalendarDays, Clock } from "lucide-react";
import type { NavItem } from "./types";

export const attendanceNav: NavItem[] = [
  {
    label: "Attendance",
    icon: Fingerprint,
    subitems: [
      { label: "Manual Attendance", to: "/manual-attendance" },
      { label: "Employee Job Card", to: "/employee-job-card" },
      { label: "Allowance Process", to: "/" },
      { label: "Allowance Requisition", to: "/" },
    ],
  },
  {
    label: "Roster",
    icon: CalendarDays,
    subitems: [
      { label: "Create Roster", to: "/create-roster" },
      { label: "Company Holiday", to: "/company-holiday" },
    ],
  },
];

export const shiftNav: NavItem[] = [
  {
    label: "Manage Shift",
    icon: Clock,
    subitems: [
      { label: "Initial Shift Setup", to: "/shift-control-center" },
      { label: "Shift Roster Assignment", to: "/shift-roster-assignment" },
      { label: "Security Roster", to: "/security-roster" },
    ],
  },
];


