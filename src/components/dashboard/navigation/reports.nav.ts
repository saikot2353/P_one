import { FileSpreadsheet } from "lucide-react";
import type { NavItem } from "./types";

export const hrReportsNav: NavItem[] = [
  {
    label: "HR Reports",
    icon: FileSpreadsheet,
    to: "/hr-reports",
    subitems: [
      { label: "New Joining Info", to: "/hr-report-new-joining-info" },
      { label: "Employee Info (Compliance)", to: "/hr-report-employee-info-compliance" },
      { label: "Separation List", to: "/hr-report-separation-list" },
      { label: "Employee Count", to: "/hr-report-employee-count" },
      { label: "Leave Summary", to: "/hr-report-leave-summary" },
      { label: "Leave", to: "/hr-report-leave-details" },
      { label: "Daily Attendance Report", to: "/hr-report-daily-attendance" },
      { label: "Monthly Attendance Report", to: "/hr-report-monthly-attendance" },
      { label: "Overtime Summary", to: "/hr-report-overtime-summary" },
      { label: "Absenteeism Summary", to: "/hr-report-absenteeism-summary" },
      { label: "Attendance Details PrevAbsent", to: "/hr-report-attendance-details-prevabsent" },
      { label: "Attendance Details", to: "/hr-report-attendance-details" },
      { label: "Attendance & Overtime", to: "/hr-report-attendance-and-overtime" },
      { label: "Without In Out Attendance", to: "/hr-report-without-in-out-attendance" },
      { label: "Absent Counseling Report", to: "/hr-report-absent-counseling" },
      { label: "Print OT Requisition", to: "#" },
      { label: "Pending OT Request", to: "/pending-ot-request" },
      { label: "Working Hour Analysis", to: "/working-hour-analysis" },
      { label: "Continuous Absent", to: "/hr-report-continuous-absent" },
      { label: "SIM Requisition Report", to: "/hr-report-sim-requisition" },
      { label: "Tiffin Allowance All", to: "/hr-report-tiffin-allowance-all" },
      { label: "Night Card", to: "/hr-report-night-card" },
      { label: "Tiffin Card", to: "/hr-report-tiffin-card" },
      { label: "Increment History", to: "/increment-history" },
      { label: "Increment QueueList", to: "/increment-queuelist" },
    ],
  },
];

