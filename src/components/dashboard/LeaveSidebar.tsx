import { CalendarX } from "lucide-react";
import { BaseSidebar } from "./BaseSidebar";
import { leaveNav } from "./navigation/leave.nav";
import { attendanceNav } from "./navigation/attendance.nav";
import type { NavItem } from "./navigation/types";

export const nav: NavItem[] = [...leaveNav, ...attendanceNav];

export function LeaveSidebar() {
  return (
    <BaseSidebar
      moduleTitle="Leave & Time"
      moduleSubtitle="Maternity, Leaves & Rosters"
      moduleBadge="Leave"
      moduleIcon={CalendarX}
      nav={nav}
      storageKey="leave_sidebar_scroll"
    />
  );
}

