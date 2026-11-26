export type DashboardModule =
  | "all"
  | "hris"
  | "merchandising"
  | "inventory"
  | "accounts"
  | "procurement";

export type WidgetColSpan = 1 | 2 | 3 | 4 | 6 | 8 | 12;

export interface WidgetSettings {
  scope?: "personal" | "area" | "managed_depts" | "team" | "department" | "company"; // Self, Area, Department (multi-select), All Company
  areas?: string[]; // Multi-selected areas/regions (e.g. ["Gazipur Zone", "Ashulia Zone"])
  departments?: string[]; // Multi-selected departments (e.g. ["Sewing Floor", "Cutting Unit"])
  managedDepartments?: string[]; // Legacy alias for multi-selected departments
  department?: string; // Legacy single department fallback
  buyer?: string;
  buyers?: string[]; // Multi-selected buyers list
  warehouse?: string;
  period?: "today" | "week" | "month" | "year";
  employeeCategory?: "all" | "worker" | "staff" | "management";
  enabledChips?: string[]; // Custom list of visible metric chip IDs for cards supporting chips
  chipLabels?: Record<string, string>; // Custom renamed labels per chip ID
}

export interface DashboardChipDefinition {
  id: string;
  label: string;
  defaultEnabled?: boolean;
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
  supportedScopes?: Array<"personal" | "area" | "managed_depts" | "department" | "company">;
  hasBuyerFilter?: boolean;
  hasWarehouseFilter?: boolean;
  availableChips?: DashboardChipDefinition[];
}

export function getEffectiveEnabledChips(
  def?: DashboardComponentDefinition | null,
  settings?: WidgetSettings
): string[] {
  if (!def?.availableChips || def.availableChips.length === 0) return [];
  if (settings?.enabledChips && settings.enabledChips.length > 0) {
    const validIds = new Set(def.availableChips.map((c) => c.id));
    const filtered = settings.enabledChips.filter((id) => validIds.has(id));
    if (filtered.length > 0) return filtered;
  }
  return def.availableChips.filter((c) => c.defaultEnabled !== false).map((c) => c.id);
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
    availableChips: [
      { id: "total_workforce", label: "Total Workforce", defaultEnabled: true },
      { id: "present_today", label: "Present Today", defaultEnabled: true },
      { id: "absent", label: "Absent", defaultEnabled: true },
      { id: "late_punch", label: "Late Punch", defaultEnabled: true },
      { id: "on_leave", label: "On Leave", defaultEnabled: true },
      { id: "ot_active", label: "Active on OT", defaultEnabled: false },
      { id: "new_joiners", label: "New Joiners (MTD)", defaultEnabled: false },
      { id: "early_leave", label: "Early Departure", defaultEnabled: false },
      { id: "worker", label: "Worker", defaultEnabled: false },
      { id: "staff", label: "Staff", defaultEnabled: false },
      { id: "staff_present", label: "Staff Present", defaultEnabled: false },
      { id: "worker_present", label: "Worker Present", defaultEnabled: false },
      { id: "worker_absent", label: "Worker Absent", defaultEnabled: false },
      { id: "staff_absent", label: "Staff Absent", defaultEnabled: false },
      { id: "holiday", label: "Holiday", defaultEnabled: false },
      { id: "late_worker", label: "Late Worker", defaultEnabled: false },
      { id: "late_staff", label: "Late Staff", defaultEnabled: false },
      { id: "leave_worker", label: "Worker on Leave", defaultEnabled: false },
      { id: "leave_staff", label: "Staff on Leave", defaultEnabled: false },
      { id: "uninformed_absent", label: "Uninformed Absent", defaultEnabled: false },
      { id: "weekend_duty", label: "Weekend Duty", defaultEnabled: false },
    ],
  },
  {
    id: "hr_workforce_info",
    name: "Workforce Information",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Metric Cards",
    description: "Total Man Power, Worker, Staff, Resign, Lefty, ML, Others, and demographic/status breakdown.",
    iconName: "Users",
    defaultColSpan: 12,
    minColSpan: 6,
    badge: "Workforce Info",
    supportedScopes: ["personal", "area", "department", "company"],
    availableChips: [
      { id: "total_manpower", label: "Total Man Power", defaultEnabled: true },
      { id: "worker", label: "Worker", defaultEnabled: true },
      { id: "staff", label: "Staff", defaultEnabled: true },
      { id: "resign", label: "Resign", defaultEnabled: true },
      { id: "lefty", label: "Lefty", defaultEnabled: true },
      { id: "ml", label: "ML", defaultEnabled: true },
      { id: "others", label: "Others", defaultEnabled: true },
      { id: "new_joining", label: "New Joining", defaultEnabled: false },
      { id: "male", label: "Male", defaultEnabled: false },
      { id: "female", label: "Female", defaultEnabled: false },
      { id: "confirmed", label: "Confirmed", defaultEnabled: false },
      { id: "probation", label: "Probation", defaultEnabled: false },
      { id: "terminated", label: "Terminated", defaultEnabled: false },
      { id: "retired", label: "Retired", defaultEnabled: false },
    ],
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
    availableChips: [
      { id: "ot_requisition", label: "Requisition", defaultEnabled: true },
      { id: "ot_consumed", label: "Actual Consumed", defaultEnabled: true },
      { id: "ot_variance", label: "Budget Variance", defaultEnabled: true },
    ],
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
    availableChips: [
      { id: "req_hours", label: "Requisitioned", defaultEnabled: true },
      { id: "util_hours", label: "Floor Utilized", defaultEnabled: true },
      { id: "util_rate", label: "Utilization Rate", defaultEnabled: true },
      { id: "idle_hours", label: "Idle / Unutilized", defaultEnabled: true },
    ],
  },
  {
    id: "hr_total_manpower_chart",
    name: "Total Manpower Breakdown",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "Department-wise total manpower bar chart (6,437 staff across 19 departments & production units).",
    iconName: "Users",
    defaultColSpan: 6,
    minColSpan: 4,
    badge: "Total Manpower",
    supportedScopes: ["company", "managed_depts", "department"],
  },
  {
    id: "hr_ot_budget_comparison",
    name: "OT Budget Comparison",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "OT Budget vs Actual OT Amt vs Request OT Amt with Budget-Actual & Budget-Request variance.",
    iconName: "Banknote",
    defaultColSpan: 6,
    minColSpan: 4,
    badge: "OT Budget",
    supportedScopes: ["company", "area", "department"],
    availableChips: [
      { id: "budget_amt", label: "Budget Amt", defaultEnabled: true },
      { id: "actual_ot", label: "Actual OT Amt", defaultEnabled: true },
      { id: "request_ot", label: "Request OT Amt", defaultEnabled: true },
      { id: "diff_actual", label: "Diff (Budget-Actual)", defaultEnabled: true },
      { id: "diff_request", label: "Diff (Budget-Request)", defaultEnabled: true },
    ],
  },
  {
    id: "hr_ot_request_vs_actual",
    name: "OT Request Vs OT Actual",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "Actual vs Requested comparison across Manpower (MP), OT Hours, and OT Amount with variance.",
    iconName: "Timer",
    defaultColSpan: 12,
    minColSpan: 6,
    badge: "OT Req vs Actual",
    supportedScopes: ["company", "area", "department"],
    availableChips: [
      { id: "mp_summary", label: "Manpower (MP)", defaultEnabled: true },
      { id: "hr_summary", label: "OT Hours", defaultEnabled: true },
      { id: "amt_summary", label: "OT Amount (৳)", defaultEnabled: true },
    ],
  },
  {
    id: "hr_attendance_pie",
    name: "Attendance Distribution Chart",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "Attendance split: Personal monthly attendance, Area, Department presence, or All Company ratio.",
    iconName: "PieChart",
    defaultColSpan: 4,
    supportedScopes: ["personal", "area", "department", "company"],
    availableChips: [
      { id: "present", label: "Present", defaultEnabled: true },
      { id: "absent", label: "Absent", defaultEnabled: true },
      { id: "late", label: "Late Entry", defaultEnabled: true },
      { id: "leave", label: "On Leave", defaultEnabled: true },
      { id: "holiday", label: "Holiday", defaultEnabled: false },
      { id: "early_leave", label: "Early Departure", defaultEnabled: false },
      { id: "ml", label: "ML (Maternity Leave)", defaultEnabled: false },
      { id: "weekend_duty", label: "Weekend Duty", defaultEnabled: false },
    ],
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
    id: "hr_requisitions_summary",
    name: "Requisitions & Messages Summary",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Metric Cards",
    description: "Total Requisitions, Pending Requisitions, Unread Messages, and Approved Requisitions.",
    iconName: "FileText",
    defaultColSpan: 4,
    minColSpan: 3,
    badge: "Requisitions",
    supportedScopes: ["personal", "area", "department"],
    availableChips: [
      { id: "total_req", label: "Total Requisitions", defaultEnabled: true },
      { id: "pending_req", label: "Pending Requisitions", defaultEnabled: true },
      { id: "unread_msg", label: "Unread Messages", defaultEnabled: true },
      { id: "my_req_pending", label: "My Requisition Pending", defaultEnabled: true },
      { id: "my_app_pending", label: "My Approval Pending", defaultEnabled: true },
      { id: "approved_req", label: "Approved Requisitions", defaultEnabled: false },
    ],
  },
  {
    id: "hr_ontime_vs_late_chart",
    name: "On-Time vs Late Entry Trend",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "6-month On-Time vs Late arrival comparison chart.",
    iconName: "Clock",
    defaultColSpan: 4,
    minColSpan: 3,
    badge: "Punctuality",
    supportedScopes: ["personal", "area", "department"],
    availableChips: [
      { id: "ontime", label: "On-Time", defaultEnabled: true },
      { id: "late", label: "Late", defaultEnabled: true },
    ],
  },
  {
    id: "hr_leave_balance_card",
    name: "Leave Balance Overview",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Progress & Gauges",
    description: "Casual Leave, Sick Leave, Earned Leave, and Maternity/Paternity balances.",
    iconName: "CalendarCheck",
    defaultColSpan: 6,
    minColSpan: 4,
    badge: "Leave Balance",
    supportedScopes: ["personal", "area", "department"],
    availableChips: [
      { id: "casual", label: "Casual Leave", defaultEnabled: true },
      { id: "sick", label: "Sick Leave", defaultEnabled: true },
      { id: "earned", label: "Earned Leave", defaultEnabled: true },
      { id: "maternity", label: "Maternity", defaultEnabled: true },
      { id: "compoff", label: "Comp Off", defaultEnabled: true },
      { id: "lwp", label: "Without Pay", defaultEnabled: true },
    ],
  },
  {
    id: "hr_notice_board",
    name: "Notice Board & Circulars",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Feed & Queue",
    description: "Company holiday notices, performance review announcements, and HR policies.",
    iconName: "FileText",
    defaultColSpan: 6,
    minColSpan: 4,
    badge: "Circulars",
    availableChips: [
      { id: "holiday", label: "Holiday Notice", defaultEnabled: true },
      { id: "meeting", label: "Performance Review", defaultEnabled: true },
      { id: "policy", label: "Policy Update", defaultEnabled: true },
    ],
  },
  {
    id: "hr_messages_feed",
    name: "Recent Messages & Team Inbox",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Feed & Queue",
    description: "Recent team messages from HR Desk, Floor Chief, and Payroll Team.",
    iconName: "Users",
    defaultColSpan: 6,
    minColSpan: 4,
    badge: "Team Inbox",
    availableChips: [
      { id: "hr_desk", label: "HR Desk", defaultEnabled: true },
      { id: "floor_chief", label: "Floor Chief", defaultEnabled: true },
      { id: "payroll", label: "Payroll Team", defaultEnabled: true },
    ],
  },
  {
    id: "hr_upcoming_events",
    name: "Upcoming Events & Birthdays",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Feed & Queue",
    description: "Upcoming team birthdays, public holidays, and work anniversaries.",
    iconName: "CalendarDays",
    defaultColSpan: 6,
    minColSpan: 4,
    badge: "Events",
    availableChips: [
      { id: "birthdays", label: "Birthdays", defaultEnabled: true },
      { id: "anniversaries", label: "Work Anniversaries", defaultEnabled: true },
      { id: "interviews", label: "Interviews", defaultEnabled: true },
      { id: "holidays", label: "Meetings & Holidays", defaultEnabled: true },
    ],
  },
  {
    id: "hr_team_members",
    name: "My Team Members",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Feed & Queue",
    description: "Colleague & team directory cards with online status, employee ID, phone, and quick email action.",
    iconName: "Users",
    defaultColSpan: 12,
    minColSpan: 6,
    badge: "Team Directory",
    supportedScopes: ["personal", "area", "department"],
    availableChips: [
      { id: "sr_exec", label: "Sr. Executive", defaultEnabled: true },
      { id: "exec", label: "Executive", defaultEnabled: true },
      { id: "jr_exec", label: "Jr. Executive", defaultEnabled: true },
      { id: "managers", label: "Managers & Leads", defaultEnabled: true },
    ],
  },
  {
    id: "hr_manpower_budget_vs_onboard",
    name: "Manpower Budget vs Actual On Board",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "Budgeted manpower headcount vs actual on-board strength, vacancy gap, and fill rate across departments.",
    iconName: "Users",
    defaultColSpan: 6,
    minColSpan: 4,
    badge: "MP Budget",
    supportedScopes: ["area", "department"],
    availableChips: [
      { id: "budget_mp", label: "Budgeted MP", defaultEnabled: true },
      { id: "onboard_mp", label: "Actual On-Board", defaultEnabled: true },
      { id: "vacancy", label: "Vacancy / Gap", defaultEnabled: true },
      { id: "fill_rate", label: "Fill Rate %", defaultEnabled: true },
    ],
  },
  {
    id: "hr_separation_turnover",
    name: "Separation & Turnover",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "Monthly employee separation & turnover rate split by Resign, Lefty, Terminated, and Retired.",
    iconName: "TrendingUp",
    defaultColSpan: 6,
    minColSpan: 4,
    badge: "Turnover",
    supportedScopes: ["area", "department"],
    availableChips: [
      { id: "total_sep", label: "Total Separation", defaultEnabled: true },
      { id: "turnover_rate", label: "Turnover Rate %", defaultEnabled: true },
      { id: "resign", label: "Resign", defaultEnabled: true },
      { id: "lefty", label: "Lefty", defaultEnabled: true },
      { id: "terminated", label: "Terminated", defaultEnabled: false },
      { id: "retired", label: "Retired", defaultEnabled: false },
    ],
  },
  {
    id: "hr_increment_yearly",
    name: "Increment Yearly",
    module: "hris",
    moduleLabel: "HRIS & Workforce",
    category: "Chart & Analytics",
    description: "Month-by-month yearly salary increment payout (Taka) chart across Jan–Dec with incremented headcount.",
    iconName: "Banknote",
    defaultColSpan: 12,
    minColSpan: 6,
    badge: "Yearly Increment",
    supportedScopes: ["personal", "area", "department"],
    availableChips: [
      { id: "total_inc_amt", label: "Total Yearly Increment", defaultEnabled: true },
      { id: "inc_employees", label: "Incremented Staff", defaultEnabled: true },
      { id: "avg_inc_pct", label: "Avg Increment %", defaultEnabled: true },
      { id: "peak_month", label: "Peak Month", defaultEnabled: true },
    ],
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
    availableChips: [
      { id: "order_volume", label: "Total Order Volume", defaultEnabled: true },
      { id: "fob_value", label: "Total FOB Value", defaultEnabled: true },
      { id: "on_time_perf", label: "On-Time Performance", defaultEnabled: true },
      { id: "capacity_util", label: "Capacity Utilization", defaultEnabled: true },
    ],
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
    availableChips: [
      { id: "order_volume", label: "Total Order Volume", defaultEnabled: true },
      { id: "fob_value", label: "Total FOB Value", defaultEnabled: true },
      { id: "on_time_perf", label: "On-Time Performance", defaultEnabled: true },
      { id: "capacity_util", label: "Capacity Utilization", defaultEnabled: true },
    ],
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
    availableChips: [
      { id: "total_stock", label: "Total Stock Value", defaultEnabled: true },
      { id: "in_transit", label: "In-Transit POs", defaultEnabled: true },
      { id: "low_stock", label: "Low Stock Alerts", defaultEnabled: true },
      { id: "monthly_issue", label: "Monthly Issue", defaultEnabled: true },
    ],
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
    availableChips: [
      { id: "total_stock", label: "Total Stock Value", defaultEnabled: true },
      { id: "in_transit", label: "In-Transit POs", defaultEnabled: true },
      { id: "low_stock", label: "Low Stock Alerts", defaultEnabled: true },
      { id: "monthly_issue", label: "Monthly Issue", defaultEnabled: true },
    ],
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
    availableChips: [
      { id: "gross_payroll", label: "Gross Payroll", defaultEnabled: true },
      { id: "ot_payout", label: "OT Allowance", defaultEnabled: true },
      { id: "net_disbursed", label: "Net Disbursed", defaultEnabled: true },
      { id: "pending_bank", label: "Pending Bank", defaultEnabled: true },
    ],
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
    id: "tpl_final_hris",
    title: "Final HRIS",
    description: "Complete HRIS dashboard with Workforce Presence & Attendance Stats, Workforce Information, OT comparisons, Manpower Breakdown, Attendance/Late pies, Trends, Leave Queue, and Monthly/Yearly Talent Acquisition.",
    category: "Departmental",
    modules: ["hris"],
    isDefault: true,
    isActiveMain: false,
    layoutColumns: 12,
    createdAt: "2026-11-25",
    updatedAt: "2026-11-25",
    widgets: [
      // #1 (100%)
      {
        id: "w_fhris_2",
        componentId: "hr_workforce_info",
        colSpan: 12,
        settings: {
          scope: "area",
          enabledChips: ["total_manpower", "worker", "staff", "resign", "lefty"],
        },
      },

      // #2 (67%) + #3 (33%)
      { id: "w_fhris_5", componentId: "hr_total_manpower_chart", colSpan: 8 },
      {
        id: "w_fhris_13",
        componentId: "hr_requisitions_summary",
        colSpan: 4,
        settings: {
          scope: "area",
          enabledChips: ["total_req", "pending_req", "unread_msg", "my_req_pending", "my_app_pending"],
        },
      },

      // #4 (50%) + #5 (50%)
      { id: "w_fhris_19", componentId: "hr_manpower_budget_vs_onboard", colSpan: 6 },
      {
        id: "w_fhris_20",
        componentId: "hr_separation_turnover",
        colSpan: 6,
        settings: {
          scope: "area",
          enabledChips: ["total_sep", "turnover_rate", "resign", "lefty"],
        },
      },

      // #6 (100%)
      { id: "w_fhris_4", componentId: "hr_ot_budget_comparison", colSpan: 12 },

      // #7 (50%) + #8 (50%)
      { id: "w_fhris_3", componentId: "hr_ot_requisition_vs_consumption", colSpan: 6 },
      { id: "w_fhris_8", componentId: "hr_ot_bar_chart", colSpan: 6 },

      // #9 (100%)
      {
        id: "w_fhris_1",
        componentId: "hr_quick_stats",
        colSpan: 12,
        settings: {
          scope: "area",
          enabledChips: [
            "total_workforce",
            "worker_present",
            "worker_absent",
            "staff_present",
            "staff_absent",
          ],
        },
      },

      // #10 (33%) + #11 (33%) + #12 (33%)
      {
        id: "w_fhris_6",
        componentId: "hr_attendance_pie",
        colSpan: 4,
        settings: {
          scope: "area",
          enabledChips: ["present", "absent", "late", "leave"],
        },
      },
      { id: "w_fhris_14", componentId: "hr_ontime_vs_late_chart", colSpan: 4 },
      { id: "w_fhris_7", componentId: "hr_late_absent_pie", colSpan: 4 },

      // #13 (50%) + #14 (50%)
      { id: "w_fhris_11", componentId: "hr_recruitment_pipeline", colSpan: 6 },
      { id: "w_fhris_9", componentId: "hr_headcount_trend", colSpan: 6 },

      // #15 (50%) + #16 (50%)
      {
        id: "w_fhris_12",
        componentId: "acc_payroll_payout",
        customTitle: "Yearly Payroll Disbursement & Salary",
        colSpan: 6,
        settings: { scope: "area", period: "year" },
      },
      { id: "w_fhris_21", componentId: "hr_increment_yearly", colSpan: 6 },

      // #17 (50%) + #18 (50%)
      { id: "w_fhris_15", componentId: "hr_leave_balance_card", colSpan: 6 },
      { id: "w_fhris_18", componentId: "hr_upcoming_events", colSpan: 6 },

      // #19 (50%) + #20 (50%)
      { id: "w_fhris_16", componentId: "hr_notice_board", colSpan: 6 },
      { id: "w_fhris_17", componentId: "hr_messages_feed", colSpan: 6 },

      // #21 (100%)
      { id: "w_fhris_22", componentId: "hr_team_members", colSpan: 12 },
    ],
  },
  {
    id: "tpl_all",
    title: "All",
    description: "Complete unified dashboard with every widget across HRIS, Merchandising, Inventory, Accounts, and Procurement.",
    category: "Executive",
    modules: ["hris", "merchandising", "inventory", "accounts", "procurement"],
    isDefault: true,
    isActiveMain: false,
    layoutColumns: 12,
    createdAt: "2026-11-25",
    updatedAt: "2026-11-25",
    widgets: DASHBOARD_COMPONENTS_CATALOG.map((comp, idx) => ({
      id: `w_all_${idx + 1}`,
      componentId: comp.id,
      colSpan: comp.defaultColSpan,
    })),
  },
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
      { id: "w_hr_11", componentId: "hr_total_manpower_chart", colSpan: 6 },
      { id: "w_hr_12", componentId: "hr_ot_budget_comparison", colSpan: 6 },
      { id: "w_hr_13", componentId: "hr_ot_request_vs_actual", colSpan: 12 },
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

const STORAGE_KEY_TEMPLATES = "cripton_dashboard_templates_v18";
const STORAGE_KEY_ACTIVE_ID = "cripton_active_dashboard_template_id_v18";

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
