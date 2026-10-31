import { UserPlus } from "lucide-react";
import { BaseSidebar } from "./BaseSidebar";
import { recruitmentNav } from "./navigation/recruitment.nav";
import type { NavItem } from "./navigation/types";

export const nav: NavItem[] = recruitmentNav;

export function RecruitmentSidebar() {
  return (
    <BaseSidebar
      moduleTitle="Recruitment"
      moduleSubtitle="Hiring & Talent Pipeline"
      moduleBadge="Talent"
      moduleIcon={UserPlus}
      nav={recruitmentNav}
      storageKey="recruitment_sidebar_scroll"
    />
  );
}

