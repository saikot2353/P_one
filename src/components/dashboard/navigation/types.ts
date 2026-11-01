import type { ComponentType } from "react";

export interface NestedItem {
  label: string;
  to?: string;
  search?: Record<string, any>;
  subitems?: NestedItem[];
  count?: number;
  hidden?: boolean;
}

export interface SubItem {
  label: string;
  to?: string;
  search?: Record<string, any>;
  subitems?: NestedItem[];
  count?: number;
  hidden?: boolean;
}

export interface NavItem {
  label: string;
  to?: string;
  icon: ComponentType<any>;
  active?: boolean;
  subitems?: SubItem[];
  search?: Record<string, any>;
  count?: number;
  activeRoutes?: string[];
  hidden?: boolean;
}

