export type DashboardModule =
  | "all"
  | "hris"
  | "merchandising"
  | "inventory"
  | "accounts"
  | "procurement";

export type WidgetColSpan = 1 | 2 | 3 | 4 | 6 | 12;

export interface WidgetSettings {
  scope?: "personal" | "managed_depts" | "team" | "department" | "company"; // My Personal, Head of Dept (My Managed Depts), Team, Department, Company-wide
  managedDepartments?: string[]; // e.g. ["Sewing Floor", "Cutting Unit"]
  department?: string; // e.g. "All Departments", "Sewing Floor", "Cutting Unit", "Finishing", "Quality", "Admin"
  buyer?: string; // e.g. "All Buyers", "H&M Group", "Zara / Inditex", "Target USA", "Next UK", "C&A Europe"
  buyers?: string[]; // Multi-selected buyers list (e.g. ["H&M Group", "Zara / Inditex"])
  warehouse?: string; // e.g. "All Warehouses", "Central Raw Material Store", "Trims Warehouse", "Chemical Store"
  period?: "today" | "week" | "month" | "year";
  employeeCategory?: "all" | "worker" | "staff" | "management";
}

export interface DashboardComponentDefinition {
  id: string;
  name: string;
  module: "hris" | "merchandising" | "inventory" | "accounts" | "procurement";
  moduleLabel: string;
  category: "Metric Cards" | "Chart & Analytics" | "Feed & Queue" | "Progress & Gauges";
  description: string;
  iconName: string;
  defaultColSpan: WidgetColSpan;
  minColSpan?: WidgetColSpan;
  badge?: string;
  supportedScopes?: Array<"personal" | "managed_depts" | "department" | "company">;
  hasBuyerFilter?: boolean;
  hasWarehouseFilter?: boolean;
}

export interface DashboardWidgetConfig {
  id: string; // unique instance id inside template
  componentId: string;
  customTitle?: string;
  colSpan: WidgetColSpan;
  settings?: WidgetSettings;
}

export interface DashboardTemplate {
  id: string;
  title: string;
  description: string;
  category: "Executive" | "Operations" | "Departmental" | "Custom";
  modules: Array<"hris" | "merchandising" | "inventory" | "accounts" | "procurement">;
  isDefault?: boolean;
  isActiveMain?: boolean;
  layoutColumns: 1 | 2 | 3 | 4 | 12;
  widgets: DashboardWidgetConfig[];
  createdAt: string;
  updatedAt: string;
}

export const DASHBOARD_COMPONENTS_CATALOG: DashboardComponentDefinition[] = [
  // HRIS Module Components
  {
    id: "hr_quick_stats",
    name: "Workforce Presence & Attendance Stats",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Metric Cards",
    description: "Configurable stats: View Personal, Head of Dept, Departmental, or Entire Company-wide attendance.",
    iconName: "Users",
    defaultColSpan: 12,
    minColSpan: 6,
    badge: "Multi-Scope",
    supportedScopes: ["personal", "managed_depts", "department", "company"],
  },
  {
    id: "hr_ot_requisition_vs_consumption",
    name: "OT Requisition vs Consumption",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "Line supervisor OT hours requested vs actual biometric punch OT consumed with budget variance.",
    iconName: "Timer",
    defaultColSpan: 6,
    minColSpan: 4,
    badge: "OT Analysis",
    supportedScopes: ["personal", "managed_depts", "department", "company"],
  },
  {
    id: "hr_ot_requisition_vs_utilization",
    name: "Overtime Requisition vs Overtime Utilization",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "Line supervisor OT hours requisition vs productive floor utilization rate, idle hours, and output efficiency.",
    iconName: "Timer",
    defaultColSpan: 6,
    minColSpan: 4,
    badge: "OT Utilization",
    supportedScopes: ["personal", "managed_depts", "department", "company"],
  },
  {
    id: "hr_attendance_pie",
    name: "Attendance Distribution Chart",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "Attendance split: Personal monthly attendance, Managed depts, Department presence, or Full company ratio.",
    iconName: "PieChart",
    defaultColSpan: 4,
    supportedScopes: ["personal", "managed_depts", "department", "company"],
  },
  {
    id: "hr_late_absent_pie",
    name: "Late vs Absent Analysis",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "Visual ratio of morning punch anomalies, delayed entries and unscheduled absentees.",
    iconName: "Clock",
    defaultColSpan: 4,
    supportedScopes: ["managed_depts", "department", "company"],
  },
  {
    id: "hr_ot_bar_chart",
    name: "Overtime Payout & Hours Trend",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "Overtime hours: My personal logged hours vs Managed depts vs Department vs Company total.",
    iconName: "BarChart3",
    defaultColSpan: 4,
    supportedScopes: ["personal", "managed_depts", "department", "company"],
  },
  {
    id: "hr_headcount_trend",
    name: "Headcount Growth & Turnover",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "12-month rolling recruitment hires vs exits curve across all manufacturing plants.",
    iconName: "TrendingUp",
    defaultColSpan: 6,
    supportedScopes: ["managed_depts", "department", "company"],
  },
  {
    id: "hr_department_split",
    name: "Department Headcount Distribution",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "Horizontal distribution of staff across Cutting, Sewing, Finishing, QA & Admin.",
    iconName: "Building2",
    defaultColSpan: 6,
  },
  {
    id: "hr_leave_approvals",
    name: "Leave Requests & Balances Queue",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Feed & Queue",
    description: "Dynamic feed: My own leave history, manager approval queue for managed departments, or company queue.",
    iconName: "CalendarX",
    defaultColSpan: 6,
    supportedScopes: ["personal", "managed_depts", "department", "company"],
  },
  {
    id: "hr_recruitment_pipeline",
    name: "Talent Acquisition Pipeline",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Progress & Gauges",
    description: "Active job requisitions, candidate screening, technical interviews and onboarding offers.",
    iconName: "UserPlus",
    defaultColSpan: 6,
  },

  // Merchandising (MM) Module Components
  {
    id: "mm_order_pipeline",
    name: "Garment Order Pipeline & FOB Value",
    module: "merchandising",
    moduleLabel: "Merchandising (MM)",
    category: "Metric Cards",
    description: "Export order volume & FOB booking value. Filterable by international buyer.",
    iconName: "Store",
    defaultColSpan: 12,
    minColSpan: 6,
    badge: "Buyer Filter",
    hasBuyerFilter: true,
  },
  {
    id: "mm_buyer_distribution",
    name: "Buyer-wise Order Allocation",
    module: "merchandising",
    moduleLabel: "Merchandising (MM)",
    category: "Chart & Analytics",
    description: "Volume & value breakdown by major international buyers (H&M, Zara, Target, Next, C&A).",
    iconName: "PieChart",
    defaultColSpan: 6,
    minColSpan: 4,
    hasBuyerFilter: true,
  },
  {
    id: "mm_tna_critical_path",
    name: "T&A Milestone Critical Path",
    module: "merchandising",
    moduleLabel: "Merchandising (MM)",
    category: "Progress & Gauges",
    description: "Milestone status across Lab Dip, Yarn In-house, PP Sample, Bulk Cutting, and Finishing.",
    iconName: "CalendarDays",
    defaultColSpan: 6,
    minColSpan: 4,
    badge: "Buyer Filter",
    hasBuyerFilter: true,
  },
  {
    id: "mm_line_efficiency",
    name: "Sewing Floor Line Efficiency (DHU)",
    module: "merchandising",
    moduleLabel: "Merchandising (MM)",
    category: "Progress & Gauges",
    description: "Active sewing line efficiencies (avg 68.4%), target vs actual hourly pieces, and defect rates.",
    iconName: "Scissors",
    defaultColSpan: 6,
  },
  {
    id: "mm_shipment_alerts",
    name: "Upcoming Ex-Factory & Shipment Risk",
    module: "merchandising",
    moduleLabel: "Merchandising (MM)",
    category: "Feed & Queue",
    description: "Urgent shipping deadlines within 7-14 days with inspection pass rate and buffer margins.",
    iconName: "Truck",
    defaultColSpan: 6,
    hasBuyerFilter: true,
  },

  // Inventory & Warehouse Components
  {
    id: "inv_stock_valuation",
    name: "Warehouse Stock Valuation & Metrics",
    module: "inventory",
    moduleLabel: "Inventory & Stores",
    category: "Metric Cards",
    description: "Total stock valuation, SKUs, and capacity. Filterable by warehouse/store.",
    iconName: "Package",
    defaultColSpan: 12,
    minColSpan: 6,
    badge: "Warehouse Filter",
    hasWarehouseFilter: true,
  },
  {
    id: "inv_low_stock_alerts",
    name: "Critical Raw Material Reorder Alerts",
    module: "inventory",
    moduleLabel: "Inventory & Stores",
    category: "Feed & Queue",
    description: "Fabrics, trims, zippers, and packaging items below minimum safety stock thresholds.",
    iconName: "AlertTriangle",
    defaultColSpan: 6,
    badge: "Warehouse Filter",
    hasWarehouseFilter: true,
  },
  {
    id: "inv_movement_bar",
    name: "Monthly Goods Received vs Issue Flow",
    module: "inventory",
    moduleLabel: "Inventory & Stores",
    category: "Chart & Analytics",
    description: "Monthly comparison of GRN/MRR inward inventory vs floor store issue requisitions.",
    iconName: "ArrowRightLeft",
    defaultColSpan: 6,
  },
  {
    id: "inv_intercompany_transfers",
    name: "Inter-Unit Loan & Transfers",
    module: "inventory",
    moduleLabel: "Inventory & Stores",
    category: "Feed & Queue",
    description: "Fabric and accessory loan transfers between spinning, composite, and washing units.",
    iconName: "RotateCcw",
    defaultColSpan: 6,
  },

  // Accounts & Finance Components
  {
    id: "acc_payroll_payout",
    name: "Monthly Payroll Disbursement & Salary",
    module: "accounts",
    moduleLabel: "Accounts & Finance",
    category: "Metric Cards",
    description: "Configurable payroll: My personal monthly payslip, managed depts, department wage bill, or company disbursement.",
    iconName: "Banknote",
    defaultColSpan: 12,
    minColSpan: 6,
    badge: "Multi-Scope",
    supportedScopes: ["personal", "managed_depts", "department", "company"],
  },
  {
    id: "acc_department_cost",
    name: "Departmental Labor & Payroll Expense",
    module: "accounts",
    moduleLabel: "Accounts & Finance",
    category: "Chart & Analytics",
    description: "Monthly cost breakdown across manufacturing shifts, executive payroll, and overtime.",
    iconName: "CreditCard",
    defaultColSpan: 6,
  },
  {
    id: "acc_pending_invoices",
    name: "Pending Commercial Bill Approvals",
    module: "accounts",
    moduleLabel: "Accounts & Finance",
    category: "Feed & Queue",
    description: "Supplier commercial invoices, freight invoices, and utility bill clearance queue.",
    iconName: "FileText",
    defaultColSpan: 6,
  },

  // Procurement Components
  {
    id: "proc_active_po",
    name: "Procurement Orders & Requisitions",
    module: "procurement",
    moduleLabel: "Procurement",
    category: "Metric Cards",
    description: "Open purchase orders (142 POs), average delivery lead time, and pending supplier confirmations.",
    iconName: "ShoppingCart",
    defaultColSpan: 6,
  },
  {
    id: "proc_vendor_rating",
    name: "Supplier On-Time Delivery (OTIF) Matrix",
    module: "procurement",
    moduleLabel: "Procurement",
    category: "Progress & Gauges",
    description: "On-Time-In-Full delivery scores, fabric lab test compliance, and quality audit rankings.",
    iconName: "Target",
    defaultColSpan: 6,
  },
];

export const DEFAULT_DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: "tpl_universal_exec",
    title: "Executive Universal Command Suite",
    description: "All-in-one corporate command center spanning HR workforce, Garment Merchandising orders, Inventory stock, and Payroll finance.",
    category: "Executive",
    modules: ["hris", "merchandising", "inventory", "accounts", "procurement"],
    isDefault: true,
    isActiveMain: true,
    layoutColumns: 12,
    createdAt: "2026-11-01",
    updatedAt: "2026-11-20",
    widgets: [
      { id: "w_1", componentId: "hr_quick_stats", colSpan: 12 },
      { id: "w_2", componentId: "mm_order_pipeline", colSpan: 12 },
      { id: "w_3", componentId: "hr_attendance_pie", colSpan: 4 },
      { id: "w_4", componentId: "mm_buyer_distribution", colSpan: 4 },
      { id: "w_5", componentId: "mm_tna_critical_path", colSpan: 4 },
      { id: "w_6", componentId: "inv_stock_valuation", colSpan: 12 },
      { id: "w_7", componentId: "inv_low_stock_alerts", colSpan: 6 },
      { id: "w_8", componentId: "acc_payroll_payout", colSpan: 6 },
      { id: "w_9", componentId: "hr_ot_requisition_vs_consumption", colSpan: 6 },
    ],
  },
  {
    id: "tpl_hr_intelligence",
    title: "HR & Workforce Analytics Hub",
    description: "Deep workforce intelligence: daily attendance breakdowns, overtime expense, headcount trends, and leave approvals queue.",
    category: "Departmental",
    modules: ["hris"],
    isDefault: true,
    isActiveMain: false,
    layoutColumns: 12,
    createdAt: "2026-11-01",
    updatedAt: "2026-11-15",
    widgets: [
      { id: "w_hr_1", componentId: "hr_quick_stats", colSpan: 12 },
      { id: "w_hr_2", componentId: "hr_attendance_pie", colSpan: 4 },
      { id: "w_hr_3", componentId: "hr_late_absent_pie", colSpan: 4 },
      { id: "w_hr_4", componentId: "hr_ot_bar_chart", colSpan: 4 },
      { id: "w_hr_9", componentId: "hr_ot_requisition_vs_consumption", colSpan: 6 },
      { id: "w_hr_10", componentId: "hr_ot_requisition_vs_utilization", colSpan: 6 },
      { id: "w_hr_5", componentId: "hr_headcount_trend", colSpan: 6 },
      { id: "w_hr_6", componentId: "hr_department_split", colSpan: 6 },
      { id: "w_hr_7", componentId: "hr_leave_approvals", colSpan: 6 },
      { id: "w_hr_8", componentId: "hr_recruitment_pipeline", colSpan: 6 },
    ],
  },
  {
    id: "tpl_mm_production",
    title: "Merchandising & Production Master",
    description: "Specialized for Garment Merchandising & Manufacturing: FOB order tracking, buyer distribution, T&A critical path, and sewing line efficiency.",
    category: "Operations",
    modules: ["merchandising", "procurement"],
    isDefault: true,
    isActiveMain: false,
    layoutColumns: 12,
    createdAt: "2026-11-05",
    updatedAt: "2026-11-18",
    widgets: [
      { id: "w_mm_1", componentId: "mm_order_pipeline", colSpan: 12 },
      { id: "w_mm_2", componentId: "mm_buyer_distribution", colSpan: 6 },
      { id: "w_mm_3", componentId: "mm_tna_critical_path", colSpan: 6 },
      { id: "w_mm_4", componentId: "mm_line_efficiency", colSpan: 6 },
      { id: "w_mm_5", componentId: "mm_shipment_alerts", colSpan: 6 },
      { id: "w_mm_6", componentId: "proc_active_po", colSpan: 6 },
      { id: "w_mm_7", componentId: "proc_vendor_rating", colSpan: 6 },
    ],
  },
  {
    id: "tpl_inventory_supply",
    title: "Supply Chain & Warehouse Command",
    description: "Material control center: Stock valuations, reorder alerts, inter-company stock transfers, and purchase order fulfillment.",
    category: "Operations",
    modules: ["inventory", "procurement"],
    isDefault: true,
    isActiveMain: false,
    layoutColumns: 12,
    createdAt: "2026-11-08",
    updatedAt: "2026-11-19",
    widgets: [
      { id: "w_inv_1", componentId: "inv_stock_valuation", colSpan: 12 },
      { id: "w_inv_2", componentId: "inv_low_stock_alerts", colSpan: 6 },
      { id: "w_inv_3", componentId: "inv_movement_bar", colSpan: 6 },
      { id: "w_inv_4", componentId: "inv_intercompany_transfers", colSpan: 6 },
      { id: "w_inv_5", componentId: "proc_active_po", colSpan: 6 },
    ],
  },
  {
    id: "tpl_finance_payroll",
    title: "Finance & Payroll Executive",
    description: "Executive payroll and corporate expense overview: net payable wages, departmental labor costs, overtime expenses, and pending bill clearance.",
    category: "Executive",
    modules: ["accounts", "hris"],
    isDefault: true,
    isActiveMain: false,
    layoutColumns: 12,
    createdAt: "2026-11-10",
    updatedAt: "2026-11-20",
    widgets: [
      { id: "w_acc_1", componentId: "acc_payroll_payout", colSpan: 12 },
      { id: "w_acc_2", componentId: "hr_ot_bar_chart", colSpan: 6 },
      { id: "w_acc_3", componentId: "acc_department_cost", colSpan: 6 },
      { id: "w_acc_4", componentId: "acc_pending_invoices", colSpan: 6 },
      { id: "w_acc_5", componentId: "hr_quick_stats", colSpan: 6 },
    ],
  },
];

const STORAGE_KEY_TEMPLATES = "cripton_dashboard_templates_v4";
const STORAGE_KEY_ACTIVE_ID = "cripton_active_dashboard_template_id_v4";

export function loadDashboardTemplates(): DashboardTemplate[] {
  if (typeof window === "undefined") return DEFAULT_DASHBOARD_TEMPLATES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEMPLATES);
    if (!raw) {
      saveDashboardTemplates(DEFAULT_DASHBOARD_TEMPLATES);
      return DEFAULT_DASHBOARD_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_DASHBOARD_TEMPLATES;
  } catch (err) {
    console.error("Failed to load dashboard templates from storage", err);
    return DEFAULT_DASHBOARD_TEMPLATES;
  }
}

export function saveDashboardTemplates(templates: DashboardTemplate[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
  } catch (err) {
    console.error("Failed to save dashboard templates", err);
  }
}

export function getActiveDashboardTemplateId(): string {
  if (typeof window === "undefined") return DEFAULT_DASHBOARD_TEMPLATES[0].id;
  try {
    const active = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    if (active) return active;
    return DEFAULT_DASHBOARD_TEMPLATES[0].id;
  } catch {
    return DEFAULT_DASHBOARD_TEMPLATES[0].id;
  }
}

export function setActiveDashboardTemplateId(id: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
    // Also update isActiveMain inside the templates array
    const templates = loadDashboardTemplates();
    const updated = templates.map((t) => ({
      ...t,
      isActiveMain: t.id === id,
    }));
    saveDashboardTemplates(updated);
  } catch (err) {
    console.error("Failed to set active dashboard template", err);
  }
}
