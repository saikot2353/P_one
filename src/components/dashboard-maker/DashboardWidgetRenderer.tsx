import React, { useState } from "react";
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
  Maximize2,
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
  LabelList,
} from "recharts";
import {
  DashboardWidgetConfig,
  DASHBOARD_COMPONENTS_CATALOG,
  getEffectiveEnabledChips,
  WidgetSettings,
  WidgetColSpan,
} from "./dashboard-maker-types";
import { HierarchyDrillDownModal } from "./HierarchyDrillDownModal";

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
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const def = DASHBOARD_COMPONENTS_CATALOG.find((c) => c.id === widget.componentId);
  const displayTitle = widget.customTitle || def?.name || "Dashboard Widget";
  const settings = widget.settings;

  return (
    <>
      <div
        onClick={() => setIsDrillDownOpen(true)}
        className="h-full bg-card rounded-2xl border border-border/60 shadow-xs p-4 sm:p-5 flex flex-col justify-between transition-all hover:border-primary/40 hover:shadow-md cursor-pointer group/card"
        title="Click to open Hierarchy Drill-Down (Company → Region → Dept → Section → Unit → Line)"
      >
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
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              Self
            </span>
          )}

          {settings?.scope === "area" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
              {(settings.areas?.length || 0) > 1 ? `Area (${settings.areas?.length})` : settings.areas?.[0]?.split(" ")[0] || "Area"}
            </span>
          )}

          {(settings?.scope === "managed_depts" || settings?.scope === "department") && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
              {(() => {
                const depts = settings.departments || settings.managedDepartments || (settings.department ? [settings.department] : []);
                return depts.length > 1 ? `Dept (${depts.length})` : depts[0]?.split(" ")[0] || "Dept";
              })()}
            </span>
          )}

          {(!settings?.scope || settings?.scope === "company") && def?.supportedScopes && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              All Company
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

          {/* Drill-Down Indicator Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDrillDownOpen(true);
            }}
            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/20 flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            title="Drill Down: Company → Region → Department → Section → Unit → Line"
          >
            <Maximize2 className="size-2.5" />
            {(widget.colSpan || 12) > 3 && <span>Drill Down</span>}
          </button>
        </div>
      </div>

      {/* Widget Content Body */}
      <div className="flex-1 min-h-[140px] flex flex-col justify-center">
        {renderWidgetContent(widget.componentId, isCompact, settings, widget.colSpan || 12)}
      </div>
    </div>

    <HierarchyDrillDownModal
      isOpen={isDrillDownOpen}
      onClose={() => setIsDrillDownOpen(false)}
      widget={widget}
    />
  </>
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
  if (count <= 1) return "grid grid-cols-1 gap-2.5 py-1";
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
    if (count === 2) return "grid grid-cols-2 gap-2.5 py-1";
    if (count === 3) return "grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-1";
    return count >= 5 ? "grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-1" : "grid grid-cols-2 gap-2.5 py-1";
  }
  // 100% full width
  if (count === 2) return "grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-1";
  if (count === 3) return "grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-1";
  if (count === 4) return "grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-1";
  if (count === 5) return "grid grid-cols-2 sm:grid-cols-5 gap-2.5 py-1";
  return "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 py-1";
}

function renderWidgetContent(
  componentId: string,
  isCompact: boolean,
  settings?: WidgetSettings,
  colSpan: WidgetColSpan = 12
) {
  const scope = settings?.scope || "company";
  const def = DASHBOARD_COMPONENTS_CATALOG.find((c) => c.id === componentId);
  const enabledChips = getEffectiveEnabledChips(def, settings);
  const isChipVisible = (chipId: string) => enabledChips.length === 0 || enabledChips.includes(chipId);

  switch (componentId) {
    // ----------------------------------------------------
    // HRIS Components (Dynamic Scope: Personal vs Dept vs Company)
    // ----------------------------------------------------
    case "hr_quick_stats": {
      type StatChip = {
        id: string;
        label: string;
        value: string;
        unit?: string;
        pct?: string;
        note: string;
        boxClass: string;
        labelClass: string;
        valueClass: string;
        noteClass: string;
      };

      let chips: StatChip[] = [];

      if (scope === "personal") {
        chips = [
          {
            id: "total_workforce",
            label: "Today's Status",
            value: "Present",
            note: "In: 08:48 AM",
            boxClass: "bg-emerald-500/10 border-emerald-500/20",
            labelClass: "text-emerald-600 dark:text-emerald-400",
            valueClass: "text-emerald-700 dark:text-emerald-300",
            noteClass: "text-emerald-600/80",
          },
          {
            id: "present_today",
            label: "Monthly Working",
            value: "21 / 22",
            pct: "95.5%",
            note: "1 Day Weekend Duty",
            boxClass: "bg-blue-500/10 border-blue-500/20",
            labelClass: "text-blue-600 dark:text-blue-400",
            valueClass: "text-foreground",
            noteClass: "text-muted-foreground",
          },
          {
            id: "absent",
            label: "Leaves Taken",
            value: "2 Days",
            note: "Remaining: 12 Days",
            boxClass: "bg-purple-500/10 border-purple-500/20",
            labelClass: "text-purple-600 dark:text-purple-400",
            valueClass: "text-purple-700 dark:text-purple-300",
            noteClass: "text-purple-600/80",
          },
          {
            id: "late_punch",
            label: "My Late Punches",
            value: "1 Time",
            note: "12 min grace OK",
            boxClass: "bg-amber-500/10 border-amber-500/20",
            labelClass: "text-amber-600 dark:text-amber-400",
            valueClass: "text-amber-700 dark:text-amber-300",
            noteClass: "text-amber-600/80",
          },
          {
            id: "on_leave",
            label: "My Overtime",
            value: "16.5h",
            note: "Est OT: ৳4,120",
            boxClass: "bg-cyan-500/10 border-cyan-500/20",
            labelClass: "text-cyan-600 dark:text-cyan-400",
            valueClass: "text-cyan-700 dark:text-cyan-300",
            noteClass: "text-cyan-600/80",
          },
          {
            id: "ot_active",
            label: "Shift Schedule",
            value: "General",
            note: "08:00 AM – 05:00 PM",
            boxClass: "bg-indigo-500/10 border-indigo-500/20",
            labelClass: "text-indigo-600 dark:text-indigo-400",
            valueClass: "text-indigo-700 dark:text-indigo-300",
            noteClass: "text-indigo-600/80",
          },
          {
            id: "new_joiners",
            label: "Attendance Bonus",
            value: "Eligible",
            note: "Zero Uninformed Abs",
            boxClass: "bg-teal-500/10 border-teal-500/20",
            labelClass: "text-teal-600 dark:text-teal-400",
            valueClass: "text-teal-700 dark:text-teal-300",
            noteClass: "text-teal-600/80",
          },
          {
            id: "early_leave",
            label: "Early Departure",
            value: "0",
            note: "This Month",
            boxClass: "bg-slate-500/10 border-slate-500/20",
            labelClass: "text-slate-600 dark:text-slate-400",
            valueClass: "text-foreground",
            noteClass: "text-muted-foreground",
          },
        ];
      } else if (scope === "area") {
        const areasList = settings?.areas || ["Dhaka North / Gazipur"];
        const factor = Math.min(1, Math.max(0.28, areasList.length / 3));
        const areaLabel = areasList.length > 1 ? `${areasList.length} Areas` : areasList[0].split(" ")[0];
        const total = Math.round(1248 * factor);
        const pres = Math.round(1196 * factor);
        const abs = Math.round(42 * factor);
        const late = Math.round(73 * factor);
        const leave = Math.round(10 * factor);
        chips = [
          {
            id: "total_workforce",
            label: `${areaLabel} Staff`,
            value: total.toLocaleString(),
            unit: "Staff",
            note: `${areasList.length} Area(s)`,
            boxClass: "bg-indigo-500/10 border-indigo-500/20",
            labelClass: "text-indigo-600 dark:text-indigo-400",
            valueClass: "text-foreground",
            noteClass: "text-indigo-600/80",
          },
          {
            id: "present_today",
            label: "Present Today",
            value: pres.toLocaleString(),
            pct: `${((pres / total) * 100).toFixed(1)}%`,
            note: "Area On-Duty",
            boxClass: "bg-emerald-500/10 border-emerald-500/20",
            labelClass: "text-emerald-600 dark:text-emerald-400",
            valueClass: "text-emerald-700 dark:text-emerald-300",
            noteClass: "text-emerald-600/80",
          },
          {
            id: "absent",
            label: "Absent",
            value: abs.toString(),
            pct: `${((abs / total) * 100).toFixed(1)}%`,
            note: "Area Absentees",
            boxClass: "bg-rose-500/10 border-rose-500/20",
            labelClass: "text-rose-600 dark:text-rose-400",
            valueClass: "text-rose-700 dark:text-rose-300",
            noteClass: "text-rose-600/80",
          },
          {
            id: "late_punch",
            label: "Late Punch",
            value: late.toString(),
            pct: `${((late / total) * 100).toFixed(1)}%`,
            note: "Grace applied",
            boxClass: "bg-amber-500/10 border-amber-500/20",
            labelClass: "text-amber-600 dark:text-amber-400",
            valueClass: "text-amber-700 dark:text-amber-300",
            noteClass: "text-amber-600/80",
          },
          {
            id: "on_leave",
            label: "On Leave",
            value: leave.toString(),
            pct: `${((leave / total) * 100).toFixed(1)}%`,
            note: "Approved Leave",
            boxClass: "bg-purple-500/10 border-purple-500/20",
            labelClass: "text-purple-600 dark:text-purple-400",
            valueClass: "text-purple-700 dark:text-purple-300",
            noteClass: "text-purple-600/80",
          },
          {
            id: "ot_active",
            label: "Active on OT",
            value: Math.round(618 * factor).toString(),
            pct: "51.7%",
            note: "Night shift active",
            boxClass: "bg-cyan-500/10 border-cyan-500/20",
            labelClass: "text-cyan-600 dark:text-cyan-400",
            valueClass: "text-cyan-700 dark:text-cyan-300",
            noteClass: "text-cyan-600/80",
          },
          {
            id: "new_joiners",
            label: "New Joiners (MTD)",
            value: `+${Math.max(1, Math.round(14 * factor))}`,
            note: "In selected area",
            boxClass: "bg-teal-500/10 border-teal-500/20",
            labelClass: "text-teal-600 dark:text-teal-400",
            valueClass: "text-teal-700 dark:text-teal-300",
            noteClass: "text-teal-600/80",
          },
          {
            id: "early_leave",
            label: "Early Departure",
            value: Math.max(1, Math.round(7 * factor)).toString(),
            note: "Approved gate pass",
            boxClass: "bg-slate-500/10 border-slate-500/20",
            labelClass: "text-slate-600 dark:text-slate-400",
            valueClass: "text-foreground",
            noteClass: "text-muted-foreground",
          },
        ];
      } else if (scope === "managed_depts") {
        const managed = settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
        const label = managed.map((m) => m.split(" ")[0]).join(" + ");
        chips = [
          {
            id: "total_workforce",
            label: `${label} (Head)`,
            value: "820",
            unit: "Workers",
            note: `${managed.length} Managed Departments`,
            boxClass: "bg-amber-500/10 border-amber-500/20",
            labelClass: "text-amber-700 dark:text-amber-300",
            valueClass: "text-foreground",
            noteClass: "text-amber-600/90",
          },
          {
            id: "present_today",
            label: "Present on Duty",
            value: "785",
            pct: "95.7%",
            note: "Across Managed Lines",
            boxClass: "bg-emerald-500/10 border-emerald-500/20",
            labelClass: "text-emerald-600 dark:text-emerald-400",
            valueClass: "text-emerald-700 dark:text-emerald-300",
            noteClass: "text-emerald-600/80",
          },
          {
            id: "absent",
            label: "Absentees",
            value: "21",
            pct: "2.6%",
            note: "Uninformed delay",
            boxClass: "bg-rose-500/10 border-rose-500/20",
            labelClass: "text-rose-600 dark:text-rose-400",
            valueClass: "text-rose-700 dark:text-rose-300",
            noteClass: "text-rose-600/80",
          },
          {
            id: "late_punch",
            label: "Late Punches",
            value: "14",
            note: "Under 15m grace",
            boxClass: "bg-amber-500/10 border-amber-500/20",
            labelClass: "text-amber-600 dark:text-amber-400",
            valueClass: "text-amber-700 dark:text-amber-300",
            noteClass: "text-amber-600/80",
          },
          {
            id: "on_leave",
            label: "On Approved Leave",
            value: "14",
            note: "Approved by Me",
            boxClass: "bg-purple-500/10 border-purple-500/20",
            labelClass: "text-purple-600 dark:text-purple-400",
            valueClass: "text-purple-700 dark:text-purple-300",
            noteClass: "text-purple-600/80",
          },
          {
            id: "ot_active",
            label: "Active on OT",
            value: "412",
            pct: "52.5%",
            note: "Night shift scheduled",
            boxClass: "bg-indigo-500/10 border-indigo-500/20",
            labelClass: "text-indigo-600 dark:text-indigo-400",
            valueClass: "text-indigo-700 dark:text-indigo-300",
            noteClass: "text-indigo-600/80",
          },
          {
            id: "new_joiners",
            label: "New Joiners (MTD)",
            value: "+9",
            note: "Line onboarding",
            boxClass: "bg-teal-500/10 border-teal-500/20",
            labelClass: "text-teal-600 dark:text-teal-400",
            valueClass: "text-teal-700 dark:text-teal-300",
            noteClass: "text-teal-600/80",
          },
          {
            id: "early_leave",
            label: "Early Departure",
            value: "4",
            note: "Gate pass logged",
            boxClass: "bg-slate-500/10 border-slate-500/20",
            labelClass: "text-slate-600 dark:text-slate-400",
            valueClass: "text-foreground",
            noteClass: "text-muted-foreground",
          },
        ];
      } else if (scope === "department") {
        const deptName = settings?.department || "Sewing Floor";
        chips = [
          {
            id: "total_workforce",
            label: `${deptName} Staff`,
            value: "680",
            unit: "Operators",
            note: "Total in Department",
            boxClass: "bg-blue-500/10 border-blue-500/20",
            labelClass: "text-blue-600",
            valueClass: "text-foreground",
            noteClass: "text-blue-600/80",
          },
          {
            id: "present_today",
            label: "Present on Floor",
            value: "652",
            pct: "95.9%",
            note: "Active on sewing lines",
            boxClass: "bg-emerald-500/10 border-emerald-500/20",
            labelClass: "text-emerald-600",
            valueClass: "text-emerald-700 dark:text-emerald-300",
            noteClass: "text-emerald-600/80",
          },
          {
            id: "absent",
            label: "Floor Absentees",
            value: "18",
            pct: "2.6%",
            note: "Uninformed delay",
            boxClass: "bg-rose-500/10 border-rose-500/20",
            labelClass: "text-rose-600",
            valueClass: "text-rose-700 dark:text-rose-300",
            noteClass: "text-rose-600/80",
          },
          {
            id: "late_punch",
            label: "Late Punches",
            value: "24",
            note: "Shift-1 late arrivals",
            boxClass: "bg-amber-500/10 border-amber-500/20",
            labelClass: "text-amber-600",
            valueClass: "text-amber-700 dark:text-amber-300",
            noteClass: "text-amber-600/80",
          },
          {
            id: "on_leave",
            label: "On Approved Leave",
            value: "10",
            note: "Medical & Casual",
            boxClass: "bg-purple-500/10 border-purple-500/20",
            labelClass: "text-purple-600",
            valueClass: "text-purple-700 dark:text-purple-300",
            noteClass: "text-purple-600/80",
          },
          {
            id: "ot_active",
            label: "Active on OT",
            value: "340",
            pct: "52.1%",
            note: "OT Requisitioned",
            boxClass: "bg-indigo-500/10 border-indigo-500/20",
            labelClass: "text-indigo-600",
            valueClass: "text-indigo-700 dark:text-indigo-300",
            noteClass: "text-indigo-600/80",
          },
          {
            id: "new_joiners",
            label: "New Joiners (MTD)",
            value: "+6",
            note: "This month",
            boxClass: "bg-teal-500/10 border-teal-500/20",
            labelClass: "text-teal-600",
            valueClass: "text-teal-700 dark:text-teal-300",
            noteClass: "text-teal-600/80",
          },
          {
            id: "early_leave",
            label: "Early Departure",
            value: "3",
            note: "Gate pass logged",
            boxClass: "bg-slate-500/10 border-slate-500/20",
            labelClass: "text-slate-600",
            valueClass: "text-foreground",
            noteClass: "text-muted-foreground",
          },
        ];
      } else {
        chips = [
          {
            id: "total_workforce",
            label: "Total Workforce",
            value: "1,248",
            unit: "Staff",
            note: "+14 this month",
            boxClass: "bg-blue-500/10 border-blue-500/20",
            labelClass: "text-blue-600 dark:text-blue-400",
            valueClass: "text-foreground",
            noteClass: "text-blue-600/80",
          },
          {
            id: "present_today",
            label: "Present Today",
            value: "1,196",
            pct: "95.8%",
            note: "Floor On-Duty",
            boxClass: "bg-emerald-500/10 border-emerald-500/20",
            labelClass: "text-emerald-600 dark:text-emerald-400",
            valueClass: "text-emerald-700 dark:text-emerald-300",
            noteClass: "text-emerald-600/80",
          },
          {
            id: "absent",
            label: "Absent",
            value: "42",
            pct: "3.4%",
            note: "18 Uninformed",
            boxClass: "bg-rose-500/10 border-rose-500/20",
            labelClass: "text-rose-600 dark:text-rose-400",
            valueClass: "text-rose-700 dark:text-rose-300",
            noteClass: "text-rose-600/80",
          },
          {
            id: "late_punch",
            label: "Late Punch",
            value: "73",
            pct: "5.8%",
            note: "Grace period applied",
            boxClass: "bg-amber-500/10 border-amber-500/20",
            labelClass: "text-amber-600 dark:text-amber-400",
            valueClass: "text-amber-700 dark:text-amber-300",
            noteClass: "text-amber-600/80",
          },
          {
            id: "on_leave",
            label: "On Leave",
            value: "10",
            pct: "0.8%",
            note: "Approved & Logged",
            boxClass: "bg-purple-500/10 border-purple-500/20",
            labelClass: "text-purple-600 dark:text-purple-400",
            valueClass: "text-purple-700 dark:text-purple-300",
            noteClass: "text-purple-600/80",
          },
          {
            id: "ot_active",
            label: "Active on OT",
            value: "618",
            pct: "51.7%",
            note: "Night shift active",
            boxClass: "bg-indigo-500/10 border-indigo-500/20",
            labelClass: "text-indigo-600 dark:text-indigo-400",
            valueClass: "text-indigo-700 dark:text-indigo-300",
            noteClass: "text-indigo-600/80",
          },
          {
            id: "new_joiners",
            label: "New Joiners (MTD)",
            value: "+14",
            note: "Across 6 units",
            boxClass: "bg-teal-500/10 border-teal-500/20",
            labelClass: "text-teal-600 dark:text-teal-400",
            valueClass: "text-teal-700 dark:text-teal-300",
            noteClass: "text-teal-600/80",
          },
          {
            id: "early_leave",
            label: "Early Departure",
            value: "7",
            pct: "0.6%",
            note: "Approved gate pass",
            boxClass: "bg-slate-500/10 border-slate-500/20",
            labelClass: "text-slate-600 dark:text-slate-400",
            valueClass: "text-foreground",
            noteClass: "text-muted-foreground",
          },
        ];
      }

      const visibleChips = chips.filter((c) => isChipVisible(c.id));

      return (
        <div className={getMetricGridClass(colSpan, visibleChips.length)}>
          {visibleChips.map((chip) => (
            <div key={chip.id} className={`p-3 rounded-xl border ${chip.boxClass}`}>
              <span className={`text-[10.5px] font-bold uppercase tracking-wider block truncate ${chip.labelClass}`}>
                {chip.label}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-xl sm:text-2xl font-black font-mono ${chip.valueClass}`}>
                  {chip.value}
                </span>
                {chip.unit && <span className="text-[10px] text-muted-foreground">{chip.unit}</span>}
                {chip.pct && <span className={`text-[10px] font-bold ${chip.labelClass}`}>{chip.pct}</span>}
              </div>
              <div className={`text-[10px] font-medium mt-1 truncate ${chip.noteClass}`}>{chip.note}</div>
            </div>
          ))}
        </div>
      );
    }

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
      } else if (scope === "area") {
        const areasList = settings?.areas || ["Dhaka North / Gazipur"];
        const factor = Math.min(1, Math.max(0.3, areasList.length / 3));
        otReq = Math.round(14800 * factor);
        otCons = Math.round(13920 * factor);
        otCostBud = `৳${(37.0 * factor).toFixed(1)}L`;
        otCostAct = `৳${(34.8 * factor).toFixed(1)}L`;
        otSavedCost = `৳${(2.2 * factor).toFixed(2)}L`;
        otTitle = areasList.length > 1 ? `${areasList.length} Selected Areas` : areasList[0];
        otReqData = otReqData.map((d) => ({
          ...d,
          requisition: Math.round(d.requisition * factor),
          consumed: Math.round(d.consumed * factor),
          variance: Math.round(d.variance * factor),
        }));
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
              className={`p-2.5 rounded-xl border flex flex-col justify-between ${isUnderBudget ? "bg-teal-500/10 border-teal-500/20" : "bg-rose-500/10 border-rose-500/20"
                }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${isUnderBudget ? "text-teal-700 dark:text-teal-300" : "text-rose-600"
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
                  className={`text-lg sm:text-xl font-black font-mono ${isUnderBudget ? "text-teal-700 dark:text-teal-300" : "text-rose-600"
                    }`}
                >
                  {isUnderBudget ? `-${Math.abs(varianceHrs).toLocaleString()}` : `+${varianceHrs.toLocaleString()}`}
                </span>
                <span
                  className={`text-[10px] font-bold ${isUnderBudget ? "text-teal-600" : "text-rose-600"
                    }`}
                >
                  hrs ({variancePct}%)
                </span>
              </div>
              <div
                className={`text-[9.5px] font-bold flex items-center gap-1 ${isUnderBudget ? "text-teal-700 dark:text-teal-300" : "text-rose-600"
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

    case "hr_ot_requisition_vs_utilization": {
      // Overtime Requisition vs Productive Floor Utilization
      let reqHours = 14800;
      let utilHours = 13920;
      let unutilHours = 880;
      let utilRate = 94.1;
      let otOutputPcs = "256,120 Pcs";
      let pcsPerHour = "18.4 Pcs/Hr";
      let otTitle = "Factory Floor (6 Lines & Finishing)";

      let utilData: Array<{
        name: string;
        requisition: number;
        utilized: number;
        unutilized: number;
        rate: number;
      }> = [
        { name: "Sewing L-01", requisition: 2800, utilized: 2680, unutilized: 120, rate: 95.7 },
        { name: "Sewing L-02", requisition: 2750, utilized: 2620, unutilized: 130, rate: 95.3 },
        { name: "Sewing L-03", requisition: 2500, utilized: 2450, unutilized: 50, rate: 98.0 },
        { name: "Sewing L-04", requisition: 2400, utilized: 2210, unutilized: 190, rate: 92.1 },
        { name: "Cutting Sec", requisition: 2350, utilized: 2210, unutilized: 140, rate: 94.0 },
        { name: "Finishing", requisition: 2000, utilized: 1750, unutilized: 250, rate: 87.5 },
      ];

      if (scope === "personal") {
        reqHours = 20.0;
        utilHours = 18.5;
        unutilHours = 1.5;
        utilRate = 92.5;
        otOutputPcs = "100% Tasks";
        pcsPerHour = "1.0 Task/Hr";
        otTitle = "My Personal OT Utilization";
        utilData = [
          { name: "Sat", requisition: 3.5, utilized: 3.0, unutilized: 0.5, rate: 85.7 },
          { name: "Sun", requisition: 3.0, utilized: 3.0, unutilized: 0, rate: 100 },
          { name: "Mon", requisition: 3.5, utilized: 3.5, unutilized: 0, rate: 100 },
          { name: "Tue", requisition: 3.0, utilized: 2.5, unutilized: 0.5, rate: 83.3 },
          { name: "Wed", requisition: 4.0, utilized: 3.5, unutilized: 0.5, rate: 87.5 },
          { name: "Thu", requisition: 3.0, utilized: 3.0, unutilized: 0, rate: 100 },
        ];
      } else if (scope === "area") {
        const areasList = settings?.areas || ["Dhaka North / Gazipur"];
        const factor = Math.min(1, Math.max(0.3, areasList.length / 3));
        reqHours = Math.round(14800 * factor);
        utilHours = Math.round(13920 * factor);
        unutilHours = Math.max(0, reqHours - utilHours);
        utilRate = 94.1;
        otOutputPcs = `${Math.round(256120 * factor).toLocaleString()} Pcs`;
        otTitle = areasList.length > 1 ? `${areasList.length} Selected Areas` : areasList[0];
        utilData = utilData.map((d) => ({
          ...d,
          requisition: Math.round(d.requisition * factor),
          utilized: Math.round(d.utilized * factor),
          unutilized: Math.round(d.unutilized * factor),
        }));
      } else if (scope === "managed_depts") {
        const managed = settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
        reqHours = 8400;
        utilHours = 8050;
        unutilHours = 350;
        utilRate = 95.8;
        otOutputPcs = "148,500 Pcs";
        pcsPerHour = "18.4 Pcs/Hr";
        otTitle = `Head of: ${managed.map((m) => m.split(" ")[0]).join(" & ")}`;
        utilData = [
          { name: "Sewing L-01", requisition: 1850, utilized: 1780, unutilized: 70, rate: 96.2 },
          { name: "Sewing L-02", requisition: 1750, utilized: 1700, unutilized: 50, rate: 97.1 },
          { name: "Sewing L-03", requisition: 1650, utilized: 1610, unutilized: 40, rate: 97.6 },
          { name: "Sewing L-04", requisition: 1550, utilized: 1460, unutilized: 90, rate: 94.2 },
          { name: "Cutting Sec", requisition: 1600, utilized: 1500, unutilized: 100, rate: 93.8 },
        ];
      } else if (scope === "department") {
        const dept = settings?.department || "Sewing Floor";
        reqHours = 6800;
        utilHours = 6550;
        unutilHours = 250;
        utilRate = 96.3;
        otOutputPcs = "121,000 Pcs";
        pcsPerHour = "18.5 Pcs/Hr";
        otTitle = `${dept} Line OT Utilization`;
        utilData = [
          { name: "Line-01", requisition: 1850, utilized: 1780, unutilized: 70, rate: 96.2 },
          { name: "Line-02", requisition: 1750, utilized: 1700, unutilized: 50, rate: 97.1 },
          { name: "Line-03", requisition: 1650, utilized: 1610, unutilized: 40, rate: 97.6 },
          { name: "Line-04", requisition: 1550, utilized: 1460, unutilized: 90, rate: 94.2 },
        ];
      }

      return (
        <div className="space-y-3">
          {/* Top KPI Summary Grid */}
          {(() => {
            const visibleCount = ["req_hours", "util_hours", "util_rate", "idle_hours"].filter((id) => isChipVisible(id)).length;
            return (
              <div className={getMetricGridClass(colSpan, Math.max(1, visibleCount))}>
                {/* Requisitioned Hours */}
                {isChipVisible("req_hours") && (
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Requisitioned</span>
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div className="mt-1">
                      <span className="text-base sm:text-lg font-black text-foreground">
                        {reqHours.toLocaleString()}
                        <span className="text-xs font-semibold text-muted-foreground ml-0.5">hrs</span>
                      </span>
                      <div className="text-[10px] text-muted-foreground truncate">Approved Floor Budget</div>
                    </div>
                  </div>
                )}

                {/* Utilized Hours */}
                {isChipVisible("util_hours") && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Floor Utilized</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div className="mt-1">
                      <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                        {utilHours.toLocaleString()}
                        <span className="text-xs font-semibold text-muted-foreground ml-0.5">hrs</span>
                      </span>
                      <div className="text-[10px] text-emerald-600/80 font-medium truncate">Productive Output Time</div>
                    </div>
                  </div>
                )}

                {/* Utilization Rate */}
                {isChipVisible("util_rate") && (
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Utilization Rate</span>
                      <Percent className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <div className="mt-1">
                      <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">
                        {utilRate}%
                      </span>
                      <div className="text-[10px] text-indigo-600/80 font-medium truncate">Target: ≥92.0%</div>
                    </div>
                  </div>
                )}

                {/* Idle / Saved Hours */}
                {isChipVisible("idle_hours") && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Idle / Unutilized</span>
                      <Timer className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="mt-1">
                      <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                        {unutilHours.toLocaleString()}
                        <span className="text-xs font-semibold text-muted-foreground ml-0.5">hrs</span>
                      </span>
                      <div className="text-[10px] text-amber-600/80 font-medium truncate">Prevented Leakage</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Scope Header & Production Rate Banner */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-muted/40 border border-border/50 text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
              <span className="font-semibold text-foreground truncate">{otTitle}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0 text-[11px]">
              <span className="text-muted-foreground hidden sm:inline">
                Output: <strong className="text-foreground">{otOutputPcs}</strong>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
                ⚡ {pcsPerHour}
              </span>
            </div>
          </div>

          {/* Chart or Compact Progress View */}
          {colSpan <= 3 ? (
            <div className="space-y-2 pt-1">
              {utilData.map((row) => (
                <div key={row.name} className="p-2 rounded-lg bg-muted/30 border border-border/40 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground">{row.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        row.rate >= 95
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : row.rate >= 90
                          ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {row.rate.toFixed(1)}% Rate
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Req: {row.requisition}h</span>
                    <span>Utilized: {row.utilized}h</span>
                    <span>Idle: {row.unutilized}h</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 rounded-l-full"
                      style={{ width: `${Math.min(100, row.rate)}%` }}
                    />
                    <div
                      className="h-full bg-amber-400"
                      style={{ width: `${Math.max(0, 100 - row.rate)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 9.5 }} />
                  <YAxis tick={{ fontSize: 9.5 }} />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      `${val} Hours`,
                      name === "requisition"
                        ? "OT Requisition (Approved Budget)"
                        : name === "utilized"
                        ? "Floor Utilized (Productive Output)"
                        : "Idle / Unutilized (Saved)",
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
                    height={26}
                    formatter={(val) => (
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {val === "requisition"
                          ? "Requisition (Approved)"
                          : val === "utilized"
                          ? "Floor Utilized"
                          : "Idle / Unutilized"}
                      </span>
                    )}
                  />
                  <Bar dataKey="requisition" fill="#3b82f6" radius={[3, 3, 0, 0]} name="requisition" />
                  <Bar dataKey="utilized" fill="#10b981" radius={[3, 3, 0, 0]} name="utilized" />
                  <Bar dataKey="unutilized" fill="#f59e0b" radius={[3, 3, 0, 0]} name="unutilized" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      );
    }

    case "hr_total_manpower_chart": {
      const fullDepts = [
        { dept: "Cutting", short: "CUT", count: 383, color: "#ef4444" },
        { dept: "R&D Pattern", short: "R&D", count: 1, color: "#64748b" },
        { dept: "Finishing", short: "FIN", count: 639, color: "#22c55e" },
        { dept: "Quality Control", short: "QC", count: 760, color: "#ea580c" },
        { dept: "Sample Room", short: "SMP", count: 17, color: "#ec4899" },
        { dept: "CAD & Marker", short: "CAD", count: 6, color: "#6366f1" },
        { dept: "Store & Fabric", short: "STR", count: 118, color: "#9f1239" },
        { dept: "IE & Planning", short: "IE", count: 61, color: "#0284c7" },
        { dept: "HR & Compliance", short: "HR", count: 43, color: "#2dd4bf" },
        { dept: "Maintenance", short: "MNT", count: 83, color: "#0f172a" },
        { dept: "Merchandising Supply Chain", short: "MSC", count: 12, color: "#e11d48" },
        { dept: "Accounts & Audit", short: "ACC", count: 55, color: "#f59e0b" },
        { dept: "IT & ERP", short: "IT", count: 5, color: "#94a3b8" },
        { dept: "Commercial", short: "COM", count: 47, color: "#c2410c" },
        { dept: "Admin & Security", short: "ADM", count: 73, color: "#f472b6" },
        { dept: "Wash & Dyeing", short: "WSH", count: 638, color: "#9333ea" },
        { dept: "Sewing Production", short: "SEW", count: 3287, color: "#9f1239" },
        { dept: "Procurement", short: "PRC", count: 12, color: "#3b82f6" },
        { dept: "Packing & Dispatch", short: "PCK", count: 197, color: "#5eead4" },
      ];

      let scopedDepts = fullDepts;
      let scopeCaption = "All Factory Departments (19 Units)";
      if (scope === "managed_depts") {
        scopedDepts = fullDepts.filter((d) => ["Cutting", "Finishing", "Sewing Production", "Quality Control"].includes(d.dept));
        scopeCaption = "Head of Assigned Departments";
      } else if (scope === "department") {
        const deptName = (settings?.department || "Sewing").split(" ")[0].toLowerCase();
        const match = fullDepts.filter((d) => d.dept.toLowerCase().includes(deptName));
        scopedDepts = match.length > 0 ? match : fullDepts.slice(0, 6);
        scopeCaption = `${settings?.department || "Department"} Focus`;
      }

      const totalMp = scopedDepts.reduce((sum, d) => sum + d.count, 0);

      return (
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-2.5 py-2 rounded-xl bg-muted/40 border border-border/50">
            <div>
              <div className="text-xs font-black text-foreground">
                Total Manpower : <span className="text-primary">{totalMp.toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-muted-foreground">{scopeCaption}</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 self-start sm:self-center">
              {scopedDepts.length} Departments
            </span>
          </div>

          {colSpan <= 3 ? (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {[...scopedDepts]
                .sort((a, b) => b.count - a.count)
                .slice(0, 8)
                .map((d) => (
                  <div key={d.dept} className="text-xs">
                    <div className="flex justify-between mb-0.5">
                      <span className="font-semibold text-foreground truncate">{d.dept}</span>
                      <span className="font-bold text-primary">{d.count.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(4, (d.count / Math.max(...scopedDepts.map((x) => x.count))) * 100)}%`,
                          backgroundColor: d.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scopedDepts} margin={{ top: 18, right: 8, left: -12, bottom: 2 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                  <XAxis dataKey="short" tick={{ fontSize: 9 }} interval={0} />
                  <YAxis tick={{ fontSize: 9.5 }} />
                  <Tooltip
                    formatter={(val: any) => [`${Number(val).toLocaleString()} Staff`, "Manpower"]}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.dept || ""}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#ef4444",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={26}>
                    <LabelList
                      dataKey="count"
                      position="top"
                      style={{ fontSize: "9.5px", fontWeight: 700, fill: "#2563eb" }}
                    />
                    {scopedDepts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      );
    }

    case "hr_ot_budget_comparison": {
      let budgetAmt = 85000;
      let actualOtAmt = 68400;
      let requestOtAmt = 74571;

      if (scope === "managed_depts") {
        budgetAmt = 52000;
        actualOtAmt = 44800;
        requestOtAmt = 48950;
      } else if (scope === "department") {
        budgetAmt = 34000;
        actualOtAmt = 29100;
        requestOtAmt = 31400;
      }

      const diffBudgetActual = budgetAmt - actualOtAmt;
      const diffBudgetRequest = budgetAmt - requestOtAmt;

      const budgetChartData = [
        { name: "Budget Amt", amount: budgetAmt, displayVal: budgetAmt, color: "#16a34a" },
        { name: "Actual OT Amt", amount: actualOtAmt, displayVal: actualOtAmt, color: "#f97316" },
        { name: "Request OT Amt", amount: requestOtAmt, displayVal: requestOtAmt, color: "#0284c7" },
        { name: "Diff(Budget-Actual)", amount: Math.abs(diffBudgetActual), displayVal: diffBudgetActual, color: "#dc2626" },
        { name: "Diff(Budget-Request)", amount: Math.abs(diffBudgetRequest), displayVal: diffBudgetRequest, color: "#ef4444" },
      ];

      return (
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-2.5 py-2 rounded-xl bg-muted/40 border border-border/50">
            <div>
              <div className="text-xs font-bold text-foreground">OT Budget Vs OT Actual Vs OT Request</div>
              <div className="text-[10px] text-muted-foreground">Data Upto: 25/11/2026 10:25:00</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-center">
              Under Budget: ৳{diffBudgetActual.toLocaleString()}
            </span>
          </div>

          {(() => {
            const budgetChips = [
              isChipVisible("budget_amt") && (
                <div key="budget_amt" className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">Budget Amt</div>
                  <div className="text-sm font-black text-foreground">৳{budgetAmt.toLocaleString()}</div>
                </div>
              ),
              isChipVisible("actual_ot") && (
                <div key="actual_ot" className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <div className="text-[10px] font-bold text-orange-600 uppercase">Actual OT</div>
                  <div className="text-sm font-black text-foreground">৳{actualOtAmt.toLocaleString()}</div>
                </div>
              ),
              isChipVisible("request_ot") && (
                <div key="request_ot" className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="text-[10px] font-bold text-blue-600 uppercase">Request OT</div>
                  <div className="text-sm font-black text-foreground">৳{requestOtAmt.toLocaleString()}</div>
                </div>
              ),
              isChipVisible("diff_actual") && (
                <div key="diff_actual" className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="text-[10px] font-bold text-rose-600 uppercase">Diff (Bud-Act)</div>
                  <div className="text-sm font-black text-foreground">৳{diffBudgetActual.toLocaleString()}</div>
                </div>
              ),
              isChipVisible("diff_request") && (
                <div key="diff_request" className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="text-[10px] font-bold text-red-600 uppercase">Diff (Bud-Req)</div>
                  <div className="text-sm font-black text-foreground">৳{diffBudgetRequest.toLocaleString()}</div>
                </div>
              ),
            ].filter(Boolean);
            return <div className={getMetricGridClass(colSpan, Math.max(1, budgetChips.length))}>{budgetChips}</div>;
          })()}

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetChartData} margin={{ top: 18, right: 10, left: -8, bottom: 2 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 8.5 }} interval={0} />
                <YAxis tick={{ fontSize: 9.5 }} />
                <Tooltip
                  formatter={(_, __, item) => [`৳${Number(item?.payload?.displayVal ?? 0).toLocaleString()}`, item?.payload?.name]}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#ef4444",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={42}>
                  <LabelList
                    dataKey="displayVal"
                    position="top"
                    formatter={(val: any) => Number(val).toLocaleString()}
                    style={{ fontSize: "10px", fontWeight: 700, fill: "currentColor" }}
                  />
                  {budgetChartData.map((entry, idx) => (
                    <Cell key={`budget-cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    case "hr_ot_request_vs_actual": {
      const areasCount = settings?.areas?.length || 1;
      const deptsList = settings?.departments || settings?.managedDepartments || (settings?.department ? [settings.department] : ["Sewing Floor", "Cutting Unit"]);
      const deptFactor = Math.min(1, Math.max(0.25, deptsList.length / 6));
      const areaFactor = Math.min(1, Math.max(0.3, areasCount / 3));

      let actualMp = 284;
      let reqMp = 310;
      let actualHr = 1920;
      let reqHr = 2069;
      let actualAmt = 147800;
      let reqAmt = 159298;

      if (scope === "area") {
        actualMp = Math.round(284 * areaFactor);
        reqMp = Math.round(310 * areaFactor);
        actualHr = Math.round(1920 * areaFactor);
        reqHr = Math.round(2069 * areaFactor);
        actualAmt = Math.round(147800 * areaFactor);
        reqAmt = Math.round(159298 * areaFactor);
      } else if (scope === "managed_depts" || scope === "department") {
        actualMp = Math.round(284 * deptFactor);
        reqMp = Math.round(310 * deptFactor);
        actualHr = Math.round(1920 * deptFactor);
        reqHr = Math.round(2069 * deptFactor);
        actualAmt = Math.round(147800 * deptFactor);
        reqAmt = Math.round(159298 * deptFactor);
      }

      const diffMp = actualMp - reqMp;
      const diffHr = actualHr - reqHr;
      const diffAmt = actualAmt - reqAmt;

      const reqActualData = [
        ...(isChipVisible("mp_summary")
          ? [
              { name: "Actual MP", value: actualMp, displayVal: actualMp, color: "#16a34a", unit: "MP" },
              { name: "Requested MP", value: reqMp, displayVal: reqMp, color: "#22c55e", unit: "MP" },
              { name: "Diff MP", value: Math.abs(diffMp), displayVal: diffMp, color: "#dc2626", unit: "MP" },
            ]
          : []),
        ...(isChipVisible("hr_summary")
          ? [
              { name: "Actual OT Hr", value: actualHr, displayVal: actualHr, color: "#ea580c", unit: "Hrs" },
              { name: "Requested OT Hr", value: reqHr, displayVal: reqHr, color: "#f97316", unit: "Hrs" },
              { name: "Diff OT Hr", value: Math.abs(diffHr), displayVal: diffHr, color: "#dc2626", unit: "Hrs" },
            ]
          : []),
        ...(isChipVisible("amt_summary")
          ? [
              { name: "Actual OT Amt", value: actualAmt, displayVal: actualAmt, color: "#0284c7", unit: "৳" },
              { name: "Requested OT Amt", value: reqAmt, displayVal: reqAmt, color: "#0ea5e9", unit: "৳" },
              { name: "Diff OT Amt", value: Math.abs(diffAmt), displayVal: diffAmt, color: "#dc2626", unit: "৳" },
            ]
          : []),
      ];

      const otReqActualCards = [
        isChipVisible("mp_summary") && (
          <div key="mp_summary" className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-[10px] font-bold text-emerald-600 uppercase">Manpower (MP)</div>
            <div className="text-xs font-black text-foreground mt-0.5">
              Actual: {actualMp} <span className="text-muted-foreground font-semibold">/ Req: {reqMp}</span>
            </div>
            <div className="text-[10px] font-bold text-rose-600">Diff MP: {diffMp}</div>
          </div>
        ),
        isChipVisible("hr_summary") && (
          <div key="hr_summary" className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <div className="text-[10px] font-bold text-orange-600 uppercase">OT Hours</div>
            <div className="text-xs font-black text-foreground mt-0.5">
              Actual: {actualHr.toLocaleString()} <span className="text-muted-foreground font-semibold">/ Req: {reqHr.toLocaleString()}</span>
            </div>
            <div className="text-[10px] font-bold text-rose-600">Diff Hr: {diffHr.toLocaleString()}</div>
          </div>
        ),
        isChipVisible("amt_summary") && (
          <div key="amt_summary" className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="text-[10px] font-bold text-blue-600 uppercase">OT Amount (৳)</div>
            <div className="text-xs font-black text-foreground mt-0.5">
              Actual: ৳{actualAmt.toLocaleString()} <span className="text-muted-foreground font-semibold">/ Req: ৳{reqAmt.toLocaleString()}</span>
            </div>
            <div className="text-[10px] font-bold text-rose-600">Diff Amt: ৳{diffAmt.toLocaleString()}</div>
          </div>
        ),
      ].filter(Boolean);

      return (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-2.5 py-2 rounded-xl bg-muted/40 border border-border/50">
            <div>
              <div className="text-xs font-bold text-foreground">OT Request Vs OT Actual (Manpower, Hours & Amount)</div>
              <div className="text-[10px] text-muted-foreground">Data Upto: 25/11/2026 10:25:00</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 self-start sm:self-center">
              Saved: ৳{Math.abs(diffAmt).toLocaleString()}
            </span>
          </div>

          <div className={getMetricGridClass(colSpan, Math.max(1, otReqActualCards.length))}>
            {otReqActualCards}
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reqActualData} margin={{ top: 18, right: 10, left: -5, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 8.5 }} interval={0} />
                <YAxis tick={{ fontSize: 9.5 }} />
                <Tooltip
                  formatter={(_, __, item) => {
                    const p = item?.payload;
                    return [`${Number(p?.displayVal ?? 0).toLocaleString()} ${p?.unit || ""}`, p?.name];
                  }}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  <LabelList
                    dataKey="displayVal"
                    position="top"
                    formatter={(val: any) => Number(val).toLocaleString()}
                    style={{ fontSize: "9.5px", fontWeight: 700, fill: "currentColor" }}
                  />
                  {reqActualData.map((entry, idx) => (
                    <Cell key={`req-act-cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    case "hr_attendance_pie": {
      const pieLayoutClass =
        colSpan <= 3 ? "flex flex-col items-center gap-2.5" : "flex flex-col sm:flex-row items-center gap-3";
      const pieChartClass = colSpan <= 3 ? "w-full h-36" : "w-full sm:w-1/2 h-44";
      const pieLegendClass = colSpan <= 3 ? "w-full space-y-1 text-xs" : "w-full sm:w-1/2 space-y-1.5 text-xs";

      const areasList = settings?.areas || ["Dhaka North / Gazipur"];
      const deptsList = settings?.departments || settings?.managedDepartments || (settings?.department ? [settings.department] : ["Sewing Floor", "Cutting Unit"]);

      let rawPie: Array<{ chipId: string; name: string; value: number; color: string; unit?: string }> = [];
      let pieSubTitle = "";

      if (scope === "personal") {
        rawPie = [
          { chipId: "present", name: "My Present Days", value: 21, color: "#10b981", unit: "Days" },
          { chipId: "absent", name: "Weekends / Off", value: 8, color: "#3b82f6", unit: "Days" },
          { chipId: "leave", name: "Approved Leave", value: 1, color: "#8b5cf6", unit: "Days" },
          { chipId: "late", name: "Late Entry", value: 1, color: "#f59e0b", unit: "Days" },
        ];
      } else if (scope === "area") {
        const factor = Math.min(1, Math.max(0.28, areasList.length / 3));
        pieSubTitle = areasList.length > 1 ? `${areasList.length} Areas` : areasList[0];
        rawPie = [
          { chipId: "present", name: "Present", value: Math.round(1196 * factor), color: "#10b981" },
          { chipId: "absent", name: "Absent", value: Math.round(42 * factor), color: "#f43f5e" },
          { chipId: "late", name: "Late Entry", value: Math.round(73 * factor), color: "#f59e0b" },
          { chipId: "leave", name: "Leave", value: Math.round(10 * factor), color: "#8b5cf6" },
        ];
      } else if (scope === "managed_depts" || scope === "department") {
        const factor = Math.min(1, Math.max(0.22, deptsList.length / 6));
        pieSubTitle = deptsList.length > 1 ? `${deptsList.length} Departments` : deptsList[0];
        rawPie = [
          { chipId: "present", name: "Present", value: Math.round(1196 * factor), color: "#10b981" },
          { chipId: "absent", name: "Absent", value: Math.round(42 * factor), color: "#f43f5e" },
          { chipId: "late", name: "Late Entry", value: Math.round(73 * factor), color: "#f59e0b" },
          { chipId: "leave", name: "Leave", value: Math.round(10 * factor), color: "#8b5cf6" },
        ];
      } else {
        rawPie = [
          { chipId: "present", name: "Present", value: 1196, color: "#10b981" },
          { chipId: "absent", name: "Absent", value: 42, color: "#f43f5e" },
          { chipId: "late", name: "Late Entry", value: 73, color: "#f59e0b" },
          { chipId: "leave", name: "Leave", value: 10, color: "#8b5cf6" },
        ];
      }

      const filteredPie = rawPie.filter((d) => isChipVisible(d.chipId));
      const pieData = filteredPie.length > 0 ? filteredPie : rawPie;

      return (
        <div className={pieLayoutClass}>
          <div className={pieChartClass}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={colSpan <= 3 ? 34 : 42}
                  outerRadius={colSpan <= 3 ? 54 : 65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${entry.chipId}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}`, name]}
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={pieLegendClass}>
            {pieSubTitle && (
              <div className="text-[10.5px] font-bold text-primary mb-1 truncate">{pieSubTitle}</div>
            )}
            {pieData.map((d) => (
              <div key={d.chipId} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/20">
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground font-medium text-[11px]">{d.name}</span>
                </div>
                <span className="font-mono font-bold text-foreground text-[11px]">
                  {d.value.toLocaleString()}{d.unit ? ` ${d.unit}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

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
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${item.status.includes("Pending")
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
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${item.status.includes("Pending")
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
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${item.status.includes("Pending")
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

      const mmChips = [
        isChipVisible("order_volume") && (
          <div key="order_volume" className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <span className="text-[10.5px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
              Total Order Volume
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-foreground">{orderVol}</span>
              <span className="text-[10px] text-muted-foreground">Pieces</span>
            </div>
            <div className="text-[10px] text-teal-600/80 font-medium mt-1 truncate">{note}</div>
          </div>
        ),
        isChipVisible("fob_value") && (
          <div key="fob_value" className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
            <span className="text-[10.5px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              Total FOB Value
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-foreground">{fobVal}</span>
            </div>
            <div className="text-[10px] text-sky-600/80 font-medium mt-1">Export FOB Value</div>
          </div>
        ),
        isChipVisible("on_time_perf") && (
          <div key="on_time_perf" className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
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
        ),
        isChipVisible("capacity_util") && (
          <div key="capacity_util" className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
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
        ),
      ].filter(Boolean);

      return <div className={getMetricGridClass(colSpan, mmChips.length)}>{mmChips}</div>;
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

    case "mm_tna_critical_path": {
      const milestones = [
        { id: "lab_dip", title: "Lab Dip Approval", status: "Completed", pct: 100, color: "bg-emerald-500" },
        { id: "yarn_inhouse", title: "Yarn In-House", status: "Completed", pct: 100, color: "bg-emerald-500" },
        { id: "pp_sample", title: "PP Sample Submission", status: "Approved", pct: 100, color: "bg-emerald-500" },
        { id: "bulk_knitting", title: "Bulk Fabric Knitting", status: "On-Track", pct: 85, color: "bg-blue-500" },
        { id: "sewing_input", title: "Sewing Floor Input", status: "Running", pct: 60, color: "bg-purple-500" },
        { id: "ex_factory", title: "Ex-Factory Shipment", status: "Pending", pct: 15, color: "bg-amber-500" },
      ].filter((m) => isChipVisible(m.id));
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
    }

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

      const invChips = [
        isChipVisible("total_stock") && (
          <div key="total_stock" className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider block">Stock Valuation</span>
            <span className="text-xl font-black font-mono text-foreground mt-1 block">{val}</span>
            <span className="text-[10px] text-muted-foreground truncate">{wh || "All Stores"}</span>
          </div>
        ),
        isChipVisible("in_transit") && (
          <div key="in_transit" className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider block">Active Stock Items</span>
            <span className="text-xl font-black font-mono text-foreground mt-1 block">{skus}</span>
            <span className="text-[10px] text-muted-foreground">Distinct SKUs</span>
          </div>
        ),
        isChipVisible("monthly_issue") && (
          <div key="monthly_issue" className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider block">Inventory Turnover</span>
            <span className="text-xl font-black font-mono text-foreground mt-1 block">{turnover}</span>
            <span className="text-[10px] text-muted-foreground">Days of supply</span>
          </div>
        ),
        isChipVisible("low_stock") && (
          <div key="low_stock" className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[10.5px] font-bold text-rose-600 uppercase tracking-wider block">Safety Alert</span>
            <span className="text-xl font-black font-mono text-rose-600 mt-1 block">{alertCount}</span>
            <span className="text-[10px] text-muted-foreground">Below threshold</span>
          </div>
        ),
      ].filter(Boolean);

      return <div className={getMetricGridClass(colSpan, invChips.length)}>{invChips}</div>;

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
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${t.status === "Delivered" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"
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
    case "acc_payroll_payout": {
      const areasList = settings?.areas || ["Dhaka North / Gazipur"];
      const deptsList = settings?.departments || settings?.managedDepartments || (settings?.department ? [settings.department] : ["Sewing Floor", "Cutting Unit"]);

      let payChips: Array<{ id: string; label: string; value: string; sub: string; cls: string; titleCls: string; valCls: string }> = [];

      if (scope === "personal") {
        payChips = [
          { id: "gross_payroll", label: "Gross Earnings", value: "৳42,000", sub: "Basic + Allowances", cls: "bg-emerald-500/10 border-emerald-500/20", titleCls: "text-emerald-600", valCls: "text-emerald-700 dark:text-emerald-300" },
          { id: "ot_payout", label: "OT Allowance", value: "৳4,120", sub: "16.5 hrs approved", cls: "bg-blue-500/10 border-blue-500/20", titleCls: "text-blue-600", valCls: "text-blue-700 dark:text-blue-300" },
          { id: "net_disbursed", label: "My Net Payable", value: "৳38,500", sub: "Bank Asia ***892", cls: "bg-purple-500/10 border-purple-500/20", titleCls: "text-purple-600", valCls: "text-foreground" },
          { id: "pending_bank", label: "Deductions", value: "৳3,500", sub: "Tax ৳2K • PF ৳1.5K", cls: "bg-rose-500/10 border-rose-500/20", titleCls: "text-rose-600", valCls: "text-rose-700 dark:text-rose-300" },
        ];
      } else if (scope === "area") {
        const factor = Math.min(1, Math.max(0.3, areasList.length / 3));
        payChips = [
          { id: "gross_payroll", label: "Area Wage Bill", value: `৳${(3.28 * factor).toFixed(2)} Cr`, sub: `${areasList.length} Area(s)`, cls: "bg-indigo-500/10 border-indigo-500/20", titleCls: "text-indigo-600", valCls: "text-foreground" },
          { id: "ot_payout", label: "OT Allowance", value: `৳${(38.4 * factor).toFixed(1)} Lac`, sub: "Overtime payout", cls: "bg-blue-500/10 border-blue-500/20", titleCls: "text-blue-600", valCls: "text-blue-700 dark:text-blue-300" },
          { id: "net_disbursed", label: "Bank Transfer", value: `৳${(2.89 * factor).toFixed(2)} Cr`, sub: "BEFTN / EFT", cls: "bg-emerald-500/10 border-emerald-500/20", titleCls: "text-emerald-600", valCls: "text-emerald-700 dark:text-emerald-300" },
          { id: "pending_bank", label: "Pending / Cash", value: `৳${(39.2 * factor).toFixed(1)} Lac`, sub: "Floor cash & MFS", cls: "bg-amber-500/10 border-amber-500/20", titleCls: "text-amber-600", valCls: "text-amber-700 dark:text-amber-300" },
        ];
      } else if (scope === "managed_depts" || scope === "department") {
        const factor = Math.min(1, Math.max(0.25, deptsList.length / 6));
        const label = deptsList.length > 1 ? `${deptsList.length} Depts` : deptsList[0];
        payChips = [
          { id: "gross_payroll", label: `${label} Wage Bill`, value: `৳${(3.28 * factor).toFixed(2)} Cr`, sub: "Selected Depts", cls: "bg-purple-500/10 border-purple-500/20", titleCls: "text-purple-600", valCls: "text-foreground" },
          { id: "ot_payout", label: "OT Allowance", value: `৳${(38.4 * factor).toFixed(1)} Lac`, sub: "Approved OT", cls: "bg-blue-500/10 border-blue-500/20", titleCls: "text-blue-600", valCls: "text-blue-700 dark:text-blue-300" },
          { id: "net_disbursed", label: "Bank Transfer", value: `৳${(2.89 * factor).toFixed(2)} Cr`, sub: "88% of wage bill", cls: "bg-emerald-500/10 border-emerald-500/20", titleCls: "text-emerald-600", valCls: "text-emerald-700 dark:text-emerald-300" },
          { id: "pending_bank", label: "Cash / MFS", value: `৳${(39.2 * factor).toFixed(1)} Lac`, sub: "Floor worker cash", cls: "bg-amber-500/10 border-amber-500/20", titleCls: "text-amber-600", valCls: "text-amber-700 dark:text-amber-300" },
        ];
      } else {
        payChips = [
          { id: "gross_payroll", label: "Net Payroll Payable", value: "৳3.28 Cr", sub: "For Month: Nov 2026", cls: "bg-purple-500/10 border-purple-500/20", titleCls: "text-purple-600", valCls: "text-foreground" },
          { id: "ot_payout", label: "OT Allowance", value: "৳38.4 Lac", sub: "Approved OT payout", cls: "bg-blue-500/10 border-blue-500/20", titleCls: "text-blue-600", valCls: "text-blue-700 dark:text-blue-300" },
          { id: "net_disbursed", label: "Bank Transfer (88%)", value: "৳2.89 Cr", sub: "BEFTN / EFT Routing", cls: "bg-emerald-500/10 border-emerald-500/20", titleCls: "text-emerald-600", valCls: "text-emerald-700 dark:text-emerald-300" },
          { id: "pending_bank", label: "Pending / Cash (12%)", value: "৳39.2 Lac", sub: "Floor worker cash", cls: "bg-amber-500/10 border-amber-500/20", titleCls: "text-amber-600", valCls: "text-amber-700 dark:text-amber-300" },
        ];
      }

      const visiblePayChips = payChips.filter((c) => isChipVisible(c.id));
      return (
        <div className={getMetricGridClass(colSpan, Math.max(1, visiblePayChips.length))}>
          {visiblePayChips.map((c) => (
            <div key={c.id} className={`p-3 rounded-xl border ${c.cls}`}>
              <span className={`text-[10.5px] font-bold uppercase tracking-wider block truncate ${c.titleCls}`}>
                {c.label}
              </span>
              <span className={`text-xl font-black font-mono mt-1 block ${c.valCls}`}>{c.value}</span>
              <span className="text-[10px] text-muted-foreground">{c.sub}</span>
            </div>
          ))}
        </div>
      );
    }

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
