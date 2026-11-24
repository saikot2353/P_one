import React from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarCheck,
  TrendingUp,
  Store,
  Scissors,
  Truck,
  Package,
  AlertTriangle,
  ArrowRightLeft,
  RotateCcw,
  Banknote,
  CreditCard,
  FileText,
  ShoppingCart,
  Target,
  CheckCircle2,
  CalendarDays,
  Briefcase,
  Layers,
  Building2,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  BadgeAlert,
  Percent,
  Sparkles,
  User,
  Timer,
  Crown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  DashboardWidgetConfig,
  DASHBOARD_COMPONENTS_CATALOG,
  WidgetSettings,
  WidgetColSpan,
} from "./dashboard-maker-types";

interface WidgetRendererProps {
  widget: DashboardWidgetConfig;
  isCompact?: boolean;
  onUpdateSettings?: (newSettings: WidgetSettings) => void;
}

export const DashboardWidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  isCompact = false,
  onUpdateSettings,
}) => {
  const def = DASHBOARD_COMPONENTS_CATALOG.find((c) => c.id === widget.componentId);
  const displayTitle = widget.customTitle || def?.name || "Dashboard Widget";
  const settings = widget.settings;

  return (
    <div className="h-full bg-card rounded-2xl border border-border/60 shadow-xs p-4 sm:p-5 flex flex-col justify-between transition-all hover:border-border hover:shadow-sm">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40 gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {getWidgetIcon(def?.iconName || "Layers")}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-foreground truncate" title={displayTitle}>
              {displayTitle}
            </h4>
            <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
              <span className="font-semibold uppercase tracking-wider text-[9.5px] px-1.5 py-0.2 rounded bg-muted/60 text-muted-foreground/90 shrink-0">
                {def?.moduleLabel.split(" ")[0] || "Module"}
              </span>
              {(widget.colSpan || 12) > 3 && (
                <>
                  <span>•</span>
                  <span className="truncate">{def?.category}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Scope / Filter Badge (Compact, non-intrusive) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {settings?.scope === "personal" && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1 shrink-0"
              title="Scope: My Self (Personal)"
            >
              <User className="size-3" /> {(widget.colSpan || 12) > 3 ? "My Self" : ""}
            </span>
          )}

          {settings?.scope === "managed_depts" && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1 shrink-0"
              title={`Scope: Head of Dept (${settings.managedDepartments?.join(", ") || "Sewing & Cutting"})`}
            >
              <Crown className="size-3 text-amber-500" />
              {(widget.colSpan || 12) > 3 ? (
                <span>Head: {settings.managedDepartments && settings.managedDepartments.length > 0 ? settings.managedDepartments.map((d) => d.split(" ")[0]).join("&") : "My Depts"}</span>
              ) : ""}
            </span>
          )}

          {settings?.scope === "department" && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1 shrink-0"
              title={`Scope: ${settings.department || "Department"}`}
            >
              <Building2 className="size-3" /> {(widget.colSpan || 12) > 3 ? (settings.department ? settings.department.split(" ")[0] : "Dept") : ""}
            </span>
          )}

          {(!settings?.scope || settings?.scope === "company") && def?.supportedScopes && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shrink-0"
              title="Scope: Entire Company"
            >
              🏢 {(widget.colSpan || 12) > 3 ? "Company" : ""}
            </span>
          )}

          {/* Dynamic Buyer Badge (Single or Multi-Select) */}
          {(() => {
            const activeBuyers =
              settings?.buyers && settings.buyers.length > 0
                ? settings.buyers
                : settings?.buyer && settings.buyer !== "All Buyers"
                ? [settings.buyer]
                : [];
            if (activeBuyers.length === 0) return null;
            const isMulti = activeBuyers.length > 1;
            const badgeLabel = isMulti
              ? `${activeBuyers[0].split(" ")[0]} +${activeBuyers.length - 1}`
              : activeBuyers[0].split(" ")[0];
            return (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 flex items-center gap-1 shrink-0"
                title={`Selected Buyers (${activeBuyers.length}): ${activeBuyers.join(", ")}`}
              >
                <Store className="size-3 text-teal-600" />
                {(widget.colSpan || 12) > 3 ? badgeLabel : (isMulti ? `${activeBuyers.length}B` : "")}
              </span>
            );
          })()}

          {settings?.warehouse && settings.warehouse !== "All Warehouses" && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 shrink-0"
              title={`Warehouse: ${settings.warehouse}`}
            >
              <Package className="size-3" /> {(widget.colSpan || 12) > 3 ? settings.warehouse.split(" ")[0] : ""}
            </span>
          )}

          {def?.badge && !def?.supportedScopes && !settings?.scope && !settings?.buyer && !settings?.warehouse && (
            <span
              className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0"
              title={def.badge}
            >
              {(widget.colSpan || 12) > 3 ? def.badge : "★"}
            </span>
          )}
        </div>
      </div>

      {/* Widget Content Body */}
      <div className="flex-1 min-h-[140px] flex flex-col justify-center">
        {renderWidgetContent(widget.componentId, isCompact, settings, widget.colSpan || 12)}
      </div>
    </div>
  );
};

function getWidgetIcon(name: string) {
  switch (name) {
    case "Users":
      return <Users className="size-4" />;
    case "PieChart":
      return <Layers className="size-4" />;
    case "Timer":
      return <Timer className="size-4" />;
    case "Crown":
      return <Crown className="size-4" />;
    case "Clock":
      return <Clock className="size-4" />;
    case "BarChart3":
      return <BarChart className="size-4" />;
    case "TrendingUp":
      return <TrendingUp className="size-4" />;
    case "Building2":
      return <Building2 className="size-4" />;
    case "CalendarX":
      return <CalendarDays className="size-4" />;
    case "UserPlus":
      return <Users className="size-4" />;
    case "Store":
      return <Store className="size-4" />;
    case "Scissors":
      return <Scissors className="size-4" />;
    case "Truck":
      return <Truck className="size-4" />;
    case "Package":
      return <Package className="size-4" />;
    case "AlertTriangle":
      return <AlertTriangle className="size-4" />;
    case "ArrowRightLeft":
      return <ArrowRightLeft className="size-4" />;
    case "RotateCcw":
      return <RotateCcw className="size-4" />;
    case "Banknote":
      return <Banknote className="size-4" />;
    case "CreditCard":
      return <CreditCard className="size-4" />;
    case "FileText":
      return <FileText className="size-4" />;
    case "ShoppingCart":
      return <ShoppingCart className="size-4" />;
    case "Target":
      return <Target className="size-4" />;
    default:
      return <Layers className="size-4" />;
  }
}

function getMetricGridClass(colSpan: WidgetColSpan = 12, count: number = 4): string {
  if (colSpan <= 3) {
    // 25% card (colSpan 3): 1 column vertical stack, clean & readable!
    return "grid grid-cols-1 gap-2 py-1";
  }
  if (colSpan <= 4) {
    // 33% card (colSpan 4): 2 columns
    return "grid grid-cols-2 gap-2 py-1";
  }
  if (colSpan <= 6) {
    // 50% card
    return count >= 5 ? "grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-1" : "grid grid-cols-2 gap-2.5 py-1";
  }
  // 100% full width
  return count >= 5 ? "grid grid-cols-2 sm:grid-cols-5 gap-2.5 py-1" : "grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-1";
}

function renderWidgetContent(
  componentId: string,
  isCompact: boolean,
  settings?: WidgetSettings,
  colSpan: WidgetColSpan = 12
) {
  const scope = settings?.scope || "company";

  switch (componentId) {
    // ----------------------------------------------------
    // HRIS Components (Dynamic Scope: Personal vs Dept vs Company)
    // ----------------------------------------------------
    case "hr_quick_stats":
      if (scope === "personal") {
        return (
          <div className={getMetricGridClass(colSpan, 5)}>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Today's Status
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-300">
                  Present
                </span>
              </div>
              <div className="text-[10px] text-emerald-600/80 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="size-3" /> In: 08:48 AM
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-[10.5px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Monthly Working
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-foreground">21 / 22</span>
                <span className="text-[10px] text-blue-600 font-bold">95.5%</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">1 Day Weekend Duty</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10.5px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                My Late Punches
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-700 dark:text-amber-300">1 Time</span>
              </div>
              <div className="text-[10px] text-amber-600/80 font-medium mt-1">12 min grace OK</div>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <span className="text-[10.5px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                Leaves Taken
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-purple-700 dark:text-purple-300">2 Days</span>
              </div>
              <div className="text-[10px] text-purple-600/80 font-medium mt-1">Remaining: 12 Days</div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <span className="text-[10.5px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                My Overtime
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-cyan-700 dark:text-cyan-300">16.5h</span>
              </div>
              <div className="text-[10px] text-cyan-600/80 font-medium mt-1">Est OT: ৳4,120</div>
            </div>
          </div>
        );
      }

      if (scope === "managed_depts") {
        const managed = settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
        const label = managed.map((m) => m.split(" ")[0]).join(" + ");
        return (
          <div className={getMetricGridClass(colSpan, 5)}>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10.5px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block truncate">
                {label} (Head)
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-foreground">820</span>
                <span className="text-[10px] text-muted-foreground">Workers</span>
              </div>
              <div className="text-[10px] text-amber-600/90 font-medium mt-1 truncate">
                {managed.length} Managed Departments
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Present on Duty
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                  785
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">95.7%</span>
              </div>
              <div className="text-[10px] text-emerald-600/80 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="size-3" /> Across Managed Lines
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-[10.5px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                Absentees
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-rose-700 dark:text-rose-300">21</span>
                <span className="text-[10px] text-rose-600 font-bold">2.6%</span>
              </div>
              <div className="text-[10px] text-rose-600/80 font-medium mt-1">Uninformed delay</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10.5px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Late Punches
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-700 dark:text-amber-300">14</span>
              </div>
              <div className="text-[10px] text-amber-600/80 font-medium mt-1">Under 15m grace</div>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <span className="text-[10.5px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                On Approved Leave
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-purple-700 dark:text-purple-300">14</span>
              </div>
              <div className="text-[10px] text-purple-600/80 font-medium mt-1">Approved by Me</div>
            </div>
          </div>
        );
      }

      if (scope === "department") {
        const deptName = settings?.department || "Sewing Floor";
        return (
          <div className={getMetricGridClass(colSpan, 5)}>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider block truncate">
                {deptName} Staff
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-foreground">680</span>
                <span className="text-[10px] text-muted-foreground">Operators</span>
              </div>
              <div className="text-[10px] text-blue-600/80 font-medium mt-1">Total in Department</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider block">
                Present on Floor
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">652</span>
                <span className="text-[10px] text-emerald-600 font-bold">95.9%</span>
              </div>
              <div className="text-[10px] text-emerald-600/80 font-medium mt-1">Active on sewing lines</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-[10.5px] font-bold text-rose-600 uppercase tracking-wider block">
                Floor Absentees
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-rose-700 dark:text-rose-300">18</span>
                <span className="text-[10px] text-rose-600 font-bold">2.6%</span>
              </div>
              <div className="text-[10px] text-rose-600/80 font-medium mt-1">Uninformed delay</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10.5px] font-bold text-amber-600 uppercase tracking-wider block">
                Late Punches
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-700 dark:text-amber-300">24</span>
              </div>
              <div className="text-[10px] text-amber-600/80 font-medium mt-1">Shift-1 late arrivals</div>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <span className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider block">
                On Approved Leave
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-purple-700 dark:text-purple-300">10</span>
              </div>
              <div className="text-[10px] text-purple-600/80 font-medium mt-1">Medical & Casual</div>
            </div>
          </div>
        );
      }

      // Default: Company Wide
      return (
        <div className={getMetricGridClass(colSpan, 5)}>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <span className="text-[10.5px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              Total Workforce
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-foreground">1,248</span>
              <span className="text-[10px] text-muted-foreground">Staff</span>
            </div>
            <div className="text-[10px] text-blue-600/80 font-medium mt-1 flex items-center gap-1">
              <ArrowUpRight className="size-3" /> +14 this month
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Present Today
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                1,196
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">95.8%</span>
            </div>
            <div className="text-[10px] text-emerald-600/80 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="size-3" /> Floor On-Duty
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[10.5px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              Absent
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-rose-700 dark:text-rose-300">42</span>
              <span className="text-[10px] text-rose-600 font-bold">3.4%</span>
            </div>
            <div className="text-[10px] text-rose-600/80 font-medium mt-1">18 Uninformed</div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10.5px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Late Punch
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-700 dark:text-amber-300">73</span>
              <span className="text-[10px] text-amber-600 font-bold">5.8%</span>
            </div>
            <div className="text-[10px] text-amber-600/80 font-medium mt-1">Grace period applied</div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span className="text-[10.5px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
              On Leave
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-purple-700 dark:text-purple-300">10</span>
              <span className="text-[10px] text-purple-600 font-bold">0.8%</span>
            </div>
            <div className="text-[10px] text-purple-600/80 font-medium mt-1">Approved & Logged</div>
          </div>
        </div>
      );

    case "hr_ot_requisition_vs_consumption": {
      // OT Requisition vs Actual Consumption (Biometric Punch)
      let otReq = 14800;
      let otCons = 13920;
      let otCostBud = "৳37.0L";
      let otCostAct = "৳34.8L";
      let otSavedCost = "৳2.20L";
      let otTitle = "Factory Wide (6 Lines & Stores)";

      let otReqData: Array<{ name: string; requisition: number; consumed: number; variance: number }> = [
        { name: "Sewing L-01", requisition: 2800, consumed: 2680, variance: -120 },
        { name: "Sewing L-02", requisition: 2750, consumed: 2620, variance: -130 },
        { name: "Sewing L-03", requisition: 2500, consumed: 2450, variance: -50 },
        { name: "Sewing L-04", requisition: 2400, consumed: 2310, variance: -90 },
        { name: "Cutting Sec", requisition: 2350, consumed: 2190, variance: -160 },
        { name: "Finishing", requisition: 2000, consumed: 1670, variance: -330 },
      ];

      if (scope === "personal") {
        otReq = 20.0;
        otCons = 18.5;
        otCostBud = "৳5,000";
        otCostAct = "৳4,625";
        otSavedCost = "৳375";
        otTitle = "My Personal OT Hours";
        otReqData = [
          { name: "Sat", requisition: 3.5, consumed: 3.0, variance: -0.5 },
          { name: "Sun", requisition: 3.0, consumed: 3.0, variance: 0 },
          { name: "Mon", requisition: 3.5, consumed: 3.0, variance: -0.5 },
          { name: "Tue", requisition: 3.0, consumed: 3.0, variance: 0 },
          { name: "Wed", requisition: 4.0, consumed: 3.5, variance: -0.5 },
          { name: "Thu", requisition: 3.0, consumed: 3.0, variance: 0 },
        ];
      } else if (scope === "managed_depts") {
        const managed = settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
        otReq = 8400;
        otCons = 8050;
        otCostBud = "৳21.0L";
        otCostAct = "৳20.1L";
        otSavedCost = "৳87.5K";
        otTitle = `Head of: ${managed.map((m) => m.split(" ")[0]).join(" & ")}`;
        otReqData = [
          { name: "Sewing L-01", requisition: 1850, consumed: 1780, variance: -70 },
          { name: "Sewing L-02", requisition: 1750, consumed: 1700, variance: -50 },
          { name: "Sewing L-03", requisition: 1650, consumed: 1610, variance: -40 },
          { name: "Sewing L-04", requisition: 1550, consumed: 1460, variance: -90 },
          { name: "Cutting Sec", requisition: 1600, consumed: 1500, variance: -100 },
        ];
      } else if (scope === "department") {
        const dept = settings?.department || "Sewing Floor";
        otReq = 6800;
        otCons = 6550;
        otCostBud = "৳17.0L";
        otCostAct = "৳16.38L";
        otSavedCost = "৳62.5K";
        otTitle = `${dept} (Lines 1-4)`;
        otReqData = [
          { name: "Line-01", requisition: 1850, consumed: 1780, variance: -70 },
          { name: "Line-02", requisition: 1750, consumed: 1700, variance: -50 },
          { name: "Line-03", requisition: 1650, consumed: 1610, variance: -40 },
          { name: "Line-04", requisition: 1550, consumed: 1460, variance: -90 },
        ];
      }

      const varianceHrs = otCons - otReq;
      const variancePct = ((varianceHrs / otReq) * 100).toFixed(1);
      const isUnderBudget = varianceHrs <= 0;

      return (
        <div className="space-y-3">
          {/* Top KPI Variance Summary Strip */}
          <div className={`grid ${colSpan <= 3 ? "grid-cols-1" : "grid-cols-3"} gap-2`}>
            {/* Requisition Card */}
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  OT Requisition
                </span>
                <span className="text-[9.5px] font-mono text-blue-600/80 font-bold">{otCostBud}</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-black font-mono text-foreground">
                  {otReq.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground">hrs</span>
              </div>
              <div className="text-[9.5px] text-blue-600 font-medium">Supervisor Requested</div>
            </div>

            {/* Consumption Card */}
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Actual Punch OT
                </span>
                <span className="text-[9.5px] font-mono text-emerald-600/80 font-bold">{otCostAct}</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                  {otCons.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground">hrs</span>
              </div>
              <div className="text-[9.5px] text-emerald-600 font-medium">Biometric Recorded</div>
            </div>

            {/* Variance Card */}
            <div
              className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                isUnderBudget ? "bg-teal-500/10 border-teal-500/20" : "bg-rose-500/10 border-rose-500/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isUnderBudget ? "text-teal-700 dark:text-teal-300" : "text-rose-600"
                  }`}
                >
                  Variance
                </span>
                <span className="text-[9.5px] font-mono font-bold text-muted-foreground">
                  {isUnderBudget ? `Saved: ${otSavedCost}` : "Overspent"}
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className={`text-lg sm:text-xl font-black font-mono ${
                    isUnderBudget ? "text-teal-700 dark:text-teal-300" : "text-rose-600"
                  }`}
                >
                  {isUnderBudget ? `-${Math.abs(varianceHrs).toLocaleString()}` : `+${varianceHrs.toLocaleString()}`}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    isUnderBudget ? "text-teal-600" : "text-rose-600"
                  }`}
                >
                  hrs ({variancePct}%)
                </span>
              </div>
              <div
                className={`text-[9.5px] font-bold flex items-center gap-1 ${
                  isUnderBudget ? "text-teal-700 dark:text-teal-300" : "text-rose-600"
                }`}
              >
                <CheckCircle2 className="size-3" /> {isUnderBudget ? "Within Budget Limit" : "Exceeded Budget!"}
              </div>
            </div>
          </div>

          {/* Visualization: Dual Bar Chart for Requisition vs Actual Consumed */}
          {colSpan <= 3 ? (
            <div className="space-y-1.5 pt-1">
              {otReqData.map((d) => {
                const maxVal = Math.max(...otReqData.map((x) => Math.max(x.requisition, x.consumed)));
                const reqPct = Math.min(100, Math.round((d.requisition / maxVal) * 100));
                const consPct = Math.min(100, Math.round((d.consumed / maxVal) * 100));
                return (
                  <div key={d.name} className="p-2 rounded-lg bg-muted/20 border border-border/40 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-foreground truncate">{d.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {d.consumed}h / {d.requisition}h
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="h-1.5 w-full bg-blue-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${reqPct}%` }} />
                      </div>
                      <div className="h-1.5 w-full bg-emerald-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${consPct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-44 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={otReqData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 9.5 }} />
                  <YAxis tick={{ fontSize: 9.5 }} />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      `${val} Hours`,
                      name === "requisition" ? "OT Requisition (Approved)" : "Actual Consumed (Punch)",
                    ]}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "#fff",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={24}
                    formatter={(val) => (
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {val === "requisition" ? "Requisition (Approved)" : "Actual Consumed"}
                      </span>
                    )}
                  />
                  <Bar dataKey="requisition" fill="#3b82f6" radius={[3, 3, 0, 0]} name="requisition" />
                  <Bar dataKey="consumed" fill="#10b981" radius={[3, 3, 0, 0]} name="consumed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      );
    }

    case "hr_attendance_pie":
      const pieLayoutClass =
        colSpan <= 3 ? "flex flex-col items-center gap-2.5" : "flex flex-col sm:flex-row items-center gap-3";
      const pieChartClass = colSpan <= 3 ? "w-full h-36" : "w-full sm:w-1/2 h-44";
      const pieLegendClass = colSpan <= 3 ? "w-full space-y-1 text-xs" : "w-full sm:w-1/2 space-y-1.5 text-xs";

      if (scope === "personal") {
        const myData = [
          { name: "My Present Days", value: 21, color: "#10b981" },
          { name: "Weekends / Off", value: 8, color: "#3b82f6" },
          { name: "Approved Leave", value: 1, color: "#8b5cf6" },
          { name: "Late Entry", value: 1, color: "#f59e0b" },
        ];
        return (
          <div className={pieLayoutClass}>
            <div className={pieChartClass}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={myData} innerRadius={colSpan <= 3 ? 34 : 42} outerRadius={colSpan <= 3 ? 54 : 65} paddingAngle={4} dataKey="value">
                    {myData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={pieLegendClass}>
              {myData.map((d) => (
                <div key={d.name} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/20">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground font-medium text-[11px] truncate">{d.name}</span>
                  </div>
                  <span className="font-mono font-bold text-foreground text-[11px]">{d.value} Days</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (scope === "managed_depts") {
        const managed = settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
        const deptTitle = `Head: ${managed.map((m) => m.split(" ")[0]).join(" & ")}`;
        const mData = [
          { name: "Present", value: 785, color: "#10b981" },
          { name: "Absent", value: 21, color: "#f43f5e" },
          { name: "Late Entry", value: 14, color: "#f59e0b" },
          { name: "On Leave", value: 14, color: "#8b5cf6" },
        ];
        return (
          <div className={pieLayoutClass}>
            <div className={pieChartClass}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mData}
                    innerRadius={colSpan <= 3 ? 34 : 42}
                    outerRadius={colSpan <= 3 ? 54 : 65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {mData.map((entry, index) => (
                      <Cell key={`cell-mdept-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} staff`, deptTitle]}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={pieLegendClass}>
              <div className="text-[10.5px] font-bold text-amber-600 mb-1 flex items-center gap-1 truncate">
                <Crown className="size-3 text-amber-500" /> {deptTitle} (820 Staff)
              </div>
              {mData.map((d) => (
                <div key={d.name} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/20">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground font-medium text-[11px]">{d.name}</span>
                  </div>
                  <span className="font-mono font-bold text-foreground text-[11px]">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (scope === "department") {
        const deptName = settings?.department || "Sewing Floor";
        const deptData = [
          { name: "Present", value: 652, color: "#10b981" },
          { name: "Absent", value: 18, color: "#f43f5e" },
          { name: "Late Entry", value: 24, color: "#f59e0b" },
          { name: "On Leave", value: 10, color: "#8b5cf6" },
        ];
        return (
          <div className={pieLayoutClass}>
            <div className={pieChartClass}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptData} innerRadius={colSpan <= 3 ? 34 : 42} outerRadius={colSpan <= 3 ? 54 : 65} paddingAngle={4} dataKey="value">
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-dept-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} staff`, deptName]}
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={pieLegendClass}>
              <div className="text-[10.5px] font-bold text-purple-600 mb-1 flex items-center gap-1 truncate">
                <Building2 className="size-3" /> {deptName}
              </div>
              {deptData.map((d) => (
                <div key={d.name} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/20">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground font-medium text-[11px]">{d.name}</span>
                  </div>
                  <span className="font-mono font-bold text-foreground text-[11px]">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      const attData = [
        { name: "Present", value: 1196, color: "#10b981" },
        { name: "Absent", value: 42, color: "#f43f5e" },
        { name: "Late Entry", value: 73, color: "#f59e0b" },
        { name: "Leave", value: 10, color: "#8b5cf6" },
      ];
      return (
        <div className={pieLayoutClass}>
          <div className={pieChartClass}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={attData} innerRadius={colSpan <= 3 ? 34 : 42} outerRadius={colSpan <= 3 ? 54 : 65} paddingAngle={4} dataKey="value">
                  {attData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} employees`, "Count"]}
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={pieLegendClass}>
            {attData.map((d) => (
              <div key={d.name} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/20">
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground font-medium">{d.name}</span>
                </div>
                <span className="font-mono font-bold text-foreground">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "hr_late_absent_pie":
      const latePieLayoutClass =
        colSpan <= 3 ? "flex flex-col items-center gap-2.5" : "flex flex-col sm:flex-row items-center gap-3";
      const latePieChartClass = colSpan <= 3 ? "w-full h-36" : "w-full sm:w-1/2 h-44";
      const latePieLegendClass = colSpan <= 3 ? "w-full space-y-1 text-xs" : "w-full sm:w-1/2 space-y-1.5 text-xs";

      if (scope === "personal") {
        const myLateData = [
          { name: "Grace Period (<15m)", value: 1, color: "#f59e0b" },
          { name: "Uninformed Absent", value: 0, color: "#e11d48" },
          { name: "On-Time Punches", value: 21, color: "#10b981" },
        ];
        return (
          <div className={latePieLayoutClass}>
            <div className={latePieChartClass}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={myLateData} innerRadius={colSpan <= 3 ? 32 : 38} outerRadius={colSpan <= 3 ? 52 : 62} paddingAngle={3} dataKey="value">
                    {myLateData.map((entry, index) => (
                      <Cell key={`cell-late-self-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={latePieLegendClass}>
              <div className="text-[10.5px] font-bold text-blue-600 mb-1 flex items-center gap-1 truncate">
                <User className="size-3" /> My Punctuality Record
              </div>
              {myLateData.map((d) => (
                <div key={d.name} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/20">
                  <span className="text-muted-foreground text-[11px] truncate">{d.name}</span>
                  <span className="font-mono font-bold text-foreground text-[11px]">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (scope === "managed_depts") {
        const managed = settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
        const deptTitle = `Head: ${managed.map((m) => m.split(" ")[0]).join(" & ")}`;
        const mLateData = [
          { name: "Grace Period (<15m)", value: 14, color: "#f59e0b" },
          { name: "Heavy Delay (>30m)", value: 6, color: "#fb923c" },
          { name: "Uninformed Absent", value: 15, color: "#e11d48" },
          { name: "Medical Absent", value: 6, color: "#f43f5e" },
        ];
        return (
          <div className={latePieLayoutClass}>
            <div className={latePieChartClass}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mLateData} innerRadius={colSpan <= 3 ? 32 : 38} outerRadius={colSpan <= 3 ? 52 : 62} paddingAngle={3} dataKey="value">
                    {mLateData.map((entry, index) => (
                      <Cell key={`cell-late-mdept-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} staff`, deptTitle]}
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={latePieLegendClass}>
              <div className="text-[10.5px] font-bold text-amber-600 mb-1 flex items-center gap-1 truncate">
                <Crown className="size-3 text-amber-500" /> {deptTitle}
              </div>
              {mLateData.map((d) => (
                <div key={d.name} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/20">
                  <span className="text-muted-foreground text-[11px] truncate">{d.name}</span>
                  <span className="font-mono font-bold text-foreground text-[11px]">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (scope === "department") {
        const deptName = settings?.department || "Sewing Floor";
        const deptLateData = [
          { name: "Grace Period (<15m)", value: 24, color: "#f59e0b" },
          { name: "Heavy Delay (>30m)", value: 9, color: "#fb923c" },
          { name: "Uninformed Absent", value: 12, color: "#e11d48" },
          { name: "Medical Absent", value: 6, color: "#f43f5e" },
        ];
        return (
          <div className={latePieLayoutClass}>
            <div className={latePieChartClass}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptLateData} innerRadius={colSpan <= 3 ? 32 : 38} outerRadius={colSpan <= 3 ? 52 : 62} paddingAngle={3} dataKey="value">
                    {deptLateData.map((entry, index) => (
                      <Cell key={`cell-late-dept-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} staff`, deptName]}
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={latePieLegendClass}>
              <div className="text-[10.5px] font-bold text-purple-600 mb-1 flex items-center gap-1 truncate">
                <Building2 className="size-3" /> {deptName}
              </div>
              {deptLateData.map((d) => (
                <div key={d.name} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/20">
                  <span className="text-muted-foreground text-[11px] truncate">{d.name}</span>
                  <span className="font-mono font-bold text-foreground text-[11px]">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      const lateData = [
        { name: "Grace Period (<15m)", value: 48, color: "#f59e0b" },
        { name: "Heavy Delay (>30m)", value: 25, color: "#fb923c" },
        { name: "Uninformed Absent", value: 28, color: "#e11d48" },
        { name: "Medical Absent", value: 14, color: "#f43f5e" },
      ];
      return (
        <div className={latePieLayoutClass}>
          <div className={latePieChartClass}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={lateData} innerRadius={colSpan <= 3 ? 32 : 38} outerRadius={colSpan <= 3 ? 52 : 62} paddingAngle={3} dataKey="value">
                  {lateData.map((entry, index) => (
                    <Cell key={`cell-late-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={latePieLegendClass}>
            {lateData.map((d) => (
              <div key={d.name} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/20">
                <span className="text-muted-foreground text-[11px] truncate">{d.name}</span>
                <span className="font-mono font-bold text-foreground text-[11px]">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "hr_ot_bar_chart": {
      if (scope === "personal") {
        const myOtData = [
          { day: "Sat", hours: 2.5 },
          { day: "Sun", hours: 2.0 },
          { day: "Mon", hours: 3.0 },
          { day: "Tue", hours: 2.0 },
          { day: "Wed", hours: 3.5 },
          { day: "Thu", hours: 2.0 },
          { day: "Fri", hours: 1.5 },
        ];
        return (
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={myOtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} hrs logged`, "My Overtime"]}
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                />
                <Bar dataKey="hours" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      }

      if (scope === "managed_depts") {
        const managed = settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
        const mOtData = [
          { day: "Sat", hours: 420, cost: 58000 },
          { day: "Sun", hours: 480, cost: 66000 },
          { day: "Mon", hours: 510, cost: 71000 },
          { day: "Tue", hours: 460, cost: 64000 },
          { day: "Wed", hours: 530, cost: 74000 },
          { day: "Thu", hours: 440, cost: 61000 },
          { day: "Fri", hours: 180, cost: 25000 },
        ];
        return (
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mOtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === "hours" ? `${val} hrs` : `৳${val.toLocaleString()}`,
                    `Head (${managed.map((m) => m.split(" ")[0]).join(" & ")}) OT`,
                  ]}
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                />
                <Bar dataKey="hours" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      }

      if (scope === "department") {
        const deptName = settings?.department || "Sewing Floor";
        const deptOtData = [
          { day: "Sat", hours: 240, cost: 33000 },
          { day: "Sun", hours: 320, cost: 44000 },
          { day: "Mon", hours: 310, cost: 42000 },
          { day: "Tue", hours: 340, cost: 47000 },
          { day: "Wed", hours: 290, cost: 40000 },
          { day: "Thu", hours: 350, cost: 49000 },
          { day: "Fri", hours: 160, cost: 22000 },
        ];
        return (
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptOtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === "hours" ? `${val} hrs` : `৳${val.toLocaleString()}`,
                    `${deptName} OT`,
                  ]}
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                />
                <Bar dataKey="hours" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      }

      const otData = [
        { day: "Sat", hours: 420, cost: 58000 },
        { day: "Sun", hours: 610, cost: 84000 },
        { day: "Mon", hours: 580, cost: 79000 },
        { day: "Tue", hours: 640, cost: 89000 },
        { day: "Wed", hours: 590, cost: 81000 },
        { day: "Thu", hours: 680, cost: 95000 },
        { day: "Fri", hours: 320, cost: 44000 },
      ];
      return (
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={otData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(val: any, name: any) => [name === "hours" ? `${val} hrs` : `৳${val.toLocaleString()}`, name === "hours" ? "OT Hours" : "Cost"]}
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
              />
              <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    case "hr_headcount_trend": {
      let hcData = [
        { month: "Jan", count: 1120, hires: 34, exits: 12 },
        { month: "Mar", count: 1150, hires: 42, exits: 15 },
        { month: "May", count: 1190, hires: 55, exits: 18 },
        { month: "Jul", count: 1210, hires: 48, exits: 14 },
        { month: "Sep", count: 1235, hires: 38, exits: 11 },
        { month: "Nov", count: 1248, hires: 26, exits: 9 },
      ];
      let trendLabel = "Total Staff (Company)";
      let strokeColor = "#2563eb";

      if (scope === "managed_depts") {
        const managed = settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
        trendLabel = `Head: ${managed.map((m) => m.split(" ")[0]).join(" & ")}`;
        strokeColor = "#d97706";
        hcData = [
          { month: "Jan", count: 760, hires: 25, exits: 8 },
          { month: "Mar", count: 775, hires: 28, exits: 10 },
          { month: "May", count: 790, hires: 32, exits: 11 },
          { month: "Jul", count: 805, hires: 30, exits: 9 },
          { month: "Sep", count: 812, hires: 24, exits: 7 },
          { month: "Nov", count: 820, hires: 18, exits: 5 },
        ];
      } else if (scope === "department") {
        const deptName = settings?.department || "Sewing Floor";
        trendLabel = `${deptName} Staff`;
        strokeColor = "#7c3aed";
        hcData = [
          { month: "Jan", count: 620, hires: 20, exits: 6 },
          { month: "Mar", count: 635, hires: 22, exits: 8 },
          { month: "May", count: 650, hires: 26, exits: 9 },
          { month: "Jul", count: 665, hires: 24, exits: 7 },
          { month: "Sep", count: 672, hires: 19, exits: 5 },
          { month: "Nov", count: 680, hires: 15, exits: 4 },
        ];
      }

      return (
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hcData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis domain={["dataMin - 100", "dataMax + 50"]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
              <Area type="monotone" dataKey="count" stroke={strokeColor} strokeWidth={2.5} fillOpacity={1} fill="url(#hcGrad)" name={trendLabel} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    }

    case "hr_department_split":
      const deptData = [
        { name: "Sewing Floor", count: 680, fill: "#2563eb" },
        { name: "Cutting Unit", count: 140, fill: "#06b6d4" },
        { name: "Finishing & Pack", count: 210, fill: "#10b981" },
        { name: "Quality Assurance", count: 95, fill: "#8b5cf6" },
        { name: "HR & Compliance", count: 48, fill: "#f59e0b" },
        { name: "Merchandising", count: 42, fill: "#ec4899" },
        { name: "Accounts & Store", count: 33, fill: "#64748b" },
      ];
      return (
        <div className="space-y-2 py-1">
          {deptData.slice(0, 5).map((dept) => (
            <div key={dept.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground/85">{dept.name}</span>
                <span className="font-mono font-bold text-foreground text-[11px]">{dept.count} Staff ({Math.round((dept.count / 1248) * 100)}%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(dept.count / 680) * 100}%`, backgroundColor: dept.fill }} />
              </div>
            </div>
          ))}
        </div>
      );

    case "hr_leave_approvals":
      if (scope === "personal") {
        return (
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between gap-2 text-xs">
              <div>
                <div className="font-bold text-foreground">Casual Leave (1 Day)</div>
                <div className="text-[10.5px] text-muted-foreground">Nov 12, 2026 • Family Urgent Work</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Approved
              </span>
            </div>
            <div className="p-2.5 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between gap-2 text-xs">
              <div>
                <div className="font-bold text-foreground">Medical Leave (1 Day)</div>
                <div className="text-[10.5px] text-muted-foreground">Nov 04, 2026 • Doctor Consultation</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Approved
              </span>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 border border-border/40 text-[10.5px] flex items-center justify-between font-mono font-bold">
              <span className="text-muted-foreground">My Leave Balance:</span>
              <span className="text-foreground">CL: 9d | SL: 11d | EL: 14d</span>
            </div>
          </div>
        );
      }

      if (scope === "managed_depts") {
        const managed = settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
        const deptTitle = `Head: ${managed.map((m) => m.split(" ")[0]).join(" & ")}`;
        const mLeaveList = [
          { name: "Javed Mia", role: "Sewing Line-3", dept: "Sewing Floor", type: "Casual Leave (2d)", reason: "Family Event", status: "Pending My Approval" },
          { name: "Shamim Hossain", role: "Cutting Master", dept: "Cutting Unit", type: "Sick Leave (1d)", reason: "Fever & Clinic", status: "Pending My Approval" },
          { name: "Rubel Ahmed", role: "Iron Operator", dept: "Sewing Floor", type: "Earned Leave (4d)", reason: "Village Trip", status: "Approved by Me" },
        ];
        return (
          <div className="space-y-2">
            <div className="text-[10.5px] font-bold text-amber-600 mb-1 flex items-center gap-1 truncate">
              <Crown className="size-3 text-amber-500" /> {deptTitle} (Awaiting Head Action)
            </div>
            {mLeaveList.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl border border-border/50 bg-muted/15 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <div className="font-bold text-foreground truncate flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <span className="text-[9.5px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-600 font-medium">{item.dept}</span>
                  </div>
                  <div className="text-[10.5px] text-muted-foreground">{item.role} • {item.type}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                  item.status.includes("Pending")
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        );
      }

      if (scope === "department") {
        const deptName = settings?.department || "Sewing Floor";
        const dLeaveList = [
          { name: "Javed Mia", role: "Sewing Line-3", type: "Casual Leave (2d)", reason: "Family Event", status: "Pending Supervisor" },
          { name: "Rubel Ahmed", role: "Iron Operator", type: "Earned Leave (4d)", reason: "Village Trip", status: "Approved" },
          { name: "Monirul Islam", role: "Sewing Line-5", type: "Medical Leave (1d)", reason: "Dental Doctor", status: "Pending HR" },
        ];
        return (
          <div className="space-y-2">
            <div className="text-[10.5px] font-bold text-purple-600 mb-1 flex items-center gap-1 truncate">
              <Building2 className="size-3" /> {deptName} Leave Queue
            </div>
            {dLeaveList.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl border border-border/50 bg-muted/15 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <div className="font-bold text-foreground truncate">{item.name}</div>
                  <div className="text-[10.5px] text-muted-foreground">{item.role} • {item.type}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                  item.status.includes("Pending")
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        );
      }

      const leaveList = [
        { name: "Javed Mia", role: "Sewing Operator", type: "Earn Leave (3d)", reason: "Family Event", status: "Pending Manager" },
        { name: "Kaikobad Howlader", role: "Quality Inspector", type: "Medical Leave (2d)", reason: "Fever & Clinic", status: "Pending HR" },
        { name: "Nusrat Jahan", role: "Sample Coordinator", type: "Casual Leave (1d)", reason: "Personal Work", status: "Approved" },
      ];
      return (
        <div className="space-y-2">
          {leaveList.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-xl border border-border/50 bg-muted/15 flex items-center justify-between gap-2 text-xs">
              <div className="min-w-0">
                <div className="font-bold text-foreground truncate">{item.name}</div>
                <div className="text-[10.5px] text-muted-foreground">{item.role} • {item.type}</div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                item.status.includes("Pending")
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      );

    case "hr_recruitment_pipeline":
      return (
        <div className={getMetricGridClass(colSpan, 4)}>
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Openings</span>
            <span className="text-xl font-mono font-bold text-foreground mt-1 block">18</span>
            <span className="text-[10px] text-muted-foreground">Requisitions</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Screening</span>
            <span className="text-xl font-mono font-bold text-foreground mt-1 block">142</span>
            <span className="text-[10px] text-muted-foreground">CVs In-Review</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Interview</span>
            <span className="text-xl font-mono font-bold text-foreground mt-1 block">24</span>
            <span className="text-[10px] text-muted-foreground">This Week</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Offered</span>
            <span className="text-xl font-mono font-bold text-foreground mt-1 block">6</span>
            <span className="text-[10px] text-muted-foreground">Accepted</span>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // Merchandising (MM) Components (Dynamic Buyer Filtering)
    // ----------------------------------------------------
    case "mm_order_pipeline": {
      const activeBuyers =
        settings?.buyers && settings.buyers.length > 0
          ? settings.buyers
          : settings?.buyer && settings.buyer !== "All Buyers"
          ? [settings.buyer]
          : [];

      const PROFILES: Record<string, { pcs: number; fob: number; onTime: number; styles: number }> = {
        "H&M Group": { pcs: 691000, fob: 5.64, onTime: 98.2, styles: 14 },
        "Zara / Inditex": { pcs: 436000, fob: 3.82, onTime: 95.8, styles: 8 },
        "Target USA": { pcs: 327000, fob: 2.84, onTime: 94.0, styles: 6 },
        "Next UK": { pcs: 218000, fob: 1.85, onTime: 96.5, styles: 5 },
        "C&A Europe": { pcs: 145000, fob: 1.15, onTime: 97.0, styles: 3 },
        "Marks & Spencer": { pcs: 180000, fob: 1.62, onTime: 96.0, styles: 4 },
        "Primark": { pcs: 290000, fob: 2.15, onTime: 95.2, styles: 7 },
        "Walmart USA": { pcs: 380000, fob: 3.10, onTime: 94.8, styles: 9 },
      };

      let orderVol = "1.82M";
      let fobVal = "$14.85M";
      let onTime = "96.4%";
      let note = "36 Running Orders";

      if (activeBuyers.length > 0) {
        let totPcs = 0;
        let totFob = 0;
        let totStyles = 0;
        let onTimeSum = 0;

        activeBuyers.forEach((b) => {
          const prof = PROFILES[b] || { pcs: 200000, fob: 1.5, onTime: 96.0, styles: 4 };
          totPcs += prof.pcs;
          totFob += prof.fob;
          totStyles += prof.styles;
          onTimeSum += prof.onTime;
        });

        const avgOnTime = (onTimeSum / activeBuyers.length).toFixed(1);
        orderVol = totPcs >= 1000000 ? `${(totPcs / 1000000).toFixed(2)}M` : `${Math.round(totPcs / 1000)}K`;
        fobVal = `$${totFob.toFixed(2)}M`;
        onTime = `${avgOnTime}%`;
        note =
          activeBuyers.length === 1
            ? `${totStyles} Running Styles (${activeBuyers[0].split(" ")[0]})`
            : `${totStyles} Styles across ${activeBuyers.length} Buyers`;
      }

      return (
        <div className={getMetricGridClass(colSpan, 4)}>
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <span className="text-[10.5px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
              Total Order Volume
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-foreground">{orderVol}</span>
              <span className="text-[10px] text-muted-foreground">Pieces</span>
            </div>
            <div className="text-[10px] text-teal-600/80 font-medium mt-1 truncate">{note}</div>
          </div>

          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
            <span className="text-[10.5px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              Total FOB Value
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-foreground">{fobVal}</span>
            </div>
            <div className="text-[10px] text-sky-600/80 font-medium mt-1">Export FOB Value</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              On-Time Performance
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                {onTime}
              </span>
            </div>
            <div className="text-[10px] text-emerald-600/80 font-medium mt-1">Inspection 1st pass: 98%</div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-[10.5px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Capacity Utilization
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-indigo-700 dark:text-indigo-300">
                91.2%
              </span>
            </div>
            <div className="text-[10px] text-indigo-600/80 font-medium mt-1">Booked thru March 2027</div>
          </div>
        </div>
      );
    }

    case "mm_buyer_distribution": {
      const activeBuyers =
        settings?.buyers && settings.buyers.length > 0
          ? settings.buyers
          : settings?.buyer && settings.buyer !== "All Buyers"
          ? [settings.buyer]
          : [];

      const ALL_BUYERS = [
        { name: "H&M Group", value: 38, pcs: "691K", color: "#2563eb" },
        { name: "Zara / Inditex", value: 24, pcs: "436K", color: "#10b981" },
        { name: "Target USA", value: 18, pcs: "327K", color: "#f59e0b" },
        { name: "Next UK", value: 12, pcs: "218K", color: "#8b5cf6" },
        { name: "C&A Europe", value: 8, pcs: "145K", color: "#ec4899" },
        { name: "Marks & Spencer", value: 10, pcs: "180K", color: "#06b6d4" },
        { name: "Primark", value: 16, pcs: "290K", color: "#14b8a6" },
        { name: "Walmart USA", value: 20, pcs: "380K", color: "#6366f1" },
      ];

      let buyerData = ALL_BUYERS.slice(0, 5);
      if (activeBuyers.length > 0) {
        const matched = ALL_BUYERS.filter((b) =>
          activeBuyers.some((ab) => ab.toLowerCase().includes(b.name.toLowerCase().split(" ")[0]))
        );
        if (matched.length > 0) {
          const tot = matched.reduce((acc, curr) => acc + curr.value, 0);
          buyerData = matched.map((b) => ({
            ...b,
            value: Math.max(1, Math.round((b.value / tot) * 100)),
          }));
        }
      }

      const buyerPieLayoutClass =
        colSpan <= 3 ? "flex flex-col items-center gap-2.5" : "flex flex-col sm:flex-row items-center gap-3";
      const buyerPieChartClass = colSpan <= 3 ? "w-full h-36" : "w-full sm:w-1/2 h-44";
      const buyerPieLegendClass = colSpan <= 3 ? "w-full space-y-1 text-xs" : "w-full sm:w-1/2 space-y-1.5 text-xs";

      return (
        <div className={buyerPieLayoutClass}>
          <div className={buyerPieChartClass}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={buyerData} innerRadius={colSpan <= 3 ? 32 : 40} outerRadius={colSpan <= 3 ? 52 : 65} paddingAngle={4} dataKey="value">
                  {buyerData.map((b) => (
                    <Cell key={b.name} fill={b.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}% Share`, "Volume"]} contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={buyerPieLegendClass}>
            {buyerData.map((b) => (
              <div key={b.name} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/20">
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full" style={{ backgroundColor: b.color }} />
                  <span className="text-muted-foreground font-medium text-[11px] truncate">{b.name}</span>
                </div>
                <span className="font-mono font-bold text-foreground text-[11px]">{b.value}% ({b.pcs})</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "mm_tna_critical_path":
      const milestones = [
        { title: "Lab Dip Approval", status: "Completed", pct: 100, color: "bg-emerald-500" },
        { title: "Yarn In-House", status: "Completed", pct: 100, color: "bg-emerald-500" },
        { title: "PP Sample Submission", status: "Approved", pct: 100, color: "bg-emerald-500" },
        { title: "Bulk Fabric Knitting", status: "On-Track", pct: 85, color: "bg-blue-500" },
        { title: "Sewing Floor Input", status: "Running", pct: 60, color: "bg-purple-500" },
        { title: "Ex-Factory Shipment", status: "Pending", pct: 15, color: "bg-amber-500" },
      ];
      return (
        <div className="space-y-2 py-1">
          {milestones.map((m) => (
            <div key={m.title} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground/80">{m.title}</span>
                <span className="font-mono text-[10.5px] font-bold text-muted-foreground">{m.status} ({m.pct}%)</span>
              </div>
              <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      );

    case "mm_line_efficiency":
      const lines = [
        { line: "Line 1 (Polo Shirt)", eff: "72.4%", dhu: "1.2%", status: "High" },
        { line: "Line 2 (Hoodie Fleece)", eff: "68.0%", dhu: "1.8%", status: "Normal" },
        { line: "Line 3 (Basic T-Shirt)", eff: "76.8%", dhu: "0.9%", status: "High" },
        { line: "Line 4 (Fancy Rib)", eff: "61.2%", dhu: "2.4%", status: "Critical" },
      ];
      return (
        <div className="space-y-2 py-1 text-xs">
          {lines.map((l) => (
            <div key={l.line} className="p-2.5 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-foreground block">{l.line}</span>
                <span className="text-[10.5px] text-muted-foreground">DHU Defect: {l.dhu}</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-foreground">{l.eff}</span>
                <span className="text-[10px] block font-semibold text-emerald-600">Efficiency</span>
              </div>
            </div>
          ))}
        </div>
      );

    case "mm_shipment_alerts": {
      const activeBuyers =
        settings?.buyers && settings.buyers.length > 0
          ? settings.buyers
          : settings?.buyer && settings.buyer !== "All Buyers"
          ? [settings.buyer]
          : [];

      const ALL_SHIPMENTS = [
        { po: "PO-78421", buyer: "H&M Group", style: "Cotton Slub Tee", qty: "48,000 Pcs", due: "3 Days Left", risk: "High" },
        { po: "PO-91024", buyer: "Zara / Inditex", style: "Oversized Fleece", qty: "26,500 Pcs", due: "7 Days Left", risk: "Medium" },
        { po: "PO-65319", buyer: "Target USA", style: "Kids Pyjama Set", qty: "65,000 Pcs", due: "12 Days Left", risk: "Low" },
        { po: "PO-44210", buyer: "Next UK", style: "Chino Twill Pant", qty: "32,000 Pcs", due: "5 Days Left", risk: "High" },
        { po: "PO-33108", buyer: "C&A Europe", style: "Basic Crewneck", qty: "22,000 Pcs", due: "10 Days Left", risk: "Medium" },
        { po: "PO-55190", buyer: "Walmart USA", style: "Cargo Bermuda", qty: "54,000 Pcs", due: "8 Days Left", risk: "Medium" },
      ];

      const shipments =
        activeBuyers.length > 0
          ? ALL_SHIPMENTS.filter((s) =>
              activeBuyers.some((ab) => ab.toLowerCase().includes(s.buyer.toLowerCase().split(" ")[0]))
            )
          : ALL_SHIPMENTS.slice(0, 4);

      return (
        <div className="space-y-2">
          {shipments.length === 0 ? (
            <div className="p-3 text-center text-xs text-muted-foreground">
              No urgent shipment risks for selected buyer(s).
            </div>
          ) : (
            shipments.map((s) => (
              <div key={s.po} className="p-2.5 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-foreground">{s.buyer} • {s.style}</div>
                  <div className="text-[10.5px] text-muted-foreground">{s.po} • {s.qty}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 block">
                    {s.due}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      );
    }

    // ----------------------------------------------------
    // Inventory Components (Dynamic Warehouse Filter)
    // ----------------------------------------------------
    case "inv_stock_valuation":
      const wh = settings?.warehouse;
      let val = "৳18.42 Cr";
      let skus = "4,820";
      let turnover = "6.4x";
      let alertCount = "14 Items";

      if (wh === "Trims & Accessories Warehouse") {
        val = "৳2.85 Cr";
        skus = "1,420";
        turnover = "8.2x";
        alertCount = "4 Items";
      } else if (wh === "Central Raw Material Store") {
        val = "৳11.20 Cr";
        skus = "1,840";
        turnover = "5.8x";
        alertCount = "6 Items";
      } else if (wh === "Chemical & Dyeing Store") {
        val = "৳4.37 Cr";
        skus = "980";
        turnover = "7.1x";
        alertCount = "3 Items";
      }

      return (
        <div className={getMetricGridClass(colSpan, 4)}>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider block">Stock Valuation</span>
            <span className="text-xl font-black font-mono text-foreground mt-1 block">{val}</span>
            <span className="text-[10px] text-muted-foreground truncate">{wh || "All Stores"}</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider block">Active Stock Items</span>
            <span className="text-xl font-black font-mono text-foreground mt-1 block">{skus}</span>
            <span className="text-[10px] text-muted-foreground">Distinct SKUs</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider block">Inventory Turnover</span>
            <span className="text-xl font-black font-mono text-foreground mt-1 block">{turnover}</span>
            <span className="text-[10px] text-muted-foreground">Days of supply</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[10.5px] font-bold text-rose-600 uppercase tracking-wider block">Safety Alert</span>
            <span className="text-xl font-black font-mono text-rose-600 mt-1 block">{alertCount}</span>
            <span className="text-[10px] text-muted-foreground">Below threshold</span>
          </div>
        </div>
      );

    case "inv_low_stock_alerts":
      const lowStockItems = [
        { code: "YRN-30-COT", name: "100% Combed Cotton 30/1", current: "1,200 Kg", safety: "4,000 Kg", urgent: true },
        { code: "ZIP-YKK-05", name: "YKK Antique Brass Zipper 5#", current: "850 Pcs", safety: "3,500 Pcs", urgent: true },
        { code: "THD-120-WHT", name: "Spun Poly Thread 120D White", current: "420 Cones", safety: "1,500 Cones", urgent: false },
        { code: "BTN-RES-14", name: "2-Hole Resin Button 14L", current: "18 Grs", safety: "80 Grs", urgent: false },
      ];
      return (
        <div className="space-y-2">
          {lowStockItems.map((item) => (
            <div key={item.code} className="p-2 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between text-xs">
              <div className="min-w-0">
                <span className="font-bold text-foreground truncate block">{item.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{item.code}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-rose-600 text-[11px] block">{item.current}</span>
                <span className="text-[9.5px] text-muted-foreground">Min: {item.safety}</span>
              </div>
            </div>
          ))}
        </div>
      );

    case "inv_movement_bar":
      const invMoveData = [
        { month: "Jun", receive: 142000, issue: 138000 },
        { month: "Jul", receive: 168000, issue: 154000 },
        { month: "Aug", receive: 189000, issue: 172000 },
        { month: "Sep", receive: 155000, issue: 161000 },
        { month: "Oct", receive: 210000, issue: 198000 },
        { month: "Nov", receive: 184000, issue: 178000 },
      ];
      return (
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={invMoveData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
              <Bar dataKey="receive" fill="#10b981" radius={[3, 3, 0, 0]} name="Received (MRR)" />
              <Bar dataKey="issue" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Issued to Floor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );

    case "inv_intercompany_transfers":
      const transfers = [
        { id: "TR-8942", from: "Pakiza Knit", to: "Pakiza Dyeing", item: "Single Jersey Grey 180 GSM", qty: "3,400 Kg", status: "In-Transit" },
        { id: "TR-8945", from: "Cotton Mill", to: "Garments Unit-2", item: "Sewing Thread White", qty: "600 Cones", status: "Delivered" },
        { id: "TR-8948", from: "Central Store", to: "Washing Plant", item: "Enzyme Chemical C-20", qty: "850 Ltr", status: "Pending Dispatch" },
      ];
      return (
        <div className="space-y-2">
          {transfers.map((t) => (
            <div key={t.id} className="p-2.5 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-foreground block">{t.item}</span>
                <span className="text-[10px] text-muted-foreground">{t.from} → {t.to} ({t.qty})</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                t.status === "Delivered" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"
              }`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      );

    // ----------------------------------------------------
    // Accounts & Finance Components
    // ----------------------------------------------------
    case "acc_payroll_payout":
      if (scope === "personal") {
        return (
          <div className={getMetricGridClass(colSpan, 4)}>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider block">
                My Net Payable
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-foreground">৳38,500</span>
              </div>
              <div className="text-[10px] text-blue-600/80 font-medium mt-1">Salary: Nov 2026</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider block">
                Gross Earnings
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                  ৳42,000
                </span>
              </div>
              <div className="text-[10px] text-emerald-600/80 font-medium mt-1">Basic + Allowances</div>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <span className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider block">
                Disbursement Mode
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-sm sm:text-base font-black font-mono text-purple-700 dark:text-purple-300 truncate">
                  Bank Asia
                </span>
              </div>
              <div className="text-[10px] text-purple-600/80 font-medium mt-1">A/C: ***892 (BEFTN)</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-[10.5px] font-bold text-rose-600 uppercase tracking-wider block">
                Total Deductions
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-rose-700 dark:text-rose-300">
                  ৳3,500
                </span>
              </div>
              <div className="text-[10px] text-rose-600/80 font-medium mt-1">Tax ৳2K • PF ৳1.5K</div>
            </div>
          </div>
        );
      }

      if (scope === "managed_depts") {
        const managed = settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
        const title = `Head: ${managed.map((m) => m.split(" ")[0]).join(" & ")}`;
        return (
          <div className={getMetricGridClass(colSpan, 4)}>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10.5px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block truncate">
                {title} Wage Bill
              </span>
              <span className="text-xl font-black font-mono text-foreground mt-1 block">৳2.04 Cr</span>
              <span className="text-[10px] text-muted-foreground">{managed.length} Managed Depts</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider block">Bank Transfer</span>
              <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300 mt-1 block">৳1.78 Cr</span>
              <span className="text-[10px] text-muted-foreground">87.2% of wage bill</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider block">Cash / MFS</span>
              <span className="text-xl font-black font-mono text-blue-700 dark:text-blue-300 mt-1 block">৳26.0 Lac</span>
              <span className="text-[10px] text-muted-foreground">Floor worker cash</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <span className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider block">Deductions</span>
              <span className="text-xl font-black font-mono text-purple-700 dark:text-purple-300 mt-1 block">৳15.2 Lac</span>
              <span className="text-[10px] text-muted-foreground">Tax & PF deductions</span>
            </div>
          </div>
        );
      }

      if (scope === "department") {
        const deptName = settings?.department || "Sewing Floor";
        return (
          <div className={getMetricGridClass(colSpan, 4)}>
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <span className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider block truncate">
                {deptName} Wage Bill
              </span>
              <span className="text-xl font-black font-mono text-foreground mt-1 block">৳1.68 Cr</span>
              <span className="text-[10px] text-muted-foreground">Department Total</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider block">Bank Transfer</span>
              <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300 mt-1 block">৳1.45 Cr</span>
              <span className="text-[10px] text-muted-foreground">86.3% of department</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider block">Cash / MFS</span>
              <span className="text-xl font-black font-mono text-blue-700 dark:text-blue-300 mt-1 block">৳23.0 Lac</span>
              <span className="text-[10px] text-muted-foreground">Floor worker cash</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10.5px] font-bold text-amber-600 uppercase tracking-wider block">Deductions</span>
              <span className="text-xl font-black font-mono text-amber-700 dark:text-amber-300 mt-1 block">৳12.8 Lac</span>
              <span className="text-[10px] text-muted-foreground">Department Deductions</span>
            </div>
          </div>
        );
      }

      return (
        <div className={getMetricGridClass(colSpan, 4)}>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider block">Net Payroll Payable</span>
            <span className="text-xl font-black font-mono text-foreground mt-1 block">৳3.28 Cr</span>
            <span className="text-[10px] text-muted-foreground">For Month: Nov 2026</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider block">Bank Transfer (88%)</span>
            <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300 mt-1 block">৳2.89 Cr</span>
            <span className="text-[10px] text-muted-foreground">BEFTN / EFT Routing</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider block">Cash / MFS (12%)</span>
            <span className="text-xl font-black font-mono text-blue-700 dark:text-blue-300 mt-1 block">৳39.2 Lac</span>
            <span className="text-[10px] text-muted-foreground">Floor worker cash</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10.5px] font-bold text-amber-600 uppercase tracking-wider block">Total Deductions</span>
            <span className="text-xl font-black font-mono text-amber-700 dark:text-amber-300 mt-1 block">৳24.6 Lac</span>
            <span className="text-[10px] text-muted-foreground">Tax, Advance & Stamp</span>
          </div>
        </div>
      );

    case "acc_department_cost":
      const costData = [
        { dept: "Sewing Floor", cost: 16800000 },
        { dept: "Finishing Unit", cost: 4200000 },
        { dept: "Cutting Floor", cost: 3600000 },
        { dept: "Admin & Executive", cost: 4800000 },
        { dept: "Quality & Merch", cost: 3400000 },
      ];
      return (
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={(v) => `৳${(v / 100000).toFixed(0)}L`} />
              <YAxis dataKey="dept" type="category" tick={{ fontSize: 9.5 }} />
              <Tooltip formatter={(v: any) => [`৳${v.toLocaleString()}`, "Payroll Cost"]} contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
              <Bar dataKey="cost" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );

    case "acc_pending_invoices":
      const invoices = [
        { supplier: "Apex Yarn Mills Ltd", billNo: "INV-2026-904", amount: "৳ 42,50,000", due: "Tomorrow" },
        { supplier: "YKK Bangladesh Ltd", billNo: "INV-2026-881", amount: "৳ 8,40,000", due: "3 Days" },
        { supplier: "Titas Gas Transmission", billNo: "UTIL-NOV-01", amount: "৳ 14,20,000", due: "5 Days" },
      ];
      return (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div key={inv.billNo} className="p-2.5 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-foreground block">{inv.supplier}</span>
                <span className="text-[10px] text-muted-foreground">{inv.billNo} • Due in {inv.due}</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-foreground block">{inv.amount}</span>
                <span className="text-[9.5px] text-amber-600 font-semibold">Pending Approval</span>
              </div>
            </div>
          ))}
        </div>
      );

    // ----------------------------------------------------
    // Procurement Components
    // ----------------------------------------------------
    case "proc_active_po":
      return (
        <div className={colSpan <= 3 ? "grid grid-cols-1 gap-2 py-1" : "grid grid-cols-2 gap-2 text-center py-1"}>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <span className="text-[10.5px] font-bold text-cyan-600 uppercase tracking-wider block">Open POs</span>
            <span className="text-2xl font-black font-mono text-foreground mt-1 block">142</span>
            <span className="text-[10px] text-muted-foreground">Active requisitions</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider block">Committed Spend</span>
            <span className="text-2xl font-black font-mono text-foreground mt-1 block">$3.2M</span>
            <span className="text-[10px] text-muted-foreground">Raw materials & trims</span>
          </div>
        </div>
      );

    case "proc_vendor_rating":
      const vendors = [
        { name: "Pabna Textile Ltd", category: "Fabric Knitting", otif: "98.2%", rating: "A+" },
        { name: "Global Trims & Poly", category: "Packaging", otif: "94.5%", rating: "A" },
        { name: "Chittagong Dyestuff", category: "Chemicals", otif: "88.0%", rating: "B+" },
      ];
      return (
        <div className="space-y-2 text-xs">
          {vendors.map((v) => (
            <div key={v.name} className="p-2.5 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-foreground block">{v.name}</span>
                <span className="text-[10px] text-muted-foreground">{v.category}</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-600 text-xs">{v.otif} OTIF</span>
                <span className="text-[10px] text-muted-foreground block font-bold">Grade {v.rating}</span>
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="p-6 text-center text-xs text-muted-foreground">
          Widget content for {componentId} is ready.
        </div>
      );
  }
}
