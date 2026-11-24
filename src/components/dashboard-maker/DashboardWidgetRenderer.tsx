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

          {settings?.buyer && settings.buyer !== "All Buyers" && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center gap-1 shrink-0"
              title={`Buyer: ${settings.buyer}`}
            >
              <Store className="size-3" /> {(widget.colSpan || 12) > 3 ? settings.buyer.split(" ")[0] : ""}
            </span>
          )}

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

    case "hr_ot_bar_chart":
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

    case "hr_headcount_trend":
      const hcData = [
        { month: "Jan", count: 1120, hires: 34, exits: 12 },
        { month: "Mar", count: 1150, hires: 42, exits: 15 },
        { month: "May", count: 1190, hires: 55, exits: 18 },
        { month: "Jul", count: 1210, hires: 48, exits: 14 },
        { month: "Sep", count: 1235, hires: 38, exits: 11 },
        { month: "Nov", count: 1248, hires: 26, exits: 9 },
      ];
      return (
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hcData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis domain={["dataMin - 100", "dataMax + 50"]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
              <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#hcGrad)" name="Total Staff" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );

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
    case "mm_order_pipeline":
      const buyer = settings?.buyer;
      let orderVol = "1.82M";
      let fobVal = "$14.85M";
      let onTime = "96.4%";
      let note = "36 Running Orders";

      if (buyer === "H&M Group") {
        orderVol = "691K";
        fobVal = "$5.64M";
        onTime = "98.2%";
        note = "14 Running Styles (Polo/Tee)";
      } else if (buyer === "Zara / Inditex") {
        orderVol = "436K";
        fobVal = "$3.82M";
        onTime = "95.8%";
        note = "8 Running Styles (Fleece/Rib)";
      } else if (buyer === "Target USA") {
        orderVol = "327K";
        fobVal = "$2.84M";
        onTime = "94.0%";
        note = "6 Running Styles (Pyjama)";
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

    case "mm_buyer_distribution":
      const buyerData = [
        { name: "H&M Group", value: 38, pcs: "691K", color: "#2563eb" },
        { name: "ZARA / Inditex", value: 24, pcs: "436K", color: "#10b981" },
        { name: "Target USA", value: 18, pcs: "327K", color: "#f59e0b" },
        { name: "Next UK", value: 12, pcs: "218K", color: "#8b5cf6" },
        { name: "C&A Europe", value: 8, pcs: "145K", color: "#ec4899" },
      ];
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

    case "mm_shipment_alerts":
      const shipments = [
        { po: "PO-78421", buyer: "H&M", style: "Cotton Slub Tee", qty: "48,000 Pcs", due: "3 Days Left", risk: "High" },
        { po: "PO-91024", buyer: "Zara", style: "Oversized Fleece", qty: "26,500 Pcs", due: "7 Days Left", risk: "Medium" },
        { po: "PO-65319", buyer: "Target", style: "Kids Pyjama Set", qty: "65,000 Pcs", due: "12 Days Left", risk: "Low" },
      ];
      return (
        <div className="space-y-2">
          {shipments.map((s) => (
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
          ))}
        </div>
      );

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
