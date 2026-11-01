import {
  LayoutDashboard,
  MessageSquare,
  BookUser,
  Megaphone,
  DoorOpen,
  FileText,
  Briefcase,
  Network,
  Lightbulb,
  CalendarDays,
} from "lucide-react";
import type { NavItem } from "./types";

export const coreDashboardNav: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Messenger", to: "/messenger", icon: MessageSquare },
  { label: "Phonebook", to: "/phonebook", icon: BookUser },
];

export const coreCollaborationNav: NavItem[] = [
  {
    label: "Notice",
    to: "/notice",
    icon: Megaphone,
  },
  {
    label: "Conference Room",
    icon: DoorOpen,
    subitems: [
      { label: "Conference Room Booking", to: "/conference-room-booking" },
      { label: "Booking List", to: "/conference-room-booking-list" },
      { label: "Approval", to: "/conference-room-approval" },
    ],
  },
];

export const corePolicyNav: NavItem[] = [
  {
    label: "HR Policy",
    to: "/hr-policy",
    icon: FileText,
  },
  {
    label: "JD List",
    to: "/jd-list",
    icon: Briefcase,
  },
  {
    label: "Department SOP",
    to: "/department-sop",
    icon: Network,
  },
];

export const coreEngagementNav: NavItem[] = [
  {
    label: "Idea Share",
    icon: Lightbulb,
    subitems: [
      { label: "Idea Board", to: "/" },
      { label: "Innovation Submissions", to: "/" },
    ],
  },
  {
    label: "Event",
    icon: CalendarDays,
    subitems: [
      { label: "Upcoming Events", to: "/" },
      { label: "Holiday Celebrations", to: "/" },
      { label: "Team Building", to: "/" },
    ],
  },
];

